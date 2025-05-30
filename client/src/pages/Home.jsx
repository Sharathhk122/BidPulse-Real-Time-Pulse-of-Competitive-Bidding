import React, { useState, useEffect, useRef } from 'react';
import { Layout, Carousel, Card, Steps, Statistic, Table, Form, Input, Button, List, Avatar, Tag, Divider, Space } from 'antd';
import { ArrowRightOutlined, FireOutlined, TrophyOutlined, ClockCircleOutlined, DollarOutlined, CheckCircleOutlined, StarFilled } from '@ant-design/icons';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import Typed from 'typed.js';
import { Link } from 'react-router-dom';
import praImage from "../pages/pra.jpg";
import shaImage from "../pages/sha.jpg";
import "../index.css";
const { Header, Content } = Layout;
const { Meta } = Card;
const { Step } = Steps;

// Enhanced 3D color palette
const colors = {
  primary: '#6a11cb',
  secondary: '#2575fc',
  accent: '#ff4b2b',
  dark: '#0f0c29',
  darker: '#0a081f',
  light: '#f5f7fa',
  gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  gradientAccent: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32'
};

// Mock data for auctions
const liveAuctions = [
  {
    id: 1,
    title: 'Rare Vintage Rolex Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    currentBid: 1250,
    endTime: '2023-12-15T14:00:00',
    bidders: 24,
    isLive: true
  },
  {
    id: 2,
    title: 'Signed First Edition Harry Potter',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    currentBid: 890,
    endTime: '2023-12-16T10:30:00',
    bidders: 18,
    isLive: true
  },
  {
    id: 3,
    title: 'Antique Persian Rug',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    currentBid: 2300,
    endTime: '2023-12-14T18:45:00',
    bidders: 32,
    isLive: true
  },
  {
    id: 4,
    title: 'Vincent van Gogh Reproduction',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    currentBid: 750,
    endTime: '2023-12-17T12:15:00',
    bidders: 15,
    isLive: true
  }
];

// Mock data for top bidders
const topBidders = [
  {
    key: '1',
    rank: 1,
    name: 'John Collector',
    totalBids: 142,
    wins: 28,
    amountSpent: '$42,500'
  },
  {
    key: '2',
    rank: 2,
    name: 'Sarah Antiques',
    totalBids: 118,
    wins: 22,
    amountSpent: '$38,750'
  },
  {
    key: '3',
    rank: 3,
    name: 'Mike Investments',
    totalBids: 96,
    wins: 19,
    amountSpent: '$31,200'
  },
  {
    key: '4',
    rank: 4,
    name: 'Emma RareFinds',
    totalBids: 87,
    wins: 15,
    amountSpent: '$27,800'
  },
  {
    key: '5',
    rank: 5,
    name: 'David ArtLover',
    totalBids: 76,
    wins: 12,
    amountSpent: '$24,300'
  }
];

// Mock data for testimonials
const testimonials = [
  {
    name: 'Sharath H K',
    role: 'Art Collector',
    avatar: shaImage,
    content: 'The real-time bidding experience is incredible. I won a rare painting at a great price!'
  },
  {
    name: 'Prashant Rao',
    role: 'Antique Dealer',
    avatar: praImage,
    content: 'As a seller, I got way more exposure than traditional auction houses. Highly recommend!'
  },
  {
    name: 'David Chen',
    role: 'Investor',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    content: 'The platform is easy to use and the live auctions are very engaging. Great concept!'
  }
];

// Enhanced Animated component with more animation types
const AnimatedSection = ({ children, animation = 'fadeIn', delay = 0, config = {} }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { mass: 1, tension: 180, friction: 12, ...config },
    delay: delay
  });

  const slideInLeft = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0)' : 'translateX(-40px)',
    config: { mass: 1, tension: 200, friction: 20, ...config },
    delay: delay
  });

  const slideInRight = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0)' : 'translateX(40px)',
    config: { mass: 1, tension: 200, friction: 20, ...config },
    delay: delay
  });

  const scaleUp = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 200, friction: 20, ...config },
    delay: delay
  });

  const rotate3D = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'perspective(600px) rotateX(0deg) rotateY(0deg)' : 'perspective(600px) rotateX(90deg) rotateY(20deg)',
    config: { tension: 200, friction: 20, ...config },
    delay: delay
  });

  const bounce = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(100px)',
    config: { tension: 300, friction: 10, ...config },
    delay: delay
  });

  const float = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { mass: 1, tension: 280, friction: 12, ...config },
    delay: delay
  });

  let animationStyle;
  switch (animation) {
    case 'fadeIn':
      animationStyle = fadeIn;
      break;
    case 'slideInLeft':
      animationStyle = slideInLeft;
      break;
    case 'slideInRight':
      animationStyle = slideInRight;
      break;
    case 'scaleUp':
      animationStyle = scaleUp;
      break;
    case 'rotate3D':
      animationStyle = rotate3D;
      break;
    case 'bounce':
      animationStyle = bounce;
      break;
    case 'float':
      animationStyle = float;
      break;
    default:
      animationStyle = fadeIn;
  }

  return (
    <animated.div ref={ref} style={animationStyle}>
      {children}
    </animated.div>
  );
};

