import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach the stored admin token, if any, to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const categoriesApi = {
  list: () => api.get('/categories').then((r) => r.data),
  create: (data) => api.post('/categories', data).then((r) => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const locationsApi = {
  list: (params) => api.get('/locations', { params }).then((r) => r.data),
  get: (id) => api.get(`/locations/${id}`).then((r) => r.data),
  create: (data) => api.post('/locations', data).then((r) => r.data),
  update: (id, data) => api.put(`/locations/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/locations/${id}`),
};

export const eventsApi = {
  list: () => api.get('/events').then((r) => r.data),
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),
  create: (data) => api.post('/events', data).then((r) => r.data),
  update: (id, data) => api.put(`/events/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/events/${id}`),
};

export default api;
