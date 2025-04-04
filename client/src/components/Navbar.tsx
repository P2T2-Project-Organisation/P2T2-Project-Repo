import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import auth from '../utils/auth';
// import Login from '../pages/Login';

const Navbar = () => {
  const currentPage = useLocation().pathname;

  // State to track the login status
  const [loginCheck, setLoginCheck] = useState(false);

  // Function to check if the user is logged in using auth.loggedIn() method
  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);  // Set loginCheck to true if user is logged in
    }
  };

  // useEffect hook to run checkLogin() on component mount and when loginCheck state changes
  useEffect(() => {
    checkLogin();  // Call checkLogin() function to update loginCheck state
  }, [loginCheck]);  // Dependency array ensures useEffect runs when loginCheck changes

  return (
    <div className="display-flex justify-space-between align-center py-2 px-5 mint-green">
      <h1>
        MyOpus
      </h1>
      <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link
          to="/Home"
          // This is a conditional (ternary) operator that checks to see if the current page is "Home"
          // If it is, we set the current page to 'nav-link-active', otherwise we set it to 'nav-link'
          className={currentPage === '/Home' ? 'nav-link active' : 'nav-link'}
        >
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/AccountPage"
          // Check to see if the currentPage is `About`, and if so we use the active link class from bootstrap. Otherwise, we set it to a normal nav-link
          className={currentPage === '/AccountPage' ? 'nav-link active' : 'nav-link'}
        >
          Account Page
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/ProductViewer"
          // Check to see if the currentPage is `Blog`, and if so we use the active link class from bootstrap. Otherwise, we set it to a normal nav-link
          className={currentPage === '/ProductViewer' ? 'nav-link active' : 'nav-link'}
        >
          Product Viewer
        </Link>
      </li>
    </ul>
    <div>
        {
          // Conditional rendering based on loginCheck state
          !loginCheck ? (
            // Render login button if user is not logged in
            <button className="btn" type='button'>
              <Link to='/Login'>Login</Link>
            </button>
          ) : (
            // Render logout button if user is logged in
            <button className="btn" type='button' onClick={() => {
              auth.logout();  // Call logout() method from auth utility on button click
            }}>Logout</button>
          )
        }
      </div>
    </div>
  )
}

export default Navbar;