// Enhanced Countdown component with 3D animation
const AuctionCountdown = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <motion.span 
        key={interval}
        initial={{ scale: 0.8, y: -10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut"
        }}
        style={{
          display: 'inline-block',
          margin: '0 2px',
          padding: '2px 5px',
          background: `linear-gradient(145deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: 4,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        {timeLeft[interval]} {interval}{" "}
      </motion.span>
    );
  });

  return (
    <div style={{ marginTop: 10 }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Tag icon={<ClockCircleOutlined />} color={colors.accent} style={{ 
          fontSize: '0.9rem',
          padding: '6px 12px',
          borderRadius: 20,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {timerComponents.length ? timerComponents : <span>Auction ended</span>}
        </Tag>
      </motion.div>
    </div>
  );
};

// Enhanced 3D Card Component with parallax effect
const AuctionCard3D = ({ auction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      x: (y - centerY) / 20,
      y: -(x - centerX) / 20
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{
          rotateX: isHovered ? tilt.x : 0,
          rotateY: isHovered ? tilt.y : 0,
          transition: { type: "spring", stiffness: 500, damping: 20 }
        }}
      >
        <Card
          hoverable
          cover={
            <motion.div
              animate={{
                scale: isHovered ? 1.05 : 1,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                alt={auction.title} 
                src={auction.image} 
                style={{ 
                  height: 200, 
                  objectFit: 'cover',
                  borderRadius: '8px 8px 0 0',
                  borderBottom: `3px solid ${colors.accent}`
                }} 
              />
            </motion.div>
          }
          actions={[
            <Link to="/login">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  block 
                  style={{
                    background: colors.gradient,
                    border: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  Join Auction
                </Button>
              </motion.div>
            </Link>
          ]}
          style={{
            background: `linear-gradient(145deg, ${colors.dark}, ${colors.darker})`,
            border: 'none',
            color: colors.light,
            boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
            borderRadius: 12,
            overflow: 'hidden'
          }}
        >
          <Meta
            title={
              <motion.div
                whileHover={{ x: 5 }}
              >
                <span style={{ 
                  color: colors.light, 
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}>
                  {auction.title}
                </span>
              </motion.div>
            }
            description={
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 10,
                  alignItems: 'center'
                }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                  >
                    <span style={{ color: '#a1a1a1' }}>
                      <DollarOutlined style={{ color: colors.gold }} /> Current Bid: 
                      <span style={{ 
                        color: colors.gold, 
                        fontWeight: 'bold',
                        marginLeft: 5
                      }}>
                        ${auction.currentBid}
                      </span>
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                  >
                    <Tag 
                      color={colors.secondary} 
                      style={{ 
                        borderRadius: 10,
                        margin: 0,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      👥 {auction.bidders}
                    </Tag>
                  </motion.div>
                </div>
                <AuctionCountdown endTime={auction.endTime} />
              </>
            }
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isParticlesLoaded, setIsParticlesLoaded] = useState(false);
  const typedRef = React.useRef(null);
  const heroTextRef = useRef(null);

  // Initialize Typed.js for typing animation
  useEffect(() => {
    // For the "Discover amazing deals on" text
    const options = {
      strings: [
        "Rare Collectibles",
        "Exclusive Art",
        "Vintage Items",
        "Unique Antiques"
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      smartBackspace: true
    };

    typedRef.current = new Typed('#typed-text', options);

    // For the hero text "Join Live Auctions in Real-Time"
    const heroOptions = {
      strings: ["Join Live Auctions in ^500 Real-Time"],
      typeSpeed: 50,
      startDelay: 300,
      showCursor: false
    };

    const heroTyped = new Typed(heroTextRef.current, heroOptions);

    return () => {
      typedRef.current.destroy();
      heroTyped.destroy();
    };
  }, []);

  const particlesInit = async (engine) => {
    await loadFull(engine);
    setIsParticlesLoaded(true);
  };

  const particlesLoaded = async () => {
    console.log("Particles loaded");
  };

  return (
    <Layout className="layout" style={{ background: colors.dark }}>
      {/* Enhanced Particle background with 3D colors */}
      {isParticlesLoaded && (
        <div style={{ position: 'fixed', width: '100%', height: '100vh', zIndex: 0 }}>
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              fullScreen: { enable: false },
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                    parallax: { enable: true, force: 60, smooth: 10 }
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 100,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: [colors.primary, colors.secondary, colors.accent, colors.gold],
                },
                links: {
                  color: colors.light,
                  distance: 150,
                  enable: true,
                  opacity: 0.3,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: true,
                  speed: 3,
                  straight: false,
                  attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200,
                  },
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.7,
                  animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1,
                    sync: false,
                  },
                },
                shape: {
                  type: ["circle", "triangle", "star"],
                  stroke: {
                    width: 0,
                    color: "#000000",
                  },
                },
                size: {
                  value: { min: 1, max: 5 },
                  animation: {
                    enable: true,
                    speed: 4,
                    minimumValue: 0.1,
                    sync: false,
                  },
                },
              },
              detectRetina: true,
            }}
          />
        </div>
      )}

      {/* Header with enhanced 3D effect */}
      <Header style={{ 
        position: 'fixed', 
        zIndex: 1, 
        width: '100%', 
        background: 'rgba(15, 12, 41, 0.9)',
        borderBottom: `1px solid ${colors.secondary}`,
        boxShadow: `0 4px 30px rgba(106, 17, 203, 0.3)`,
        backdropFilter: 'blur(10px)'
      }}>
        <AnimatedSection animation="slideInDown">
          <div className="header-content">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="logo"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '1.5rem', 
                background: colors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 10px ${colors.primary}`
              }}>
                BidLive
              </span>
            </motion.div>
            <div className="nav-links">
              {['Home', 'Auctions', 'How It Works', 'Top Bidders', 'Testimonials'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ y: -100 }}
                  animate={{ y: 0 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 20,
                    delay: index * 0.1
                  }}
                >
                  <motion.a
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="nav-link"
                    whileHover={{ 
                      scale: 1.1,
                      background: colors.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      color: colors.light,
                      fontWeight: 500,
                      padding: '8px 12px',
                      borderRadius: 8,
                      display: 'block'
                    }}
                  >
                    {item}
                  </motion.a>
                </motion.div>
              ))}
            </div>
            <Space className="auth-buttons">
              <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.5
                }}
              >
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      type="text" 
                      style={{ 
                        color: colors.light,
                        fontWeight: 'bold'
                      }}
                    >
                      Login
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.6
                }}
              >
                <Link to="/signup">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      type="primary" 
                      style={{ 
                        background: colors.gradientAccent,
                        border: 'none',
                        fontWeight: 'bold',
                        boxShadow: `0 4px 15px ${colors.accent}`
                      }}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </Space>
          </div>
        </AnimatedSection>
      </Header>

      <Content style={{ paddingTop: 64 }}>
        {/* Hero Section with enhanced 3D animations */}
        <section id="home" className="hero-section" style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <AnimatedSection animation="rotate3D" delay={0.3} config={{ tension: 300 }}>
              <motion.h1 
  style={{ 
    fontSize: '3.5rem', 
    marginBottom: 20,
    fontWeight: 'bold',
    lineHeight: 1.2
  }}
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  <motion.span
    style={{
      background: colors.gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block'
    }}
    animate={{
      textShadow: [
        `0 0 10px ${colors.primary}`,
        `0 0 20px ${colors.secondary}`,
        `0 0 10px ${colors.accent}`,
        `0 0 10px ${colors.primary}`
      ],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  >
   <span ref={heroTextRef}></span>
  </motion.span>
</motion.h1>
              </AnimatedSection>
              
              <AnimatedSection animation="slideInLeft" delay={0.5}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                 <p style={{ 
  fontSize: '1.2rem', 
  marginBottom: 10, 
  maxWidth: 600,
  color: [
    '#FF5733', // fire orange
    '#FF8D1A', // warm orange
    '#FFD700', // gold
    '#FF5733'
  ],
  textShadow: [
    '0 0 5px #FF5733',
    '0 0 10px #FF8D1A',
    '0 0 8px #FFD700',
    '0 0 5px #FF5733'
  ]
  
}}>
  Discover amazing deals on: 
  <motion.span 
    id="typed-text" 
    style={{ 
      display: 'inline-block',
      marginLeft: 5
    }}
    animate={{
      color: [
        colors.primary,
        colors.secondary,
        colors.accent,
        colors.gold,
        colors.primary
      ],
      textShadow: [
        `0 0 5px ${colors.primary}`,
        `0 0 5px ${colors.secondary}`,
        `0 0 5px ${colors.accent}`,
        `0 0 5px ${colors.gold}`,
        `0 0 5px ${colors.primary}`
      ]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  />
</p>
<motion.p 
  style={{ 
    fontSize: '1.2rem', 
    marginBottom: 30, 
    maxWidth: 600,
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.7 }}
>
<motion.p 
  style={{ 
    fontSize: '1.2rem', 
    marginBottom: 30, 
    maxWidth: 600,
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.7 }}
>
  <motion.span
    style={{
      display: 'inline-block',
      padding: '8px 16px',
      borderRadius: '8px',
      background: 'linear-gradient(145deg, rgba(15,12,41,0.3), rgba(106,17,203,0.2))',
      boxShadow: `0 4px 15px rgba(106,17,203,0.3)`,
      backdropFilter: 'blur(5px)',
      // border removed
    }}
    animate={{
      color: [
        'rgba(245,247,250,0.9)',
        'rgba(255,75,43,0.8)',
        'rgba(106,17,203,0.8)',
        'rgba(37,117,252,0.8)',
        'rgba(245,247,250,0.9)'
      ],
      textShadow: [
        `0 0 5px ${colors.primary}`,
        `0 0 10px ${colors.accent}`,
        `0 0 8px ${colors.secondary}`,
        `0 0 5px ${colors.primary}`
      ],
      boxShadow: [
        `0 4px 15px rgba(106,17,203,0.3)`,
        `0 4px 20px rgba(255,75,43,0.3)`,
        `0 4px 15px rgba(37,117,252,0.3)`,
        `0 4px 15px rgba(106,17,203,0.3)`
      ],
      scale: [1, 1.02, 1],
      y: [0, -3, 0]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    whileHover={{
      scale: 1.05,
      boxShadow: `0 8px 25px ${colors.accent}`,
      transition: { duration: 0.3 }
    }}
  >
    Experience the thrill of live bidding from anywhere in the world.
  </motion.span>
</motion.p>

</motion.p>
                </motion.div>
              </AnimatedSection>
              
              <AnimatedSection animation="scaleUp" delay={0.7}>
                <div style={{ display: 'flex', gap: 15 }}>
                  <Link to="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        type="primary" 
                        size="large" 
                        shape="round" 
                        icon={<ArrowRightOutlined />}
                        style={{
                          background: colors.gradientAccent,
                          border: 'none',
                          fontWeight: 'bold',
                          boxShadow: `0 4px 15px ${colors.accent}`
                        }}
                      >
                        Browse Auctions
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="large" 
                        shape="round"
                        style={{
                          background: 'rgba(245,247,250,0.1)',
                          border: `1px solid ${colors.secondary}`,
                          color: colors.light,
                          fontWeight: 'bold'
                        }}
                      >
                        Join as Seller
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
            
            {/* Floating auction items with enhanced 3D effect */}
            <motion.div
              style={{
                position: 'absolute',
                right: 100,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `3px solid ${colors.accent}`,
                  boxShadow: `0 0 30px ${colors.accent}`,
                  position: 'relative'
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60" 
                  alt="Floating item" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(to top, ${colors.dark}, transparent)`,
                    padding: '10px',
                    textAlign: 'center'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <span style={{ 
                    color: colors.light, 
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    Rare Watch
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div
              style={{
                position: 'absolute',
                right: 300,
                top: '30%',
                zIndex: 1
              }}
              animate={{
                y: [0, 30, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 2
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -10 }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `3px solid ${colors.gold}`,
                  boxShadow: `0 0 30px ${colors.gold}`,
                  position: 'relative'
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60" 
                  alt="Floating item" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(to top, ${colors.dark}, transparent)`,
                    padding: '10px',
                    textAlign: 'center'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <span style={{ 
                    color: colors.light, 
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                    Signed Book
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Live Auctions Section with enhanced 3D effects */}
        <section id="auctions" className="section" style={{ 
          padding: '100px 0', 
          background: `linear-gradient(135deg, ${colors.darker}, ${colors.dark})`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container">
            <AnimatedSection animation="fadeIn">
              <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                >
                  <Tag icon={<FireOutlined />} color={colors.accent} style={{ 
                    fontSize: '1.2rem', 
                    padding: '8px 20px',
                    background: colors.gradientAccent,
                    border: 'none',
                    color: colors.light,
                    borderRadius: 20,
                    boxShadow: `0 4px 15px ${colors.accent}`,
                    fontWeight: 'bold'
                  }}>
                    Live Auctions
                  </Tag>
                </motion.div>
                <motion.h2 
                  style={{ 
                    fontSize: '2.5rem', 
                    marginTop: 20,
                    color: colors.light,
                    textShadow: `0 2px 10px ${colors.primary}`
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Currently Bidding Now
                </motion.h2>
                <motion.p 
                  style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(245,247,250,0.7)', 
                    maxWidth: 700, 
                    margin: '0 auto' 
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Join these exciting auctions happening right now. Don't miss your chance to win!
                </motion.p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeIn" delay={0.3}>
              <Carousel 
                autoplay 
                dots={false} 
                slidesToShow={3} 
                responsive={[
                  { breakpoint: 992, settings: { slidesToShow: 2 } },
                  { breakpoint: 768, settings: { slidesToShow: 1 } }
                ]}
              >
                {liveAuctions.map((auction, index) => (
                  <div key={auction.id} style={{ padding: 15 }}>
                    <AuctionCard3D auction={auction} />
                  </div>
                ))}
              </Carousel>
            </AnimatedSection>
          </div>
          
          {/* Floating decorative elements */}
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              left: '5%',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
              filter: 'blur(30px)',
              opacity: 0.3
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              opacity: 0.2
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 5
            }}
          />
        </section>

        {/* How It Works Section with enhanced 3D steps */}
        <section id="how-it-works" className="section" style={{ 
          padding: '100px 0', 
          background: `linear-gradient(135deg, ${colors.dark}, ${colors.darker})`,
          position: 'relative',
          clipPath: 'polygon(0 0, 100% 5%, 100% 100%,           0% 95%)'
        }}>
          <div className="container">
            <AnimatedSection animation="fadeIn">
              <div style={{ textAlign: 'center', marginBottom: 70 }}>
                <motion.h2 
                  style={{ 
                    fontSize: '2.5rem',
                    color: colors.light,
                    textShadow: `0 2px 10px ${colors.primary}`
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  How It Works
                </motion.h2>
                <motion.p 
                  style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(245,247,250,0.7)', 
                    maxWidth: 700, 
                    margin: '0 auto' 
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Simple steps to start bidding or selling on our platform
                </motion.p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeIn" delay={0.3}>
              <div style={{ marginBottom: 80 }}>
                <motion.h3 
                  style={{ 
                    textAlign: 'center', 
                    marginBottom: 40,
                    color: colors.light,
                    fontSize: '1.8rem'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  For Buyers
                </motion.h3>
                <Steps direction="horizontal" responsive current={-1}>
                  {[
                    { 
                      title: "Register", 
                      description: "Create your free account", 
                      icon: <CheckCircleOutlined />,
                      color: colors.primary
                    },
                    { 
                      title: "Browse", 
                      description: "Find auctions you love", 
                      icon: <CheckCircleOutlined />,
                      color: colors.secondary
                    },
                    { 
                      title: "Bid", 
                      description: "Participate in real-time", 
                      icon: <CheckCircleOutlined />,
                      color: colors.accent
                    },
                    { 
                      title: "Win", 
                      description: "Get your item delivered", 
                      icon: <CheckCircleOutlined />,
                      color: colors.gold
                    }
                  ].map((step, index) => (
                    <Step 
                      key={index}
                      title={<motion.span 
                        style={{ color: colors.light }}
                        whileHover={{ color: step.color }}
                      >{step.title}</motion.span>}
                      description={<span style={{ color: 'rgba(245,247,250,0.7)' }}>{step.description}</span>}
                      icon={
                        <motion.div
                          whileHover={{ 
                            rotate: 360, 
                            scale: 1.2,
                            background: step.color,
                            boxShadow: `0 0 15px ${step.color}`
                          }}
                          transition={{ duration: 0.5 }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(245,247,250,0.1)',
                            border: `1px solid ${step.color}`
                          }}
                        >
                          {step.icon}
                        </motion.div>
                      }
                    />
                  ))}
                </Steps>
              </div>

              <div>
                <motion.h3 
                  style={{ 
                    textAlign: 'center', 
                    marginBottom: 40,
                    color: colors.light,
                    fontSize: '1.8rem'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  For Sellers
                </motion.h3>
                <Steps direction="horizontal" responsive current={-1}>
                  {[
                    { 
                      title: "List Item", 
                      description: "Provide details and photos", 
                      icon: <CheckCircleOutlined />,
                      color: colors.primary
                    },
                    { 
                      title: "Set Auction", 
                      description: "Choose duration and minimum bid", 
                      icon: <CheckCircleOutlined />,
                      color: colors.secondary
                    },
                    { 
                      title: "Promote", 
                      description: "Share with potential bidders", 
                      icon: <CheckCircleOutlined />,
                      color: colors.accent
                    },
                    { 
                      title: "Sell", 
                      description: "Get paid when auction ends", 
                      icon: <CheckCircleOutlined />,
                      color: colors.gold
                    }
                  ].map((step, index) => (
                    <Step 
                      key={index}
                      title={<motion.span 
                        style={{ color: colors.light }}
                        whileHover={{ color: step.color }}
                      >{step.title}</motion.span>}
                      description={<span style={{ color: 'rgba(245,247,250,0.7)' }}>{step.description}</span>}
                      icon={
                        <motion.div
                          whileHover={{ 
                            rotate: 360, 
                            scale: 1.2,
                            background: step.color,
                            boxShadow: `0 0 15px ${step.color}`
                          }}
                          transition={{ duration: 0.5 }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(245,247,250,0.1)',
                            border: `1px solid ${step.color}`
                          }}
                        >
                          {step.icon}
                        </motion.div>
                      }
                    />
                  ))}
                </Steps>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Floating decorative elements */}
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              left: '5%',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
              filter: 'blur(20px)',
              opacity: 0.3
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
              filter: 'blur(25px)',
              opacity: 0.2
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </section>

        {/* Statistics Section with enhanced 3D animations */}
        <section className="section" style={{ 
          padding: '80px 0', 
          background: colors.gradientAccent,
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0% 100%)'
        }}>
          <div className="container">
            <AnimatedSection animation="fadeIn">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                flexWrap: 'wrap', 
                gap: 30 
              }}>
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    style={{
                      background: 'rgba(245,247,250,0.1)',
                      border: `1px solid rgba(245,247,250,0.2)`,
                      borderRadius: 12,
                      padding: '20px',
                      minWidth: 200,
                      textAlign: 'center',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <Statistic 
                      title={<span style={{ color: colors.light }}>Total Auctions</span>} 
                      value={1254}
                      prefix={<FireOutlined style={{ color: colors.light }} />} 
                      valueStyle={{ 
                        color: colors.light, 
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Card>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    style={{
                      background: 'rgba(245,247,250,0.1)',
                      border: `1px solid rgba(245,247,250,0.2)`,
                      borderRadius: 12,
                      padding: '20px',
                      minWidth: 200,
                      textAlign: 'center',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <Statistic 
                      title={<span style={{ color: colors.light }}>Active Bidders</span>} 
                      value={8562}
                      prefix={<TrophyOutlined style={{ color: colors.light }} />} 
                      valueStyle={{ 
                        color: colors.light, 
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Card>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    style={{
                      background: 'rgba(245,247,250,0.1)',
                      border: `1px solid rgba(245,247,250,0.2)`,
                      borderRadius: 12,
                      padding: '20px',
                      minWidth: 200,
                      textAlign: 'center',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <Statistic 
                      title={<span style={{ color: colors.light }}>Items Sold</span>} 
                      value={983}
                      prefix={<CheckCircleOutlined style={{ color: colors.light }} />} 
                      valueStyle={{ 
                        color: colors.light, 
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Card>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    style={{
                      background: 'rgba(245,247,250,0.1)',
                      border: `1px solid rgba(245,247,250,0.2)`,
                      borderRadius: 12,
                      padding: '20px',
                      minWidth: 200,
                      textAlign: 'center',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <Statistic 
                      title={<span style={{ color: colors.light }}>Happy Sellers</span>} 
                      value="100%"
                      valueStyle={{ 
                        color: colors.light, 
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Card>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Animated confetti particles */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                background: colors.light,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.7
              }}
              animate={{
                y: [0, 100, 200, 300],
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0.7, 0.7, 0.7, 0],
                rotate: [0, 180, 360, 540]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatDelay: Math.random() * 5
              }}
            />
          ))}
        </section>

        {/* Top Bidders Section with enhanced 3D table */}
        <section id="top-bidders" className="section" style={{ 
          padding: '100px 0', 
          background: `linear-gradient(135deg, ${colors.darker}, ${colors.dark})`,
          position: 'relative',
          clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0% 100%)'
        }}>
          <div className="container">
            <AnimatedSection animation="fadeIn">
              <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <motion.h2 
                  style={{ 
                    fontSize: '2.5rem',
                    color: colors.light,
                    textShadow: `0 2px 10px ${colors.primary}`
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Top Bidders
                </motion.h2>
                <motion.p 
                  style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(245,247,250,0.7)', 
                    maxWidth: 700, 
                    margin: '0 auto' 
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Our most active and successful bidders this month
                </motion.p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeIn" delay={0.3}>
            <motion.div
  whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
  style={{
    perspective: 1000,
    padding: 24,
    borderRadius: 20,
    background: 'linear-gradient(-45deg, #ff6ec4, #7873f5, #4ade80, #facc15)',
    backgroundSize: '600% 600%',
    animation: 'animatedGradient 12s ease infinite',
    boxShadow: '0 25px 45px rgba(0, 0, 0, 0.5)',
    transformStyle: 'preserve-3d',
  }}
>

                <Table 
                  columns={[
                    { 
                      title: 'Rank', 
                      dataIndex: 'rank', 
                      key: 'rank',
                      render: (rank) => (
                        <motion.div 
                          style={{ display: 'flex', alignItems: 'center' }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {rank <= 3 && <StarFilled style={{ 
                            color: rank === 1 ? colors.gold : rank === 2 ? colors.silver : colors.bronze, 
                            marginRight: 8,
                            fontSize: '1.2rem'
                          }} />}
                          <span style={{ 
                            color: rank === 1 ? colors.gold : 
                                  rank === 2 ? colors.silver : 
                                  rank === 3 ? colors.bronze : colors.dark,
                            fontWeight: rank <= 3 ? 'bold' : 'normal',
                            textShadow: rank <= 3 ? `0 0 5px ${rank === 1 ? 'rgba(255,215,0,0.5)' : 
                                                   rank === 2 ? 'rgba(192,192,192,0.5)' : 
                                                   'rgba(205,127,50,0.5)'}` : 'none'
                          }}>
                            {rank}
                          </span>
                        </motion.div>
                      )
                    },
                    { 
                      title: 'Name', 
                      dataIndex: 'name', 
                      key: 'name',
                      render: (text) => (
                        <motion.span 
                          style={{ 
                            color: colors.dark,
                            fontWeight: 'bold'
                          }}
                          whileHover={{ 
                            color: colors.primary,
                            textShadow: `0 0 5px ${colors.primary}`
                          }}
                        >
                          {text}
                        </motion.span>
                      )
                    },
                    { 
                      title: 'Total Bids', 
                      dataIndex: 'totalBids', 
                      key: 'totalBids',
                      render: (text) => (
                        <motion.span 
                          style={{ 
                            color: colors.dark,
                            fontWeight: '500'
                          }}
                          whileHover={{ 
                            color: colors.secondary,
                            textShadow: `0 0 5px ${colors.secondary}`
                          }}
                        >
                          {text}
                        </motion.span>
                      )
                    },
                    { 
                      title: 'Wins', 
                      dataIndex: 'wins', 
                      key: 'wins',
                      render: (text) => (
                        <motion.span 
                          style={{ 
                            color: colors.dark,
                            fontWeight: '500'
                          }}
                          whileHover={{ 
                            color: colors.accent,
                            textShadow: `0 0 5px ${colors.accent}`
                          }}
                        >
                          {text}
                        </motion.span>
                      )
                    },
                    { 
                      title: 'Amount Spent', 
                      dataIndex: 'amountSpent', 
                      key: 'amountSpent',
                      render: (text) => (
                        <motion.span 
                          style={{ 
                            color: colors.gold,
                            fontWeight: 'bold'
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            textShadow: `0 0 10px ${colors.gold}`
                          }}
                        >
                          {text}
                        </motion.span>
                      )
                    },
                  ]}
                  dataSource={topBidders}
                  pagination={false}
                  rowClassName={(record, index) => 
                    index === 0 ? 'top-bidder-gold' : 
                    index === 1 ? 'top-bidder-silver' : 
                    index === 2 ? 'top-bidder-bronze' : ''
                  }
                  style={{
                    background: colors.light,
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: `1px solid rgba(0,0,0,0.1)`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                />
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Testimonials Section with enhanced 3D carousel */}
        <section id="testimonials" className="section" style={{ 
          padding: '100px 0', 
          background: `linear-gradient(135deg, ${colors.dark}, ${colors.darker})`,
          position: 'relative',
          clipPath: 'polygon(0 0, 100% 5%, 100% 100%, 0% 95%)'
        }}>
          <div className="container">
            <AnimatedSection animation="fadeIn">
              <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <motion.h2 
                  style={{ 
                    fontSize: '2.5rem',
                    color: colors.light,
                    textShadow: `0 2px 10px ${colors.primary}`
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  What Our Users Say
                </motion.h2>
                <motion.p 
                  style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(245,247,250,0.7)', 
                    maxWidth: 700, 
                    margin: '0 auto' 
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Hear from our community of buyers and sellers
                </motion.p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeIn" delay={0.3}>
              <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Carousel 
                  autoplay 
                  dots={false}
                  afterChange={setActiveTestimonial}
                  effect="fade"
                >
                  {testimonials.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card
                        style={{ 
                          background: 'rgba(245,247,250,0.05)',
                          border: `1px solid rgba(245,247,250,0.1)`,
                          borderRadius: 12,
                          textAlign: 'center',
                          padding: '40px 20px',
                          backdropFilter: 'blur(5px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                        >
                          <Avatar 
                            src={item.avatar} 
                            size={100} 
                            style={{ 
                              border: `3px solid ${colors.accent}`,
                              boxShadow: `0 0 20px ${colors.accent}`,
                              marginBottom: 20
                            }}
                          />
                        </motion.div>
                        <h3 style={{ 
                          color: colors.light, 
                          fontSize: '1.5rem', 
                          marginBottom: 5 
                        }}>
                          {item.name}
                        </h3>
                        <p style={{ 
                          color: colors.accent, 
                          fontStyle: 'italic', 
                          marginBottom: 20,
                          fontWeight: '500'
                        }}>
                          {item.role}
                        </p>
                        <Divider style={{ 
                          borderColor: 'rgba(245,247,250,0.2)',
                          margin: '20px 0'
                        }} />
                        <p style={{ 
                          color: 'rgba(245,247,250,0.8)', 
                          fontSize: '1.1rem',
                          fontStyle: 'italic',
                          position: 'relative',
                          lineHeight: 1.6
                        }}>
                          <span style={{ 
                            position: 'absolute',
                            left: -30,
                            top: -20,
                            fontSize: '4rem',
                            color: 'rgba(255,75,43,0.2)',
                            fontFamily: 'serif'
                          }}>"</span>
                          {item.content}
                          <span style={{ 
                            position: 'absolute',
                            right: -30,
                            bottom: -40,
                            fontSize: '4rem',
                            color: 'rgba(255,75,43,0.2)',
                            fontFamily: 'serif'
                          }}>"</span>
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </Carousel>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: 30, 
                  gap: 10 
                }}>
                  {testimonials.map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <Button 
                        shape="circle" 
                        type={index === activeTestimonial ? 'primary' : 'default'} 
                        onClick={() => setActiveTestimonial(index)}
                        style={{
                          background: index === activeTestimonial ? colors.accent : 'rgba(245,247,250,0.2)',
                          border: 'none',
                          width: 12,
                          height: 12,
                          minWidth: 12,
                          padding: 0
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Newsletter Section with enhanced 3D form */}
        <section className="section" style={{ 
          padding: '80px 0', 
          background: colors.gradient,
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0% 100%)'
        }}>
          <div className="container">
            <AnimatedSection animation="fadeIn">
              <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                <motion.h2 
                  style={{ 
                    color: colors.light, 
                    marginBottom: 20,
                    fontSize: '2.2rem',
                    textShadow: `0 2px 10px ${colors.primary}`
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Stay Updated
                </motion.h2>
                <motion.p 
                  style={{ 
                    marginBottom: 30,
                    color: 'rgba(245,247,250,0.8)',
                    fontSize: '1.1rem'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Subscribe to our newsletter to get notified about upcoming auctions and special events
                </motion.p>
                <Form layout="inline" style={{ justifyContent: 'center' }}>
                  <Form.Item style={{ flex: 1, maxWidth: 400 }}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Input 
                        placeholder="Your email address" 
                        size="large" 
                        style={{ 
                          borderRadius: 25, 
                          padding: '12px 20px',
                          background: 'rgba(245,247,250,0.2)',
                          border: `1px solid rgba(245,247,250,0.3)`,
                          color: colors.light,
                          height: 50
                        }}
                      />
                    </motion.div>
                  </Form.Item>
                  <Form.Item>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        type="primary" 
                        size="large" 
                        htmlType="submit" 
                        style={{ 
                          background: colors.light, 
                          color: colors.accent,
                          borderRadius: 25,
                          fontWeight: 'bold',
                          border: 'none',
                          height: 50,
                          padding: '0 25px',
                          boxShadow: `0 4px 15px rgba(245,247,250,0.3)`
                        }}
                      >
                        Subscribe
                      </Button>
                    </motion.div>
                  </Form.Item>
                </Form>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Floating decorative elements */}
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.light} 0%, transparent 70%)`,
              filter: 'blur(20px)',
              opacity: 0.2
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.light} 0%, transparent 70%)`,
              filter: 'blur(25px)',
              opacity: 0.2
            }}
            animate={{
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 5
            }}
          />
        </section>
      </Content>

      <style jsx>{`
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        .nav-links {
          display: flex;
          gap: 30px;
        }
        
        .nav-link {
          color: rgba(245, 247, 250, 0.85);
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .auth-buttons {
          display: flex;
          gap: 15px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .section {
          width: 100%;
        }
        
        .ant-carousel .slick-slide {
          padding: 0 10px;
        }
        
        .ant-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.3s;
        }
        
        .top-bidder-gold {
          background: linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,255,255,1) 100%) !important;
        }
        
        .top-bidder-silver {
          background: linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(255,255,255,1) 100%) !important;
        }
        
        .top-bidder-bronze {
          background: linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(255,255,255,1) 100%) !important;
        }
        
        .ant-table-thead > tr > th {
          background: rgba(0,0,0,0.05) !important;
          color: ${colors.dark} !important;
          border-bottom: 1px solid rgba(0,0,0,0.1) !important;
          font-weight: bold !important;
        }
        
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(0,0,0,0.1) !important;
          background: rgba(255,255,255,0.9) !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: rgba(0,0,0,0.05) !important;
        }
        
        .ant-steps-item-title {
          color: ${colors.light} !important;
        }
        
        .ant-steps-item-description {
          color: rgba(245,247,250,0.7) !important;
        }
        
        .ant-steps-item-icon {
          background: rgba(245,247,250,0.1) !important;
          border-color: rgba(245,247,250,0.3) !important;
        }
        
        .ant-steps-item-icon .ant-steps-icon {
          color: ${colors.primary} !important;
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            padding: 10px 0;
          }
          
          .nav-links {
            margin: 15px 0;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .auth-buttons {
            margin-top: 10px;
          }
          
          .hero-section h1 {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;

