import React from 'react'
import { X } from 'lucide-react'

interface MoraMenuModalProps {
  isOpen: boolean
  onClose: () => void
  onOpen404: () => void
}

export const MoraMenuModal: React.FC<MoraMenuModalProps> = ({ isOpen, onClose, onOpen404 }) => {
  if (!isOpen) return null

  const scrollToSection = (id: string) => {
    onClose()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Menu Card matching Screenshot 2 */}
      <div className="relative w-full max-w-sm bg-[#0e0e0e] rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-8 text-neutral-200 space-y-6">
        
        {/* Header matching Screenshot 2: ✕ on left, "Menu" in center */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            Menu
          </span>
          <div className="w-5" /> {/* spacer */}
        </div>

        {/* Links in Large Elegant Serif matching Screenshot 2 */}
        <nav className="flex flex-col space-y-4 text-center py-4">
          <button
            onClick={() => {
              onClose()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="font-serif text-3xl font-light text-white hover:text-[#ff6a00] transition-colors"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection('editorial-features')}
            className="font-serif text-3xl font-light text-white hover:text-[#ff6a00] transition-colors"
          >
            Philosophy
          </button>

          <button
            onClick={() => scrollToSection('collection-grid')}
            className="font-serif text-3xl font-light text-white hover:text-[#ff6a00] transition-colors"
          >
            Collection
          </button>

          <button
            onClick={() => scrollToSection('editorial-contact')}
            className="font-serif text-3xl font-light text-white hover:text-[#ff6a00] transition-colors"
          >
            Showroom
          </button>

          <button
            onClick={() => {
              onClose()
              onOpen404()
            }}
            className="font-serif text-2xl font-light text-neutral-500 hover:text-red-400 transition-colors pt-2"
          >
            404
          </button>
        </nav>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 text-center font-mono text-[10px] text-neutral-500">
          GAYATHRI® — Silence In Design
        </div>

      </div>
    </div>
  )
}
