import { HeroSlideConfig } from '@/types/heroBanner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const DEFAULT_HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 'slide-iphone',
    productId: 'iphone-16-pro',
    matchKeywords: ['IPHONE 16', 'IPHONE 15', 'IPHONE'],
    brandTag: 'Official Apple Retailer',
    badgeText: 'Verified Showroom Savings',
    kicker: 'Featured Flagship of the Week',
    headline: 'Titanium Precision. Pure Intelligence.',
    modelName: 'Apple iPhone 16 Pro Max',
    shortLabel: 'iPhone 16 Pro',
    description: 'Engineered in aerospace-grade Titanium with the A18 Pro chip, 48MP Fusion camera system, and Apple Intelligence. Factory-sealed in box with official 1-year Apple India warranty.',
    specs: ['Grade 5 Titanium', 'A18 Pro Bionic', '48MP Fusion Camera'],
    image: '/images/products/iphone16.jpg',
    imageAlt: 'Apple iPhone 16 Pro Max Desert Titanium',
    fallbackPrice: 55000,
    fallbackOriginalPrice: 59900,
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'Quick View',
    isActive: true,
    orderIndex: 0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-sony',
    productId: 'sony-bravia-oled',
    matchKeywords: ['SONY', 'BRAVIA', 'QLED TV X PRO', 'SMART TV'],
    brandTag: 'Sony BRAVIA XR Master Series',
    badgeText: 'Complimentary Installation',
    kicker: 'Curated Showroom Spotlight',
    headline: 'Cinema Contrast. Acoustic Sound Glass.',
    modelName: 'Sony BRAVIA XR 65" 4K OLED',
    shortLabel: 'Sony BRAVIA OLED',
    description: 'Self-illuminating OLED pixels paired with Cognitive Processor XR and Acoustic Surface Audio+. Includes complimentary doorstep installation in Trichy district and official 3-year Sony warranty.',
    specs: ['Pure OLED Contrast', 'Acoustic Surface Audio+', '4K 120Hz Gaming'],
    image: '/images/products/sony-oled.jpg',
    imageAlt: 'Sony BRAVIA XR 65 inch OLED 4K TV',
    fallbackPrice: 149990,
    fallbackOriginalPrice: 179900,
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'Quick View',
    isActive: true,
    orderIndex: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-samsung',
    productId: 'samsung-s24-ultra',
    matchKeywords: ['S24', 'GALAXY', 'SAMSUNG', 'ULTRA'],
    brandTag: 'Samsung Galaxy AI Flagship',
    badgeText: 'Genuine Box-Pack',
    kicker: 'Featured Flagship of the Week',
    headline: 'Galaxy AI Power in Titanium Armor.',
    modelName: 'Samsung Galaxy S24 Ultra 5G',
    shortLabel: 'Galaxy S24 Ultra',
    description: 'Live Call Translate, Circle to Search, 200MP Quad Tele camera, and integrated S-Pen. In-store unboxing and complimentary data transfer at our Manachanallur showroom.',
    specs: ['Galaxy AI Inside', '200MP Quad Camera', 'Built-in S-Pen'],
    image: '/images/products/s24.jpg',
    imageAlt: 'Samsung Galaxy S24 Ultra 5G Titanium Gray',
    fallbackPrice: 119999,
    fallbackOriginalPrice: 129999,
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'Quick View',
    isActive: true,
    orderIndex: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slide-appliances',
    productId: 'lg-washer-ai',
    matchKeywords: ['WASHER', 'WASHING', 'REFRIGERATOR', 'CARRIER', 'BLUESTAR'],
    brandTag: 'LG Smart Living Appliances',
    badgeText: '10-Yr Motor Warranty',
    kicker: 'Curated Showroom Spotlight',
    headline: 'Intelligent Fabric Care with 10-Yr Warranty.',
    modelName: 'LG 9 Kg AI Direct Drive Washer',
    shortLabel: 'LG AI Washer',
    description: 'AI DD™ fabric-weight detection, Steam™ allergy elimination, and TurboWash 360 with 5-Star BEE energy rating. Authorized brand delivery and doorstep installation included.',
    specs: ['AI Direct Drive', 'Steam Allergy Care', '5-Star BEE Rating'],
    image: '/images/products/lg-washer.jpg',
    imageAlt: 'LG 9 Kg AI Direct Drive Front Load Washer',
    fallbackPrice: 18499,
    fallbackOriginalPrice: 46990,
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'Quick View',
    isActive: true,
    orderIndex: 3,
    updatedAt: new Date().toISOString(),
  },
]

