import { PLATFORM_META } from '@/lib/utils';

export function PlatformBadge({ platform }: { platform: string }) {
  const meta = PLATFORM_META[platform] || { label: platform, color: '#8B8FA3' };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}
