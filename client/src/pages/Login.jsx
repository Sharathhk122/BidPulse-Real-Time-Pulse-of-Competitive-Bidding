import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Input, Button, Typography, Divider, Space, Spin, Checkbox, Form, Alert, Card, Modal } from 'antd';
import { MailOutlined, LockOutlined, GithubOutlined, GoogleOutlined, TwitterOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { motion, useAnimation, useTransform, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import 'tailwindcss/tailwind.css';

const { Title, Text } = Typography;

// Enhanced 3D Animation Container with gradient mesh
const AnimatedContainer = styled(motion.div)`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #0a0e17 0%, #05070a 100%);
`;

// Enhanced 3D Card with advanced lighting effects
const Card3D = styled(motion.div)`
  background: rgba(15, 12, 41, 0.2);
  border-radius: 30px;
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  transform-style: preserve-3d;
  box-shadow: 0 35px 60px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(255, 77, 255, 0.1),
              0 0 30px rgba(35, 213, 171, 0.2),
              0 0 60px rgba(35, 166, 213, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 30px;
    padding: 2px;
    background: linear-gradient(135deg, 
      rgba(255, 77, 255, 0.5) 0%, 
      rgba(35, 213, 171, 0.5) 50%, 
      rgba(35, 166, 213, 0.5) 100%);
    -webkit-mask: 
      linear-gradient(#000 0 0) content-box, 
      linear-gradient(#000 0 0);
    mask: 
      linear-gradient(#000 0 0) content-box, 
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: -1;
    animation: borderPulse 8s linear infinite;
  }

  @keyframes borderPulse {
    0% { opacity: 0.3; }
    50% { opacity: 0.8; }
    100% { opacity: 0.3; }
  }
`;

// Darker Cyberpunk styled input with floating effect
const CyberInput = styled(Input)`
  background: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  padding: 1.2rem 1.5rem !important;
  margin-bottom: 1.5rem !important;
  color: #23d5ab !important;
  font-size: 1.1rem !important;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6) !important;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transform: translateZ(30px);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #ff4dff, #23d5ab, #23a6d5);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:focus-within {
    box-shadow: 0 10px 25px rgba(35, 213, 171, 0.4);
    background: rgba(0, 0, 0, 0.8) !important;
    
    &::after {
      transform: scaleX(1);
    }
  }

  .ant-input-prefix {
    color: #23a6d5 !important;
    margin-right: 1rem !important;
    font-size: 1.3rem !important;
    text-shadow: 0 0 10px rgba(35, 166, 213, 0.7);
  }

  &:hover {
    transform: translateZ(40px) translateY(-5px);
    box-shadow: 0 15px 35px rgba(35, 213, 171, 0.5);
    background: rgba(0, 0, 0, 0.75) !important;
  }

  .ant-input {
    background: transparent !important;
    color: rgba(200, 255, 200, 0.9) !important;
    &::placeholder {
      color: rgba(200, 200, 255, 0.5) !important;
    }
  }
`;

// Enhanced Cyberpunk Password Input
const CyberPasswordInput = styled(Input.Password)`
  background: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  padding: 1.2rem 1.5rem !important;
  margin-bottom: 1.5rem !important;
  color: #23d5ab !important;
  font-size: 1.1rem !important;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6) !important;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transform: translateZ(30px);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #ff4dff, #23d5ab, #23a6d5);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:focus-within {
    box-shadow: 0 10px 25px rgba(35, 213, 171, 0.4);
    background: rgba(0, 0, 0, 0.8) !important;
    
    &::after {
      transform: scaleX(1);
    }
  }

  .ant-input-prefix {
    color: #23a6d5 !important;
    margin-right: 1rem !important;
    font-size: 1.3rem !important;
    text-shadow: 0 0 10px rgba(35, 166, 213, 0.7);
  }

  &:hover {
    transform: translateZ(40px) translateY(-5px);
    box-shadow: 0 15px 35px rgba(35, 213, 171, 0.5);
    background: rgba(0, 0, 0, 0.75) !important;
  }

  .ant-input {
    background: transparent !important;
    color: rgba(200, 255, 200, 0.9) !important;
    &::placeholder {
      color: rgba(200, 200, 255, 0.5) !important;
    }
  }

  .ant-input-suffix {
    color: #ff4dff !important;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      color: #23d5ab !important;
      transform: scale(1.2);
    }
  }
`;

// Enhanced Holographic button with 3D press effect
const HologramButton = styled(motion.button)`
  background: linear-gradient(
    145deg,
    #ff4dff 0%,
    #23d5ab 50%,
    #23a6d5 100%
  );
  border: none;
  color: #0f0c29;
  padding: 1.3rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 15px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 30px rgba(255, 77, 255, 0.4),
              0 0 20px rgba(35, 213, 171, 0.3),
              0 0 40px rgba(35, 166, 213, 0.2);
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.4),
      transparent
    );
    transform: rotate(45deg);
    transition: 0.5s;
  }

  &:hover {
    transform: translateZ(50px) translateY(-5px) rotateX(10deg);
    box-shadow: 0 20px 50px rgba(255,77,255,0.6),
               0 0 40px rgba(35,213,171,0.4),
               0 0 60px rgba(35,166,213,0.3);

    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateZ(30px) translateY(0) scale(0.98);
  }
`;

// Enhanced Floating Social Icons with 3D hover effect
const Social3D = styled(motion.div)`
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  transition: all 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    padding: 2px;
    background: linear-gradient(45deg, #ff4dff, #23d5ab);
    -webkit-mask: 
      linear-gradient(#000 0 0) content-box, 
      linear-gradient(#000 0 0);
    mask: 
      linear-gradient(#000 0 0) content-box, 
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: rotateBorder 6s linear infinite;
  }

  @keyframes rotateBorder {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  &:hover {
    transform: translateZ(40px) scale(1.2);
    box-shadow: 0 0 30px rgba(255,77,255,0.6);
  }
`;

// Floating particles container
const ParticleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

// Cyberpunk Checkbox
const CyberCheckbox = styled(Checkbox)`
  .ant-checkbox-inner {
    background-color: rgba(0, 0, 0, 0.7);
    border-color: #23a6d5;
    border-width: 2px;
    &:after {
      border-color: #23d5ab;
    }
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: rgba(0, 0, 0, 0.7);
    border-color: #ff4dff;
  }
  .ant-checkbox + span {
    color: rgba(200, 200, 255, 0.8);
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
  &:hover .ant-checkbox-inner {
    border-color: #ff4dff;
  }
`;

// Cyberpunk Alert
const CyberAlert = styled(Alert)`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 77, 255, 0.3);
  border-radius: 12px;
  color: rgba(200, 255, 200, 0.9);
  margin-bottom: 1.5rem;
  .ant-alert-message {
    color: #23d5ab;
  }
  .ant-alert-icon {
    color: #ff4dff;
  }
`;

// Cyberpunk OTP Input
const CyberOTPInput = styled(Input)`
  background: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  padding: 1.2rem 1.5rem !important;
  margin-bottom: 1.5rem !important;
  color: #23d5ab !important;
  font-size: 1.1rem !important;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6) !important;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transform: translateZ(30px);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #ff4dff, #23d5ab, #23a6d5);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:focus-within {
    box-shadow: 0 10px 25px rgba(35, 213, 171, 0.4);
    background: rgba(0, 0, 0, 0.8) !important;
    
    &::after {
      transform: scaleX(1);
    }
  }

  &:hover {
    transform: translateZ(40px) translateY(-5px);
    box-shadow: 0 15px 35px rgba(35, 213, 171, 0.5);
    background: rgba(0, 0, 0, 0.75) !important;
  }

  .ant-input {
    background: transparent !important;
    color: rgba(200, 255, 200, 0.9) !important;
    &::placeholder {
      color: rgba(200, 200, 255, 0.5) !important;
    }
  }
`;

// Test Credentials Modal Component
const TestCredentialsModal = ({ visible, onClose }) => {
  const credentials = [
    { neuralId: 'sharath1', encryptionKey: 'Sharathhk@123' },
    { neuralId: 'sharath3', encryptionKey: 'Sharathhk@123' }
  ];

  return (
    <Modal
      title={
        <span style={{
          background: 'linear-gradient(45deg, #ff4dff, #23d5ab)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          TEST CREDENTIALS
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          style={{
            background: 'linear-gradient(45deg, #ff4dff, #23a6d5)',
            border: 'none',
            color: '#0f0c29',
            fontWeight: 'bold'
          }}
        >
          CLOSE
        </Button>
      ]}
      centered
      className="cyber-modal"
      styles={{
        body: {
          background: 'rgba(15, 12, 41, 0.95)',
          border: '1px solid rgba(255, 77, 255, 0.2)',
          borderRadius: '10px',
          padding: '20px'
        },
        header: {
          background: 'rgba(0, 0, 0, 0.9)',
          borderBottom: '1px solid rgba(255, 77, 255, 0.2)'
        },
        footer: {
          background: 'rgba(0, 0, 0, 0.9)',
          borderTop: '1px solid rgba(255, 77, 255, 0.2)'
        }
      }}
    >
      <div className="space-y-4">
        <Alert
          message="Use these credentials for testing"
          description="Copy and paste these credentials to test the login functionality"
          type="info"
          showIcon
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(35, 166, 213, 0.3)',
            color: 'rgba(200, 255, 200, 0.9)'
          }}
        />
        
        <div className="space-y-3">
          {credentials.map((cred, index) => (
            <Card
              key={index}
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 77, 255, 0.3)',
                borderRadius: '10px'
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#23a6d5', fontWeight: 'bold' }}>NEURAL ID:</span>
                    <code style={{ color: '#23d5ab', fontSize: '1rem' }}>{cred.neuralId}</code>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span style={{ color: '#23a6d5', fontWeight: 'bold' }}>ENCRYPTION KEY:</span>
                    <code style={{ color: '#ff4dff', fontSize: '1rem' }}>{cred.encryptionKey}</code>
                  </div>
                </div>
                <Button
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(`Neural ID: ${cred.neuralId}\nEncryption Key: ${cred.encryptionKey}`);
                    toast.success('Credentials copied to clipboard!');
                  }}
                  style={{
                    background: 'rgba(35, 213, 171, 0.2)',
                    borderColor: '#23d5ab',
                    color: '#23d5ab'
                  }}
                >
                  Copy
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(255, 77, 255, 0.1)' }}>
          <Text className="text-blue-100 text-sm">
            <InfoCircleOutlined className="mr-2" />
            These are test accounts. Use 'sharath1' for regular user and 'sharath3' for seller account.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeField, setActiveField] = useState(null);
  const [form] = Form.useForm();
  const [step, setStep] = useState(1); // 1 = login, 2 = verify
  const [emailForOTP, setEmailForOTP] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const [autoFillCredentials, setAutoFillCredentials] = useState(null);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotate({ x: (y - 0.5) * 20, y: (x - 0.5) * -20 });
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    await controls.start({
      scale: [1, 0.95, 1],
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.6 }
    });

    try {
      const { user } = await login(emailOrUsername, password);
      toast.success('Access granted!');
      navigate(user.role === 'seller' ? '/seller-dashboard' : '/dashboard');
    } catch (err) {
      await controls.start({
        x: [0, -15, 15, -15, 15, 0],
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.6 }
      });
      
      if (err.response?.data?.message === 'Account not verified') {
        setEmailForOTP(emailOrUsername);
        setStep(2);
        toast('Verification required. Please check your email for OTP.', {
          icon: '🔒',
          style: {
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        setError(err.response?.data?.message || 'Authentication failed');
        toast.error(err.response?.data?.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpLoading(true);
    setOtpError(null);
    try {
      const { user } = await verifyOTP(emailForOTP, otp);
      toast.success('Account verified successfully!');
      navigate(user.role === 'seller' ? '/seller-dashboard' : '/dashboard');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP');
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(emailForOTP);
      toast.success('New OTP sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  // Auto-fill test credentials
  const fillTestCredentials = (neuralId, encryptionKey) => {
    setEmailOrUsername(neuralId);
    setPassword(encryptionKey);
    setAutoFillCredentials({ neuralId, encryptionKey });
    toast.success(`Auto-filled: ${neuralId}`);
  };

  // 3D Animation variants
  const cardVariants = {
    rest: { 
      rotateX: 0, 
      rotateY: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 20
      } 
    },
    hover: { 
      rotateX: rotate.x, 
      rotateY: rotate.y,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const particleOptions = {
    fullScreen: { enable: false, zIndex: 0 },
    particles: {
      number: { value: 150, density: { enable: true, value_area: 800 } },
      color: { value: ['#ff4dff', '#23d5ab', '#23a6d5'] },
      shape: { 
        type: ['circle', 'triangle', 'star'],
        stroke: { width: 0, color: '#000000' },
        polygon: { nb_sides: 5 }
      },
      opacity: { 
        value: 0.7, 
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
      },
      size: { 
        value: 4, 
        random: true,
        anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
      },
      move: {
        enable: true,
        speed: 3,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'repulse' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  };

  // Floating label animation
  const floatingLabelVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <AnimatedContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="bg-gray-900"
    >
      <ParticleContainer>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particleOptions}
        />
      </ParticleContainer>

      <Card3D
        variants={cardVariants}
        animate="hover"
        initial="rest"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-8"
        >
          <Title
            level={2}
            className="mb-2 text-4xl tracking-widest"
            style={{
              background: 'linear-gradient(45deg, #ff4dff, #23d5ab, #23a6d5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {step === 1 ? 'NEXUS ACCESS' : 'VERIFICATION'}
          </Title>
          <Text className="text-blue-100 text-lg tracking-wide">
            {step === 1 ? 'Enter the digital gateway' : 'Enter your verification code'}
          </Text>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' }}
          >
            <CyberAlert
              message="Authentication Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          </motion.div>
        )}

        {otpError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' }}
          >
            <CyberAlert
              message="Verification Error"
              description={otpError}
              type="error"
              showIcon
              closable
              onClose={() => setOtpError(null)}
            />
          </motion.div>
        )}

        {step === 1 ? (
          <Form
            form={form}
            onSubmitCapture={handleSubmit}
            layout="vertical"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Form.Item
                label={
                  <motion.span 
                    className="text-blue-100 text-sm tracking-wider"
                    variants={floatingLabelVariants}
                  >
                    NEURAL ID
                  </motion.span>
                }
                extra={
                  <Text className="text-xs text-blue-300">
                    Use 'sharath1' or 'sharath3'
                  </Text>
                }
              >
                <CyberInput
                  placeholder="Enter your neural ID"
                  prefix={<UserOutlined />}
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  required
                />
              </Form.Item>
              
              <Form.Item
                label={
                  <motion.span 
                    className="text-blue-100 text-sm tracking-wider"
                    variants={floatingLabelVariants}
                  >
                    ENCRYPTION KEY
                  </motion.span>
                }
                extra={
                  <Text className="text-xs text-blue-300">
                    Use 'Sharathhk@123'
                  </Text>
                }
              >
                <CyberPasswordInput
                  placeholder="Enter your encryption key"
                  prefix={<LockOutlined />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  required
                />
              </Form.Item>

              <Form.Item>
                <CyberCheckbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember my neural pattern
                </CyberCheckbox>
              </Form.Item>

              {/* Auto-fill buttons */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex space-x-2 mb-2">
                  <Button
                    size="small"
                    onClick={() => fillTestCredentials('sharath1', 'Sharathhk@123')}
                    style={{
                      background: 'rgba(35, 166, 213, 0.2)',
                      borderColor: '#23a6d5',
                      color: '#23a6d5',
                      flex: 1
                    }}
                  >
                    Auto-fill User
                  </Button>
                  <Button
                    size="small"
                    onClick={() => fillTestCredentials('sharath3', 'Sharathhk@123')}
                    style={{
                      background: 'rgba(255, 77, 255, 0.2)',
                      borderColor: '#ff4dff',
                      color: '#ff4dff',
                      flex: 1
                    }}
                  >
                    Auto-fill Seller
                  </Button>
                </div>
                <Button
                  type="link"
                  onClick={() => setShowTestCredentials(true)}
                  style={{ color: '#23d5ab', padding: 0 }}
                  className="text-xs"
                >
                  <InfoCircleOutlined className="mr-1" />
                  View all test credentials
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <HologramButton
                type="submit"
                animate={controls}
                disabled={isLoading}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center"
              >
                {isLoading ? (
                  <Space>
                    <Spin className="text-gray-900" />
                    <span>INITIALIZING...</span>
                  </Space>
                ) : (
                  'AUTHENTICATE'
                )}
              </HologramButton>
            </motion.div>
          </Form>
        ) : (
          <Form
            layout="vertical"
            onFinish={handleVerifyOTP}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Form.Item
                label={
                  <motion.span 
                    className="text-blue-100 text-sm tracking-wider"
                    variants={floatingLabelVariants}
                  >
                    VERIFICATION CODE
                  </motion.span>
                }
              >
                <CyberOTPInput
                  placeholder="Enter 6-digit OTP"
                  prefix={<LockOutlined />}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </Form.Item>

              <Text className="text-blue-100 text-sm mb-4 block">
                We've sent a verification code to {emailForOTP}
              </Text>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <HologramButton
                type="submit"
                disabled={otpLoading}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center mb-4"
              >
                {otpLoading ? (
                  <Space>
                    <Spin className="text-gray-900" />
                    <span>VERIFYING...</span>
                  </Space>
                ) : (
                  'VERIFY IDENTITY'
                )}
              </HologramButton>

              <Button 
                type="link" 
                onClick={handleResendOTP}
                className="w-full text-center"
                style={{ color: '#23a6d5' }}
              >
                Resend Code
              </Button>
            </motion.div>

            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                type="link" 
                onClick={() => setStep(1)}
                style={{ color: '#ff4dff' }}
              >
                ← Back to login
              </Button>
            </motion.div>
          </Form>
        )}

        {step === 1 && (
          <>
            <motion.div
              className="mt-10 mb-6"
              style={{ transform: 'translateZ(20px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Divider className="border-opacity-10">
                <Text className="text-blue-100 text-xs tracking-widest">
                  CONNECT VIA
                </Text>
              </Divider>

              <Space size="large" className="w-full justify-center">
                <Social3D 
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <GithubOutlined className="text-pink-500 text-2xl" />
                </Social3D>
                <Social3D 
                  whileHover={{ scale: 1.3, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <GoogleOutlined className="text-teal-400 text-2xl" />
                </Social3D>
                <Social3D 
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <TwitterOutlined className="text-blue-400 text-2xl" />
                </Social3D>
              </Space>
            </motion.div>

            <motion.div
              className="text-center text-blue-100 text-sm"
              style={{ transform: 'translateZ(20px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              New to the network?{' '}
              <motion.a
                href="/signup"
                className="text-pink-500 font-semibold no-underline tracking-wider"
                whileHover={{
                  color: '#23d5ab',
                  textShadow: '0 0 15px rgba(35,213,171,0.7)'
                }}
              >
                REGISTER IDENTITY
              </motion.a>
            </motion.div>
          </>
        )}

        <motion.div
          className="mt-4 text-center text-gray-500 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Text>v2.5.8 • Nexus Security Protocol • Test Mode Active</Text>
        </motion.div>
      </Card3D>

      {/* Floating cyberpunk elements */}
      <motion.div 
        className="absolute top-10 left-10 w-16 h-16 rounded-full bg-pink-500 opacity-20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-teal-400 opacity-15 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Test Credentials Modal */}
      <TestCredentialsModal 
        visible={showTestCredentials}
        onClose={() => setShowTestCredentials(false)}
      />
    </AnimatedContainer>
  );
};

export default Login;
