import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.tsx';

import AccountPage from './pages/AccountPage';
// import Header from './pages/Header';
import Home from './pages/Home';
import ProductViewer from './pages/ProductViewer';
import Purchases from './pages/Purchases';
import Wishlist from './pages/Wishlist';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login.tsx';
import Register from './pages/Register'; // Import Register page
import Sell from './pages/Sell';
import EditListing from './pages/EditListing';
import Community from './pages/Community'; // Import Community page
import Offers from './pages/Offers'; // Import Offers page
import CartPage from './pages/CartPage'; // Import the new CartPage
import AboutPage from './pages/AboutPage'; // Import AboutPage

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      }, 
      {
        path: '/Home',
        element: <Home />
      }, 
      {
        path: '/AccountPage',
        element: <AccountPage />
      }, 
      {
        path: '/AboutPage',
        element: <AboutPage />
      }, 
      {
        path: '/ProductViewer',
        element: <ProductViewer />
      }, 
      {
        path: '/ProductViewer/:id', // Add dynamic route for ProductViewer
        element: <ProductViewer />,
      },
      {
        path: '/Purchases',
        element: <Purchases />
      }, 
      {
        path: '/Wishlist',
        element: <Wishlist />
      }, 
      {
        path: '/Login',
        element: <Login />
      }, 
      {
        path: '/Register',
        element: <Register />, // Add Register route
      },
      {
        path: '/Sell',
        element: <Sell />,
      },
      {
        path: '/EditListing',
        element: <EditListing />,
      },
      {
        path: '/Community',
        element: <Community />, // Add Community route
      },
      {
        path: '/Offers',
        element: <Offers />, // Add Offers route
      },
      {
        path: '/Cart',
        element: <CartPage />, // Add the Cart route
      },
    ]
  }
])

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
