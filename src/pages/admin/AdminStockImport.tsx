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
  Loader2
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
  const handleLoadDefaultWorkbook = async () => {
    setLoading(true)
    setParsingError(null)
    setExecutionReport(null)

    try {
      // In Vite dev or preview, fetch product_List (1).xls from root / public
      const res = await fetch('/product_List (1).xls')
      if (!res.ok) {
        throw new Error(`Could not automatically load product_List (1).xls (HTTP ${res.status}). Please use the file upload button above.`)
      }
      const buffer = await res.arrayBuffer()
      const parsed = parseStockWorkbook(buffer, 'product_List (1).xls')
      setSummary(parsed)
    } catch (err: any) {
      setParsingError(err?.message || 'Could not load default workbook. Please select and upload the file manually.')
    } finally {
      setLoading(false)
    }
  }

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
      title="Stock Inventory Import"
      subtitle="Client FY 2026–27 Excel Stock Report Processor & Safe Catalogue Replacement"
      actions={
        summary && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCatalogueBackup}
              className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Backup Current Catalogue
            </Button>
            <Button
              onClick={() => setShowConfirmModal(true)}
              disabled={summary.validProductsCount === 0}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs gap-1.5 shadow-lg shadow-cyan-900/30"
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
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800 text-rose-200'
            } space-y-2 backdrop-blur-md`}
          >
            <div className="flex items-center gap-2.5">
              {executionReport.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <h3 className="font-bold text-base text-white font-['Outfit']">
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
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-md space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white font-['Outfit']">
                  FY 2026–27 Stock Workbook Ingestion
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Upload the client's official stock workbook (<code className="text-cyan-300">.xls</code>, <code className="text-cyan-300">.xlsx</code>, or <code className="text-cyan-300">.csv</code>). 
                The system extracts exact Selling Cost, Closing Balance Qty, and validates financial integrity in preview mode before any database modifications.
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
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-cyan-900/30"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Stock File</span>
              </label>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadDefaultWorkbook}
                disabled={loading}
                className="border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white text-xs gap-1.5"
                title="Directly load product_List (1).xls from project root"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Load Default File</span>
              </Button>
            </div>
          </div>

          {parsingError && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{parsingError}</span>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-white font-['Outfit']">
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
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Source Rows</span>
                <p className="text-2xl font-extrabold text-white font-mono">{summary.totalSourceRows}</p>
                <span className="text-[10px] text-slate-500">FY 2026-27 Sheet</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Valid Products</span>
                <p className="text-2xl font-extrabold text-emerald-300 font-mono">{summary.validProductsCount}</p>
                <span className="text-[10px] text-emerald-500/80">Approved for Import</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400">Rejected Rows</span>
                <p className="text-2xl font-extrabold text-rose-300 font-mono">{summary.invalidRowsCount}</p>
                <button
                  onClick={handleDownloadRejectedCsv}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Download className="w-2.5 h-2.5" />
                  Download CSV
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">Zero Stock</span>
                <p className="text-2xl font-extrabold text-amber-300 font-mono">{summary.zeroStockCount}</p>
                <span className="text-[10px] text-amber-500/80">Marked Out of Stock</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-400">In Stock</span>
                <p className="text-2xl font-extrabold text-indigo-300 font-mono">{summary.positiveStockCount}</p>
                <span className="text-[10px] text-indigo-400/80">Available in Store</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-400">Duplicates</span>
                <p className="text-2xl font-extrabold text-white font-mono">
                  {summary.exactDuplicateCount}
                  <span className="text-xs text-slate-500 font-normal"> / {summary.possibleModelDuplicatesCount}</span>
                </p>
                <span className="text-[10px] text-slate-500">Exact / Similar Model</span>
              </div>
            </div>

            {/* Stage A Notice & Rejected Rows Alert */}
            {summary.invalidRowsCount > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/70 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold">
                      {summary.invalidRowsCount} malformed / invalid rows detected and excluded from import.
                    </span>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">
                      Excluded items with negative stock, missing selling prices, or credit note records.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadRejectedCsv}
                  className="border-amber-700 bg-amber-950/50 hover:bg-amber-900/60 text-amber-100 text-xs gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Rejection Report (CSV)
                </Button>
              </div>
            )}

            {/* Filter Bar & Controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by product name, brand, SKU or HSN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({summary.validProductsCount})
                </button>
                <button
                  onClick={() => setActiveFilter('zero-stock')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'zero-stock'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Zero Stock ({summary.zeroStockCount})
                </button>
                <button
                  onClick={() => setActiveFilter('review-category')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'review-category'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Review Categories ({summary.ambiguousCategoriesCount})
                </button>
                <button
                  onClick={() => setActiveFilter('missing-image')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeFilter === 'missing-image'
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Missing Image ({summary.missingImagesCount})
                </button>
              </div>

              {/* Category Dropdown */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
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
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 select-none">
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
                          className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                          onClick={() => setInspectingItem(item)}
                        >
                          <td className="py-3 px-3 text-center font-mono text-slate-500 text-[11px]">
                            {item.rowNumber}
                          </td>

                          {/* Media Thumbnail */}
                          <td className="py-3 px-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 p-0.5 flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </td>

                          {/* Product Name */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="font-mono text-slate-500 text-[10px]">{item.sku}</span>
                              {item.variantDetails?.storage && (
                                <span className="bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded text-[10px]">
                                  {item.variantDetails.storage}
                                </span>
                              )}
                              {item.variantDetails?.color && (
                                <span className="text-slate-400 text-[10px]">
                                  Color: {item.variantDetails.color}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Brand */}
                          <td className="py-3 px-3 font-medium text-slate-300">
                            {item.brand}
                          </td>

                          {/* Category Mapping with Review Flag */}
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <select
                                value={item.category}
                                onChange={(e) => handleUpdateItemCategory(item.id, e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
                              >
                                <option value="smartphones">Smartphones</option>
                                <option value="smart-tvs">Smart TVs</option>
                                <option value="home-appliances">Home Appliances</option>
                                <option value="accessories">Accessories</option>
                                <option value="other-electronics">Other Electronics</option>
                              </select>

                              {item.categoryStatus === 'needs_review' && (
                                <span
                                  className="text-[10px] bg-amber-950 border border-amber-800 text-amber-300 px-1.5 py-0.5 rounded font-bold shrink-0"
                                  title="Original group 'Others' or 'Tablets' mapped by heuristic. Verify category."
                                >
                                  Review
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Selling Price (Exact Selling Cost) */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-white">
                            {formatINR(item.sellingPrice)}
                          </td>

                          {/* Stock Quantity */}
                          <td className="py-3 px-3 text-center">
                            {item.isZeroStock ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 border border-rose-800 text-rose-300">
                                0 (Out of Stock)
                              </span>
                            ) : (
                              <span className="font-mono font-bold text-emerald-400">
                                {item.stockQuantity}
                              </span>
                            )}
                          </td>

                          {/* Image Status */}
                          <td className="py-3 px-3 text-center">
                            {item.imageStatus === 'matched' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Matched
                              </span>
                            ) : item.imageStatus === 'needs_review' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
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
                              className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 h-7 px-2"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-200 max-h-[90vh] overflow-y-auto shadow-2xl">
              
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    Product Details • Row #{inspectingItem.rowNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
                    {inspectingItem.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-500">{inspectingItem.sku}</span>
                </div>
                <button
                  onClick={() => setInspectingItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Data comparison block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Selling Cost (Price):</span>
                  <span className="font-mono font-bold text-white text-sm">{formatINR(inspectingItem.sellingPrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Closing Balance (Stock):</span>
                  <span className={`font-mono font-bold text-sm ${inspectingItem.isZeroStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {inspectingItem.stockQuantity} {inspectingItem.isZeroStock ? '(Out of Stock)' : 'units'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Original Group:</span>
                  <span className="text-slate-300 font-medium">{inspectingItem.originalGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">HSN / GST:</span>
                  <span className="text-slate-300 font-mono">{inspectingItem.hsn || 'N/A'} {inspectingItem.gstPercent ? `(${inspectingItem.gstPercent}%)` : ''}</span>
                </div>
              </div>

              {/* Open Icecat Lookup Trigger */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Datasheet & Studio Photo Matching</span>
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
                  <p className="text-xs text-cyan-300/90 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-800/60">
                    {lookupMessage}
                  </p>
                )}

                {/* Specs List */}
                {inspectingItem.specs && inspectingItem.specs.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Specifications:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {inspectingItem.specs.map((sp, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">{sp.label}</span>
                          <span className="text-white font-medium">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInspectingItem(null)}
                  className="border-slate-800 text-slate-300"
                >
                  Close
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* Stage B Confirmation Modal */}
        {showConfirmModal && summary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 text-slate-200 shadow-2xl">
              
              <div className="flex items-center gap-3 text-amber-400">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    Confirm Safe Catalogue Replacement
                  </h3>
                  <span className="text-xs text-slate-400">Stage B Transactional Execution</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <p className="text-slate-300 leading-relaxed">
                  You are about to replace the live showroom product catalogue with the validated client inventory from <strong className="text-white">{summary.fileName}</strong>.
                </p>
                <ul className="space-y-1 text-slate-400 list-disc pl-4">
                  <li>A durable snapshot backup of the existing catalogue will be created first.</li>
                  <li><strong className="text-white">{summary.validProductsCount} valid products</strong> will be imported.</li>
                  <li><strong className="text-amber-400">{summary.zeroStockCount} zero-stock products</strong> will be placed in out-of-stock mode.</li>
                  <li>Customer orders, admin users, and storage files remain completely untouched.</li>
                  <li>If any database constraint fails, the transaction automatically rolls back.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  To confirm, type <span className="font-mono text-cyan-400">CONFIRM REPLACE</span> below:
                </label>
                <input
                  type="text"
                  placeholder="CONFIRM REPLACE"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 uppercase"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isExecutingReplacement}
                  className="border-slate-800 text-slate-300"
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
