import React, { useState } from 'react';
import { Search, User2, Menu, Bell, ShoppingCart, LogOut, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      if (user.role === 'customer') navigate('/dashboard');
      else if (user.role === 'grower') navigate('/grower/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/bulk', label: 'Bulk' },
    { path: '/corporate', label: 'Corporate' },
    { path: '/subscriptions', label: 'Subscriptions' },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-2xl font-bold text-bloom-green">BloomSupply</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-bloom-green transition-colors ${isActive(link.path) ? 'text-bloom-green font-bold border-b-2 border-bloom-green pb-1' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search cultivars..."
              className="bg-gray-50 border border-gray-100 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-bloom-green w-56"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  navigate(`/marketplace?search=${encodeURIComponent(e.target.value)}`);
                  e.target.value = '';
                }
              }}
            />
          </div>
          <button className="text-bloom-green hover:text-bloom-orange transition-colors relative">
            <Bell size={20} />
          </button>

          {/* Profile Button */}
          <button
            onClick={handleProfileClick}
            className={`transition-colors flex items-center gap-2 ${user ? 'text-bloom-green font-bold' : 'text-gray-400 hover:text-bloom-green'}`}
            title={user ? `${user.name} (${user.role})` : 'Login'}
          >
            <User2 size={20} />
            {user && (
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">
                {user.name.split(' ')[0]}
              </span>
            )}
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => navigate('/cart')}
            className="bg-bloom-green text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-bloom-green-light transition-all shadow-lg shadow-bloom-green/20 relative"
          >
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-bloom-orange text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-bloom-green" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif text-xl font-bold text-bloom-green">BloomSupply</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400"><X size={24} /></button>
            </div>

            {user && (
              <div className="bg-bloom-cream p-4 rounded-2xl mb-6">
                <div className="text-sm font-bold text-bloom-green">{user.name}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">{user.role}</div>
              </div>
            )}

            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path) ? 'bg-bloom-green/5 text-bloom-green font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {link.label}
                </Link>
              ))}

              {!user ? (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-bloom-orange hover:bg-bloom-orange/5">
                  Login / Register
                </Link>
              ) : (
                <>
                  <button onClick={() => { handleProfileClick(); setMobileOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-medium text-left text-gray-500 hover:bg-gray-50">
                    Dashboard
                  </button>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-medium text-left text-red-500 hover:bg-red-50">
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export const Footer = () => (
  <footer className="bg-bloom-cream py-16 px-6 border-t border-gray-100">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
      <div className="flex flex-col gap-2">
        <div className="font-serif text-xl font-bold text-bloom-green normal-case tracking-normal">BloomSupply</div>
        <div>&copy; 2024 BloomSupply Architectural Conservatory. All rights reserved.</div>
      </div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-bloom-green">Sustainability</a>
        <a href="#" className="hover:text-bloom-green">Wholesale Terms</a>
        <a href="#" className="hover:text-bloom-green">Privacy</a>
        <a href="#" className="hover:text-bloom-green">Contact</a>
      </div>
    </div>
  </footer>
);

export const MainLayout = ({ children }) => {
  return (
    <div className="font-sans antialiased min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
