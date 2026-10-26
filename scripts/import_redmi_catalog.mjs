import * as XLSX from 'xlsx'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hmlrjihcselneceaverv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const filePath = '../Gayathri_Xiaomi_Redmi_Product_Entry_Sheet_with_Specs.xlsx'
const buf = fs.readFileSync(filePath)
const workbook = XLSX.read(buf, { type: 'buffer' })
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

function extractBaseModelAndVariant(rawName) {
  let baseModel = rawName.trim()
  let variantName = 'Standard'

  const parenMatch = rawName.match(/^(.*?)\s*[\(\[]([0-9]+\s*GB.*?|\d+\s*TB.*?)[\)\]]\s*$/i)
  if (parenMatch) {
    baseModel = parenMatch[1].trim()
    variantName = parenMatch[2].replace(/\+/g, ' + ').replace(/\s+/g, ' ').trim()
    return { baseModel, variantName }
  }

  const slashMatch = rawName.match(/^(.*?)\s*([0-9]+\s*GB\s*[\/\+]\s*[0-9]+\s*(?:GB|TB))\s*$/i)
  if (slashMatch) {
    baseModel = slashMatch[1].trim()
    variantName = slashMatch[2].replace(/[\/\+]/g, ' + ').replace(/\s+/g, ' ').trim()
    return { baseModel, variantName }
  }

  return { baseModel, variantName }
}

function resolveImage(title, brand, category) {
  const t = title.toLowerCase()
  if (t.includes('pad')) return '/images/products/lg-ultragear-monitor.jpg'
  if (t.includes('xiaomi 17')) return '/images/hero-phone.jpg'
  if (t.includes('redmi note 15 pro+')) return '/images/products/redmi-phone.jpg'
  if (t.includes('redmi note 15 pro')) return '/images/products/redmi-phone.jpg'
  if (t.includes('redmi note 15')) return '/images/products/redmi-phone.jpg'
  if (t.includes('redmi 15')) return '/images/products/redmi-phone.jpg'
  if (t.includes('redmi 17')) return '/images/products/redmi-phone.jpg'
  if (t.includes('redmi a7')) return '/images/products/redmi-phone.jpg'
  if (t.includes('turbo')) return '/images/hero-phone.jpg'
  return '/images/products/redmi-phone.jpg'
}

const modelGroups = new Map()

for (let r = 1; r < rows.length; r++) {
  const row = rows[r]
  if (!row || !row[3]) continue
  const title = String(row[3]).trim()
  const brand = String(row[1] || 'Redmi').trim()
  const catText = String(row[0] || '').toLowerCase()
  let category = 'smartphones'
  if (catText.includes('pad') || catText.includes('tablet') || catText.includes('other')) {
    category = 'other-electronics'
  }
  const sellCost = parseFloat(String(row[4] ?? '').replace(/[^\d.-]/g, ''))
  const mrpRaw = parseFloat(String(row[5] ?? '').replace(/[^\d.-]/g, ''))
  const mrp = (!isNaN(mrpRaw) && mrpRaw >= sellCost) ? mrpRaw : Math.round(sellCost * 1.14)
  const stock = parseFloat(String(row[6] ?? '').replace(/[^\d.-]/g, '')) || 10
  const warranty = String(row[7] || '1 Year Official Brand Warranty').replace('— confirm', '').trim()
  const tagline = String(row[8] || '').trim()
  const specsRaw = String(row[9] || '').trim()

  const { baseModel, variantName } = extractBaseModelAndVariant(title)
  const key = `${brand}-${category}-${baseModel.toLowerCase()}`

  if (!modelGroups.has(key)) {
    modelGroups.set(key, [])
  }
  modelGroups.get(key).push({
    rawTitle: title,
    baseModel,
    variantName,
    brand,
    category,
    sellCost,
    mrp,
    stock,
    warranty,
    tagline,
    specsRaw,
    rowNum: r
  })
}

const consolidated = []

