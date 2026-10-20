/**
 * server/test/refund.test.js
 * Automated Backend Tests for Refund Backend & Persistence Layer (Person 3).
 * Executed via Node.js built-in test runner: `npm run test:server`
 */

import { describe, it, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataFile = path.join(__dirname, '../data/store.refund-test.json');
process.env.DATA_STORE_PATH = testDataFile;

import { db } from '../awsConfig.js';
import {
  submitRefund,
  getRefundById,
  processReviewerDecision,
  listRefunds,
  saveDraftNote,
  REFUND_STATUSES,
} from '../refundService.js';
import refundRouter from '../refundRoutes.js';

beforeEach(() => {
  db._reset();
});

after(() => {
  try {
    if (fs.existsSync(testDataFile)) {
      fs.unlinkSync(testDataFile);
    }
    const tmp = `${testDataFile}.tmp`;
    if (fs.existsSync(tmp)) {
      fs.unlinkSync(tmp);
    }
  } catch {}
});

describe('Refund Backend & Persistence Tests (Person 3)', () => {
  it('1. Input Validation: Rejects missing bookingId or reason', () => {
    const noBooking = submitRefund({ reason: 'Flight cancelled' });
    assert.equal(noBooking.success, false);
    assert.equal(noBooking.statusCode, 400);
    assert.match(noBooking.error, /bookingId is required/);

    const noReason = submitRefund({ bookingId: 'BK-101' });
    assert.equal(noReason.success, false);
    assert.equal(noReason.statusCode, 400);
    assert.match(noReason.error, /reason is required/);
  });

  it('2. Booking Existence: Rejects non-existent booking ID', () => {
    const res = submitRefund({
      bookingId: 'BK-NONEXISTENT',
      reason: 'Flight delayed over 4 hours',
    });
    assert.equal(res.success, false);
    assert.equal(res.statusCode, 404);
    assert.match(res.error, /not found/i);
  });

  it('3. Payment Eligibility: Rejects bookings that are not in PAID status', () => {
    // 1. Pending payment booking
    db.saveBooking({
      id: 'BK-PENDING-1',
      amount: 4500,
      paymentStatus: 'PENDING',
    });

    const pendingRes = submitRefund({
      bookingId: 'BK-PENDING-1',
      reason: 'Flight cancelled by carrier',
    });
    assert.equal(pendingRes.success, false);
    assert.equal(pendingRes.statusCode, 400);
    assert.match(pendingRes.error, /must be PAID/);

    // 2. Failed payment booking
    db.saveBooking({
      id: 'BK-FAILED-1',
      amount: 3200,
      paymentStatus: 'FAILED',
    });

    const failedRes = submitRefund({
      bookingId: 'BK-FAILED-1',
      reason: 'Trip cancelled',
    });
    assert.equal(failedRes.success, false);
    assert.equal(failedRes.statusCode, 400);
    assert.match(failedRes.error, /must be PAID/);
  });

  it('4. Amount Validation: Validates claim amounts against eligible paid amounts', () => {
    const bookingId = 'BK-AMT-1';
    db.saveBooking({
      id: bookingId,
      amount: 5000,
      paymentStatus: 'PAID',
      razorpayPaymentId: 'pay_amt_test_1',
    });

    // Zero or negative claim amount
    const zeroRes = submitRefund({
      bookingId,
      reason: 'Cancellation',
      claimAmount: 0,
    });
    assert.equal(zeroRes.success, false);
    assert.equal(zeroRes.statusCode, 400);
    assert.match(zeroRes.error, /greater than 0/);

    // Excessive claim amount exceeding paid amount (₹6000 > ₹5000)
    const excessRes = submitRefund({
      bookingId,
      reason: 'Cancellation',
      claimAmount: 6000,
    });
    assert.equal(excessRes.success, false);
    assert.equal(excessRes.statusCode, 400);
    assert.match(excessRes.error, /cannot exceed/);

    // Valid partial claim amount (₹3000 <= ₹5000)
    const partialRes = submitRefund({
      bookingId,
      reason: 'Cancellation of return leg only',
      claimAmount: 3000,
    });
    assert.equal(partialRes.success, true);
    assert.equal(partialRes.statusCode, 201);
    assert.equal(partialRes.refund.claimAmount, 3000);
    assert.equal(partialRes.refund.eligiblePaidAmount, 5000);
  });

  it('5. Duplicate Prevention: Prevents multiple active refund requests for the same booking', () => {
    const bookingId = 'BK-DUP-CHECK-1';
    db.saveBooking({
      id: bookingId,
      amount: 4200,
      paymentStatus: 'PAID',
      razorpayPaymentId: 'pay_dup_1',
    });

    // 1st submission succeeds
    const firstRes = submitRefund({
      bookingId,
      reason: 'Train cancelled by Indian Railways',
    });
    assert.equal(firstRes.success, true);
    assert.equal(firstRes.statusCode, 201);
    assert.ok(firstRes.refund.id);

    // 2nd submission for same booking must be rejected with 409 Conflict
    const secondRes = submitRefund({
      bookingId,
      reason: 'Duplicate claim attempt',
    });
    assert.equal(secondRes.success, false);
    assert.equal(secondRes.statusCode, 409);
    assert.match(secondRes.error, /already exists/i);
    assert.equal(secondRes.refund.id, firstRes.refund.id);
  });

  it('6. Persistence & Reconciliation: Persists case in store and links to booking', () => {
    const bookingId = 'BK-PERSIST-1';
    db.saveBooking({
      id: bookingId,
      amount: 7800,
      currency: 'INR',
      paymentStatus: 'PAID',
      razorpayPaymentId: 'pay_persist_99',
      razorpayOrderId: 'order_persist_99',
      paymentVerifiedAt: '2026-10-18T10:00:00.000Z',
      bookingDetails: {
        operator: 'Vistara',
        code: 'UK-812',
        serviceType: 'flights',
        route: 'Delhi → Bengaluru',
        passengers: 'Ananya Verma',
      },
    });

    const submitRes = submitRefund({
      bookingId,
      reason: 'Flight delayed > 5 hours without accommodation',
      evidence: ['flight_delay_sms.png'],
    });

    assert.equal(submitRes.success, true);
    const refundId = submitRes.refund.id;

    // Verify stored in DB
    const retrieved = db.getRefund(refundId);
    assert.ok(retrieved);
    assert.equal(retrieved.id, refundId);
    assert.equal(retrieved.bookingId, bookingId);
    assert.equal(retrieved.claimAmount, 7800);
    assert.equal(retrieved.carrier.name, 'Vistara');
    assert.equal(retrieved.evidence[0], 'flight_delay_sms.png');

    // Verify booking is reconciled with refund case ID and status
    const updatedBooking = db.getBooking(bookingId);
    assert.equal(updatedBooking.refundCaseId, refundId);
    assert.equal(updatedBooking.refundStatus, 'Under Investigation');
  });

  it('7. GET /api/refunds/:id: Retrieves refund by ID, caseRef, or booking ID', () => {
    const bookingId = 'BK-LOOKUP-1';
    db.saveBooking({ id: bookingId, amount: 2500, paymentStatus: 'PAID' });
    const created = submitRefund({ bookingId, reason: 'Carrier cancelled' }).refund;

    // By ID
    const byId = getRefundById(created.id);
    assert.equal(byId.success, true);
    assert.equal(byId.refund.id, created.id);

    // By caseRef (with #)
    const byRef = getRefundById(created.caseRef);
    assert.equal(byRef.success, true);
    assert.equal(byRef.refund.id, created.id);

    // By booking ID
    const byBooking = getRefundById(bookingId);
    assert.equal(byBooking.success, true);
    assert.equal(byBooking.refund.id, created.id);

    // Non-existent ID returns 404
    const notFound = getRefundById('RF-UNKNOWN');
    assert.equal(notFound.success, false);
    assert.equal(notFound.statusCode, 404);
  });

  it('8. Reviewer Decision: Coordinates with Person 4 (Approve / Reject / Docs / Escalate)', () => {
    const bookingId = 'BK-DECISION-1';
    db.saveBooking({ id: bookingId, amount: 6200, paymentStatus: 'PAID' });
    const refund = submitRefund({ bookingId, reason: 'Medical emergency' }).refund;

    // Missing comment / note rejected
    const noNote = processReviewerDecision(refund.id, { decision: 'APPROVE' });
    assert.equal(noNote.success, false);
    assert.equal(noNote.statusCode, 400);

    // Request additional info / carrier evidence
    const docsRes = processReviewerDecision(refund.id, {
      decision: 'more_docs',
      note: 'Need hospital admission certificate copy',
      reviewerId: 'Lead Auditor Julian',
    });
    assert.equal(docsRes.success, true);
    assert.equal(docsRes.refund.decisionStatus, REFUND_STATUSES.AWAITING_CARRIER_EVIDENCE);
    assert.equal(docsRes.refund.reviewerComment, 'Need hospital admission certificate copy');

    // Escalate to senior desk
    const escRes = processReviewerDecision(refund.id, {
      decision: 'ESCALATE',
      note: 'Complex policy question, escalating',
      reviewerId: 'Auditor Maya',
    });
    assert.equal(escRes.success, true);
    assert.equal(escRes.refund.decisionStatus, REFUND_STATUSES.UNDER_HUMAN_REVIEW);

    // Approve refund
    const approveRes = processReviewerDecision(refund.id, {
      decision: 'eligible',
      note: 'Medical certificate verified and approved under exceptional policy waiver',
      reviewerId: 'Senior Auditor Julian Hayes',
    });
    assert.equal(approveRes.success, true);
    assert.equal(approveRes.refund.decisionStatus, REFUND_STATUSES.APPROVED);
    assert.equal(approveRes.refund.approvedAmount, 6200);

    // Check booking updated
    const booking = db.getBooking(bookingId);
    assert.equal(booking.refundStatus, 'Full Refund Eligible');
  });

  it('9. Invalid Status Transitions: Rejects altering finalized or approved refunds', () => {
    const bookingId = 'BK-FINAL-1';
    db.saveBooking({ id: bookingId, amount: 3500, paymentStatus: 'PAID' });
    const refund = submitRefund({ bookingId, reason: 'Flight cancelled' }).refund;

    // Approve the refund
    const appRes = processReviewerDecision(refund.id, {
      decision: 'APPROVE',
      note: 'Approved',
    });
    assert.equal(appRes.success, true);

    // Attempting to re-approve or reject an already approved refund must be rejected
    const alterRes = processReviewerDecision(refund.id, {
      decision: 'REJECT',
      note: 'Attempting to reject after approval',
    });
    assert.equal(alterRes.success, false);
    assert.equal(alterRes.statusCode, 400);
    assert.match(alterRes.error, /Cannot alter decision/);
  });

  it('10. Express Router End-to-End: Verifies HTTP routing via test server instance', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/refunds', refundRouter);

    db.saveBooking({ id: 'BK-HTTP-1', amount: 5500, paymentStatus: 'PAID' });

    // Start ephemeral server
    const server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}/api/refunds`;

    try {
      // 1. Submit POST /api/refunds/submit
      const submitFetch = await fetch(`${baseUrl}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: 'BK-HTTP-1',
          reason: 'Severe weather cancellation',
        }),
      });
      const submitJson = await submitFetch.json();
      assert.equal(submitFetch.status, 201);
      assert.equal(submitJson.success, true);
      const refundId = submitJson.refund.id;

      // 2. Query GET /api/refunds/:id
      const getFetch = await fetch(`${baseUrl}/${refundId}`);
      const getJson = await getFetch.json();
      assert.equal(getFetch.status, 200);
      assert.equal(getJson.refund.id, refundId);

      // 3. Reviewer Decision POST /api/refunds/:id/decision
      const decFetch = await fetch(`${baseUrl}/${refundId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: 'APPROVE',
          note: 'Weather alert cross-referenced with METAR logs',
          reviewerId: 'Auditor Julian',
        }),
      });
      const decJson = await decFetch.json();
      assert.equal(decFetch.status, 200);
      assert.equal(decJson.refund.decisionStatus, 'Approved');

      // 4. List GET /api/refunds
      const listFetch = await fetch(baseUrl);
      const listJson = await listFetch.json();
      assert.equal(listFetch.status, 200);
      assert.equal(listJson.count, 1);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('11. Regression Test: Booking BK-148123 data consistency (IndiGo, ₹5,120, non-fabricated traveler, no AT-9842 fallback)', async () => {
    // Seed verified paid booking BK-148123 exactly as stored in store.json
    db.saveBooking({
      id: 'BK-148123',
      amount: 5120,
      currency: 'INR',
      paymentStatus: 'PAID',
      razorpayOrderId: 'order_Tog5jR7Qp2CgP4',
      razorpayPaymentId: 'pay_TogBAypoJSOi1K',
      paymentVerifiedAt: '2026-10-16T18:31:24.095Z',
      bookingDetails: {
        id: '6E-2134',
        code: '6E-2134',
        operator: 'IndiGo',
        serviceType: 'flights',
        title: 'IndiGo · 6E-2134',
        route: 'Delhi (DEL) → Mumbai (BOM)',
        origin: 'Delhi (DEL)',
        destination: 'Mumbai (BOM)',
        departDate: '2026-12-21',
        fareAmount: 5120,
        passengers: '1 Traveller · Economy',
        refundable: true,
      },
    });

    // 1. Submit claim for BK-148123
    const submitResult = submitRefund({
      bookingId: 'BK-148123',
      reason: 'Cancelled by airline / operator (Flight 6E-2134)',
      contact: 'aarav.sharma@example.com',
      currency: 'INR',
    });

    assert.equal(submitResult.success, true);
    assert.equal(submitResult.statusCode, 201);
    const refund = submitResult.refund;

    // Verify booking reference / PNR
    assert.equal(refund.pnr, 'BK-148123');
    assert.notEqual(refund.pnr, '482910');

    // Verify Carrier is IndiGo 6E-2134, NOT Air India AI-805
    assert.equal(refund.carrier.name, 'IndiGo');
    assert.equal(refund.carrier.code, '6E-2134');
    assert.notEqual(refund.carrier.name, 'Air India');
    assert.notEqual(refund.carrier.code, 'AI-805');

    // Verify Authoritative Amount is ₹5,120, NOT ₹9,450
    assert.equal(refund.claimAmount, 5120);
    assert.equal(refund.eligiblePaidAmount, 5120);
    assert.equal(refund.claimAmountFormatted, '₹5,120');
    assert.notEqual(refund.claimAmount, 9450);

    // Verify Traveler is not fabricated mock persona 'Rahul Sharma'
    assert.notEqual(refund.traveler.name, 'Rahul Sharma');
    assert.equal(refund.traveler.name, 'Aarav Sharma');

    // Verify Case ID is not the mock ID AT-9842
    assert.notEqual(refund.id, 'AT-9842');
    assert.match(refund.id, /^RF-/);

    // 2. Query by booking ID directly via getRefundById
    const getResult = getRefundById('BK-148123');
    assert.equal(getResult.success, true);
    assert.equal(getResult.statusCode, 200);
    assert.equal(getResult.refund.id, refund.id);
    assert.equal(getResult.refund.carrier.name, 'IndiGo');
    assert.equal(getResult.refund.claimAmount, 5120);

    // 3. Test HTTP routing for GET /api/refunds/BK-148123
    const app = express();
    app.use(express.json());
    app.use('/api/refunds', refundRouter);

    const server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const port = server.address().port;
    try {
      const httpRes = await fetch(`http://127.0.0.1:${port}/api/refunds/BK-148123`);
      const httpJson = await httpRes.json();
      assert.equal(httpRes.status, 200);
      assert.equal(httpJson.success, true);
      assert.equal(httpJson.refund.bookingId, 'BK-148123');
      assert.equal(httpJson.refund.carrier.name, 'IndiGo');
      assert.equal(httpJson.refund.claimAmount, 5120);
      assert.notEqual(httpJson.refund.carrier.name, 'Air India');
      assert.notEqual(httpJson.refund.claimAmount, 9450);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('12. Draft Persistence: saveDraftNote persists note to store.json and survives reload', async () => {
    // Setup a PAID booking and submit a refund
    db.saveBooking({
      id: 'BK-DRAFT-TEST',
      amount: 3800,
      currency: 'INR',
      paymentStatus: 'PAID',
      bookingDetails: {
        operator: 'SpiceJet',
        code: 'SG-101',
        serviceType: 'flights',
        route: 'Chennai (MAA) → Delhi (DEL)',
        departDate: '2026-11-15',
        fareAmount: 3800,
        travelClass: 'Economy',
        passengers: '1 Traveller · Economy',
        refundable: true,
      },
    });

    const submitResult = submitRefund({
      bookingId: 'BK-DRAFT-TEST',
      reason: 'Carrier cancelled flight SG-101',
    });
    assert.equal(submitResult.success, true);
    const refundId = submitResult.refund.id;

    // 1. Save a draft note
    const draftNote = 'Awaiting additional carrier ops log from SpiceJet GDS system.';
    const draftResult = saveDraftNote(refundId, {
      reviewerNote: draftNote,
      draftDecision: 'more_docs',
      reviewerId: 'Julian Hayes (Lead Auditor)',
    });

    // Verify draft was accepted
    assert.equal(draftResult.success, true);
    assert.equal(draftResult.statusCode, 200);
    assert.match(draftResult.message, /Draft note saved/);

    // 2. Verify the draft note is persisted in the returned refund
    assert.equal(draftResult.refund.reviewerDraftNote, draftNote);
    assert.equal(draftResult.refund.reviewerDraftDecision, 'more_docs');
    assert.ok(draftResult.refund.reviewerDraftSavedAt);

    // 3. Verify the decision status is NOT changed by a draft save
    assert.equal(draftResult.refund.decisionStatus, REFUND_STATUSES.UNDER_HUMAN_REVIEW);

    // 4. Verify an audit log entry was created
    assert.ok(draftResult.refund.auditLog.length > 0);
    const draftLogEntry = draftResult.refund.auditLog[0];
    assert.equal(draftLogEntry.title, 'Reviewer Draft Note Saved');
    assert.match(draftLogEntry.description, /Draft saved by Julian Hayes/);
    assert.match(draftLogEntry.description, /more_docs/);

    // 5. Simulate reload: re-fetch from db directly (simulates server restart / page refresh)
    const reloaded = getRefundById(refundId);
    assert.equal(reloaded.success, true);
    assert.equal(reloaded.refund.reviewerDraftNote, draftNote);
    assert.equal(reloaded.refund.reviewerDraftDecision, 'more_docs');
    assert.equal(reloaded.refund.decisionStatus, REFUND_STATUSES.UNDER_HUMAN_REVIEW);

    // 6. Verify HTTP endpoint also returns draft note
    const app = express();
    app.use(express.json());
    app.use('/api/refunds', refundRouter);
    const server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const port = server.address().port;
    try {
      // GET by refund ID
      const getRes = await fetch(`http://127.0.0.1:${port}/api/refunds/${refundId}`);
      const getJson = await getRes.json();
      assert.equal(getRes.status, 200);
      assert.equal(getJson.refund.reviewerDraftNote, draftNote);

      // POST /draft endpoint
      const updatedNote = 'Confirmed carrier cancellation. Ready for review.';
      const postDraftRes = await fetch(`http://127.0.0.1:${port}/api/refunds/${refundId}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerNote: updatedNote, draftDecision: 'eligible' }),
      });
      const postDraftJson = await postDraftRes.json();
      assert.equal(postDraftRes.status, 200);
      assert.equal(postDraftJson.success, true);
      assert.equal(postDraftJson.refund.reviewerDraftNote, updatedNote);
      assert.equal(postDraftJson.refund.reviewerDraftDecision, 'eligible');
      // Decision status unchanged
      assert.equal(postDraftJson.refund.decisionStatus, REFUND_STATUSES.UNDER_HUMAN_REVIEW);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }

    // 7. Verify draft rejects empty note
    const emptyDraft = saveDraftNote(refundId, { reviewerNote: '   ' });
    assert.equal(emptyDraft.success, false);
    assert.equal(emptyDraft.statusCode, 400);
    assert.match(emptyDraft.error, /reviewerNote is required/);

    // 8. Verify draft rejects finalized (approved) case
    const approveResult = processReviewerDecision(refundId, {
      decision: 'APPROVE',
      reviewerComment: 'Final approval after carrier evidence confirmed.',
    });
    assert.equal(approveResult.success, true);

    const finalDraft = saveDraftNote(refundId, { reviewerNote: 'Late draft attempt.' });
    assert.equal(finalDraft.success, false);
    assert.equal(finalDraft.statusCode, 400);
    assert.match(finalDraft.error, /finalized status/);
  });
});
