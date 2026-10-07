import React from 'react';

export const Logo = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 32,
  };

  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md shadow-primary/25 ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {/* Dynamic Chat Wave Bubble Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3/5 h-3/5 text-white"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
};
