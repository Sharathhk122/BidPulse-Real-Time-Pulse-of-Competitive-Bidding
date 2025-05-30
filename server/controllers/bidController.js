// controllers/bidController.js
import Bid from '../models/Bid.js';
import catchAsync from '../utils/catchAsync.js';
// controllers/bidController.js
export const getBidsByUser = catchAsync(async (req, res) => {
  const bids = await Bid.find({ user: req.user.id })
    .populate({
      path: 'auction',
      select: 'title currentBid endTime status winner',
      populate: { 
        path: 'winner',
        select: 'username' 
      }
    })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bids.length,
    data: { bids }
  });
});