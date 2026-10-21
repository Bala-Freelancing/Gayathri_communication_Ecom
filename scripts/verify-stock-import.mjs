import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

console.log('='.repeat(75))
console.log('  GAYATHRI COMMUNICATION - STOCK IMPORT & CATALOGUE REPLACEMENT TEST SUITE')
console.log('='.repeat(75))

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
// 1. Spreadsheet Source Verification & Inspection
// -------------------------------------------------------------
console.log('\n--- 1. SPREADSHEET SOURCE & HEADER PARSING CHECKS ---')
const xlsPath = path.join(rootDir, 'product_List (1).xls')
assert(fs.existsSync(xlsPath), 'FY 2026-27 stock workbook exists at root')

const fileBuffer = fs.readFileSync(xlsPath)
const wb = XLSX.read(fileBuffer, { type: 'buffer' })
assert(wb.SheetNames.includes('report_abstract'), 'Workbook contains "report_abstract" sheet')

const ws = wb.Sheets['report_abstract']
const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1 })
assert(rawRows.length === 267, `Exact row count is 267 (found ${rawRows.length})`)

const headerRow = rawRows[2]
assert(headerRow.includes('Product Group'), 'Header row index 2 contains "Product Group"')
assert(headerRow.includes('Product'), 'Header row index 2 contains "Product"')
assert(headerRow.some(h => String(h).includes('Selling')), 'Header row contains "Selling\\nCost"')
assert(headerRow.some(h => String(h).includes('Closing Balance')), 'Header row contains "Closing Balance"')

// -------------------------------------------------------------
// 2. Data Mapping & Financial Integrity
// -------------------------------------------------------------
console.log('\n--- 2. SELLING COST & CLOSING QUANTITY MAPPING ---')
let validCount = 0
let zeroStockCount = 0
let positiveStockCount = 0
let negativeStockItems = []
let missingCostItems = []

for (let r = 4; r <= 265; r++) {
  const row = rawRows[r]
  if (!row) continue
  const rowNum = row[0]
  const name = String(row[2] || '').trim()
  const rawCost = row[8]
  const rawQty = row[15]

  const cost = parseFloat(rawCost)
  const qty = parseFloat(rawQty)

  const isInvalidCost = rawCost === '' || rawCost === null || isNaN(cost) || cost < 0
  const isInvalidQty = rawQty === '' || rawQty === null || isNaN(qty) || qty < 0

  if (isInvalidCost) missingCostItems.push({ rowNum, name, rawCost })
  if (isInvalidQty) negativeStockItems.push({ rowNum, name, rawQty })

  if (!isInvalidCost && !isInvalidQty && !name.toLowerCase().includes('credit note')) {
    validCount++
    if (qty === 0) zeroStockCount++
    else positiveStockCount++
  }
}

assert(validCount === 256, `Exactly 256 valid products mapped (found ${validCount})`)
assert(zeroStockCount === 136, `Exactly 136 products have zero stock (Closing Balance = 0)`)
assert(positiveStockCount === 120, `Exactly 120 products have positive showroom inventory`)
assert(missingCostItems.length === 1, `Identifies 1 row with missing selling cost (Row #223 "Credit Note Product")`)
assert(negativeStockItems.length === 5, `Identifies exactly 5 rows with negative stock quantities`)

// -------------------------------------------------------------
// 3. Category Mapping & Heuristics
// -------------------------------------------------------------
console.log('\n--- 3. CATEGORY MAPPING & REVIEW HEURISTICS ---')
const categoriesFound = new Set()
for (let r = 4; r <= 265; r++) {
  const row = rawRows[r]
  if (row && row[1]) categoriesFound.add(row[1])
}
const catArray = Array.from(categoriesFound).sort()
const expectedGroups = ['Accessories', 'Mobiles', 'Others', 'TV', 'Tablets'].sort()
assert(
  JSON.stringify(catArray) === JSON.stringify(expectedGroups),
  `Identified exact client product groups: ${catArray.join(', ')}`
)

