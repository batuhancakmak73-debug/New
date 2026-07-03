import { cn } from '@/lib/utils';

export function Separator({ className, vertical }: { className?: string; vertical?: boolean }) {
  return <div className={cn('bg-sp-active/50', vertical ? 'h-full w-px' : 'h-px w-full', className)} />;
}
