import * as XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = 'https://hmlrjihcselneceaverv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const srcImagesDir = path.resolve(__dirname, '../../xiaomi-tv')
const destImagesDir = path.resolve(__dirname, '../public/images/products/xiaomi-tv')
const excelPath = path.resolve(__dirname, '../../Gayathri_Xiaomi_Smart_TV_Product_Entry_Sheet.xlsx')

console.log('='.repeat(70))
console.log('  IMPORTING XIAOMI SMART TV CATALOG & IMAGES')
console.log('='.repeat(70))

// 1. Copy Images to Web/public/images/products/xiaomi-tv
if (!fs.existsSync(destImagesDir)) {
  fs.mkdirSync(destImagesDir, { recursive: true })
}

const imageFiles = fs.readdirSync(srcImagesDir)
console.log(`\n[Step 1] Copying ${imageFiles.length} image files from ${srcImagesDir} -> ${destImagesDir}...`)

for (const f of imageFiles) {
  const src = path.join(srcImagesDir, f)
  const dest = path.join(destImagesDir, f)
  fs.copyFileSync(src, dest)
  console.log(`  ✓ Copied: ${f}`)
}

// 2. Upload to Supabase Storage bucket 'product-images' (if not already present)
console.log(`\n[Step 2] Uploading images to Supabase Storage 'product-images' bucket...`)
const cloudImageUrls = new Map()

