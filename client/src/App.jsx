import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import BulkPortal from './pages/BulkPortal';
import Subscriptions from './pages/Subscriptions';
import GrowerDashboard from './pages/GrowerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Corporate from './pages/Corporate';
import Login from './pages/Login';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/corporate" element={<Corporate />} />
              <Route path="/bulk" element={<BulkPortal />} />
              <Route path="/subscriptions" element={<Subscriptions />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute roles={['customer']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/grower/dashboard" element={
                <ProtectedRoute roles={['grower']}>
                  <GrowerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/vendor/dashboard" element={
                <ProtectedRoute roles={['vendor']}>
                  <VendorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/order/:id" element={
                <ProtectedRoute>
                  <OrderTracking />
                </ProtectedRoute>
              } />
            </Routes>
          </MainLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
