import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StorefrontPage } from '@/pages/StorefrontPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminPrices } from '@/pages/admin/AdminPrices'
import { AdminProducts } from '@/pages/admin/AdminProducts'
import { AdminInventory } from '@/pages/admin/AdminInventory'
import { AdminStockImport } from '@/pages/admin/AdminStockImport'
import { AdminHeroBanners } from '@/pages/admin/AdminHeroBanners'
import { AdminSettings } from '@/pages/admin/AdminSettings'
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
          path="/admin/prices"
          element={
            <ProtectedRoute>
              <AdminPrices />
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
          path="/admin/inventory"
          element={
            <ProtectedRoute>
              <AdminInventory />
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
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to storefront */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
