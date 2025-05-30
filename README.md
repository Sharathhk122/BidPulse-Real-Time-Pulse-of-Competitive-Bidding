
# 🎯 **BidPulse** – Real-Time Pulse of Competitive Bidding

![BidPulse Logo](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20\(1012\).png)

> *BidPulse is a cutting-edge real-time auction platform that brings the thrill of competitive bidding to your fingertips.*

---

## 🌟 Features at a Glance

* ⚡ **Real-time Bidding** – Instant bid updates via Socket.io
* 🔐 **Secure Authentication** – JWT-based, with email verification
* ☁️ **Cloudinary** – Image storage & management
* 📱 **Responsive Design** – Optimized for all devices
* 📧 **Email Alerts** – Stay notified about auctions and wins
* 🛠️ **Admin Tools** – Manage auctions with ease
* 📊 **Bid History** – View your entire bidding timeline

---

## ✨ Screens Showcase

### 🔹 Main Screens

| Dashboard                                                                                                                                | Auction Listing                                                                                                                             | Live Bidding                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Dashboard](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20\(1012\).png) | ![Auction List](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20\(1013\).png) | ![Live Bidding](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20\(1014\).png) |

### 🔹 Additional Views

| Profile                                                                                                                                | Admin                                                                                                                                      | Mobile                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ![Profile](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20\(1015\).png) | ![Admin Panel](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20\(1016\).png) | ![Mobile View](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/Screenshot%20\(1017\).png) |

---

## 🖼️ WhatsApp Previews – New UI Enhancements

<table>
  <tr>
    <td><img src="https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/WhatsApp%20Image%202025-05-30%20at%2013.43.00_b42d5573.jpg" width="100%"/></td>
    <td><img src="https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding/blob/main/images/WhatsApp%20Image%202025-05-30%20at%2013.43.00_b859ccc5.jpg" width="100%"/></td>
  </tr>
</table>

> *Modernized interface with vibrant visuals and streamlined user experience!*

---

## ⚙️ Tech Stack

**Frontend:** React, Vite, Redux Toolkit, Socket.io, Tailwind CSS
**Backend:** Node.js, Express, MongoDB, JWT, Socket.io, Nodemailer
**Services:** Cloudinary, MongoDB Atlas, Google SMTP

---

## 🛠️ Setup Guide

### Clone & Install

```bash
git clone https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding.git
cd BidPulse-Real-Time-Pulse-of-Competitive-Bidding

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Setup `.env` Files

Provide values like DB URL, JWT secret, Cloudinary keys, etc. (Refer to original README for full list.)

### Run Dev Servers

```bash
# Server
cd server
npm run dev

# Client
cd ../client
npm run dev
```

---

## 📡 API Overview

| Category | Endpoint                  | Description        |
| -------- | ------------------------- | ------------------ |
| Auth     | `POST /api/auth/register` | User registration  |
| Auctions | `GET /api/auctions`       | Fetch all auctions |
| Bids     | `POST /api/bids`          | Place a bid        |
| Users    | `GET /api/users`          | Admin: Get users   |

> *(See full list above in your original README.)*

---

## 🚀 Deployment Tips

### Frontend

```bash
cd client
npm run build
```

Upload `dist/` to Vercel, Netlify, or preferred host.

### Backend

Push to Render, Heroku, or another platform with `.env` and MongoDB configured.

---

## 🤝 Contribute

We ❤️ contributors!

1. Fork it
2. Create a feature branch
3. Commit changes
4. Push and PR!

---

## 📧 Contact

* Sharath HK – [sharathhk40@gmail.com](mailto:sharathhk40@gmail.com)
* GitHub – [BidPulse Repository](https://github.com/Sharathhk122/BidPulse-Real-Time-Pulse-of-Competitive-Bidding)

---
