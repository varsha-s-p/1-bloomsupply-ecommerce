import React, { useState } from 'react';
import { Search, User, Menu, ShoppingCart, X, LogOut, Package, ChevronRight, Shield, RotateCcw, Phone, Info } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/categories', label: 'Categories' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const sidebarLinks = [
    { path: '/account/orders', label: 'My Orders', icon: <Package size={18} /> },
    { path: '/account/profile', label: 'My Profile', icon: <User size={18} /> },
    { path: '/about', label: 'About Us', icon: <Info size={18} /> },
    { path: '/contact', label: 'Contact Us', icon: <Phone size={18} /> },
    { path: '/privacy', label: 'Privacy Policy', icon: <Shield size={18} /> },
    { path: '/refund', label: 'Refund Policy', icon: <RotateCcw size={18} /> }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border-light shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between h-[72px] sm:h-[80px]">
            <div className="flex items-center gap-6 lg:gap-10">
              <button className="lg:hidden text-primary p-1" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <Link to="/" className="font-serif text-xl sm:text-2xl font-bold text-primary tracking-tight">
                Bloom<span className="text-accent">Supply</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-[13px] font-medium tracking-wide transition-colors hover:text-accent ${isActive(link.path) ? 'text-accent' : 'text-text-secondary'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4 sm:gap-5">
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch}>
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search flowers..."
                    className="bg-surface border border-border pl-10 pr-5 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent w-56 transition-all"
                  />
                </form>
              </div>

              <button className="md:hidden text-text-secondary hover:text-accent transition-colors p-1" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={22} />
              </button>

              {isAuthenticated ? (
                <>
                  <button onClick={handleLogout} className="hidden sm:inline-flex items-center gap-2.5 text-error hover:text-red-600 transition-colors text-sm font-medium">
                    <LogOut size={18} />
                    Logout
                  </button>
                  <div className="relative">
                    <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="hidden sm:flex items-center gap-2.5 text-text-secondary hover:text-accent transition-colors">
                      <User size={20} />
                      <span className="text-xs font-semibold">{user.name.split(' ')[0]}</span>
                    </button>
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-border-light rounded-xl shadow-lg z-50 overflow-hidden">
                        <Link to="/account/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-3 text-sm text-text-secondary hover:bg-surface hover:text-accent transition-colors border-b border-border-light">
                          <div className="font-semibold text-primary">{user.name}</div>
                          <div className="text-xs text-text-muted">{user.email}</div>
                        </Link>
                        <Link to="/account/orders" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:bg-surface hover:text-accent transition-colors border-b border-border-light">
                          <Package size={16} />
                          My Orders
                        </Link>
                        <Link to="/account/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:bg-surface hover:text-accent transition-colors border-b border-border-light">
                          <User size={16} />
                          My Profile
                        </Link>
                        <button onClick={() => { logout(); navigate('/'); setProfileDropdownOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-error hover:bg-red-50 transition-colors">
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors text-sm font-medium">
                  <User size={20} />
                  Login
                </Link>
              )}

              <button
                onClick={() => navigate('/cart')}
                className="relative bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2.5 hover:bg-primary-light transition-all"
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden px-5 pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flowers..."
                autoFocus
                className="w-full bg-surface border border-border pl-10 pr-5 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </form>
          </div>
        )}
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col" style={{ animation: 'slideFromLeft 0.3s ease-out' }}>
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <span className="font-serif text-xl font-bold text-primary">Bloom<span className="text-accent">Supply</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-text-muted hover:text-primary transition-colors p-1">
                <X size={22} />
              </button>
            </div>

            {isAuthenticated && (
              <div className="px-6 py-5 bg-surface-warm border-b border-border-light">
                <div className="font-semibold text-primary text-[15px]">{user.name}</div>
                <div className="text-xs text-text-muted mt-1">{user.email}</div>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto p-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all mb-1 ${isActive(link.path) ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface'}`}
                >
                  {link.label}
                  <ChevronRight size={16} className="opacity-30" />
                </Link>
              ))}

              <div className="h-px bg-border-light my-4" />

              {sidebarLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm text-text-secondary hover:bg-surface transition-all mb-1"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-5 border-t border-border-light">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-error hover:bg-red-50 transition-all">
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-light transition-all">
                  <User size={18} />
                  Login / Register
                </Link>
              )}
            </div>
          </div>
          <style>{`
            @keyframes slideFromLeft {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Header;
