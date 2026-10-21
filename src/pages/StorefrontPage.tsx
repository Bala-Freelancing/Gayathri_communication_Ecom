import React, { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/home/HeroSection'
import { BrandMarquee } from '@/components/home/BrandMarquee'
import { BentoCategories } from '@/components/home/BentoCategories'
import { FlashSaleBanner } from '@/components/home/FlashSaleBanner'
import { ProductGrid } from '@/components/products/ProductGrid'
import { StoreExperience } from '@/components/home/StoreExperience'
import { StoreShowcase } from '@/components/home/StoreShowcase'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { Footer } from '@/components/layout/Footer'
import { QuickViewModal } from '@/components/modals/QuickViewModal'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AboutModal } from '@/components/modals/AboutModal'
import { StoresModal } from '@/components/modals/StoresModal'

export const StorefrontPage: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isStoresOpen, setIsStoresOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900 flex flex-col font-['Inter'] selection:bg-neutral-900 selection:text-white">
      {/* Showroom Header & Navigation */}
      <Navbar 
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenStores={() => setIsStoresOpen(true)}
      />

      {/* Main Showroom Experience */}
      <main className="flex-1">
        {/* Flagship Hero Carousel with Safe Index Handling */}
        <HeroSection />

        {/* Authorized Brand Partners Marquee Ribbon */}
        <BrandMarquee />

        {/* Category Bento Explorer */}
        <BentoCategories />

        {/* Deal of the Day Banner */}
        <FlashSaleBanner />

        {/* Product Collection with Real-time Filtering, Search & Sorting */}
        <ProductGrid />

        {/* 6 Pillars of Trust & Store Experience */}
        <StoreExperience />

        {/* Physical Showroom Showcase & Location */}
        <StoreShowcase />

        {/* Real Customer Testimonials & Showroom FAQs */}
        <ReviewsSection />
      </main>

      {/* Footer with Showroom Details & EMI Partners */}
      <Footer />

      {/* Interactive Drawers & Modals */}
      <QuickViewModal />
      <CartDrawer />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <StoresModal isOpen={isStoresOpen} onClose={() => setIsStoresOpen(false)} />
    </div>
  )
}
