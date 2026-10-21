import React from 'react'


export const MoraFeatureShowcase: React.FC = () => {
  return (
    <section id="editorial-features" className="w-full bg-[#060606] text-neutral-200 py-24 px-6 sm:px-12 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Feature [1] Section matching Screenshot 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="font-mono text-xs text-[#ff6a00] font-medium tracking-widest">
              [1]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
              / Internal Glow Architecture
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed">
              When technology refuses to hide behind opaque shells, the pure architecture of silicon and copper becomes the art.
            </p>
            
            <div className="pt-4 space-y-2 font-mono text-[11px] text-neutral-500">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00]" />
                Zero compromises on authentic components
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00]" />
                Brand-authorized billing with verified GST invoice
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl group">
              <img
                src="/images/mora-concrete.jpg"
                alt="Circuitry Detail"
                className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Ref. GAYATHRI-MK1</span>
                <span className="text-[#ff6a00]">Precision in Clarity</span>
              </div>
            </div>
          </div>

        </div>

        {/* Feature [2] Section matching Screenshot 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl group">
              <img
                src="/images/mora-lifestyle.jpg"
                alt="Editorial Lifestyle"
                className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Brutalist Studio Edition</span>
                <span>Authorized Showcase</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-5 text-left">
            <span className="font-mono text-xs text-[#ff6a00] font-medium tracking-widest">
              [2]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
              / Transparent Awareness Mode
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed">
              When silence needs awareness, the world blends softly with sound. Designed to feel nothing — and that's what makes it real.
            </p>

            <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/5 space-y-2">
              <p className="font-serif text-lg font-light italic text-white">
                "Silence speaks louder when design refuses to explain itself."
              </p>
              <p className="font-mono text-[11px] text-neutral-500">
                Gayathri Communication • Flagship Curation
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
