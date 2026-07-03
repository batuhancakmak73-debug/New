import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-sp-primary/15 text-sp-primary-light',
  success: 'bg-sp-success/15 text-sp-success',
  warning: 'bg-sp-warning/15 text-sp-warning',
  danger: 'bg-sp-danger/15 text-sp-danger',
  info: 'bg-sp-info/15 text-sp-info',
  muted: 'bg-sp-input text-sp-text-secondary',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}
      {...props}
    />
  );
}
