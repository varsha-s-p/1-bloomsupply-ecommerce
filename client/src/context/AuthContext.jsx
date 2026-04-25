import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bloom_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.loginUser({ email, password });
    setUser(data);
    localStorage.setItem('bloom_user', JSON.stringify(data));
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
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('bloom_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
