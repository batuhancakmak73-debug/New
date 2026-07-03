import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-sp-text-muted">{label}</div>
            <div className="mt-2 font-heading text-2xl font-bold text-sp-text">{value}</div>
          </div>
          <div className="rounded-lg bg-sp-primary/10 p-2 text-sp-primary-light">
            <Icon size={18} />
          </div>
        </div>
        {trend !== undefined && (
          <div className={cn('mt-3 flex items-center gap-1 text-xs font-medium', up ? 'text-sp-success' : 'text-sp-danger')}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {up ? '+' : ''}{trend}% {trendLabel && <span className="text-sp-text-muted">{trendLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
