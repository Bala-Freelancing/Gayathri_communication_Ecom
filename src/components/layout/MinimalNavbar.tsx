import React, { useState } from 'react'
import { Search, ShoppingBag, X } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

interface MinimalNavbarProps {
  onOpenAbout: () => void
  onOpenStores: () => void
}

export const MinimalNavbar: React.FC<MinimalNavbarProps> = ({ onOpenAbout, onOpenStores }) => {
  const { cart, setIsCartOpen, searchQuery, setSearchQuery } = useCartStore()
  const [showSearch, setShowSearch] = useState(false)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const scrollToCollection = () => {
    const el = document.getElementById('collection-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Floating Pill Nav matching Image 2 & 3 */}
        <div className="flex items-center gap-5 sm:gap-6 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-neutral-200/80 text-xs sm:text-sm font-medium text-neutral-700 transition-all">
          {/* Logo mark */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-1 font-bold text-neutral-950 hover:opacity-80 transition-opacity"
          >
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold">
              ⚡
            </span>
            <span className="font-extrabold tracking-tight text-neutral-900 font-['Outfit'] hidden sm:inline">
              Gayathri
            </span>
          </button>

          {/* Links */}
          <button
            onClick={scrollToCollection}
            className="hover:text-neutral-950 transition-colors"
          >
            Shop
          </button>

          <button
            onClick={onOpenAbout}
            className="hover:text-neutral-950 transition-colors"
          >
            About
          </button>

          <button
            onClick={onOpenStores}
            className="hover:text-neutral-950 transition-colors"
          >
            Stores
          </button>

          {/* Search Trigger */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center gap-1 bg-neutral-100 rounded-full px-2.5 py-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-24 sm:w-36 bg-transparent text-xs text-neutral-800 placeholder-neutral-400 outline-none"
                />
                <button
                  onClick={() => {
                    setShowSearch(false)
                    setSearchQuery('')
                  }}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSearch(true)
                  scrollToCollection()
                }}
                className="text-neutral-600 hover:text-neutral-950 transition-colors p-0.5"
                title="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Floating Cart Pill */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-neutral-200/80 text-xs sm:text-sm font-semibold text-neutral-900 hover:bg-white hover:scale-105 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-neutral-800" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
