import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { productService } from '@/services/productService'
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Minus, 
  Save, 
  X, 
  RotateCcw,
  FileSpreadsheet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddStockModal } from '@/components/admin/AddStockModal'

interface InventoryItem {
  id: string
  name: string
  brand: string
  category: string
  sku: string
  stockQuantity: number
  inStock: boolean
  image: string
}

export const AdminInventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all')
  const [editedQuantities, setEditedQuantities] = useState<Record<string, number>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const loadInventory = async () => {
    setLoading(true)
    const res = await productService.fetchAllProductsAdmin()
    if (res.data) {
      const mapped = res.data.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        sku: p.sku,
        stockQuantity: p.stockQuantity ?? (p.inStock ? 10 : 0),
        inStock: p.inStock,
        image: p.image,
      }))
      setItems(mapped)
    }
    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true
    productService.fetchAllProductsAdmin().then((res) => {
      if (isMounted) {
        if (res.data) {
          const mapped = res.data.map((p) => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            sku: p.sku,
            stockQuantity: p.stockQuantity ?? (p.inStock ? 10 : 0),
            inStock: p.inStock,
            image: p.image,
          }))
          setItems(mapped)
        }
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleStockChange = (id: string, newQty: number) => {
    if (newQty < 0) return
    setEditedQuantities((prev) => ({
      ...prev,
      [id]: newQty,
    }))
  }

  const handleQuickAdjust = (id: string, delta: number) => {
    const currentQty = editedQuantities[id] !== undefined 
      ? editedQuantities[id] 
      : (items.find((i) => i.id === id)?.stockQuantity ?? 0)
    const nextQty = Math.max(0, currentQty + delta)
    handleStockChange(id, nextQty)
  }

  const handleSaveAll = async () => {
    const idsToUpdate = Object.keys(editedQuantities)
    if (idsToUpdate.length === 0) return

    setIsSaving(true)
    let errorCount = 0

    for (const id of idsToUpdate) {
      const res = await productService.updateProductStock(id, editedQuantities[id])
      if (!res.success) {
        errorCount++
      }
    }

    setIsSaving(false)

    if (errorCount === 0) {
      setItems((prev) =>
        prev.map((item) => {
          if (editedQuantities[item.id] !== undefined) {
            const qty = editedQuantities[item.id]
            return {
              ...item,
              stockQuantity: qty,
              inStock: qty > 0,
            }
          }
          return item
        })
      )
      setEditedQuantities({})
      showToast(`Updated stock counts for ${idsToUpdate.length} product(s) successfully!`, 'success')
    } else {
      showToast(`Saved with ${errorCount} error(s). Please review your updates.`, 'error')
      await loadInventory()
    }
  }

  const handleToggleStockStatus = async (item: InventoryItem) => {
    const currentQty =
      editedQuantities[item.id] !== undefined
        ? editedQuantities[item.id]
        : item.stockQuantity
    const willBeInStock = currentQty === 0
    const nextQty = willBeInStock ? 10 : 0

    setIsSaving(true)
    const res = await productService.toggleProductStock(item.id, willBeInStock, nextQty)
    setIsSaving(false)

    if (res.success) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, stockQuantity: nextQty, inStock: willBeInStock }
            : i
        )
      )
      setEditedQuantities((prev) => {
        const next = { ...prev }
        delete next[item.id]
        return next
      })
      showToast(
        willBeInStock
          ? `Marked "${item.name}" as In Stock (10 units)`
          : `Marked "${item.name}" as Out of Stock`,
        'success'
      )
    } else {
      showToast(res.error || 'Failed to update stock status', 'error')
    }
  }

  const handleDiscardChanges = () => {
    setEditedQuantities({})
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())

      const qty = editedQuantities[item.id] !== undefined ? editedQuantities[item.id] : item.stockQuantity

      let matchStock = true
      if (stockFilter === 'in-stock') matchStock = qty > 5
      if (stockFilter === 'low-stock') matchStock = qty > 0 && qty <= 5
      if (stockFilter === 'out-of-stock') matchStock = qty === 0

      return matchSearch && matchStock
    })
  }, [items, searchQuery, stockFilter, editedQuantities])

  const pendingCount = Object.keys(editedQuantities).length
  const totalUnits = items.reduce((acc, item) => {
    const q = editedQuantities[item.id] !== undefined ? editedQuantities[item.id] : item.stockQuantity
    return acc + q
  }, 0)
  const outOfStockCount = items.filter((item) => {
    const q = editedQuantities[item.id] !== undefined ? editedQuantities[item.id] : item.stockQuantity
    return q === 0
  }).length

  return (
    <AdminLayout
      title="Inventory & Showroom Stock"
      subtitle="Track physical floor units, adjust warehouse allocations and manage stock alerts."
      actions={
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="text-xs border-slate-800 text-slate-400"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : `Save ${pendingCount} Stock Update${pendingCount > 1 ? 's' : ''}`}
              </Button>
            </>
          )}
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
            size="sm"
            onClick={() => setShowAddStockModal(true)}
            className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white gap-1.5 px-3 py-1.5 rounded-xl shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Stock
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

        {/* Metrics Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Total Units In Stock
            </span>
            <p className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">
              {totalUnits}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Out of Stock Models
            </span>
            <p className="text-2xl font-extrabold text-rose-400 font-['Outfit'] mt-1">
              {outOfStockCount}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Unsaved Adjustments
            </span>
            <p className="text-2xl font-extrabold text-cyan-400 font-['Outfit'] mt-1">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by model, brand, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                stockFilter === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setStockFilter('in-stock')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                stockFilter === 'in-stock' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Well Stocked (&gt;5)
            </button>
            <button
              onClick={() => setStockFilter('low-stock')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                stockFilter === 'low-stock' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Low Stock (1-5)
            </button>
            <button
              onClick={() => setStockFilter('out-of-stock')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                stockFilter === 'out-of-stock' ? 'bg-slate-800 text-rose-400 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Out of Stock (0)
            </button>
          </div>
        </div>

        {/* Stock Management Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                  <th className="py-3.5 px-4">Item Details</th>
                  <th className="py-3.5 px-3">SKU</th>
                  <th className="py-3.5 px-3">Stock Condition</th>
                  <th className="py-3.5 px-3 text-center">Adjust Units</th>
                  <th className="py-3.5 px-3 text-center">Showroom Units</th>
                  <th className="py-3.5 px-4 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Loading stock units...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No products match this stock condition.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const currentQty =
                      editedQuantities[item.id] !== undefined
                        ? editedQuantities[item.id]
                        : item.stockQuantity
                    const isDirty = editedQuantities[item.id] !== undefined

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isDirty ? 'bg-cyan-950/20' : 'hover:bg-slate-900/30'
                        }`}
                      >
                        {/* Details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-[220px]">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {item.brand}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3 px-3">
                          <span className="font-mono text-[11px] text-slate-300">
                            {item.sku}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-3">
                          {currentQty === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2.5 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              Out of Stock
                            </span>
                          ) : currentQty <= 5 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2.5 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              Low Stock ({currentQty})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Adequate Stock
                            </span>
                          )}
                        </td>

                        {/* Quick Stepper */}
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleQuickAdjust(item.id, -1)}
                              disabled={currentQty <= 0}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                              title="Decrease 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentQty}
                              onChange={(e) =>
                                handleStockChange(item.id, parseInt(e.target.value) || 0)
                              }
                              className={`w-16 px-2 py-1 text-center font-mono font-bold bg-slate-900 border rounded-lg text-xs text-white focus:outline-none ${
                                isDirty
                                  ? 'border-cyan-500 bg-cyan-950/30'
                                  : 'border-slate-800'
                              }`}
                            />
                            <button
                              onClick={() => handleQuickAdjust(item.id, 1)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Increase 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Current/Dirty Units */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-extrabold text-sm text-white font-mono">
                            {currentQty}
                          </span>
                          {isDirty && (
                            <span className="text-[10px] text-cyan-400 block font-semibold">
                              (was {item.stockQuantity})
                            </span>
                          )}
                        </td>

                        {/* Quick Stock Action */}
                        <td className="py-3 px-4 text-right">
                          {currentQty === 0 ? (
                            <button
                              onClick={() => handleToggleStockStatus(item)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition-colors shadow-sm cursor-pointer"
                              title="Mark this model as In Stock (10 units)"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Mark In Stock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStockStatus(item)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-colors shadow-sm cursor-pointer"
                              title="Mark this model as Out of Stock"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Mark Out of Stock</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Stock Modal */}
        <AddStockModal
          isOpen={showAddStockModal}
          onClose={() => setShowAddStockModal(false)}
          onSuccess={(newProduct, sku) => {
            showToast(`Product "${newProduct.name}" added successfully with SKU ${sku}!`, 'success')
            loadInventory()
          }}
        />

      </div>
    </AdminLayout>
  )
}
