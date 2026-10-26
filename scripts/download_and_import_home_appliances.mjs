import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = 'https://hmlrjihcselneceaverv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const destImagesDir = path.resolve(__dirname, '../public/images/products/home-appliances')
if (!fs.existsSync(destImagesDir)) {
  fs.mkdirSync(destImagesDir, { recursive: true })
}

const appliances = [
  {
    id: 'gc-samsung-rt40h28w1cbnl-fridge',
    sku: 'GC-APP-SAM-RT40H',
    slug: 'samsung-rt40h28w1cbnl-frost-free-refrigerator',
    name: 'Samsung 236L Frost Free Double Door Refrigerator (RT40H28W1CBNL)',
    brand: 'Samsung',
    category_id: 'home-appliances',
    modelNumber: 'RT40H28W1CBNL',
    color: 'Camellia Blue',
    selling_price: 24999,
    original_price: 37999,
    stock_quantity: 8,
    warranty: '1 Year Comprehensive + 20 Years on Digital Inverter Compressor',
    badge: 'Digital Inverter',
    filename: 'samsung_236l_camellia_blue_refrigerator.webp',
    imageUrl: 'https://img-prd-pim.poorvika.com/product/Samsung-236-l-frost-free-double-door-1-star-refrigerator-rt40h28w1cbnl-camellia-blue-Front-View.webp',
    tagline: '236L Frost Free Double Door Refrigerator with Camellia Blue floral finish and Digital Inverter.',
    description: 'Official Samsung 236L Double Door Frost Free Refrigerator (Model: RT40H28W1CBNL) in stunning Camellia Blue finish. Features Digital Inverter Compressor with 20-year warranty, All-Round Cooling, MoistFresh Zone, Toughened Glass Shelves, and anti-bacterial gasket.',
    specs: [
      { label: 'Model Number', value: 'RT40H28W1CBNL' },
      { label: 'Capacity', value: '236 Litres (Double Door)' },
      { label: 'Defrosting Type', value: 'Frost Free' },
      { label: 'Compressor', value: 'Digital Inverter (20-Year Warranty)' },
      { label: 'Color / Pattern', value: 'Camellia Blue Floral Finish' },
      { label: 'Cooling Technology', value: 'All-Around Cooling & Multi Flow Air Vents' },
      { label: 'Shelves', value: 'Toughened Glass (Spill-Proof)' },
      { label: 'Voltage & Input', value: '230V / 50Hz Inverter Stabilizer Free Operation' },
      { label: 'Showroom Guarantee', value: '100% Brand-New Sealed Box with Official GST Invoice' }
    ],
    highlights: [
      'Capacity: 236 Litres Frost Free Double Door',
      'Compressor: Digital Inverter with 20-Year Warranty',
      'Finish: Camellia Blue Floral Design'
    ]
  },
  {
    id: 'gc-bluestar-fb218vxu-split-ac',
    sku: 'GC-APP-BLU-FB218VXU',
    slug: 'bluestar-1-5ton-split-ac-fb218vxu',
    name: 'Blue Star 1.5 Ton Split AC (FB218VXU)',
    brand: 'Blue Star',
    category_id: 'home-appliances',
    modelNumber: 'FB218VXU',
    selling_price: 39999,
    original_price: 49990,
    stock_quantity: 6,
    warranty: '1 Year Comprehensive + 5 Years on PCB + 10 Years on Inverter Compressor',
    badge: '1.5 Ton Turbo Cool',
    filename: 'bluestar_1_5ton_split_ac_fb218vxu.jpeg',
    imageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/air-conditioner-new/o/i/m/-original-imahzu3gk7rymhm4.jpeg?q=90',
    tagline: 'High-efficiency 1.5 Ton Split AC with 5350W cooling, 100% copper condenser & Blue Fin protection.',
    description: 'Official Blue Star 1.5 Ton Split Air Conditioner (Model: FB218VXU). Delivers 5350W robust cooling, ISEER 3.81 rating (2026-27 label series), 100% copper condenser coil with anti-corrosive Blue Fins, Turbo Cool instant cooling mode, and Comfort Sleep setting.',
    specs: [
      { label: 'Model Number', value: 'FB218VXU' },
      { label: 'Tonnage / Capacity', value: '1.52 TR (1.5 Ton, 5350W Cooling)' },
      { label: 'Energy Rating', value: 'ISEER 3.81 (3 Star 2026-27 Series)' },
      { label: 'Condenser Coil', value: '100% Copper with Anti-Corrosive Blue Fins' },
      { label: 'Cooling Modes', value: 'Turbo Cool, Comfort Sleep, Eco & Auto' },
      { label: 'Air Flow & Filters', value: 'High Air Circulation with Dust & Pollutant Filter' },
      { label: 'Refrigerant', value: 'Eco-Friendly R32 Low GWP Gas' },
      { label: 'Voltage', value: '230V, 50Hz Single Phase' },
      { label: 'Showroom Guarantee', value: 'Brand-New Factory Pack with Indoor & Outdoor Units' }
    ],
    highlights: [
      'Capacity: 1.5 Ton (5350W Cooling Power)',
      'Condenser: 100% Copper with Anti-Corrosive Blue Fins',
      'Modes: Turbo Cool Rapid Drop & Comfort Sleep'
    ]
  },
  {
    id: 'gc-carrier-cai18ce3r35f0-inverter-ac',
    sku: 'GC-APP-CAR-CAI18',
    slug: 'carrier-1-5ton-inverter-split-ac-cai18ce3r35f0',
    name: 'Carrier 1.5 Ton Inverter Split AC (CAI18CE3R35F0)',
    brand: 'Carrier',
    category_id: 'home-appliances',
    modelNumber: 'CAI18CE3R35F0',
    selling_price: 37999,
    original_price: 47990,
    stock_quantity: 6,
    warranty: '1 Year Comprehensive + 5 Years on PCB + 10 Years on Compressor',
    badge: 'Flexicool 6-in-1',
    filename: 'carrier_1_5ton_inverter_split_ac.png',
    imageUrl: 'https://media-ik.croma.com/Croma%20Assets/Large%20Appliances/Air%20Conditioner/Images/313395_0_dxuvwa.png?tr=w-600',
    tagline: 'Carrier Ester Exi+ 1.5 Ton Inverter Split AC with Flexicool 6-in-1 convertible cooling & PM 2.5 filter.',
    description: 'Official Carrier 1.5 Ton Inverter Split AC (Model: CAI18CE3R35F0 / Ester Exi+ Series). Features Flexicool 6-in-1 variable tonnage technology, 100% copper condenser with Aqua Clear anti-corrosion coating, PM 2.5 air purification filter, Insta-Cool turbo mode, and silent operation.',
    specs: [
      { label: 'Model Number', value: 'CAI18CE3R35F0' },
      { label: 'Capacity', value: '1.5 Ton Inverter (Variable Speed)' },
      { label: 'Technology', value: 'Flexicool 6-in-1 Inverter (Adjustable Tonnage)' },
      { label: 'Coil & Protection', value: '100% Copper with Aqua Clear Protective Shield' },
      { label: 'Air Purification', value: 'Dual Filtration with PM 2.5 Micron Filter' },
      { label: 'Cooling at Extreme Ambient', value: 'Cooling at up to 52°C Ambient Temperature' },
      { label: 'Gas', value: 'R32 Green Refrigerant' },
      { label: 'Showroom Guarantee', value: '100% Genuine Box Pack with Official Carrier Warranty' }
    ],
    highlights: [
      'Technology: Flexicool 6-in-1 Convertible Inverter',
      'Protection: 100% Copper with Aqua Clear Shield',
      'Air Quality: High-Density PM 2.5 Dual Filter'
    ]
  },
  {
    id: 'gc-bluestar-bwd3fmrga-water-dispenser',
    sku: 'GC-APP-BLU-BWD3',
    slug: 'bluestar-water-dispenser-bwd3fmrga',
    name: 'Blue Star Bottled Water Dispenser with Refrigerator (BWD3FMRGA)',
    brand: 'Blue Star',
    category_id: 'home-appliances',
    modelNumber: 'BWD3FMRGA',
    selling_price: 10999,
    original_price: 18500,
    stock_quantity: 8,
    warranty: '1 Year Official Brand Warranty on Product & Compressor',
    badge: 'With 14L Refrigerator',
    filename: 'bluestar_water_dispenser_bwd3fmrga.png',
    imageUrl: 'http://consumer.bluestarindia.com/cdn/shop/files/bwd3fmrga-g_1_bwd3fmrga_grey_straight_view.png?v=1721411917',
    tagline: 'Hot, cold & normal water dispenser with built-in 14L cooling refrigerator cabinet.',
    description: 'Official Blue Star Floor Standing Water Dispenser with Refrigerator (Model: BWD3FMRGA). Features 3 temperature push taps (Hot, Normal, Cold), built-in 14L bottom refrigerator cabinet for beverages and snacks, food-grade SS304 stainless steel tanks, 3.0L/hr cooling capacity, and child safety lock on hot tap.',
    specs: [
      { label: 'Model Number', value: 'BWD3FMRGA' },
      { label: 'Dispensing Modes', value: '3 Taps: Hot, Normal (Ambient) & Cold Water' },
      { label: 'Integrated Refrigerator', value: '14L Cooling Cabinet at Bottom for Drinks & Food' },
      { label: 'Cooling Capacity', value: '3.0 Litres / Hour High-Efficiency Compressor Cooling' },
      { label: 'Heating Capacity', value: '5.0 Litres / Hour with Fast Heating Element' },
      { label: 'Tank Material', value: 'Food-Grade Antibacterial SS304 Stainless Steel' },
      { label: 'Safety', value: 'Child Lock on Hot Water Faucet & Thermal Overload Cutout' },
      { label: 'Voltage & Weight', value: '230V / 50Hz, Net Weight: 14.5 kg, Gross: 16.5 kg' }
    ],
    highlights: [
      '3 Faucets: Hot, Cold & Normal Water',
      'Built-in Refrigerator: 14L Bottom Cooling Cabinet',
      'Tanks: Food-Grade Stainless Steel SS304'
    ]
  },
  {
    id: 'gc-crompton-acgw-duro-one-grinder',
    sku: 'GC-APP-CRO-DURO',
    slug: 'crompton-duro-one-table-top-wet-grinder-acgw',
    name: 'Crompton Duro One 2L Table Top Wet Grinder (ACGW-DURO ONE)',
    brand: 'Crompton',
    category_id: 'home-appliances',
    modelNumber: 'ACGW-DURO ONE',
    selling_price: 4999,
    original_price: 7260,
    stock_quantity: 10,
    warranty: '2 Years Comprehensive Warranty on Product & Motor',
    badge: '150W High Torque',
    filename: 'crompton_duro_one_table_top_wet_grinder.jpeg',
    imageUrl: 'https://rukminim2.flixcart.com/image/832/832/xif0q/wet-grinder/c/g/b/-original-imahkxwwdmggfz4z.jpeg?q=90',
    tagline: 'High torque 150W 2-litre table top wet grinder with cylindrical conical stones & SS drum.',
    description: 'Official Crompton Duro One 2 Litre Table Top Wet Grinder (Model: ACGW-DURO ONE). Engineered with a high-torque 150W copper motor, cylindrical conical grinding stones for ultra-fine batter consistency, durable SS304 stainless steel drum, transparent shatterproof lid, and ergonomic wiper assembly.',
    specs: [
      { label: 'Model Number', value: 'ACGW-DURO ONE' },
      { label: 'Capacity', value: '2.0 Litres Capacity' },
      { label: 'Motor Power', value: '150W High Torque Motor (230V AC, 50Hz)' },
      { label: 'Grinding Stones', value: 'Cylindrical Conical Stones with Spring Tension Knob' },
      { label: 'Drum Material', value: 'Rust-Proof SS 304 Stainless Steel' },
      { label: 'Accessories', value: 'Grinding Stone with Wiper Assembly, Spatula & Lid' },
      { label: 'Body Type', value: 'Compact Shock-Proof ABS Table-Top Body' },
      { label: 'Warranty', value: '2 Years Official Crompton Manufacturer Warranty' }
    ],
    highlights: [
      'Motor: 150W High Torque Pure Copper Motor',
      'Capacity: 2 Litres SS304 Stainless Steel Drum',
      'Stones: Cylindrical Conical Grinding Stones'
    ]
  }
]

