# Integration Handover Report: Refund Backend & Reviewer Draft Persistence

**Project:** Agent Travel — Travel Booking & AI-Assisted Refund Investigation Platform  
**Author:** Person 3 (Anurag) — Refund Backend & Persistence  
**Recipient:** Person 4 — Reviewer Console Integration & Payout Flow  
**Date:** October 19, 2026  
**Document File:** `INTEGRATION_HANDOFF.md`

---

## 1. Executive Summary

This document provides a verified, complete technical handover of the **Refund Backend APIs**, **Data Persistence Engine**, and **Reviewer Draft Note Architecture** built for the Agent Travel platform.

All 12 backend unit and integration tests are passing (`12/12`), TypeScript compiles with zero errors (`npx tsc --noEmit`), and the production build builds cleanly (`npm run build`).

All live data, including verified booking `BK-148123` (IndiGo 6E-2134, ₹5,120, PAID) and its corresponding active refund case `RF-2058722ZAV`, are persisted in `server/data/store.json`.

---

## 2. Workspace & Git State

* **Repository Root:** `c:\Users\anura\OneDrive\Documents\Hackindia_Agent`
* **Active Git Branch:** `anurag_v2` (verified via `git branch --show-current`)
* **Tracking Status:** Branch is up to date with `origin/anurag_v2`
* **Commit Status:** **Uncommitted working tree** (changes are in working directory, intentionally not committed or pushed per safety protocol)

### Git Status (`git status --short`)
```text
 M .gitignore
 M dist/index.html
 M server/awsConfig.js
 M server/data/store.json
 M server/index.js
 M src/context/InvestigationContext.tsx
 M src/pages/CaseDetailPage.tsx
 M src/pages/HumanReviewPage.tsx
 M src/pages/RefundCenterPage.tsx
 M src/types.ts
?? server/refundRoutes.js
?? server/refundService.js
?? server/test/refund.test.js
```

### Git Diff Statistics (`git diff --stat`)
```text
 .gitignore                           |   4 +
 dist/index.html                      |  38 ++++----
 server/awsConfig.js                  | 115 ++++++++++++++++++++++--
 server/data/store.json               | 167 +++++++++++++++++++++++++++++++++-
 server/index.js                      |   4 +
 src/context/InvestigationContext.tsx |  71 ++++++++++++++-
 src/pages/CaseDetailPage.tsx         |  89 ++++++++++++++++++-
 src/pages/HumanReviewPage.tsx        |  85 ++++++++++++++----
 src/pages/RefundCenterPage.tsx       | 168 ++++++++++++++++++++++++++++-------
 src/types.ts                         |   4 +
 10 files changed, 664 insertions(+), 81 deletions(-)
```

---

## 3. Inventory of Relevant Files

### Newly Added (Untracked) Files
1. **`server/refundRoutes.js`**
   * Express router defining and mounting all refund endpoints under `/api/refunds`.
   * Maps HTTP verbs to corresponding domain functions in `refundService.js`.
2. **`server/refundService.js`**
   * Domain business logic and validation layer for the refund lifecycle.
   * Handles eligibility checks, payment status verification, duplicate claim guards, reviewer decisions, draft note persistence, and immutable audit logs.
3. **`server/test/refund.test.js`**
   * Comprehensive 12-test suite using Node.js built-in test runner (`node --test`).
   * Tests input validation, non-existent bookings, unpaid booking rejection, amount bounds, duplicate claim prevention, file persistence, reviewer decisions, state transition integrity, and draft note reload survival using isolated test data stores (`DATA_STORE_PATH`).

### Modified Files
1. **`server/awsConfig.js`**
   * Enhanced the persistent file-backed database layer (`store.json`).
   * Added refund CRUD operations: `saveRefund`, `getRefund`, `getRefundByBookingId`, `listRefunds`, and `updateRefund`.
   * Added dynamic `getDataFile()` supporting `process.env.DATA_STORE_PATH` for test isolation.
   * Implemented Windows-resilient file persistence (`copyFileSync` fallback when OneDrive sync momentarily locks file renaming).
   * Added fuzzy booking lookup by code/ID and protected against accidental downgrade of `PAID` statuses.
2. **`server/index.js`**
   * Imported and registered `refundRouter` at `/api/refunds`.
3. **`server/data/store.json`**
   * Persistent JSON store holding live bookings, orders, payments, webhooks, and the new `refunds` map.
   * Contains verified live booking `BK-148123` and active case `RF-2058722ZAV`.
