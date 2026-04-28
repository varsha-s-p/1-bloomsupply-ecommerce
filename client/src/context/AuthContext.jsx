import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bloom_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('bloom_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.loginUser({ email, password });
    setUser(data);
    localStorage.setItem('bloom_user', JSON.stringify(data));
    if (data.role === 'admin' && data.refreshToken) {
      localStorage.setItem('bloom_admin', JSON.stringify(data));
    }
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.registerUser(formData);
    setUser(data);
    localStorage.setItem('bloom_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloom_user');
    localStorage.removeItem('bloom_admin');
    localStorage.removeItem('bloom_guest_cart');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('bloom_user', JSON.stringify(userData));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
