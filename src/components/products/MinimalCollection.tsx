import React, { useMemo } from 'react'

import { Search } from 'lucide-react'
import { productsData } from '@/data/mockProducts'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'
import { Product, ProductCategory } from '@/types/product'

export const MinimalCollection: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setQuickViewProduct 
  } = useCartStore()

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'Smartphones', value: 'smartphones' },
    { label: 'Smart TVs', value: 'smart-tvs' },
    { label: 'Home Appliances', value: 'home-appliances' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Other Electronics', value: 'other-electronics' },
  ]

  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [selectedCategory, searchQuery])

  return (
    <section id="collection-section" className="w-full pt-12 pb-24 px-6 sm:px-12 md:px-16 border-t border-neutral-100 bg-white">
      {/* Header matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-['Outfit'] tracking-tight">
            Full collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {filteredProducts.length} results
          </p>
        </div>

        {/* Minimal Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Product Grid exactly matching Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {filteredProducts.map((product: Product) => (
          <div
            key={product.id}
            onClick={() => setQuickViewProduct(product)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            {/* Clean Isolated Product Image Box matching Image 3 */}
            <div className="relative aspect-square w-full rounded-2xl bg-[#f8f9fa] flex items-center justify-center p-8 overflow-hidden transition-colors group-hover:bg-[#f1f3f5]">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Typography matching Image 3 */}
            <div className="pt-4 text-left">
              <h3 className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors font-['Outfit']">
                {product.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                {product.tagline}
              </p>
              <p className="text-sm font-semibold text-neutral-900 mt-1 font-['Outfit']">
                {formatINR(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Floating Minimal Search Bar matching Image 3 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-lg text-xs text-neutral-700">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search flagships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 sm:w-48 bg-transparent outline-none text-xs text-neutral-800 placeholder-neutral-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-neutral-400 hover:text-neutral-700 font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
