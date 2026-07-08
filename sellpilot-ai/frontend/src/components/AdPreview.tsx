import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { api } from '@/hooks/useApi';
import { Dialog } from '@/components/ui/dialog';
import { PlatformBadge } from '@/components/PlatformBadge';
import { cn, formatMoney, imageUrl } from '@/lib/utils';

// Full-ad preview: how the listing will actually look to a buyer —
// every photo (originals + AI shots), title, price, location, full text.
export function AdPreview({
  open, onOpenChange, listing, productId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: { title?: string; description?: string; price?: number | string; platform?: string } | null;
  productId?: number | string;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open || !productId) return;
    setIdx(0);
    Promise.all([
      api.get(`/products/${productId}`),
      api.get(`/ai/analyses?product_id=${productId}`).catch(() => ({ data: {} as any })),
    ]).then(([p, a]) => {
      const own = (p.data.images || []).map((i: string) => imageUrl(i)!).filter(Boolean);
      const gen = ((a.data as any).assets?.assets || [])
        .filter((x: any) => !String(x.type || '').startsWith('ad_')) // raw ad backdrops belong to the banner studio
        .map((x: any) => x.url);
      setImages([...own, ...gen]);
      setLocation(p.data.location || '');
    }).catch(() => setImages([]));
  }, [open, productId]);

  const main = images[idx];

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Ad preview" description="Exactly what buyers will see" className="max-w-3xl">
      {listing && (
        <div className="space-y-4">
          {/* Gallery */}
          <div className="relative overflow-hidden rounded-xl bg-black/40">
            {main ? (
              <img src={main} alt="" className="mx-auto max-h-[380px] w-full object-contain" />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-sp-text-muted">No photos yet</div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setIdx((idx - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                ><ChevronLeft size={18} /></button>
                <button
                  onClick={() => setIdx((idx + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                ><ChevronRight size={18} /></button>
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-xs text-white">
                  {idx + 1}/{images.length}
                </span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={cn(
                    'h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2',
                    i === idx ? 'border-sp-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Listing body */}
          <div>
            <h2 className="font-heading text-xl font-bold leading-snug">{listing.title || '(untitled)'}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="font-mono text-2xl font-bold text-sp-success">{formatMoney(listing.price ?? null)}</span>
              {listing.platform && <PlatformBadge platform={listing.platform} />}
              {location && (
                <span className="flex items-center gap-1 text-sm text-sp-text-secondary">
                  <MapPin size={13} /> {location}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-sp-input/40 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-sp-text-secondary">
              {listing.description || 'No description yet.'}
            </p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
