import { Router } from 'express';
import { getInsuranceOptions, createPolicy } from '../controllers/insurance.controller.js';

const router = Router();

router.get('/options', getInsuranceOptions);
router.post('/policy', createPolicy);

export default router;
