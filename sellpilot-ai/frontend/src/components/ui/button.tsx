import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-sp-primary text-white hover:bg-sp-primary-dark',
  secondary: 'bg-sp-input text-sp-text hover:bg-sp-hover border border-sp-active',
  ghost: 'bg-transparent text-sp-text-secondary hover:bg-sp-hover hover:text-sp-text',
  destructive: 'bg-sp-danger/15 text-sp-danger hover:bg-sp-danger/25',
  outline: 'border border-sp-active bg-transparent text-sp-text hover:bg-sp-hover',
  success: 'bg-sp-success/15 text-sp-success hover:bg-sp-success/25',
};

const sizes = {
  default: 'h-10 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-12 px-6 text-base',
  icon: 'h-9 w-9',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-primary/60',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
