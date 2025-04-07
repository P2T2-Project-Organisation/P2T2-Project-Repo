import { Router } from 'express';
import { userRouter } from './user-routes.js';
import paymentRoutes from './payment-routes.js'; // Import payment routes

const router = Router();

router.use('/users', userRouter);
router.use('/payments', paymentRoutes); // Add payment routes

export default router;
