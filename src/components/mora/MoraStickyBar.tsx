import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { productsData } from '@/data/mockProducts'
import { formatINR } from '@/lib/utils'

interface MoraStickyBarProps {
  onMoreDetailsClick: () => void
}

export const MoraStickyBar: React.FC<MoraStickyBarProps> = ({ onMoreDetailsClick }) => {
  const [selectedColor, setSelectedColor] = useState<'Orange' | 'Gray' | 'Black'>('Black')
  const [quantity, setQuantity] = useState(1)
  const { addToCart, setIsCartOpen } = useCartStore()

  const heroProduct = productsData[0]

  const handleAddToCart = () => {
    addToCart(heroProduct, selectedColor, quantity)
    setIsCartOpen(true)
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex items-center justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 sm:gap-5 px-4 py-2.5 rounded-2xl bg-[#111111]/90 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-neutral-300 max-w-2xl w-full">
        
        {/* Thumbnail & Title matching Screenshot 2 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center p-0.5 shrink-0">
            <img
              src="/images/mora-hero.jpg"
              alt="thumb"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="text-left">
            <h4 className="font-serif text-sm font-medium text-white tracking-wide">
              Gayathri Flagship
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              {(['Orange', 'Gray', 'Black'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`transition-colors ${
                    selectedColor === color
                      ? 'text-[#ff6a00] font-semibold underline'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price, EMI & More Details link */}
        <div className="text-left sm:text-right hidden sm:block">
          <p className="font-mono text-xs text-neutral-200">
            {formatINR(heroProduct.price)}
          </p>
          <p className="font-mono text-[10px] text-[#ff7700]">
            0% EMI: {formatINR(heroProduct.emiStartsAt)}/mo
          </p>
          <button
            onClick={onMoreDetailsClick}
            className="font-mono text-[10px] text-neutral-400 hover:text-white underline transition-colors"
          >
            EMI Plans & Details
          </button>
        </div>

        {/* Stepper + ADD TO CART Button matching Screenshot 2 */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-neutral-400 hover:text-white"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="min-w-[14px] text-center text-white">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="text-neutral-400 hover:text-white"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-[11px] font-medium tracking-wider rounded-lg border border-white/20 transition-all uppercase active:scale-95 whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  )
}
