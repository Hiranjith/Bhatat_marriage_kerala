import express from 'express';
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  loginStaff
} from '../../controllers/admin/staffController.js';

const router = express.Router();

router.post('/login', loginStaff);
router.post('/', createStaff);
router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
