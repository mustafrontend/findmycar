import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary-emerald' | 'primary-rose' | 'secondary' | 'outline' | 'ghost' | 'pro';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary-emerald',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-extrabold tracking-tight transition-all duration-200 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

  const variantStyles = {
    'primary-emerald': 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500/30 ring-2 ring-emerald-600/10',
    'primary-rose': 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 border border-rose-500/30 ring-2 ring-rose-600/10',
    'secondary': 'bg-slate-900 hover:bg-slate-800 text-white shadow-md border border-slate-800',
    'outline': 'bg-white hover:bg-slate-50 text-slate-800 border-[0.5px] border-slate-300 shadow-2xs',
    'ghost': 'bg-transparent hover:bg-slate-100/80 text-slate-700',
    'pro': 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25 border border-amber-400/40',
  };

  const sizeStyles = {
    sm: 'h-9 px-3 text-xs rounded-xl gap-1.5',
    md: 'h-11 px-4 text-sm rounded-2xl gap-2',
    lg: 'h-13 px-6 text-base rounded-2xl gap-2.5',
    hero: 'h-20 px-8 text-xl font-black rounded-3xl gap-3 text-white shadow-2xl',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Yükleniyor...</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
