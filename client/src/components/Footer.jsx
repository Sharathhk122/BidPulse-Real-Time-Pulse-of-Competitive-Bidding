import React from "react";
import { 
  GithubOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  LinkedinOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  FireOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { Space, Tooltip, Badge } from 'antd';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Footer = () => {
  const socialLinks = [
    {
      icon: <GithubOutlined style={{ fontSize: '28px' }} />,
      url: "https://github.com/Sharathhk122",
      color: "from-purple-600 via-pink-600 to-blue-600",
      tooltip: "GitHub",
      badgeColor: "purple"
    },
    {
      icon: <TwitterOutlined style={{ fontSize: '28px' }} />,
      url: "https://x.com/SharathHk417289?t=kLmaxzAEiKCjV_r2i7Kbfg&s=09",
      color: "from-blue-400 via-cyan-400 to-sky-500",
      tooltip: "Twitter",
      badgeColor: "cyan"
    },
    {
      icon: <InstagramOutlined style={{ fontSize: '28px' }} />,
      url: "https://www.instagram.com/sharath_hk__01/profilecard/?igsh=Mzc1Y3IxdGFmOXNh ",
      color: "from-pink-500 via-red-500 to-yellow-500",
      tooltip: "Instagram",
      badgeColor: "magenta"
    },
    {
      icon: <LinkedinOutlined style={{ fontSize: '28px' }} />,
      url: "https://www.linkedin.com/in/sharath-h-k-174536308?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      color: "from-blue-600 via-blue-700 to-indigo-800",
      tooltip: "LinkedIn",
      badgeColor: "blue"
    },
    {
      icon: <RocketOutlined style={{ fontSize: '28px' }} />,
      url: "https://rocket.com",
      color: "from-orange-500 via-red-500 to-purple-600",
      tooltip: "Rocket",
      badgeColor: "orange"
    }
  ];

  // Animation controls for the title
  const titleControls = useAnimation();
  const [titleRef, titleInView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  React.useEffect(() => {
    if (titleInView) {
      titleControls.start({
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      });
    } else {
      titleControls.stop();
    }
  }, [titleInView, titleControls]);

  // Particle animation
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const size = Math.random() * 4 + 1;
    return (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -50, 0, 50, 0],
          x: [0, 20, -20, 10, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    );
  });

  return (
    <footer className="bg-gray-900 text-white py-8 relative overflow-hidden border-t border-gray-800">
      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles}
      </div>

      {/* Enhanced grid background animation */}
      <motion.div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Pulsing gradient overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.02, 0.05, 0.02],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1), transparent 70%)`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left mb-6 md:mb-0"
          >
            <motion.h2 
              ref={titleRef}
              animate={titleControls}
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.3 }
              }}
            >
              LiveAuction 3D
            </motion.h2>
            <motion.p 
              className="text-lg mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              Next-Gen Real-Time Bidding System © {new Date().getFullYear()}
            </motion.p>
            <motion.div 
              className="mt-4 flex justify-center md:justify-start space-x-3"
            >
              <Badge 
                count={
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <FireOutlined className="text-yellow-500 text-lg" />
                  </motion.div>
                }
              >
                <motion.span 
                  className="text-sm bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text"
                  whileHover={{ scale: 1.1 }}
                >
                  HOT BIDS
                </motion.span>
              </Badge>
              <Badge 
                count={
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ThunderboltOutlined className="text-blue-400 text-lg" />
                  </motion.div>
                }
              >
                <motion.span 
                  className="text-sm bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"
                  whileHover={{ scale: 1.1 }}
                >
                  LIGHTNING FAST
                </motion.span>
              </Badge>
              <Badge 
                count={
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <CrownOutlined className="text-purple-400 text-lg" />
                  </motion.div>
                }
              >
                <motion.span 
                  className="text-sm bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
                  whileHover={{ scale: 1.1 }}
                >
                  PREMIUM
                </motion.span>
              </Badge>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Space size="large" className="flex flex-wrap justify-center">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.2,
                    rotateY: 360,
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ 
                    duration: 0.3,
                    rotateY: { 
                      duration: 0.6, 
                      ease: "easeInOut" 
                    }
                  }}
                >
                  <Tooltip 
                    title={link.tooltip} 
                    color={link.badgeColor}
                    overlayStyle={{
                      animation: "pulse 2s infinite"
                    }}
                  >
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`block p-3 rounded-xl bg-gradient-to-br ${link.color} shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2 + index * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {link.icon}
                      </motion.div>
                    </a>
                  </Tooltip>
                </motion.div>
              ))}
            </Space>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 pt-6 border-t border-gray-800 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.p 
            className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%'],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              backgroundSize: '300% 300%',
            }}
          >
            Experience the future of real-time bidding with our cutting-edge 3D platform
          </motion.p>
          <motion.p 
            className="text-base mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Developed with ❤️ by Sharath H K and Prashanth Rao
          </motion.p>
        </motion.div>
      </div>

      {/* Enhanced scanning beam effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.7, 0],
          left: ['-100%', '150%', '150%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Additional scanning beam for depth */}
      <motion.div
        className="absolute top-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.4, 0],
          left: ['-150%', '120%', '120%'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </footer>
  );
};

export default Footer;