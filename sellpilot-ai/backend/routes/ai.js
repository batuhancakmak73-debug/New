const express = require('express');
const db = require('../database');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

const PLATFORMS = [
  'facebook_marketplace', 'facebook_contractor', 'facebook_homeowner', 'facebook_turkish',
  'facebook_fast_sale', 'craigslist', 'ebay', 'offerup', 'instagram', 'tiktok',
  'dm_replies', 'follow_ups',
];

const SYSTEM_PROMPT = `You are an expert marketplace copywriter specializing in high-converting product listings. You write authentic, honest listings that feel human — never spammy or exaggerated.

Rules:
- NEVER use ALL CAPS for more than one word
- NEVER use multiple exclamation marks
- NEVER use words like "HURRY", "ACT NOW", "LIMITED TIME", "CHEAP"
- Keep tone: direct, honest, confident — like a real local seller
- Use natural line breaks
- Max 1-2 emojis per post
- Include pickup/delivery info and serious buyer filter
- For Turkish community versions, include relevant cultural references`;

function buildUserPrompt(product) {
  return `Generate complete marketplace listings for this product:

Name: ${product.name}
Brand: ${product.brand || 'N/A'}
Category: ${product.category || 'N/A'}
Condition: ${product.condition || 'N/A'}
Quantity: ${product.quantity}
Location: ${product.location || 'N/A'}
Retail price: $${product.retail_price || 'N/A'}
Specs: ${product.specs || 'N/A'}
Notes: ${product.notes || 'N/A'}

Create optimized content for each of the following. Return ONLY a valid JSON object with exactly these keys:
{
  "facebook_marketplace": {"title": "(max 150 chars)", "description": "..."},
  "facebook_contractor": {"title": "...", "description": "Facebook Group post — contractor version"},
  "facebook_homeowner": {"title": "...", "description": "Facebook Group post — homeowner version"},
  "facebook_turkish": {"title": "...", "description": "Facebook Group post — Turkish community version (in Turkish)"},
  "facebook_fast_sale": {"title": "...", "description": "Facebook Group post — fast-sale version"},
  "craigslist": {"title": "...", "description": "Craigslist ad, plain text format"},
  "ebay": {"title": "(max 80 chars)", "description": "eBay listing description including item specifics"},
  "offerup": {"title": "...", "description": "OfferUp listing, short format"},
  "instagram": {"title": "...", "description": "Instagram caption with hashtags"},
  "tiktok": {"title": "...", "description": "30 second TikTok video script with [HOOK], [BODY], [CTA] sections"},
  "dm_replies": {"title": "DM Reply Templates", "description": "6 reply templates for common buyer scenarios (is it available, lowball offer, delivery question, spec question, hold request, no-show follow-up)"},
  "follow_ups": {"title": "Follow-up Messages", "description": "4 follow-up message sequences for interested buyers"},
  "pricing": {"suggested_ask": number (60-70% of retail), "floor_price": number (40-50% of retail), "bulk_discount": "structure as text"},
  "banner_ideas": ["5 banner text ideas"],
  "image_ideas": ["5 image ideas"]
}`;
}

