import express from 'express';
import { 
  getUserDetailsByProfileId, 
  updateUserDetailsByProfileId,
  getPlanetaryPositions,
  updatePlanetaryPositions
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/profile/:profileId
router.get('/profile/:profileId', getUserDetailsByProfileId);

// PUT /api/users/profile/:profileId
router.put('/profile/:profileId', updateUserDetailsByProfileId);

// GET /api/users/profile/:profileId/planetary-positions
router.get('/profile/:profileId/planetary-positions', getPlanetaryPositions);

// PUT /api/users/profile/:profileId/planetary-positions
router.put('/profile/:profileId/planetary-positions', updatePlanetaryPositions);

export default router;
