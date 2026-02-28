import { Router } from 'express';
import { createPayment, getPaymentStatus, getUserPayments, getAllPayments } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createPayment);
router.get('/user/history', authenticate, getUserPayments);
router.get('/admin/all', authenticate, getAllPayments);
router.get('/:id', authenticate, getPaymentStatus);

export default router;
