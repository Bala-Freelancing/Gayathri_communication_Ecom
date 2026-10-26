import * as XLSX from 'xlsx'
import fs from 'fs'

const wb = XLSX.read(fs.readFileSync('../Gayathri_Vivo_Product_Entry_Sheet_with_Specs.xlsx'), { type: 'buffer' })
const sheet = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

console.log('Headers (Row 0):')
rows[0].forEach((h, i) => console.log(`  [${i}] ${h}`))

console.log('\nAll Rows:')
for (let i = 1; i < rows.length; i++) {
  const r = rows[i]
  console.log(`\n--- Row ${i} ---`)
  r.forEach((val, colIdx) => {
    if (val !== undefined && val !== '') {
      console.log(`  [${colIdx}] ${rows[0][colIdx]}: ${val}`)
    }
  })
}
