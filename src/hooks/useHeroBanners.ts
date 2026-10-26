import { useState, useEffect } from 'react'
import { HeroSlideConfig } from '@/types/heroBanner'
import { heroBannerService, DEFAULT_HERO_SLIDES } from '@/services/heroBannerService'

export function useHeroBanners(includeInactive = false) {
  const [slides, setSlides] = useState<HeroSlideConfig[]>(() => 
    heroBannerService.getSlides(includeInactive)
  )

  useEffect(() => {
    const unsubscribe = heroBannerService.subscribe((allSlides) => {
      if (includeInactive) {
        setSlides(allSlides)
      } else {
        const active = allSlides.filter((s) => s.isActive !== false)
        setSlides(active.length > 0 ? active : DEFAULT_HERO_SLIDES)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [includeInactive])

  return {
    slides,
    saveSlide: heroBannerService.saveSlide,
    updateSlide: heroBannerService.updateSlide,
    toggleSlideActive: heroBannerService.toggleSlideActive,
    deleteSlide: heroBannerService.deleteSlide,
    reorderSlides: heroBannerService.reorderSlides,
    moveSlide: heroBannerService.moveSlide,
    resetToDefaults: heroBannerService.resetToDefaults,
  }
}
