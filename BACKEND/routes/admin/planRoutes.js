import express from 'express';
import { getAllPlans, updatePlan } from '../../controllers/admin/planController.js';

const router = express.Router();

router.get('/', getAllPlans);
router.put('/:id', updatePlan);

export default router;
