// pages/AuctionDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { FiClock, FiDollarSign, FiUser, FiPlus, FiMinus } from 'react-icons/fi';
import { Card, Button, Tag, Spin, Carousel } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { throttle } from 'lodash';
import '../index.css';

// Custom Animation Components
const RainbowText = ({ text, className }) => (
  <span className={`${className} rainbow-text`}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        style={{ display: 'inline-block' }}
        animate={{ 
          color: [`hsl(${(i * 30) % 360}, 100%, 70%)`, `hsl(${(i * 30 + 180) % 360}, 100%, 70%)`],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 2 + i * 0.1,
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

const FloatingElements = ({ count = 15 }) => (
  <div className="floating-elements">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="floating-element"
        initial={{
          scale: Math.random() * 0.5 + 0.5,
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          rotate: Math.random() * 360
        }}
        animate={{
          x: ['0%', `${Math.random() * 100 - 50}%`],
          y: ['0%', `${Math.random() * 100 - 50}%`],
          rotate: [0, 360],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'linear'
        }}
      />
    ))}
  </div>
);

const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef(null);

  // Auto-rotate images every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % (auction?.images?.length || 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [auction?.images]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auctions/${id}`);
        setAuction(data.data.auction);
        calculateTimeLeft(data.data.auction.endTime);
      } catch (err) {
        toast.error('Failed to fetch auction details');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuction();

    if (socket) {
      socket.emit('joinAuction', id);
      socket.on('bidUpdate', (updatedAuction) => {
        if (updatedAuction._id === id) {
          setAuction(updatedAuction);
          calculateTimeLeft(updatedAuction.endTime);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('bidUpdate');
        socket.emit('leaveAuction', id);
      }
    };
  }, [id, socket, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (auction?.endTime) {
        calculateTimeLeft(auction.endTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction]);

  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const difference = end - now;

    if (difference <= 0) {
      setTimeLeft({ ended: true });
      return;
    }

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      ended: false
    });
  };

  const handlePlaceBid = throttle(async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    const minBid = auction.currentBid + (auction.bidIncrement || 1);
    if (parseFloat(bidAmount) < minBid) {
      toast.error(`Your bid must be at least $${minBid.toFixed(2)}`);
      return;
    }

    try {
      await axios.post(`/api/auctions/${id}/bids`, { amount: parseFloat(bidAmount) });
      toast.success('Bid placed successfully!');
      setBidAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bid placement failed');
    }
  }, 1000);

  const handleBuyNow = async () => {
    if (!auction.buyNowPrice) return;

    try {
      await axios.post(`/api/auctions/${id}/buy-now`, { amount: auction.buyNowPrice });
      toast.success('Purchased successfully!');
      navigate('/dashboard/myList');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  const toggleWatchlist = () => {
    setIsWatching(!isWatching);
    toast.success(!isWatching ? 'Added to watchlist' : 'Removed from watchlist');
  };

  const imageVariants = {
    hidden: { opacity: 0, rotateY: -45 },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, rotateY: 45 }
  };

  const thumbnailVariants = {
    hover: { scale: 1.1, zIndex: 1 },
    tap: { scale: 0.95 }
  };

  const renderTimeLeft = () => {
    if (timeLeft.ended) return 'Auction Ended';
    return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
  };

  if (isLoading || !auction) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Spin size="large" className="text-purple-500" />
      </div>
    );
  }

  const minBidAmount = auction.currentBid + (auction.bidIncrement || 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-8 relative overflow-hidden">
      <FloatingElements count={15} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="bg-opacity-50 backdrop-blur-lg border-0 shadow-2xl"
            bodyStyle={{ padding: 0 }}
            hoverable
          >
            <div className="md:flex">
              {/* Image Gallery Section */}
              <div className="md:w-1/2 p-6">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={activeImageIndex}
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-96 relative rounded-xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={auction.images[activeImageIndex] || '/default-item.png'}
                      className="w-full h-full object-cover transform perspective-1000"
                      style={{ transformStyle: 'preserve-3d' }}
                      alt={auction.title}
                    />
                    <Button
                      shape="circle"
                      size="large"
                      className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={toggleWatchlist}
                      icon={isWatching ? <FiMinus /> : <FiPlus />}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center mt-6 space-x-3">
                  {auction.images.map((img, index) => (
                    <motion.div
                      key={index}
                      variants={thumbnailVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <img
                        src={img}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-16 h-16 cursor-pointer rounded-lg border-2 transition-all ${
                          index === activeImageIndex 
                            ? 'border-purple-500 scale-110' 
                            : 'border-transparent'
                        }`}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Auction Details Section */}
              <div className="md:w-1/2 p-6 bg-gradient-to-b from-blue-900/50 to-purple-900/50">
                <div className="flex justify-between items-start mb-6">
                  <RainbowText text={auction.title} className="text-3xl font-bold" />
                  <Tag color={timeLeft.ended ? 'red' : 'cyan'} className="text-lg px-4 py-1">
                    {renderTimeLeft()}
                  </Tag>
                </div>

                {/* Bidding Section */}
                <motion.div 
                  className="bg-black/20 p-6 rounded-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-lg text-cyan-300">Current Bid</div>
                      <div className="text-3xl font-bold text-green-400 neon-text">
                        ${auction.currentBid?.toFixed(2)}
                      </div>
                    </div>
                    {auction.buyNowPrice && (
                      <div className="text-center">
                        <div className="text-lg text-pink-300">Buy Now</div>
                        <div className="text-3xl font-bold text-yellow-400 neon-text">
                          ${auction.buyNowPrice.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {!timeLeft.ended && (
                    <>
                      <div className="mb-6">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="flex-1 bg-black/30 border border-purple-500 text-white rounded-lg px-4 py-3"
                            placeholder={`Enter bid (min $${minBidAmount.toFixed(2)})`}
                            min={minBidAmount}
                            step="0.01"
                          />
                          <Button
                            type="primary"
                            shape="round"
                            size="large"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            onClick={handlePlaceBid}
                            icon={<FiDollarSign />}
                          >
                            Place Bid
                          </Button>
                        </div>
                      </div>

                      {auction.buyNowPrice && (
                        <Button
                          block
                          type="primary"
                          shape="round"
                          size="large"
                          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                          onClick={handleBuyNow}
                        >
                          Instant Purchase
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>

                {/* Bidding History */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-cyan-300 mb-4">Bidding History</h2>
                  <Carousel ref={carouselRef} dots={false} autoplay vertical>
                    {auction.bids?.length > 0 ? (
                      auction.bids.map((bid, index) => (
                        <div key={index} className="p-4 bg-black/20 rounded-lg m-2">
                          <div className="flex justify-between items-center text-purple-100">
                            <div className="flex items-center">
                              <FiUser className="mr-2 text-cyan-400" />
                              <span className="font-medium">
                                {bid.user?.username || 'Anonymous'}
                              </span>
                            </div>
                            <span className="font-bold text-green-400">
                              ${bid.amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-gray-400">No bids placed yet</div>
                    )}
                  </Carousel>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <style jsx global>{`
        .rainbow-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        
        .neon-text {
          text-shadow: 0 0 10px currentColor;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .floating-element {
          position: absolute;
          width: 10px;
          height: 10px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          border-radius: 50%;
          filter: blur(1px);
        }

        .ant-card-bordered {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .ant-card-hoverable:hover {
          box-shadow: 0 0 30px rgba(159, 122, 234, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default AuctionDetails;
