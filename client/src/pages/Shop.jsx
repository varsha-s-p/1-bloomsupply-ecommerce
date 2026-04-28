import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Loader, { SkeletonGrid } from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Search } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const badge = searchParams.get('badge') || '';

  const fetchProducts = useCallback(async (pageNum, append = false) => {
    const setter = append ? setLoadingMore : setLoading;
    setter(true);

    try {
      const { data } = await getProducts({
        page: pageNum,
        limit: 12,
        search,
        category,
        sort,
        badge
      });

      setProducts(prev => append ? [...prev, ...data.products] : data.products);
      setHasMore(data.hasMore);
      setTotal(data.total);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setter(false);
    }
  }, [search, category, sort, badge]);

  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 400) {
        fetchProducts(page + 1, true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, page, fetchProducts]);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name-asc', label: 'Name: A to Z' }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border-light">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary">
            {search ? `Results for "${search}"` : badge ? `${badge.charAt(0).toUpperCase() + badge.slice(1)} Products` : 'Shop All'}
          </h1>
          {total > 0 && <p className="text-base text-text-secondary mt-2">{total} products found</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium text-text-primary hover:border-primary transition-all"
          >
            <SlidersHorizontal size={18} />
            Filters
            {category && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="appearance-none bg-white border border-border rounded-xl px-6 py-3 pr-10 text-sm font-medium text-text-primary focus:outline-none focus:border-primary cursor-pointer transition-all"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {filterOpen && (
          <div className="bg-white rounded-2xl border border-border-light p-5 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-primary">Filter by Category</h3>
              {category && (
                <button onClick={() => updateFilter('category', '')} className="text-xs text-accent font-medium flex items-center gap-1">
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', category === cat._id ? '' : cat._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat._id ? 'bg-accent text-white' : 'bg-surface border border-border-light text-text-secondary hover:border-accent'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No products found"
            description="Try adjusting your filters or search terms"
            actionLabel="Clear Filters"
            actionTo="/shop"
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {loadingMore && (
              <div className="py-8">
                <Loader text="Loading more..." />
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <p className="text-center text-sm text-text-muted py-8">You've seen all products</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
