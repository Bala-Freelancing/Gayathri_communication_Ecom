import { useState, useEffect } from 'react'
import { HeroSlideConfig } from '@/types/heroBanner'
import { heroBannerService, DEFAULT_HERO_SLIDES } from '@/services/heroBannerService'

function pick(all: HeroSlideConfig[], includeInactive: boolean) {
  if (includeInactive) return all
  const active = all.filter((s) => s.isActive !== false)
  return active.length > 0 ? active : DEFAULT_HERO_SLIDES
}

export function useHeroBanners(includeInactive = false) {
  const [slides, setSlides] = useState<HeroSlideConfig[]>(() => heroBannerService.getSlides(includeInactive))
  const [isLoaded, setIsLoaded] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    return heroBannerService.subscribe((state) => {
      setSlides(pick(state.slides, includeInactive))
      setIsLoaded(state.isLoaded)
      setSyncError(state.syncError)
    })
  }, [includeInactive])

  return {
    slides,
    isLoaded,
    syncError,
    clearSyncError: heroBannerService.clearSyncError,
    saveSlide: heroBannerService.saveSlide,
    updateSlide: heroBannerService.updateSlide,
    toggleSlideActive: heroBannerService.toggleSlideActive,
    deleteSlide: heroBannerService.deleteSlide,
    reorderSlides: heroBannerService.reorderSlides,
    moveSlide: heroBannerService.moveSlide,
    resetToDefaults: heroBannerService.resetToDefaults,
  }
}
