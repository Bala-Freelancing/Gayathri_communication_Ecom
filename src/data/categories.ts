import { ProductCategory, ProductCategoryType } from '@/types/product'

export interface CategoryDefinition {
  id: ProductCategoryType
  slug: ProductCategoryType
  name: string
  shortName: string
  departmentTitle: string
  badgeLabel: string
  description: string
  metaDescription: string
  iconName: 'Smartphone' | 'Tv' | 'Refrigerator' | 'Headphones' | 'Monitor'
  displayOrder: number
  featuredBrands: string[]
  sampleSubcategories: string[]
  heroImage: string
}

export const CATEGORIES_CONFIG: CategoryDefinition[] = [
  {
    id: 'smartphones',
    slug: 'smartphones',
    name: 'Smartphones & Flagships',
    shortName: 'Smartphones',
    departmentTitle: 'Flagship Department',
    badgeLabel: 'Flagship Mobiles',
    description: 'Latest 5G smartphones, flagship titanium devices, and certified accessories with official manufacturer warranty.',
    metaDescription: 'Apple iPhone 16 Pro Max • Samsung Galaxy S24 Ultra • OnePlus 12',
    iconName: 'Smartphone',
    displayOrder: 1,
    featuredBrands: ['Apple', 'Samsung', 'OnePlus'],
    sampleSubcategories: ['Flagship 5G', 'Pro Photography', 'Fast Charging Phones'],
    heroImage: '/images/products/iphone16.jpg',
  },
  {
    id: 'smart-tvs',
    slug: 'smart-tvs',
    name: 'Smart TVs & Cinema OLED',
    shortName: 'Smart TVs',
    departmentTitle: 'Cinema Displays',
    badgeLabel: 'Cinema Displays',
    description: 'Cinema 4K, QLED, and self-lit OLED displays from Sony, Samsung, and LG with doorstep installation.',
    metaDescription: 'Sony BRAVIA XR • Acoustic OLED • 120Hz Gaming',
    iconName: 'Tv',
    displayOrder: 2,
    featuredBrands: ['Sony', 'Samsung', 'LG'],
    sampleSubcategories: ['OLED 4K', 'QLED HDR', 'Gaming Displays'],
    heroImage: '/images/products/sony-oled.jpg',
  },
  {
    id: 'home-appliances',
    slug: 'home-appliances',
    name: 'Home Appliances & Living',
    shortName: 'Home Appliances',
    departmentTitle: 'Living Appliances',
    badgeLabel: 'Living Appliances',
    description: 'Inverter refrigerators, AI direct-drive washing machines, and energy-efficient appliances.',
    metaDescription: 'LG AI Direct-Drive • Samsung Bespoke French Door',
    iconName: 'Refrigerator',
    displayOrder: 3,
    featuredBrands: ['LG', 'Samsung'],
    sampleSubcategories: ['Front-Load Washers', 'French-Door Refrigerators', 'Inverter Appliances'],
    heroImage: '/images/products/lg-washer.jpg',
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'Accessories & Wearables',
    shortName: 'Accessories',
    departmentTitle: 'Certified Accessories',
    badgeLabel: 'Mobile Accessories',
    description: 'Chargers, adapters, USB-C cables, earbuds, headphones, power banks, cases, tempered glass, and smartwatches.',
    metaDescription: 'Apple AirPods Pro 2 • Galaxy Watch 6 • GaN Fast Chargers',
    iconName: 'Headphones',
    displayOrder: 4,
    featuredBrands: ['Apple', 'Samsung', 'Anker'],
    sampleSubcategories: ['Earbuds & Audio', 'Smartwatches', 'Fast Chargers & Cables', 'Power Banks & Cases'],
    heroImage: '/images/products/airpods-pro-2.jpg',
  },
  {
    id: 'other-electronics',
    slug: 'other-electronics',
    name: 'Other Electronics & Peripherals',
    shortName: 'Other Electronics',
    departmentTitle: 'Work & Peripherals',
    badgeLabel: 'Peripherals & Gear',
    description: 'Monitors, routers, networking devices, keyboards, mice, UPS units, and computer peripherals.',
    metaDescription: 'LG UltraGear QHD • Wi-Fi 6 Routers • Logitech MX Master',
    iconName: 'Monitor',
    displayOrder: 5,
    featuredBrands: ['LG', 'TP-Link', 'Logitech'],
    sampleSubcategories: ['QHD & 4K Monitors', 'Wi-Fi 6 Routers', 'Ergonomic Mice & Keyboards', 'Projectors & UPS'],
    heroImage: '/images/products/lg-ultragear-monitor.jpg',
  },
]

export const getCategoryDisplayName = (category: ProductCategory): string => {
  if (category === 'all') return 'All Showroom Categories'
  const found = CATEGORIES_CONFIG.find((c) => c.id === category)
  return found ? found.name : category.replace('-', ' ')
}

export const getCategoryShortName = (category: ProductCategory): string => {
  if (category === 'all') return 'All'
  const found = CATEGORIES_CONFIG.find((c) => c.id === category)
  return found ? found.shortName : category.replace('-', ' ')
}

export const isValidCategory = (category: string): category is ProductCategory => {
  if (category === 'all') return true
  return CATEGORIES_CONFIG.some((c) => c.id === category)
}
