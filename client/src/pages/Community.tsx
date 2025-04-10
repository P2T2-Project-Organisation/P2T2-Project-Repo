import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

interface Post {
  id: number;
  title: string;
  content: string;
  imagePath?: string;
  userId: number;
  createdAt: string;
  User: {
    username: string;
  };
}

const Community = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!auth.loggedIn()) {
      navigate('/Login');
      return;
    }
    
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load community posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const form = new FormData();
      form.append('title', formData.title);
      form.append('content', formData.content);
      if (formData.image) {
        form.append('image', formData.image);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        image: null,
      });
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get image URL
  const getImageSrc = (imagePath: string): string => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `/uploads/images/${imagePath.split('/').pop()}`;
  };

  if (!auth.loggedIn()) {
    return null; // The useEffect will handle redirection
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Main content column */}
        <div className="col-md-8 mb-4">
          {/* Restore header with emoji */}
          <div className="d-flex align-items-center mb-3">
            <span style={{ fontSize: '2rem', marginRight: '15px' }}>👨‍👩‍👧‍👦</span>
            <h2>Community Forum</h2>
          </div>
          
          {/* Restore horizontal line */}
          <hr className="mb-4" />
          
          {/* Post list section */}
          <div className="post-list">
            {loading ? (
              <p className="text-center">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center">No posts yet. Be the first to share!</p>
            ) : (
              <div className="post-list">
                {posts.map(post => (
                  <div key={post.id} className="card mb-3">
                    <div className="card-header d-flex justify-content-between">
                      <h5 className="m-0">{post.title}</h5>
                      <small>By {post.User.username} on {formatDate(post.createdAt)}</small>
                    </div>
                    
                    <div className="card-body">
                      <p className="card-text">{post.content}</p>
                      
                      {post.imagePath && (
                        <img
                          src={getImageSrc(post.imagePath)}
                          alt="Post image"
                          className="img-fluid rounded mt-2"
                          style={{ maxHeight: '300px' }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar column */}
        <div className="col-md-4">
          <div style={{ 
            position: 'sticky',  // Use sticky positioning instead of fixed
            top: '100px',       // Keep some distance from the top (below navbar)
            zIndex: 1,
            width: '100%',
            marginBottom: '20px'
          }}>
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create Post</h5>
              </div>
              <div className="card-body">
                {/* Post form */}
                <form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Message*</label>
                    <textarea
                      className="form-control"
                      id="content"
                      name="content"
                      rows={4}
                      value={formData.content}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100">
                    Post Message
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Recent messages section */}
          <div className="recent-messages">
            {/* ...existing code for recent messages... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
