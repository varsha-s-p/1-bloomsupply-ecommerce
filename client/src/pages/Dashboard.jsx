import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, CalendarClock, Banknote, Settings, HelpCircle,
  PackageCheck, Truck, Warehouse, CheckCircle2, ChevronRight, ExternalLink, Loader2, LogOut
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

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'in-hub', 'delivered'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, statsRes] = await Promise.all([
          api.getMyOrders(),
          api.getOrderStats()
        ]);
        setOrders(ordersRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const activeStepIdx = activeOrder ? STATUS_STEPS.indexOf(activeOrder.status) : -1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f8f4]">
        <Loader2 className="w-10 h-10 text-bloom-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f9f8f4] min-h-screen flex selection:bg-bloom-orange selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200/50 p-6 flex flex-col sticky top-[73px] h-[calc(100vh-73px)] bg-[#f3f2ee]">
        <div className="flex items-center gap-3 mb-10 px-2 mt-4">
          <div className="w-12 h-12 rounded-full bg-bloom-green flex items-center justify-center text-white font-serif text-xl font-bold ring-4 ring-white shadow-sm">
            {user?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="text-[11px] font-bold text-bloom-green uppercase tracking-tighter leading-none">Customer Dashboard</div>
            <div className="text-[10px] text-gray-400 font-medium mt-0.5 tracking-tight">{user?.name || 'Customer'}</div>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={ShoppingBag} label="Orders" />
          <SidebarItem icon={CalendarClock} label="Subscriptions" />
          <SidebarItem icon={Banknote} label="Spending" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-gray-200/50 flex flex-col gap-2">
          <button className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-bloom-green transition-colors px-4 py-2">
            <HelpCircle size={16} /> Help Center
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors px-4 py-2 w-full text-left">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-bloom-green mb-3 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Customer'}</h1>
          <p className="text-base text-gray-400 font-medium italic opacity-80">Here's your floral logistics overview.</p>
        </header>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Orders', value: stats.totalOrders, color: 'text-bloom-green' },
              { label: 'Pending', value: stats.pendingOrders, color: 'text-bloom-orange' },
              { label: 'Delivered', value: stats.deliveredOrders, color: 'text-green-600' },
              { label: 'Total Spent', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'text-bloom-green' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{s.label}</div>
                <div className={`text-2xl font-serif font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Active Shipment */}
        {activeOrder && (
          <div className="lg:col-span-8 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative overflow-hidden mb-12">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-xl font-bold text-bloom-green tracking-tight">Active Shipment: {activeOrder.orderNumber}</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  {activeOrder.estimatedDelivery ? `Estimated: ${new Date(activeOrder.estimatedDelivery).toLocaleDateString()}` : 'Processing'}
                </p>
              </div>
              <div className="bg-bloom-green text-white px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[.25em]">{activeOrder.status}</div>
            </div>

            {/* Progress Tracker */}
            <div className="relative flex justify-between items-center mb-10 px-6">
              <div className="absolute left-10 right-10 h-[2px] bg-gray-100 top-5 z-0">
                <div className="h-full bg-bloom-green transition-all" style={{ width: `${(activeStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}></div>
              </div>
              {[
                { icon: CheckCircle2, label: 'Placed' },
                { icon: PackageCheck, label: 'Processing' },
                { icon: Truck, label: 'Shipped' },
                { icon: Warehouse, label: 'Hub' },
                { icon: CheckCircle2, label: 'Delivered' }
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    i <= activeStepIdx ? 'bg-bloom-green text-white shadow-xl shadow-bloom-green/30 ring-4 ring-white' : 'bg-white text-gray-200 border border-gray-200'
                  }`}>
                    <step.icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[.15em] ${i <= activeStepIdx ? 'text-bloom-green' : 'text-gray-300'}`}>{step.label}</span>
                </div>
              ))}
            </div>

            {/* Order Items preview */}
            <div className="flex gap-6 bg-gray-50/70 rounded-3xl p-6 border border-gray-100/50">
              {activeOrder.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={item.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-bloom-green">{item.name}</div>
                    <div className="text-[10px] text-gray-400">Qty: {item.qty}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => navigate(`/order/${activeOrder._id}`)} className="mt-6 text-xs font-bold text-bloom-orange flex items-center gap-2 uppercase tracking-widest hover:text-bloom-green transition-colors">
              <ExternalLink size={14} /> Track Order Details
            </button>
          </div>
        )}

        {/* Recent Orders */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-serif font-bold text-bloom-green tracking-tight">Order History</h2>
            <Link to="/marketplace" className="text-[10px] font-bold text-bloom-green border-b-2 border-bloom-green pb-1 uppercase tracking-[.3em] hover:text-bloom-orange hover:border-bloom-orange transition-all">
              Shop More →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
              <div className="text-5xl mb-4">🌸</div>
              <h3 className="text-xl font-serif font-bold text-bloom-green mb-2">No orders yet</h3>
              <p className="text-sm text-gray-400 mb-6">Start shopping to see your orders here</p>
              <Link to="/marketplace" className="bg-bloom-green text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest inline-block hover:bg-black transition-all">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-[28px] border border-gray-100 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                     onClick={() => navigate(`/order/${order._id}`)}>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50">
                      <img src={order.items[0]?.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="Order" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-bloom-green">{order.orderNumber}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{order.items.length} item{order.items.length > 1 ? 's' : ''} • {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-sm font-bold text-bloom-green font-serif">${order.totalAmount.toFixed(2)}</div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-bloom-green/10 text-bloom-green'
                    }`}>{order.status}</span>
                    <ChevronRight size={18} className="text-gray-200 group-hover:text-bloom-green" />
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

export default Dashboard;
