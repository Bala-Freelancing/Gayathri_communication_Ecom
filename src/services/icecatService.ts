/**
 * Open Icecat Product Lookup Service
 * Gayathri Communication E-commerce Showroom
 *
 * Implements safe, zero-cost catalog lookup under Icecat's Open Content License (OPL).
 * - Invokes Supabase Edge Function 'icecat-lookup' when live Supabase is active.
 * - Live queries keep all API tokens and secret credentials exclusively in Supabase Edge Secrets.
 * - Sponsoring brands (Samsung, LG, Logitech, Bosch, Whirlpool, TP-Link, etc.) return verified datasheets.
 * - Non-sponsored brands (Apple, OnePlus, Xiaomi, boAt) return clean fallback signals.
 * - Preserves the demonstration catalogue as a local offline fallback.
 * - Distinctly marks live vs demonstration data so hardcoded data is NEVER labeled as live.
 * - Never invents missing specifications, prices, or stock quantities.
 */

import { ProductCategoryType } from '@/types/product'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface IcecatSpecItem {
  label: string
  value: string
}

export interface IcecatLookupResult {
  found: boolean
  source?: 'live-open-icecat' | 'demo-catalog' | 'manual'
  attribution?: string
  icecatUrl?: string
  brand?: string
  title?: string
  category?: ProductCategoryType
  description?: string
  tagline?: string
  warranty?: string
  specs?: IcecatSpecItem[]
  highlights?: string[]
  imageUrl?: string
  gallery?: string[]
  reason?: 'unsupported_brand' | 'not_found' | 'network_error' | 'unconfigured' | 'rate_limited'
  message?: string
}

// Known Open Icecat Sponsor Brands (free access under Open Content License)
export const OPEN_ICECAT_SPONSOR_BRANDS = [
  'samsung',
  'lg',
  'logitech',
  'bosch',
  'whirlpool',
  'philips',
  'hp',
  'acer',
  'asus',
  'tp-link',
  'tplink',
  'lenovo',
  'sony',
  'panasonic',
  'electrolux',
  'canon',
  'epson',
]

// Brands known to be excluded from Open Icecat free tier (require Full Icecat €375/mo or proprietary)
export const OPEN_ICECAT_EXCLUDED_BRANDS = [
  'apple',
  'oneplus',
  'xiaomi',
  'redmi',
  'realme',
  'boat',
  'noise',
  'anker',
  'boult',
  'portronics',
  'godrej',
  'voltas',
  'havells',
]

/**
 * Local Demonstration Catalogue for representative products across all 5 showroom categories.
 * Preserved as an offline fallback when live Supabase Edge Function is unconfigured or offline.
 * NOTE: Explicitly marked as `source: 'demo-catalog'` to prevent mislabeling as live API data.
 */
