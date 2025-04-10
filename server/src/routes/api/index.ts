import { Router } from 'express';
import { userRouter } from './user-routes.js';
import paymentRoutes from './payment-routes.js';
import artworkRoutes from './artwork-routes.js';
import postRoutes from './post-routes.js';
import bidRoutes from './bid-routes.js';
import testRoutes from './test-routes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/payments', paymentRoutes);
router.use('/artworks', artworkRoutes);
router.use('/posts', postRoutes);
router.use('/bids', bidRoutes);
router.use('/test', testRoutes);

export default router;
