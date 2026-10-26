export interface HeroSlideConfig {
  id: string
  productId: string
  matchKeywords: string[]
  brandTag: string
  badgeText: string
  kicker: string
  modelName: string
  headline: string
  shortLabel: string
  description: string
  specs: string[]
  image: string
  imageAlt: string
  fallbackPrice: number
  fallbackOriginalPrice: number
  primaryCtaText: string
  secondaryCtaText: string
  isActive?: boolean
  orderIndex?: number
  updatedAt?: string
}
