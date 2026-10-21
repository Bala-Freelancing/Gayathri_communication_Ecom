/**
 * Supabase Storage Service for Product Images
 * Gayathri Communication E-commerce Showroom
 *
 * Provides:
 * - Typed upload helper for permanent Supabase Storage
 * - Client-side image compression to WebP to minimize bandwidth & storage usage
 * - File validation (MIME type, 5MB size limit)
 * - Safe unique collision-resistant filename generation
 * - Rollback/cleanup capability for failed product creations
 * - Zero secret leakage: uses standard authenticated client or anon key with Storage RLS
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const PRODUCT_IMAGES_BUCKET = 'product-images'
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]

export interface StorageUploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export interface StorageDeleteResult {
  success: boolean
  error?: string
}

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validates file size and image MIME type
 */
export const validateImageFile = (file: File): ImageValidationResult => {
  if (!file) {
    return { valid: false, error: 'No image file provided.' }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type || 'unknown'}). Allowed: JPEG, PNG, WebP, AVIF.`,
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `Image size (${sizeMb} MB) exceeds maximum allowed limit of 5 MB.`,
    }
  }

  return { valid: true }
}

/**
 * Generates a clean, collision-resistant storage path
 * Format: products/<sanitized-slug>-<timestamp>-<random-hex>.<ext>
 */
export const generateSafeStoragePath = (file: File, prefixSlug?: string): string => {
  const extFromName = file.name ? file.name.split('.').pop()?.toLowerCase() : ''
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
  }
  const extension = mimeMap[file.type] || extFromName || 'webp'

  const baseSlug = (prefixSlug || file.name || 'product')
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // remove extension if in slug
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, '') // trim leading/trailing hyphens
    .substring(0, 40) || 'product'

  const timestamp = Date.now()
  const randomHex = Math.random().toString(36).substring(2, 8)

  return `products/${baseSlug}-${timestamp}-${randomHex}.${extension}`
}

/**
 * Client-side Canvas Image Compression
 * Resizes large images to max 1600px dimension and converts to WebP format.
 * Reduces storage usage and improves mobile loading speed.
 */
export const compressImageClient = async (
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<File> => {
  // If not running in a browser environment or canvas is unavailable, return original
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file
  }

  const maxWidth = options.maxWidth || 1600
  const maxHeight = options.maxHeight || 1600
  const quality = options.quality !== undefined ? options.quality : 0.85

  return new Promise((resolve) => {
    try {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(objectUrl)

        let { width, height } = img

        // If image is already smaller than max bounds and already WebP, return original
        if (width <= maxWidth && height <= maxHeight && file.type === 'image/webp') {
          resolve(file)
          return
        }

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            // Only use compressed blob if it's actually smaller than the original
            if (blob.size < file.size) {
              const baseName = file.name.replace(/\.[^/.]+$/, '')
              const compressedFile = new File([blob], `${baseName}.webp`, {
                type: 'image/webp',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(file)
      }

      img.src = objectUrl
    } catch {
      resolve(file)
    }
  })
}

/**
 * Uploads a validated product image to Supabase Storage bucket 'product-images'
 * Returns the permanent public CDN URL and the relative storage path.
 */
export const uploadProductImage = async (
  file: File,
  prefixSlug?: string
): Promise<StorageUploadResult> => {
  const validation = validateImageFile(file)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured. Cloud storage upload requires active Supabase credentials.',
    }
  }

  const storagePath = generateSafeStoragePath(file, prefixSlug)

  try {
    const { data, error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data?.path) {
      return { success: false, error: 'Upload succeeded but storage path was not returned.' }
    }

    const { data: publicUrlData } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unexpected network error during storage upload.',
    }
  }
}

/**
 * Extracts the relative bucket path from a full public URL or relative path
 */
export const extractStoragePath = (pathOrUrl: string): string => {
  if (!pathOrUrl) return ''
  // If full Supabase storage public URL
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`
  const index = pathOrUrl.indexOf(marker)
  if (index !== -1) {
    return pathOrUrl.substring(index + marker.length)
  }
  return pathOrUrl
}

/**
 * Deletes an uploaded image from Supabase Storage
 * Used for cleaning up newly uploaded files if subsequent product creation fails.
 */
export const deleteProductImage = async (pathOrUrl: string): Promise<StorageDeleteResult> => {
  if (!pathOrUrl) {
    return { success: true }
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const relativePath = extractStoragePath(pathOrUrl)
  if (!relativePath || relativePath.startsWith('/images/')) {
    // Never attempt to delete local static bundle assets
    return { success: true }
  }

  try {
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([relativePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to remove file from storage.',
    }
  }
}

/**
 * Utility checks for image URL classification
 */
export const storageService = {
  uploadProductImage,
  deleteProductImage,
  compressImageClient,
  validateImageFile,
  generateSafeStoragePath,
  extractStoragePath,

  isStorageUrl: (url: string): boolean => {
    return typeof url === 'string' && url.includes(`/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`)
  },

  isLocalPath: (url: string): boolean => {
    return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
  },

  isBase64: (url: string): boolean => {
    return typeof url === 'string' && url.startsWith('data:')
  },

  isExternalUrl: (url: string): boolean => {
    return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))
  },
}
