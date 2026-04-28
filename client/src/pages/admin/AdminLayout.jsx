import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Grid3X3, Image, ShoppingCart, Users, LogOut, Menu, X, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/admin/banners', label: 'Banners', icon: Image },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: Users }
  ];

  const isActive = (link) => link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="font-serif text-xl font-bold">Bloom<span className="text-accent">Admin</span></Link>
          <button className="lg:hidden text-white/60" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <nav className="p-3 flex-1">
          {links.map(link => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${active ? 'bg-white/10 text-accent' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all mb-1">
            <Store size={18} /> View Store
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-border-light px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-primary" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <span className="text-sm font-medium text-text-muted">Welcome, {user?.name}</span>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
