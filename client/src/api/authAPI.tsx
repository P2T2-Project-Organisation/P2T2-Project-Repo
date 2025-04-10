import { UserLogin } from "../interfaces/UserLogin";
import auth from "../utils/auth";

const login = async (userInfo: UserLogin) => {
  try {
    console.log('Sending login request with:', userInfo);

    // Try multiple URLs in case one fails
    const urls = [
      '/auth/login',                    // Relative URL (preferred)
      'http://localhost:3001/auth/login' // Direct URL (fallback)
    ];

    let response = null;
    let lastError = null;

    // Try each URL until one works
    for (const url of urls) {
      try {
        console.log(`Attempting to connect to: ${url}`);
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        });
        
        // If the request didn't throw an error, break out of the loop
        break;
      } catch (err) {
        console.warn(`Connection failed to ${url}:`, err);
        lastError = err;
        // Continue to try the next URL
      }
    }

    // If all URLs failed, throw the last error
    if (!response) {
      throw lastError || new Error('Failed to connect to the server');
    }

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Login error response:', errorData);
      throw new Error(errorData.message || 'Failed to log in');
    }

    const data = await response.json();
    console.log('Login successful, received data:', data);
    auth.login(data.token);
    return data;
  } catch (err) {
    console.error('Error from user login:', err);
    return Promise.reject(err instanceof Error ? err : new Error('Failed to log in'));
  }
};

export { login };
