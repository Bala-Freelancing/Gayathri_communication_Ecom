import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { productService, PriceHistoryRecord } from '@/services/productService'
import { formatINR } from '@/lib/utils'
import { 
  Search, 
  Save, 
  RotateCcw, 
  Percent, 
  Download, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  X,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Upload,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DraftPrice {
  originalPrice: number
  price: number
}

export const AdminPrices: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const [variantsByProduct, setVariantsByProduct] = useState<Record<string, any[]>>({})
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({})
  const [draftVariantPrices, setDraftVariantPrices] = useState<Record<string, DraftPrice>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updated-desc')
  
  // Staging unsaved changes: productId -> { originalPrice, price }
  const [draftPrices, setDraftPrices] = useState<Record<string, DraftPrice>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // CSV Import File Ref
  const csvFileInputRef = useRef<HTMLInputElement>(null)

  // Bulk Edit Modal State
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkType, setBulkType] = useState<'percent' | 'fixed'>('percent')
  const [bulkDirection, setBulkDirection] = useState<'increase' | 'decrease'>('decrease')
  const [bulkValue, setBulkValue] = useState<number>(5)
  const [bulkTargetCategory, setBulkTargetCategory] = useState<string>('all')
  const [bulkReason, setBulkReason] = useState('Festive price revision')
  const [activeReason, setActiveReason] = useState('Manual price revision')

  // History Drawer State
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyLogs, setHistoryLogs] = useState<PriceHistoryRecord[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Load products & variants
  const loadProducts = async () => {
    setIsLoading(true)
    const [prodRes, varRes] = await Promise.all([
      productService.fetchAllProductsAdmin(),
      productService.fetchProductVariants(),
    ])
    setProducts(prodRes.data)
    if (varRes.data) {
      const grouped: Record<string, any[]> = {}
      varRes.data.forEach((v: any) => {
        if (!grouped[v.product_id]) grouped[v.product_id] = []
        grouped[v.product_id].push(v)
      })
      setVariantsByProduct(grouped)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    let isMounted = true
    Promise.all([
      productService.fetchAllProductsAdmin(),
      productService.fetchProductVariants(),
    ]).then(([prodRes, varRes]) => {
      if (isMounted) {
        setProducts(prodRes.data)
        if (varRes.data) {
          const grouped: Record<string, any[]> = {}
          varRes.data.forEach((v: any) => {
            if (!grouped[v.product_id]) grouped[v.product_id] = []
            grouped[v.product_id].push(v)
          })
          setVariantsByProduct(grouped)
        }
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
        if (brandFilter !== 'all' && p.brand.toLowerCase() !== brandFilter.toLowerCase()) return false
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase()
          return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'discount-desc') {
          const discA = (a.originalPrice - a.price) / (a.originalPrice || 1)
          const discB = (b.originalPrice - b.price) / (b.originalPrice || 1)
          return discB - discA
        }
        if (sortBy === 'updated-desc') {
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
        }
        return 0
      })
  }, [products, categoryFilter, brandFilter, searchQuery, sortBy])

  // Get brands for filter
  const availableBrands = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => set.add(p.brand))
    return Array.from(set)
  }, [products])

  // Unsaved count (both product and variant drafts)
  const unsavedCount = Object.keys(draftPrices).length + Object.keys(draftVariantPrices).length

  // Toggle variant dropdown expansion
  const toggleExpandVariant = (productId: string) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  // Inline edit handlers for base products
  const handlePriceChange = (productId: string, field: 'originalPrice' | 'price', val: number) => {
    setFeedback(null)
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const currentDraft = draftPrices[productId] || {
      originalPrice: product.originalPrice,
      price: product.price,
    }

    const updated = {
      ...currentDraft,
      [field]: isNaN(val) ? 0 : val,
    }

    if (updated.originalPrice === product.originalPrice && updated.price === product.price) {
      const nextDrafts = { ...draftPrices }
      delete nextDrafts[productId]
      setDraftPrices(nextDrafts)
    } else {
      setDraftPrices((prev) => ({
        ...prev,
        [productId]: updated,
      }))
    }
  }

  // Inline edit handler for variants
  const handleVariantPriceChange = (
    variantId: string,
    field: 'originalPrice' | 'price',
    val: number,
    baseVariant: any
  ) => {
    setFeedback(null)
    const current = draftVariantPrices[variantId] || {
      originalPrice: baseVariant.original_price,
      price: baseVariant.selling_price,
    }
    const updated = {
      ...current,
      [field]: isNaN(val) ? 0 : val,
    }
    if (updated.originalPrice === baseVariant.original_price && updated.price === baseVariant.selling_price) {
      const next = { ...draftVariantPrices }
      delete next[variantId]
      setDraftVariantPrices(next)
    } else {
      setDraftVariantPrices((prev) => ({
        ...prev,
        [variantId]: updated,
      }))
    }
  }

  const handleDiscardChanges = () => {
    setDraftPrices({})
    setDraftVariantPrices({})
    setFeedback(null)
  }

  // Validated CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        if (!text) return

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
        if (lines.length <= 1) {
          setFeedback({ type: 'error', message: 'The uploaded CSV file is empty or missing data rows.' })
          return
        }

        const parseCsvLine = (line: string): string[] => {
          const result: string[] = []
          let cur = ''
          let inQuotes = false
          for (let i = 0; i < line.length; i++) {
            const char = line[i]
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
              result.push(cur.trim())
              cur = ''
            } else {
              cur += char
            }
          }
          result.push(cur.trim())
          return result
        }

        const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))
        const idIdx = headers.findIndex((h) => h === 'id' || h === 'productid')
        const skuIdx = headers.findIndex((h) => h === 'sku' || h === 'productsku')
        const mrpIdx = headers.findIndex((h) => h.includes('mrp') || h.includes('original'))
        const sellingIdx = headers.findIndex((h) => h.includes('selling') || h === 'price')

        if ((idIdx === -1 && skuIdx === -1) || sellingIdx === -1) {
          setFeedback({
            type: 'error',
            message: 'Invalid CSV format. Header row must include SKU (or ID) and Selling Price columns.',
          })
          return
        }

        const newDrafts = { ...draftPrices }
        const errors: string[] = []
        let stagedCount = 0

        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i])
          if (cols.length < 2) continue

          const idVal = idIdx !== -1 ? cols[idIdx] : ''
          const skuVal = skuIdx !== -1 ? cols[skuIdx] : ''
          
          const matchedProduct = products.find(
            (p) => (idVal && p.id === idVal) || (skuVal && p.sku.toLowerCase() === skuVal.toLowerCase())
          )

          if (!matchedProduct) {
            errors.push(`Row ${i + 1}: SKU/ID "${skuVal || idVal}" not found in catalogue.`)
            continue
          }

          const rawSelling = cols[sellingIdx]?.replace(/[^0-9.]/g, '')
          const rawMrp = mrpIdx !== -1 ? cols[mrpIdx]?.replace(/[^0-9.]/g, '') : ''

          const sellingPrice = parseFloat(rawSelling)
          const mrp = rawMrp ? parseFloat(rawMrp) : matchedProduct.originalPrice

          if (isNaN(sellingPrice) || sellingPrice < 0) {
            errors.push(`Row ${i + 1} (${matchedProduct.name}): Invalid selling price "${cols[sellingIdx]}".`)
            continue
          }

          if (isNaN(mrp) || mrp < 0) {
            errors.push(`Row ${i + 1} (${matchedProduct.name}): Invalid MRP "${cols[mrpIdx]}".`)
            continue
          }

          if (sellingPrice > mrp) {
            errors.push(
              `Row ${i + 1} (${matchedProduct.name}): Proposed selling price (₹${sellingPrice}) exceeds MRP (₹${mrp}).`
            )
            continue
          }

          newDrafts[matchedProduct.id] = { originalPrice: mrp, price: sellingPrice }
          stagedCount++
        }

        if (stagedCount > 0) {
          setDraftPrices(newDrafts)
          setActiveReason('CSV price catalog import')
          if (errors.length > 0) {
            setFeedback({
              type: 'error',
              message: `Staged ${stagedCount} valid price update(s). Warning: ${errors.slice(0, 3).join(' ')}${errors.length > 3 ? ` (+${errors.length - 3} more)` : ''}`,
            })
          } else {
            setFeedback({
              type: 'success',
              message: `Successfully validated and staged price revisions for ${stagedCount} products. Review below and click "Save All" to persist.`,
            })
          }
        } else {
          setFeedback({
            type: 'error',
            message: `No price updates could be staged. Errors: ${errors.join(', ')}`,
          })
        }
      } catch (err: any) {
        setFeedback({ type: 'error', message: `CSV Parsing error: ${err?.message || 'Check file format'}` })
      } finally {
        if (e.target) e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  // Save all drafted prices (products + variants)
  const handleSaveAll = async () => {
    if (unsavedCount === 0) return

    // Validation
    const updates: { productId: string; originalPrice: number; sellingPrice: number; variantId?: string }[] = []
    
    // Product updates
    for (const [id, draft] of Object.entries(draftPrices)) {
      if (draft.originalPrice < 0 || draft.price < 0) {
        setFeedback({ type: 'error', message: 'Prices cannot be negative.' })
        return
      }
      if (draft.price > draft.originalPrice) {
        const p = products.find((prod) => prod.id === id)
        setFeedback({ 
          type: 'error', 
          message: `Selling price for "${p?.name || id}" cannot exceed MRP (${formatINR(draft.originalPrice)}).` 
        })
        return
      }
      updates.push({
        productId: id,
        originalPrice: draft.originalPrice,
        sellingPrice: draft.price,
      })
    }

    // Variant updates
    for (const [varId, draft] of Object.entries(draftVariantPrices)) {
      if (draft.originalPrice < 0 || draft.price < 0) {
        setFeedback({ type: 'error', message: 'Variant prices cannot be negative.' })
        return
      }
      if (draft.price > draft.originalPrice) {
        setFeedback({ 
          type: 'error', 
          message: `Variant selling price cannot exceed MRP (${formatINR(draft.originalPrice)}).` 
        })
        return
      }
      let parentProductId = ''
      for (const [prodId, vList] of Object.entries(variantsByProduct)) {
        if (vList.some((v) => v.id === varId)) {
          parentProductId = prodId
          break
        }
      }
      if (parentProductId) {
        updates.push({
          productId: parentProductId,
          variantId: varId,
          originalPrice: draft.originalPrice,
          sellingPrice: draft.price,
        })
      }
    }

    setIsSaving(true)
    const res = await productService.bulkUpdatePrices(updates, activeReason || 'Admin price revision')
    setIsSaving(false)

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Successfully saved ${res.updatedCount} price update(s). Storefront is synchronized!`,
      })
      setDraftPrices({})
      setDraftVariantPrices({})
      await loadProducts()
    } else {
      setFeedback({
        type: 'error',
        message: `Saved ${res.updatedCount} updates with errors: ${res.errors.join(', ')}`,
      })
      await loadProducts()
    }
  }

  // Load audit history
  const handleOpenHistory = async () => {
    setHistoryOpen(true)
    setIsLoadingHistory(true)
    const res = await productService.fetchPriceHistory()
    setHistoryLogs(res.data)
    setIsLoadingHistory(false)
  }

  // Bulk adjustment preview
  const bulkPreviewList = useMemo(() => {
    return products
      .filter((p) => bulkTargetCategory === 'all' || p.category === bulkTargetCategory)
      .map((p) => {
        let proposedSelling = p.price
        if (bulkType === 'percent') {
          const delta = (p.price * bulkValue) / 100
          proposedSelling = bulkDirection === 'decrease' ? p.price - delta : p.price + delta
        } else {
          proposedSelling = bulkDirection === 'decrease' ? p.price - bulkValue : p.price + bulkValue
        }
        proposedSelling = Math.max(0, Math.round(proposedSelling))
        // Cap at MRP
        if (proposedSelling > p.originalPrice) {
          proposedSelling = p.originalPrice
        }

        return {
          id: p.id,
          name: p.name,
          sku: p.sku,
          mrp: p.originalPrice,
          currentSelling: p.price,
          proposedSelling,
        }
      })
  }, [products, bulkTargetCategory, bulkType, bulkDirection, bulkValue])

  // Apply bulk adjustment
  const handleApplyBulk = () => {
    const nextDrafts = { ...draftPrices }
    bulkPreviewList.forEach((item) => {
      nextDrafts[item.id] = {
        originalPrice: item.mrp,
        price: item.proposedSelling,
      }
    })
    setDraftPrices(nextDrafts)
    setActiveReason(bulkReason || 'Bulk price revision')
    setBulkModalOpen(false)
    setFeedback({
      type: 'success',
      message: `Staged bulk adjustments for ${bulkPreviewList.length} products. Review changes below and click "Save All Changes" to persist.`,
    })
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'SKU', 'Product Name', 'Brand', 'Category', 'MRP (INR)', 'Selling Price (INR)', 'Discount %', 'Stock Quantity']
    const rows = products.map((p) => {
      const draft = draftPrices[p.id]
      const mrp = draft ? draft.originalPrice : p.originalPrice
      const selling = draft ? draft.price : p.price
      const discount = Math.round(((mrp - selling) / mrp) * 100)
      return [
        `"${p.id}"`,
        `"${p.sku}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.brand}"`,
        `"${p.category}"`,
        mrp,
        selling,
        `${discount}%`,
        p.stockQuantity,
      ].join(',')
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Gayathri_Communication_Prices_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AdminLayout
      title="Price Management"
      subtitle="Edit MRP and selling prices inline with instant database persistence and audit history."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={csvFileInputRef}
            accept=".csv"
            className="hidden"
            onChange={handleImportCSV}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => csvFileInputRef.current?.click()}
            className="text-xs gap-1.5 border-slate-700 bg-slate-900 text-slate-200 hover:text-white"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5 border-slate-700 bg-slate-900"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkModalOpen(true)}
            className="text-xs gap-1.5 border-slate-700 bg-slate-900 text-cyan-400 hover:text-cyan-300"
          >
            <Percent className="w-3.5 h-3.5" />
            Bulk Adjust
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenHistory}
            className="text-xs gap-1.5 border-slate-700 bg-slate-900"
          >
            <History className="w-3.5 h-3.5" />
            Audit History
          </Button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Unsaved Changes Banner */}
        {unsavedCount > 0 && (
          <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  You have {unsavedCount} unsaved price change{unsavedCount > 1 ? 's' : ''}
                </p>
                <p className="text-[11px] text-cyan-300/80">
                  Changes are staged in memory. Click "Save All Price Changes" to commit to Supabase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="text-xs gap-1 border-slate-700 hover:bg-slate-900 flex-1 sm:flex-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="text-xs font-bold gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 flex-1 sm:flex-none"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : `Save All (${unsavedCount})`}
              </Button>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by model, SKU, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category & Brand Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="smartphones">Smartphones</option>
              <option value="smart-tvs">Smart TVs</option>
              <option value="home-appliances">Home Appliances</option>
              <option value="accessories">Accessories</option>
              <option value="other-electronics">Other Electronics</option>
            </select>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="updated-desc">Recently Updated</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="discount-desc">Highest Discount</option>
            </select>

            {(searchQuery || categoryFilter !== 'all' || brandFilter !== 'all' || sortBy !== 'updated-desc') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('all')
                  setBrandFilter('all')
                  setSortBy('updated-desc')
                }}
                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 px-2 h-8"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Price Management Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-['Outfit']">
                <tr>
                  <th className="py-3.5 px-4">Product / SKU</th>
                  <th className="py-3.5 px-3">Brand</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-4 w-36">MRP (Original)</th>
                  <th className="py-3.5 px-4 w-36">Selling Price</th>
                  <th className="py-3.5 px-3">Discount</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      Loading products catalogue...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      No products match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const draft = draftPrices[product.id]
                    const currentOriginal = draft ? draft.originalPrice : product.originalPrice
                    const currentSelling = draft ? draft.price : product.price
                    const isDrafted = Boolean(draft)
                    const discountPercent = Math.round(
                      ((currentOriginal - currentSelling) / currentOriginal) * 100
                    )
                    const hasVariants = variantsByProduct[product.id]?.length > 0

                    return (
                      <React.Fragment key={product.id}>
                        <tr
                          className={`transition-colors hover:bg-slate-900/40 ${
                            isDrafted ? 'bg-cyan-950/15' : ''
                          }`}
                        >
                          {/* Product info with image & SKU */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 p-1 shrink-0 flex items-center justify-center">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="max-h-full max-w-full object-contain rounded-lg"
                                />
                              </div>
                              <div className="truncate max-w-[200px]">
                                <p className="font-bold text-white truncate font-['Outfit']">
                                  {product.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  SKU: {product.sku}
                                </p>
                                {hasVariants && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandVariant(product.id)}
                                    className="mt-1 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-semibold transition-colors"
                                  >
                                    <Layers className="w-3 h-3" />
                                    <span>{variantsByProduct[product.id].length} Variants</span>
                                    {expandedVariants[product.id] ? (
                                      <ChevronUp className="w-3 h-3" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Brand */}
                          <td className="py-3 px-3 font-medium text-slate-300">
                            {product.brand}
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full capitalize">
                              {product.category.replace('-', ' ')}
                            </span>
                          </td>

                          {/* Editable MRP */}
                          <td className="py-3 px-4">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                value={currentOriginal}
                                onChange={(e) =>
                                  handlePriceChange(product.id, 'originalPrice', parseFloat(e.target.value))
                                }
                                className={`w-full bg-slate-900 border rounded-xl pl-6 pr-2 py-1.5 text-xs text-white focus:outline-none transition-all ${
                                  isDrafted
                                    ? 'border-cyan-400 ring-1 ring-cyan-400/30'
                                    : 'border-slate-800 focus:border-cyan-500'
                                }`}
                              />
                            </div>
                            {isDrafted && (
                              <span className="text-[9px] text-slate-500 block mt-0.5">
                                Was: {formatINR(product.originalPrice)}
                              </span>
                            )}
                          </td>

                          {/* Editable Selling Price */}
                          <td className="py-3 px-4">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-500 text-xs font-bold">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                value={currentSelling}
                                onChange={(e) =>
                                  handlePriceChange(product.id, 'price', parseFloat(e.target.value))
                                }
                                className={`w-full bg-slate-900 border rounded-xl pl-6 pr-2 py-1.5 text-xs font-bold text-white focus:outline-none transition-all ${
                                  isDrafted
                                    ? 'border-cyan-400 ring-1 ring-cyan-400/30 text-cyan-300'
                                    : 'border-slate-800 focus:border-cyan-500'
                                }`}
                              />
                            </div>
                            {isDrafted && (
                              <span className="text-[9px] text-slate-500 block mt-0.5">
                                Was: {formatINR(product.price)}
                              </span>
                            )}
                          </td>

                          {/* Computed Discount */}
                          <td className="py-3 px-3">
                            <Badge
                              variant={discountPercent > 0 ? 'discount' : 'secondary'}
                              className="text-[10px]"
                            >
                              {discountPercent}% OFF
                            </Badge>
                          </td>

                          {/* Stock & Draft Tag */}
                          <td className="py-3 px-3">
                            {isDrafted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded-full font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                Modified
                              </span>
                            ) : (
                              <button
                                onClick={async () => {
                                  const nextStatus = !product.inStock
                                  const res = await productService.toggleProductStock(product.id, nextStatus)
                                  if (res.success) {
                                    setProducts((prev) =>
                                      prev.map((p) =>
                                        p.id === product.id ? { ...p, inStock: nextStatus, stockQuantity: nextStatus ? 10 : 0 } : p
                                      )
                                    )
                                    setFeedback({
                                      type: 'success',
                                      message: nextStatus
                                        ? `Marked "${product.name}" as In Stock`
                                        : `Marked "${product.name}" as Out of Stock`,
                                    });
                                    setTimeout(() => setFeedback(null), 4000);
                                  }
                                }}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors cursor-pointer ${
                                  product.inStock
                                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-900/50'
                                    : 'text-rose-400 bg-rose-950/40 border-rose-800/60 hover:bg-rose-900/50'
                                }`}
                                title="Click to toggle Stock Status"
                              >
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </button>
                            )}
                          </td>

                          {/* Last Updated */}
                          <td className="py-3 px-3 text-[10px] text-slate-400 font-mono">
                            {product.updatedAt
                              ? new Date(product.updatedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: '2-digit',
                                  month: 'short',
                                })
                              : 'Active'}
                          </td>

                          {/* Quick Row Actions */}
                          <td className="py-3 px-4 text-right">
                            {isDrafted ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    const nextDrafts = { ...draftPrices }
                                    delete nextDrafts[product.id]
                                    setDraftPrices(nextDrafts)
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                                  title="Revert changes"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={async () => {
                                    setIsSaving(true)
                                    const res = await productService.updateProductPrice(
                                      product.id,
                                      currentOriginal,
                                      currentSelling,
                                      'Single product quick-save'
                                    )
                                    setIsSaving(false)
                                    if (res.success) {
                                      const nextDrafts = { ...draftPrices }
                                      delete nextDrafts[product.id]
                                      setDraftPrices(nextDrafts)
                                      setFeedback({
                                        type: 'success',
                                        message: `Updated "${product.name}" to ${formatINR(currentSelling)}.`,
                                      })
                                      loadProducts()
                                    } else {
                                      setFeedback({ type: 'error', message: res.error || 'Update failed' })
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
                                  title="Save this row"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  handlePriceChange(product.id, 'price', product.price)
                                }}
                                className="text-[11px] text-slate-400 hover:text-cyan-400 font-medium"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Nested Variant Price Rows */}
                        {expandedVariants[product.id] && variantsByProduct[product.id] && (
                          <tr className="bg-slate-950/90 border-t border-b border-cyan-500/30">
                            <td colSpan={9} className="p-3 sm:p-4 bg-slate-950/70">
                              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
                                <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold border-b border-slate-800 pb-2">
                                  <span className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5" />
                                    Independent Variant Pricing ({product.name})
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    Edit MRP & selling price for individual specifications
                                  </span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-xs">
                                    <thead>
                                      <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-800/80">
                                        <th className="py-2 px-3">Variant Specification</th>
                                        <th className="py-2 px-3">Variant SKU</th>
                                        <th className="py-2 px-3 w-32">Variant MRP</th>
                                        <th className="py-2 px-3 w-32">Selling Price</th>
                                        <th className="py-2 px-3">Discount</th>
                                        <th className="py-2 px-3 text-right">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/40">
                                      {variantsByProduct[product.id].map((variant: any) => {
                                        const varDraft = draftVariantPrices[variant.id]
                                        const vOrig = varDraft ? varDraft.originalPrice : (variant.original_price || product.originalPrice)
                                        const vSell = varDraft ? varDraft.price : (variant.selling_price || product.price)
                                        const isVarDraft = Boolean(varDraft)
                                        const vDiscount = Math.round(((vOrig - vSell) / (vOrig || 1)) * 100)
                                        const label = Object.entries(variant.variant_attributes || {})
                                          .map(([k, v]) => `${k}: ${v}`)
                                          .join(' | ') || variant.sku

                                        return (
                                          <tr key={variant.id} className={isVarDraft ? 'bg-cyan-950/20' : ''}>
                                            <td className="py-2 px-3 font-semibold text-slate-200">
                                              {label}
                                            </td>
                                            <td className="py-2 px-3 font-mono text-[10px] text-slate-400">
                                              {variant.sku}
                                            </td>
                                            <td className="py-2 px-3">
                                              <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-[11px]">₹</span>
                                                <input
                                                  type="number"
                                                  min="0"
                                                  step="10"
                                                  value={vOrig}
                                                  onChange={(e) =>
                                                    handleVariantPriceChange(variant.id, 'originalPrice', parseFloat(e.target.value), variant)
                                                  }
                                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-5 pr-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                                                />
                                              </div>
                                            </td>
                                            <td className="py-2 px-3">
                                              <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-cyan-400 font-bold text-[11px]">₹</span>
                                                <input
                                                  type="number"
                                                  min="0"
                                                  step="10"
                                                  value={vSell}
                                                  onChange={(e) =>
                                                    handleVariantPriceChange(variant.id, 'price', parseFloat(e.target.value), variant)
                                                  }
                                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-5 pr-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                                                />
                                              </div>
                                            </td>
                                            <td className="py-2 px-3">
                                              <Badge variant={vDiscount > 0 ? 'discount' : 'secondary'} className="text-[9px]">
                                                {vDiscount}% OFF
                                              </Badge>
                                            </td>
                                            <td className="py-2 px-3 text-right">
                                              {isVarDraft ? (
                                                <div className="flex items-center justify-end gap-1.5">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const next = { ...draftVariantPrices }
                                                      delete next[variant.id]
                                                      setDraftVariantPrices(next)
                                                    }}
                                                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                                                    title="Revert variant change"
                                                  >
                                                    <RotateCcw className="w-3 h-3" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={async () => {
                                                      setIsSaving(true)
                                                      const res = await productService.updateVariantPrice(
                                                        product.id,
                                                        variant.id,
                                                        vOrig,
                                                        vSell,
                                                        `Variant price quick-save (${label})`
                                                      )
                                                      setIsSaving(false)
                                                      if (res.success) {
                                                        const next = { ...draftVariantPrices }
                                                        delete next[variant.id]
                                                        setDraftVariantPrices(next)
                                                        setFeedback({
                                                          type: 'success',
                                                          message: `Updated variant "${label}" price to ${formatINR(vSell)}.`,
                                                        })
                                                        loadProducts()
                                                      } else {
                                                        setFeedback({ type: 'error', message: res.error || 'Variant update failed' })
                                                      }
                                                    }}
                                                    className="p-1 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
                                                    title="Save variant"
                                                  >
                                                    <Save className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <span className="text-[10px] text-slate-500">Live</span>
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* BULK ADJUSTMENT MODAL */}
      {bulkModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setBulkModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  Bulk Price Adjustment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Apply a percentage or flat adjustment across multiple items with live preview.
                </p>
              </div>
              <button
                onClick={() => setBulkModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Category</label>
                <select
                  value={bulkTargetCategory}
                  onChange={(e) => setBulkTargetCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Products in Store</option>
                  <option value="smartphones">Smartphones Only</option>
                  <option value="smart-tvs">Smart TVs Only</option>
                  <option value="home-appliances">Home Appliances Only</option>
                  <option value="accessories">Accessories Only</option>
                  <option value="other-electronics">Other Electronics Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkType('percent')}
                    className={`py-2 rounded-xl font-semibold border ${
                      bulkType === 'percent'
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkType('fixed')}
                    className={`py-2 rounded-xl font-semibold border ${
                      bulkType === 'fixed'
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Fixed Amount (₹)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkDirection('decrease')}
                    className={`py-2 rounded-xl font-semibold border flex items-center justify-center gap-1.5 ${
                      bulkDirection === 'decrease'
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    Discount (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkDirection('increase')}
                    className={`py-2 rounded-xl font-semibold border flex items-center justify-center gap-1.5 ${
                      bulkDirection === 'increase'
                        ? 'border-amber-500 bg-amber-950/40 text-amber-400'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Increase (+)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {bulkType === 'percent' ? 'Discount Percentage (%)' : 'Amount in Rupees (₹)'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={bulkValue}
                  onChange={(e) => setBulkValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  Revision Reason (Recorded in Audit History)
                </label>
                <input
                  type="text"
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  placeholder="e.g. Festive discount, Diwali special, Clearance"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            {/* Preview Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Affected Models:</span>
                <span className="font-bold text-white">{bulkPreviewList.length} items</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/40 text-[11px]">
                {bulkPreviewList.map((item) => (
                  <div key={item.id} className="pt-1.5 flex items-center justify-between">
                    <span className="text-slate-300 truncate max-w-[220px]">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 line-through">{formatINR(item.currentSelling)}</span>
                      <span className="font-bold text-cyan-400">{formatINR(item.proposedSelling)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkModalOpen(false)}
                className="text-xs border-slate-700"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={handleApplyBulk}
                className="text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 gap-1.5"
              >
                Stage Changes for {bulkPreviewList.length} Items
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT HISTORY DRAWER */}
      {historyOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex justify-end animate-in fade-in"
          onClick={() => setHistoryOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-slate-950 h-full border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Price Change Audit Log
                  </h3>
                </div>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {isLoadingHistory ? (
                  <p className="text-xs text-slate-500 text-center py-10">Loading audit history...</p>
                ) : historyLogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs space-y-1">
                    <p>No recorded price modifications yet.</p>
                    <p className="text-[11px]">Audit records are created whenever an administrator commits price updates.</p>
                  </div>
                ) : (
                  historyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-mono uppercase text-[11px]">
                          {log.productId}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.changedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Selling Price:</span>
                          <span className="text-slate-400 line-through mr-1.5">{formatINR(log.oldSellingPrice)}</span>
                          <span className="font-bold text-cyan-400">{formatINR(log.newSellingPrice)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">MRP:</span>
                          <span className="text-slate-400 line-through mr-1.5">{formatINR(log.oldOriginalPrice)}</span>
                          <span className="font-bold text-white">{formatINR(log.newOriginalPrice)}</span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span>By: {log.changedByEmail || 'Admin'}</span>
                        <span className="italic">{log.changeReason || 'Revision'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryOpen(false)}
              className="mt-6 w-full text-xs border-slate-800"
            >
              Close Log
            </Button>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}
