import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductGrid } from '@/components/products/ProductGrid'
import { QuickViewModal } from '@/components/modals/QuickViewModal'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AboutModal } from '@/components/modals/AboutModal'
import { StoresModal } from '@/components/modals/StoresModal'
import { ContactModal } from '@/components/modals/ContactModal'
import { useCartStore } from '@/store/useCartStore'
import { ProductCategory } from '@/types/product'
import { ChevronRight, Home, ArrowLeft, ShieldCheck, CreditCard, Sparkles } from 'lucide-react'

const CATEGORY_META: Record<string, { title: string; subtitle: string; description: string }> = {
  smartphones: {
    title: 'Smartphones & 5G Flagships',
    subtitle: 'Apple, Samsung, OnePlus, Vivo & Xiaomi',
    description: 'Factory-sealed flagship smartphones with full manufacturer warranty, GST tax invoice, and complimentary in-store data transfer.'
  },
  'smart-tvs': {
    title: '4K & OLED Cinema Smart TVs',
    subtitle: 'Sony BRAVIA, Samsung & LG Living Displays',
    description: 'Immersive home cinema displays with Dolby Vision, Acoustic Surface Audio, and brand technician doorstep installation.'
  },
  'home-appliances': {
    title: 'Living Appliances & Washers',
    subtitle: 'LG AI Direct Drive, Inverter Refrigerators & Air Conditioners',
    description: '5-Star BEE energy-efficient washing machines, side-by-side refrigerators, and split ACs backed by 10-year motor warranties.'
  },
  accessories: {
    title: 'Audio Gear & Wearables',
    subtitle: 'AirPods, Neckbands, Smartwatches & Fast Chargers',
    description: 'Original Apple AirPods, neckband earphones, GaN fast chargers, and daily mobile accessories with instant counter pickup.'
  },
  'other-electronics': {
    title: 'Monitors & Computing Gear',
    subtitle: 'High-Refresh Displays, Routers & Peripherals',
    description: 'UltraGear gaming monitors, high-speed Wi-Fi 6 mesh routers, and certified peripherals for your desktop setup.'
  },
  all: {
    title: 'Curated Showroom Inventory',
    subtitle: 'Complete Flagship & Appliance Catalogue',
    description: 'Explore all available electronics and appliances in stock at our Manachanallur showroom with same-day collection.'
  }
}

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>()
  const navigate = useNavigate()
  const { setSelectedCategory, selectedCategory } = useCartStore()

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isStoresOpen, setIsStoresOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  const activeSlug = (categorySlug && CATEGORY_META[categorySlug]) ? categorySlug : 'all'
  const meta = CATEGORY_META[activeSlug] || CATEGORY_META.all

  useEffect(() => {
    setSelectedCategory(activeSlug as ProductCategory)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeSlug, setSelectedCategory])

  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900 flex flex-col font-['Inter'] selection:bg-neutral-900 selection:text-white overflow-x-clip">
      {/* Navigation */}
      <Navbar 
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenStores={() => setIsStoresOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <main className="flex-1 overflow-x-clip">
        {/* Category Header Hero */}
        <section className="pt-6 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
          {/* Breadcrumb Path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
            <Link 
              to="/" 
              className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Showroom Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="font-semibold text-neutral-900">
              {meta.title}
            </span>
          </nav>

          {/* Editorial Category Title & Narrative */}
          <div className="space-y-3 mb-6">
            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-neutral-900 font-['Outfit'] tracking-tight leading-none">
              {meta.title}
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 max-w-3xl leading-relaxed">
              {meta.description}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-medium">
                100% Genuine Box-Pack
              </span>
              <span className="text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md font-medium">
                Official Brand Warranty
              </span>
              <span className="text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md font-medium">
                60-Min Counter Pickup
              </span>
            </div>
          </div>
        </section>

        {/* Product Collection with Real-time Filtering, Search & Sorting */}
        <ProductGrid hideTitle={true} />
      </main>

      {/* Showroom Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <QuickViewModal />
      <CartDrawer />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <StoresModal isOpen={isStoresOpen} onClose={() => setIsStoresOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  )
}
