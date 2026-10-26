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
    <section className="py-8 sm:py-10 bg-neutral-50/50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Customer Reviews Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
            Verified Showroom Experiences
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1.5">
            Real feedback from verified purchasers across Manachanallur, Thuraiyur, and Tiruchirappalli.
          </p>
        </div>

        {/* Reviews Cards - Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {customerReviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl bg-white p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="relative z-10">
                {/* Rating score & verified tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-amber-700 text-xs font-bold tracking-tight bg-amber-50 px-2.5 py-1 rounded-full">
                    {review.rating}.0 / 5.0 Rating
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Verified Purchase
                  </span>
                </div>

                {/* Comment */}
                <p className="text-sm sm:text-base text-neutral-800 leading-relaxed italic mb-4 font-normal">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 flex items-center justify-between text-xs relative z-10">
                <div>
                  <p className="font-bold text-neutral-900 font-['Outfit'] text-sm">{review.name}</p>
                  <p className="text-neutral-500 text-xs">{review.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-neutral-900 font-semibold text-xs truncate max-w-[140px] block">
                    {review.product}
                  </span>
                  <span className="text-neutral-600 text-xs">{review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-2">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Verified answers regarding manufacturer warranty, payment methods, and showroom pickup.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqList.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="py-1 border-b-0">
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
