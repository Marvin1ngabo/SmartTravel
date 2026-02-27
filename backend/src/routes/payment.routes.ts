import { Router } from 'express';
import { createPayment, getPaymentStatus } from '../controllers/payment.controller.js';

const router = Router();

router.post('/', createPayment);
router.get('/:id', getPaymentStatus);

export default router;
