// pages/CreateAuction.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiX, FiUpload, FiDollarSign, FiCalendar, FiType, FiAlignLeft, FiImage, FiTag, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Card, Input, Select, Button, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const CreateAuction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Art',
    startingBid: '',
    reservePrice: '',
    buyNowPrice: '',
    endTime: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);

  const categories = ['Art', 'Electronics', 'Furniture', 'Jewelry', 'Collectibles', 'Other'];

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      toast.error('Seller privileges required');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    let filledFields = 0;
    const requiredFields = ['title', 'description', 'category', 'startingBid', 'reservePrice', 'endTime'];
    
    requiredFields.forEach(field => {
      if (formData[field]) filledFields++;
    });
    if (formData.images.length > 0) filledFields++;
    
    setFormProgress(Math.round((filledFields / (requiredFields.length + 1)) * 100));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImagePreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImagePreviews(newImagePreviews);
    setFormData({ ...formData, images: files });
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    
    const newFiles = [...formData.images];
    newFiles.splice(index, 1);
    
    setImagePreviews(newPreviews);
    setFormData({ ...formData, images: newFiles });
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.startingBid || !formData.reservePrice || !formData.endTime) {
      toast.error('Please fill all required fields');
      return false;
    }

    if (parseFloat(formData.reservePrice) < parseFloat(formData.startingBid)) {
      toast.error('Reserve price must be greater than starting bid');
      return false;
    }
    
    if (formData.buyNowPrice && parseFloat(formData.buyNowPrice) <= parseFloat(formData.startingBid)) {
      toast.error('Buy now price must be greater than starting bid');
      return false;
    }

    if (new Date(formData.endTime) <= new Date()) {
      toast.error('End time must be in the future');
      return false;
    }

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('startingBid', formData.startingBid);
      formDataToSend.append('reservePrice', formData.reservePrice);
      if (formData.buyNowPrice) {
        formDataToSend.append('buyNowPrice', formData.buyNowPrice);
      }
      formDataToSend.append('endTime', new Date(formData.endTime).toISOString());

      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await axios.post('/api/auctions', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Auction created successfully!');
      navigate('/seller-dashboard');
    } catch (err) {
      console.error('Error creating auction:', err);
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadButton = (
    <motion.div
      whileHover={{ scale: 1.05, rotateZ: 1 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-purple-400 bg-gray-800"
    >
      <FiUpload className="text-2xl text-purple-300 mb-2" />
      <span className="text-purple-300 font-medium">Click or drag to upload</span>
    </motion.div>
  );

  const fieldFocusAnimation = {
    scale: 1.02,
    y: -3,
    zIndex: 10,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(236, 72, 153, 0.4)",
      "0 0 0 10px rgba(236, 72, 153, 0)",
      "0 0 0 0 rgba(236, 72, 153, 0)"
    ],
    transition: {
      repeat: Infinity,
      duration: 2
    }
  };

  const colorWaveAnimation = {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      repeat: Infinity,
      duration: 15,
      ease: "linear"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-4 px-4 relative overflow-hidden flex flex-col items-center">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 150 },
            color: { 
              value: ["#FF5F6D", "#FFC371", "#4e54c8", "#8f94fb", "#00b09b", "#96c93d", "#ff8a00", "#e52e71"]
            },
            shape: { 
              type: ["circle", "triangle", "star", "polygon"],
              options: {
                polygon: { sides: 6 },
                star: { sides: 5 }
              }
            },
            opacity: { 
              value: 0.8, 
              random: true,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.3,
                sync: false
              }
            },
            size: { 
              value: 6, 
              random: { 
                enable: true, 
                minimumValue: 3 
              },
              animation: {
                enable: true,
                speed: 8,
                minimumValue: 0.5
              }
            },
            move: {
              enable: true,
              speed: 4,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "bounce",
              bounce: true,
              attract: { 
                enable: true, 
                rotateX: 3000, 
                rotateY: 3000 
              },
              trail: {
                enable: true,
                length: 15,
                fillColor: "#ff00ff"
              }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { 
                enable: true, 
                mode: "repulse",
                parallax: {
                  enable: true,
                  force: 80,
                  smooth: 15
                }
              },
              onclick: { 
                enable: true, 
                mode: "push" 
              },
              resize: true
            },
            modes: {
              bubble: {
                distance: 250,
                size: 20,
                duration: 3,
                opacity: 0.8,
                speed: 4
              },
              repulse: {
                distance: 200,
                duration: 0.6
              },
              push: {
                particles_nb: 6
              }
            }
          }
        }}
      />

      <div className="w-full max-w-4xl mx-auto relative z-10 px-4 mt-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-2 text-center"
        >
          <motion.h2
            animate={{
              textShadow: [
                "0 0 12px rgba(34, 211, 238, 0.8)",
                "0 0 16px rgba(236, 72, 153, 0.8)",
                "0 0 20px rgba(34, 211, 238, 0.8)",
                "0 0 24px rgba(167, 139, 250, 0.8)"
              ]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 4
            }}
            className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400"
          >
            Create Your Auction
          </motion.h2>
          <motion.div
            animate={{
              textShadow: "0 0 8px rgba(165, 243, 252, 0.7)"
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2
            }}
          >
            <p className="text-purple-300 text-lg font-medium">
              Fill in the details to list your item for auction
            </p>
          </motion.div>
        </motion.div>

        {/* Form Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-300 font-medium">Form Completion</span>
            <span className="text-pink-300 font-bold">{formProgress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <motion.div 
              className="h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${formProgress}%` }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(90deg, #ec4899, #3b82f6)'
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)"
          }}
          transition={{ duration: 0.5, type: "spring" }}
          whileHover={{ 
            y: -5,
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.7)"
          }}
          className="w-full"
        >
          <Card
            className="rounded-2xl shadow-2xl bg-gray-900 bg-opacity-90 backdrop-blur-sm border-0 border-b-4 border-purple-500"
            bodyStyle={{ padding: '24px' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  ...(activeField === 'title' ? fieldFocusAnimation : {})
                }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                onFocus={() => setActiveField('title')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-purple-300 mb-1 flex items-center">
                  <motion.span 
                    animate={floatingAnimation}
                    className="mr-2"
                  >
                    <FiType className="text-pink-400" />
                  </motion.span>
                  Title *
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                >
                 <Input
  type="text"
  name="title"
  value={formData.title}
  onChange={handleChange}
  required
  prefix={<FiType className="text-pink-400" />}
  className="w-full bg-gray-800 text-pink-300 placeholder-pink-500 border-gray-700 hover:border-cyan-400 focus:border-cyan-400 focus:text-pink-300"
/>

                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  ...(activeField === 'description' ? fieldFocusAnimation : {})
                }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                onFocus={() => setActiveField('description')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-purple-300 mb-1 flex items-center">
                  <motion.span 
                    animate={floatingAnimation}
                    className="mr-2"
                  >
                    <FiAlignLeft className="text-pink-400" />
                  </motion.span>
                  Description *
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                >
                  <TextArea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border-gray-700 text-purple-200 hover:border-cyan-400 focus:border-cyan-400"
                  />
                </motion.div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    ...(activeField === 'category' ? fieldFocusAnimation : {})
                  }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  onFocus={() => setActiveField('category')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className="block text-sm font-medium text-purple-300 mb-1">Category *</label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                  >
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={(value) => setFormData({...formData, category: value})}
                      className="w-full text-purple-200"
                      dropdownClassName="bg-gray-800 border-purple-500"
                    >
                      {categories.map((cat, index) => (
                        <Option 
                          key={cat} 
                          value={cat}
                          className={`${index % 2 === 0 ? 'bg-purple-900' : 'bg-violet-900'} hover:bg-gradient-to-r from-purple-800 to-violet-800 text-purple-200`}
                        >
                          {cat}
                        </Option>
                      ))}
                    </Select>
                  </motion.div>
                </motion.div>

                {/* End Time */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    ...(activeField === 'endTime' ? fieldFocusAnimation : {})
                  }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                  onFocus={() => setActiveField('endTime')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className="block text-sm font-medium text-purple-300 mb-1">End Time *</label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                  >
                    <Input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      prefix={<FiCalendar className="text-pink-400" />}
                      className="w-full bg-gray-800 border-gray-700 text-purple-200 hover:border-cyan-400 focus:border-cyan-400"
                    />
                  </motion.div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Starting Bid */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    ...(activeField === 'startingBid' ? fieldFocusAnimation : {})
                  }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                  onFocus={() => setActiveField('startingBid')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className="block text-sm font-medium text-purple-300 mb-1 flex items-center">
                    <motion.span 
                      animate={floatingAnimation}
                      className="mr-2"
                    >
                      <FiDollarSign className="text-pink-400" />
                    </motion.span>
                    Starting Bid ($) *
                  </label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                  >
                    <Input
                      type="number"
                      name="startingBid"
                      min="0.01"
                      step="0.01"
                      value={formData.startingBid}
                      onChange={handleChange}
                      required
                      prefix={<FiDollarSign className="text-pink-400" />}
                      className="w-full bg-gray-800 border-gray-700 text-purple-200 hover:border-cyan-400 focus:border-cyan-400"
                    />
                  </motion.div>
                </motion.div>

                {/* Reserve Price */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    ...(activeField === 'reservePrice' ? fieldFocusAnimation : {})
                  }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  onFocus={() => setActiveField('reservePrice')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className="block text-sm font-medium text-purple-300 mb-1 flex items-center">
                    <motion.span 
                      animate={floatingAnimation}
                      className="mr-2"
                    >
                      <FiDollarSign className="text-pink-400" />
                    </motion.span>
                    Reserve Price ($) *
                  </label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                  >
                    <Input
                      type="number"
                      name="reservePrice"
                      min="0.01"
                      step="0.01"
                      value={formData.reservePrice}
                      onChange={handleChange}
                      required
                      prefix={<FiDollarSign className="text-pink-400" />}
                      className="w-full bg-gray-800 border-gray-700 text-purple-200 hover:border-cyan-400 focus:border-cyan-400"
                    />
                  </motion.div>
                </motion.div>

                {/* Buy Now Price */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    ...(activeField === 'buyNowPrice' ? fieldFocusAnimation : {})
                  }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  onFocus={() => setActiveField('buyNowPrice')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className="block text-sm font-medium text-purple-300 mb-1 flex items-center">
                    <motion.span 
                      animate={floatingAnimation}
                      className="mr-2"
                    >
                      <FiDollarSign className="text-pink-400" />
                    </motion.span>
                    Buy Now Price ($)
                  </label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                  >
                    <Input
                      type="number"
                      name="buyNowPrice"
                      min="0.01"
                      step="0.01"
                      value={formData.buyNowPrice}
                      onChange={handleChange}
                      prefix={<FiDollarSign className="text-pink-400" />}
                      className="w-full bg-gray-800 border-gray-700 text-purple-200 hover:border-cyan-400 focus:border-cyan-400"
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Images */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  ...(activeField === 'images' ? fieldFocusAnimation : {})
                }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                onFocus={() => setActiveField('images')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-purple-300 mb-1">Images (Upload at least one) *</label>
                <label className="cursor-pointer">
                  {uploadButton}
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleImageChange}
                    required
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                <motion.div
                  animate={{
                    textShadow: "0 0 8px rgba(165, 243, 252, 0.5)"
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2
                  }}
                >
                  <p className="text-purple-300 font-medium">Maximum 5 images allowed</p>
                </motion.div>

                {/* Image Previews */}
                <motion.div className="flex flex-wrap gap-4 mt-4">
                  <AnimatePresence>
                    {imagePreviews.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1, 
                          rotateY: 0,
                          boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
                        }}
                        exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                        whileHover={{ 
                          scale: 1.1, 
                          zIndex: 1, 
                          rotateZ: 5,
                          boxShadow: "0 0 30px rgba(139, 92, 246, 0.8)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                        layout
                      >
                        <motion.img
                          src={image.preview}
                          alt={`Preview ${index}`}
                          className="h-24 w-24 object-cover rounded-lg border-2 border-purple-400"
                          whileHover={{ scale: 1.05 }}
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeImage(index)}
                          whileHover={{ scale: 1.3, rotate: 90 }}
                          whileTap={{ scale: 0.8 }}
                          className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full p-1 shadow-lg border-2 border-pink-300"
                          animate={{
                            boxShadow: "0 0 10px rgba(255, 0, 0, 0.7)"
                          }}
                        >
                          <FiX size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.8 }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  scale: 1
                }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                onHoverStart={() => setIsHoveringSubmit(true)}
                onHoverEnd={() => setIsHoveringSubmit(false)}
                className="w-full"
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  className="w-full font-bold text-lg h-14 rounded-xl hover:shadow-xl transition-all border-0"
                >
                  <motion.div
                    initial={{                          
                      background: "linear-gradient(45deg, #8b5cf6, #3b82f6)"
                    }}
                    animate={isHoveringSubmit ? {
                      background: "linear-gradient(45deg, #8b5cf6, #3b82f6, #ec4899)",
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(139, 92, 246, 0.7)"
                    } : {
                      background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
                      scale: 1,
                      boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex items-center justify-center rounded-xl"
                  >
                    <motion.span
                      animate={isHoveringSubmit ? {
                        textShadow: "0 0 10px rgba(255, 255, 255, 0.8)"
                      } : {
                        textShadow: "none"
                      }}
                      className="text-white text-lg font-bold tracking-wide"
                    >
                      {isLoading ? 'Creating Auction...' : 'Create Auction'}
                    </motion.span>
                    {!isLoading && (
                      <motion.div
                        animate={isHoveringSubmit ? {
                          rotate: 360,
                          scale: 1.2
                        } : {
                          rotate: 0,
                          scale: 1
                        }}
                        transition={{ duration: 0.5 }}
                        className="ml-2"
                      >
                        <FiPlus className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Floating Help Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-purple-600 to-blue-500 text-white p-4 rounded-full shadow-xl border-2 border-purple-300 flex items-center justify-center"
          animate={pulseAnimation}
          onClick={() => {
            toast.success('Auction creation tips available!', {
              icon: 'ℹ️',
            });
          }}
        >
          <FiPlus className="text-xl" />
        </motion.button>
      </motion.div>

      {/* 3D Floating Elements with Enhanced Animations */}
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -50, 50, -30, 0],
          rotate: [0, 180, 360, 270, 0],
          background: [
            'linear-gradient(45deg, #FF5F6D, #FFC371)',
            'linear-gradient(45deg, #FFC371, #4e54c8)',
            'linear-gradient(45deg, #4e54c8, #8f94fb)',
            'linear-gradient(45deg, #8f94fb, #00b09b)',
            'linear-gradient(45deg, #00b09b, #96c93d)',
            'linear-gradient(45deg, #96c93d, #FF5F6D)'
          ],
          transition: {
            repeat: Infinity,
            duration: 30,
            ease: "linear"
          }
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
        className="fixed top-1/4 left-1/4 w-16 h-16 rounded-full opacity-40 blur-xl z-0"
      />

      <motion.div
        animate={{
          x: [0, -100, 0, 100, 0],
          y: [0, 50, -50, 30, 0],
          rotate: [0, -180, -360, -270, 0],
          background: [
            'linear-gradient(45deg, #4e54c8, #8f94fb)',
            'linear-gradient(45deg, #8f94fb, #00b09b)',
            'linear-gradient(45deg, #00b09b, #96c93d)',
            'linear-gradient(45deg, #96c93d, #FF5F6D)',
            'linear-gradient(45deg, #FF5F6D, #FFC371)',
            'linear-gradient(45deg, #FFC371, #4e54c8)'
          ],
          transition: {
            repeat: Infinity,
            duration: 25,
            ease: "linear"
          }
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
        className="fixed bottom-1/4 right-1/4 w-20 h-20 rounded-full opacity-40 blur-xl z-0"
      />

      <motion.div
        animate={{
          x: [0, 150, 0, -150, 0],
          y: [0, 100, -100, 50, 0],
          rotate: [0, 270, 540, 360, 0],
          background: [
            'linear-gradient(45deg, #00b09b, #96c93d)',
            'linear-gradient(45deg, #96c93d, #FF5F6D)',
            'linear-gradient(45deg, #FF5F6D, #FFC371)',
            'linear-gradient(45deg, #FFC371, #4e54c8)',
            'linear-gradient(45deg, #4e54c8, #8f94fb)',
            'linear-gradient(45deg, #8f94fb, #00b09b)'
          ],
          transition: {
            repeat: Infinity,
            duration: 35,
            ease: "linear"
          }
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
        className="fixed top-1/3 right-1/3 w-24 h-24 rounded-full opacity-40 blur-xl z-0"
      />

      {/* Additional decorative elements */}
      <motion.div
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, -30, 30, -20, 0],
          rotate: [0, 90, 180, 270, 0],
          background: [
            'linear-gradient(45deg, #8f94fb, #00b09b)',
            'linear-gradient(45deg, #00b09b, #96c93d)',
            'linear-gradient(45deg, #96c93d, #FF5F6D)',
            'linear-gradient(45deg, #FF5F6D, #FFC371)',
            'linear-gradient(45deg, #FFC371, #4e54c8)',
            'linear-gradient(45deg, #4e54c8, #8f94fb)'
          ],
          transition: {
            repeat: Infinity,
            duration: 20,
            ease: "linear"
          }
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
        className="fixed bottom-1/3 left-1/4 w-12 h-12 rounded-full opacity-30 blur-lg z-0"
      />

      <motion.div
        animate={{
          x: [0, -80, 0, 80, 0],
          y: [0, 40, -40, 20, 0],
          rotate: [0, -90, -180, -270, 0],
          background: [
            'linear-gradient(45deg, #FFC371, #4e54c8)',
            'linear-gradient(45deg, #4e54c8, #8f94fb)',
            'linear-gradient(45deg, #8f94fb, #00b09b)',
            'linear-gradient(45deg, #00b09b, #96c93d)',
            'linear-gradient(45deg, #96c93d, #FF5F6D)',
            'linear-gradient(45deg, #FF5F6D, #FFC371)'
          ],
          transition: {
            repeat: Infinity,
            duration: 28,
            ease: "linear"
          }
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
        className="fixed top-1/5 right-1/5 w-14 h-14 rounded-full opacity-30 blur-lg z-0"
      />
    </div>
  );
};

export default CreateAuction;