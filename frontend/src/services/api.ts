import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (username: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { username, email, password });
    return res.data;
  },
};

// PRODUCTS
export const productsAPI = {
  getAll: async () => {
    const res = await api.get('/products');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (product: { name: string; grade: string; price: number; link: string }) => {
    const res = await api.post('/products', product);
    return res.data;
  },
  update: async (id: number, product: { name: string; grade: string; price: number; link: string }) => {
    const res = await api.put(`/products/${id}`, product);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

// USERS API
export const usersAPI = {
  getAll: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  create: async (user: { username: string; email: string; password: string }) => {
    const res = await api.post('/users', user);
    return res.data;
  },
  update: async (id: number, user: { username?: string; email?: string; password?: string }) => {
    const res = await api.put(`/users/${id}`, user);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export default api;
