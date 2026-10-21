import React, { useState } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  Tag, 
  Store,
  Check,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { productService } from '@/services/productService'

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    getCartSavings,
    generateWhatsAppOrderUrl 
  } = useCartStore()

  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)

  // Server-side stock validation states
  const [isValidatingStock, setIsValidatingStock] = useState(false)
  const [stockValidationError, setStockValidationError] = useState<string | null>(null)

  const cartTotal = getCartTotal()
  const cartSavings = getCartSavings()

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    const code = couponCode.trim().toUpperCase()

    if (code === 'GAYATHRI500' || code === 'FESTIVE500') {
      if (cartTotal < 20000) {
        setCouponError('Promo code applies to cart orders above ₹20,000.')
        return
      }
      setCouponApplied(true)
      setDiscountAmount(500)
      setCouponError('')
    } else {
      setCouponError('Invalid promo code. Use "GAYATHRI500" for ₹500 off orders over ₹20,000.')
    }
  }

  const handleRemoveCoupon = () => {
    setCouponApplied(false)
    setDiscountAmount(0)
    setCouponCode('')
    setCouponError('')
  }

  const finalTotal = Math.max(0, cartTotal - discountAmount)

  const hasOutOfStock = cart.some((item) => !item.product.inStock || item.product.stockQuantity === 0)

  /**
   * WhatsApp Order Checkout Flow with Live Server-Side Stock Validation:
   * 
   * 1. Authoritative Validation:
   * Calls the PostgreSQL stored procedure `validate_order_stock` with the cart payload
   * ([{ product_id: string, quantity: number }]) before triggering the WhatsApp checkout redirect.
   * Client-side Zustand state is NOT treated as authoritative.
   * 
   * 2. Rejection & Refresh:
   * If stock is zero, product is missing, or requested quantity exceeds available inventory,
   * the WhatsApp redirect is strictly blocked, a clear error message is displayed,
   * and `productService.fetchProducts()` is invoked to synchronize the local inventory state.
   * 
   * 3. Architectural Limitation Notice:
   * WhatsApp checkout is an external enquiry and ordering mechanism, not a database-backed order management
   * or transaction system. Calling `validate_order_stock` validates live inventory availability at the
   * exact moment the customer clicks checkout; it does NOT lock or reserve stock in the database.
   * Final inventory availability is confirmed by showroom staff upon order processing.
   */
  const handleWhatsAppCheckout = async () => {
    setStockValidationError(null)

    if (cart.length === 0) return

    // Quick client-side check to prevent unnecessary requests
    if (hasOutOfStock) {
      setStockValidationError('Please remove out-of-stock items before submitting your order enquiry.')
      return
    }

    const itemsPayload = cart.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }))

    setIsValidatingStock(true)

    try {
      if (isSupabaseConfigured()) {
        const { data, error: rpcError } = await supabase.rpc('validate_order_stock', {
          p_items: itemsPayload,
        })

        if (rpcError) {
          setStockValidationError(`Stock verification error: ${rpcError.message}. Please try again.`)
          return
        }

        const validation = data as {
          valid: boolean
          errors?: Array<{
            product_id: string
            product_name?: string
            available_qty?: number
            requested_qty?: number
            error: string
          }>
          error?: string
        }

        if (!validation.valid) {
          let errorMsg = 'Stock validation failed.'
          if (validation.errors && validation.errors.length > 0) {
            errorMsg = validation.errors
              .map((e) => (e.product_name ? `${e.product_name}: ${e.error}` : e.error))
              .join('; ')
          } else if (validation.error) {
            errorMsg = validation.error
          }

          setStockValidationError(errorMsg)

          // Refresh client catalog to sync with updated showroom database inventory
          try {
            await productService.fetchProducts()
          } catch (syncErr) {
            console.error('Failed to refresh catalog after stock validation error:', syncErr)
          }

          return
        }
      } else {
        // Offline / Demo Mode: authoritative local catalog verification
        const allProducts = productService.getAllProducts()
        const localErrors: string[] = []

        for (const item of cart) {
          const fresh = allProducts.find((p) => p.id === item.product.id)
          if (!fresh) {
            localErrors.push(`${item.product.name}: Product not found in catalog`)
          } else if (!fresh.inStock || (fresh.stockQuantity !== undefined && fresh.stockQuantity <= 0)) {
            localErrors.push(`${item.product.name}: Product is currently Out of Stock`)
          } else if (fresh.stockQuantity !== undefined && item.quantity > fresh.stockQuantity) {
            localErrors.push(
              `${item.product.name}: Requested quantity (${item.quantity}) exceeds available showroom inventory (${fresh.stockQuantity})`
            )
          }
        }

        if (localErrors.length > 0) {
          setStockValidationError(localErrors.join('; '))
          return
        }
      }

      // Live stock verified — proceed to WhatsApp order inquiry
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch {
        // Graceful fallback
      }

      const url = generateWhatsAppOrderUrl()
      window.open(url, '_blank')
    } catch (err: any) {
      setStockValidationError(`Could not complete stock validation: ${err?.message || 'Network error'}`)
    } finally {
      setIsValidatingStock(false)
    }
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="flex flex-col justify-between w-full sm:max-w-md p-6 select-none bg-white">
        
        {/* Header */}
        <SheetHeader className="border-b border-neutral-200 pb-4 text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold font-['Outfit'] text-neutral-900">
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              Your Cart
              {cart.length > 0 && (
                <span className="text-xs bg-neutral-100 text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded-full font-sans">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              )}
            </SheetTitle>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-neutral-400 hover:text-rose-600 transition-colors font-medium"
                title="Clear all cart items"
              >
                Clear all
              </button>
            )}
          </div>
          <SheetDescription className="text-xs text-neutral-500">
            Box-packed authorized showroom stock with official invoice & warranty.
          </SheetDescription>
        </SheetHeader>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length > 0 ? (
            cart.map((item) => {
              const itemOutOfStock = !item.product.inStock || item.product.stockQuantity === 0
              const maxStock = item.product.stockQuantity !== undefined ? item.product.stockQuantity : 999

              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                  className={`flex gap-3 p-3 rounded-xl border shadow-2xs ${
                    itemOutOfStock ? 'bg-rose-50/50 border-rose-200' : 'bg-neutral-50 border-neutral-200/80'
                  }`}
                >
                  {/* Product Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-white border border-neutral-200 shrink-0 p-1 flex items-center justify-center relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.src.endsWith('/images/placeholder-product.svg')) {
                          target.src = '/images/placeholder-product.svg'
                        }
                      }}
                      className="max-h-full max-w-full object-contain drop-shadow-2xs"
                    />
                    {itemOutOfStock && (
                      <span className="absolute inset-0 bg-neutral-900/60 rounded-lg flex items-center justify-center text-[9px] font-bold text-white uppercase text-center px-1">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Info & Controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-neutral-900 font-['Outfit'] line-clamp-1">
                            {item.product.name}
                          </h4>
                          {itemOutOfStock && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-neutral-500 block">
                            Variant: {item.selectedVariant}
                          </span>
                        )}
                        <span className="text-xs font-extrabold text-neutral-900 mt-0.5 block">
                          {formatINR(item.product.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                        className="w-6 h-6 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 flex items-center justify-center text-neutral-700 text-xs transition-colors shadow-2xs"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-neutral-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        disabled={itemOutOfStock || item.quantity >= maxStock}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                        className="w-6 h-6 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-neutral-700 text-xs transition-colors shadow-2xs"
                        aria-label="Increase quantity"
                        title={item.quantity >= maxStock ? `Only ${maxStock} in showroom stock` : 'Increase quantity'}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      {item.product.stockQuantity !== undefined && item.product.stockQuantity > 0 && item.product.stockQuantity <= 3 && (
                        <span className="text-[10px] text-amber-700 font-medium">
                          Only {item.product.stockQuantity} left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-neutral-900 font-['Outfit']">Your Cart is Empty</p>
              <p className="text-xs text-neutral-500 max-w-[240px] mx-auto">
                Explore our showroom catalogue of genuine smartphones, Smart TVs, and appliances.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs border-neutral-300 text-neutral-900 shadow-2xs"
              >
                Browse Products
              </Button>
            </div>
          )}
        </div>

        {/* Footer & Order Summary */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-neutral-200 space-y-4">
            
            {/* Promo Code input */}
            {!couponApplied ? (
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. GAYATHRI500)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value)
                        setCouponError('')
                      }}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 uppercase focus:outline-none focus:border-neutral-900 shadow-2xs"
                    />
                  </div>
                  <Button type="submit" variant="secondary" size="sm" className="text-xs font-semibold">
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-amber-700 pl-1">{couponError}</p>
                )}
              </form>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Coupon {couponCode.toUpperCase()}: ₹500 Discount</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-neutral-500 hover:text-neutral-800 flex items-center gap-0.5 text-[11px]"
                  title="Remove coupon"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-neutral-900 font-semibold">{formatINR(cartTotal)}</span>
              </div>

              {cartSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Showroom Savings</span>
                  <span>- {formatINR(cartSavings)}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>- {formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>In-Store Pickup & Demo</span>
                <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE (60-MIN)</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200 font-['Outfit']">
                <span>Estimated Total</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Action Buttons: WhatsApp Instant Order & Store Pickup */}
            <div className="space-y-2">
              {hasOutOfStock ? (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-center font-medium">
                  ⚠️ Some items in your cart are Out of Stock. Please remove them to proceed with your order.
                </div>
              ) : null}

              {stockValidationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Showroom Stock Validation Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{stockValidationError}</p>
                </div>
              )}

              <Button
                disabled={hasOutOfStock || isValidatingStock}
                onClick={handleWhatsAppCheckout}
                variant="whatsapp"
                className="w-full gap-2 text-sm font-bold h-12 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidatingStock ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying Showroom Stock...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    {hasOutOfStock ? 'Remove Out-of-Stock Items to Order' : 'Inquire & Order via WhatsApp'}
                  </>
                )}
              </Button>

              <div className="space-y-1 text-center pt-1">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                  <Store className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Visit showroom to collect in 60 mins with demo & unboxing</span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  * WhatsApp checkout verifies live showroom inventory at inquiry time. Stock is finalized upon showroom reservation.
                </p>
              </div>
            </div>

          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}
