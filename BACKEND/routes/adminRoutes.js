import express from 'express';
import franchiseRoutes from './admin/franchiseRoutes.js';
import dashboardRoutes from './admin/dashboardRoutes.js';
import staffRoutes from './admin/staffRoutes.js';

const router = express.Router();

// Mount all admin related routes here
router.use('/franchises', franchiseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/staff', staffRoutes);

export default router;
