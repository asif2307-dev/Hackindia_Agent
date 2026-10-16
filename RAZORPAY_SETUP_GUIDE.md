# Agent Travel — Razorpay Test Mode Setup & Verification Guide

This guide explains how to configure and verify Razorpay Test Mode in Agent Travel.

---

## 1. Where to Put Your Razorpay Key and Secret

Open the `.env` file in the root of the project (if it doesn't exist, copy from `.env.example`):

```bash
PORT=5000
RAZORPAY_MODE=test
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_ACTUAL_WEBHOOK_SECRET
```

### How to get your Test Mode Key and Secret:
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle the switch in the top-left from **Live Mode** to **Test Mode**.
3. Go to **Settings** → **API Keys** (or direct link: [https://dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys)).
4. Click **Generate Test Key**.
5. Copy:
   - **Key ID** (starts with `rzp_test_`) → paste into `RAZORPAY_KEY_ID` in `.env`.
   - **Key Secret** → paste into `RAZORPAY_KEY_SECRET` in `.env`.
6. Save the `.env` file. (Note: `.env` is automatically ignored by Git so your secret will never be committed).

---

## 2. Running the Application

In your terminal, you can run both backend and frontend:

### Start the Backend Server (Port 5000):
```bash
npm run server
```
*Output:*
```
[SERVER] Agent Travel backend running on http://localhost:5000
[SERVER] Razorpay Mode: test
[RAZORPAY] Initialized with Key ID: rzp_test_...
```

### Start the Frontend (Port 5173):
```bash
npm run dev
```

---

## 3. How to Test Payment in the App

1. Open `http://localhost:5173` in your browser.
2. Select any trip (Flight, Hotel, Train, Bus, Cab, or Holiday).
3. Click **Book Flight** / **Reserve Room** / **Select & Review**.
4. In the **Booking Review & Confirmation** modal, review the authoritative payable amount and AI refund protection.
5. Click **Pay with Razorpay (₹ ...)**.
6. The official Razorpay Checkout popup will appear:
   - Select **Card**, enter test card `4012 0000 0000 0002`, any future expiry date (e.g., `12/28`), and CVV `123`.
   - Or select **UPI / QR** / **Netbanking** (HDFC / SBI / ICICI test simulation).
   - Click **Pay**. Click **Success** on the Razorpay test bank screen.
7. Razorpay completes the simulated payment and sends the response signature to `/api/payment/verify`.
8. The backend verifies the HMAC-SHA256 signature using your `RAZORPAY_KEY_SECRET` and marks the booking as **PAID**.
9. The user is redirected to **My Bookings** (`/bookings`) with the green **Razorpay Paid** badge and transaction reference!

---

## 4. Setting up Razorpay Webhooks (Test Mode)

To receive real-time webhook notifications from Razorpay:

1. Expose your local backend port 5000 using `ngrok` (or localtunnel):
   ```bash
   ngrok http 5000
   ```
   Copy the `https://...` forwarding URL (e.g. `https://abc-123.ngrok-free.app`).

2. In Razorpay Dashboard (Test Mode):
   - Go to **Settings** → **Webhooks** → **Add New Webhook**.
   - **Webhook URL**: `https://your-ngrok-url/api/payment/webhook`
   - **Secret**: Enter a secret string (e.g. `agent_travel_wh_sec_2026`) and copy it to `RAZORPAY_WEBHOOK_SECRET` in your `.env`.
   - **Active Events**: Select:
     - `payment.captured`
     - `payment.failed`
     - `order.paid`
   - Click **Save Webhook**.

3. Test webhook delivery:
   - Trigger a payment in Test Mode.
   - Look at the backend terminal logs:
     ```
     [WEBHOOK] Booking BK-102938 updated to PAID via payment.captured
     ```

---

## 5. Automated Tests

Run the built-in test suite anytime:
```bash
npm run test:server
```
Verifies:
- Public key configuration safety (no secret leakage)
- Authoritative amount calculation in paise
- Duplicate order prevention
- HMAC-SHA256 constant-time signature verification
- Valid state transitions to `PAID`
- Webhook raw-body signature validation and idempotency
- Protection against state downgrades from stale deliveries
