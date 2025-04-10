import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('Authorization header missing');
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!secretKey) {
    console.error('JWT_SECRET_KEY is not defined in environment variables');
    return res.status(500).json({ message: 'Internal server error: Missing JWT secret key' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    const user = decoded as JwtPayload;

    if (!user || !user.id || !user.username) {
      console.error('JWT verification returned invalid user payload');
      res.status(403).json({ message: 'Invalid token payload' });
      return;
    }

    req.user = user; // Attach the user to the request object
    console.log('JWT verified successfully:', user);
    next();
  });

  return;
};
