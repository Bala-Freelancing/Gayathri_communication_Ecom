import * as XLSX from 'xlsx'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hmlrjihcselneceaverv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const filePath = '../Gayathri_Vivo_Product_Entry_Sheet_with_Specs.xlsx'
const buf = fs.readFileSync(filePath)
const workbook = XLSX.read(buf, { type: 'buffer' })
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

function extractBaseModelAndVariant(rawName) {
  const cleanTitle = (rawName || '').trim()
  const parenMatch = cleanTitle.match(/^(.*?)\s*\((.*?)\)$/)
  if (parenMatch) {
    const base = parenMatch[1].trim()
    let rawVar = parenMatch[2].trim()
    const simpleSlash = rawVar.match(/^(\d{1,2})\s*[\/\+]\s*(\d{2,4})$/)
    if (simpleSlash) {
      rawVar = `${simpleSlash[1]}GB + ${simpleSlash[2]}GB`
    } else {
      rawVar = rawVar.replace(/(\d+(?:GB|TB))\s*\+\s*(\d+(?:GB|TB))/i, (_m, g1, g2) => `${g1} + ${g2}`)
    }
    return { baseModel: base, variantName: rawVar }
  }

  const slashMatch = cleanTitle.match(/^(.*?)\s+(\d{1,2})\s*\/\s*(\d{2,4})\b(.*)$/i)
  if (slashMatch) {
    const base = `${slashMatch[1]} ${slashMatch[4]}`.trim()
    return { baseModel: base, variantName: `${slashMatch[2]}GB + ${slashMatch[3]}GB` }
  }

  return { baseModel: cleanTitle, variantName: 'Standard' }
}

function resolveVivoImage(modelName) {
  const m = modelName.toUpperCase()
  if (m.includes('Y11')) return '/images/products/vivo/vivo_y11.webp'
  if (m.includes('Y21')) return '/images/products/vivo/vivo-y21.jpg'
  if (m.includes('Y31T')) return '/images/products/vivo/vivo-y31T.png'
  if (m.includes('Y31')) return '/images/products/vivo/vivo-y31.webp'
  if (m.includes('Y05')) return '/images/products/vivo/vivo-y05.webp'
  return '/images/products/vivo-phone.jpg'
}

const headerRow = rows[0]
let colCategory = 1
let colBrand = 2
let colTitle = 4
let colSellingPrice = 7
let colMrp = 8
let colTagline = 9
let colSpecs = 10

for (let c = 0; c < headerRow.length; c++) {
  const text = String(headerRow[c] || '').toLowerCase().trim()
  if (text.includes('category')) colCategory = c
  else if (text.includes('brand')) colBrand = c
  else if (text.includes('product title') || text.includes('model name')) colTitle = c
  else if (text.includes('selling price') || text.includes('mop')) colSellingPrice = c
  else if (text.includes('mrp') || text.includes('original price')) colMrp = c
  else if (text.includes('tagline') || text.includes('highlight')) colTagline = c
  else if (text === 'technical specifications' || text.startsWith('technical spec')) colSpecs = c
}

const modelGroups = new Map()

for (let r = 1; r < rows.length; r++) {
  const row = rows[r]
  if (!row || !row[colTitle]) continue

  let rawTitle = String(row[colTitle]).trim()
  if (!rawTitle.toLowerCase().includes('vivo')) {
    rawTitle = `Vivo ${rawTitle}`
  }

  const { baseModel, variantName } = extractBaseModelAndVariant(rawTitle)
  const sellCost = parseFloat(String(row[colSellingPrice] ?? '').replace(/[^\d.-]/g, ''))
  if (isNaN(sellCost) || sellCost <= 0) continue

  const mrpRaw = colMrp !== -1 && row[colMrp] ? parseFloat(String(row[colMrp]).replace(/[^\d.-]/g, '')) : NaN
  const mrp = (!isNaN(mrpRaw) && mrpRaw >= sellCost) ? mrpRaw : Math.round(sellCost * 1.14)
  const tagline = colTagline !== -1 && row[colTagline] ? String(row[colTagline]).trim() : ''
  const specsRaw = colSpecs !== -1 && row[colSpecs] ? String(row[colSpecs]).trim() : ''

  if (!modelGroups.has(baseModel)) {
    modelGroups.set(baseModel, [])
  }

  modelGroups.get(baseModel).push({
    rawTitle,
    baseModel,
    variantName,
    sellCost,
    mrp,
    tagline,
    specsRaw,
    rowNum: r
  })
}

