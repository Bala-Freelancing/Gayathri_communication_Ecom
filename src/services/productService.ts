import { Product, StoreInfo, ProductCategory, ProductCategoryType } from '@/types/product'
import {
  productsData as initialMockProducts,
  storeDetails,
  brandPartners,
  customerReviews,
  faqList,
} from '@/data/mockProducts'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Database } from '@/types/database'

type DbProductRow = Database['public']['Tables']['products']['Row']

export interface FeaturedHeroSlide {
  product: Product
  tag: string
  headline: string
  highlight: string
  subtext: string
  glowColor: string
  badgeColor: 'default' | 'gold' | 'discount' | 'glow'
  stat: string
}

export interface PriceHistoryRecord {
  id: string
  productId: string
  productName?: string
  oldOriginalPrice: number
  newOriginalPrice: number
  oldSellingPrice: number
  newSellingPrice: number
  changedByEmail: string | null
  changeReason: string | null
  changedAt: string
}

// In-memory reactive product cache initialized with mock data,
// then updated via Supabase queries and Realtime WebSocket events.
let cachedProducts: Product[] = [...initialMockProducts]
let isInitializedFromDb = false
let initError: string | null = null
const changeListeners = new Set<(products: Product[]) => void>()
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null

/**
 * Intelligently resolves a high-resolution showroom photography asset
 * for any product when image is missing or set to the default placeholder.
 */
