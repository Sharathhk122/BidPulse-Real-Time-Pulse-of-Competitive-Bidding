import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Common fields for both customer and seller
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    validate: {
      validator: function (v) {
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  profilePhoto: {
    type: String,
    required: [true, 'Please upload a profile photo']
  },
  role: {
    type: String,
    enum: ['customer', 'seller'],
    required: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    apartment: {
      type: String
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code']
    },
    country: {
      type: String,
      required: [true, 'Please provide country']
    },
    landmark: {
      type: String
    }
  },

  // Verification fields
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpires: Date,

  // Seller-specific fields
  businessName: {
    type: String,
    required: function () {
      return this.role === 'seller';
    }
  },
  storeDescription: {
    type: String,
    required: function () {
      return this.role === 'seller';
    }
  },
  taxId: {
    type: String,
    required: function () {
      return this.role === 'seller';
    }
  },
  sellerType: {
    type: String,
    enum: ['individual', 'business'],
    required: function () {
      return this.role === 'seller';
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Method to compare passwords
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