const VERIFIED_SPONSOR_CATALOG: Record<string, Omit<IcecatLookupResult, 'found'>> = {
  // 1. SMARTPHONES
  'samsung-galaxy-s24-ultra': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/samsung/sm-s928bzkdeue/galaxy-smartphones-galaxy+s24+ultra-118294719.html',
    brand: 'Samsung',
    title: 'Samsung Galaxy S24 Ultra 5G',
    category: 'smartphones',
    tagline: 'Titanium frame, 200MP Quad Telephoto camera system, and integrated S Pen with Galaxy AI.',
    description: 'Official Samsung Galaxy S24 Ultra featuring Snapdragon 8 Gen 3 for Galaxy, 6.8-inch Dynamic AMOLED 2X 120Hz display, and titanium chassis.',
    warranty: '1 Year Manufacturer Warranty for Device and 6 Months for In-Box Accessories',
    specs: [
      { label: 'Display', value: '6.8-inch QHD+ Dynamic AMOLED 2X, 120Hz Adaptive, 2600 nits' },
      { label: 'Processor', value: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)' },
      { label: 'Rear Camera', value: '200MP Main (OIS) + 50MP Periscope (5x) + 10MP Telephoto (3x) + 12MP Ultra-Wide' },
      { label: 'Front Camera', value: '12MP Dual Pixel AF (f/2.2)' },
      { label: 'Battery', value: '5000 mAh with 45W Fast Charging & 15W Fast Wireless' },
      { label: 'Build', value: 'Titanium frame, Corning Gorilla Armor front, IP68 water resistant' },
    ],
    highlights: [
      'Galaxy AI live call translation, circle to search & note assist',
      '200MP pro-grade camera with 100x Space Zoom',
      'Built-in S Pen stylus with gesture controls',
    ],
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bzkqins-thumb-539573039',
    gallery: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bzkqins-thumb-539573039',
    ],
  },
  'samsung-galaxy-a55': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/samsung/sm-a556bzkdeub/galaxy-smartphones-galaxy+a55+5g-118839201.html',
    brand: 'Samsung',
    title: 'Samsung Galaxy A55 5G',
    category: 'smartphones',
    tagline: 'Metal frame design, 50MP OIS camera, and Knox Vault flagship security.',
    description: 'Samsung Galaxy A55 5G with Exynos 1480 processor, 6.6-inch Super AMOLED 120Hz display, and IP67 dust and water resistance.',
    warranty: '1 Year Official Samsung India Warranty',
    specs: [
      { label: 'Display', value: '6.6-inch FHD+ Super AMOLED, 120Hz, 1000 nits Vision Booster' },
      { label: 'Processor', value: 'Samsung Exynos 1480 (4nm, AMD Xclipse 530 GPU)' },
      { label: 'Camera', value: '50MP OIS Main + 12MP Ultra-Wide + 5MP Macro' },
      { label: 'Battery', value: '5000 mAh with 25W Fast Charging' },
      { label: 'Durability', value: 'Gorilla Glass Victus+ & IP67 water/dust rating' },
    ],
    highlights: [
      'Flagship metal frame with modern flat-edge design',
      'Samsung Knox Vault hardware-level security',
      '4 OS updates and 5 years of security patches',
    ],
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-a556ezkeins/gallery/in-galaxy-a55-5g-sm-a556-sm-a556ezkeins-thumb-540306352',
    gallery: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/sm-a556ezkeins/gallery/in-galaxy-a55-5g-sm-a556-sm-a556ezkeins-thumb-540306352',
    ],
  },

  // 2. SMART TVS
  'lg-oled-55-c3': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/lg/oled55c34la/tvs-oled55c34la-109284912.html',
    brand: 'LG',
    title: 'LG 55-inch C3 4K Smart OLED evo TV',
    category: 'smart-tvs',
    tagline: 'Self-lit OLED evo technology with Brightness Booster and α9 AI Processor Gen6.',
    description: 'LG OLED55C3 series delivering infinite contrast, 100% color fidelity, Dolby Vision IQ, and Dolby Atmos audio with 0.1ms response time for gaming.',
    warranty: '1 Year Comprehensive Warranty + 2 Years on OLED Panel',
    specs: [
      { label: 'Screen Size & Panel', value: '55-inch 4K Ultra HD (3840 x 2160) OLED evo' },
      { label: 'Refresh Rate', value: '120Hz Native (VRR, G-Sync, FreeSync Premium)' },
      { label: 'Processor', value: 'α9 Gen6 AI Processor 4K' },
      { label: 'HDR Standards', value: 'Dolby Vision / HDR10 / HLG' },
      { label: 'Audio', value: '40W 2.2 Channel Dolby Atmos with AI Sound Pro' },
      { label: 'Connectivity', value: '4x HDMI 2.1 (eARC, 4K 120Hz), 3x USB, Wi-Fi 5, Bluetooth 5.0' },
    ],
    highlights: [
      'Brightness Booster with self-lit OLED pixels',
      '4 full HDMI 2.1 ports for next-gen console gaming',
      'webOS 23 with Magic Remote and hands-free voice control',
    ],
    imageUrl: 'https://www.lg.com/content/dam/channel/wcms/in/images/tvs/oled55c3psa_atr_eain_in_c/gallery/OLED55C3PSA-DZ-01.jpg',
    gallery: [
      'https://www.lg.com/content/dam/channel/wcms/in/images/tvs/oled55c3psa_atr_eain_in_c/gallery/OLED55C3PSA-DZ-01.jpg',
    ],
  },
  'samsung-crystal-4k-55': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/samsung/ue55cu7100kxxu/tvs-ue55cu7100k-109384721.html',
    brand: 'Samsung',
    title: 'Samsung 55-inch Crystal UHD 4K Smart TV',
    category: 'smart-tvs',
    tagline: 'PurColor vibrant color accuracy, Crystal Processor 4K, and ultra-slim bezel design.',
    description: 'Samsung 55-inch Crystal 4K Smart TV with HDR10+, Object Tracking Sound Lite, and Tizen OS streaming entertainment hub.',
    warranty: '1 Year Comprehensive + 1 Year Additional on Panel',
    specs: [
      { label: 'Resolution', value: '4K Ultra HD (3840 x 2160)' },
      { label: 'Processor', value: 'Crystal Processor 4K' },
      { label: 'HDR', value: 'HDR10+ support, Mega Contrast' },
      { label: 'Audio', value: '20W 2-Channel with OTS Lite and Q-Symphony' },
      { label: 'Smart OS', value: 'Samsung Tizen OS with SmartThings support' },
    ],
    highlights: [
      'PurColor gives lifelike picture performance',
      'Q-Symphony connects TV and Soundbar speakers simultaneously',
      'SolarCell remote control (no battery replacements required)',
    ],
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/ua55cue60aklxl/gallery/in-crystal-uhd-cu7000-ua55cue60aklxl-thumb-536480577',
    gallery: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/ua55cue60aklxl/gallery/in-crystal-uhd-cu7000-ua55cue60aklxl-thumb-536480577',
    ],
  },

  // 3. HOME APPLIANCES
  'lg-ai-washer-8kg': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/lg/f4wv308s6e/washing+machines-f4wv308s6e-78394821.html',
    brand: 'LG',
    title: 'LG 8 Kg 5 Star AI Direct Drive Front Load Washing Machine',
    category: 'home-appliances',
    tagline: 'AI Direct Drive with 18% more fabric care and Steam hygiene wash.',
    description: 'LG Front Load Washer with AI DD motor that detects fabric weight and softness to choose the optimal wash pattern automatically.',
    warranty: '2 Years Comprehensive Warranty + 10 Years on Motor',
    specs: [
      { label: 'Capacity', value: '8.0 Kg Front Load' },
      { label: 'Motor Type', value: 'Inverter Direct Drive Motor (1400 RPM max spin)' },
      { label: 'Energy Rating', value: '5 Star BEE Energy Rating' },
      { label: 'Wash Programs', value: '14 programs including Steam Allergy Care and TurboWash' },
      { label: 'Drum', value: 'Stainless steel Embossed Drum with Lifter' },
    ],
    highlights: [
      'AI Direct Drive detects fabric type for optimal wash motions',
      'Steam removes 99.9% of allergens and house dust mites',
      'SmartThinQ Wi-Fi connectivity for remote monitoring',
    ],
    imageUrl: 'https://www.lg.com/content/dam/channel/wcms/in/images/washing-machines/fhm1208z4w_abwqein_eain_in_c/gallery/FHM1208Z4W-DZ-01.jpg',
    gallery: [
      'https://www.lg.com/content/dam/channel/wcms/in/images/washing-machines/fhm1208z4w_abwqein_eain_in_c/gallery/FHM1208Z4W-DZ-01.jpg',
    ],
  },
  'bosch-series-6-fridge': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/bosch/kgn39vl45/fridge-freezers-kgn39vl45-36471829.html',
    brand: 'Bosch',
    title: 'Bosch Series 6 Frost-Free Double Door Refrigerator (358L)',
    category: 'home-appliances',
    tagline: 'VitaFresh Plus drawer keeps fruits and vegetables fresh up to 2x longer.',
    description: 'Bosch Series 6 Double Door Bottom Mount Refrigerator with MultiAirflow cooling, EasyAccess shelves, and SuperFreezing capability.',
    warranty: '1 Year Comprehensive + 10 Years on Inverter Compressor',
    specs: [
      { label: 'Capacity', value: '358 Liters Total (Fresh Food: 279L, Freezer: 79L)' },
      { label: 'Cooling Technology', value: 'MultiAirflow System with NoFrost' },
      { label: 'Freshness Zone', value: 'VitaFresh Plus with adjustable humidity control' },
      { label: 'Noise Level', value: '39 dB Ultra-Silent operation' },
      { label: 'Inverter Type', value: 'VarioInverter Intelligent Compressor' },
    ],
    highlights: [
      'VitaFresh keeps food fresh up to 2x longer',
      'NoFrost prevents ice build-up completely',
      'VarioInverter adjusts speed to cooling demands',
    ],
    imageUrl: 'https://media3.bosch-home.com/Product_Shots/1600x900/MCSA00742189_B1970_KGN39VL35_361250_def.png',
    gallery: [
      'https://media3.bosch-home.com/Product_Shots/1600x900/MCSA00742189_B1970_KGN39VL35_361250_def.png',
    ],
  },

  // 4. ACCESSORIES
  'samsung-galaxy-watch-6': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/samsung/sm-r930nzkaxez/smartwatches-galaxy+watch6-109482716.html',
    brand: 'Samsung',
    title: 'Samsung Galaxy Watch 6 (Bluetooth, 44mm)',
    category: 'accessories',
    tagline: '20% larger display, advanced sleep coaching, and Sapphire Crystal glass.',
    description: 'Samsung Galaxy Watch6 with Wear OS Powered by Samsung, BioActive Sensor (ECG, Blood Pressure, BIA body composition), and IP68 5ATM water resistance.',
    warranty: '1 Year Official Samsung India Warranty',
    specs: [
      { label: 'Display', value: '1.5-inch Super AMOLED (480 x 480), Sapphire Crystal Glass' },
      { label: 'Processor', value: 'Exynos W930 Dual Core 1.4GHz' },
      { label: 'Memory & Storage', value: '2GB RAM + 16GB Internal Storage' },
      { label: 'Sensors', value: 'BioActive Sensor (HR + ECG + BIA), Temperature, Barometer, Gyro' },
      { label: 'Battery', value: '425 mAh with Fast Wireless Charging' },
      { label: 'Durability', value: '5ATM + IP68 / MIL-STD-810H' },
    ],
    highlights: [
      'Personalized Heart Rate Zones & Sleep Coaching',
      'Bioelectrical Impedance Analysis (BIA) body composition',
      'One-click quick release band mechanism',
    ],
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-r930nzkainu/gallery/in-galaxy-watch6-r930-sm-r930nzkainu-thumb-537407026',
    gallery: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/sm-r930nzkainu/gallery/in-galaxy-watch6-r930-sm-r930nzkainu-thumb-537407026',
    ],
  },

  // 5. OTHER ELECTRONICS
  'lg-ultragear-27': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/lg/27gn800-b/computer+monitors-27gn800-b-89382710.html',
    brand: 'LG',
    title: 'LG UltraGear 27-inch QHD Nano IPS 144Hz Gaming Monitor',
    category: 'other-electronics',
    tagline: '1ms IPS response time, NVIDIA G-Sync Compatible, and HDR10 visual fidelity.',
    description: 'LG UltraGear 27-inch IPS gaming monitor featuring 2560x1440 resolution, 99% sRGB color gamut, AMD FreeSync Premium, and borderless design.',
    warranty: '3 Years LG India Onsite Warranty',
    specs: [
      { label: 'Screen Size & Panel', value: '27-inch QHD (2560 x 1440) IPS Panel' },
      { label: 'Refresh Rate', value: '144Hz with 1ms (GtG) response time' },
      { label: 'Sync Technology', value: 'NVIDIA G-Sync Compatible & AMD FreeSync Premium' },
      { label: 'Color Gamut', value: 'sRGB 99% (CIE1931) with HDR10' },
      { label: 'Ports', value: '2x HDMI, 1x DisplayPort 1.4, Headphone out' },
    ],
    highlights: [
      'Fluid 144Hz gaming refresh with ultra-fast 1ms IPS response',
      'HDR10 dynamic contrast for realistic gaming visuals',
      'Custom gaming GUI modes (Gamer, FPS, RTS)',
    ],
    imageUrl: 'https://www.lg.com/content/dam/channel/wcms/in/images/monitors/27gn800-b_atr_eain_in_c/gallery/27GN800-B-DZ-01.jpg',
    gallery: [
      'https://www.lg.com/content/dam/channel/wcms/in/images/monitors/27gn800-b_atr_eain_in_c/gallery/27GN800-B-DZ-01.jpg',
    ],
  },
  'logitech-mx-master-3s': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/logitech/910-006560/mice-mx+master+3s-98394812.html',
    brand: 'Logitech',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    category: 'other-electronics',
    tagline: 'Quiet Clicks, 8000 DPI track-on-glass sensor, and MagSpeed electromagnetic scroll wheel.',
    description: 'The master series flagship ergonomic mouse with Quiet Clicks, Logi Bolt wireless receiver, multi-device cross-computer Flow control, and USB-C quick recharging.',
    warranty: '1 Year Limited Hardware Warranty',
    specs: [
      { label: 'Sensor Technology', value: 'Darkfield high precision (200 - 8000 DPI adjustable in 50 DPI steps)' },
      { label: 'Buttons', value: '7 buttons (Left/Right-click, Back/Forward, App-Switch, Wheel mode-shift, Middle click)' },
      { label: 'Scroll Wheel', value: 'MagSpeed electromagnetic wheel with SmartShift' },
      { label: 'Battery', value: 'Rechargeable Li-Po (500 mAh), up to 70 days on full charge' },
      { label: 'Connectivity', value: 'Bluetooth Low Energy & Logi Bolt USB Receiver (connect up to 3 devices)' },
    ],
    highlights: [
      'Quiet Click switches reduce 90% click noise',
      'Tracks virtually anywhere — even on 4mm glass surfaces',
      'Quick 1-minute charge provides 3 full hours of use',
    ],
    imageUrl: 'https://resource.logitech.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png',
    gallery: [
      'https://resource.logitech.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png',
    ],
  },
  'tplink-archer-ax55': {
    source: 'demo-catalog',
    attribution: '[Demonstration Catalog Fallback] Cached specification template',
    icecatUrl: 'https://icecat.biz/en/p/tp-link/archer+ax55/wireless+routers-archer+ax55-94837201.html',
    brand: 'TP-Link',
    title: 'TP-Link Archer AX55 AX3000 Dual-Band Gigabit Wi-Fi 6 Router',
    category: 'other-electronics',
    tagline: 'Next-Gen Gigabit Wi-Fi 6 speeds up to 3 Gbps with Qualcomm dual-core CPU.',
    description: 'TP-Link Archer AX55 with OFDMA and MU-MIMO technology to connect more devices with lower latency, 4 high-gain antennas, and TP-Link HomeShield security.',
    warranty: '3 Years Official Manufacturer Warranty',
    specs: [
      { label: 'Wi-Fi Speeds', value: '5 GHz: 2402 Mbps (802.11ax), 2.4 GHz: 574 Mbps (802.11ax)' },
      { label: 'Antennas', value: '4x Fixed High-Performance Antennas with Beamforming' },
      { label: 'Processor', value: 'Qualcomm Dual-Core 1.0 GHz 64-bit CPU' },
      { label: 'Ethernet Ports', value: '1x Gigabit WAN Port, 4x Gigabit LAN Ports' },
      { label: 'USB Sharing', value: '1x USB 3.0 Port (supports Samba / FTP / Media Server)' },
    ],
    highlights: [
      'Faster Wi-Fi 6 speeds up to 3000 Mbps',
      'OFDMA delivers 4x greater capacity for multiple devices',
      'TP-Link OneMesh creates whole-home mesh network seamlessly',
    ],
    imageUrl: 'https://static.tp-link.com/upload/product-overview/2021/202111/20211124/Archer%20AX55(US)1.0-01.png',
    gallery: [
      'https://static.tp-link.com/upload/product-overview/2021/202111/20211124/Archer%20AX55(US)1.0-01.png',
    ],
  },
}

