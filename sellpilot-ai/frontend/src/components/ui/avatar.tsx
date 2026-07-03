import { cn, initials } from '@/lib/utils';

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sp-primary/20 text-xs font-semibold text-sp-primary-light',
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
