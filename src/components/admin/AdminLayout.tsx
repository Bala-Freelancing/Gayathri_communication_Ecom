import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  FileSpreadsheet,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', path: '/admin/products', icon: Package, end: false },
  { label: 'Hero Banners', path: '/admin/banners', icon: ImageIcon, end: false },
  { label: 'Stock Import', path: '/admin/import', icon: FileSpreadsheet, end: false },
]

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle, actions }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Close the mobile menu after navigating.
  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    document.title = `${title} · Gayathri Admin`
  }, [title])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV_ITEMS.map(({ label, path, icon: Icon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  const footer = (
    <div className="space-y-1 border-t border-slate-200 pt-4">
      <Link
        to="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        View website
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
      {user?.email && <p className="truncate px-3 pt-2 text-xs text-slate-400">{user.email}</p>}
    </div>
  )

  return (
    <div className="admin-shell min-h-screen bg-slate-50 text-slate-900 font-['Inter']">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/images/gayathri-logo.png" alt="Gayathri Communication" className="h-7 w-auto" />
          <span className="text-xs font-semibold text-slate-500">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-[57px] bottom-0 flex w-72 flex-col justify-between bg-white p-4 shadow-xl">
            {nav}
            {footer}
          </div>
        </div>
      )}

      <div className="md:flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 md:flex">
          <div className="space-y-6">
            <Link to="/admin" className="flex items-center gap-2 px-1">
              <img src="/images/gayathri-logo.png" alt="Gayathri Communication" className="h-8 w-auto" />
            </Link>
            {nav}
          </div>
          {footer}
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-['Outfit'] text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
