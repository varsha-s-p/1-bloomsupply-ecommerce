import React from 'react';
import { Truck, Shield, Leaf, Clock } from 'lucide-react';

const PromoStrip = () => {
  const features = [
    { icon: Truck, title: 'Next-Day Delivery' },
    { icon: Leaf, title: 'Sustainably Sourced' },
    { icon: Shield, title: 'Quality Guaranteed' },
    { icon: Clock, title: 'Curated Daily' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 mb-16 border-y border-border-light flex flex-wrap justify-between md:justify-center md:gap-24 items-center text-center">
      {features.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex flex-col items-center p-4 w-1/2 md:w-auto">
            <Icon size={32} className="text-primary mb-4" strokeWidth={1.5} />
            <span className="font-medium text-base text-text-primary tracking-tight">{item.title}</span>
          </div>
        );
      })}
    </section>
  );
};

export default PromoStrip;
