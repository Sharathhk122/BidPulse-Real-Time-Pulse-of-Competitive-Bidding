import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { 
  Card, 
  Table, 
  Tag, 
  Avatar, 
  Tabs, 
  Badge, 
  Button, 
  InputNumber, 
  Space, 
  Statistic,
  Divider,
  Progress,
  Tooltip
} from 'antd';
import { 
  ClockCircleOutlined, 
  DollarOutlined, 
  CheckOutlined, 
  CloseOutlined, 
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuctionCard from '../components/AuctionCard';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState('browse');
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmounts, setBidAmounts] = useState({});
  const navigate = useNavigate();
  const [parent] = useAutoAnimate();
  const [isHovering, setIsHovering] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionsRes, bidsRes, purchasesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/auctions`, { params: { status: 'active' } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/bids`, { 
            params: { 
              user: user._id,
              populate: 'auction'
            } 
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/auctions`, { params: { winner: user._id, status: 'completed' } })
        ]);
        
        const activeAuctions = auctionsRes.data.data.auctions.filter(
          a => a.status === 'active' && new Date(a.endTime) > new Date()
        );
        
        setAuctions(activeAuctions);
        setBids(bidsRes.data.data.bids);
        setPurchases(purchasesRes.data.data.auctions);
        
        const initialBidAmounts = {};
        activeAuctions.forEach(auction => {
          initialBidAmounts[auction._id] = auction.currentBid + (auction.bidIncrement || 1);
        });
        setBidAmounts(initialBidAmounts);
      } catch (err) {
        toast.error('Data fetch failed');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewAuction = (newAuction) => {
      if (newAuction.status === 'active' && new Date(newAuction.endTime) > new Date()) {
        setAuctions(prev => [newAuction, ...prev]);
        setBidAmounts(prev => ({
          ...prev,
          [newAuction._id]: newAuction.currentBid + (newAuction.bidIncrement || 1)
        }));
      }
    };
    
    const handleBidUpdate = (updatedAuction) => {
      setAuctions(prev => prev.map(a => 
        a._id === updatedAuction._id ? updatedAuction : a
      ));
      
      setBidAmounts(prev => ({
        ...prev,
        [updatedAuction._id]: updatedAuction.currentBid + (updatedAuction.bidIncrement || 1)
      }));
    };
    
    socket.on('newAuction', handleNewAuction);
    socket.on('bidUpdate', handleBidUpdate);
    
    return () => {
      socket.off('newAuction', handleNewAuction);
      socket.off('bidUpdate', handleBidUpdate);
    };
  }, [socket]);

  const handleBid = async (auctionId) => {
    try {
      const amount = bidAmounts[auctionId];
      const auction = auctions.find(a => a._id === auctionId);
      
      if (!auction) {
        toast.error('Auction not found');
        return;
      }

      if (amount <= auction.currentBid) {
        toast.error(`Your bid must be higher than $${auction.currentBid.toFixed(2)}`);
        return;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/auctions/${auctionId}/bids`, { amount });
      toast.success('Bid placed successfully!');

      const updatedAuctions = auctions.map(a => 
        a._id === auctionId ? { ...a, currentBid: amount } : a
      );
      setAuctions(updatedAuctions);

      setBidAmounts(prev => ({
        ...prev,
        [auctionId]: amount + (auction.bidIncrement || 1)
      }));

    } catch (err) {
      toast.error(err.response?.data?.message || 'Bid failed');
    }
  };

  const handleBuyNow = async (auctionId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auctions/${auctionId}/buy-now`);
      toast.success('Purchased successfully!');
      
      setAuctions(prev => prev.filter(a => a._id !== auctionId));
      
      const purchasedAuction = auctions.find(a => a._id === auctionId);
      if (purchasedAuction) {
        setPurchases(prev => [...prev, { ...purchasedAuction, status: 'completed' }]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleBidAmountChange = (auctionId, value) => {
    setBidAmounts(prev => ({
      ...prev,
      [auctionId]: parseFloat(value) || 0
    }));
  };

  const getTopBidders = (auction) => {
    if (!auction.bids || auction.bids.length === 0) return [];
    
    const sortedBids = [...auction.bids].sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return new Date(a.time) - new Date(b.time);
    });
    
    const uniqueBidders = [];
    const seenUsers = new Set();
    
    for (const bid of sortedBids) {
      if (!seenUsers.has(bid.user._id || bid.user)) {
        uniqueBidders.push(bid);
        seenUsers.add(bid.user._id || bid.user);
        if (uniqueBidders.length >= 3) break;
      }
    }
    
    return uniqueBidders;
  };

  const bidColumns = [
    {
      title: 'Auction',
      dataIndex: 'auction',
      key: 'auction',
      render: (auction) => (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          onMouseEnter={() => setIsHovering(auction._id)}
          onMouseLeave={() => setIsHovering(null)}
        >
          <motion.div
            className="relative"
            whileHover={{ rotateY: 10 }}
            transition={{ duration: 0.3 }}
            animate={{
              rotateY: isHovering === auction._id ? [0, 5, -5, 0] : 0,
              scale: isHovering === auction._id ? 1.05 : 1
            }}
          >
            <Avatar 
              src={auction.images?.[0]} 
              shape="square" 
              size={48}
              className="rounded-lg mr-3 transform transition-transform duration-300 hover:rotate-2"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent rounded-lg" />
          </motion.div>
          <div>
            <motion.div 
              className="font-medium text-purple-300 bg-gradient-to-r from-pink-600/30 to-purple-600/30 px-2 py-1 rounded"
              animate={{
                textShadow: isHovering === auction._id ? '0 0 8px rgba(192, 132, 252, 0.8)' : 'none'
              }}
            >
              {auction.title}
            </motion.div>
            <motion.div 
              className="text-xs text-cyan-300 mt-1"
              animate={{
                color: isHovering === auction._id ? '#67e8f9' : '#6ee7b7'
              }}
            >
              {auction.category}
            </motion.div>
          </div>
        </motion.div>
      ),
    },
    {
      title: 'Your Bid',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const auction = record.auction;
        const isWinning = auction.status === 'active' 
          ? amount === auction.currentBid
          : auction.winner?._id === user._id && amount === auction.currentBid;
        
        return (
          <motion.div
            className="relative"
            initial={{ scale: 0.9 }}
            animate={{ 
              scale: 1,
              color: isWinning ? '#a7f3d0' : '#fca5a5',
              textShadow: isWinning 
                ? '0 0 15px rgba(74, 222, 128, 0.7)' 
                : '0 0 15px rgba(248, 113, 113, 0.7)',
              background: isWinning 
                ? 'linear-gradient(45deg, #10b981, #3b82f6)' 
                : 'linear-gradient(45deg, #ef4444, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="flex items-center">
              <span className="font-bold">${amount.toFixed(2)}</span>
              {isWinning ? (
                <RiseOutlined className="ml-1 text-green-400" />
              ) : (
                <FallOutlined className="ml-1 text-red-400" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-sm" />
          </motion.div>
        );
      },
    },
    {
      title: 'Current Bid',
      key: 'currentBid',
      render: (_, record) => {
        const auction = record.auction;
        const isLeading = record.amount === auction.currentBid;
        
        return (
          <motion.div
            className="font-bold relative flex items-center"
            animate={{
              color: isLeading ? '#86efac' : '#fca5a5',
              textShadow: isLeading 
                ? '0 0 8px rgba(74, 222, 128, 0.6)' 
                : '0 0 8px rgba(248, 113, 113, 0.6)',
              filter: 'hue-rotate(0deg)'
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear"
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative z-10 flex items-center">
              ${auction.currentBid?.toFixed(2) || '0.00'}
              {isLeading ? (
                <TrophyOutlined className="ml-2 text-yellow-400" />
              ) : (
                <FireOutlined className="ml-2 text-orange-400" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 blur-lg" />
          </motion.div>
        );
      },
    },
    {
      title: 'Difference',
      key: 'difference',
      render: (_, record) => {
        const auction = record.auction;
        const difference = record.amount - auction.currentBid;
        const isPositive = difference >= 0;
        
        return (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Tag
              color={isPositive ? 'green' : 'red'}
              icon={isPositive ? <RiseOutlined /> : <FallOutlined />}
              className="shadow-md"
            >
              <span className={isPositive ? 'text-green-100' : 'text-red-100'}>
                {Math.abs(difference).toFixed(2)}
              </span>
            </Tag>
          </motion.div>
        );
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const auction = record.auction;
        const isWinning = auction.status === 'active' 
          ? record.amount === auction.currentBid
          : auction.winner?._id === user._id && record.amount === auction.currentBid;
        
        return (
          <motion.div
            whileHover={{ scale: 1.1, rotateZ: isWinning ? [0, -2, 2, -2, 0] : 0 }}
            transition={{ duration: 0.3 }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="relative">
              {auction.status === 'completed' ? (
                auction.winner?._id === user._id && record.amount === auction.currentBid ? (
                  <Tooltip title="You won this auction!">
                    <Tag 
                      icon={<CheckOutlined className="text-green-300" />} 
                      className="shadow-lg bg-green-900/40 border-green-700/50 backdrop-blur-sm"
                    >
                      <span className="text-green-300 bg-gradient-to-r from-green-700/30 to-transparent px-2">
                        WON
                      </span>
                    </Tag>
                  </Tooltip>
                ) : (
                  <Tooltip title="You didn't win this auction">
                    <Tag 
                      icon={<CloseOutlined className="text-red-300" />} 
                      className="shadow-lg bg-red-900/40 border-red-700/50 backdrop-blur-sm"
                    >
                      <span className="text-red-300 bg-gradient-to-r from-red-700/30 to-transparent px-2">
                        LOST
                      </span>
                    </Tag>
                  </Tooltip>
                )
              ) : isWinning ? (
                <Tooltip title="You're currently winning!">
                  <Tag 
                    icon={<TrophyOutlined className="text-yellow-300" />} 
                    className="shadow-lg bg-yellow-900/40 border-yellow-700/50 backdrop-blur-sm"
                  >
                    <span className="text-yellow-300 bg-gradient-to-r from-yellow-700/30 to-transparent px-2">
                      WINNING
                    </span>
                  </Tag>
                </Tooltip>
              ) : (
                <Tooltip title="You've been outbid">
                  <Tag 
                    icon={<FireOutlined className="text-orange-300" />} 
                    className="shadow-lg bg-orange-900/40 border-orange-700/50 backdrop-blur-sm"
                  >
                    <span className="text-orange-300 bg-gradient-to-r from-orange-700/30 to-transparent px-2">
                      OUTBID
                    </span>
                  </Tag>
                </Tooltip>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full" />
            </div>
          </motion.div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ 
            scale: 1.05,
            rotateX: 5,
            rotateY: 5
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            type="primary" 
            shape="round" 
            onClick={() => navigate(`/auctions/${record.auction._id}`)}
            className="border-0 shadow-lg hover:shadow-xl relative overflow-hidden group"
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #ec4899)',
              transformStyle: 'preserve-3d'
            }}
          >
            <span className="relative z-10 flex items-center">
              <EyeOutlined className="mr-1" />
              View Auction
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-md" />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
              style={{
                transform: 'translateX(-100%) skewX(-30deg)',
                transition: 'transform 0.6s'
              }}
            />
          </Button>
        </motion.div>
      ),
    },
  ];

  if (isLoading) return (
    <div className="flex-center h-screen">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1.2, 1, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
        }}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <motion.header 
        className="bg-gradient-to-r from-purple-900 to-blue-800 shadow-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-400"
            animate={{
              textShadow: "0 0 8px rgba(236, 72, 153, 0.8), 0 0 16px rgba(251, 191, 36, 0.6)"
            }}
            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
          >
            Customer Dashboard
          </motion.h1>
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileTap={{ scale: 0.95 }}
            >
              <Avatar 
                src={user?.avatar} 
                size="large" 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <span className="font-medium text-cyan-100">{user?.username}</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarStyle={{ marginBottom: 24 }}
            className="custom-tabs"
          >
            <Tabs.TabPane 
              tab={
                <motion.span
                  whileHover={{ 
                    scale: 1.1,
                    textShadow: '0 0 10px rgba(168, 85, 247, 0.7)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-white"
                  style={{
                    background: 'linear-gradient(145deg, #7e22ce, #9333ea)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <ShoppingCartOutlined className="mr-2" />
                  Browse Auctions
                </motion.span>
              } 
              key="browse"
            >
              <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {auctions.map((auction) => (
                    <motion.div
                      key={auction._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <AuctionCard 
                        auction={auction} 
                        currentUser={user}
                        bidAmount={bidAmounts[auction._id]}
                        onBidAmountChange={(value) => handleBidAmountChange(auction._id, value)}
                        onPlaceBid={() => handleBid(auction._id)}
                        onBuyNow={() => handleBuyNow(auction._id)}
                        topBidders={getTopBidders(auction)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Tabs.TabPane>
            
            <Tabs.TabPane 
              tab={
                <motion.span
                  whileHover={{ 
                    scale: 1.1,
                    textShadow: '0 0 10px rgba(16, 185, 129, 0.7)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-white"
                  style={{
                    background: 'linear-gradient(145deg, #059669, #10b981)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <DollarOutlined className="mr-2" />
                  My Bids
                </motion.span>
              } 
              key="bids"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Table
                  columns={bidColumns}
                  dataSource={bids.map(bid => ({
                    ...bid,
                    key: bid._id,
                    auction: auctions.find(a => a._id === bid.auction?._id) || bid.auction
                  }))}
                  pagination={false}
                  className="bg-transparent [&_.ant-table]:bg-transparent"
                  rowClassName={(record, index) => 
                    `bg-gradient-to-r ${index % 2 === 0 ? 
                      'from-purple-900/20 via-indigo-900/20 to-blue-900/20' : 
                      'from-gray-800/30 via-gray-700/30 to-gray-600/30'} 
                    hover:!from-purple-800/40 hover:!to-blue-800/40 
                    transition-all duration-300 backdrop-blur-sm`
                  }
                  components={{
                    body: {
                      wrapper: ({ children }) => (
                        <motion.tbody
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {children}
                        </motion.tbody>
                      ),
                      row: (props) => (
                        <motion.tr
                          {...props}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ 
                            scale: 1.005,
                            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)',
                            zIndex: 1
                          }}
                          transition={{ duration: 0.3 }}
                          className="relative group"
                        >
                          {props.children}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.tr>
                      ),
                    },
                    header: {
                      cell: ({ children }) => (
                        <th className="!bg-gradient-to-r from-purple-900/70 to-blue-900/70 !border-b-purple-800/40 !backdrop-blur-lg relative overflow-hidden">
                          <motion.div
                            className="text-white text-sm font-extrabold uppercase tracking-widest relative z-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                              scale: 1.05,
                              rotateX: 10,
                              textShadow: "0 0 12px rgba(255,255,255,0.9), 0 0 20px rgba(168,85,247,0.7)"
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{
                              background: 'linear-gradient(90deg, #e879f9, #38bdf8)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {children}
                          </motion.div>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-xl opacity-50" />
                        </th>
                      ),
                    }
                    
                  }}
                />

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    {
                      title: 'Total Bids',
                      value: bids.length,
                      icon: <DollarOutlined />,
                      gradient: 'from-purple-600/40 to-blue-600/40',
                      color: 'text-cyan-200',
                      animation: { rotateY: [0, 360] }
                    },
                    {
                      title: 'Winning Bids',
                      value: bids.filter(bid => {
                        const auction = auctions.find(a => a._id === bid.auction?._id) || bid.auction;
                        return auction?.status === 'active' 
                          ? bid.amount === auction.currentBid
                          : auction?.winner?._id === user._id && bid.amount === auction.currentBid;
                      }).length,
                      icon: <TrophyOutlined />,
                      gradient: 'from-pink-600/40 to-rose-600/40',
                      color: 'text-pink-200',
                      animation: { y: [0, -5, 0, 5, 0] }
                    },
                    {
                      title: 'Highest Bid',
                      value: bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : 0,
                      icon: <StarOutlined />,
                      gradient: 'from-amber-600/40 to-yellow-600/40',
                      color: 'text-amber-200',
                      animation: { scale: [1, 1.1, 1] }
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ scale: 0.9, rotateX: -15 }}
                      animate={{ scale: 1, rotateX: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ 
                        rotateY: 5,
                        scale: 1.02,
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: 1000
                      }}
                    >
                      <Card 
                        className={`bg-gradient-to-br ${stat.gradient} border-0 shadow-xl backdrop-blur-lg transform transition-transform duration-300`}
                        hoverable
                        bordered={false}
                      >
                        <Statistic
                          title={
                            <motion.div 
                              className={`${stat.color} text-sm uppercase tracking-wider`}
                              animate={{
                                textShadow: "0 0 12px currentColor"
                              }}
                            >
                              {stat.title}
                            </motion.div>
                          }
                          value={stat.value}
                          precision={stat.title === 'Highest Bid' ? 2 : 0}
                          prefix={
                            <motion.div
                              animate={stat.animation}
                              transition={{ 
                                duration: stat.animation.rotateY ? 8 : 2, 
                                repeat: Infinity, 
                                ease: stat.animation.rotateY ? "linear" : "easeInOut"
                              }}
                            >
                              {stat.icon}
                            </motion.div>
                          }
                          valueStyle={{ 
                            color: stat.color.replace('text-', '').replace('-200', '-300'),
                            fontSize: '24px',
                            textShadow: '0 0 10px currentColor'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-20" />
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Tabs.TabPane>
          </Tabs>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default CustomerDashboard;
