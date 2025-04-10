import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

interface Bid {
  id: number;
  artworkId: number;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  userId: number;
  User: {
    username: string;
  };
  Artwork: {
    id: number;
    title: string;
    description: string;
    price: number;
    imagePath: string;
  };
}

const Offers = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fadingBids, setFadingBids] = useState<number[]>([]);

  useEffect(() => {
    if (!auth.loggedIn()) {
      navigate('/Login');
      return;
    }
    
    fetchBids();
  }, [navigate]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/bids/received', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bids');
      }

      const data = await response.json();
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError('Failed to load offers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bid: Bid) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const response = await fetch(`/api/bids/${bid.id}/accept`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept bid');
      }

      // Add the bid to fading list first
      setFadingBids(prev => [...prev, bid.id]);
      
      // After a short delay, remove all bids for the same artwork
      setTimeout(() => {
        setBids(prevBids => prevBids.filter(item => item.artworkId !== bid.artworkId));
      }, 500);
      
    } catch (error) {
      console.error('Error accepting bid:', error);
      setError('Failed to accept offer. Please try again.');
    }
  };

  const handleReject = async (bid: Bid) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const response = await fetch(`/api/bids/${bid.id}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject bid');
      }

      // Add the bid to fading list first
      setFadingBids(prev => [...prev, bid.id]);
      
      // After a short delay, remove just this bid
      setTimeout(() => {
        setBids(prevBids => prevBids.filter(item => item.id !== bid.id));
      }, 500);
      
    } catch (error) {
      console.error('Error rejecting bid:', error);
      setError('Failed to reject offer. Please try again.');
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-4" style={{ display: "block" }}>
      <div className="text-center mb-5 pt-3">
        <h2 style={{ fontSize: "2.5rem" }}>💸 Offers</h2>
        <hr className="my-4" />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : bids.length === 0 ? (
        <div className="text-center">
          <h4>You currently have no bids.</h4>
        </div>
      ) : (
        <div className="row">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className={`col-md-6 mb-4 bid-card ${fadingBids.includes(bid.id) ? 'fade-out' : 'fade-in'}`}
            >
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="m-0">{bid.Artwork.title}</h5>
                  <small>Bid by {bid.User.username} on {formatDate(bid.createdAt)}</small>
                </div>
                
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <p className="card-text">{bid.Artwork.description}</p>
                      <p>
                        <strong>Listed price:</strong> {formatPrice(bid.Artwork.price)}
                      </p>
                      <p className="text-success fw-bold">
                        <strong>Bid amount:</strong> {formatPrice(bid.amount)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-success" 
                    onClick={() => handleAccept(bid)}
                    style={{ 
                      backgroundColor: '#28a745', // Explicitly set green color
                      borderColor: '#28a745',
                      color: 'white'
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(bid)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
