import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-sp-active/60 bg-sp-input px-3 text-sm text-sp-text',
        'placeholder:text-sp-text-muted focus:border-sp-primary focus:outline-none focus:ring-1 focus:ring-sp-primary/50',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
