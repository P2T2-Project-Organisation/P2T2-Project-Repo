import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
import paymentRoutes from './api/payment-routes.js';
import express from 'express';
import { User } from '../models/index.js';
const router = Router();
// Create a special router for user/me endpoint that doesn't require authentication
const userMeRouter = express.Router();
userMeRouter.get('/me', async (req, res) => {
    try {
        // Check if Authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        // Verify token manually
        const jwt = await import('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET_KEY || '';
        if (!secretKey) {
            return res.status(500).json({ message: 'Server configuration error' });
        }
        try {
            const decoded = jwt.default.verify(token, secretKey);
            const userId = decoded.id;
            const user = await User.findByPk(userId, {
                attributes: ['username', 'email', 'createdAt'],
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        }
        catch (error) {
            console.error('Token verification failed:', error);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
    }
    catch (error) {
        console.error('Error in /api/users/me route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
// Ensure /auth routes (e.g., /register, /login) are not protected
router.use('/auth', authRoutes);
// Special routes that need special handling
router.use('/api/payments', paymentRoutes);
router.use('/api/users', userMeRouter);
// Protect the rest of /api routes with the authenticateToken middleware
router.use('/api', authenticateToken, apiRoutes);
export default router;
