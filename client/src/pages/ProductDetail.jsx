import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ChevronRight, Calendar, Info, MapPin, Truck, Plus, Minus, ShoppingCart, Check, Loader2 } from 'lucide-react';
import * as api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('supplier');
  const [added, setAdded] = useState(false);
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.getProductById(id);
        setProduct(data);
        setQty(data.minOrderQty || 1);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      if (!user) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-bloom-green animate-spin" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="text-2xl font-serif font-bold text-bloom-green mb-2">Product not found</h2>
          <Link to="/marketplace" className="text-sm text-bloom-orange font-bold hover:underline">← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.bulkPrice && qty >= (product.minOrderQty || 50) ? product.bulkPrice : product.price;
  const vendorName = product.vendorProfile?.shopName || product.vendor?.name || 'BloomSupply';
  const growerName = product.growerProfile?.farmName || product.grower?.name || 'Heritage Botanical';
  const vendorCity = product.vendorProfile?.city || product.vendor?.city || '';

  // Generate extra images from the main one for gallery effect
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1591886103814-616147485303?w=500&h=500&fit=crop'];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-bloom-green">Home</Link>
          <ChevronRight size={12} />
          <Link to="/marketplace" className="hover:text-bloom-green">Marketplace</Link>
          <ChevronRight size={12} />
          <span className="text-bloom-green">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Gallery */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-6 bg-gray-50">
              <img
                src={images[mainImage] || images[0]}
                className="w-full h-full object-cover"
                alt={product.name}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer group border-2 transition-all ${mainImage === i ? 'border-bloom-green shadow-lg' : 'border-transparent'}`}
                  >
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Thumbnail" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-6 flex flex-col pt-4">
            {product.badge && (
              <div className="text-[10px] font-bold text-bloom-orange uppercase tracking-[0.2em] mb-2">
                {product.badge.replace('-', ' ').toUpperCase()}
              </div>
            )}
            <h1 className="text-5xl font-serif font-bold text-bloom-green mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-bloom-orange gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-xs text-gray-400">{product.rating}/5 ({product.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs text-gray-400">Supplied by</span>
              <span className="text-xs font-bold text-bloom-green border-b-2 border-bloom-green pb-0.5">{vendorName}</span>
              {vendorCity && <span className="text-xs text-gray-400">• {vendorCity}</span>}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-8">{product.description}</p>

            <div className="grid grid-cols-3 gap-8 py-6 border-y border-gray-100 mb-8">
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">Harvest Date</div>
                <div className="text-xs font-bold text-bloom-green uppercase">{product.harvestDate ? new Date(product.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Fresh'}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">Stock</div>
                <div className="text-xs font-bold text-bloom-green uppercase">{product.stock.toLocaleString()} {product.unit.split(' ')[1]}s</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">Stem Length</div>
                <div className="text-xs font-bold text-bloom-green uppercase">{product.stemLength || 'Standard'}</div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-serif font-bold text-bloom-green">${currentPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-400">{product.unit}</span>
                {product.bulkPrice && currentPrice === product.bulkPrice && (
                  <span className="text-xs text-bloom-orange font-bold bg-bloom-orange/10 px-3 py-1 rounded-full">Bulk Price Active</span>
                )}
              </div>
              {product.bulkPrice && (
                <p className="text-[10px] text-gray-400">Bulk price ${product.bulkPrice.toFixed(2)} available for {product.minOrderQty}+ units</p>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 gap-6 border border-gray-100">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-bloom-green"><Minus size={18} /></button>
                <span className="font-bold text-bloom-green min-w-[3ch] text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-gray-400 hover:text-bloom-green"><Plus size={18} /></button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${added ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-bloom-orange text-white hover:brightness-110 shadow-bloom-orange/20'}`}
              >
                {added ? (
                  <><Check size={20} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={20} fill="currentColor" /> Add to Cart — ${(qty * currentPrice).toFixed(2)}</>
                )}
              </button>
            </div>

            {!user && (
              <div className="bg-bloom-cream/80 p-4 rounded-2xl border border-bloom-accent/30 mb-6">
                <p className="text-xs text-bloom-green font-medium">
                  <Link to="/login" className="font-bold text-bloom-orange hover:underline">Login</Link> or <Link to="/login?tab=register" className="font-bold text-bloom-orange hover:underline">Register</Link> to save items and place orders.
                </p>
              </div>
            )}

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                <Calendar size={18} className="text-gray-300" />
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vase Life</div>
                  <div className="text-xs font-bold text-bloom-green">{product.vaseLife || '7-10 Days'}</div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                <Info size={18} className="text-gray-300" />
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fragrance</div>
                  <div className="text-xs font-bold text-bloom-green capitalize">{product.fragranceLevel || 'Low'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-12 border-b border-gray-100 mb-10">
            {['supplier', 'specs', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-bloom-green' : 'text-gray-300 hover:text-gray-400'}`}
              >
                {tab === 'supplier' ? 'Supplier Details' : tab === 'specs' ? 'Technical Specs' : 'Shipping Info'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bloom-green"></div>}
              </button>
            ))}
          </div>

          {activeTab === 'supplier' && (
            <div className="bg-gray-50 rounded-[32px] p-10 flex gap-8 border border-gray-100">
              <div className="w-24 h-24 rounded-full bg-bloom-green flex items-center justify-center text-white text-2xl font-serif font-bold shrink-0">
                {growerName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-bloom-green">{growerName}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-4">
                  Certified Grower {vendorCity && `— ${vendorCity}`}
                </p>
                <p className="text-sm text-gray-500 italic leading-relaxed max-w-2xl mb-4">
                  {product.growerProfile?.farmDescription || product.vendorProfile?.shopDescription || 'Premium flowers grown with care and delivered fresh to your doorstep.'}
                </p>
                {product.growerProfile?.specialties && (
                  <div className="flex flex-wrap gap-2">
                    {product.growerProfile.specialties.map((s, i) => (
                      <span key={i} className="bg-bloom-green/10 text-bloom-green px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Vase Life', val: product.vaseLife || 'N/A' },
                { label: 'Cold Chain', val: product.coldChainTemp || '2°C - 5°C' },
                { label: 'Fragrance', val: product.fragranceLevel || 'Low' },
                { label: 'Head Size', val: product.headSize || 'Standard' },
                { label: 'Stem Length', val: product.stemLength || 'Standard' },
                { label: 'Color', val: product.color || 'Natural' },
                { label: 'Category', val: product.category },
                { label: 'Min Order', val: `${product.minOrderQty} units` }
              ].map((spec, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">{spec.label}</div>
                  <div className="text-sm font-bold text-bloom-green capitalize">{spec.val}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                <Truck size={32} className="text-bloom-green mx-auto mb-4" />
                <h4 className="font-bold text-bloom-green mb-2">Express Delivery</h4>
                <p className="text-xs text-gray-400">Climate-controlled delivery within 24-48 hours</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                <MapPin size={32} className="text-bloom-green mx-auto mb-4" />
                <h4 className="font-bold text-bloom-green mb-2">Pan-India Coverage</h4>
                <p className="text-xs text-gray-400">Delivery available to all major cities</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                <Calendar size={32} className="text-bloom-green mx-auto mb-4" />
                <h4 className="font-bold text-bloom-green mb-2">Freshness Guarantee</h4>
                <p className="text-xs text-gray-400">100% fresh on arrival or full refund</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
