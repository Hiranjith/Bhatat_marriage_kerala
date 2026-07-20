import express from 'express';
import {
  createFranchise,
  getAllFranchises,
  getFranchiseById,
  updateFranchise,
  updateFranchisePincodes,
  deleteFranchise
} from '../../controllers/admin/franchiseController.js';

const router = express.Router();

router.post('/', createFranchise);
router.get('/', getAllFranchises);
router.get('/:franchise_id', getFranchiseById);
router.put('/:franchise_id', updateFranchise);
router.patch('/:franchise_id/pincodes', updateFranchisePincodes);
router.delete('/:franchise_id', deleteFranchise);

export default router;
