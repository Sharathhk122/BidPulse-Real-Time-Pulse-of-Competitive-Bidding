// routes/bidRoutes.js
import express from 'express';
import { protect } from '../controllers/authController.js';
import { getBidsByUser } from '../controllers/bidController.js';

const router = express.Router();

router.get('/', protect, getBidsByUser);

export default router;