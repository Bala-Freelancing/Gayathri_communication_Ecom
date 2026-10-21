import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

interface MoraNavbarProps {
  onOpenMenu: () => void
}

export const MoraNavbar: React.FC<MoraNavbarProps> = ({ onOpenMenu }) => {
  const { cart, setIsCartOpen } = useCartStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="fixed top-6 left-0 right-0 z-40 flex items-center justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between gap-6 px-6 py-2.5 rounded-full bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl text-xs text-neutral-300">
        
        {/* Hamburger Menu button matching Screenshot 1 & 2 */}
        <button
          onClick={onOpenMenu}
          className="flex items-center gap-2 hover:text-white transition-colors group p-1"
          title="Open menu"
        >
          <span className="font-mono text-base font-light tracking-tighter leading-none group-hover:scale-110 transition-transform">
            =
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-neutral-400 group-hover:text-white">
            Menu
          </span>
        </button>

        {/* Center Brand Identity: GAYATHRI® matching MORA® in Screenshot 1 */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer text-center px-2"
        >
          <span className="tracking-[0.3em] font-medium text-xs sm:text-sm text-white font-mono hover:text-[#ff6a00] transition-colors">
            GAYATHRI®
          </span>
        </div>

        {/* Right Cart Trigger: count + bag matching Screenshot 1 & 2 */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors p-1"
          title="View bag"
        >
          <span className="font-mono text-[11px] text-neutral-400">
            {cartCount}
          </span>
          <ShoppingBag className="w-3.5 h-3.5 text-neutral-300 hover:text-white" />
        </button>

      </div>
    </header>
  )
}