export function resolveProductImage(
  currentImage?: string | null,
  name?: string | null,
  brand?: string | null,
  category?: string | null
): string {
  if (currentImage && !currentImage.includes('placeholder') && currentImage.trim() !== '') {
    return currentImage
  }

  const n = (name || '').toUpperCase()
  const b = (brand || '').toUpperCase()
  const c = (category || '').toLowerCase()

  // Neckband earphones
  if (
    n.includes('NECKBAND') ||
    n.includes('NECK BAND') ||
    n.includes('NB-10') ||
    n.includes('NB14') ||
    n.includes('HARMONICS')
  ) {
    return '/images/products/neckband-earphones.jpg'
  }

  // TWS & Earbuds
  if (
    n.includes('TWS') ||
    n.includes('BUDS') ||
    n.includes('EARPHONE') ||
    n.includes('AIRPOD') ||
    n.includes('HEADSET')
  ) {
    return '/images/products/airpods-pro-2.jpg'
  }

  // Portable Speakers & Audio Systems
  if (
    n.includes('SPEAKER') ||
    n.includes('SONO') ||
    n.includes('SOUND') ||
    n.includes('VIOGMATE')
  ) {
    return '/images/products/portable-speaker.jpg'
  }

  // Power Banks
  if (
    n.includes('POWER BANK') ||
    n.includes('POWERBANK') ||
    n.includes('XPB') ||
    n.includes('ZELLA')
  ) {
    return '/images/products/power-bank.jpg'
  }

  // Chargers, Adapters, Cables, Lithium Cell, Trimmer
  if (
    n.includes('CHARGER') ||
    n.includes('CHARGE') ||
    n.includes('ADAPTER') ||
    n.includes('ADAPTET') ||
    n.includes('CABLI') ||
    n.includes('CABLE') ||
    n.includes('CAR POWER') ||
    n.includes('USB') ||
    n.includes('LITHIUS') ||
    n.includes('TRIMMER')
  ) {
    return '/images/products/anker-65w-charger.jpg'
  }

  // Fans & Air Coolers
  if (
    n.includes('FAN') ||
    n.includes('COOLER') ||
    n.includes('ATRCOOLAR') ||
    n.includes('AIRCOOL') ||
    n.includes('TOOFAN')
  ) {
    return '/images/products/ceiling-fan.jpg'
  }

  // Air Conditioners
  if (
    n.includes('A/C') ||
    n.includes('ACNON') ||
    ((n.includes('BLUESTAR') || n.includes('CARRIER') || n.includes('DAIKIN') || n.includes('ELISTA')) &&
      !n.includes('REF') &&
      !n.includes('FAN'))
  ) {
    return '/images/products/split-ac.jpg'
  }

  // Refrigerators
  if (
    n.includes('REFRIGERATOR') ||
    n.includes('REF') ||
    n.includes('REFRIPLUS') ||
    n.includes('DC RR') ||
    n.includes('FF RT')
  ) {
    return '/images/products/samsung-fridge.jpg'
  }

  // Washing Machines
  if (n.includes('WASH') || n.includes('WASHING') || n.includes('WA70')) {
    return '/images/products/lg-washer.jpg'
  }

  // Tabletop Grinders & Stabilizers
  if (
    n.includes('GRINDER') ||
    n.includes('STABILIZER') ||
    n.includes('PREMIER') ||
    n.includes('V GUARD') ||
    n.includes('SYSCOM') ||
    n.includes('TRV20MAX')
  ) {
    return '/images/products/tplink-ax73-router.jpg'
  }

  // Smart TVs
  if (
    c === 'smart-tvs' ||
    c === 'tv' ||
    n.includes('TV') ||
    n.includes('QLED') ||
    n.includes('OLED') ||
    n.includes('LED X') ||
    n.includes('A32HD')
  ) {
    return '/images/products/sony-oled.jpg'
  }

  // Tablets
  if (c === 'tablets' || n.includes('PAD') || n.includes('TABLET')) {
    return '/images/products/lg-ultragear-monitor.jpg'
  }

  // Smart Watches
  if (n.includes('WATCH') || n.includes('SMARTWATCH')) {
    return '/images/products/galaxy-watch-6.jpg'
  }

  // Apple / iPhone
  if (
    b.includes('APPLE') ||
    n.includes('IPHONE') ||
    n.includes('IPHNOE') ||
    n.startsWith('I PHONE') ||
    n.startsWith('I 16') ||
    n.startsWith('I 15') ||
    n.startsWith('I 13') ||
    n.startsWith('I 14')
  ) {
    if (n.includes('15')) return '/images/products/iphone15.jpg'
    return '/images/products/iphone16.jpg'
  }

  // Samsung smartphones
  if (b.includes('SAMSUNG') && (c === 'smartphones' || c === 'mobiles' || n.includes('GALAXY'))) {
    return '/images/products/s24.jpg'
  }

  // Vivo smartphones
  if (n.includes('Y11')) return '/images/products/vivo/vivo_y11.webp'
  if (n.includes('Y21')) return '/images/products/vivo/vivo-y21.jpg'
  if (n.includes('Y31T')) return '/images/products/vivo/vivo-y31T.png'
  if (n.includes('Y31')) return '/images/products/vivo/vivo-y31.webp'
  if (n.includes('Y05')) return '/images/products/vivo/vivo-y05.webp'
  if (b.includes('VIVO') || n.includes('VIVO') || n.includes('VIVOT5X')) {
    return '/images/products/vivo-phone.jpg'
  }

  // Infinix smartphones & accessories
  if (n.includes('SMART 20')) return '/images/products/infinix/Infinix-smart-20.png'
  if (n.includes('HOT 60I')) return '/images/products/infinix/infinix-hot60i.webp'
  if (n.includes('HOT 60')) return '/images/products/infinix/infinix-hot60i.webp'
  if (n.includes('GT 30 PRO') || n.includes('GT30 PRO')) return '/images/products/infinix/Infinix GT 30-pro.jpg'
  if (n.includes('GT 30') || n.includes('GT30')) return '/images/products/infinix/infinix-gt30.webp'
  if (n.includes('NOTE EDGE')) return '/images/products/infinix/infinix-note-edge-2.jpg'
  if (n.includes('NOTE 60 PRO') || n.includes('NOTE 60')) return '/images/products/infinix/Infinix-Note-60-Pro.png'
  if (n.includes('HOT 70 PRO') || n.includes('HOT 70')) return '/images/products/infinix/infinix_hot70pro.webp'
  if (n.includes('X20') || (b.includes('INFINIX') && n.includes('SPEAKER'))) return '/images/products/infinix/infinix_speaker.webp'
  if (b.includes('INFINIX')) return '/images/products/infinix/Infinix-Note-60-Pro.png'

  // OnePlus
  if (b.includes('ONEPLUS') || n.includes('ONEPLUS') || n.includes('NORD')) {
    return '/images/products/oneplus12.jpg'
  }

  // Exact model mappings for Redmi and Xiaomi smartphones & tablets
  if (n.includes('REDMI A7 PRO')) return '/images/products/redmi/redmiA7pro.webp'
  if (n.includes('REDMI A7')) return '/images/products/redmi/redmiA7.webp'
  if (n.includes('REDMI 15A')) return '/images/products/redmi/redmi15a.webp'
  if (n.includes('REDMI 15C')) return '/images/products/redmi/redmi15c 5g.webp'
  if (n.includes('REDMI 17C')) return '/images/products/redmi/Redmi-17C.avif'
  if (n.includes('REDMI 15') && !n.includes('NOTE') && !n.includes('15A') && !n.includes('15C')) return '/images/products/redmi/redmi15_5g.webp'
  if (n.includes('REDMI 17') && !n.includes('NOTE') && !n.includes('17C')) return '/images/products/redmi/redmi17_5g.webp'
  if (n.includes('NOTE 15 PRO+')) return '/images/products/redmi/redmi_note15pro+.webp'
  if (n.includes('NOTE 15 PRO')) return '/images/products/redmi/redmi_note15pro.webp'
  if (n.includes('NOTE 15')) return '/images/products/redmi/redmi_note15.webp'
  if (n.includes('NOTE 17 PRO MAX')) return '/images/products/redmi/redmi_note17pro_max.webp'
  if (n.includes('NOTE 17 PRO')) return '/images/products/redmi/redmi-note-17-pro.jpg'
  if (n.includes('NOTE 17')) return '/images/products/redmi/redmi-note-17.webp'
  if (n.includes('TURBO 5')) return '/images/products/redmi/redmi-turbo-5.webp'
  if (n.includes('XIAOMI 17 ULTRA')) return '/images/products/redmi/xiaomi-17-ultra.avif'
  if (n.includes('XIAOMI 17')) return '/images/products/redmi/xiaomi_17.webp'
  if (n.includes('REDMI PAD 2 PRO')) return '/images/products/redmi/redmi_pad2pro.webp'
  if (n.includes('REDMI PAD 2') && n.includes('CELLULAR')) return '/images/products/redmi/redmi_pad2_wifi+cellular.webp'
  if (n.includes('REDMI PAD 2')) return '/images/products/redmi/redmi_pad2_wifi.webp'
  if (n.includes('XIAOMI PAD 8') && n.includes('PEN')) return '/images/products/redmi/xiaomi_pad8_wifi-pen.webp'
  if (n.includes('XIAOMI PAD 8')) return '/images/products/redmi/Xiaomi-pad-8-wifi.webp'

  // Xiaomi Smart TVs & Displays
  if (n.includes('MINI LED') && n.includes('75')) return '/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 75 2026.jpg'
  if (n.includes('MINI LED') && n.includes('65')) return '/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 65 2026.jpg'
  if (n.includes('MINI LED') && n.includes('55')) return '/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 55 2026.jpg'
  if (n.includes('X PRO 75')) return '/images/products/xiaomi-tv/QLED TV X Pro 75 2026.webp'
  if (n.includes('X PRO 65')) return '/images/products/xiaomi-tv/QLED TV X Pro 65 2025.webp'
  if (n.includes('X PRO 55')) return '/images/products/xiaomi-tv/QLED TV X Pro 55 2025.jpg'
  if (n.includes('X PRO 43')) return '/images/products/xiaomi-tv/QLED TV X Pro 43 2025.jpg'
  if (n.includes('TV X 55') || n.includes('X 55 4K')) return '/images/products/xiaomi-tv/Xiaomi TV X 55 2025.webp'
  if (n.includes('TV X 43') || n.includes('X 43 4K')) return '/images/products/xiaomi-tv/Xiaomi TV X 43 2025.jpg'
  if (n.includes('A 43 FHD')) return '/images/products/xiaomi-tv/A 43 FHD 2025.jpg'
  if (n.includes('A PRO 32')) return '/images/products/xiaomi-tv/QLED TV A Pro 32 2025.png'
  if (n.includes('A 32')) return '/images/products/xiaomi-tv/Xiaomi A 32 2025.jpg'
  if (c === 'smart-tvs' || c === 'tv') return '/images/hero-tv.jpg'

  // Android Smartphones (Redmi, Poco, Infinix, Nothing, Moto, Realme, etc.)
  if (
    c === 'smartphones' ||
    c === 'mobiles' ||
    n.includes('REDMI') ||
    n.includes('POCO') ||
    n.includes('INFINIX') ||
    n.includes('HOT') ||
    n.includes('NOTE') ||
    n.includes('SMART') ||
    n.includes('GT') ||
    n.includes('NOTHING') ||
    n.includes('MOTO') ||
    n.includes('REALME')
  ) {
    return '/images/products/redmi-phone.jpg'
  }

  // Fallbacks by category
  if (c === 'accessories') return '/images/products/neckband-earphones.jpg'
  if (c === 'home-appliances') return '/images/products/split-ac.jpg'
  if (c === 'smart-tvs' || c === 'tv') return '/images/products/sony-oled.jpg'
  if (c === 'smartphones' || c === 'mobiles') return '/images/products/redmi-phone.jpg'
  if (c === 'other-electronics' || c === 'tablets') return '/images/products/lg-ultragear-monitor.jpg'

  // Preserved official showroom fallback for products that cannot be resolved
  return '/images/placeholder-product.svg'
}

