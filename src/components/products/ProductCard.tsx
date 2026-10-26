import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  MessageCircle,
  Check,
  Layers,
  ChevronRight
} from 'lucide-react'
import { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'
import { storeDetails } from '@/data/mockProducts'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [addedRecently, setAddedRecently] = useState(false)

  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct 
  } = useCartStore()

  // Calculate concrete variants (Flipkart / Amazon model)
  const hasMultipleVariants = Array.isArray(product.variants) && product.variants.length > 1
  const variantCount = hasMultipleVariants ? product.variants!.length : 0
  const minPrice = hasMultipleVariants
    ? Math.min(...product.variants!.map((v) => v.price ?? product.price))
    : product.price

  const discountPercent = product.originalPrice > minPrice
    ? Math.round(((product.originalPrice - minPrice) / product.originalPrice) * 100)
    : 0

  const savingsAmount = product.originalPrice > minPrice
    ? product.originalPrice - minPrice
    : 0

  const isFavorite = isInWishlist(product.id)
  const isOutOfStock = !product.inStock || product.stockQuantity === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock) return
    // If the model has multiple variants, open Quick View modal so customer selects their variant
    if (hasMultipleVariants) {
      setQuickViewProduct(product)
      return
    }
    addToCart(product)
    setAddedRecently(true)
    setTimeout(() => setAddedRecently(false), 1600)
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const msgText = isOutOfStock
      ? `Hello Gayathri Communication, I am interested in ${product.name} (Price: ${formatINR(minPrice)}). It is currently marked Out of Stock. When will it be available in your showroom?`
      : `Hello Gayathri Communication, I am interested in ${product.name} (Price: ${formatINR(minPrice)}). Is this available in stock?`
    const msg = encodeURIComponent(msgText)
    window.open(`https://wa.me/${storeDetails.whatsapp}?text=${msg}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0.95, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white p-4 sm:p-5 select-none transition-shadow hover:shadow-md"
    >
      <div>
        {/* Prominent Product Media Container */}
        <div 
          onClick={() => setQuickViewProduct(product)}
          className="relative aspect-square w-full rounded-xl bg-neutral-50/80 p-4 flex items-center justify-center overflow-hidden cursor-pointer group/img transition-colors hover:bg-neutral-100/60"
        >
          {/* Product Image with Subtle Scale on Hover */}
          <img
            src={
              isHovered && product.gallery && product.gallery.length > 1
                ? product.gallery[1]
                : product.image
            }
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget
              if (!target.src.endsWith('/images/placeholder-product.svg')) {
                target.src = '/images/placeholder-product.svg'
              }
            }}
            className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition-transform duration-500 drop-shadow-md"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
            {isOutOfStock ? (
              <span className="text-xs font-semibold bg-rose-600 text-white px-2.5 py-0.5 rounded-md">
                Out of Stock
              </span>
            ) : product.badge ? (
              <span className="text-xs font-semibold bg-neutral-900 text-white px-2.5 py-0.5 rounded-md">
                {product.badge}
              </span>
            ) : null}
            {discountPercent > 0 && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleWishlist(product.id)
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white text-neutral-600 hover:text-neutral-950 flex items-center justify-center transition-colors hover:bg-neutral-100 cursor-pointer"
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isFavorite ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>

          {/* Quick View Pill on Hover */}
          <div className="absolute inset-x-4 bottom-3 z-10 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="bg-white text-neutral-800 text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              Quick View
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="pt-4 space-y-2">
          {/* Brand & Star Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-xs text-neutral-600">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-neutral-700 font-semibold text-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="text-base sm:text-lg font-bold text-neutral-900 font-['Outfit'] hover:text-neutral-700 transition-colors line-clamp-1 cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Flipkart / Amazon Style Variants Pills */}
          {hasMultipleVariants && (
            <div 
              onClick={() => setQuickViewProduct(product)}
              className="flex items-center gap-1.5 flex-wrap cursor-pointer"
            >
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/90 px-2 py-0.5 rounded-md hover:bg-blue-100/80 transition-colors">
                <Layers className="w-3 h-3 text-blue-600" />
                {variantCount} Variants
              </span>
              {product.variants!.slice(0, 2).map((v, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium text-neutral-600 bg-neutral-100 border border-neutral-200/60 px-1.5 py-0.5 rounded"
                >
                  {v.name}
                </span>
              ))}
              {product.variants!.length > 2 && (
                <span className="text-[10px] text-neutral-400 font-medium">
                  +{product.variants!.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Tagline / Key Highlight */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed min-h-[32px]">
            {product.tagline || product.description}
          </p>

          {/* Warranty Note */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.warranty}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Actions Footer */}
      <div className="pt-3 mt-2 space-y-3">
        {/* Pricing Block */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {hasMultipleVariants && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  From
                </span>
              )}
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-['Outfit']">
                {formatINR(minPrice)}
              </span>
              {product.originalPrice > minPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  MRP {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                Save {formatINR(savingsAmount)}
              </span>
            )}
          </div>

          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
            <span>100% Brand Sealed • Official Warranty</span>
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-12 gap-2 pt-1">
          {isOutOfStock ? (
            <Button
              disabled
              variant="outline"
              size="sm"
              className="col-span-9 sm:col-span-9 gap-1.5 text-xs font-semibold rounded-xl bg-neutral-200/90 text-neutral-800 cursor-not-allowed border-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 opacity-60" />
              <span>Out of Stock</span>
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              variant="default"
              size="sm"
              className={`col-span-9 sm:col-span-9 gap-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                addedRecently
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : hasMultipleVariants
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {addedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Cart</span>
                </>
              ) : hasMultipleVariants ? (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Select Variant</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-70" />
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </Button>
          )}

          <button
            onClick={handleWhatsApp}
            className="col-span-3 sm:col-span-3 flex items-center justify-center p-2 rounded-xl bg-neutral-100 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-700 transition-colors cursor-pointer"
            title="Inquire on WhatsApp"
            aria-label="Inquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
