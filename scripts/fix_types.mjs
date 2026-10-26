import fs from 'fs'

// Fix mockProducts null badges
const mockPath = 'src/data/mockProducts.ts'
let content = fs.readFileSync(mockPath, 'utf8')
content = content.replace(/"badge":\s*null,?\r?\n/g, '')
fs.writeFileSync(mockPath, content, 'utf8')
console.log('Fixed mockProducts null badges')
