import React from 'react'
import { storeDetails } from '@/data/mockProducts'

const CURRENT_YEAR = new Date().getFullYear()

export const MoraFooter: React.FC = () => {
  return (
    <footer id="editorial-contact" className="w-full bg-[#050505] text-neutral-400 py-24 px-6 sm:px-12 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Main Editorial Contact Block matching Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          
          <div className="md:col-span-6 space-y-4 text-left">
            <span className="font-mono text-xs text-[#ff6a00] uppercase tracking-widest block">
              Flagship Showroom & Inquiries
            </span>
            <a 
              href={`mailto:${storeDetails.email}`}
              className="font-serif text-3xl sm:text-4xl text-white hover:text-[#ff6a00] transition-colors block"
            >
              {storeDetails.email}
            </a>
            <a
              href={`tel:${storeDetails.phone.replace(/\s+/g, '')}`}
              className="font-serif text-2xl sm:text-3xl text-neutral-300 hover:text-white transition-colors block"
            >
              {storeDetails.phone}
            </a>
            <p className="font-mono text-xs text-neutral-500 max-w-sm pt-2">
              {storeDetails.address}, {storeDetails.landmark}.<br />
              Hours: {storeDetails.timing}
            </p>
          </div>

          {/* Large Serif Links matching Screenshot 3 bottom */}
          <div className="md:col-span-6 flex flex-wrap gap-6 md:justify-end text-left md:text-right">
            <a
              href={`https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20am%20inquiring%20about%20your%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl sm:text-3xl text-white hover:text-[#ff6a00] transition-colors uppercase tracking-wider"
            >
              WHATSAPP
            </a>

            <a
              href={storeDetails.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl sm:text-3xl text-white hover:text-[#ff6a00] transition-colors uppercase tracking-wider"
              title="Open Google Maps Showroom Directions"
            >
              SHOWROOM
            </a>

            <a
              href={storeDetails.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-2xl sm:text-3xl text-white hover:text-[#ff6a00] transition-colors uppercase tracking-wider"
              title="Visit Instagram @gayathri_communication_"
            >
              INSTAGRAM
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-600">
          <p>
            © {CURRENT_YEAR} GAYATHRI COMMUNICATION. 100% Genuine Box-Packed.
          </p>
          <div className="flex items-center gap-4">
            <span>GST Verified Retailer</span>
            <span>•</span>
            <span>Zero Down Payment EMI</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
