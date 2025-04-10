import { useEffect, useState } from 'react';
import auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const categories = [
  "CITYSCAPES",
  "IMPRESSIONISM",
  "ANIMALS",
  "ESSENTIALS",
  "AFRICAN DIASPORA",
  "FASHION",
  "CHICAGO ARTISTS",
  "POP ART",
  "MYTHOLOGY",
  "SURREALISM",
  "ARMS AND ARMOR",
  "PORTRAITS",
  "MASKS",
  "DRINKING AND DINING",
  "FURNITURE",
  "ARCHITECTURE",
  "LANDSCAPES",
  "ART DECO",
  "ANCIENT",
  "MINIATURE",
  "WOODBLOCK PRINT",
  "STILL LIFE",
  "MODERNISM",
];

const Sell = () => {
  const [loggedIn, setLoggedIn] = useState(auth.loggedIn());
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    artist: '',
    year: '',
    description: '',
    dimensions: '',
    price: '',
    image: null as File | null,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  if (!loggedIn) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          margin: '0 auto', // Ensure horizontal centering
        }}
      >
        <h2>Please Register or Login to have access to this page</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/Login')}
          >
            Login
          </button>
          <button
            className="btn"
            style={{
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/Register')}
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(null); // Clear error message when user starts editing
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
      setErrorMessage(null); // Clear error message when user selects a file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value as string | Blob);
    });

    try {
      const response = await fetch('/api/artworks/list', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.getToken()}`, // Include the token in the Authorization header
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error listing artwork:', errorData);
        setErrorMessage(errorData.message || 'Failed to list artwork.');
        return;
      }

      const data = await response.json();
      console.log('Artwork listed successfully:', data);
      navigate('/AccountPage', { state: { currentSection: 'Currently Listed' } }); // Redirect to "Currently Listed"
    } catch (error) {
      console.error('Error listing artwork:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="sell-container wide-form"> {/* Add a new class for wider forms */}
      <h1 className="sell-header">Sell Your Artwork</h1>
      <form className="sell-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Category Selector */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">Select Category</label>
            <select id="category" name="category" className="form-select" value={formData.category} onChange={handleChange}>
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" id="title" name="title" className="form-input" placeholder="Enter title" value={formData.title} onChange={handleChange} required />
          </div>

          {/* Price Field */}
          <div className="form-group">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="number" id="price" name="price" className="form-input" max="1000000" placeholder="Enter price" value={formData.price} onChange={handleChange} required />
          </div>

          {/* Description Field */}
          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea id="description" name="description" className="form-textarea" placeholder="Enter description" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          {/* Image Upload Field */}
          <div className="form-group full-width">
            <label htmlFor="image" className="form-label">Upload Image</label>
            <input type="file" id="image" name="image" className="form-input" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {errorMessage && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
            {errorMessage}
          </p>
        )}

        {/* List Button */}
        <div className="form-group">
          <button type="submit" className="btn btn-success btn-list">List Artwork</button>
        </div>
      </form>
    </div>
  );
};

export default Sell;