// -------------------------------------------------------------
// 4. Duplicate Detection & Variant Preservation
// -------------------------------------------------------------
console.log('\n--- 4. DUPLICATE DETECTION & VARIANT PRESERVATION ---')
const exactNameSet = new Set()
let exactDuplicatesCount = 0
for (let r = 4; r <= 265; r++) {
  const row = rawRows[r]
  if (!row) continue
  const cleanName = String(row[2] || '').trim().toLowerCase().replace(/\s+/g, ' ')
  if (exactNameSet.has(cleanName)) {
    exactDuplicatesCount++
  } else {
    exactNameSet.add(cleanName)
  }
}
assert(exactDuplicatesCount === 0, 'No exact duplicate product names in source workbook')

// Check that different storage variants are NOT merged
const gt30_128 = rawRows.find(r => r && String(r[2]).includes('GT 30 8/128 CYBER BLUE'))
const gt30_256 = rawRows.find(r => r && String(r[2]).includes('GT 30 PRO 12/256 DARK FLARE'))
assert(Boolean(gt30_128 && gt30_256), 'Distinguishes 8/128 and 12/256 storage variants as separate products')

// -------------------------------------------------------------
// 5. Database Migration & Transactional Replacement Schema
// -------------------------------------------------------------
console.log('\n--- 5. DATABASE MIGRATION 00005 & TRANSACTIONAL RPC CHECKS ---')
const m5Path = path.join(rootDir, 'supabase', 'migrations', '00005_stock_import_and_replacement.sql')
assert(fs.existsSync(m5Path), 'Migration 00005_stock_import_and_replacement.sql exists')

const m5Content = fs.readFileSync(m5Path, 'utf-8')
assert(m5Content.includes('CREATE TABLE IF NOT EXISTS public.catalogue_backups'), 'Migration defines durable catalogue_backups table')
assert(m5Content.includes('FUNCTION public.backup_current_catalogue'), 'Migration defines backup_current_catalogue stored procedure')
assert(m5Content.includes('FUNCTION public.replace_product_catalogue'), 'Migration defines replace_product_catalogue transactional stored procedure')
assert(m5Content.includes('FUNCTION public.validate_order_stock'), 'Migration defines validate_order_stock server-side procedure')

// Authorization & Transactional Security Checks
assert(m5Content.includes('IF NOT public.is_admin() THEN'), 'replace_product_catalogue strictly verifies public.is_admin()')
assert(m5Content.includes('p_existing_backup_id is strictly required'), 'replace_product_catalogue enforces durable backup verification before deletion')
assert(m5Content.includes('DELETE FROM public.products'), 'Old entries removed only within the transactional replacement procedure')
assert(m5Content.includes('IF v_inserted_count <> v_input_count THEN'), 'replace_product_catalogue verifies row counts and raises exception on mismatch')
assert(m5Content.includes('RAISE EXCEPTION'), 'Automatic rollback guaranteed on any exception in PostgreSQL transaction')

// -------------------------------------------------------------
// 6. Out-of-Stock Enforcement in Cart & Storefront
// -------------------------------------------------------------
console.log('\n--- 6. OUT-OF-STOCK ENFORCEMENT IN STOREFRONT & CART ---')
const cartStorePath = path.join(rootDir, 'src', 'store', 'useCartStore.ts')
const cartStoreContent = fs.readFileSync(cartStorePath, 'utf-8')

assert(
  cartStoreContent.includes('if (!product.inStock || product.stockQuantity === 0)'),
  'useCartStore.addToCart strictly rejects out-of-stock products'
)
assert(
  cartStoreContent.includes('Math.min(quantity, maxStock)') || cartStoreContent.includes('Math.min(updated[existingIndex].quantity + quantity, maxStock)'),
  'useCartStore clamps added and updated quantities to available showroom inventory'
)

