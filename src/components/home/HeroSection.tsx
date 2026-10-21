import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Eye, 
  ShieldCheck, 
  CreditCard,
  Sparkles,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts'
import { formatINR } from '@/lib/utils'
import { storeDetails } from '@/data/mockProducts'

interface HeroSlideConfig {
  id: string
  productId: string
  brandTag: string
  headline: string
  modelName: string
  shortLabel: string
  description: string
  specs: string[]
  image: string
  imageAlt: string
  layout: 'text-left' | 'text-right'
  primaryCtaText: string
  secondaryCtaText: string
}

const HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 'slide-iphone',
    productId: 'iphone-16-pro',
    brandTag: 'Official Apple Retailer',
    headline: 'Titanium Precision. Pure Intelligence.',
    modelName: 'Apple iPhone 16 Pro Max',
    shortLabel: 'iPhone 16 Pro',
    description: 'Engineered in aerospace-grade Titanium with the A18 Pro chip, 48MP Fusion camera system, and Apple Intelligence. Factory-sealed in box with official 1-year Apple India warranty.',
    specs: ['Grade 5 Titanium', 'A18 Pro Bionic', '48MP Fusion Camera'],
    image: '/images/products/iphone16.jpg',
    imageAlt: 'Apple iPhone 16 Pro Max Desert Titanium',
    layout: 'text-left',
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'Quick View',
  },
  {
    id: 'slide-sony',
    productId: 'sony-bravia-oled',
    brandTag: 'Sony BRAVIA XR Master Series',
    headline: 'Cinema Contrast. Acoustic Sound Glass.',
    modelName: 'Sony BRAVIA XR 65" 4K OLED',
    shortLabel: 'Sony BRAVIA OLED',
    description: 'Self-illuminating OLED pixels paired with Cognitive Processor XR and Acoustic Surface Audio+. Includes complimentary doorstep installation and official 3-year Sony warranty.',
    specs: ['Pure OLED Contrast', 'Acoustic Surface Audio+', '4K 120Hz Gaming'],
    image: '/images/products/sony-oled.jpg',
    imageAlt: 'Sony BRAVIA XR 65 inch OLED 4K TV',
    layout: 'text-right',
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'View Details',
  },
  {
    id: 'slide-samsung',
    productId: 'samsung-s24-ultra',
    brandTag: 'Samsung Galaxy AI Flagship',
    headline: 'Galaxy AI Power in Titanium Armor.',
    modelName: 'Samsung Galaxy S24 Ultra 5G',
    shortLabel: 'Galaxy S24 Ultra',
    description: 'Live Call Translate, Circle to Search, 200MP Quad Tele camera, and integrated S-Pen. In-store unboxing and complimentary data transfer at our Manachanallur showroom.',
    specs: ['Galaxy AI Inside', '200MP Quad Camera', 'Built-in S-Pen'],
    image: '/images/products/s24.jpg',
    imageAlt: 'Samsung Galaxy S24 Ultra 5G Titanium Gray',
    layout: 'text-left',
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'Quick View',
  },
  {
    id: 'slide-appliances',
    productId: 'lg-washer-ai',
    brandTag: 'LG Smart Living Appliances',
    headline: 'Intelligent Fabric Care with 10-Yr Motor Warranty.',
    modelName: 'LG 9 Kg AI Direct Drive Washer',
    shortLabel: 'LG AI Washer',
    description: 'AI DD™ fabric-weight detection, Steam™ allergy elimination, and TurboWash 360 with 5-Star BEE energy rating. Authorized brand delivery and doorstep installation included.',
    specs: ['AI Direct Drive', 'Steam Allergy Care', '10-Yr Motor Warranty'],
    image: '/images/products/lg-washer.jpg',
    imageAlt: 'LG 9 Kg AI Direct Drive Front Load Washer',
    layout: 'text-right',
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'View Details',
  },
]

