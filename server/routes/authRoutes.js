import express from 'express';
import path from 'path'; // ✅ Import path module
import {
  signup,
  login,
  protect,
  restrictTo,
  verifyOTP,
  resendOTP
} from '../controllers/authController.js';
import multer from 'multer';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Signup route with file upload
router.post('/signup/:role', upload.single('profilePhoto'), signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Login route with CORS headers
router.post('/login', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Credentials', true);
  next();
}, login);

// Protected route to get current user
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

export default router;
