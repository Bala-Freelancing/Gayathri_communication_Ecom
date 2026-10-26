import * as XLSX from 'xlsx'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hmlrjihcselneceaverv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const filePath = '../Gayathri_Infinix_Product_Entry_Sheet.xlsx'
const buf = fs.readFileSync(filePath)
const workbook = XLSX.read(buf, { type: 'buffer' })
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

function normalizeModelName(rawTitle) {
  let t = (rawTitle || '').trim()
  if (t.toUpperCase().startsWith('INFINIX')) {
    t = t.substring(7).trim()
  }

  const upper = t.toUpperCase()
  if (upper.includes('SMART 20')) return 'Infinix Smart 20 HD'
  if (upper.includes('HOT 60I')) return 'Infinix Hot 60i 5G'
  if (upper.includes('HOT 60') && !upper.includes('60I')) return 'Infinix Hot 60 5G'
  if (upper.includes('GT 30 PRO') || upper.includes('GT30 PRO')) return 'Infinix GT 30 Pro'
  if (upper.includes('GT 30') || upper.includes('GT30')) return 'Infinix GT 30'
  if (upper.includes('NOTE EDGE')) return 'Infinix Note Edge'
  if (upper.includes('NOTE 60 PRO') || upper.includes('NOTE 60')) return 'Infinix Note 60 Pro'
  if (upper.includes('HOT 70 PRO') || upper.includes('HOT 70')) return 'Infinix Hot 70 Pro'
  if (upper.includes('X20 SPEAKER') || upper.includes('SPEAKER')) return 'Infinix X20 Wireless Speaker'

  return `Infinix ${t}`
}

function parseVariantString(storageStr, marketCode, rawTitle) {
  let s = (storageStr || '').trim()
  if (!s && marketCode) {
    const mMatch = marketCode.match(/\b(\d+)\+(\d+)\b/)
    if (mMatch) s = `${mMatch[1]}+${mMatch[2]}`
  }
  if (!s && rawTitle) {
    const tMatch = rawTitle.match(/\b(\d+)\+(\d+)\b/)
    if (tMatch) s = `${tMatch[1]}+${tMatch[2]}`
  }

  const isJbl = (rawTitle || '').toUpperCase().includes('JBL') || (marketCode || '').toUpperCase().includes('JBL')

  if (s) {
    const plusMatch = s.match(/^(\d+)\s*\+\s*(\d+)$/)
    if (plusMatch) {
      const a = parseInt(plusMatch[1], 10)
      const b = parseInt(plusMatch[2], 10)

      let ram, rom
      if (a >= 64 && b <= 16) {
        // e.g. 256+8 or 128+6
        rom = a
        ram = b
      } else if (a <= 16 && b >= 64) {
        // e.g. 8+128 or 4+64
        ram = a
        rom = b
      } else {
        ram = a
        rom = b
      }

      let varLabel = `${ram}GB + ${rom}GB`
      if (isJbl) varLabel += ' (JBL Edition)'
      return varLabel
    }
  }

  return isJbl ? 'Standard (JBL Edition)' : 'Standard'
}

function resolveInfinixImage(modelName) {
  const m = modelName.toUpperCase()
  if (m.includes('SMART 20')) return '/images/products/infinix/Infinix-smart-20.png'
  if (m.includes('HOT 60I')) return '/images/products/infinix/infinix-hot60i.webp'
  if (m.includes('HOT 60')) return '/images/products/infinix/infinix-hot60i.webp'
  if (m.includes('GT 30 PRO')) return '/images/products/infinix/Infinix GT 30-pro.jpg'
  if (m.includes('GT 30')) return '/images/products/infinix/infinix-gt30.webp'
  if (m.includes('NOTE EDGE')) return '/images/products/infinix/infinix-note-edge-2.jpg'
  if (m.includes('NOTE 60 PRO')) return '/images/products/infinix/Infinix-Note-60-Pro.png'
  if (m.includes('HOT 70 PRO')) return '/images/products/infinix/infinix_hot70pro.webp'
  if (m.includes('X20') || m.includes('SPEAKER')) return '/images/products/infinix/infinix_speaker.webp'
  return '/images/products/infinix/Infinix-Note-60-Pro.png'
}

