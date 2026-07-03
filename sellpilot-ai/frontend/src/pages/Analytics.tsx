import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { BarChart3 } from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { api } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { cn, formatMoney } from '@/lib/utils';

const RANGE_TABS = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

const DONUT_COLORS = ['#5B6EF5', '#34D399', '#FBBF24', '#60A5FA', '#F87171', '#E1306C', '#8B8FA3'];
const FUNNEL_COLORS: Record<string, string> = {
  new: '#60A5FA', contacted: '#FBBF24', qualified: '#5B6EF5', closed: '#34D399',
};

const tooltipStyle = {
  backgroundColor: '#12131F',
  border: '1px solid #252641',
  borderRadius: 8,
  color: '#F0F1F5',
  fontSize: 12,
};

type SortKey = 'posts' | 'views' | 'leads' | 'sales' | 'revenue' | 'conversion_rate';

export default function Analytics() {
  const [days, setDays] = useState('30');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/analytics?days=${days}`).then((res) => setData(res.data)).finally(() => setLoading(false));
  }, [days]);

  const performance = useMemo(() => {
    const rows = [...(data?.platform_performance || [])];
    rows.sort((a, b) => (sortDesc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
    return rows;
  }, [data, sortKey, sortDesc]);

  function sortBy(key: SortKey) {
    if (key === sortKey) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(true); }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const revenue = data?.revenue_over_time || [];
  const donut = performance.filter((p: any) => p.revenue > 0 || p.leads > 0);
  const funnel = data?.lead_funnel || [];
  const top = data?.top_products || [];
  const hasAnything = (data?.totals?.total_listings || 0) > 0 || (data?.totals?.leads || 0) > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Tabs tabs={RANGE_TABS} value={days} onValueChange={setDays} />
        <span className="text-xs text-sp-text-muted">Updated {format(new Date(), 'MMM d, h:mm a')}</span>
      </div>

      {!hasAnything ? (
        <EmptyState
          icon={BarChart3}
          title="No data to chart yet"
          description="Publish a few listings and log some leads — your revenue, funnels and platform breakdowns will appear here."
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Revenue over time */}
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5B6EF5" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#5B6EF5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#252641" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#5C5F73', fontSize: 11 }}
                      tickFormatter={(d) => format(new Date(d), 'MMM d')}
                      interval="preserveStartEnd"
                      minTickGap={40}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis tick={{ fill: '#5C5F73', fontSize: 11 }} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} width={55} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelFormatter={(d) => format(new Date(d), 'MMM d, yyyy')}
                      formatter={(v: number) => [formatMoney(v), 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#5B6EF5" strokeWidth={2} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform breakdown donut */}
            <Card>
              <CardHeader><CardTitle>Platform Breakdown</CardTitle></CardHeader>
              <CardContent className="h-72">
                {donut.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-sm text-sp-text-muted">No platform activity yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donut} dataKey="leads" nameKey="platform" innerRadius="55%" outerRadius="80%" paddingAngle={3}>
                        {donut.map((_: any, i: number) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`${v} leads`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {donut.map((p: any, i: number) => (
                    <span key={p.platform} className="flex items-center gap-1.5 text-xs text-sp-text-secondary">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                      {p.platform}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform performance table */}
          <Card>
            <CardHeader><CardTitle>Platform Performance</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <THead>
                  <TR>
                    <TH>Platform</TH>
                    {(['posts', 'views', 'leads', 'sales', 'revenue', 'conversion_rate'] as SortKey[]).map((key) => (
                      <TH key={key}>
                        <button onClick={() => sortBy(key)} className={cn('uppercase hover:text-sp-text', sortKey === key && 'text-sp-primary-light')}>
                          {key === 'conversion_rate' ? 'Conv. Rate' : key} {sortKey === key ? (sortDesc ? '↓' : '↑') : ''}
                        </button>
                      </TH>
                    ))}
                  </TR>
                </THead>
                <TBody>
                  {performance.map((p: any) => (
                    <TR key={p.platform}>
                      <TD className="font-medium text-sp-text">{p.platform}</TD>
                      <TD className="font-mono">{p.posts}</TD>
                      <TD className="font-mono">{p.views.toLocaleString()}</TD>
                      <TD className="font-mono">{p.leads}</TD>
                      <TD className="font-mono">{p.sales}</TD>
                      <TD className="font-mono text-sp-success">{formatMoney(p.revenue)}</TD>
                      <TD className="font-mono">{p.conversion_rate}%</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Lead funnel */}
            <Card>
              <CardHeader><CardTitle>Lead Conversion Funnel</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnel} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid stroke="#252641" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#5C5F73', fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="stage" tick={{ fill: '#8B8FA3', fontSize: 12 }} width={80} axisLine={false} tickLine={false}
                      tickFormatter={(s: string) => s.charAt(0).toUpperCase() + s.slice(1)} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Leads']} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                      {funnel.map((f: any) => <Cell key={f.stage} fill={FUNNEL_COLORS[f.stage] || '#5B6EF5'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top products */}
            <Card>
              <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
              <CardContent className="h-64">
                {top.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-sm text-sp-text-muted">No products yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top}>
                      <CartesianGrid stroke="#252641" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#5C5F73', fontSize: 10 }} tickFormatter={(n: string) => (n.length > 12 ? `${n.slice(0, 12)}…` : n)} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#5C5F73', fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} width={30} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="listings" fill="#5B6EF5" radius={[6, 6, 0, 0]} barSize={28} name="Listings" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
