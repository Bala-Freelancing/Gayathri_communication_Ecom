import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AddStockModal } from '@/components/admin/AddStockModal'
import { productService } from '@/services/productService'
import { useHeroBanners } from '@/hooks/useHeroBanners'
import { HeroSlideConfig } from '@/types/heroBanner'
import { formatINR } from '@/lib/utils'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  Minus,
} from 'lucide-react'

type AdminRow = Awaited<ReturnType<typeof productService.fetchAllProductsAdmin>>['data'][number]
type Filter = 'all' | 'out' | 'low' | 'hidden'

const LOW_STOCK = 5
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'out', label: 'Out of stock' },
  { id: 'low', label: 'Low stock' },
  { id: 'hidden', label: 'Hidden' },
]

const CATEGORY_LABELS: Record<string, string> = {
  smartphones: 'Smartphones',
  'smart-tvs': 'Smart TVs',
  'home-appliances': 'Home Appliances',
  accessories: 'Accessories',
  'other-electronics': 'Other Electronics',
}

const isOut = (p: AdminRow) => !p.inStock || p.stockQuantity <= 0
const hasVariants = (p: AdminRow) => Array.isArray(p.variants) && p.variants.length > 0

type Toast = { text: string; type: 'success' | 'error' } | null

// ------------------------------------------------------------------------------
// Inline price editor
// ------------------------------------------------------------------------------
const PriceCell: React.FC<{ product: AdminRow; onSaved: (price: number, mrp: number) => void; onError: (m: string) => void }> = ({
  product,
  onSaved,
  onError,
}) => {
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(String(product.price))
  const [mrp, setMrp] = useState(String(product.originalPrice))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing) {
      setPrice(String(product.price))
      setMrp(String(product.originalPrice))
    }
  }, [product.price, product.originalPrice, editing])

  if (hasVariants(product)) {
    return (
      <div>
        <p className="font-semibold tabular-nums">from {formatINR(product.price)}</p>
        <p className="text-xs text-slate-400">{product.variants!.length} variants · edit to change</p>
      </div>
    )
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="group -mx-2 rounded-md px-2 py-1 text-left hover:bg-slate-100 cursor-pointer"
        title="Change price"
      >
        <p className="font-semibold tabular-nums">{formatINR(product.price)}</p>
        {product.originalPrice > product.price && (
          <p className="text-xs text-slate-400 tabular-nums">
            MRP <span className="line-through">{formatINR(product.originalPrice)}</span>
          </p>
        )}
      </button>
    )
  }

  const save = async () => {
    const p = Number(price)
    const m = Number(mrp) || p
    if (!p || p <= 0) return onError('Enter a valid price.')
    if (p > m) return onError('Price cannot be more than MRP.')
    setSaving(true)
    const res = await productService.updateProductPrice(product.id, m, p, 'Price changed in admin')
    setSaving(false)
    if (!res.success) return onError(res.error || 'Price not saved.')
    setEditing(false)
    onSaved(p, m)
  }

  return (
    <div className="flex flex-col gap-1.5 w-36">
      <label className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="w-8">Price</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="h-8 w-full rounded-md border border-slate-300 px-2 text-sm text-slate-900 tabular-nums"
          autoFocus
        />
      </label>
      <label className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="w-8">MRP</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="h-8 w-full rounded-md border border-slate-300 px-2 text-sm text-slate-900 tabular-nums"
        />
      </label>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-md bg-slate-900 text-xs font-semibold text-white disabled:opacity-60 cursor-pointer"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="inline-flex h-7 items-center justify-center rounded-md border border-slate-300 px-2 text-xs text-slate-600 cursor-pointer"
          aria-label="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------------------
// Inline stock editor
// ------------------------------------------------------------------------------
// In stock / Out of stock switch (works for products with and without variants)
const StockSwitch: React.FC<{ product: AdminRow; onChanged: (inStock: boolean, qty: number) => void; onError: (m: string) => void }> = ({
  product,
  onChanged,
  onError,
}) => {
  const [saving, setSaving] = useState(false)
  const inStock = !isOut(product)

  const toggle = async () => {
    const next = !inStock
    // Turning back on restores the last known quantity, or 10 if there was none.
    const qty = next ? (product.stockQuantity > 0 ? product.stockQuantity : 10) : 0
    setSaving(true)
    const res = await productService.toggleProductStock(product.id, next, qty)
    setSaving(false)
    if (!res.success) return onError(res.error || 'Stock status not saved.')
    onChanged(next, qty)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={inStock}
      onClick={toggle}
      disabled={saving}
      title={inStock ? 'Tap to mark out of stock' : 'Tap to mark in stock'}
      aria-label={`${product.name}: ${inStock ? 'in stock' : 'out of stock'}. Tap to change.`}
      className={`inline-flex h-8 w-fit items-center gap-2 rounded-full pl-1 pr-3 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
        inStock ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100'
      }`}
    >
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${inStock ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        <span
          className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
            inStock ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        >
          {saving && <Loader2 className="h-3 w-3 animate-spin text-slate-500" />}
        </span>
      </span>
      {inStock ? 'In stock' : 'Out of stock'}
    </button>
  )
}

// ------------------------------------------------------------------------------
// Inline stock editor
// ------------------------------------------------------------------------------
const StockCell: React.FC<{
  product: AdminRow
  onSaved: (qty: number) => void
  onVariantsChanged: () => void
  onError: (m: string) => void
}> = ({ product, onSaved, onVariantsChanged, onError }) => {
  const [qty, setQty] = useState(product.stockQuantity)
  const [saving, setSaving] = useState(false)
  const dirty = qty !== product.stockQuantity

  useEffect(() => setQty(product.stockQuantity), [product.stockQuantity])

  if (hasVariants(product)) {
    return (
      <div className="flex flex-col gap-1.5">
        <StockSwitch product={product} onChanged={() => onVariantsChanged()} onError={onError} />
        <p className="text-xs text-slate-400">
          {isOut(product) ? 'All variants off' : `${product.stockQuantity} units across ${product.variants!.length} variants`} · edit to change per variant
        </p>
      </div>
    )
  }

  const save = async (value: number) => {
    setSaving(true)
    const res = await productService.updateProductStock(product.id, value)
    setSaving(false)
    if (!res.success) {
      setQty(product.stockQuantity)
      return onError(res.error || 'Stock not saved.')
    }
    onSaved(value)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <StockSwitch product={product} onChanged={(_, q) => onSaved(q)} onError={onError} />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(0, q - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Decrease stock"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={qty}
          onChange={(e) => setQty(Math.max(0, parseInt(e.target.value, 10) || 0))}
          onKeyDown={(e) => e.key === 'Enter' && dirty && save(qty)}
          className="h-8 w-14 rounded-md border border-slate-300 text-center text-sm tabular-nums"
          aria-label={`Stock quantity for ${product.name}`}
        />
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Increase stock"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <span className="ml-1 text-xs text-slate-400">units</span>
      </div>
      {dirty && (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => save(qty)}
            disabled={saving}
            className="inline-flex h-7 items-center gap-1 rounded-md bg-slate-900 px-2.5 text-xs font-semibold text-white disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
          </button>
          <button
            type="button"
            onClick={() => setQty(product.stockQuantity)}
            className="h-7 rounded-md px-2 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------------------
// Edit product modal
// ------------------------------------------------------------------------------
type VariantDraft = { id: string; name: string; price: string; originalPrice: string; stockQuantity: string; sku: string }

const EditProductModal: React.FC<{
  product: AdminRow
  onClose: () => void
  onSaved: () => void
  onError: (m: string) => void
}> = ({ product, onClose, onSaved, onError }) => {
  const [form, setForm] = useState({
    name: product.name,
    brand: product.brand,
    tagline: product.tagline || '',
    warranty: product.warranty || '',
    price: String(product.price),
    mrp: String(product.originalPrice),
    stock: String(product.stockQuantity),
  })
  const [variants, setVariants] = useState<VariantDraft[]>(
    (product.variants || []).map((v: any, i: number) => ({
      id: v.id || `var-${i}`,
      name: v.name || '',
      price: v.price != null ? String(v.price) : '',
      originalPrice: v.originalPrice != null ? String(v.originalPrice) : '',
      stockQuantity: v.stockQuantity != null ? String(v.stockQuantity) : '0',
      sku: v.sku || '',
    }))
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setVar = (id: string, k: keyof VariantDraft, v: string) =>
    setVariants((vs) => vs.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const save = async () => {
    if (!form.name.trim()) return onError('Product name is required.')

    const cleanVariants = variants
      .filter((v) => v.name.trim())
      .map((v, i) => {
        const price = Number(v.price) || 0
        const mrp = Math.max(Number(v.originalPrice) || price, price)
        const stock = Math.max(0, parseInt(v.stockQuantity, 10) || 0)
        return {
          id: v.id,
          sku: v.sku || `${product.sku}-V${i + 1}`,
          name: v.name.trim(),
          price,
          originalPrice: mrp,
          stockQuantity: stock,
          inStock: stock > 0,
          attributes: { storage: v.name.trim() },
        }
      })
    if (cleanVariants.some((v) => v.price <= 0)) return onError('Every variant needs a price.')

    const price = Number(form.price)
    const mrp = Number(form.mrp) || price
    const stock = Math.max(0, parseInt(form.stock, 10) || 0)
    if (cleanVariants.length === 0) {
      if (!price || price <= 0) return onError('Enter a valid price.')
      if (price > mrp) return onError('Price cannot be more than MRP.')
    }

    setSaving(true)
    const res = await productService.updateProductDetails(product.id, {
      name: form.name.trim(),
      brand: form.brand.trim(),
      tagline: form.tagline.trim(),
      warranty: form.warranty.trim(),
      variants: cleanVariants,
      ...(cleanVariants.length === 0 && {
        sellingPrice: price,
        originalPrice: mrp,
        stockQuantity: stock,
        inStock: stock > 0,
      }),
    })
    setSaving(false)
    if (!res.success) return onError(res.error || 'Changes not saved.')
    onSaved()
  }

  const field = 'h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <button type="button" className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-label="Close" />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="edit-title" className="font-semibold">Edit product</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 cursor-pointer" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <img src={product.image} alt="" className="h-14 w-14 rounded-lg bg-slate-50 object-contain" />
            <p className="text-xs text-slate-500">SKU {product.sku}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 sm:col-span-2">
              <span className="text-xs font-medium text-slate-600">Name</span>
              <input className={field} value={form.name} onChange={set('name')} />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-slate-600">Brand</span>
              <input className={field} value={form.brand} onChange={set('brand')} />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-slate-600">Warranty</span>
              <input className={field} value={form.warranty} onChange={set('warranty')} placeholder="1 Year Brand Warranty" />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-xs font-medium text-slate-600">Short description</span>
              <input className={field} value={form.tagline} onChange={set('tagline')} />
            </label>
          </div>

          {variants.length === 0 && (
            <div className="grid grid-cols-3 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-600">Price (₹)</span>
                <input className={field} type="number" inputMode="numeric" value={form.price} onChange={set('price')} />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-600">MRP (₹)</span>
                <input className={field} type="number" inputMode="numeric" value={form.mrp} onChange={set('mrp')} />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-600">Stock</span>
                <input className={field} type="number" inputMode="numeric" value={form.stock} onChange={set('stock')} />
              </label>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Variants (e.g. 8GB + 128GB)</span>
              <button
                type="button"
                onClick={() =>
                  setVariants((vs) => [
                    ...vs,
                    { id: `var-${Date.now()}`, name: '', price: form.price, originalPrice: form.mrp, stockQuantity: '0', sku: '' },
                  ])
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add variant
              </button>
            </div>
            {variants.length === 0 && <p className="text-xs text-slate-400">No variants. The price and stock above are used.</p>}
            {variants.map((v) => (
              <div key={v.id} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-slate-200 p-2 sm:grid-cols-[2fr_1fr_1fr_80px_auto] sm:items-center">
                <input className={`${field} h-9 col-span-2 sm:col-span-1`} placeholder="Variant name" value={v.name} onChange={(e) => setVar(v.id, 'name', e.target.value)} aria-label="Variant name" />
                <input className={`${field} h-9`} type="number" inputMode="numeric" placeholder="Price" value={v.price} onChange={(e) => setVar(v.id, 'price', e.target.value)} aria-label="Variant price" />
                <input className={`${field} h-9`} type="number" inputMode="numeric" placeholder="MRP" value={v.originalPrice} onChange={(e) => setVar(v.id, 'originalPrice', e.target.value)} aria-label="Variant MRP" />
                <input className={`${field} h-9`} type="number" inputMode="numeric" placeholder="Stock" value={v.stockQuantity} onChange={(e) => setVar(v.id, 'stockQuantity', e.target.value)} aria-label="Variant stock" />
                <button
                  type="button"
                  onClick={() => setVariants((vs) => vs.filter((x) => x.id !== v.id))}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  aria-label="Remove variant"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </footer>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------------------
// Page
// ------------------------------------------------------------------------------
export const AdminProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = (FILTERS.some((f) => f.id === searchParams.get('filter')) ? searchParams.get('filter') : 'all') as Filter
  const showAdd = searchParams.get('add') === '1'

  const [products, setProducts] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [brand, setBrand] = useState('all')
  const [editing, setEditing] = useState<AdminRow | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  const { slides, saveSlide } = useHeroBanners(true)

  const notify = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type })
    window.setTimeout(() => setToast(null), type === 'error' ? 6000 : 3000)
  }, [])

  const reload = useCallback(async () => {
    const res = await productService.fetchAllProductsAdmin()
    setProducts(res.data || [])
    setLoadError(res.error)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value === null) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const patchRow = (id: string, patch: Partial<AdminRow>) =>
    setProducts((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products])
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(), [products])

  const counts = useMemo(
    () => ({
      all: products.length,
      out: products.filter((p) => p.isActive && isOut(p)).length,
      low: products.filter((p) => p.isActive && !isOut(p) && p.stockQuantity <= LOW_STOCK).length,
      hidden: products.filter((p) => !p.isActive).length,
    }),
    [products]
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (q && !`${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(q)) return false
      if (category !== 'all' && p.category !== category) return false
      if (brand !== 'all' && p.brand !== brand) return false
      if (filter === 'out') return p.isActive && isOut(p)
      if (filter === 'low') return p.isActive && !isOut(p) && p.stockQuantity <= LOW_STOCK
      if (filter === 'hidden') return !p.isActive
      return true
    })
  }, [products, query, category, brand, filter])

  const toggleVisible = async (p: AdminRow) => {
    setBusyId(p.id)
    const res = await productService.toggleProductActive(p.id, !p.isActive)
    setBusyId(null)
    if (!res.success) return notify(res.error || 'Not saved.', 'error')
    patchRow(p.id, { isActive: !p.isActive })
    notify(p.isActive ? `"${p.name}" is now hidden from the website` : `"${p.name}" is now visible on the website`)
  }

  const remove = async (p: AdminRow) => {
    if (!window.confirm(`Delete "${p.name}"?\n\nThis removes it permanently. To remove it from the website temporarily, use Hide instead.`)) return
    setBusyId(p.id)
    const res = await productService.deleteProduct(p.id)
    setBusyId(null)
    if (!res.success) return notify(res.error || 'Not deleted.', 'error')
    setProducts((rows) => rows.filter((r) => r.id !== p.id))
    notify(`"${p.name}" deleted`)
  }

  const inBanners = (id: string) => slides.some((s) => s.productId === id)

  const addToBanners = async (p: AdminRow) => {
    const specs = (p.specs || []).slice(0, 3).map((s) => s.value).filter(Boolean)
    const slide: HeroSlideConfig = {
      id: `slide-${p.id}`,
      productId: p.id,
      matchKeywords: [],
      brandTag: `${p.brand} · Authorised retailer`,
      badgeText: p.originalPrice > p.price ? 'Showroom offer' : '',
      kicker: '',
      modelName: p.name,
      headline: p.tagline || '',
      shortLabel: p.name.split(' ').slice(0, 3).join(' '),
      description: p.description || p.tagline || '',
      specs,
      image: p.image,
      imageAlt: p.name,
      fallbackPrice: p.price,
      fallbackOriginalPrice: p.originalPrice,
      primaryCtaText: 'WhatsApp',
      secondaryCtaText: 'View',
      isActive: true,
      orderIndex: slides.length,
    }
    setBusyId(p.id)
    const ok = await saveSlide(slide)
    setBusyId(null)
    if (ok) notify(`"${p.name}" added to homepage banners`)
    else notify('Banner not saved. Check you are logged in as admin.', 'error')
  }

  const actions = (p: AdminRow) => (
    <div className="flex items-center justify-end gap-0.5">
      {busyId === p.id && <Loader2 className="mr-1 h-4 w-4 animate-spin text-slate-400" />}
      <button type="button" onClick={() => setEditing(p)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer" title="Edit" aria-label={`Edit ${p.name}`}>
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => toggleVisible(p)}
        disabled={busyId === p.id}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
        title={p.isActive ? 'Hide from website' : 'Show on website'}
        aria-label={p.isActive ? `Hide ${p.name} from website` : `Show ${p.name} on website`}
      >
        {p.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-rose-500" />}
      </button>
      <button
        type="button"
        onClick={() => addToBanners(p)}
        disabled={busyId === p.id || inBanners(p.id)}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:text-emerald-600 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default"
        title={inBanners(p.id) ? 'Already in homepage banners' : 'Add to homepage banners'}
        aria-label={inBanners(p.id) ? `${p.name} is in homepage banners` : `Add ${p.name} to homepage banners`}
      >
        <ImageIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => remove(p)}
        disabled={busyId === p.id}
        className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
        title="Delete"
        aria-label={`Delete ${p.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )

  const productInfo = (p: AdminRow) => (
    <div className="flex min-w-0 items-center gap-3">
      <img src={p.image} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-lg bg-slate-50 object-contain" />
      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${p.isActive ? '' : 'text-slate-400'}`}>{p.name}</p>
        <p className="truncate text-xs text-slate-500">
          {p.brand} · {CATEGORY_LABELS[p.category] || p.category}
          {!p.isActive && <span className="ml-1.5 font-medium text-rose-500">· Hidden</span>}
        </p>
      </div>
    </div>
  )

  const select = 'h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700'

  return (
    <AdminLayout
      title="Products"
      subtitle="Change prices and stock, hide or delete products."
      actions={
        <button
          type="button"
          onClick={() => setParam('add', '1')}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add product
        </button>
      }
    >
      {/* Filters */}
      <div className="mb-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="Filter products">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setParam('filter', f.id === 'all' ? null : f.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer ${
              filter === f.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white'
            }`}
          >
            {f.label} <span className={filter === f.id ? 'text-slate-300' : 'text-slate-400'}>{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand or SKU"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm"
            aria-label="Search products"
          />
        </label>
        <div className="grid grid-cols-2 gap-2 sm:contents">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={select} aria-label="Category">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] || c}
              </option>
            ))}
          </select>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className={select} aria-label="Brand">
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadError && (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Could not load products: {loadError}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
          No products match.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Product</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  <th className="px-4 py-2.5 font-medium">Stock</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((p) => (
                  <tr key={p.id} className="align-top">
                    <td className="max-w-xs px-4 py-3">{productInfo(p)}</td>
                    <td className="px-4 py-3">
                      <PriceCell
                        product={p}
                        onSaved={(price, mrp) => {
                          patchRow(p.id, { price, originalPrice: mrp })
                          notify(`Price updated for "${p.name}"`)
                        }}
                        onError={(m) => notify(m, 'error')}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StockCell
                        product={p}
                        onVariantsChanged={() => {
                          notify(isOut(p) ? `"${p.name}" marked in stock` : `"${p.name}" marked out of stock`)
                          reload()
                        }}
                        onSaved={(qty) => {
                          patchRow(p.id, { stockQuantity: qty, inStock: qty > 0 })
                          notify(qty > 0 ? `Stock for "${p.name}" set to ${qty}` : `"${p.name}" marked out of stock`)
                        }}
                        onError={(m) => notify(m, 'error')}
                      />
                    </td>
                    <td className="px-4 py-2">{actions(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {visible.map((p) => (
              <li key={p.id} className="rounded-xl border border-slate-200 bg-white p-3">
                {productInfo(p)}
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                  <PriceCell
                    product={p}
                    onSaved={(price, mrp) => {
                      patchRow(p.id, { price, originalPrice: mrp })
                      notify(`Price updated for "${p.name}"`)
                    }}
                    onError={(m) => notify(m, 'error')}
                  />
                  <StockCell
                    product={p}
                    onVariantsChanged={() => {
                      notify(isOut(p) ? `"${p.name}" marked in stock` : `"${p.name}" marked out of stock`)
                      reload()
                    }}
                    onSaved={(qty) => {
                      patchRow(p.id, { stockQuantity: qty, inStock: qty > 0 })
                      notify(qty > 0 ? `Stock for "${p.name}" set to ${qty}` : `"${p.name}" marked out of stock`)
                    }}
                    onError={(m) => notify(m, 'error')}
                  />
                </div>
                <div className="mt-2 border-t border-slate-100 pt-1">{actions(p)}</div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            Showing {visible.length} of {products.length} products
          </p>
        </>
      )}

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onError={(m) => notify(m, 'error')}
          onSaved={() => {
            setEditing(null)
            notify('Product saved')
            reload()
          }}
        />
      )}

      <AddStockModal
        isOpen={showAdd}
        onClose={() => setParam('add', null)}
        onSuccess={(product) => {
          setParam('add', null)
          notify(`"${product.name}" added`)
          reload()
        }}
      />

      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
          }`}
        >
          {toast.text}
        </div>
      )}
    </AdminLayout>
  )
}
