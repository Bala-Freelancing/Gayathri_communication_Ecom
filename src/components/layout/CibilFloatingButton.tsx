import React, { useEffect, useState } from 'react'
import { Gauge, ArrowUpRight } from 'lucide-react'

/**
 * Bajaj Finserv store QR link for Gayathri Communication (from the in-store
 * "Scan the QR" poster). It opens the shop's official Bajaj Finserv page where
 * the customer verifies their mobile number and sees EMI / credit eligibility.
 * Keep the short link (not the long redirect target) so the shop's tracking
 * code always stays attached.
 */
export const BAJAJ_STORE_QR_URL = 'https://bfin.in/?2ZWCG7OI'

export const CibilFloatingButton: React.FC = () => {
  const [visible, setVisible] = useState(false)

  // Slide in shortly after load so it doesn't compete with the hero on first paint.
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <a
      href={BAJAJ_STORE_QR_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Check CIBIL score and instant EMI eligibility with Bajaj Finserv (opens in a new tab)"
      className={`group fixed z-40 right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:right-6 sm:bottom-6
        flex items-center gap-3 rounded-full bg-[#0f1115] py-2 pl-2 pr-4 sm:pr-5 text-white
        shadow-[0_10px_30px_-8px_rgba(15,17,21,0.55)] ring-1 ring-white/10
        transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(15,17,21,0.65)]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500
        motion-reduce:transition-none
        ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
        <span className="absolute inset-0 rounded-full bg-emerald-400/60 motion-safe:animate-ping [animation-duration:2.4s] [animation-iteration-count:3]" aria-hidden="true" />
        <Gauge className="relative h-5 w-5 text-white" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">Check CIBIL Score</span>
        <span className="text-[11px] text-neutral-400">Instant EMI eligibility · Bajaj Finserv</span>
      </span>
      <ArrowUpRight
        className="hidden h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white sm:block"
        aria-hidden="true"
      />
    </a>
  )
}
