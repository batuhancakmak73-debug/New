import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown, Copy, Download, ImageIcon, LineChart, Megaphone, Sparkles, Users,
} from 'lucide-react';
import { api, apiError } from '@/hooks/useApi';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatMoney, imageUrl } from '@/lib/utils';

function Panel({
  icon: Icon, title, subtitle, children, defaultOpen = false,
}: {
  icon: any; title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button className="w-full text-left" onClick={() => setOpen(!open)}>
        <CardHeader className="flex-row items-center justify-between py-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Icon size={15} className="text-sp-primary-light" /> {title}
            {subtitle && <span className="text-xs font-normal text-sp-text-muted">{subtitle}</span>}
          </CardTitle>
          <ChevronDown size={15} className={cn('text-sp-text-muted transition-transform', open && 'rotate-180')} />
        </CardHeader>
      </button>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

// ------------------------------------------------- Module 2: pricing intel

export function PricingIntelligencePanel({
  product, onUsePricing,
}: {
  product: any;
  onUsePricing: (ask: number, floor: number) => void;
}) {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await api.post('/ai/competitive-pricing', { productId: product.id });
      setData(res.data);
    } catch (err) {
      toast('error', 'Pricing analysis failed', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel icon={LineChart} title="Competitive Pricing Intelligence" subtitle={data?.source === 'ebay-live+claude' ? '· live eBay data' : ''}>
      {!data ? (
        <div className="space-y-2">
          <p className="text-xs text-sp-text-secondary">
            Analyze live market comps and get a recommended asking price, floor price and bulk structure.
            Connecting your eBay app in Settings unlocks real sold-market data.
          </p>
          <Button size="sm" disabled={busy} onClick={run}>
            <Sparkles size={13} className={busy ? 'animate-pulse' : ''} /> {busy ? 'Researching market…' : 'Run market analysis'}
          </Button>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Market range', `${formatMoney(data.market_low)} – ${formatMoney(data.market_high)}`],
              ['Market median', formatMoney(data.market_median)],
              ['Active listings', data.active_count ?? '—'],
              ['Demand', String(data.demand_level || '—').toUpperCase() + (data.demand_level === 'high' ? ' 🔥' : '')],
              ['Trend', data.price_trend || '—'],
              ['Est. days to sell', data.est_days_to_sell || '—'],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-lg bg-sp-input/60 p-2.5">
                <div className="text-[10px] uppercase tracking-wide text-sp-text-muted">{label}</div>
                <div className="mt-0.5 text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-sp-primary/40 bg-sp-primary/10 p-3">
            <div className="text-xs font-semibold text-sp-primary-light">💡 Recommendation</div>
            <div className="mt-2 flex justify-between"><span className="text-sp-text-secondary">Suggested asking</span><span className="font-mono font-semibold text-sp-success">{formatMoney(data.suggested_asking_price)}</span></div>
            <div className="flex justify-between"><span className="text-sp-text-secondary">Floor price</span><span className="font-mono text-sp-warning">{formatMoney(data.floor_price)}</span></div>
            <div className="flex justify-between"><span className="text-sp-text-secondary">Positioning</span><Badge variant={data.positioning === 'price_leader' ? 'success' : 'info'}>{data.positioning === 'price_leader' ? 'Price leader' : 'Value priced'}</Badge></div>
            {data.bulk_discounts && (
              <div className="mt-2 text-xs text-sp-text-muted">
                Bulk: {Object.entries(data.bulk_discounts).map(([k, v]) => `${k} units ${v}`).join(' · ')}
              </div>
            )}
            {data.reasoning && <p className="mt-2 text-xs italic text-sp-text-muted">{data.reasoning}</p>}
          </div>
          {data.competitor_snapshot?.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-semibold text-sp-text-secondary">📊 Competitor snapshot</div>
              <div className="flex flex-wrap gap-1.5">
                {data.competitor_snapshot.slice(0, 6).map((c: any, i: number) => (
                  <span key={i} title={c.title} className="rounded-full bg-sp-input px-2.5 py-1 font-mono text-xs text-sp-text-secondary">
                    {formatMoney(c.price)}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onUsePricing(data.suggested_asking_price, data.floor_price)}>✓ Use AI pricing</Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={run}>Refresh</Button>
          </div>
        </div>
      )}
    </Panel>
  );
}

// ------------------------------------------------ Module 3: group discovery

export function GroupDiscoveryPanel({ product }: { product: any }) {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await api.post('/ai/discover-groups', { productId: product.id });
      setData(res.data);
    } catch (err) {
      toast('error', 'Group discovery failed', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel icon={Users} title="Facebook Group Discovery">
      {!data ? (
        <div className="space-y-2">
          <p className="text-xs text-sp-text-secondary">Find the best groups for this product with posting times, style, and rules per group.</p>
          <Button size="sm" disabled={busy} onClick={run}>
            <Sparkles size={13} className={busy ? 'animate-pulse' : ''} /> {busy ? 'Finding groups…' : 'Discover groups'}
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {(data.groups || []).map((g: any, i: number) => (
            <div key={i} className="rounded-lg border border-sp-active/40 bg-sp-input/40 p-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <a
                  className="font-medium text-sp-text hover:text-sp-primary-light"
                  href={`https://www.facebook.com/search/groups/?q=${encodeURIComponent(g.group_name)}`}
                  target="_blank" rel="noreferrer"
                >
                  #{i + 1} {g.group_name}
                </a>
                <Badge variant={g.relevance_score >= 8 ? 'success' : 'info'}>⭐ {g.relevance_score}/10</Badge>
              </div>
              <div className="mt-1 text-sp-text-muted">{g.category} · ~{g.estimated_members} members</div>
              <div className="mt-1.5 space-y-0.5 text-sp-text-secondary">
                <div>🕐 {g.best_posting_time}</div>
                <div>✍️ {g.post_type}</div>
                {g.words_to_avoid && <div>⚠️ Avoid: {g.words_to_avoid}</div>}
                {g.engagement_tip && <div>💡 {g.engagement_tip}</div>}
              </div>
            </div>
          ))}
          {data.note && <p className="text-[11px] italic text-sp-text-muted">{data.note}</p>}
        </div>
      )}
    </Panel>
  );
}

// --------------------------------------------- Module 4: engagement engine

export function EngagementOptimizerPanel({ product }: { product: any }) {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await api.post('/ai/engagement-strategy', { productId: product.id });
      setData(res.data);
    } catch (err) {
      toast('error', 'Strategy generation failed', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
    toast('success', 'Copied to clipboard');
  }

  const allHashtags = data
    ? [...(data.hashtag_set?.high_volume || []), ...(data.hashtag_set?.niche || []), ...(data.hashtag_set?.local || [])]
    : [];

  return (
    <Panel icon={Megaphone} title="Engagement Optimizer">
      {!data ? (
        <div className="space-y-2">
          <p className="text-xs text-sp-text-secondary">A/B headlines, best posting times, hashtag sets and buyer-reply templates for this product.</p>
          <Button size="sm" disabled={busy} onClick={run}>
            <Sparkles size={13} className={busy ? 'animate-pulse' : ''} /> {busy ? 'Optimizing…' : 'Optimize for clicks'}
          </Button>
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          <div>
            <div className="mb-1 font-semibold text-sp-text-secondary">A/B Headlines</div>
            {['version_a', 'version_b', 'version_c', 'version_d'].map((k, i) => (
              data.headlines?.[k] && (
                <div key={k} className="mb-1 flex items-center justify-between gap-2 rounded bg-sp-input/60 px-2.5 py-1.5">
                  <span className="text-sp-text">{['A', 'B', 'C', 'D'][i]}: {data.headlines[k]}</span>
                  <button onClick={() => copy(data.headlines[k])} className="shrink-0 text-sp-text-muted hover:text-sp-text"><Copy size={12} /></button>
                </div>
              )
            ))}
            {data.headlines?.best_for && <p className="mt-1 italic text-sp-text-muted">💡 {data.headlines.best_for}</p>}
          </div>
          <div>
            <div className="mb-1 font-semibold text-sp-text-secondary">Optimal posting</div>
            <p className="text-sp-text-secondary">
              📅 {(data.optimal_posting?.best_days || []).join(', ')} · 🕐 {(data.optimal_posting?.best_times || []).join(', ')}
              <br />{data.optimal_posting?.frequency}
            </p>
          </div>
          {allHashtags.length > 0 && (
            <div>
              <div className="mb-1 flex items-center justify-between font-semibold text-sp-text-secondary">
                Hashtags <button onClick={() => copy(allHashtags.join(' '))} className="flex items-center gap-1 text-sp-primary-light hover:underline"><Copy size={11} /> copy all</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {allHashtags.map((h: string) => <span key={h} className="rounded-full bg-sp-input px-2 py-0.5 text-sp-info">{h}</span>)}
              </div>
            </div>
          )}
          {data.response_templates && (
            <div>
              <div className="mb-1 font-semibold text-sp-text-secondary">Reply templates</div>
              {Object.entries(data.response_templates).map(([k, v]) => (
                <div key={k} className="mb-1 flex items-start justify-between gap-2 rounded bg-sp-input/60 px-2.5 py-1.5">
                  <span className="text-sp-text-secondary"><span className="text-sp-text-muted">{k.replace(/_/g, ' ')}:</span> {String(v)}</span>
                  <button onClick={() => copy(String(v))} className="shrink-0 text-sp-text-muted hover:text-sp-text"><Copy size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

// --------------------------------- Module 5: banner studio (real photos)

const BANNERS = [
  { key: 'value', label: 'Value Banner', accent: '#5B6EF5' },
  { key: 'bulk', label: 'Bulk Deal', accent: '#34D399' },
  { key: 'contractor', label: 'Contractor / Pro', accent: '#FBBF24' },
  { key: 'fast', label: 'Fast Sale', accent: '#F87171' },
  { key: 'seasonal', label: 'Seasonal', accent: '#60A5FA' },
] as const;

const SCENE_LABELS: Record<string, string> = {
  hero: 'Studio Hero',
  lifestyle: 'Home Lifestyle',
  jobsite: 'Jobsite / Warehouse',
  detail: 'Detail Spotlight',
  seasonal: 'Seasonal Scene',
};

export function BannerStudioPanel({ product, pricing }: { product: any; pricing: any }) {
  const { toast } = useToast();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ask = pricing?.suggested_ask || pricing?.suggested_asking_price || Math.round((product?.retail_price || 100) * 0.65);
  const retail = product?.retail_price;

  async function generate() {
    const photo = product?.images?.[0] ? imageUrl(product.images[0]) : null;
    setBusy(true);
    try {
      const img = photo ? await loadImage(photo) : null;
      const out: Record<string, string> = {};
      for (const banner of BANNERS) {
        out[banner.key] = drawBanner(canvasRef.current!, img, banner, {
          title: product.name,
          price: `$${ask}`,
          retail: retail ? `Retail ~$${retail}` : '',
          location: product.location || '',
          quantity: product.quantity || 1,
        });
      }
      setUrls(out);
    } catch (err) {
      toast('error', 'Banner generation failed', err instanceof Error ? err.message : '');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel icon={ImageIcon} title="Marketing Banners" subtitle="· from your real photos">
      <canvas ref={canvasRef} width={1200} height={630} className="hidden" />
      {Object.keys(urls).length === 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-sp-text-secondary">
            Generate 5 ready-to-post banners (1200×630) composed from your actual product photo — value,
            bulk, contractor, fast-sale and seasonal versions.
          </p>
          <Button size="sm" disabled={busy} onClick={generate}>
            <Sparkles size={13} className={busy ? 'animate-pulse' : ''} /> {busy ? 'Rendering…' : 'Generate banners'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {BANNERS.map((b) => (
            <div key={b.key} className="overflow-hidden rounded-lg border border-sp-active/40">
              <img src={urls[b.key]} alt={b.label} className="w-full" />
              <div className="flex items-center justify-between p-2">
                <span className="text-[11px] text-sp-text-secondary">{b.label}</span>
                <a href={urls[b.key]} download={`${b.key}-banner.png`} className="text-sp-primary-light hover:text-sp-primary">
                  <Download size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      <EnvironmentShots product={product} />
    </Panel>
  );
}

// AI environment shots: the real product photo edited into 5 new scenes.
function EnvironmentShots({ product }: { product: any }) {
  const { toast } = useToast();
  const [assets, setAssets] = useState<{ type: string; url: string }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!product?.id) return;
    api.get(`/ai/analyses?product_id=${product.id}`)
      .then((res) => res.data.assets?.assets && setAssets(res.data.assets.assets))
      .catch(() => {});
  }, [product?.id]);

  async function generate() {
    setBusy(true);
    try {
      const res = await api.post('/ai/generate-assets', { productId: product.id });
      setAssets(res.data.assets);
      toast('success', `${res.data.assets.length} environment shots ready`);
    } catch (err) {
      toast('error', 'Shot generation failed', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-sp-active/30 pt-4">
      <div className="mb-2 text-xs font-semibold text-sp-text-secondary">AI environment shots</div>
      {assets.length === 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-sp-text-muted">
            Places your real product photo into 5 new scenes — studio, home, jobsite, detail spotlight
            and seasonal. Uses OpenAI image editing (needs the OPENAI_API_KEY secret; ~60s, ~$0.20 per set).
          </p>
          <Button size="sm" variant="secondary" disabled={busy} onClick={generate}>
            <Sparkles size={13} className={busy ? 'animate-pulse' : ''} /> {busy ? 'Generating (up to a minute)…' : 'Generate 5 environment shots'}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {assets.map((a) => (
              <div key={a.type} className="overflow-hidden rounded-lg border border-sp-active/40">
                <img src={a.url} alt={a.type} className="w-full" />
                <div className="flex items-center justify-between p-2">
                  <span className="text-[11px] text-sp-text-secondary">{SCENE_LABELS[a.type] || a.type}</span>
                  <a href={a.url} download target="_blank" rel="noreferrer" className="text-sp-primary-light hover:text-sp-primary">
                    <Download size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] italic text-sp-text-muted">
              AI-composed scenes from your real photo — keep at least one untouched photo in every listing.
            </p>
            <Button size="sm" variant="ghost" disabled={busy} onClick={generate}>Regenerate</Button>
          </div>
        </>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load product photo'));
    img.src = src;
  });
}

function drawBanner(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  banner: (typeof BANNERS)[number],
  text: { title: string; price: string; retail: string; location: string; quantity: number }
): string {
  const ctx = canvas.getContext('2d')!;
  const W = 1200, H = 630;
  ctx.clearRect(0, 0, W, H);

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0A0B14');
  grad.addColorStop(1, '#1A1B2A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Product photo on the right half, cover-fit
  if (img) {
    const targetW = W * 0.48, targetH = H;
    const scale = Math.max(targetW / img.width, targetH / img.height);
    const sw = targetW / scale, sh = targetH / scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(W - targetW, 0, targetW, targetH);
    ctx.clip();
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, W - targetW, 0, targetW, targetH);
    ctx.restore();
    const fade = ctx.createLinearGradient(W - targetW, 0, W - targetW + 120, 0);
    fade.addColorStop(0, 'rgba(10,11,20,1)');
    fade.addColorStop(1, 'rgba(10,11,20,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(W - targetW, 0, 120, H);
  }

  // Accent bar + tag line
  ctx.fillStyle = banner.accent;
  ctx.fillRect(0, 0, 10, H);
  const tags: Record<string, string> = {
    value: 'Warehouse direct pricing',
    bulk: `Bulk pricing · ${text.quantity}+ available`,
    contractor: 'Contractor pricing available',
    fast: 'Priced to move this week',
    seasonal: 'Seasonal special · limited stock',
  };
  ctx.font = '600 26px Inter, sans-serif';
  ctx.fillStyle = banner.accent;
  ctx.fillText(tags[banner.key].toUpperCase(), 50, 90);

  // Title (wrapped, max 3 lines)
  ctx.fillStyle = '#F0F1F5';
  ctx.font = '700 52px "Space Grotesk", sans-serif';
  const words = text.title.split(' ');
  let line = '', y = 170;
  const maxWidth = img ? W * 0.45 : W - 100;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, 50, y);
      line = word;
      y += 62;
      if (y > 300) { line += '…'; break; }
    } else line = test;
  }
  ctx.fillText(line, 50, y);

  // Price block
  if (text.retail) {
    ctx.font = '400 30px Inter, sans-serif';
    ctx.fillStyle = '#8B8FA3';
    ctx.fillText(text.retail, 50, y + 90);
    const w = ctx.measureText(text.retail).width;
    ctx.strokeStyle = '#8B8FA3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, y + 80);
    ctx.lineTo(50 + w, y + 80);
    ctx.stroke();
  }
  ctx.font = '700 74px "Space Grotesk", sans-serif';
  ctx.fillStyle = banner.accent;
  ctx.fillText(text.price, 50, y + 175);

  // Footer
  ctx.font = '500 24px Inter, sans-serif';
  ctx.fillStyle = '#8B8FA3';
  const footer = [text.location, 'Message for details'].filter(Boolean).join(' · ');
  ctx.fillText(footer, 50, H - 50);

  return canvas.toDataURL('image/png');
}
