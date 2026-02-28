import { Router } from 'express';
import { register, login, getProfile, verifyEmail, resendVerificationCode } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);
router.get('/profile', authenticate, getProfile);

export default router;
