import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentProducts } from '../../utils/api';
import { FALLBACK_PRODUCTS } from '../../utils/fallbackData';
import ProductCard from '../common/ProductCard';
import { SkeletonGrid } from '../common/Loader';

const RecentProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentProducts({ limit: 8 })
      .then(({ data }) => {
        setProducts(data && data.length > 0 ? data : FALLBACK_PRODUCTS);
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 mb-20 md:mb-32">
      <div className="flex justify-between items-end mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary">Just Arrived</h2>
        <Link to="/shop?sort=newest" className="hidden md:block font-medium text-base text-accent hover:text-accent-dark hover:underline underline-offset-4 transition-all">
          View all
        </Link>
      </div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      
      <div className="mt-10 text-center md:hidden">
        <Link to="/shop?sort=newest" className="inline-block border border-border text-primary rounded-xl px-8 py-4 font-semibold w-full">
          View all new arrivals
        </Link>
      </div>
    </section>
  );
};

export default RecentProducts;
