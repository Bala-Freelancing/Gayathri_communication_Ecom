import React, { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'

/**
 * "New branch opening soon" announcement shown when the homepage opens.
 * - Closes by itself after DISPLAY_MS (a bar shows the time left).
 * - Customers can close it earlier (✕, Esc, or tapping outside).
 * - Shown once per browser session so returning to the homepage doesn't nag.
 * Set NEW_BRANCH_POPUP_ENABLED to false once the branch has opened.
 */
export const NEW_BRANCH_POPUP_ENABLED = true
const DISPLAY_MS = 7000
const SESSION_KEY = 'gc_new_branch_popup_seen_v1'

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* storage blocked: popup may show again, which is harmless */
  }
}

export const NewBranchPopup: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  // The 7-second countdown starts only once the image is visible (slow mobile data).
  const [imgReady, setImgReady] = useState(false)

  useEffect(() => {
    if (!NEW_BRANCH_POPUP_ENABLED || alreadySeen()) return
    markSeen()
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setLeaving(true)
    window.setTimeout(() => setOpen(false), 250)
  }, [])

  // Auto-close 7 seconds after the image appears
  useEffect(() => {
    if (!open || !imgReady) return
    const t = window.setTimeout(close, DISPLAY_MS)
    return () => window.clearTimeout(t)
  }, [open, imgReady, close])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-5 transition-opacity duration-300 motion-reduce:transition-none ${
        leaving ? 'opacity-0' : 'opacity-100 animate-[gcFadeIn_.3s_ease-out]'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-branch-title"
    >
      <style>{`
        @keyframes gcFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes gcPopIn { from { opacity: 0; transform: translateY(12px) scale(.96) } to { opacity: 1; transform: none } }
        @keyframes gcCountdown { from { transform: scaleX(1) } to { transform: scaleX(0) } }
        @media (prefers-reduced-motion: reduce) { .gc-pop { animation: none !important } }
      `}</style>

      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-[2px] cursor-default" onClick={close} aria-label="Close announcement" />

      <div
        className={`gc-pop relative w-full max-w-[420px] overflow-hidden rounded-[28px] bg-[#14161B] shadow-2xl ring-1 ring-[#D4A84B]/40 transition-transform duration-300 ${
          leaving ? 'scale-95' : 'animate-[gcPopIn_.4s_cubic-bezier(.2,.8,.2,1)]'
        }`}
      >
        <h2 id="new-branch-title" className="sr-only">
          Gayathri Communication – new branch opening soon
        </h2>
        <img
          src="/images/new-branch-opening.webp"
          alt="Exciting news: Gayathri Communication new branch opening soon. Same trusted showroom, now closer to you. Mobiles, Smart TVs and Home Appliances."
          width={720}
          height={720}
          className="block h-auto w-full"
          fetchPriority="high"
          onLoad={() => setImgReady(true)}
          onError={close}
        />

        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A84B]"
          aria-label="Close"
          autoFocus
        >
          <X className="h-5 w-5" />
        </button>

        {/* time-left bar */}
        {imgReady && <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/10" aria-hidden="true">
          <div
            className="h-full origin-left bg-gradient-to-r from-[#F2D58C] to-[#A97C2C] motion-reduce:hidden"
            style={{ animation: `gcCountdown ${DISPLAY_MS}ms linear forwards` }}
          />
        </div>}
      </div>
    </div>
  )
}
