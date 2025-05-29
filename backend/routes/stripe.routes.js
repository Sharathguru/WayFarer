import express from "express";

import auth from "../middlewares/auth.js";
import {
  cancelSubscription,
  createCheckoutSession,
} from "../controllers/stripe.controllers.js";
// import {createCheckoutSession} from '../controllers/itenary.controllers.js'

const router = express.Router();

router.post("/create-checkout-session", auth, createCheckoutSession);
router.post("/cancel-subscription", auth, cancelSubscription);

// async function cancelSubscription(choice, user) {
//   if (choice === 'immediate') {
//     await stripe.subscriptions.cancel(user.subscriptionId);
//   } else {
//     await stripe.subscriptions.update(user.subscriptionId, {
//       cancel_at_period_end: true
//     });
//   }
// }

export default router;
