import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Banknote, FileText,
  PieChart, CreditCard, Plus, ArrowUpRight, ArrowDownRight, Calendar,
  AlertTriangle, FileDown, Loader2, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-white shadow-sm text-bloom-green font-bold' : 'text-gray-400 hover:text-bloom-green hover:bg-white/50'}`}>
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[.2em] mb-2">{title}</div>
        <div className="text-3xl font-serif font-bold text-bloom-green">{value}</div>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-bloom-green/5 group-hover:text-bloom-green transition-colors">
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const GrowerDashboard = () => {
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
          api.getGrowerOrders(),
          api.getOrderStats()
        ]);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Grower dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const farmName = user?.growerProfile?.farmName || 'My Farm';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfcfa]">
        <Loader2 className="w-10 h-10 text-bloom-green animate-spin" />
      </div>
    );
  }

  const lowStock = products.filter(p => p.stock < 50);
  const totalRevenue = stats?.totalRevenue || 0;

  return (
    <div className="bg-[#fbfcfa] min-h-screen flex selection:bg-bloom-orange selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200/50 p-6 flex flex-col sticky top-[73px] h-[calc(100vh-73px)] bg-[#f5f4f0]">
        <div className="flex flex-col items-start gap-1 mb-10 px-2 mt-4 text-bloom-green font-bold">
          <div className="text-lg font-serif">BloomSupply</div>
          <div className="text-[9px] uppercase tracking-[.4em] opacity-40 -mt-1">Grower Portal</div>
        </div>

        <nav className="space-y-1.5 mb-10 overflow-y-auto pr-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Package} label="Inventory" />
          <SidebarItem icon={ShoppingBag} label="Orders from Shops" />
          <SidebarItem icon={Users} label="Customer Orders" />
          <SidebarItem icon={Banknote} label="Revenue" />
          <SidebarItem icon={FileText} label="Reports" />
          <SidebarItem icon={PieChart} label="Analytics" />
          <SidebarItem icon={CreditCard} label="Payouts" />
        </nav>

        <button className="bg-bloom-green text-white w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[.25em] flex items-center justify-center gap-2 hover:bg-bloom-green-light transition-all shadow-xl shadow-bloom-green/20">
          <Plus size={16} /> Add New Listing
        </button>

        <div className="mt-auto pt-6 border-t border-gray-200/50 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-bloom-green flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'G'}
          </div>
          <div>
            <div className="text-[10px] font-bold text-bloom-green uppercase tracking-tight">{farmName}</div>
            <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest opacity-80">Active Plan: Pro</div>
          </div>
        </div>
        
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center justify-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 transition-colors px-4 py-3 w-full border border-red-100 rounded-2xl">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-bloom-green mb-2 tracking-tight">Grower Dashboard</h1>
            <p className="text-base text-gray-400 font-medium italic opacity-80 font-serif">Overview for {farmName}</p>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} icon={Banknote} />
          <StatCard title="Products Listed" value={products.length} icon={Package} />
          <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} />
        </div>

        {/* Orders & Stock Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Recent Orders */}
          <div className="lg:col-span-8 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-bloom-green tracking-tight font-serif mb-8">Recent Orders & Shipments</h3>

            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No orders yet. Orders from vendors and customers will appear here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[9px] font-bold text-gray-300 uppercase tracking-[.3em] border-b border-gray-50">
                      <th className="pb-4 px-4">Customer</th>
                      <th className="pb-4 px-4">Items</th>
                      <th className="pb-4 px-4">Value</th>
                      <th className="pb-4 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-bloom-green">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-4 text-[11px] font-bold tracking-tight">{order.customer?.name || 'Customer'}</td>
                        <td className="py-5 px-4 text-[11px] font-bold">{order.items.length} items</td>
                        <td className="py-5 px-4 text-[13px] font-bold font-serif">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-5 px-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                            order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                            'bg-bloom-orange/10 text-bloom-orange'
                          }`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stock Alerts */}
          <div className="lg:col-span-4 bg-[#f5f4f0] rounded-[40px] p-8 border border-gray-100 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-bloom-green tracking-tight font-serif">Stock Alerts</h3>
              {lowStock.length > 0 && (
                <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <AlertTriangle size={10} /> {lowStock.length}
                </div>
              )}
            </div>

            {lowStock.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">All inventory levels healthy!</p>
            ) : (
              <div className="space-y-3 mb-6">
                {lowStock.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/80'} className="w-full h-full object-cover" alt={p.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-bloom-green truncate">{p.name}</div>
                      <div className="text-[9px] text-gray-400">{p.category}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[11px] font-bold ${p.stock < 20 ? 'text-red-500' : 'text-bloom-orange'}`}>{p.stock}</div>
                      <div className="text-[8px] text-gray-300 font-bold uppercase">units</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="mt-auto w-full bg-white border-2 border-white text-gray-400 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[.25em] hover:text-bloom-green hover:shadow-lg transition-all shadow-sm">
              Manage All Inventory
            </button>
          </div>
        </div>

        {/* Products List */}
        <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-bloom-green mb-8">Your Products ({products.length})</h3>
          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No products listed yet. Add your first flower listing!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <div key={p._id} className="bg-gray-50 p-4 rounded-[24px] border border-gray-100 group hover:shadow-lg transition-all">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-white">
                    <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-bloom-green text-sm mb-1 truncate">{p.name}</h4>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-400">${p.price.toFixed(2)} {p.unit}</span>
                    <span className="text-[9px] font-bold text-bloom-green">{p.stock} units</span>
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

export default GrowerDashboard;