4. **`src/types.ts`**
   * Extended `InvestigationCase` interface with:
     * `bookingId?: string`
     * `reviewerDraftNote?: string`
     * `reviewerDraftDecision?: string | null`
     * `reviewerDraftSavedAt?: string`
     * `reviewerDraftSavedBy?: string`
5. **`src/context/InvestigationContext.tsx`**
   * Added initial load `useEffect` that fetches live refund cases from `/api/refunds` on application mount and merges them into React state.
   * Propagates case decisions via `postDecisionToBackend()` to `/api/refunds/:id/decision`.
   * Multi-field case lookup matching by case ID, `caseRef`, `pnr`, or `bookingId`.
6. **`src/pages/HumanReviewPage.tsx`**
   * Updated `handleSaveDraft` to asynchronously dispatch to `/api/refunds/:id/draft`.
   * Implemented `useEffect([selectedCase?.id])` that restores the draft note from `selectedCase.reviewerDraftNote` whenever the auditor switches cases or reloads the page.
7. **`src/pages/CaseDetailPage.tsx`**
   * Replaced hardcoded mock fallback with backend-first live fetch (`GET /api/refunds/:id`).
   * If a real booking or refund case is requested (such as `BK-148123` or `RF-2058722ZAV`), it renders the authentic carrier and claim data. Displays a clear "Case Not Found" error state if an unrecognised reference is requested.
8. **`src/pages/RefundCenterPage.tsx`**
   * Connected the passenger claim form to `POST /api/refunds/submit`.
   * Handles HTTP 201 (redirect to new case), HTTP 409 (conflict, redirect to existing case), and error displays.
9. **`.gitignore`**
   * Added ignore patterns for temporary test database fixtures:
     ```text
     server/data/store.refund-test.json
     server/data/store.refund-test.json.tmp
     ```
10. **`dist/index.html`**
    * Production build artifact updated by `npm run build`.

---

## 4. Backend API Endpoints Reference

All endpoints are hosted on the backend server (`http://localhost:5001`) and mirrored via the Vite dev proxy (`http://localhost:5173/api/...`).

### Endpoint Summary Table

| HTTP Method | Route Path | Handler Function | Primary Consumer |
|---|---|---|---|
| `POST` | `/api/refunds/submit` | `submitRefund` | Passenger (Refund Center) |
| `GET` | `/api/refunds/:id` | `getRefundById` | Case Detail & Tracker |
| `POST` | `/api/refunds/:id/decision` | `processReviewerDecision` | Reviewer Console (Person 4) |
| `POST` | `/api/refunds/decision` | `processReviewerDecision` | Alternative Convenience Route |
| `POST` | `/api/refunds/:id/draft` | `saveDraftNote` | Reviewer Console (Person 4) |
| `GET` | `/api/refunds` | `listRefunds` | Reviewer Queue & Context |

---

### Endpoint Specifications

