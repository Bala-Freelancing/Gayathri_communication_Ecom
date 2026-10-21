import React, { useState, useRef, useEffect } from 'react'
import { ProductCategoryType, Product } from '@/types/product'
import { productService } from '@/services/productService'
import { lookupProductCatalog, IcecatSpecItem } from '@/services/icecatService'
import { storageService } from '@/services/storageService'
import { formatINR } from '@/lib/utils'
import { 
  X, 
  Search, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Image as ImageIcon,
  ExternalLink,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AddStockModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (product: Product, sku: string) => void
}

const CATEGORIES: { id: ProductCategoryType; name: string }[] = [
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'smart-tvs', name: 'Smart TVs' },
  { id: 'home-appliances', name: 'Home Appliances' },
  { id: 'accessories', name: 'Accessories & Wearables' },
  { id: 'other-electronics', name: 'Other Electronics & Peripherals' },
]

const QUICK_BRANDS = ['Samsung', 'LG', 'Apple', 'Sony', 'OnePlus', 'Logitech', 'boAt', 'Bosch', 'TP-Link']

export const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // Lookup state
  const [brandInput, setBrandInput] = useState('')
  const [modelInput, setModelInput] = useState('')
  const [searching, setSearching] = useState(false)
  const [lookupPerformed, setLookupPerformed] = useState(false)
  const [lookupMatchFound, setLookupMatchFound] = useState(false)
  const [lookupSource, setLookupSource] = useState<'live-open-icecat' | 'demo-catalog' | null>(null)
  const [lookupAttribution, setLookupAttribution] = useState<string | null>(null)
  const [lookupIcecatUrl, setLookupIcecatUrl] = useState<string | null>(null)
  const [unsupportedBrandMessage, setUnsupportedBrandMessage] = useState<string | null>(null)

  // Form fields
  const [category, setCategory] = useState<ProductCategoryType>('smartphones')
  const [productName, setProductName] = useState('')
  const [productBrand, setProductBrand] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [sellingPrice, setSellingPrice] = useState<string>('')
  const [originalPrice, setOriginalPrice] = useState<string>('') // Optional MRP
  const [stockQuantity, setStockQuantity] = useState<string>('10')
  const [warranty, setWarranty] = useState('1 Year Official Brand Warranty')
  const [badgeText, setBadgeText] = useState('')
  const [specs, setSpecs] = useState<IcecatSpecItem[]>([])

  // Image handling
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageSourceMode, setImageSourceMode] = useState<'catalog' | 'upload' | 'url'>('catalog')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  // Duplicate detection & Saving state
  const [duplicateWarning, setDuplicateWarning] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Clean up any generated blob object URLs on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [])

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  const setPreviewWithObjectUrl = (file: File) => {
    clearObjectUrl()
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setImagePreview(url)
  }

  if (!isOpen) return null

  // Execute catalog search
  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!brandInput.trim() && !modelInput.trim()) {
      setFormError('Please enter a Brand or Model Name to search.')
      return
    }

    setSearching(true)
    setFormError(null)
    setUnsupportedBrandMessage(null)

    try {
      const result = await lookupProductCatalog(brandInput, modelInput)
      setLookupPerformed(true)

      if (result.found && result.title) {
        setLookupMatchFound(true)
        setLookupSource(result.source === 'live-open-icecat' ? 'live-open-icecat' : 'demo-catalog')
        setLookupAttribution(result.attribution || null)
        setLookupIcecatUrl(result.icecatUrl || null)

        // Populate fields
        setProductName(result.title)
        setProductBrand(result.brand || brandInput)
        if (result.category) setCategory(result.category)
        if (result.tagline) setTagline(result.tagline)
        if (result.description) setDescription(result.description)
        if (result.warranty) setWarranty(result.warranty)
        if (result.specs) setSpecs(result.specs)
        if (result.imageUrl) {
          clearObjectUrl()
          setSelectedFile(null)
          setImageUrl(result.imageUrl)
          setImagePreview(result.imageUrl)
          setImageSourceMode('catalog')
        }
      } else {
        setLookupMatchFound(false)
        setLookupAttribution(null)
        setLookupIcecatUrl(null)

        // Fallback: Populate brand and model name into manual form without blocking
        setProductBrand(brandInput.trim())
        setProductName(modelInput.trim())
        if (result.reason === 'unsupported_brand') {
          setUnsupportedBrandMessage(
            `"${brandInput}" does not participate in Open Icecat's free sponsor program (requires paid tier). Switched to manual entry mode.`
          )
        } else {
          setUnsupportedBrandMessage(
            `No exact match found in Open Catalog for "${brandInput} ${modelInput}". Switched to manual entry mode.`
          )
        }
        // Initialize default spec template if empty
        if (specs.length === 0) {
          setSpecs([
            { label: 'Key Feature', value: '' },
            { label: 'Color / Finish', value: '' }
          ])
        }
      }
    } catch {
      setLookupPerformed(true)
      setLookupMatchFound(false)
      setUnsupportedBrandMessage('Lookup service unavailable. Switched to manual entry mode.')
    } finally {
      setSearching(false)
    }
  }

  // Switch directly to manual mode
  const handleSkipToManual = () => {
    setLookupPerformed(true)
    setLookupMatchFound(false)
    setLookupAttribution(null)
    setProductBrand(brandInput.trim())
    setProductName(modelInput.trim())
    if (specs.length === 0) {
      setSpecs([{ label: 'Key Feature', value: '' }])
    }
  }

  // Image file upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = storageService.validateImageFile(file)
    if (!validation.valid) {
      setFormError(validation.error || 'Please select a valid image file (JPEG, PNG, WebP, AVIF) under 5MB.')
      return
    }

    setFormError(null)
    setSelectedFile(file)
    setImageUrl('') // Reset explicit manual URL since a local file is chosen
    setPreviewWithObjectUrl(file)
    setImageSourceMode('upload')
  }

  // Add specification row
  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { label: '', value: '' }])
  }

  // Update specification row
  const handleUpdateSpec = (index: number, field: 'label' | 'value', text: string) => {
    setSpecs((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: text }
      return copy
    })
  }

  // Remove specification row
  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, idx) => idx !== index))
  }

  // Pre-save validation & duplicate check
  const handleSaveClick = async (forceBypassDuplicate = false) => {
    setFormError(null)

    if (!productName.trim()) {
      setFormError('Product Name is required.')
      return
    }
    if (!productBrand.trim()) {
      setFormError('Brand is required.')
      return
    }

    const priceNum = parseFloat(sellingPrice)
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Valid Showroom Selling Price (₹) is required.')
      return
    }

    const mrpNum = originalPrice.trim() ? parseFloat(originalPrice) : priceNum
    if (!isNaN(mrpNum) && mrpNum < priceNum) {
      setFormError('Showroom MRP (original price) cannot be lower than the selling price.')
      return
    }

    const stockNum = parseInt(stockQuantity, 10)
    if (isNaN(stockNum) || stockNum < 0) {
      setFormError('Stock Quantity must be 0 or greater.')
      return
    }

    // Check for duplicates unless user explicitly bypassed
    if (!forceBypassDuplicate) {
      const dupCheck = productService.checkDuplicateProduct(productName, productBrand)
      if (dupCheck.isDuplicate && dupCheck.matchedProduct) {
        setDuplicateWarning(dupCheck.matchedProduct)
        return
      }
    }

    // Proceed to create product
    setIsSaving(true)
    const filterCleanSpecs = specs.filter((s) => s.label.trim() && s.value.trim())

    let finalImageUrl = imageUrl.trim() || '/images/placeholder-product.png'
    let uploadedStoragePath: string | null = null

    // If an image file was selected from the computer, upload it to permanent Supabase Storage
    if (imageSourceMode === 'upload' && selectedFile) {
      setIsUploading(true)
      try {
        // 1. Client-side compression to WebP (preserves free-tier storage & egress limits)
        const compressedFile = await storageService.compressImageClient(selectedFile)

        // 2. Upload to Supabase Storage bucket 'product-images'
        const uploadPrefix = `${productBrand}-${productName}`
        const uploadRes = await storageService.uploadProductImage(compressedFile, uploadPrefix)

        if (!uploadRes.success || !uploadRes.url) {
          setIsSaving(false)
          setIsUploading(false)
          setFormError(
            uploadRes.error ||
              'Image upload failed. Cloud storage is required to save showroom photos. Product was not created.'
          )
          return
        }

        finalImageUrl = uploadRes.url
        uploadedStoragePath = uploadRes.path || null
      } catch (uploadErr: any) {
        setIsSaving(false)
        setIsUploading(false)
        setFormError(
          uploadErr?.message || 'Unexpected failure uploading product image to cloud storage.'
        )
        return
      } finally {
        setIsUploading(false)
      }
    }

    const res = await productService.createProduct({
      name: productName.trim(),
      brand: productBrand.trim(),
      category,
      tagline: tagline.trim(),
      description: description.trim(),
      sellingPrice: priceNum,
      originalPrice: mrpNum,
      stockQuantity: stockNum,
      warranty: warranty.trim(),
      badge: badgeText.trim() || undefined,
      image: finalImageUrl,
      specs: filterCleanSpecs,
    })

    setIsSaving(false)

    if (res.success && res.product && res.sku) {
      clearObjectUrl()
      onSuccess(res.product, res.sku)
      onClose()
    } else {
      // Rollback: Clean up newly uploaded image from Storage if product creation failed
      if (uploadedStoragePath) {
        await storageService.deleteProductImage(uploadedStoragePath)
      }
      setFormError(res.error || 'Failed to save product. Please check your inputs.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between sticky top-0 z-10 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                Add New Showroom Stock
              </h2>
              <p className="text-xs text-slate-400">
                Lookup official catalog specifications or enter model inventory manually.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              clearObjectUrl()
              onClose()
            }}
            className="p-2 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">

          {/* Duplicate Product Alert Warning Modal */}
          {duplicateWarning && (
            <div className="p-4 rounded-xl border border-amber-600/50 bg-amber-950/40 text-amber-200 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-sm text-amber-300 block">
                    Potential Duplicate Product Detected
                  </span>
                  <p>
                    A product with a similar name already exists in inventory:
                  </p>
                  <p className="font-semibold text-white bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    "{duplicateWarning.name}" ({duplicateWarning.brand}) — Current Price: {formatINR(duplicateWarning.price)}
                  </p>
                  <p className="text-amber-300/80">
                    Do you want to proceed and add this as a separate stock item, or cancel to review?
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDuplicateWarning(null)}
                  className="border-slate-700 text-slate-300 hover:text-white text-xs"
                >
                  Cancel & Review
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setDuplicateWarning(null)
                    handleSaveClick(true)
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs"
                >
                  Yes, Save Anyway
                </Button>
              </div>
            </div>
          )}

          {/* Form Error Toast */}
          {formError && (
            <div className="p-3.5 rounded-xl border border-rose-800 bg-rose-950/60 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Step 1: Catalog Lookup Section */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-800/80 bg-slate-900/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Step 1: Catalog Search & Autofill (Optional)
              </span>
              <button
                type="button"
                onClick={handleSkipToManual}
                className="text-xs text-slate-400 hover:text-cyan-400 underline underline-offset-4"
              >
                Skip to Manual Form
              </button>
            </div>

            <form onSubmit={handleLookup} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    placeholder="e.g. Samsung, LG, Logitech, Bosch"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Model Name or SKU
                  </label>
                  <input
                    type="text"
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    placeholder="e.g. Galaxy S24 Ultra, OLED C3, MX Master 3S"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Quick Brand Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Quick Select:</span>
                {QUICK_BRANDS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrandInput(b)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                      brandInput.toLowerCase() === b.toLowerCase()
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={searching}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/10"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching Open Catalog...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Search Online Catalog
                    </>
                  )}
                </Button>
                {lookupPerformed && (
                  <button
                    type="button"
                    onClick={() => {
                      setLookupPerformed(false)
                      setLookupMatchFound(false)
                      setBrandInput('')
                      setModelInput('')
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Search
                  </button>
                )}
              </div>
            </form>

            {/* Match Found Banner */}
            {lookupPerformed && lookupMatchFound && (
              <div className="p-3.5 rounded-xl border border-emerald-800/80 bg-emerald-950/40 text-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {lookupSource === 'live-open-icecat'
                      ? 'Live Match Retrieved from Open Icecat Catalog'
                      : 'Demo Catalog Fallback Match'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80">
                  {lookupSource === 'live-open-icecat'
                    ? 'Official live manufacturer specifications and studio preview loaded from Open Icecat. Please review details, enter showroom selling price, and confirm stock count.'
                    : 'Reference demonstration specifications loaded from local catalogue fallback. Please review details, enter showroom selling price, and confirm stock count.'}
                </p>
                {lookupAttribution && (
                  <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{lookupAttribution}</span>
                    {lookupIcecatUrl && (
                      <a
                        href={lookupIcecatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-0.5"
                      >
                        Specs Icecat <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Unsupported / Not Found Banner */}
            {lookupPerformed && !lookupMatchFound && unsupportedBrandMessage && (
              <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Manual Entry Mode Active</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {unsupportedBrandMessage}
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Product Information & Inventory Form */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Step 2: Product Review, Specifications & Pricing
            </span>

            {/* Core Classification: Category & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategoryType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Brand <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  placeholder="e.g. Samsung, Apple, LG"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. New Launch, Best Seller"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Product Title / Model Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Tagline & Warranty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Short Tagline / Key Highlight
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Flagship 200MP Quad Telephoto with Galaxy AI"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Warranty Terms
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="e.g. 1 Year Official Brand Warranty"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Mandatory Showroom Pricing & Stock Fields (Highlighted in Cyan/Emerald) */}
            <div className="p-4 rounded-xl border border-cyan-800/40 bg-gradient-to-r from-cyan-950/20 to-blue-950/20 space-y-3">
              <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                Showroom Financials & Physical Stock
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="e.g. 129999"
                    className="w-full bg-slate-900 border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Actual showroom customer price.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Showroom MRP / Original (₹) <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 134999"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Strikethrough reference. Defaults to selling price if empty.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-300 mb-1">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="10"
                    className="w-full bg-slate-900 border border-cyan-700/60 rounded-xl px-3.5 py-2.5 text-sm font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Showroom units currently in stock.
                  </span>
                </div>
              </div>
            </div>

            {/* Product Image Section */}
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/30 space-y-3">
              <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wide">
                Product Image (Studio Catalog or Authorized Upload)
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Thumbnail Preview Card */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-24 h-24 rounded-xl border border-slate-800 bg-slate-900/90 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-700" />
                    )}
                  </div>
                  {imagePreview && (
                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                      {imageSourceMode === 'catalog' ? 'Catalog Image' : imageSourceMode === 'upload' ? 'Showroom Photo' : 'Web Link'}
                    </span>
                  )}
                </div>

                {/* Upload or URL options */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp, image/avif"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-slate-700 hover:border-slate-600 text-slate-200 text-xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" /> Upload Showroom Photo
                    </Button>
                    <span className="text-[11px] text-slate-500">Max 5MB (PNG, JPG, WebP)</span>
                  </div>

                  {selectedFile && imageSourceMode === 'upload' && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span>Selected file:</span>
                      <span className="text-cyan-300 font-semibold truncate max-w-[200px]">{selectedFile.name}</span>
                      <span className="text-slate-500">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => {
                        clearObjectUrl()
                        setSelectedFile(null)
                        setImageUrl(e.target.value)
                        setImagePreview(e.target.value || null)
                        setImageSourceMode('url')
                      }}
                      placeholder="Or enter direct image URL (https://...)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide block">
                    Technical Specifications
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Key hardware and functional parameters shown on the customer storefront.
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSpec}
                  className="border-slate-800 hover:border-slate-700 text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Spec Row
                </Button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(index, 'label', e.target.value)}
                      placeholder="Label (e.g. Display, Battery, RAM)"
                      className="w-1/3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(index, 'value', e.target.value)}
                      placeholder="Specification details"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      aria-label="Remove spec row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {specs.length === 0 && (
                  <p className="text-xs text-slate-500 italic py-2">
                    No specifications added yet. Click "Add Spec Row" or lookup product above.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between sticky bottom-0 z-10 backdrop-blur-lg">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              clearObjectUrl()
              onClose()
            }}
            className="border-slate-800 text-slate-400 hover:text-white text-xs"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveClick(false)}
              className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {isUploading ? 'Uploading Image to Cloud...' : 'Saving Stock...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Save Product to Showroom Inventory
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
