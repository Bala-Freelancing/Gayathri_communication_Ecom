export type ProductCategory =
  | 'all'
  | 'smartphones'
  | 'smart-tvs'
  | 'home-appliances'
  | 'accessories'
  | 'other-electronics'

export type ProductCategoryType = Exclude<ProductCategory, 'all'>

export interface ProductVariant {
  id?: string
  sku?: string
  name: string
  price?: number
  originalPrice?: number
  stockQuantity?: number
  inStock?: boolean
  attributes?: Record<string, string>
  options?: string[]
}

export interface Product {
  id: string
  name: string
  tagline: string
  description?: string
  brand: string
  category: ProductCategoryType
  badge?: string
  isBestSeller?: boolean
  isNewLaunch?: boolean
  isDealOfTheDay?: boolean
  originalPrice: number
  price: number
  rating: number
  reviewCount: number
  image: string
  gallery: string[]
  emiStartsAt: number
  warranty: string
  inStock: boolean
  stockQuantity?: number
  sku?: string
  specs: {
    label: string
    value: string
  }[]
  highlights: string[]
  variants?: ProductVariant[]
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVariant?: string
  selectedVariantPrice?: number
  selectedVariantOriginalPrice?: number
}

export interface StoreInfo {
  name: string
  tagline: string
  address: string
  landmark: string
  phone: string
  whatsapp: string
  email: string
  timing: string
  mapUrl: string
  isOpenNow: boolean
  instagram?: string
  instagramHandle?: string
  features: {
    icon: string
    title: string
    description: string
  }[]
}