function getModelDetails(modelName) {
  const m = modelName.toUpperCase()
  if (m.includes('SMART 20')) {
    return {
      categoryId: 'smartphones',
      tagline: 'Immersive 6.7" Fluid Punch-Hole Display with 5000mAh Day-Long Battery.',
      description: 'Official Infinix Smart 20 HD authorized showroom stock at Gayathri Communication. Packed with a vibrant 90Hz fluid punch-hole display, massive 5000mAh power unit, dual AI camera and expandable virtual RAM.',
      specs: [
        { label: 'Display', value: '6.7-inch HD+ 90Hz Fluid Display' },
        { label: 'Processor', value: 'Octa-Core High-Efficiency Processor' },
        { label: 'Camera', value: '13MP Dual AI Rear + 8MP Front Selfie' },
        { label: 'Battery', value: '5000mAh Battery with Type-C Charging' },
        { label: 'OS', value: 'XOS Powered by Android' },
      ],
      isBestSeller: true,
      isNewLaunch: false,
    }
  }
  if (m.includes('HOT 60I')) {
    return {
      categoryId: 'smartphones',
      tagline: 'True 5G Speed with Colossal 6000mAh Battery and Next-Gen AI Features.',
      description: 'Official Infinix Hot 60i 5G authorized showroom stock at Gayathri Communication. Built for speed with all major Indian 5G band support, massive 6000mAh battery for up to 128 hours of audio, and intelligent AI camera tools.',
      specs: [
        { label: 'Display', value: '6.78-inch FHD+ 120Hz Ultra Smooth Display' },
        { label: 'Network', value: 'Dual 5G Bands (All Major Networks)' },
        { label: 'Battery', value: '6000mAh Colossal Battery with 18W Fast Charge' },
        { label: 'Camera', value: '50MP AI Dual Camera with Super Night Mode' },
        { label: 'Processor', value: 'MediaTek Dimensity 5G Octa-Core' },
      ],
      isBestSeller: false,
      isNewLaunch: true,
    }
  }
  if (m.includes('HOT 60') && !m.includes('60I')) {
    return {
      categoryId: 'smartphones',
      tagline: 'High-Performance 5G with 6GB RAM, 128GB Storage and 120Hz Display.',
      description: 'Official Infinix Hot 60 5G authorized showroom stock at Gayathri Communication. Unleash lightning 5G performance with 6GB RAM, high-speed 128GB storage, and a vivid 120Hz refresh display.',
      specs: [
        { label: 'Display', value: '6.78-inch FHD+ 120Hz High-Refresh Display' },
        { label: 'Processor', value: 'MediaTek Dimensity 5G Architecture' },
        { label: 'Camera', value: '50MP AI Ultra-Clear Camera' },
        { label: 'Battery', value: '5000mAh Battery with Type-C Fast Charging' },
        { label: 'Storage', value: '6GB RAM + 128GB Storage' },
      ],
      isBestSeller: false,
      isNewLaunch: true,
    }
  }
  if (m.includes('GT 30 PRO')) {
    return {
      categoryId: 'smartphones',
      tagline: 'Cyber-Mecha Gaming Flagship with RGB LED Interface & 144Hz 1.5K AMOLED.',
      description: 'Official Infinix GT 30 Pro authorized showroom stock at Gayathri Communication. Ultimate gaming performance with Dimensity 5G chip, VC liquid cooling chamber, dual JBL-tuned stereo sound, and 68W All-Round FastCharge.',
      specs: [
        { label: 'Display', value: '6.67-inch 144Hz Eye-Care 1.5K 10-bit AMOLED' },
        { label: 'Processor', value: 'Flagship MediaTek Dimensity 5G Chipset' },
        { label: 'Camera', value: '108MP Ultra-Clear OIS Camera + 32MP Front' },
        { label: 'Charging', value: '68W Ultra FastCharge + 15W Wireless Charge' },
        { label: 'Audio', value: 'Dual Stereo Speakers Tuned by JBL' },
      ],
      isBestSeller: true,
      isNewLaunch: true,
    }
  }
  if (m.includes('GT 30') && !m.includes('PRO')) {
    return {
      categoryId: 'smartphones',
      tagline: 'Futuristic Cyber-Mecha Gaming Powerhouse with 144Hz AMOLED Display.',
      description: 'Official Infinix GT 30 authorized showroom stock at Gayathri Communication. Cyber-mecha design aesthetics combined with Dimensity 5G power, 144Hz AMOLED screen, 108MP camera, and 45W All-Round FastCharge.',
      specs: [
        { label: 'Display', value: '6.67-inch 144Hz FHD+ AMOLED Display' },
        { label: 'Processor', value: 'MediaTek Dimensity Gaming 5G Platform' },
        { label: 'Camera', value: '108MP Triple AI Camera with Night Filters' },
        { label: 'Battery', value: '5000mAh Battery with 45W Fast Charging' },
        { label: 'Cooling', value: 'Vapor Chamber Liquid Cooling' },
      ],
      isBestSeller: false,
      isNewLaunch: true,
    }
  }
  if (m.includes('NOTE EDGE')) {
    return {
      categoryId: 'smartphones',
      tagline: '3D Curved 120Hz AMOLED Edge Display with Sound Tuned by JBL.',
      description: 'Official Infinix Note Edge authorized showroom stock at Gayathri Communication. Luxurious 3D curved borderless AMOLED display, ultra-slim titanium-grade profile, 108MP OIS camera, and high-fidelity sound by JBL.',
      specs: [
        { label: 'Display', value: '6.78-inch 3D Curved 120Hz AMOLED Screen' },
        { label: 'Processor', value: 'MediaTek Dimensity 6nm 5G Processor' },
        { label: 'Camera', value: '108MP OIS Super-Zoom Camera' },
        { label: 'Audio', value: 'Dual Hi-Res Stereo Speakers Sound by JBL' },
        { label: 'Charging', value: '45W All-Round FastCharge 2.0' },
      ],
      isBestSeller: true,
      isNewLaunch: true,
    }
  }
  if (m.includes('NOTE 60 PRO')) {
    return {
      categoryId: 'smartphones',
      tagline: 'Active Halo AI Lighting with 108MP OIS Camera & 70W FastCharge.',
      description: 'Official Infinix Note 60 Pro authorized showroom stock at Gayathri Communication. Featuring dynamic Active Halo multi-color AI notification lights, 3D curved 120Hz AMOLED, 108MP OIS shooter, and 70W FastCharge with 20W Wireless MagCharge.',
      specs: [
        { label: 'Display', value: '6.78-inch 120Hz 3D-Curved AMOLED (1300 nits)' },
        { label: 'Lighting', value: 'Active Halo Multi-Color AI Dynamic Lights' },
        { label: 'Camera', value: '108MP OIS Primary + 32MP Crystal Selfie' },
        { label: 'Charging', value: '70W All-Round FastCharge + 20W Wireless' },
        { label: 'Audio', value: 'Dual Speakers Tuned by JBL' },
      ],
      isBestSeller: true,
      isNewLaunch: true,
    }
  }
  if (m.includes('HOT 70 PRO')) {
    return {
      categoryId: 'smartphones',
      tagline: 'Sleek Minimalist Aesthetic with 120Hz AMOLED & 64MP Camera.',
      description: 'Official Infinix Hot 70 Pro authorized showroom stock at Gayathri Communication. Premium matte texture, fluid 120Hz AMOLED panel, 64MP ultra-sharp triple camera system, and 33W rapid charging.',
      specs: [
        { label: 'Display', value: '6.78-inch FHD+ 120Hz Fluid AMOLED' },
        { label: 'Camera', value: '64MP Ultra-Clear Triple Camera' },
        { label: 'Processor', value: 'Octa-Core 5G Performance Processor' },
        { label: 'Battery', value: '5000mAh Battery with 33W Fast Charge' },
        { label: 'Build', value: 'Ultra-Thin Body with IP54 Splash Resistance' },
      ],
      isBestSeller: false,
      isNewLaunch: true,
    }
  }
  // Speaker
  return {
    categoryId: 'accessories',
    tagline: 'Dynamic 360° RGB Beat-Sync Lighting with Booming Punchy Bass.',
    description: 'Official Infinix X20 Wireless Party Speaker authorized showroom stock at Gayathri Communication. Booming 20W stereo output with deep bass radiator, dynamic 360-degree pulsating RGB light rings, 12-hour battery life, and IPX5 splash resistance.',
    specs: [
      { label: 'Audio Output', value: '20W Deep Bass Stereo Sound Resonator' },
      { label: 'Lighting', value: '360° RGB Multi-Mode Beat-Sync Ambient Lights' },
      { label: 'Battery', value: 'Up to 12 Hours Continuous Music Playback' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, AUX, TF Card & USB Playback' },
      { label: 'Durability', value: 'IPX5 Splashproof Outdoor Design' },
    ],
    isBestSeller: false,
    isNewLaunch: false,
  }
}

const headerRow = rows[0]
let colSno = 0
let colBrand = 1
let colTitle = 2
let colMarket = 3
let colStorage = 4
let colMrp = 5
let colMop = 6

const modelGroups = new Map()

for (let r = 1; r < rows.length; r++) {
  const row = rows[r]
  if (!row || !row[colTitle]) continue

  const rawTitle = String(row[colTitle]).trim()
  const marketCode = row[colMarket] ? String(row[colMarket]).trim() : ''
  const storageStr = row[colStorage] ? String(row[colStorage]).trim() : ''
  const sellCost = parseFloat(String(row[colMop] ?? '').replace(/[^\d.-]/g, ''))
  if (isNaN(sellCost) || sellCost <= 0) continue

  const mrpRaw = parseFloat(String(row[colMrp] ?? '').replace(/[^\d.-]/g, ''))
  const mrp = (!isNaN(mrpRaw) && mrpRaw >= sellCost) ? mrpRaw : Math.round(sellCost * 1.15)

  const baseModel = normalizeModelName(rawTitle)
  const variantName = parseVariantString(storageStr, marketCode, rawTitle)

  if (!modelGroups.has(baseModel)) {
    modelGroups.set(baseModel, [])
  }

  modelGroups.get(baseModel).push({
    rowNum: r,
    rawTitle,
    marketCode,
    storageStr,
    variantName,
    sellCost,
    mrp
  })
}

const consolidated = []

for (const [baseModel, group] of modelGroups.entries()) {
  const first = group[0]
  const minPrice = Math.min(...group.map(g => g.sellCost))
  const correspondingMrp = group.find(g => g.sellCost === minPrice)?.mrp || Math.round(minPrice * 1.15)
  const totalStock = group.length * 10
  const details = getModelDetails(baseModel)

  const variants = group.map((sub, idx) => ({
    id: `var-infinix-${sub.rowNum}-${idx}`,
    sku: `GC-INF-${String(sub.rowNum).padStart(4, '0')}`,
    name: sub.variantName,
    price: sub.sellCost,
    originalPrice: sub.mrp,
    stockQuantity: 10,
    inStock: true,
    attributes: {
      storage: sub.variantName
    }
  }))

  const slug = baseModel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50)
  const id = `gc-${slug}`
  const sku = `GC-INF-${String(first.rowNum).padStart(4, '0')}`
  const image = resolveInfinixImage(baseModel)

  consolidated.push({
    id,
    sku,
    slug,
    name: baseModel,
    brand: 'Infinix',
    category_id: details.categoryId,
    selling_price: minPrice,
    original_price: correspondingMrp,
    stock_quantity: totalStock,
    in_stock: true,
    warranty: '1 Year Official Manufacturer Warranty',
    tagline: details.tagline,
    description: details.description,
    badge: details.isNewLaunch ? 'New Launch' : (details.isBestSeller ? 'Best Seller' : 'Authorized Retail'),
    is_best_seller: details.isBestSeller,
    is_new_launch: details.isNewLaunch,
    is_deal_of_the_day: false,
    rating: 4.8,
    review_count: 14 + (first.rowNum % 7),
    image,
    gallery: [image],
    emi_starts_at: 0,
    specs: details.specs,
    highlights: details.specs.slice(0, 3).map(s => `${s.label}: ${s.value}`),
    variants
  })
}

