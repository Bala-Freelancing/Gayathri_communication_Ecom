import { Product } from '@/types/product'

/** Months used for the indicative "EMI from" figure shown to customers. */
export const EMI_TENURE_MONTHS = 12
export const EMI_DISCLAIMER = `Indicative ${EMI_TENURE_MONTHS}-month EMI. Final EMI and eligibility are decided by Bajaj Finserv.`

/** Indicative monthly EMI for a price (rounded up to the rupee). 0 for tiny prices. */
export function emiPerMonth(price: number): number {
  if (!price || price < 3000) return 0
  return Math.ceil(price / EMI_TENURE_MONTHS)
}

export interface ConcreteVariant {
  id: string
  name: string
  price: number
  originalPrice: number
  inStock: boolean
  stockQuantity: number
}

/** Normalises a product's variants (old "options" format and per-variant pricing). */
export function getConcreteVariants(product: Product): ConcreteVariant[] {
  if (!product.variants || product.variants.length === 0) return []
  const parentOut = !product.inStock || product.stockQuantity === 0

  const first = product.variants[0]
  if (first.options && Array.isArray(first.options) && first.price === undefined) {
    return first.options.map((opt, i) => ({
      id: `var-opt-${i}`,
      name: opt,
      price: product.price,
      originalPrice: product.originalPrice,
      inStock: !parentOut && product.inStock,
      stockQuantity: parentOut ? 0 : product.stockQuantity ?? 10,
    }))
  }

  return product.variants.map((v, i) => {
    const qty = parentOut ? 0 : v.stockQuantity ?? product.stockQuantity ?? 10
    const inStock = !parentOut && (v.inStock ?? product.inStock) && qty > 0
    return {
      id: v.id || `var-${i}`,
      name: v.name,
      price: v.price ?? product.price,
      originalPrice: v.originalPrice && v.originalPrice > 0 ? v.originalPrice : product.originalPrice,
      inStock,
      stockQuantity: qty,
    }
  })
}

export const productPath = (product: Pick<Product, 'id'>) => `/product/${encodeURIComponent(product.id)}`

export const CATEGORY_NAMES: Record<string, string> = {
  smartphones: 'Smartphones',
  'smart-tvs': 'Smart TVs',
  'home-appliances': 'Home Appliances',
  accessories: 'Accessories',
  'other-electronics': 'Other Electronics',
}
