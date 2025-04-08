import { Router } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' as Stripe.LatestApiVersion });

const router = Router();

// Ensure this route does not require authentication unless explicitly needed
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    console.log('Received payment intent request with amount:', amount); // Log the request

    // Validate and ensure the amount is a positive integer and within Stripe's allowed range
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 99999999) {
      console.error('Invalid amount provided:', amount);
      return res.status(400).json({ error: 'Amount must be between $0.01 and $999,999.99' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure the amount is an integer
      currency: 'usd',
    });

    console.log('Payment intent created successfully:', paymentIntent.id); // Log success
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message, error.stack); // Log the error
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
