import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sp-active/60 bg-sp-elevated/40 px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-sp-primary/10 p-4 text-sp-primary-light">
        <Icon size={28} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-sp-text">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-sp-text-secondary">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
