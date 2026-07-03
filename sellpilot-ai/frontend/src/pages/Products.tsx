import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid2x2, ImagePlus, LayoutList, MapPin, Package, Pencil, Plus, Search, Sparkles, Trash2, X,
} from 'lucide-react';
import { api, apiError } from '@/hooks/useApi';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORIES, CONDITIONS, cn, formatMoney, imageUrl } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  brand?: string;
  category?: string;
  condition?: string;
  quantity: number;
  location?: string;
  retail_price?: number;
  cost_price?: number;
  specs?: string;
  notes?: string;
  images: string[];
}

const EMPTY_FORM = {
  name: '', brand: '', category: '', condition: '', quantity: '1',
  location: '', retail_price: '', cost_price: '', specs: '', notes: '',
};

export default function Products() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [listingCounts, setListingCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function load() {
    Promise.all([api.get('/products'), api.get('/listings')])
      .then(([p, l]) => {
        setProducts(p.data);
        const counts: Record<number, number> = {};
        for (const listing of l.data) counts[listing.product_id] = (counts[listing.product_id] || 0) + 1;
        setListingCounts(counts);
      })
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          (!search || `${p.name} ${p.brand || ''}`.toLowerCase().includes(search.toLowerCase()))
      ),
    [products, search, category]
  );

  const withListings = products.filter((p) => listingCounts[p.id]).length;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFiles([]);
    setExistingImages([]);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand || '', category: p.category || '', condition: p.condition || '',
      quantity: String(p.quantity), location: p.location || '',
      retail_price: p.retail_price != null ? String(p.retail_price) : '',
      cost_price: p.cost_price != null ? String(p.cost_price) : '',
      specs: p.specs || '', notes: p.notes || '',
    });
    setFiles([]);
    setExistingImages(p.images);
    setModalOpen(true);
  }

  function addFiles(list: FileList | File[]) {
    const images = Array.from(list).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...images].slice(0, 10));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append('images', f));
      if (editing) {
        fd.append('existing_images', JSON.stringify(existingImages));
        await api.put(`/products/${editing.id}`, fd);
        toast('success', 'Product updated');
      } else {
        await api.post('/products', fd);
        toast('success', 'Product added', 'Ready to generate listings.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast('error', 'Could not save product', apiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(p: Product) {
    if (!confirm(`Delete "${p.name}" and all of its listings?`)) return;
    try {
      await api.delete(`/products/${p.id}`);
      toast('success', 'Product deleted');
      load();
    } catch (err) {
      toast('error', 'Delete failed', apiError(err));
    }
  }

  const set = (k: keyof typeof EMPTY_FORM) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Products', value: products.length },
          { label: 'With Listings', value: withListings },
          { label: 'Drafts', value: products.length - withListings },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-sp-text-muted">{s.label}</div>
              <div className="mt-1 font-heading text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text-muted" />
            <Input className="pl-9" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex rounded-lg border border-sp-active/60 bg-sp-input p-0.5">
            <button onClick={() => setView('grid')} className={cn('rounded-md p-2', view === 'grid' ? 'bg-sp-primary text-white' : 'text-sp-text-muted')}><Grid2x2 size={15} /></button>
            <button onClick={() => setView('list')} className={cn('rounded-md p-2', view === 'list' ? 'bg-sp-primary text-white' : 'text-sp-text-muted')}><LayoutList size={15} /></button>
          </div>
          <Button onClick={openCreate}><Plus size={15} /> Add Product</Button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                category === c
                  ? 'border-sp-primary bg-sp-primary/15 text-sp-primary-light'
                  : 'border-sp-active/60 text-sp-text-secondary hover:border-sp-primary/50'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={products.length ? 'No products match your filters' : 'No products yet'}
          description={products.length ? 'Try a different search or category.' : 'Add your first product and let AI write listings for every marketplace.'}
          action={<Button onClick={openCreate}><Plus size={15} /> Add Product</Button>}
        />
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Card key={p.id} className="group overflow-hidden">
              <div className="flex h-40 items-center justify-center bg-sp-input">
                {p.images[0] ? (
                  <img src={imageUrl(p.images[0])!} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <Package size={32} className="text-sp-text-muted" />
                )}
              </div>
              <CardContent className="space-y-3 p-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-medium text-sp-text">{p.name}</h3>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => openEdit(p)} className="text-sp-text-muted hover:text-sp-text"><Pencil size={14} /></button>
                      <button onClick={() => onDelete(p)} className="text-sp-text-muted hover:text-sp-danger"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {p.brand && <p className="text-xs text-sp-text-muted">{p.brand}</p>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.category && <Badge variant="muted">{p.category}</Badge>}
                  {p.condition && <Badge variant="info">{p.condition}</Badge>}
                </div>
                <div className="flex items-baseline gap-2 font-mono text-sm">
                  {p.retail_price != null && <span className="text-sp-text-muted line-through">{formatMoney(p.retail_price)}</span>}
                  <span className="font-semibold text-sp-success">{formatMoney(p.retail_price ? p.retail_price * 0.65 : null)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-sp-text-muted">
                  <span>Qty {p.quantity}</span>
                  {p.location && <span className="flex items-center gap-1"><MapPin size={11} /> {p.location}</span>}
                </div>
                <Link to={`/wizard/${p.id}`} className="block">
                  <Button size="sm" className="w-full"><Sparkles size={13} /> Generate Listings</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-b border-sp-active/30 p-4 last:border-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sp-input">
                {p.images[0] ? <img src={imageUrl(p.images[0])!} alt="" className="h-full w-full object-cover" /> : <Package size={20} className="text-sp-text-muted" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  {p.category && <Badge variant="muted">{p.category}</Badge>}
                  {p.condition && <Badge variant="info">{p.condition}</Badge>}
                </div>
                <div className="mt-0.5 text-xs text-sp-text-muted">
                  {p.brand ? `${p.brand} · ` : ''}Qty {p.quantity}{p.location ? ` · ${p.location}` : ''} · {listingCounts[p.id] || 0} listings
                </div>
              </div>
              <span className="hidden font-mono text-sm text-sp-success sm:block">{formatMoney(p.retail_price ? p.retail_price * 0.65 : null)}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil size={14} /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(p)}><Trash2 size={14} className="text-sp-danger" /></Button>
                <Link to={`/wizard/${p.id}`}><Button size="sm"><Sparkles size={13} /> Generate</Button></Link>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Add/Edit modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? 'Edit Product' : 'Add Product'}
        description="Details feed directly into AI listing generation."
        className="max-w-2xl"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Product name *</Label>
              <Input required value={form.name} onChange={set('name')} placeholder="e.g. Samsung 28 cu ft French Door Refrigerator" />
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={form.brand} onChange={set('brand')} placeholder="Samsung" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onChange={set('category')}>
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={form.condition} onChange={set('condition')}>
                <option value="">Select condition…</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input type="number" min={1} value={form.quantity} onChange={set('quantity')} />
            </div>
            <div>
              <Label>Retail price ($)</Label>
              <Input type="number" step="0.01" min={0} value={form.retail_price} onChange={set('retail_price')} placeholder="1299" />
            </div>
            <div>
              <Label>Cost price ($)</Label>
              <Input type="number" step="0.01" min={0} value={form.cost_price} onChange={set('cost_price')} placeholder="450" />
            </div>
            <div className="sm:col-span-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={set('location')} placeholder="Brooklyn, NY" />
            </div>
            <div className="sm:col-span-2">
              <Label>Specs</Label>
              <Textarea value={form.specs} onChange={set('specs')} placeholder="Dimensions, model number, power, materials…" />
            </div>
            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={set('notes')} placeholder="Anything the AI should know — minor scratch on left side, includes hardware, etc." />
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <Label>Photos</Label>
            <div
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                dragOver ? 'border-sp-primary bg-sp-primary/10' : 'border-sp-active/60 hover:border-sp-primary/50'
              )}
            >
              <ImagePlus size={22} className="mb-2 text-sp-text-muted" />
              <p className="text-sm text-sp-text-secondary">Drag & drop photos here, or click to browse</p>
              <p className="mt-1 text-xs text-sp-text-muted">Up to 10 images, 10 MB each</p>
              <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
            </div>
            {(existingImages.length > 0 || files.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {existingImages.map((img) => (
                  <div key={img} className="relative h-16 w-16 overflow-hidden rounded-lg border border-sp-active/60">
                    <img src={imageUrl(img)!} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setExistingImages((list) => list.filter((x) => x !== img))}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white"
                    ><X size={10} /></button>
                  </div>
                ))}
                {files.map((f, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-sp-active/60">
                    <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFiles((list) => list.filter((_, x) => x !== i))}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white"
                    ><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add product'}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
