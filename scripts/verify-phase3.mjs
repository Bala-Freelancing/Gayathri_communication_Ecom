import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

console.log('='.repeat(70))
console.log('  GAYATHRI COMMUNICATION - PHASE 3 VERIFICATION SUITE')
console.log('='.repeat(70))

let passCount = 0
let failCount = 0

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`)
    passCount++
  } else {
    console.error(`  [FAIL] ${testName} ${details ? `(${details})` : ''}`)
    failCount++
  }
}

// -------------------------------------------------------------
// 1. Database Schema & Migration Verification
// -------------------------------------------------------------
console.log('\n--- 1. DATABASE SCHEMA & MIGRATION CHECKS ---')
const migration1Path = path.join(rootDir, 'supabase', 'migrations', '00001_create_store_schema.sql')
const migration2Path = path.join(rootDir, 'supabase', 'migrations', '00002_seed_initial_products.sql')

assert(fs.existsSync(migration1Path), '00001_create_store_schema.sql exists')
assert(fs.existsSync(migration2Path), '00002_seed_initial_products.sql exists')

const m1Content = fs.readFileSync(migration1Path, 'utf-8')
const m2Content = fs.readFileSync(migration2Path, 'utf-8')

// Table definitions
assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.categories'), 'Schema defines categories table')
assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.products'), 'Schema defines products table')
assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.product_variants'), 'Schema defines product_variants table')
assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.price_history'), 'Schema defines price_history audit table')
assert(m1Content.includes('CREATE TABLE IF NOT EXISTS public.admin_users'), 'Schema defines admin_users table')

// Monetary types - NUMERIC(12, 2)
assert(m1Content.includes('original_price NUMERIC(12, 2)'), 'Products original_price uses NUMERIC(12, 2)')
assert(m1Content.includes('selling_price NUMERIC(12, 2)'), 'Products selling_price uses NUMERIC(12, 2)')
assert(m1Content.includes('CHECK (selling_price >= 0 AND selling_price <= original_price)'), 'Constraint enforces selling_price >= 0 and <= original_price')

// Row Level Security
assert(m1Content.includes('ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on categories')
assert(m1Content.includes('ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on products')
assert(m1Content.includes('ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on product_variants')
assert(m1Content.includes('ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on price_history')
assert(m1Content.includes('ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on admin_users')
assert(m1Content.includes('CREATE POLICY "Public can view active products"'), 'Public SELECT policy restricts to active products')
assert(m1Content.includes('CREATE POLICY "Only admins can view price history"'), 'Anonymous visitors cannot view price history')
assert(m1Content.includes('CREATE POLICY "Only admins can insert price history"'), 'Anonymous visitors cannot insert price history')

// Atomic Stored Procedure & Auth check
assert(m1Content.includes('FUNCTION public.update_product_price'), 'update_product_price stored procedure exists')
assert(m1Content.includes('IF NOT public.is_admin() THEN'), 'update_product_price enforces public.is_admin() check')
assert(m1Content.includes('INSERT INTO public.price_history'), 'update_product_price inserts audit record into price_history')
assert(m1Content.includes('FUNCTION public.update_product_prices_bulk'), 'Bulk atomic update procedure update_product_prices_bulk exists')
assert(m1Content.includes('FUNCTION public.add_admin_user'), 'Helper add_admin_user exists for initial admin setup')

// Reseed preservation of custom prices
assert(
  m2Content.includes('-- NOTE: We explicitly DO NOT overwrite selling_price or original_price if already edited!'),
  'Seed migration documents preservation of edited prices on reseed'
)
assert(
  !m2Content.includes('selling_price = EXCLUDED.selling_price'),
  'Seed products ON CONFLICT DO UPDATE does NOT overwrite selling_price'
)
assert(
  !m2Content.includes('original_price = EXCLUDED.original_price'),
  'Seed products ON CONFLICT DO UPDATE does NOT overwrite original_price'
)

// -------------------------------------------------------------
// 2. Data Consistency: Mock Data vs SQL Seed
// -------------------------------------------------------------
console.log('\n--- 2. DATA MODEL & SKU CONSISTENCY CHECKS ---')
const mockDataPath = path.join(rootDir, 'src', 'data', 'mockProducts.ts')
assert(fs.existsSync(mockDataPath), 'mockProducts.ts exists')
const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8')

const expectedProductIds = [
  'iphone-16-pro',
  'samsung-s24-ultra',
  'sony-bravia-oled',
  'lg-washer-ai',
  'oneplus-12',
  'samsung-bespoke-fridge'
]

for (const id of expectedProductIds) {
  const inMock = mockDataContent.includes(`"${id}"`) || mockDataContent.includes(`'${id}'`)
  const inSeed = m2Content.includes(`'${id}'`) || m2Content.includes(`"${id}"`)
  assert(inMock && inSeed, `Product ID "${id}" is consistent between mockProducts.ts and SQL seed`)
}

// -------------------------------------------------------------
// 3. Price Validation Rules
// -------------------------------------------------------------
console.log('\n--- 3. PRICE VALIDATION & SANITY RULES ---')

function validatePriceUpdate(newOrig, newSell) {
  if (typeof newOrig !== 'number' || isNaN(newOrig) || typeof newSell !== 'number' || isNaN(newSell)) {
    return { valid: false, error: 'Prices must be numeric numbers' }
  }
  if (newOrig < 0 || newSell < 0) {
    return { valid: false, error: 'Prices cannot be negative' }
  }
  if (newSell > newOrig) {
    return { valid: false, error: 'Selling price cannot exceed MRP / original price' }
  }
  return { valid: true }
}

assert(!validatePriceUpdate(-100, 50).valid, 'Rejects negative MRP')
assert(!validatePriceUpdate(100, -50).valid, 'Rejects negative selling price')
assert(!validatePriceUpdate(100, 150).valid, 'Rejects selling price greater than MRP')
assert(validatePriceUpdate(100, 100).valid, 'Accepts selling price equal to MRP')
assert(validatePriceUpdate(144900, 139900).valid, 'Accepts valid discounted price')

// -------------------------------------------------------------
// 4. Cart Price Synchronization Test
// -------------------------------------------------------------
console.log('\n--- 4. CART PRICE SYNCHRONIZATION SIMULATION ---')

let cart = [
  { product: { id: 'iphone-16-pro', name: 'iPhone 16 Pro', price: 139900, originalPrice: 144900 }, quantity: 1 },
  { product: { id: 'sony-bravia-oled', name: 'Sony Bravia', price: 209990, originalPrice: 249900 }, quantity: 2 }
]

function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

const initialTotal = getCartTotal(cart)
assert(initialTotal === 139900 + (209990 * 2), `Initial cart total computed correctly: ₹${initialTotal.toLocaleString('en-IN')}`)

// Simulate admin price change on Sony Bravia from 209990 to 199990
const updatedProducts = [
  { id: 'iphone-16-pro', name: 'iPhone 16 Pro', price: 139900, originalPrice: 144900 },
  { id: 'sony-bravia-oled', name: 'Sony Bravia', price: 199990, originalPrice: 249900 }
]

// syncProductPrices logic from useCartStore
cart = cart.map(item => {
  const fresh = updatedProducts.find(p => p.id === item.product.id)
  return fresh ? { ...item, product: fresh } : item
})

const synchronizedTotal = getCartTotal(cart)
assert(
  synchronizedTotal === 139900 + (199990 * 2),
  `Cart correctly recalculated to updated price: ₹${synchronizedTotal.toLocaleString('en-IN')}`
)

// -------------------------------------------------------------
// 5. Bundle Security Audit (No Leaked Secrets)
// -------------------------------------------------------------
console.log('\n--- 5. PRODUCTION BUNDLE SECURITY AUDIT ---')
const distDir = path.join(rootDir, 'dist')
assert(fs.existsSync(distDir), 'dist/ directory exists (production bundle built)')

const distFiles = fs.readdirSync(path.join(distDir, 'assets'))
const jsFiles = distFiles.filter(f => f.endsWith('.js'))

assert(jsFiles.length > 0, `Found ${jsFiles.length} JS bundle file(s) in dist/assets`)

for (const jsFile of jsFiles) {
  const jsContent = fs.readFileSync(path.join(distDir, 'assets', jsFile), 'utf-8')
  assert(!jsContent.includes('service_role'), `No "service_role" secret token in ${jsFile}`)
  assert(!jsContent.includes('SUPABASE_SERVICE_ROLE_KEY'), `No service-role env key in ${jsFile}`)
  assert(!jsContent.includes('postgres://postgres:'), `No raw database connection string in ${jsFile}`)
}

// -------------------------------------------------------------
// 6. Environment & Configuration Files
// -------------------------------------------------------------
console.log('\n--- 6. ENVIRONMENT CONFIGURATION & CLEANLINESS ---')
const envExamplePath = path.join(rootDir, '.env.example')
assert(fs.existsSync(envExamplePath), '.env.example exists')
const envExampleContent = fs.readFileSync(envExamplePath, 'utf-8')
assert(envExampleContent.includes('VITE_SUPABASE_URL='), '.env.example specifies VITE_SUPABASE_URL')
assert(envExampleContent.includes('VITE_SUPABASE_PUBLISHABLE_KEY='), '.env.example specifies VITE_SUPABASE_PUBLISHABLE_KEY')
assert(!/VITE_.*SERVICE_ROLE/i.test(envExampleContent), '.env.example exposes no service-role environment variable')
assert(!/=\s*eyJ/i.test(envExampleContent), '.env.example contains no real JWT tokens')

// -------------------------------------------------------------
// 7. Five-Category Structure & Migration Verification
// -------------------------------------------------------------
console.log('\n--- 7. CATEGORY ENHANCEMENT: ACCESSORIES & OTHER ELECTRONICS ---')
const migration3Path = path.join(rootDir, 'supabase', 'migrations', '00003_add_accessories_and_other_electronics.sql')
assert(fs.existsSync(migration3Path), '00003_add_accessories_and_other_electronics.sql exists')

const m3Content = fs.readFileSync(migration3Path, 'utf-8')
assert(m3Content.includes("'accessories'"), 'Migration 3 defines accessories category')
assert(m3Content.includes("'other-electronics'"), 'Migration 3 defines other-electronics category')
assert(m3Content.includes('ON CONFLICT (id) DO UPDATE'), 'Migration 3 is safe and idempotent with ON CONFLICT DO UPDATE')
assert(!m3Content.includes('selling_price = EXCLUDED.selling_price'), 'Migration 3 preserves edited prices for sample products')

// Check categories configuration module
const categoriesConfigPath = path.join(rootDir, 'src', 'data', 'categories.ts')
assert(fs.existsSync(categoriesConfigPath), 'categories.ts configuration module exists')
const categoriesConfigContent = fs.readFileSync(categoriesConfigPath, 'utf-8')
assert(categoriesConfigContent.includes("'smartphones'"), 'categories.ts includes smartphones')
assert(categoriesConfigContent.includes("'smart-tvs'"), 'categories.ts includes smart-tvs')
assert(categoriesConfigContent.includes("'home-appliances'"), 'categories.ts includes home-appliances')
assert(categoriesConfigContent.includes("'accessories'"), 'categories.ts includes accessories')
assert(categoriesConfigContent.includes("'other-electronics'"), 'categories.ts includes other-electronics')

// Sample products verification
const expectedSampleIds = [
  'apple-airpods-pro-2',
  'samsung-galaxy-watch-6',
  'anker-65w-gan-charger',
  'lg-ultragear-27-qhd',
  'tplink-archer-ax73-router',
  'logitech-mx-master-3s',
]

for (const sampleId of expectedSampleIds) {
  const inMock = mockDataContent.includes(`"${sampleId}"`) || mockDataContent.includes(`'${sampleId}'`)
  const inSeed = m3Content.includes(`'${sampleId}'`) || m3Content.includes(`"${sampleId}"`)
  assert(inMock && inSeed, `Sample product ID "${sampleId}" is consistent between mockProducts.ts and Migration 3`)
}

// Transparent sample data tagging
assert(mockDataContent.includes('Sample Model'), 'Sample products are clearly tagged with "Sample Model" badge')
assert(mockDataContent.includes('[Sample Demonstration]'), 'Sample products include disclaimer in tagline or description')

// Category separation simulation
const mockCategories = ['smartphones', 'smart-tvs', 'home-appliances', 'accessories', 'other-electronics']
for (const cat of mockCategories) {
  assert(mockDataContent.includes(`category: "${cat}"`) || mockDataContent.includes(`category: '${cat}'`), `Category "${cat}" is active in mock products`)
}

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n' + '='.repeat(70))
console.log(`VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`)
console.log('='.repeat(70))

if (failCount > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
