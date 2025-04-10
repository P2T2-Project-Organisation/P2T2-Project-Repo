import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import auth from '../utils/auth';

interface ListedItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imagePath: string;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<{ username: string; email: string; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('Account Info'); // Track the active section
  const [listedItems, setListedItems] = useState<ListedItem[]>([]); // State for currently listed items

  useEffect(() => {
    if (location.state?.currentSection) {
      setCurrentSection(location.state.currentSection); // Set the section from navigation state
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.getToken()}`, // Ensure token is sent
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

    const fetchListedItems = async () => {
      try {
        const response = await fetch('/api/artworks?userOnly=true', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.getToken()}`, // Ensure token is sent
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listed items');
        }

        const data = await response.json();
        setListedItems(data); // Set the listings returned by the backend
      } catch (error) {
        console.error('Error fetching listed items:', error);
        setListedItems([]); // Set to an empty array on error
      }
    };

    fetchUserData();
    fetchListedItems();
  }, [location.state]);

  const handleEdit = (item: ListedItem) => {
    navigate('/EditListing', { state: { item } }); // Pass the listing data to the Edit Listing page
  };

  const handleRemove = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/artworks/${itemId}`, { // Use the backend server URL
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.getToken()}`, // Include token for authentication
        },
      });

      if (response.ok) {
        setListedItems((prevItems) => prevItems.filter((item) => item.id !== itemId)); // Remove the item from the list
        console.log(`Item with ID ${itemId} removed successfully.`);
      } else {
        const errorData = await response.json(); // Parse the error response
        console.error('Failed to remove the item:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`; // Format price with commas
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Log in or Register to view your account information.</div>;
  }

  const renderContent = () => {
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
      case 'Currently Listed':
        return (
          <div>
            <h4>Your Listed Items</h4>
            {listedItems.length === 0 ? (
              <p>There are no active listings.</p>
            ) : (
              <div className="listed-items-grid">
                {listedItems.map((item) => {
                  const imageUrl = `http://localhost:3001/uploads/images/${item.imagePath.split('/').pop()}`;
                  console.log('Constructed image URL:', imageUrl); // Log the image URL for debugging
                  return (
                    <div key={item.id} className="listed-item">
                      <img
                        src={imageUrl} // Use the constructed image URL
                        alt={item.title}
                        className="listed-item-image"
                      />
                      <div className="listed-item-info">
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                        <p>{formatPrice(item.price)}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEdit(item)} // Navigate to Edit Listing page with item data
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{
                              padding: '12px 30px', // Match padding with the Edit button
                              fontSize: '1rem', // Match font size with the Edit button
                              fontWeight: '600', // Match font weight with the Edit button
                              borderRadius: '50px', // Match border radius with the Edit button
                            }}
                            onClick={() => handleRemove(item.id)} // Remove the item
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
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
              🚹 Account Info
            </button>
            <button
              className={`list-group-item ${currentSection === 'Currently Listed' ? 'active' : ''}`}
              onClick={() => setCurrentSection('Currently Listed')}
            >
              📜 Currently Listed
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
