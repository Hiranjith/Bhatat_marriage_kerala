import express from 'express';
import { register, login, refreshToken, logout, forgotPassword, getMe } from '../controllers/authController.js';
import { verifyUserSession } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

// Verify active session
router.get('/me', verifyUserSession, getMe);

export default router;