console.log(`\nConsolidated into ${consolidated.length} parent Infinix models:`)
consolidated.forEach(p => {
  console.log(`\n• ${p.name} [Category: ${p.category_id}] (Base Price: ₹${p.selling_price}, MRP: ₹${p.original_price}) - Image: ${p.image}`)
  p.variants.forEach(v => console.log(`   - ${v.name}: ₹${v.price} (MRP: ₹${v.originalPrice})`))
})

async function runImport() {
  console.log('\n--- Importing to Supabase database ---')
  let successCount = 0
  for (const prod of consolidated) {
    const res = await supabase.rpc('admin_create_product', { p_product: prod })
    if (res.error) {
      console.error(`Error inserting ${prod.name}:`, res.error.message)
      // Fallback direct upsert if rpc gives error
      const { error: upsertErr } = await supabase.from('products').upsert(prod, { onConflict: 'id' })
      if (upsertErr) {
        console.error(`Direct upsert also failed:`, upsertErr.message)
      } else {
        successCount++
        console.log(`✓ Direct upserted: ${prod.name}`)
      }
    } else {
      successCount++
      console.log(`✓ Inserted via RPC: ${prod.name} (${prod.variants.length} variants)`)
    }
  }

  console.log(`\nSuccessfully imported ${successCount} of ${consolidated.length} Infinix products!`)
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`Total products now in database: ${count}`)
}

runImport().catch(console.error)
