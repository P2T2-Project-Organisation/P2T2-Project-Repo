import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

export default router;
