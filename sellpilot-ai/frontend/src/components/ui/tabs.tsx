import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tabs({
  tabs,
  value,
  onValueChange,
  className,
}: {
  tabs: { value: string; label: ReactNode }[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-1 overflow-x-auto rounded-lg bg-sp-input p-1 scrollbar-none', className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onValueChange(t.value)}
          className={cn(
            'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === t.value ? 'bg-sp-primary text-white' : 'text-sp-text-secondary hover:text-sp-text'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
