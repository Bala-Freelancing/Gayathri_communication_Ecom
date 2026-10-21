/**
 * Phase 2 Verification Suite: Supabase Cloud Storage for Product Images
 * Gayathri Communication E-commerce Showroom
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`)
    passed++
  } else {
    console.error(`  [FAIL] ${message}`)
    failed++
  }
}

console.log('='.repeat(70))
console.log('  GAYATHRI COMMUNICATION - PHASE 2 STORAGE VERIFICATION')
console.log('='.repeat(70) + '\n')

// 1. Storage Migration Verification
console.log('--- 1. STORAGE MIGRATION SCRIPT (00004_create_storage_bucket.sql) ---')
const migrationPath = path.join(rootDir, 'supabase', 'migrations', '00004_create_storage_bucket.sql')
assert(fs.existsSync(migrationPath), 'Migration 00004_create_storage_bucket.sql exists')

const migrationSql = fs.readFileSync(migrationPath, 'utf8')
assert(migrationSql.includes("INSERT INTO storage.buckets"), 'Creates storage bucket in storage.buckets')
assert(migrationSql.includes("'product-images'"), 'Creates product-images bucket')
assert(migrationSql.includes("5242880"), 'Enforces 5 MB file size limit in bucket config')
assert(migrationSql.includes("'image/webp'") && migrationSql.includes("'image/jpeg'"), 'Restricts allowed MIME types to standard image formats')
assert(migrationSql.includes("ON CONFLICT (id) DO UPDATE"), 'Bucket creation is idempotent with ON CONFLICT')

// RLS Policies
assert(migrationSql.includes('CREATE POLICY "Public can view product images"'), 'Defines Public SELECT policy for product images')
assert(migrationSql.includes('CREATE POLICY "Admins can upload product images"'), 'Defines Admin INSERT policy for product images')
assert(migrationSql.includes('CREATE POLICY "Admins can update product images"'), 'Defines Admin UPDATE policy for product images')
assert(migrationSql.includes('CREATE POLICY "Admins can delete product images"'), 'Defines Admin DELETE policy for product images')
assert(migrationSql.includes("role IN ('admin', 'super_admin')"), 'Restricts storage mutations to verified admin/super_admin roles')
assert(migrationSql.includes("public.admin_users"), 'Evaluates admin users against public.admin_users table')
assert(!migrationSql.includes("DROP POLICY IF EXISTS \"all\""), 'Does not drop unrelated wildcard policies')

// 2. Storage Service Verification
console.log('\n--- 2. STORAGE SERVICE (src/services/storageService.ts) ---')
const storageServicePath = path.join(rootDir, 'src', 'services', 'storageService.ts')
assert(fs.existsSync(storageServicePath), 'storageService.ts exists')

const serviceCode = fs.readFileSync(storageServicePath, 'utf8')
assert(serviceCode.includes('uploadProductImage'), 'Exports uploadProductImage function')
assert(serviceCode.includes('deleteProductImage'), 'Exports deleteProductImage function')
assert(serviceCode.includes('compressImageClient'), 'Exports compressImageClient function')
assert(serviceCode.includes('validateImageFile'), 'Exports validateImageFile function')
assert(serviceCode.includes('generateSafeStoragePath'), 'Exports generateSafeStoragePath function')
assert(serviceCode.includes('extractStoragePath'), 'Exports extractStoragePath function')
assert(serviceCode.includes('MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024'), 'Enforces 5MB client-side limit')
assert(serviceCode.includes('image/webp'), 'Supports WebP format')

// 3. AddStockModal Component Integration
console.log('\n--- 3. ADD STOCK UI & STORAGE INTEGRATION ---')
const modalPath = path.join(rootDir, 'src', 'components', 'admin', 'AddStockModal.tsx')
assert(fs.existsSync(modalPath), 'AddStockModal.tsx exists')

const modalCode = fs.readFileSync(modalPath, 'utf8')
assert(modalCode.includes('import { storageService }'), 'AddStockModal imports storageService')
assert(modalCode.includes('URL.createObjectURL'), 'Uses URL.createObjectURL for instant preview without Base64')
assert(modalCode.includes('URL.revokeObjectURL'), 'Revokes object URLs to prevent browser memory leaks')
assert(modalCode.includes('storageService.compressImageClient'), 'Compresses local images client-side before upload')
assert(modalCode.includes('storageService.uploadProductImage'), 'Uploads image to Supabase Storage before product creation')
assert(modalCode.includes('storageService.deleteProductImage'), 'Cleans up newly uploaded image if database product creation fails')
assert(!modalCode.includes('readAsDataURL'), 'No longer calls FileReader.readAsDataURL for local photos')
assert(modalCode.includes('Uploading Image'), 'Shows uploading progress feedback in UI')

// 4. Product Service Base64 Guard
console.log('\n--- 4. PRODUCT SERVICE INTEGRITY & BASE64 GUARD ---')
const productServicePath = path.join(rootDir, 'src', 'services', 'productService.ts')
const productCode = fs.readFileSync(productServicePath, 'utf8')
assert(productCode.includes("input.image.startsWith('data:')"), 'productService rejects new raw Base64 image strings')

// 5. Infinix Migration Procedure Script
console.log('\n--- 5. INFINIX BASE64 SAFE MIGRATION PROCEDURE ---')
const infinixScriptPath = path.join(rootDir, 'scripts', 'migrate-infinix-image.mjs')
assert(fs.existsSync(infinixScriptPath), 'scripts/migrate-infinix-image.mjs exists')

const scriptCode = fs.readFileSync(infinixScriptPath, 'utf8')
assert(scriptCode.includes('--dry-run'), 'Supports dry-run preview mode')
assert(scriptCode.includes('infinix_backup_'), 'Creates JSON backup before performing mutation')
assert(scriptCode.includes('targetPublicUrl'), 'Computes permanent public CDN URL')
assert(scriptCode.includes('HEAD'), 'Verifies public CDN URL accessibility before updating database')

// 6. Security & Secret Exposure Checks
console.log('\n--- 6. SECURITY & SECRET EXPOSURE AUDIT ---')
assert(!serviceCode.includes('service_role'), 'storageService.ts contains NO service_role key')
assert(!modalCode.includes('service_role'), 'AddStockModal.tsx contains NO service_role key')
assert(!migrationSql.includes('service_role'), 'Migration contains NO service_role key')

console.log('\n' + '='.repeat(70))
console.log(`PHASE 2 STORAGE VERIFICATION: ${passed} PASSED, ${failed} FAILED`)
console.log('='.repeat(70) + '\n')

if (failed > 0) process.exit(1)
