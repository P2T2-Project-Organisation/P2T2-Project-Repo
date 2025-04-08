import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import auth from '../utils/auth'; // Import the auth utility

interface CheckoutFormProps {
  amount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      console.log('Sending payment intent request with amount:', amount); // Log the request

      // Convert the amount to cents before sending it to the backend
      const amountInCents = Math.round(amount * 100);

      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getToken()}`, // Include the token if required
        },
        body: JSON.stringify({ amount: amountInCents }), // Send the amount in cents
      });

      console.log('Payment intent response status:', response.status); // Log response status

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Payment intent error response:', errorData); // Log error response
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      console.log('Received client secret:', clientSecret); // Log client secret

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        console.error('Payment error:', result.error.message);
        setMessage(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        console.log('Payment successful!');
        setMessage('Payment successful!');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          fontSize: '16px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CheckoutForm;
