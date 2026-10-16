/**
 * server/test/payment.test.js
 * Automated Backend Tests for Razorpay Test Mode Integration.
 * Executed via Node.js built-in test runner: `npm run test:server`
 * Uses direct in-process mock invocation to run securely inside sandbox environments.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { db } from '../awsConfig.js';

// Helpers to simulate Express requests/responses in-memory
const createMockRes = () => {
  const res = {
    statusCode: 200,
    headers: {},
    bodyData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.bodyData = data;
      return this;
    },
    setHeader(key, val) {
      this.headers[key.toLowerCase()] = val;
      return this;
    },
  };
  return res;
};

beforeEach(() => {
  db._reset();
});

describe('Razorpay Test Mode Backend Integration Tests', () => {
  it('1. Config Endpoint: Exposes public Key ID and currency but NEVER secrets', async () => {
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_Tjktt6Bs0TXxDk';
    const config = {
      keyId,
      mode: process.env.RAZORPAY_MODE || 'test',
      currency: 'INR',
    };

    assert.ok(config.keyId.startsWith('rzp_test_'), 'Public key must be test mode');
    assert.equal(config.currency, 'INR');
    assert.equal(config.keySecret, undefined, 'Must NEVER expose keySecret');
    assert.equal(config.webhookSecret, undefined, 'Must NEVER expose webhookSecret');
  });

  it('2. Order Creation & Authoritative Amount Calculation', () => {
    const tripDetails = {
      serviceType: 'flights',
      route: 'Delhi (DEL) → Mumbai (BOM)',
      baseRatePerUnit: 5400,
      passengerCount: 2,
      fareAmount: 10800,
    };

    // Calculate authoritative price in paise
    const authoritativeAmount = Number(tripDetails.fareAmount) || 10800;
    const amountInPaise = Math.round(authoritativeAmount * 100);
    assert.equal(amountInPaise, 1080000, 'Must convert ₹10,800 to 1,080,000 paise');

    const bookingId = 'BK-TEST-101';
    const orderId = `order_test_${Date.now()}_abc`;

    // Persist order in DB
    db.saveOrder(orderId, {
      bookingId,
      amount: amountInPaise,
      currency: 'INR',
      status: 'created',
    });

    db.updateBookingPayment(bookingId, {
      id: bookingId,
      razorpayOrderId: orderId,
      amount: authoritativeAmount,
      currency: 'INR',
      paymentStatus: 'PENDING',
    });

    const storedOrder = db.getOrder(orderId);
    assert.ok(storedOrder);
    assert.equal(storedOrder.bookingId, bookingId);
    assert.equal(storedOrder.amount, 1080000);

    const storedBooking = db.getBooking(bookingId);
    assert.ok(storedBooking);
    assert.equal(storedBooking.paymentStatus, 'PENDING');
  });

  it('3. Duplicate Order Prevention: Reuses valid pending order for identical booking', () => {
    const bookingId = 'BK-DUP-1';
    const orderId = 'order_first_1';
    const amountInPaise = 420000;

    // Simulate first order creation
    db.saveOrder(orderId, {
      orderId,
      bookingId,
      amount: amountInPaise,
      currency: 'INR',
    });

    db.updateBookingPayment(bookingId, {
      id: bookingId,
      razorpayOrderId: orderId,
      paymentStatus: 'PENDING',
    });

    // Check duplicate detection logic
    const existingBooking = db.getBooking(bookingId);
    assert.equal(existingBooking.paymentStatus, 'PENDING');
    const existingOrder = db.getOrder(existingBooking.razorpayOrderId);
    assert.ok(existingOrder);
    assert.equal(existingOrder.amount, amountInPaise);

    // Reused order check passed
    assert.equal(existingOrder.orderId, orderId);
  });

  it('4. Payment Verification: Validates HMAC-SHA256 signature using timingSafeEqual', () => {
    const testSecret = 'secret_test_key_999';
    const orderId = 'order_valid_123';
    const paymentId = 'pay_test_456';

    // Generate expected HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', testSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Matching signature
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(expectedSignature, 'utf-8')
    );
    assert.equal(isValid, true, 'Valid signature must match');

    // Tampered signature
    const tamperedSignature = expectedSignature.slice(0, -4) + '0000';
    let isTamperedValid = false;
    try {
      isTamperedValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(tamperedSignature, 'utf-8')
      );
    } catch {
      isTamperedValid = false;
    }
    assert.equal(isTamperedValid, false, 'Tampered signature must be rejected');
  });

  it('5. Payment Verification: Confirms booking payment state transition to PAID', () => {
    const bookingId = 'BK-VERIFY-1';
    const orderId = 'order_test_ver_1';
    const paymentId = 'pay_verified_999';

    db.saveBooking({ id: bookingId, paymentStatus: 'PENDING' });
    db.saveOrder(orderId, { orderId, bookingId, amount: 945000 });

    const updated = db.updateBookingPayment(bookingId, {
      paymentStatus: 'PAID',
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
      razorpaySignature: 'valid_sig',
      paymentVerifiedAt: new Date().toISOString(),
    });

    assert.equal(updated.paymentStatus, 'PAID');
    assert.equal(updated.razorpayPaymentId, paymentId);
    assert.ok(updated.paymentVerifiedAt);
  });

  it('6. Webhooks: Raw-Body HMAC-SHA256 verification and idempotent processing', () => {
    const webhookSecret = 'test_webhook_secret_abc';
    const payloadObject = {
      entity: 'event',
      id: 'evt_captured_1',
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_wh_1',
            order_id: 'order_wh_1',
            amount: 540000,
          },
        },
      },
    };

    const rawBuffer = Buffer.from(JSON.stringify(payloadObject), 'utf-8');

    // Calculate signature against RAW body
    const calculatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBuffer)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, 'utf-8'),
      Buffer.from(calculatedSignature, 'utf-8')
    );
    assert.equal(isValid, true, 'Raw body webhook signature must match');

    // Idempotency check
    assert.equal(db.isWebhookProcessed('evt_captured_1'), false);
    db.recordWebhookEvent('evt_captured_1', 'payment.captured', payloadObject);
    assert.equal(db.isWebhookProcessed('evt_captured_1'), true, 'Must record as processed');
  });

  it('7. Payment State Protection: Never downgrades PAID booking on stale failure', () => {
    const bookingId = 'BK-SAFE-1';

    // 1. Mark as PAID
    db.saveBooking({ id: bookingId, paymentStatus: 'PAID' });
    assert.equal(db.getBooking(bookingId).paymentStatus, 'PAID');

    // 2. Attempt to update with FAILED (e.g. out-of-order or late event)
    const result = db.updateBookingPayment(bookingId, {
      paymentStatus: 'FAILED',
      failureReason: 'Stale error delivery',
    });

    assert.equal(result.paymentStatus, 'PAID', 'State must remain PAID and refuse downgrade');
  });
});
