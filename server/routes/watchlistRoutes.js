// routes/watchlistRoutes.js
import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from '../controllers/watchlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWatchlist)
  .post(addToWatchlist);

router.route('/:id')
  .delete(removeFromWatchlist);

export default router;