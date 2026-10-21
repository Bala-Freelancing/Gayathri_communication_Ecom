import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types/product'
import { productService } from '@/services/productService'
import { useCartStore } from '@/store/useCartStore'

export function useRealtimeProducts() {
  const [products, setProducts] = useState<Product[]>(productService.getAllProducts())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { syncProductPrices } = useCartStore()

  const refresh = useCallback(async () => {
    setIsLoading(true)
    const res = await productService.fetchProducts()
    setProducts(res.data)
    setError(res.error)
    setIsLoading(false)
    syncProductPrices(res.data)
  }, [syncProductPrices])

  useEffect(() => {
    let isMounted = true

    // 1. Subscribe to local service updates
    const unsubscribeLocal = productService.subscribeToChanges((freshProducts) => {
      if (isMounted) {
        setProducts(freshProducts)
        syncProductPrices(freshProducts)
      }
    })

    // 2. Initialize Supabase Realtime WebSocket listener
    const cleanupRealtime = productService.initRealtimeSync()

    // 3. Initial fetch without synchronous cascading setState
    productService.fetchProducts().then((res) => {
      if (isMounted) {
        setProducts(res.data)
        setError(res.error)
        syncProductPrices(res.data)
      }
    })

    return () => {
      isMounted = false
      unsubscribeLocal()
      cleanupRealtime()
    }
  }, [syncProductPrices])

  return {
    products,
    isLoading,
    isLiveDb: productService.isLiveDatabase(),
    error,
    refresh,
  }
}
