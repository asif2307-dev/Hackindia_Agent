/**
 * server/refundRoutes.js
 * Express API Router for Agent Travel Refunds.
 * Routes:
 * - POST /api/refunds/submit
 * - GET  /api/refunds/:id
 * - POST /api/refunds/:id/decision  (and POST /api/refunds/decision)
 * - POST /api/refunds/:id/draft
 * - GET  /api/refunds
 */

import { Router } from 'express';
import {
  submitRefund,
  getRefundById,
  processReviewerDecision,
  listRefunds,
  saveDraftNote,
} from './refundService.js';

const router = Router();

/**
 * POST /api/refunds/submit
 * Submits a new refund claim for a verified paid booking.
 */
router.post('/submit', (req, res) => {
  try {
    const result = submitRefund(req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error('[REFUND ERROR] Submit failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing refund submission',
    });
  }
});

/**
 * POST /api/refunds/:id/decision
 * Reviewer decision endpoint (coordinated with Person 4).
 * Records reviewer authorization, escalations, or rejections.
 */
router.post('/:id/decision', (req, res) => {
  try {
    const refundId = req.params.id;
    const result = processReviewerDecision(refundId, req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error('[REFUND ERROR] Reviewer decision failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while recording reviewer decision',
    });
  }
});

/**
 * POST /api/refunds/decision
 * Alternative convenience route accepting refundId in body (for Person 4 integration).
 */
router.post('/decision', (req, res) => {
  try {
    const refundId = req.body.refundId || req.body.id || req.body.caseId;
    if (!refundId) {
      return res.status(400).json({
        success: false,
        error: 'refundId (or caseId) is required in request body',
      });
    }
    const result = processReviewerDecision(refundId, req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error('[REFUND ERROR] Reviewer decision failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while recording reviewer decision',
    });
  }
});

/**
 * POST /api/refunds/:id/draft
 * Persists a reviewer draft note without changing the case decision status.
 * Allows auditors to save work-in-progress notes that survive page refreshes.
 */
router.post('/:id/draft', (req, res) => {
  try {
    const refundId = req.params.id;
    const result = saveDraftNote(refundId, req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error('[REFUND ERROR] Draft save failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while saving reviewer draft',
    });
  }
});

/**
 * GET /api/refunds/:id
 * Fetches refund details and live status by refund ID, case reference, or booking ID.
 */
router.get('/:id', (req, res) => {
  try {
    const result = getRefundById(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error('[REFUND ERROR] Fetch failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while retrieving refund case',
    });
  }
});

/**
 * GET /api/refunds
 * Lists all refund cases for reviewer queue or analytics.
 */
router.get('/', (req, res) => {
  try {
    const filter = {
      status: req.query.status,
      bookingId: req.query.bookingId,
    };
    const result = listRefunds(filter);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error('[REFUND ERROR] List failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while retrieving refunds list',
    });
  }
});

export default router;
