import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { productsData } from '@/data/mockProducts'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'
import { Product, ProductCategory } from '@/types/product'

export const MoraCollection: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setQuickViewProduct 
  } = useCartStore()

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'Smartphones', value: 'smartphones' },
    { label: 'Smart TVs', value: 'smart-tvs' },
    { label: 'Appliances', value: 'home-appliances' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Other Electronics', value: 'other-electronics' },
  ]

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return productsData
    return productsData.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section id="collection-grid" className="w-full bg-[#060606] py-24 px-6 sm:px-12 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Editorial Collection Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="font-mono text-xs text-[#ff6a00] uppercase tracking-widest block mb-1">
              Authorized Stock
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
              The Collection
            </h2>
          </div>

          {/* Minimalist Monospace Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`font-mono text-xs px-3.5 py-1.5 rounded-full transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white border border-white/10 hover:border-white/30'
                }`}
              >
                [{cat.label}]
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Dark Luxury Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: Product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => setQuickViewProduct(product)}
              className="group cursor-pointer rounded-2xl bg-[#0b0b0b] border border-white/5 hover:border-white/20 p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              {/* Product Photo with Ambient Glow */}
              <div className="relative aspect-square w-full rounded-xl bg-[#0e0e0e] flex items-center justify-center p-8 overflow-hidden mb-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,100,0,0.06)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-10"
                />
              </div>

              {/* Title & Specs */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="uppercase text-[#ff6a00] text-[10px] tracking-wider">
                    {product.brand}
                  </span>
                  <span>{product.category}</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-white group-hover:text-[#ff7a1a] transition-colors line-clamp-1">
                  {product.name}
                </h3>

                <p className="font-mono text-[11px] text-neutral-500 line-clamp-1">
                  {product.tagline}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="text-left">
                    <span className="font-mono text-sm font-semibold text-white block">
                      {formatINR(product.price)}
                    </span>
                    <span className="font-mono text-[10px] text-[#ff7700] block mt-0.5 font-medium">
                      Brand Sealed Box Pack
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400 group-hover:text-white underline">
                    View Specs →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
