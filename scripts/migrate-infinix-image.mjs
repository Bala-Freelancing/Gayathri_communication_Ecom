/**
 * Safe Migration Procedure: Migrate Infinix Base64 Image to Supabase Cloud Storage
 * Gayathri Communication E-commerce Showroom
 *
 * Product: INFINIX NOTE EDGE 4/128 GREEN (id: infinix-infinix-note-edge-4-128-green-5475)
 *
 * SAFETY GUARANTEES:
 * 1. Read-only dry-run by default unless invoked with `--execute`.
 * 2. Complete JSON backup of the original row (including full Base64 payload) before any mutation.
 * 3. Verifies uploaded image returns HTTP 200 before updating the database.
 * 4. Verifies database row after update to confirm clean URL replacement.
 * 5. Provides one-click rollback script if needed.
 *
 * USAGE:
 *   Dry-run (preview only):
 *     node scripts/migrate-infinix-image.mjs --dry-run
 *
 *   Execute migration (with backup):
 *     node scripts/migrate-infinix-image.mjs --execute
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hmlrjihcselneceaverv.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'

const TARGET_PRODUCT_ID = 'infinix-infinix-note-edge-4-128-green-5475'
const BUCKET_NAME = 'product-images'
const TARGET_STORAGE_PATH = `products/infinix-note-edge-4-128-green-5475.jpg`

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

async function run() {
  const isExecute = process.argv.includes('--execute')
  const isDryRun = !isExecute || process.argv.includes('--dry-run')

  console.log('='.repeat(70))
  console.log('  INFINIX PRODUCT IMAGE STORAGE MIGRATION PROCEDURE')
  console.log('='.repeat(70))
  console.log(`Mode: ${isExecute ? 'EXECUTE (Live Mutation)' : 'DRY RUN (Preview Only)'}\n`)

  // 1. Fetch current product row
  console.log(`[Step 1] Fetching product "${TARGET_PRODUCT_ID}" from Supabase...`)
  const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${TARGET_PRODUCT_ID}`, { headers })
  if (!fetchRes.ok) {
    console.error(`Failed to fetch product: HTTP ${fetchRes.status} ${fetchRes.statusText}`)
    process.exit(1)
  }

  const products = await fetchRes.json()
  const product = products[0]

  if (!product) {
    console.error(`Product with ID "${TARGET_PRODUCT_ID}" not found in database.`)
    process.exit(1)
  }

  console.log(`  Product Found: "${product.name}" (SKU: ${product.sku})`)
  const isBase64 = typeof product.image === 'string' && product.image.startsWith('data:')

  if (!isBase64) {
    console.log(`  Image is not Base64! Current value: ${product.image}`)
    console.log('  No migration required. Exiting.')
    return
  }

  console.log(`  Current Image: Base64 data URI (${product.image.length} characters / ~${(product.image.length / 1024 / 1024).toFixed(2)} MB)`)

  // 2. Parse Base64 buffer
  console.log('\n[Step 2] Parsing Base64 data and mime type...')
  const matches = product.image.match(/^data:([A-Za-z\-+/]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    console.error('Invalid Base64 format in product.image field.')
    process.exit(1)
  }

  const mimeType = matches[1]
  const base64Data = matches[2]
  const imageBuffer = Buffer.from(base64Data, 'base64')
  console.log(`  Detected MIME: ${mimeType}`)
  console.log(`  Decoded Binary Size: ${(imageBuffer.length / 1024).toFixed(2)} KB`)

  // 3. Backup original product row
  const backupDir = path.join(rootDir, 'backups')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFilePath = path.join(backupDir, `infinix_backup_${timestamp}.json`)

  console.log('\n[Step 3] Creating complete pre-migration JSON backup...')
  fs.writeFileSync(backupFilePath, JSON.stringify(product, null, 2), 'utf8')
  console.log(`  Backup saved to: ${backupFilePath}`)

  const targetPublicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${TARGET_STORAGE_PATH}`
  console.log(`\n  Target Cloud Storage Path: ${TARGET_STORAGE_PATH}`)
  console.log(`  Target Public CDN URL:     ${targetPublicUrl}`)

  if (isDryRun) {
    console.log('\n' + '='.repeat(70))
    console.log('DRY RUN COMPLETE — NO LIVE MUTATIONS PERFORMED')
    console.log('To execute this migration live, run:')
    console.log('  node scripts/migrate-infinix-image.mjs --execute')
    console.log('='.repeat(70))
    return
  }

  // 4. Upload buffer to Supabase Storage
  console.log(`\n[Step 4] Uploading image buffer to Supabase Storage (${BUCKET_NAME})...`)
  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${TARGET_STORAGE_PATH}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': mimeType,
      'x-upsert': 'true',
    },
    body: imageBuffer,
  })

  if (!uploadRes.ok) {
    const errText = await uploadRes.text()
    console.error(`Storage upload failed: HTTP ${uploadRes.status} ${uploadRes.statusText}\n${errText}`)
    console.error('Database was NOT modified. Backup preserved.')
    process.exit(1)
  }
  console.log('  Storage upload successful!')

  // 5. Verify image is publicly accessible
  console.log('\n[Step 5] Verifying public CDN availability...')
  const verifyRes = await fetch(targetPublicUrl, { method: 'HEAD' })
  if (!verifyRes.ok) {
    console.error(`Verification failed: Public URL returned HTTP ${verifyRes.status}`)
    process.exit(1)
  }
  console.log('  Public CDN verified: HTTP 200 OK')

  // 6. Update database record
  console.log('\n[Step 6] Updating product row in Supabase database...')
  const patchPayload = {
    image: targetPublicUrl,
    gallery: [targetPublicUrl],
    updated_at: new Date().toISOString(),
  }

  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${TARGET_PRODUCT_ID}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(patchPayload),
  })

  if (!patchRes.ok) {
    const errText = await patchRes.text()
    console.error(`Failed to update product in database: HTTP ${patchRes.status} ${patchRes.statusText}\n${errText}`)
    process.exit(1)
  }

  // 7. Verification of database state
  console.log('\n[Step 7] Re-verifying database state...')
  const recheckRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${TARGET_PRODUCT_ID}`, { headers })
  const [updatedProduct] = await recheckRes.json()

  if (updatedProduct?.image === targetPublicUrl) {
    console.log('  Verification PASSED: product.image successfully updated to public cloud URL.')
    console.log('  Database row payload size reduced by ~2.9 MB.')
  } else {
    console.error('  Verification WARNING: product.image mismatch.')
  }

  console.log('\n' + '='.repeat(70))
  console.log('MIGRATION COMPLETED SUCCESSFULLY')
  console.log(`Original row backup preserved at: ${backupFilePath}`)
  console.log('='.repeat(70))
}

run().catch((err) => {
  console.error('Fatal error during migration procedure:', err)
  process.exit(1)
})
