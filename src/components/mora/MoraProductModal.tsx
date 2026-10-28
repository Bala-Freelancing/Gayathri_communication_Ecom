import React, { useState } from 'react'
import { X, Plus, Minus, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react'
import { Product } from '@/types/product'
import { formatINR } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import { storeDetails } from '@/data/mockProducts'

interface MoraProductModalProps {
  product: Product | null
  onClose: () => void
}

export const MoraProductModal: React.FC<MoraProductModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen } = useCartStore()
  const [selectedColor, setSelectedColor] = useState<'Orange' | 'Gray' | 'Black'>('Black')
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const isOutOfStock = !product.inStock || product.stockQuantity === 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(product, selectedColor, quantity)
    onClose()
    setIsCartOpen(true)
  }

  const whatsAppUrl = `https://wa.me/${storeDetails.whatsapp}?text=${encodeURIComponent(
    isOutOfStock
      ? `👋 Hi Gayathri Communication, I am interested in *${product.name}* (Price: ₹${product.price.toLocaleString('en-IN')}). It is currently marked Out of Stock. When will new units arrive at your showroom?`
      : `👋 Hi Gayathri Communication, I am interested in purchasing:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\nColor: ${selectedColor}\nQuantity: ${quantity}\n\nPlease confirm showroom availability and best counter offers.`
  )}`

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      {/* Dark Glass Floating Card matching Mora Aesthetic */}
      <div className="relative w-full max-w-xl bg-[#0e0e0e] rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-6 sm:p-8 text-neutral-200 space-y-5 my-auto max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Product Thumbnail */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#ff6a00] uppercase tracking-widest block">
                {product.brand} • Authorized Showroom
              </span>
              {isOutOfStock && (
                <span className="font-mono text-[9px] text-rose-400 bg-rose-950/80 border border-rose-800/80 uppercase px-2 py-0.5 rounded font-bold">
                  Out Of Stock
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-wide">
              {product.name}
            </h3>
            <p className="font-mono text-xs text-neutral-400">
              {product.tagline}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Prominent Price & Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-left space-y-2">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                {formatINR(product.price)}
              </span>
              <span className="font-mono text-xs text-neutral-500 line-through ml-2">
                {formatINR(product.originalPrice)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#ff6a00]/15 border border-[#ff6a00]/30 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#ff8822]">
              <Sparkles className="w-3 h-3" />
              <span>100% Brand Sealed Box Pack</span>
            </div>
          </div>

          <p className="font-mono text-xs text-neutral-400">
            Official manufacturer warranty with genuine GST invoice & instant counter billing.
          </p>
        </div>

        {/* Monospace Feature Bullets */}
        <div className="space-y-2 text-xs font-mono text-neutral-300 bg-black/40 p-4 rounded-xl border border-white/5 text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff6a00] shrink-0" />
            <span>100% Brand Sealed Box with Official GST Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ff6a00]">⬡</span>
            <span>Instant Showroom Pickup & Counter Billing in Manachanallur</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ff6a00]">⬡</span>
            <span>{product.warranty}</span>
          </div>
        </div>

        {/* Color Switcher */}
        <div className="flex items-center gap-3 text-xs font-mono text-left">
          <span className="text-neutral-500">Color:</span>
          {(['Orange', 'Gray', 'Black'] as const).map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`transition-colors ${
                selectedColor === color
                  ? 'text-[#ff6a00] font-semibold underline'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {color}
            </button>
          ))}
        </div>

        {/* Action Buttons: Add to Cart & Inquire on WhatsApp */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-neutral-400 hover:text-white"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="min-w-[16px] text-center text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="text-neutral-400 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {isOutOfStock ? (
              <button
                disabled
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 text-neutral-500 font-mono text-xs font-bold tracking-wider cursor-not-allowed text-center uppercase"
              >
                Out of Stock
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold tracking-wider transition-all active:scale-95 text-center uppercase"
              >
                {formatINR(product.price * quantity)} • Add to Cart
              </button>
            )}
          </div>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7b1a] text-black font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4 text-black" />
            <span>{isOutOfStock ? 'Inquire Restock on WhatsApp (9842419358)' : 'Inquire / Order on WhatsApp (9842419358)'}</span>
          </a>
        </div>

      </div>
    </div>
  )
}
