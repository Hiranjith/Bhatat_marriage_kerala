import express from 'express';
import { getDashboardMetrics } from '../../controllers/admin/dashboardController.js';

const router = express.Router();

router.get('/metrics', getDashboardMetrics);

export default router;
