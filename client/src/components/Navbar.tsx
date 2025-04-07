import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import auth from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const currentPage = useLocation().pathname;
  const [loggedIn, setLoggedIn] = useState(auth.loggedIn());

  useEffect(() => {
    setLoggedIn(auth.loggedIn());
  }, []);
  useEffect(() => {
    setLoggedIn(auth.loggedIn());
  }, []);

  const handleAuthAction = () => {
    if (loggedIn) {
      auth.logout(); // Log out the user
      setLoggedIn(false); // Update state
      navigate('/Login'); // Redirect to the login page
    } else {
      navigate('/Login'); // Redirect to the login page
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
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
          <Link
            to="/ProductViewer"
            className={currentPage === '/ProductViewer' ? 'nav-link active' : 'nav-link'}
          >
            Product Viewer
          </Link>
        </div>
        <div className="nav-right">
          <button className="logout-button" onClick={handleAuthAction}>
            {loggedIn ? 'Log Out' : 'Log In'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
