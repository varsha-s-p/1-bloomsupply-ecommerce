import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(({ data }) => setStats(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'bg-success/10 text-success' },
    { label: 'Today Revenue', value: formatCurrency(stats.todayRevenue), icon: TrendingUp, color: 'bg-accent/10 text-accent' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-info/10 text-info' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-warning/10 text-warning' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-accent/10 text-accent' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-success/10 text-success' }
  ] : [];

  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-primary mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-border-light p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}><Icon size={18} /></div>
              </div>
              <p className="text-2xl font-bold text-primary">{card.value}</p>
              <p className="text-xs text-text-muted mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-border-light p-5">
          <h3 className="font-semibold text-primary mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border-light text-text-muted text-xs uppercase tracking-wider"><th className="text-left pb-3 font-medium">Order</th><th className="text-left pb-3 font-medium">Customer</th><th className="text-left pb-3 font-medium">Amount</th><th className="text-left pb-3 font-medium">Status</th><th className="text-left pb-3 font-medium">Date</th></tr></thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-border-light last:border-0">
                    <td className="py-3 font-medium text-primary">{order.orderNumber}</td>
                    <td className="py-3 text-text-secondary">{order.customer?.name || 'N/A'}</td>
                    <td className="py-3 font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3"><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-success/10 text-success' : order.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'}`}>{order.status}</span></td>
                    <td className="py-3 text-text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
