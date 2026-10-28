import { create } from 'zustand'
import { CartItem, Product, ProductCategory } from '@/types/product'
import { storeDetails } from '@/data/mockProducts'

interface CartStore {
  // Cart
  cart: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addToCart: (
    product: Product,
    selectedVariant?: string,
    quantity?: number,
    variantPrice?: number,
    variantOriginalPrice?: number
  ) => void
  removeFromCart: (productId: string, selectedVariant?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void
  clearCart: () => void

  // Wishlist
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean

  // Quick View Modal
  quickViewProduct: Product | null
  setQuickViewProduct: (product: Product | null) => void

  // Filters
  selectedCategory: ProductCategory
  setSelectedCategory: (category: ProductCategory) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedBrand: string
  setSelectedBrand: (brand: string) => void

  // Computed Totals & Helpers
  getCartTotal: () => number
  getCartSavings: () => number
  getCartItemCount: () => number
  syncProductPrices: (latestProducts: Product[]) => void
  generateWhatsAppOrderUrl: () => string
  generateProductInquiryUrl: (product: Product, selectedVariant?: string, variantPrice?: number) => string
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),

  addToCart: (product, selectedVariant, quantity = 1, variantPrice, variantOriginalPrice) => {
    // Strict Out-of-Stock enforcement
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0
    const allVariantsOutOfStock = hasVariants && product.variants!.every((v) => !v.inStock || v.stockQuantity === 0)
    if (!product.inStock || product.stockQuantity === 0 || allVariantsOutOfStock) {
      return
    }

    // Resolve variant-specific pricing if variant is chosen
    const matchedVariant = selectedVariant && Array.isArray(product.variants)
      ? product.variants.find(
          (v) => v.name === selectedVariant || (v.options && v.options.includes(selectedVariant))
        )
      : undefined

    if (matchedVariant && (!matchedVariant.inStock || (matchedVariant.stockQuantity !== undefined && matchedVariant.stockQuantity === 0))) {
      return
    }

    const effectivePrice = variantPrice ?? matchedVariant?.price ?? product.price
    const effectiveOriginalPrice = variantOriginalPrice ?? matchedVariant?.originalPrice ?? product.originalPrice
    const effectiveStock = matchedVariant?.stockQuantity ?? product.stockQuantity ?? 999

    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      )

      if (existingIndex > -1) {
        const updated = [...state.cart]
        const newQty = Math.min(updated[existingIndex].quantity + quantity, effectiveStock)
        updated[existingIndex].quantity = newQty
        updated[existingIndex].selectedVariantPrice = effectivePrice
        updated[existingIndex].selectedVariantOriginalPrice = effectiveOriginalPrice
        return { cart: updated, isCartOpen: true }
      }

      const initialQty = Math.min(quantity, effectiveStock)
      if (initialQty <= 0) return state

      return {
        cart: [
          ...state.cart,
          {
            product,
            quantity: initialQty,
            selectedVariant,
            selectedVariantPrice: effectivePrice,
            selectedVariantOriginalPrice: effectiveOriginalPrice,
          },
        ],
        isCartOpen: true,
      }
    })
  },

  removeFromCart: (productId, selectedVariant) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === selectedVariant)
      ),
    }))
  },

  updateQuantity: (productId, quantity, selectedVariant) => {
    if (quantity <= 0) {
      get().removeFromCart(productId, selectedVariant)
      return
    }

    set((state) => ({
      cart: state.cart.map((item) => {
        if (item.product.id === productId && item.selectedVariant === selectedVariant) {
          const maxStock = item.product.stockQuantity !== undefined ? item.product.stockQuantity : 999
          const clamped = Math.min(quantity, maxStock)
          return { ...item, quantity: clamped }
        }
        return item
      }),
    }))
  },

  clearCart: () => set({ cart: [] }),

  wishlist: [],
  toggleWishlist: (productId) => {
    set((state) => {
      const exists = state.wishlist.includes(productId)
      return {
        wishlist: exists
          ? state.wishlist.filter((id) => id !== productId)
          : [...state.wishlist, productId],
      }
    })
  },
  isInWishlist: (productId) => get().wishlist.includes(productId),

  quickViewProduct: null,
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedBrand: 'all',
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),

  getCartTotal: () => {
    return get().cart.reduce((sum, item) => {
      const unitPrice = item.selectedVariantPrice ?? item.product.price
      return sum + unitPrice * item.quantity
    }, 0)
  },

  getCartSavings: () => {
    return get().cart.reduce((sum, item) => {
      const unitPrice = item.selectedVariantPrice ?? item.product.price
      const origPrice = item.selectedVariantOriginalPrice ?? item.product.originalPrice
      const savings = Math.max(0, origPrice - unitPrice)
      return sum + savings * item.quantity
    }, 0)
  },

  getCartItemCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0)
  },

  syncProductPrices: (latestProducts) => {
    set((state) => ({
      cart: state.cart.map((item) => {
        const fresh = latestProducts.find((p) => p.id === item.product.id)
        return fresh ? { ...item, product: fresh } : item
      }),
      quickViewProduct: state.quickViewProduct
        ? latestProducts.find((p) => p.id === state.quickViewProduct?.id) || state.quickViewProduct
        : null,
    }))
  },

  generateWhatsAppOrderUrl: () => {
    const { cart, getCartTotal } = get()
    if (cart.length === 0) return `https://wa.me/${storeDetails.whatsapp}?text=Hi%20Gayathri%20Communication,%20I%20would%20like%20to%20know%20about%20your%20latest%20offers.`

    const itemList = cart
      .map((item, index) => {
        const unitPrice = item.selectedVariantPrice ?? item.product.price
        return `${index + 1}. *${item.product.name}* ${item.selectedVariant ? `[Variant: ${item.selectedVariant}]` : ''} x ${item.quantity} - ₹${(unitPrice * item.quantity).toLocaleString('en-IN')}`
      })
      .join('\n')

    const cleanPhone = (storeDetails.whatsapp || '919842419358').replace(/\D/g, '')
    const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`

    const message = `🛍️ *NEW ORDER INQUIRY - GAYATHRI COMMUNICATION*\n\nHello, I would like to order/inquire about the following products:\n\n${itemList}\n\n*Total Amount:* ₹${getCartTotal().toLocaleString('en-IN')}\n\nPlease confirm stock availability and showroom pickup details.`

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`
  },

  generateProductInquiryUrl: (product: Product, selectedVariant?: string, variantPrice?: number) => {
    const cleanPhone = (storeDetails.whatsapp || '919842419358').replace(/\D/g, '')
    const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
    const price = variantPrice ?? product.price
    const origPrice = product.originalPrice ?? price
    const variantText = selectedVariant ? `\nVariant: ${selectedVariant}` : ''
    const isOutOfStock = !product.inStock || product.stockQuantity === 0
    const stockQuery = isOutOfStock
      ? `This model is currently marked as Out of Stock on your showroom site. When will fresh stock arrive at your showroom, or can I place a priority counter pre-booking?`
      : `Is this model currently available in stock at your showroom for same-day counter collection?`
    const message = `👋 Hi Gayathri Communication, I am interested in:\n\n*${product.name}*${variantText}\nPrice: ₹${price.toLocaleString('en-IN')}${origPrice > price ? ` (MRP: ₹${origPrice.toLocaleString('en-IN')})` : ''}\n\n${stockQuery}`
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`
  },
}))
