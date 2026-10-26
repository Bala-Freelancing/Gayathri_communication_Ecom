import React from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'
import confetti from 'canvas-confetti'

export const MinimalCartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    generateWhatsAppOrderUrl 
  } = useCartStore()

  if (!isCartOpen) return null

  const cartTotal = getCartTotal()

  const handleWhatsAppCheckout = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    })
    const url = generateWhatsAppOrderUrl()
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-neutral-900 border-l border-neutral-100 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-xl font-bold font-['Outfit'] text-neutral-950">
              Shopping Bag
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {cart.reduce((s, i) => s + i.quantity, 0)} items in your cart
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                className="flex gap-4 p-3.5 rounded-2xl bg-[#f8f9fa] border border-neutral-100"
              >
                <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-neutral-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between text-left">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 font-['Outfit'] line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.selectedVariant && (
                        <span className="text-[10px] text-neutral-500 block">
                          Size: {item.selectedVariant}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-neutral-900 mt-0.5 block font-['Outfit']">
                        {formatINR(item.selectedVariantPrice ?? item.product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                      className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                      className="w-6 h-6 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 text-xs hover:bg-neutral-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-neutral-800 min-w-[18px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                      className="w-6 h-6 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 text-xs hover:bg-neutral-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-800">Your bag is empty</p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Explore our minimal collection of original smartphones, OLED TVs, and appliances.
              </p>
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="text-lg font-bold text-neutral-950 font-['Outfit']">
                {formatINR(cartTotal)}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              Tax invoice & standard warranty included. Free express store pickup.
            </p>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Checkout via WhatsApp</span>
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
