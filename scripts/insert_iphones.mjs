import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hmlrjihcselneceaverv.supabase.co'
const supabaseKey = 'sb_publishable_THWB249HBTV-jFbLUMd27w_g3YScmUD'

const supabase = createClient(supabaseUrl, supabaseKey)

const iphones = [
  {
    id: 'gc-apple-iphone-15',
    sku: 'GC-APL-IPHONE15-128',
    slug: 'apple-iphone-15',
    name: 'Apple iPhone 15',
    tagline: 'Dynamic Island, 48MP Main Camera, A16 Bionic & USB-C.',
    description: 'Official Apple iPhone 15 authorized showroom stock at Gayathri Communication. Features Dynamic Island, durable color-infused back glass design, 48MP main camera with 2x Telephoto, A16 Bionic chip, and universal USB-C charging.',
    brand: 'Apple',
    category_id: 'smartphones',
    badge: 'Authorized Apple Stock',
    is_best_seller: true,
    is_new_launch: false,
    is_deal_of_the_day: true,
    original_price: 79900,
    selling_price: 74999,
    rating: 4.9,
    review_count: 32,
    image: '/images/products/iphone15.jpg',
    gallery: ['/images/products/iphone15.jpg'],
    emi_starts_at: 3630,
    warranty: '1 Year Official Apple India Manufacturer Warranty',
    stock_quantity: 12,
    in_stock: true,
    specs: [
      { label: 'Display', value: '6.1-inch Super Retina XDR OLED with Dynamic Island' },
      { label: 'Camera', value: '48MP Main + 12MP Ultra Wide with 2x Optical Quality Telephoto' },
      { label: 'Processor', value: 'A16 Bionic chip with 5-core GPU' },
      { label: 'Port', value: 'USB-C with fast charging support' },
      { label: 'Build', value: 'Ceramic Shield front, color-infused glass back & aluminum frame (IP68)' }
    ],
    highlights: [
      'Display: 6.1-inch Super Retina XDR OLED with Dynamic Island',
      'Camera: 48MP Main + 12MP Ultra Wide with 2x Telephoto',
      'Processor: A16 Bionic chip with 5-core GPU'
    ],
    variants: [
      {
        id: 'var-apple-ip15-128',
        sku: 'GC-APL-IP15-128',
        name: '128GB Storage',
        price: 74999,
        originalPrice: 79900,
        stockQuantity: 8,
        inStock: true,
        attributes: { storage: '128GB' }
      },
      {
        id: 'var-apple-ip15-256',
        sku: 'GC-APL-IP15-256',
        name: '256GB Storage',
        price: 84999,
        originalPrice: 89900,
        stockQuantity: 4,
        inStock: true,
        attributes: { storage: '256GB' }
      }
    ]
  },
  {
    id: 'gc-apple-iphone-16',
    sku: 'GC-APL-IPHONE16-128',
    slug: 'apple-iphone-16',
    name: 'Apple iPhone 16',
    tagline: 'Camera Control, A18 Processor, Apple Intelligence & 48MP Fusion Camera.',
    description: 'Official Apple iPhone 16 authorized showroom stock at Gayathri Communication. Built for Apple Intelligence, featuring all-new Camera Control, powerful A18 processor, 48MP Fusion camera with 2x optical Telephoto, and aerospace-grade aluminum enclosure.',
    brand: 'Apple',
    category_id: 'smartphones',
    badge: 'Flagship New Launch',
    is_best_seller: true,
    is_new_launch: true,
    is_deal_of_the_day: false,
    original_price: 104900,
    selling_price: 99999,
    rating: 5.0,
    review_count: 24,
    image: '/images/products/iphone16.jpg',
    gallery: ['/images/products/iphone16.jpg'],
    emi_starts_at: 4840,
    warranty: '1 Year Official Apple India Manufacturer Warranty',
    stock_quantity: 15,
    in_stock: true,
    specs: [
      { label: 'Display', value: '6.1-inch Super Retina XDR OLED with Ceramic Shield latest generation' },
      { label: 'Camera', value: '48MP Fusion camera with 2x Telephoto and 12MP Ultra Wide with Macro' },
      { label: 'Processor', value: 'A18 chip with 6-core CPU, 5-core GPU & Apple Intelligence' },
      { label: 'Controls', value: 'Camera Control button and Action button' },
      { label: 'Build', value: 'Aerospace-grade aluminum enclosure with color-infused back glass (IP68)' }
    ],
    highlights: [
      'Display: 6.1-inch Super Retina XDR OLED with Ceramic Shield',
      'Camera: 48MP Fusion camera with 2x Telephoto & Macro',
      'Processor: A18 chip with Apple Intelligence'
    ],
    variants: [
      {
        id: 'var-apple-ip16-128',
        sku: 'GC-APL-IP16-128',
        name: '128GB Storage',
        price: 99999,
        originalPrice: 104900,
        stockQuantity: 10,
        inStock: true,
        attributes: { storage: '128GB' }
      },
      {
        id: 'var-apple-ip16-256',
        sku: 'GC-APL-IP16-256',
        name: '256GB Storage',
        price: 109999,
        originalPrice: 114900,
        stockQuantity: 5,
        inStock: true,
        attributes: { storage: '256GB' }
      }
    ]
  }
]

async function insert() {
  console.log('Inserting iPhones into Supabase...')
  for (const prod of iphones) {
    // Try RPC admin_create_product first
    const rpcRes = await supabase.rpc('admin_create_product', { p_product: prod })
    if (rpcRes.error) {
      console.warn('RPC failed, trying direct table upsert:', rpcRes.error.message)
      const directRes = await supabase.from('products').upsert(prod)
      if (directRes.error) {
        console.error('Direct upsert failed:', directRes.error.message)
      } else {
        console.log(`Successfully directly upserted ${prod.name} (₹${prod.selling_price})`)
      }
    } else {
      console.log(`Successfully created via RPC: ${prod.name} (₹${prod.selling_price})`)
    }
  }

  // Verify
  const { data, error } = await supabase.from('products').select('id, name, selling_price, brand').ilike('name', '%iphone%')
  console.log('\nVerification query for iPhones in Supabase:', data)
}

insert()
