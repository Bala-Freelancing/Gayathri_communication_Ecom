import * as XLSX from 'xlsx'
import fs from 'fs'

const wb = XLSX.read(fs.readFileSync('../Gayathri_Vivo_Product_Entry_Sheet_with_Specs.xlsx'), { type: 'buffer' })
const sheet = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

console.log('Row count:', rows.length)
for (let i = 1; i < rows.length; i++) {
  const r = rows[i]
  console.log(`\nRow ${i}:`)
  console.log('  Model:', r[4])
  console.log('  RAM/ROM:', r[5], '/', r[6])
  console.log('  Price:', r[7], 'MRP:', r[8], 'Stock:', r[9])
  console.log('  Badge:', r[3])
  console.log('  Warranty:', r[10])
  console.log('  Tagline:', r[11])
  console.log('  Specs:', r[12])
  console.log('  Category:', r[1])
}
