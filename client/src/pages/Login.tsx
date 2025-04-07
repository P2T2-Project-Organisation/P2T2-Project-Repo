import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import Auth from '../utils/auth';
import { login } from '../api/authAPI';
import type { UserLogin } from '../interfaces/UserLogin';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<{ username?: string; password?: string; form?: string }>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    setError({ ...error, [name]: '' }); // Clear error for the field being edited
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if username or password is empty
    if (!loginData.username || !loginData.password) {
      setError({ username: '', password: '', form: 'Enter username and password to continue' });
      return;
    }

    try {
      const data = await login(loginData);
      Auth.login(data.token); // Store the token in localStorage

      // Trigger a storage event to update the Navbar's loggedIn state
      window.dispatchEvent(new Event('storage'));

      console.log('User logged in successfully');
      navigate('/'); // Redirect to the home page after successful login
    } catch (err: any) {
      if (err.message === 'Authentication failed: User not found') {
        setError({ username: 'Username does not exist' }); // Ensure this error is set
      } else if (err.message === 'Authentication failed: Invalid password') {
        setError({ password: 'Password is incorrect' }); // Ensure this error is set
      } else {
        console.error('Failed to login', err);
      }
    }
  };

  return (
    <div className='form-container'>
      <form className='form login-form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className='form-group'>
          <label>Username</label>
          <input
            className='form-input'
            type='text'
            name='username'
            value={loginData.username || ''}
            onChange={handleChange}
          />
          {error.username && <p style={{ color: 'red' }}>{error.username}</p>}
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            className='form-input'
            type='password'
            name='password'
            value={loginData.password || ''}
            onChange={handleChange}
          />
          {error.password && <p style={{ color: 'red' }}>{error.password}</p>}
        </div>
        {error.form && <p style={{ color: 'red', textAlign: 'center' }}>{error.form}</p>}
        <div className='form-group'>
          <button className='btn btn-primary' type='submit'>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
