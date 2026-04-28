import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

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

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const stored = localStorage.getItem('bloom_admin');
      if (stored) {
        try {
          const admin = JSON.parse(stored);
          if (admin.refreshToken) {
            const { data } = await axios.post('http://localhost:5000/api/auth/refresh-token', {
              refreshToken: admin.refreshToken
            });
            admin.token = data.token;
            admin.refreshToken = data.refreshToken;
            localStorage.setItem('bloom_admin', JSON.stringify(admin));
            localStorage.setItem('bloom_user', JSON.stringify(admin));
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('bloom_admin');
          localStorage.removeItem('bloom_user');
          window.location.href = '/admin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getRelatedProducts = (id) => API.get(`/products/${id}/related`);
export const getBestsellers = (params) => API.get('/products/bestsellers', { params });
export const getRecentProducts = (params) => API.get('/products/recent', { params });
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getAllProducts = (params) => API.get('/products/all', { params });

export const getCategories = () => API.get('/categories');
export const getCategoryBySlug = (slug) => API.get(`/categories/${slug}`);
export const getAllCategories = () => API.get('/categories/all');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const getActiveBanners = () => API.get('/banners');
export const getAllBanners = () => API.get('/banners/all');
export const createBanner = (data) => API.post('/banners', data);
export const updateBanner = (id, data) => API.put(`/banners/${id}`, data);
export const deleteBanner = (id) => API.delete(`/banners/${id}`);

export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity) => API.post('/cart', { productId, quantity });
export const updateCartItem = (productId, quantity) => API.put(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart/clear');

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = (params) => API.get('/orders/my', { params });
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = (params) => API.get('/admin/users', { params });
export const getAdminOrders = (params) => API.get('/admin/orders', { params });
export const updateUserStatus = (id, data) => API.put(`/admin/users/${id}`, data);

export default API;
