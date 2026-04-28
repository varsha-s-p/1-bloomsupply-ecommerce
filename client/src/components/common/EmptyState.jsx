import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon = ShoppingBag, title = 'Nothing here yet', description = '', actionLabel = '', actionTo = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-warm flex items-center justify-center mb-6">
        <Icon size={32} className="text-text-muted" />
      </div>
      <h3 className="font-serif text-xl font-bold text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="bg-accent text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-accent-dark transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
