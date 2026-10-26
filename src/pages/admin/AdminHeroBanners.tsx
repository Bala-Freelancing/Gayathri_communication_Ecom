import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useHeroBanners } from '@/hooks/useHeroBanners'
import { HeroSlideConfig } from '@/types/heroBanner'
import { productService } from '@/services/productService'
import { formatINR } from '@/lib/utils'
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  ExternalLink, 
  RotateCcw, 
  Check, 
  X, 
  Image as ImageIcon, 
  Tag, 
  CreditCard, 
  ShoppingBag, 
  MessageCircle, 
  HelpCircle,
  Layers,
  ChevronRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Search,
  Package,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Preset local showroom photos for quick 1-click selection
const PRESET_SHOWROOM_IMAGES = [
  { label: 'LG Front Load Washer', url: '/images/products/lg-washer.jpg', category: 'Appliances' },
  { label: 'Samsung Double Door Fridge', url: '/images/products/samsung-fridge.jpg', category: 'Appliances' },
  { label: 'Split Inverter AC', url: '/images/products/split-ac.jpg', category: 'Appliances' },
  { label: 'Ceiling Fan', url: '/images/products/ceiling-fan.jpg', category: 'Appliances' },
  { label: 'Apple iPhone 16 Pro', url: '/images/products/iphone16.jpg', category: 'Smartphones' },
  { label: 'Samsung Galaxy S24 Ultra', url: '/images/products/s24.jpg', category: 'Smartphones' },
  { label: 'OnePlus 12 5G', url: '/images/products/oneplus12.jpg', category: 'Smartphones' },
  { label: 'Vivo V30 Pro', url: '/images/products/vivo-phone.jpg', category: 'Smartphones' },
  { label: 'Redmi Note 13 Pro', url: '/images/products/redmi-phone.jpg', category: 'Smartphones' },
  { label: 'Sony BRAVIA 65" OLED', url: '/images/products/sony-oled.jpg', category: 'Smart TVs' },
  { label: 'LG UltraGear Gaming Monitor', url: '/images/products/lg-ultragear-monitor.jpg', category: 'Smart TVs' },
  { label: 'Apple AirPods Pro 2', url: '/images/products/airpods-pro-2.jpg', category: 'Accessories' },
  { label: 'Galaxy Watch 6 Classic', url: '/images/products/galaxy-watch-6.jpg', category: 'Accessories' },
  { label: 'Wireless Neckband Earphones', url: '/images/products/neckband-earphones.jpg', category: 'Accessories' },
  { label: 'Portable Bluetooth Speaker', url: '/images/products/portable-speaker.jpg', category: 'Accessories' },
  { label: '20,000mAh Power Bank', url: '/images/products/power-bank.jpg', category: 'Accessories' },
  { label: 'Anker 65W GaN Fast Charger', url: '/images/products/anker-65w-charger.jpg', category: 'Accessories' },
  { label: 'Logitech MX Master 3S', url: '/images/products/logitech-mx-master-3s.jpg', category: 'Accessories' },
  { label: 'TP-Link WiFi 6 Router', url: '/images/products/tplink-ax73-router.jpg', category: 'Accessories' },
]

