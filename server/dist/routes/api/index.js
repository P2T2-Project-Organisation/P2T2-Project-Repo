import { Router } from 'express';
import { userRouter } from './user-routes.js';
import paymentRoutes from './payment-routes.js';
import testRoutes from './test-routes.js'; // Import test routes
const router = Router();
router.use('/users', userRouter);
router.use('/payments', paymentRoutes);
router.use('/test', testRoutes); // Add test routes
export default router;
