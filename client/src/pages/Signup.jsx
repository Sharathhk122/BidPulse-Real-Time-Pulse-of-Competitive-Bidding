import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Radio, Upload, Select, message, Typography, Modal, Alert } from 'antd';
import axios from 'axios';
import { motion, useAnimation } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// Advanced 3D Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const neonGlow = keyframes`
  0% { box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff; }
  25% { box-shadow: 0 0 15px #00ffff, 0 0 30px #00ffff; }
  50% { box-shadow: 0 0 15px #ff9900, 0 0 30px #ff9900; }
  75% { box-shadow: 0 0 15px #7c3aed, 0 0 30px #7c3aed; }
  100% { box-shadow: 0 0 15px #ff00ff, 0 0 30px #ff00ff; }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const wave = keyframes`
  0% { background-position-x: 0%; }
  100% { background-position-x: 200%; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const colorShift = keyframes`
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
`;

const particleFloat = keyframes`
  0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateY(-1000px) translateX(200px) rotate(720deg) scale(0.5); opacity: 0; }
`;

const hologramScan = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
`;

const ripple = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(3); opacity: 0; }
`;

// Styled components with advanced 3D effects
const FormContainer = styled.div`
  background: linear-gradient(145deg, #0f0c29, #302b63, #24243e, #1a1a2e);
  background-size: 400% 400%;
  animation: ${gradient} 12s ease infinite, ${neonGlow} 8s ease infinite;
  border-radius: 25px;
  box-shadow: 0 30px 50px rgba(0,0,0,0.5);
  border: 2px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  overflow: hidden;
  position: relative;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 100%;
  max-width: 800px;
  
  &:hover {
    box-shadow: 0 40px 60px rgba(0,0,0,0.7);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 0, 255, 0.05),
      rgba(0, 255, 255, 0.05),
      rgba(255, 153, 0, 0.05),
      rgba(124, 58, 237, 0.05)
    );
    animation: ${pulse} 12s linear infinite, ${colorShift} 60s linear infinite;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(90deg, 
      #ff00ff, #00ffff, #ff9900, #7c3aed, #ff00ff);
    background-size: 200% 100%;
    animation: ${wave} 4s linear infinite, ${colorShift} 30s linear infinite;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: rgba(255,255,255,0.95) !important;
    font-weight: 600;
    text-shadow: 0 0 8px rgba(124, 58, 237, 0.8);
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    
    &:hover {
      color: #00ffff !important;
      text-shadow: 0 0 15px rgba(0, 255, 255, 0.9);
      transform: translateX(5px);
    }
  }

  .ant-input, .ant-input-password, .ant-select-selector, .ant-upload {
    background: rgba(0,0,0,0.4) !important;
    border: 1px solid rgba(124, 58, 237, 0.7) !important;
    color: #fff !important;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backdrop-filter: blur(8px);
    border-radius: 10px !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);

    &:hover {
      border-color: #ff00ff !important;
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.7);
      transform: translateY(-3px);
    }

    &:focus {
      border-color: #00ffff !important;
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.9);
      transform: translateY(-5px);
    }

    &::placeholder {
      color: rgba(255,255,255,0.5) !important;
    }
  }

  .ant-input-affix-wrapper {
    background: rgba(0,0,0,0.4) !important;
    border: 1px solid rgba(124, 58, 237, 0.7) !important;
    border-radius: 10px !important;
    transition: all 0.4s;
  }

  .ant-upload.ant-upload-select-picture-card {
    background: rgba(0,0,0,0.4) !important;
    border: 2px dashed rgba(124, 58, 237, 0.7) !important;
    border-radius: 10px !important;
    transition: all 0.4s;
    animation: ${pulse} 3s ease infinite;

    &:hover {
      border-color: #ff00ff !important;
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.7);
      transform: translateY(-5px);
      animation: ${shake} 0.5s ease;
    }
  }

  .ant-radio-button-wrapper {
    background: rgba(0,0,0,0.4) !important;
    color: rgba(255,255,255,0.9) !important;
    border-color: rgba(124, 58, 237, 0.7) !important;
    transition: all 0.4s;
    font-weight: 500;
    letter-spacing: 0.5px;

    &:hover {
      color: #fff !important;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    &.ant-radio-button-wrapper-checked {
      background: linear-gradient(145deg, #ff00ff, #cc00ff) !important;
      border-color: #ff00ff !important;
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.8);
      transform: translateY(-3px);
      animation: ${pulse} 2s ease infinite;
    }
  }

  .ant-select-dropdown {
    background: rgba(20, 20, 50, 0.95) !important;
    border: 1px solid rgba(124, 58, 237, 0.7) !important;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
    backdrop-filter: blur(10px);
  }

  .ant-select-item {
    color: rgba(255,255,255,0.9) !important;
    transition: all 0.3s;

    &:hover {
      background: rgba(124, 58, 237, 0.3) !important;
    }

    &.ant-select-item-option-selected {
      background: rgba(124, 58, 237, 0.5) !important;
      font-weight: 600;
    }
  }
`;

const FloatingParticles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;

  span {
    position: absolute;
    display: block;
    animation: ${particleFloat} ${props => props.duration || '15s'} linear infinite;
    bottom: -150px;
    border-radius: 50%;
    filter: blur(3px);
    opacity: 0.8;
    animation-delay: ${props => props.delay || '0s'};
    animation-fill-mode: both;

    &:nth-child(1) {
      left: 25%;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, #ff00ff, transparent 70%);
      animation-duration: 18s;
    }
    &:nth-child(2) {
      left: 10%;
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, #00ffff, transparent 70%);
      animation-delay: 2s;
      animation-duration: 15s;
    }
    &:nth-child(3) {
      left: 70%;
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, #ff9900, transparent 70%);
      animation-delay: 4s;
      animation-duration: 20s;
    }
    &:nth-child(4) {
      left: 40%;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, #7c3aed, transparent 70%);
      animation-duration: 22s;
    }
    &:nth-child(5) {
      left: 65%;
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, #00ffaa, transparent 70%);
      animation-duration: 30s;
    }
    &:nth-child(6) {
      left: 75%;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, #ff00ff, transparent 70%);
      animation-delay: 3s;
      animation-duration: 25s;
    }
    &:nth-child(7) {
      left: 35%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, #00ffff, transparent 70%);
      animation-delay: 7s;
      animation-duration: 28s;
    }
    &:nth-child(8) {
      left: 50%;
      width: 40px;
      height: 40px;
      background: radial-gradient(circle, #ff9900, transparent 70%);
      animation-delay: 15s;
      animation-duration: 50s;
    }
    &:nth-child(9) {
      left: 20%;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, #7c3aed, transparent 70%);
      animation-delay: 2s;
      animation-duration: 40s;
    }
    &:nth-child(10) {
      left: 85%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, #00ffaa, transparent 70%);
      animation-duration: 15s;
    }
  }
`;

const GlowingButton = styled(Button)`
  background: linear-gradient(145deg, #ff00ff, #cc00ff, #9900ff);
  background-size: 200% 200%;
  animation: ${gradient} 6s ease infinite, ${pulse} 1.5s ease infinite;
  border: none !important;
  font-weight: bold !important;
  letter-spacing: 1.5px !important;
  text-shadow: 0 0 8px rgba(0,0,0,0.7);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  box-shadow: 0 5px 15px rgba(255, 0, 255, 0.5) !important;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255,255,255,0.1),
      rgba(255,255,255,0),
      rgba(255,255,255,0.1)
    );
    transform: rotate(45deg);
    animation: ${shimmer} 3s linear infinite;
  }
  
  &:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 15px 30px rgba(255, 0, 255, 0.7) !important;
    background: linear-gradient(145deg, #00ffff, #00ccff, #0099ff) !important;
    animation: ${shake} 0.5s ease;
  }
  
  &:active {
    transform: translateY(-2px) !important;
  }
`;

const HolographicOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 255, 0.05) 0%,
    rgba(0, 255, 255, 0.05) 25%,
    rgba(255, 153, 0, 0.05) 50%,
    rgba(124, 58, 237, 0.05) 75%,
    rgba(255, 0, 255, 0.05) 100%
  );
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
`;

const ScanLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 255, 255, 0.05) 0%,
    transparent 5%,
    transparent 95%,
    rgba(255, 0, 255, 0.05) 100%
  );
  background-size: 100% 8px;
  animation: ${hologramScan} 4s linear infinite;
  pointer-events: none;
  z-index: 2;
`;

const RippleEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  span {
    position: absolute;
    display: block;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,0,255,0.2), transparent 70%);
    animation: ${ripple} 8s linear infinite;
    animation-delay: ${props => props.delay || '0s'};
    
    &:nth-child(1) {
      width: 800px;
      height: 800px;
      top: -200px;
      left: -200px;
    }
    &:nth-child(2) {
      width: 600px;
      height: 600px;
      bottom: -150px;
      right: -150px;
      animation-delay: 2s;
    }
    &:nth-child(3) {
      width: 1000px;
      height: 1000px;
      top: 50%;
      left: 50%;
      margin-top: -500px;
      margin-left: -500px;
      animation-delay: 4s;
    }
  }
`;

const PasswordStrengthIndicator = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
`;

const StrengthBar = styled.div`
  flex: 1;
  background: ${props => 
    props.valid ? 'linear-gradient(to right, #00ff00, #00cc00)' : 
    'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;
`;

const StrengthLabel = styled.div`
  font-size: 12px;
  color: ${props => {
    if (props.strength === 'weak') return '#ff4d4f';
    if (props.strength === 'medium') return '#faad14';
    if (props.strength === 'strong') return '#52c41a';
    return 'rgba(255, 255, 255, 0.5)';
  }};
  margin-top: 4px;
  transition: all 0.3s ease;
`;

const TestCredentialsModal = ({ visible, onClose }) => {
  const credentials = [
    { neuralId: 'sharath1', encryptionKey: 'Sharathhk@123', role: 'customer' },
    { neuralId: 'sharath3', encryptionKey: 'Sharathhk@123', role: 'seller' }
  ];

  return (
    <Modal
      title={
        <span style={{
          background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          TEST CREDENTIALS FOR LOGIN
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="login"
          onClick={() => window.location.href = '/login'}
          style={{
            background: 'linear-gradient(45deg, #ff00ff, #cc00ff)',
            border: 'none',
            color: '#fff',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          GO TO LOGIN
        </Button>,
        <Button
          key="close"
          onClick={onClose}
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(124, 58, 237, 0.7)',
            color: '#fff'
          }}
        >
          CLOSE
        </Button>
      ]}
      centered
      width={600}
      className="cyber-modal"
      styles={{
        body: {
          background: 'linear-gradient(145deg, #0f0c29, #302b63)',
          border: '1px solid rgba(255, 0, 255, 0.3)',
          borderRadius: '10px',
          padding: '20px'
        },
        header: {
          background: 'rgba(0, 0, 0, 0.8)',
          borderBottom: '1px solid rgba(255, 0, 255, 0.3)'
        },
        footer: {
          background: 'rgba(0, 0, 0, 0.8)',
          borderTop: '1px solid rgba(255, 0, 255, 0.3)'
        }
      }}
    >
      <div className="space-y-6">
        <Alert
          message={
            <div>
              <div className="font-bold text-lg mb-2">⚠️ IMPORTANT: SMTP Blocked on Render</div>
              <div className="text-sm">
                Render does NOT allow raw SMTP (like Gmail SMTP) by default. 
                OTP emails won't work in production until you configure a proper email service.
              </div>
            </div>
          }
          description="Use these pre-created accounts for testing instead of signing up new accounts:"
          type="warning"
          showIcon
          style={{
            background: 'rgba(255, 153, 0, 0.1)',
            border: '1px solid rgba(255, 153, 0, 0.5)',
            color: '#fff'
          }}
        />
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((cred, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(124, 58, 237, 0.5)',
                  borderRadius: '10px'
                }}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-3 h-3 rounded-full mr-2 ${cred.role === 'seller' ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                  <span className="text-lg font-semibold" style={{ 
                    color: cred.role === 'seller' ? '#ff00ff' : '#00ffff' 
                  }}>
                    {cred.role === 'seller' ? 'Seller Account' : 'Customer Account'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-purple-300 mb-1">NEURAL ID:</div>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-mono text-green-400">{cred.neuralId}</code>
                      <Button
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(cred.neuralId);
                          message.success('Neural ID copied!');
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
                  </div>
                  
                  <div>
                    <div className="text-sm text-purple-300 mb-1">ENCRYPTION KEY:</div>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-mono text-pink-400">{cred.encryptionKey}</code>
                      <Button
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(cred.encryptionKey);
                          message.success('Encryption key copied!');
                        }}
                        style={{
                          background: 'rgba(255, 77, 255, 0.2)',
                          borderColor: '#ff4dff',
                          color: '#ff4dff'
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg" style={{ 
            background: 'rgba(124, 58, 237, 0.1)', 
            border: '1px solid rgba(124, 58, 237, 0.3)' 
          }}>
            <div className="flex items-start">
              <InfoCircleOutlined className="text-purple-400 text-lg mr-3 mt-1" />
              <div className="text-sm text-purple-200">
                <p className="font-semibold mb-2">How to use:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Click "GO TO LOGIN" button above</li>
                  <li>Use <strong>sharath1</strong> for regular customer access</li>
                  <li>Use <strong>sharath3</strong> for seller dashboard access</li>
                  <li>Encryption key for both accounts is: <strong>Sharathhk@123</strong></li>
                </ol>
                <p className="mt-3 text-yellow-300">
                  <strong>Note:</strong> Signup is currently disabled due to SMTP restrictions on Render. 
                  Use existing test accounts instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Signup = () => {
  const [role, setRole] = useState('customer');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [emailForOTP, setEmailForOTP] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    capital: false,
    symbol: false
  });
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const [showSMTPWarning, setShowSMTPWarning] = useState(true);

  useEffect(() => {
    controls.start({
      opacity: [0.8, 1, 0.8],
      transition: { duration: 3, repeat: Infinity }
    });
  }, [controls]);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    
    setPasswordStrength({
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  };

  const getPasswordStrength = () => {
    const validCount = Object.values(passwordStrength).filter(Boolean).length;
    
    if (validCount === 0) return 'weak';
    if (validCount === 1) return 'medium';
    if (validCount >= 2) return 'strong';
    
    return 'weak';
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append all basic fields
      formData.append('email', values.email);
      formData.append('username', values.username);
      formData.append('password', values.password);
      formData.append('passwordConfirm', values.passwordConfirm);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('role', role);
      
      // Append address as JSON string
      formData.append('address', JSON.stringify({
        street: values.address.street,
        city: values.address.city,
        state: values.address.state,
        postalCode: values.address.postalCode,
        country: values.address.country
      }));
      
      // Append profile photo if exists
      if (fileList.length > 0) {
        formData.append('profilePhoto', fileList[0].originFileObj);
      }
      
      // Append seller-specific fields if role is seller
      if (role === 'seller') {
        formData.append('businessName', values.businessName);
        formData.append('storeDescription', values.storeDescription);
        formData.append('taxId', values.taxId);
        formData.append('sellerType', values.sellerType);
      }

      // First send signup data
       await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup/${role}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // After successful signup, proceed to OTP verification
      setEmailForOTP(values.email);
      setStep(2);
      message.success('OTP sent to your email!');
    } catch (err) {
      console.error('Signup error:', err);
      message.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values) => {
    try {
      setOtpLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email: emailForOTP,
        otp: values.otp
      });
  
      localStorage.setItem('token', data.token);
      message.success('Account verified successfully!');
  
      // Conditional navigation based on role
      if (role === 'seller') {
        navigate('/seller-dashboard');
      } else if (role === 'customer') {
        navigate('/dashboard');
      } else {
        navigate('/'); // fallback or unknown role
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      message.error(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };
  

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, {
        email: emailForOTP
      });
      message.success('New OTP sent!');
    } catch (err) {
      console.error('Resend OTP error:', err);
      message.error(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ 
           background: 'radial-gradient(ellipse at center, #0f0c29 0%, #302b63 50%, #24243e 100%)',
           overflow: 'hidden'
         }}>
      <FloatingParticles>
        {[...Array(10)].map((_, i) => <span key={i} />)}
      </FloatingParticles>
      
      <RippleEffect>
        {[...Array(3)].map((_, i) => <span key={i} delay={`${i * 2}s`} />)}
      </RippleEffect>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        whileHover={{ scale: 1.01 }}
      >
        <FormContainer className="p-8 md:p-10">
          <HolographicOverlay />
          <ScanLines />
          <div className="flex flex-col relative z-10">
            {/* SMTP Warning Banner */}
            {showSMTPWarning && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <Alert
                  message={
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold">⚠️ SMTP Service Issue</span>
                        <span className="ml-2">OTP emails won't work on Render</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          onClick={() => setShowTestCredentials(true)}
                          style={{
                            background: 'linear-gradient(45deg, #ff00ff, #cc00ff)',
                            border: 'none',
                            color: '#fff'
                          }}
                        >
                          View Test Accounts
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setShowSMTPWarning(false)}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff'
                          }}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  }
                  description="Use existing test accounts instead of signing up. Click 'View Test Accounts' for login details."
                  type="warning"
                  showIcon
                  closable={false}
                  style={{
                    background: 'rgba(255, 153, 0, 0.1)',
                    border: '1px solid rgba(255, 153, 0, 0.5)',
                    color: '#fff',
                    borderRadius: '10px'
                  }}
                />
              </motion.div>
            )}

            {step === 1 ? (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <motion.h2 
                      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent"
                      animate={{
                        textShadow: [
                          '0 0 15px rgba(255, 0, 255, 0.8)',
                          '0 0 20px rgba(0, 255, 255, 0.8)',
                          '0 0 15px rgba(255, 153, 0, 0.8)',
                          '0 0 15px rgba(124, 58, 237, 0.8)'
                        ]
                      }}
                      transition={{ duration: 8, repeat: Infinity }}
                    >
                      Create Your Account
                    </motion.h2>
                    <motion.p 
                      className="text-purple-300 mt-2"
                      animate={controls}
                    >
                      Join our community and start your journey
                    </motion.p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      type="primary"
                      onClick={() => setShowTestCredentials(true)}
                      icon={<InfoCircleOutlined />}
                      style={{
                        background: 'linear-gradient(45deg, #23a6d5, #23d5ab)',
                        border: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Test Accounts
                    </Button>
                  </motion.div>
                </div>
                
                <div className="text-center mb-4">
                  <Text className="text-yellow-300">
                    ⚠️ Signup may not work due to SMTP restrictions. Use existing test accounts instead.
                  </Text>
                  <Button 
                    type="link" 
                    onClick={() => setShowTestCredentials(true)}
                    className="text-purple-300"
                  >
                    Click here for test login credentials
                  </Button>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Radio.Group 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full"
                  >
                    <div className="flex gap-4">
                      <Radio.Button 
                        value="customer"
                        className={`w-1/2 text-center text-lg ${role === 'customer' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-gray-900 text-purple-200'}`}
                      >
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Customer
                        </motion.span>
                      </Radio.Button>
                      <Radio.Button 
                        value="seller"
                        className={`w-1/2 text-center text-lg ${role === 'seller' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-gray-900 text-purple-200'}`}
                      >
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Seller
                        </motion.span>
                      </Radio.Button>
                    </div>
                  </Radio.Group>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <StyledForm
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ sellerType: 'individual' }}
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                      extra={
                        <Text className="text-xs text-yellow-300">
                          Note: OTP emails may not work due to SMTP restrictions
                        </Text>
                      }
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Input 
                          prefix={<MailOutlined className="text-purple-400" />} 
                          placeholder="Enter your email"
                        />
                      </motion.div>
                    </Form.Item>

                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Input 
                          prefix={<UserOutlined className="text-purple-400" />} 
                          placeholder="Choose a username"
                        />
                      </motion.div>
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 8, message: 'Password must be at least 8 characters!' },
                        { pattern: /[A-Z]/, message: 'Password must contain at least one capital letter!' },
                        { pattern: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: 'Password must contain at least one symbol!' }
                      ]}
                      extra={
                        <div>
                          <div className="text-xs text-purple-300 mb-2">
                            Password must contain:
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className={`flex items-center ${passwordStrength.length ? 'text-green-400' : 'text-gray-400'}`}>
                              <span className={`mr-1 ${passwordStrength.length ? 'text-green-400' : 'text-gray-400'}`}>
                                {passwordStrength.length ? '✓' : '•'}
                              </span>
                              <span>8+ characters</span>
                            </div>
                            <div className={`flex items-center ${passwordStrength.capital ? 'text-green-400' : 'text-gray-400'}`}>
                              <span className={`mr-1 ${passwordStrength.capital ? 'text-green-400' : 'text-gray-400'}`}>
                                {passwordStrength.capital ? '✓' : '•'}
                              </span>
                              <span>Capital letter</span>
                            </div>
                            <div className={`flex items-center ${passwordStrength.symbol ? 'text-green-400' : 'text-gray-400'}`}>
                              <span className={`mr-1 ${passwordStrength.symbol ? 'text-green-400' : 'text-gray-400'}`}>
                                {passwordStrength.symbol ? '✓' : '•'}
                              </span>
                              <span>Symbol</span>
                            </div>
                          </div>
                          <PasswordStrengthIndicator>
                            <StrengthBar valid={passwordStrength.length} />
                            <StrengthBar valid={passwordStrength.capital} />
                            <StrengthBar valid={passwordStrength.symbol} />
                          </PasswordStrengthIndicator>
                          <StrengthLabel strength={getPasswordStrength()}>
                            {getPasswordStrength() === 'weak' && 'Password strength: Weak'}
                            {getPasswordStrength() === 'medium' && 'Password strength: Medium'}
                            {getPasswordStrength() === 'strong' && 'Password strength: Strong'}
                          </StrengthLabel>
                        </div>
                      }
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Input.Password 
                          prefix={<LockOutlined className="text-purple-400" />} 
                          placeholder="Create a password"
                          onChange={handlePasswordChange}
                        />
                      </motion.div>
                    </Form.Item>

                    <Form.Item
                      name="passwordConfirm"
                      label="Confirm Password"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject('Passwords do not match!');
                          },
                        }),
                      ]}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Input.Password 
                          prefix={<LockOutlined className="text-purple-400" />} 
                          placeholder="Confirm your password"
                        />
                      </motion.div>
                    </Form.Item>

                    <Form.Item
                      name="phoneNumber"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Input 
                          prefix={<PhoneOutlined className="text-purple-400" />} 
                          placeholder="Enter phone number"
                        />
                      </motion.div>
                    </Form.Item>

                    <Form.Item
                      name="profilePhoto"
                      label="Profile Photo"
                      rules={[{ required: true, message: 'Please upload a profile photo!' }]}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Upload
                          listType="picture-card"
                          beforeUpload={() => false}
                          maxCount={1}
                          fileList={fileList}
                          onChange={handleFileChange}
                        >
                          {fileList.length >= 1 ? null : (
                            <motion.div 
                              className="text-purple-300 flex flex-col items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                              <div className="text-2xl mb-2">+</div>
                              <div>Upload Photo</div>
                            </motion.div>
                          )}
                        </Upload>
                      </motion.div>
                    </Form.Item>

                    <motion.div 
                      className="space-y-4 border-t border-purple-500 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.h3 
                        className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.02 }}
                      >
                        Address Information
                      </motion.h3>
                      
                      <Form.Item
                        name={['address', 'street']}
                        label="Street"
                        rules={[{ required: true, message: 'Please input your street address!' }]}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Input prefix={<HomeOutlined className="text-purple-400" />} />
                        </motion.div>
                      </Form.Item>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                          name={['address', 'city']}
                          label="City"
                          rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Input />
                          </motion.div>
                        </Form.Item>
                        <Form.Item
                          name={['address', 'state']}
                          label="State"
                          rules={[{ required: true, message: 'Please input your state!' }]}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Input />
                          </motion.div>
                        </Form.Item>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                          name={['address', 'postalCode']}
                          label="Postal Code"
                          rules={[{ required: true, message: 'Please input your postal code!' }]}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Input />
                          </motion.div>
                        </Form.Item>
                        <Form.Item
                          name={['address', 'country']}
                          label="Country"
                          rules={[{ required: true, message: 'Please input your country!' }]}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Input prefix={<EnvironmentOutlined className="text-purple-400" />} />
                          </motion.div>
                        </Form.Item>
                      </div>
                    </motion.div>

                    {role === 'seller' && (
                      <motion.div 
                        className="space-y-4 border-t border-purple-500 pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.h3 
                          className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
                          whileHover={{ scale: 1.02 }}
                        >
                          Seller Details
                        </motion.h3>

                        <Form.Item
                          name="businessName"
                          label="Business Name"
                          rules={[{ required: role === 'seller', message: 'Please input your business name!' }]}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Input />
                          </motion.div>
                        </Form.Item>

                        <Form.Item
                          name="storeDescription"
                          label="Store Description"
                          rules={[{ required: role === 'seller', message: 'Please input your store description!' }]}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <TextArea rows={4} />
                          </motion.div>
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Form.Item
                            name="taxId"
                            label="Tax ID"
                            rules={[{ required: role === 'seller', message: 'Please input your tax ID!' }]}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Input />
                            </motion.div>
                          </Form.Item>
                          <Form.Item
                            name="sellerType"
                            label="Seller Type"
                            rules={[{ required: role === 'seller', message: 'Please select seller type!' }]}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Select>
                                <Option value="individual">Individual</Option>
                                <Option value="business">Business</Option>
                              </Select>
                            </motion.div>
                          </Form.Item>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="p-4 rounded-lg" style={{ 
                        background: 'rgba(124, 58, 237, 0.1)', 
                        border: '1px solid rgba(124, 58, 237, 0.3)' 
                      }}>
                        <div className="flex items-start">
                          <InfoCircleOutlined className="text-purple-400 text-lg mr-3 mt-1" />
                          <div className="text-sm text-purple-200">
                            <p className="font-semibold mb-1">Alternative:</p>
                            <p>Instead of signing up, you can use existing test accounts. Click the "Test Accounts" button above for login details.</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          className="flex-1"
                        >
                          <Button
                            type="default"
                            onClick={() => window.location.href = '/login'}
                            block
                            size="large"
                            className="text-lg"
                            style={{
                              background: 'rgba(35, 166, 213, 0.2)',
                              borderColor: '#23a6d5',
                              color: '#23a6d5',
                              fontWeight: 'bold'
                            }}
                          >
                            Already have account? Login
                          </Button>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          className="flex-1"
                        >
                          <GlowingButton
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            className="text-lg"
                            loading={loading}
                            disabled={loading}
                          >
                            Create Account
                          </GlowingButton>
                        </motion.div>
                      </div>
                    </motion.div>
                  </StyledForm>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <motion.h2 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent"
                    animate={{
                      textShadow: [
                        '0 0 15px rgba(255, 0, 255, 0.8)',
                        '0 0 20px rgba(0, 255, 255, 0.8)',
                        '0 0 15px rgba(255, 153, 0, 0.8)',
                        '0 0 15px rgba(124, 58, 237, 0.8)'
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                  >
                    Verify Your Email
                  </motion.h2>
                  <motion.p 
                    className="text-purple-300 mt-2"
                    animate={controls}
                  >
                    We've sent a verification code to {emailForOTP}
                  </motion.p>
                  <div className="mt-4 p-3 rounded-lg" style={{ 
                    background: 'rgba(255, 153, 0, 0.1)', 
                    border: '1px solid rgba(255, 153, 0, 0.3)' 
                  }}>
                    <Text className="text-yellow-300 text-sm">
                      ⚠️ If you don't receive the OTP email, it's due to SMTP restrictions on Render. 
                      Use the test accounts instead.
                    </Text>
                    <Button 
                      type="link" 
                      onClick={() => setShowTestCredentials(true)}
                      className="text-purple-300 text-sm"
                    >
                      View test accounts
                    </Button>
                  </div>
                </div>

                <StyledForm
                  layout="vertical"
                  onFinish={handleVerifyOTP}
                >
                  <Form.Item
                    name="otp"
                    label="Verification Code"
                    rules={[{ required: true, message: 'Please input your OTP!' }]}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Input 
                        prefix={<LockOutlined className="text-purple-400" />} 
                        placeholder="Enter 6-digit OTP" 
                      />
                    </motion.div>
                  </Form.Item>

                  <motion.div
                    className="flex gap-4"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <GlowingButton
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className="text-lg"
                      loading={otpLoading}
                      disabled={otpLoading}
                    >
                      Verify
                    </GlowingButton>
                  </motion.div>

                  <motion.div
                    className="mt-4 text-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      type="link" 
                      onClick={handleResendOTP}
                      loading={resendLoading}
                      disabled={resendLoading}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      Didn't receive code? Resend OTP
                    </Button>
                  </motion.div>

                  <div className="text-center mt-6">
                    <Button 
                      type="link" 
                      onClick={() => setStep(1)}
                      className="text-purple-300"
                    >
                      ← Back to signup
                    </Button>
                  </div>
                </StyledForm>
              </motion.div>
            )}
          </div>
        </FormContainer>
      </motion.div>

      {/* Test Credentials Modal */}
      <TestCredentialsModal 
        visible={showTestCredentials}
        onClose={() => setShowTestCredentials(false)}
      />
    </div>
  );
};

export default Signup;
