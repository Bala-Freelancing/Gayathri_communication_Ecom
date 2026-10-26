import React from 'react'
import { motion } from 'framer-motion'

export const StoreExperience: React.FC = () => {
  return (
    <section className="py-8 sm:py-10 bg-neutral-100/40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Editorial Headline Column */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight leading-tight">
              The Gayathri Standard of Retail
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md">
              Why customers across Manachanallur, Thuraiyur, and Tiruchirappalli trust our showroom for genuine flagships and appliances.
            </p>
          </div>

          {/* 3 Pillars Editorial Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0.9, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="space-y-2 border-l-2 border-neutral-900 pl-4"
            >
              <h3 className="text-base font-bold text-neutral-900 font-['Outfit']">
                100% Genuine Box-Pack
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Direct brand factory-sealed devices with manufacturer warranty and serial-matched GST tax invoice valid nationwide.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0.9, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="space-y-2 border-l-2 border-neutral-900 pl-4"
            >
              <h3 className="text-base font-bold text-neutral-900 font-['Outfit']">
                Instant Counter Billing
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Fast, seamless checkout with UPI, all major Credit/Debit cards, Net Banking & Cash with official GST invoice.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0.9, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="space-y-2 border-l-2 border-neutral-900 pl-4"
            >
              <h3 className="text-base font-bold text-neutral-900 font-['Outfit']">
                Local Pickup & Setup
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                60-minute showroom collection with complimentary phone data migration and brand technician doorstep installation.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
