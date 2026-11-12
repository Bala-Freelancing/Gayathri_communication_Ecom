// Vercel serverless function: link-preview HTML for /product/:id
//
// WhatsApp, Facebook, Telegram etc. do not run JavaScript, so a single-page app
// cannot give them per-product titles/images. vercel.json rewrites requests from
// those preview bots (by user-agent) to this function, which returns a tiny HTML
// page with Open Graph tags. Real visitors never hit this; they get the app.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hmlrjihcselneceaverv.supabase.co'
// Public, browser-safe key (same one shipped in the site bundle; RLS protects data).
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'

const STORE = 'Gayathri Communication'

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export function renderPreview({ origin, path, product }) {
  const url = origin + path
  const title = product ? `${product.name} – ${inr(product.selling_price)} | ${STORE}` : `${STORE} – Mobiles & Home Appliances, Trichy`
  const desc = product
    ? `${product.in_stock ? 'In stock' : 'Out of stock'} at ${STORE}, Manachanallur, Trichy. Genuine box-pack with official warranty${
        Number(product.original_price) > Number(product.selling_price) ? ` (MRP ${inr(product.original_price)})` : ''
      }.`
    : 'Genuine smartphones, smart TVs and home appliances with official warranty in Manachanallur, Trichy.'
  const rawImage = product?.image || '/images/og-image.jpg'
  const image = /^https?:\/\//.test(rawImage) ? rawImage : origin + (rawImage.startsWith('/') ? '' : '/') + rawImage

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="${esc(STORE)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${esc(url)}">
</head><body><a href="${esc(url)}">${esc(title)}</a></body></html>`
}

export default async function handler(req, res) {
  const id = String((req.query && req.query.id) || '').slice(0, 200)
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'gayathri-communication-ecom.vercel.app'
  const origin = `https://${host}`
  const path = `/product/${encodeURIComponent(id)}`

  let product = null
  if (id) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=name,selling_price,original_price,image,in_stock&is_active=eq.true&id=eq.${encodeURIComponent(id)}&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      )
      if (r.ok) product = (await r.json())[0] || null
    } catch {
      product = null
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400')
  res.status(200).send(renderPreview({ origin, path, product }))
}
