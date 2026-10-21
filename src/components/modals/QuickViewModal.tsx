import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'
import { 
  ShoppingBag, 
  MessageCircle, 
  ShieldCheck, 
  Star, 
  Check, 
  CreditCard
} from 'lucide-react'

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    generateProductInquiryUrl 
  } = useCartStore()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [isAdded, setIsAdded] = useState(false)

  if (!quickViewProduct) return null

  const activeImage = selectedImage || quickViewProduct.image
  const discountPercent = quickViewProduct.originalPrice > quickViewProduct.price
    ? Math.round(
        ((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100
      )
    : 0

  const isOutOfStock = !quickViewProduct.inStock || quickViewProduct.stockQuantity === 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(quickViewProduct, selectedVariant || undefined)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
      <DialogContent className="max-w-4xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Gallery & Image Preview */}
          <div className="md:col-span-6 space-y-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-200/90 p-4 flex items-center justify-center">
              <img
                src={activeImage}
                alt={quickViewProduct.name}
                className="max-h-full max-w-full object-contain drop-shadow-sm"
              />
              {isOutOfStock ? (
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold text-white bg-rose-600 px-3 py-1 rounded-full shadow-2xs uppercase tracking-wider">
                    Out of Stock
                  </span>
                </div>
              ) : discountPercent > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    Save {discountPercent}% Off
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher if gallery exists */}
            {quickViewProduct.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickViewProduct.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-neutral-50 shrink-0 transition-all ${
                      activeImage === img
                        ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Warranty & Store Trust Pill */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{quickViewProduct.warranty}</span>
              </div>
              <p className="text-[11px] text-neutral-500 pl-5 leading-relaxed">
                Eligible for official brand warranty at any authorized service center across India with GST invoice.
              </p>
            </div>
          </div>

          {/* Right: Product Details & Specs */}
          <div className="md:col-span-6 space-y-5 text-left">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs uppercase font-extrabold tracking-wider text-neutral-500">
                  {quickViewProduct.brand} • Authorized Retail
                </span>
                <div className="flex items-center gap-1 text-neutral-700 font-semibold text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{quickViewProduct.rating}</span>
                  <span className="text-neutral-400">({quickViewProduct.reviewCount} reviews)</span>
                </div>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold text-neutral-900 font-['Outfit']">
                {quickViewProduct.name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-neutral-600 mt-1">
                {quickViewProduct.tagline || quickViewProduct.description}
              </DialogDescription>
            </div>

            {/* Price & EMI Box */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit']">
                  {formatINR(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatINR(quickViewProduct.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs text-emerald-700 font-bold">
                    Save {formatINR(quickViewProduct.originalPrice - quickViewProduct.price)}
                  </span>
                )}
              </div>

              {quickViewProduct.emiStartsAt > 0 && (
                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                  <CreditCard className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>
                    No-Cost EMI available from <strong className="text-neutral-900">{formatINR(quickViewProduct.emiStartsAt)}/month</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Variant Selector (if any) */}
            {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
              <div className="space-y-3">
                {quickViewProduct.variants.map((v, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-neutral-700 mb-1.5">
                      Select {v.name}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selectedVariant === opt
                              ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                              : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Key Specs Grid */}
            {quickViewProduct.specs && quickViewProduct.specs.length > 0 && (
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Technical Highlights
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {quickViewProduct.specs.map((spec, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
                      <span className="block text-[10px] text-neutral-400 uppercase font-bold">
                        {spec.label}
                      </span>
                      <span className="font-semibold text-neutral-800 line-clamp-1">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {isOutOfStock ? (
                <Button
                  disabled
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2 font-semibold bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed opacity-80"
                >
                  <ShoppingBag className="w-4 h-4 opacity-50" />
                  <span>Out of Stock</span>
                </Button>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className={`flex-1 gap-2 font-semibold ${
                    isAdded
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </Button>
              )}

              <a
                href={generateProductInquiryUrl(quickViewProduct)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="whatsapp" size="lg" className="w-full gap-2 font-semibold">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </Button>
              </a>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
