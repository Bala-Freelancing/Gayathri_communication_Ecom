import React from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { isSupabaseConfigured } from '@/lib/supabase'
import { productService } from '@/services/productService'
import { 
  Database, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode2,
  Terminal
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const AdminSettings: React.FC = () => {
  const isConfigured = isSupabaseConfigured()
  const store = productService.getStoreDetails()

  return (
    <AdminLayout
      title="System Settings & Database Guide"
      subtitle="Showroom credentials, database connection diagnostics, and administrative security."
    >
      <div className="space-y-8 max-w-5xl">

        {/* Database Connection Diagnostic Card */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Supabase PostgreSQL Status
                </h3>
                <p className="text-xs text-slate-400">
                  Persistent database connection status and environment configuration
                </p>
              </div>
            </div>

            {isConfigured ? (
              <Badge className="bg-emerald-950 border border-emerald-800 text-emerald-400 gap-1.5 px-3 py-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Connected to Supabase
              </Badge>
            ) : (
              <Badge className="bg-amber-950 border border-amber-800 text-amber-400 gap-1.5 px-3 py-1 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Local Demo Mode Active
              </Badge>
            )}
          </div>

          <div className="text-xs text-slate-300 space-y-3">
            <p>
              The application requires two frontend-safe environment variables to connect directly to your live Supabase project:
            </p>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-[11px] text-cyan-300 space-y-1">
              <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
              <div>VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key</div>
            </div>
            <p className="text-slate-400 text-[11px]">
              Note: When unconfigured, the application runs safely with full demo capabilities (reactive in-memory caching, instant mock updates, and safe admin authorization simulation).
            </p>
          </div>
        </div>

        {/* Database Migrations Instructions */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Database Schema Migrations
              </h3>
              <p className="text-xs text-slate-400">
                SQL migration files located under <code className="text-cyan-400 font-mono">supabase/migrations/</code>
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-mono text-cyan-400 font-bold">
                <span>1. 00001_create_store_schema.sql</span>
                <span className="text-[10px] text-slate-400">Core Tables & Functions</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Creates tables for <code className="text-white">categories</code>, <code className="text-white">products</code>, <code className="text-white">product_variants</code>, <code className="text-white">price_history</code>, and <code className="text-white">admin_users</code>. Applies strict Row Level Security (RLS) policies, atomic stored procedure <code className="text-white">update_product_price</code>, and activates Supabase Realtime publication.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-mono text-cyan-400 font-bold">
                <span>2. 00002_seed_initial_products.sql</span>
                <span className="text-[10px] text-slate-400">Idempotent Product Seed</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Seeds the 6 flagship showroom models (iPhone 16 Pro, S24 Ultra, Bravia OLED, OnePlus 12, LG AI Washer, Samsung Bespoke Fridge). Designed with <code className="text-white">ON CONFLICT (id) DO UPDATE</code> so that rerun migrations never overwrite an admin's customized live prices.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>How to Apply Migrations in Supabase:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] pl-1">
                <li>Log in to your Supabase project dashboard at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">supabase.com</a>.</li>
                <li>Navigate to the <strong>SQL Editor</strong> tab on the left navigation bar.</li>
                <li>Copy the content of <code className="text-slate-200">00001_create_store_schema.sql</code> and click <strong>Run</strong>.</li>
                <li>Copy the content of <code className="text-slate-200">00002_seed_initial_products.sql</code> and click <strong>Run</strong>.</li>
                <li>Go to <strong>Authentication &gt; Users</strong> to create your showroom admin user, or execute the SQL below.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Security & Admin Creation Guide */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Administrator Security & Role Provisioning
              </h3>
              <p className="text-xs text-slate-400">
                Guarding showroom prices against unauthorized browser tampering
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p>
              To authorize an administrator in Supabase, create an Auth User in Supabase, then insert their email into the <code className="text-cyan-400 font-mono">admin_users</code> table:
            </p>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-[11px] text-cyan-300">
              INSERT INTO public.admin_users (email, role)<br />
              VALUES ('owner@gayathricommunication.com', 'admin')<br />
              ON CONFLICT (email) DO NOTHING;
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400">
                  <strong>Row Level Security (RLS)</strong> is strictly enforced. Anonymous storefront users can only read active products.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400">
                  <strong>Zero Secret Leakage:</strong> Service role keys and database passwords are never packaged into frontend assets.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Showroom Metadata Card */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Gayathri Communication Showroom Information
              </h3>
              <p className="text-xs text-slate-400">
                Official business contact and location displayed across customer touchpoints
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Store Name</span>
              <p className="font-bold text-white text-sm">{store.name}</p>
              <p className="text-slate-400 text-[11px]">{store.tagline}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Showroom Address</span>
              <p className="text-white text-xs">{store.address}</p>
              {store.landmark && (
                <p className="text-slate-400 text-[11px]">Landmark: {store.landmark}</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone & WhatsApp</span>
              <p className="text-white font-mono">{store.phone}</p>
              <p className="text-cyan-400 font-mono text-[11px]">WhatsApp: {store.whatsapp}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Store Timings & Status</span>
              <p className="text-white text-xs">{store.timing}</p>
              <p className="text-emerald-400 text-[11px]">Currently Open: {store.isOpenNow ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
