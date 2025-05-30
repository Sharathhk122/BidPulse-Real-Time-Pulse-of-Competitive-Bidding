import Auction from '../models/Auction.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import CustomerList from '../models/CustomerList.js';

// CREATE AUCTION
export const createAuction = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    category,
    startingBid,
    reservePrice,
    buyNowPrice,
    endTime
  } = req.body;

  if (!req.files || req.files.length === 0) {
    return next(new AppError('Please upload at least one image', 400));
  }

  let imageUrls = [];

  try {
    const imageUploadPromises = req.files.map(file => uploadToCloudinary(file.path));
    const uploadedImages = await Promise.all(imageUploadPromises);
    imageUrls = uploadedImages.map(img => img.secure_url);
  } catch (uploadError) {
    console.error('Cloudinary upload failed:', uploadError);
    return next(new AppError('Failed to upload images. Please try again.', 500));
  }

  const auction = await Auction.create({
    title,
    description,
    images: imageUrls,
    category,
    startingBid,
    currentBid: startingBid,
    reservePrice,
    buyNowPrice,
    endTime: new Date(endTime),
    seller: req.user.id,
    status: 'active'
  });

  req.app.get('io').to(auction.id).emit('auctionUpdate', auction);

  res.status(201).json({
    status: 'success',
    data: { auction }
  });
});

// GET ALL AUCTIONS
export const getAllAuctions = catchAsync(async (req, res, next) => {
  const { category, search, status, minPrice, maxPrice, sort } = req.query;

  const queryObj = {};

  if (category) queryObj.category = category;
  if (search) queryObj.$text = { $search: search };
  if (status) {
    if (!['active', 'completed'].includes(status)) {
      return next(new AppError('Invalid status parameter', 400));
    }
    queryObj.status = status;
  }

  if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
    return next(new AppError('Invalid price filter value', 400));
  }

  if (minPrice || maxPrice) {
    queryObj.currentBid = {};
    if (minPrice) queryObj.currentBid.$gte = Number(minPrice);
    if (maxPrice) queryObj.currentBid.$lte = Number(maxPrice);
  }

  let query = Auction.find(queryObj).populate('seller', 'username');

  switch (sort) {
    case 'newest':
      query = query.sort('-createdAt');
      break;
    case 'ending':
      query = query.sort('endTime');
      break;
    case 'highest':
      query = query.sort('-currentBid');
      break;
    case 'lowest':
      query = query.sort('currentBid');
      break;
  }

  const auctions = await query;

  res.status(200).json({
    status: 'success',
    results: auctions.length,
    data: { auctions }
  });
});

// GET SINGLE AUCTION
export const getAuction = catchAsync(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id)
    .populate('seller', 'username profilePhoto')
    .populate('winner', 'username')
    .populate('bids.user', 'username profilePhoto');

  if (!auction) return next(new AppError('No auction found with that ID', 404));

  res.status(200).json({ status: 'success', data: { auction } });
});

// UPDATE AUCTION
export const updateAuction = catchAsync(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) return next(new AppError('No auction found with that ID', 404));
  if (auction.seller.toString() !== req.user.id) return next(new AppError('Unauthorized', 403));
  if (auction.bids.length > 0) return next(new AppError('Auction has bids', 400));

  const updatedAuction = await Auction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ status: 'success', data: { auction: updatedAuction } });
});

// DELETE AUCTION
export const deleteAuction = catchAsync(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) return next(new AppError('No auction found with that ID', 404));
  if (auction.seller.toString() !== req.user.id) return next(new AppError('Unauthorized', 403));
  if (auction.bids.length > 0) return next(new AppError('Auction has bids', 400));

  await Auction.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});

// PLACE BID
export const placeBid = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const auction = await Auction.findById(req.params.id);

  if (!auction) return next(new AppError('Auction not found', 404));
  if (!auction.isActive()) return next(new AppError('Auction inactive', 400));
  if (amount <= auction.currentBid) return next(new AppError('Bid must be higher than current bid', 400));

  try {
    // Try to find and update existing bid, or create new one
    const bid = await Bid.findOneAndUpdate(
      { auction: auction._id, user: req.user.id },
      { amount },
      { new: true, upsert: true }
    );

    // Update auction's current bid and bids array
    auction.currentBid = amount;
    auction.bids = auction.bids.filter(b => b.user.toString() !== req.user.id);
    auction.bids.push({ user: req.user.id, amount, time: Date.now() });
    await auction.save();

    req.app.get('io').emit('bidUpdate', auction);

    res.status(201).json({ 
      status: 'success', 
      data: { bid } 
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('You already have a bid on this auction', 400));
    }
    next(err);
  }
});
// ... (keep all existing imports and other functions)

// BUY NOW
export const buyNow = catchAsync(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id)
    .populate('seller', 'username')
    .populate('winner', 'username');

  if (!auction) return next(new AppError('Auction not found', 404));
  if (!auction.buyNowPrice) return next(new AppError('No buy now option', 400));
  if (!auction.isActive()) return next(new AppError('Auction inactive', 400));

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    auction.status = 'completed';
    auction.winner = req.user.id;
    auction.currentBid = auction.buyNowPrice;
    await auction.save({ session });

    // Add to customer's list with session
    await CustomerList.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { items: { auction: auction._id } } },
      { upsert: true, session }
    );

    await session.commitTransaction();

    // Emit socket event
    req.app.get('io').emit('auctionUpdate', auction);

    res.status(200).json({ 
      status: 'success', 
      data: { auction } 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Buy Now error:', error);
    next(error);
  } finally {
    session.endSession();
  }
});
// Helper function to complete auctions (for scheduler)
export const completeAuction = async (auctionId, session = null) => {
  try {
    const auction = await Auction.findById(auctionId)
      .populate('seller', 'username')
      .populate('winner', 'username');

    if (auction && auction.winner) {
      const updateOptions = { 
        upsert: true, 
        new: true,
        ...(session && { session }) // Include session if provided
      };

      const customerList = await CustomerList.findOneAndUpdate(
        { user: auction.winner._id },
        { $addToSet: { items: { auction: auction._id } } },
        updateOptions
      ).populate({
        path: 'items.auction',
        select: 'title description images category currentBid seller winner',
        populate: [
          { path: 'seller', select: 'username' },
          { path: 'winner', select: 'username' }
        ]
      });

      console.log('CustomerList updated:', customerList); // Add logging
      return customerList;
    }
  } catch (err) {
    console.error('Error in completeAuction:', err);
    throw err;
  }
};