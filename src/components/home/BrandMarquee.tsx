import React from 'react'
import { productService } from '@/services/productService'
import { ShieldCheck } from 'lucide-react'

export const BrandMarquee: React.FC = () => {
  const brandPartners = productService.getBrandPartners()

  return (
    <div className="py-5 border-b border-neutral-200/80 bg-white overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-bold text-neutral-800 tracking-tight">
          <ShieldCheck className="w-4 h-4 text-neutral-900" />
          Authorized Brand Partnership
        </span>
        <span className="text-neutral-500 hidden sm:inline text-[11px]">
          100% Genuine Box-Pack • Official Brand Warranty • Serial Verification
        </span>
      </div>

      {/* Infinite scrolling ribbon with clean architectural styling */}
      <div className="flex w-max gap-8 animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused] py-1">
        {[...brandPartners, ...brandPartners, ...brandPartners, ...brandPartners].map((brand, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-1.5 rounded-lg text-neutral-800 hover:text-neutral-950 transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-extrabold tracking-tight font-['Outfit'] text-neutral-900">
              {brand.name}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/80">
              Official Dealer
            </span>
            <span className="text-neutral-300 select-none">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
