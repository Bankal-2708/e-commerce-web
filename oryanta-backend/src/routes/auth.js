import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register / Sign up
router.post('/register', register);
router.post('/signup', register);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Get current user profile
router.get('/me', protect, getMe);

export default router;

