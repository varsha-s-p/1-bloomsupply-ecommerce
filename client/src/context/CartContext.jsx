import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  const updateCount = (items) => {
    setCartCount(items ? items.reduce((sum, i) => sum + i.quantity, 0) : 0);
  };

  const fetchCart = useCallback(async () => {
    if (!user) {
      const local = localStorage.getItem('bloom_guest_cart');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          setCart(parsed);
          updateCount(parsed.items);
        } catch (e) {
          localStorage.removeItem('bloom_guest_cart');
        }
      }
      return;
    }

    try {
      setCartLoading(true);
      const { data } = await api.getCart();
      setCart(data);
      updateCount(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) {
      const local = JSON.parse(localStorage.getItem('bloom_guest_cart') || '{"items":[]}');
      const existing = local.items.find(i => i.product === productId || i.product?._id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        local.items.push({ product: productId, quantity });
      }
      localStorage.setItem('bloom_guest_cart', JSON.stringify(local));
      setCart(local);
      updateCount(local.items);
      return local;
    }

    try {
      const { data } = await api.addToCart(productId, quantity);
      setCart(data);
      updateCount(data.items);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateItem = async (productId, quantity) => {
    if (!user) return;
    try {
      const { data } = await api.updateCartItem(productId, quantity);
      setCart(data);
      updateCount(data.items);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    if (!user) {
      const local = JSON.parse(localStorage.getItem('bloom_guest_cart') || '{"items":[]}');
      local.items = local.items.filter(i => (i.product?._id || i.product) !== productId);
      localStorage.setItem('bloom_guest_cart', JSON.stringify(local));
      setCart(local);
      updateCount(local.items);
      return;
    }
    try {
      const { data } = await api.removeFromCart(productId);
      setCart(data);
      updateCount(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const emptyCart = async () => {
    if (!user) {
      localStorage.removeItem('bloom_guest_cart');
      setCart({ items: [] });
      setCartCount(0);
      return;
    }
    try {
      await api.clearCart();
      setCart({ items: [] });
      setCartCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, cartLoading, addItem, updateItem, removeItem, emptyCart, getTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
