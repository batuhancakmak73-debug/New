import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  CalendarClock, List, Package, Percent, Plus, Sparkles, Users,
} from 'lucide-react';
import { api } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { MetricCard } from '@/components/MetricCard';
import { PlatformBadge } from '@/components/PlatformBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const PLATFORMS = ['Facebook', 'Craigslist', 'eBay', 'OfferUp', 'Instagram', 'TikTok'];
const PLATFORM_KEYS: Record<string, string> = {
  Facebook: 'facebook', Craigslist: 'craigslist', eBay: 'ebay',
  OfferUp: 'offerup', Instagram: 'instagram', TikTok: 'tiktok',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics'),
      api.get('/listings'),
      api.get('/schedule'),
      api.get('/credentials'),
    ])
      .then(([a, l, s, c]) => {
        setAnalytics(a.data);
        setListings(l.data);
        setSchedule(s.data);
        setCredentials(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const totals = analytics?.totals;
  const funnel = analytics?.lead_funnel || [];
  const recentListings = listings.slice(0, 4);
  const upcoming = schedule.filter((s: any) => s.status === 'pending').slice(0, 3);

  const activity = [
    ...listings.slice(0, 3).map((l: any) => ({
      when: l.created_at,
      text: `Listing "${(l.title || l.product_name || '').slice(0, 45)}" created`,
    })),
    ...schedule.slice(0, 2).map((s: any) => ({
      when: s.created_at,
      text: `${s.product_name} scheduled for ${format(new Date(s.scheduled_date), 'MMM d, h:mm a')}`,
    })),
  ]
    .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" /><Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-sp-primary/30 bg-gradient-to-r from-sp-primary/15 to-transparent p-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-heading text-xl font-bold">{greeting}, {firstName}! 👋</h2>
          <p className="mt-1 text-sm text-sp-text-secondary">
            {totals?.follow_ups_due
              ? `You have ${totals.follow_ups_due} follow-up${totals.follow_ups_due > 1 ? 's' : ''} due — keep those leads warm.`
              : 'Everything is on track. Ready to list something new?'}
          </p>
        </div>
        <Link to="/wizard">
          <Button><Sparkles size={15} /> Generate listings</Button>
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Products" value={totals?.products ?? 0} icon={Package} trend={12} trendLabel="vs last month" />
        <MetricCard label="Active Listings" value={totals?.active_listings ?? 0} icon={List} trend={8} trendLabel="vs last month" />
        <MetricCard label="Leads Generated" value={totals?.leads ?? 0} icon={Users} trend={totals?.new_leads_this_week ?? 0} trendLabel="new this week" />
        <MetricCard label="Conversion Rate" value={`${totals?.conversion_rate ?? 0}%`} icon={Percent} trend={3} trendLabel="vs last month" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Platform status */}
        <Card>
          <CardHeader><CardTitle>Platform Status</CardTitle></CardHeader>
          <CardContent className="space-y-2.5">
            {PLATFORMS.map((p) => {
              const connected = credentials.some((c: any) => c.platform === PLATFORM_KEYS[p] && c.is_connected);
              return (
                <div key={p} className="flex items-center justify-between rounded-lg bg-sp-input/60 px-3 py-2">
                  <span className="text-sm">{p}</span>
                  <span className={cn('flex items-center gap-2 text-xs', connected ? 'text-sp-success' : 'text-sp-text-muted')}>
                    <span className={cn('h-2 w-2 rounded-full', connected ? 'bg-sp-success' : 'bg-sp-text-muted')} />
                    {connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="py-8 text-center text-sm text-sp-text-muted">No activity yet — create your first product.</p>
            ) : (
              <ul className="space-y-3">
                {activity.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sp-primary" />
                    <div>
                      <p className="text-sp-text-secondary">{a.text}</p>
                      <p className="text-xs text-sp-text-muted">{a.when ? format(new Date(a.when), 'MMM d, h:mm a') : ''}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Leads pipeline mini */}
        <Card>
          <CardHeader><CardTitle>Leads Pipeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {['new', 'contacted', 'qualified', 'closed'].map((stage) => {
              const count = funnel.find((f: any) => f.stage === stage)?.count ?? 0;
              const max = Math.max(1, ...funnel.map((f: any) => f.count));
              const colors: Record<string, string> = {
                new: 'bg-sp-info', contacted: 'bg-sp-warning', qualified: 'bg-sp-primary', closed: 'bg-sp-success',
              };
              return (
                <div key={stage}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="capitalize text-sp-text-secondary">{stage}</span>
                    <span className="font-mono text-sp-text">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-sp-input">
                    <div className={cn('h-2 rounded-full', colors[stage])} style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
            <Link to="/leads" className="block pt-2">
              <Button variant="secondary" size="sm" className="w-full">Open Leads CRM</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent listings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Listings</CardTitle>
            <Link to="/listings" className="text-xs text-sp-primary-light hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentListings.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-sp-text-muted">No listings yet.</p>
                <Link to="/wizard"><Button size="sm" className="mt-3"><Plus size={14} /> Create your first listing</Button></Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {recentListings.map((l: any) => (
                  <div key={l.id} className="rounded-lg border border-sp-active/40 bg-sp-input/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <PlatformBadge platform={l.platform} />
                      <StatusBadge status={l.status} />
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm font-medium text-sp-text">{l.title || l.product_name}</p>
                    <p className="mt-1 text-xs text-sp-text-muted">{l.product_name}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming schedule */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming Schedule</CardTitle>
            <Link to="/calendar" className="text-xs text-sp-primary-light hover:underline">Calendar</Link>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="py-8 text-center text-sm text-sp-text-muted">Nothing scheduled yet.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((s: any) => (
                  <li key={s.id} className="flex items-center gap-3 rounded-lg bg-sp-input/60 p-3">
                    <CalendarClock size={16} className="shrink-0 text-sp-info" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-sp-text">{s.product_name}</p>
                      <p className="text-xs text-sp-text-muted">{format(new Date(s.scheduled_date), 'MMM d · h:mm a')}</p>
                    </div>
                    <PlatformBadge platform={s.platform} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
