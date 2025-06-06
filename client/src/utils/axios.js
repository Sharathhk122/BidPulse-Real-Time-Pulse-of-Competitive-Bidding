import axios from 'axios';
const instance = axios.create({
  baseURL: 'https://bidpulse-server10.onrender.com/api'
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

export default instance;
