import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Copy, ExternalLink, List, Pencil, Plus, Search, Send, Trash2 } from 'lucide-react';
import { api, apiError } from '@/hooks/useApi';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/EmptyState';
import { PlatformBadge } from '@/components/PlatformBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { cn, imageUrl, PLATFORM_META } from '@/lib/utils';
import { RewriteBar } from '@/components/WizardIntelligence';

const PLATFORM_TABS = [
  { value: 'all', label: 'All' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Craigslist', label: 'Craigslist' },
  { value: 'eBay', label: 'eBay' },
  { value: 'OfferUp', label: 'OfferUp' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'TikTok', label: 'TikTok' },
];
const STATUSES = ['all', 'draft', 'published', 'scheduled', 'archived'];

export default function Listings() {
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformTab, setPlatformTab] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  function load() {
    api.get('/listings').then((res) => setListings(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  const filtered = useMemo(
    () =>
      listings.filter((l) => {
        const group = PLATFORM_META[l.platform]?.group || 'Other';
        if (platformTab !== 'all' && group !== platformTab) return false;
        if (status !== 'all' && l.status !== status) return false;
        if (search && !`${l.title || ''} ${l.product_name || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [listings, platformTab, status, search]
  );

  async function saveEdit() {
    setBusy(true);
    try {
      await api.put(`/listings/${editing.id}`, {
        title: editing.title, description: editing.description, price: editing.price, status: editing.status,
      });
      toast('success', 'Listing updated');
      setEditing(null);
      load();
    } catch (err) {
      toast('error', 'Update failed', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function duplicate(l: any) {
    try {
      await api.post('/listings', {
        product_id: l.product_id, platform: l.platform,
        title: `${l.title} (copy)`, description: l.description, price: l.price, status: 'draft',
      });
      toast('success', 'Listing duplicated');
      load();
    } catch (err) {
      toast('error', 'Duplicate failed', apiError(err));
    }
  }

  const [posting, setPosting] = useState<number | null>(null);

  // Real posting: eBay + Facebook Page via API; Craigslist assisted (copy + open form).
  async function post(l: any) {
    setPosting(l.id);
    try {
      const res = await api.post('/publish', { listing_id: l.id });
      if (res.data.mode === 'assisted') {
        await navigator.clipboard?.writeText(`${l.title || ''}\n\n${l.description || ''}`.trim());
        window.open(res.data.url, '_blank');
        toast('info', 'Ad copied to clipboard', res.data.message);
      } else {
        toast('success', 'Posted live 🎉', res.data.published_url);
        load();
      }
    } catch (err) {
      toast('error', 'Posting failed', apiError(err));
    } finally {
      setPosting(null);
    }
  }

  async function remove(l: any) {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/listings/${l.id}`);
      toast('success', 'Listing deleted');
      load();
    } catch (err) {
      toast('error', 'Delete failed', apiError(err));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={PLATFORM_TABS} value={platformTab} onValueChange={setPlatformTab} />
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text-muted" />
          <Input className="pl-9" placeholder="Search listings…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              'whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors',
              status === s
                ? 'border-sp-primary bg-sp-primary/15 text-sp-primary-light'
                : 'border-sp-active/60 text-sp-text-secondary hover:border-sp-primary/50'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={List}
          title={listings.length ? 'Nothing matches your filters' : 'No listings yet'}
          description={listings.length ? 'Try adjusting the platform or status filters.' : 'Run a product through the wizard to generate listings for every platform.'}
          action={<Link to="/wizard"><Button><Plus size={15} /> Open Wizard</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((l) => (
            <Card key={l.id} className="flex flex-col p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sp-input">
                  {l.product_images?.[0]
                    ? <img src={imageUrl(l.product_images[0])!} alt="" className="h-full w-full object-cover" />
                    : <List size={16} className="text-sp-text-muted" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <PlatformBadge platform={l.platform} />
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-sp-text">{l.title || '(untitled)'}</p>
                  <p className="mt-0.5 truncate text-xs text-sp-text-muted">{l.product_name}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-sp-active/30 pt-3">
                <span className="text-xs text-sp-text-muted">
                  {l.published_url ? (
                    <a href={l.published_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sp-success hover:underline">
                      <ExternalLink size={11} /> View live
                    </a>
                  ) : (
                    l.created_at ? format(new Date(l.created_at), 'MMM d, yyyy') : ''
                  )}
                </span>
                <div className="flex gap-1">
                  {!['dm_replies', 'follow_ups'].includes(l.platform) && (
                    <Button
                      variant="ghost" size="icon"
                      title={
                        ['craigslist', 'offerup', 'tiktok'].includes(l.platform)
                          ? 'Copy ad & open the platform’s post form'
                          : 'Post live now'
                      }
                      disabled={posting === l.id}
                      onClick={() => post(l)}
                    >
                      <Send size={14} className={posting === l.id ? 'animate-pulse text-sp-text-muted' : 'text-sp-primary-light'} />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditing({ ...l })}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicate(l)}><Copy size={14} /></Button>
                  <Button variant="ghost" size="icon" title="Delete" onClick={() => remove(l)}><Trash2 size={14} className="text-sp-danger" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)} title="Edit Listing" className="max-w-2xl">
        {editing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PlatformBadge platform={editing.platform} />
              <span className="text-xs text-sp-text-muted">{editing.product_name}</span>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="min-h-[220px]" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              <RewriteBar
                listingId={editing.id}
                onRewritten={(l) => setEditing({ ...editing, title: l.title, description: l.description })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" value={editing.price ?? ''} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  {['draft', 'published', 'scheduled', 'archived'].map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveEdit} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