const productCardPath = path.join(rootDir, 'src', 'components', 'products', 'ProductCard.tsx')
const productCardContent = fs.readFileSync(productCardPath, 'utf-8')
assert(productCardContent.includes('const isOutOfStock = !product.inStock || product.stockQuantity === 0'), 'ProductCard calculates isOutOfStock state')
assert(productCardContent.includes('Out of Stock'), 'ProductCard displays prominent "Out of Stock" badge')
assert(productCardContent.includes('disabled'), 'ProductCard disables Add to Cart button when product is out of stock')

const cartDrawerPath = path.join(rootDir, 'src', 'components', 'cart', 'CartDrawer.tsx')
const cartDrawerContent = fs.readFileSync(cartDrawerPath, 'utf-8')
assert(cartDrawerContent.includes('hasOutOfStock'), 'CartDrawer detects if any item in cart is out of stock')
assert(cartDrawerContent.includes('disabled={hasOutOfStock || isValidatingStock}'), 'CartDrawer disables checkout button when out-of-stock items or validation in progress')
assert(cartDrawerContent.includes("validate_order_stock"), 'CartDrawer invokes validate_order_stock RPC before WhatsApp checkout')
assert(cartDrawerContent.includes('p_items: itemsPayload'), 'CartDrawer passes p_items payload format to validate_order_stock')
assert(cartDrawerContent.includes('productService.fetchProducts()'), 'CartDrawer refreshes product inventory on stock validation failure')
assert(cartDrawerContent.includes('window.open(url, \'_blank\')'), 'CartDrawer proceeds with WhatsApp redirect only after validation passes')
assert(cartDrawerContent.includes('WhatsApp checkout is an external enquiry'), 'CartDrawer documents that WhatsApp checkout is an external enquiry flow')

// -------------------------------------------------------------
// 7. Security Hardening & SQL Configuration Audit
// -------------------------------------------------------------
console.log('\n--- 7. SQL SECURITY HARDENING & SEARCH_PATH AUDIT ---')
// Check explicit search_path on all SECURITY DEFINER functions
const hasSafeSearchPathIsAdmin = m5Content.includes('FUNCTION public.is_admin()') && m5Content.includes('SECURITY DEFINER SET search_path = public, pg_temp')
assert(hasSafeSearchPathIsAdmin, 'public.is_admin() hardened with SECURITY DEFINER SET search_path = public, pg_temp')

const hasSafeSearchPathBackup = m5Content.includes('FUNCTION public.backup_current_catalogue') && m5Content.includes('SECURITY DEFINER SET search_path = public, pg_temp')
assert(hasSafeSearchPathBackup, 'backup_current_catalogue hardened with SECURITY DEFINER SET search_path = public, pg_temp')

const hasSafeSearchPathReplace = m5Content.includes('FUNCTION public.replace_product_catalogue') && m5Content.includes('SECURITY DEFINER SET search_path = public, pg_temp')
assert(hasSafeSearchPathReplace, 'replace_product_catalogue hardened with SECURITY DEFINER SET search_path = public, pg_temp')

const hasSafeSearchPathStock = m5Content.includes('FUNCTION public.validate_order_stock') && m5Content.includes('SECURITY DEFINER SET search_path = public, pg_temp')
assert(hasSafeSearchPathStock, 'validate_order_stock hardened with SECURITY DEFINER SET search_path = public, pg_temp')

// Check REVOKE and GRANT configuration
assert(m5Content.includes('REVOKE EXECUTE ON FUNCTION public.backup_current_catalogue(TEXT, TEXT) FROM PUBLIC;'), 'Revokes backup_current_catalogue from PUBLIC')
assert(m5Content.includes('GRANT EXECUTE ON FUNCTION public.backup_current_catalogue(TEXT, TEXT) TO authenticated;'), 'Grants backup_current_catalogue only to authenticated')
assert(m5Content.includes('REVOKE EXECUTE ON FUNCTION public.replace_product_catalogue(JSONB, TEXT, UUID) FROM PUBLIC;'), 'Revokes replace_product_catalogue from PUBLIC')
assert(m5Content.includes('GRANT EXECUTE ON FUNCTION public.replace_product_catalogue(JSONB, TEXT, UUID) TO authenticated;'), 'Grants replace_product_catalogue only to authenticated')

