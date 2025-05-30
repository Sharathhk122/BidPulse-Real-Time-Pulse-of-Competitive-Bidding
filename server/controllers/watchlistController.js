// controllers/watchlistController.js
import Watchlist from '../models/Watchlist.js';
import Auction from '../models/Auction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getWatchlist = catchAsync(async (req, res) => {
  const watchlist = await Watchlist.find({ user: req.user.id })
    .populate({
      path: 'auction',
      match: { status: 'active' },
      select: 'title images currentBid endTime category'
    });

  const filteredWatchlist = watchlist.filter(item => item.auction !== null);

  res.status(200).json({
    status: 'success',
    results: filteredWatchlist.length,
    data: { watchlist: filteredWatchlist }
  });
});

export const addToWatchlist = catchAsync(async (req, res) => {
  const { auctionId } = req.body;

  const auction = await Auction.findById(auctionId);
  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  const existingItem = await Watchlist.findOne({
    user: req.user.id,
    auction: auctionId
  });

  if (existingItem) {
    return next(new AppError('Auction already in watchlist', 400));
  }

  const watchlistItem = await Watchlist.create({
    user: req.user.id,
    auction: auctionId
  });

  res.status(201).json({
    status: 'success',
    data: { watchlistItem }
  });
});

export const removeFromWatchlist = catchAsync(async (req, res) => {
  const watchlistItem = await Watchlist.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!watchlistItem) {
    return next(new AppError('No item found in your watchlist with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});