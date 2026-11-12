import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Check,
  ShoppingBag,
  AlertTriangle,
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts'
import { useHeroBanners } from '@/hooks/useHeroBanners'
import { formatINR } from '@/lib/utils'
import { storeDetails } from '@/data/mockProducts'
import { Product } from '@/types/product'
import { HeroSlideConfig } from '@/types/heroBanner'

/**
 * Resolve the catalogue product a slide points at. Live catalogue price and
 * stock always win; the slide's "fallback" price is used only when the product
 * is not in the catalogue (then the slide is enquiry-only, no Add to cart).
 *
 * Only an exact productId match counts. Keyword matching used to attach the
 * wrong item (an "iPhone 16 Pro Max" banner added a plain iPhone 16 to the cart).
 */
function resolveSlideProduct(slide: HeroSlideConfig, products: Product[]): { product: Product; isCatalogue: boolean } {
  const fromCatalogue = slide.productId ? products.find((p) => p.id === slide.productId) : undefined

  if (fromCatalogue) {
    return {
      isCatalogue: true,
      product: {
        ...fromCatalogue,
        name: slide.modelName || fromCatalogue.name,
        image: slide.image || fromCatalogue.image,
        gallery: [slide.image || fromCatalogue.image, ...(fromCatalogue.gallery || [])].filter(Boolean),
        description: slide.description || fromCatalogue.description,
      },
    }
  }

  return {
    isCatalogue: false,
    product: {
      id: slide.productId || slide.id,
      name: slide.modelName,
      tagline: slide.headline || slide.modelName,
      description: slide.description,
      brand: slide.brandTag ? slide.brandTag.split(' ')[0] : 'Electronics',
      category: 'smartphones',
      badge: slide.badgeText,
      isBestSeller: false,
      isNewLaunch: false,
      isDealOfTheDay: false,
      originalPrice: slide.fallbackOriginalPrice,
      price: slide.fallbackPrice,
      rating: 0,
      reviewCount: 0,
      image: slide.image,
      gallery: [slide.image],
      emiStartsAt: Math.round(slide.fallbackPrice / 24),
      warranty: 'Official brand warranty',
      inStock: true,
      stockQuantity: 0,
      specs: (slide.specs || []).map((s) => ({ label: 'Feature', value: s })),
      highlights: slide.specs || [],
    } as Product,
  }
}

const AUTO_ADVANCE_MS = 6500

