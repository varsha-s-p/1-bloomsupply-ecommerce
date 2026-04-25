import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Inject JWT token into every request
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('bloom_user');
  if (stored) {
    const user = JSON.parse(stored);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getMyProducts = () => API.get('/products/my');

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity) => API.post('/cart', { productId, quantity });
export const updateCartItem = (productId, quantity) => API.put(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart/clear');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getVendorOrders = () => API.get('/orders/vendor');
export const getGrowerOrders = () => API.get('/orders/grower');
export const getOrderStats = () => API.get('/orders/stats');

export default API;
