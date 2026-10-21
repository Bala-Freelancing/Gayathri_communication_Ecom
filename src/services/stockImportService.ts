/**
 * Stock Import Service — Gayathri Communication Showroom
 *
 * Implements:
 * - Phase 1: Robust parsing of .xls (BIFF8 OLE2), .xlsx, and .csv files via SheetJS (xlsx)
 * - Phase 2: Comprehensive validation, counts, error identification, and CSV rejection reporting
 * - Phase 3: Exact mapping of client's FY 2026-27 stock report columns:
 *            Selling Cost -> selling_price
 *            Closing Balance Qty -> stock_quantity
 *            Product Group -> 5 showroom categories with review flagging
 * - Phase 4: Duplicate detection (exact name, brand + model, variant distinction)
 * - Phase 5: Image & spec match status tracking ('matched' | 'needs_review' | 'missing')
 * - Phase 6: Two-stage safety: Prepare/validate preview vs atomic Stage B replacement
 */

import * as XLSX from 'xlsx'
import { ProductCategoryType } from '@/types/product'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { productService, resolveProductImage } from '@/services/productService'

export interface RawStockRow {
  rowNumber: number
  itemNo?: string
  productGroup: string
  productName: string
  unit?: string
  hsn?: string
  gstPercent?: string
  discountPercent?: string
  purchaseCost?: string
  sellingCost: string
  mrp?: string
  marginPercent?: string
  openingQty?: string
  openingValue?: string
  closingQty: string
  closingValue?: string
}

export interface ParsedStockItem {
  id: string
  rowNumber: number
  sku: string
  slug: string
  rawProductName: string
  name: string
  brand: string
  model: string
  variantDetails?: {
    ram?: string
    storage?: string
    color?: string
  }
  category: ProductCategoryType
  originalGroup: string
  categoryStatus: 'confirmed' | 'needs_review'
  sellingPrice: number
  originalPrice: number
  stockQuantity: number
  inStock: boolean
  isZeroStock: boolean
  hsn?: string
  gstPercent?: number
  purchaseCost?: number
  unit?: string
  warranty: string
  imageStatus: 'matched' | 'needs_review' | 'missing'
  image: string
  imageSource?: string
  specs: { label: string; value: string }[]
  highlights: string[]
  isDuplicate: boolean
  duplicateType?: 'exact' | 'possible_model' | 'none'
  duplicateReason?: string
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface StockImportSummary {
  fileName: string
  totalSourceRows: number
  validProductsCount: number
  invalidRowsCount: number
  exactDuplicateCount: number
  possibleModelDuplicatesCount: number
  zeroStockCount: number
  positiveStockCount: number
  missingImagesCount: number
  needsReviewImagesCount: number
  matchedImagesCount: number
  ambiguousCategoriesCount: number
  items: ParsedStockItem[]
  invalidRows: {
    rowNumber: number
    productName: string
    rawCost: string
    rawQty: string
    errors: string[]
  }[]
  categoryDistribution: Record<string, number>
}

// Known brand extraction keywords
const KNOWN_BRANDS: { pattern: RegExp; brand: string }[] = [
  { pattern: /\b(APPLE|IPHONE|IPHNOE)\b/i, brand: 'Apple' },
  { pattern: /\b(SAMSUNG|SUMSUNG)\b/i, brand: 'Samsung' },
  { pattern: /\b(VIVO|VIVOT5X)\b/i, brand: 'Vivo' },
  { pattern: /\b(REDMI|REDMI15C)\b/i, brand: 'Redmi' },
  { pattern: /\b(XIAOMI|MI|XPB)\b/i, brand: 'Xiaomi' },
  { pattern: /\b(INFINIX|INFINX|HOT|NOTE|GT\s*30)\b/i, brand: 'Infinix' },
  { pattern: /\b(POCO)\b/i, brand: 'Poco' },
  { pattern: /\b(MOTOROLA|MOTO)\b/i, brand: 'Motorola' },
  { pattern: /\b(REALME)\b/i, brand: 'Realme' },
  { pattern: /\b(NOTHING|NATHING|PHONE\(3A\))\b/i, brand: 'Nothing' },
  { pattern: /\b(PORTRONICS)\b/i, brand: 'Portronics' },
  { pattern: /\b(ICCON|ICCONX|ICONX)\b/i, brand: 'Iconx' },
  { pattern: /\b(BLUESTAR|BLUE\s*STAR)\b/i, brand: 'Blue Star' },
  { pattern: /\b(CARRIER)\b/i, brand: 'Carrier' },
  { pattern: /\b(DAIKIN)\b/i, brand: 'Daikin' },
  { pattern: /\b(LLOYD)\b/i, brand: 'Lloyd' },
  { pattern: /\b(ELISTA)\b/i, brand: 'Elista' },
  { pattern: /\b(CROMPTON)\b/i, brand: 'Crompton' },
  { pattern: /\b(KHAITAN)\b/i, brand: 'Khaitan' },
  { pattern: /\b(SYSCOM)\b/i, brand: 'Syscom' },
  { pattern: /\b(V\s*GUARD|VGUARD)\b/i, brand: 'V-Guard' },
  { pattern: /\b(PREMIER)\b/i, brand: 'Premier' },
  { pattern: /\b(PURE\s*SOUND)\b/i, brand: 'Pure Sound' },
  { pattern: /\b(ZELLA)\b/i, brand: 'Zella' },
  { pattern: /\b(VZY)\b/i, brand: 'VZY' },
]

/**
 * Extracts Brand from product text with fallback heuristics
 */
export function extractBrand(productName: string, productGroup: string): string {
  const norm = productName.trim().toUpperCase()

  for (const item of KNOWN_BRANDS) {
    if (item.pattern.test(norm)) {
      return item.brand
    }
  }

  // Fallback to first alphanumeric token
  const tokens = norm.split(/[\s\-_]+/).filter(Boolean)
  if (tokens.length > 0 && isNaN(Number(tokens[0]))) {
    return tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1).toLowerCase()
  }