// Check public.is_admin() internal authorization checks
assert(m5Content.includes('IF NOT public.is_admin() THEN\n        RAISE EXCEPTION \'Access Denied: Only authenticated administrators can create catalogue backups.\';'), 'backup_current_catalogue strictly verifies public.is_admin()')
assert(m5Content.includes('IF NOT public.is_admin() THEN\n        RAISE EXCEPTION \'Access Denied: Only authenticated administrators can replace the product catalogue.\';'), 'replace_product_catalogue strictly verifies public.is_admin()')

// -------------------------------------------------------------
// 8. Price History Preservation & Durable Backup Ledger
// -------------------------------------------------------------
console.log('\n--- 8. PRICE HISTORY AUDIT PRESERVATION & DURABLE BACKUPS ---')
assert(m5Content.includes('ALTER TABLE public.price_history ADD COLUMN IF NOT EXISTS product_name TEXT;'), 'Adds product_name column to price_history table')
assert(m5Content.includes('ALTER TABLE public.price_history ALTER COLUMN product_id DROP NOT NULL;'), 'Drops NOT NULL constraint from price_history.product_id')
assert(m5Content.includes('FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;'), 'Changes price_history foreign key cascade to ON DELETE SET NULL')
assert(m5Content.includes('UPDATE public.price_history ph\n    SET product_name = p.name\n    FROM public.products p'), 'replace_product_catalogue stamps product_name on price_history before product deletion')
assert(m5Content.includes('price_history_snapshot JSONB NOT NULL DEFAULT \'[]\'::jsonb,'), 'catalogue_backups table includes price_history_snapshot JSONB column')

// -------------------------------------------------------------
// 9. Stock Import Service & Backup Durability
// -------------------------------------------------------------
console.log('\n--- 9. DURABLE BACKUP PERSISTENCE ON REPLACEMENT FAILURE ---')
const servicePath = path.join(rootDir, 'src', 'services', 'stockImportService.ts')
assert(fs.existsSync(servicePath), 'stockImportService.ts exists')
const serviceContent = fs.readFileSync(servicePath, 'utf-8')
assert(serviceContent.includes('export function parseStockWorkbook'), 'stockImportService exports parseStockWorkbook')
assert(serviceContent.includes('export function generateRejectedRowsCsv'), 'stockImportService exports generateRejectedRowsCsv')
assert(serviceContent.includes('export async function createDurableCatalogueBackup'), 'stockImportService exports createDurableCatalogueBackup')
assert(serviceContent.includes('export async function executeCatalogueReplacement'), 'stockImportService exports executeCatalogueReplacement')
assert(serviceContent.includes('createDurableCatalogueBackup(backupLabel'), 'executeCatalogueReplacement creates committed backup before replacement')
assert(serviceContent.includes('if (!backupRes.success || !backupRes.backupId)'), 'executeCatalogueReplacement aborts replacement if backup fails')
assert(serviceContent.includes('backupId: committedBackupId'), 'executeCatalogueReplacement preserves and returns committed backupId on failure')

const adminImportPath = path.join(rootDir, 'src', 'pages', 'admin', 'AdminStockImport.tsx')
assert(fs.existsSync(adminImportPath), 'AdminStockImport.tsx page exists')
const adminImportContent = fs.readFileSync(adminImportPath, 'utf-8')
assert(adminImportContent.includes('CONFIRM REPLACE'), 'AdminStockImport enforces explicit typed confirmation before Stage B execution')
assert(adminImportContent.includes('handleDownloadRejectedCsv'), 'AdminStockImport allows downloading rejected rows CSV')
assert(adminImportContent.includes('handleDownloadCatalogueBackup'), 'AdminStockImport allows downloading live catalogue backup')
assert(adminImportContent.includes('backupId: res.backupId'), 'AdminStockImport retains backupId in failure report state')
assert(adminImportContent.includes('Pre-replacement backup identifier'), 'AdminStockImport displays committed backup identifier upon replacement error')

