import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Warehouse, Package, Clock, MapPin, Loader2 } from 'lucide-react';
import * as api from '../utils/api';

const STEPS = [
  { key: 'pending', label: 'Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'in-hub', label: 'Hub', icon: Warehouse },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfcfa]">
        <Loader2 className="w-10 h-10 text-bloom-green animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfcfa]">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-serif font-bold text-bloom-green mb-2">Order not found</h2>
          <Link to="/dashboard" className="text-sm text-bloom-orange font-bold hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentStepIdx = STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="bg-[#fbfcfa] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/dashboard" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-bloom-green mb-8 block">← Back to Dashboard</Link>

        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm mb-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-serif font-bold text-bloom-green mb-2">Order {order.orderNumber}</h1>
              <p className="text-xs text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[.25em] ${
              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-bloom-green text-white'
            }`}>
              {order.status}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="relative flex justify-between items-center mb-12 px-4">
            <div className="absolute left-8 right-8 h-[2px] bg-gray-100 top-5 z-0">
              <div
                className="h-full bg-bloom-green transition-all duration-1000"
                style={{ width: `${Math.min(100, (currentStepIdx / (STEPS.length - 1)) * 100)}%` }}
              ></div>
            </div>

            {STEPS.map((step, i) => {
              const isCompleted = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? 'bg-bloom-green text-white shadow-xl shadow-bloom-green/30 ring-4 ring-white'
                      : 'bg-white text-gray-200 border border-gray-200 shadow-sm'
                  } ${isCurrent ? 'scale-110' : ''}`}>
                    <StepIcon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[.15em] ${isCompleted ? 'text-bloom-green' : 'text-gray-300'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Estimated delivery */}
          {order.estimatedDelivery && order.status !== 'delivered' && (
            <div className="bg-bloom-cream/50 p-4 rounded-2xl border border-bloom-accent/20 text-center mb-8">
              <p className="text-xs text-gray-500">Estimated Delivery: <span className="font-bold text-bloom-green">{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-serif font-bold text-bloom-green mb-6">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-5 py-4 border-b border-gray-50 last:border-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50">
                  <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-bloom-green text-sm">{item.name}</div>
                  <div className="text-[10px] text-gray-400">Qty: {item.qty} {item.unit || 'units'}</div>
                </div>
                <div className="font-bold text-bloom-green">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline mt-6 pt-6 border-t border-gray-100">
            <span className="font-bold text-gray-500">Total</span>
            <span className="text-2xl font-serif font-bold text-bloom-green">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Tracking History */}
        {order.trackingHistory && order.trackingHistory.length > 0 && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm mb-8">
            <h3 className="text-lg font-serif font-bold text-bloom-green mb-6">Tracking Timeline</h3>
            <div className="space-y-6">
              {order.trackingHistory.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-bloom-green' : 'bg-gray-200'}`}></div>
                    {i < order.trackingHistory.length - 1 && <div className="w-0.5 h-full bg-gray-100 mt-1"></div>}
                  </div>
                  <div className="pb-6">
                    <div className="text-sm font-bold text-bloom-green">{event.status}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{new Date(event.timestamp).toLocaleString()}</div>
                    {event.note && <div className="text-xs text-gray-500 mt-1">{event.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-bloom-green mb-4 flex items-center gap-2"><MapPin size={18} /> Shipping Address</h3>
            <div className="text-sm text-gray-600">
              <p className="font-bold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress.pincode}</p>
              {order.shippingAddress.phone && <p className="mt-1 text-gray-400">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
