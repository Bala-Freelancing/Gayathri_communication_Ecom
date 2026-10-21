import { create } from 'zustand'
import { CartItem, Product, ProductCategory } from '@/types/product'
import { storeDetails } from '@/data/mockProducts'

interface CartStore {
  // Cart
  cart: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addToCart: (product: Product, selectedVariant?: string, quantity?: number) => void
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
  generateProductInquiryUrl: (product: Product) => string
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),

  addToCart: (product, selectedVariant, quantity = 1) => {
    // Phase 7: Strict Out-of-Stock enforcement
    // If stock is zero or product is out of stock, reject immediately
    if (!product.inStock || product.stockQuantity === 0) {
      return
    }

    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      )

      const maxStock = product.stockQuantity !== undefined ? product.stockQuantity : 999

      if (existingIndex > -1) {
        const updated = [...state.cart]
        const newQty = Math.min(updated[existingIndex].quantity + quantity, maxStock)
        updated[existingIndex].quantity = newQty
        return { cart: updated, isCartOpen: true }
      }

      const initialQty = Math.min(quantity, maxStock)
      if (initialQty <= 0) return state

      return {
        cart: [...state.cart, { product, quantity: initialQty, selectedVariant }],
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
    return get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },

  getCartSavings: () => {
    return get().cart.reduce(
      (sum, item) => sum + (item.product.originalPrice - item.product.price) * item.quantity,
      0
    )
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
      .map(
        (item, index) =>
          `${index + 1}. *${item.product.name}* ${item.selectedVariant ? `(${item.selectedVariant})` : ''} x ${item.quantity} - ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
      )
      .join('\n')

    const message = `🛍️ *NEW ORDER INQUIRY - GAYATHRI COMMUNICATION*\n\nHello, I would like to order/inquire about the following products:\n\n${itemList}\n\n*Total Amount:* ₹${getCartTotal().toLocaleString('en-IN')}\n\nPlease confirm availability and payment/EMI/pickup options.`

    return `https://wa.me/${storeDetails.whatsapp}?text=${encodeURIComponent(message)}`
  },

  generateProductInquiryUrl: (product: Product) => {
    const message = `👋 Hi Gayathri Communication, I am interested in:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')} (MRP: ₹${product.originalPrice.toLocaleString('en-IN')})\nEMI from: ₹${product.emiStartsAt.toLocaleString('en-IN')}/mo\n\nIs this currently available in stock at your store?`
    return `https://wa.me/${storeDetails.whatsapp}?text=${encodeURIComponent(message)}`
  },
}))
