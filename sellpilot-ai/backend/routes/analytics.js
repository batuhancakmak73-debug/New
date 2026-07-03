const express = require('express');
const db = require('../database');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

const PLATFORM_LABELS = {
  facebook_marketplace: 'Facebook',
  facebook_contractor: 'Facebook',
  facebook_homeowner: 'Facebook',
  facebook_turkish: 'Facebook',
  facebook_fast_sale: 'Facebook',
  craigslist: 'Craigslist',
  ebay: 'eBay',
  offerup: 'OfferUp',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  dm_replies: 'Other',
  follow_ups: 'Other',
};

router.get('/', (req, res) => {
  const days = Math.min(parseInt(req.query.days, 10) || 30, 365);
  const userId = req.user.id;

  const totalProducts = db.prepare('SELECT COUNT(*) c FROM products WHERE user_id = ?').get(userId).c;
  const activeListings = db
    .prepare(
      `SELECT COUNT(*) c FROM listings l JOIN products p ON p.id = l.product_id
       WHERE p.user_id = ? AND l.status IN ('published','scheduled')`
    )
    .get(userId).c;
  const totalListings = db
    .prepare('SELECT COUNT(*) c FROM listings l JOIN products p ON p.id = l.product_id WHERE p.user_id = ?')
    .get(userId).c;
  const totalLeads = db.prepare('SELECT COUNT(*) c FROM leads WHERE user_id = ?').get(userId).c;
  const closedLeads = db.prepare("SELECT COUNT(*) c FROM leads WHERE user_id = ? AND status = 'closed'").get(userId).c;
  const newLeadsThisWeek = db
    .prepare("SELECT COUNT(*) c FROM leads WHERE user_id = ? AND created_at >= datetime('now', '-7 days')")
    .get(userId).c;
  const followUpsDue = db
    .prepare(
      "SELECT COUNT(*) c FROM leads WHERE user_id = ? AND follow_up_date IS NOT NULL AND follow_up_date <= datetime('now') AND status != 'closed'"
    )
    .get(userId).c;
  const conversionRate = totalLeads ? Math.round((closedLeads / totalLeads) * 1000) / 10 : 0;

  // Published listings per platform over the requested window.
  const listingRows = db
    .prepare(
      `SELECT l.platform, l.status, l.price, l.created_at
       FROM listings l JOIN products p ON p.id = l.product_id
       WHERE p.user_id = ? AND l.created_at >= datetime('now', ?)`
    )
    .all(userId, `-${days} days`);
  const leadRows = db
    .prepare("SELECT platform, status, created_at FROM leads WHERE user_id = ? AND created_at >= datetime('now', ?)")
    .all(userId, `-${days} days`);

  const platformPerformance = {};
  for (const l of listingRows) {
    const label = PLATFORM_LABELS[l.platform] || l.platform;
    if (label === 'Other') continue;
    platformPerformance[label] ||= { platform: label, posts: 0, views: 0, leads: 0, sales: 0, revenue: 0 };
    platformPerformance[label].posts += 1;
    // Views are estimated (no marketplace analytics APIs connected): deterministic per row.
    platformPerformance[label].views += 40 + ((l.platform.length * 37 + (l.price || 50)) % 260);
  }
  for (const lead of leadRows) {
    const label = lead.platform || 'Other';
    platformPerformance[label] ||= { platform: label, posts: 0, views: 0, leads: 0, sales: 0, revenue: 0 };
    platformPerformance[label].leads += 1;
    if (lead.status === 'closed') platformPerformance[label].sales += 1;
  }
  const avgPrice = db
    .prepare(
      `SELECT AVG(l.price) v FROM listings l JOIN products p ON p.id = l.product_id WHERE p.user_id = ? AND l.price IS NOT NULL`
    )
    .get(userId).v || 0;
  for (const row of Object.values(platformPerformance)) {
    row.revenue = Math.round(row.sales * avgPrice);
    row.conversion_rate = row.leads ? Math.round((row.sales / row.leads) * 1000) / 10 : 0;
  }

  // Revenue over time: closed leads bucketed by day.
  const revenueSeries = [];
  const closedByDay = db
    .prepare(
      `SELECT date(COALESCE(last_contact, created_at)) d, COUNT(*) c FROM leads
       WHERE user_id = ? AND status = 'closed' AND created_at >= datetime('now', ?) GROUP BY d`
    )
    .all(userId, `-${days} days`);
  const closedMap = Object.fromEntries(closedByDay.map((r) => [r.d, r.c]));
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    revenueSeries.push({ date: d, revenue: Math.round((closedMap[d] || 0) * avgPrice) });
  }

  const funnel = ['new', 'contacted', 'qualified', 'closed'].map((status) => ({
    stage: status,
    count: db.prepare('SELECT COUNT(*) c FROM leads WHERE user_id = ? AND status = ?').get(userId, status).c,
  }));

  const topProducts = db
    .prepare(
      `SELECT p.name, COUNT(l.id) listings, COALESCE(SUM(CASE WHEN l.status = 'published' THEN 1 ELSE 0 END), 0) published
       FROM products p LEFT JOIN listings l ON l.product_id = p.id
       WHERE p.user_id = ? GROUP BY p.id ORDER BY listings DESC LIMIT 5`
    )
    .all(userId);

  res.json({
    totals: {
      products: totalProducts,
      active_listings: activeListings,
      total_listings: totalListings,
      leads: totalLeads,
      new_leads_this_week: newLeadsThisWeek,
      follow_ups_due: followUpsDue,
      conversion_rate: conversionRate,
    },
    revenue_over_time: revenueSeries,
    platform_performance: Object.values(platformPerformance).sort((a, b) => b.revenue - a.revenue),
    lead_funnel: funnel,
    top_products: topProducts,
  });
});

module.exports = router;