  if (productGroup.toLowerCase() === 'mobiles') return 'Smartphones'
  if (productGroup.toLowerCase() === 'tv') return 'Smart TV'
  return 'Gayathri'
}

/**
 * Extracts storage/RAM specifications (e.g. "8/128", "12/256", "4/64", "256 GB")
 */
export function extractMemoryVariant(text: string): { ram?: string; storage?: string } | undefined {
  const slashMatch = text.match(/\b(\d{1,2})\s*\/\s*(\d{2,4})\b/)
  if (slashMatch) {
    return {
      ram: `${slashMatch[1]} GB`,
      storage: `${slashMatch[2]} GB`,
    }
  }

  const storageMatch = text.match(/\b(\d{2,4})\s*(GB|TB)\b/i)
  if (storageMatch) {
    return {
      storage: `${storageMatch[1]} ${storageMatch[2].toUpperCase()}`,
    }
  }

  return undefined
}

/**
 * Extracts common color keywords
 */
export function extractColor(text: string): string | undefined {
  const colors = [
    'BLACK', 'BLUE', 'RED', 'ROSE RED', 'WHITE', 'GREEN', 'PULSE GREEN',
    'CYBER BLUE', 'DARK FLARE', 'PRISM WHITE', 'GREY', 'GRAY', 'SILVER',
    'GOLD', 'TITANIUM', 'PURPLE', 'YELLOW', 'ORANGE', 'CAMELLIA BLUE',
    'BROWN', 'MATT BROWN'
  ]
  const upper = text.toUpperCase()
  for (const c of colors) {
    const regex = new RegExp(`\\b${c}\\b`, 'i')
    if (regex.test(upper)) {
      return c.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }
  }
  return undefined
}

/**
 * Maps Product Group to the 5 official showroom categories
 */
