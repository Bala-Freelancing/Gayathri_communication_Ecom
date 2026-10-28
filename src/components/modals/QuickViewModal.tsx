import React, { useState, useMemo, useEffect } from 'react'
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
  Layers,
  Sparkles,
  AlertTriangle,
  AlertCircle
} from 'lucide-react'

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    generateProductInquiryUrl 
  } = useCartStore()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [isAdded, setIsAdded] = useState(false)

  // Reset variant & image preview when active product changes
  useEffect(() => {
    setSelectedVariantIndex(0)
    setSelectedImage(null)
    setIsAdded(false)
  }, [quickViewProduct?.id])

  // Extract structured variants (supporting Flipkart / Amazon separate price per variant)
  const concreteVariants = useMemo(() => {
    if (!quickViewProduct?.variants || quickViewProduct.variants.length === 0) return []

    const isParentOutOfStock = !quickViewProduct.inStock || quickViewProduct.stockQuantity === 0

    // Backwards compatibility: if variant has options array and no price
    const first = quickViewProduct.variants[0]
    if (first.options && Array.isArray(first.options) && first.price === undefined) {
      return first.options.map((opt, i) => ({
        id: `var-opt-${i}`,
        name: opt,
        price: quickViewProduct.price,
        originalPrice: quickViewProduct.originalPrice,
        inStock: isParentOutOfStock ? false : quickViewProduct.inStock,
        stockQuantity: isParentOutOfStock ? 0 : (quickViewProduct.stockQuantity ?? 10),
      }))
    }

    return quickViewProduct.variants.map((v, i) => {
      const vInStock = isParentOutOfStock ? false : (v.inStock ?? quickViewProduct.inStock)
      const vQty = isParentOutOfStock ? 0 : (v.stockQuantity ?? quickViewProduct.stockQuantity ?? 10)
      return {
        id: v.id || `var-${i}`,
        name: v.name,
        price: v.price ?? quickViewProduct.price,
        originalPrice: v.originalPrice ?? quickViewProduct.originalPrice,
        inStock: vInStock && vQty > 0,
        stockQuantity: vQty,
        attributes: v.attributes,
      }
    })
  }, [quickViewProduct])

  if (!quickViewProduct) return null

  // Resolve current active variant or fallback to parent product
  const activeVariant = concreteVariants.length > 0 ? concreteVariants[selectedVariantIndex] : null
  const currentPrice = activeVariant ? activeVariant.price : quickViewProduct.price
  const currentOriginalPrice = activeVariant?.originalPrice && activeVariant.originalPrice > 0
    ? activeVariant.originalPrice
    : quickViewProduct.originalPrice
  const currentStockQuantity = activeVariant?.stockQuantity ?? quickViewProduct.stockQuantity ?? 10
  const isOutOfStock = !quickViewProduct.inStock || quickViewProduct.stockQuantity === 0 || (activeVariant ? !activeVariant.inStock || currentStockQuantity === 0 : false)

  const discountPercent = currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0

  const activeImage = selectedImage || quickViewProduct.image

  const handleAddToCart = () => {
    if (isOutOfStock) return
    const variantLabel = activeVariant?.name || undefined
    addToCart(quickViewProduct, variantLabel, 1, currentPrice, currentOriginalPrice)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
      <DialogContent className="max-w-3xl lg:max-w-4xl w-[94vw] p-5 sm:p-7 max-h-[88vh] overflow-y-auto rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left: Gallery & Image Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-50/90 border border-neutral-200/80 p-4 flex items-center justify-center">
              <img
                src={activeImage}
                alt={quickViewProduct.name}
                className={`max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 ${
                  isOutOfStock ? 'grayscale-[35%] opacity-80' : ''
                }`}
              />
              {isOutOfStock ? (
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold text-white bg-rose-600 px-3 py-1 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Out of Stock
                  </span>
                </div>
              ) : discountPercent > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shadow-xs">
                    Save {discountPercent}% Off
                  </span>
                </div>
              )}

              {/* Floating Out of Stock Center Pill on Image */}
              {isOutOfStock && (
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-center pointer-events-none">
                  <span className="bg-neutral-950/90 border border-neutral-700/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Out Of Stock</span>
                  </span>
                </div>
              )}

              {concreteVariants.length > 1 && !isOutOfStock && (
                <div className="absolute bottom-3 left-3">
                  <span className="text-[10px] font-semibold text-neutral-800 bg-white/95 backdrop-blur-sm border border-neutral-200/80 px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-blue-600" />
                    <span>{concreteVariants.length} Variants Available</span>
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher if gallery exists */}
            {quickViewProduct.gallery && quickViewProduct.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickViewProduct.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl border p-1 bg-neutral-50 shrink-0 transition-all ${
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

            {/* Warranty & Store Trust Card */}
            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/70 text-xs text-neutral-700">
              <div className="flex items-center gap-1.5 text-neutral-900 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{quickViewProduct.warranty || '1 Year Official Brand Warranty'}</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed pl-5">
                Official brand sealed box with genuine GST invoice & instant counter billing in Manachanallur.
              </p>
            </div>
          </div>

          {/* Right: Product Details, Variants & Actions */}
          <div className="md:col-span-7 space-y-3.5 text-left pr-1 sm:pr-2">
            
            {/* Header: Brand, Title, Rating (with pr-10 clearance for Close Button) */}
            <div className="pr-10">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                  {quickViewProduct.brand} • Authorized Showroom
                </span>
                <div className="flex items-center gap-1 text-neutral-700 font-semibold text-xs bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{quickViewProduct.rating || 4.8}</span>
                  <span className="text-neutral-400 font-normal">({quickViewProduct.reviewCount || 15})</span>
                </div>
                {isOutOfStock && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    Out Of Stock
                  </span>
                )}
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold text-neutral-900 font-['Outfit'] tracking-tight">
                {quickViewProduct.name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-neutral-600 mt-0.5 line-clamp-2">
                {quickViewProduct.tagline || quickViewProduct.description}
              </DialogDescription>
            </div>

            {/* Dynamic Price Box (Clean, responsive layout) */}
            <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 space-y-1.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
                  {formatINR(currentPrice)}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-xs sm:text-sm text-neutral-400 line-through">
                    MRP {formatINR(currentOriginalPrice)}
                  </span>
                )}
                {discountPercent > 0 && !isOutOfStock && (
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                    Save {formatINR(currentOriginalPrice - currentPrice)} ({discountPercent}% Off)
                  </span>
                )}
              </div>

              {isOutOfStock ? (
                <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-900 block">Currently Out of Stock at Showroom</span>
                    <span className="text-[11px] text-rose-700 leading-relaxed block mt-0.5">
                      This model is temporarily sold out in our Manachanallur showroom. Inquire on WhatsApp to check incoming restock arrival or reserve counter priority.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Brand Sealed • Showroom Guarantee & GST Invoice</span>
                </div>
              )}
            </div>

            {/* Flipkart / Amazon Style Variant Selector (Compact, Non-Overflowing Grid) */}
            {concreteVariants.length > 0 && (
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    Select Variant:
                  </span>
                  {activeVariant && (
                    <span className="text-[11px] font-semibold text-neutral-800">
                      Selected: <strong>{activeVariant.name}</strong>
                    </span>
                  )}
                </div>

                {/* Sleek Variant Pills that never overflow */}
                <div className="flex flex-wrap gap-2">
                  {concreteVariants.map((v, idx) => {
                    const isSelected = selectedVariantIndex === idx
                    const vOutOfStock = !v.inStock || v.stockQuantity === 0

                    return (
                      <button
                        key={v.id || idx}
                        type="button"
                        disabled={vOutOfStock}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                            : vOutOfStock
                            ? 'border-neutral-200 bg-neutral-50/50 text-neutral-400 opacity-60 cursor-not-allowed'
                            : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="text-xs font-bold font-['Outfit']">
                          {v.name}
                        </span>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-300' : 'text-neutral-950 font-bold'}`}>
                          {formatINR(v.price)}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3] ml-0.5" />
                        )}
                        {vOutOfStock && (
                          <span className="text-[9px] font-bold text-rose-500 uppercase ml-1">
                            Sold Out
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Key Specs Grid (Balanced 2-column cards with natural line wrapping) */}
            {quickViewProduct.specs && quickViewProduct.specs.length > 0 && (
              <div className="pt-0.5">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Technical Highlights
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {quickViewProduct.specs.slice(0, 4).map((spec, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-neutral-50/80 border border-neutral-200/60">
                      <span className="block text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                        {spec.label}
                      </span>
                      <span className="font-semibold text-neutral-800 text-xs break-words line-clamp-2 leading-tight mt-0.5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons Row: Perfectly Balanced 50/50 Grid that Never Overflows */}
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {isOutOfStock ? (
                  <Button
                    disabled
                    size="default"
                    variant="outline"
                    className="w-full gap-2 font-semibold bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed h-11 rounded-xl"
                  >
                    <ShoppingBag className="w-4 h-4 opacity-50" />
                    <span>Out of Stock</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    size="default"
                    className={`w-full gap-2 font-semibold text-xs sm:text-sm h-11 rounded-xl transition-all shadow-sm ${
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
                  href={generateProductInquiryUrl(
                    quickViewProduct,
                    activeVariant?.name,
                    currentPrice
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button 
                    variant="whatsapp" 
                    size="default" 
                    className="w-full gap-2 font-semibold text-xs sm:text-sm h-11 rounded-xl shadow-sm whitespace-nowrap overflow-hidden"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">{isOutOfStock ? 'Inquire Restock on WhatsApp' : 'WhatsApp Order'}</span>
                  </Button>
                </a>
              </div>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
