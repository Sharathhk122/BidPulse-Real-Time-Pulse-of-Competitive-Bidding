import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

import authRouter from './routes/authRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import bidRouter from './routes/bidRoutes.js';
import connectDB from './config/db.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import Auction from './models/Auction.js'; // ✅ FIXED: Import Auction model
import closeExpiredAuctions from './utils/auctionScheduler.js';

import cron from 'node-cron';

dotenv.config({ path: './.env' });


const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRouter);

// Error Handler
app.use(globalErrorHandler);

// Create Server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
cron.schedule('* * * * *', () => {
  console.log('Running auction closure check...');
  closeExpiredAuctions();
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.set('io', io);

// ⏱️ Auction Status Updater
function updateAuctionStatuses() {
  const now = new Date();

  // Mark auctions as completed
  Auction.updateMany(
    {
      status: { $in: ['upcoming', 'active'] },
      endTime: { $lte: now },
    },
    { $set: { status: 'completed' } }
  ).exec();

  // Activate upcoming auctions
  Auction.updateMany(
    {
      status: 'upcoming',
      startTime: { $lte: now },
      endTime: { $gt: now },
    },
    { $set: { status: 'active' } }
  ).exec();
}

// Run auction status updater every minute
setInterval(updateAuctionStatuses, 60 * 1000);

// Start Server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port ${port}...`));

// Global Error Handler for Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
