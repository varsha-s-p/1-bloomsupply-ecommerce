import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', text = '' }) => {
  const sizeMap = { sm: 16, md: 24, lg: 40 };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 size={sizeMap[size]} className="animate-spin text-accent" />
      {text && <p className="text-sm text-text-muted">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-border-light">
    <div className="aspect-square skeleton" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-3 w-16" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-5 w-20 mt-2" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Loader;
