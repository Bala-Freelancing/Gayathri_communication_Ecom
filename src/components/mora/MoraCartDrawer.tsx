import React from 'react'
import { X, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatINR } from '@/lib/utils'

export const MoraCartDrawer: React.FC = () => {
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
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Floating Cart Card matching Screenshot 2 */}
      <div className="relative w-full max-w-md bg-[#0e0e0e] rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-6 sm:p-8 text-neutral-200 flex flex-col justify-between max-h-[90vh]">
        
        {/* Header matching Screenshot 2: "Cart" with count + ✕ */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="font-serif text-xl font-light text-white tracking-wide">
            Cart
          </h3>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400">
              {itemCount}
            </span>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item List matching Screenshot 2 */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/50 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="text-left space-y-0.5">
                    <h4 className="font-serif text-sm font-medium text-white line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="font-mono text-[10px] text-neutral-500">
                      {item.selectedVariant || 'Black'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-md px-1.5 py-0.5 text-xs font-mono">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="min-w-[12px] text-center text-white text-[11px]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p className="font-mono text-xs text-white">
                    {formatINR((item.selectedVariantPrice ?? item.product.price) * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                    className="text-neutral-500 hover:text-red-400 text-xs block ml-auto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3 font-mono">
              <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">Your bag is empty.</p>
            </div>
          )}
        </div>

        {/* Footer with Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-neutral-400">Total</span>
              <span className="text-base font-bold text-white">
                {formatINR(cartTotal)}
              </span>
            </div>

            <a
              href={generateWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all uppercase"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Checkout with WhatsApp</span>
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
