import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import EmptyState from '../components/common/EmptyState';

const Cart = () => {
  const { cart, updateItem, removeItem, getTotal, cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const deliveryCharge = subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0;
  const total = subtotal + deliveryCharge;

  if (!cart.items || cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Browse our collection and find something you love."
        actionLabel="Start Shopping"
        actionTo="/shop"
      />
    );
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => {
              const product = item.product;
              if (!product || typeof product === 'string') return null;

              return (
                <div key={product._id} className="bg-white rounded-2xl border border-border-light p-5 sm:p-6 flex gap-6 ambient-shadow">
                  <Link to={`/product/${product._id}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-surface-warm shrink-0">
                    <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product._id}`} className="font-serif text-lg sm:text-xl text-primary hover:text-accent transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </Link>
                      <p className="text-sm text-text-muted mt-1">{product.unit}</p>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-border rounded-lg bg-surface">
                        <button
                          onClick={() => updateItem(product._id, Math.max(1, item.quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(product._id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-lg text-primary">{formatCurrency(product.price * item.quantity)}</span>
                        <button
                          onClick={() => removeItem(product._id)}
                          className="text-text-muted hover:text-error transition-colors flex items-center gap-1 text-xs font-medium uppercase tracking-widest"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border-light p-8 sticky top-28 ambient-shadow">
              <h3 className="font-serif text-2xl text-primary mb-6">Order Summary</h3>

              <div className="space-y-4 text-base">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-primary">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-success font-semibold tracking-wide' : 'font-medium text-primary'}>
                    {deliveryCharge === 0 ? 'COMPLIMENTARY' : formatCurrency(deliveryCharge)}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-sm text-accent bg-accent/10 px-4 py-2 rounded-lg text-center mt-2">Add {formatCurrency(999 - subtotal)} more for free delivery</p>
                )}
                <div className="border-t border-border-light pt-6 mt-6 flex justify-between items-center font-serif font-bold text-primary text-2xl">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary-light hover:-translate-y-1 transition-all shadow-lg"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <Link to="/shop" className="block text-center text-sm text-accent font-medium mt-4 hover:text-accent-dark transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
