import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import {
  CalendarClock, Columns3, LayoutList, Percent, Plus, Users, UserPlus,
} from 'lucide-react';
import { api, apiError } from '@/hooks/useApi';
import { useToast } from '@/components/ui/toast';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Sheet } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/EmptyState';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

const STAGES = [
  { key: 'new', label: 'New', color: 'border-sp-info', dot: 'bg-sp-info' },
  { key: 'contacted', label: 'Contacted', color: 'border-sp-warning', dot: 'bg-sp-warning' },
  { key: 'qualified', label: 'Qualified', color: 'border-sp-primary', dot: 'bg-sp-primary' },
  { key: 'closed', label: 'Closed', color: 'border-sp-success', dot: 'bg-sp-success' },
];

const LEAD_PLATFORMS = ['Facebook', 'Craigslist', 'eBay', 'OfferUp', 'Instagram', 'TikTok'];

const FOLLOW_UP_TEMPLATES = [
  { label: 'Gentle check-in', text: 'Hi {name}! Following up on the {product} — happy to answer any questions or send more photos.' },
  { label: 'Price nudge', text: 'Hi {name}, still interested in the {product}? I have some flexibility on price for pickup this week.' },
  { label: 'Scarcity note', text: 'Hey {name} — a couple of other people are asking about the {product}. Wanted to give you first shot.' },
  { label: 'Final follow-up', text: 'Last note from me, {name} — if the timing is not right, no worries. If you want the {product}, I can hold it until the weekend.' },
];

const EMPTY_FORM = {
  name: '', email: '', phone: '', location: '', product_interest: '',
  platform: '', budget: '', notes: '', follow_up_date: '',
};