#### 1. POST `/api/refunds/submit`
* **Purpose:** Submits a new refund claim against an existing booking. Validates that the booking exists and is in `PAID` status. Reconciles eligible amount.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "bookingId": "BK-148123",
    "reason": "Cancelled by airline / operator (Flight 6E-2134)",
    "claimAmount": 5120,
    "currency": "INR",
    "contact": "rahul.sharma@example.com",
    "evidence": ["cancellation_sms.png"]
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Refund claim submitted successfully",
    "refund": {
      "id": "RF-2058722ZAV",
      "caseRef": "#RF-2058722ZAV",
      "bookingId": "BK-148123",
      "pnr": "BK-148123",
      "claimAmount": 5120,
      "claimAmountFormatted": "₹5,120",
      "currency": "INR",
      "eligiblePaidAmount": 5120,
      "reason": "Cancelled by airline / operator (Flight 6E-2134)",
      "status": "SUBMITTED",
      "decisionStatus": "Under Human Review",
      "eligibilityStatus": "Eligible",
      "riskLevel": "Low Risk",
      "riskScore": 0.05,
      "aiConfidence": 92,
      "carrier": {
        "name": "IndiGo",
        "code": "6E-2134",
        "route": "Delhi (DEL) → Mumbai (BOM)"
      }
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`: Missing `bookingId` or `reason`, claim amount exceeds paid amount, or booking is unpaid.
  * `404 Not Found`: Booking ID does not exist in store.
  * `409 Conflict`: An active refund case already exists for this booking. Returns the existing case in response body.

---

#### 2. GET `/api/refunds/:id`
* **Purpose:** Retrieves a refund record by its primary refund ID (e.g. `RF-2058722ZAV`), case reference (e.g. `#RF-2058722ZAV`), or associated `bookingId` (e.g. `BK-148123`).
* **Headers:** None required.
* **Parameters:** `:id` — Case ID, caseRef, or booking ID.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "refund": {
      "id": "RF-2058722ZAV",
      "caseRef": "#RF-2058722ZAV",
      "bookingId": "BK-148123",
      "claimAmount": 5120,
      "decisionStatus": "Under Human Review",
      "reviewerDraftNote": "Lead auditor preliminary assessment: Flight IndiGo 6E-2134 delay confirmed via DGCA database.",
      "reviewerDraftDecision": "more_docs",
      "auditLog": [...]
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`: Missing ID parameter.
  * `404 Not Found`: No refund case found matching the identifier.

---

#### 3. POST `/api/refunds/:id/decision` (and `/api/refunds/decision`)
* **Purpose:** Records a reviewer decision (human auditor arbitration). Manages status transitions, authorizes payout amounts, and adds an immutable entry to the case audit ledger.
* **Headers:** `Content-Type: application/json`
* **Allowed Decisions:**
  * `APPROVE` (or `ELIGIBLE`): Sets `decisionStatus` to `"Approved"`.
  * `REJECT` (or `REJECTED`): Sets `decisionStatus` to `"Rejected"`.
  * `REQUEST_INFO` (or `MORE_DOCS`): Sets `decisionStatus` to `"Awaiting Carrier Evidence"`.
  * `ESCALATE`: Sets `decisionStatus` to `"Under Human Review"`.
* **Request Body Example:**
  ```json
  {
    "decision": "APPROVE",
    "reviewerComment": "Full refund approved. Passenger flight delay verified via DGCA records.",
    "reviewerId": "Julian Hayes (Lead Auditor)",
    "approvedAmount": 5120
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Reviewer decision 'Approved' recorded successfully",
    "refund": {
      "id": "RF-2058722ZAV",
      "status": "APPROVED",
      "decisionStatus": "Approved",
      "finalDecision": "Approved by Julian Hayes (Lead Auditor)",
      "reviewerComment": "Full refund approved. Passenger flight delay verified via DGCA records.",
      "assignedAuditor": "Julian Hayes (Lead Auditor)",
      "approvedAmount": 5120,
      "decisionRecordedAt": "2026-10-19T14:30:00.000Z",
      "auditLog": [
        {
          "id": "log-1792419999000",
          "time": "08:00 pm",
          "title": "Reviewer Decision: Approved",
          "description": "Approved by Julian Hayes (Lead Auditor). Note: Full refund approved...",
          "dotColor": "bg-primary-container"
        }
      ]
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`:
    * Missing `reviewerComment`
    * Invalid decision string
    * Approved amount exceeds claimed amount or is <= 0
    * **Invalid status transition:** Attempting to alter an already `Approved` or `Disbursed` refund
    * Attempting to directly approve a previously `Rejected` refund without escalation

---

#### 4. POST `/api/refunds/:id/draft`
* **Purpose:** Persists reviewer draft notes and in-progress decisions **without altering** the refund case's `decisionStatus` or triggering any state transitions.
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "reviewerNote": "Awaiting secondary carrier operational log from SpiceJet/IndiGo dispatch.",
    "draftDecision": "more_docs",
    "reviewerId": "Julian Hayes (Lead Auditor)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Draft note saved for case RF-2058722ZAV",
    "refund": {
      "id": "RF-2058722ZAV",
      "decisionStatus": "Under Human Review",
      "reviewerDraftNote": "Awaiting secondary carrier operational log from SpiceJet/IndiGo dispatch.",
      "reviewerDraftDecision": "more_docs",
      "reviewerDraftSavedAt": "2026-10-19T14:35:00.000Z",
      "reviewerDraftSavedBy": "Julian Hayes (Lead Auditor)",
      "auditLog": [
        {
          "id": "log-1792420000000",
          "time": "08:05 pm",
          "title": "Reviewer Draft Note Saved",
          "description": "Draft saved by Julian Hayes (Lead Auditor). Pending decision: more_docs. Note: ...",
          "dotColor": "bg-secondary"
        }
      ]
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`: `reviewerNote` is empty or only whitespace.
  * `400 Bad Request`: Case is already in a finalized status (`Approved` or `Disbursed`).
  * `404 Not Found`: Refund ID not found.

---

#### 5. GET `/api/refunds`
* **Purpose:** Returns list of all stored refunds. Supports query parameters `?status=` and `?bookingId=`.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "count": 1,
    "refunds": [ ... ]
  }
  ```

---

## 5. Persistence & Integration Details for Person 4

### 1. How Reviewer Drafts Work
* When Person 4's UI invokes `POST /api/refunds/:id/draft`, the backend writes four fields directly to the case record in `store.json`:
  * `reviewerDraftNote`
  * `reviewerDraftDecision`
  * `reviewerDraftSavedAt`
  * `reviewerDraftSavedBy`
* It simultaneously pushes a `"Reviewer Draft Note Saved"` item into `refund.auditLog`.
* **Important:** It leaves `refund.decisionStatus` and `refund.status` completely untouched.

### 2. Reload and Case Switching Restoration
* **On Page Reload:** [`InvestigationContext.tsx`](file:///c:/Users/anura/OneDrive/Documents/Hackindia_Agent/src/context/InvestigationContext.tsx) executes a `fetch('/api/refunds')` on mount. This fetches all cases with their saved `reviewerDraftNote` and merges them into state.
* **On Case Switch:** In [`HumanReviewPage.tsx`](file:///c:/Users/anura/OneDrive/Documents/Hackindia_Agent/src/pages/HumanReviewPage.tsx), the note field is tied to `selectedCase`:
  ```typescript
  useEffect(() => {
    if (selectedCase?.reviewerDraftNote) {
      setReviewerNote(selectedCase.reviewerDraftNote);
    } else if (selectedCase?.reviewerComment) {
      setReviewerNote(selectedCase.reviewerComment);
    } else {
      setReviewerNote('');
    }
  }, [selectedCase?.id]);
  ```
  Switching cases in the reviewer queue automatically populates the text area with that specific case's saved draft.

### 3. Transition Rules and Constraints
* **Drafts cannot be saved on finalized cases:** If a case is already `Approved` or `Disbursed`, calling `/draft` returns HTTP 400.
* **Final decisions require comments:** `POST /api/refunds/:id/decision` rejects requests where `reviewerComment` is missing or blank.
* **Approved Amount Upper Bound:** `approvedAmount` cannot exceed `refund.claimAmount`.
* **No Direct Approval of Rejected Cases:** A case with `decisionStatus === 'Rejected'` cannot be directly approved; it must be escalated first.

---

## 6. Safe Integration Guide for Person 4

To inspect or integrate these changes safely without code or data loss:

### Option A: Check Out the `anurag_v2` Branch
Person 4 can pull and check out the branch:
```bash
git fetch origin
git checkout anurag_v2
```

### Option B: Create a Git Patch (Recommended if Merging Locally)
To export Person 3's exact uncommitted changes without modifying any git history or pushing:
```bash
# Generate patch of all tracked changes
git diff HEAD > refund_backend_person3.patch

# Untracked files can be packaged or copied directly:
# - server/refundRoutes.js
# - server/refundService.js
# - server/test/refund.test.js
```

Person 4 can apply the patch cleanly using:
```bash
git apply refund_backend_person3.patch
```

### How to Run and Verify
1. **Start Backend Server:**
   ```bash
   node server/index.js
   # Running on http://localhost:5001
   ```
2. **Start Frontend Dev Server:**
   ```bash
   npm run dev
   # Running on http://localhost:5173
   ```
3. **Execute Backend Tests:**
   ```bash
   node --test server/test/refund.test.js
   ```
4. **Execute TypeScript Check:**
   ```bash
   npx tsc --noEmit
   ```

---

## 7. Known Verified Test Cases in Store

For Person 4's end-to-end testing in the Reviewer Console:

* **Active Case Available for Review:**
  * **Case ID:** `RF-2058722ZAV` (or `#RF-2058722ZAV`)
  * **Booking ID:** `BK-148123`
  * **Carrier:** IndiGo `6E-2134` (Route: Delhi → Mumbai)
  * **Claim Amount:** `₹5,120`
  * **Payment Status:** `PAID`
  * **Current State:** `Under Human Review` (Ready for draft saves or final reviewer decisions)
  * **Live Draft Note:** `"Lead auditor preliminary assessment: Flight IndiGo 6E-2134 delay confirmed via DGCA database. Checking tariff compensation entitlement."`

---
*Report generated and verified against live codebase on October 19, 2026.*
