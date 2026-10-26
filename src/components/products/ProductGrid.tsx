import React, { useMemo, useState, useEffect } from 'react'
import { 
  Smartphone, 
  Tv, 
  Refrigerator, 
  Headphones, 
  Monitor, 
  X, 
  Search, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts'
import { useCartStore } from '@/store/useCartStore'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductCategory } from '@/types/product'

const ITEMS_PER_PAGE = 60

interface ProductGridProps {
  hideTitle?: boolean
}

export const ProductGrid: React.FC<ProductGridProps> = ({ hideTitle = false }) => {
  const { products } = useRealtimeProducts()
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    selectedBrand, 
    setSelectedBrand 
  } = useCartStore()

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured')
  const [currentPage, setCurrentPage] = useState(1)

  const categories: { label: string; value: ProductCategory; icon: React.ReactNode }[] = [
    { label: 'All Inventory', value: 'all', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Smartphones & 5G', value: 'smartphones', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { label: '4K & OLED TVs', value: 'smart-tvs', icon: <Tv className="w-3.5 h-3.5" /> },
    { label: 'Home Appliances', value: 'home-appliances', icon: <Refrigerator className="w-3.5 h-3.5" /> },
    { label: 'Accessories', value: 'accessories', icon: <Headphones className="w-3.5 h-3.5" /> },
    { label: 'Other Electronics', value: 'other-electronics', icon: <Monitor className="w-3.5 h-3.5" /> },
  ]

  // Dynamic product count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length }
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [products])

  // Dynamic product count per brand
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length }
    for (const p of products) {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1
      }
    }
    return counts
  }, [products])

  // Derive unique brands dynamically from active product inventory
  const brands = useMemo(() => {
    const brandSet = new Set<string>()
    for (const p of products) {
      if (p.brand) brandSet.add(p.brand)
    }
    return ['all', ...Array.from(brandSet)]
  }, [products])

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false
        }
        if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase()
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            (p.specs && p.specs.some((s) => s.value.toLowerCase().includes(q)))
          )
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'discount') {
          const discA = (a.originalPrice - a.price) / a.originalPrice
          const discB = (b.originalPrice - b.price) / b.originalPrice
          return discB - discA
        }
        return 0
      })
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy])

  // Reset to page 1 on filter/category/search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedBrand, searchQuery, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSelectedBrand('all')
    setSearchQuery('')
    setSortBy('featured')
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery !== ''

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const el = document.getElementById('products-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="products-section" className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Section Header: Cohesive, Balanced without Empty-Middle Hole */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div className="flex flex-wrap items-baseline gap-2.5">
          {!hideTitle && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
              Curated Showroom Inventory
            </h2>
          )}
          <span className="text-sm text-neutral-600 font-medium">
            Showing {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} models
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-700 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm font-medium bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
          >
            <option value="featured">Featured & Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Highest Savings</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
              }`}>
                {categoryCounts[cat.value] || 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Brand Filters - Clean Wrap, No Edge Text Cutoff */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <span className="text-neutral-800 font-semibold shrink-0">Brand:</span>
        {brands.map((brand) => {
          const isActive = selectedBrand.toLowerCase() === brand.toLowerCase()
          const count = brand === 'all' ? products.length : (brandCounts[brand] || 0)
          return (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200/80'
              }`}
            >
              <span>{brand === 'all' ? 'All Brands' : brand}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-neutral-200/90 text-neutral-700'
              }`}>
                {count}
              </span>
            </button>
          )
        })}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1 transition-colors pl-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid: 12 per page, Compact, High-Density */}
      {displayedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Clean Pagination Controls (Eliminating Endless White Space) */}
          {totalPages > 1 && (
            <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-neutral-600 font-medium">
                Page <strong className="text-neutral-900 font-bold">{currentPage}</strong> of <strong className="text-neutral-900 font-bold">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {/* Numbered Jump Buttons for First Few & Last Pages */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i)
                  }
                  const isCurrent = pageNum === currentPage
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-neutral-900 text-white'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <Search className="w-8 h-8 text-neutral-300 mx-auto" />
          <h3 className="text-base font-bold text-neutral-800 font-['Outfit']">
            No products match your filter
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or resetting all active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </section>
  )
}
