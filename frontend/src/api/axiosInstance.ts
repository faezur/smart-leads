import axios from 'axios';

const getStoredToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (token) return token;

  const persistedAuth = localStorage.getItem('auth-storage');
  if (!persistedAuth) return null;

  try {
    const parsed = JSON.parse(persistedAuth) as {
      state?: { token?: string | null };
    };
    return parsed.state?.token || null;
  } catch {
    return null;
  }
};

const clearAuthStorage = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth-storage');
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      localStorage.setItem('token', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