const STORAGE_KEY = 'gc_hero_banners'
const EVENT_NAME = 'gc_hero_banners_updated'

// Initialize cached slides from localStorage or default slides
function loadInitialSlides(): HeroSlideConfig[] {
  if (typeof window === 'undefined') return DEFAULT_HERO_SLIDES

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      }
    }
  } catch (err) {
    console.warn('[heroBannerService] Failed to parse localStorage banners:', err)
  }

  // Pre-seed defaults into localStorage for first run
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HERO_SLIDES))
  } catch (err) {
    // Ignore storage quota errors
  }

  return DEFAULT_HERO_SLIDES
}

let cachedSlides: HeroSlideConfig[] = loadInitialSlides()
const listeners = new Set<(slides: HeroSlideConfig[]) => void>()

function broadcast(slides: HeroSlideConfig[]) {
  cachedSlides = [...slides].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedSlides))
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: cachedSlides }))
    } catch (e) {
      console.warn('[heroBannerService] Could not persist to localStorage:', e)
    }
  }

  listeners.forEach((fn) => {
    try {
      fn(cachedSlides)
    } catch (err) {
      console.error('[heroBannerService] Listener error:', err)
    }
  })
}

// Window cross-tab / cross-component synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue)
        if (Array.isArray(parsed)) {
          cachedSlides = parsed.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
          listeners.forEach((fn) => fn(cachedSlides))
        }
      } catch (err) {
        // Ignore JSON error
      }
    }
  })

  window.addEventListener(EVENT_NAME, (e: any) => {
    if (e.detail && Array.isArray(e.detail)) {
      cachedSlides = e.detail
      listeners.forEach((fn) => fn(cachedSlides))
    }
  })
}

