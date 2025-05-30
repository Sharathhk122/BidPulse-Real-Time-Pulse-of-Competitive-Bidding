import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    required: [true, 'Please upload at least one image']
  }],
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Art', 'Electronics', 'Furniture', 'Jewelry', 'Collectibles', 'Other']
  },
  startingBid: {
    type: Number,
    required: [true, 'Please provide a starting bid'],
    min: [0, 'Starting bid cannot be negative']
  },
  currentBid: {
    type: Number,
    default: 0
  },
  reservePrice: {
    type: Number,
    required: [true, 'Please provide a reserve price']
  },
  buyNowPrice: {
    type: Number
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time']
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  winner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  bids: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    },
    isWinner: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
auctionSchema.index({ title: 'text', description: 'text' });
auctionSchema.index({ status: 1, endTime: 1 });

// Method to check if auction is active// Auction.js - Update isActive method
auctionSchema.methods.isActive = function () {
  return this.status === 'active' && 
         new Date() < this.endTime && 
         new Date() >= this.startTime;
};

// Method to check if reserve price is met
auctionSchema.methods.isReserveMet = function () {
  return this.currentBid >= this.reservePrice;
};

const Auction = mongoose.model('Auction', auctionSchema);
export default Auction;
