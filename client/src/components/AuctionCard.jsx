// AuctionCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiDollarSign, FiUsers, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import { Card, Avatar, Button, InputNumber, notification, Typography, Badge } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const { Text } = Typography;

const GlowCard = styled(motion.div)`
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  &:hover {
    border-color: #e94584;
    box-shadow: 0 0 35px rgba(233, 69, 132, 0.6);
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(233, 69, 132, 0.1) 50%,
      transparent 100%
    );
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }
`;

const GradientText = styled(Text)`
  background: linear-gradient(45deg, #e94584, #0f3460);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  display: inline-block;
`;

const StyledAvatar = styled(Avatar)`
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(233, 69, 132, 0.5);
  &:hover {
    transform: scale(1.2) rotate(15deg);
    box-shadow: 0 0 20px rgba(233, 69, 132, 0.8);
  }
`;

const ImageSliderContainer = styled(motion.div)`
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const ImageSlide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  will-change: transform;
`;

const SlideButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(233, 69, 132, 0.7);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  z-index: 10;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  
  &:hover {
    background: rgba(233, 69, 132, 0.9);
    transform: translateY(-50%) scale(1.2);
  }
`;

const ImageCounter = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
`;

const TimeBadge = styled(motion.div)`
  background: rgba(15, 12, 41, 0.8);
  padding: 5px 15px;
  border-radius: 20px;
  color: white;
  z-index: 10;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const AuctionCard = ({ 
  auction, 
  currentUser,
  bidAmount,
  onBidAmountChange,
  onPlaceBid,
  onBuyNow,
  topBidders = []
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  function calculateTimeLeft() {
    const endTime = new Date(auction.endTime);
    const now = new Date();
    const difference = endTime - now;

    if (difference <= 0) return { ended: true };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      ended: false
    };
  }

  const handlePlaceBid = () => {
    const minBid = auction.currentBid + (auction.bidIncrement || 1);
    if (!bidAmount || bidAmount < minBid) {
      notification.error({
        message: 'Bid Error',
        description: `Your bid must be at least $${minBid.toFixed(2)}`,
        placement: 'topRight',
        style: {
          background: '#16213e',
          color: '#fff',
          border: '1px solid #e94584'
        }
      });
      return;
    }
    onPlaceBid();
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex(prev => 
      prev === auction.images.length - 1 ? 0 : prev + 1
    );
    setIsAutoSliding(true);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex(prev => 
      prev === 0 ? auction.images.length - 1 : prev - 1
    );
    setIsAutoSliding(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  useEffect(() => {
    let slideInterval;
    if (isAutoSliding && auction.images?.length > 1) {
      slideInterval = setInterval(() => {
        setDirection(1);
        setCurrentImageIndex(prev => 
          prev === auction.images.length - 1 ? 0 : prev + 1
        );
      }, 1000); // Changed from 5000 to 1000 for 1 second interval
    }
    return () => clearInterval(slideInterval);
  }, [isAutoSliding, auction.images?.length]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const renderTimeLeft = () => {
    if (timeLeft.ended) {
      return (
        <TimeBadge
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: ["0 0 5px rgba(255,0,0,0.3)", "0 0 15px rgba(255,0,0,0.6)", "0 0 5px rgba(255,0,0,0.3)"]
          }}
          transition={{
            repeat: Infinity,
            duration: 2
          }}
        >
          <FiClock className="mr-2 text-red-400" />
          <span className="text-red-400">Auction Ended</span>
        </TimeBadge>
      );
    }

    return (
      <TimeBadge
        animate={{ scale: isHovered ? 1.1 : 1 }}
      >
        <FiClock className="mr-2 text-purple-400" />
        {timeLeft.days > 0 && <span className="text-cyan-400 mr-1">{timeLeft.days}d</span>}
        <span className="text-green-400">
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
      </TimeBadge>
    );
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.5,
      rotateY: direction > 0 ? 15 : -15
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { duration: 0.5 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0.5,
      rotateY: direction > 0 ? -15 : 15,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { duration: 0.5 }
      }
    })
  };

  const renderImageSlider = () => {
    if (!auction.images || auction.images.length === 0) {
      return (
        <div className="relative h-48 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center rounded-lg">
          <FiImage className="text-4xl text-purple-400" />
        </div>
      );
    }
  
    return (
      <ImageSliderContainer
        onMouseEnter={() => setIsAutoSliding(false)}
        onMouseLeave={() => setIsAutoSliding(true)}
      >
        <AnimatePresence custom={direction}>
          {auction.images.map((image, index) => (
            currentImageIndex === index && (
              <ImageSlide
                key={index}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  backgroundImage: `url(${image})`
                }}
              />
            )
          ))}
        </AnimatePresence>
        
        
        {auction.images.length > 1 && (
        <>
          <SlideButton
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            style={{ left: '15px' }}
          >
            <FiChevronLeft />
          </SlideButton>
          
          <SlideButton
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            style={{ right: '15px' }}
          >
            <FiChevronRight />
          </SlideButton>
          
          <ImageCounter
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {auction.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-pink-500 scale-125' 
                    : 'bg-white/30 scale-100'
                }`}
              />
            ))}
          </ImageCounter>
        </>
      )}
    </ImageSliderContainer>
  );
};
  return (
    <GlowCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* Moved time display here, below the title */}
        {renderTimeLeft()}
        
        <motion.div
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <GradientText className="text-xl font-bold mb-2">{auction.title}</GradientText>
        </motion.div>
        
        <motion.p 
          className="text-cyan-300 mb-3"
          whileHover={{ scale: 1.02 }}
        >
          {auction.category}
        </motion.p>
        
        <motion.p 
          className="text-purple-200 mb-4 text-sm"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            backgroundSize: '200% 200%',
            backgroundImage: 'linear-gradient(90deg, #e94584, #0f3460, #e94584)'
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: 'linear'
          }}
        >
          {auction.description || 'No description provided'}
        </motion.p>

        {renderImageSlider()}

        <div className="flex justify-between items-center mt-4 mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-purple-300">Current Bid</p>
            <motion.p 
              className="text-2xl font-bold text-green-400"
              animate={{
                textShadow: ['0 0 5px rgba(74, 222, 128, 0.3)', '0 0 15px rgba(74, 222, 128, 0.6)', '0 0 5px rgba(74, 222, 128, 0.3)'],
                scale: [1, 1.05, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 3
              }}
            >
              ${auction.currentBid?.toFixed(2) || '0.00'}
            </motion.p>
          </motion.div>
          
          {auction.buyNowPrice && (
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-purple-300">Buy Now</p>
              <motion.p 
                className="text-2xl font-bold text-pink-400"
                animate={{
                  textShadow: ['0 0 5px rgba(236, 72, 153, 0.3)', '0 0 15px rgba(236, 72, 153, 0.6)', '0 0 5px rgba(236, 72, 153, 0.3)'],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3
                }}
              >
                ${auction.buyNowPrice.toFixed(2)}
              </motion.p>
            </motion.div>
          )}
        </div>

        {topBidders.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-purple-300 mb-2">
              <FiUsers className="mr-2" />
              <span>Top Bidders</span>
            </div>
            <div className="flex space-x-3">
              {topBidders.map((bid, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`p-2 rounded-lg ${
                    index === 0 ? 'bg-yellow-900/30' :
                    index === 1 ? 'bg-gray-800/30' :
                    'bg-amber-900/30'
                  }`}
                >
                  <Badge 
                    count={index + 1} 
                    color={
                      index === 0 ? 'gold' :
                      index === 1 ? 'silver' :
                      '#cd7f32'
                    }
                    offset={[-10, 40]}
                  >
                    <StyledAvatar 
                      src={bid.user?.avatar}
                      size="large"
                      className="mb-1"
                    >
                      {bid.user?.username?.charAt(0).toUpperCase()}
                    </StyledAvatar>
                  </Badge>
                  <div className={`text-center ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    'text-amber-400'
                  }`}>
                    <div className="font-bold">
                      ${bid.amount.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-purple-300 mb-2">Your Bid ($)</label>
          <div className="flex gap-3">
            <motion.div whileHover={{ y: -2 }} className="flex-1">
              <InputNumber
                min={auction.currentBid + (auction.bidIncrement || 1)}
                step="0.01"
                value={bidAmount}
                onChange={(value) => onBidAmountChange(auction._id, value)}
                style={{ width: '100%' }}
                className="custom-ant-input"
                placeholder={`Min: $${(auction.currentBid + (auction.bidIncrement || 1)).toFixed(2)}`}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handlePlaceBid}
                type="primary"
                shape="round"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-none"
                style={{ height: '100%' }}
              >
                Place Bid
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Button
              onClick={() => navigate(`/auctions/${auction._id}`)}
              shape="round"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-none"
              type="primary"
            >
              View Details
              </Button>
          </motion.div>
          {auction.buyNowPrice && (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onBuyNow}
                shape="round"
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-none"
                type="primary"
              >
                Buy Now
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </GlowCard>
  );
};

export default AuctionCard;