import * as XLSX from 'xlsx'
import fs from 'fs'

const wb = XLSX.read(fs.readFileSync('../Gayathri_Xiaomi_Accessories_Product_Entry_Sheet.xlsx'), { type: 'buffer' })
const sheetName = wb.SheetNames[0]
const sheet = wb.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet)

console.log(`Total accessories rows: ${rows.length}`)
rows.forEach(r => {
  console.log(`[${r['S.No.']}] Cat: ${r['Category']} | Name: "${r['Product Name']}" | SRP: ₹${r['SRP (₹)']} | Img: ${r['Image Filename (suggested)']}`)
})
