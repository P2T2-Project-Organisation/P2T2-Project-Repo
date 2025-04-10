import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';

interface CheckoutFormProps {
  amount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      console.log('Sending payment intent request with amount:', amount); // Log the request

      // Convert the amount to cents before sending it to the backend
      const amountInCents = Math.round(amount * 100); // Convert amount to cents

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
        
        // Clear the cart
        localStorage.removeItem('shoppingCart');
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Just redirect after a short delay without showing an alert
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className="mb-3">
        <label className="form-label">Card Details</label>
        <div className="p-3 border rounded" style={{ 
          backgroundColor: '#f8f9fa',
          width: '100%', // Make the form take full width of its container
        }}>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  // Make the form field wider
                  padding: '12px',
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary w-100"
        style={{
          backgroundColor: loading ? '#aab7c4' : 'blue',
          color: 'white',
          fontSize: '16px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : `Pay $${(amount).toFixed(2)}`}
      </button>
      {message && (
        <div className={`mt-3 text-center ${message.includes('successful') ? 'text-success' : 'text-danger'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
