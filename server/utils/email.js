import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `LiveAuction <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendOTPEmail = async (email, otp) => {
  const subject = 'Your Secure Access Code for LiveAuction';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', Arial, sans-serif;
          background: linear-gradient(135deg, #f0f2ff, #f8f9ff);
        }
        
        .email-container {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header {
          padding: 40px 30px;
          text-align: center;
          background: linear-gradient(135deg, #3a0ca3, #4361ee);
          position: relative;
        }
        
        .header h1 {
          color: white;
          margin: 0;
          font-size: 32px;
          font-weight: 800;
        }
        
        .header p {
          color: rgba(255,255,255,0.85);
          margin: 10px 0 0;
          font-size: 16px;
        }
        
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        
        .title {
          margin: 0 0 25px;
          font-size: 26px;
          color: #2b2d42;
          position: relative;
          display: inline-block;
        }
        
        .title:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #4361ee, #3a0ca3);
          border-radius: 2px;
        }
        
        .message {
          margin: 0 0 30px;
          font-size: 16px;
          color: #4a5568;
          line-height: 1.6;
        }
        
        .otp-container {
          display: inline-block;
          margin: 0 auto 40px;
          background: linear-gradient(135deg, #4361ee, #3a0ca3);
          padding: 4px;
          border-radius: 16px;
          box-shadow: 0 10px 20px rgba(58, 12, 163, 0.2);
        }
        
        .otp-box {
          display: flex;
          padding: 20px 30px;
          background: white;
          border-radius: 14px;
        }
        
        .otp-digit {
          width: 45px;
          height: 60px;
          margin: 0 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 800;
          color: #3a0ca3;
          background: #f8f9ff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .security-note {
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          padding-top: 30px;
          text-align: center;
          max-width: 450px;
          margin: 0 auto;
        }
        
        .security-note p {
          margin: 0;
          font-size: 14px;
          color: #718096;
          line-height: 1.6;
        }
        
        .footer {
          padding: 25px 30px;
          background: #f7f9fc;
          text-align: center;
          border-top: 1px solid rgba(226, 232, 240, 0.5);
        }
        
        .footer p {
          margin: 0 0 10px;
          font-size: 12px;
          color: #718096;
        }
        
        .footer .copyright {
          margin: 0;
          font-size: 12px;
          color: #a0aec0;
        }
        
        @media only screen and (max-width: 600px) {
          .email-container {
            border-radius: 0;
          }
          
          .otp-digit {
            width: 35px;
            height: 50px;
            font-size: 28px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Live<span style="font-weight: 300;">Auction</span></h1>
          <p>Real-Time Bidding Experience</p>
        </div>
        
        <div class="content">
          <h2 class="title">Your Verification Code</h2>
          
          <p class="message">Enter this 6-digit code to secure your login to LiveAuction. This code expires in <span style="font-weight: 700; color: #3a0ca3;">10 minutes</span>.</p>
          
          <div class="otp-container">
            <div class="otp-box">
              ${otp.split('').map(digit => `
                <div class="otp-digit">${digit}</div>
              `).join('')}
            </div>
          </div>
          
          <div class="security-note">
            <p>For your security, never share this code. If you didn't request this, please contact our <a href="mailto:support@liveauction.com" style="color: #4361ee; text-decoration: none; font-weight: 500;">support team</a> immediately.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} LiveAuction. All rights reserved.</p>
          <p class="copyright">Securing real-time auctions worldwide</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(email, subject, html);
};

export const sendWelcomeEmail = async (email, name = 'there') => {
  const subject = 'Welcome to LiveAuction - Start Bidding!';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to LiveAuction</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', Arial, sans-serif;
          background: #f8f9ff;
        }
        
        .email-container {
          max-width: 650px;
          width: 100%;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header {
          padding: 40px 30px;
          text-align: center;
          background: linear-gradient(135deg, #3a0ca3, #4361ee);
          color: white;
        }
        
        .header h1 {
          margin: 0;
          font-size: 38px;
          font-weight: 800;
        }
        
        .header p {
          margin: 15px 0 0;
          font-size: 18px;
          opacity: 0.9;
        }
        
        .hero {
          padding: 50px 30px;
          text-align: center;
          background: #f8f9ff;
        }
        
        .hero h2 {
          margin: 0 0 20px;
          font-size: 32px;
          color: #2b2d42;
        }
        
        .hero p {
          margin: 0 0 30px;
          font-size: 18px;
          color: #4a5568;
          line-height: 1.6;
        }
        
        .countdown {
          display: inline-block;
          padding: 15px 30px;
          margin: 0 auto 30px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3a0ca3, #7209b7);
          color: white;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .features {
          padding: 50px 30px;
          background: #f7f9fc;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          padding: 30px;
          border-radius: 16px;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          text-align: center;
        }
        
        .feature-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #4361ee, #3a0ca3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: white;
        }
        
        .feature-card h3 {
          margin: 0 0 15px;
          font-size: 20px;
          color: #2b2d42;
        }
        
        .feature-card p {
          margin: 0;
          font-size: 15px;
          color: #4a5568;
          line-height: 1.6;
        }
        
        .auction-showcase {
          padding: 50px 30px;
          text-align: center;
          background: #f8f9ff;
        }
        
        .auction-card {
          max-width: 400px;
          margin: 0 auto;
          background: linear-gradient(135deg, #4361ee, #3a0ca3);
          padding: 4px;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(58, 12, 163, 0.2);
        }
        
        .auction-image {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          width: 100%;
          height: 300px;
        }
        
        .auction-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .auction-details {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          padding: 20px;
          color: white;
          text-align: left;
        }
        
        .live-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255,50,50,0.9);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .cta-button {
          display: inline-block;
          margin: 40px auto 0;
          padding: 18px 30px;
          font-size: 18px;
          color: white;
          text-decoration: none;
          font-weight: 700;
          background: linear-gradient(135deg, #4361ee, #3a0ca3);
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(67,97,238,0.3);
        }
        
        .footer {
          padding: 30px;
          background: #f7f9fc;
          text-align: center;
          border-top: 1px solid rgba(226, 232, 240, 0.5);
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin: 20px 0;
        }
        
        .social-link {
          display: flex;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4361ee, #3a0ca3);
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          font-size: 18px;
          box-shadow: 0 5px 10px rgba(67,97,238,0.2);
        }
        
        .copyright {
          margin: 0;
          font-size: 12px;
          color: #a0aec0;
        }
        
        @media only screen and (max-width: 600px) {
          .email-container {
            border-radius: 0;
          }
          
          .header h1 {
            font-size: 28px;
          }
          
          .header p {
            font-size: 16px;
          }
          
          .hero h2 {
            font-size: 26px;
          }
          
          .hero p {
            font-size: 16px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .auction-image {
            height: 250px;
          }
          
          .feature-card {
            padding: 25px;
          }
          
          .feature-icon {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Welcome to <span style="font-weight: 300;">LiveAuction</span></h1>
          <p>Real-time bidding starts now!</p>
        </div>
        
        <div class="hero">
          <h2>Ready to bid, <span style="color: #3a0ca3;">${name}</span>?</h2>
          <p>Join live auctions happening right now and experience the thrill of real-time bidding from anywhere in the world.</p>
          
          <div class="countdown">LIVE AUCTION IN PROGRESS</div>
        </div>
        
        <div class="features">
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">⏱</div>
              <h3>Real-Time Bidding</h3>
              <p>Experience the adrenaline of live auctions with millisecond response times.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>Secure Transactions</h3>
              <p>Military-grade encryption protects your bids and payments at all times.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🌎</div>
              <h3>Global Access</h3>
              <p>Join auctions worldwide from any device, anytime.</p>
            </div>
          </div>
        </div>
        
        <div class="auction-showcase">
          <h2 style="margin: 0 0 20px; font-size: 28px; color: #2b2d42;">Current Featured Auction</h2>
          
          <div class="auction-card">
            <div class="auction-image">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Rare Vintage Collectible" style="width: 100%; height: 100%; object-fit: cover;">
              <div class="auction-details">
                <h3 style="margin: 0 0 5px; font-size: 18px;">Vintage Rolex Submariner</h3>
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">Current Bid: $12,450</p>
              </div>
              <div class="live-badge">LIVE</div>
            </div>
          </div>
          
          <a href="https://liveauction.example.com/dashboard" target="_blank" class="cta-button" style="color: white; text-decoration: none;">Join Auction Now</a>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
  <p style="margin: 0 0 15px; font-size: 14px; color: #718096;">
    Follow us for exclusive auction previews
  </p>

  <!-- Icons with spacing using a table -->
  <table align="center" style="margin-bottom: 20px;">
    <tr>
      <td style="padding: 0 10px;">
        <a href="https://www.instagram.com/sharath_hk__01/profilecard/?igsh=Mzc1Y3IxdGFmOXNh" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="24" height="24" style="display: inline-block;">
        </a>
      </td>
      <td style="padding: 0 10px;">
        <a href="https://x.com/SharathHk417289?t=MycxlBoBa1lbPSKAOk8vcQ&s=09" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" height="24" style="display: inline-block;">
        </a>
      </td>
      <td style="padding: 0 10px;">
        <a href="https://www.linkedin.com/in/sharath-h-k-174536308?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24" height="24" style="display: inline-block;">
        </a>
      </td>
      <td style="padding: 0 10px;">
        <a href="https://github.com/Sharathhk122" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="24" height="24" style="display: inline-block;">
        </a>
      </td>
    </tr>
  </table>

  <p style="font-size: 12px; color: #a0aec0;">© 2025 LiveAuction. All rights reserved.</p>
</div>

      </div>
    </body>
    </html>
  `;
  return await sendEmail(email, subject, html);
};