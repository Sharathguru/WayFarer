import express from 'express';
import { subscriptionWebHook } from '../controllers/webhook.contollers.js';

const router = express.Router();

// Stripe requires the raw body for webhook signature verification
router.post(
  '/',
  express.raw({ type: 'application/json' }),
  subscriptionWebHook
);

export default router;