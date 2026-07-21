import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getUserDetailsByProfileId, 
  updateUserDetailsByProfileId,
  getPlanetaryPositions,
  updatePlanetaryPositions,
  uploadUserPhoto,
  deleteUserPhoto,
  getUserPhotos,
  getPartnerPreferences,
  updatePartnerPreferences,
  updateUserSettings,
  resetPassword,
  getProfileCompletion
} from '../controllers/userController.js';
import { verifyUserSession } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply the middleware to all user routes to ensure they are logged in
router.use(verifyUserSession);

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.params.profileId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET /api/users/profile/:profileId
router.get('/profile/:profileId', getUserDetailsByProfileId);

// PUT /api/users/profile/:profileId
router.put('/profile/:profileId', updateUserDetailsByProfileId);

// GET /api/users/profile/:profileId/planetary-positions
router.get('/profile/:profileId/planetary-positions', getPlanetaryPositions);

// PUT /api/users/profile/:profileId/planetary-positions
router.put('/profile/:profileId/planetary-positions', updatePlanetaryPositions);

// GET /api/users/profile/:profileId/photos
router.get('/profile/:profileId/photos', getUserPhotos);

// POST /api/users/profile/:profileId/photos
router.post('/profile/:profileId/photos', upload.single('photo'), uploadUserPhoto);

// DELETE /api/users/profile/:profileId/photos/:slot
router.delete('/profile/:profileId/photos/:slot', deleteUserPhoto);

// GET /api/users/profile/:profileId/partner-preferences
router.get('/profile/:profileId/partner-preferences', getPartnerPreferences);

// PUT /api/users/profile/:profileId/partner-preferences
router.put('/profile/:profileId/partner-preferences', updatePartnerPreferences);

// PUT /api/users/profile/:profileId/settings
router.put('/profile/:profileId/settings', updateUserSettings);

// PUT /api/users/profile/:profileId/reset-password
router.put('/profile/:profileId/reset-password', resetPassword);

// GET /api/users/profile/:profileId/completion
router.get('/profile/:profileId/completion', getProfileCompletion);

export default router;
