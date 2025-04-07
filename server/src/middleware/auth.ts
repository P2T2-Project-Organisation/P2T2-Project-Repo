import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the interface for the JWT payload
interface JwtPayload {
  username: string;
}

// Middleware function to authenticate JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    if (!user) {
      return res.sendStatus(403); // Ensure all paths return a response
    }

    req.user = user as JwtPayload;
    return next(); // Proceed if everything is fine
  });

  return; // Ensures TypeScript knows all paths return
};

// Ensure this middleware is not applied to the /register route in your server setup
// Example in your server entry file:
// app.use('/api/register', register); // No middleware here
