import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { Artwork } from '../interfaces/ArtInterface';
import auth from '../utils/auth';

// Load Stripe
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey || '');

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Artwork[]>([]);
  const [_loading, _setLoading] = useState(false);
  
  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      const storedCart = localStorage.getItem('shoppingCart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    
    loadCart();
    
    // Listen for changes to the cart
    window.addEventListener('storage', loadCart);
    
    return () => {
      window.removeEventListener('storage', loadCart);
    };
  }, []);
  
  // Calculate the total price
  const calculateTotal = (): number => {
    return cart.reduce((sum, item) => {
      // Extract numeric value from price string and convert to number
      const priceStr = item.price || '0';
      const priceVal = typeof priceStr === 'string' 
        ? parseFloat(priceStr.replace(/[^0-9.-]+/g, ''))
        : (typeof priceStr === 'number' ? priceStr : 0);
      
      return sum + priceVal;
    }, 0);
  };
  
  // Handle removing an item from the cart
  const handleRemoveItem = (artworkId: number) => {
    const updatedCart = cart.filter(item => item.id !== artworkId);
    localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    
    // Dispatch an event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  // Format price for display
  const formatPrice = (price: string | number | undefined): string => {
    if (price === undefined || price === null) return '$0';
    if (typeof price === 'number') return `$${price.toLocaleString()}`;
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
      return `$${numericPrice.toLocaleString()}`;
    }
    return '$0';
  };
  
  // Handle checkout completion
  // const handleCheckoutComplete = () => {
  //   // Clear the cart
  //   localStorage.removeItem('shoppingCart');
  //   setCart([]);
    
  //   // Dispatch an event to notify other components
  //   window.dispatchEvent(new Event('cartUpdated'));
    
  //   // Show success message or redirect
  //   alert('Thank you for your purchase!');
  //   navigate('/');
  // };

  // Get the image source for an artwork
  const getImageSrc = (artwork: Artwork): string => {
    if (artwork.imagePath) {
      return artwork.imagePath;
    }
    
    if (artwork.image_id) {
      return `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
    }
    
    return 'https://via.placeholder.com/150?text=No+Image';
  };
  
  // If not logged in, redirect to login
  useEffect(() => {
    if (!auth.loggedIn()) {
      navigate('/Login');
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      {/* Move the heading outside the row and add a horizontal line */}
      <h1 className="mb-3">Shopping Cart</h1>
      <hr className="mb-4" />
      
      {cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <a href="/">Continue shopping</a>.
        </div>
      ) : (
        <>
          <div className="row">
            {/* Adjust column widths - make order summary wider */}
            <div className="col-md-7">
              {/* Cart items */}
              <div className="card mb-4">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">Cart Items ({cart.length})</h5>
                </div>
                <div className="card-body">
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item mb-3 p-3 border-bottom">
                      <div className="row">
                        {/* Adjust internal layout to prevent overflow */}
                        <div className="col-md-3">
                          <img 
                            src={getImageSrc(item)} 
                            alt={item.title} 
                            style={{
                              width: '100%',
                              maxHeight: '150px',
                              objectFit: 'cover',
                              borderRadius: '5px'
                            }}
                          />
                        </div>
                        {/* Make content column wider */}
                        <div className="col-md-7">
                          <h5 className="text-break">{item.title}</h5>
                          <p className="text-muted text-break">{item.artist_title || 'Unknown Artist'}</p>
                          <p className="fw-bold">{formatPrice(item.price)}</p>
                        </div>
                        <div className="col-md-2 d-flex align-items-center justify-content-end">
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Make order summary wider - col-md-5 instead of col-md-4 */}
            <div className="col-md-5">
              {/* Order summary */}
              <div className="card">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                    <span>Taxes</span>
                    <span>{formatPrice(calculateTotal() * 0.08)}</span>
                  </div>
                  <div className="d-flex justify-content-between font-weight-bold">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal() * 1.08)}</span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  {/* Make the checkout container take full width */}
                  <div className="checkout-container p-4 border rounded" style={{ width: '100%' }}>
                    <h5 className="mb-4">Payment Details</h5>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        amount={calculateTotal() * 1.08} 
                      />
                    </Elements>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
