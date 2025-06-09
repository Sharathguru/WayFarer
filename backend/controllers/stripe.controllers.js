// import second from ''
import Stripe from 'stripe';
import User from '../models/user.model.js';
import axios from 'axios';


const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export let createCheckoutSession= async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log("User Details",user)
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!process.env.STRIPE_PRICE_ID) {
      console.error('Missing STRIPE_PRICE_ID in environment variables');
      return res.status(500).json({ error: 'Subscription configuration error' });
    }

    // Check if Stripe customer already exists
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
      });
      console.log(customer);
      user.stripeCustomerId = customer.id;
      await user.save();
      customerId = customer.id;
    }

    // Stripe Checkout will show Google Pay if available
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: 'subscription',
      payment_method_types: ['card'], // Google Pay is included here
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/home`,
      metadata: {
        userId: user._id.toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
      // No need for expand: ['subscription']
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Something went wrong creating Stripe session.' });
  }
}

export let cancelSubscription=async (req, res) => {
  try {
    let id = req.userId;
    const user = await User.findById(id);
    // console.log(user);
    
    if (!user || !user.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Cancel the subscription at period end
    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true
    });
    console.log("stripe update");
    

    
    
    // Update user in database
    await User.findByIdAndUpdate(req.userId, {
      subscriptionStatus: 'canceled',
      isSubscribed: false
    });
    res.json({ success: true, message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}