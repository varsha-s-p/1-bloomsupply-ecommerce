import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bloom-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-bloom-green border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to correct dashboard
    if (user.role === 'customer') return <Navigate to="/dashboard" replace />;
    if (user.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
    if (user.role === 'grower') return <Navigate to="/grower/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
