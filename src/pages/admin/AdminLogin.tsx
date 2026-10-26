import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Lock, Mail, ArrowRight, ShieldAlert, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isAdmin, isLoading, error, clearError, initAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/admin'

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (isAdmin) {
      navigate(from, { replace: true })
    }
  }, [isAdmin, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!email || !password) return

    const res = await login(email, password)
    if (res.success) {
      navigate(from, { replace: true })
    }
  }

  const isConfigured = isSupabaseConfigured()

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Inter']">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Return to Store Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Storefront
      </Link>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block bg-white px-4 py-2 rounded-2xl shadow-xl shadow-cyan-500/10 border border-white/20">
            <img 
              src="/images/gayathri-logo.png" 
              alt="Gayathri Communication - Mobiles & Home Appliances" 
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Administrator Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Gayathri Communication Management Suite. Secure price controls, product catalog, and showroom inventory.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@gayathricommunication.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gap-2 text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 h-11 rounded-xl shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Admin Panel
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Connection Status Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database Connection:</span>
              {isConfigured ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Supabase Live
                </span>
              ) : (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Local Development Mode
                </span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] space-y-1">
              <p className="font-semibold text-cyan-400">Owner Admin Credentials:</p>
              <p>Email: <code className="text-white">gayathri.communication.2017@gmail.com</code></p>
              <p>Password: <code className="text-white">Gayathri@2026</code></p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('gayathri.communication.2017@gmail.com')
                    setPassword('Gayathri@2026')
                  }}
                  className="text-cyan-400 hover:underline font-semibold cursor-pointer"
                >
                  Auto-fill Owner Login →
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Authorized personnel only. All access attempts and price modifications are logged.
        </p>
      </div>
    </div>
  )
}
