import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, Banknote, Settings, Truck,
  HelpCircle, Plus, ChevronRight, TrendingUp, Loader2, CheckCircle2, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-white shadow-sm text-bloom-green font-bold' : 'text-gray-400 hover:text-bloom-green hover:bg-white/50'}`}>
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
  </button>
);

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, ordRes, statsRes] = await Promise.all([
          api.getMyProducts(),
          api.getVendorOrders(),
          api.getOrderStats()
        ]);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Vendor dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus, note: `Status updated to ${newStatus}` });
      const { data } = await api.getVendorOrders();
      setOrders(data);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f8f4]">
        <Loader2 className="w-10 h-10 text-bloom-green animate-spin" />
      </div>
    );
  }

  const lowStock = products.filter(p => p.stock < 50);
  const shopName = user?.vendorProfile?.shopName || 'My Shop';

  return (
    <div className="bg-[#f9f8f4] min-h-screen flex selection:bg-bloom-orange selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200/50 p-6 flex flex-col sticky top-[73px] h-[calc(100vh-73px)] bg-[#f3f2ee]">
        <div className="flex flex-col items-start gap-1 mb-10 px-2 mt-4 text-bloom-green font-bold">
          <div className="text-xl font-serif">Vendor Portal</div>
          <div className="text-[9px] uppercase tracking-[.4em] opacity-40 -mt-1 font-sans">{shopName}</div>
        </div>

        <div className="flex items-center gap-3 mb-10 px-3 py-4 bg-white/50 rounded-2xl border border-white/80">
          <div className="w-10 h-10 rounded-full bg-bloom-green flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0) || 'V'}
          </div>
          <div>
            <div className="text-[10px] font-bold text-bloom-green uppercase tracking-tight">{user?.name}</div>
            <div className="text-[8px] text-bloom-orange font-bold uppercase tracking-widest">Verified Vendor</div>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={ShoppingBag} label="Orders" />
          <SidebarItem icon={Package} label="Inventory" />
          <SidebarItem icon={Banknote} label="Revenue" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <button className="bg-[#0a2e24] text-white w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[.25em] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-black/10 mb-4">
          <Plus size={16} /> Add Listing
        </button>
        
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center justify-center gap-3 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors px-4 py-3 w-full border border-red-100 rounded-2xl">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-bloom-green mb-2">{shopName} Dashboard</h1>
          <p className="text-sm text-gray-400 italic">Welcome back, {user?.name?.split(' ')[0]}</p>
        </header>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Orders', value: stats.totalOrders },
              { label: 'Pending', value: stats.pendingOrders },
              { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(0)}` },
              { label: 'Products', value: products.length }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{s.label}</div>
                <div className="text-2xl font-serif font-bold text-bloom-green">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Orders */}
        <div className="mb-10">
          <h3 className="text-2xl font-serif font-bold text-bloom-green mb-6">Recent Orders</h3>
          {orders.length === 0 ? (
            <div className="bg-white rounded-[32px] p-10 text-center border border-gray-100">
              <p className="text-gray-400">No orders yet. Your shop orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-[28px] border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50">
                      <img src={order.items[0]?.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="Order" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-bloom-green">{order.orderNumber}</div>
                      <div className="text-[10px] text-gray-400">{order.customer?.name} • {order.items.length} items • ${order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-bold text-bloom-green uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-bloom-green cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="in-hub">In Hub</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory Pulse */}
        <section className="bg-[#f5f4f0] rounded-[40px] p-10 border border-gray-100/50">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-bloom-green mb-2">Inventory Pulse</h2>
              <p className="text-xs text-gray-400 italic">{products.length} products • {lowStock.length} low stock alerts</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-4">No products yet. Start adding your inventory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <div key={p._id} className="bg-white p-4 rounded-[28px] border border-gray-100 flex flex-col group hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-gray-50">
                    <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-bold text-bloom-green text-[13px] mb-1 truncate">{p.name}</h4>
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-[10px] text-gray-400">{p.stock} units</div>
                    <div className={`text-[8px] font-bold uppercase tracking-widest ${p.stock < 20 ? 'text-red-500' : p.stock < 50 ? 'text-bloom-orange' : 'text-green-500'}`}>
                      {p.stock < 20 ? 'CRITICAL' : p.stock < 50 ? 'LOW' : 'HEALTHY'}
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.stock < 20 ? 'bg-red-500' : p.stock < 50 ? 'bg-bloom-orange' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, (p.stock / 500) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default VendorDashboard;
