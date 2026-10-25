import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white',
    ghost: 'hover:bg-gray-800 text-gray-200',
  };
  
  const sizeStyles = {
    default: 'h-10 py-2 px-4 text-sm',
    sm: 'h-9 px-3 text-xs',
    lg: 'h-11 px-8 text-base',
  };

  const Component = asChild ? 
    React.cloneElement(children as React.ReactElement, {
      className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} focus-visible:ring-blue-500 focus-visible:ring-offset-gray-900`,
      ...props
    }) : 
    (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} focus-visible:ring-blue-500 focus-visible:ring-offset-gray-900`}
        {...props}
      >
        {children}
      </button>
    );

  return Component;
};
