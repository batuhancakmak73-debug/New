import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORIES = [
  'Building Materials',
  'Solar',
  'Appliances',
  'Furniture',
  'Mattresses',
  'Tools',
  'Wardrobes',
];

export const CONDITIONS = ['New', 'Like New', 'Used', 'Refurbished'];

export const PLATFORM_META: Record<string, { label: string; color: string; group: string }> = {
  facebook_marketplace: { label: 'Marketplace', color: '#1877F2', group: 'Facebook' },
  facebook_contractor: { label: 'FB Contractor', color: '#1877F2', group: 'Facebook' },
  facebook_homeowner: { label: 'FB Homeowner', color: '#1877F2', group: 'Facebook' },
  facebook_turkish: { label: 'FB Turkish', color: '#1877F2', group: 'Facebook' },
  facebook_fast_sale: { label: 'FB Fast Sale', color: '#1877F2', group: 'Facebook' },
  craigslist: { label: 'Craigslist', color: '#5C2E91', group: 'Craigslist' },
  ebay: { label: 'eBay', color: '#E53238', group: 'eBay' },
  offerup: { label: 'OfferUp', color: '#00A87E', group: 'OfferUp' },
  instagram: { label: 'Instagram', color: '#E1306C', group: 'Instagram' },
  tiktok: { label: 'TikTok', color: '#69C9D0', group: 'TikTok' },
  dm_replies: { label: 'DM Replies', color: '#8B8FA3', group: 'Other' },
  follow_ups: { label: 'Follow-ups', color: '#8B8FA3', group: 'Other' },
};

export const PUBLISHABLE_PLATFORMS = Object.keys(PLATFORM_META).filter(
  (p) => !['dm_replies', 'follow_ups'].includes(p)
);

export function formatMoney(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function imageUrl(filename?: string | null): string | null {
  if (!filename) return null;
  // Supabase Storage stores full public URLs; the local backend stores bare filenames.
  if (/^https?:\/\//.test(filename)) return filename;
  return `${API_ORIGIN}/uploads/${filename}`;
}
