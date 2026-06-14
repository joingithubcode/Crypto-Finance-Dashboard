import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptors for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Assets
export const getAssets = () => API.get('/assets/');
export const createAsset = (data) => API.post('/assets/', data);
export const updateAsset = (id, data) => API.put(`/assets/${id}/`, data);
export const deleteAsset = (id) => API.delete(`/assets/${id}/`);

// Portfolio
export const getPortfolio = () => API.get('/portfolio/');
export const createPortfolio = (data) => API.post('/portfolio/', data);
export const updatePortfolio = (id, data) => API.put(`/portfolio/${id}/`, data);
export const deletePortfolio = (id) => API.delete(`/portfolio/${id}/`);

// Transactions
export const getTransactions = () => API.get('/transactions/');
export const createTransaction = (data) => API.post('/transactions/', data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}/`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}/`);

// Watchlist
export const getWatchlist = () => API.get('/watchlist/');
export const createWatchlistItem = (data) => API.post('/watchlist/', data);
export const updateWatchlistItem = (id, data) => API.put(`/watchlist/${id}/`, data);
export const deleteWatchlistItem = (id) => API.delete(`/watchlist/${id}/`);

// Profile
export const getProfile = () => API.get('/profile/');
export const createProfile = (data) => API.post('/profile/', data);
export const updateProfile = (id, data) => API.put(`/profile/${id}/`, data);

// Dashboard Stats
export const getDashboardStats = () => API.get('/dashboard/stats/');