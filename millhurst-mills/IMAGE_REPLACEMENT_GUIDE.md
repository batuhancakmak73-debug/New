# Image Replacement Guide
## Millhurst Mills Website

When photos are ready (from Canon DSLR review), replace placeholders with real images.

### Steps

1. Convert your selected Canon DSLR photos to WebP:
```bash
# Install cwebp
sudo apt install webp  # Ubuntu/Debian

# Convert hero images (2400px wide)
for f in *.JPG; do
  cwebp -q 82 -resize 2400 0 "$f" -o "public/images/hero-${f%.JPG}.webp"
done

# Convert category images (800px wide)
for f in *.JPG; do
  cwebp -q 82 -resize 800 0 "$f" -o "public/images/cat-${f%.JPG}.webp"
done
```

2. Place converted images in `/public/images/`

3. Update `app/page.tsx` — replace the gradient hero background with:
```tsx
import Image from "next/image";

// Inside Hero section, replace the gradient div with:
<Image
  src="/images/hero-storefront.webp"
  alt="Millhurst Mills — Manalapan, NJ"
  fill
  className="object-cover"
  priority
  quality={90}
/>
<div className="absolute inset-0 bg-black/50" /> {/* overlay */}
```

4. Add category images to CategoryCard components:
```tsx
// In CategoryCard.tsx, add image prop and render with next/image
```

### Recommended Photo Assignments

| Image Slot       | Best Candidates (by size/quality)           |
|------------------|---------------------------------------------|
| Homepage Hero    | IMG_0587 (13.9MB), IMG_0589 (13.4MB)       |
| Lumber Section   | IMG_0581, IMG_0582 (large format)           |
| Store Interior   | IMG_0590, IMG_0591 (12MB each)              |
| Paint Center     | WhatsApp photos showing paint displays      |
| Category Cards   | Appropriate interior shots                   |

### Canon DSLR Photos Location
Google Drive: `1G3MZ7nLvF9ytPEXufi0DWNyHuX5iwPeE` (100CANON folder)
