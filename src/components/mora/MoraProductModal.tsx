import React, { useState } from 'react'
import { X, Plus, Minus, CreditCard, Sparkles } from 'lucide-react'
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
  const [selectedTenure, setSelectedTenure] = useState<number>(24)
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  // Calculate EMI for different tenures (3, 6, 12, 24 months)
  const emiPlans = [
    { months: 3, perMonth: Math.round(product.price / 3) },
    { months: 6, perMonth: Math.round(product.price / 6) },
    { months: 12, perMonth: Math.round(product.price / 12) },
    { months: 24, perMonth: product.emiStartsAt },
  ]

  const currentEmi = emiPlans.find((p) => p.months === selectedTenure) || emiPlans[3]

  const handleAddToCart = () => {
    addToCart(product, `${selectedColor} (${selectedTenure}M EMI)`, quantity)
    onClose()
    setIsCartOpen(true)
  }

  const emiWhatsAppUrl = `https://wa.me/${storeDetails.whatsapp}?text=${encodeURIComponent(
    `👋 Hi Gayathri Communication, I want to apply for 0% No-Cost EMI for:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\nSelected Plan: ${selectedTenure} Months @ ₹${currentEmi.perMonth.toLocaleString('en-IN')}/month\nColor: ${selectedColor}\n\nPlease let me know the required documents for instant approval.`
  )}`

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      {/* Dark Glass Floating Card matching Screenshot 2 */}
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
            <span className="font-mono text-[10px] text-[#ff6a00] uppercase tracking-widest block">
              {product.brand} • Authorized
            </span>
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

        {/* Prominent Price & EMI Callout Banner */}
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
              <span>0% Interest No-Cost EMI Available</span>
            </div>
          </div>

          <p className="font-mono text-xs text-neutral-400">
            Pay as low as <strong className="text-white">{formatINR(product.emiStartsAt)}/month</strong> with zero down payment.
          </p>
        </div>

        {/* Interactive EMI Tenures Selector */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-1.5 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-[#ff6a00]" />
              Choose EMI Tenure (0% Interest):
            </span>
            <span className="text-[#ff6a00] font-semibold">
              {formatINR(currentEmi.perMonth)}/mo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {emiPlans.map((plan) => (
              <button
                key={plan.months}
                onClick={() => setSelectedTenure(plan.months)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedTenure === plan.months
                    ? 'border-[#ff6a00] bg-[#ff6a00]/15 text-white shadow-[0_0_15px_rgba(255,106,0,0.2)]'
                    : 'border-white/5 bg-black/40 text-neutral-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="block font-mono text-[11px] text-neutral-400">
                  {plan.months} Months
                </span>
                <span className="block font-mono text-xs font-bold text-white mt-0.5">
                  {formatINR(plan.perMonth)}/mo
                </span>
              </button>
            ))}
          </div>

          {/* Financing Partner Banks */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-neutral-500">
            <span>Financed by:</span>
            {['Bajaj Finserv', 'HDFC Bank', 'ICICI Bank', 'SBI Card', 'TVS Credit', 'Debit Card EMI'].map((bank) => (
              <span key={bank} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-400">
                {bank}
              </span>
            ))}
          </div>
        </div>

        {/* Monospace Feature Bullets */}
        <div className="space-y-1.5 text-xs font-mono text-neutral-300 bg-black/40 p-3.5 rounded-xl border border-white/5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[#ff6a00]">⬡</span>
            <span>Zero Down Payment • Instant 10-Minute Approval</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ff6a00]">⬡</span>
            <span>100% Brand Sealed Box with Official GST Invoice</span>
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

        {/* Action Buttons: Add to Cart & Apply for EMI on WhatsApp */}
        <div className="space-y-2 pt-1">
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

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold tracking-wider transition-all active:scale-95 text-center uppercase"
            >
              {formatINR(product.price * quantity)} • Add to Cart
            </button>
          </div>

          <a
            href={emiWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#ff6a00] hover:bg-[#ff7b1a] text-black font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <CreditCard className="w-4 h-4 text-black" />
            <span>Apply for {selectedTenure}-Month EMI on WhatsApp (₹{currentEmi.perMonth.toLocaleString('en-IN')}/mo)</span>
          </a>
        </div>

      </div>
    </div>
  )
}
