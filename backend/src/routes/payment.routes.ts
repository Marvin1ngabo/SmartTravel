import { Router } from 'express';
import { createPayment, getPaymentStatus, getUserPayments, getAllPayments } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createPayment);
router.get('/:id', authenticate, getPaymentStatus);
router.get('/user/history', authenticate, getUserPayments);
router.get('/admin/all', authenticate, getAllPayments);

export default router;