export function mapProductCategory(
  productGroup: string,
  productName: string
): { category: ProductCategoryType; status: 'confirmed' | 'needs_review' } {
  const groupNorm = (productGroup || '').trim().toLowerCase()
  const nameNorm = (productName || '').trim().toLowerCase()

  if (groupNorm === 'accessories') {
    return { category: 'accessories', status: 'confirmed' }
  }

  if (groupNorm === 'mobiles') {
    return { category: 'smartphones', status: 'confirmed' }
  }

  if (groupNorm === 'tv') {
    return { category: 'smart-tvs', status: 'confirmed' }
  }

  if (groupNorm === 'tablets') {
    // Tablets can be other-electronics or smartphones
    return { category: 'other-electronics', status: 'needs_review' }
  }

  if (groupNorm === 'others') {
    // Check if it's an appliance or accessory
    const isAppliance = (
      nameNorm.includes('fan') ||
      nameNorm.includes('a/c') ||
      nameNorm.includes('ac') ||
      nameNorm.includes('cooler') ||
      nameNorm.includes('refrigerator') ||
      nameNorm.includes('ref') ||
      nameNorm.includes('grinder') ||
      nameNorm.includes('washing') ||
      nameNorm.includes('aircoolar') ||
      nameNorm.includes('inverter') ||
      nameNorm.includes('bluestar') ||
      nameNorm.includes('carrier') ||
      nameNorm.includes('daikin')
    )

    if (isAppliance) {
      return { category: 'home-appliances', status: 'confirmed' }
    }

    const isAccessory = (
      nameNorm.includes('remote') ||
      nameNorm.includes('power bank') ||
      nameNorm.includes('usb') ||
      nameNorm.includes('charger')
    )

    if (isAccessory) {
      return { category: 'accessories', status: 'needs_review' }
    }

    return { category: 'other-electronics', status: 'needs_review' }
  }

  return { category: 'other-electronics', status: 'needs_review' }
}

/**
 * Parses raw workbook buffer or ArrayBuffer into structured stock data
 */
