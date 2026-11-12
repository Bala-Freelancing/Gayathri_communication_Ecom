import React, { useState, useRef } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { 
  parseStockWorkbook, 
  generateRejectedRowsCsv, 
  executeCatalogueReplacement,
  StockImportSummary, 
  ParsedStockItem 
} from '@/services/stockImportService'
import { productService } from '@/services/productService'
import { lookupProductCatalog } from '@/services/icecatService'
import { formatINR } from '@/lib/utils'
import { 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  RefreshCw, 
  Search, 
  Eye, 
  Database, 
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Loader2,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const AdminStockImport: React.FC = () => {
  const [summary, setSummary] = useState<StockImportSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [parsingError, setParsingError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'valid' | 'zero-stock' | 'review-category' | 'missing-image' | 'invalid'>('all')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  
  // Stage B State
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isExecutingReplacement, setIsExecutingReplacement] = useState(false)
  const [executionReport, setExecutionReport] = useState<{
    success: boolean
    importedCount: number
    backupId?: string
    error?: string
    timestamp: string
  } | null>(null)

  // Lookup modal / item details state
  const [inspectingItem, setInspectingItem] = useState<ParsedStockItem | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupMessage, setLookupMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Handle File Upload (.xls, .xlsx, .csv)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setParsingError(null)
    setExecutionReport(null)

    try {
      const buffer = await file.arrayBuffer()
      const parsed = parseStockWorkbook(buffer, file.name)
      setSummary(parsed)
    } catch (err: any) {
      console.error('Failed to parse spreadsheet:', err)
      setParsingError(err?.message || 'Failed to parse workbook. Please ensure it is a valid .xls, .xlsx, or .csv file.')
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // 2. Load the project's client stock report directly

  // 2b. Load the client's Xiaomi / Redmi multi-variant spec sheet directly

  // 3. Download Rejected Rows CSV
  const handleDownloadRejectedCsv = () => {
    if (!summary || summary.invalidRows.length === 0) return
    const csvData = generateRejectedRowsCsv(summary.invalidRows)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rejected_rows_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 4. Download Current Live Catalogue Backup
  const handleDownloadCatalogueBackup = async () => {
    try {
      const { data } = await productService.fetchAllProductsAdmin()
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `gayathri_catalogue_backup_${new Date().toISOString().slice(0, 10)}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate local catalogue backup download:', err)
      alert('Failed to generate local catalogue backup download.')
    }
  }

  // 5. Override category for a parsed item
  const handleUpdateItemCategory = (itemId: string, newCategory: any) => {
    if (!summary) return
    const updatedItems = summary.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          category: newCategory,
          categoryStatus: 'confirmed' as const,
        }
      }
      return item
    })

    setSummary({
      ...summary,
      items: updatedItems,
      ambiguousCategoriesCount: updatedItems.filter(i => i.categoryStatus === 'needs_review').length,
    })

    if (inspectingItem && inspectingItem.id === itemId) {
      setInspectingItem({
        ...inspectingItem,
        category: newCategory,
        categoryStatus: 'confirmed',
      })
    }
  }

  // 6. Live Icecat lookup for a specific item
  const handleIcecatLookup = async (item: ParsedStockItem) => {
    setIsLookingUp(true)
    setLookupMessage(null)

    try {
      const res = await lookupProductCatalog(item.brand, item.model)
      if (res.found && res.imageUrl) {
        // Update item with live findings
        if (!summary) return
        const updated = summary.items.map((it) => {
          if (it.id === item.id) {
            return {
              ...it,
              image: res.imageUrl || it.image,
              imageStatus: 'matched' as const,
              imageSource: res.attribution || 'Open Icecat',
              specs: res.specs && res.specs.length > 0 ? res.specs : it.specs,
              highlights: res.highlights && res.highlights.length > 0 ? res.highlights : it.highlights,
            }
          }
          return it
        })

        setSummary({
          ...summary,
          items: updated,
          matchedImagesCount: updated.filter(i => i.imageStatus === 'matched').length,
          missingImagesCount: updated.filter(i => i.imageStatus === 'missing').length,
        })

        setLookupMessage(`Match found in Open Icecat! Primary studio photo and ${res.specs?.length || 0} technical specifications synced.`)
      } else {
        setLookupMessage(res.message || 'Product datasheet not present in Open Icecat free tier. Marked as Needs Review.')
      }
    } catch (err: any) {
      setLookupMessage(`Lookup error: ${err?.message || 'Network failure'}`)
    } finally {
      setIsLookingUp(false)
    }
  }

  // 7. Execute Stage B Replacement
  const handleExecuteReplacement = async () => {
    if (!summary) return
    if (confirmText.trim().toUpperCase() !== 'CONFIRM REPLACE') {
      alert('Please type CONFIRM REPLACE into the confirmation field.')
      return
    }

    setIsExecutingReplacement(true)
    try {
      const res = await executeCatalogueReplacement(
        summary.items,
        `FY 2026-27 Stock Import: ${summary.fileName} (${summary.validProductsCount} items)`
      )

      if (res.success) {
        setExecutionReport({
          success: true,
          importedCount: res.importedCount,
          backupId: res.backupId,
          timestamp: new Date().toLocaleString(),
        })
        setShowConfirmModal(false)
      } else {
        setExecutionReport({
          success: false,
          importedCount: 0,
          backupId: res.backupId,
          error: res.error,
          timestamp: new Date().toLocaleString(),
        })
        setShowConfirmModal(false)
      }
    } catch (err: any) {
      setExecutionReport({
        success: false,
        importedCount: 0,
        error: err?.message || 'Unknown database error',
        timestamp: new Date().toLocaleString(),
      })
    } finally {
      setIsExecutingReplacement(false)
    }
  }

  // Filtered Items Calculation
  const filteredItems = React.useMemo(() => {
    if (!summary) return []
    let list = summary.items

    // Status filter
    if (activeFilter === 'zero-stock') {
      list = list.filter((i) => i.isZeroStock)
    } else if (activeFilter === 'review-category') {
      list = list.filter((i) => i.categoryStatus === 'needs_review')
    } else if (activeFilter === 'missing-image') {
      list = list.filter((i) => i.imageStatus === 'missing')
    }

    // Category filter
    if (selectedCategoryFilter !== 'all') {
      list = list.filter((i) => i.category === selectedCategoryFilter)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.brand.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          (i.hsn && i.hsn.includes(q))
      )
    }

    return list
  }, [summary, activeFilter, selectedCategoryFilter, searchQuery])

  return (
    <AdminLayout
      title="Stock Import"
      subtitle="Replace the product catalogue from your stock Excel file."
      actions={
        summary && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCatalogueBackup}
              className="border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Backup Current Catalogue
            </Button>
            <Button
              onClick={() => setShowConfirmModal(true)}
              disabled={summary.validProductsCount === 0}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 shadow-lg "
            >
              <Database className="w-3.5 h-3.5" />
              Stage B: Replace Catalogue
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-6">

        {/* Execution Report Banner */}
        {executionReport && (
          <div
            className={`p-5 rounded-2xl border ${
              executionReport.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
            } space-y-2 backdrop-blur-md`}
          >
            <div className="flex items-center gap-2.5">
              {executionReport.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
              )}
              <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                {executionReport.success
                  ? 'Catalogue Replacement Executed Successfully!'
                  : 'Catalogue Replacement Failed — Safe Rollback Executed'}
              </h3>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {executionReport.success
                ? `Imported and verified ${executionReport.importedCount} client showroom products. Durable backup recorded with ID: ${executionReport.backupId}. Storefront and admin caches synchronized.`
                : `Error: ${executionReport.error}.${executionReport.backupId ? ` Pre-replacement backup identifier: ${executionReport.backupId}.` : ''} No database records were corrupted. Previous catalogue preserved intact.`}
            </p>
            <span className="text-[10px] opacity-70 block font-mono">
              Timestamp: {executionReport.timestamp}
            </span>
          </div>
        )}

        {/* Upload & Source Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 backdrop-blur-md space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-700" />
                <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Upload your stock report
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Choose the stock Excel file (.xls, .xlsx or .csv). You'll see a preview first; nothing changes on the website until you confirm.
                A backup of the current catalogue is saved before anything is replaced.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileUpload}
                className="hidden"
                id="stock-upload-input"
              />
              <label
                htmlFor="stock-upload-input"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md "
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                <span>Choose Excel file</span>
              </label>
            </div>
          </div>

          {parsingError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-rose-700" />
              <span>{parsingError}</span>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-700 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-900 font-['Outfit']">
              Parsing Excel workbook & validating financial constraints...
            </p>
            <p className="text-xs text-slate-500">
              Extracting Selling Cost, Closing Balance Qty, detecting duplicates and mapping categories.
            </p>
          </div>
        )}

        {/* Summary Dashboard Cards */}
        {summary && !loading && (
          <div className="space-y-6">
            
            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Source Rows</span>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">{summary.totalSourceRows}</p>
                <span className="text-[10px] text-slate-500">FY 2026-27 Sheet</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Valid Products</span>
                <p className="text-2xl font-extrabold text-emerald-700 font-mono">{summary.validProductsCount}</p>
                <span className="text-[10px] text-emerald-500/80">Approved for Import</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-rose-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-700">Rejected Rows</span>
                <p className="text-2xl font-extrabold text-rose-700 font-mono">{summary.invalidRowsCount}</p>
                <button
                  onClick={handleDownloadRejectedCsv}
                  className="text-[10px] text-cyan-700 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Download className="w-2.5 h-2.5" />
                  Download CSV
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-700">Zero Stock</span>
                <p className="text-2xl font-extrabold text-amber-700 font-mono">{summary.zeroStockCount}</p>
                <span className="text-[10px] text-amber-500/80">Marked Out of Stock</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-700">In Stock</span>
                <p className="text-2xl font-extrabold text-indigo-700 font-mono">{summary.positiveStockCount}</p>
                <span className="text-[10px] text-indigo-700">Available in Store</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-700">Duplicates</span>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">
                  {summary.exactDuplicateCount}
                  <span className="text-xs text-slate-500 font-normal"> / {summary.possibleModelDuplicatesCount}</span>
                </p>
                <span className="text-[10px] text-slate-500">Exact / Similar Model</span>
              </div>
            </div>

            {/* Stage A Notice & Rejected Rows Alert */}
            {summary.invalidRowsCount > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold">
                      {summary.invalidRowsCount} malformed / invalid rows detected and excluded from import.
                    </span>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Excluded items with negative stock, missing selling prices, or credit note records.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadRejectedCsv}
                  className="border-amber-200 bg-amber-50 hover:bg-amber-50 text-amber-100 text-xs gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Rejection Report (CSV)
                </Button>
              </div>
            )}

            {/* Flipkart / Amazon Multi-Variant Architecture Active Callout */}
            {summary.items.some((i) => i.variants && i.variants.length > 0) && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-200 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm font-['Outfit']">
                        Amazon & Flipkart Multi-Variant Architecture Active
                      </span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                        Consolidated
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      Instead of creating repetitive cards for every RAM/storage configuration, all {summary.items.filter((i) => i.variants && i.variants.length > 0).length} multi-variant models are consolidated into single parent models with dynamic variant switching and distinct price tiers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar & Controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by product name, brand, SKU or HSN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({summary.validProductsCount})
                </button>
                <button
                  onClick={() => setActiveFilter('zero-stock')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'zero-stock'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Zero Stock ({summary.zeroStockCount})
                </button>
                <button
                  onClick={() => setActiveFilter('review-category')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'review-category'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Review Categories ({summary.ambiguousCategoriesCount})
                </button>
                <button
                  onClick={() => setActiveFilter('missing-image')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'missing-image'
                      ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Missing Image ({summary.missingImagesCount})
                </button>
              </div>

              {/* Category Dropdown */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Categories</option>
                <option value="smartphones">Smartphones ({summary.categoryDistribution['smartphones'] || 0})</option>
                <option value="smart-tvs">Smart TVs ({summary.categoryDistribution['smart-tvs'] || 0})</option>
                <option value="home-appliances">Home Appliances ({summary.categoryDistribution['home-appliances'] || 0})</option>
                <option value="accessories">Accessories ({summary.categoryDistribution['accessories'] || 0})</option>
                <option value="other-electronics">Other Electronics ({summary.categoryDistribution['other-electronics'] || 0})</option>
              </select>

            </div>

            {/* Products Preview Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 select-none">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">Row</th>
                      <th className="py-3 px-3 w-14">Media</th>
                      <th className="py-3 px-4">Product Name & Variants</th>
                      <th className="py-3 px-3">Brand</th>
                      <th className="py-3 px-4">Target Category</th>
                      <th className="py-3 px-3 text-right">Selling Price</th>
                      <th className="py-3 px-3 text-center">Stock (Qty)</th>
                      <th className="py-3 px-3 text-center">Image Status</th>
                      <th className="py-3 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">
                          No products match the selected filters or search query.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 transition-colors group cursor-pointer"
                          onClick={() => setInspectingItem(item)}
                        >
                          <td className="py-3 px-3 text-center font-mono text-slate-500 text-[11px]">
                            {item.rowNumber}
                          </td>

                          {/* Media Thumbnail */}
                          <td className="py-3 px-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </td>

                          {/* Product Name */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-1">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-500">
                              <span className="font-mono text-slate-500 text-[10px]">{item.sku}</span>
                              {item.variants && item.variants.length > 0 ? (
                                <span className="bg-blue-50 border border-blue-600/50 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 shadow-sm">
                                  <Layers className="w-2.5 h-2.5 text-blue-700" />
                                  {item.variants.length} Variants ({item.variants.map((v) => v.name).join(' • ')})
                                </span>
                              ) : (
                                <>
                                  {item.variantDetails?.storage && (
                                    <span className="bg-slate-50 text-slate-500 px-1.5 py-0.2 rounded text-[10px]">
                                      {item.variantDetails.storage}
                                    </span>
                                  )}
                                  {item.variantDetails?.color && (
                                    <span className="text-slate-500 text-[10px]">
                                      Color: {item.variantDetails.color}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </td>

                          {/* Brand */}
                          <td className="py-3 px-3 font-medium text-slate-700">
                            {item.brand}
                          </td>

                          {/* Category Mapping with Review Flag */}
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <select
                                value={item.category}
                                onChange={(e) => handleUpdateItemCategory(item.id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:border-cyan-500"
                              >
                                <option value="smartphones">Smartphones</option>
                                <option value="smart-tvs">Smart TVs</option>
                                <option value="home-appliances">Home Appliances</option>
                                <option value="accessories">Accessories</option>
                                <option value="other-electronics">Other Electronics</option>
                              </select>

                              {item.categoryStatus === 'needs_review' && (
                                <span
                                  className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded font-bold shrink-0"
                                  title="Original group 'Others' or 'Tablets' mapped by heuristic. Verify category."
                                >
                                  Review
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Selling Price (Exact Selling Cost) */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            {item.variants && item.variants.length > 1 ? (
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-cyan-700 font-bold block font-sans">
                                  From {formatINR(item.sellingPrice)}
                                </span>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  {formatINR(Math.min(...item.variants.map((v) => v.price ?? 0)))} - {formatINR(Math.max(...item.variants.map((v) => v.price ?? 0)))}
                                </span>
                              </div>
                            ) : (
                              formatINR(item.sellingPrice)
                            )}
                          </td>

                          {/* Stock Quantity */}
                          <td className="py-3 px-3 text-center">
                            {item.isZeroStock ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700">
                                0 (Out of Stock)
                              </span>
                            ) : (
                              <span className="font-mono font-bold text-emerald-700">
                                {item.stockQuantity}
                              </span>
                            )}
                          </td>

                          {/* Image Status */}
                          <td className="py-3 px-3 text-center">
                            {item.imageStatus === 'matched' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Matched
                              </span>
                            ) : item.imageStatus === 'needs_review' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                Needs Review
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500">
                                Placeholder
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setInspectingItem(item)}
                              className="text-xs text-cyan-700 hover:text-cyan-700 hover:bg-slate-100 h-7 px-2"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Item Inspection & Datasheet Match Modal */}
        {inspectingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white backdrop-blur-md">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-800 max-h-[90vh] overflow-y-auto shadow-sm">
              
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-700 tracking-wider">
                    Product Details • Row #{inspectingItem.rowNumber}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mt-0.5">
                    {inspectingItem.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-500">{inspectingItem.sku}</span>
                </div>
                <button
                  onClick={() => setInspectingItem(null)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Data comparison block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Selling Cost (Price):</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(inspectingItem.sellingPrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Closing Balance (Stock):</span>
                  <span className={`font-mono font-bold text-sm ${inspectingItem.isZeroStock ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {inspectingItem.stockQuantity} {inspectingItem.isZeroStock ? '(Out of Stock)' : 'units'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Original Group:</span>
                  <span className="text-slate-700 font-medium">{inspectingItem.originalGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">HSN / GST:</span>
                  <span className="text-slate-700 font-mono">{inspectingItem.hsn || 'N/A'} {inspectingItem.gstPercent ? `(${inspectingItem.gstPercent}%)` : ''}</span>
                </div>
              </div>

              {/* Open Icecat Lookup Trigger */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-700" />
                    <span className="text-xs font-bold text-slate-900">Datasheet & Studio Photo Matching</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleIcecatLookup(inspectingItem)}
                    disabled={isLookingUp}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-8 gap-1.5"
                  >
                    {isLookingUp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    <span>Lookup Icecat</span>
                  </Button>
                </div>

                {lookupMessage && (
                  <p className="text-xs text-cyan-700 bg-cyan-50 p-2.5 rounded-lg border border-cyan-200">
                    {lookupMessage}
                  </p>
                )}

                {/* Specs List */}
                {inspectingItem.specs && inspectingItem.specs.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Specifications:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {inspectingItem.specs.map((sp, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">{sp.label}</span>
                          <span className="text-slate-900 font-medium">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Consolidated Variants (Flipkart / Amazon Model Architecture) */}
              {inspectingItem.variants && inspectingItem.variants.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-700" />
                      <span className="text-xs font-bold text-slate-900 font-['Outfit']">
                        Consolidated Model Variants ({inspectingItem.variants.length})
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      Flipkart / Amazon Architecture
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-slate-200/80">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-white text-[10px] uppercase font-bold text-slate-500">
                          <th className="py-2 px-3">Variant</th>
                          <th className="py-2 px-3">SKU</th>
                          <th className="py-2 px-3 text-right">Selling Price</th>
                          <th className="py-2 px-3 text-right">MRP</th>
                          <th className="py-2 px-3 text-center">Stock Units</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 font-mono text-[11px]">
                        {inspectingItem.variants.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-sans font-semibold text-slate-900">
                              {v.name}
                            </td>
                            <td className="py-2 px-3 text-slate-500 text-[10px]">
                              {v.sku}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-emerald-700">
                              {formatINR(v.price ?? 0)}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-500 line-through">
                              {formatINR(v.originalPrice ?? 0)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {v.inStock ? (
                                <span className="text-emerald-700 font-bold">{v.stockQuantity}</span>
                              ) : (
                                <span className="text-rose-700 font-bold">0</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInspectingItem(null)}
                  className="border-slate-200 text-slate-700"
                >
                  Close
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* Stage B Confirmation Modal */}
        {showConfirmModal && summary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white backdrop-blur-md">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 text-slate-800 shadow-sm">
              
              <div className="flex items-center gap-3 text-amber-700">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Confirm Safe Catalogue Replacement
                  </h3>
                  <span className="text-xs text-slate-500">Stage B Transactional Execution</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                <p className="text-slate-700 leading-relaxed">
                  You are about to replace the live showroom product catalogue with the validated client inventory from <strong className="text-slate-900">{summary.fileName}</strong>.
                </p>
                <ul className="space-y-1 text-slate-500 list-disc pl-4">
                  <li>A durable snapshot backup of the existing catalogue will be created first.</li>
                  <li><strong className="text-slate-900">{summary.validProductsCount} valid products</strong> will be imported.</li>
                  <li><strong className="text-amber-700">{summary.zeroStockCount} zero-stock products</strong> will be placed in out-of-stock mode.</li>
                  <li>Customer orders, admin users, and storage files remain completely untouched.</li>
                  <li>If any database constraint fails, the transaction automatically rolls back.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  To confirm, type <span className="font-mono text-cyan-700">CONFIRM REPLACE</span> below:
                </label>
                <input
                  type="text"
                  placeholder="CONFIRM REPLACE"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-cyan-500 uppercase"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isExecutingReplacement}
                  className="border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={confirmText.trim().toUpperCase() !== 'CONFIRM REPLACE' || isExecutingReplacement}
                  onClick={handleExecuteReplacement}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs gap-1.5 disabled:opacity-40"
                >
                  {isExecutingReplacement ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  <span>Execute Replacement</span>
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
