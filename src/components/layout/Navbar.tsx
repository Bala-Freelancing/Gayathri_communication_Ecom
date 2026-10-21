import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Tv, 
  Smartphone, 
  Refrigerator,
  Headphones,
  Monitor,
  Store,
  Layers,
  MapPin,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { storeDetails } from '@/data/mockProducts'
import { ProductCategory } from '@/types/product'
import { AnnouncementStrip } from '@/components/layout/AnnouncementStrip'

interface NavbarProps {
  onOpenAbout?: () => void
  onOpenStores?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAbout, onOpenStores }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { 
    cart, 
    wishlist, 
    setIsCartOpen, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery 
  } = useCartStore()

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const navCategories: { label: string; value: ProductCategory; icon: React.ReactNode }[] = [
    { label: 'All Products', value: 'all', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Smartphones', value: 'smartphones', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { label: 'Smart TVs', value: 'smart-tvs', icon: <Tv className="w-3.5 h-3.5" /> },
    { label: 'Appliances', value: 'home-appliances', icon: <Refrigerator className="w-3.5 h-3.5" /> },
    { label: 'Accessories', value: 'accessories', icon: <Headphones className="w-3.5 h-3.5" /> },
    { label: 'Other Electronics', value: 'other-electronics', icon: <Monitor className="w-3.5 h-3.5" /> },
  ]

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat)
    setMobileMenuOpen(false)
    const productSection = document.getElementById('products-section')
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToStore = () => {
    setMobileMenuOpen(false)
    const el = document.getElementById('store-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (onOpenStores) {
      onOpenStores()
    }
  }

  return (
    <>
      {/* 1. Feature 1: Top Announcement Strip */}
      <AnnouncementStrip />

      {/* 2. Main Sticky Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Showroom Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold font-['Outfit'] text-lg shadow-sm transition-transform group-hover:scale-105">
              GC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-neutral-900 font-['Outfit']">
                  GAYATHRI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
                  Showroom
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-neutral-500 uppercase font-medium">
                Communication & Appliances
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden xl:flex flex-1 max-w-[220px] 2xl:max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, models, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200/90 focus:border-neutral-900 rounded-xl pl-10 pr-10 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded transition-colors"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0" aria-label="Category Navigation">
            {navCategories.map((item) => {
              const isActive = selectedCategory === item.value
              return (
                <button
                  key={item.value}
                  onClick={() => handleCategoryClick(item.value)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Showroom Location Quick Link */}
            <button
              onClick={handleScrollToStore}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              title="View Showroom Address & Hours"
            >
              <Store className="w-3.5 h-3.5 text-neutral-500" />
              <span>Showroom</span>
            </button>

            {/* WhatsApp Inquiry - Refined subtle pill that harmonizes with editorial header */}
            <a
              href={`https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20would%20like%20to%20know%20about%20your%20current%20offers.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <button 
                type="button"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold shadow-2xs hover:border-neutral-300 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Inquiry</span>
              </button>
            </a>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                const sec = document.getElementById('products-section')
                if (sec) sec.scrollIntoView({ behavior: 'smooth' })
              }}
              className="relative p-2 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 transition-colors shadow-xs"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <Button
              onClick={() => setIsCartOpen(true)}
              variant="outline"
              size="sm"
              className="relative gap-1.5 border-neutral-300 text-neutral-900 hover:bg-neutral-50 px-3 shadow-xs"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-neutral-800" />
              <span className="hidden sm:inline font-semibold text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input (Visible only on small screens) */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products, brands, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-xl pl-10 pr-10 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-4 shadow-lg overflow-hidden"
            >
              {/* Category Links */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
                  Product Categories
                </p>
                {navCategories.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleCategoryClick(item.value)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === item.value
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon}
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Showroom Details & Direct Actions */}
              <div className="pt-3 border-t border-neutral-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-neutral-600 px-3">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    Daily: 10 AM – 9:30 PM
                  </span>
                  <span className="font-semibold text-emerald-600">Open Now</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-600 px-3">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">Thuraiyur Rd, Manachanallur</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${storeDetails.phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Call Store</span>
                  </a>

                  <a
                    href={`https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20would%20like%20to%20know%20about%20your%20current%20offers.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {onOpenAbout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onOpenAbout()
                    }}
                    className="w-full text-center py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
                  >
                    About Gayathri Communication
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
