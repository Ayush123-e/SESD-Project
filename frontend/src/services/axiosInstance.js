import axios from 'axios';

// Base Axios entity targeting backend generic structure
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5002/api', // Use explicit loopback IP for stability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor intelligently injecting active payload JWT token headers seamlessly
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global authentication failures (e.g. database wipe/token expiry)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