export const heroBannerService = {
  /**
   * Get all slides currently in cache.
   * By default returns only active slides unless includeInactive is true.
   */
  getSlides: (includeInactive = false): HeroSlideConfig[] => {
    if (includeInactive) {
      return [...cachedSlides]
    }
    const active = cachedSlides.filter((s) => s.isActive !== false)
    return active.length > 0 ? active : DEFAULT_HERO_SLIDES
  },

  /**
   * Get a single slide by id
   */
  getSlideById: (id: string): HeroSlideConfig | undefined => {
    return cachedSlides.find((s) => s.id === id)
  },

  /**
   * Save a new slide or replace an existing slide
   */
  saveSlide: (slide: HeroSlideConfig): HeroSlideConfig => {
    const existingIndex = cachedSlides.findIndex((s) => s.id === slide.id)
    const updatedSlide: HeroSlideConfig = {
      ...slide,
      updatedAt: new Date().toISOString(),
      orderIndex: slide.orderIndex ?? (existingIndex >= 0 ? existingIndex : cachedSlides.length),
      isActive: slide.isActive ?? true,
    }

    let nextSlides: HeroSlideConfig[]
    if (existingIndex >= 0) {
      nextSlides = [...cachedSlides]
      nextSlides[existingIndex] = updatedSlide
    } else {
      nextSlides = [...cachedSlides, updatedSlide]
    }

    broadcast(nextSlides)
    heroBannerService.syncToSupabase(updatedSlide).catch(() => {})
    return updatedSlide
  },

  /**
   * Update specific fields of a slide
   */
  updateSlide: (id: string, updates: Partial<HeroSlideConfig>): HeroSlideConfig | null => {
    const existing = cachedSlides.find((s) => s.id === id)
    if (!existing) return null

    const updated: HeroSlideConfig = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    const nextSlides = cachedSlides.map((s) => (s.id === id ? updated : s))
    broadcast(nextSlides)
    heroBannerService.syncToSupabase(updated).catch(() => {})
    return updated
  },

  /**
   * Toggle slide active state
   */
  toggleSlideActive: (id: string): boolean => {
    const slide = cachedSlides.find((s) => s.id === id)
    if (!slide) return false
    const nextState = !slide.isActive
    heroBannerService.updateSlide(id, { isActive: nextState })
    return nextState
  },

  /**
   * Delete a slide by id
   */
  deleteSlide: (id: string): boolean => {
    const nextSlides = cachedSlides.filter((s) => s.id !== id)
    if (nextSlides.length === cachedSlides.length) return false
    
    // Re-index remaining slides
    const reindexed = nextSlides.map((s, idx) => ({ ...s, orderIndex: idx }))
    broadcast(reindexed)
    heroBannerService.deleteFromSupabase(id).catch(() => {})
    return true
  },

  /**
   * Reorder slides based on an ordered array of slide IDs
   */
  reorderSlides: (orderedIds: string[]): HeroSlideConfig[] => {
    const map = new Map(cachedSlides.map((s) => [s.id, s]))
    const reordered: HeroSlideConfig[] = []

    orderedIds.forEach((id, index) => {
      const slide = map.get(id)
      if (slide) {
        reordered.push({ ...slide, orderIndex: index })
        map.delete(id)
      }
    })

    // Append any slides that were not in orderedIds
    map.forEach((slide) => {
      reordered.push({ ...slide, orderIndex: reordered.length })
    })

    broadcast(reordered)
    return reordered
  },

  /**
   * Move a slide up or down by 1 position
   */
  moveSlide: (id: string, direction: 'up' | 'down'): boolean => {
    const index = cachedSlides.findIndex((s) => s.id === id)
    if (index === -1) return false
    if (direction === 'up' && index === 0) return false
    if (direction === 'down' && index === cachedSlides.length - 1) return false

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const next = [...cachedSlides]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp

    // Reassign orderIndex
    const reindexed = next.map((s, idx) => ({ ...s, orderIndex: idx }))
    broadcast(reindexed)
    return true
  },

  /**
   * Reset all slides back to showroom factory defaults
   */
  resetToDefaults: (): HeroSlideConfig[] => {
    broadcast(DEFAULT_HERO_SLIDES)
    return DEFAULT_HERO_SLIDES
  },

  /**
   * Subscribe to reactive updates
   */
  subscribe: (listener: (slides: HeroSlideConfig[]) => void): (() => void) => {
    listeners.add(listener)
    listener(cachedSlides)
    return () => {
      listeners.delete(listener)
    }
  },

  /**
   * Async helper: syncs to Supabase if hero_banners table exists
   */
  syncToSupabase: async (slide: HeroSlideConfig): Promise<void> => {
    if (!isSupabaseConfigured()) return
    try {
      await (supabase as any)
        .from('hero_banners')
        .upsert({
          id: slide.id,
          product_id: slide.productId,
          model_name: slide.modelName,
          short_label: slide.shortLabel,
          headline: slide.headline,
          description: slide.description,
          specs: slide.specs,
          image: slide.image,
          image_alt: slide.imageAlt,
          fallback_price: slide.fallbackPrice,
          fallback_original_price: slide.fallbackOriginalPrice,
          brand_tag: slide.brandTag,
          badge_text: slide.badgeText,
          kicker: slide.kicker,
          primary_cta_text: slide.primaryCtaText,
          secondary_cta_text: slide.secondaryCtaText,
          is_active: slide.isActive ?? true,
          order_index: slide.orderIndex ?? 0,
          updated_at: new Date().toISOString(),
        })
    } catch {
      // Table may not exist yet, safe ignore
    }
  },

  /**
   * Async helper: deletes from Supabase if table exists
   */
  deleteFromSupabase: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured()) return
    try {
      await (supabase as any)
        .from('hero_banners')
        .delete()
        .eq('id', id)
    } catch {
      // Safe ignore
    }
  },
}
