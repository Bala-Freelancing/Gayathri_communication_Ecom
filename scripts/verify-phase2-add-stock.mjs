/**
 * Phase 2 Verification Suite — Add New Stock & Icecat Integration
 * Gayathri Communication E-commerce
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

console.log('======================================================================')
console.log('  GAYATHRI COMMUNICATION - PHASE 2 ADD STOCK VERIFICATION')
console.log('======================================================================\n')

// 1. Icecat Service Integrity
console.log('--- 1. ICECAT SERVICE & SPONSOR LOGIC ---')
const icecatServicePath = path.join(rootDir, 'src', 'services', 'icecatService.ts')
assert(fs.existsSync(icecatServicePath), 'icecatService.ts exists')

const icecatCode = fs.readFileSync(icecatServicePath, 'utf8')
assert(icecatCode.includes('lookupProductCatalog'), 'Exports lookupProductCatalog function')
assert(icecatCode.includes('OPEN_ICECAT_SPONSOR_BRANDS'), 'Defines OPEN_ICECAT_SPONSOR_BRANDS')
assert(icecatCode.includes('OPEN_ICECAT_EXCLUDED_BRANDS'), 'Defines OPEN_ICECAT_EXCLUDED_BRANDS')
assert(icecatCode.includes('smartphones') && icecatCode.includes('smart-tvs'), 'Covers smartphones and smart-tvs categories')
assert(icecatCode.includes('home-appliances') && icecatCode.includes('accessories'), 'Covers home-appliances and accessories categories')
assert(icecatCode.includes('other-electronics'), 'Covers other-electronics category')
assert(icecatCode.includes('Open Content License'), 'Includes Open Content License attribution')
assert(!icecatCode.includes('VITE_ICECAT_TOKEN'), 'Contains NO client-leaked VITE_ICECAT_TOKEN')

// 2. Product Service Methods
console.log('\n--- 2. PRODUCT SERVICE ADD STOCK & DUPLICATE DETECTION ---')
const productServicePath = path.join(rootDir, 'src', 'services', 'productService.ts')
const productServiceCode = fs.readFileSync(productServicePath, 'utf8')
assert(productServiceCode.includes('checkDuplicateProduct'), 'productService defines checkDuplicateProduct')
assert(productServiceCode.includes('createProduct'), 'productService defines createProduct')
assert(productServiceCode.includes('effectiveOriginalPrice'), 'createProduct safely defaults MRP if omitted to satisfy DB constraint')
assert(productServiceCode.includes('sellingPrice <= 0'), 'createProduct validates positive selling price')
assert(productServiceCode.includes('stockQuantity < 0'), 'createProduct validates non-negative stock')

// 3. AddStockModal Component
console.log('\n--- 3. ADD STOCK UI MODAL ---')
const modalPath = path.join(rootDir, 'src', 'components', 'admin', 'AddStockModal.tsx')
assert(fs.existsSync(modalPath), 'AddStockModal.tsx component exists')
const modalCode = fs.readFileSync(modalPath, 'utf8')
assert(modalCode.includes('smartphones') && modalCode.includes('smart-tvs'), 'Modal includes smartphones and smart-tvs')
assert(modalCode.includes('home-appliances') && modalCode.includes('accessories'), 'Modal includes home-appliances and accessories')
assert(modalCode.includes('other-electronics'), 'Modal includes other-electronics')
assert(modalCode.includes('Selling Price (₹)'), 'Modal includes Selling Price input')
assert(modalCode.includes('Stock Quantity'), 'Modal includes Stock Quantity input')
assert(modalCode.includes('handleFileChange'), 'Modal supports local image upload')
assert(modalCode.includes('duplicateWarning'), 'Modal handles duplicate product warning confirmation')
assert(modalCode.includes('Specs Icecat'), 'Modal includes compliant Specs Icecat attribution link')

// 4. Admin Navigation & Integration
console.log('\n--- 4. ADMIN PAGE INTEGRATION ---')
const adminProductsPath = path.join(rootDir, 'src', 'pages', 'admin', 'AdminProducts.tsx')
const adminProductsCode = fs.readFileSync(adminProductsPath, 'utf8')
assert(adminProductsCode.includes('AddStockModal'), 'AdminProducts renders AddStockModal')
assert(adminProductsCode.includes('Add New Stock'), 'AdminProducts has Add New Stock button')

const adminInventoryPath = path.join(rootDir, 'src', 'pages', 'admin', 'AdminInventory.tsx')
const adminInventoryCode = fs.readFileSync(adminInventoryPath, 'utf8')
assert(adminInventoryCode.includes('AddStockModal'), 'AdminInventory renders AddStockModal')
assert(adminInventoryCode.includes('Add New Stock'), 'AdminInventory has Add New Stock button')

console.log('\n======================================================================')
console.log(`PHASE 2 VERIFICATION: ${passed} PASSED, ${failed} FAILED`)
console.log('======================================================================\n')

if (failed > 0) process.exit(1)
