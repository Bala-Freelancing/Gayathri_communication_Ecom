import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { productService } from '@/services/productService'
import { formatINR } from '@/lib/utils'
import { 
  Package, 
  Search, 
  Edit3, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  X, 
  Save, 
  Plus,
  FileSpreadsheet,
  Trash2,
  Sparkles,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddStockModal } from '@/components/admin/AddStockModal'
import { useHeroBanners } from '@/hooks/useHeroBanners'
import { HeroSlideConfig } from '@/types/heroBanner'

interface AdminProductRow {
  id: string
  name: string
  tagline?: string
  brand: string
  category: string
  sku: string
  price: number
  originalPrice: number
  stockQuantity: number
  inStock: boolean
  isActive: boolean
  image: string
  warranty?: string
  specs?: { label: string; value: string }[]
  variants?: any[]
  updatedAt: string
}

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<AdminProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  
  // Hero Banners Integration
  const { slides, saveSlide } = useHeroBanners(true)

  const isProductInHero = (productId: string) => {
    return slides.some((s) => s.productId === productId)
  }

  const handleFeatureInHero = (product: AdminProductRow) => {
    const brand = product.brand || 'Authorized'
    const name = product.name || 'Flagship Product'
    const shortLabel = name.length > 18 ? name.split(' ').slice(0, 3).join(' ') : name

    const specs: string[] = []
    if (Array.isArray(product.specs) && product.specs.length > 0) {
      specs.push(...product.specs.slice(0, 3).map((s: any) => `${s.label}: ${s.value}`))
    }
    if (specs.length === 0) {
      if (product.warranty) specs.push(product.warranty)
      specs.push('Original Brand Sealed')
      specs.push('Express Showroom Pickup')
    }

    const newSlide: HeroSlideConfig = {
      id: `slide-${product.id}-${Date.now().toString(36)}`,
      productId: product.id,
      matchKeywords: [name.toUpperCase(), brand.toUpperCase()],
      brandTag: `${brand} Official Authorized Retailer`,
      badgeText: 'Verified Showroom Savings',
      kicker: 'Featured Flagship Spotlight',
      modelName: name,
      headline: product.tagline || `${name} — Direct Brand Sealed`,
      shortLabel,
      description: product.tagline || `100% genuine brand sealed box with official manufacturer warranty and express counter pickup at Gayathri Communication.`,
      specs: specs.slice(0, 3),
      image: product.image || '/images/placeholder-product.svg',
      imageAlt: name,
      fallbackPrice: Number(product.price) || 0,
      fallbackOriginalPrice: Number(product.originalPrice) || Number(product.price) || 0,
      primaryCtaText: 'Inquire on WhatsApp',
      secondaryCtaText: 'Quick View',
      isActive: true,
      orderIndex: slides.length,
      updatedAt: new Date().toISOString(),
    }

    saveSlide(newSlide)
    showToast(`🎉 "${product.name}" added to Homepage Hero Carousel!`, 'success')
  }
  
  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<AdminProductRow | null>(null)
  const [editFormData, setEditFormData] = useState<{
    name: string
    brand: string
    tagline: string
    warranty: string
    stockQuantity: number
  }>({
    name: '',
    brand: '',
    tagline: '',
    warranty: '',
    stockQuantity: 0
  })
  const [savingEdit, setSavingEdit] = useState(false)
  const [showAddStockModal, setShowAddStockModal] = useState(false)

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const reloadProducts = () => {
    productService.fetchAllProductsAdmin().then((res) => {
      if (res.data) {
        setProducts(res.data as AdminProductRow[])
      }
    })
  }

  useEffect(() => {
    let isMounted = true
    productService.fetchAllProductsAdmin().then((res) => {
      if (isMounted) {
        if (res.data) {
          setProducts(res.data as AdminProductRow[])
        }
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Categories & Brands list
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(set)]
  }, [products])

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand))
    return ['all', ...Array.from(set)]
  }, [products])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
      const matchBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase()
      const matchStatus =
        selectedStatus === 'all'
          ? true
          : selectedStatus === 'active'
          ? p.isActive
          : !p.isActive

      return matchSearch && matchCategory && matchBrand && matchStatus
    })
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedStatus])

  // Toggle active status
  const handleToggleActive = async (product: AdminProductRow) => {
    const newStatus = !product.isActive
    const res = await productService.toggleProductActive(product.id, newStatus)
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: newStatus } : p))
      )
      showToast(
        `Product "${product.name}" is now ${newStatus ? 'Active & Live' : 'Deactivated'}`,
        'success'
      )
    } else {
      showToast(res.error || 'Failed to update product status', 'error')
    }
  }

  // Toggle stock status (In Stock / Out of Stock)
  const handleToggleStock = async (product: AdminProductRow) => {
    const isCurrentlyInStock = product.inStock && product.stockQuantity > 0
    const willBeInStock = !isCurrentlyInStock
    const nextQty = willBeInStock ? (product.stockQuantity > 0 ? product.stockQuantity : 10) : 0

    const res = await productService.toggleProductStock(product.id, willBeInStock, nextQty)
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                inStock: willBeInStock,
                stockQuantity: nextQty,
                variants: Array.isArray(p.variants)
                  ? p.variants.map((v) => ({
                      ...v,
                      inStock: willBeInStock,
                      stockQuantity: willBeInStock ? (v.stockQuantity > 0 ? v.stockQuantity : nextQty) : 0,
                    }))
                  : p.variants,
              }
            : p
        )
      )
      showToast(
        willBeInStock
          ? `Marked "${product.name}" as In Stock`
          : `Marked "${product.name}" as Out of Stock`,
        'success'
      )
    } else {
      showToast(res.error || 'Failed to update stock status', 'error')
    }
  }

  const [editVariants, setEditVariants] = useState<any[]>([])

  // Open Edit Modal
  const handleOpenEdit = (product: AdminProductRow) => {
    setEditingProduct(product)
    setEditFormData({
      name: product.name,
      brand: product.brand,
      tagline: product.tagline || '',
      warranty: product.warranty || '1 Year Official Brand Warranty',
      stockQuantity: product.stockQuantity || 0
    })
    setEditVariants(
      Array.isArray(product.variants)
        ? product.variants.map((v: any, idx: number) => ({
            id: v.id || `var-${Date.now()}-${idx}`,
            name: v.name || '',
            price: v.price !== undefined ? String(v.price) : '',
            originalPrice: v.originalPrice !== undefined ? String(v.originalPrice) : '',
            stockQuantity: v.stockQuantity !== undefined ? String(v.stockQuantity) : '10',
            sku: v.sku || ''
          }))
        : []
    )
  }

  const handleAddVariantToEdit = (presetName?: string) => {
    const nextIdx = editVariants.length + 1
    const defaultName = presetName || (nextIdx === 1 ? '8GB + 128GB' : nextIdx === 2 ? '8GB + 256GB' : nextIdx === 3 ? '12GB + 512GB' : `Variant ${nextIdx}`)
    setEditVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: defaultName,
        price: '',
        originalPrice: '',
        stockQuantity: '10',
        sku: `GC-VAR-${nextIdx}`
      }
    ])
  }

  const handleUpdateEditVariant = (id: string, field: string, value: string) => {
    setEditVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  const handleDeleteEditVariant = (id: string) => {
    setEditVariants((prev) => prev.filter((v) => v.id !== id))
  }

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingProduct) return
    if (!editFormData.name.trim()) {
      showToast('Product name cannot be empty', 'error')
      return
    }

    setSavingEdit(true)

    // Format variants if present
    const formattedVariants = editVariants
      .filter((v) => v.name.trim() !== '')
      .map((v, idx) => {
        const vPrice = parseFloat(v.price) || 0
        const vMrp = parseFloat(v.originalPrice) || Math.round(vPrice * 1.14)
        const vStock = parseInt(v.stockQuantity, 10) || 0
        return {
          id: v.id || `var-${Date.now()}-${idx}`,
          sku: v.sku || `GC-VAR-${idx + 1}`,
          name: v.name.trim(),
          price: vPrice,
          originalPrice: vMrp >= vPrice ? vMrp : vPrice,
          stockQuantity: vStock,
          inStock: vStock > 0,
          attributes: {
            storage: v.name.trim()
          }
        }
      })

    const hasNewVariants = formattedVariants.length > 0
    const validPrices = formattedVariants.map((v) => v.price).filter((p) => p > 0)
    const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : editingProduct.price
    const totalVariantStock = hasNewVariants
      ? formattedVariants.reduce((sum, v) => sum + v.stockQuantity, 0)
      : editFormData.stockQuantity

    const detailsRes = await productService.updateProductDetails(editingProduct.id, {
      name: editFormData.name,
      brand: editFormData.brand,
      tagline: editFormData.tagline,
      warranty: editFormData.warranty,
      variants: formattedVariants,
      sellingPrice: minPrice > 0 ? minPrice : undefined,
      stockQuantity: totalVariantStock > 0 ? totalVariantStock : editFormData.stockQuantity
    })

    const stockRes = await productService.updateProductStock(
      editingProduct.id,
      totalVariantStock > 0 ? totalVariantStock : editFormData.stockQuantity
    )

    setSavingEdit(false)

    if (detailsRes.success && stockRes.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: editFormData.name,
                brand: editFormData.brand,
                tagline: editFormData.tagline,
                warranty: editFormData.warranty,
                price: minPrice > 0 ? minPrice : p.price,
                stockQuantity: totalVariantStock > 0 ? totalVariantStock : editFormData.stockQuantity,
                inStock: (totalVariantStock > 0 || editFormData.stockQuantity > 0),
                variants: formattedVariants
              }
            : p
        )
      )
      setEditingProduct(null)
      showToast('Product and variants updated successfully!', 'success')
    } else {
      showToast(detailsRes.error || stockRes.error || 'Failed to save changes', 'error')
    }
  }

  const handleDeleteProduct = async (product: AdminProductRow) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${product.name}" from inventory?`)) {
      return
    }
    const res = await productService.deleteProduct(product.id)
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      showToast(`Product "${product.name}" deleted successfully`, 'success')
    } else {
      showToast(res.error || 'Failed to delete product', 'error')
    }
  }

  const handleClearAllStocks = async () => {
    if (products.length === 0) return
    const confirmation = window.prompt(
      `WARNING: This will permanently remove all ${products.length} stock models from the showroom catalog.\n\nType "CLEAR" to confirm:`
    )
    if (confirmation !== 'CLEAR') {
      return
    }
    const res = await productService.clearAllProducts()
    if (res.success) {
      setProducts([])
      showToast('All showroom stock has been successfully cleared.', 'success')
    } else {
      showToast(res.error || 'Failed to clear all products', 'error')
    }
  }

  return (
    <AdminLayout
      title="Product Catalog & Specifications"
      subtitle="Manage models, brand authorizations, warranties and live catalog status."
      actions={
        <div className="flex items-center gap-2.5">
          <Badge variant="outline" className="text-slate-400 border-slate-800 hidden sm:inline-flex">
            {filteredProducts.length} Models Listed
          </Badge>
          {products.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearAllStocks}
              className="text-xs font-semibold border-rose-900/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 hover:text-white gap-1.5 px-3 py-1.5 rounded-xl shadow-sm"
              title="Clear all showroom products"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Clear All Stocks
            </Button>
          )}
          <Link to="/admin/hero-banners">
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-semibold border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/50 hover:text-white gap-1.5 px-3 py-1.5 rounded-xl shadow-sm"
              title="Manage Homepage Hero Carousel"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Hero Banners ({slides.length})
            </Button>
          </Link>
          <Link to="/admin/import">
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-semibold border-slate-700 bg-slate-900 text-cyan-300 hover:bg-slate-800 hover:text-white gap-1.5 px-3 py-1.5 rounded-xl shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" /> Import Stock (Excel)
            </Button>
          </Link>
          <Button
            onClick={() => setShowAddStockModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" /> Add New Stock
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Feedback Alert Toast */}
        {toastMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/60 border-rose-800 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model, brand or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              {categories.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>
                  {c.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>

            {/* Brand Select */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Brands</option>
              {brands.filter((b) => b !== 'all').map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-3">SKU & Category</th>
                  <th className="py-3.5 px-3">Selling Price</th>
                  <th className="py-3.5 px-3">Stock Units</th>
                  <th className="py-3.5 px-3">Storefront Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Loading certified catalog...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      {products.length === 0 ? (
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                            <Package className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white font-['Outfit']">
                              No Products in Inventory
                            </h4>
                            <p className="text-xs text-slate-400">
                              Your showroom stock is currently empty. Click <strong>Add New Stock</strong> to add your models manually and upload photos.
                            </p>
                          </div>
                          <Button
                            onClick={() => setShowAddStockModal(true)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                          >
                            <Plus className="w-4 h-4" /> Add New Stock
                          </Button>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-xs">
                          No matching products found for the selected filters.
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-900/30 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-white truncate max-w-[200px]">
                                {product.name}
                              </p>
                              {product.variants && product.variants.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-300 bg-blue-950/80 border border-blue-500/40 px-1.5 py-0.5 rounded-full flex-shrink-0 shadow-sm shadow-blue-500/10">
                                  ⚡ {product.variants.length} Variants
                                </span>
                              )}
                              {isProductInHero(product.id) && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.5 rounded-full flex-shrink-0 shadow-sm shadow-amber-500/10">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> In Hero
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Category */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-cyan-400 bg-cyan-950/40 border border-cyan-900/50 px-1.5 py-0.5 rounded">
                          {product.sku}
                        </span>
                        <p className="text-[11px] text-slate-400 capitalize mt-1">
                          {product.category.replace('-', ' ')}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 font-semibold text-white">
                        {product.variants && product.variants.length > 1 ? (
                          <div>
                            <span className="text-[10px] text-cyan-400 font-normal">From </span>
                            <span>{formatINR(product.price)}</span>
                          </div>
                        ) : (
                          <div>{formatINR(product.price)}</div>
                        )}
                        <div className="text-[10px] text-slate-500 line-through">
                          {formatINR(product.originalPrice)}
                        </div>
                      </td>

                      {/* Stock Units & Toggle */}
                      <td className="py-3 px-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                product.inStock && product.stockQuantity > 0
                                  ? 'bg-emerald-400'
                                  : 'bg-rose-400'
                              }`}
                            />
                            <span className="font-bold text-white">
                              {product.stockQuantity ?? (product.inStock ? 10 : 0)}
                            </span>
                            <span className="text-[10px] text-slate-400">in showroom</span>
                          </div>

                          {/* Instant Stock Status Action */}
                          {product.inStock && product.stockQuantity > 0 ? (
                            <button
                              onClick={() => handleToggleStock(product)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-colors shadow-xs cursor-pointer"
                              title="Mark this model Out of Stock"
                            >
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                              <span>Mark Out of Stock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStock(product)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 transition-colors shadow-xs cursor-pointer"
                              title="Mark this model In Stock"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              <span>Mark In Stock</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            product.isActive
                              ? 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/60'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-400" />
                              <span>Live on Store</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isProductInHero(product.id) ? (
                            <Link to="/admin/hero-banners">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 text-xs border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 hover:text-white px-2.5"
                                title="This product is featured in Hero Banner. Click to manage/reorder"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden xl:inline">In Hero</span>
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFeatureInHero(product)}
                              className="h-8 gap-1.5 text-xs border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/30 text-slate-300 hover:text-amber-300 px-2.5"
                              title="Feature this stock model in Homepage Hero Carousel"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                              <span className="hidden xl:inline">+ Hero</span>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(product)}
                            className="h-8 gap-1.5 text-xs border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product)}
                            className="h-8 text-xs border-slate-800 hover:border-rose-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 px-2.5"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base font-['Outfit']">
                    Edit Product & Variant Configurations
                  </h3>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Product Title / Model Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.brand}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, brand: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Showroom Stock Units
                      {editVariants.length > 0 && (
                        <span className="text-[10px] text-cyan-400 ml-1.5 font-normal">
                          (Sum of variants: {editVariants.reduce((sum, v) => sum + (parseInt(v.stockQuantity, 10) || 0), 0)})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={
                        editVariants.length > 0
                          ? editVariants.reduce((sum, v) => sum + (parseInt(v.stockQuantity, 10) || 0), 0)
                          : editFormData.stockQuantity
                      }
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stockQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={editVariants.length > 0}
                      className={`w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 ${
                        editVariants.length > 0 ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    />
                    <div className="flex items-center gap-2 pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditFormData((prev) => ({ ...prev, stockQuantity: 0 }))
                          if (editVariants.length > 0) {
                            setEditVariants((prev) => prev.map((v) => ({ ...v, stockQuantity: '0' })))
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        Mark Out of Stock (0)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditFormData((prev) => ({ ...prev, stockQuantity: 10 }))
                          if (editVariants.length > 0) {
                            setEditVariants((prev) => prev.map((v) => ({ ...v, stockQuantity: '10' })))
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Mark In Stock (10)
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    value={editFormData.tagline}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Warranty Terms
                  </label>
                  <input
                    type="text"
                    value={editFormData.warranty}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, warranty: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Interactive Variant Management Section (Flipkart / Amazon Style) */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-xs">
                        Product Variants ({editVariants.length})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono">
                        Flipkart / Amazon Architecture
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddVariantToEdit()}
                      className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs h-7 px-2.5 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Variant
                    </Button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Each model can have multiple RAM / Storage / Color configurations with separate selling prices and showroom stock.
                  </p>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
                    {['8GB + 128GB', '8GB + 256GB', '12GB + 256GB', '12GB + 512GB', '16GB + 512GB'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddVariantToEdit(preset)}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Plus className="w-2.5 h-2.5 text-cyan-400" />
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Variant Rows List */}
                  {editVariants.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-400 space-y-2 bg-slate-950/40">
                      <p className="text-xs">No individual variants configured yet for this model.</p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAddVariantToEdit()}
                        className="bg-slate-800 hover:bg-slate-700 text-white text-xs h-7 px-3"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Create First Variant
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {editVariants.map((v, idx) => (
                        <div
                          key={v.id || idx}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-slate-700/80 transition-colors shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center justify-center text-[9px] font-mono">
                                {idx + 1}
                              </span>
                              Variant #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteEditVariant(v.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-950/30 transition-colors"
                              title="Delete variant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div className="sm:col-span-1">
                              <label className="block text-[10px] text-slate-400 mb-0.5">Configuration</label>
                              <input
                                type="text"
                                placeholder="e.g. 8GB + 256GB"
                                value={v.name}
                                onChange={(e) => handleUpdateEditVariant(v.id, 'name', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-emerald-400 mb-0.5 font-medium">Selling Price (₹)</label>
                              <input
                                type="number"
                                placeholder="e.g. 29999"
                                value={v.price}
                                onChange={(e) => handleUpdateEditVariant(v.id, 'price', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-emerald-900/60 rounded-lg text-emerald-300 text-xs focus:outline-none focus:border-emerald-400 font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">MRP / Original (₹)</label>
                              <input
                                type="number"
                                placeholder="e.g. 34999"
                                value={v.originalPrice}
                                onChange={(e) => handleUpdateEditVariant(v.id, 'originalPrice', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-cyan-400 mb-0.5 font-medium">Stock Units</label>
                              <input
                                type="number"
                                min="0"
                                placeholder="10"
                                value={v.stockQuantity}
                                onChange={(e) => handleUpdateEditVariant(v.id, 'stockQuantity', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-cyan-900/60 rounded-lg text-cyan-300 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary Note */}
                  {editVariants.length > 0 && (
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <span>
                        Lowest Selling Price:{' '}
                        <strong className="text-emerald-400 font-mono">
                          {formatINR(
                            Math.min(
                              ...editVariants
                                .map((v) => parseFloat(v.price) || 0)
                                .filter((p) => p > 0)
                            ) || 0
                          )}
                        </strong>{' '}
                        (Displayed as "From ₹..." on storefront)
                      </span>
                      <span>
                        Total Stock:{' '}
                        <strong className="text-cyan-400 font-mono">
                          {editVariants.reduce(
                            (sum, v) => sum + (parseInt(v.stockQuantity, 10) || 0),
                            0
                          )}{' '}
                          units
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  disabled={savingEdit}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Stock Modal */}
        <AddStockModal
          isOpen={showAddStockModal}
          onClose={() => setShowAddStockModal(false)}
          onSuccess={(newProduct, sku) => {
            showToast(`Product "${newProduct.name}" added successfully with SKU ${sku}!`, 'success')
            reloadProducts()
          }}
        />

      </div>
    </AdminLayout>
  )
}