export const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  )
  const touchStartXRef = useRef<number | null>(null)
  
  const { setQuickViewProduct } = useCartStore()
  const { products } = useRealtimeProducts()

  // Reduced motion listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  // Auto-advance slides every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [isPaused])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length)
  }, [])

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

  const slide = HERO_SLIDES[currentIndex]
  // Fetch real-time product data to guarantee verified pricing and discounts
  const product = products.find((p) => p.id === slide.productId) || products[0]

  const discountPercent = product?.originalPrice && product?.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const savingsAmount = product?.originalPrice && product?.price
    ? product.originalPrice - product.price
    : 0

  const handleOpenProduct = () => {
    if (product) {
      setQuickViewProduct(product)
    }
  }

  const whatsAppMessage = encodeURIComponent(
    `Hello Gayathri Communication, I am interested in the ${slide.modelName} (Selling Price: ${formatINR(product?.price || 0)}) featured on your showroom website. Please share current availability and EMI offers.`
  )
  const whatsAppUrl = `https://wa.me/${storeDetails.whatsapp}?text=${whatsAppMessage}`

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#f5f5f4]/80 via-[#fafaf9] to-[#fafaf9] border-b border-neutral-200/80 pt-6 pb-8 sm:pt-10 sm:pb-12 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Flagship Showcase Carousel"
    >
      {/* Subtle ambient lighting backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-neutral-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Slide Presentation Stage */}
        <div className="min-h-[480px] sm:min-h-[520px] lg:min-h-[540px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, ease: 'easeOut' }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              
              {/* Copy & Details Column */}
              <div 
                className={`flex flex-col justify-center space-y-4 sm:space-y-5 lg:col-span-6 xl:col-span-6 order-2 ${
                  slide.layout === 'text-right' ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                {/* Brand & Stock Eyebrow */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white tracking-wide shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {slide.brandTag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 font-medium bg-white border border-neutral-200/90 px-3 py-1 rounded-full shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Genuine Box-Pack
                  </span>
                </div>

                {/* Model Title & Editorial Headline */}
                <div>
                  <p className="text-sm sm:text-base font-bold text-neutral-500 uppercase tracking-wider font-['Outfit'] mb-1">
                    {slide.modelName}
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight font-['Outfit'] leading-[1.12]">
                    {slide.headline}
                  </h1>
                </div>

                {/* Key Spec Tags Ribbon */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {slide.specs.map((spec, i) => (
                    <span 
                      key={i} 
                      className="text-xs font-medium bg-neutral-100/90 text-neutral-800 border border-neutral-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3 h-3 text-neutral-500" />
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Concise Editorial Description */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg font-normal">
                  {slide.description}
                </p>

                {/* Verified Pricing & EMI Block */}
                {product && (
                  <div className="bg-white/80 border border-neutral-200/90 rounded-2xl p-4 max-w-lg shadow-2xs backdrop-blur-xs space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit']">
                          {formatINR(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-neutral-400 line-through">
                            MRP {formatINR(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {discountPercent > 0 && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          Save {formatINR(savingsAmount)} ({discountPercent}% Off)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-2 gap-2">
                      {product.emiStartsAt > 0 && (
                        <span className="flex items-center gap-1 text-neutral-700 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                          Zero Down-Payment EMI from <strong className="text-neutral-900 font-bold">{formatINR(product.emiStartsAt)}/mo*</strong>
                        </span>
                      )}
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        In Stock for Pickup
                      </span>
                    </div>
                  </div>
                )}

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="default"
                      size="lg"
                      className="gap-2 text-sm font-semibold shadow-xs bg-neutral-900 hover:bg-neutral-800 text-white"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>{slide.primaryCtaText}</span>
                    </Button>
                  </a>

                  <Button
                    onClick={handleOpenProduct}
                    variant="outline"
                    size="lg"
                    className="gap-2 text-sm font-semibold border-neutral-300 text-neutral-800 hover:bg-white shadow-2xs"
                  >
                    <Eye className="w-4 h-4 text-neutral-500" />
                    <span>{slide.secondaryCtaText}</span>
                  </Button>
                </div>

                {/* Showroom Authenticity Note */}
                <p className="text-[11px] text-neutral-500">
                  Includes official GST tax invoice and manufacturer warranty valid at authorized service centers.
                </p>

              </div>

              {/* Product Hero Imagery Stage - Prominent, Unboxed, Architectural */}
              <div 
                className={`lg:col-span-6 xl:col-span-6 flex items-center justify-center relative order-1 ${
                  slide.layout === 'text-right' ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="relative w-full max-w-lg lg:max-w-xl h-[260px] sm:h-[360px] lg:h-[480px] flex items-center justify-center">
                  
                  {/* Architectural Ambient Light Disk */}
                  <div className="absolute inset-4 sm:inset-6 rounded-full bg-radial from-neutral-200/50 via-neutral-100/20 to-transparent blur-2xl pointer-events-none" />

                  {/* Grounded Reflection Drop Shadow */}
                  <div className="absolute bottom-4 sm:bottom-6 w-3/4 h-6 sm:h-8 bg-neutral-900/15 blur-xl rounded-full pointer-events-none" />

                  {/* Flagship Product Image with Subtle Depth & Floating Motion */}
                  <motion.img
                    src={slide.image}
                    alt={slide.imageAlt}
                    animate={
                      prefersReducedMotion 
                        ? {} 
                        : { y: [0, -8, 0] }
                    }
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative z-10 max-h-[230px] sm:max-h-[320px] lg:max-h-[440px] max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={handleOpenProduct}
                  />

                  {/* Grounded Showroom Tag */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 bg-neutral-900/90 text-white text-[10px] sm:text-[11px] font-medium px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-sm border border-white/10 whitespace-nowrap">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400" />
                    <span>In-Stock at Manachanallur</span>
                  </div>

                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Editorial Carousel Navigation Bar - Numbered Interactive Tabs & Prev/Next */}
        <div className="mt-8 pt-4 border-t border-neutral-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Numbered Progress Tabs for All 4 Flagship Models */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
            {HERO_SLIDES.map((s, idx) => {
              const isActive = idx === currentIndex
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-white border border-neutral-200/80 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${s.shortLabel}`}
                >
                  <span className={`text-[10px] ${isActive ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    0{idx + 1}
                  </span>
                  <span>{s.shortLabel}</span>
                </button>
              )
            })}
          </div>

          {/* Prev / Next Chevrons with Active Counter */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-neutral-500 font-medium">
              0{currentIndex + 1} <span className="text-neutral-300">/</span> 0{HERO_SLIDES.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-xl border border-neutral-200/90 bg-white text-neutral-700 hover:bg-neutral-100 flex items-center justify-center transition-colors shadow-2xs cursor-pointer focus:outline-none"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-xl border border-neutral-200/90 bg-white text-neutral-700 hover:bg-neutral-100 flex items-center justify-center transition-colors shadow-2xs cursor-pointer focus:outline-none"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
