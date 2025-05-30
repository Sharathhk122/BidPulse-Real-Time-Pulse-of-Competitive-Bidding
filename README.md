# BidPulse - Real-Time Pulse of Competitive Bidding

![BidPulse Logo](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1012).png)

## 🌟 Introduction

BidPulse is a cutting-edge real-time auction platform that brings the thrill of competitive bidding to your fingertips. With seamless live updates, secure transactions, and an intuitive interface, BidPulse revolutionizes the online auction experience.

## 🚀 Key Features

- **Real-time Bidding**: Experience the excitement of live auctions with instant bid updates
- **Secure Authentication**: JWT-based user authentication with email verification
- **Cloudinary Integration**: For seamless image uploads and management
- **Responsive Design**: Beautiful UI that works across all devices
- **Email Notifications**: Get alerts for bids, wins, and important updates
- **Admin Dashboard**: Comprehensive tools for auction management
- **Bid History**: Track all your bidding activities in one place

## 📸 Screenshots

| Dashboard | Auction Listing | Live Bidding |
|-----------|-----------------|--------------|
| [![Screenshot (1012)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1012).png)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1012).png) | [![Screenshot (1013)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1013).png)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1013).png) | [![Screenshot (1014)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1014).png)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1014).png) |

| User Profile | Admin Panel | Mobile View |
|-------------|-------------|-------------|
| [![Screenshot (1015)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1015).png)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1015).png) | [![Screenshot (1016)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1016).png)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1016).png) | [![Screenshot (1017)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1017).png)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1017).png) |

[View all screenshots](#screenshots-gallery)

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- Redux Toolkit
- Socket.io Client
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication
- Nodemailer

### Services
- Cloudinary (Image Storage)
- MongoDB Atlas (Database)
- Google SMTP (Email Service)

## 📦 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE=mongodb://localhost:27017/live-auction
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 🚀 Installation Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding.git
   cd BidPulse-Real-Time-Pulse-of-Competitive-Bidding
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   - Create `.env` files in both `server` and `client` directories as shown above

4. **Start the development servers**
   ```bash
   # In one terminal (server)
   cd server
   npm run dev

   # In another terminal (client)
   cd ../client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Auctions
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/:id` - Get single auction
- `POST /api/auctions` - Create new auction (Admin only)
- `PUT /api/auctions/:id` - Update auction (Admin only)
- `DELETE /api/auctions/:id` - Delete auction (Admin only)

### Bids
- `POST /api/bids` - Place a new bid
- `GET /api/bids/user/:userId` - Get user's bids
- `GET /api/bids/auction/:auctionId` - Get bids for an auction

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Upload the `dist` folder to your hosting provider

### Backend Deployment (Render/Heroku)
1. Set up your production environment variables
2. Push your code to the hosting provider
3. Ensure MongoDB connection is properly configured

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For any questions or feedback, please contact:
- Sharath HK - sharathhk40@gmail.com
- Project Link: [https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding)

---

## 📷 Screenshots Gallery

1. [Screenshot (1012)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1012).png) - Homepage
2. [Screenshot (1013)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1013).png) - Auction List
3. [Screenshot (1014)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1014).png) - Live Bidding
4. [Screenshot (1015)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1015).png) - User Profile
5. [Screenshot (1016)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1016).png) - Admin Dashboard
6. [Screenshot (1017)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1017).png) - Mobile View
7. [Screenshot (1018)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1018).png) - Registration
8. [Screenshot (1019)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1019).png) - Login
9. [Screenshot (1020)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1020).png) - Auction Creation
10. [Screenshot (1021)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1021).png) - Bid History
11. [Screenshot (1022)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1022).png) - Email Verification
12. [Screenshot (1023)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1023).png) - Password Reset
13. [Screenshot (1024)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1024).png) - User Management
14. [Screenshot (1025)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1025).png) - Auction Statistics
15. [Screenshot (1026)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1026).png) - Notification Center
16. [Screenshot (1027)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1027).png) - Payment Integration
17. [Screenshot (1028)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1028).png) - Dark Mode
18. [Screenshot (1029)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1029).png) - Auction Categories
19. [Screenshot (1030)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1030).png) - Search Functionality
20. [Screenshot (1031)](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20(1031).png) - About Page

---

Thank you for checking out BidPulse! Happy bidding! 🎉
