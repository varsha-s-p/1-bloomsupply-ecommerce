import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../utils/api';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/common/Loader';
import { Package, CheckCircle, Truck, Clock, MapPin } from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader size="lg" text="Loading order..." />;
  if (!order) return <div className="text-center py-20 text-text-muted">Order not found</div>;

  const statusIcons = { 'Order Placed': Clock, 'Confirmed': CheckCircle, 'Processing': Package, 'Shipped': Truck, 'Delivered': MapPin };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">Order {order.orderNumber}</h1>
            <p className="text-sm text-text-muted mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${order.status === 'delivered' ? 'bg-success/10 text-success' : order.status === 'cancelled' ? 'bg-error/10 text-error' : 'bg-accent/10 text-accent'}`}>
            {order.status}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-border-light p-6 mb-6">
          <h3 className="font-semibold text-primary mb-5">Tracking History</h3>
          <div className="space-y-0">
            {order.trackingHistory?.map((entry, i) => {
              const Icon = statusIcons[entry.status] || Package;
              const isLast = i === order.trackingHistory.length - 1;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isLast ? 'bg-accent text-white' : 'bg-surface-warm text-text-muted'}`}>
                      <Icon size={14} />
                    </div>
                    {i < order.trackingHistory.length - 1 && <div className="w-px h-8 bg-border-light" />}
                  </div>
                  <div className="pb-6">
                    <p className={`font-medium text-sm ${isLast ? 'text-primary' : 'text-text-secondary'}`}>{entry.status}</p>
                    <p className="text-xs text-text-muted mt-0.5">{entry.note}</p>
                    <p className="text-[10px] text-text-muted mt-1">{new Date(entry.timestamp).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border-light p-6 mb-6">
          <h3 className="font-semibold text-primary mb-4">Items</h3>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={item.image || item.product?.images?.[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted">Qty: {item.qty} × {formatCurrency(item.price)}</p>
                </div>
                <span className="font-semibold text-sm">{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border-light mt-4 pt-4 flex justify-between font-bold text-primary">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="bg-white rounded-2xl border border-border-light p-6">
            <h3 className="font-semibold text-primary mb-3">Shipping Address</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
