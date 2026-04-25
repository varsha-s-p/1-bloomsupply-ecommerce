import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, SlidersHorizontal, Search, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';

const BADGE_MAP = {
  'bestseller': { label: 'BEST SELLER', color: 'bg-green-100 text-green-700' },
  'fresh': { label: 'FRESH BATCH', color: 'bg-blue-100 text-blue-700' },
  'low-stock': { label: 'LOW STOCK', color: 'bg-red-100 text-red-700' },
  'new': { label: 'NEW ARRIVAL', color: 'bg-purple-100 text-purple-700' },
  'wholesale': { label: 'WHOLESALE TIER 1', color: 'bg-gray-100 text-gray-700' }
};

const ProductCard = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const badge = BADGE_MAP[product.badge];

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await onAddToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-50 flex flex-col h-full group">
      <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden cursor-pointer">
        <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        {badge && (
          <div className={`absolute top-4 left-4 ${badge.color} px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase z-10`}>
            {badge.label}
          </div>
        )}
        {product.stock < 30 && !badge && (
          <div className="absolute top-4 left-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase z-10">
            ONLY {product.stock} LEFT
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/product/${product._id}`} className="hover:text-bloom-orange transition-colors">
            <h3 className="font-bold text-bloom-green leading-tight pr-4">{product.name}</h3>
          </Link>
          <div className="text-right">
            <div className="text-lg font-bold text-bloom-green">${product.price.toFixed(2)}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-tighter leading-none">{product.unit}</div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">{product.source || 'BloomSupply'}</p>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>

        {product.bulkPrice && (
          <div className="bg-bloom-cream/50 rounded-xl p-3 mb-4 border border-bloom-accent/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bulk Price</span>
              <span className="text-[10px] font-bold text-bloom-orange">${product.bulkPrice.toFixed(2)} / {product.unit.split(' ')[1]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Min. Qty</span>
              <span className="text-[10px] font-bold text-bloom-green">{product.minOrderQty} Units</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAdd}
            className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${added ? 'bg-green-500 text-white' : 'bg-bloom-green text-white hover:brightness-110'}`}
          >
            {added ? <><Check size={14} /> Added!</> : <><ShoppingCart size={14} /> Add to Cart</>}
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBookmarked(!bookmarked); }}
            className={`px-3 border rounded-lg transition-colors ${bookmarked ? 'border-bloom-green text-bloom-green bg-bloom-green/5' : 'border-gray-200 text-gray-400 hover:text-bloom-green'}`}
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CATEGORIES = [
  { value: 'roses', label: 'Premium Roses' },
  { value: 'lilies', label: 'Elegant Lilies' },
  { value: 'tulips', label: 'Classic Tulips' },
  { value: 'orchids', label: 'Exotic Orchids' },
  { value: 'dahlias', label: 'Designer Dahlias' },
  { value: 'protea', label: 'Architectural Protea' },
  { value: 'peonies', label: 'Romantic Peonies' },
  { value: 'hydrangea', label: 'Blue Hydrangea' },
  { value: 'ranunculus', label: 'Velvet Ranunculus' },
  { value: 'eucalyptus', label: 'Silver Eucalyptus' },
  { value: 'sunflowers', label: 'Golden Sunflowers' },
  { value: 'lavender', label: 'Provence Lavender' },
  { value: 'bouquet', label: 'Designer Bouquets' },
];

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? cat.split(',') : [];
  });
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showBouquets, setShowBouquets] = useState(searchParams.get('category') === 'bouquet');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort: sortBy };
      if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (search) params.search = search;

      const { data } = await api.getProducts(params);
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, minPrice, maxPrice, sortBy, page, search]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId, 1);
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="text"
                  placeholder="Search flowers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-bloom-green"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Flower Category</h4>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                {CATEGORIES.map(cat => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCategory(cat.value)}>
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedCategories.includes(cat.value) ? 'bg-bloom-green border-bloom-green' : 'border-gray-300 bg-white group-hover:border-bloom-green'}`}>
                      {selectedCategories.includes(cat.value) && <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>}
                    </div>
                    <span className={`text-xs ${selectedCategories.includes(cat.value) ? 'text-bloom-green font-medium' : 'text-gray-500'}`}>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Price Range</h4>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green"
                />
                <span className="text-gray-300 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  className="w-full bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-bloom-green"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || minPrice || maxPrice || search) && (
              <button
                onClick={() => { setSelectedCategories([]); setMinPrice(''); setMaxPrice(''); setSearch(''); setPage(1); }}
                className="w-full bg-gray-50 text-gray-500 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-bloom-green mb-2">Curated Marketplace</h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                {total} products found — Sourced from certified growers
              </p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-xs font-bold text-bloom-green cursor-pointer focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-bloom-green border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading flowers...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-6xl mb-4">🌸</div>
              <h3 className="text-xl font-serif font-bold text-bloom-green mb-2">No flowers found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:text-bloom-green border border-gray-200 rounded-lg disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${page === i + 1 ? 'bg-bloom-green text-white shadow-md' : 'text-gray-400 hover:text-bloom-green'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-gray-400 hover:text-bloom-green border border-gray-200 rounded-lg disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
