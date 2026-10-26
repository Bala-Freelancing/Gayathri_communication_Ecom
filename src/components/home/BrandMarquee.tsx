import React from 'react'
import { productService } from '@/services/productService'

export const BrandMarquee: React.FC = () => {
  const brandPartners = productService.getBrandPartners()

  return (
    <div data-ui="brand-ribbon" className="py-3.5 bg-white overflow-hidden w-full max-w-full select-none">
      <div className="flex w-max gap-10 animate-[marquee_36s_linear_infinite] hover:[animation-play-state:paused]">
        {[...brandPartners, ...brandPartners, ...brandPartners, ...brandPartners].map((brand, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-neutral-700 hover:text-neutral-950 transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-bold font-['Outfit'] tracking-tight text-neutral-900">
              {brand.name}
            </span>
            <span className="text-neutral-300 select-none">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
