import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { createOrder } from '../utils/api';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, getTotal, emptyCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [error, setError] = useState('');

  const subtotal = getTotal();
  const deliveryCharge = subtotal >= 999 ? 0 : 49;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.address || !form.city || !form.pincode || !form.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await createOrder({ shippingAddress: form });
      setOrderPlaced(data);
      emptyCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border border-border-light">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">Order Placed!</h2>
          <p className="text-text-muted text-sm mb-6">
            Your order #{orderPlaced.orderNumber} has been placed successfully. You will receive a confirmation shortly.
          </p>
          <div className="space-y-3">
            <Link to={`/order/${orderPlaced._id}`} className="block w-full bg-primary text-white py-3 rounded-full font-semibold text-sm hover:bg-primary-light transition-colors">
              Track Order
            </Link>
            <Link to="/shop" className="block w-full border border-border text-text-secondary py-3 rounded-full font-semibold text-sm hover:bg-surface transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-border-light p-6">
              <h3 className="font-semibold text-primary mb-5">Shipping Address</h3>

              {error && <p className="text-error text-sm mb-4 bg-error/10 px-4 py-2 rounded-lg">{error}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name', span: 2 },
                  { name: 'phone', label: 'Phone Number', type: 'tel' },
                  { name: 'pincode', label: 'Pincode' },
                  { name: 'address', label: 'Full Address', span: 2 },
                  { name: 'city', label: 'City' },
                  { name: 'state', label: 'State' }
                ].map((field) => (
                  <div key={field.name} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-base hover:bg-primary-light transition-all shadow-md disabled:opacity-50 lg:hidden"
            >
              {loading ? 'Placing Order...' : `Place Order • ${formatCurrency(total)}`}
            </button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border-light p-8 sticky top-28 ambient-shadow">
              <h3 className="font-serif text-xl font-semibold text-primary mb-6">Order Summary</h3>

              <div className="space-y-3 mb-5">
                {cart.items?.map((item) => {
                  const product = item.product;
                  if (!product || typeof product === 'string') return null;
                  return (
                    <div key={product._id} className="flex items-center gap-3">
                      <img src={product.images?.[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(product.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm border-t border-border-light pt-4">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-success' : ''}>{deliveryCharge === 0 ? 'Free' : formatCurrency(deliveryCharge)}</span>
                </div>
                <div className="border-t border-border-light pt-2 flex justify-between font-bold text-primary">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="hidden lg:block w-full mt-8 bg-primary text-white py-4 rounded-xl font-semibold text-base hover:bg-primary-light transition-all shadow-md disabled:opacity-50 hover:-translate-y-1"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
