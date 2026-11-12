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

// ------------------------------------------------------------------------------
// Source of truth: the public.hero_banners table in Supabase.
// localStorage is only a first-paint cache so the hero doesn't flash defaults
// while the network request is in flight. Every device (phone, laptop) loads
// the same slides from the database, so they always match.
// ------------------------------------------------------------------------------

const CACHE_KEY = 'gc_hero_banners_cache_v2'
// Old key held admin-local edits that never reached other devices; drop it.
const LEGACY_KEY = 'gc_hero_banners'

type HeroBannerRow = {
  id: string
  product_id: string | null
  model_name: string
  short_label: string
  headline: string
  description: string
  specs: unknown
  match_keywords?: unknown
  image: string
  image_alt: string
  fallback_price: number | string
  fallback_original_price: number | string
  brand_tag: string
  badge_text: string
  kicker: string
  primary_cta_text: string
  secondary_cta_text: string
  is_active: boolean
  order_index: number
  updated_at: string
}

const toStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

function rowToSlide(r: HeroBannerRow): HeroSlideConfig {
  return {
    id: r.id,
    productId: r.product_id ?? '',
    matchKeywords: toStringArray(r.match_keywords),
    brandTag: r.brand_tag ?? '',
    badgeText: r.badge_text ?? '',
    kicker: r.kicker ?? '',
    modelName: r.model_name ?? '',
    headline: r.headline ?? '',
    shortLabel: r.short_label ?? '',
    description: r.description ?? '',
    specs: toStringArray(r.specs),
    image: r.image ?? '',
    imageAlt: r.image_alt ?? '',
    fallbackPrice: Number(r.fallback_price) || 0,
    fallbackOriginalPrice: Number(r.fallback_original_price) || 0,
    primaryCtaText: r.primary_cta_text ?? '',
    secondaryCtaText: r.secondary_cta_text ?? '',
    isActive: r.is_active !== false,
    orderIndex: r.order_index ?? 0,
    updatedAt: r.updated_at,
  }
}

function slideToRow(s: HeroSlideConfig): HeroBannerRow {
  return {
    id: s.id,
    product_id: s.productId || null,
    model_name: s.modelName,
    short_label: s.shortLabel,
    headline: s.headline,
    description: s.description,
    specs: s.specs ?? [],
    match_keywords: s.matchKeywords ?? [],
    image: s.image,
    image_alt: s.imageAlt,
    fallback_price: s.fallbackPrice || 0,
    fallback_original_price: s.fallbackOriginalPrice || 0,
    brand_tag: s.brandTag,
    badge_text: s.badgeText,
    kicker: s.kicker,
    primary_cta_text: s.primaryCtaText,
    secondary_cta_text: s.secondaryCtaText,
    is_active: s.isActive ?? true,
    order_index: s.orderIndex ?? 0,
    updated_at: new Date().toISOString(),
  }
}

const sortSlides = (slides: HeroSlideConfig[]) =>
  [...slides].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))

function readCache(): HeroSlideConfig[] | null {
  if (typeof window === 'undefined') return null
  try {
    localStorage.removeItem(LEGACY_KEY)
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? sortSlides(parsed) : null
  } catch {
    return null
  }
}

function writeCache(slides: HeroSlideConfig[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(slides))
  } catch {
    /* storage full or blocked */
  }
}

let cachedSlides: HeroSlideConfig[] = readCache() ?? DEFAULT_HERO_SLIDES
let isLoaded = !isSupabaseConfigured()
let loadPromise: Promise<void> | null = null
let syncError: string | null = null

export type HeroBannerState = { slides: HeroSlideConfig[]; isLoaded: boolean; syncError: string | null }
const listeners = new Set<(state: HeroBannerState) => void>()

function emit() {
  const state = { slides: cachedSlides, isLoaded, syncError }
  listeners.forEach((fn) => {
    try {
      fn(state)
    } catch (err) {
      console.error('[heroBannerService] Listener error:', err)
    }
  })
}

function setLocal(slides: HeroSlideConfig[]) {
  cachedSlides = sortSlides(slides)
  writeCache(cachedSlides)
  emit()
}

function setSyncError(message: string | null) {
  syncError = message
  emit()
}

async function loadFromDatabase(): Promise<void> {
  if (!isSupabaseConfigured()) return
  const { data, error } = await (supabase as any)
    .from('hero_banners')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.warn('[heroBannerService] Could not load hero banners:', error.message)
    // Table missing or unreachable: every device shows the same built-in defaults.
    cachedSlides = DEFAULT_HERO_SLIDES
  } else {
    const rows = (data ?? []) as HeroBannerRow[]
    cachedSlides = rows.length > 0 ? sortSlides(rows.map(rowToSlide)) : DEFAULT_HERO_SLIDES
    writeCache(cachedSlides)
  }
  isLoaded = true
  emit()
}

function ensureLoaded() {
  if (!loadPromise) {
    loadPromise = loadFromDatabase().catch((err) => {
      console.warn('[heroBannerService] load failed:', err)
      isLoaded = true
      emit()
    })
    if (isSupabaseConfigured()) {
      try {
        const channel = (supabase as any).channel('hero_banners_sync')
        channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_banners' }, () => {
            loadFromDatabase()
          })
          .subscribe()
      } catch {
        /* realtime is optional */
      }
    }
  }
  return loadPromise
}

