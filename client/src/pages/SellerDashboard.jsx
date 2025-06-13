// pages/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiDollarSign, FiClock, FiCheck, FiTrendingUp, FiBox } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';// pages/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiDollarSign, FiClock, FiCheck, FiTrendingUp, FiBox } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Table, Tag, Button, Statistic, Divider, Tabs, Empty, Spin } from 'antd';
import { 
  RiseOutlined, 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  DollarCircleOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  PieChartOutlined
} from '@ant-design/icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const SellerDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    completedAuctions: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      transition: { 
        type: "spring",
        stiffness: 300
      }
    }
  };

  const chartVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.3, 
        type: 'spring', 
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.02,
      transition: { 
        type: "spring",
        stiffness: 200
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 120
      }
    }),
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(24, 144, 255, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const updateStats = (auctions) => {
      const active = auctions.filter(a => a.status === 'active').length;
      const completed = auctions.filter(a => a.status === 'completed').length;
      const revenue = auctions
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.currentBid || 0), 0);

      setStats({
        totalAuctions: auctions.length,
        activeAuctions: active,
        completedAuctions: completed,
        totalRevenue: revenue
      });
    };

    const fetchAuctions = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auctions`, { 
          params: { seller: user._id } 
        });
        const auctionsData = data.data?.auctions || data.auctions || [];
        setAuctions(auctionsData);
        updateStats(auctionsData);
      } catch (err) {
        console.error('Auctions fetch error:', err.response?.data || err);
        toast.error(err.response?.data?.message || 'Failed to fetch auctions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();

    const handleAuctionUpdate = (updatedAuction) => {
      if (updatedAuction.seller === user._id) {
        setAuctions(prev => {
          const updated = prev.map(a => a._id === updatedAuction._id ? updatedAuction : a);
          updateStats(updated);
          return updated;
        });
      }
    };

    const handleNewAuction = (newAuction) => {
      if (newAuction.seller === user._id) {
        setAuctions(prev => [newAuction, ...prev]);
        updateStats([newAuction, ...auctions]);
      }
    };

    if (socket) {
      socket.on('auctionUpdate', handleAuctionUpdate);
      socket.on('newAuction', handleNewAuction);
    }

    return () => {
      if (socket) {
        socket.off('auctionUpdate', handleAuctionUpdate);
        socket.off('newAuction', handleNewAuction);
      }
    };
  }, [user._id, socket]);

  const handleCreateAuction = () => navigate('/create-auction');

  const handleCompleteAuction = async (auctionId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auctions/${auctionId}/complete`);
      toast.success('Auction completed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete auction');
    }
  };

  const calculateAnalytics = () => {
    const months = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const salesMap = auctions
      .filter(a => a.status === 'completed')
      .reduce((acc, auction) => {
        const date = new Date(auction.endTime);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
        acc[monthYear] = (acc[monthYear] || 0) + (auction.currentBid || 0);
        return acc;
      }, {});
  
    const salesData = Object.entries(salesMap).map(([key, total]) => {
      const [year, month] = key.split('-');
      const monthIndex = parseInt(month);
      return {
        month: months[Math.min(monthIndex, 11)], // Ensure we don't go beyond array bounds
        total: total
      };
    });
  
    const categoryData = auctions.reduce((acc, auction) => {
      acc[auction.category] = (acc[auction.category] || 0) + 1;
      return acc;
    }, {});
  
    return {
      sales: salesData,
      categories: Object.entries(categoryData).map(([name, count]) => ({ _id: name, count }))
    };
  };

  const { sales, categories } = calculateAnalytics();

  const salesChartData = {
    labels: sales.map(s => s.month),
    datasets: [{
      label: 'Sales ($)',
      data: sales.map(s => s.total),
      backgroundColor: 'rgba(64, 169, 255, 0.7)',
      borderColor: 'rgba(24, 144, 255, 1)',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const categoryChartData = {
    labels: categories.map(c => c._id),
    datasets: [{
      label: 'Number of Auctions',
      data: categories.map(c => c.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#bfbfbf',
          font: {
            size: 12
          }
        }
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#bfbfbf'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#bfbfbf'
        }
      }
    }
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="text-gray-900 font-medium">{text}</span>,
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['md'],
      render: (status) => (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Tag 
            color={status === 'active' ? 'green' : 'purple'} 
            icon={status === 'active' ? <RiseOutlined /> : <CheckCircleOutlined />}
            className="text-sm font-semibold"
          >
            {status.toUpperCase()}
          </Tag>
        </motion.div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Current Bid',
      dataIndex: 'currentBid',
      key: 'currentBid',
      render: (bid, record) => (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          {bid ? (
            <Statistic
              value={bid}
              precision={2}
              prefix="$"
              valueStyle={{ 
                color: record.status === 'active' ? '#52c41a' : '#9254de',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            />
          ) : (
            <Tag color="orange" className="text-gray-200">
              No bids yet
            </Tag>
          )}
        </motion.div>
      ),
      sorter: (a, b) => (a.currentBid || 0) - (b.currentBid || 0),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      responsive: ['md'],
      render: (date) => (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <FiClock className="mr-2 text-gray-400" />
          <span className="text-gray-400 font-medium">
            {new Date(date).toLocaleString()}
          </span>
        </motion.div>
      ),
      sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {record.status === 'active' ? (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="primary" 
                danger 
                shape="round" 
                icon={<CheckCircleOutlined />}
                onClick={() => handleCompleteAuction(record._id)}
                className="shadow-md"
                size="small"
              >
                <span className="hidden sm:inline">Complete</span>
                <span className="sm:hidden"><CheckCircleOutlined /></span>
              </Button>
            </motion.div>
          ) : (
            <Tag color="purple" className="text-gray-200">
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden"><CheckCircleOutlined /></span>
            </Tag>
          )}
        </motion.div>
      )
    }
  ];

  if (isLoading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gray-900"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Spin 
          size="large" 
          indicator={
            <RiseOutlined 
              style={{ 
                fontSize: 48,
                color: '#1890ff'
              }} 
              spin 
            />
          } 
        />
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900"
    >
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="bg-gray-800 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <BarChartOutlined className="text-3xl mr-3 text-blue-400" />
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              Seller Dashboard
            </motion.h1>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="primary" 
              shape="round" 
              size="large"
              icon={<FiPlus className="animate-pulse" />}
              onClick={handleCreateAuction}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 border-0 shadow-lg"
            >
              <span className="hidden sm:inline">New Auction</span>
              <span className="sm:hidden"><FiPlus /></span>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              label: 'Total Auctions', 
              value: stats.totalAuctions, 
              icon: <ShoppingCartOutlined className="text-2xl" />,
              color: 'from-indigo-600 to-purple-600'
            },
            { 
              label: 'Active Auctions', 
              value: stats.activeAuctions, 
              icon: <RiseOutlined className="text-2xl" />,
              color: 'from-green-600 to-teal-500'
            },
            { 
              label: 'Completed Auctions', 
              value: stats.completedAuctions, 
              icon: <CheckCircleOutlined className="text-2xl" />,
              color: 'from-purple-600 to-pink-500'
            },
            { 
              label: 'Total Revenue', 
              value: stats.totalRevenue, 
              icon: <DollarCircleOutlined className="text-2xl" />,
              color: 'from-yellow-600 to-orange-500',
              prefix: '$',
              precision: 2
            },
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={cardVariants} whileHover="hover" className={`bg-gradient-to-br ${stat.color} p-1 rounded-2xl shadow-xl`} custom={index}>
              <Card bordered={false} className="bg-gray-800 border-0 h-full hover:bg-gray-700 transition-all duration-300">
                <div className="flex items-center p-4">
                  <div className={`p-3 mr-4 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    {React.cloneElement(stat.icon, { className: 'text-white text-xl' })}
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                    <div className="text-white text-2xl font-bold">
                      {stat.prefix}{stat.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 10
            }
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarStyle={{ 
              marginBottom: 24,
              position: 'relative',
              background: 'rgba(45, 55, 72, 0.8)',
              borderRadius: '12px',
              padding: '6px'
            }}
            renderTabBar={(props, DefaultTabBar) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <DefaultTabBar {...props}>
                  {node => (
                    <motion.div
                      whileHover={{ 
                        scale: 1.05,
                        color: "#f6ad55"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2"
                      style={{
                        color: activeTab === node.key ? '#f6e05e' : '#cbd5e0'
                      }}
                    >
                      {node}
                    </motion.div>
                  )}
                </DefaultTabBar>
              </motion.div>
            )}
            items={[
              {
                label: (
                  <motion.span 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.4 }
                    }}
                    style={{
                      color: activeTab === 'listings' ? '#f6e05e' : '#cbd5e0',
                      fontWeight: 600
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring" }}
                      style={{
                        color: activeTab === 'listings' ? '#f6ad55' : '#cbd5e0'
                      }}
                    >
                      <AppstoreOutlined className="mr-2 text-lg" />
                    </motion.div>
                    <span className="hidden sm:inline">My Listings</span>
                    <span className="sm:hidden">Listings</span>
                  </motion.span>
                ),
                key: 'listings',
                children: null
              },
              {
                label: (
                  <motion.span 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.5 }
                    }}
                    style={{
                      color: activeTab === 'analytics' ? '#f6e05e' : '#cbd5e0',
                      fontWeight: 600
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring" }}
                      style={{
                        color: activeTab === 'analytics' ? '#f6ad55' : '#cbd5e0'
                      }}
                    >
                      <BarChartOutlined className="mr-2 text-lg" />
                    </motion.div>
                    <span className="hidden sm:inline">Analytics</span>
                    <span className="sm:hidden">Stats</span>
                  </motion.span>
                ),
                key: 'analytics',
                children: null
              },
            ]}
          />
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute h-[3px] bottom-0"
            style={{
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #f6ad55, #f6e05e)',
              boxShadow: '0 2px 8px rgba(246, 173, 85, 0.4)'
            }}
            initial={false}
            animate={{
              width: activeTab === 'listings' ? '120px' : '110px',
              x: activeTab === 'listings' ? '24px' : '170px',
              opacity: 1
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          />
        </motion.div>

        <AnimatePresence mode='wait'>
          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                bordered={false}
                className="bg-gray-800 shadow-2xl overflow-x-auto"
                bodyStyle={{ padding: 0 }}
              >
                {auctions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <Empty
                      image={<ShoppingCartOutlined className="text-4xl text-gray-500" />}
                      description={
                        <span className="text-gray-400">
                          No auctions found. Create your first auction to get started.
                        </span>
                      }
                    >
                      <Button 
                        type="primary" 
                        onClick={handleCreateAuction}
                        className="mt-4"
                      >
                        Create Auction
                      </Button>
                    </Empty>
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table
                      columns={columns}
                      dataSource={auctions}
                      rowKey="_id"
                      pagination={{ 
                        pageSize: 5,
                        showSizeChanger: false,
                        className: 'bg-gray-800 text-gray-200'
                      }}
                      className="bg-transparent"
                      scroll={{ x: true }}
                      components={{
                        body: {
                          row: ({ children, ...props }) => (
                            <motion.tr
                              {...props}
                              custom={props['data-row-key']}
                              variants={tableRowVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover="hover"
                              className="hover:bg-gray-700 transition-colors duration-200"
                            >
                              {children}
                            </motion.tr>
                          )
                        }
                      }}
                      onRow={(record) => ({
                        onClick: () => navigate(`/auction/${record._id}`),
                        style: { cursor: 'pointer' }
                      })}
                    />
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <motion.div 
                variants={chartVariants}
                whileHover="hover"
              >
                <Card
                  title={
                    <motion.div 
                      className="text-gray-200 font-semibold flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <BarChartOutlined className="mr-2" />
                      Monthly Sales
                    </motion.div>
                  }
                  bordered={false}
                  className="bg-gray-800 shadow-2xl h-full"
                >
                  <div className="h-64">
                    {sales.length > 0 ? (
                      <Bar 
                        data={salesChartData} 
                        options={chartOptions} 
                      />
                    ) : (
                      <Empty
                        image={<BarChartOutlined className="text-4xl text-gray-500" />}
                        description={
                          <span className="text-gray-400">
                            No completed auctions yet
                          </span>
                        }
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
              
              <motion.div 
                variants={chartVariants}
                whileHover="hover"
              >
                <Card
                  title={
                    <motion.div 
                      className="text-gray-200 font-semibold flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <PieChartOutlined className="mr-2" />
                      Auctions by Category
                    </motion.div>
                  }
                  bordered={false}
                  className="bg-gray-800 shadow-2xl h-full"
                >
                  <div className="h-64">
                    {categories.length > 0 ? (
                      <Pie 
                        data={categoryChartData} 
                        options={chartOptions} 
                      />
                    ) : (
                      <Empty
                        image={<PieChartOutlined className="text-4xl text-gray-500" />}
                        description={
                          <span className="text-gray-400">
                            No categories data available
                          </span>
                        }
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default SellerDashboard;
import { Card, Table, Tag, Button, Statistic, Divider, Tabs, Empty, Spin } from 'antd';
import { 
  RiseOutlined, 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  DollarCircleOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  PieChartOutlined
} from '@ant-design/icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const SellerDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    completedAuctions: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      transition: { 
        type: "spring",
        stiffness: 300
      }
    }
  };

  const chartVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.3, 
        type: 'spring', 
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.02,
      transition: { 
        type: "spring",
        stiffness: 200
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 120
      }
    }),
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(24, 144, 255, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const updateStats = (auctions) => {
      const active = auctions.filter(a => a.status === 'active').length;
      const completed = auctions.filter(a => a.status === 'completed').length;
      const revenue = auctions
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.currentBid || 0), 0);

      setStats({
        totalAuctions: auctions.length,
        activeAuctions: active,
        completedAuctions: completed,
        totalRevenue: revenue
      });
    };

    const fetchAuctions = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auctions`, { 
          params: { seller: user._id } 
        });
        const auctionsData = data.data?.auctions || data.auctions || [];
        setAuctions(auctionsData);
        updateStats(auctionsData);
      } catch (err) {
        console.error('Auctions fetch error:', err.response?.data || err);
        toast.error(err.response?.data?.message || 'Failed to fetch auctions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();

    const handleAuctionUpdate = (updatedAuction) => {
      if (updatedAuction.seller === user._id) {
        setAuctions(prev => {
          const updated = prev.map(a => a._id === updatedAuction._id ? updatedAuction : a);
          updateStats(updated);
          return updated;
        });
      }
    };

    const handleNewAuction = (newAuction) => {
      if (newAuction.seller === user._id) {
        setAuctions(prev => [newAuction, ...prev]);
        updateStats([newAuction, ...auctions]);
      }
    };

    if (socket) {
      socket.on('auctionUpdate', handleAuctionUpdate);
      socket.on('newAuction', handleNewAuction);
    }

    return () => {
      if (socket) {
        socket.off('auctionUpdate', handleAuctionUpdate);
        socket.off('newAuction', handleNewAuction);
      }
    };
  }, [user._id, socket]);

  const handleCreateAuction = () => navigate('/create-auction');

  const handleCompleteAuction = async (auctionId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auctions/${auctionId}/complete`);
      toast.success('Auction completed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete auction');
    }
  };

  const calculateAnalytics = () => {
    const months = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const salesMap = auctions
      .filter(a => a.status === 'completed')
      .reduce((acc, auction) => {
        const date = new Date(auction.endTime);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
        acc[monthYear] = (acc[monthYear] || 0) + (auction.currentBid || 0);
        return acc;
      }, {});
  
    const salesData = Object.entries(salesMap).map(([key, total]) => {
      const [year, month] = key.split('-');
      const monthIndex = parseInt(month);
      return {
        month: months[Math.min(monthIndex, 11)], // Ensure we don't go beyond array bounds
        total: total
      };
    });
  
    const categoryData = auctions.reduce((acc, auction) => {
      acc[auction.category] = (acc[auction.category] || 0) + 1;
      return acc;
    }, {});
  
    return {
      sales: salesData,
      categories: Object.entries(categoryData).map(([name, count]) => ({ _id: name, count }))
    };
  };

  const { sales, categories } = calculateAnalytics();

  const salesChartData = {
    labels: sales.map(s => s.month),
    datasets: [{
      label: 'Sales ($)',
      data: sales.map(s => s.total),
      backgroundColor: 'rgba(64, 169, 255, 0.7)',
      borderColor: 'rgba(24, 144, 255, 1)',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const categoryChartData = {
    labels: categories.map(c => c._id),
    datasets: [{
      label: 'Number of Auctions',
      data: categories.map(c => c.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#bfbfbf',
          font: {
            size: 12
          }
        }
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#bfbfbf'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#bfbfbf'
        }
      }
    }
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="text-gray-900 font-medium">{text}</span>,
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Tag 
            color={status === 'active' ? 'green' : 'purple'} 
            icon={status === 'active' ? <RiseOutlined /> : <CheckCircleOutlined />}
            className="text-sm font-semibold"
          >
            {status.toUpperCase()}
          </Tag>
        </motion.div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Current Bid',
      dataIndex: 'currentBid',
      key: 'currentBid',
      render: (bid, record) => (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          {bid ? (
            <Statistic
              value={bid}
              precision={2}
              prefix="$"
              valueStyle={{ 
                color: record.status === 'active' ? '#52c41a' : '#9254de',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            />
          ) : (
            <Tag color="orange" className="text-gray-200">
              No bids yet
            </Tag>
          )}
        </motion.div>
      ),
      sorter: (a, b) => (a.currentBid || 0) - (b.currentBid || 0),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (date) => (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <FiClock className="mr-2 text-gray-400" />
          <span className="text-gray-400 font-medium">
            {new Date(date).toLocaleString()}
          </span>
        </motion.div>
      ),
      sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {record.status === 'active' ? (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="primary" 
                danger 
                shape="round" 
                icon={<CheckCircleOutlined />}
                onClick={() => handleCompleteAuction(record._id)}
                className="shadow-md"
              >
                Complete
              </Button>
            </motion.div>
          ) : (
            <Tag color="purple" className="text-gray-200">
              Completed
            </Tag>
          )}
        </motion.div>
      )
    }
  ];

  if (isLoading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen bg-gray-900"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Spin 
          size="large" 
          indicator={
            <RiseOutlined 
              style={{ 
                fontSize: 48,
                color: '#1890ff'
              }} 
              spin 
            />
          } 
        />
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900"
    >
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="bg-gray-800 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <BarChartOutlined className="text-3xl mr-3 text-blue-400" />
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              Seller Dashboard
            </motion.h1>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="primary" 
              shape="round" 
              size="large"
              icon={<FiPlus className="animate-pulse" />}
              onClick={handleCreateAuction}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 border-0 shadow-lg"
            >
              New Auction
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              label: 'Total Auctions', 
              value: stats.totalAuctions, 
              icon: <ShoppingCartOutlined className="text-2xl" />,
              color: 'from-indigo-600 to-purple-600'
            },
            { 
              label: 'Active Auctions', 
              value: stats.activeAuctions, 
              icon: <RiseOutlined className="text-2xl" />,
              color: 'from-green-600 to-teal-500'
            },
            { 
              label: 'Completed Auctions', 
              value: stats.completedAuctions, 
              icon: <CheckCircleOutlined className="text-2xl" />,
              color: 'from-purple-600 to-pink-500'
            },
            { 
              label: 'Total Revenue', 
              value: stats.totalRevenue, 
              icon: <DollarCircleOutlined className="text-2xl" />,
              color: 'from-yellow-600 to-orange-500',
              prefix: '$',
              precision: 2
            },
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={cardVariants} whileHover="hover" className={`bg-gradient-to-br ${stat.color} p-1 rounded-2xl shadow-xl`} custom={index}>
              <Card bordered={false} className="bg-gray-800 border-0 h-full hover:bg-gray-700 transition-all duration-300">
                <div className="flex items-center p-4">
                  <div className={`p-3 mr-4 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    {React.cloneElement(stat.icon, { className: 'text-white text-xl' })}
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                    <div className="text-white text-2xl font-bold">
                      {stat.prefix}{stat.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 10
            }
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarStyle={{ 
              marginBottom: 24,
              position: 'relative',
              background: 'rgba(45, 55, 72, 0.8)',
              borderRadius: '12px',
              padding: '6px'
            }}
            renderTabBar={(props, DefaultTabBar) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <DefaultTabBar {...props}>
                  {node => (
                    <motion.div
                      whileHover={{ 
                        scale: 1.05,
                        color: "#f6ad55"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2"
                      style={{
                        color: activeTab === node.key ? '#f6e05e' : '#cbd5e0'
                      }}
                    >
                      {node}
                    </motion.div>
                  )}
                </DefaultTabBar>
              </motion.div>
            )}
            items={[
              {
                label: (
                  <motion.span 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.4 }
                    }}
                    style={{
                      color: activeTab === 'listings' ? '#f6e05e' : '#cbd5e0',
                      fontWeight: 600
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring" }}
                      style={{
                        color: activeTab === 'listings' ? '#f6ad55' : '#cbd5e0'
                      }}
                    >
                      <AppstoreOutlined className="mr-2 text-lg" />
                    </motion.div>
                    My Listings
                  </motion.span>
                ),
                key: 'listings',
                children: null
              },
              {
                label: (
                  <motion.span 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.5 }
                    }}
                    style={{
                      color: activeTab === 'analytics' ? '#f6e05e' : '#cbd5e0',
                      fontWeight: 600
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring" }}
                      style={{
                        color: activeTab === 'analytics' ? '#f6ad55' : '#cbd5e0'
                      }}
                    >
                      <BarChartOutlined className="mr-2 text-lg" />
                    </motion.div>
                    Analytics
                  </motion.span>
                ),
                key: 'analytics',
                children: null
              },
            ]}
          />
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute h-[3px] bottom-0"
            style={{
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #f6ad55, #f6e05e)',
              boxShadow: '0 2px 8px rgba(246, 173, 85, 0.4)'
            }}
            initial={false}
            animate={{
              width: activeTab === 'listings' ? '120px' : '110px',
              x: activeTab === 'listings' ? '24px' : '170px',
              opacity: 1
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          />
        </motion.div>

        <AnimatePresence mode='wait'>
          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                bordered={false}
                className="bg-gray-800 shadow-2xl"
                bodyStyle={{ padding: 0 }}
              >
                {auctions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <Empty
                      image={<ShoppingCartOutlined className="text-4xl text-gray-500" />}
                      description={
                        <span className="text-gray-400">
                          No auctions found. Create your first auction to get started.
                        </span>
                      }
                    >
                      <Button 
                        type="primary" 
                        onClick={handleCreateAuction}
                        className="mt-4"
                      >
                        Create Auction
                      </Button>
                    </Empty>
                  </motion.div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={auctions}
                    rowKey="_id"
                    pagination={{ 
                      pageSize: 5,
                      showSizeChanger: false,
                      className: 'bg-gray-800 text-gray-200'
                    }}
                    className="bg-transparent"
                    components={{
                      body: {
                        row: ({ children, ...props }) => (
                          <motion.tr
                            {...props}
                            custom={props['data-row-key']}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            className="hover:bg-gray-700 transition-colors duration-200"
                          >
                            {children}
                          </motion.tr>
                        )
                      }
                    }}
                    onRow={(record) => ({
                      onClick: () => navigate(`/auction/${record._id}`),
                      style: { cursor: 'pointer' }
                    })}
                  />
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <motion.div 
                variants={chartVariants}
                whileHover="hover"
              >
                <Card
                  title={
                    <motion.div 
                      className="text-gray-200 font-semibold flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <BarChartOutlined className="mr-2" />
                      Monthly Sales
                    </motion.div>
                  }
                  bordered={false}
                  className="bg-gray-800 shadow-2xl h-full"
                >
                  <div className="h-64">
                    {sales.length > 0 ? (
                      <Bar 
                        data={salesChartData} 
                        options={chartOptions} 
                      />
                    ) : (
                      <Empty
                        image={<BarChartOutlined className="text-4xl text-gray-500" />}
                        description={
                          <span className="text-gray-400">
                            No completed auctions yet
                          </span>
                        }
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
              
              <motion.div 
                variants={chartVariants}
                whileHover="hover"
              >
                <Card
                  title={
                    <motion.div 
                      className="text-gray-200 font-semibold flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <PieChartOutlined className="mr-2" />
                      Auctions by Category
                    </motion.div>
                  }
                  bordered={false}
                  className="bg-gray-800 shadow-2xl h-full"
                >
                  <div className="h-64">
                    {categories.length > 0 ? (
                      <Pie 
                        data={categoryChartData} 
                        options={chartOptions} 
                      />
                    ) : (
                      <Empty
                        image={<PieChartOutlined className="text-4xl text-gray-500" />}
                        description={
                          <span className="text-gray-400">
                            No categories data available
                          </span>
                        }
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default SellerDashboard;
