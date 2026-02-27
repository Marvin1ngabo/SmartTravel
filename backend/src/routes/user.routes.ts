import { Router } from 'express';
import { updateOnboarding } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.put('/onboarding', authenticate, updateOnboarding);

export default router;