export const AdminHeroBanners: React.FC = () => {
  const { 
    slides, 
    saveSlide, 
    updateSlide, 
    toggleSlideActive, 
    deleteSlide, 
    moveSlide, 
    resetToDefaults 
  } = useHeroBanners(true)

  const [activePreviewIndex, setActivePreviewIndex] = useState(0)
  const [editingSlide, setEditingSlide] = useState<HeroSlideConfig | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showStockPicker, setShowStockPicker] = useState(false)
  const [stockSearchQuery, setStockSearchQuery] = useState('')
  const [stockCategoryFilter, setStockCategoryFilter] = useState('all')
  const [newSpecTag, setNewSpecTag] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [catalogProducts, setCatalogProducts] = useState<any[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Load catalog products for auto-linking and subscribe to changes
  useEffect(() => {
    productService.fetchAllProductsAdmin().then((res) => {
      if (res.data) setCatalogProducts(res.data)
    })
    const unsub = productService.subscribeToChanges(() => {
      productService.fetchAllProductsAdmin().then((res) => {
        if (res.data) setCatalogProducts(res.data)
      })
    })
    return () => unsub()
  }, [])

  // Keep preview index valid
  useEffect(() => {
    if (activePreviewIndex >= slides.length && slides.length > 0) {
      setActivePreviewIndex(0)
    }
  }, [slides.length, activePreviewIndex])

  const previewSlide = slides[activePreviewIndex] || slides[0]

  // Temporary edit form state
  const [form, setForm] = useState<HeroSlideConfig>({
    id: '',
    productId: '',
    matchKeywords: [],
    brandTag: '',
    badgeText: '',
    kicker: 'Curated Showroom Spotlight',
    modelName: '',
    headline: '',
    shortLabel: '',
    description: '',
    specs: [],
    image: '',
    imageAlt: '',
    fallbackPrice: 0,
    fallbackOriginalPrice: 0,
    primaryCtaText: 'Inquire on WhatsApp',
    secondaryCtaText: 'Quick View',
    isActive: true,
  })

  // Open editor for a slide
  const handleEdit = (slide: HeroSlideConfig) => {
    setIsCreatingNew(false)
    setEditingSlide(slide)
    setForm({
      ...slide,
      specs: [...(slide.specs || [])],
      matchKeywords: [...(slide.matchKeywords || [])],
    })
  }

  // Open editor for a new slide
  const handleAddNew = () => {
    const newId = `slide-${Date.now()}`
    setIsCreatingNew(true)
    const newConfig: HeroSlideConfig = {
      id: newId,
      productId: '',
      matchKeywords: [],
      brandTag: 'Gayathri Showroom Spotlight',
      badgeText: 'Official Brand Warranty',
      kicker: 'Curated Showroom Spotlight',
      modelName: 'New Flagship Showcase',
      headline: 'Next-Gen Performance & Precision.',
      shortLabel: 'New Spotlight',
      description: 'Experience genuine certified electronics with official brand warranty and same-day delivery at Gayathri Communication.',
      specs: ['Official Warranty', 'Doorstep Delivery', 'Express Pickup'],
      image: '/images/products/lg-washer.jpg',
      imageAlt: 'Flagship Showroom Product',
      fallbackPrice: 19999,
      fallbackOriginalPrice: 24999,
      primaryCtaText: 'Inquire on WhatsApp',
      secondaryCtaText: 'Quick View',
      isActive: true,
      orderIndex: slides.length,
    }
    setEditingSlide(newConfig)
    setForm(newConfig)
  }

  // Helper to convert any stock product into a HeroSlideConfig
  const createSlideFromProduct = (prod: any, orderIndex: number): HeroSlideConfig => {
    const brand = prod.brand || 'Authorized'
    const name = prod.name || 'Flagship Product'
    const shortLabel = name.length > 18 
      ? name.split(' ').slice(0, 3).join(' ') 
      : name

    const specs: string[] = []
    if (Array.isArray(prod.highlights) && prod.highlights.length > 0) {
      specs.push(...prod.highlights.slice(0, 3))
    } else if (Array.isArray(prod.specs) && prod.specs.length > 0) {
      specs.push(...prod.specs.slice(0, 3).map((s: any) => `${s.label}: ${s.value}`))
    }
    if (specs.length === 0) {
      if (prod.warranty) specs.push(prod.warranty)
      specs.push('Original Brand Sealed')
      specs.push('Express Showroom Pickup')
    }

    return {
      id: `slide-${prod.id}-${Date.now().toString(36)}`,
      productId: prod.id,
      matchKeywords: [name.toUpperCase(), brand.toUpperCase()],
      brandTag: `${brand} Official Authorized Retailer`,
      badgeText: prod.badge || 'Showroom Available',
      kicker: 'Featured Flagship Spotlight',
      modelName: name,
      headline: prod.tagline || `${name} — Direct Brand Sealed`,
      shortLabel,
      description: prod.description || prod.tagline || `100% genuine brand sealed box with official manufacturer warranty and express counter pickup at Gayathri Communication.`,
      specs: specs.slice(0, 3),
      image: prod.image || '/images/placeholder-product.svg',
      imageAlt: name,
      fallbackPrice: Number(prod.price) || 0,
      fallbackOriginalPrice: Number(prod.originalPrice) || Number(prod.price) || 0,
      primaryCtaText: 'Inquire on WhatsApp',
      secondaryCtaText: 'Quick View',
      isActive: true,
      orderIndex,
      updatedAt: new Date().toISOString(),
    }
  }

  // 1-Click Feature: Adds stock item directly to hero carousel
  const handleFeatureStockItem = (product: any) => {
    const newSlide = createSlideFromProduct(product, slides.length)
    saveSlide(newSlide)
    setActivePreviewIndex(slides.length)
    setShowStockPicker(false)
    setFeedback({
      type: 'success',
      message: `🎉 "${product.name}" added to Hero Section! Now live on homepage.`,
    })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Customize & Feature: Pre-fills slide editor modal with stock item details
  const handleCustomizeStockItem = (product: any) => {
    const newSlide = createSlideFromProduct(product, slides.length)
    setIsCreatingNew(true)
    setEditingSlide(newSlide)
    setForm(newSlide)
    setShowStockPicker(false)
  }

  // Check if a product is already in the hero banner
  const isProductInHero = (productId: string) => {
    return slides.some((s) => s.productId === productId)
  }

  // Filtered stock list for picker modal
  const filteredStock = useMemo(() => {
    return catalogProducts.filter((p) => {
      const q = stockSearchQuery.trim().toLowerCase()
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      
      const matchCategory =
        stockCategoryFilter === 'all' || p.category === stockCategoryFilter

      return matchSearch && matchCategory
    })
  }, [catalogProducts, stockSearchQuery, stockCategoryFilter])

  const stockCategories = [
    { id: 'all', label: 'All Products' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'smart-tvs', label: 'Smart TVs' },
    { id: 'home-appliances', label: 'Appliances' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'other-electronics', label: 'Electronics' },
  ]

  // Handle auto-fill from existing catalog product
  const handleSelectCatalogProduct = (productId: string) => {
    const prod = catalogProducts.find((p) => p.id === productId)
    if (!prod) return

    setForm((prev) => ({
      ...prev,
      productId: prod.id,
      modelName: prod.name,
      shortLabel: prod.name.split(' ').slice(0, 3).join(' '),
      headline: prod.tagline || prev.headline,
      description: prod.description || prev.description,
      fallbackPrice: prod.price,
      fallbackOriginalPrice: prod.originalPrice || Math.round(prod.price * 1.25),
      image: prod.image || prev.image,
      imageAlt: prod.name,
      brandTag: `${prod.brand} Official Showroom`,
      badgeText: prod.badge || 'Verified Genuine',
      specs: prod.highlights && prod.highlights.length > 0
        ? prod.highlights.slice(0, 3)
        : prev.specs,
      matchKeywords: [prod.name.toUpperCase(), prod.brand.toUpperCase()],
    }))
  }

  // Add a spec pill tag
  const handleAddSpecTag = () => {
    const trimmed = newSpecTag.trim()
    if (!trimmed) return
    if (form.specs.includes(trimmed)) {
      setNewSpecTag('')
      return
    }
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, trimmed],
    }))
    setNewSpecTag('')
  }

  // Remove a spec pill tag
  const handleRemoveSpecTag = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }))
  }

  // Save the form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.modelName.trim()) {
      setFeedback({ type: 'error', message: 'Model Name / Display Title is required.' })
      return
    }

    const payload: HeroSlideConfig = {
      ...form,
      shortLabel: form.shortLabel.trim() || form.modelName.split(' ').slice(0, 2).join(' '),
      fallbackPrice: Number(form.fallbackPrice) || 0,
      fallbackOriginalPrice: Number(form.fallbackOriginalPrice) || 0,
      orderIndex: isCreatingNew ? slides.length : (editingSlide?.orderIndex ?? 0),
    }

    saveSlide(payload)
    setEditingSlide(null)
    setFeedback({
      type: 'success',
      message: `Slide "${payload.shortLabel}" successfully saved and updated on homepage!`,
    })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleDelete = (id: string, name: string) => {
    if (slides.length <= 1) {
      setFeedback({
        type: 'error',
        message: 'Cannot delete the only slide. Please keep at least one active slide.',
      })
      setTimeout(() => setFeedback(null), 4000)
      return
    }
    if (confirm(`Are you sure you want to delete "${name}" from the hero banner?`)) {
      deleteSlide(id)
      setFeedback({
        type: 'success',
        message: `Slide "${name}" removed.`,
      })
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleResetToDefaults = () => {
    resetToDefaults()
    setShowResetConfirm(false)
    setActivePreviewIndex(0)
    setFeedback({
      type: 'success',
      message: 'Restored the 4 official flagship showroom slides to defaults.',
    })
    setTimeout(() => setFeedback(null), 4000)
  }

  // Computed discount for preview
  const previewDiscount = previewSlide && previewSlide.fallbackOriginalPrice > previewSlide.fallbackPrice
    ? Math.round(((previewSlide.fallbackOriginalPrice - previewSlide.fallbackPrice) / previewSlide.fallbackOriginalPrice) * 100)
    : 0

  const previewSavings = previewSlide && previewSlide.fallbackOriginalPrice > previewSlide.fallbackPrice
    ? previewSlide.fallbackOriginalPrice - previewSlide.fallbackPrice
    : 0

  const previewEmi = previewSlide && previewSlide.fallbackPrice > 0
    ? Math.round(previewSlide.fallbackPrice / 24)
    : 0

  return (
    <AdminLayout
      title="Hero Showcase Banners"
      subtitle="Direct admin control for the homepage flagship spotlight carousel. Changes update live on the storefront."
      actions={
        <div className="flex items-center gap-2.5">
          <Link to="/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </Button>
          </Link>

          <Button
            onClick={() => setShowResetConfirm(true)}
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 gap-1.5"
            title="Reset to default flagship showroom slides"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </Button>

          <Button
            onClick={() => setShowStockPicker(true)}
            size="sm"
            className="text-xs font-bold gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Select from Stocks</span>
          </Button>

          <Button
            onClick={handleAddNew}
            size="sm"
            className="text-xs font-bold gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner Slide</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-8 max-w-7xl">

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800/80 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="p-1 hover:bg-slate-800/60 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Showroom Hero Preview Section */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">
                  Storefront Live Spotlight Preview
                </h3>
                <p className="text-[11px] text-slate-400">
                  This is exactly how the customer sees this slide on the homepage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono">
                Slide {activePreviewIndex + 1} of {slides.length}
              </Badge>
              {previewSlide && (
                <Button
                  onClick={() => handleEdit(previewSlide)}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 gap-1 border-slate-700 bg-slate-900 text-cyan-400 hover:text-white hover:bg-slate-800"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit This Slide
                </Button>
              )}
            </div>
          </div>

          {/* Interactive Mini-Stage mirroring HeroSection.tsx */}
          {previewSlide && (
            <div className="relative overflow-hidden rounded-2xl bg-[#0f1115] text-white p-5 sm:p-7 border border-neutral-800/80 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left side: title, description, price, specs */}
                <div className="lg:col-span-7 space-y-3.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/50 uppercase tracking-wider">
                      {previewSlide.brandTag || 'Curated Showcase'}
                    </span>
                    {previewSlide.badgeText && (
                      <span className="text-[10px] font-medium text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-md">
                        {previewSlide.badgeText}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight leading-snug">
                    {previewSlide.modelName}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed line-clamp-3">
                    {previewSlide.description}
                  </p>

                  {/* Price Box */}
                  <div className="bg-neutral-900/90 rounded-xl p-3.5 max-w-md space-y-2 border border-neutral-800/60">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                          {formatINR(previewSlide.fallbackPrice)}
                        </span>
                        {previewSlide.fallbackOriginalPrice > previewSlide.fallbackPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            MRP {formatINR(previewSlide.fallbackOriginalPrice)}
                          </span>
                        )}
                      </div>

                      {previewDiscount > 0 && (
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                          Save {formatINR(previewSavings)} ({previewDiscount}% Off)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-[11px] text-emerald-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Official Brand Sealed • Showroom Guarantee</span>
                      </span>
                    </div>
                  </div>

                  {/* Spec pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {(previewSlide.specs || []).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-neutral-800/90 text-neutral-200 px-2.5 py-1 rounded-md flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* CTA mockup */}
                  <div className="flex items-center gap-2.5 pt-1 opacity-90 pointer-events-none">
                    <div className="bg-white text-neutral-950 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </div>
                    <div className="bg-neutral-800 text-neutral-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Inquiry</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Product photo */}
                <div className="lg:col-span-5 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-xs h-48 sm:h-56 flex items-center justify-center">
                    <img
                      src={previewSlide.image}
                      alt={previewSlide.imageAlt || previewSlide.modelName}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.svg'
                      }}
                      className="max-h-48 sm:max-h-52 max-w-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Bottom Tabs selector to switch preview */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Previewing:</span>
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    idx === activePreviewIndex
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{s.shortLabel}</span>
                  {!s.isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Inactive on storefront" />
                  )}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-500">
              Click tabs above to switch live preview
            </span>
          </div>
        </div>

        {/* Slide List & Management Table */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/70 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">
                  Configured Carousel Slides ({slides.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Reorder, modify content, update prices, or toggle visibility
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowStockPicker(true)}
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 border-amber-600/60 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 hover:text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Select from Stocks</span>
              </Button>
              <Button
                onClick={handleAddNew}
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Slide</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {slides.map((slide, index) => {
              const isFirst = index === 0
              const isLast = index === slides.length - 1

              return (
                <div
                  key={slide.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    slide.isActive !== false
                      ? 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Thumbnail & Identity */}
                    <div className="flex items-center gap-3.5">
                      {/* Order position */}
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                        #{index + 1}
                      </div>

                      {/* Thumbnail photo */}
                      <div className="w-14 h-14 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                        <img
                          src={slide.image}
                          alt={slide.shortLabel}
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.svg'
                          }}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Titles & Specs */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white font-['Outfit']">
                            {slide.modelName}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                            Tab: {slide.shortLabel}
                          </span>
                          {slide.isActive !== false ? (
                            <Badge className="bg-emerald-950/80 border-emerald-800 text-emerald-400 text-[9px] px-1.5 py-0">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-800 border-slate-700 text-slate-400 text-[9px] px-1.5 py-0">
                              Hidden
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                          {slide.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] pt-0.5">
                          <span className="font-bold text-cyan-400">
                            {formatINR(slide.fallbackPrice)}
                          </span>
                          {slide.fallbackOriginalPrice > slide.fallbackPrice && (
                            <span className="text-slate-500 line-through">
                              {formatINR(slide.fallbackOriginalPrice)}
                            </span>
                          )}
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">
                            {(slide.specs || []).join(' | ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      
                      {/* Reorder Up / Down */}
                      <div className="flex items-center border border-slate-800 rounded-xl bg-slate-950 p-0.5">
                        <button
                          onClick={() => moveSlide(slide.id, 'up')}
                          disabled={isFirst}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                          title="Move Slide Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSlide(slide.id, 'down')}
                          disabled={isLast}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                          title="Move Slide Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Active toggle */}
                      <Button
                        onClick={() => toggleSlideActive(slide.id)}
                        variant="ghost"
                        size="sm"
                        className={`text-xs h-8 px-2.5 ${
                          slide.isActive !== false
                            ? 'text-emerald-400 hover:text-emerald-300'
                            : 'text-slate-400 hover:text-slate-300'
                        }`}
                        title="Toggle visibility on storefront"
                      >
                        {slide.isActive !== false ? 'Active' : 'Show'}
                      </Button>

                      {/* Edit Button */}
                      <Button
                        onClick={() => handleEdit(slide)}
                        size="sm"
                        className="text-xs h-8 gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>

                      {/* Delete Button */}
                      <Button
                        onClick={() => handleDelete(slide.id, slide.shortLabel)}
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>

                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Slide Editor Modal */}
      <AnimatePresence>
        {editingSlide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 my-8 text-slate-100"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">
                      {isCreatingNew ? 'Create New Showcase Banner' : 'Edit Showcase Banner'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update banner display text, showroom pricing, image, and spec highlights
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingSlide(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveForm} className="space-y-5">
                
                {/* Quick Auto-fill from Catalog */}
                {catalogProducts.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Select Product from Stock:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowStockPicker(true)
                          setEditingSlide(null)
                        }}
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Sparkles className="w-3 h-3" /> Browse Visual Stock Picker →
                      </button>
                    </div>
                    <select
                      onChange={(e) => handleSelectCatalogProduct(e.target.value)}
                      value={form.productId || ''}
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="" disabled>Select a stock model to pre-fill all details...</option>
                      {catalogProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatINR(p.price)} ({p.brand})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Model Title & Tab Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Main Headline / Model Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.modelName}
                      onChange={(e) => setForm({ ...form, modelName: e.target.value })}
                      placeholder="e.g. LG 9 Kg AI Direct Drive Washer"
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Large dominant title shown on the left of the banner
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Carousel Tab Button Label <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.shortLabel}
                      onChange={(e) => setForm({ ...form, shortLabel: e.target.value })}
                      placeholder="e.g. LG AI Washer"
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Pill button text at bottom (e.g. iPhone 16 Pro, LG AI Washer)
                    </p>
                  </div>
                </div>

                {/* Narrative Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Showroom Narrative Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Highlight motor warranty, AI features, genuine unboxing, or festive delivery..."
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Showroom Offer Price (₹)</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Active Selling Price</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.fallbackPrice || ''}
                      onChange={(e) => setForm({ ...form, fallbackPrice: Number(e.target.value) })}
                      placeholder="e.g. 18499"
                      className="w-full text-sm font-bold bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>MRP / Comparison Price (₹)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Strikethrough Price</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.fallbackOriginalPrice || ''}
                      onChange={(e) => setForm({ ...form, fallbackOriginalPrice: Number(e.target.value) })}
                      placeholder="e.g. 46990"
                      className="w-full text-sm font-bold bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Calculated savings info */}
                  {form.fallbackOriginalPrice > form.fallbackPrice && form.fallbackPrice > 0 && (
                    <div className="sm:col-span-2 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-emerald-400 font-bold">
                        Calculated Discount: {Math.round(((form.fallbackOriginalPrice - form.fallbackPrice) / form.fallbackOriginalPrice) * 100)}% Off (Save {formatINR(form.fallbackOriginalPrice - form.fallbackPrice)})
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Photography & Preset Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Showroom Product Image
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(!showImagePicker)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{showImagePicker ? 'Close Gallery' : 'Pick from Showroom Photos'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={form.image}
                        alt="Preview"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-product.svg'
                        }}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="e.g. /images/products/lg-washer.jpg or https://..."
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Preset Photo Picker Gallery */}
                  {showImagePicker && (
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 max-h-52 overflow-y-auto">
                      <p className="text-[11px] text-slate-400">
                        Click any verified showroom photo to use it for this banner:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {PRESET_SHOWROOM_IMAGES.map((img) => (
                          <button
                            type="button"
                            key={img.url}
                            onClick={() => {
                              setForm({ ...form, image: img.url, imageAlt: img.label })
                              setShowImagePicker(false)
                            }}
                            className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                              form.image === img.url
                                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.label}
                              className="w-10 h-10 object-contain"
                            />
                            <span className="text-[9px] line-clamp-1 leading-tight font-medium">
                              {img.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Spec Pills Management */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Key Spec Highlights (Pills on Banner)
                  </label>
                  
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[36px] p-2 bg-slate-900 border border-slate-800 rounded-xl">
                    {form.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{spec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecTag(i)}
                          className="hover:text-rose-400 p-0.5 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <div className="flex items-center gap-1.5 flex-1 min-w-[150px]">
                      <input
                        type="text"
                        value={newSpecTag}
                        onChange={(e) => setNewSpecTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSpecTag()
                          }
                        }}
                        placeholder="+ Type spec & press Enter..."
                        className="text-xs bg-transparent border-0 text-slate-200 placeholder-slate-500 focus:outline-none w-full"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpecTag}
                        className="text-xs px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Shown as feature chips under the price (e.g. AI Direct Drive, Steam Allergy Care, 5-Star BEE)
                  </p>
                </div>

                {/* Additional Badges & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Brand / Category Tag
                    </label>
                    <input
                      type="text"
                      value={form.brandTag}
                      onChange={(e) => setForm({ ...form, brandTag: e.target.value })}
                      placeholder="e.g. LG Smart Living Appliances"
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Trust Badge Text
                    </label>
                    <input
                      type="text"
                      value={form.badgeText}
                      onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                      placeholder="e.g. 10-Yr Motor Warranty"
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-white">Active on Storefront</p>
                    <p className="text-[10px] text-slate-400">
                      When enabled, this slide is displayed in the homepage carousel
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive !== false}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingSlide(null)}
                    className="text-xs border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="text-xs font-bold gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Slide Changes</span>
                  </Button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Resetting to Defaults */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Restore Showroom Defaults?
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                This will reset your homepage banner to the 4 official flagship showroom models (iPhone 16 Pro, Sony BRAVIA OLED, Galaxy S24 Ultra, and LG AI Washer). Any custom slides will be replaced.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs border-slate-700 bg-slate-900 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleResetToDefaults}
                  className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  Yes, Restore Defaults
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Select Stock for Hero Banner Modal */}
      <AnimatePresence>
        {showStockPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] text-slate-100 my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">
                      Select Stock Model for Hero Banner
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pick any item from your live inventory to showcase on the homepage flagship carousel.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowStockPicker(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Filters */}
              <div className="py-4 space-y-3 shrink-0 border-b border-slate-800/80">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                      placeholder="Search stock by product name, brand, SKU..."
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                    />
                    {stockSearchQuery && (
                      <button
                        onClick={() => setStockSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <Badge variant="outline" className="border-slate-800 text-slate-400 text-xs self-start sm:self-center shrink-0">
                    {filteredStock.length} Products Found
                  </Badge>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {stockCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setStockCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        stockCategoryFilter === cat.id
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product List */}
              <div className="overflow-y-auto flex-1 py-4 pr-1 space-y-3">
                {catalogProducts.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto">
                      <Package className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-white">No products found in inventory</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Your showroom stock is currently empty. Add products with photos in the Product Catalog first to feature them here.
                    </p>
                    <Link to="/admin/products" onClick={() => setShowStockPicker(false)}>
                      <Button size="sm" className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs">
                        Go to Product Catalog & Add Stock →
                      </Button>
                    </Link>
                  </div>
                ) : filteredStock.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No products matched your search or category filter.
                  </div>
                ) : (
                  filteredStock.map((prod) => {
                    const alreadyFeatured = isProductInHero(prod.id)
                    return (
                      <div
                        key={prod.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 ${
                          alreadyFeatured
                            ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-800/60'
                            : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Info */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                            <img
                              src={prod.image || '/images/placeholder-product.svg'}
                              alt={prod.name}
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-product.svg'
                              }}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-white font-['Outfit'] truncate">
                                {prod.name}
                              </span>
                              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-900/50 px-1.5 py-0.5 rounded">
                                {prod.brand}
                              </span>
                              {alreadyFeatured && (
                                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  ★ Active on Hero
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-1">
                              {prod.tagline || prod.description || 'Showroom certified model'}
                            </p>

                            <div className="flex items-center gap-3 text-xs pt-0.5">
                              <span className="font-bold text-white">
                                {formatINR(prod.price)}
                              </span>
                              {prod.originalPrice > prod.price && (
                                <span className="text-slate-500 line-through text-[11px]">
                                  {formatINR(prod.originalPrice)}
                                </span>
                              )}
                              <span className="text-slate-500">•</span>
                              <span className="text-[11px] text-emerald-400 font-medium">
                                Stock: {prod.stockQuantity ?? 1} units
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleCustomizeStockItem(prod)}
                            className="text-xs border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Customize Details</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleFeatureStockItem(prod)}
                            className="text-xs font-bold gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{alreadyFeatured ? 'Re-add to Hero' : 'Feature in Hero'}</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <span>Select any product to instantly create a Hero Showcase Banner.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStockPicker(false)}
                  className="text-xs border-slate-700 text-slate-300"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminLayout>
  )
}
