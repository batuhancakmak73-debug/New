import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[90px] w-full rounded-lg border border-sp-active/60 bg-sp-input px-3 py-2 text-sm text-sp-text',
        'placeholder:text-sp-text-muted focus:border-sp-primary focus:outline-none focus:ring-1 focus:ring-sp-primary/50',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