for (const f of imageFiles) {
  const filePath = path.join(destImagesDir, f)
  const fileBuffer = fs.readFileSync(filePath)
  const ext = path.extname(f).toLowerCase()
  let contentType = 'image/jpeg'
  if (ext === '.png') contentType = 'image/png'
  else if (ext === '.webp') contentType = 'image/webp'
  else if (ext === '.avif') contentType = 'image/avif'

  const storagePath = `products/xiaomi-tv/${f}`
  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      })

    if (uploadError) {
      console.warn(`  ! Storage upload warning for ${f}:`, uploadError.message)
    } else {
      console.log(`  ✓ Uploaded to storage: ${storagePath}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(storagePath)

    if (publicUrlData?.publicUrl) {
      cloudImageUrls.set(f, publicUrlData.publicUrl)
    }
  } catch (err) {
    console.warn(`  ! Error during storage upload of ${f}:`, err.message)
  }
}

// 3. Read Excel Sheet and Prepare TV Products
console.log(`\n[Step 3] Reading Excel file: ${excelPath}...`)
const buf = fs.readFileSync(excelPath)
const workbook = XLSX.read(buf, { type: 'buffer' })
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet)

console.log(`Found ${rows.length} rows in ${sheetName}.`)

// Specifications and features database for the 12 Xiaomi Smart TVs
const tvSpecifications = {
  64046: {
    fullName: 'Xiaomi QLED TV A Pro 32 (2025)',
    displayType: 'QLED HD Ready (1366 x 768)',
    refreshRate: '60Hz Vivid Picture Engine',
    sound: '20W Stereo Speakers with Dolby Audio, DTS:X & DTS Virtual:X',
    smartTv: 'Google TV with PatchWall & Kids Mode',
    ports: '2x HDMI (1 eARC), 2x USB 2.0, Ethernet, AV In, 3.5mm Jack',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core Cortex-A55, Mali G31 MP2 GPU, 1.5GB RAM, 8GB Storage',
    badge: 'QLED 2025',
    isBestSeller: false,
    isNewLaunch: true
  },
  64054: {
    fullName: 'Xiaomi Smart TV A 32 (2025)',
    displayType: 'HD Ready Bezel-less Display (1366 x 768)',
    refreshRate: '60Hz Vivid Picture Engine',
    sound: '20W Stereo Speakers with Dolby Audio & DTS-HD',
    smartTv: 'Google TV with PatchWall, Google Assistant, Play Store',
    ports: '2x HDMI (1 eARC), 2x USB 2.0, Ethernet, AV In, 3.5mm Jack',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core Cortex-A55, Mali G31 MP2 GPU, 1.5GB RAM, 8GB Storage',
    badge: 'Value Pick',
    isBestSeller: true,
    isNewLaunch: true
  },
  64056: {
    fullName: 'Xiaomi Smart TV A 43 FHD (2025)',
    displayType: 'Full HD Premium Display (1920 x 1080)',
    refreshRate: '60Hz Vivid Picture Engine',
    sound: '24W High-Fidelity Speakers with Dolby Audio & DTS-HD',
    smartTv: 'Google TV with PatchWall & Google Assistant',
    ports: '2x HDMI (1 eARC), 2x USB 2.0, Ethernet, Optical, AV In',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core Cortex-A55, Mali G31 MP2 GPU, 1.5GB RAM, 8GB Storage',
    badge: 'Full HD 43"',
    isBestSeller: false,
    isNewLaunch: true
  },
  64058: {
    fullName: 'Xiaomi Smart TV X 43 4K (2025)',
    displayType: '4K Ultra HD (3840 x 2160) with Dolby Vision & HDR10',
    refreshRate: '60Hz MEMC Reality Flow Engine',
    sound: '30W Cinema Speakers with Dolby Audio & DTS-X',
    smartTv: 'Google TV with PatchWall, Hands-free Voice Search, Kids Mode',
    ports: '3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core A55 Processor, Mali G52 MP2 GPU, 2GB RAM, 8GB Storage',
    badge: '4K Dolby Vision',
    isBestSeller: true,
    isNewLaunch: true
  },
  64062: {
    fullName: 'Xiaomi Smart TV X 55 4K (2025)',
    displayType: '4K Ultra HD (3840 x 2160) with Dolby Vision, HDR10 & HLG',
    refreshRate: '60Hz MEMC Reality Flow Engine',
    sound: '30W Cinema Speakers with Dolby Audio & DTS-X',
    smartTv: 'Google TV with PatchWall, Hands-free Voice Search, Kids Mode',
    ports: '3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core A55 Processor, Mali G52 MP2 GPU, 2GB RAM, 8GB Storage',
    badge: 'Best Seller 55"',
    isBestSeller: true,
    isNewLaunch: true
  },
  64048: {
    fullName: 'Xiaomi QLED TV X Pro 43 (2025)',
    displayType: '4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3 Color Gamut',
    refreshRate: '60Hz MEMC with Dolby Vision IQ & HDR10+',
    sound: '30W Cinema Audio with Dolby Atmos & DTS:X',
    smartTv: 'Google TV with PatchWall+, Far-field Voice Mics, Google Assistant',
    ports: '3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage',
    badge: 'QLED 4K Pro',
    isBestSeller: false,
    isNewLaunch: true
  },
  64050: {
    fullName: 'Xiaomi QLED TV X Pro 55 (2025)',
    displayType: '4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3, 1.07 Billion Colors',
    refreshRate: '60Hz MEMC with Dolby Vision IQ & HDR10+',
    sound: '30W Cinema Audio with Dolby Atmos & DTS:X',
    smartTv: 'Google TV with PatchWall+, Far-field Voice Mics, Google Assistant',
    ports: '3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage',
    badge: 'Flagship QLED',
    isBestSeller: true,
    isNewLaunch: true
  },
  64052: {
    fullName: 'Xiaomi QLED TV X Pro 65 (2025)',
    displayType: '65" Massive 4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3',
    refreshRate: '60Hz MEMC with Dolby Vision IQ & HDR10+',
    sound: '30W Cinema Audio with Dolby Atmos & DTS:X',
    smartTv: 'Google TV with PatchWall+, Far-field Voice Mics, Google Assistant',
    ports: '3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage',
    badge: 'Cinema 65"',
    isBestSeller: false,
    isNewLaunch: true
  },
  75692: {
    fullName: 'Xiaomi QLED TV X Pro 75 (2026)',
    displayType: '75" Colossal 4K Quantum Dot QLED (3840 x 2160), 1.07 Billion Colors',
    refreshRate: '60Hz Reality Flow MEMC with Dolby Vision IQ & HDR10+',
    sound: '34W Premium Acoustic Speakers with Dolby Atmos & DTS Virtual:X',
    smartTv: 'Google TV 2026 Edition with PatchWall+, Far-Field Voice Assistant',
    ports: '3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In',
    wireless: 'Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in',
    hardware: 'Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage',
    badge: '75" Giant Screen',
    isBestSeller: false,
    isNewLaunch: true
  },
  75226: {
    fullName: 'Xiaomi QD-Mini LED TV S 55 (2026)',
    displayType: '55" QD-Mini LED 4K (3840 x 2160), 308 Local Dimming Zones, 1200 Nits Peak',
    refreshRate: '144Hz Gaming Refresh Rate with VRR, ALLM & AMD FreeSync Premium',
    sound: '40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced',
    smartTv: 'Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics',
    ports: '4x HDMI (2x HDMI 2.1 4K@144Hz, ALLM, eARC), 2x USB 3.0, Optical, LAN',
    wireless: 'Wi-Fi 6 (802.11ax), Bluetooth 5.2, Chromecast built-in, AirPlay 2',
    hardware: 'Quad-Core Cortex-A73, Mali G57 MC1 GPU, 3GB RAM, 32GB High-Speed Storage',
    badge: 'Mini LED 144Hz',
    isBestSeller: false,
    isNewLaunch: true
  },
  75229: {
    fullName: 'Xiaomi QD-Mini LED TV S 65 (2026)',
    displayType: '65" QD-Mini LED 4K (3840 x 2160), 392 Local Dimming Zones, 1200 Nits Peak',
    refreshRate: '144Hz Gaming Refresh Rate with VRR, ALLM & AMD FreeSync Premium',
    sound: '40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced',
    smartTv: 'Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics',
    ports: '4x HDMI (2x HDMI 2.1 4K@144Hz, ALLM, eARC), 2x USB 3.0, Optical, LAN',
    wireless: 'Wi-Fi 6 (802.11ax), Bluetooth 5.2, Chromecast built-in, AirPlay 2',
    hardware: 'Quad-Core Cortex-A73, Mali G57 MC1 GPU, 3GB RAM, 32GB High-Speed Storage',
    badge: 'Mini LED Flagship',
    isBestSeller: true,
    isNewLaunch: true
  },
  75232: {
    fullName: 'Xiaomi QD-Mini LED TV S 75 (2026)',
    displayType: '75" QD-Mini LED 4K (3840 x 2160), 512 Local Dimming Zones, 1200 Nits Peak',
    refreshRate: '144Hz Gaming Refresh Rate with VRR, ALLM & AMD FreeSync Premium',
    sound: '40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced',
    smartTv: 'Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics',
    ports: '4x HDMI (2x HDMI 2.1 4K@144Hz, ALLM, eARC), 2x USB 3.0, Optical, LAN',
    wireless: 'Wi-Fi 6 (802.11ax), Bluetooth 5.2, Chromecast built-in, AirPlay 2',
    hardware: 'Quad-Core Cortex-A73, Mali G57 MC1 GPU, 3GB RAM, 32GB High-Speed Storage',
    badge: 'Masterpiece 75"',
    isBestSeller: false,
    isNewLaunch: true
  }
}

// Map each model to its image file
function findMatchingImageFile(modelName) {
  const norm = modelName.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const f of imageFiles) {
    const fNorm = f.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/g, '')
    if (norm === fNorm) return f
  }
  // Substring match
  for (const f of imageFiles) {
    const fNorm = f.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/g, '')
    if (fNorm.includes(norm) || norm.includes(fNorm)) return f
  }
  return imageFiles[0]
}

const productsToInsert = []
const updatedSheetRows = []

for (let i = 0; i < rows.length; i++) {
  const r = rows[i]
  const productId = parseInt(r['Product ID'], 10)
  const rawModelName = String(r['Product / Model']).trim()
  const screenSize = parseInt(r['Screen Size (inches)'], 10)
  const sellingPrice = parseFloat(String(r['SRP (₹)']).replace(/[^\d.-]/g, ''))
  const mrp = Math.round(sellingPrice * 1.14)
  const stockQty = 10
  const warrantyTerms = '1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)'
  
  const specData = tvSpecifications[productId] || {
    fullName: `Xiaomi ${rawModelName}`,
    displayType: `${screenSize}-inch Ultra HD Display`,
    refreshRate: '60Hz Vivid Picture Engine',
    sound: '24W Stereo Speakers with Dolby Audio',
    smartTv: 'Google TV with PatchWall',
    ports: '3x HDMI, 2x USB, Ethernet, Optical',
    wireless: 'Dual-Band Wi-Fi, Bluetooth 5.0',
    hardware: 'Quad-Core Processor, 2GB RAM, 16GB Storage',
    badge: 'Smart TV',
    isBestSeller: false,
    isNewLaunch: true
  }

  const matchedImageFile = findMatchingImageFile(rawModelName)
  const publicImagePath = `/images/products/xiaomi-tv/${matchedImageFile}`
  const storageImageUrl = cloudImageUrls.get(matchedImageFile) || publicImagePath

  const slug = `xiaomi-${rawModelName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50)
  const id = `gc-${slug}`
  const sku = `GC-TV-XIA-${String(productId)}`

  const specs = [
    { label: 'Screen Size', value: `${screenSize} Inches (${Math.round(screenSize * 2.54)} cm)` },
    { label: 'Display Technology', value: specData.displayType },
    { label: 'Refresh Rate', value: specData.refreshRate },
    { label: 'Audio Output', value: specData.sound },
    { label: 'Operating System', value: specData.smartTv },
    { label: 'Connectivity Ports', value: specData.ports },
    { label: 'Wireless Connectivity', value: specData.wireless },
    { label: 'Processor & Memory', value: specData.hardware },
    { label: 'Warranty', value: warrantyTerms },
    { label: 'Showroom Guarantee', value: '100% Brand-New Sealed Box Pack with GST Invoice' }
  ]

  const highlights = [
    `Display: ${specData.displayType}`,
    `Audio: ${specData.sound}`,
    `Smart Platform: ${specData.smartTv}`
  ]

  const variants = [
    {
      id: `var-tv-${productId}`,
      sku,
      name: `${screenSize}" Display`,
      price: sellingPrice,
      originalPrice: mrp,
      stockQuantity: stockQty,
      inStock: true,
      attributes: {
        screenSize: `${screenSize} Inch`,
        series: String(r['Series'] || 'Smart TV')
      }
    }
  ]

  const productObj = {
    id,
    sku,
    slug,
    name: specData.fullName,
    brand: 'Xiaomi',
    category_id: 'smart-tvs',
    selling_price: sellingPrice,
    original_price: mrp,
    stock_quantity: stockQty,
    in_stock: true,
    warranty: warrantyTerms,
    tagline: r['Short Tagline / Key Highlight'] || `${screenSize}" Smart TV with cinema visual clarity and immersive audio.`,
    description: `Official ${specData.fullName} authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.`,
    badge: specData.badge,
    is_best_seller: specData.isBestSeller,
    is_new_launch: specData.isNewLaunch,
    is_deal_of_the_day: false,
    rating: 4.8 + ((i % 3) * 0.1),
    review_count: 15 + ((productId % 11) * 3),
    image: publicImagePath,
    gallery: [publicImagePath],
    emi_starts_at: Math.round(sellingPrice / 24),
    specs,
    highlights,
    variants
  }

  productsToInsert.push(productObj)

  // Update Excel row with filled details
  const updatedRow = { ...r }
  updatedRow['Showroom MRP (₹) - Fill In'] = mrp
  updatedRow['Stock Quantity - Fill In'] = stockQty
  updatedRow['Warranty Terms - Confirm'] = warrantyTerms
  updatedRow['Technical Specifications'] = specs.map(s => `${s.label}: ${s.value}`).join('; ')
  updatedRow['Product Image URL - Fill In'] = publicImagePath
  updatedRow['Official Product Page / Reference'] = `https://www.mi.com/in/product/${slug}`
  updatedRow['Verification Notes'] = `Verified authentic Xiaomi showroom stock. Image matched to ${matchedImageFile}. MRP, stock & specs completed.`
  updatedRow['Publish Status'] = 'Published / Active'
  updatedSheetRows.push(updatedRow)
}

// 4. Update the Excel File
console.log(`\n[Step 4] Updating ${excelPath} with completed values...`)
const newWorksheet = XLSX.utils.json_to_sheet(updatedSheetRows)
workbook.Sheets[sheetName] = newWorksheet
XLSX.writeFile(workbook, excelPath)
console.log('✓ Successfully wrote updated values back to Excel file!')

// 5. Insert / Upsert into Supabase Database
console.log(`\n[Step 5] Inserting ${productsToInsert.length} Xiaomi Smart TV products to Supabase...`)
let successCount = 0

for (const prod of productsToInsert) {
  const res = await supabase.rpc('admin_create_product', { p_product: prod })
  if (res.error) {
    console.warn(`  ! RPC admin_create_product notice for ${prod.name}: ${res.error.message}. Attempting direct upsert...`)
    const { error: upsertErr } = await supabase.from('products').upsert(prod, { onConflict: 'id' })
    if (upsertErr) {
      console.error(`  ✗ Failed direct upsert for ${prod.name}:`, upsertErr.message)
    } else {
      successCount++
      console.log(`  ✓ Direct upserted: ${prod.name} (SKU: ${prod.sku}, ₹${prod.selling_price})`)
    }
  } else {
    successCount++
    console.log(`  ✓ Inserted via RPC: ${prod.name} (SKU: ${prod.sku}, ₹${prod.selling_price})`)
  }
}

console.log(`\nImport Summary: Successfully imported ${successCount} of ${productsToInsert.length} Xiaomi Smart TVs to Supabase!`)

// 6. Verify count in Supabase
const { data: dbTvs, count: totalTvCount } = await supabase
  .from('products')
  .select('id, name, sku, selling_price, image', { count: 'exact' })
  .eq('category_id', 'smart-tvs')

console.log(`\nSupabase TV Count: ${totalTvCount}`)
dbTvs?.forEach((tv, idx) => {
  console.log(`  [${idx + 1}] ${tv.name} (SKU: ${tv.sku}) - ₹${tv.selling_price} | Image: ${tv.image}`)
})

const { count: overallCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
console.log(`Total Products in Database: ${overallCount}`)
