/**
 * server/awsConfig.js
 * Database & Persistence Layer for Agent Travel.
 * Provides resilient persistence for Bookings, Razorpay Orders, Payments, and Webhook Audit Logs.
 * Supports persistent local storage with optional AWS DynamoDB connectivity.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const getDataFile = () => process.env.DATA_STORE_PATH || DATA_FILE;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory state cache
let store = {
  bookings: {},
  orders: {},
  payments: {},
  processedWebhooks: {},
  refunds: {},
};

// Load existing data if available
const loadStore = () => {
  try {
    const file = getDataFile();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(content);
      store = {
        bookings: parsed.bookings || {},
        orders: parsed.orders || {},
        payments: parsed.payments || {},
        processedWebhooks: parsed.processedWebhooks || {},
        refunds: parsed.refunds || {},
      };
    }
  } catch (err) {
    console.warn('[DB] Could not load persisted data file, starting with fresh in-memory store:', err.message);
  }
};

const persistStore = () => {
  try {
    const file = getDataFile();
    const tmpFile = `${file}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf-8');
    try {
      fs.renameSync(tmpFile, file);
    } catch {
      // Resilient fallback on Windows if destination file is locked by OneDrive sync
      fs.copyFileSync(tmpFile, file);
      try {
        fs.unlinkSync(tmpFile);
      } catch {}
    }
  } catch (err) {
    console.error('[DB] Failed to persist data to disk:', err.message);
  }
};

loadStore();

export const db = {
  // --- Bookings ---
  saveBooking(booking) {
    if (!booking || !booking.id) throw new Error('Booking must have an id');
    const existing = store.bookings[booking.id] || {};
    store.bookings[booking.id] = {
      ...existing,
      ...booking,
      updatedAt: new Date().toISOString(),
    };
    persistStore();
    return store.bookings[booking.id];
  },

  getBooking(bookingId) {
    if (!bookingId) return null;
    if (store.bookings[bookingId]) return store.bookings[bookingId];
    const clean = bookingId.toString().trim().toLowerCase();
    for (const b of Object.values(store.bookings)) {
      if (
        b.id.toLowerCase() === clean ||
        (b.bookingDetails?.code && b.bookingDetails.code.toLowerCase() === clean) ||
        (b.bookingDetails?.id && b.bookingDetails.id.toLowerCase() === clean)
      ) {
        return b;
      }
    }
    return null;
  },

  listBookings() {
    return Object.values(store.bookings);
  },

  updateBookingPayment(bookingId, paymentData) {
    const booking = store.bookings[bookingId];
    if (!booking) {
      // Create minimal placeholder booking record if not existing
      store.bookings[bookingId] = {
        id: bookingId,
        createdAt: new Date().toISOString(),
      };
    }

    const currentStatus = store.bookings[bookingId].paymentStatus;
    // Idempotency rule: Never downgrade a captured 'PAID' status to 'FAILED' or 'PENDING'
    if (currentStatus === 'PAID' && paymentData.paymentStatus && paymentData.paymentStatus !== 'PAID') {
      console.warn(`[DB] Refusing to downgrade booking ${bookingId} from PAID to ${paymentData.paymentStatus}`);
      return store.bookings[bookingId];
    }

    store.bookings[bookingId] = {
      ...store.bookings[bookingId],
      ...paymentData,
      updatedAt: new Date().toISOString(),
    };
    persistStore();
    return store.bookings[bookingId];
  },

  // --- Orders Mapping ---
  saveOrder(orderId, orderData) {
    store.orders[orderId] = {
      ...orderData,
      orderId,
      createdAt: new Date().toISOString(),
    };
    persistStore();
    return store.orders[orderId];
  },

  getOrder(orderId) {
    return store.orders[orderId] || null;
  },

  // --- Webhooks & Audit ---
  isWebhookProcessed(eventId) {
    return Boolean(store.processedWebhooks[eventId]);
  },

  recordWebhookEvent(eventId, eventName, payload) {
    store.processedWebhooks[eventId] = {
      eventId,
      eventName,
      receivedAt: new Date().toISOString(),
      payloadSummary: {
        entity: payload?.entity,
        orderId: payload?.payload?.payment?.entity?.order_id || payload?.payload?.order?.entity?.id,
        paymentId: payload?.payload?.payment?.entity?.id,
        amount: payload?.payload?.payment?.entity?.amount,
      },
    };
    persistStore();
    return store.processedWebhooks[eventId];
  },

  // --- Refunds ---
  saveRefund(refund) {
    if (!refund || !refund.id) throw new Error('Refund must have an id');
    const existing = store.refunds[refund.id] || {};
    store.refunds[refund.id] = {
      ...existing,
      ...refund,
      updatedAt: new Date().toISOString(),
    };
    persistStore();
    return store.refunds[refund.id];
  },

  getRefund(refundId) {
    if (!refundId) return null;
    if (store.refunds[refundId]) return store.refunds[refundId];
    // Support lookup by caseRef or case-insensitive ID/bookingId/pnr
    const clean = refundId.toString().replace(/^#/, '').trim().toLowerCase();
    for (const r of Object.values(store.refunds)) {
      if (
        r.id.toLowerCase() === clean ||
        (r.caseRef && r.caseRef.replace(/^#/, '').toLowerCase() === clean) ||
        (r.bookingId && r.bookingId.toLowerCase() === clean) ||
        (r.pnr && r.pnr.toLowerCase() === clean)
      ) {
        return r;
      }
    }
    return null;
  },

  getRefundByBookingId(bookingId) {
    if (!bookingId) return null;
    const clean = bookingId.toString().trim().toLowerCase();
    for (const r of Object.values(store.refunds)) {
      if (
        (r.bookingId && r.bookingId.toLowerCase() === clean) ||
        (r.pnr && r.pnr.toLowerCase() === clean) ||
        (r.id && r.id.toLowerCase() === clean)
      ) {
        return r;
      }
    }
    // Also check if a booking exists with this ID and has an associated refundCaseId
    const booking = this.getBooking(bookingId);
    if (booking && booking.refundCaseId) {
      const linked = this.getRefund(booking.refundCaseId);
      if (linked) return linked;
    }
    return null;
  },

  listRefunds(filter = {}) {
    let list = Object.values(store.refunds);
    if (filter.status) {
      list = list.filter((r) => r.status === filter.status || r.decisionStatus === filter.status);
    }
    if (filter.bookingId) {
      list = list.filter((r) => r.bookingId === filter.bookingId);
    }
    return list;
  },

  updateRefund(refundId, updateData) {
    const refund = this.getRefund(refundId);
    if (!refund) return null;
    const targetId = refund.id;
    store.refunds[targetId] = {
      ...store.refunds[targetId],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    persistStore();
    return store.refunds[targetId];
  },

  // --- Reset/Clear (Useful for testing) ---
  _reset() {
    store = {
      bookings: {},
      orders: {},
      payments: {},
      processedWebhooks: {},
      refunds: {},
    };
    persistStore();
  },
};

export default db;
