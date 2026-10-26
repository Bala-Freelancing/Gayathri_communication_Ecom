import React, { useState } from 'react'
import { ChevronUp, ChevronDown, X, Package, MessageCircle } from 'lucide-react'
import { Product } from '@/types/product'
import { formatINR } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import { storeDetails } from '@/data/mockProducts'
import { getCategoryDisplayName } from '@/data/categories'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface MinimalProductDetailProps {
  product: Product | null
  onClose: () => void
}

export const MinimalProductDetail: React.FC<MinimalProductDetailProps> = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen, generateProductInquiryUrl } = useCartStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)

  if (!product) return null

  // Extract variants with separate pricing
  const concreteVariants = (product.variants && product.variants.length > 0)
    ? product.variants.map((v, i) => ({
        id: v.id || `var-${i}`,
        name: v.name,
        price: v.price ?? product.price,
        originalPrice: v.originalPrice ?? product.originalPrice,
        inStock: v.inStock ?? product.inStock,
        stockQuantity: v.stockQuantity ?? product.stockQuantity ?? 10,
        options: v.options,
      }))
    : []

  const activeVariant = concreteVariants[selectedVariantIndex] || null
  const currentPrice = activeVariant ? activeVariant.price : product.price
  const currentOriginalPrice = activeVariant?.originalPrice && activeVariant.originalPrice > 0
    ? activeVariant.originalPrice
    : product.originalPrice

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]
  const currentImage = images[selectedImageIndex] || product.image

  const handleBuyNow = () => {
    const variantLabel = activeVariant?.name || undefined
    addToCart(product, variantLabel, 1, currentPrice, currentOriginalPrice)
    onClose()
    setIsCartOpen(true)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      {/* Main White Card Frame */}
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl p-6 sm:p-10 md:p-12 overflow-hidden text-neutral-900 border border-neutral-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Vertical Thumbnails + Main Photo */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-center">
            
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col items-center gap-2 order-2 sm:order-1">
              <button
                onClick={() => setSelectedImageIndex((prev) => Math.max(0, prev - 1))}
                className="text-neutral-400 hover:text-neutral-800 p-0.5"
                disabled={selectedImageIndex === 0}
              >
                <ChevronUp className="w-4 h-4 hidden sm:block" />
              </button>

              <div className="flex sm:flex-col gap-2.5">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-2xl bg-[#f8f9fa] p-1.5 border transition-all flex items-center justify-center overflow-hidden ${
                      selectedImageIndex === idx
                        ? 'border-neutral-900 shadow-sm'
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.src.endsWith('/images/placeholder-product.svg')) {
                          target.src = '/images/placeholder-product.svg'
                        }
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedImageIndex((prev) => Math.min(images.length - 1, prev + 1))}
                className="text-neutral-400 hover:text-neutral-800 p-0.5"
                disabled={selectedImageIndex === images.length - 1}
              >
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>
            </div>

            {/* Main Product Isolated Photo */}
            <div className="flex-1 w-full aspect-square max-w-md rounded-2xl bg-[#f8f9fa] flex items-center justify-center p-8 order-1 sm:order-2">
              <img
                src={currentImage}
                alt={product.name}
                onError={(e) => {
                  const target = e.currentTarget
                  if (!target.src.endsWith('/images/placeholder-product.svg')) {
                    target.src = '/images/placeholder-product.svg'
                  }
                }}
                className="max-h-full max-w-full object-contain transition-all duration-300"
              />
            </div>

          </div>

          {/* Right Column: Title, Dynamic Price, Flipkart/Amazon Variant Cards, Buy Now */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-['Outfit'] tracking-tight">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                {getCategoryDisplayName(product.category)}
              </p>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit']">
                  {formatINR(currentPrice)}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    MRP {formatINR(currentOriginalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Flipkart / Amazon Style Variants Selector */}
            {concreteVariants.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
                  <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                    Select Variant / Storage
                  </span>
                  {activeVariant && (
                    <span className="text-neutral-500 font-medium text-[11px]">
                      {activeVariant.name} • {formatINR(currentPrice)}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {concreteVariants.map((v, idx) => {
                    const isSelected = selectedVariantIndex === idx
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                        }`}
                      >
                        <div className="text-xs font-bold font-['Outfit'] line-clamp-1">
                          {v.name}
                        </div>
                        <div className={`text-sm font-extrabold mt-1 font-['Outfit'] ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                          {formatINR(v.price)}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Buy Now & WhatsApp Actions */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md active:scale-95 transition-all text-center cursor-pointer"
              >
                Buy now {activeVariant ? `(${activeVariant.name})` : ''}
              </button>

              <a
                href={generateProductInquiryUrl(product, activeVariant?.name, currentPrice)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-3 px-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Description matching Image 4 */}
            <div className="pt-2 text-xs text-neutral-600 leading-relaxed space-y-2 border-t border-neutral-100">
              <p className="font-semibold text-neutral-900">Description</p>
              <p>{product.tagline}</p>
              <p className="text-neutral-500">
                100% genuine box-packed unit with official GST tax invoice and valid manufacturer warranty across India.
              </p>
            </div>

            {/* Return & Warranty Note matching Image 4 */}
            <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
              <Package className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>14-day return and instant replacement support</span>
            </div>

            {/* Clean Accordions matching Image 4 */}
            <div className="pt-2">
              <Accordion type="single" collapsible className="w-full space-y-1">
                <AccordionItem value="item-1" className="border-b border-neutral-100 py-1">
                  <AccordionTrigger className="text-xs font-semibold text-neutral-900 hover:no-underline py-2.5">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-neutral-600 space-y-1 pb-3">
                    {product.specs.map((s, idx) => (
                      <div key={idx} className="flex justify-between py-0.5 border-b border-neutral-50">
                        <span className="text-neutral-400">{s.label}:</span>
                        <span className="font-medium text-neutral-800">{s.value}</span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b border-neutral-100 py-1">
                  <AccordionTrigger className="text-xs font-semibold text-neutral-900 hover:no-underline py-2.5">
                    Vendor Details
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-neutral-600 space-y-1 pb-3">
                    <p className="font-medium text-neutral-800">{storeDetails.name}</p>
                    <p>{storeDetails.address}</p>
                    <p>Phone: {storeDetails.phone}</p>
                    <p className="text-emerald-600 font-medium">Authorized Multi-Brand Dealer</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b border-neutral-100 py-1">
                  <AccordionTrigger className="text-xs font-semibold text-neutral-900 hover:no-underline py-2.5">
                    Return Policy
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-neutral-600 pb-3">
                    Full replacement guarantee on manufacturing defects within 14 days, accompanied by full brand warranty coverage at all authorized service centers nationwide.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
