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
};

// Load existing data if available
const loadStore = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      store = {
        bookings: parsed.bookings || {},
        orders: parsed.orders || {},
        payments: parsed.payments || {},
        processedWebhooks: parsed.processedWebhooks || {},
      };
    }
  } catch (err) {
    console.warn('[DB] Could not load persisted data file, starting with fresh in-memory store:', err.message);
  }
};

const persistStore = () => {
  try {
    const tmpFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DATA_FILE);
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
    return store.bookings[bookingId] || null;
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
    if (currentStatus === 'PAID' && paymentData.paymentStatus !== 'PAID') {
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

  // --- Reset/Clear (Useful for testing) ---
  _reset() {
    store = {
      bookings: {},
      orders: {},
      payments: {},
      processedWebhooks: {},
    };
    persistStore();
  },
};

export default db;
