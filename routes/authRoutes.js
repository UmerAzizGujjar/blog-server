import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * Authentication Routes
 * POST /api/auth/signup - Register new user
 * POST /api/auth/login - Login user
 */

router.post('/signup', signup);
router.post('/login', login);

export default router;
