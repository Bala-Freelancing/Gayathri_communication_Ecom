import * as XLSX from 'xlsx'
import fs from 'fs'

const filePath = '../Gayathri_Xiaomi_Redmi_Product_Entry_Sheet_with_Specs.xlsx'
const buf = fs.readFileSync(filePath)
const workbook = XLSX.read(buf, { type: 'buffer' })
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

function extractBaseModelAndVariant(rawName) {
  let baseModel = rawName.trim()
  let variantName = 'Standard'

  // Match parenthesized variants e.g. "Redmi Note 15 Pro+ 5G (8GB+256GB)" or "(8GB + 256GB)"
  const parenMatch = rawName.match(/^(.*?)\s*[\(\[]([0-9]+\s*GB.*?|\d+\s*TB.*?)[\)\]]\s*$/i)
  if (parenMatch) {
    baseModel = parenMatch[1].trim()
    variantName = parenMatch[2].replace(/\+/g, ' + ').replace(/\s+/g, ' ').trim()
    return { baseModel, variantName }
  }

  // Match suffix notation e.g. "Redmi Note 15 Pro+ 5G 8GB/256GB"
  const slashMatch = rawName.match(/^(.*?)\s*([0-9]+\s*GB\s*[\/\+]\s*[0-9]+\s*(?:GB|TB))\s*$/i)
  if (slashMatch) {
    baseModel = slashMatch[1].trim()
    variantName = slashMatch[2].replace(/[\/\+]/g, ' + ').replace(/\s+/g, ' ').trim()
    return { baseModel, variantName }
  }

  return { baseModel, variantName }
}

const baseModelMap = new Map()

for (let r = 1; r < rows.length; r++) {
  const row = rows[r]
  if (!row || !row[3]) continue
  const title = String(row[3]).trim()
  const sellingPrice = parseFloat(String(row[4] ?? '').replace(/[^\d.-]/g, ''))
  const mrp = parseFloat(String(row[5] ?? '').replace(/[^\d.-]/g, ''))
  const stock = parseFloat(String(row[6] ?? '').replace(/[^\d.-]/g, '')) || 10
  
  const { baseModel, variantName } = extractBaseModelAndVariant(title)
  
  if (!baseModelMap.has(baseModel)) {
    baseModelMap.set(baseModel, [])
  }
  baseModelMap.get(baseModel).push({ title, variantName, sellingPrice, mrp, stock })
}

console.log(`\n======================================================`)
console.log(`Consolidated ${rows.length - 1} spreadsheet entries into ${baseModelMap.size} parent models`)
console.log(`======================================================\n`)

let multiVariantCount = 0
for (const [model, variants] of baseModelMap.entries()) {
  if (variants.length > 1) {
    multiVariantCount++
    const minPrice = Math.min(...variants.map(v => v.sellingPrice))
    const maxPrice = Math.max(...variants.map(v => v.sellingPrice))
    console.log(`📱 ${model} -> ${variants.length} Variants (From ₹${minPrice.toLocaleString('en-IN')} to ₹${maxPrice.toLocaleString('en-IN')})`)
    variants.forEach(v => {
      console.log(`    [Variant] ${v.variantName.padEnd(16)} | Selling: ₹${v.sellingPrice.toLocaleString('en-IN').padEnd(7)} | MRP: ₹${v.mrp.toLocaleString('en-IN').padEnd(7)} | Stock: ${v.stock}`)
    })
  } else {
    console.log(`📦 ${model} (Single Variant) -> ₹${variants[0].sellingPrice.toLocaleString('en-IN')}`)
  }
}

console.log(`\nMulti-variant models: ${multiVariantCount} of ${baseModelMap.size}`)
