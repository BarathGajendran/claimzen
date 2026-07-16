import React from 'react';

const Spinner = ({ size = 'md', color = 'brand', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    brand: 'border-brand-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-500 border-t-transparent'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.brand}`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
