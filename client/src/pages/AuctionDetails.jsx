// pages/AuctionDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { FiClock, FiDollarSign, FiUser, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { Card, Button, Tag, Spin, Carousel, Grid } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { throttle } from 'lodash';
import '../index.css';

const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  const [auction, setAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef(null);

  // Auto-rotate images only on desktop
  useEffect(() => {
    if (!screens.md) return; // Don't auto-rotate on mobile
    
    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % (auction?.images?.length || 1));
    }, 3000); // Slower rotation for better UX
    return () => clearInterval(interval);
  }, [auction?.images, screens.md]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auctions/${id}`);
        setAuction(data.data.auction);
        calculateTimeLeft(data.data.auction.endTime);
        
        // Check if user is watching this auction
        if (user) {
          const watchlistRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/watchlist`);
          setIsWatching(watchlistRes.data.watchlist.includes(id));
        }
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
  }, [id, socket, navigate, user]);

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
    if (!user) {
      toast.error('Please login to place a bid');
      navigate('/login');
      return;
    }

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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auctions/${id}/bids`, { amount: parseFloat(bidAmount) });
      toast.success('Bid placed successfully!');
      setBidAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bid placement failed');
    }
  }, 1000);

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to use Buy Now');
      navigate('/login');
      return;
    }

    if (!auction.buyNowPrice) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auctions/${id}/buy-now`, { amount: auction.buyNowPrice });
      toast.success('Purchased successfully!');
      navigate('/dashboard/myList');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      toast.error('Please login to manage watchlist');
      navigate('/login');
      return;
    }

    try {
      if (isWatching) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/watchlist/${id}`);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/users/${user._id}/watchlist`, { auctionId: id });
      }
      setIsWatching(!isWatching);
      toast.success(!isWatching ? 'Added to watchlist' : 'Removed from watchlist');
    } catch (err) {
      toast.error('Failed to update watchlist');
    }
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
    
    if (screens.xs) {
      // Compact time display for mobile
      return `${timeLeft.hours}h ${timeLeft.minutes}m`;
    }
    
    return `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-4 md:py-8 relative overflow-hidden">
      <FloatingElements count={screens.md ? 15 : 8} />
      
      {/* Back button for mobile */}
      {!screens.md && (
        <button 
          onClick={() => navigate(-1)}
          className="fixed top-4 left-4 z-50 bg-black/50 text-white p-2 rounded-full shadow-lg"
        >
          <FiArrowLeft size={24} />
        </button>
      )}
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
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
            <div className="flex flex-col md:flex-row">
              {/* Image Gallery Section */}
              <div className="w-full md:w-1/2 p-2 md:p-6">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={activeImageIndex}
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-64 sm:h-80 md:h-96 relative rounded-xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={auction.images[activeImageIndex] || '/default-item.png'}
                      className="w-full h-full object-cover transform perspective-1000"
                      style={{ transformStyle: 'preserve-3d' }}
                      alt={auction.title}
                    />
                    <Button
                      shape="circle"
                      size={screens.md ? "large" : "middle"}
                      className="absolute top-2 right-2 md:top-4 md:right-4 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={toggleWatchlist}
                      icon={isWatching ? <FiMinus /> : <FiPlus />}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center mt-4 space-x-2 overflow-x-auto py-2">
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
                        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 cursor-pointer rounded-lg border-2 transition-all ${
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
              <div className="w-full md:w-1/2 p-4 md:p-6 bg-gradient-to-b from-blue-900/50 to-purple-900/50">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 md:mb-6 gap-2">
                  <RainbowText 
                    text={auction.title} 
                    className="text-xl sm:text-2xl md:text-3xl font-bold break-words" 
                  />
                  <Tag color={timeLeft.ended ? 'red' : 'cyan'} className="text-sm md:text-lg px-3 py-1">
                    <FiClock className="inline mr-1" />
                    {renderTimeLeft()}
                  </Tag>
                </div>

                {/* Description for mobile */}
                {!screens.md && (
                  <div className="mb-4 text-gray-200 text-sm">
                    {auction.description || 'No description provided'}
                  </div>
                )}

                {/* Bidding Section */}
                <motion.div 
                  className="bg-black/20 p-4 md:p-6 rounded-xl backdrop-blur-sm mb-4 md:mb-6"
                  whileHover={{ scale: screens.md ? 1.02 : 1 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
                    <div className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-sm md:text-lg text-cyan-300">Current Bid</div>
                      <div className="text-xl md:text-3xl font-bold text-green-400 neon-text">
                        ${auction.currentBid?.toFixed(2)}
                      </div>
                    </div>
                    {auction.buyNowPrice && (
                      <div className="text-center p-2 bg-black/20 rounded-lg">
                        <div className="text-sm md:text-lg text-pink-300">Buy Now</div>
                        <div className="text-xl md:text-3xl font-bold text-yellow-400 neon-text">
                          ${auction.buyNowPrice.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {!timeLeft.ended && (
                    <>
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="flex-1 bg-black/30 border border-purple-500 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
                            placeholder={`Min $${minBidAmount.toFixed(2)}`}
                            min={minBidAmount}
                            step="0.01"
                          />
                          <Button
                            type="primary"
                            shape="round"
                            size={screens.md ? "large" : "middle"}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            onClick={handlePlaceBid}
                            icon={<FiDollarSign />}
                            block={!screens.md}
                          >
                            {screens.md ? 'Place Bid' : 'Bid'}
                          </Button>
                        </div>
                      </div>

                      {auction.buyNowPrice && (
                        <Button
                          block
                          type="primary"
                          shape="round"
                          size={screens.md ? "large" : "middle"}
                          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                          onClick={handleBuyNow}
                        >
                          {screens.md ? 'Instant Purchase' : 'Buy Now'}
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>

                {/* Bidding History */}
                <div className="mt-4 md:mt-8">
                  <h2 className="text-lg md:text-xl font-bold text-cyan-300 mb-2 md:mb-4">
                    Bidding History
                  </h2>
                  <div className="h-32 md:h-40">
                    <Carousel 
                      ref={carouselRef} 
                      dots={false} 
                      autoplay 
                      vertical
                      autoplaySpeed={3000}
                    >
                      {auction.bids?.length > 0 ? (
                        auction.bids.map((bid, index) => (
                          <div key={index} className="p-2 md:p-4 bg-black/20 rounded-lg m-1 md:m-2">
                            <div className="flex justify-between items-center text-purple-100">
                              <div className="flex items-center">
                                <FiUser className="mr-1 md:mr-2 text-cyan-400" />
                                <span className="text-sm md:text-base font-medium truncate max-w-[100px] md:max-w-[150px]">
                                  {bid.user?.username || 'Anonymous'}
                                </span>
                              </div>
                              <span className="text-sm md:text-base font-bold text-green-400">
                                ${bid.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 md:p-4 text-gray-400 text-sm md:text-base">
                          No bids placed yet
                        </div>
                      )}
                    </Carousel>
                  </div>
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
          width: 8px;
          height: 8px;
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

        /* Custom scrollbar for thumbnails */
        .overflow-x-auto::-webkit-scrollbar {
          height: 4px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(159, 122, 234, 0.5);
          border-radius: 10px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(159, 122, 234, 0.8);
        }
      `}</style>
    </div>
  );
};

export default AuctionDetails;
