import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  error,
  helperText,
  className = '',
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const computedType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/70">
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={computedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full py-2.5 bg-surface-lowest border rounded-lg text-sm text-on-surface placeholder:text-outline/60
            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${isPasswordField ? 'pr-11' : 'pr-3.5'}
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-outline-variant hover:border-outline focus:border-primary-container'
            }
          `}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant/70 hover:text-on-surface focus:outline-none transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" />
            ) : (
              <Eye className="w-[18px] h-[18px]" />
            )}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-on-surface-variant">{helperText}</p>
      ) : null}
    </div>
  );
};
