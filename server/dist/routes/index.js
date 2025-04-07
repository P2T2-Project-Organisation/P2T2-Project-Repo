import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
// Ensure /auth routes (e.g., /register, /login) are not protected
router.use('/auth', authRoutes);
// Protect /api routes with the authenticateToken middleware
router.use('/api', authenticateToken, apiRoutes);
export default router;
