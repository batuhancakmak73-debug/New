import { Badge } from '@/components/ui/badge';

const map: Record<string, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'; label: string }> = {
  draft: { variant: 'muted', label: 'Draft' },
  published: { variant: 'success', label: 'Published' },
  scheduled: { variant: 'info', label: 'Scheduled' },
  archived: { variant: 'warning', label: 'Archived' },
  pending: { variant: 'info', label: 'Pending' },
  posted: { variant: 'success', label: 'Posted' },
  failed: { variant: 'danger', label: 'Failed' },
  cancelled: { variant: 'muted', label: 'Cancelled' },
  new: { variant: 'info', label: 'New' },
  contacted: { variant: 'warning', label: 'Contacted' },
  qualified: { variant: 'default', label: 'Qualified' },
  closed: { variant: 'success', label: 'Closed' },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = map[status] || { variant: 'muted' as const, label: status };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
