import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';  // Import the User model
import jwt from 'jsonwebtoken';  // Import the JSON Web Token library
import bcrypt from 'bcrypt';  // Import the bcrypt library for password hashing

// Login function to authenticate a user
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;  // Extract username and password from request body

  try {
    console.log('Login request received:', { username }); // Log the incoming request

    // Find the user in the database by username
    const user = await User.findOne({
      where: { username },
    });

    // If user is not found, send an authentication failed response
    if (!user) {
      console.error('User not found:', username);
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    // Compare the provided password with the stored hashed password
    const passwordIsValid = await bcrypt.compare(password, user.password);

    // If password is invalid, send an authentication failed response
    if (!passwordIsValid) {
      console.error('Invalid password for user:', username);
      return res.status(401).json({ message: 'Authentication failed: Invalid password' });
    }

    // Get the secret key from environment variables
    const secretKey = process.env.JWT_SECRET_KEY || '';
    if (!secretKey) {
      console.error('JWT_SECRET_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'Internal server error: Missing JWT secret key' });
    }

    // Include `id` and `username` in the token payload
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });  // Send the token and user info as a JSON response
  } catch (error: any) {
    console.error('Error during login:', error.message); // Log the error
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Register function to create a new user
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    console.log('Register request received:', { username, email }); // Log the incoming request

    // Check if the username is already in use
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      console.error('Username already in use:', username);
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Check if the email is already in use
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      console.error('Email already in use:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Validate password
    if (!password || password.length < 6) {
      console.error('Password validation failed');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log('User registered successfully:', { id: newUser.id, username: newUser.username });
    return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (error: any) {
    console.error('Error during registration:', error.message, error.stack); // Log the error with stack trace
    return res.status(500).json({ message: error.message || 'Internal server error' }); // Return detailed error message
  }
};

// Create a new router instance
const router = Router();

// POST /login - Login a user
router.post('/login', login);  // Define the login route

// POST /register - Register a new user
router.post('/register', register); // Ensure no authentication middleware is applied here

export default router;  // Export the router instance