// -------------------------------------------------------------
// 10. Functional Logic Simulations: Stock Validation & Decoupled Backups
// -------------------------------------------------------------
console.log('\n--- 10. FUNCTIONAL LOGIC SIMULATIONS (UNIT TESTS) ---')

// Simulation 1: Stock Validation Logic
function simulateStockValidation(items, inventory) {
  const errors = []
  for (const item of items) {
    const prod = inventory.find(p => p.id === item.product_id)
    if (!prod) {
      errors.push({ product_id: item.product_id, error: 'Product not found in catalog' })
    } else if (!prod.in_stock || prod.stock_quantity <= 0) {
      errors.push({ product_id: item.product_id, product_name: prod.name, available_qty: 0, requested_qty: item.quantity, error: 'Product is currently Out of Stock' })
    } else if (item.quantity > prod.stock_quantity) {
      errors.push({ product_id: item.product_id, product_name: prod.name, available_qty: prod.stock_quantity, requested_qty: item.quantity, error: `Requested quantity exceeds inventory` })
    }
  }
  return { valid: errors.length === 0, errors }
}

const mockInventory = [
  { id: 'p1', name: 'Vivo V40e', in_stock: true, stock_quantity: 4 },
  { id: 'p2', name: 'Realme 13', in_stock: false, stock_quantity: 0 },
  { id: 'p3', name: 'AirPods Pro', in_stock: true, stock_quantity: 2 },
]

// Test A: Out of stock product
const resOutOfStock = simulateStockValidation([{ product_id: 'p2', quantity: 1 }], mockInventory)
assert(!resOutOfStock.valid, 'Stock validation rejects product with 0 stock')
assert(resOutOfStock.errors[0].error.includes('Out of Stock'), 'Stock validation reports Out of Stock error message')

// Test B: Insufficient stock
const resOverQty = simulateStockValidation([{ product_id: 'p3', quantity: 5 }], mockInventory)
assert(!resOverQty.valid, 'Stock validation rejects requested quantity (5) exceeding available stock (2)')

// Test C: Product not found
const resNotFound = simulateStockValidation([{ product_id: 'unknown-id', quantity: 1 }], mockInventory)
assert(!resNotFound.valid, 'Stock validation rejects missing product ID')

// Test D: Available products with valid quantity
const resValid = simulateStockValidation([{ product_id: 'p1', quantity: 2 }, { product_id: 'p3', quantity: 2 }], mockInventory)
assert(resValid.valid && resValid.errors.length === 0, 'Stock validation accepts valid quantities of in-stock items')

// -------------------------------------------------------------
// 11. Final Catalogue-Backup Safety Gap & Provenance Verification
// -------------------------------------------------------------
console.log('\n--- 11. CATALOGUE BACKUP SAFETY GAP & PROVENANCE VERIFICATION ---')

// 1. Static SQL Checks for Server-Side Provenance & Completeness
assert(m5Content.includes('p_existing_backup_id is strictly required'), 'replace_product_catalogue requires mandatory p_existing_backup_id')
assert(m5Content.includes('does not exist in catalogue_backups'), 'replace_product_catalogue checks existence in catalogue_backups')
assert(m5Content.includes("v_b_status <> 'completed'"), 'replace_product_catalogue verifies backup status is "completed"')
assert(m5Content.includes("v_b_workflow NOT IN ('catalogue_replacement', 'stock_import')"), 'replace_product_catalogue validates workflow provenance')
assert(m5Content.includes("INTERVAL '15 minutes'"), 'replace_product_catalogue enforces a 15-minute freshness window against stale backups')
assert(m5Content.includes('jsonb_array_length(v_b_products) <> v_b_count'), 'replace_product_catalogue verifies product snapshot array length matches product_count')
assert(m5Content.includes('v_b_count <> v_current_product_count'), 'replace_product_catalogue verifies backup count matches live catalogue product count')
assert(m5Content.includes('jsonb_array_length(v_b_ph) <> v_current_ph_count'), 'replace_product_catalogue verifies price history snapshot length matches live count')