export default function Leads() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  function load() {
    api.get('/leads').then((res) => setLeads(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    const newThisWeek = leads.filter((l) => new Date(l.created_at).getTime() > weekAgo).length;
    const followUpsDue = leads.filter(
      (l) => l.follow_up_date && new Date(l.follow_up_date).getTime() <= Date.now() && l.status !== 'closed'
    ).length;
    const closed = leads.filter((l) => l.status === 'closed').length;
    return {
      total: leads.length,
      newThisWeek,
      followUpsDue,
      conversion: leads.length ? Math.round((closed / leads.length) * 100) : 0,
    };
  }, [leads]);

  async function createLead(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/leads', { ...form, follow_up_date: form.follow_up_date || null });
      toast('success', 'Lead added');
      setModalOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      toast('error', 'Could not add lead', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function updateLead(id: number, patch: Record<string, unknown>, message?: string) {
    try {
      const res = await api.put(`/leads/${id}`, patch);
      setLeads((list) => list.map((l) => (l.id === id ? res.data : l)));
      if (selected?.id === id) setSelected(res.data);
      if (message) toast('success', message);
    } catch (err) {
      toast('error', 'Update failed', apiError(err));
    }
  }

  const set = (k: keyof typeof EMPTY_FORM) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function LeadCard({ lead }: { lead: any }) {
    const overdue = lead.follow_up_date && new Date(lead.follow_up_date).getTime() <= Date.now() && lead.status !== 'closed';
    return (
      <button
        onClick={() => setSelected(lead)}
        className="w-full rounded-lg border border-sp-active/40 bg-sp-elevated p-3 text-left transition-colors hover:border-sp-primary/50"
      >
        <div className="flex items-center gap-2.5">
          <Avatar name={lead.name} className="h-8 w-8" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">{lead.name}</span>
              <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', overdue ? 'bg-sp-danger' : 'bg-sp-success')} />
            </div>
            {lead.product_interest && <p className="truncate text-xs text-sp-text-muted">{lead.product_interest}</p>}
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {lead.platform && <Badge variant="muted">{lead.platform}</Badge>}
          {lead.budget && <Badge variant="success">{lead.budget}</Badge>}
        </div>
        {lead.notes && <p className="mt-2 line-clamp-1 text-xs italic text-sp-text-muted">"{lead.notes}"</p>}
        {lead.follow_up_date && (
          <p className={cn('mt-2 flex items-center gap-1 text-xs', overdue ? 'text-sp-danger' : 'text-sp-text-muted')}>
            <CalendarClock size={11} /> Follow up {format(new Date(lead.follow_up_date), 'MMM d')}
          </p>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Leads" value={stats.total} icon={Users} />
        <MetricCard label="New This Week" value={stats.newThisWeek} icon={UserPlus} />
        <MetricCard label="Follow-ups Due" value={stats.followUpsDue} icon={CalendarClock} />
        <MetricCard label="Conversion Rate" value={`${stats.conversion}%`} icon={Percent} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-lg border border-sp-active/60 bg-sp-input p-0.5">
          <button onClick={() => setView('kanban')} className={cn('rounded-md p-2', view === 'kanban' ? 'bg-sp-primary text-white' : 'text-sp-text-muted')}><Columns3 size={15} /></button>
          <button onClick={() => setView('list')} className={cn('rounded-md p-2', view === 'list' ? 'bg-sp-primary text-white' : 'text-sp-text-muted')}><LayoutList size={15} /></button>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus size={15} /> Add Lead</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-72" />)}</div>
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No leads yet"
          description="When buyers message you, add them here to track every conversation to close."
          action={<Button onClick={() => setModalOpen(true)}><Plus size={15} /> Add your first lead</Button>}
        />
      ) : view === 'kanban' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((stage) => {
            const items = leads.filter((l) => l.status === stage.key);
            return (
              <div key={stage.key} className={cn('rounded-xl border-t-2 bg-sp-elevated/40 p-3', stage.color)}>
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className={cn('h-2 w-2 rounded-full', stage.dot)} />
                  <span className="text-sm font-semibold">{stage.label}</span>
                  <span className="ml-auto font-mono text-xs text-sp-text-muted">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
                  {items.length === 0 && <p className="py-6 text-center text-xs text-sp-text-muted">Empty</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          {leads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelected(lead)}
              className="flex w-full items-center gap-4 border-b border-sp-active/30 p-4 text-left last:border-0 hover:bg-sp-hover/40"
            >
              <Avatar name={lead.name} />
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{lead.name}</span>
                <p className="truncate text-xs text-sp-text-muted">
                  {lead.product_interest || '—'}{lead.budget ? ` · ${lead.budget}` : ''}
                </p>
              </div>
              {lead.platform && <Badge variant="muted" className="hidden sm:inline-flex">{lead.platform}</Badge>}
              <StatusBadge status={lead.status} />
            </button>
          ))}
        </Card>
      )}

      {/* Add lead modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen} title="Add Lead" className="max-w-xl">
        <form onSubmit={createLead} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Name *</Label>
            <Input required value={form.name} onChange={set('name')} placeholder="Mike R." />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <Label>Platform</Label>
            <Select value={form.platform} onChange={set('platform')}>
              <option value="">Select…</option>
              {LEAD_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </div>
          <div>
            <Label>Budget</Label>
            <Input value={form.budget} onChange={set('budget')} placeholder="$500-700" />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={form.location} onChange={set('location')} />
          </div>
          <div>
            <Label>Follow-up date</Label>
            <Input type="date" value={form.follow_up_date} onChange={set('follow_up_date')} />
          </div>
          <div className="sm:col-span-2">
            <Label>Product interest</Label>
            <Input value={form.product_interest} onChange={set('product_interest')} placeholder="Which listing are they asking about?" />
          </div>
          <div className="sm:col-span-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={set('notes')} placeholder="Last message, context, anything useful…" />
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Add lead'}</Button>
          </div>
        </form>
      </Dialog>

      {/* Lead detail drawer */}
      <Sheet
        open={Boolean(selected)}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected && (
          <div className="flex items-center gap-3">
            <Avatar name={selected.name} />
            <div>
              <div>{selected.name}</div>
              <div className="text-xs font-normal text-sp-text-muted">{selected.platform || 'Unknown platform'}</div>
            </div>
          </div>
        )}
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Email', selected.email], ['Phone', selected.phone],
                ['Location', selected.location], ['Budget', selected.budget],
                ['Interested in', selected.product_interest],
                ['Added', selected.created_at ? format(new Date(selected.created_at), 'MMM d, yyyy') : null],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="text-xs text-sp-text-muted">{label}</div>
                  <div className="text-sp-text">{value || '—'}</div>
                </div>
              ))}
            </div>

            <div>
              <Label>Status</Label>
              <Select value={selected.status} onChange={(e) => updateLead(selected.id, { status: e.target.value }, 'Status updated')}>
                {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </Select>
            </div>

            <div>
              <Label>Follow-up date</Label>
              <Input
                type="date"
                value={selected.follow_up_date ? selected.follow_up_date.slice(0, 10) : ''}
                onChange={(e) => updateLead(selected.id, { follow_up_date: e.target.value || null })}
              />
            </div>

            <div>
              <Label>Follow-up template</Label>
              <Select
                defaultValue=""
                onChange={(e) => {
                  const tpl = FOLLOW_UP_TEMPLATES.find((t) => t.label === e.target.value);
                  if (!tpl) return;
                  const text = tpl.text
                    .replaceAll('{name}', selected.name.split(' ')[0])
                    .replaceAll('{product}', selected.product_interest || 'item');
                  navigator.clipboard?.writeText(text);
                  toast('success', 'Template copied to clipboard', text.slice(0, 60) + '…');
                }}
              >
                <option value="">Pick a template to copy…</option>
                {FOLLOW_UP_TEMPLATES.map((t) => <option key={t.label} value={t.label}>{t.label}</option>)}
              </Select>
            </div>

            <div>
              <Label>Notes / conversation history</Label>
              <Textarea
                className="min-h-[140px]"
                defaultValue={selected.notes || ''}
                onBlur={(e) => e.target.value !== (selected.notes || '') && updateLead(selected.id, { notes: e.target.value }, 'Notes saved')}
              />
            </div>

            {selected.status !== 'closed' && (
              <Button
                className="w-full"
                variant="success"
                onClick={() => updateLead(selected.id, { status: 'closed', last_contact: new Date().toISOString() }, 'Lead marked as closed 🎉')}
              >
                Mark as Closed
              </Button>
            )}
            <Button
              className="w-full"
              variant="destructive"
              onClick={async () => {
                if (!confirm('Delete this lead?')) return;
                await api.delete(`/leads/${selected.id}`);
                setSelected(null);
                toast('success', 'Lead deleted');
                load();
              }}
            >
              Delete lead
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
