import express from 'express';
import franchiseRoutes from './admin/franchiseRoutes.js';
import dashboardRoutes from './admin/dashboardRoutes.js';
import staffRoutes from './admin/staffRoutes.js';
import customerRoutes from './admin/customerRoutes.js';
import planRoutes from './admin/planRoutes.js';
import headFranchiseRoutes from './admin/headFranchiseRoutes.js';

const router = express.Router();

// Mount all admin related routes here
router.use('/franchises', franchiseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/staff', staffRoutes);
router.use('/customers', customerRoutes);
router.use('/plans', planRoutes);
router.use('/head-franchise', headFranchiseRoutes);

export default router;
