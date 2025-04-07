import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import auth from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const currentPage = useLocation().pathname;
  const [loggedIn, setLoggedIn] = useState(auth.loggedIn());
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoggedIn(auth.loggedIn());

      if (auth.loggedIn()) {
        try {
          const response = await fetch('/api/users/me', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.getToken()}`,
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

    // Check authentication status on mount
    checkAuthStatus();

    // Add an event listener for storage changes to handle token updates
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

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

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img 
            src={logo} 
            alt="Logo" 
            className="logo" 
            style={{ height: '100px', width: 'auto' }} // Increase the height to make the logo larger
          />
        </Link>
      </div>
      <nav className="navbar">
        <div className="nav-center">
          <Link
            to="/"
            className={currentPage === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link
            to="/AccountPage"
            className={currentPage === '/AccountPage' ? 'nav-link active' : 'nav-link'}
          >
            Account Page
          </Link>
        </div>
        <div className="nav-right">
          {!loggedIn && (
            <>
              <button
                className="nav-button"
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  fontSize: '16px', // Match font size
                  padding: '10px 20px', // Match padding for size
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px', // Add margin to create space between buttons
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
                  fontSize: '16px', // Match font size
                  padding: '10px 20px', // Match padding for size
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
            <div className="logged-in-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>
                Welcome back, {username || 'User'}!
              </span>
              <button
                className="logout-button"
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: '16px',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={handleAuthAction}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
