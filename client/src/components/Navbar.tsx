import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import auth from '../utils/auth';
import { Artwork } from '../interfaces/ArtInterface'; // Use named export for Artwork

const Navbar = () => {
  const navigate = useNavigate();
  const currentPage = useLocation().pathname;
  const [loggedIn, setLoggedIn] = useState(auth.loggedIn());
  const [username, setUsername] = useState<string | null>(null);
  const [_wishlist, setWishlist] = useState<Artwork[]>([]); // State for wishlist
  const [_cart, setCart] = useState<Artwork[]>([]); // New state for cart
  const [_offerCount, setOfferCount] = useState<number>(3); // Default to 3 for testing
  const [_unreadPosts, setUnreadPosts] = useState<number>(5); // Initialize with some unread posts
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.loggedIn()) {
        try {
          const response = await fetch('/api/users/me', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.getToken()}`, // Ensure token is sent
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUsername(data.username); // Set the username from the response
          } else {
            setUsername(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername(null);
        }
      } else {
        setUsername(null);
      }
    };

    fetchUserData();
  }, [loggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(auth.loggedIn());
    };

    // Listen for storage events to update the login state
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedCart = localStorage.getItem('shoppingCart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    };
    
    // Initial load
    handleStorageChange();
    
    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  // Add useEffect to fetch offer count
  useEffect(() => {
    const fetchOfferCount = async () => {
      if (auth.loggedIn()) {
        try {
          const token = auth.getToken();
          // Try to fetch the actual count from API
          const response = await fetch('/api/bids/count', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOfferCount(data.count || 0);
          }
        } catch (error) {
          console.error('Error fetching offer count:', error);
          // Fallback to a test value if API fails
          setOfferCount(3); // Keep test value of 3
        }
      }
    };

    fetchOfferCount();
    
    // Set up a timer to refresh the count every minute
    const intervalId = setInterval(fetchOfferCount, 60000);
    
    return () => clearInterval(intervalId);
  }, [loggedIn]);

  useEffect(() => {
    const fetchOfferCount = async () => {
      if (auth.loggedIn()) {
        try {
          // Remove hardcoded test value
          // setOfferCount(3); <- Remove this line

          const token = auth.getToken();
          // Try to fetch the actual count from API
          const response = await fetch('/api/bids/count', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOfferCount(data.count || 0);
          }
        } catch (error) {
          console.error('Error fetching offer count:', error);
          // Don't set a fallback value
          setOfferCount(0);
        }
      }
    };

    fetchOfferCount();
    
    // Add cart and wishlist update event listeners
    const handleCartUpdate = () => {
      const storedCart = localStorage.getItem('shoppingCart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    };
    
    const handleWishlistUpdate = () => {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
      }
    };
    
    // Set up event listeners for custom events
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    // Initial load for wishlist
    handleWishlistUpdate();
    
    // Set up a timer to refresh the offer count periodically
    const intervalId = setInterval(fetchOfferCount, 60000);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [loggedIn]);

  // Effect to simulate checking for new posts periodically
  useEffect(() => {
    // Only run this effect if the user is logged in
    if (!loggedIn) return;

    // Function to simulate fetching unread posts count
    const fetchUnreadPosts = async () => {
      try {
        // In a real implementation, you would fetch from an API endpoint
        // For now, we'll just increment occasionally to simulate new posts
        if (Math.random() > 0.7) { // 30% chance of new post on interval
          setUnreadPosts(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error fetching unread posts:', error);
      }
    };
    
    // Set up interval to check for new posts
    const intervalId = setInterval(fetchUnreadPosts, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [loggedIn]);

  const handleAuthAction = () => {
    if (loggedIn) {
      auth.logout(); // Log out the user
      setLoggedIn(false); // Update state
      setUsername(null); // Clear username
      navigate('/Login'); // Redirect to the login page
    } else {
      navigate('/Login'); // Redirect to the login page for login
    }
  };

  // const handleWishlistClick = () => {
  //   navigate('/Wishlist', { state: { wishlist } }); // Pass wishlist to Wishlist page
  // };

  // const handleCartClick = () => {
  //   navigate('/Cart'); // Navigate to the cart page
  // };

  const handleCommunityClick = () => {
    setUnreadPosts(0); // Clear unread posts count
    navigate('/Community');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img 
            src={logo} 
            alt="Logo" 
            className="logo" 
            style={{ height: '80px', width: 'auto' }} // Reduced logo height
          />
        </Link>
      </div>
      <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
        <div className="nav-center">
          <Link
            to="/"
            className={currentPage === '/' ? 'nav-link active' : 'nav-link'}
            style={{ padding: '6px 10px', fontSize: '0.9rem' }} // Reduced padding and font size
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
</svg> Home
          </Link>
          <Link
            to="/AccountPage"
            className={currentPage === '/AccountPage' ? 'nav-link active' : 'nav-link'}
            style={{ padding: '6px 10px', fontSize: '0.9rem' }} // Reduced padding and font size
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg> Account
          </Link>
          <div style={{ position: 'relative' }}>
            <Link
              to="/Community"
              className={currentPage === '/Community' ? 'nav-link active' : 'nav-link'}
              style={{ padding: '6px 10px', fontSize: '0.9rem' }}
              onClick={handleCommunityClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
</svg> Community
            </Link>
          </div>
          {/* Only show these buttons when logged in */}
          {loggedIn && (
            <>
              <Link
                to="/Sell"
                className={currentPage === '/Sell' ? 'nav-link active' : 'nav-link'}
                style={{ padding: '6px 10px', fontSize: '0.9rem' }} // Reduced padding and font size
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wallet2" viewBox="0 0 16 16">
  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
</svg> Sell
              </Link>
              <Link
                to="/Offers"
                className={currentPage === '/Offers' ? 'nav-link active' : 'nav-link'}
                style={{ padding: '6px 10px', fontSize: '0.9rem', position: 'relative' }} // Reduced padding and font size
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash-stack" viewBox="0 0 16 16">
  <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
  <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/>
</svg> Offers
              </Link>
              
              <Link
                to="/Cart"
                className={currentPage === '/Cart' ? 'nav-link active' : 'nav-link'}
                style={{ padding: '6px 10px', fontSize: '0.9rem', position: 'relative' }} // Reduced padding and font size
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
</svg> Cart
              </Link>
              
              <Link
                to="/Wishlist"
                className={currentPage === '/Wishlist' ? 'nav-link active' : 'nav-link'}
                style={{ padding: '6px 10px', fontSize: '0.9rem', position: 'relative' }} // Reduced padding and font size
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-heart-fill" viewBox="0 0 16 16">
  <path d="M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
</svg> Wishlist
              </Link>
              
              <Link
                to="/AboutPage"
                className={currentPage === '/AboutPage' ? 'nav-link active' : 'nav-link'}
                style={{ padding: '6px 10px', fontSize: '0.9rem' }} // Reduced padding and font size
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
</svg> About
              </Link>
            </>
          )}
        </div>
        <div className="nav-right">
          {!loggedIn && (
            <>
              <button
                className="nav-button"
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  fontSize: '0.9rem', // Reduced font size
                  padding: '6px 12px', // Reduced padding
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '8px', // Reduced margin
                }}
                onClick={() => navigate('/Register')}
              >
                Register
              </button>
              <button
                className="logout-button"
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  fontSize: '0.9rem', // Reduced font size
                  padding: '6px 12px', // Reduced padding
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={handleAuthAction}
              >
                Log In
              </button>
            </>
          )}
          {loggedIn && (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              fontSize: '0.9rem', // Reduced font size
            }}>
              <span>Welcome back, {username}</span>
              <button
                className="logout-button"
                onClick={handleAuthAction}
                style={{ 
                  marginLeft: '8px',  // Reduced margin
                  padding: '6px 12px', // Reduced padding
                  fontSize: '0.9rem'   // Reduced font size
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* Hamburger menu icon */}
      <button
        className="hamburger-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        🍔Nav
      </button>
      {/* Overlay for menu */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
    </header>
  );
};

export default Navbar;