export function parseStockWorkbook(buffer: ArrayBuffer | Uint8Array, fileName: string): StockImportSummary {
  const wb = XLSX.read(buffer, { type: 'array' })

  // Find sheet: either 'report_abstract' or the first sheet
  const sheetName = wb.SheetNames.includes('report_abstract')
    ? 'report_abstract'
    : wb.SheetNames[0]

  const ws = wb.Sheets[sheetName]
  const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 })

  // 1. Locate Header Row
  let headerRowIndex = -1
  let subHeaderRowIndex = -1

  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const row = rows[i] || []
    const rowStr = row.map((cell) => String(cell || '').toLowerCase()).join(' ')
    if (rowStr.includes('product group') && rowStr.includes('selling') && rowStr.includes('closing')) {
      headerRowIndex = i
      if (i + 1 < rows.length) {
        const nextStr = (rows[i + 1] || []).map((c) => String(c || '').toLowerCase()).join(' ')
        if (nextStr.includes('qty') || nextStr.includes('value')) {
          subHeaderRowIndex = i + 1
        }
      }
      break
    }
  }

  // Default fallback if standard layout: Row 2 is header, Row 3 is subheader
  if (headerRowIndex === -1) {
    headerRowIndex = 2
    subHeaderRowIndex = 3
  }

  // 2. Identify Column Indices
  const headerRow = rows[headerRowIndex] || []
  const subHeaderRow = subHeaderRowIndex !== -1 ? (rows[subHeaderRowIndex] || []) : []

  let colItemNo = 0
  let colProductGroup = 1
  let colProduct = 2
  let colUnit = 3
  let colHsn = 4
  let colGst = 5
  let colPurchaseCost = 7
  let colSellingCost = 8
  let colMrp = 9
  let colClosingQty = 15

  // Dynamically verify header column indices if labels match
  for (let c = 0; c < headerRow.length; c++) {
    const text = String(headerRow[c] || '').toLowerCase().replace(/\r?\n/g, ' ').trim()
    if (text === '#' || text === 's.no' || text === 'sl.no') colItemNo = c
    else if (text.includes('product group')) colProductGroup = c
    else if (text === 'product' || text.includes('product name') || text.includes('item name')) colProduct = c
    else if (text === 'unit') colUnit = c
    else if (text === 'hsn') colHsn = c
    else if (text.includes('gst')) colGst = c
    else if (text.includes('purchase')) colPurchaseCost = c
    else if (text.includes('selling')) colSellingCost = c
    else if (text === 'mrp') colMrp = c
    else if (text.includes('closing')) {
      // Look at subheader to distinguish Qty vs Value
      if (subHeaderRow[c] && String(subHeaderRow[c]).toLowerCase().includes('qty')) {
        colClosingQty = c
      } else if (subHeaderRow[c + 1] && String(subHeaderRow[c + 1]).toLowerCase().includes('qty')) {
        colClosingQty = c + 1
      } else {
        colClosingQty = c
      }
    }
  }

  // 3. Process Data Rows
  const startRow = (subHeaderRowIndex !== -1 ? subHeaderRowIndex : headerRowIndex) + 1
  const rawItems: ParsedStockItem[] = []
  const invalidRows: StockImportSummary['invalidRows'] = []

  const exactNameMap = new Map<string, number>()
  const exactDuplicateRows = new Set<number>()
  const modelMap = new Map<string, number[]>()

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r]
    if (!row || row.length === 0) continue

    const firstCell = String(row[0] || '').trim().toUpperCase()
    // Stop at Grand Total row
    if (firstCell.startsWith('GRAND TOTAL') || firstCell.includes('TOTAL')) {
      continue
    }

    const rowNum = r + 1
    const itemNo = String(row[colItemNo] || '').trim()
    const productGroup = String(row[colProductGroup] || '').trim()
    const rawProductName = String(row[colProduct] || '').trim()
    const sellCostRaw = row[colSellingCost]
    const closeQtyRaw = row[colClosingQty]
    const mrpRaw = row[colMrp]
    const purchaseCostRaw = row[colPurchaseCost]
    const hsnRaw = String(row[colHsn] || '').trim()
    const gstRaw = row[colGst]
    const unitRaw = String(row[colUnit] || 'Nos').trim()

    // Validation checks
    const errors: string[] = []
    const warnings: string[] = []

    if (!rawProductName) {
      errors.push('Missing product name')
    }

    // Explicitly reject non-product entries such as "Credit Note Product"
    if (rawProductName.toLowerCase().includes('credit note')) {
      errors.push('Administrative entry (Credit Note), not a showroom product')
    }

    // Selling Cost validation
    const sellCost = parseFloat(String(sellCostRaw ?? '').replace(/[^\d.-]/g, ''))
    if (sellCostRaw === '' || sellCostRaw === null || sellCostRaw === undefined || isNaN(sellCost)) {
      errors.push('Missing or non-numeric Selling Cost')
    } else if (sellCost < 0) {
      errors.push(`Negative Selling Cost: ₹${sellCost}`)
    } else if (sellCost === 0) {
      warnings.push('Selling price is ₹0.00 — Verify showroom pricing')
    }

    // Closing Quantity validation
    const closeQty = parseFloat(String(closeQtyRaw ?? '').replace(/[^\d.-]/g, ''))
    if (closeQtyRaw === '' || closeQtyRaw === null || closeQtyRaw === undefined || isNaN(closeQty)) {
      errors.push('Missing or non-numeric Closing Quantity')
    } else if (closeQty < 0) {
      errors.push(`Negative stock quantity (${closeQty}) is invalid`)
    }

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber: rowNum,
        productName: rawProductName || `Row #${rowNum}`,
        rawCost: String(sellCostRaw ?? ''),
        rawQty: String(closeQtyRaw ?? ''),
        errors,
      })
      continue
    }

    // Cleaned fields for valid row
    const isZeroStock = closeQty === 0
    const inStock = closeQty > 0
    const brand = extractBrand(rawProductName, productGroup)
    const { category, status: categoryStatus } = mapProductCategory(productGroup, rawProductName)
    const memory = extractMemoryVariant(rawProductName)
    const color = extractColor(rawProductName)

    // Original Price (MRP): must satisfy selling_price <= original_price
    const parsedMrp = parseFloat(String(mrpRaw ?? '').replace(/[^\d.-]/g, ''))
    const effectiveOriginalPrice = (!isNaN(parsedMrp) && parsedMrp >= sellCost)
      ? parsedMrp
      : sellCost

    // Generate stable unique identifiers
    const normalizedKey = rawProductName.toLowerCase().replace(/\s+/g, ' ')
    const slugBase = `${brand}-${rawProductName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50)
    const uniqueId = `gc-${slugBase}-${itemNo || rowNum}`
    const sku = `GC-${category.substring(0, 3).toUpperCase()}-${brand.substring(0, 3).toUpperCase()}-${String(itemNo || rowNum).padStart(4, '0')}`

    // Exact duplicate detection
    let isDuplicate = false
    let duplicateType: 'exact' | 'possible_model' | 'none' = 'none'
    let duplicateReason: string | undefined

    if (exactNameMap.has(normalizedKey)) {
      isDuplicate = true
      duplicateType = 'exact'
      duplicateReason = `Exact match with row #${exactNameMap.get(normalizedKey)}`
      exactDuplicateRows.add(rowNum)
    } else {
      exactNameMap.set(normalizedKey, rowNum)
    }

    // Possible model grouping (brand + first 3 words)
    const modelKey = `${brand.toLowerCase()}-${rawProductName.toLowerCase().split(/\s+/).slice(0, 3).join(' ')}`
    if (!modelMap.has(modelKey)) {
      modelMap.set(modelKey, [rowNum])
    } else {
      modelMap.get(modelKey)!.push(rowNum)
      if (!isDuplicate && !memory && !color) {
        duplicateType = 'possible_model'
        duplicateReason = `Similar model name to row(s) #${modelMap.get(modelKey)!.slice(0, -1).join(', #')}`
      }
    }

    // Determine initial image status
    const resolvedImage = resolveProductImage('', rawProductName, brand, category)
    const isMatched = !resolvedImage.includes('placeholder')
    const imageStatus: 'matched' | 'needs_review' | 'missing' = isMatched ? 'matched' : 'missing'
    const image = resolvedImage

    // Form initial specifications
    const specs: { label: string; value: string }[] = []
    if (memory?.ram) specs.push({ label: 'RAM', value: memory.ram })
    if (memory?.storage) specs.push({ label: 'Storage', value: memory.storage })
    if (color) specs.push({ label: 'Color', value: color })
    if (hsnRaw) specs.push({ label: 'HSN Code', value: hsnRaw })
    specs.push({ label: 'Stock Status', value: isZeroStock ? 'Out of Stock' : `${closeQty} units in showroom` })

    const highlights: string[] = []
    if (memory?.storage && memory?.ram) {
      highlights.push(`${memory.ram} RAM + ${memory.storage} High-Speed Storage`)
    }
    if (color) {
      highlights.push(`Official Color: ${color}`)
    }
    highlights.push('100% Genuine Authorized Indian Stock with GST Invoice')

    rawItems.push({
      id: uniqueId,
      rowNumber: rowNum,
      sku,
      slug: uniqueId,
      rawProductName,
      name: rawProductName,
      brand,
      model: rawProductName.replace(new RegExp(`^${brand}\\s*`, 'i'), '').trim(),
      variantDetails: {
        ram: memory?.ram,
        storage: memory?.storage,
        color,
      },
      category,
      originalGroup: productGroup,
      categoryStatus,
      sellingPrice: sellCost,
      originalPrice: effectiveOriginalPrice,
      stockQuantity: Math.round(closeQty),
      inStock,
      isZeroStock,
      hsn: hsnRaw || undefined,
      gstPercent: !isNaN(parseFloat(String(gstRaw))) ? parseFloat(String(gstRaw)) : undefined,
      purchaseCost: !isNaN(parseFloat(String(purchaseCostRaw))) ? parseFloat(String(purchaseCostRaw)) : undefined,
      unit: unitRaw,
      warranty: '1 Year Official Brand Warranty',
      imageStatus,
      image,
      specs,
      highlights,
      isDuplicate,
      duplicateType,
      duplicateReason,
      isValid: true,
      errors: [],
      warnings,
    })
  }

  // 4. Summaries & Distributions
  const categoryDistribution: Record<string, number> = {}
  let zeroStockCount = 0
  let positiveStockCount = 0
  let ambiguousCategoriesCount = 0
  let exactDuplicateCount = exactDuplicateRows.size
  let possibleModelDuplicatesCount = 0

  for (const item of rawItems) {
    categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + 1
    if (item.isZeroStock) zeroStockCount++
    else positiveStockCount++

    if (item.categoryStatus === 'needs_review') ambiguousCategoriesCount++
    if (item.duplicateType === 'possible_model') possibleModelDuplicatesCount++
  }

  return {
    fileName,
    totalSourceRows: rawItems.length + invalidRows.length,
    validProductsCount: rawItems.length,
    invalidRowsCount: invalidRows.length,
    exactDuplicateCount,
    possibleModelDuplicatesCount,
    zeroStockCount,
    positiveStockCount,
    missingImagesCount: rawItems.filter(i => i.imageStatus === 'missing').length,
    needsReviewImagesCount: rawItems.filter(i => i.imageStatus === 'needs_review').length,
    matchedImagesCount: rawItems.filter(i => i.imageStatus === 'matched').length,
    ambiguousCategoriesCount,
    items: rawItems,
    invalidRows,
    categoryDistribution,
  }
}

