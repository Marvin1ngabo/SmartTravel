import { Router } from 'express';
import paymentRoutes from './payment.routes.js';
import insuranceRoutes from './insurance.routes.js';

const router = Router();

router.use('/payments', paymentRoutes);
router.use('/insurance', insuranceRoutes);

export default router;
