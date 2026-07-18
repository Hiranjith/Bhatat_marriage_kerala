import express from 'express';
import { register, login, refreshToken, logout, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

export default router;
