import React from 'react'
import { X } from 'lucide-react'

interface Mora404ModalProps {
  isOpen: boolean
  onClose: () => void
}

export const Mora404Modal: React.FC<Mora404ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg text-center space-y-6">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glitch Tech 404 Illustration matching Screenshot 4 */}
        <div className="relative flex items-center justify-center py-6">
          <div className="text-[120px] sm:text-[160px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] via-cyan-400 to-[#ff3300] font-mono select-none drop-shadow-[0_0_40px_rgba(255,100,0,0.4)] animate-pulse">
            404
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-wide">
            404 — Page Not Found
          </h2>
          <p className="font-mono text-xs text-neutral-400">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-mono text-xs font-semibold rounded-md tracking-wider transition-all"
        >
          Back to home
        </button>
      </div>
    </div>
  )
}
