import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const EditListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item || {}; // Retrieve the passed listing data

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    category: string;
    image: File | null; // Explicitly set the type to File | null
    currentImage: string;
  }>({
    title: item.title || '',
    description: item.description || '',
    price: item.price || '',
    category: item.category || '',
    image: null, // Image will not be prepopulated
    currentImage: item.imagePath || '', // Store the current image path
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('category', formData.category);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const response = await fetch(`/api/artworks/${item.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
        },
        body: form,
      });

      if (response.ok) {
        navigate('/AccountPage', { state: { currentSection: 'Currently Listed' } }); // Redirect to "Currently Listed"
      } else {
        console.error('Failed to update listing');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  return (
    <div
      className="sell-container"
      style={{
        maxWidth: '1600px', // Further increase the width
        height: 'auto', // Allow height to adjust automatically
        padding: '5px 10px', // Further reduce vertical padding for a shorter appearance
        margin: '0 auto', // Center the form
      }}
    >
      <h2 className="sell-header">Edit Your Listing</h2>
      <form className="sell-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-input"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-input"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <label className="form-label">Current Image</label>
            <img
              src={`http://localhost:3001/uploads/images/${formData.currentImage}`}
              alt="Current Listing"
              style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label className="form-label">Upload New Image</label>
            <input
              type="file"
              className="form-input"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">
          Update Your Listing
        </button>
      </form>
    </div>
  );
};

export default EditListing;
