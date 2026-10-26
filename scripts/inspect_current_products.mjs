import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hmlrjihcselneceaverv.supabase.co'
const supabaseKey = 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspect() {
  const { data, error } = await supabase.from('products').select('*').order('name')
  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  console.log(`Fetched ${data.length} products from Supabase`)
  data.forEach((p, i) => {
    console.log(`\n[${i+1}] ${p.name} (SKU: ${p.sku}) | Price: ₹${p.selling_price} | Image: ${p.image}`)
    if (p.variants && Array.isArray(p.variants)) {
      console.log(`    Variants (${p.variants.length}):`)
      p.variants.forEach(v => {
        console.log(`      - ${v.name}: ₹${v.price} (MRP: ₹${v.originalPrice || v.original_price}) | Stock: ${v.stockQuantity || v.stock_quantity}`)
      })
    }
  })
}

inspect()
