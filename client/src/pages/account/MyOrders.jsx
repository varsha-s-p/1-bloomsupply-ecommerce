import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { Package, ChevronRight } from 'lucide-react';

const statusColors = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-info/10 text-info',
  processing: 'bg-info/10 text-info',
  shipped: 'bg-accent/10 text-accent',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-error/10 text-error'
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders({ limit: 50 })
      .then(({ data }) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" text="Loading orders..." />;

  if (orders.length === 0) {
    return <EmptyState icon={Package} title="No orders yet" description="You haven't placed any orders. Start shopping!" actionLabel="Shop Now" actionTo="/shop" />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} to={`/order/${order._id}`} className="block bg-white rounded-2xl border border-border-light p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-primary text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-text-muted mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-surface text-text-muted'}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image || item.product?.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-white" />
                    ))}
                  </div>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
