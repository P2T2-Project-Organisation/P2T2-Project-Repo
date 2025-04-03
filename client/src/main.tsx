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
        path: '/ProductViewer',
        element: <ProductViewer />
      }, 
      {
        path: '/Purchases',
        element: <Purchases />
      }, 
      {
        path: '/Wishlist',
        element: <Wishlist />
      }, 
      
    ]
  }
])

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
