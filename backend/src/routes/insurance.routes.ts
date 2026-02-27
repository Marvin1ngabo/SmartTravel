import { Router } from 'express';
import { getInsuranceOptions, createPolicy } from '../controllers/insurance.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/options', getInsuranceOptions);
router.post('/policy', authenticate, createPolicy);

export default router;
