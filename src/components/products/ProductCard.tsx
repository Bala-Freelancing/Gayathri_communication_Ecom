import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  MessageCircle,
  Check
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

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const savingsAmount = product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0

  const isFavorite = isInWishlist(product.id)
  const isOutOfStock = !product.inStock || product.stockQuantity === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock) return
    addToCart(product)
    setAddedRecently(true)
    setTimeout(() => setAddedRecently(false), 1600)
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const msgText = isOutOfStock
      ? `Hello Gayathri Communication, I am interested in ${product.name} (Selling Price: ${formatINR(product.price)}). It is currently marked Out of Stock. When will it be available in your showroom?`
      : `Hello Gayathri Communication, I am interested in ${product.name} (Selling Price: ${formatINR(product.price)}). Is this available in stock?`
    const msg = encodeURIComponent(msgText)
    window.open(`https://wa.me/${storeDetails.whatsapp}?text=${msg}`, '_blank')
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-card-hover select-none"
    >
      <div>
        {/* Prominent Product Media Container */}
        <div 
          onClick={() => setQuickViewProduct(product)}
          className="relative aspect-square w-full rounded-2xl bg-neutral-50/90 p-6 flex items-center justify-center overflow-hidden cursor-pointer group/img transition-colors hover:bg-neutral-100/70"
        >
          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
            {isOutOfStock ? (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                Out of Stock
              </span>
            ) : product.badge ? (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                {product.badge}
              </span>
            ) : null}
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shadow-2xs">
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
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 border border-neutral-200 text-neutral-600 hover:text-neutral-950 flex items-center justify-center transition-colors shadow-2xs hover:bg-white cursor-pointer"
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isFavorite ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>

          {/* Product Image with Subtle Scale on Hover */}
          <img
            src={
              isHovered && product.gallery && product.gallery.length > 1
                ? product.gallery[1]
                : product.image
            }
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget
              if (!target.src.endsWith('/images/placeholder-product.svg')) {
                target.src = '/images/placeholder-product.svg'
              }
            }}
            className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition-transform duration-500 drop-shadow-md"
          />

          {/* Quick View Pill on Hover */}
          <div className="absolute inset-x-4 bottom-3 z-10 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="bg-white/95 border border-neutral-200 text-neutral-800 text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              Quick View
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="pt-4 space-y-2">
          {/* Brand & Star Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
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

          {/* Tagline / Key Highlight */}
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed min-h-[32px]">
            {product.tagline || product.description}
          </p>

          {/* Warranty Note */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.warranty}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Actions Footer */}
      <div className="pt-4 mt-3 border-t border-neutral-100 space-y-3">
        {/* Pricing Block */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-['Outfit']">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  MRP {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Save {formatINR(savingsAmount)}
              </span>
            )}
          </div>

          {product.emiStartsAt > 0 && (
            <p className="text-[11px] text-neutral-500 font-medium mt-1">
              No-Cost EMI from <span className="font-bold text-neutral-800">{formatINR(product.emiStartsAt)}/mo*</span>
            </p>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-12 gap-2 pt-1">
          {isOutOfStock ? (
            <Button
              disabled
              variant="outline"
              size="sm"
              className="col-span-9 sm:col-span-9 gap-1.5 text-xs font-semibold rounded-xl bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed opacity-80"
            >
              <ShoppingBag className="w-3.5 h-3.5 opacity-50" />
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
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {addedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Cart</span>
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
            className="col-span-3 sm:col-span-3 flex items-center justify-center p-2 rounded-xl border border-neutral-200/90 bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs cursor-pointer"
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
