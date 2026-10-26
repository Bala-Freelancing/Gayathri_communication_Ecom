import React, { useState } from 'react'
import { X, Send, Phone, MessageCircle, CheckCircle, Sparkles, User, Mail, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storeDetails } from '@/data/mockProducts'
import confetti from 'canvas-confetti'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('Smartphones & 5G Flagships')
  const [message, setMessage] = useState('')
  const [preferredMethod, setPreferredMethod] = useState<'whatsapp' | 'call'>('whatsapp')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanPhone = phone.trim().replace(/\D/g, '')
    if (!name.trim()) {
      setError('Please provide your name.')
      return
    }
    if (cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.')
      return
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      })
    } catch {
      // Graceful fallback
    }

    setIsSubmitted(true)
  }

  const handleOpenWhatsApp = () => {
    const cleanPhone = phone.trim().replace(/\D/g, '')
    const msg = `👋 *NEW WEBSITE INQUIRY - GAYATHRI COMMUNICATION*\n\n*Name:* ${name.trim()}\n*Phone:* ${cleanPhone}\n*Department:* ${department}\n*Preferred Response:* ${preferredMethod === 'whatsapp' ? 'WhatsApp' : 'Phone Call'}\n${message.trim() ? `*Message:* ${message.trim()}\n` : ''}\nHello, please assist me with showroom stock and pricing.`
    
    const targetPhone = (storeDetails.whatsapp || '919842419358').replace(/\D/g, '')
    const fullTarget = targetPhone.startsWith('91') ? targetPhone : `91${targetPhone}`
    window.open(`https://wa.me/${fullTarget}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setName('')
    setPhone('')
    setMessage('')
    setError('')
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none font-['Inter']"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-900 border border-neutral-200 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          aria-label="Close contact modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div>
          <div className="mb-3">
            <img 
              src="/images/gayathri-logo.png" 
              alt="Gayathri Communication" 
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-neutral-600" />
            Showroom Customer Desk
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] mt-2.5 text-neutral-900">
            Send an Inquiry or Schedule a Visit
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Our Manachanallur showroom specialists respond in minutes during showroom hours (10 AM – 9:30 PM).
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold font-['Outfit'] text-neutral-900">
                Inquiry Received, {name}!
              </h4>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Thank you for reaching out. We have logged your request for <strong>{department}</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Button
                onClick={handleOpenWhatsApp}
                variant="default"
                size="default"
                className="gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md shadow-[#25D366]/20 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Instant Chat on WhatsApp</span>
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="default"
                className="text-xs font-semibold cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Showroom Department / Category
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5 text-xs text-neutral-900 focus:outline-none bg-white"
              >
                <option value="Smartphones & 5G Flagships">Smartphones & 5G Flagships (Apple, Samsung, Vivo, etc.)</option>
                <option value="4K & OLED Smart TVs">4K & OLED Smart TVs (Sony BRAVIA, Samsung, LG)</option>
                <option value="Living Appliances & Washers">Living Appliances (Refrigerators, Washers, ACs)</option>
                <option value="Audio & Daily Accessories">Audio Gear, AirPods, Smartwatches & Accessories</option>
                <option value="General Showroom Inquiry">General Pricing & Showroom Counter Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Preferred Response Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredMethod('whatsapp')}
                  className={`flex items-center justify-center gap-2 h-9 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                    preferredMethod === 'whatsapp'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Message</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredMethod('call')}
                  className={`flex items-center justify-center gap-2 h-9 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                    preferredMethod === 'call'
                      ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Call</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Question or Specific Model (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Inquiring about iPhone 16 Pro 256GB availability or exchange offer..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              size="default"
              className="w-full gap-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold h-11 rounded-xl cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry</span>
            </Button>
          </form>
        )}

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>{storeDetails.address.split(',')[0]}, Manachanallur</span>
          <a 
            href={`tel:${storeDetails.phone.replace(/\D/g, '')}`} 
            className="font-bold text-neutral-900 hover:underline"
          >
            {storeDetails.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
