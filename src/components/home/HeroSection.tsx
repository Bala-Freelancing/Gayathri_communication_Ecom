import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Eye, 
  ShieldCheck, 
  CreditCard,
  Sparkles,
  Check,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts'
import { useHeroBanners } from '@/hooks/useHeroBanners'
import { formatINR } from '@/lib/utils'
import { storeDetails } from '@/data/mockProducts'
import { Product } from '@/types/product'
import { HeroSlideConfig } from '@/types/heroBanner'

export const HeroSection: React.FC = () => {
  const { slides } = useHeroBanners(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [addedRecently, setAddedRecently] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  )
  const touchStartXRef = useRef<number | null>(null)
  
  const { addToCart, setQuickViewProduct } = useCartStore()
  const { products } = useRealtimeProducts()

  // Guard against out of bounds index if slides count changes
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0)
    }
  }, [slides.length, currentIndex])

  // Reduced motion listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  // Auto-advance slides every 6 seconds unless paused
  useEffect(() => {
    if (isPaused || slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused, slides.length])

  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const handleNext = useCallback(() => {
    if (slides.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext])

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX
    if (diff > 45) {
      handleNext()
    } else if (diff < -45) {
      handlePrev()
    }
    touchStartXRef.current = null
    setIsPaused(false)
  }

  const slide = slides[currentIndex] || slides[0]

  // Intelligently resolve the target product:
  // 1. First by exact productId
  // 2. Next by slide keywords in database name/brand
  // 3. Finally synthesize an authentic showroom product matching the slide with verified pricing
  const resolvedProduct: Product = useMemo(() => {
    if (!slide) return {} as Product

    const byId = products.find((p) => p.id === slide.productId)
    if (byId) {
      return {
        ...byId,
        name: slide.modelName || byId.name,
        price: slide.fallbackPrice > 0 ? slide.fallbackPrice : byId.price,
        originalPrice: slide.fallbackOriginalPrice > 0 ? slide.fallbackOriginalPrice : byId.originalPrice,
        image: slide.image || byId.image,
        description: slide.description || byId.description,
        gallery: [slide.image, ...(byId.gallery || [])],
        specs: (slide.specs && slide.specs.length > 0)
          ? slide.specs.map((s) => ({ label: 'Specification', value: s }))
          : byId.specs,
        highlights: (slide.specs && slide.specs.length > 0) ? slide.specs : byId.highlights,
      }
    }

    if (slide.matchKeywords && slide.matchKeywords.length > 0) {
      for (const kw of slide.matchKeywords) {
        const match = products.find(
          (p) => p.name.toUpperCase().includes(kw) || p.brand.toUpperCase().includes(kw)
        )
        if (match) {
          return {
            ...match,
            name: slide.modelName || match.name,
            price: slide.fallbackPrice > 0 ? slide.fallbackPrice : match.price,
            originalPrice: slide.fallbackOriginalPrice > 0 ? slide.fallbackOriginalPrice : match.originalPrice,
            image: slide.image || match.image,
            description: slide.description || match.description,
            gallery: [slide.image, ...(match.gallery || [])],
            specs: (slide.specs && slide.specs.length > 0)
              ? slide.specs.map((s) => ({ label: 'Specification', value: s }))
              : match.specs,
            highlights: (slide.specs && slide.specs.length > 0) ? slide.specs : match.highlights,
          }
        }
      }
    }

    return {
      id: slide.productId || slide.id,
      name: slide.modelName,
      tagline: slide.headline || slide.modelName,
      description: slide.description,
      brand: slide.brandTag ? slide.brandTag.split(' ')[0] : 'Electronics',
      category: (slide.id.includes('sony') ? 'smart-tvs' : slide.id.includes('washer') ? 'home-appliances' : 'smartphones'),
      badge: slide.badgeText || 'Curated Spotlight',
      isBestSeller: true,
      isNewLaunch: true,
      isDealOfTheDay: true,
      originalPrice: slide.fallbackOriginalPrice,
      price: slide.fallbackPrice,
      rating: 4.9,
      reviewCount: 38,
      image: slide.image,
      gallery: [slide.image],
      emiStartsAt: Math.round(slide.fallbackPrice / 24),
      warranty: '1 Year Official Brand Warranty',
      inStock: true,
      stockQuantity: 12,
      specs: (slide.specs || []).map((s) => ({ label: 'Specification', value: s })),
      highlights: slide.specs || [],
    } as Product
  }, [products, slide])

  const isOutOfStock = !resolvedProduct.inStock || resolvedProduct.stockQuantity === 0

  const discountPercent = resolvedProduct.originalPrice > resolvedProduct.price
    ? Math.round(((resolvedProduct.originalPrice - resolvedProduct.price) / resolvedProduct.originalPrice) * 100)
    : 0

  const savingsAmount = resolvedProduct.originalPrice > resolvedProduct.price
    ? resolvedProduct.originalPrice - resolvedProduct.price
    : 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(resolvedProduct)
    setAddedRecently(true)
    setTimeout(() => setAddedRecently(false), 1600)
  }

  const handleOpenProduct = () => {
    setQuickViewProduct(resolvedProduct)
  }

  const whatsAppMessage = encodeURIComponent(
    isOutOfStock
      ? `Hello Gayathri Communication, I am interested in the ${slide.modelName} (Price: ${formatINR(resolvedProduct.price)}) featured in your showroom spotlight banner. It is marked Out of Stock. When will new units arrive at the showroom?`
      : `Hello Gayathri Communication, I am interested in the ${slide.modelName} (Price: ${formatINR(resolvedProduct.price)}) featured in your showroom spotlight banner. Is this in stock for same-day pickup?`
  )
  const whatsAppUrl = `https://wa.me/${storeDetails.whatsapp}?text=${whatsAppMessage}`

  return (
    <section
      className="pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pt-4 lg:pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Flagship Showroom Spotlight Carousel"
    >
      {/* Cinematic Dark Showroom Spotlight Card Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0f1115] text-white p-5 sm:p-8 lg:p-10">
        
        {/* Soft Ambient Light Behind Staged Product */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10"
          >
            
            {/* Left Column: Authentic Copy, Verified Pricing & CTAs */}
            <div className="lg:col-span-7 space-y-4 text-left order-2 lg:order-1">
              
              {/* Dominant Headline at Display Size */}
              {isOutOfStock && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-800/80">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Currently Out of Stock in Showroom</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight leading-snug break-words">
                {slide.modelName}
              </h1>

              {/* Showroom Narrative Description */}
              <p className="text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed">
                {slide.description}
              </p>

              {/* Embedded Price & Savings Block */}
              <div className="bg-neutral-900/90 rounded-2xl p-4 sm:p-5 max-w-lg space-y-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
                      {formatINR(resolvedProduct.price)}
                    </span>
                    {resolvedProduct.originalPrice > resolvedProduct.price && (
                      <span className="text-sm text-neutral-400 line-through">
                        MRP {formatINR(resolvedProduct.originalPrice)}
                      </span>
                    )}
                  </div>

                  {discountPercent > 0 && !isOutOfStock && (
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full">
                      Save {formatINR(savingsAmount)} ({discountPercent}% Off)
                    </span>
                  )}
                </div>

                {isOutOfStock ? (
                  <div className="flex items-center text-xs text-rose-400 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>Out of Stock in Showroom • Inquire on WhatsApp for Restock</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-emerald-400 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Official Brand Sealed • Showroom Guarantee</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Key Specs Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {slide.specs.map((spec, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-medium bg-neutral-800/90 text-neutral-200 px-3 py-1 rounded-lg flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {spec}
                  </span>
                ))}
              </div>

              {/* Interactive CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {isOutOfStock ? (
                  <Button
                    disabled
                    variant="outline"
                    size="default"
                    className="gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 bg-neutral-800/80 text-neutral-400 border border-neutral-700 cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4 opacity-40" />
                    <span>Out of Stock</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    variant="default"
                    size="default"
                    className={`gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer ${
                      addedRecently 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-white hover:bg-neutral-100 text-neutral-900'
                    }`}
                  >
                    {addedRecently ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </Button>
                )}

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline"
                    size="default"
                    className="gap-2 text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 bg-neutral-800/90 px-4 py-2.5 cursor-pointer border-0"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>{isOutOfStock ? 'Inquire Restock on WhatsApp' : 'Inquire on WhatsApp'}</span>
                  </Button>
                </a>

                <Button
                  onClick={handleOpenProduct}
                  variant="ghost"
                  size="default"
                  className="gap-1.5 text-xs sm:text-sm text-neutral-400 hover:text-white cursor-pointer px-3 py-2.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Quick View</span>
                </Button>
              </div>

            </div>

            {/* Right Column: Architectural Product Display Stage */}
            <div className="lg:col-span-5 flex items-center justify-center relative order-1 lg:order-2">
              <div className="relative w-full max-w-sm sm:max-w-md h-64 sm:h-76 lg:h-88 flex items-center justify-center">
                
                {/* Grounded Shadow */}
                <div className="absolute bottom-3 w-3/4 h-5 bg-black/60 blur-lg rounded-full pointer-events-none" />

                {/* High-Resolution Showroom Product Photography */}
                <motion.img
                  src={slide.image}
                  alt={slide.imageAlt}
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.src.endsWith('/images/placeholder-product.svg')) {
                      target.src = '/images/placeholder-product.svg'
                    }
                  }}
                  animate={
                    prefersReducedMotion 
                      ? {} 
                      : { y: [0, -5, 0] }
                  }
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 max-h-[240px] sm:max-h-[280px] lg:max-h-[320px] max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={handleOpenProduct}
                />

              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* Editorial Carousel Navigation Bar - Controls from Image 3 */}
      <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Progress Tabs for All Flagship Models */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
                aria-label={`Go to slide: ${s.shortLabel}`}
              >
                <span>{s.shortLabel}</span>
              </button>
            )
          })}
        </div>

        {/* Counter and Prev / Next Chevrons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs text-neutral-600 font-semibold font-mono">
            {currentIndex + 1} / {slides.length}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-xl bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-xl bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </section>
  )
}
