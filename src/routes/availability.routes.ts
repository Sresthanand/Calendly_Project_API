import express from 'express';
import { createAvailability, deleteAvailability, getAvailability, updateAvailability } from '../controllers/availability.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/availability', authenticate, createAvailability);

router.patch('/availability/:id', authenticate, updateAvailability);

router.delete('/availability/:id', authenticate, deleteAvailability);


router.get('/availability/:userId', authenticate, getAvailability);

export default router;
