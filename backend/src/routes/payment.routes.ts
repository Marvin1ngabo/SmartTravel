import { Router } from 'express';
import { createPayment, getPaymentStatus } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createPayment);
router.get('/:id', authenticate, getPaymentStatus);

export default router;
