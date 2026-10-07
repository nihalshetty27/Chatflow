import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'right',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-4 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-primary-container text-white hover:bg-primary shadow-sm focus:ring-primary/20',
    secondary:
      'bg-surface-lowest text-on-surface border border-outline-variant/80 hover:bg-surface-low hover:border-outline-variant focus:ring-primary/15',
    outline:
      'bg-transparent text-on-surface border border-outline-variant hover:bg-surface-low focus:ring-primary/15',
    ghost:
      'bg-transparent text-on-surface-variant hover:bg-surface-low hover:text-on-surface focus:ring-primary/10',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm px-5 py-3 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
};
