import React from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { productsData } from '@/data/mockProducts'

interface MoraHeroProps {
  onBuyNowClick: () => void
}

export const MoraHero: React.FC<MoraHeroProps> = ({ onBuyNowClick }) => {
  const { setQuickViewProduct } = useCartStore()

  const scrollToNext = () => {
    const el = document.getElementById('editorial-features')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHeroClick = () => {
    setQuickViewProduct(productsData[0])
  }

  return (
    <section className="relative w-full min-h-screen bg-[#060606] flex items-center justify-center overflow-hidden px-6 sm:px-12 md:px-16 pt-24 pb-16">
      
      {/* Background warm incandescent amber/orange ambient glow matching Screenshot 1 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-[radial-gradient(ellipse_at_center,_rgba(255,90,0,0.18)_0%,_rgba(255,50,0,0.06)_45%,_transparent_70%)] blur-[90px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-7xl min-h-[640px] flex items-center justify-center">
        
        {/* Top-Left Monospace Annotation matching Screenshot 1 */}
        <div className="absolute top-8 left-0 z-20 hidden md:block max-w-[220px]">
          <p className="font-mono text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
            Designed to feel nothing<br />
            — and that's what makes<br />
            it real.
          </p>
        </div>

        {/* Right Pinpoint Annotation matching Screenshot 1 */}
        <div className="absolute top-1/3 right-4 sm:right-12 z-20 hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff6a00] animate-ping" />
          <span className="font-mono text-[11px] text-[#ff7700] tracking-wider uppercase">
            Distortion in clarity
          </span>
        </div>

        {/* Center Glowing Hero Visual matching Screenshot 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          onClick={handleHeroClick}
          className="relative z-10 w-full max-w-md sm:max-w-xl flex items-center justify-center cursor-pointer group"
        >
          <img
            src="/images/mora-hero.jpg"
            alt="Gayathri Flagship Edition"
            className="w-full h-auto max-h-[580px] object-contain rounded-3xl drop-shadow-[0_20px_50px_rgba(255,100,0,0.25)] group-hover:scale-[1.02] transition-transform duration-700"
          />
        </motion.div>

        {/* Bottom-Left Editorial Statement in High-Fashion Serif matching Screenshot 1 */}
        <div className="absolute bottom-4 left-0 z-20 max-w-sm sm:max-w-md text-left">
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light italic text-neutral-100 leading-[1.08] tracking-tight">
            Silence speaks louder<br />
            when design refuses to<br />
            explain itself.
          </h2>
        </div>

        {/* Bottom-Right Monospace Subtext + White Button matching Screenshot 1 */}
        <div className="absolute bottom-4 right-0 z-20 text-right space-y-2.5">
          <p className="font-mono text-[11px] sm:text-xs text-neutral-400 leading-relaxed max-w-[200px] ml-auto">
            In a world full of<br />
            noise, silence became<br />
            a choice.
          </p>
          <p className="font-mono text-[11px] text-[#ff7700] font-semibold">
            Authorized Flagship Showroom
          </p>
          <button
            onClick={onBuyNowClick}
            className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 font-mono text-xs font-semibold rounded-md tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Buy Now
          </button>
        </div>

        {/* Bottom Center [Scroll] Prompt matching Screenshot 1 */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={scrollToNext}
            className="font-mono text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors tracking-widest uppercase flex items-center gap-1"
          >
            [Scroll]
          </button>
        </div>

      </div>

    </section>
  )
}