/**
 * Derives a secondary gallery image for hover / thumbnail preview
 */
export function getProductSecondaryImage(primaryImage: string): string {
  switch (primaryImage) {
    case '/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 75 2026.jpg':
    case '/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 65 2026.jpg':
    case '/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 55 2026.jpg':
    case '/images/products/xiaomi-tv/QLED TV X Pro 75 2026.webp':
    case '/images/products/xiaomi-tv/QLED TV X Pro 65 2025.webp':
    case '/images/products/xiaomi-tv/QLED TV X Pro 55 2025.jpg':
    case '/images/products/xiaomi-tv/QLED TV X Pro 43 2025.jpg':
    case '/images/products/xiaomi-tv/Xiaomi TV X 55 2025.webp':
    case '/images/products/xiaomi-tv/Xiaomi TV X 43 2025.jpg':
    case '/images/products/xiaomi-tv/A 43 FHD 2025.jpg':
    case '/images/products/xiaomi-tv/QLED TV A Pro 32 2025.png':
    case '/images/products/xiaomi-tv/Xiaomi A 32 2025.jpg':
      return '/images/hero-tv.jpg'
    case '/images/products/vivo-phone.jpg':
    case '/images/products/redmi-phone.jpg':
    case '/images/products/iphone16.jpg':
    case '/images/products/s24.jpg':
    case '/images/products/oneplus12.jpg':
      return '/images/hero-phone.jpg'
    case '/images/products/sony-oled.jpg':
      return '/images/hero-tv.jpg'
    case '/images/products/home-appliances/samsung_236l_camellia_blue_refrigerator.webp':
    case '/images/products/home-appliances/bluestar_1_5ton_split_ac_fb218vxu.jpeg':
    case '/images/products/home-appliances/carrier_1_5ton_inverter_split_ac.png':
    case '/images/products/home-appliances/bluestar_water_dispenser_bwd3fmrga.png':
    case '/images/products/home-appliances/crompton_duro_one_table_top_wet_grinder.jpeg':
    case '/images/products/split-ac.jpg':
    case '/images/products/samsung-fridge.jpg':
    case '/images/products/lg-washer.jpg':
    case '/images/products/ceiling-fan.jpg':
      return '/images/hero-appliance.jpg'
    case '/images/products/neckband-earphones.jpg':
      return '/images/products/airpods-pro-2.jpg'
    case '/images/products/airpods-pro-2.jpg':
      return '/images/products/neckband-earphones.jpg'
    case '/images/products/portable-speaker.jpg':
      return '/images/products/airpods-pro-2.jpg'
    case '/images/products/power-bank.jpg':
      return '/images/products/anker-65w-charger.jpg'
    case '/images/products/anker-65w-charger.jpg':
      return '/images/products/power-bank.jpg'
    default:
      return primaryImage
  }
}

/**
 * Maps a Supabase products table row into the application Product type
 */
