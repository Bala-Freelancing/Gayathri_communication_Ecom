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
  Clock,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { storeDetails } from '@/data/mockProducts'
import { ProductCategory } from '@/types/product'
import { AnnouncementStrip } from '@/components/layout/AnnouncementStrip'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavbarProps {
  onOpenAbout?: () => void
  onOpenStores?: () => void
  onOpenContact?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAbout, onOpenStores, onOpenContact }) => {
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
    { label: 'All Inventory', value: 'all', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Smartphones', value: 'smartphones', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { label: 'Smart TVs', value: 'smart-tvs', icon: <Tv className="w-3.5 h-3.5" /> },
    { label: 'Appliances', value: 'home-appliances', icon: <Refrigerator className="w-3.5 h-3.5" /> },
    { label: 'Accessories', value: 'accessories', icon: <Headphones className="w-3.5 h-3.5" /> },
    { label: 'Other Electronics', value: 'other-electronics', icon: <Monitor className="w-3.5 h-3.5" /> },
  ]

  const navigate = useNavigate()
  const location = useLocation()

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat)
    setMobileMenuOpen(false)
    if (location.pathname !== `/category/${cat}`) {
      navigate(`/category/${cat}`)
    }
  }

  const handleScrollToStore = () => {
    setMobileMenuOpen(false)
    if (onOpenStores) {
      onOpenStores()
      return
    }
    if (location.pathname === '/') {
      const el = document.getElementById('store-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById('store-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleLogoClick = () => {
    setSelectedCategory('all')
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById('inventory-section') || document.getElementById('collection-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById('inventory-section') || document.getElementById('collection-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full sticky top-0 z-40 bg-white shadow-xs">
      {/* 1. Top Announcement Bar */}
      <AnnouncementStrip />

      {/* 2. Main Navigation Bar (Tier 1: Brand, Search & User Actions) */}
      <header className="w-full bg-white border-b border-neutral-100 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Brand Identity with Official Logo */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0" 
            onClick={handleLogoClick}
          >
            <img 
              src="/images/gayathri-logo.png" 
              alt="Gayathri Communication - Mobiles & Home Appliances" 
              className="h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <div className="hidden xl:flex flex-col border-l border-neutral-200/90 pl-3">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Showroom
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-tight mt-0.5">
                Manachanallur Flagship
              </span>
            </div>
          </div>

          {/* Center: Full-Width Search Bar with Breathing Room */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search smartphones, 4K TVs, appliances, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white rounded-xl pl-10 pr-10 text-sm text-neutral-900 placeholder-neutral-400 border border-neutral-200/80 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition-colors"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right: Direct Actions Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Showroom Live Hub Link */}
            <button
              onClick={handleScrollToStore}
              className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200 cursor-pointer"
              title="View Showroom Address & Counter Timings"
            >
              <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight">
                <div className="font-semibold text-neutral-900">Showroom Visit</div>
                <div className="text-[10px] text-emerald-600 font-medium">Open 10 AM – 9:30 PM</div>
              </div>
            </button>

            {/* Direct WhatsApp Order CTA Button */}
            <a
              href={`https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20would%20like%20to%20inquire%20about%20showroom%20stock%20and%20pricing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <button 
                type="button"
                className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-bold transition-all shadow-sm shadow-[#25D366]/20 cursor-pointer"
                title="Chat with Gayathri Showroom on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span className="tracking-tight">WhatsApp Order</span>
              </button>
            </a>

            {/* Wishlist Trigger */}
            <button
              onClick={() => navigate('/category/all')}
              className="relative w-10 h-10 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 text-neutral-700 hover:text-neutral-950 flex items-center justify-center transition-colors cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 ? (
                <span className="bg-white text-neutral-950 text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-xs">
                  {cartCount}
                </span>
              ) : (
                <span className="text-neutral-400 font-normal hidden sm:inline">(0)</span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 flex items-center justify-center focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        <div className="md:hidden px-4 pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products, brands, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-neutral-100 focus:bg-white border border-neutral-200/80 focus:border-neutral-900 rounded-xl pl-10 pr-10 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </header>

      {/* 3. Tier 2: Category & Showroom Strip (Clean, Uncluttered, Scrollable) */}
      <nav 
        className="w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/70"
        aria-label="Category Navigation Strip"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4">
          
          {/* Horizontal Category Nav Items */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {navCategories.map((item) => {
              const isActive = selectedCategory === item.value
              return (
                <button
                  key={item.value}
                  onClick={() => handleCategoryClick(item.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/90'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Sub-actions & Trust Guarantees */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-medium text-neutral-500 shrink-0 select-none">
            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                className="flex items-center gap-1 text-neutral-600 hover:text-neutral-950 hover:underline transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-neutral-400" />
                <span>About</span>
              </button>
            )}

            {onOpenContact && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <button
                  onClick={onOpenContact}
                  className="flex items-center gap-1 text-neutral-600 hover:text-neutral-950 hover:underline transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contact Desk</span>
                </button>
              </>
            )}

            <span className="w-1 h-1 rounded-full bg-neutral-300" />

            <div className="flex items-center gap-1.5 text-neutral-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Box-Pack</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Menu Drawer Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-neutral-200 bg-white px-4 py-5 space-y-4 shadow-xl overflow-hidden"
          >
            {/* Category Navigation List */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
                Showroom Departments
              </p>
              {navCategories.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleCategoryClick(item.value)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === item.value
                      ? 'bg-neutral-950 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>

            {/* Direct Showroom Actions & Timing */}
            <div className="pt-3 border-t border-neutral-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-neutral-600 px-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  Showroom: 10:00 AM – 9:30 PM
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                  Open Daily
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-600 px-3">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{storeDetails.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${storeDetails.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Call Counter</span>
                </a>

                <a
                  href={`https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20would%20like%20to%20order%20from%20showroom.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {onOpenContact && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenContact()
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send Showroom Inquiry / Contact Form</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
