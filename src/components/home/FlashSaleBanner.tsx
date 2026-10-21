import React, { useState } from 'react'
import { Sparkles, MessageCircle, ShoppingBag, Eye, ShieldCheck, CreditCard, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts'
import { formatINR } from '@/lib/utils'
import { storeDetails } from '@/data/mockProducts'

export const FlashSaleBanner: React.FC = () => {
  const [addedRecently, setAddedRecently] = useState(false)
  const { addToCart, setQuickViewProduct } = useCartStore()
  const { products } = useRealtimeProducts()

  // Use the verified deal product from real-time database/service
  const dealProduct = React.useMemo(() => {
    return products.find((p) => p.isDealOfTheDay) || products.find((p) => p.id === 'samsung-s24-ultra') || products[0]
  }, [products])

  if (!dealProduct) return null

  const savings = dealProduct.originalPrice - dealProduct.price
  const discountPercent = Math.round((savings / dealProduct.originalPrice) * 100)

  const handleAdd = () => {
    addToCart(dealProduct)
    setAddedRecently(true)
    setTimeout(() => setAddedRecently(false), 1600)
  }

  const whatsAppMessage = encodeURIComponent(
    `Hello Gayathri Communication, I am inquiring about the ${dealProduct.name} featured in your showroom spotlight at ${formatINR(dealProduct.price)}. Is this in stock for immediate in-store pickup?`
  )
  const whatsAppUrl = `https://wa.me/${storeDetails.whatsapp}?text=${whatsAppMessage}`

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-neutral-800">
        
        {/* Warm Subtle Ambient Glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-neutral-800/60 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
          
          {/* Left Text & Value Proposition */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/10 text-neutral-200 border border-white/15 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Curated Showroom Spotlight
              </span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Showroom Savings
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                Featured Flagship of the Week
              </p>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight leading-tight">
                {dealProduct.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
              Equipped with Galaxy AI, Titanium frame, 200MP Quad-Tele Camera, and built-in S Pen. Direct showroom discount of {formatINR(savings)} with official 1-year manufacturer warranty and free in-store data transfer.
            </p>

            {/* Price & Verified In-Store Perks */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-4 max-w-lg space-y-2 backdrop-blur-xs">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-white font-['Outfit']">
                    {formatINR(dealProduct.price)}
                  </span>
                  {dealProduct.originalPrice > dealProduct.price && (
                    <span className="text-sm text-neutral-400 line-through">
                      MRP {formatINR(dealProduct.originalPrice)}
                    </span>
                  )}
                </div>

                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-900/60 border border-emerald-700/80 px-2.5 py-0.5 rounded-full">
                    Direct Savings: {formatINR(savings)} ({discountPercent}% Off)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-neutral-300 border-t border-neutral-700/60 pt-2 gap-2">
                {dealProduct.emiStartsAt > 0 && (
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    No-Cost EMI from <strong className="text-white font-bold">{formatINR(dealProduct.emiStartsAt)}/mo*</strong>
                  </span>
                )}
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Same-Day Pickup in Store
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={handleAdd}
                variant="default"
                size="lg"
                className={`gap-2 text-xs font-semibold px-5 transition-colors ${
                  addedRecently 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-white hover:bg-neutral-100 text-neutral-900'
                }`}
              >
                {addedRecently ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </Button>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  size="lg"
                  className="gap-2 text-xs font-semibold border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 bg-neutral-900/80 px-4"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Inquire on WhatsApp</span>
                </Button>
              </a>

              <Button
                onClick={() => setQuickViewProduct(dealProduct)}
                variant="ghost"
                size="lg"
                className="gap-1.5 text-xs text-neutral-400 hover:text-white"
              >
                <Eye className="w-4 h-4" />
                <span>Quick View</span>
              </Button>
            </div>

          </div>

          {/* Right Product Hero Stage - Architectural Staging */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-md h-72 sm:h-80 lg:h-96 flex items-center justify-center">
              
              {/* Radial Backdrop Spotlight */}
              <div className="absolute inset-0 bg-radial from-white/10 via-white/5 to-transparent rounded-full blur-xl pointer-events-none" />

              {/* Grounded Reflection Shadow */}
              <div className="absolute bottom-4 w-3/4 h-6 bg-black/40 blur-lg rounded-full pointer-events-none" />

              <img
                src={dealProduct.image}
                alt={dealProduct.name}
                onError={(e) => {
                  const target = e.currentTarget
                  if (!target.src.endsWith('/images/placeholder-product.svg')) {
                    target.src = '/images/placeholder-product.svg'
                  }
                }}
                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => setQuickViewProduct(dealProduct)}
              />

              <div className="absolute top-2 right-2 bg-white/10 border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                Save {formatINR(savings)}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