export const mapDbRowToProduct = (row: DbProductRow): Product => {
  const resolvedImage = resolveProductImage(row.image, row.name, row.brand, row.category_id)
  const secondaryImage = getProductSecondaryImage(resolvedImage)

  const rawGallery = Array.isArray(row.gallery) ? (row.gallery as string[]) : []
  const hasValidCustomGallery =
    rawGallery.length > 0 &&
    typeof rawGallery[0] === 'string' &&
    !rawGallery[0].includes('placeholder')

  const resolvedGallery = hasValidCustomGallery
    ? rawGallery
    : secondaryImage !== resolvedImage
    ? [resolvedImage, secondaryImage]
    : [resolvedImage]

  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || row.description || '',
    description: row.description || row.tagline || '',
    brand: row.brand,
    category: row.category_id as ProductCategoryType,
    badge: row.badge || undefined,
    isBestSeller: Boolean(row.is_best_seller),
    isNewLaunch: Boolean(row.is_new_launch),
    isDealOfTheDay: Boolean(row.is_deal_of_the_day),
    originalPrice: Number(row.original_price),
    price: Number(row.selling_price),
    rating: Number(row.rating),
    reviewCount: row.review_count,
    image: resolvedImage,
    gallery: resolvedGallery,
    emiStartsAt: Number(row.emi_starts_at) > 0
      ? Number(row.emi_starts_at)
      : Math.round(Number(row.selling_price) / 24),
    warranty: row.warranty || '1 Year Official Brand Warranty',
    inStock: Boolean(row.in_stock) && row.stock_quantity > 0,
    stockQuantity: row.stock_quantity,
    sku: row.sku,
    specs: Array.isArray(row.specs) ? (row.specs as any) : [],
    highlights: Array.isArray(row.highlights) ? (row.highlights as any) : [],
    variants: Array.isArray(row.variants) ? (row.variants as any) : undefined,
  }
}

/**
 * Product & Store Service Layer
 * Isolates data access and synchronizes live price updates via Supabase
 */
