import { useEffect, useMemo, useState } from 'react';
import {
  addDays, addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format,
  isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths, subWeeks,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, XCircle } from 'lucide-react';
import { api, apiError } from '@/hooks/useApi';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs } from '@/components/ui/tabs';
import { PlatformBadge } from '@/components/PlatformBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { cn, PLATFORM_META } from '@/lib/utils';

export default function CalendarPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  function load() {
    api.get('/schedule').then((res) => setPosts(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  const days = useMemo(() => {
    if (view === 'month') {
      return eachDayOfInterval({
        start: startOfWeek(startOfMonth(cursor)),
        end: endOfWeek(endOfMonth(cursor)),
      });
    }
    const start = startOfWeek(cursor);
    return eachDayOfInterval({ start, end: addDays(start, 6) });
  }, [cursor, view]);

  const postsOn = (day: Date) => posts.filter((p) => isSameDay(new Date(p.scheduled_date), day));
  const selectedPosts = selectedDay ? postsOn(selectedDay) : [];

  function move(dir: 1 | -1) {
    setCursor(view === 'month'
      ? dir === 1 ? addMonths(cursor, 1) : subMonths(cursor, 1)
      : dir === 1 ? addWeeks(cursor, 1) : subWeeks(cursor, 1));
  }

  async function cancelPost(p: any) {
    try {
      await api.put(`/schedule/${p.id}`, { status: 'cancelled' });
      toast('success', 'Post cancelled');
      load();
    } catch (err) {
      toast('error', 'Could not cancel', apiError(err));
    }
  }

  if (loading) return <Skeleton className="h-[480px]" />;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => move(-1)}><ChevronLeft size={16} /></Button>
            <CardTitle className="min-w-[160px] text-center">
              {view === 'month' ? format(cursor, 'MMMM yyyy') : `Week of ${format(startOfWeek(cursor), 'MMM d')}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => move(1)}><ChevronRight size={16} /></Button>
          </div>
          <Tabs
            tabs={[{ value: 'month', label: 'Month' }, { value: 'week', label: 'Week' }]}
            value={view}
            onValueChange={(v) => setView(v as 'month' | 'week')}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold uppercase text-sp-text-muted">{d}</div>
            ))}
            {days.map((day) => {
              const dayPosts = postsOn(day);
              const selected = selectedDay && isSameDay(day, selectedDay);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors',
                    view === 'month' ? 'min-h-[64px]' : 'min-h-[120px]',
                    selected ? 'border-sp-primary bg-sp-primary/10' : 'border-transparent hover:bg-sp-hover',
                    view === 'month' && !isSameMonth(day, cursor) && 'opacity-35'
                  )}
                >
                  <span className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                    isToday(day) ? 'bg-sp-primary font-semibold text-white' : 'text-sp-text-secondary'
                  )}>
                    {format(day, 'd')}
                  </span>
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {dayPosts.slice(0, 4).map((p) => (
                      <span
                        key={p.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: PLATFORM_META[p.platform]?.color || '#8B8FA3' }}
                      />
                    ))}
                    {dayPosts.length > 4 && <span className="text-[9px] text-sp-text-muted">+{dayPosts.length - 4}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day detail */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays size={16} className="text-sp-primary-light" />
            {selectedDay ? format(selectedDay, 'EEEE, MMM d') : 'Select a day'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDay ? (
            <p className="py-6 text-center text-sm text-sp-text-muted">Click a date to see its scheduled posts.</p>
          ) : selectedPosts.length === 0 ? (
            <p className="py-6 text-center text-sm text-sp-text-muted">Nothing scheduled this day.</p>
          ) : (
            <ul className="space-y-3">
              {selectedPosts.map((p) => (
                <li key={p.id} className="rounded-lg border border-sp-active/40 bg-sp-input/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <PlatformBadge platform={p.platform} />
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-2 text-sm font-medium">{p.product_name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-sp-text-muted">
                    <Clock size={11} /> {format(new Date(p.scheduled_date), 'h:mm a')}
                  </p>
                  {p.status === 'pending' && (
                    <Button variant="ghost" size="sm" className="mt-2 text-sp-danger" onClick={() => cancelPost(p)}>
                      <XCircle size={13} /> Cancel
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
