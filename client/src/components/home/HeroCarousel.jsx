import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getActiveBanners } from '../../utils/api';
import { FALLBACK_BANNERS, FALLBACK_IMAGES } from '../../utils/fallbackData';

const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getActiveBanners()
      .then(({ data }) => {
        setBanners(data && data.length > 0 ? data : FALLBACK_BANNERS);
      })
      .catch(() => {
        setBanners(FALLBACK_BANNERS);
      });
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = () => setCurrent(prev => (prev - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (banners.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-surface flex items-center justify-center max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-12">
        <div className="text-center px-8 bg-surface-warm p-12 rounded-3xl w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-primary mb-6 leading-tight">
            Curated nature for <br/> the modern home.
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto mb-10 text-lg leading-relaxed">
            Elevate your space with seasonal, sustainably sourced stems arranged by master florists. Delivered fresh to your door.
          </p>
          <Link to="/shop" className="inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-5 rounded-xl font-semibold hover:bg-primary-light hover:scale-[1.02] active:scale-[0.98] transition-all text-base shadow-lg">
            Shop the Collection <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 md:py-16">
      <div className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] w-full bg-surface-warm rounded-3xl overflow-hidden shadow-xl">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
          >
            <div className="flex flex-col md:flex-row h-full w-full">
              {/* Content Side */}
              <div className="w-full md:w-5/12 lg:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-surface-warm z-10">
                {banner.discountPercent > 0 && (
                  <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit">
                    {banner.discountPercent}% Off
                  </span>
                )}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-primary leading-tight mb-6">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-text-secondary text-base lg:text-lg mb-10 leading-relaxed max-w-md font-medium">
                    {banner.subtitle}
                  </p>
                )}
                <Link
                  to={banner.link || '/shop'}
                  className="inline-flex w-fit items-center gap-3 bg-primary text-white px-10 py-5 rounded-xl font-semibold hover:bg-primary-light hover:scale-[1.02] active:scale-[0.98] transition-all text-base shadow-lg"
                >
                  Shop the Collection <ArrowRight size={18} />
                </Link>
              </div>
              
              {/* Image Side */}
              <div className="w-full md:w-7/12 lg:w-1/2 h-full relative">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.target.src = FALLBACK_IMAGES.hero; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-warm via-transparent to-transparent md:block hidden w-24"></div>
              </div>
            </div>
          </div>
        ))}

        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 md:left-20 -translate-x-1/2 md:translate-x-0 z-20 flex gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-12 bg-primary' : 'w-4 bg-primary/20'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
