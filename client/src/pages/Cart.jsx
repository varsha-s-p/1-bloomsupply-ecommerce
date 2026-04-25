import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MapPin, Phone, User2, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';

const Cart = () => {
  const { cart, cartCount, updateItem, removeItem, emptyCart, getTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Shipping form
  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const total = getTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setPlacing(true);
    try {
      const { data } = await api.createOrder({
        shippingAddress: { fullName, address, city, state, pincode, phone }
      });
      setOrderSuccess(data);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  // Order success view
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#fbfcfa] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-[40px] p-12 text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-bloom-green mb-4">Order Placed!</h2>
          <p className="text-gray-500 mb-2">Your order <span className="font-bold text-bloom-green">{orderSuccess.orderNumber}</span> has been placed successfully.</p>
          <p className="text-sm text-gray-400 mb-8">You can track your order from your dashboard.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/dashboard')} className="w-full bg-bloom-green text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[.3em] hover:bg-black transition-all shadow-xl shadow-bloom-green/20">
              Go to Dashboard
            </button>
            <Link to="/marketplace" className="text-xs font-bold text-bloom-orange hover:underline uppercase tracking-widest">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fbfcfa] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-3xl font-serif font-bold text-bloom-green mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Browse our curated marketplace to find premium flowers</p>
          <Link to="/marketplace" className="bg-bloom-green text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[.3em] hover:bg-black transition-all shadow-xl shadow-bloom-green/20 inline-flex items-center gap-3">
            Browse Marketplace <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfcfa] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-serif font-bold text-bloom-green mb-2">Shopping Cart</h1>
        <p className="text-sm text-gray-400 mb-10">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item, idx) => {
              const prod = item.product;
              if (!prod) return null;

              return (
                <div key={idx} className="bg-white p-6 rounded-[28px] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    <img src={prod.images?.[0] || 'https://via.placeholder.com/200'} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${prod._id}`} className="font-bold text-bloom-green hover:text-bloom-orange transition-colors block truncate">{prod.name}</Link>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{prod.source || 'BloomSupply'} • {prod.unit}</div>
                    <div className="text-sm font-bold text-bloom-green mt-2">${prod.price?.toFixed(2)} {prod.unit}</div>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 gap-4 border border-gray-100">
                    <button onClick={() => updateItem(prod._id, Math.max(1, item.quantity - 1))} className="text-gray-400 hover:text-bloom-green"><Minus size={16} /></button>
                    <span className="font-bold text-bloom-green text-sm min-w-[2ch] text-center">{item.quantity}</span>
                    <button onClick={() => updateItem(prod._id, item.quantity + 1)} className="text-gray-400 hover:text-bloom-green"><Plus size={16} /></button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="font-bold text-bloom-green text-lg">${(prod.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <button onClick={() => removeItem(prod._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}

            <button onClick={emptyCart} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest mt-4">
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-serif font-bold text-bloom-green mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-bloom-green">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="font-bold text-bloom-green">${(total * 0.05).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="font-bold text-bloom-green">Total</span>
                <span className="text-3xl font-serif font-bold text-bloom-green">${(total * 1.05).toFixed(2)}</span>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    setShowCheckout(true);
                  }}
                  className="w-full bg-bloom-green text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[.3em] hover:bg-black transition-all shadow-xl shadow-bloom-green/20 flex items-center justify-center gap-2"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'} <ArrowRight size={16} />
                </button>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Details</div>
                  <div className="relative">
                    <User2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="text" required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green" />
                  </div>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="text" required placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}
                      className="bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green" />
                    <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)}
                      className="bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)}
                      className="bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green" />
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input type="text" required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={placing}
                    className="w-full bg-bloom-orange text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[.3em] hover:brightness-110 transition-all shadow-xl shadow-bloom-orange/20 flex items-center justify-center gap-2 mt-4"
                  >
                    {placing ? <Loader2 className="animate-spin" size={16} /> : <><ShoppingBag size={16} /> Place Order</>}
                  </button>
                </form>
              )}

              <Link to="/marketplace" className="block text-center text-[10px] font-bold text-bloom-green hover:text-bloom-orange mt-6 uppercase tracking-widest">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
