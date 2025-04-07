import { Router } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
}

// Correct the apiVersion type to match the expected value
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' as Stripe.LatestApiVersion });

const router = Router();

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    // Validate and ensure the amount is a positive integer
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure the amount is an integer
      currency: 'usd',
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    return res.status(500).json({ error: error.message }); // Ensure all paths return a response
  }
});

export default router;
