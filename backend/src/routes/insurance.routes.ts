import { Router } from 'express';
import { 
  getInsuranceOptions, 
  createPolicy, 
  createInsurancePlan, 
  updateInsurancePlan, 
  deleteInsurancePlan,
  getAllUsers 
} from '../controllers/insurance.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/options', getInsuranceOptions);
router.post('/policy', authenticate, createPolicy);
router.post('/plans', authenticate, createInsurancePlan);
router.put('/plans/:id', authenticate, updateInsurancePlan);
router.delete('/plans/:id', authenticate, deleteInsurancePlan);
router.get('/admin/users', authenticate, getAllUsers);

export default router;