console.log('='.repeat(70))
console.log('  DOWNLOADING IMAGES & INSERTING 5 HOME APPLIANCES')
console.log('='.repeat(70))

// 1. Download images
for (const app of appliances) {
  const localPath = path.join(destImagesDir, app.filename)
  console.log(`\nDownloading ${app.name}...`)
  try {
    const res = await fetch(app.imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    if (!res.ok) {
      console.warn(`  ! HTTP ${res.status} for ${app.imageUrl}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(localPath, buf)
    console.log(`  ✓ Saved ${app.filename} (${(buf.length / 1024).toFixed(1)} KB)`)
  } catch (err) {
    console.error(`  ✗ Error downloading ${app.name}:`, err.message)
  }
}

// 2. Upload to Supabase Storage
console.log('\n[Step 2] Uploading images to Supabase Storage...')
for (const app of appliances) {
  const localPath = path.join(destImagesDir, app.filename)
  if (!fs.existsSync(localPath)) continue

  const buffer = fs.readFileSync(localPath)
  const ext = path.extname(app.filename).toLowerCase()
  let contentType = 'image/jpeg'
  if (ext === '.png') contentType = 'image/png'
  else if (ext === '.webp') contentType = 'image/webp'

  const storagePath = `products/home-appliances/${app.filename}`
  try {
    const { error } = await supabase.storage
      .from('product-images')
      .upload(storagePath, buffer, {
        contentType,
        upsert: true
      })
    if (error) {
      console.warn(`  ! Storage notice for ${app.filename}:`, error.message)
    } else {
      console.log(`  ✓ Storage uploaded: ${storagePath}`)
    }
  } catch (err) {
    console.warn(`  ! Storage error:`, err.message)
  }
}

// 3. Prepare product objects and insert into Supabase
console.log('\n[Step 3] Inserting products into Supabase...')
let successCount = 0

for (const app of appliances) {
  const publicImagePath = `/images/products/home-appliances/${app.filename}`
  const variants = [
    {
      id: `var-app-${app.sku.toLowerCase()}`,
      sku: app.sku,
      name: 'Standard Showroom Unit',
      price: app.selling_price,
      originalPrice: app.original_price,
      stockQuantity: app.stock_quantity,
      inStock: true,
      attributes: {
        modelNumber: app.modelNumber,
        brand: app.brand
      }
    }
  ]

  const prodObj = {
    id: app.id,
    sku: app.sku,
    slug: app.slug,
    name: app.name,
    brand: app.brand,
    category_id: app.category_id,
    selling_price: app.selling_price,
    original_price: app.original_price,
    stock_quantity: app.stock_quantity,
    in_stock: true,
    warranty: app.warranty,
    tagline: app.tagline,
    description: app.description,
    badge: app.badge,
    is_best_seller: true,
    is_new_launch: true,
    is_deal_of_the_day: false,
    rating: 4.8,
    review_count: 18,
    image: publicImagePath,
    gallery: [publicImagePath],
    emi_starts_at: Math.round(app.selling_price / 24),
    specs: app.specs,
    highlights: app.highlights,
    variants
  }

  const res = await supabase.rpc('admin_create_product', { p_product: prodObj })
  if (res.error) {
    console.warn(`  ! RPC error for ${app.name}: ${res.error.message}. Attempting direct upsert...`)
    const { error: upsertErr } = await supabase.from('products').upsert(prodObj, { onConflict: 'id' })
    if (upsertErr) {
      console.error(`  ✗ Direct upsert failed for ${app.name}:`, upsertErr.message)
    } else {
      successCount++
      console.log(`  ✓ Direct upserted: ${app.name} (₹${app.selling_price})`)
    }
  } else {
    successCount++
    console.log(`  ✓ Inserted via RPC: ${app.name} (₹${app.selling_price})`)
  }
}

console.log(`\nSuccessfully imported ${successCount} of ${appliances.length} home appliances!`)

const { count: appCount } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })
  .eq('category_id', 'home-appliances')

console.log(`Total Home Appliances now in database: ${appCount}`)

const { count: overallCount } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })

console.log(`Total Products overall in database: ${overallCount}`)
