import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';
import axios from 'axios';

// Axios global configuration
axios.defaults.baseURL = 'http://localhost:5000'; // Your backend URL
axios.defaults.withCredentials = true;

// Configure routes with future flags
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <Signup /> },
        // Add other routes here
        // { path: 'dashboard', element: <Dashboard /> },
        // { path: 'seller-dashboard', element: <SellerDashboard /> },
      ]
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

// Axios request interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
    <App/>
  </React.StrictMode>
);