async function callOpenAI(product) {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(product) },
      ],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text.slice(0, 300)}`);
  }
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Deterministic fallback so the app works end-to-end without an API key.
function generateLocally(product) {
  const name = product.name;
  const brand =
    product.brand && !name.toLowerCase().includes(product.brand.toLowerCase())
      ? `${product.brand} `
      : '';
  const retail = parseFloat(product.retail_price) || 100;
  const ask = Math.round(retail * 0.65);
  const floor = Math.round(retail * 0.45);
  const loc = product.location || 'local pickup';
  const cond = (product.condition || 'good').toLowerCase();
  const specs = product.specs ? `\n\nSpecs:\n${product.specs}` : '';
  const base = `${brand}${name} in ${cond} condition. Retail is around $${retail} — asking $${ask}.${specs}\n\nPickup in ${loc}, delivery possible for serious buyers. First come, first served.`;

  return {
    facebook_marketplace: {
      title: `${brand}${name} — ${product.condition || 'Great'} condition, $${ask}`.slice(0, 150),
      description: `${base}\n\nMessage me with your pickup timeframe and I'll hold it for you. 👍`,
    },
    facebook_contractor: {
      title: `${brand}${name} — contractor pricing available`,
      description: `Heads up for the pros: ${brand}${name}, ${cond} condition, quantity ${product.quantity}.${specs}\n\nSingle unit at $${ask}. Buying for a job? Ask about bulk pricing — real discounts at 3+ units.\n\nPickup ${loc}, can coordinate jobsite delivery.`,
    },
    facebook_homeowner: {
      title: `${brand}${name} — save vs retail`,
      description: `Upgrading your place? ${brand}${name} in ${cond} condition for $${ask} (retails near $${retail}).${specs}\n\nHappy to answer questions and send more photos. Pickup in ${loc}, delivery possible. 🏡`,
    },
    facebook_turkish: {
      title: `${brand}${name} — uygun fiyat, ${loc}`,
      description: `Merhaba komşular 👋 ${brand}${name} satılıktır. Durumu: ${product.condition || 'iyi'}. Mağaza fiyatı yaklaşık $${retail}, bizim fiyat $${ask}.${specs}\n\nTeslim ${loc} bölgesinde, ciddi alıcılara kolaylık yapılır. Mesaj atmanız yeterli.`,
    },
    facebook_fast_sale: {
      title: `${brand}${name} — priced to move at $${ask}`,
      description: `Need this gone this week. ${brand}${name}, ${cond} condition.\n\nFair price at $${ask} — first person here with cash takes it. Pickup ${loc}.`,
    },
    craigslist: {
      title: `${brand}${name} - $${ask} (${loc})`,
      description: `${brand}${name} for sale.\n\nCondition: ${product.condition || 'good'}\nQuantity: ${product.quantity}\nPrice: $${ask} (retail ~$${retail})${specs}\n\nCash or Zelle. Pickup in ${loc}. Reply with your phone number for fastest response. No trades.`,
    },
    ebay: {
      title: `${brand}${name} ${product.condition || ''}`.trim().slice(0, 80),
      description: `${base}\n\nItem specifics:\n- Brand: ${product.brand || 'Unbranded'}\n- Condition: ${product.condition || 'Used'}\n- Quantity available: ${product.quantity}\n\nShips within 2 business days or local pickup in ${loc}.`,
    },
    offerup: {
      title: `${brand}${name} — $${ask}`,
      description: `${brand}${name}, ${cond} condition. $${ask} firm-ish (small wiggle room for quick pickup). ${loc} area.`,
    },
    instagram: {
      title: `${brand}${name} available now`,
      description: `New arrival: ${brand}${name} ✨\n\n${cond.charAt(0).toUpperCase() + cond.slice(1)} condition, priced at $${ask} (retail ~$${retail}). DM to claim or ask questions.\n\n#${(product.category || 'forsale').replace(/\s+/g, '').toLowerCase()} #marketplace #deal #${loc.replace(/[^a-zA-Z]/g, '').toLowerCase() || 'local'} #resale #forsale`,
    },
    tiktok: {
      title: `${name} — 30s video script`,
      description: `[HOOK] (0-5s) "This ${name} retails for $${retail} — I'm letting it go for $${ask}. Here's why."\n\n[BODY] (5-22s) Show the ${brand}${name} up close. Walk through condition (${cond}), key specs, and what it's worth new. Quick shot of it working/in place.\n\n[CTA] (22-30s) "It's in ${loc} — comment or DM 'INFO' and I'll send details. First come, first served."`,
    },
    dm_replies: {
      title: 'DM Reply Templates',
      description: `1. "Is it available?" → "Yes, still available. Are you able to pick up in ${loc} this week?"\n\n2. Lowball offer → "Thanks for the offer — I'm at $${ask} and the floor is $${floor} for pickup today. Let me know if that works."\n\n3. Delivery question → "Pickup is in ${loc}. I can deliver locally for a small fee depending on distance — where are you located?"\n\n4. Spec question → "Good question — here are the details: ${(product.specs || 'happy to send photos and measurements').slice(0, 160)}"\n\n5. Hold request → "I can hold it for 24 hours with a small deposit, otherwise it stays first come, first served."\n\n6. No-show follow-up → "Hey, we had a pickup scheduled — still interested? I have other buyers waiting, so let me know either way."`,
    },
    follow_ups: {
      title: 'Follow-up Messages',
      description: `1. Day 1: "Hi! Following up on the ${name} — happy to answer any questions or send more photos."\n\n2. Day 3: "Still interested in the ${name}? I can do $${ask} with flexible pickup times this week."\n\n3. Day 7: "Quick heads up — a couple of people are asking about the ${name}. Wanted to give you first shot before I commit to anyone."\n\n4. Final: "Last note from me — if the timing isn't right, no worries at all. If you'd like it, I can hold it until the weekend at $${ask}."`,
    },
    pricing: {
      suggested_ask: ask,
      floor_price: floor,
      bulk_discount: `2 units: 5% off · 3-4 units: 10% off · 5+ units: 15% off (bulk price applies at $${Math.round(ask * 0.85)}/unit)`,
    },
    banner_ideas: [
      `${brand}${name} — $${ask} (retail $${retail})`,
      `Save $${retail - ask} vs retail`,
      `${product.condition || 'Quality'} · Local pickup in ${loc}`,
      `Serious buyers: same-day pickup available`,
      `Bulk pricing available on ${product.quantity}+ units`,
    ],
    image_ideas: [
      'Hero shot on a clean, neutral background in natural light',
      'Close-up of the label / model number to build trust',
      'Scale shot next to a common object or in a room setting',
      'Detail shots of condition (be honest — show any wear)',
      `Lifestyle shot: the ${name} in use or installed`,
    ],
  };
}

router.post('/generate', async (req, res) => {
  const { productId } = req.body || {};
  if (!productId) return res.status(400).json({ error: 'productId is required' });
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND user_id = ?').get(productId, req.user.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  let content;
  let source = 'openai';
  try {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-key-here') {
      content = await callOpenAI(product);
    } else {
      content = generateLocally(product);
      source = 'template';
    }
  } catch (err) {
    console.error('AI generation failed, using local fallback:', err.message);
    content = generateLocally(product);
    source = 'template-fallback';
  }

  const ask = content.pricing?.suggested_ask || Math.round((parseFloat(product.retail_price) || 100) * 0.65);

  const insert = db.prepare(
    'INSERT INTO listings (product_id, platform, title, description, price, status) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const listings = [];
  const saveAll = db.transaction(() => {
    // Replace prior drafts for this product so regeneration doesn't duplicate.
    db.prepare("DELETE FROM listings WHERE product_id = ? AND status = 'draft'").run(product.id);
    for (const platform of PLATFORMS) {
      const item = content[platform] || {};
      const result = insert.run(product.id, platform, item.title || product.name, item.description || '', ask, 'draft');
      listings.push(db.prepare('SELECT * FROM listings WHERE id = ?').get(result.lastInsertRowid));
    }
  });
  saveAll();

  res.json({
    source,
    listings,
    pricing: content.pricing || null,
    banner_ideas: content.banner_ideas || [],
    image_ideas: content.image_ideas || [],
  });
});

module.exports = router;
