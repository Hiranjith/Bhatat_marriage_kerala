import express from 'express';
import { getCustomers, forceLogout, updateCustomer } from '../../controllers/admin/customerController.js';

const router = express.Router();

// Get all customers with filters and pagination
router.get('/', getCustomers);

// Force logout a user
router.post('/force-logout/:id', forceLogout);

// Update customer verification and status
router.put('/:id', updateCustomer);

export default router;
