import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { ProductCategory } from '@/types/product'

export const BentoCategories: React.FC = () => {
  const navigate = useNavigate()
  const { setSelectedCategory } = useCartStore()

  const handleSelect = (category: ProductCategory) => {
    setSelectedCategory(category)
    navigate(`/category/${category}`)
  }

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
            Explore Curated Categories
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            Flagship smartphones, 4K OLED cinema displays, and smart home appliances.
          </p>
        </div>

        <button
          onClick={() => handleSelect('all')}
          className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto border-b border-neutral-300 pb-0.5 cursor-pointer"
        >
          <span>View All Inventory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5-Category Editorial Bento Grid */}
      <div className="space-y-4">
        {/* Row 1: Primary Flagship Focus & Cinema Displays */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Card 1: Smartphones & 5G Flagships (7 Cols) */}
          <motion.div
            initial={{ opacity: 0.95, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
            onClick={() => handleSelect('smartphones')}
            className="lg:col-span-7 group relative rounded-2xl bg-white p-5 sm:p-6 transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
                  Smartphones & 5G Flagships
                </h3>
                <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-950 transition-colors flex items-center gap-1">
                  <span>View Models</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
                Grade 5 Titanium builds, periscope camera systems, and sealed manufacturer box-packs with complimentary showroom data migration.
              </p>
            </div>

            {/* Product Photography */}
            <div className="my-4 flex items-center justify-center h-40 sm:h-44 relative bg-neutral-50/70 rounded-xl">
              <img
                src="/images/products/iphone16.jpg"
                alt="Flagship Smartphones Showcase"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900">Apple • Samsung • OnePlus</span>
              <span className="text-emerald-700 font-medium">Ready for In-Store Pickup</span>
            </div>
          </motion.div>

          {/* Card 2: 4K & OLED Smart TVs (5 Cols) */}
          <motion.div
            initial={{ opacity: 0.95, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            onClick={() => handleSelect('smart-tvs')}
            className="lg:col-span-5 group relative rounded-2xl bg-white p-5 sm:p-6 transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-['Outfit']">
                  4K & OLED Cinema Smart TVs
                </h3>
                <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-950 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Immersive cinema screens with Acoustic Surface Audio+, XR Contrast Pro, and brand technician doorstep installation.
              </p>
            </div>

            <div className="my-4 flex items-center justify-center h-40 sm:h-44 bg-neutral-50/70 rounded-xl overflow-hidden">
              <img
                src="/images/products/sony-oled.jpg"
                alt="Sony BRAVIA OLED TV"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-neutral-500">
              <span>Free Doorstep Installation</span>
              <span className="font-semibold text-neutral-900">Sony • Samsung</span>
            </div>
          </motion.div>

        </div>

        {/* Row 2: 3 Department Pillars (Appliances, Accessories, Other Electronics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 3: Home Appliances & Living */}
          <motion.div
            initial={{ opacity: 0.95, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            onClick={() => handleSelect('home-appliances')}
            className="group relative rounded-2xl bg-white p-5 transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-center h-32 sm:h-36 bg-neutral-50/70 rounded-xl overflow-hidden">
              <img
                src="/images/products/lg-washer.jpg"
                alt="LG AI Washer & Appliances"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-['Outfit']">
                  Refrigeration & Washers
                </h3>
                <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-950 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                LG AI Direct-Drive • Samsung French Door
              </p>
            </div>
          </motion.div>

          {/* Card 4: Accessories & Wearables */}
          <motion.div
            initial={{ opacity: 0.95, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, delay: 0.12 }}
            onClick={() => handleSelect('accessories')}
            className="group relative rounded-2xl bg-white p-5 transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-center h-32 sm:h-36 bg-neutral-50/70 rounded-xl overflow-hidden">
              <img
                src="/images/products/airpods-pro-2.jpg"
                alt="Apple AirPods Pro & Accessories"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-['Outfit']">
                  Audio & Wearables
                </h3>
                <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-950 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                Earbuds • Smartwatches • Fast Chargers
              </p>
            </div>
          </motion.div>

          {/* Card 5: Other Electronics & Peripherals */}
          <motion.div
            initial={{ opacity: 0.95, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, delay: 0.16 }}
            onClick={() => handleSelect('other-electronics')}
            className="group relative rounded-2xl bg-white p-5 transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-center h-32 sm:h-36 bg-neutral-50/70 rounded-xl overflow-hidden">
              <img
                src="/images/products/lg-ultragear-monitor.jpg"
                alt="LG UltraGear Monitor & Electronics"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-['Outfit']">
                  Monitors & Gear
                </h3>
                <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-950 transition-colors flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                QHD Displays • Wi-Fi 6 Routers
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