const consolidated = []

for (const [baseModel, group] of modelGroups.entries()) {
  const first = group[0]
  const minPrice = Math.min(...group.map(g => g.sellCost))
  const correspondingMrp = group.find(g => g.sellCost === minPrice)?.mrp || Math.round(minPrice * 1.14)
  const totalStock = group.length * 10

  const variants = group.map((sub, idx) => ({
    id: `var-vivo-${sub.rowNum}-${idx}`,
    sku: `GC-SMA-VIV-${String(sub.rowNum).padStart(4, '0')}`,
    name: sub.variantName,
    price: sub.sellCost,
    originalPrice: sub.mrp,
    stockQuantity: 10,
    inStock: true,
    attributes: {
      storage: sub.variantName
    }
  }))

  const slug = `vivo-${baseModel}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50)
  const id = `gc-${slug}`
  const sku = `GC-SMA-VIV-${String(first.rowNum).padStart(4, '0')}`
  const image = resolveVivoImage(baseModel)

  const specs = []
  if (first.specsRaw) {
    first.specsRaw.split(';').forEach(s => {
      const p = s.trim()
      if (!p) return
      if (p.includes('Display') || p.includes('inch') || p.includes('LCD') || p.includes('Hz')) specs.push({ label: 'Display', value: p })
      else if (p.includes('Processor') || p.includes('Snapdragon') || p.includes('Dimensity') || p.includes('T7225')) specs.push({ label: 'Processor', value: p })
      else if (p.includes('Camera') || p.includes('MP')) specs.push({ label: 'Camera', value: p })
      else if (p.includes('Battery') || p.includes('mAh')) specs.push({ label: 'Battery', value: p })
      else if (p.includes('charging') || p.includes('FlashCharge')) specs.push({ label: 'Charging', value: p })
      else if (p.includes('IP6') || p.includes('IP68') || p.includes('IP65')) specs.push({ label: 'Durability', value: p })
      else specs.push({ label: 'Feature', value: p })
    })
  }

  consolidated.push({
    id,
    sku,
    slug,
    name: baseModel,
    brand: 'Vivo',
    category_id: 'smartphones',
    selling_price: minPrice,
    original_price: correspondingMrp,
    stock_quantity: totalStock,
    in_stock: true,
    warranty: '1 Year Official Manufacturer Warranty',
    tagline: first.tagline || `Official Vivo ${baseModel} with genuine showroom warranty.`,
    description: `Official Vivo ${baseModel} authorized showroom stock at Gayathri Communication. Brand-sealed box with genuine GST invoice, standard accessories and 1-year manufacturer warranty.`,
    badge: 'Showroom Official',
    is_best_seller: baseModel === 'Vivo Y21' || baseModel === 'Vivo Y31',
    is_new_launch: true,
    is_deal_of_the_day: false,
    rating: 4.8,
    review_count: 15,
    image,
    gallery: [image],
    emi_starts_at: 0,
    specs,
    highlights: specs.slice(0, 3).map(s => `${s.label}: ${s.value}`),
    variants
  })
}

console.log(`Prepared ${consolidated.length} consolidated Vivo parent models:`)
consolidated.forEach(p => {
  console.log(`\n• ${p.name} (SKU: ${p.sku}) | Base Price: ₹${p.selling_price} | Image: ${p.image}`)
  p.variants.forEach(v => console.log(`   - ${v.name}: ₹${v.price} (MRP: ₹${v.originalPrice})`))
})

async function runImport() {
  console.log('\nImporting Vivo models to Supabase via admin_create_product()...')
  let successCount = 0
  for (const prod of consolidated) {
    const res = await supabase.rpc('admin_create_product', { p_product: prod })
    if (res.error) {
      console.error(`Error inserting ${prod.name}:`, res.error.message)
    } else {
      successCount++
      console.log(`✓ Inserted/Updated: ${prod.name} (${prod.variants.length} variants)`)
    }
  }

  console.log(`\nVivo import complete! Successfully saved ${successCount} of ${consolidated.length} models.`)
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`Total DB product count: ${count}`)
}

runImport().catch(console.error)
