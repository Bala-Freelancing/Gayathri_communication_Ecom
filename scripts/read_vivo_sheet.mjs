import * as XLSX from 'xlsx'
import fs from 'fs'

const wb = XLSX.read(fs.readFileSync('../Gayathri_Vivo_Product_Entry_Sheet_with_Specs.xlsx'), { type: 'buffer' })
const sheetName = wb.SheetNames[0]
const sheet = wb.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

console.log('Total rows in sheet:', rows.length)
console.log('Header:', rows[0])

rows.forEach((r, idx) => {
  if (idx === 0) return
  if (!r || r.length === 0) return
  console.log(`[${idx}]`, {
    sNo: r[0],
    category: r[1],
    brand: r[2],
    badge: r[3],
    model: r[4],
    ram: r[5],
    storage: r[6],
    price: r[7],
    mrp: r[8],
    stock: r[9],
    tagline: r[9] || r[11],
    specs: r[10] || r[12]
  })
})
