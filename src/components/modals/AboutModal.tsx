import React from 'react'
import { X, ShieldCheck, Zap, CreditCard, Store } from 'lucide-react'
import { productService } from '@/services/productService'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
          aria-label="Close about modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="mb-3">
            <img 
              src="/images/gayathri-logo.png" 
              alt="Gayathri Communication - Mobiles & Home Appliances" 
              className="h-11 sm:h-12 w-auto object-contain"
            />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Store className="w-3 h-3 text-neutral-600" />
            Authorized Electronics & Appliances Showroom
          </span>
          <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed">
            {storeDetails.tagline}. We connect customers with genuine, box-packed smartphones, cinema Smart TVs, and inverter appliances with complete peace of mind.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-neutral-900">100% Genuine Box-Pack Guaranteed</p>
              <p className="text-neutral-600 mt-0.5">Every unit is brand sealed with official GST tax invoice and valid brand warranty.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
            <CreditCard className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-neutral-900">Instant Counter Billing</p>
              <p className="text-neutral-600 mt-0.5">UPI, all major Credit/Debit Cards, Net Banking & Cash accepted with instant GST bill.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-neutral-900">60-Min In-Store Pickup</p>
              <p className="text-neutral-600 mt-0.5">Reserve online or over WhatsApp and pick up in-store today with instant unboxing.</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Manachanallur, Tamil Nadu</span>
          <a 
            href={`tel:${storeDetails.phone.replace(/\s+/g, '')}`}
            className="font-bold text-neutral-900 hover:underline"
          >
            {storeDetails.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
