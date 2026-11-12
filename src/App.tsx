import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StorefrontPage } from '@/pages/StorefrontPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminProducts } from '@/pages/admin/AdminProducts'
import { AdminStockImport } from '@/pages/admin/AdminStockImport'
import { AdminHeroBanners } from '@/pages/admin/AdminHeroBanners'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { useAuthStore } from '@/store/useAuthStore'

export function App() {
  const initAuth = useAuthStore((state) => state.initAuth)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Storefront (Home) */}
        <Route path="/" element={<StorefrontPage />} />

        {/* Dedicated Category & Product Catalogue Pages */}
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/products" element={<CategoryPage />} />

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
    </BrowserRouter>
  )
}

export default App