async function upsertRemote(slides: HeroSlideConfig[]) {
  if (!isSupabaseConfigured() || slides.length === 0) return
  const { error } = await (supabase as any).from('hero_banners').upsert(slides.map(slideToRow))
  if (error) throw new Error(error.message)
}

async function deleteRemote(ids: string[]) {
  if (!isSupabaseConfigured() || ids.length === 0) return
  const { error } = await (supabase as any).from('hero_banners').delete().in('id', ids)
  if (error) throw new Error(error.message)
}

/**
 * Apply a change locally right away, write it to the database, and on failure
 * roll back and surface the error so the admin knows it did NOT go live.
 */
async function commit(next: HeroSlideConfig[], toUpsert: HeroSlideConfig[], toDelete: string[] = []): Promise<boolean> {
  const previous = cachedSlides
  setLocal(next)
  setSyncError(null)
  try {
    await deleteRemote(toDelete)
    await upsertRemote(toUpsert)
    return true
  } catch (err: any) {
    setLocal(previous)
    setSyncError(
      `Not saved to the live site: ${err?.message || 'database error'}. ` +
        'Check you are logged in as an admin and that migration 00008 has been run.'
    )
    return false
  }
}

const reindex = (slides: HeroSlideConfig[]) => slides.map((s, idx) => ({ ...s, orderIndex: idx }))

export const heroBannerService = {
  getSlides: (includeInactive = false): HeroSlideConfig[] => {
    if (includeInactive) return [...cachedSlides]
    const active = cachedSlides.filter((s) => s.isActive !== false)
    return active.length > 0 ? active : DEFAULT_HERO_SLIDES
  },

  getSlideById: (id: string): HeroSlideConfig | undefined => cachedSlides.find((s) => s.id === id),

  saveSlide: (slide: HeroSlideConfig): Promise<boolean> => {
    const existingIndex = cachedSlides.findIndex((s) => s.id === slide.id)
    const updated: HeroSlideConfig = {
      ...slide,
      updatedAt: new Date().toISOString(),
      orderIndex: slide.orderIndex ?? (existingIndex >= 0 ? existingIndex : cachedSlides.length),
      isActive: slide.isActive ?? true,
    }
    const next = existingIndex >= 0
      ? cachedSlides.map((s) => (s.id === slide.id ? updated : s))
      : [...cachedSlides, updated]
    // Write the full set: if the DB was empty the admin is looking at defaults,
    // and the live site must match that preview exactly.
    return commit(next, next)
  },

  updateSlide: (id: string, updates: Partial<HeroSlideConfig>): Promise<boolean> => {
    const existing = cachedSlides.find((s) => s.id === id)
    if (!existing) return Promise.resolve(false)
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() }
    const next = cachedSlides.map((s) => (s.id === id ? updated : s))
    return commit(next, next)
  },

  toggleSlideActive: (id: string): Promise<boolean> => {
    const slide = cachedSlides.find((s) => s.id === id)
    if (!slide) return Promise.resolve(false)
    return heroBannerService.updateSlide(id, { isActive: slide.isActive === false })
  },

  deleteSlide: (id: string): Promise<boolean> => {
    if (!cachedSlides.some((s) => s.id === id)) return Promise.resolve(false)
    const next = reindex(cachedSlides.filter((s) => s.id !== id))
    return commit(next, next, [id])
  },

  reorderSlides: (orderedIds: string[]): Promise<boolean> => {
    const map = new Map(cachedSlides.map((s) => [s.id, s]))
    const ordered: HeroSlideConfig[] = []
    orderedIds.forEach((id) => {
      const s = map.get(id)
      if (s) {
        ordered.push(s)
        map.delete(id)
      }
    })
    map.forEach((s) => ordered.push(s))
    const next = reindex(ordered)
    return commit(next, next)
  },

  moveSlide: (id: string, direction: 'up' | 'down'): Promise<boolean> => {
    const index = cachedSlides.findIndex((s) => s.id === id)
    const target = direction === 'up' ? index - 1 : index + 1
    if (index === -1 || target < 0 || target >= cachedSlides.length) return Promise.resolve(false)
    const next = [...cachedSlides]
    const tmp = next[index]
    next[index] = next[target]
    next[target] = tmp
    const reindexed = reindex(next)
    return commit(reindexed, reindexed)
  },

  resetToDefaults: (): Promise<boolean> => {
    const defaultIds = new Set(DEFAULT_HERO_SLIDES.map((s) => s.id))
    const toDelete = cachedSlides.filter((s) => !defaultIds.has(s.id)).map((s) => s.id)
    return commit(DEFAULT_HERO_SLIDES, DEFAULT_HERO_SLIDES, toDelete)
  },

  clearSyncError: () => setSyncError(null),

  subscribe: (listener: (state: HeroBannerState) => void): (() => void) => {
    listeners.add(listener)
    listener({ slides: cachedSlides, isLoaded, syncError })
    ensureLoaded()
    return () => {
      listeners.delete(listener)
    }
  },
}

