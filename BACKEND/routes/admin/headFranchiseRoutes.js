import express from 'express';
import { getRequests, assignRequest } from '../../controllers/admin/headFranchiseController.js';

const router = express.Router();

router.get('/requests', getRequests);
router.post('/assign', assignRequest);

export default router;
