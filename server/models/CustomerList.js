import mongoose from 'mongoose';

const customerListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    auction: {
      type: mongoose.Schema.ObjectId,
      ref: 'Auction',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate auctions for the same user
customerListSchema.index({ user: 1, 'items.auction': 1 }, { unique: true });

// Virtual for won items (completed auctions)
customerListSchema.virtual('wonItems', {
  ref: 'Auction',
  localField: 'items.auction',
  foreignField: '_id',
  justOne: false,
  match: { status: 'completed' }
});

const CustomerList = mongoose.model('CustomerList', customerListSchema);
export default CustomerList;
