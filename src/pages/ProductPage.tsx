import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  Home,
  ShoppingBag,
  MessageCircle,
  Check,
  ShieldCheck,
  AlertTriangle,
  Share2,
  Gauge,
  MapPin,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { QuickViewModal } from '@/components/modals/QuickViewModal'
import { AboutModal } from '@/components/modals/AboutModal'
import { StoresModal } from '@/components/modals/StoresModal'
import { ContactModal } from '@/components/modals/ContactModal'
import { ProductCard } from '@/components/products/ProductCard'
import { CibilFloatingButton, BAJAJ_STORE_QR_URL } from '@/components/layout/CibilFloatingButton'
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'
import { storeDetails } from '@/data/mockProducts'
import { CATEGORY_NAMES, EMI_DISCLAIMER, emiPerMonth, getConcreteVariants, productPath } from '@/lib/productHelpers'

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

export const ProductPage: React.FC = () => {
  const { productId = '' } = useParams()
  const { products, isLoading } = useRealtimeProducts()
  const { addToCart, generateProductInquiryUrl } = useCartStore()

  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isStoresOpen, setIsStoresOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [variantIndex, setVariantIndex] = useState(0)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [copied, setCopied] = useState(false)

  const product = useMemo(() => products.find((p) => p.id === decodeURIComponent(productId)), [products, productId])
  const variants = useMemo(() => (product ? getConcreteVariants(product) : []), [product])

  useEffect(() => {
    setVariantIndex(0)
    setActiveImage(null)
    window.scrollTo({ top: 0 })
  }, [productId])

  // Page title + description for Google and the browser tab.
  useEffect(() => {
    if (!product) return
    const title = `${product.name} – Price in Trichy | ${storeDetails.name}`
    const desc = `${product.name} at ${formatINR(product.price)}. Genuine box-pack with official warranty. Buy at ${storeDetails.name}, Manachanallur, Trichy.`
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:image', new URL(product.image, window.location.origin).href, 'property')
    setMeta('og:url', window.location.href, 'property')
  }, [product])

  const related = useMemo(
    () => (product ? products.filter((p) => p.id !== product.id && p.category === product.category && p.inStock).slice(0, 4) : []),
    [products, product]
  )

  const layout = (children: React.ReactNode) => (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900 flex flex-col font-['Inter'] overflow-x-clip">
      <Navbar onOpenAbout={() => setIsAboutOpen(true)} onOpenStores={() => setIsStoresOpen(true)} onOpenContact={() => setIsContactOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <QuickViewModal />
      <CartDrawer />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <StoresModal isOpen={isStoresOpen} onClose={() => setIsStoresOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <CibilFloatingButton />
    </div>
  )

  if (!product) {
    return layout(
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 animate-pulse motion-reduce:animate-none" aria-busy="true">
            <div className="aspect-square rounded-3xl bg-neutral-100" />
            <div className="space-y-4">
              <div className="h-4 w-1/4 rounded bg-neutral-100" />
              <div className="h-10 w-3/4 rounded bg-neutral-100" />
              <div className="h-8 w-1/3 rounded bg-neutral-100" />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md text-center">
            <h1 className="font-['Outfit'] text-2xl font-bold">This product is no longer listed</h1>
            <p className="mt-2 text-sm text-neutral-600">It may be sold out or renamed. Ask us on WhatsApp and we will check the showroom.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/products" className="inline-flex h-11 items-center rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white">
                Browse products
              </Link>
              <a
                href={`https://wa.me/${storeDetails.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-neutral-950"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    )
  }

  const variant = variants[variantIndex] ?? null
  const price = variant ? variant.price : product.price
  const mrp = variant ? variant.originalPrice : product.originalPrice
  const isOut = !product.inStock || product.stockQuantity === 0 || (variant ? !variant.inStock : false)
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
  const emi = emiPerMonth(price)
  const gallery = Array.from(new Set([product.image, ...(product.gallery || [])].filter(Boolean)))
  const image = activeImage || product.image
  const categoryName = CATEGORY_NAMES[product.category] || 'Products'

  const handleAdd = () => {
    if (isOut) return
    addToCart(product, variant?.name, 1, price, mrp)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  const handleShare = async () => {
    const url = window.location.origin + productPath(product)
    const text = `${product.name} – ${formatINR(price)} at ${storeDetails.name}`
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url })
        return
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener')
    }
  }

  return layout(
    <>
      <div className="mx-auto max-w-7xl px-4 pt-5 pb-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <Link to="/" className="flex items-center gap-1 hover:text-neutral-900">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/category/${product.category}`} className="hover:text-neutral-900">
            {categoryName}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate font-medium text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-white to-neutral-100 p-6">
              {isOut ? (
                <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">Out of stock</span>
              ) : discount > 0 ? (
                <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">{discount}% off</span>
              ) : null}
              <img
                src={image}
                alt={product.name}
                className={`h-full w-full object-contain mix-blend-multiply ${isOut ? 'opacity-70 grayscale-[30%]' : ''}`}
                onError={(e) => {
                  if (!e.currentTarget.src.endsWith('/images/placeholder-product.svg')) e.currentTarget.src = '/images/placeholder-product.svg'
                }}
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {gallery.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setActiveImage(g)}
                    className={`h-16 w-16 shrink-0 rounded-xl bg-white p-1.5 ring-2 cursor-pointer ${image === g ? 'ring-neutral-900' : 'ring-transparent hover:ring-neutral-300'}`}
                    aria-label="Show image"
                  >
                    <img src={g} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">{product.brand} · {categoryName}</p>
              <h1 className="mt-1.5 font-['Outfit'] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
              {product.tagline && product.tagline !== product.name && <p className="mt-2 text-neutral-600">{product.tagline}</p>}
            </div>

            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-['Outfit'] text-4xl font-extrabold tabular-nums">{formatINR(price)}</span>
                {mrp > price && <span className="text-neutral-400 line-through tabular-nums">MRP {formatINR(mrp)}</span>}
                {discount > 0 && !isOut && <span className="text-sm font-semibold text-emerald-700">Save {formatINR(mrp - price)}</span>}
              </div>
              <p className="mt-1 text-xs text-neutral-500">Inclusive of all taxes · GST invoice provided</p>
              {emi > 0 && (
                <a
                  href={BAJAJ_STORE_QR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 hover:border-emerald-300"
                >
                  <Gauge className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span className="flex-1 text-sm">
                    <span className="font-semibold text-emerald-900">EMI from {formatINR(emi)}/month*</span>
                    <span className="block text-xs text-emerald-800/80">Check your CIBIL score &amp; eligibility with Bajaj Finserv</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                </a>
              )}
            </div>

            {variants.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">Choose variant</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Variant">
                  {variants.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={i === variantIndex}
                      onClick={() => setVariantIndex(i)}
                      className={`rounded-xl border px-3.5 py-2 text-left text-sm cursor-pointer ${
                        i === variantIndex ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white hover:border-neutral-500'
                      } ${v.inStock ? '' : 'opacity-60'}`}
                    >
                      <span className="block font-medium">{v.name}</span>
                      <span className={`block text-xs ${i === variantIndex ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {formatINR(v.price)}
                        {!v.inStock && ' · Out of stock'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <button
                type="button"
                onClick={handleAdd}
                disabled={isOut}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 ${
                  added ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {isOut ? 'Out of stock' : added ? 'Added' : 'Add to cart'}
              </button>
              <a
                href={generateProductInquiryUrl(product, variant?.name, price)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-semibold text-neutral-950 hover:bg-[#1fb857]"
              >
                <MessageCircle className="h-4 w-4" />
                {isOut ? 'Ask for restock' : 'WhatsApp'}
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer sm:col-span-1"
              >
                <Share2 className="h-4 w-4" />
                {copied ? 'Link copied' : 'Share'}
              </button>
            </div>

            <ul className="grid gap-2 rounded-2xl bg-white p-4 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> {product.warranty || 'Official brand warranty'}
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" /> Genuine sealed box with GST invoice
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" /> Pickup at {storeDetails.address.split(',').slice(-2).join(',').trim()} · {storeDetails.timing}
              </li>
              {isOut && (
                <li className="flex items-center gap-2 text-rose-700">
                  <AlertTriangle className="h-4 w-4" /> Currently out of stock. WhatsApp us to reserve the next unit.
                </li>
              )}
            </ul>

            {(product.highlights?.length > 0 || product.specs?.length > 0) && (
              <div className="rounded-2xl bg-white p-4">
                <h2 className="mb-3 text-sm font-semibold">Key specifications</h2>
                <dl className="divide-y divide-neutral-100 text-sm">
                  {(product.specs?.length ? product.specs : product.highlights.map((h) => ({ label: '', value: h }))).slice(0, 12).map((s, i) => (
                    <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-2">
                      <dt className="text-neutral-500">{s.label || '•'}</dt>
                      <dd className="text-neutral-900">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.description && <p className="text-sm leading-relaxed text-neutral-600">{product.description}</p>}
            {emi > 0 && <p className="text-[11px] text-neutral-400">*{EMI_DISCLAIMER}</p>}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h2 className="mb-4 font-['Outfit'] text-xl font-bold">More {categoryName.toLowerCase()}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
