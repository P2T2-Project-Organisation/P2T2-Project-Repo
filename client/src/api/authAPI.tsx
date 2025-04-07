import { UserLogin } from "../interfaces/UserLogin";
import auth from "../utils/auth";

const login = async (userInfo: UserLogin) => {
  try {
    console.log('Sending login request with:', userInfo); // Log request data

    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Login response status:', response.status); // Log response status

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Login error response:', errorData); // Log error response
      throw new Error(errorData.message || 'Failed to log in');
    }

    const data = await response.json();
    console.log('Login successful, received data:', data); // Log success response
    auth.login(data.token);
    return data;
  } catch (err) {
    console.error('Error from user login:', err); // Log error
    return Promise.reject(err);
  }
};

export { login };
