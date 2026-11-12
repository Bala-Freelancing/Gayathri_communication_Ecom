import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StorefrontPage } from '@/pages/StorefrontPage'

// Everything below the homepage is loaded on demand, so customers never
// download the admin panel (or its Excel parser) just to browse the shop.
const named = <T extends string>(loader: () => Promise<Record<T, React.ComponentType<any>>>, name: T) =>
  lazy(() => loader().then((m) => ({ default: m[name] })))

const CategoryPage = named(() => import('@/pages/CategoryPage'), 'CategoryPage')
const ProductPage = named(() => import('@/pages/ProductPage'), 'ProductPage')
const AdminLogin = named(() => import('@/pages/admin/AdminLogin'), 'AdminLogin')
const AdminDashboard = named(() => import('@/pages/admin/AdminDashboard'), 'AdminDashboard')
const AdminProducts = named(() => import('@/pages/admin/AdminProducts'), 'AdminProducts')
const AdminStockImport = named(() => import('@/pages/admin/AdminStockImport'), 'AdminStockImport')
const AdminHeroBanners = named(() => import('@/pages/admin/AdminHeroBanners'), 'AdminHeroBanners')
const ProtectedRoute = named(() => import('@/components/admin/ProtectedRoute'), 'ProtectedRoute')

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#fafaf9]" aria-busy="true">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 motion-reduce:animate-none" />
  </div>
)

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Customer Storefront (Home) */}
        <Route path="/" element={<StorefrontPage />} />

        {/* Dedicated Category & Product Catalogue Pages */}
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/products" element={<CategoryPage />} />

        {/* Shareable product pages */}
        <Route path="/product/:productId" element={<ProductPage />} />

        {/* Administrator Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Administrator Suite */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <ProtectedRoute>
              <AdminHeroBanners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hero-banners"
          element={
            <ProtectedRoute>
              <AdminHeroBanners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banner"
          element={
            <ProtectedRoute>
              <AdminHeroBanners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/import"
          element={
            <ProtectedRoute>
              <AdminStockImport />
            </ProtectedRoute>
          }
        />

        {/* Old admin pages merged into Products / removed */}
        <Route path="/admin/prices" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/inventory" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/settings" element={<Navigate to="/admin" replace />} />

        {/* Catch-all redirect to storefront */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