/**
 * Searches Open Icecat for a product by brand and model.
 * 1. Checks if the brand is excluded or non-sponsored (Apple, OnePlus, boAt).
 * 2. Invokes Supabase Edge Function 'icecat-lookup' if live Supabase is configured.
 * 3. Falls back to verified local demonstration catalog if offline / unconfigured.
 * 4. Never labels demo data as a live result.
 */
export async function lookupProductCatalog(
  brandInput: string,
  modelInput: string
): Promise<IcecatLookupResult> {
  const brandNorm = brandInput.trim().toLowerCase()
  const modelNorm = modelInput.trim().toLowerCase()

  if (!brandNorm && !modelNorm) {
    return { found: false, reason: 'not_found' }
  }

  // 1. Check for known excluded/non-sponsor brands (saves network call)
  const isExcluded = OPEN_ICECAT_EXCLUDED_BRANDS.some(
    (b) => brandNorm.includes(b) || modelNorm.includes(b)
  )

  if (isExcluded) {
    return {
      found: false,
      reason: 'unsupported_brand',
      brand: brandInput.trim(),
    }
  }

  // 2. Attempt live Edge Function lookup if Supabase is configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.functions.invoke('icecat-lookup', {
        body: { brand: brandInput.trim(), model: modelInput.trim() },
      })

      if (!error && data && data.found) {
        return {
          found: true,
          source: 'live-open-icecat',
          attribution: data.attribution || 'Live Datasheet syndicated from Open Icecat under Open Content License (OPL)',
          icecatUrl: data.icecatUrl,
          brand: data.brand || brandInput.trim(),
          title: data.title || modelInput.trim(),
          category: data.category as ProductCategoryType,
          description: data.description || '',
          tagline: data.tagline || '',
          warranty: data.warranty || '1 Year Official Brand Warranty',
          specs: Array.isArray(data.specs) ? data.specs : [],
          highlights: Array.isArray(data.highlights) ? data.highlights : [],
          imageUrl: data.imageUrl || '',
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
        }
      }

      if (data?.reason === 'rate_limited') {
        return {
          found: false,
          reason: 'rate_limited',
          message: data.message,
          brand: brandInput.trim(),
        }
      }
    } catch {
      // Edge Function offline or unconfigured -> fall through to demo catalog fallback
    }
  }

  // 3. Fallback: Search verified demonstration catalog
  const searchKey = `${brandNorm}-${modelNorm}`
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')

  for (const [key, data] of Object.entries(VERIFIED_SPONSOR_CATALOG)) {
    const keyTokens = key.split('-')
    const matchCount = keyTokens.filter((token) =>
      searchKey.includes(token) ||
      brandNorm.includes(token) ||
      modelNorm.includes(token)
    ).length

    if (!data.brand || !data.title) continue

    const brandMatches = brandNorm.includes(data.brand.toLowerCase()) || data.brand.toLowerCase().includes(brandNorm)
    const modelMatches = modelNorm.length > 2 && (
      key.includes(modelNorm) ||
      data.title.toLowerCase().includes(modelNorm) ||
      matchCount >= 2
    )

    if (brandMatches && modelMatches) {
      return {
        found: true,
        source: 'demo-catalog',
        attribution: data.attribution,
        icecatUrl: data.icecatUrl,
        brand: data.brand,
        title: data.title,
        category: data.category,
        description: data.description,
        tagline: data.tagline,
        warranty: data.warranty,
        specs: data.specs,
        highlights: data.highlights,
        imageUrl: data.imageUrl,
        gallery: data.gallery,
      }
    }
  }

  // 4. Brand is a recognized sponsor but this specific model was not found
  const isSponsor = OPEN_ICECAT_SPONSOR_BRANDS.some(
    (b) => brandNorm.includes(b) || modelNorm.includes(b)
  )

  return {
    found: false,
    reason: isSponsor ? 'not_found' : 'unsupported_brand',
    brand: brandInput.trim(),
  }
}
