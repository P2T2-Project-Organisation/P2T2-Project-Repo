import { UserLogin } from "../interfaces/UserLogin";
import auth from "../utils/auth"; // Import the auth utility

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to log in'); // Ensure the error message is thrown
    }

    const data = await response.json();
    auth.login(data.token); // Use auth.login to store the token
    return data;
  } catch (err) {
    console.log('Error from user login: ', err);
    return Promise.reject(err); // Pass the error to the caller
  }
};

export { login };
