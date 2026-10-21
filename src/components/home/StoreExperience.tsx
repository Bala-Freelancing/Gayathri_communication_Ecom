import React from 'react'
import { 
  ShieldCheck, 
  CreditCard, 
  Store, 
  CheckCircle2
} from 'lucide-react'

export const StoreExperience: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 border-y border-neutral-200/80 bg-neutral-100/40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
            Showroom Commitment
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
            The Gayathri Standard of Retail
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            Why customers across Manachanallur, Thuraiyur, and Tiruchirappalli trust our showroom for genuine flagships and appliances.
          </p>
        </div>

        {/* 3-Column Architectural Service Blueprint (Not floating dashboard cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          
          {/* Pillar 1: Authenticity */}
          <div className="flex flex-col justify-between space-y-4 md:border-r md:border-neutral-200/80 md:pr-8 lg:pr-12">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-5 shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Pillar 01
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-['Outfit'] mb-2">
                100% Genuine Box-Pack
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Direct brand factory-sealed devices with manufacturer warranty and serial-matched GST tax invoice valid across all official service centers nationwide.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200/60 flex items-center gap-2 text-xs font-semibold text-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Apple • Samsung • Sony • LG Certified</span>
            </div>
          </div>

          {/* Pillar 2: Financing */}
          <div className="flex flex-col justify-between space-y-4 md:border-r md:border-neutral-200/80 md:pr-8 lg:pr-12">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-5 shadow-2xs">
                <CreditCard className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Pillar 02
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-['Outfit'] mb-2">
                Zero Down-Payment EMI
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Official financing partnerships with Bajaj Finserv, HDFC Bank, ICICI Bank, and SBI. Fast on-the-spot approval with transparent terms and 0% interest schemes.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200/60 flex items-center gap-2 text-xs font-semibold text-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>10-Minute In-Store Approvals</span>
            </div>
          </div>

          {/* Pillar 3: Showroom Care */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-5 shadow-2xs">
                <Store className="w-6 h-6 text-sky-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Pillar 03
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-['Outfit'] mb-2">
                Local Pickup & Installation
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Collect your verified device at our Manachanallur counter within 60 minutes with complimentary phone data transfer. Large appliances include brand doorstep installation.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200/60 flex items-center gap-2 text-xs font-semibold text-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free Unboxing & Doorstep Setup</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
