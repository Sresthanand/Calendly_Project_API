import express from 'express';
import { createMeeting, deleteMeeting, getMeetingsForUser, updateMeeting } from '../controllers/meeting.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Create a new meeting
router.post('/meeting', authenticate, createMeeting);

// Update an existing meeting
router.patch('/meeting/:id', authenticate, updateMeeting);

// Delete a meeting
router.delete('/meeting/:id', authenticate, deleteMeeting);

// Get a list of all meetings for a given user
router.get('/meeting/:userId', authenticate, getMeetingsForUser);

export default router;
