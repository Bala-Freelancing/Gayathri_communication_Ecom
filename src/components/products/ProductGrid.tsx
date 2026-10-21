import React, { useMemo, useState } from 'react'
import { 
  Smartphone, 
  Tv, 
  Refrigerator, 
  Headphones,
  Monitor,
  X,
  Search,
  Layers
} from 'lucide-react'
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts'
import { useCartStore } from '@/store/useCartStore'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductCategory } from '@/types/product'

export const ProductGrid: React.FC = () => {
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
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false
        }
        // Brand filter
        if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false
        }
        // Search query filter
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
        return 0 // featured default
      })
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy])

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSelectedBrand('all')
    setSearchQuery('')
    setSortBy('featured')
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery !== ''

  return (
    <section id="products-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
            Showroom Catalogue
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
            Curated Showroom Inventory
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">
            Displaying {filteredProducts.length} certified original models with official manufacturer warranty and GST invoice.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-neutral-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 shadow-2xs cursor-pointer"
          >
            <option value="featured">Featured & Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Highest Savings</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {categoryCounts[cat.value] || 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Brand Filters Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs no-scrollbar">
        <span className="text-neutral-400 font-medium shrink-0">Filter by Brand:</span>
        {brands.map((brand) => {
          const isActive = selectedBrand.toLowerCase() === brand.toLowerCase()
          return (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
              }`}
            >
              {brand === 'all' ? 'All Brands' : brand}
            </button>
          )
        })}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors shrink-0 pl-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-3xl p-8 space-y-4">
          <Search className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-800 font-['Outfit']">
            No products match your filter
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or resetting all active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </section>
  )
}
