import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const submitContact = (data) => API.post('/contact', data);
export const getContacts = (params) => API.get('/contact', { params });
export const updateStatus = (id, status) => API.patch(`/contact/${id}/status`, { status });
export const deleteContact = (id) => API.delete(`/contact/${id}`);
export const adminLogin = (data) => API.post('/auth/login', data);
export const getAdminMe = () => API.get('/auth/me');

export default API;
