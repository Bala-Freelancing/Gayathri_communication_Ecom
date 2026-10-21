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
  X, 
  Save, 
  Plus,
  FileSpreadsheet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddStockModal } from '@/components/admin/AddStockModal'

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
  }

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingProduct) return
    if (!editFormData.name.trim()) {
      showToast('Product name cannot be empty', 'error')
      return
    }

    setSavingEdit(true)
    const detailsRes = await productService.updateProductDetails(editingProduct.id, {
      name: editFormData.name,
      brand: editFormData.brand,
      tagline: editFormData.tagline,
      warranty: editFormData.warranty,
    })

    const stockRes = await productService.updateProductStock(
      editingProduct.id,
      editFormData.stockQuantity
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
                stockQuantity: editFormData.stockQuantity,
                inStock: editFormData.stockQuantity > 0,
              }
            : p
        )
      )
      setEditingProduct(null)
      showToast('Product details updated successfully!', 'success')
    } else {
      showToast(detailsRes.error || stockRes.error || 'Failed to save changes', 'error')
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
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No matching products found.
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
                            <p className="font-bold text-white truncate max-w-[220px]">
                              {product.name}
                            </p>
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
                        <div>{formatINR(product.price)}</div>
                        <div className="text-[10px] text-slate-500 line-through">
                          {formatINR(product.originalPrice)}
                        </div>
                      </td>

                      {/* Stock Units */}
                      <td className="py-3 px-3">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(product)}
                          className="h-8 gap-1.5 text-xs border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Edit</span>
                        </Button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base font-['Outfit']">
                    Edit Product Specifications
                  </h3>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.stockQuantity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stockQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    />
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
