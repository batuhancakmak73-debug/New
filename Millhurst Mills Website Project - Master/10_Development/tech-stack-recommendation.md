# Development Tech Stack Recommendation
## Millhurst Mills Website

## Recommended Stack: Next.js 14 + Tailwind CSS → Vercel

### Why This Stack
- **Next.js 14** (App Router): Built-in image optimization, SEO-friendly, fast static generation
- **Tailwind CSS**: Rapid styling, responsive-first, professional UI
- **Vercel**: One-click deploy, automatic SSL, CDN, preview URLs — already integrated in this Claude Code session
- **Vercel Blob or Cloudinary**: For image hosting/optimization at scale

### Alternative: WordPress Rebuild
If you want to stay on WordPress (current site is WordPress based on public_html.zip size):
- Restore `public_html.zip` to staging server
- Use GeneratePress or Kadence theme for performance
- Install Rank Math for SEO
- Install ShortPixel or Imagify for WebP conversion
- Deploy on WP Engine, Kinsta, or SiteGround

---

## Recommended Next.js Project Structure

```
millhurst-mills/
├── app/
│   ├── page.tsx                    ← Home
│   ├── layout.tsx                  ← Root layout (nav, footer, schema)
│   ├── building-materials/page.tsx
│   ├── lumber/page.tsx
│   ├── ace-hardware/page.tsx
│   ├── benjamin-moore-paint/page.tsx
│   ├── decking-railing/page.tsx
│   ├── grills-outdoor-living/page.tsx
│   ├── doors-windows/page.tsx
│   ├── contractors/page.tsx
│   ├── outlet-closeouts/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── CategoryCard.tsx
│   ├── ContactForm.tsx
│   └── GoogleMap.tsx
├── public/
│   └── images/                     ← WebP optimized images go here
├── lib/
│   └── business-info.ts            ← Centralized business data (phone, hours, address)
└── package.json
```

## Image Optimization Pipeline

```bash
# Install cwebp (WebP converter)
brew install webp  # macOS
# or: sudo apt install webp  # Ubuntu

# Batch convert: resize Canon DSLR photos for web
mkdir webp-output
for f in *.JPG; do
  # Hero images (2400px wide, 80% quality)
  cwebp -q 80 -resize 2400 0 "$f" -o "webp-output/hero-${f%.JPG}.webp"
  # Category cards (800px wide)
  cwebp -q 82 -resize 800 0 "$f" -o "webp-output/card-${f%.JPG}.webp"
  # Gallery (1200px wide)
  cwebp -q 80 -resize 1200 0 "$f" -o "webp-output/gallery-${f%.JPG}.webp"
done
```

## Performance Targets
- Google PageSpeed Insights: 90+ mobile, 95+ desktop
- Largest Contentful Paint: < 2.5 seconds
- Time to First Byte: < 600ms (Vercel CDN helps here)
- Total page weight (home): < 1 MB

## SEO Implementation Checklist
- [ ] next/head or metadata API with title + description for each page
- [ ] JSON-LD LocalBusiness schema in root layout (see final-schema/)
- [ ] next/image for all images (automatic WebP + lazy loading)
- [ ] Sitemap.xml (use next-sitemap package)
- [ ] robots.txt
- [ ] Canonical URLs
- [ ] Open Graph tags for social sharing
- [ ] Google Analytics 4 (use @next/third-parties/google)
- [ ] Google Search Console verification

## Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# From project root:
vercel --prod

# Or connect GitHub repo for automatic deploys
```

Domain DNS for Vercel:
1. Log into your domain registrar
2. Add A record: @ → 76.76.21.21
3. Add CNAME: www → cname.vercel-dns.com
4. In Vercel dashboard, add your custom domain
