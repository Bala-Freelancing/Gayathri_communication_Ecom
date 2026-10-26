import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { storeDetails } from '@/data/mockProducts'

interface AnnouncementMessage {
  id: string
  icon: React.ReactNode
  text: string
  highlight?: string
}

const MESSAGES: AnnouncementMessage[] = [
  {
    id: 'auth-retailer',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
    text: 'Authorized Retailer for Apple, Samsung, Sony, LG, OnePlus & Daikin',
    highlight: 'Manachanallur Showroom',
  },
  {
    id: 'genuine-warranty',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    text: '100% Genuine Box-Pack with Official Manufacturer Warranty & GST Invoice',
    highlight: 'Zero Compromise',
  },
  {
    id: 'express-billing',
    icon: <CreditCard className="w-3.5 h-3.5 text-sky-400" />,
    text: 'Seamless Counter Billing • UPI, Cards & Net Banking Accepted with GST Bill',
    highlight: 'Fast Checkout',
  },
  {
    id: 'store-timing',
    icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
    text: '60-Min Express In-Store Pickup • Showroom Open Daily 10:00 AM – 9:30 PM',
    highlight: 'Visit Us Today',
  },
]

export const AnnouncementStrip: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Rotate smoothly every 5 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused])

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + MESSAGES.length) % MESSAGES.length)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % MESSAGES.length)
  }

  const current = MESSAGES[currentIndex]

  return (
    <div 
      className="bg-neutral-900 text-neutral-300 text-xs relative z-50 selection:bg-neutral-700 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Showroom Announcements"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        
        {/* Left Side: Store Phone */}
        <div className="hidden lg:flex items-center gap-2 text-neutral-400 text-xs">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Open Today: 10:00 AM – 9:30 PM</span>
        </div>

        {/* Center: Rotating Messages with Smooth Slide/Fade */}
        <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[22px]">
          <div className="flex items-center gap-2 max-w-full">
            <button
              onClick={handlePrev}
              className="text-neutral-500 hover:text-white p-0.5 rounded transition-colors focus:outline-none"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center gap-2 text-center text-xs font-medium tracking-tight text-neutral-200"
              >
                <span className="shrink-0">{current.icon}</span>
                <span className="truncate max-w-[280px] sm:max-w-md md:max-w-2xl">
                  {current.text}
                </span>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={handleNext}
              className="text-neutral-500 hover:text-white p-0.5 rounded transition-colors focus:outline-none"
              aria-label="Next announcement"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Quick Call & WhatsApp Support */}
        <div className="flex items-center gap-4 text-xs font-medium shrink-0">
          <a
            href={`tel:${storeDetails.phone.replace(/\s+/g, '')}`}
            className="hidden sm:flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-xs"
            title="Call Showroom"
          >
            <Phone className="w-3 h-3 text-neutral-400" />
            <span>{storeDetails.phone}</span>
          </a>

          <a
            href={`https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20would%20like%20to%20know%20about%20your%20current%20offers.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold"
          >
            <span>WhatsApp Support</span>
          </a>
        </div>

      </div>
    </div>
  )
}