export const productService = {
  /**
   * Check whether live Supabase database is active
   */
  isLiveDatabase: (): boolean => {
    return isSupabaseConfigured()
  },

  /**
   * Status of initial database loading
   */
  getInitializationStatus: () => {
    return {
      isInitialized: isInitializedFromDb,
      error: initError,
      isLive: isSupabaseConfigured(),
    }
  },

  /**
   * Subscribe to live product/price updates
   */
  subscribeToChanges: (callback: (products: Product[]) => void): (() => void) => {
    changeListeners.add(callback)
    return () => {
      changeListeners.delete(callback)
    }
  },

  /**
   * Notify all local subscribers when products change
   */
  notifyListeners: () => {
    changeListeners.forEach((listener) => {
      try {
        listener([...cachedProducts])
      } catch (err) {
        console.error('Error in product change listener:', err)
      }
    })
  },

  /**
   * Fetch all active products asynchronously from Supabase,
   * updating internal cache and notifying subscribers.
   */
  fetchProducts: async (): Promise<{ data: Product[]; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return { data: cachedProducts, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        initError = error.message
        return { data: cachedProducts, error: error.message }
      }

      if (data) {
        const remoteProducts = data.map(mapDbRowToProduct)
        cachedProducts = remoteProducts
        isInitializedFromDb = true
        initError = null
        productService.notifyListeners()
      }

      return { data: cachedProducts, error: null }
    } catch (err: any) {
      initError = err?.message || 'Failed to fetch products'
      return { data: cachedProducts, error: initError }
    }
  },

  /**
   * Fetch ALL products including inactive ones (for Admin view)
   */
  fetchAllProductsAdmin: async (): Promise<{ data: (Product & { sku: string; stockQuantity: number; isActive: boolean; updatedAt: string })[]; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      // Mock admin projection
      const mockAdmin = cachedProducts.map((p, idx) => ({
        ...p,
        sku: `GC-${p.brand.substring(0, 3).toUpperCase()}-${idx + 100}`,
        stockQuantity: p.inStock ? 10 : 0,
        isActive: true,
        updatedAt: new Date().toISOString(),
      }))
      return { data: mockAdmin, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return { data: [], error: error.message }
      }

      const mapped = data.map((row) => ({
        ...mapDbRowToProduct(row),
        sku: row.sku,
        stockQuantity: row.stock_quantity,
        isActive: row.is_active,
        updatedAt: row.updated_at,
      }))

      const remoteCategories = new Set(mapped.map((p) => p.category))
      const unseededAdmin = initialMockProducts
        .filter((p) => !remoteCategories.has(p.category))
        .map((p, idx) => ({
          ...p,
          sku: `GC-${p.brand.substring(0, 3).toUpperCase()}-${idx + 200}`,
          stockQuantity: p.inStock ? 10 : 0,
          isActive: true,
          updatedAt: new Date().toISOString(),
        }))

      return { data: [...mapped, ...unseededAdmin], error: null }
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to fetch admin products' }
    }
  },

  /**
   * Retrieve all current products synchronously (preserves storefront performance)
   */
  getAllProducts: (): Product[] => {
    return cachedProducts
  },

  /**
   * Retrieve a product safely by its unique ID
   */
  getProductById: (id: string): Product | undefined => {
    return cachedProducts.find((p) => p.id === id)
  },

  /**
   * Retrieve products by category
   */
  getProductsByCategory: (category: ProductCategory): Product[] => {
    if (category === 'all') return cachedProducts
    return cachedProducts.filter((p) => p.category === category)
  },

  /**
   * Retrieve products by brand
   */
  getProductsByBrand: (brand: string): Product[] => {
    if (brand.toLowerCase() === 'all') return cachedProducts
    return cachedProducts.filter((p) => p.brand.toLowerCase() === brand.toLowerCase())
  },

  /**
   * Get Deal of the Day product safely
   */
  getDealOfTheDay: (): Product => {
    const deal = cachedProducts.find((p) => p.isDealOfTheDay)
    return deal || cachedProducts[0]
  },

  /**
   * Get curated hero slides safely with explicit product lookups and fallback protection
   */
  /**
   * Get curated hero slides safely with explicit product lookups and fallback protection
   */
  getHeroSlides: (productList?: Product[]): FeaturedHeroSlide[] => {
    const list = productList && productList.length > 0 ? productList : cachedProducts
    const iphone = list.find((p) => p.id === 'iphone-16-pro') || list.find((p) => p.brand.toLowerCase() === 'apple' || p.category === 'smartphones') || list[0]
    const sonyTv = list.find((p) => p.id === 'sony-bravia-oled') || list.find((p) => p.category === 'smart-tvs') || list[1] || list[0]
    const lgWasher = list.find((p) => p.id === 'lg-washer-ai') || list.find((p) => p.category === 'home-appliances') || list[2] || list[0]

    const slides: FeaturedHeroSlide[] = [
      {
        product: iphone,
        tag: 'FLAGSHIP LAUNCH',
        headline: 'The Ultimate Titanium Beast.',
        highlight: 'Apple iPhone 16 Pro Max',
        subtext: 'Engineered with Grade 5 Titanium, A18 Pro processor, 48MP Fusion Camera, and Apple Intelligence. In stock at Gayathri Communication.',
        glowColor: 'rgba(14, 165, 233, 0.25)',
        badgeColor: 'default',
        stat: 'Official Brand Warranty & GST Invoice',
      },
      {
        product: sonyTv,
        tag: 'THEATER AT HOME',
        headline: 'Cognitive Intelligence. Pure OLED Contrast.',
        highlight: 'Sony BRAVIA XR 65" 4K OLED',
        subtext: 'Experience cinema-grade immersion with Acoustic Surface Audio+, XR Contrast Pro, and HDMI 2.1 4K 120Hz for PlayStation 5.',
        glowColor: 'rgba(245, 158, 11, 0.25)',
        badgeColor: 'gold',
        stat: `Save ₹${sonyTv ? (sonyTv.originalPrice - sonyTv.price).toLocaleString('en-IN') : '39,910'} with Festive Offer`,
      },
      {
        product: lgWasher,
        tag: 'SMART LIVING',
        headline: 'AI Fabric Intelligence with TurboWash 360°.',
        highlight: 'LG AI Inverter Front-Load',
        subtext: 'Intelligent fabric protection with Steam allergy elimination, 5-Star BEE energy savings, and 10-year direct-drive motor warranty.',
        glowColor: 'rgba(16, 185, 129, 0.25)',
        badgeColor: 'discount',
        stat: 'Authorized Brand Installation Included',
      },
    ]
    return slides.filter((slide) => Boolean(slide.product))
  },

  /**
   * Fetch variants for a product or all products
   */
  fetchProductVariants: async (
    productId?: string
  ): Promise<{ data: any[]; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      // Mock variants for local demo
      const mockVariants = [
        { id: 'var-ip16-256', product_id: 'iphone-16-pro', sku: 'GC-APL-IP16PM-256', variant_attributes: { Storage: '256 GB' }, original_price: 144900, selling_price: 139900, stock_quantity: 8, is_active: true },
        { id: 'var-ip16-512', product_id: 'iphone-16-pro', sku: 'GC-APL-IP16PM-512', variant_attributes: { Storage: '512 GB' }, original_price: 164900, selling_price: 159900, stock_quantity: 4, is_active: true },
        { id: 'var-ip16-1tb', product_id: 'iphone-16-pro', sku: 'GC-APL-IP16PM-1TB', variant_attributes: { Storage: '1 TB' }, original_price: 184900, selling_price: 179900, stock_quantity: 2, is_active: true },
        { id: 'var-s24-256', product_id: 'samsung-s24-ultra', sku: 'GC-SAM-S24U-256', variant_attributes: { Storage: '256 GB' }, original_price: 134999, selling_price: 124999, stock_quantity: 12, is_active: true },
        { id: 'var-s24-512', product_id: 'samsung-s24-ultra', sku: 'GC-SAM-S24U-512', variant_attributes: { Storage: '512 GB' }, original_price: 144999, selling_price: 134999, stock_quantity: 6, is_active: true },
        { id: 'var-sny-55', product_id: 'sony-bravia-oled', sku: 'GC-SNY-XR55A80L', variant_attributes: { "Screen Size": '55 Inch' }, original_price: 199900, selling_price: 169990, stock_quantity: 3, is_active: true },
        { id: 'var-sny-65', product_id: 'sony-bravia-oled', sku: 'GC-SNY-XR65A80L', variant_attributes: { "Screen Size": '65 Inch' }, original_price: 249900, selling_price: 209990, stock_quantity: 5, is_active: true },
      ]
      const filtered = productId ? mockVariants.filter(v => v.product_id === productId) : mockVariants
      return { data: filtered, error: null }
    }

    try {
      let query = supabase.from('product_variants').select('*').order('created_at')
      if (productId) {
        query = query.eq('product_id', productId)
      }
      const { data, error } = await query
      if (error) return { data: [], error: error.message }
      return { data: data || [], error: null }
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to fetch variants' }
    }
  },

  /**
   * Update single product or variant price via secure database function with price_history audit trail
   */
  updateProductPrice: async (
    productId: string,
    newOriginalPrice: number,
    newSellingPrice: number,
    reason: string = 'Manual price adjustment',
    variantId?: string | null
  ): Promise<{ success: boolean; error: string | null }> => {
    // Basic frontend sanity checks
    if (newOriginalPrice < 0 || newSellingPrice < 0) {
      return { success: false, error: 'Prices cannot be negative.' }
    }
    if (newSellingPrice > newOriginalPrice) {
      return { success: false, error: 'Selling price cannot exceed MRP / Original Price.' }
    }

    if (isSupabaseConfigured()) {
      try {
        // Execute the atomic security definer stored procedure
        const { error } = await supabase.rpc('update_product_price', {
          p_product_id: productId,
          p_new_original_price: newOriginalPrice,
          p_new_selling_price: newSellingPrice,
          p_reason: reason,
          p_variant_id: variantId || null,
        })

        if (error) {
          return { success: false, error: error.message }
        }

        // Fetch fresh copy from Supabase to guarantee client consistency
        await productService.fetchProducts()
        return { success: true, error: null }
      } catch (err: any) {
        return { success: false, error: err?.message || 'Database error occurred' }
      }
    } else {
      // Local fallback for offline / prototyping mode
      cachedProducts = cachedProducts.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            originalPrice: newOriginalPrice,
            price: newSellingPrice,
            emiStartsAt: Math.round(newSellingPrice / 24),
          }
        }
        return p
      })
      productService.notifyListeners()
      return { success: true, error: null }
    }
  },

  /**
   * Update variant price specifically
   */
  updateVariantPrice: async (
    productId: string,
    variantId: string,
    newOriginalPrice: number,
    newSellingPrice: number,
    reason: string = 'Variant price adjustment'
  ): Promise<{ success: boolean; error: string | null }> => {
    return productService.updateProductPrice(
      productId,
      newOriginalPrice,
      newSellingPrice,
      reason,
      variantId
    )
  },

  /**
   * Update multiple product prices in a batch with transactional consistency
   */
  bulkUpdatePrices: async (
    updates: { productId: string; originalPrice: number; sellingPrice: number; variantId?: string }[],
    reason: string = 'Bulk price revision'
  ): Promise<{ success: boolean; updatedCount: number; errors: string[] }> => {
    if (updates.length === 0) {
      return { success: true, updatedCount: 0, errors: [] }
    }

    // Try batch atomic RPC in Supabase first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('update_product_prices_bulk', {
          p_updates: updates,
          p_reason: reason,
        })

        if (!error && (data as any)?.success) {
          await productService.fetchProducts()
          return {
            success: true,
            updatedCount: (data as any)?.updated_count || updates.length,
            errors: [],
          }
        }
      } catch {
        // Fall back to iterative execution if the bulk RPC is not available
      }
    }

    const errors: string[] = []
    let updatedCount = 0

    for (const update of updates) {
      const res = await productService.updateProductPrice(
        update.productId,
        update.originalPrice,
        update.sellingPrice,
        reason,
        update.variantId
      )
      if (res.success) {
        updatedCount++
      } else if (res.error) {
        errors.push(`Product ${update.productId}: ${res.error}`)
      }
    }

    return {
      success: errors.length === 0,
      updatedCount,
      errors,
    }
  },

  /**
   * Fetch price change audit logs
   */
  fetchPriceHistory: async (productId?: string): Promise<{ data: PriceHistoryRecord[]; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    try {
      let query = supabase
        .from('price_history')
        .select('*')
        .order('changed_at', { ascending: false })

      if (productId) {
        query = query.eq('product_id', productId)
      }

      const { data, error } = await query.limit(50)

      if (error) {
        return { data: [], error: error.message }
      }

      const records: PriceHistoryRecord[] = (data || []).map((row) => ({
        id: row.id,
        productId: row.product_id,
        oldOriginalPrice: Number(row.old_original_price),
        newOriginalPrice: Number(row.new_original_price),
        oldSellingPrice: Number(row.old_selling_price),
        newSellingPrice: Number(row.new_selling_price),
        changedByEmail: row.changed_by_email,
        changeReason: row.change_reason,
        changedAt: row.changed_at,
      }))

      return { data: records, error: null }
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to fetch price history' }
    }
  },

  /**
   * Toggle product active status (Admin)
   */
  toggleProductActive: async (productId: string, isActive: boolean): Promise<{ success: boolean; error: string | null }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ is_active: isActive, updated_at: new Date().toISOString() })
          .eq('id', productId)

        if (error) return { success: false, error: error.message }
        await productService.fetchProducts()
        return { success: true, error: null }
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to toggle status' }
      }
    } else {
      // Local demo mode
      cachedProducts = cachedProducts.map((p) => (p.id === productId ? { ...p, inStock: isActive } : p))
      productService.notifyListeners()
      return { success: true, error: null }
    }
  },

  /**
   * Delete a single product from inventory (Admin)
   */
  deleteProduct: async (productId: string): Promise<{ success: boolean; error: string | null }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error: rpcError } = await supabase.rpc('admin_delete_product', { p_product_id: productId })
        if (rpcError) {
          const { error } = await supabase.from('products').delete().eq('id', productId)
          if (error) {
            console.warn('Direct delete warning:', error.message)
          }
        }
      } catch (err: any) {
        console.warn('Database delete warning:', err?.message)
      }
    }

    cachedProducts = cachedProducts.filter((p) => p.id !== productId)
    productService.notifyListeners()
    return { success: true, error: null }
  },

  /**
   * Clear all product stocks from inventory (Admin)
   */
  clearAllProducts: async (): Promise<{ success: boolean; error: string | null }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error: rpcError } = await supabase.rpc('clear_all_products')
        if (rpcError) {
          const { error } = await supabase.from('products').delete().neq('id', '')
          if (error) {
            console.warn('Direct clear warning:', error.message)
          }
        }
      } catch (err: any) {
        console.warn('Database clear warning:', err?.message)
      }
    }

    cachedProducts = []
    productService.notifyListeners()
    return { success: true, error: null }
  },

  /**
   * Update product stock quantity and in_stock status (Admin)
   */
  updateProductStock: async (productId: string, stockQuantity: number): Promise<{ success: boolean; error: string | null }> => {
    if (stockQuantity < 0) {
      return { success: false, error: 'Stock quantity cannot be negative.' }
    }
    const inStock = stockQuantity > 0

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ 
            stock_quantity: stockQuantity, 
            in_stock: inStock,
            updated_at: new Date().toISOString() 
          })
          .eq('id', productId)

        if (error) return { success: false, error: error.message }
        await productService.fetchProducts()
        return { success: true, error: null }
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to update stock' }
      }
    } else {
      // Local demo mode
      cachedProducts = cachedProducts.map((p) => {
        if (p.id === productId) {
          return { ...p, inStock }
        }
        return p
      })
      productService.notifyListeners()
      return { success: true, error: null }
    }
  },

  /**
   * Update general product details (specs, warranty, variants, etc.) (Admin)
   */
  updateProductDetails: async (
    productId: string, 
    details: { 
      name?: string; 
      brand?: string; 
      warranty?: string; 
      tagline?: string; 
      inStock?: boolean;
      variants?: any[];
      sellingPrice?: number;
      originalPrice?: number;
      stockQuantity?: number;
    }
  ): Promise<{ success: boolean; error: string | null }> => {
    if (isSupabaseConfigured()) {
      try {
        const payload: any = { updated_at: new Date().toISOString() }
        if (details.name !== undefined) payload.name = details.name
        if (details.brand !== undefined) payload.brand = details.brand
        if (details.warranty !== undefined) payload.warranty = details.warranty
        if (details.tagline !== undefined) payload.tagline = details.tagline
        if (details.inStock !== undefined) payload.in_stock = details.inStock
        if (details.sellingPrice !== undefined) payload.selling_price = details.sellingPrice
        if (details.originalPrice !== undefined) payload.original_price = details.originalPrice
        if (details.stockQuantity !== undefined) payload.stock_quantity = details.stockQuantity

        if (details.variants !== undefined) {
          payload.variants = details.variants
          if (Array.isArray(details.variants) && details.variants.length > 0) {
            const validPrices = details.variants.map((v: any) => Number(v.price)).filter((p) => !isNaN(p) && p > 0)
            if (validPrices.length > 0) {
              const minPrice = Math.min(...validPrices)
              payload.selling_price = minPrice
              const matchedVar = details.variants.find((v: any) => Number(v.price) === minPrice)
              if (matchedVar?.originalPrice && Number(matchedVar.originalPrice) >= minPrice) {
                payload.original_price = Number(matchedVar.originalPrice)
              }
            }
            const totalStock = details.variants.reduce((acc: number, v: any) => acc + (Number(v.stockQuantity) || 0), 0)
            payload.stock_quantity = totalStock
            payload.in_stock = totalStock > 0
          }
        }

        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', productId)

        if (error) {
          // Fallback to admin RPC if direct update had RLS issues
          console.warn('Direct update error, trying fetch refresh:', error.message)
        }
        await productService.fetchProducts()
        return { success: true, error: null }
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to update product details' }
      }
    } else {
      cachedProducts = cachedProducts.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            ...(details.name !== undefined && { name: details.name }),
            ...(details.brand !== undefined && { brand: details.brand }),
            ...(details.warranty !== undefined && { warranty: details.warranty }),
            ...(details.tagline !== undefined && { tagline: details.tagline }),
            ...(details.inStock !== undefined && { inStock: details.inStock }),
            ...(details.variants !== undefined && { variants: details.variants }),
            ...(details.sellingPrice !== undefined && { price: details.sellingPrice }),
            ...(details.originalPrice !== undefined && { originalPrice: details.originalPrice }),
            ...(details.stockQuantity !== undefined && { stockQuantity: details.stockQuantity }),
          }
        }
        return p
      })
      productService.notifyListeners()
      return { success: true, error: null }
    }
  },

  /**
   * Initialize Supabase Realtime channel for live storefront price synchronization
   */
  initRealtimeSync: (): (() => void) => {
    if (!isSupabaseConfigured()) {
      return () => {}
    }

    // Initial fetch on mount
    productService.fetchProducts()

    // Ensure a single persistent Realtime channel across React StrictMode remounts
    if (!realtimeChannel) {
      const channelName = `storefront_products_${Math.random().toString(36).slice(2, 9)}`
      realtimeChannel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
          },
          async () => {
            // Re-fetch and propagate updated prices instantly across active browser tabs
            await productService.fetchProducts()
          }
        )
        .subscribe()
    }

    return () => {
      // Channel persists across component remounts for continuous real-time sync
    }
  },

  /**
   * Store metadata & contact details
   */
  getStoreDetails: (): StoreInfo => {
    return storeDetails
  },

  /**
   * Authorized Brand Partners
   */
  getBrandPartners: () => {
    return brandPartners
  },

  /**
   * Customer testimonials
   */
  getCustomerReviews: () => {
    return customerReviews
  },

  /**
   * Frequently Asked Questions
   */
  getFaqList: () => {
    return faqList
  },

  /**
   * Detect likely duplicate products based on name, brand, or normalized model
   */
  checkDuplicateProduct: (name: string, brand: string): { isDuplicate: boolean; matchedProduct?: Product } => {
    const cleanName = name.trim().toLowerCase()
    const cleanBrand = brand.trim().toLowerCase()

    if (!cleanName || cleanName.length < 3) {
      return { isDuplicate: false }
    }

    const matched = cachedProducts.find((p) => {
      const pName = p.name.toLowerCase()
      const pBrand = p.brand.toLowerCase()

      // Exact name match
      if (pName === cleanName) return true

      // Same brand and one name contains the other
      if (cleanBrand && pBrand === cleanBrand) {
        if (pName.includes(cleanName) || cleanName.includes(pName)) {
          return true
        }
      }

      return false
    })

    if (matched) {
      return { isDuplicate: true, matchedProduct: matched }
    }

    return { isDuplicate: false }
  },

  /**
   * Add new product to showroom stock
   * Persists to Supabase `products` table if configured, updates local cache,
   * and triggers reactive updates across all views.
   */
  createProduct: async (input: {
    name: string
    brand: string
    category: ProductCategoryType
    tagline?: string
    description?: string
    sellingPrice: number
    originalPrice?: number
    stockQuantity: number
    warranty?: string
    badge?: string
    image: string
    gallery?: string[]
    specs?: { label: string; value: string }[]
    highlights?: string[]
    variants?: any[]
  }): Promise<{ success: boolean; product?: Product; sku?: string; error: string | null }> => {
    // 1. Validate mandatory financial and stock parameters
    if (!input.name.trim()) {
      return { success: false, error: 'Product name is required.' }
    }
    if (!input.brand.trim()) {
      return { success: false, error: 'Brand name is required.' }
    }
    if (typeof input.sellingPrice !== 'number' || input.sellingPrice <= 0) {
      return { success: false, error: 'Selling price must be a positive number.' }
    }
    if (typeof input.stockQuantity !== 'number' || input.stockQuantity < 0) {
      return { success: false, error: 'Stock quantity cannot be negative.' }
    }
    if (input.image && input.image.startsWith('data:')) {
      return {
        success: false,
        error: 'Raw Base64 image data is not permitted in database. Product images must be uploaded to permanent cloud storage or use a valid URL/path.',
      }
    }

    const variantsFinal = Array.isArray(input.variants) ? input.variants : []
    let effectiveSellingPrice = input.sellingPrice
    let effectiveStockQuantity = input.stockQuantity

    if (variantsFinal.length > 0) {
      const validPrices = variantsFinal.map((v) => Number(v.price)).filter((p) => !isNaN(p) && p > 0)
      if (validPrices.length > 0) {
        effectiveSellingPrice = Math.min(...validPrices)
      }
      const sumStock = variantsFinal.reduce((sum, v) => sum + (Number(v.stockQuantity) || 0), 0)
      if (sumStock > 0) {
        effectiveStockQuantity = sumStock
      }
    }

    // 2. Ensure originalPrice (MRP) satisfies the database constraint:
    // selling_price <= original_price. If MRP is omitted, default to sellingPrice (0% discount).
    const effectiveOriginalPrice = (input.originalPrice && input.originalPrice >= effectiveSellingPrice)
      ? input.originalPrice
      : effectiveSellingPrice

    // 3. Generate unique identifiers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
    const baseSlug = `${input.brand}-${input.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 45)
    const uniqueSlug = `${baseSlug}-${randomSuffix}`

    const catPrefixMap: Record<ProductCategoryType, string> = {
      'smartphones': 'SMP',
      'smart-tvs': 'STV',
      'home-appliances': 'HAP',
      'accessories': 'ACC',
      'other-electronics': 'OEL',
    }
    const catPrefix = catPrefixMap[input.category] || 'GEN'
    const brandPrefix = input.brand.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'GC'
    const uniqueSku = `GC-${catPrefix}-${brandPrefix}-${randomSuffix}`

    const emiStartsAt = Math.round(effectiveSellingPrice / 24)
    const imageFinal = input.image.trim() || '/images/placeholder-product.png'
    const galleryFinal = input.gallery && input.gallery.length > 0 ? input.gallery : [imageFinal]

    const newProduct: Product = {
      id: uniqueSlug,
      name: input.name.trim(),
      tagline: input.tagline?.trim() || input.description?.trim() || '',
      description: input.description?.trim() || input.tagline?.trim() || '',
      brand: input.brand.trim(),
      category: input.category,
      badge: input.badge?.trim() || undefined,
      isBestSeller: false,
      isNewLaunch: true,
      isDealOfTheDay: false,
      originalPrice: effectiveOriginalPrice,
      price: effectiveSellingPrice,
      rating: 4.8,
      reviewCount: 0,
      image: imageFinal,
      gallery: galleryFinal,
      emiStartsAt,
      warranty: input.warranty?.trim() || '1 Year Official Brand Warranty',
      inStock: effectiveStockQuantity > 0,
      stockQuantity: effectiveStockQuantity,
      specs: input.specs || [],
      highlights: input.highlights || [],
      variants: variantsFinal,
    }

    // 4. Persist to live Supabase database if configured
    if (isSupabaseConfigured()) {
      try {
        const rowPayload: Database['public']['Tables']['products']['Insert'] = {
          id: uniqueSlug,
          sku: uniqueSku,
          slug: uniqueSlug,
          name: newProduct.name,
          tagline: newProduct.tagline,
          description: newProduct.description || '',
          brand: newProduct.brand,
          category_id: newProduct.category,
          badge: newProduct.badge || null,
          is_best_seller: false,
          is_new_launch: true,
          is_deal_of_the_day: false,
          original_price: effectiveOriginalPrice,
          selling_price: effectiveSellingPrice,
          rating: 4.8,
          review_count: 0,
          image: imageFinal,
          gallery: galleryFinal as any,
          emi_starts_at: emiStartsAt,
          warranty: newProduct.warranty,
          stock_quantity: effectiveStockQuantity,
          in_stock: effectiveStockQuantity > 0,
          specs: (newProduct.specs || []) as any,
          highlights: (newProduct.highlights || []) as any,
          variants: variantsFinal as any,
          is_active: true,
        }

        const { error } = await supabase.from('products').insert(rowPayload)

        if (error) {
          // If RLS blocked direct insert, try admin RPC fallback
          const { error: rpcError } = await supabase.rpc('admin_create_product', {
            p_product: rowPayload,
          })
          if (rpcError) {
            console.warn('Supabase product creation warning:', error.message, rpcError.message)
          }
        }
      } catch (err: any) {
        console.warn('Failed to save product to remote database, saving to local cache:', err?.message)
      }
    }

    // 5. Update local in-memory cache and notify subscribers
    cachedProducts = [newProduct, ...cachedProducts]
    productService.notifyListeners()

    return {
      success: true,
      product: newProduct,
      sku: uniqueSku,
      error: null,
    }
  },
}

