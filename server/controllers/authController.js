import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/email.js';

dotenv.config();

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      role: user.role,
      username: user.username,
      profilePhoto: user.profilePhoto
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup with OTP
export const signup = async (req, res, next) => {
  try {
    const { role } = req.params;

    if (!['customer', 'seller'].includes(role)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid role specified',
      });
    }

    if (!req.body.email || !req.body.username || !req.body.password || !req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields'
      });
    }

    let profilePhotoUrl = '/uploads/default-profile.png';
    if (req.file) {
      profilePhotoUrl = `/uploads/${req.file.filename}`;
    }

    let address;
    try {
      address = typeof req.body.address === 'string'
        ? JSON.parse(req.body.address)
        : req.body.address;
    } catch (err) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid address format'
      });
    }

    if (!address || !address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide complete address information'
      });
    }

    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phoneNumber: req.body.phoneNumber,
      profilePhoto: profilePhotoUrl,
      address,
      role,
      isVerified: false
    };

    if (role === 'seller') {
      if (!req.body.businessName || !req.body.storeDescription || !req.body.taxId) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide all required seller information'
        });
      }
      userData.businessName = req.body.businessName;
      userData.storeDescription = req.body.storeDescription;
      userData.taxId = req.body.taxId;
      userData.sellerType = req.body.sellerType || 'individual';
    }

    const newUser = await User.create(userData);

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    newUser.otp = hashedOTP;
    newUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await newUser.save({ validateBeforeSave: false });

    await sendOTPEmail(newUser.email, otp);

    res.status(201).json({
      status: 'success',
      message: 'OTP sent to your email!'
    });
  } catch (err) {
    console.error('Signup error:', err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        status: 'fail',
        message: `${field} already exists`
      });
    }

    res.status(400).json({
      status: 'fail',
      message: err.message || 'An error occurred during signup',
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    if (!(await bcrypt.compare(otp, user.otp))) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid OTP'
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        status: 'fail',
        message: 'OTP has expired'
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    await sendWelcomeEmail(user.email);

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Verification failed'
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(user.email, otp);

    res.status(200).json({
      status: 'success',
      message: 'New OTP sent to your email!'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Failed to resend OTP'
    });
  }
};

// Login with verification check
export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email/username and password!',
      });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email/username or password',
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        status: 'fail',
        message: 'Account not verified. Please verify your email first.'
      });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Protect middleware
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Role restriction middleware
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
