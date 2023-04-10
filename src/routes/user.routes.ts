import express from 'express';
import { createUser, getUserDetails } from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

// Create a new user
router.post('/user', createUser);

// Get user details
router.get('/user/:id', authenticateUser, getUserDetails);

export default router;
