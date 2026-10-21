import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { 
  LayoutDashboard, 
  Tag, 
  Package, 
  Boxes, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Store,
  FileSpreadsheet
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  actions 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Stock Import (Excel)', path: '/admin/import', icon: FileSpreadsheet, highlight: true },
    { label: 'Price Management', path: '/admin/prices', icon: Tag },
    { label: 'Product Catalog', path: '/admin/products', icon: Package },
    { label: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const isConfigured = isSupabaseConfigured()

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col md:flex-row font-['Inter']">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center font-extrabold text-cyan-400 font-['Outfit'] text-sm">
              GC
            </div>
          </div>
          <span className="font-bold text-sm tracking-tight text-white font-['Outfit']">
            Admin Suite
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl border border-slate-800 text-slate-300"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 border-r border-slate-800 p-5 flex flex-col justify-between backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Showroom Title */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                <span className="font-extrabold text-cyan-400 font-['Outfit'] text-lg">
                  GC
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-['Outfit']">
                  GAYATHRI
                </span>
                <span className="text-[10px] bg-cyan-950 border border-cyan-800/50 text-cyan-400 px-1.5 py-0.2 rounded font-bold uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                Management Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded font-extrabold uppercase">
                      Core
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section: Store link & User Profile */}
        <div className="pt-6 border-t border-slate-900 space-y-4">
          {/* Live Storefront Link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Live Store</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* DB Status Badge */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Database:</span>
            {isConfigured ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Supabase Live
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Local Demo Mode
              </span>
            )}
          </div>

          {/* Logged In User Pill */}
          <div className="flex items-center justify-between pt-2">
            <div className="truncate max-w-[150px]">
              <p className="text-xs font-bold text-white truncate">
                {user?.email?.split('@')[0] || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@store'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Content Bar */}
        <header className="px-6 sm:px-8 py-6 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2.5">
              {actions}
            </div>
          )}
        </header>

        {/* Page Body */}
        <main className="p-6 sm:p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  )
}