export const HeroSection: React.FC = () => {
  const { slides } = useHeroBanners(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [addedRecently, setAddedRecently] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  )
  const touchStartXRef = useRef<number | null>(null)
  const addedTimerRef = useRef<number | undefined>(undefined)

  const { addToCart, setQuickViewProduct } = useCartStore()
  const { products } = useRealtimeProducts()

  useEffect(() => {
    if (currentIndex >= slides.length) setCurrentIndex(0)
  }, [slides.length, currentIndex])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  useEffect(() => () => window.clearTimeout(addedTimerRef.current), [])

  useEffect(() => {
    if (isPaused || prefersReducedMotion || slides.length <= 1) return
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % slides.length), AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [isPaused, prefersReducedMotion, slides.length])

  const handlePrev = useCallback(() => {
    if (slides.length > 1) setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const handleNext = useCallback(() => {
    if (slides.length > 1) setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // Arrow keys only when focus is inside the carousel, never while typing in search.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const diff = touchStartXRef.current - e.changedTouches[0].clientX
    if (diff > 45) handleNext()
    else if (diff < -45) handlePrev()
    touchStartXRef.current = null
    setIsPaused(false)
  }

  const slide: HeroSlideConfig | undefined = slides[currentIndex] ?? slides[0]

  const resolved = useMemo(() => (slide ? resolveSlideProduct(slide, products) : null), [slide, products])

  if (!slide || !resolved) return null

  const { product, isCatalogue } = resolved
  const isOutOfStock = isCatalogue && (!product.inStock || product.stockQuantity === 0)
  const hasDiscount = product.originalPrice > product.price && product.price > 0
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleAddToCart = () => {
    if (!isCatalogue || isOutOfStock) return
    addToCart(product)
    setAddedRecently(true)
    window.clearTimeout(addedTimerRef.current)
    addedTimerRef.current = window.setTimeout(() => setAddedRecently(false), 1600)
  }

  const handleOpenProduct = () => setQuickViewProduct(product)

  const priceText = product.price > 0 ? ` (Price: ${formatINR(product.price)})` : ''
  const whatsAppUrl = `https://wa.me/${storeDetails.whatsapp}?text=${encodeURIComponent(
    isOutOfStock
      ? `Hello Gayathri Communication, I am interested in the ${slide.modelName}${priceText}. It shows Out of Stock. When will new units arrive?`
      : `Hello Gayathri Communication, I am interested in the ${slide.modelName}${priceText}. Is it available for pickup today?`
  )}`

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-5 sm:pt-4 sm:pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-[#0f1115] text-white">
        <div
          className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -16 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.3, ease: 'easeOut' }}
            className="relative grid grid-cols-1 md:grid-cols-12 md:min-h-[440px] lg:min-h-[480px]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${currentIndex + 1} of ${slides.length}: ${slide.modelName}`}
          >
            {/* Product stage: light panel so studio photos with white backgrounds blend in */}
            <button
              type="button"
              onClick={handleOpenProduct}
              className="group relative md:order-2 md:col-span-5 m-3 mb-0 md:m-4 md:ml-0 rounded-[22px] bg-gradient-to-b from-white to-neutral-200 flex items-center justify-center h-52 sm:h-64 md:h-auto overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={`View details for ${slide.modelName}`}
            >
              {slide.badgeText && (
                <span className="absolute top-3 left-3 z-10 rounded-full bg-neutral-900/90 px-3 py-1 text-[11px] font-semibold text-white">
                  {slide.badgeText}
                </span>
              )}
              {hasDiscount && !isOutOfStock && (
                <span className="absolute top-3 right-3 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">
                  {discountPercent}% off
                </span>
              )}
              <img
                src={slide.image}
                alt={slide.imageAlt || slide.modelName}
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
                onError={(e) => {
                  const t = e.currentTarget
                  if (!t.src.endsWith('/images/placeholder-product.svg')) t.src = '/images/placeholder-product.svg'
                }}
                className="relative h-[85%] w-[85%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>

            {/* Copy */}
            <div className="md:order-1 md:col-span-7 flex flex-col justify-center gap-3 sm:gap-4 p-5 pt-4 sm:p-8 lg:p-12">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300/90">
                {slide.brandTag && <span>{slide.brandTag}</span>}
                {isOutOfStock && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-950/80 px-2.5 py-0.5 normal-case tracking-normal text-rose-300">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    Out of stock
                  </span>
                )}
              </div>

              <h1 className="font-['Outfit'] text-[28px] leading-[1.1] sm:text-4xl lg:text-[56px] font-extrabold tracking-tight text-balance">
                {slide.modelName}
              </h1>

              {slide.headline && (
                <p className="text-sm sm:text-lg font-medium text-neutral-200">{slide.headline}</p>
              )}

              <p className="hidden sm:block text-[15px] text-neutral-400 max-w-xl leading-relaxed line-clamp-3">
                {slide.description}
              </p>

              {product.price > 0 && (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1">
                  <span className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold">{formatINR(product.price)}</span>
                  {hasDiscount && (
                    <span className="text-sm text-neutral-500 line-through">MRP {formatINR(product.originalPrice)}</span>
                  )}
                  {hasDiscount && !isOutOfStock && (
                    <span className="text-xs font-semibold text-emerald-300">
                      You save {formatINR(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>
              )}

              {slide.specs.length > 0 && (
                <ul className="hidden sm:flex flex-wrap gap-2" aria-label="Key features">
                  {slide.specs.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1 text-xs font-medium text-neutral-200"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      {spec}
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 pt-1">
                {isCatalogue && (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500 ${
                      addedRecently ? 'bg-emerald-600 text-white' : 'bg-white text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    {addedRecently ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
                    {isOutOfStock ? 'Out of stock' : addedRecently ? 'Added' : 'Add to cart'}
                  </button>
                )}
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-neutral-950 hover:bg-[#1fb857] transition-colors ${
                    isCatalogue ? '' : 'col-span-2'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {isOutOfStock ? 'Ask restock' : 'WhatsApp'}
                </a>
              </div>

              <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                Sealed box · Official brand warranty · Pickup in Manachanallur
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-3">
          {/* Mobile: dots */}
          <div className="flex sm:hidden items-center gap-1.5" role="tablist" aria-label="Choose slide">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={s.shortLabel || s.modelName}
                onClick={() => setCurrentIndex(idx)}
                className="p-1.5 -m-0.5 cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-neutral-900' : 'w-1.5 bg-neutral-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Tablet/desktop: labelled tabs */}
          <div className="hidden sm:flex flex-wrap items-center gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:text-neutral-900'
                }`}
              >
                {s.shortLabel || s.modelName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tabular-nums text-neutral-500" aria-live="polite">
              {currentIndex + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
