// api/myList.js
import axios from 'axios';

export const getMyList = async () => {
   const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/mylist`);
  return response.data;
};

export const addToMyList = async (auctionId) => {
  const response = await axios.post('/api/mylist/add', { auctionId });
  return response.data;
};
