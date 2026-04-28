import React, { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';

const statusColors = { pending: 'bg-warning/10 text-warning', confirmed: 'bg-info/10 text-info', processing: 'bg-info/10 text-info', shipped: 'bg-accent/10 text-accent', delivered: 'bg-success/10 text-success', cancelled: 'bg-error/10 text-error' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = (p = 1, status = '') => {
    setLoading(true);
    getAdminOrders({ page: p, limit: 20, status }).then(({ data }) => { setOrders(data.orders); setTotalPages(data.totalPages); setPage(data.page); }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1, filter); }, [filter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try { await updateOrderStatus(orderId, { status: newStatus }); fetch(page, filter); } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-primary mb-6">Orders</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-light bg-surface text-text-muted text-xs uppercase tracking-wider"><th className="text-left p-4 font-medium">Order</th><th className="text-left p-4 font-medium">Customer</th><th className="text-left p-4 font-medium">Amount</th><th className="text-left p-4 font-medium">Status</th><th className="text-left p-4 font-medium">Date</th><th className="text-left p-4 font-medium">Action</th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={6} className="p-4"><div className="skeleton h-10 rounded-lg" /></td></tr>) :
              orders.map(o => (
                <tr key={o._id} className="border-b border-border-light last:border-0">
                  <td className="p-4 font-medium text-primary">{o.orderNumber}</td>
                  <td className="p-4 text-text-secondary">{o.customer?.name}</td>
                  <td className="p-4 font-medium">{formatCurrency(o.totalAmount)}</td>
                  <td className="p-4"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${statusColors[o.status]}`}>{o.status}</span></td>
                  <td className="p-4 text-text-muted text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4">
                    <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none">
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
