import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ImageIcon, Lightbulb, MapPin,
  Package, Rocket, Sparkles, Tag,
} from 'lucide-react';
import { api, apiError } from '@/hooks/useApi';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { PlatformBadge } from '@/components/PlatformBadge';
import {
  BannerStudioPanel, EngagementOptimizerPanel, GroupDiscoveryPanel, PricingIntelligencePanel, RewriteBar,
} from '@/components/WizardIntelligence';
import { cn, formatMoney, imageUrl, PLATFORM_META, PUBLISHABLE_PLATFORMS } from '@/lib/utils';

const STEPS = ['Product Details', 'AI Generation', 'Review & Edit', 'Schedule & Publish'];

const GEN_MESSAGES = [
  'Analyzing product…',
  'Generating Facebook Marketplace listing…',
  'Creating Facebook Group posts…',
  'Writing Craigslist ad…',
  'Crafting eBay listing…',
  'Building OfferUp listing…',
  'Writing Instagram caption…',
  'Scripting TikTok video…',
  'Preparing DM reply templates…',
  'Calculating pricing strategy…',
];

const ALL_PLATFORMS = Object.keys(PLATFORM_META);

export default function Wizard() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>(productId || '');
  const [product, setProduct] = useState<any>(null);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [genDone, setGenDone] = useState(false);
  const [genMessage, setGenMessage] = useState(GEN_MESSAGES[0]);
  const [progress, setProgress] = useState(0);
  const [listings, setListings] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [bannerIdeas, setBannerIdeas] = useState<string[]>([]);
  const [imageIdeas, setImageIdeas] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('facebook_marketplace');

  // Publish state
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(PUBLISHABLE_PLATFORMS));
  const [publishNow, setPublishNow] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [publishing, setPublishing] = useState(false);
  const genTimers = useRef<number[]>([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  useEffect(() => {
    if (!selectedId) { setProduct(null); return; }
    api.get(`/products/${selectedId}`).then((res) => setProduct(res.data)).catch(() => setProduct(null));
  }, [selectedId]);

  useEffect(() => () => genTimers.current.forEach(clearTimeout), []);

  const activeListing = useMemo(() => listings.find((l) => l.platform === activeTab), [listings, activeTab]);

  function startGeneration() {
    setStep(1);
    setGenerating(true);
    setGenDone(false);
    setProgress(4);
    GEN_MESSAGES.forEach((msg, i) => {
      genTimers.current.push(
        window.setTimeout(() => {
          setGenMessage(msg);
          setProgress(Math.min(92, Math.round(((i + 1) / GEN_MESSAGES.length) * 90)));
        }, i * 420)
      );
    });

    const started = Date.now();
    api
      .post('/ai/generate', { productId: Number(selectedId) })
      .then((res) => {
        const remaining = Math.max(0, 4200 - (Date.now() - started));
        genTimers.current.push(
          window.setTimeout(() => {
            setListings(res.data.listings);
            setPricing(res.data.pricing);
            setBannerIdeas(res.data.banner_ideas);
            setImageIdeas(res.data.image_ideas);
            setProgress(100);
            setGenerating(false);
            setGenDone(true);
          }, remaining)
        );
      })
      .catch((err) => {
        genTimers.current.forEach(clearTimeout);
        setGenerating(false);
        setStep(0);
        toast('error', 'Generation failed', apiError(err));
      });
  }

  function updateListing(field: string, value: string | number) {
    setListings((list) => list.map((l) => (l.platform === activeTab ? { ...l, [field]: value } : l)));
  }

  async function saveEdits() {
    await Promise.all(
      listings.map((l) => api.put(`/listings/${l.id}`, { title: l.title, description: l.description, price: l.price }))
    );
  }

  async function publish() {
    setPublishing(true);
    try {
      await saveEdits();
      const targets = listings.filter((l) => selectedPlatforms.has(l.platform));
      if (publishNow) {
        await Promise.all(targets.map((l) => api.put(`/listings/${l.id}`, { status: 'published' })));
        toast('success', `Published to ${targets.length} platforms 🎉`, 'Your listings are live.');
      } else {
        if (!scheduleDate) {
          toast('error', 'Pick a date', 'Choose when the posts should go live.');
          setPublishing(false);
          return;
        }
        const when = `${scheduleDate}T${scheduleTime || '10:00'}:00`;
        await Promise.all(
          targets.map((l) => api.post('/schedule', { listing_id: l.id, platform: l.platform, scheduled_date: when }))
        );
        toast('success', `Scheduled ${targets.length} posts`, `Going live ${format(new Date(when), 'MMM d, h:mm a')}.`);
      }
      navigate('/listings');
    } catch (err) {
      toast('error', 'Publish failed', apiError(err));
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 overflow-x-auto scrollbar-none">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center px-2 text-center sm:px-4">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  i < step
                    ? 'border-sp-success bg-sp-success/15 text-sp-success'
                    : i === step
                      ? 'border-sp-primary bg-sp-primary text-white'
                      : 'border-sp-active text-sp-text-muted'
                )}
              >
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span className={cn('mt-1.5 whitespace-nowrap text-xs', i === step ? 'text-sp-text' : 'text-sp-text-muted')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={cn('h-0.5 w-8 sm:w-16', i < step ? 'bg-sp-success' : 'bg-sp-active')} />}
          </div>
        ))}
      </div>

      {/* STEP 1: Product details */}
      {step === 0 && (
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Select a product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Product *</Label>
              <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">Choose a product…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              {products.length === 0 && (
                <p className="mt-2 text-sm text-sp-text-secondary">
                  No products yet — <Link to="/products" className="text-sp-primary-light hover:underline">add one first</Link>.
                </p>
              )}
            </div>

            {product && (
              <div className="rounded-xl border border-sp-active/50 bg-sp-input/40 p-5">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sp-input">
                    {product.images?.[0]
                      ? <img src={imageUrl(product.images[0])!} alt="" className="h-full w-full object-cover" />
                      : <Package size={28} className="text-sp-text-muted" />}
                  </div>
                  <div className="flex-1 space-y-2 text-sm">
                    <h3 className="font-heading text-lg font-semibold">{product.name}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sp-text-secondary">
                      <span>Brand: <span className="text-sp-text">{product.brand || '—'}</span></span>
                      <span>Category: <span className="text-sp-text">{product.category || '—'}</span></span>
                      <span>Condition: <span className="text-sp-text">{product.condition || '—'}</span></span>
                      <span>Quantity: <span className="text-sp-text">{product.quantity}</span></span>
                      <span>Retail: <span className="text-sp-text">{formatMoney(product.retail_price)}</span></span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {product.location || '—'}</span>
                    </div>
                    {product.specs && <p className="text-xs text-sp-text-muted">Specs: {product.specs}</p>}
                    {product.notes && <p className="text-xs text-sp-text-muted">Notes: {product.notes}</p>}
                  </div>
                </div>
                {product.images?.length > 1 && (
                  <div className="mt-4 flex gap-2">
                    {product.images.slice(1, 6).map((img: string) => (
                      <img key={img} src={imageUrl(img)!} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button disabled={!product} onClick={startGeneration}>
                Next: AI Generate <ArrowRight size={15} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: AI Generation */}
      {step === 1 && (
        <div className="mx-auto max-w-2xl">
          <div className="ai-gradient-border rounded-2xl p-[2px]">
            <div className="rounded-2xl bg-sp-elevated p-8 text-center">
              {!genDone ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
                    className="mx-auto mb-6 inline-flex rounded-full bg-sp-primary/15 p-4 text-sp-primary-light"
                  >
                    <Sparkles size={30} />
                  </motion.div>
                  <h2 className="font-heading text-xl font-bold">AI is writing your listings</h2>
                  <p className="mt-2 min-h-[20px] text-sm text-sp-text-secondary">{genMessage}</p>
                  <div className="mx-auto mt-6 h-2 max-w-sm overflow-hidden rounded-full bg-sp-input">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-sp-primary to-sp-success"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="mt-3 font-mono text-xs text-sp-text-muted">{progress}%</p>
                </>
              ) : (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-6 inline-flex rounded-full bg-sp-success/15 p-4 text-sp-success">
                    <CheckCircle2 size={30} />
                  </motion.div>
                  <h2 className="font-heading text-xl font-bold text-sp-success">Generation Complete!</h2>
                  <p className="mt-2 text-sm text-sp-text-secondary">12 platform variations ready for review.</p>
                  <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-2 text-left sm:grid-cols-3">
                    {ALL_PLATFORMS.map((p, i) => (
                      <motion.div
                        key={p}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-1.5 text-xs text-sp-text-secondary"
                      >
                        <Check size={12} className="shrink-0 text-sp-success" /> {PLATFORM_META[p].label}
                      </motion.div>
                    ))}
                  </div>
                  <Button className="mt-8" onClick={() => setStep(2)}>
                    Next: Review <ArrowRight size={15} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Edit */}
      {step === 2 && (
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          {/* Left panel */}
          <div className="space-y-4">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-sp-input">
                  {product?.images?.[0]
                    ? <img src={imageUrl(product.images[0])!} alt="" className="h-full w-full object-cover" />
                    : <Package size={26} className="text-sp-text-muted" />}
                </div>
                <h3 className="font-heading font-semibold">{product?.name}</h3>
                {product?.specs && <p className="text-xs text-sp-text-muted">{product.specs}</p>}
                {pricing && (
                  <div className="space-y-1.5 rounded-lg bg-sp-input/60 p-3 text-sm">
                    <div className="flex justify-between"><span className="text-sp-text-secondary">Suggested Ask</span><span className="font-mono font-semibold text-sp-success">{formatMoney(pricing.suggested_ask)}</span></div>
                    <div className="flex justify-between"><span className="text-sp-text-secondary">Floor Price</span><span className="font-mono text-sp-warning">{formatMoney(pricing.floor_price)}</span></div>
                    <div className="pt-1 text-xs text-sp-text-muted">{pricing.bulk_discount}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1"><CardTitle className="flex items-center gap-2 text-sm"><Tag size={14} className="text-sp-primary-light" /> Banner Text Ideas</CardTitle></CardHeader>
              <CardContent className="pt-1">
                <ul className="space-y-1.5 text-xs text-sp-text-secondary">
                  {bannerIdeas.map((b, i) => <li key={i} className="rounded bg-sp-input/60 px-2.5 py-1.5">{b}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1"><CardTitle className="flex items-center gap-2 text-sm"><ImageIcon size={14} className="text-sp-primary-light" /> Image Ideas</CardTitle></CardHeader>
              <CardContent className="pt-1">
                <ul className="space-y-1.5 text-xs text-sp-text-secondary">
                  {imageIdeas.map((b, i) => (
                    <li key={i} className="flex gap-2 rounded bg-sp-input/60 px-2.5 py-1.5">
                      <Lightbulb size={12} className="mt-0.5 shrink-0 text-sp-warning" /> {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Advanced intelligence modules */}
            <PricingIntelligencePanel
              product={product}
              onUsePricing={(ask, floor) => {
                setPricing((p: any) => ({ ...(p || {}), suggested_ask: ask, floor_price: floor }));
                setListings((list) => list.map((l) => ({ ...l, price: ask })));
              }}
            />
            <GroupDiscoveryPanel product={product} />
            <EngagementOptimizerPanel product={product} />
            <BannerStudioPanel product={product} pricing={pricing} />
          </div>

          {/* Right panel */}
          <Card className="min-w-0">
            <CardContent className="p-4">
              <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none">
                {ALL_PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActiveTab(p)}
                    className={cn(
                      'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      activeTab === p
                        ? 'border-sp-primary bg-sp-primary/15 text-sp-primary-light'
                        : 'border-sp-active/60 text-sp-text-secondary hover:border-sp-primary/40'
                    )}
                  >
                    {PLATFORM_META[p].label}
                  </button>
                ))}
              </div>

              {activeListing && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Title</Label>
                      <span className={cn('font-mono text-[11px]', (activeListing.title?.length || 0) > 150 ? 'text-sp-danger' : 'text-sp-text-muted')}>
                        {activeListing.title?.length || 0}/150
                      </span>
                    </div>
                    <Input value={activeListing.title || ''} onChange={(e) => updateListing('title', e.target.value)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      className="min-h-[300px] font-body leading-relaxed"
                      value={activeListing.description || ''}
                      onChange={(e) => updateListing('description', e.target.value)}
                    />
                    <RewriteBar
                      listingId={activeListing.id}
                      onRewritten={(l) =>
                        setListings((list) =>
                          list.map((x) => (x.id === l.id ? { ...x, title: l.title, description: l.description } : x))
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={activeListing.price ?? ''}
                        onChange={(e) => updateListing('price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={product?.location || ''} readOnly className="opacity-70" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</Button>
                <Button onClick={async () => { await saveEdits(); setStep(3); }}>Next: Schedule <ArrowRight size={15} /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STEP 4: Schedule & Publish */}
      {step === 3 && (
        <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader><CardTitle>Choose platforms</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2 sm:grid-cols-2">
                {PUBLISHABLE_PLATFORMS.map((p) => {
                  const checked = selectedPlatforms.has(p);
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        const next = new Set(selectedPlatforms);
                        checked ? next.delete(p) : next.add(p);
                        setSelectedPlatforms(next);
                      }}
                      className={cn(
                        'flex items-center justify-between rounded-lg border p-3 text-left transition-colors',
                        checked ? 'border-sp-primary bg-sp-primary/10' : 'border-sp-active/60 hover:border-sp-primary/40'
                      )}
                    >
                      <PlatformBadge platform={p} />
                      <span className={cn(
                        'flex h-5 w-5 items-center justify-center rounded border',
                        checked ? 'border-sp-primary bg-sp-primary text-white' : 'border-sp-active'
                      )}>
                        {checked && <Check size={12} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-sp-input/60 p-4">
                <div>
                  <p className="text-sm font-medium">{publishNow ? 'Publish Now' : 'Schedule for Later'}</p>
                  <p className="text-xs text-sp-text-muted">{publishNow ? 'Listings go live immediately.' : 'Pick a date and time below.'}</p>
                </div>
                <Switch checked={!publishNow} onCheckedChange={(v) => setPublishNow(!v)} />
              </div>

              {!publishNow && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Date *</Label>
                    <Input type="date" min={format(new Date(), 'yyyy-MM-dd')} value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}><ArrowLeft size={15} /> Back</Button>
                <Button disabled={publishing || selectedPlatforms.size === 0} onClick={publish}>
                  <Rocket size={15} /> {publishing ? 'Publishing…' : publishNow ? 'Publish Listings' : 'Schedule Listings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-sp-text-secondary">Product</span><span className="max-w-[150px] truncate text-right">{product?.name}</span></div>
              <div className="flex justify-between"><span className="text-sp-text-secondary">Platforms</span><span className="font-mono">{selectedPlatforms.size}</span></div>
              <div className="flex justify-between">
                <span className="text-sp-text-secondary">Goes live</span>
                <span className="text-right">
                  {publishNow ? 'Immediately' : scheduleDate ? format(new Date(`${scheduleDate}T${scheduleTime || '10:00'}`), 'MMM d · h:mm a') : 'Pick a date'}
                </span>
              </div>
              {pricing && (
                <div className="flex justify-between"><span className="text-sp-text-secondary">Asking price</span><span className="font-mono text-sp-success">{formatMoney(pricing.suggested_ask)}</span></div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
