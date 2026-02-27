import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import paymentRoutes from './payment.routes.js';
import insuranceRoutes from './insurance.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/insurance', insuranceRoutes);

export default router;