/**
 * Generates downloadable CSV content of rejected rows and validation errors
 */
export function generateRejectedRowsCsv(invalidRows: StockImportSummary['invalidRows']): string {
  const header = ['Row Number', 'Product Description', 'Raw Selling Cost', 'Raw Closing Qty', 'Validation Errors'].join(',')
  const rows = invalidRows.map((inv) => {
    const desc = `"${inv.productName.replace(/"/g, '""')}"`
    const cost = `"${inv.rawCost.replace(/"/g, '""')}"`
    const qty = `"${inv.rawQty.replace(/"/g, '""')}"`
    const errors = `"${inv.errors.join('; ').replace(/"/g, '""')}"`
    return [inv.rowNumber, desc, cost, qty, errors].join(',')
  })
  return [header, ...rows].join('\r\n')
}

/**
 * Converts validated stock items into Supabase Database `products` insert records
 */
export function mapItemsToDatabaseProducts(items: ParsedStockItem[]): any[] {
  return items.map((item) => ({
    id: item.id,
    sku: item.sku,
    slug: item.slug,
    name: item.name,
    tagline: item.variantDetails?.storage 
      ? `${item.brand} with ${item.variantDetails.storage} storage and official brand warranty.`
      : `Official ${item.brand} ${item.category.replace('-', ' ')} with showroom warranty.`,
    description: `Official ${item.name}. Genuine showroom retail stock from Gayathri Communication. Includes official manufacturer warranty and invoice.`,
    brand: item.brand,
    category_id: item.category,
    badge: item.isZeroStock ? 'Out of Stock' : (item.sellingPrice > 25000 ? 'Showroom Pick' : null),
    is_best_seller: false,
    is_new_launch: !item.isZeroStock,
    is_deal_of_the_day: false,
    original_price: item.originalPrice,
    selling_price: item.sellingPrice,
    rating: 4.8,
    review_count: 0,
    image: item.image,
    gallery: [item.image],
    emi_starts_at: item.sellingPrice > 5000 ? Math.round(item.sellingPrice / 24) : 0,
    warranty: item.warranty,
    stock_quantity: item.stockQuantity,
    in_stock: item.inStock,
    specs: item.specs,
    highlights: item.highlights,
    variants: [],
    is_active: true,
  }))
}

