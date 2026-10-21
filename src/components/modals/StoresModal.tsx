import React from 'react'
import { X, MapPin, Clock, Phone, Navigation } from 'lucide-react'
import { productService } from '@/services/productService'
import { Button } from '@/components/ui/button'

interface StoresModalProps {
  isOpen: boolean
  onClose: () => void
}

export const StoresModal: React.FC<StoresModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const storeDetails = productService.getStoreDetails()

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-900 border border-neutral-200 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          aria-label="Close store modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full">
            Flagship Experience Center
          </span>
          <h3 className="text-2xl font-bold font-['Outfit'] mt-3 text-neutral-900">
            {storeDetails.name}
          </h3>
          <p className="text-xs text-neutral-600 mt-1.5">
            Visit us in person to test flagships, get free data transfer, and instant 10-minute EMI approval.
          </p>
        </div>

        <div className="space-y-4 text-xs text-neutral-700 bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-neutral-900">{storeDetails.address}</p>
              <p className="text-neutral-500 mt-0.5">{storeDetails.landmark}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-neutral-700 shrink-0" />
            <div>
              <p className="font-bold text-neutral-900">{storeDetails.timing}</p>
              <p className="text-neutral-500 text-[11px]">Open All 7 Days • Express Counter Ready</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-neutral-700 shrink-0" />
            <div>
              <p className="font-bold text-neutral-900">{storeDetails.phone}</p>
              <p className="text-neutral-500 text-[11px]">Direct Showroom Line</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <a
            href={storeDetails.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="default" size="default" className="w-full gap-2 text-xs font-semibold">
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
