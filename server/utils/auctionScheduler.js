import mongoose from 'mongoose';
import Auction from '../models/Auction.js';
import Bid from '../models/Bid.js';
import { completeAuction } from '../controllers/auctionController.js';
const closeExpiredAuctions = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const now = new Date();
    const expiredAuctions = await Auction.find({
      status: 'active',
      endTime: { $lte: now }
    }).session(session);

    for (const auction of expiredAuctions) {
      const winningBid = await Bid.findOne({ auction: auction._id })
        .sort('-amount')
        .session(session);

      if (winningBid && winningBid.amount >= auction.reservePrice) {
        auction.winner = winningBid.user;
        auction.status = 'completed';
        auction.currentBid = winningBid.amount;

        winningBid.isWinner = true;
        await winningBid.save({ session });

        auction.bids.forEach(bid => {
          if (bid._id.equals(winningBid._id)) {
            bid.isWinner = true;
          }
        });

        await auction.save({ session });
        await completeAuction(auction._id, session); // Pass session
      } else {
        auction.status = 'completed';
        await auction.save({ session });
      }
    }

    await session.commitTransaction();
    console.log('Successfully closed expired auctions');
  } catch (error) {
    await session.abortTransaction();
    console.error('Auction closure error:', error);
  } finally {
    session.endSession();
  }
};
export default closeExpiredAuctions;
