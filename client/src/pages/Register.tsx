import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<{ username?: string; email?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: '' }); // Clear error for the field being edited
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Submitting registration form with:', formData); // Log form data

      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Registration response status:', response.status); // Log response status

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Registration error response:', errorData); // Log error response
        if (errorData.message === 'Username already in use') {
          setError({ username: 'Username is taken' });
        } else if (errorData.message === 'Email already in use') {
          setError({ email: 'Email is already registered' });
        } else {
          throw new Error(errorData.message || 'Failed to register');
        }
        return;
      }

      console.log('User registered successfully');
      navigate('/Login');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="container">
      <h2
        className="text-center"
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '30px', // Add spacing below the header
          marginTop: '-50px', // Move the header further up
        }}
      >
        Register
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {error.username && <p style={{ color: 'red' }}>{error.username}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {error.email && <p style={{ color: 'red' }}>{error.email}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;