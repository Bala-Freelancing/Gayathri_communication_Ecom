import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { productService, PriceHistoryRecord } from '@/services/productService'
import { formatINR } from '@/lib/utils'
import { Package, PackageX, AlertTriangle, EyeOff, Plus, Image as ImageIcon, FileSpreadsheet, Loader2 } from 'lucide-react'

type AdminRow = Awaited<ReturnType<typeof productService.fetchAllProductsAdmin>>['data'][number]

const LOW_STOCK = 5

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<AdminRow[]>([])
  const [history, setHistory] = useState<PriceHistoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    Promise.all([productService.fetchAllProductsAdmin(), productService.fetchPriceHistory()]).then(([p, h]) => {
      if (!alive) return
      setProducts(p.data || [])
      setHistory(h.data || [])
      setError(p.error)
      setIsLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => {
    const live = products.filter((p) => p.isActive)
    const outOfStock = live.filter((p) => !p.inStock || p.stockQuantity <= 0)
    const lowStock = live.filter((p) => p.inStock && p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK)
    const hidden = products.filter((p) => !p.isActive)
    return { live, outOfStock, lowStock, hidden }
  }, [products])

  const nameById = useMemo(() => new Map(products.map((p) => [p.id, p.name])), [products])

  const cards = [
    { label: 'Products on website', value: stats.live.length, icon: Package, tone: 'text-slate-900', href: '/admin/products' },
    { label: 'Out of stock', value: stats.outOfStock.length, icon: PackageX, tone: 'text-rose-600', href: '/admin/products?filter=out' },
    { label: `Low stock (${LOW_STOCK} or less)`, value: stats.lowStock.length, icon: AlertTriangle, tone: 'text-amber-600', href: '/admin/products?filter=low' },
    { label: 'Hidden from website', value: stats.hidden.length, icon: EyeOff, tone: 'text-slate-500', href: '/admin/products?filter=hidden' },
  ]

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Your showroom at a glance."
      actions={
        <Link
          to="/admin/products?add=1"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add product
        </Link>
      }
    >
      {error && (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Could not load products: {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone, href }) => (
          <Link
            key={label}
            to={href}
            className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium text-slate-500">{label}</span>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className={`mt-2 font-['Outfit'] text-3xl font-bold tabular-nums ${tone}`}>
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-300" /> : value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Needs attention */}
        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold">Needs attention</h2>
            <Link to="/admin/products?filter=out" className="text-xs font-medium text-slate-500 hover:text-slate-900">
              See all
            </Link>
          </header>
          {isLoading ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">Loading…</p>
          ) : stats.outOfStock.length + stats.lowStock.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">All products are in stock.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...stats.outOfStock, ...stats.lowStock].slice(0, 8).map((p) => {
                const out = !p.inStock || p.stockQuantity <= 0
                return (
                  <li key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                    <img src={p.image} alt="" className="h-9 w-9 shrink-0 rounded-md bg-slate-50 object-contain" />
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        out ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {out ? 'Out of stock' : `${p.stockQuantity} left`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-xl border border-slate-200 bg-white">
          <header className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold">Quick actions</h2>
          </header>
          <div className="flex flex-col p-2">
            {[
              { to: '/admin/products?add=1', icon: Plus, label: 'Add a new product' },
              { to: '/admin/products', icon: Package, label: 'Update prices or stock' },
              { to: '/admin/banners', icon: ImageIcon, label: 'Change homepage banners' },
              { to: '/admin/import', icon: FileSpreadsheet, label: 'Import stock from Excel' },
            ].map(({ to, icon: Icon, label }) => (
              <Link key={label} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Recent price changes */}
      {history.length > 0 && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white">
          <header className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold">Recent price changes</h2>
          </header>
          <ul className="divide-y divide-slate-100">
            {history.slice(0, 6).map((h) => (
              <li key={h.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate">{nameById.get(h.productId) || h.productId}</span>
                <span className="text-slate-400 line-through tabular-nums">{formatINR(h.oldSellingPrice)}</span>
                <span className="font-semibold tabular-nums">{formatINR(h.newSellingPrice)}</span>
                <span className="w-full text-xs text-slate-400 sm:w-auto">
                  {new Date(h.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AdminLayout>
  )
}
