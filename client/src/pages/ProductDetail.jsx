import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronRight, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../utils/api';
import { formatCurrency, getDiscount } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setSelectedImage(0);
    setAddedToCart(false);
    window.scrollTo(0, 0);

    Promise.all([
      getProductById(id),
      getRelatedProducts(id)
    ])
      .then(([productRes, relatedRes]) => {
        setProduct(productRes.data);
        setRelated(relatedRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader size="lg" text="Loading product..." />;
  if (!product) return <div className="text-center py-20 text-text-muted">Product not found</div>;

  const discount = getDiscount(product.mrp, product.price);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-8">
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} className="text-text-muted" />
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-text-primary font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-border-light aspect-square">
              <img
                src={product.images?.[selectedImage] || ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-accent' : 'border-border-light hover:border-accent/50'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-2">
            {product.category && (
              <Link to={`/shop?category=${product.category._id || product.category}`} className="text-xs uppercase tracking-widest text-accent font-semibold">
                {product.category.name || 'Category'}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-2 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.rating) ? 'text-accent fill-accent' : 'text-border'} />
                ))}
              </div>
              <span className="text-sm text-text-secondary font-medium">{product.rating}</span>
              <span className="text-sm text-text-muted">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-lg text-text-muted line-through">{formatCurrency(product.mrp)}</span>
                  <span className="text-sm font-semibold text-success bg-success/10 px-2 py-0.5 rounded">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-text-secondary text-sm leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-all ${
                  addedToCart
                    ? 'bg-success text-white'
                    : product.stock <= 0
                    ? 'bg-border text-text-muted cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                <ShoppingCart size={18} />
                {addedToCart ? 'Added to Cart!' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-light">
              {[
                { icon: Truck, label: 'Free delivery above ₹999' },
                { icon: Shield, label: 'Secure checkout' },
                { icon: RotateCcw, label: 'Easy returns' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5">
                  <item.icon size={18} className="text-accent" />
                  <span className="text-[10px] text-text-muted leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 mb-8">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
