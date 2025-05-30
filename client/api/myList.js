// api/myList.js
import axios from 'axios';

export const getMyList = async () => {
  const response = await axios.get('/api/mylist');
  return response.data;
};

export const addToMyList = async (auctionId) => {
  const response = await axios.post('/api/mylist/add', { auctionId });
  return response.data;
};