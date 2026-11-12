import React from 'react'
import { Star, ExternalLink } from 'lucide-react'
import { productService } from '@/services/productService'
import { storeDetails } from '@/data/mockProducts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const ReviewsSection: React.FC = () => {
  const faqList = productService.getFaqList()

  return (
    <section className="py-8 sm:py-10 bg-neutral-50/50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Reviews: link to the shop's real Google reviews instead of showing
            hand-written testimonials (which were not from real customers). */}
        <div className="mx-auto mb-10 max-w-3xl rounded-3xl bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-['Outfit'] tracking-tight">
              What our customers say
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Read genuine reviews from customers in Manachanallur and Trichy on Google, or leave your own after your visit.
            </p>
          </div>
          <a
            href={storeDetails.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Read reviews on Google
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
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