/**
 * Stage B: Executes safe, transactional replacement of the product catalogue
/**
 * Creates a committed, standalone backup snapshot in public.catalogue_backups
 * Guaranteed to persist independently of replacement outcome.
 */
export async function createDurableCatalogueBackup(
  backupLabel: string = 'Pre-replacement catalogue backup',
  workflow: string = 'catalogue_replacement'
): Promise<{
  success: boolean
  backupId?: string
  productCount?: number
  priceHistoryCount?: number
  error?: string
}> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.rpc('backup_current_catalogue', {
        p_label: backupLabel,
        p_workflow: workflow,
      })

      if (error) {
        return {
          success: false,
          error: `Pre-replacement backup failed: ${error.message}. Aborting replacement to protect existing catalogue.`,
        }
      }

      const backupId = (data as any)?.backup_id
      if (!backupId) {
        return {
          success: false,
          error: 'Backup procedure did not return a valid backup identifier. Replacement cannot proceed.',
        }
      }

      return {
        success: true,
        backupId,
        productCount: (data as any)?.product_count,
        priceHistoryCount: (data as any)?.price_history_count,
      }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Database error while capturing catalogue backup snapshot.',
      }
    }
  } else {
    // Offline simulation
    return {
      success: true,
      backupId: `mock-backup-${Date.now()}`,
      productCount: productService.getAllProducts().length,
      priceHistoryCount: 0,
    }
  }
}