for (const [key, group] of modelGroups.entries()) {
  const first = group[0]
  const baseModel = first.baseModel
  const minPrice = Math.min(...group.map(g => g.sellCost))
  const correspondingMrp = group.find(g => g.sellCost === minPrice)?.mrp || Math.round(minPrice * 1.14)
  const totalStock = group.reduce((sum, g) => sum + g.stock, 0)

  const variants = group.map((sub, idx) => ({
    id: `var-${sub.rowNum}-${idx}`,
    sku: `GC-${sub.category.substring(0, 3).toUpperCase()}-${sub.brand.substring(0, 3).toUpperCase()}-${String(sub.rowNum).padStart(4, '0')}`,
    name: sub.variantName,
    price: sub.sellCost,
    originalPrice: sub.mrp,
    stockQuantity: sub.stock,
    inStock: sub.stock > 0,
    attributes: {
      storage: sub.variantName
    }
  }))

  const slug = `${first.brand}-${baseModel}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50)
  const id = `gc-${slug}`
  const sku = `GC-${first.category.substring(0, 3).toUpperCase()}-${first.brand.substring(0, 3).toUpperCase()}-${String(first.rowNum).padStart(4, '0')}`
  const image = resolveImage(baseModel, first.brand, first.category)

  // Specs
  const specs = []
  if (first.specsRaw) {
    first.specsRaw.split(';').forEach(s => {
      const p = s.trim()
      if (!p) return
      if (p.includes('Display') || p.includes('inch')) specs.push({ label: 'Display', value: p })
      else if (p.includes('Processor') || p.includes('Snapdragon') || p.includes('Dimensity')) specs.push({ label: 'Processor', value: p })
      else if (p.includes('Camera') || p.includes('MP')) specs.push({ label: 'Camera', value: p })
      else if (p.includes('Battery') || p.includes('mAh')) specs.push({ label: 'Battery', value: p })
      else specs.push({ label: 'Feature', value: p })
    })
  }

  consolidated.push({
    id,
    sku,
    slug,
    name: baseModel,
    brand: first.brand,
    category_id: first.category,
    selling_price: minPrice,
    original_price: correspondingMrp,
    stock_quantity: totalStock,
    in_stock: totalStock > 0,
    warranty: first.warranty,
    tagline: first.tagline || `Official ${first.brand} ${baseModel} with genuine showroom warranty.`,
    description: `Official ${first.brand} ${baseModel}. Genuine brand-sealed retail stock from Gayathri Communication showroom. Includes official manufacturer warranty and invoice.`,
    badge: minPrice > 40000 ? 'Flagship Pick' : (first.category === 'other-electronics' ? 'Tablet' : 'Verified Stock'),
    is_best_seller: minPrice > 25000 && minPrice < 45000,
    is_new_launch: true,
    is_deal_of_the_day: false,
    rating: 4.8,
    review_count: 12,
    image,
    gallery: [image],
    emi_starts_at: minPrice > 5000 ? Math.round(minPrice / 24) : 0,
    specs,
    highlights: specs.slice(0, 3).map(s => `${s.label}: ${s.value}`),
    variants
  })
}

console.log(`Prepared ${consolidated.length} consolidated parent products.`);

async function runImport() {
  console.log('Clearing existing products via clear_all_products()...');
  const clearRes = await supabase.rpc('clear_all_products');
  console.log('Clear result:', clearRes);

  console.log('Inserting products via admin_create_product()...');
  let successCount = 0;
  for (const prod of consolidated) {
    const res = await supabase.rpc('admin_create_product', { p_product: prod });
    if (res.error) {
      console.error(`Error inserting ${prod.name}:`, res.error.message);
    } else {
      successCount++;
      console.log(`✓ Inserted: ${prod.name} (${prod.variants.length} variants, From ₹${prod.selling_price})`);
    }
  }

  console.log(`\nImport complete! Successfully imported ${successCount} of ${consolidated.length} models.`);
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`Current DB count: ${count}`);
}

runImport().catch(console.error);
