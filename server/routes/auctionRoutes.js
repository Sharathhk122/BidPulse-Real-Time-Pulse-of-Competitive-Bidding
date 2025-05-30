import express from 'express';
import {
  createAuction,
  getAllAuctions,
  getAuction,
  updateAuction,
  deleteAuction,
  placeBid,
  buyNow
} from '../controllers/auctionController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import { upload, handleUploadErrors } from '../utils/upload.js';

const router = express.Router(); // ✅ Declare router BEFORE using it

// Route: /api/auctions
router.route('/')
  .get(getAllAuctions)
  .post(
    protect,
    restrictTo('seller'),
    upload.array('images', 5),
    handleUploadErrors,
    createAuction
  );

// Route: /api/auctions/:id
router.route('/:id')
  .get(getAuction)
  .patch(protect, restrictTo('seller'), updateAuction)
  .delete(protect, restrictTo('seller'), deleteAuction);

// Place a bid on an auction
router.post('/:id/bids', protect, placeBid);

// Buy now route
router.post('/:id/buy-now', protect, buyNow);

export default router;
