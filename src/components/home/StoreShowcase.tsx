import React from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Navigation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { productService } from '@/services/productService'

export const StoreShowcase: React.FC = () => {
  const storeDetails = productService.getStoreDetails()

  return (
    <section id="store-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
            Retail Showroom
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
            Visit Gayathri Communication
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-xl">
            Experience flagships, 4K OLED displays, and smart appliances in person. Our specialists provide free device setup and on-the-spot EMI approval.
          </p>
        </div>

        {/* Live Showroom Status Pill */}
        <div className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-xl shadow-2xs self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-neutral-900">Open Daily</span>
          <span className="text-xs text-neutral-500">• 10:00 AM – 9:30 PM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Showroom Address & Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-card">
            
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold font-['Outfit'] text-lg shadow-2xs">
                GC
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 font-['Outfit']">
                  {storeDetails.name}
                </h3>
                <p className="text-xs text-neutral-500">Authorized Electronics & Appliance Showroom</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase text-neutral-400 block tracking-wider">
                  Showroom Address
                </span>
                <p className="text-sm text-neutral-800 font-medium leading-relaxed mt-0.5">
                  {storeDetails.address}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Landmark: {storeDetails.landmark}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3.5">
              <Clock className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase text-neutral-400 block tracking-wider">
                  Store Hours
                </span>
                <p className="text-sm text-neutral-800 font-medium mt-0.5">
                  {storeDetails.timing}
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  Open all 7 days including Sundays
                </p>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="flex items-start gap-3.5">
              <Phone className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase text-neutral-400 block tracking-wider">
                  Direct Line
                </span>
                <a 
                  href={`tel:${storeDetails.phone.replace(/\s+/g, '')}`}
                  className="text-sm text-neutral-900 font-bold hover:underline mt-0.5 block"
                >
                  {storeDetails.phone}
                </a>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Showroom assistance & stock inquiries
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={storeDetails.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="default"
                  size="default"
                  className="w-full gap-2 text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </Button>
              </a>

              <a
                href={`https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20would%20like%20to%20visit%20your%20showroom.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  size="default"
                  className="w-full gap-2 text-xs font-semibold shadow-2xs border-neutral-300 hover:bg-neutral-50 text-neutral-800 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Visit</span>
                </Button>
              </a>
            </div>

          </div>
        </div>

        {/* Right Column: Editorial Photo Mosaic (1 Large Hero + 2 Stacked) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Large Hero Display Counter Photo */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="group relative rounded-3xl border border-neutral-200/90 bg-white p-2.5 shadow-card overflow-hidden"
          >
            <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-neutral-100 relative">
              <img
                src="/images/hero-phone.jpg"
                alt="Smartphone & Flagship Live Display Counter"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded text-white">
                  Live Showroom Counter
                </span>
                <p className="text-xs sm:text-sm font-bold font-['Outfit'] mt-1">
                  Smartphone & 5G Flagship Live Experience Counter
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2 Side-by-Side Secondary Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="group relative rounded-2xl border border-neutral-200/90 bg-white p-2 shadow-card overflow-hidden"
            >
              <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-neutral-100 relative">
                <img
                  src="/images/hero-tv.jpg"
                  alt="4K & OLED Smart TV Cinema Lounge"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold text-neutral-800 line-clamp-1">
                  4K & OLED Smart TV Cinema Lounge
                </p>
                <p className="text-[11px] text-neutral-500">Sony BRAVIA XR live auditioning</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="group relative rounded-2xl border border-neutral-200/90 bg-white p-2 shadow-card overflow-hidden"
            >
              <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-neutral-100 relative">
                <img
                  src="/images/hero-appliance.jpg"
                  alt="Premium Living Appliances"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold text-neutral-800 line-clamp-1">
                  Inverter Refrigeration & Washers
                </p>
                <p className="text-[11px] text-neutral-500">LG AI & Samsung living appliances</p>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  )
}
