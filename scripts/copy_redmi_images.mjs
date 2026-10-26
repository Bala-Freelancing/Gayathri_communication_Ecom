import fs from 'fs'
import path from 'path'

const srcDir = 'd:/Free_lancer/E-commerce/Redmi_mobile-images'
const destDir = 'd:/Free_lancer/E-commerce/Web/public/images/products/redmi'

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

const files = fs.readdirSync(srcDir)
console.log(`Found ${files.length} files in ${srcDir}`)

for (const file of files) {
  const srcPath = path.join(srcDir, file)
  const destPath = path.join(destDir, file)
  fs.copyFileSync(srcPath, destPath)
  console.log(`Copied ${file} -> ${destPath}`)
}

console.log('All images copied successfully!')
