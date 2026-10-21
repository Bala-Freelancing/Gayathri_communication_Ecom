import React from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, Quote } from 'lucide-react'
import { productService } from '@/services/productService'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const ReviewsSection: React.FC = () => {
  const customerReviews = productService.getCustomerReviews()
  const faqList = productService.getFaqList()

  return (
    <section className="py-16 sm:py-24 border-t border-neutral-200/80 bg-neutral-50/50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Customer Reviews Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
            Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
            Verified Showroom Experiences
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            Real feedback from verified purchasers across Manachanallur, Thuraiyur, and Tiruchirappalli.
          </p>
        </div>

        {/* Reviews Cards - Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {customerReviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 flex flex-col justify-between shadow-card relative overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-neutral-100 -z-0 pointer-events-none" />

              <div className="relative z-10">
                {/* Rating stars & verified tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Purchase
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-4 font-normal">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs relative z-10">
                <div>
                  <p className="font-bold text-neutral-900 font-['Outfit']">{review.name}</p>
                  <p className="text-neutral-500 text-[11px]">{review.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-neutral-900 font-semibold truncate max-w-[140px] block">
                    {review.product}
                  </span>
                  <span className="text-neutral-400 text-[10px]">{review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-4">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 block">
              Clear Information
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Verified answers regarding manufacturer warranty, No-Cost EMI, and showroom pickup.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-card">
            <Accordion type="single" collapsible className="w-full divide-y divide-neutral-100">
              {faqList.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="py-2 border-neutral-200">
                  <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-neutral-900 hover:text-neutral-700 py-3 cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1 pb-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

      </div>
    </section>
  )
}
