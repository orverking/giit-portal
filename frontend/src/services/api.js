import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('giit-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error?.response?.data?.message || error.message || 'Request failed')
);

export const withFallback = async (requestFn, fallback) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.warn('Using fallback data:', error);
    return fallback;
  }
};

export default api;
