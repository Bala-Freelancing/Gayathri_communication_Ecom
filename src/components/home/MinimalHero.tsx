import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { productsData } from '@/data/mockProducts'

export const MinimalHero: React.FC = () => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const { setQuickViewProduct } = useCartStore()

  const heroVariants = [
    {
      title: "iPhone 16",
      shadeName: "Desert Titanium",
      subtext: "A titanium elegance that your lifestyle needs.",
      product: productsData[0], // iPhone 16 Pro Max
      image: "/images/hero-phone.jpg",
      dotColor: "#d4af37", // warm gold / desert
    },
    {
      title: "BRAVIA 4K",
      shadeName: "Cinema OLED",
      subtext: "A pure contrast that your living space deserves.",
      product: productsData[2], // Sony BRAVIA OLED
      image: "/images/hero-tv.jpg",
      dotColor: "#60a5fa", // sky blue
    },
    {
      title: "BESPOKE",
      shadeName: "Refined Inox",
      subtext: "An intelligent cooling designed for modern homes.",
      product: productsData[5], // Samsung Bespoke Fridge
      image: "/images/hero-appliance.jpg",
      dotColor: "#475569", // slate dark
    },
  ]

  const current = heroVariants[selectedVariantIndex]

  const handleBuyNow = () => {
    setQuickViewProduct(current.product)
  }

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[720px] flex items-center justify-center overflow-hidden pt-20 pb-8 px-4 sm:px-8">
      {/* Centered Top Tag Badge matching Image 2 */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-300/80 bg-white/70 backdrop-blur-sm text-[11px] sm:text-xs font-medium text-neutral-600 shadow-sm">
          <span className="bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full font-semibold text-[10px]">
            New
          </span>
          <span>Authorized flagship collection</span>
        </div>
      </div>

      {/* Massive Bold Background Typography matching Image 2 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${selectedVariantIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="text-[85px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-black text-[#9fd5f8]/55 tracking-tighter leading-none text-center font-['Outfit']"
          >
            {current.title}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Center 3D Pedestal Product Showcase matching Image 2 */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl flex items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${selectedVariantIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
            className="relative flex items-center justify-center cursor-pointer group"
            onClick={handleBuyNow}
          >
            <img
              src={current.image}
              alt={current.shadeName}
              className="w-[300px] sm:w-[440px] md:w-[500px] h-auto object-contain rounded-2xl drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Left: 3 Color Switcher Dots matching Image 2 */}
      <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 z-20">
        <div className="flex items-center gap-2 p-2 rounded-full bg-white/70 backdrop-blur-md border border-neutral-200/60 shadow-sm">
          {heroVariants.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedVariantIndex(idx)}
              className={`w-4 h-4 rounded-full transition-transform ${
                selectedVariantIndex === idx
                  ? 'scale-125 ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:scale-110 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: item.dotColor }}
              title={item.shadeName}
            />
          ))}
        </div>
      </div>

      {/* Bottom Right: Clean Product Info & Buy Now Pill matching Image 2 */}
      <div className="absolute bottom-8 sm:bottom-12 right-6 sm:right-12 z-20 text-right max-w-[240px] sm:max-w-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${selectedVariantIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-['Outfit']">
              {current.shadeName}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed pb-2">
              {current.subtext}
            </p>
            <button
              onClick={handleBuyNow}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-neutral-800 hover:bg-neutral-950 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy now</span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