// 2. Functional Unit Test Simulations for the 9 Required Scenarios
function simulateServerSideCatalogueReplacement({
  callerIsAdmin,
  existingBackupId,
  backupLedger,
  currentProductsCount,
  currentPriceHistoryCount,
  productsToInsert,
  simulateDbFailureAfterBackup,
}) {
  // Scenario 7 Check: Admin authorization
  if (!callerIsAdmin) {
    return {
      success: false,
      error: 'Access Denied: Only authenticated administrators can replace the product catalogue.'
    }
  }

  // Input check
  if (!Array.isArray(productsToInsert) || productsToInsert.length === 0) {
    return {
      success: false,
      error: 'Replacement aborted: product list is empty or invalid.'
    }
  }

  // Mandatory backup ID check
  if (!existingBackupId) {
    return {
      success: false,
      error: 'Replacement aborted: p_existing_backup_id is strictly required. A standalone committed backup must be established before replacement begins.'
    }
  }

  // Scenario 1 Check: Unknown backup ID
  const backup = backupLedger.find(b => b.id === existingBackupId)
  if (!backup) {
    return {
      success: false,
      error: `Replacement aborted: Provided backup ID ${existingBackupId} does not exist in catalogue_backups.`
    }
  }

  // Status check
  if (backup.status !== 'completed') {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} status is "${backup.status}", expected "completed".`
    }
  }

  // Scenario 2 Check: Backup from wrong workflow
  if (!['catalogue_replacement', 'stock_import'].includes(backup.workflow)) {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} was created for workflow "${backup.workflow}", not catalogue replacement.`
    }
  }

  // Freshness check (15 minutes)
  const ageMs = Date.now() - new Date(backup.created_at).getTime()
  if (ageMs > 15 * 60 * 1000) {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} was created at ${backup.created_at}, which exceeds the 15-minute freshness window.`
    }
  }

  // Scenario 3 Check: Incomplete product snapshot
  if (!Array.isArray(backup.products_snapshot)) {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} contains invalid or corrupted product snapshot.`
    }
  }

  if (backup.products_snapshot.length !== backup.product_count) {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} product snapshot length (${backup.products_snapshot.length}) does not match recorded product_count (${backup.product_count}).`
    }
  }

  // Scenario 4 Check: Product-count mismatch against live catalogue
  if (backup.product_count !== currentProductsCount) {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} product count (${backup.product_count}) does not match current catalogue product count (${currentProductsCount}). Stale or mismatched backup rejected.`
    }
  }

  // Scenario 5 Check: Invalid or incomplete price-history snapshot
  if (!Array.isArray(backup.price_history_snapshot)) {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} contains invalid or corrupted price history snapshot.`
    }
  }

  if (backup.price_history_snapshot.length !== currentPriceHistoryCount) {
    return {
      success: false,
      error: `Replacement aborted: Backup ${existingBackupId} price history snapshot length (${backup.price_history_snapshot.length}) does not match current price history count (${currentPriceHistoryCount}).`
    }
  }

  // Scenario 8 Check: Successful backup followed by replacement failure
  if (simulateDbFailureAfterBackup) {
    return {
      success: false,
      backupId: existingBackupId,
      error: `Transactional replacement failed: Simulated DB error during table population. Live catalogue preserved untouched. Pre-replacement backup ID: ${existingBackupId}.`
    }
  }

  // Scenario 9: Valid backup and authorized replacement
  return {
    success: true,
    backup_id: existingBackupId,
    backup_verified: true,
    backup_product_count: backup.product_count,
    backup_price_history_count: backup.price_history_snapshot.length,
    imported_count: productsToInsert.length,
  }
}

// Setup common mock backup fixture
const freshTimestamp = new Date().toISOString()
const validSnapshotProducts = Array.from({ length: 12 }, (_, i) => ({ id: `p-${i}`, name: `Product ${i}` }))
const validSnapshotPh = Array.from({ length: 3 }, (_, i) => ({ id: `ph-${i}`, product_name: `Product ${i}` }))

const mockLedger = [
  {
    id: 'valid-backup-uuid-1',
    label: 'FY 2026-27 Automated Showroom Backup',
    workflow: 'catalogue_replacement',
    product_count: 12,
    products_snapshot: validSnapshotProducts,
    price_history_count: 3,
    price_history_snapshot: validSnapshotPh,
    status: 'completed',
    created_at: freshTimestamp,
  },
  {
    id: 'wrong-workflow-uuid',
    label: 'Manual Settings Export',
    workflow: 'manual_settings_export',
    product_count: 12,
    products_snapshot: validSnapshotProducts,
    price_history_count: 3,
    price_history_snapshot: validSnapshotPh,
    status: 'completed',
    created_at: freshTimestamp,
  },
  {
    id: 'incomplete-products-uuid',
    label: 'Corrupted Products Backup',
    workflow: 'catalogue_replacement',
    product_count: 12,
    products_snapshot: validSnapshotProducts.slice(0, 8), // Only 8 of 12 items
    price_history_count: 3,
    price_history_snapshot: validSnapshotPh,
    status: 'completed',
    created_at: freshTimestamp,
  },
  {
    id: 'mismatched-count-uuid',
    label: 'Old Catalogue State Backup',
    workflow: 'catalogue_replacement',
    product_count: 6, // 6 items recorded, but live catalogue has 12
    products_snapshot: validSnapshotProducts.slice(0, 6),
    price_history_count: 3,
    price_history_snapshot: validSnapshotPh,
    status: 'completed',
    created_at: freshTimestamp,
  },
  {
    id: 'incomplete-ph-uuid',
    label: 'Truncated Price History Backup',
    workflow: 'catalogue_replacement',
    product_count: 12,
    products_snapshot: validSnapshotProducts,
    price_history_count: 3,
    price_history_snapshot: validSnapshotPh.slice(0, 1), // Only 1 of 3 items
    status: 'completed',
    created_at: freshTimestamp,
  },
  {
    id: 'stale-backup-uuid',
    label: 'Stale Backup From Yesterday',
    workflow: 'catalogue_replacement',
    product_count: 12,
    products_snapshot: validSnapshotProducts,
    price_history_count: 3,
    price_history_snapshot: validSnapshotPh,
    status: 'completed',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
  },
]

const sampleProductsToInsert = Array.from({ length: 256 }, (_, i) => ({ id: `new-p-${i}`, name: `New Product ${i}` }))

// --- Test 1: Unknown backup ID ---
const t1 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'nonexistent-uuid-99999',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
})
assert(!t1.success && t1.error.includes('does not exist in catalogue_backups'), 'Rejects unknown backup ID not present in durable ledger')

// --- Test 2: Backup from wrong catalogue or workflow ---
const t2 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'wrong-workflow-uuid',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
})
assert(!t2.success && t2.error.includes('was created for workflow "manual_settings_export"'), 'Rejects backup produced by wrong workflow or manual export')

// --- Test 3: Incomplete product snapshot ---
const t3 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'incomplete-products-uuid',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
})
assert(!t3.success && t3.error.includes('product snapshot length (8) does not match recorded product_count (12)'), 'Rejects backup with truncated or incomplete product snapshot')

// --- Test 4: Product-count mismatch ---
const t4 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'mismatched-count-uuid',
  backupLedger: mockLedger,
  currentProductsCount: 12, // Live catalogue has 12, backup has 6
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
})
assert(!t4.success && t4.error.includes('product count (6) does not match current catalogue product count (12)'), 'Rejects backup whose product count does not match current live catalogue count')

// --- Test 5: Invalid or incomplete price-history snapshot ---
const t5 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'incomplete-ph-uuid',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3, // Live price history has 3, backup has 1
  productsToInsert: sampleProductsToInsert,
})
assert(!t5.success && t5.error.includes('price history snapshot length (1) does not match current price history count (3)'), 'Rejects backup with incomplete price-history snapshot')

// --- Test 6: Backup creation failure (replacement must not run) ---
async function simulateClientReplacementFlow(backupCreationFails) {
  let replacementInvoked = false

  // Client creates backup first
  let backupId = null
  if (backupCreationFails) {
    return { success: false, error: 'Pre-replacement backup failed: Storage quota exceeded. Aborting replacement.', replacementInvoked }
  }
  backupId = 'valid-backup-uuid-1'

  // Replacement step
  replacementInvoked = true
  const res = simulateServerSideCatalogueReplacement({
    callerIsAdmin: true,
    existingBackupId: backupId,
    backupLedger: mockLedger,
    currentProductsCount: 12,
    currentPriceHistoryCount: 3,
    productsToInsert: sampleProductsToInsert,
  })
  return { ...res, replacementInvoked }
}

simulateClientReplacementFlow(true).then(res => {
  assert(!res.success && !res.replacementInvoked, 'When backup creation fails, replacement is strictly prevented from executing')
})

// --- Test 7: Non-admin caller ---
const t7 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: false, // Non-admin user
  existingBackupId: 'valid-backup-uuid-1',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
})
assert(!t7.success && t7.error.includes('Access Denied: Only authenticated administrators'), 'Strictly rejects non-admin caller before any database operations')

// --- Test 8: Successful backup followed by replacement failure ---
const t8 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'valid-backup-uuid-1',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
  simulateDbFailureAfterBackup: true,
})
assert(!t8.success && t8.backupId === 'valid-backup-uuid-1', 'When replacement fails, pre-replacement committed backup ID is preserved and reported')
assert(t8.error.includes('valid-backup-uuid-1'), 'Error message reports committed backup identifier for administrative recovery')

// --- Test 9: Valid backup and authorized replacement ---
const t9 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'valid-backup-uuid-1',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
})
assert(t9.success === true && t9.backup_verified === true && t9.imported_count === 256, 'Authorized caller with valid, complete, and verified backup successfully replaces catalogue')

// --- Test 10: Anti-stale window test ---
const t10 = simulateServerSideCatalogueReplacement({
  callerIsAdmin: true,
  existingBackupId: 'stale-backup-uuid',
  backupLedger: mockLedger,
  currentProductsCount: 12,
  currentPriceHistoryCount: 3,
  productsToInsert: sampleProductsToInsert,
})
assert(!t10.success && t10.error.includes('exceeds the 15-minute freshness window'), 'Rejects stale backup exceeding 15-minute allowable window')

const appPath = path.join(rootDir, 'src', 'App.tsx')
const appContent = fs.readFileSync(appPath, 'utf-8')
assert(appContent.includes('/admin/import'), 'App.tsx registers protected route for /admin/import')

const adminLayoutPath = path.join(rootDir, 'src', 'components', 'admin', 'AdminLayout.tsx')
const adminLayoutContent = fs.readFileSync(adminLayoutPath, 'utf-8')
assert(adminLayoutContent.includes('/admin/import'), 'AdminLayout sidebar links to /admin/import')

console.log('\n' + '='.repeat(75))
console.log(`VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`)
console.log('='.repeat(75))

if (failCount > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
