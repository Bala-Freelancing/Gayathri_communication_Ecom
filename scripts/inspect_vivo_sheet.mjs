import * as XLSX from 'xlsx'
import fs from 'fs'

const filePath = '../Gayathri_Vivo_Product_Entry_Sheet_with_Specs.xlsx'
const buf = fs.readFileSync(filePath)
const workbook = XLSX.read(buf, { type: 'buffer' })
console.log('Sheet Names:', workbook.SheetNames)

for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name]
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  console.log(`\n--- Sheet: ${name} (${rows.length} rows) ---`)
  for (let i = 0; i < Math.min(rows.length, 25); i++) {
    console.log(`Row ${i}:`, JSON.stringify(rows[i]))
  }
}