/**
 * Stage B: Executes safe, transactional replacement of the product catalogue.
 * Strictly requires a committed pre-replacement backup before deletion.
 */
export async function executeCatalogueReplacement(
  validatedItems: ParsedStockItem[],
  backupLabel: string = 'FY 2026-27 Client Stock Report Import'
): Promise<{
  success: boolean
  importedCount: number
  backupId?: string
  error?: string
  details?: any
}> {
  if (validatedItems.length === 0) {
    return { success: false, importedCount: 0, error: 'No validated products to import.' }
  }

  // Step 1: Execute standalone committed backup first
  const backupRes = await createDurableCatalogueBackup(backupLabel, 'catalogue_replacement')
  if (!backupRes.success || !backupRes.backupId) {
    return {
      success: false,
      importedCount: 0,
      error: backupRes.error || 'Failed to establish durable pre-replacement backup. Replacement aborted.',
    }
  }

  const committedBackupId = backupRes.backupId
  const dbProducts = mapItemsToDatabaseProducts(validatedItems)

  if (isSupabaseConfigured()) {
    try {
      // Step 2: Execute transactional stored procedure with pre-existing backup ID
      const { data, error } = await supabase.rpc('replace_product_catalogue', {
        p_products: dbProducts,
        p_backup_label: backupLabel,
        p_existing_backup_id: committedBackupId,
      })

      if (error) {
        return {
          success: false,
          importedCount: 0,
          backupId: committedBackupId,
          error: `Transactional replacement failed: ${error.message}. Live catalogue preserved untouched. Pre-replacement backup ID: ${committedBackupId}.`,
        }
      }

      // Re-fetch products to ensure full client synchronization
      await productService.fetchProducts()

      return {
        success: true,
        importedCount: (data as any)?.imported_count || validatedItems.length,
        backupId: committedBackupId || (data as any)?.backup_id,
        details: data,
      }
    } catch (err: any) {
      return {
        success: false,
        importedCount: 0,
        backupId: committedBackupId,
        error: `${err?.message || 'Database error during replacement'}. Live catalogue preserved untouched. Pre-replacement backup ID: ${committedBackupId}.`,
      }
    }
  } else {
    // Offline / Demo mode simulation
    return {
      success: true,
      importedCount: validatedItems.length,
      backupId: committedBackupId || `mock-backup-${Date.now()}`,
      details: {
        mode: 'demo-local',
        message: 'Successfully simulated catalogue replacement in local offline mode.',
      },
    }
  }
}
