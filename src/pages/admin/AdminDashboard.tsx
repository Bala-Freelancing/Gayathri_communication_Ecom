import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { productService, PriceHistoryRecord } from '@/services/productService'
import { formatINR } from '@/lib/utils'
import { 
  Tag, 
  Package, 
  Boxes, 
  TrendingUp, 
  ArrowRight, 
  History, 
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const [history, setHistory] = useState<PriceHistoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const [prodRes, histRes] = await Promise.all([
        productService.fetchAllProductsAdmin(),
        productService.fetchPriceHistory(),
      ])
      setProducts(prodRes.data)
      setHistory(histRes.data.slice(0, 5))
      setIsLoading(false)
    }
    loadData()
  }, [])

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.isActive).length
  const outOfStock = products.filter((p) => !p.inStock || p.stockQuantity === 0).length
  const lowStock = products.filter((p) => p.inStock && p.stockQuantity > 0 && p.stockQuantity <= 5).length

  return (
    <AdminLayout
      title="Showroom Overview"
      subtitle="Welcome back to Gayathri Communication Store Management."
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/banners">
            <Button size="sm" variant="outline" className="gap-2 text-xs font-bold border-cyan-500/40 text-cyan-400 bg-slate-900 hover:bg-slate-800">
              <Sparkles className="w-3.5 h-3.5" />
              Hero Banners
            </Button>
          </Link>
          <Link to="/admin/prices">
            <Button size="sm" className="gap-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950">
              <Tag className="w-3.5 h-3.5" />
              Manage Prices
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Active Catalog</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white font-['Outfit']">
                {activeProducts}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Out of {totalProducts} total certified models
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Price Updates</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white font-['Outfit']">
                {history.length}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Recorded in audit history
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Low Stock Units</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white font-['Outfit']">
                {lowStock}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                5 or fewer showroom units
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Out of Stock</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white font-['Outfit']">
                {outOfStock}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Unavailable for online booking
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/prices"
            className="group p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-cyan-950/30 hover:border-cyan-500/60 transition-all shadow-xl flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md">
                  Core Management Task
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors">
                Price Management Center
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Edit MRP and selling prices inline across any device with immediate storefront sync and audit history.
              </p>
            </div>
            <div className="pt-3 text-xs font-semibold text-cyan-400 flex items-center gap-1">
              Launch Price Editor
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="group p-6 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-md">
                  Catalog
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Product Catalog & Specs
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Review device specifications, brand authorizations, active statuses, and showroom details.
              </p>
            </div>
            <div className="pt-3 text-xs font-semibold text-slate-300 flex items-center gap-1">
              View Product List
            </div>
          </Link>
        </div>

        {/* Recent Price Updates Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Recent Price Revisions
              </h3>
            </div>
            <Link to="/admin/prices" className="text-xs text-cyan-400 hover:underline">
              View All in Price Manager →
            </Link>
          </div>

          {isLoading ? (
            <p className="text-xs text-slate-500 py-6 text-center">Loading audit history...</p>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No recent price modifications recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 text-xs">
              {history.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-white font-mono">{item.productId}</span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      {new Date(item.changedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 line-through">{formatINR(item.oldSellingPrice)}</span>
                    <span className="font-bold text-cyan-400">{formatINR(item.newSellingPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}
