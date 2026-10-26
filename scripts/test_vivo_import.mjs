import * as XLSX from 'xlsx'
import fs from 'fs'

const filePath = '../Gayathri_Vivo_Product_Entry_Sheet_with_Specs.xlsx'
const buf = fs.readFileSync(filePath)
const workbook = XLSX.read(buf, { type: 'buffer' })
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

console.log('Sheet Name:', sheetName)
console.log('Row count:', rows.length)

// Header row
const headerRow = rows[0]
console.log('Headers:', headerRow)

let colCategory = -1
let colBrand = -1
let colBadge = -1
let colTitle = -1
let colSellingPrice = -1
let colMrp = -1
let colStock = -1
let colWarranty = -1
let colTagline = -1
let colSpecs = -1
let colImage = -1

for (let c = 0; c < headerRow.length; c++) {
  const text = String(headerRow[c] || '').toLowerCase().trim()
  if (text.includes('category')) colCategory = c
  else if (text.includes('brand')) colBrand = c
  else if (text.includes('badge')) colBadge = c
  else if (text.includes('product title') || text.includes('model name')) colTitle = c
  else if (text.includes('selling price')) colSellingPrice = c
  else if (text.includes('mrp') || text.includes('original price')) colMrp = c
  else if (text.includes('stock quantity') || text.includes('stock')) colStock = c
  else if (text.includes('warranty')) colWarranty = c
  else if (text.includes('tagline') || text.includes('highlight')) colTagline = c
  else if (text.includes('technical specifications') || text.includes('spec')) colSpecs = c
  else if (text.includes('image url') || text.includes('product image')) colImage = c
}

console.log('Columns identified:', {
  colCategory,
  colBrand,
  colBadge,
  colTitle,
  colSellingPrice,
  colMrp,
  colStock,
  colWarranty,
  colTagline,
  colSpecs,
  colImage
})

for (let r = 1; r < rows.length; r++) {
  const row = rows[r]
  if (!row || !row[colTitle]) continue
  const title = String(row[colTitle]).trim()
  const sellingPrice = parseFloat(String(row[colSellingPrice] ?? '').replace(/[^\d.-]/g, ''))
  const mrp = colMrp !== -1 && row[colMrp] ? parseFloat(String(row[colMrp]).replace(/[^\d.-]/g, '')) : Math.round(sellingPrice * 1.14)
  const stock = colStock !== -1 && row[colStock] ? parseFloat(String(row[colStock]).replace(/[^\d.-]/g, '')) : 10
  const tagline = colTagline !== -1 ? String(row[colTagline] || '') : ''
  const specs = colSpecs !== -1 ? String(row[colSpecs] || '') : ''
  console.log(`[${r}] ${title} | Selling: ₹${sellingPrice} | MRP: ₹${mrp} | Stock: ${stock}`)
  console.log(`     Tagline: ${tagline}`)
  console.log(`     Specs: ${specs}\n`)
}
