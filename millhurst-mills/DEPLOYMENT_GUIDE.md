# Deployment Guide — Millhurst Mills Website

## Before Deploying

1. Update `lib/business-info.ts` with confirmed:
   - Exact street address (confirm Route 9 number)
   - Correct phone number
   - Email address
   - Business hours (confirm Sunday hours)

2. Replace gradient hero with real photo (see IMAGE_REPLACEMENT_GUIDE.md)

3. Replace Google Maps embed API key in `app/contact/page.tsx` with real key
   (or use a simple Google Maps redirect link instead)

4. Set up formsubmit.co or replace form action with your email

## Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# From /millhurst-mills directory:
vercel --prod
```

Then in Vercel dashboard:
1. Add custom domain: millhurstmills.com
2. Set environment variables if needed

## DNS Configuration

At your domain registrar:
1. A record: `@` → `76.76.21.21`
2. CNAME: `www` → `cname.vercel-dns.com`

## Post-Launch SEO Checklist

- [ ] Submit sitemap to Google Search Console: /sitemap.xml
- [ ] Verify business on Google Business Profile
- [ ] Update Google Business Profile website URL
- [ ] Set up Google Analytics 4
- [ ] Test with Google Rich Results Test (schema.org)
- [ ] Check PageSpeed Insights (target: 90+ mobile)
- [ ] Verify all 15 pages index in Google Search Console
