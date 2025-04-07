import { useState, useEffect } from 'react';
import auth from '../utils/auth';

const AccountPage = () => {
  const [userData, setUserData] = useState<{ username: string; email: string; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('Account Info'); // Track the active section

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data); // Ensure the response data is correctly set
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null); // Set userData to null on error
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchUserData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!userData) {
      return <div>Error loading user data.</div>;
    }

    switch (currentSection) {
      case 'Account Info':
        return (
          <div className="account-details">
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Account Created:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
        );
      case 'Purchases':
        return <div>Purchases content will go here.</div>;
      case 'Wishlist':
        return <div>Wishlist content will go here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item ${currentSection === 'Account Info' ? 'active' : ''}`}
              onClick={() => setCurrentSection('Account Info')}
            >
              Account Info
            </button>
            <button
              className={`list-group-item ${currentSection === 'Purchases' ? 'active' : ''}`}
              onClick={() => setCurrentSection('Purchases')}
            >
              Purchases
            </button>
            <button
              className={`list-group-item ${currentSection === 'Wishlist' ? 'active' : ''}`}
              onClick={() => setCurrentSection('Wishlist')}
            >
              Wishlist
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <h2 className="text-center mb-4">{currentSection}</h2> {/* Dynamic header */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
