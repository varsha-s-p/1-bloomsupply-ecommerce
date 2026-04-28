import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '../../utils/api';
import { FALLBACK_CATEGORIES, FALLBACK_IMAGES } from '../../utils/fallbackData';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(({ data }) => {
        setCategories(data && data.length > 0 ? data : FALLBACK_CATEGORIES);
      })
      .catch(() => {
        setCategories(FALLBACK_CATEGORIES);
      });
  }, []);

  if (categories.length < 3) return null;

  const [cat1, cat2, cat3] = categories;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 mb-20 md:mb-32">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-8 text-center md:text-left">Explore by Collection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 h-auto md:h-[600px]">
        {/* Large Main Category */}
        <Link 
          to={`/shop?category=${cat1._id}`}
          className="group relative block w-full h-[400px] md:h-full col-span-1 md:col-span-2 rounded-2xl overflow-hidden ambient-shadow"
        >
          <img 
            src={cat1.image || FALLBACK_IMAGES.placeholder} 
            alt={cat1.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.src = FALLBACK_IMAGES.placeholder; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <span className="inline-block bg-accent/90 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              Signature
            </span>
            <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">{cat1.name}</h3>
            {cat1.description && (
              <p className="text-white/90 text-base hidden md:block max-w-md">{cat1.description}</p>
            )}
          </div>
        </Link>

        {/* Stacked Smaller Categories */}
        <div className="grid grid-rows-2 gap-6 md:gap-8 h-[600px] md:h-full col-span-1">
          <Link 
            to={`/shop?category=${cat2._id}`}
            className="group relative block w-full h-full rounded-2xl overflow-hidden ambient-shadow"
          >
            <img 
              src={cat2.image || FALLBACK_IMAGES.placeholder} 
              alt={cat2.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = FALLBACK_IMAGES.placeholder; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-serif text-white mb-1">{cat2.name}</h3>
            </div>
          </Link>

          <Link 
            to={`/shop?category=${cat3._id}`}
            className="group relative block w-full h-full rounded-2xl overflow-hidden ambient-shadow"
          >
            <img 
              src={cat3.image || FALLBACK_IMAGES.placeholder} 
              alt={cat3.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = FALLBACK_IMAGES.placeholder; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-serif text-white mb-1">{cat3.name}</h3>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="mt-10 text-center md:hidden">
        <Link to="/categories" className="inline-block border border-border text-primary rounded-xl px-8 py-4 font-semibold w-full">
          View all collections
        </Link>
      </div>
    </section>
  );
};

export default CategoryGrid;
