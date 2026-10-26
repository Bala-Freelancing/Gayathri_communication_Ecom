import React from 'react'
import { storeDetails } from '@/data/mockProducts'
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Smartphone, 
  Tv, 
  Refrigerator,
  Headphones,
  Monitor,
  ArrowUp,
  ShieldCheck,
  CreditCard,
  Store
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { ProductCategory } from '@/types/product'
import { useNavigate } from 'react-router-dom'

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  const navigate = useNavigate()
  const { setSelectedCategory } = useCartStore()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat)
    navigate(`/category/${cat}`)
  }

  return (
    <footer className="bg-[#171717] text-neutral-400 text-xs select-none">
      {/* Refined Reassurance Ribbon (Understated, single-line, zero box clutter) */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Factory Sealed with Official Manufacturer Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Instant Counter Billing • Cards, UPI & Net Banking</span>
          </div>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-sky-400 shrink-0" />
            <span>60-Min Counter Pickup in Manachanallur</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand Summary */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-2.5">
            <div className="inline-block bg-white px-3 py-2 rounded-2xl shadow-sm">
              <img 
                src="/images/gayathri-logo.png" 
                alt="Gayathri Communication - Mobiles & Home Appliances" 
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Authorized Multi-Brand Electronics & Appliance Showroom • Manachanallur
            </p>
          </div>
          <p className="text-neutral-400 leading-relaxed text-sm max-w-sm">
            Manachanallur's premier showroom for original smartphones, 4K OLED Smart TVs, and home appliances. Direct factory-sealed stock, official warranties, and flexible financing.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-neutral-400">
            <span className="bg-neutral-800/80 px-2.5 py-1 rounded-md">Apple Authorized</span>
            <span className="bg-neutral-800/80 px-2.5 py-1 rounded-md">Samsung Partner</span>
            <span className="bg-neutral-800/80 px-2.5 py-1 rounded-md">Sony BRAVIA</span>
            <span className="bg-neutral-800/80 px-2.5 py-1 rounded-md">LG Living</span>
          </div>
        </div>

        {/* Categories */}
        <div className="md:col-span-3 space-y-3">
          <p className="font-bold text-sm text-white font-['Outfit']">
            Departments
          </p>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button 
                onClick={() => navigateCategory('smartphones')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                <span>Smartphones & Flagships</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateCategory('smart-tvs')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5 text-neutral-400" />
                <span>4K & OLED Smart TVs</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateCategory('home-appliances')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Refrigerator className="w-3.5 h-3.5 text-neutral-400" />
                <span>Living Appliances & Washers</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateCategory('accessories')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5 text-neutral-400" />
                <span>Accessories & Wearables</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateCategory('other-electronics')}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                <span>Other Electronics & Gear</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateCategory('all')}
                className="hover:text-white transition-colors flex items-center gap-1.5 text-neutral-300 font-semibold cursor-pointer pt-1"
              >
                <span>View Full Catalogue →</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Showroom Location & Contact */}
        <div className="md:col-span-4 space-y-3">
          <p className="font-bold text-sm text-white font-['Outfit']">
            Showroom Location
          </p>
          <div className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <span>{storeDetails.address}</span>
                <p className="text-[11px] text-amber-400/90 font-medium mt-0.5">
                  Landmark: {storeDetails.landmark}
                </p>
                <a
                  href={storeDetails.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold mt-1 transition-colors"
                >
                  <span>Get Directions on Google Maps →</span>
                </a>
              </div>
            </div>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{storeDetails.timing} (Open Daily)</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
              <a href={`tel:${storeDetails.phone.replace(/\s+/g, '')}`} className="hover:text-white font-bold text-neutral-200">
                {storeDetails.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <a href={`mailto:${storeDetails.email}`} className="hover:text-white break-all text-xs">
                {storeDetails.email}
              </a>
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Back to Top */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div className="flex flex-wrap items-center gap-4">
          <p>© {CURRENT_YEAR} Gayathri Communication. All rights reserved.</p>
          <span>•</span>
          <p>Mannachanallur, Trichy 621005</p>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  )
}
