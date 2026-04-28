import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency, getDiscount } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { FALLBACK_IMAGES } from '../../utils/fallbackData';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const discount = getDiscount(product.mrp, product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product._id);
  };

  const badgeColors = {
    bestseller: 'bg-accent/10 text-accent border border-accent/20',
    new: 'bg-primary/10 text-primary border border-primary/20',
    sale: 'bg-error/10 text-error border border-error/20',
    limited: 'bg-warning/10 text-warning border border-warning/20'
  };

  return (
    <Link to={`/product/${product._id}`} className="group block h-full">
      <div className="bg-white rounded-2xl border border-border-light overflow-hidden ambient-shadow flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-warm">
          <img
            src={product.images?.[0] || FALLBACK_IMAGES.placeholder}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = FALLBACK_IMAGES.placeholder; }}
          />

          {product.badge && (
            <div className="absolute top-4 left-4 z-10">
              <span className={`inline-block font-bold text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full ${badgeColors[product.badge] || 'bg-surface text-text-secondary border border-border'}`}>
                {product.badge}
              </span>
            </div>
          )}

          {discount > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-error text-white px-2.5 py-1 rounded-md text-[11px] font-bold">
                -{discount}%
              </span>
            </div>
          )}

          {/* Quick Add Button overlay */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white transform translate-y-4 group-hover:translate-y-0 z-20"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} strokeWidth={2} />
          </button>
          
          {/* Subtle gradient overlay to make buttons pop */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-5 md:p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg md:text-xl text-primary mb-1.5 leading-tight group-hover:text-accent transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {product.category?.name || product.category || 'Collection'}
            </p>
          </div>

          <div className="mt-5 flex items-baseline gap-2.5">
            <span className="font-medium text-lg text-primary">{formatCurrency(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-sm text-text-muted line-through">{formatCurrency(product.mrp)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
