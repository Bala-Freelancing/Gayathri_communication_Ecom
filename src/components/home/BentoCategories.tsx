import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Smartphone, Tv, Sparkles, Headphones, Monitor } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { ProductCategory } from '@/types/product'

export const BentoCategories: React.FC = () => {
  const { setSelectedCategory } = useCartStore()

  const handleSelect = (category: ProductCategory) => {
    setSelectedCategory(category)
    const el = document.getElementById('products-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
            Showroom Departments
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
            Explore Curated Categories
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl">
            Factory-sealed inventory with official manufacturer warranty, GST invoice, and instant No-Cost EMI approval.
          </p>
        </div>

        <button
          onClick={() => handleSelect('all')}
          className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto border-b border-neutral-300 pb-0.5 cursor-pointer"
        >
          <span>View All Inventory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5-Category Editorial Bento Grid */}
      <div className="space-y-6">
        {/* Row 1: Primary Flagship Focus & Cinema Displays */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Smartphones & 5G Flagships (7 Cols) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelect('smartphones')}
            className="lg:col-span-7 group relative rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/60 to-neutral-100/40 p-6 sm:p-8 shadow-card hover:shadow-card-hover hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-neutral-200/40 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-white border border-neutral-200 px-3 py-1 rounded-full shadow-2xs">
                  <Smartphone className="w-3.5 h-3.5 text-neutral-700" />
                  Flagship Department
                </span>
                <span className="text-xs font-semibold text-neutral-500 group-hover:text-neutral-900 transition-colors flex items-center gap-1">
                  <span>View Models</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
                Smartphones & 5G Flagships
              </h3>
              <p className="text-xs font-semibold text-neutral-500 mt-1">
                Apple iPhone 16 Pro Max • Samsung Galaxy S24 Ultra • OnePlus 12
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 max-w-md leading-relaxed">
                Grade 5 Titanium builds, periscope camera systems, and sealed manufacturer box-packs with complimentary showroom data migration.
              </p>
            </div>

            {/* Product Photography */}
            <div className="mt-8 pt-4 flex items-center justify-center h-56 sm:h-64 relative">
              <div className="absolute inset-0 bg-radial from-white via-neutral-100/50 to-transparent rounded-2xl pointer-events-none" />
              <img
                src="/images/products/iphone16.jpg"
                alt="Flagship Smartphones Showcase"
                className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900">Apple • Samsung • OnePlus</span>
              <span className="text-emerald-700 font-medium">Ready for In-Store Pickup</span>
            </div>
          </motion.div>

          {/* Card 2: 4K & OLED Smart TVs (5 Cols) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelect('smart-tvs')}
            className="lg:col-span-5 group relative rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-card hover:shadow-card-hover hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 border border-neutral-200/80 px-2.5 py-1 rounded-full">
                  <Tv className="w-3.5 h-3.5 text-neutral-700" />
                  Cinema Displays
                </span>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-900 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 font-['Outfit']">
                4K & OLED Cinema Smart TVs
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                Sony BRAVIA XR • Acoustic OLED • 120Hz Gaming
              </p>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Immersive cinema screens with Acoustic Surface Audio+, XR Contrast Pro, and brand technician doorstep installation.
              </p>
            </div>

            <div className="my-6 py-2 flex items-center justify-center h-48 sm:h-56 bg-neutral-50/80 rounded-2xl overflow-hidden">
              <img
                src="/images/products/sony-oled.jpg"
                alt="Sony BRAVIA OLED TV"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>Includes Free Brand Doorstep Installation</span>
              <span className="font-semibold text-neutral-900">Sony • Samsung</span>
            </div>
          </motion.div>

        </div>

        {/* Row 2: 3 Department Pillars (Appliances, Accessories, Other Electronics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 3: Home Appliances & Living */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelect('home-appliances')}
            className="group relative rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-card hover:shadow-card-hover hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 border border-neutral-200/80 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                  Living Appliances
                </span>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-900 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-['Outfit']">
                Inverter Refrigeration & Washers
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                LG AI Direct-Drive • Samsung French Door
              </p>
            </div>

            <div className="my-4 py-2 flex items-center justify-center h-40 bg-neutral-50/80 rounded-2xl overflow-hidden">
              <img
                src="/images/products/lg-washer.jpg"
                alt="LG AI Washer & Appliances"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>10-Year Motor & Compressor Warranty</span>
              <span className="font-semibold text-neutral-900">LG • Samsung</span>
            </div>
          </motion.div>

          {/* Card 4: Accessories & Wearables */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelect('accessories')}
            className="group relative rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-card hover:shadow-card-hover hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 border border-neutral-200/80 px-2.5 py-1 rounded-full">
                  <Headphones className="w-3.5 h-3.5 text-neutral-700" />
                  Genuine Accessories
                </span>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-900 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-['Outfit']">
                Accessories & Smart Wearables
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Earbuds • Smartwatches • GaN Fast Chargers
              </p>
            </div>

            <div className="my-4 py-2 flex items-center justify-center h-40 bg-neutral-50/80 rounded-2xl overflow-hidden">
              <img
                src="/images/products/airpods-pro-2.jpg"
                alt="Apple AirPods Pro & Accessories"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>100% Genuine Box-Pack Accessories</span>
              <span className="font-semibold text-neutral-900">Apple • Samsung • Anker</span>
            </div>
          </motion.div>

          {/* Card 5: Other Electronics & Peripherals */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelect('other-electronics')}
            className="group relative rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-card hover:shadow-card-hover hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 border border-neutral-200/80 px-2.5 py-1 rounded-full">
                  <Monitor className="w-3.5 h-3.5 text-neutral-700" />
                  Work & Peripherals
                </span>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-900 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-['Outfit']">
                Monitors, Routers & Gear
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                QHD Displays • Wi-Fi 6 Routers • Ergonomic Mice
              </p>
            </div>

            <div className="my-4 py-2 flex items-center justify-center h-40 bg-neutral-50/80 rounded-2xl overflow-hidden">
              <img
                src="/images/products/lg-ultragear-monitor.jpg"
                alt="LG UltraGear Monitor & Electronics"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>Brand Certified Computer Hardware</span>
              <span className="font-semibold text-neutral-900">LG • TP-Link • Logitech</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
