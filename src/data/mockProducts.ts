import { Product, StoreInfo } from '@/types/product'

export const storeDetails: StoreInfo = {
  name: "Gayathri Communication",
  tagline: "Authorized Retailer for Original Flagships, Smart TVs & Appliances",
  address: "116/2, L. F, Thuraiyur Road, Mannachanallur, Trichy 621005",
  landmark: "Near LIC Office",
  phone: "+91 98424 19358",
  whatsapp: "919842419358",
  email: "contact@gayathricommunication.com",
  timing: "10:00 AM – 9:30 PM (Daily)",
  isOpenNow: true,
  instagram: "https://instagram.com/gayathri_communication_",
  instagramHandle: "gayathri_communication_",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Gayathri+Communication,+116%2F2,+L.+F,+Thuraiyur+Road,+Near+LIC+Office,+Mannachanallur,+Trichy+621005",
  features: [
    {
      icon: "ShieldCheck",
      title: "100% Genuine Box-Pack",
      description: "Direct brand sealed with official manufacturer warranty & GST invoice.",
    },
    {
      icon: "Zap",
      title: "60-Min Express Pickup",
      description: "Order online and collect in-store in under an hour.",
    },
    {
      icon: "CreditCard",
      title: "Secure Counter Billing",
      description: "All major Credit/Debit Cards, UPI, Net Banking & Cash accepted.",
    },
  ],
}

export const brandPartners = [
  { name: "Xiaomi", logo: "📱 Authorized" },
  { name: "Infinix", logo: "⚡ Authorized" },
  { name: "Poco", logo: "🟡 Authorized" },
  { name: "iPhone", logo: "🍎 Authorized" },
  { name: "Vivo", logo: "💎 Authorized" },
  { name: "OPPO", logo: "🟢 Authorized" },
  { name: "Nothing", logo: "⚪ Authorized" },
  { name: "Motorola", logo: "📡 Authorized" },
]

export const customerReviews = [
  {
    id: 1,
    name: "Rajesh K.",
    location: "Manachanallur",
    rating: 5,
    date: "Verified Customer",
    comment: "100% original iPhone 16 Pro Max sealed box with official GST invoice. Data transfer was done for free right in the showroom!",
    product: "Apple iPhone 16 Pro Max",
  },
  {
    id: 2,
    name: "Suresh Raman",
    location: "Tiruchirappalli",
    rating: 5,
    date: "Verified Customer",
    comment: "Purchased the Sony Bravia OLED TV. Got seamless instant billing at the showroom counter and prompt brand doorstep wall mounting.",
    product: "Sony BRAVIA XR 65\" 4K OLED",
  },
  {
    id: 3,
    name: "Priya M.",
    location: "Thuraiyur",
    rating: 5,
    date: "Verified Customer",
    comment: "Bought the LG AI washing machine with festive pricing. Genuine showroom warranty and very helpful customer guidance.",
    product: "LG 9 Kg AI Washer",
  },
]

export const faqList = [
  {
    question: "Are all products brand-new and 100% genuine?",
    answer: "Yes, every device sold at Gayathri Communication is brand sealed in factory-packed condition. Every purchase comes with an official GST tax invoice and manufacturer warranty valid at all brand authorized service centers.",
  },
  {
    question: "What payment methods are accepted at Gayathri Communication?",
    answer: "We accept all major UPI apps (GPay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Cash at our showroom billing counter with instant GST invoice.",
  },
  {
    question: "How fast is 60-Minute Express Pickup?",
    answer: "When you inquire or place an order via our website or WhatsApp, our staff prepares and reserves your box-packed device immediately. You can visit our showroom counter within 60 minutes for verification, payment, and unboxing.",
  },
  {
    question: "Do large appliances include installation?",
    answer: "Yes, for Smart TVs, Refrigerators, and Washing Machines, authorized brand service technicians provide doorstep delivery and professional installation support.",
  },
]

export const productsData: Product[] = [
  {
    "id": "gc-infinix-x20-wireless-speaker",
    "name": "Infinix X20 Wireless Speaker",
    "tagline": "Dynamic 360° RGB Beat-Sync Lighting with Booming Punchy Bass.",
    "description": "Official Infinix X20 Wireless Party Speaker authorized showroom stock at Gayathri Communication. Booming 20W stereo output with deep bass radiator, dynamic 360-degree pulsating RGB light rings, 12-hour battery life, and IPX5 splash resistance.",
    "brand": "Infinix",
    "category": "accessories",
    "badge": "Authorized Retail",
    "isBestSeller": false,
    "isNewLaunch": false,
    "isDealOfTheDay": false,
    "originalPrice": 3999,
    "price": 1999,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/infinix/infinix_speaker.webp",
    "gallery": [
      "/images/products/infinix/infinix_speaker.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-INF-0018",
    "specs": [
      {
        "label": "Audio Output",
        "value": "20W Deep Bass Stereo Sound Resonator"
      },
      {
        "label": "Lighting",
        "value": "360° RGB Multi-Mode Beat-Sync Ambient Lights"
      },
      {
        "label": "Battery",
        "value": "Up to 12 Hours Continuous Music Playback"
      },
      {
        "label": "Connectivity",
        "value": "Bluetooth 5.3, AUX, TF Card & USB Playback"
      },
      {
        "label": "Durability",
        "value": "IPX5 Splashproof Outdoor Design"
      }
    ],
    "highlights": [
      "Audio Output: 20W Deep Bass Stereo Sound Resonator",
      "Lighting: 360° RGB Multi-Mode Beat-Sync Ambient Lights",
      "Battery: Up to 12 Hours Continuous Music Playback"
    ],
    "variants": [
      {
        "id": "var-infinix-18-0",
        "sku": "GC-INF-0018",
        "name": "Standard",
        "price": 1999,
        "inStock": true,
        "attributes": {
          "storage": "Standard"
        },
        "originalPrice": 3999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-hot-70-pro",
    "name": "Infinix Hot 70 Pro",
    "tagline": "Sleek Minimalist Aesthetic with 120Hz AMOLED & 64MP Camera.",
    "description": "Official Infinix Hot 70 Pro authorized showroom stock at Gayathri Communication. Premium matte texture, fluid 120Hz AMOLED panel, 64MP ultra-sharp triple camera system, and 33W rapid charging.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "New Launch",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 32999,
    "price": 24999,
    "rating": 4.8,
    "reviewCount": 16,
    "image": "/images/products/infinix/infinix_hot70pro.webp",
    "gallery": [
      "/images/products/infinix/infinix_hot70pro.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-INF-0016",
    "specs": [
      {
        "label": "Display",
        "value": "6.78-inch FHD+ 120Hz Fluid AMOLED"
      },
      {
        "label": "Camera",
        "value": "64MP Ultra-Clear Triple Camera"
      },
      {
        "label": "Processor",
        "value": "Octa-Core 5G Performance Processor"
      },
      {
        "label": "Battery",
        "value": "5000mAh Battery with 33W Fast Charge"
      },
      {
        "label": "Build",
        "value": "Ultra-Thin Body with IP54 Splash Resistance"
      }
    ],
    "highlights": [
      "Display: 6.78-inch FHD+ 120Hz Fluid AMOLED",
      "Camera: 64MP Ultra-Clear Triple Camera",
      "Processor: Octa-Core 5G Performance Processor"
    ],
    "variants": [
      {
        "id": "var-infinix-16-0",
        "sku": "GC-INF-0016",
        "name": "6GB + 128GB",
        "price": 24999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 32999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-17-1",
        "sku": "GC-INF-0017",
        "name": "8GB + 128GB",
        "price": 27999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 36999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-note-60-pro",
    "name": "Infinix Note 60 Pro",
    "tagline": "Active Halo AI Lighting with 108MP OIS Camera & 70W FastCharge.",
    "description": "Official Infinix Note 60 Pro authorized showroom stock at Gayathri Communication. Featuring dynamic Active Halo multi-color AI notification lights, 3D curved 120Hz AMOLED, 108MP OIS shooter, and 70W FastCharge with 20W Wireless MagCharge.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "New Launch",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 39999,
    "price": 35999,
    "rating": 4.8,
    "reviewCount": 14,
    "image": "/images/products/infinix/Infinix-Note-60-Pro.png",
    "gallery": [
      "/images/products/infinix/Infinix-Note-60-Pro.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-INF-0014",
    "specs": [
      {
        "label": "Display",
        "value": "6.78-inch 120Hz 3D-Curved AMOLED (1300 nits)"
      },
      {
        "label": "Lighting",
        "value": "Active Halo Multi-Color AI Dynamic Lights"
      },
      {
        "label": "Camera",
        "value": "108MP OIS Primary + 32MP Crystal Selfie"
      },
      {
        "label": "Charging",
        "value": "70W All-Round FastCharge + 20W Wireless"
      },
      {
        "label": "Audio",
        "value": "Dual Speakers Tuned by JBL"
      }
    ],
    "highlights": [
      "Display: 6.78-inch 120Hz 3D-Curved AMOLED (1300 nits)",
      "Lighting: Active Halo Multi-Color AI Dynamic Lights",
      "Camera: 108MP OIS Primary + 32MP Crystal Selfie"
    ],
    "variants": [
      {
        "id": "var-infinix-14-0",
        "sku": "GC-INF-0014",
        "name": "8GB + 128GB",
        "price": 35999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 39999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-15-1",
        "sku": "GC-INF-0015",
        "name": "8GB + 256GB",
        "price": 39999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 44999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-note-edge",
    "name": "Infinix Note Edge",
    "tagline": "3D Curved 120Hz AMOLED Edge Display with Sound Tuned by JBL.",
    "description": "Official Infinix Note Edge authorized showroom stock at Gayathri Communication. Luxurious 3D curved borderless AMOLED display, ultra-slim titanium-grade profile, 108MP OIS camera, and high-fidelity sound by JBL.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "New Launch",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 26999,
    "price": 26999,
    "rating": 4.8,
    "reviewCount": 17,
    "image": "/images/products/infinix/infinix-note-edge-2.jpg",
    "gallery": [
      "/images/products/infinix/infinix-note-edge-2.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 40,
    "sku": "GC-INF-0010",
    "specs": [
      {
        "label": "Display",
        "value": "6.78-inch 3D Curved 120Hz AMOLED Screen"
      },
      {
        "label": "Processor",
        "value": "MediaTek Dimensity 6nm 5G Processor"
      },
      {
        "label": "Camera",
        "value": "108MP OIS Super-Zoom Camera"
      },
      {
        "label": "Audio",
        "value": "Dual Hi-Res Stereo Speakers Sound by JBL"
      },
      {
        "label": "Charging",
        "value": "45W All-Round FastCharge 2.0"
      }
    ],
    "highlights": [
      "Display: 6.78-inch 3D Curved 120Hz AMOLED Screen",
      "Processor: MediaTek Dimensity 6nm 5G Processor",
      "Camera: 108MP OIS Super-Zoom Camera"
    ],
    "variants": [
      {
        "id": "var-infinix-10-0",
        "sku": "GC-INF-0010",
        "name": "6GB + 128GB",
        "price": 26999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 26999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-11-1",
        "sku": "GC-INF-0011",
        "name": "8GB + 128GB",
        "price": 28999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 29999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-12-2",
        "sku": "GC-INF-0012",
        "name": "8GB + 256GB",
        "price": 30999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 34999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-13-3",
        "sku": "GC-INF-0013",
        "name": "8GB + 256GB (JBL Edition)",
        "price": 26999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB (JBL Edition)"
        },
        "originalPrice": 34999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-gt-30-pro",
    "name": "Infinix GT 30 Pro",
    "tagline": "Cyber-Mecha Gaming Flagship with RGB LED Interface & 144Hz 1.5K AMOLED.",
    "description": "Official Infinix GT 30 Pro authorized showroom stock at Gayathri Communication. Ultimate gaming performance with Dimensity 5G chip, VC liquid cooling chamber, dual JBL-tuned stereo sound, and 68W All-Round FastCharge.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "New Launch",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 31999,
    "price": 31999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/infinix/Infinix GT 30-pro.jpg",
    "gallery": [
      "/images/products/infinix/Infinix GT 30-pro.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-INF-0008",
    "specs": [
      {
        "label": "Display",
        "value": "6.67-inch 144Hz Eye-Care 1.5K 10-bit AMOLED"
      },
      {
        "label": "Processor",
        "value": "Flagship MediaTek Dimensity 5G Chipset"
      },
      {
        "label": "Camera",
        "value": "108MP Ultra-Clear OIS Camera + 32MP Front"
      },
      {
        "label": "Charging",
        "value": "68W Ultra FastCharge + 15W Wireless Charge"
      },
      {
        "label": "Audio",
        "value": "Dual Stereo Speakers Tuned by JBL"
      }
    ],
    "highlights": [
      "Display: 6.67-inch 144Hz Eye-Care 1.5K 10-bit AMOLED",
      "Processor: Flagship MediaTek Dimensity 5G Chipset",
      "Camera: 108MP Ultra-Clear OIS Camera + 32MP Front"
    ],
    "variants": [
      {
        "id": "var-infinix-8-0",
        "sku": "GC-INF-0008",
        "name": "8GB + 256GB",
        "price": 31999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 31999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-9-1",
        "sku": "GC-INF-0009",
        "name": "12GB + 256GB",
        "price": 34999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 34999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-gt-30",
    "name": "Infinix GT 30",
    "tagline": "Futuristic Cyber-Mecha Gaming Powerhouse with 144Hz AMOLED Display.",
    "description": "Official Infinix GT 30 authorized showroom stock at Gayathri Communication. Cyber-mecha design aesthetics combined with Dimensity 5G power, 144Hz AMOLED screen, 108MP camera, and 45W All-Round FastCharge.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "New Launch",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 24999,
    "price": 21999,
    "rating": 4.8,
    "reviewCount": 20,
    "image": "/images/products/infinix/infinix-gt30.webp",
    "gallery": [
      "/images/products/infinix/infinix-gt30.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-INF-0006",
    "specs": [
      {
        "label": "Display",
        "value": "6.67-inch 144Hz FHD+ AMOLED Display"
      },
      {
        "label": "Processor",
        "value": "MediaTek Dimensity Gaming 5G Platform"
      },
      {
        "label": "Camera",
        "value": "108MP Triple AI Camera with Night Filters"
      },
      {
        "label": "Battery",
        "value": "5000mAh Battery with 45W Fast Charging"
      },
      {
        "label": "Cooling",
        "value": "Vapor Chamber Liquid Cooling"
      }
    ],
    "highlights": [
      "Display: 6.67-inch 144Hz FHD+ AMOLED Display",
      "Processor: MediaTek Dimensity Gaming 5G Platform",
      "Camera: 108MP Triple AI Camera with Night Filters"
    ],
    "variants": [
      {
        "id": "var-infinix-6-0",
        "sku": "GC-INF-0006",
        "name": "8GB + 128GB",
        "price": 21999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 24999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-7-1",
        "sku": "GC-INF-0007",
        "name": "8GB + 256GB",
        "price": 23999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 26999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-hot-60-5g",
    "name": "Infinix Hot 60 5G",
    "tagline": "High-Performance 5G with 6GB RAM, 128GB Storage and 120Hz Display.",
    "description": "Official Infinix Hot 60 5G authorized showroom stock at Gayathri Communication. Unleash lightning 5G performance with 6GB RAM, high-speed 128GB storage, and a vivid 120Hz refresh display.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "New Launch",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 17999,
    "price": 17999,
    "rating": 4.8,
    "reviewCount": 19,
    "image": "/images/products/infinix/infinix-hot60i.webp",
    "gallery": [
      "/images/products/infinix/infinix-hot60i.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-INF-0005",
    "specs": [
      {
        "label": "Display",
        "value": "6.78-inch FHD+ 120Hz High-Refresh Display"
      },
      {
        "label": "Processor",
        "value": "MediaTek Dimensity 5G Architecture"
      },
      {
        "label": "Camera",
        "value": "50MP AI Ultra-Clear Camera"
      },
      {
        "label": "Battery",
        "value": "5000mAh Battery with Type-C Fast Charging"
      },
      {
        "label": "Storage",
        "value": "6GB RAM + 128GB Storage"
      }
    ],
    "highlights": [
      "Display: 6.78-inch FHD+ 120Hz High-Refresh Display",
      "Processor: MediaTek Dimensity 5G Architecture",
      "Camera: 50MP AI Ultra-Clear Camera"
    ],
    "variants": [
      {
        "id": "var-infinix-5-0",
        "sku": "GC-INF-0005",
        "name": "6GB + 128GB",
        "price": 17999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 17999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-hot-60i-5g",
    "name": "Infinix Hot 60i 5G",
    "tagline": "True 5G Speed with Colossal 6000mAh Battery and Next-Gen AI Features.",
    "description": "Official Infinix Hot 60i 5G authorized showroom stock at Gayathri Communication. Built for speed with all major Indian 5G band support, massive 6000mAh battery for up to 128 hours of audio, and intelligent AI camera tools.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "New Launch",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 19999,
    "price": 17499,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/infinix/infinix-hot60i.webp",
    "gallery": [
      "/images/products/infinix/infinix-hot60i.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-INF-0004",
    "specs": [
      {
        "label": "Display",
        "value": "6.78-inch FHD+ 120Hz Ultra Smooth Display"
      },
      {
        "label": "Network",
        "value": "Dual 5G Bands (All Major Networks)"
      },
      {
        "label": "Battery",
        "value": "6000mAh Colossal Battery with 18W Fast Charge"
      },
      {
        "label": "Camera",
        "value": "50MP AI Dual Camera with Super Night Mode"
      },
      {
        "label": "Processor",
        "value": "MediaTek Dimensity 5G Octa-Core"
      }
    ],
    "highlights": [
      "Display: 6.78-inch FHD+ 120Hz Ultra Smooth Display",
      "Network: Dual 5G Bands (All Major Networks)",
      "Battery: 6000mAh Colossal Battery with 18W Fast Charge"
    ],
    "variants": [
      {
        "id": "var-infinix-4-0",
        "sku": "GC-INF-0004",
        "name": "12GB + 84GB",
        "price": 17499,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 84GB"
        },
        "originalPrice": 19999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-infinix-smart-20-hd",
    "name": "Infinix Smart 20 HD",
    "tagline": "Immersive 6.7\" Fluid Punch-Hole Display with 5000mAh Day-Long Battery.",
    "description": "Official Infinix Smart 20 HD authorized showroom stock at Gayathri Communication. Packed with a vibrant 90Hz fluid punch-hole display, massive 5000mAh power unit, dual AI camera and expandable virtual RAM.",
    "brand": "Infinix",
    "category": "smartphones",
    "badge": "Best Seller",
    "isBestSeller": true,
    "isNewLaunch": false,
    "isDealOfTheDay": false,
    "originalPrice": 19999,
    "price": 10999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/infinix/Infinix-smart-20.png",
    "gallery": [
      "/images/products/infinix/Infinix-smart-20.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 30,
    "sku": "GC-INF-0001",
    "specs": [
      {
        "label": "Display",
        "value": "6.7-inch HD+ 90Hz Fluid Display"
      },
      {
        "label": "Processor",
        "value": "Octa-Core High-Efficiency Processor"
      },
      {
        "label": "Camera",
        "value": "13MP Dual AI Rear + 8MP Front Selfie"
      },
      {
        "label": "Battery",
        "value": "5000mAh Battery with Type-C Charging"
      },
      {
        "label": "OS",
        "value": "XOS Powered by Android"
      }
    ],
    "highlights": [
      "Display: 6.7-inch HD+ 90Hz Fluid Display",
      "Processor: Octa-Core High-Efficiency Processor",
      "Camera: 13MP Dual AI Rear + 8MP Front Selfie"
    ],
    "variants": [
      {
        "id": "var-infinix-1-0",
        "sku": "GC-INF-0001",
        "name": "3GB + 64GB",
        "price": 10999,
        "inStock": true,
        "attributes": {
          "storage": "3GB + 64GB"
        },
        "originalPrice": 19999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-2-1",
        "sku": "GC-INF-0002",
        "name": "4GB + 64GB",
        "price": 12999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 64GB"
        },
        "originalPrice": 19999,
        "stockQuantity": 10
      },
      {
        "id": "var-infinix-3-2",
        "sku": "GC-INF-0003",
        "name": "4GB + 128GB",
        "price": 14499,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 21999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-vivo-vivo-y31t",
    "name": "Vivo Y31T",
    "tagline": "7200mAh battery, 44W charging, 50MP AI camera and IP68/IP69 protection.",
    "description": "Official Vivo Vivo Y31T authorized showroom stock at Gayathri Communication. Brand-sealed box with genuine GST invoice, standard accessories and 1-year manufacturer warranty.",
    "brand": "Vivo",
    "category": "smartphones",
    "badge": "Showroom Official",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 30779,
    "price": 26999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/vivo/vivo-y31T.png",
    "gallery": [
      "/images/products/vivo/vivo-y31T.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-VIV-0009",
    "specs": [
      {
        "label": "Processor",
        "value": "Snapdragon 4 Gen 2"
      },
      {
        "label": "Battery",
        "value": "7200mAh battery"
      },
      {
        "label": "Charging",
        "value": "44W charging"
      },
      {
        "label": "Camera",
        "value": "50MP + 2MP rear cameras"
      },
      {
        "label": "Camera",
        "value": "8MP front camera"
      },
      {
        "label": "Durability",
        "value": "IP68/IP69."
      }
    ],
    "highlights": [
      "Processor: Snapdragon 4 Gen 2",
      "Battery: 7200mAh battery",
      "Charging: 44W charging"
    ],
    "variants": [
      {
        "id": "var-vivo-9-0",
        "sku": "GC-SMA-VIV-0009",
        "name": "4GB + 128GB",
        "price": 26999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 30779,
        "stockQuantity": 10
      },
      {
        "id": "var-vivo-10-1",
        "sku": "GC-SMA-VIV-0010",
        "name": "6GB + 128GB",
        "price": 31499,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 35909,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-vivo-vivo-y31",
    "name": "Vivo Y31",
    "tagline": "6500mAh battery, 44W FlashCharge, 50MP camera and IP68/IP69 protection.",
    "description": "Official Vivo Vivo Y31 authorized showroom stock at Gayathri Communication. Brand-sealed box with genuine GST invoice, standard accessories and 1-year manufacturer warranty.",
    "brand": "Vivo",
    "category": "smartphones",
    "badge": "Showroom Official",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 31919,
    "price": 27999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/vivo/vivo-y31.webp",
    "gallery": [
      "/images/products/vivo/vivo-y31.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-VIV-0007",
    "specs": [
      {
        "label": "Processor",
        "value": "Snapdragon 4 Gen 2"
      },
      {
        "label": "Battery",
        "value": "6500mAh battery"
      },
      {
        "label": "Charging",
        "value": "44W charging"
      },
      {
        "label": "Camera",
        "value": "50MP rear camera"
      },
      {
        "label": "Durability",
        "value": "IP68/IP69 protection."
      }
    ],
    "highlights": [
      "Processor: Snapdragon 4 Gen 2",
      "Battery: 6500mAh battery",
      "Charging: 44W charging"
    ],
    "variants": [
      {
        "id": "var-vivo-7-0",
        "sku": "GC-SMA-VIV-0007",
        "name": "6GB + 128GB",
        "price": 27999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 31919,
        "stockQuantity": 10
      },
      {
        "id": "var-vivo-8-1",
        "sku": "GC-SMA-VIV-0008",
        "name": "6GB + 256GB",
        "price": 31999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 256GB"
        },
        "originalPrice": 36479,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-vivo-vivo-y21",
    "name": "Vivo Y21",
    "tagline": "5G-ready performance, 6500mAh battery, 44W charging and a smooth 120Hz display.",
    "description": "Official Vivo Vivo Y21 authorized showroom stock at Gayathri Communication. Brand-sealed box with genuine GST invoice, standard accessories and 1-year manufacturer warranty.",
    "brand": "Vivo",
    "category": "smartphones",
    "badge": "Showroom Official",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 23939,
    "price": 20999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/vivo/vivo-y21.jpg",
    "gallery": [
      "/images/products/vivo/vivo-y21.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 30,
    "sku": "GC-SMA-VIV-0004",
    "specs": [
      {
        "label": "Processor",
        "value": "Dimensity 6300 5G"
      },
      {
        "label": "Display",
        "value": "6.74-inch HD+ 120Hz display"
      },
      {
        "label": "Battery",
        "value": "6500mAh battery"
      },
      {
        "label": "Charging",
        "value": "44W charging"
      },
      {
        "label": "Camera",
        "value": "50MP rear camera"
      },
      {
        "label": "Durability",
        "value": "IP65."
      }
    ],
    "highlights": [
      "Processor: Dimensity 6300 5G",
      "Display: 6.74-inch HD+ 120Hz display",
      "Battery: 6500mAh battery"
    ],
    "variants": [
      {
        "id": "var-vivo-4-0",
        "sku": "GC-SMA-VIV-0004",
        "name": "4GB + 64GB",
        "price": 20999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 64GB"
        },
        "originalPrice": 23939,
        "stockQuantity": 10
      },
      {
        "id": "var-vivo-5-1",
        "sku": "GC-SMA-VIV-0005",
        "name": "4GB + 128GB",
        "price": 23999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 27359,
        "stockQuantity": 10
      },
      {
        "id": "var-vivo-6-2",
        "sku": "GC-SMA-VIV-0006",
        "name": "6GB + 128GB",
        "price": 27999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 31919,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-vivo-vivo-y11",
    "name": "Vivo Y11",
    "tagline": "5G connectivity, 6500mAh battery, 120Hz display and IP65 protection.",
    "description": "Official Vivo Vivo Y11 authorized showroom stock at Gayathri Communication. Brand-sealed box with genuine GST invoice, standard accessories and 1-year manufacturer warranty.",
    "brand": "Vivo",
    "category": "smartphones",
    "badge": "Showroom Official",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 21659,
    "price": 18999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/vivo/vivo_y11.webp",
    "gallery": [
      "/images/products/vivo/vivo_y11.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-VIV-0002",
    "specs": [
      {
        "label": "Processor",
        "value": "Dimensity 6300 5G"
      },
      {
        "label": "Battery",
        "value": "6500mAh battery"
      },
      {
        "label": "Charging",
        "value": "15W charging"
      },
      {
        "label": "Display",
        "value": "120Hz HD+ display"
      },
      {
        "label": "Durability",
        "value": "IP65"
      },
      {
        "label": "Feature",
        "value": "4GB+64GB / 4GB+128GB options."
      }
    ],
    "highlights": [
      "Processor: Dimensity 6300 5G",
      "Battery: 6500mAh battery",
      "Charging: 15W charging"
    ],
    "variants": [
      {
        "id": "var-vivo-2-0",
        "sku": "GC-SMA-VIV-0002",
        "name": "4GB + 64GB",
        "price": 18999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 64GB"
        },
        "originalPrice": 21659,
        "stockQuantity": 10
      },
      {
        "id": "var-vivo-3-1",
        "sku": "GC-SMA-VIV-0003",
        "name": "4GB + 128GB",
        "price": 22499,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 25649,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-vivo-vivo-y05",
    "name": "Vivo Y05",
    "tagline": "6500mAh battery, 120Hz HD+ display, IP65 protection; 8MP rear and 5MP front cameras.",
    "description": "Official Vivo Vivo Y05 authorized showroom stock at Gayathri Communication. Brand-sealed box with genuine GST invoice, standard accessories and 1-year manufacturer warranty.",
    "brand": "Vivo",
    "category": "smartphones",
    "badge": "Showroom Official",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 18239,
    "price": 15999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/vivo/vivo-y05.webp",
    "gallery": [
      "/images/products/vivo/vivo-y05.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Manufacturer Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-SMA-VIV-0001",
    "specs": [
      {
        "label": "Display",
        "value": "6.74-inch HD+ LCD, up to 120Hz"
      },
      {
        "label": "Processor",
        "value": "T7225"
      },
      {
        "label": "Battery",
        "value": "6500mAh battery"
      },
      {
        "label": "Charging",
        "value": "15W charging"
      },
      {
        "label": "Camera",
        "value": "8MP rear + 5MP front"
      },
      {
        "label": "Durability",
        "value": "IP65."
      }
    ],
    "highlights": [
      "Display: 6.74-inch HD+ LCD, up to 120Hz",
      "Processor: T7225",
      "Battery: 6500mAh battery"
    ],
    "variants": [
      {
        "id": "var-vivo-1-0",
        "sku": "GC-SMA-VIV-0001",
        "name": "4GB + 64GB",
        "price": 15999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 64GB"
        },
        "originalPrice": 18239,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "xiaomi-xiaomi-pad-8-wi-fi-nano-pen",
    "name": "Xiaomi Pad 8 Wi-Fi Nano-Pen",
    "tagline": "The ultimate productivity bundle: Nano matte anti-glare screen + Focus Pen included.",
    "description": "The ultimate productivity bundle: Nano matte anti-glare screen + Focus Pen included.",
    "brand": "Xiaomi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 61559,
    "price": 53999,
    "rating": 4.8,
    "reviewCount": 22,
    "image": "/images/products/redmi/xiaomi_pad8_wifi-pen.webp",
    "gallery": [
      "/images/products/redmi/xiaomi_pad8_wifi-pen.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-OTH-XIA-0025",
    "specs": [
      {
        "label": "Brand",
        "value": "Xiaomi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-xp8np-1",
        "name": "12GB + 256GB",
        "price": 53999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 61559,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "xiaomi-xiaomi-pad-8-wi-fi-pen",
    "name": "Xiaomi Pad 8 Wi-Fi Pen",
    "tagline": "Includes precision Focus Pen with 8192 pressure levels for creative professionals.",
    "description": "Includes precision Focus Pen with 8192 pressure levels for creative professionals.",
    "brand": "Xiaomi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 59279,
    "price": 51999,
    "rating": 4.8,
    "reviewCount": 21,
    "image": "/images/products/redmi/xiaomi_pad8_wifi-pen.webp",
    "gallery": [
      "/images/products/redmi/xiaomi_pad8_wifi-pen.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-OTH-XIA-0024",
    "specs": [
      {
        "label": "Brand",
        "value": "Xiaomi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-xp8p-1",
        "name": "12GB + 256GB",
        "price": 51999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 59279,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "xiaomi-xiaomi-pad-8-wi-fi-nano",
    "name": "Xiaomi Pad 8 Wi-Fi Nano",
    "tagline": "Anti-glare nano-textured matte display for paper-like writing and reading comfort.",
    "description": "Anti-glare nano-textured matte display for paper-like writing and reading comfort.",
    "brand": "Xiaomi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 55859,
    "price": 48999,
    "rating": 4.8,
    "reviewCount": 20,
    "image": "/images/products/redmi/Xiaomi-pad-8-wifi.webp",
    "gallery": [
      "/images/products/redmi/Xiaomi-pad-8-wifi.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-OTH-XIA-0023",
    "specs": [
      {
        "label": "Brand",
        "value": "Xiaomi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-xp8n-1",
        "name": "12GB + 256GB",
        "price": 48999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 55859,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "xiaomi-xiaomi-pad-8-wi-fi",
    "name": "Xiaomi Pad 8 Wi-Fi",
    "tagline": "Flagship Snapdragon processor, 3K 144Hz screen, and metal unibody craftsmanship.",
    "description": "Flagship Snapdragon processor, 3K 144Hz screen, and metal unibody craftsmanship.",
    "brand": "Xiaomi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 44459,
    "price": 38999,
    "rating": 4.8,
    "reviewCount": 19,
    "image": "/images/products/redmi/Xiaomi-pad-8-wifi.webp",
    "gallery": [
      "/images/products/redmi/Xiaomi-pad-8-wifi.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-OTH-XIA-0022",
    "specs": [
      {
        "label": "Brand",
        "value": "Xiaomi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-xp8-1",
        "name": "8GB + 128GB",
        "price": 38999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 44459,
        "stockQuantity": 10
      },
      {
        "id": "var-xp8-2",
        "name": "12GB + 256GB",
        "price": 46999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 53579,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-pad-2-pro-5g",
    "name": "Redmi Pad 2 Pro 5G",
    "tagline": "Pro performance with ultra-fast 5G SIM support and massive 12.1-inch screen.",
    "description": "Pro performance with ultra-fast 5G SIM support and massive 12.1-inch screen.",
    "brand": "Redmi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 36479,
    "price": 31999,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/redmi/redmi_pad2pro.webp",
    "gallery": [
      "/images/products/redmi/redmi_pad2pro.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-OTH-RED-0021",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-rp2p5-1",
        "name": "8GB + 128GB",
        "price": 31999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 36479,
        "stockQuantity": 10
      },
      {
        "id": "var-rp2p5-2",
        "name": "8GB + 256GB",
        "price": 34999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 39899,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-pad-2-pro-wi-fi",
    "name": "Redmi Pad 2 Pro Wi-Fi",
    "tagline": "Large 12.1-inch 2.5K 120Hz display with 10,000mAh battery and Dolby Vision.",
    "description": "Large 12.1-inch 2.5K 120Hz display with 10,000mAh battery and Dolby Vision.",
    "brand": "Redmi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 33059,
    "price": 28999,
    "rating": 4.8,
    "reviewCount": 17,
    "image": "/images/products/redmi/redmi_pad2pro.webp",
    "gallery": [
      "/images/products/redmi/redmi_pad2pro.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-OTH-RED-0020",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-rp2pw-1",
        "name": "8GB + 128GB",
        "price": 28999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 33059,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-pad-2-wi-fi-plus-cellular",
    "name": "Redmi Pad 2 Wi-Fi + Cellular",
    "tagline": "Stay connected anywhere with 4G LTE cellular data and 2K eye-care display.",
    "description": "Stay connected anywhere with 4G LTE cellular data and 2K eye-care display.",
    "brand": "Redmi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 23939,
    "price": 20999,
    "rating": 4.8,
    "reviewCount": 16,
    "image": "/images/products/redmi/redmi_pad2_wifi+cellular.webp",
    "gallery": [
      "/images/products/redmi/redmi_pad2_wifi+cellular.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 30,
    "sku": "GC-OTH-RED-0019",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-rp2c-1",
        "name": "4GB + 128GB",
        "price": 20999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 23939,
        "stockQuantity": 10
      },
      {
        "id": "var-rp2c-2",
        "name": "6GB + 128GB",
        "price": 23999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 27359,
        "stockQuantity": 10
      },
      {
        "id": "var-rp2c-3",
        "name": "8GB + 256GB",
        "price": 25999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 29639,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-pad-2-wi-fi",
    "name": "Redmi Pad 2 Wi-Fi",
    "tagline": "All-day entertainment and productivity tablet with immersive quad speakers.",
    "description": "All-day entertainment and productivity tablet with immersive quad speakers.",
    "brand": "Redmi",
    "category": "other-electronics",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 22799,
    "price": 19999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/redmi/redmi_pad2_wifi.webp",
    "gallery": [
      "/images/products/redmi/redmi_pad2_wifi.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-OTH-RED-0018",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-rp2w-1",
        "name": "4GB + 128GB",
        "price": 19999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 22799,
        "stockQuantity": 10
      },
      {
        "id": "var-rp2w-2",
        "name": "8GB + 128GB",
        "price": 21999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 25079,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "xiaomi-xiaomi-17-ultra",
    "name": "Xiaomi 17 Ultra",
    "tagline": "The Pinnacle of Mobile Imagery with 1-inch sensor Leica Quad Telephoto system.",
    "description": "The Pinnacle of Mobile Imagery with 1-inch sensor Leica Quad Telephoto system.",
    "brand": "Xiaomi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 159599,
    "price": 139999,
    "rating": 4.8,
    "reviewCount": 14,
    "image": "/images/products/redmi/xiaomi-17-ultra.avif",
    "gallery": [
      "/images/products/redmi/xiaomi-17-ultra.avif"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-SMA-XIA-0017",
    "specs": [
      {
        "label": "Brand",
        "value": "Xiaomi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-x17u-1",
        "name": "16GB + 512GB",
        "price": 139999,
        "inStock": true,
        "attributes": {
          "storage": "16GB + 512GB"
        },
        "originalPrice": 159599,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "xiaomi-xiaomi-17",
    "name": "Xiaomi 17",
    "tagline": "Compact luxury powerhouse with Snapdragon 8 Elite and Leica Summilux lens.",
    "description": "Compact luxury powerhouse with Snapdragon 8 Elite and Leica Summilux lens.",
    "brand": "Xiaomi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 102599,
    "price": 89999,
    "rating": 4.8,
    "reviewCount": 13,
    "image": "/images/products/redmi/xiaomi_17.webp",
    "gallery": [
      "/images/products/redmi/xiaomi_17.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-SMA-XIA-0016",
    "specs": [
      {
        "label": "Brand",
        "value": "Xiaomi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-x17-1",
        "name": "12GB + 512GB",
        "price": 89999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 512GB"
        },
        "originalPrice": 102599,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "xiaomi-xiaomi-17t",
    "name": "Xiaomi 17T",
    "tagline": "Masterpiece in Sight: Leica optics and flagship MediaTek Dimensity power.",
    "description": "Masterpiece in Sight: Leica optics and flagship MediaTek Dimensity power.",
    "brand": "Xiaomi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 79799,
    "price": 69999,
    "rating": 4.8,
    "reviewCount": 12,
    "image": "/images/products/redmi/xiaomi_17.webp",
    "gallery": [
      "/images/products/redmi/xiaomi_17.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-XIA-0015",
    "specs": [
      {
        "label": "Brand",
        "value": "Xiaomi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-17t-1",
        "name": "12GB + 256GB",
        "price": 69999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 79799,
        "stockQuantity": 10
      },
      {
        "id": "var-17t-2",
        "name": "12GB + 512GB",
        "price": 74999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 512GB"
        },
        "originalPrice": 85499,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-turbo-5-5g",
    "name": "Redmi Turbo 5 5G",
    "tagline": "Pure esports gaming power with flagship Snapdragon 8-series architecture.",
    "description": "Pure esports gaming power with flagship Snapdragon 8-series architecture.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 47879,
    "price": 41999,
    "rating": 4.8,
    "reviewCount": 26,
    "image": "/images/products/redmi/redmi-turbo-5.webp",
    "gallery": [
      "/images/products/redmi/redmi-turbo-5.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0014",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-t5-1",
        "name": "8GB + 256GB",
        "price": 41999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 47879,
        "stockQuantity": 10
      },
      {
        "id": "var-t5-2",
        "name": "12GB + 256GB",
        "price": 46999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 53579,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-note-17-pro-max",
    "name": "Redmi Note 17 Pro Max",
    "tagline": "The ultimate SuperNote flagship with 120W charging and cinematic display.",
    "description": "The ultimate SuperNote flagship with 120W charging and cinematic display.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 56999,
    "price": 49999,
    "rating": 4.8,
    "reviewCount": 25,
    "image": "/images/products/redmi/redmi_note17pro_max.webp",
    "gallery": [
      "/images/products/redmi/redmi_note17pro_max.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0013",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-n17pm-1",
        "name": "8GB + 256GB",
        "price": 49999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 56999,
        "stockQuantity": 10
      },
      {
        "id": "var-n17pm-2",
        "name": "12GB + 256GB",
        "price": 55999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 63839,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-note-17-pro-5g",
    "name": "Redmi Note 17 Pro 5G",
    "tagline": "Flagship-grade sensor with Dimensity high-efficiency 5G chipset.",
    "description": "Flagship-grade sensor with Dimensity high-efficiency 5G chipset.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 42179,
    "price": 36999,
    "rating": 4.8,
    "reviewCount": 24,
    "image": "/images/products/redmi/redmi-note-17-pro.jpg",
    "gallery": [
      "/images/products/redmi/redmi-note-17-pro.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0012",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-n17p-1",
        "name": "8GB + 128GB",
        "price": 36999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 42179,
        "stockQuantity": 10
      },
      {
        "id": "var-n17p-2",
        "name": "8GB + 256GB",
        "price": 39999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 45599,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-note-17-5g",
    "name": "Redmi Note 17 5G",
    "tagline": "Evolution of the SuperNote series with advanced AI photography.",
    "description": "Evolution of the SuperNote series with advanced AI photography.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 31919,
    "price": 27999,
    "rating": 4.8,
    "reviewCount": 23,
    "image": "/images/products/redmi/redmi-note-17.webp",
    "gallery": [
      "/images/products/redmi/redmi-note-17.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0011",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-n17-1",
        "name": "6GB + 128GB",
        "price": 27999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 31919,
        "stockQuantity": 10
      },
      {
        "id": "var-n17-2",
        "name": "8GB + 128GB",
        "price": 30999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 35339,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-note-15-pro-plus-5g",
    "name": "Redmi Note 15 Pro+ 5G",
    "tagline": "Flagship 200MP OIS, 120W HyperCharge, curved AMOLED, and IP68 resistance.",
    "description": "Flagship 200MP OIS, 120W HyperCharge, curved AMOLED, and IP68 resistance.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 45599,
    "price": 39999,
    "rating": 4.8,
    "reviewCount": 22,
    "image": "/images/products/redmi/redmi_note15pro+.webp",
    "gallery": [
      "/images/products/redmi/redmi_note15pro+.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 30,
    "sku": "GC-SMA-RED-0010",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-n15pp-1",
        "name": "8GB + 256GB",
        "price": 39999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 45599,
        "stockQuantity": 10
      },
      {
        "id": "var-n15pp-2",
        "name": "12GB + 256GB",
        "price": 41999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 256GB"
        },
        "originalPrice": 47879,
        "stockQuantity": 10
      },
      {
        "id": "var-n15pp-3",
        "name": "12GB + 512GB",
        "price": 44999,
        "inStock": true,
        "attributes": {
          "storage": "12GB + 512GB"
        },
        "originalPrice": 51299,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-note-15-pro-5g",
    "name": "Redmi Note 15 Pro 5G",
    "tagline": "Pro-grade 200MP OIS camera, 1.5K AMOLED display, and 67W Turbo Charge.",
    "description": "Pro-grade 200MP OIS camera, 1.5K AMOLED display, and 67W Turbo Charge.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 36479,
    "price": 31999,
    "rating": 4.8,
    "reviewCount": 21,
    "image": "/images/products/redmi/redmi_note15pro.webp",
    "gallery": [
      "/images/products/redmi/redmi_note15pro.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0009",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-n15p-1",
        "name": "8GB + 128GB",
        "price": 31999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 36479,
        "stockQuantity": 10
      },
      {
        "id": "var-n15p-2",
        "name": "8GB + 256GB",
        "price": 34999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 39899,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-note-15-5g",
    "name": "Redmi Note 15 5G",
    "tagline": "SuperNote performance with 108MP ultra-clear camera and 33W Fast Charge.",
    "description": "SuperNote performance with 108MP ultra-clear camera and 33W Fast Charge.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 33059,
    "price": 28999,
    "rating": 4.8,
    "reviewCount": 20,
    "image": "/images/products/redmi/redmi_note15.webp",
    "gallery": [
      "/images/products/redmi/redmi_note15.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0008",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-note15-1",
        "name": "8GB + 128GB",
        "price": 28999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 33059,
        "stockQuantity": 10
      },
      {
        "id": "var-note15-2",
        "name": "8GB + 256GB",
        "price": 31999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 36479,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-17-5g",
    "name": "Redmi 17 5G",
    "tagline": "Snapdragon 5G speed with rapid Turbo charging and crystal OLED visuals.",
    "description": "Snapdragon 5G speed with rapid Turbo charging and crystal OLED visuals.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 27359,
    "price": 23999,
    "rating": 4.8,
    "reviewCount": 19,
    "image": "/images/products/redmi/redmi17_5g.webp",
    "gallery": [
      "/images/products/redmi/redmi17_5g.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0007",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-17-1",
        "name": "6GB + 128GB",
        "price": 23999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 27359,
        "stockQuantity": 10
      },
      {
        "id": "var-17-2",
        "name": "8GB + 128GB",
        "price": 26999,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 30779,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-15-5g",
    "name": "Redmi 15 5G",
    "tagline": "Fluid 120Hz AdaptiveSync display, 50MP AI camera, and sleek glass-back finish.",
    "description": "Fluid 120Hz AdaptiveSync display, 50MP AI camera, and sleek glass-back finish.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 24509,
    "price": 21499,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/redmi/redmi15_5g.webp",
    "gallery": [
      "/images/products/redmi/redmi15_5g.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 30,
    "sku": "GC-SMA-RED-0006",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-15-1",
        "name": "6GB + 128GB",
        "price": 21499,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 24509,
        "stockQuantity": 10
      },
      {
        "id": "var-15-2",
        "name": "8GB + 128GB",
        "price": 23499,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 26789,
        "stockQuantity": 10
      },
      {
        "id": "var-15-3",
        "name": "8GB + 256GB",
        "price": 25499,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 256GB"
        },
        "originalPrice": 29069,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-17c-5g",
    "name": "Redmi 17C 5G",
    "tagline": "Next-generation C-series 5G powerhouse with enhanced optics.",
    "description": "Next-generation C-series 5G powerhouse with enhanced optics.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 23939,
    "price": 20999,
    "rating": 4.8,
    "reviewCount": 17,
    "image": "/images/products/redmi/Redmi-17C.avif",
    "gallery": [
      "/images/products/redmi/Redmi-17C.avif"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 20,
    "sku": "GC-SMA-RED-0005",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-17c-1",
        "name": "4GB + 128GB",
        "price": 20999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 23939,
        "stockQuantity": 10
      },
      {
        "id": "var-17c-2",
        "name": "6GB + 128GB",
        "price": 22999,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 26219,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-15c-5g",
    "name": "Redmi 15C 5G",
    "tagline": "High-speed 5G streaming, AI dual camera, and immersive 90Hz display.",
    "description": "High-speed 5G streaming, AI dual camera, and immersive 90Hz display.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 21089,
    "price": 18499,
    "rating": 4.8,
    "reviewCount": 16,
    "image": "/images/products/redmi/redmi15c 5g.webp",
    "gallery": [
      "/images/products/redmi/redmi15c 5g.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 30,
    "sku": "GC-SMA-RED-0004",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-15c-1",
        "name": "4GB + 128GB",
        "price": 18499,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 21089,
        "stockQuantity": 10
      },
      {
        "id": "var-15c-2",
        "name": "6GB + 128GB",
        "price": 20499,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 23369,
        "stockQuantity": 10
      },
      {
        "id": "var-15c-3",
        "name": "8GB + 128GB",
        "price": 22499,
        "inStock": true,
        "attributes": {
          "storage": "8GB + 128GB"
        },
        "originalPrice": 25649,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-15a-5g",
    "name": "Redmi 15A 5G",
    "tagline": "Next-gen 5G connectivity for every lifestyle with 5000mAh battery.",
    "description": "Next-gen 5G connectivity for every lifestyle with 5000mAh battery.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 18809,
    "price": 16499,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/redmi/redmi15a.webp",
    "gallery": [
      "/images/products/redmi/redmi15a.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 30,
    "sku": "GC-SMA-RED-0003",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-15a-1",
        "name": "4GB + 64GB",
        "price": 16499,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 64GB"
        },
        "originalPrice": 18809,
        "stockQuantity": 10
      },
      {
        "id": "var-15a-2",
        "name": "4GB + 128GB",
        "price": 18499,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 128GB"
        },
        "originalPrice": 21089,
        "stockQuantity": 10
      },
      {
        "id": "var-15a-3",
        "name": "6GB + 128GB",
        "price": 20499,
        "inStock": true,
        "attributes": {
          "storage": "6GB + 128GB"
        },
        "originalPrice": 23369,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-a7-pro",
    "name": "Redmi A7 Pro",
    "tagline": "Upgraded processing power with expanded memory and sleek design.",
    "description": "Upgraded processing power with expanded memory and sleek design.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 15959,
    "price": 13999,
    "rating": 4.8,
    "reviewCount": 14,
    "image": "/images/products/redmi/redmiA7pro.webp",
    "gallery": [
      "/images/products/redmi/redmiA7pro.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-SMA-RED-0002",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-a7pro-1",
        "name": "4GB + 64GB",
        "price": 13999,
        "inStock": true,
        "attributes": {
          "storage": "4GB + 64GB"
        },
        "originalPrice": 15959,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "redmi-redmi-a7",
    "name": "Redmi A7",
    "tagline": "Sleek entry-level smartphone with smooth display and all-day battery.",
    "description": "Sleek entry-level smartphone with smooth display and all-day battery.",
    "brand": "Redmi",
    "category": "smartphones",
        "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 14819,
    "price": 12999,
    "rating": 4.8,
    "reviewCount": 13,
    "image": "/images/products/redmi/redmiA7.webp",
    "gallery": [
      "/images/products/redmi/redmiA7.webp"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 10,
    "sku": "GC-SMA-RED-0001",
    "specs": [
      {
        "label": "Brand",
        "value": "Redmi"
      },
      {
        "label": "Authorized Network",
        "value": "5G / Dual VoLTE"
      },
      {
        "label": "Warranty",
        "value": "1 Year Official Brand Warranty"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand New Box Pack"
      }
    ],
    "highlights": [],
    "variants": [
      {
        "id": "var-a7-1",
        "name": "3GB + 64GB",
        "price": 12999,
        "inStock": true,
        "attributes": {
          "storage": "3GB + 64GB"
        },
        "originalPrice": 14819,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-a-32-2025",
    "sku": "GC-TV-XIA-64054",
    "name": "Xiaomi Smart TV A 32 (2025)",
    "tagline": "A smart TV experience for streaming and daily viewing.",
    "description": "Official Xiaomi Smart TV A 32 (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Value Pick",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 16529,
    "price": 14499,
    "rating": 4.9,
    "reviewCount": 18,
    "image": "/images/products/xiaomi-tv/Xiaomi A 32 2025.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/Xiaomi A 32 2025.jpg"
    ],
    "emiStartsAt": 604,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "32 Inches (81 cm)"
      },
      {
        "label": "Display Technology",
        "value": "HD Ready Bezel-less Display (1366 x 768)"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz Vivid Picture Engine"
      },
      {
        "label": "Audio Output",
        "value": "20W Stereo Speakers with Dolby Audio & DTS-HD"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall, Google Assistant, Play Store"
      },
      {
        "label": "Connectivity Ports",
        "value": "2x HDMI (1 eARC), 2x USB 2.0, Ethernet, AV In, 3.5mm Jack"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core Cortex-A55, Mali G31 MP2 GPU, 1.5GB RAM, 8GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: HD Ready Bezel-less Display (1366 x 768)",
      "Audio: 20W Stereo Speakers with Dolby Audio & DTS-HD",
      "Smart Platform: Google TV with PatchWall, Google Assistant, Play Store"
    ],
    "variants": [
      {
        "id": "var-tv-64054",
        "sku": "GC-TV-XIA-64054",
        "name": "32\" Display",
        "price": 14499,
        "inStock": true,
        "attributes": {
          "series": "X Series A (2025)",
          "screenSize": "32 Inch"
        },
        "originalPrice": 16529,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-qled-tv-a-pro-32-2025",
    "sku": "GC-TV-XIA-64046",
    "name": "Xiaomi QLED TV A Pro 32 (2025)",
    "tagline": "Vivid QLED picture quality for everyday entertainment.",
    "description": "Official Xiaomi QLED TV A Pro 32 (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "QLED 2025",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 17669,
    "price": 15499,
    "rating": 4.8,
    "reviewCount": 27,
    "image": "/images/products/xiaomi-tv/QLED TV A Pro 32 2025.png",
    "gallery": [
      "/images/products/xiaomi-tv/QLED TV A Pro 32 2025.png"
    ],
    "emiStartsAt": 646,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "32 Inches (81 cm)"
      },
      {
        "label": "Display Technology",
        "value": "QLED HD Ready (1366 x 768)"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz Vivid Picture Engine"
      },
      {
        "label": "Audio Output",
        "value": "20W Stereo Speakers with Dolby Audio, DTS:X & DTS Virtual:X"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall & Kids Mode"
      },
      {
        "label": "Connectivity Ports",
        "value": "2x HDMI (1 eARC), 2x USB 2.0, Ethernet, AV In, 3.5mm Jack"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core Cortex-A55, Mali G31 MP2 GPU, 1.5GB RAM, 8GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: QLED HD Ready (1366 x 768)",
      "Audio: 20W Stereo Speakers with Dolby Audio, DTS:X & DTS Virtual:X",
      "Smart Platform: Google TV with PatchWall & Kids Mode"
    ],
    "variants": [
      {
        "id": "var-tv-64046",
        "sku": "GC-TV-XIA-64046",
        "name": "32\" Display",
        "price": 15499,
        "inStock": true,
        "attributes": {
          "series": "QLED (2025)",
          "screenSize": "32 Inch"
        },
        "originalPrice": 17669,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-a-43-fhd-2025",
    "sku": "GC-TV-XIA-64056",
    "name": "Xiaomi Smart TV A 43 FHD (2025)",
    "tagline": "A smart TV experience for streaming and daily viewing.",
    "description": "Official Xiaomi Smart TV A 43 FHD (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Full HD 43\"",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 25079,
    "price": 21999,
    "rating": 5,
    "reviewCount": 24,
    "image": "/images/products/xiaomi-tv/A 43 FHD 2025.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/A 43 FHD 2025.jpg"
    ],
    "emiStartsAt": 917,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "43 Inches (109 cm)"
      },
      {
        "label": "Display Technology",
        "value": "Full HD Premium Display (1920 x 1080)"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz Vivid Picture Engine"
      },
      {
        "label": "Audio Output",
        "value": "24W High-Fidelity Speakers with Dolby Audio & DTS-HD"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall & Google Assistant"
      },
      {
        "label": "Connectivity Ports",
        "value": "2x HDMI (1 eARC), 2x USB 2.0, Ethernet, Optical, AV In"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core Cortex-A55, Mali G31 MP2 GPU, 1.5GB RAM, 8GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: Full HD Premium Display (1920 x 1080)",
      "Audio: 24W High-Fidelity Speakers with Dolby Audio & DTS-HD",
      "Smart Platform: Google TV with PatchWall & Google Assistant"
    ],
    "variants": [
      {
        "id": "var-tv-64056",
        "sku": "GC-TV-XIA-64056",
        "name": "43\" Display",
        "price": 21999,
        "inStock": true,
        "attributes": {
          "series": "X Series A (2025)",
          "screenSize": "43 Inch"
        },
        "originalPrice": 25079,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-tv-x-43-2025",
    "sku": "GC-TV-XIA-64058",
    "name": "Xiaomi Smart TV X 43 4K (2025)",
    "tagline": "Smart TV entertainment with a large-screen experience.",
    "description": "Official Xiaomi Smart TV X 43 4K (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "4K Dolby Vision",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 31349,
    "price": 27499,
    "rating": 4.8,
    "reviewCount": 30,
    "image": "/images/products/xiaomi-tv/Xiaomi TV X 43 2025.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/Xiaomi TV X 43 2025.jpg"
    ],
    "emiStartsAt": 1146,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "43 Inches (109 cm)"
      },
      {
        "label": "Display Technology",
        "value": "4K Ultra HD (3840 x 2160) with Dolby Vision & HDR10"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz MEMC Reality Flow Engine"
      },
      {
        "label": "Audio Output",
        "value": "30W Cinema Speakers with Dolby Audio & DTS-X"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall, Hands-free Voice Search, Kids Mode"
      },
      {
        "label": "Connectivity Ports",
        "value": "3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core A55 Processor, Mali G52 MP2 GPU, 2GB RAM, 8GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 4K Ultra HD (3840 x 2160) with Dolby Vision & HDR10",
      "Audio: 30W Cinema Speakers with Dolby Audio & DTS-X",
      "Smart Platform: Google TV with PatchWall, Hands-free Voice Search, Kids Mode"
    ],
    "variants": [
      {
        "id": "var-tv-64058",
        "sku": "GC-TV-XIA-64058",
        "name": "43\" Display",
        "price": 27499,
        "inStock": true,
        "attributes": {
          "series": "X Series GTV (2025)",
          "screenSize": "43 Inch"
        },
        "originalPrice": 31349,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-qled-tv-x-pro-43-2025",
    "sku": "GC-TV-XIA-64048",
    "name": "Xiaomi QLED TV X Pro 43 (2025)",
    "tagline": "QLED colour and clarity for immersive home entertainment.",
    "description": "Official Xiaomi QLED TV X Pro 43 (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "QLED 4K Pro",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 36479,
    "price": 31999,
    "rating": 5,
    "reviewCount": 33,
    "image": "/images/products/xiaomi-tv/QLED TV X Pro 43 2025.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/QLED TV X Pro 43 2025.jpg"
    ],
    "emiStartsAt": 1333,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "43 Inches (109 cm)"
      },
      {
        "label": "Display Technology",
        "value": "4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3 Color Gamut"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz MEMC with Dolby Vision IQ & HDR10+"
      },
      {
        "label": "Audio Output",
        "value": "30W Cinema Audio with Dolby Atmos & DTS:X"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall+, Far-field Voice Mics, Google Assistant"
      },
      {
        "label": "Connectivity Ports",
        "value": "3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3 Color Gamut",
      "Audio: 30W Cinema Audio with Dolby Atmos & DTS:X",
      "Smart Platform: Google TV with PatchWall+, Far-field Voice Mics, Google Assistant"
    ],
    "variants": [
      {
        "id": "var-tv-64048",
        "sku": "GC-TV-XIA-64048",
        "name": "43\" Display",
        "price": 31999,
        "inStock": true,
        "attributes": {
          "series": "QLED",
          "screenSize": "43 Inch"
        },
        "originalPrice": 36479,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-tv-x-55-2025",
    "sku": "GC-TV-XIA-64062",
    "name": "Xiaomi Smart TV X 55 4K (2025)",
    "tagline": "Smart TV entertainment with a large-screen experience.",
    "description": "Official Xiaomi Smart TV X 55 4K (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Best Seller 55\"",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 43319,
    "price": 37999,
    "rating": 4.9,
    "reviewCount": 42,
    "image": "/images/products/xiaomi-tv/Xiaomi TV X 55 2025.webp",
    "gallery": [
      "/images/products/xiaomi-tv/Xiaomi TV X 55 2025.webp"
    ],
    "emiStartsAt": 1583,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "55 Inches (140 cm)"
      },
      {
        "label": "Display Technology",
        "value": "4K Ultra HD (3840 x 2160) with Dolby Vision, HDR10 & HLG"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz MEMC Reality Flow Engine"
      },
      {
        "label": "Audio Output",
        "value": "30W Cinema Speakers with Dolby Audio & DTS-X"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall, Hands-free Voice Search, Kids Mode"
      },
      {
        "label": "Connectivity Ports",
        "value": "3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core A55 Processor, Mali G52 MP2 GPU, 2GB RAM, 8GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 4K Ultra HD (3840 x 2160) with Dolby Vision, HDR10 & HLG",
      "Audio: 30W Cinema Speakers with Dolby Audio & DTS-X",
      "Smart Platform: Google TV with PatchWall, Hands-free Voice Search, Kids Mode"
    ],
    "variants": [
      {
        "id": "var-tv-64062",
        "sku": "GC-TV-XIA-64062",
        "name": "55\" Display",
        "price": 37999,
        "inStock": true,
        "attributes": {
          "series": "X Series GTV (2025)",
          "screenSize": "55 Inch"
        },
        "originalPrice": 43319,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-qled-tv-x-pro-55-2025",
    "sku": "GC-TV-XIA-64050",
    "name": "Xiaomi QLED TV X Pro 55 (2025)",
    "tagline": "QLED colour and clarity for immersive home entertainment.",
    "description": "Official Xiaomi QLED TV X Pro 55 (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Flagship QLED",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 50159,
    "price": 43999,
    "rating": 4.8,
    "reviewCount": 39,
    "image": "/images/products/xiaomi-tv/QLED TV X Pro 55 2025.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/QLED TV X Pro 55 2025.jpg"
    ],
    "emiStartsAt": 1833,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "55 Inches (140 cm)"
      },
      {
        "label": "Display Technology",
        "value": "4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3, 1.07 Billion Colors"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz MEMC with Dolby Vision IQ & HDR10+"
      },
      {
        "label": "Audio Output",
        "value": "30W Cinema Audio with Dolby Atmos & DTS:X"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall+, Far-field Voice Mics, Google Assistant"
      },
      {
        "label": "Connectivity Ports",
        "value": "3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3, 1.07 Billion Colors",
      "Audio: 30W Cinema Audio with Dolby Atmos & DTS:X",
      "Smart Platform: Google TV with PatchWall+, Far-field Voice Mics, Google Assistant"
    ],
    "variants": [
      {
        "id": "var-tv-64050",
        "sku": "GC-TV-XIA-64050",
        "name": "55\" Display",
        "price": 43999,
        "inStock": true,
        "attributes": {
          "series": "QLED",
          "screenSize": "55 Inch"
        },
        "originalPrice": 50159,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-qd-mini-led-tv-s-55-2026",
    "sku": "GC-TV-XIA-75226",
    "name": "Xiaomi QD-Mini LED TV S 55 (2026)",
    "tagline": "Premium Mini LED viewing with enhanced contrast and cinematic detail.",
    "description": "Official Xiaomi QD-Mini LED TV S 55 (2026) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Mini LED 144Hz",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 62699,
    "price": 54999,
    "rating": 4.8,
    "reviewCount": 39,
    "image": "/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 55 2026.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 55 2026.jpg"
    ],
    "emiStartsAt": 2292,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "55 Inches (140 cm)"
      },
      {
        "label": "Display Technology",
        "value": "55\" QD-Mini LED 4K (3840 x 2160), 308 Local Dimming Zones, 1200 Nits Peak"
      },
      {
        "label": "Refresh Rate",
        "value": "144Hz Gaming Refresh Rate with VRR, ALLM & AMD FreeSync Premium"
      },
      {
        "label": "Audio Output",
        "value": "40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics"
      },
      {
        "label": "Connectivity Ports",
        "value": "4x HDMI (2x HDMI 2.1 4K@144Hz, ALLM, eARC), 2x USB 3.0, Optical, LAN"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Wi-Fi 6 (802.11ax), Bluetooth 5.2, Chromecast built-in, AirPlay 2"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core Cortex-A73, Mali G57 MC1 GPU, 3GB RAM, 32GB High-Speed Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 55\" QD-Mini LED 4K (3840 x 2160), 308 Local Dimming Zones, 1200 Nits Peak",
      "Audio: 40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced",
      "Smart Platform: Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics"
    ],
    "variants": [
      {
        "id": "var-tv-75226",
        "sku": "GC-TV-XIA-75226",
        "name": "55\" Display",
        "price": 54999,
        "inStock": true,
        "attributes": {
          "series": "Mini LED",
          "screenSize": "55 Inch"
        },
        "originalPrice": 62699,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-qled-tv-x-pro-65-2025",
    "sku": "GC-TV-XIA-64052",
    "name": "Xiaomi QLED TV X Pro 65 (2025)",
    "tagline": "QLED colour and clarity for immersive home entertainment.",
    "description": "Official Xiaomi QLED TV X Pro 65 (2025) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Cinema 65\"",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 64979,
    "price": 56999,
    "rating": 4.9,
    "reviewCount": 45,
    "image": "/images/products/xiaomi-tv/QLED TV X Pro 65 2025.webp",
    "gallery": [
      "/images/products/xiaomi-tv/QLED TV X Pro 65 2025.webp"
    ],
    "emiStartsAt": 2375,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "65 Inches (165 cm)"
      },
      {
        "label": "Display Technology",
        "value": "65\" Massive 4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz MEMC with Dolby Vision IQ & HDR10+"
      },
      {
        "label": "Audio Output",
        "value": "30W Cinema Audio with Dolby Atmos & DTS:X"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall+, Far-field Voice Mics, Google Assistant"
      },
      {
        "label": "Connectivity Ports",
        "value": "3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 65\" Massive 4K Quantum Dot QLED (3840 x 2160), 94% DCI-P3",
      "Audio: 30W Cinema Audio with Dolby Atmos & DTS:X",
      "Smart Platform: Google TV with PatchWall+, Far-field Voice Mics, Google Assistant"
    ],
    "variants": [
      {
        "id": "var-tv-64052",
        "sku": "GC-TV-XIA-64052",
        "name": "65\" Display",
        "price": 56999,
        "inStock": true,
        "attributes": {
          "series": "QLED",
          "screenSize": "65 Inch"
        },
        "originalPrice": 64979,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-qled-tv-x-pro-75-2026",
    "sku": "GC-TV-XIA-75692",
    "name": "Xiaomi QLED TV X Pro 75 (2026)",
    "tagline": "QLED colour and clarity for immersive home entertainment.",
    "description": "Official Xiaomi QLED TV X Pro 75 (2026) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "75\" Giant Screen",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 79799,
    "price": 69999,
    "rating": 5,
    "reviewCount": 18,
    "image": "/images/products/xiaomi-tv/QLED TV X Pro 75 2026.webp",
    "gallery": [
      "/images/products/xiaomi-tv/QLED TV X Pro 75 2026.webp"
    ],
    "emiStartsAt": 2917,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "75 Inches (191 cm)"
      },
      {
        "label": "Display Technology",
        "value": "75\" Colossal 4K Quantum Dot QLED (3840 x 2160), 1.07 Billion Colors"
      },
      {
        "label": "Refresh Rate",
        "value": "60Hz Reality Flow MEMC with Dolby Vision IQ & HDR10+"
      },
      {
        "label": "Audio Output",
        "value": "34W Premium Acoustic Speakers with Dolby Atmos & DTS Virtual:X"
      },
      {
        "label": "Operating System",
        "value": "Google TV 2026 Edition with PatchWall+, Far-Field Voice Assistant"
      },
      {
        "label": "Connectivity Ports",
        "value": "3x HDMI 2.1 (ALLM, eARC), 2x USB 2.0, Optical, Ethernet, AV In"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Dual-Band Wi-Fi (2.4/5GHz), Bluetooth 5.0, Chromecast built-in"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core A55 Processor, Mali G52 GPU, 2GB RAM, 32GB Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 75\" Colossal 4K Quantum Dot QLED (3840 x 2160), 1.07 Billion Colors",
      "Audio: 34W Premium Acoustic Speakers with Dolby Atmos & DTS Virtual:X",
      "Smart Platform: Google TV 2026 Edition with PatchWall+, Far-Field Voice Assistant"
    ],
    "variants": [
      {
        "id": "var-tv-75692",
        "sku": "GC-TV-XIA-75692",
        "name": "75\" Display",
        "price": 69999,
        "inStock": true,
        "attributes": {
          "series": "QLED",
          "screenSize": "75 Inch"
        },
        "originalPrice": 79799,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-qd-mini-led-tv-s-65-2026",
    "sku": "GC-TV-XIA-75229",
    "name": "Xiaomi QD-Mini LED TV S 65 (2026)",
    "tagline": "Premium Mini LED viewing with enhanced contrast and cinematic detail.",
    "description": "Official Xiaomi QD-Mini LED TV S 65 (2026) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Mini LED Flagship",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 85499,
    "price": 74999,
    "rating": 4.9,
    "reviewCount": 15,
    "image": "/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 65 2026.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 65 2026.jpg"
    ],
    "emiStartsAt": 3125,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "65 Inches (165 cm)"
      },
      {
        "label": "Display Technology",
        "value": "65\" QD-Mini LED 4K (3840 x 2160), 392 Local Dimming Zones, 1200 Nits Peak"
      },
      {
        "label": "Refresh Rate",
        "value": "144Hz Gaming Refresh Rate with VRR, ALLM & AMD FreeSync Premium"
      },
      {
        "label": "Audio Output",
        "value": "40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics"
      },
      {
        "label": "Connectivity Ports",
        "value": "4x HDMI (2x HDMI 2.1 4K@144Hz, ALLM, eARC), 2x USB 3.0, Optical, LAN"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Wi-Fi 6 (802.11ax), Bluetooth 5.2, Chromecast built-in, AirPlay 2"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core Cortex-A73, Mali G57 MC1 GPU, 3GB RAM, 32GB High-Speed Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 65\" QD-Mini LED 4K (3840 x 2160), 392 Local Dimming Zones, 1200 Nits Peak",
      "Audio: 40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced",
      "Smart Platform: Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics"
    ],
    "variants": [
      {
        "id": "var-tv-75229",
        "sku": "GC-TV-XIA-75229",
        "name": "65\" Display",
        "price": 74999,
        "inStock": true,
        "attributes": {
          "series": "Mini LED",
          "screenSize": "65 Inch"
        },
        "originalPrice": 85499,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-qd-mini-led-tv-s-75-2026",
    "sku": "GC-TV-XIA-75232",
    "name": "Xiaomi QD-Mini LED TV S 75 (2026)",
    "tagline": "Premium Mini LED viewing with enhanced contrast and cinematic detail.",
    "description": "Official Xiaomi QD-Mini LED TV S 75 (2026) authorized retail showroom stock at Gayathri Communication. Features authentic manufacturer warranty, doorstep installation support, brand sealed box packaging, and genuine GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "smart-tvs",
    "badge": "Masterpiece 75\"",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 113999,
    "price": 99999,
    "rating": 5,
    "reviewCount": 24,
    "image": "/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 75 2026.jpg",
    "gallery": [
      "/images/products/xiaomi-tv/Xiaomi QD-Mini LED TV S 75 2026.jpg"
    ],
    "emiStartsAt": 4167,
    "warranty": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Screen Size",
        "value": "75 Inches (191 cm)"
      },
      {
        "label": "Display Technology",
        "value": "75\" QD-Mini LED 4K (3840 x 2160), 512 Local Dimming Zones, 1200 Nits Peak"
      },
      {
        "label": "Refresh Rate",
        "value": "144Hz Gaming Refresh Rate with VRR, ALLM & AMD FreeSync Premium"
      },
      {
        "label": "Audio Output",
        "value": "40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced"
      },
      {
        "label": "Operating System",
        "value": "Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics"
      },
      {
        "label": "Connectivity Ports",
        "value": "4x HDMI (2x HDMI 2.1 4K@144Hz, ALLM, eARC), 2x USB 3.0, Optical, LAN"
      },
      {
        "label": "Wireless Connectivity",
        "value": "Wi-Fi 6 (802.11ax), Bluetooth 5.2, Chromecast built-in, AirPlay 2"
      },
      {
        "label": "Processor & Memory",
        "value": "Quad-Core Cortex-A73, Mali G57 MC1 GPU, 3GB RAM, 32GB High-Speed Storage"
      },
      {
        "label": "Warranty",
        "value": "1 Year Comprehensive + 1 Year Additional on Panel (Official Xiaomi Warranty)"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box Pack with GST Invoice"
      }
    ],
    "highlights": [
      "Display: 75\" QD-Mini LED 4K (3840 x 2160), 512 Local Dimming Zones, 1200 Nits Peak",
      "Audio: 40W 4-Driver Speaker System with Dolby Atmos, DTS:X & IMAX Enhanced",
      "Smart Platform: Google TV with PatchWall+, Dedicated Game Bar, Far-Field Mics"
    ],
    "variants": [
      {
        "id": "var-tv-75232",
        "sku": "GC-TV-XIA-75232",
        "name": "75\" Display",
        "price": 99999,
        "inStock": true,
        "attributes": {
          "series": "Mini LED",
          "screenSize": "75 Inch"
        },
        "originalPrice": 113999,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-xiaomi-mi-usb-type-c-cable",
    "sku": "GC-ACC-XIA-0021",
    "name": "Mi USB Type-C Cable",
    "tagline": "Durable 1m fast charging Type-C cable supporting up to 3A current and high-speed data.",
    "description": "Official Mi USB Type-C Cable authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Genuine Cable",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 286,
    "price": 249,
    "rating": 4.8,
    "reviewCount": 27,
    "image": "/images/products/xiaomi-accessories/mi_usb_type_c_cable.png",
    "gallery": [
      "/images/products/xiaomi-accessories/mi_usb_type_c_cable.png"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Length",
        "value": "100 cm (1 Meter)"
      },
      {
        "label": "Current Output",
        "value": "Up to 3A Fast Charging"
      },
      {
        "label": "Data Transfer",
        "value": "480Mbps High-Speed USB 2.0 Sync"
      },
      {
        "label": "Durability",
        "value": "Tested for 10,000+ Bends and Plugs"
      }
    ],
    "highlights": [
      "Length: 100 cm (1 Meter)",
      "Current Output: Up to 3A Fast Charging",
      "Data Transfer: 480Mbps High-Speed USB 2.0 Sync"
    ],
    "variants": [
      {
        "id": "var-acc-21",
        "sku": "GC-ACC-XIA-0021",
        "name": "Standard Retail",
        "price": 249,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Cables"
        },
        "originalPrice": 286,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-soniccharge-2-0-cable",
    "sku": "GC-ACC-XIA-0024",
    "name": "Xiaomi SonicCharge 2.0 Cable",
    "tagline": "High-strength SonicCharge 2.0 cable with 33W fast sync and reinforced strain relief.",
    "description": "Official Xiaomi SonicCharge 2.0 Cable authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "SonicCharge Sync",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 401,
    "price": 349,
    "rating": 4.8,
    "reviewCount": 12,
    "image": "/images/products/xiaomi-accessories/xiaomi_soniccharge_2_0_cable.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_soniccharge_2_0_cable.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Supported Speed",
        "value": "Up to 33W SonicCharge Fast Charging"
      },
      {
        "label": "Core Material",
        "value": "Thickened Copper Core for Low Resistance"
      },
      {
        "label": "Length",
        "value": "100 cm Standard Desktop/Bedside Length"
      }
    ],
    "highlights": [
      "Supported Speed: Up to 33W SonicCharge Fast Charging",
      "Core Material: Thickened Copper Core for Low Resistance",
      "Length: 100 cm Standard Desktop/Bedside Length"
    ],
    "variants": [
      {
        "id": "var-acc-24",
        "sku": "GC-ACC-XIA-0024",
        "name": "Standard Retail",
        "price": 349,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Cables"
        },
        "originalPrice": 401,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-hypercharge-type-c-to-type-c-braided",
    "sku": "GC-ACC-XIA-0022",
    "name": "Xiaomi HyperCharge Type-C to Type-C Braided Cable",
    "tagline": "Heavy-duty braided Type-C to Type-C cable with 100W PD charging & tangle-free design.",
    "description": "Official Xiaomi HyperCharge Type-C to Type-C Braided Cable authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Braided Type-C",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 516,
    "price": 449,
    "rating": 4.8,
    "reviewCount": 30,
    "image": "/images/products/xiaomi-accessories/xiaomi_hypercharge_type_c_to_type_c_braided_cable.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_hypercharge_type_c_to_type_c_braided_cable.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Power Delivery",
        "value": "Supports up to 100W PD (20V/5A)"
      },
      {
        "label": "Connector",
        "value": "Type-C to Type-C Reversible Connectors"
      },
      {
        "label": "Material",
        "value": "Military-Grade Kevlar Fiber Braided Exterior"
      },
      {
        "label": "Length",
        "value": "1 Meter High-Flexibility Wire"
      }
    ],
    "highlights": [
      "Power Delivery: Supports up to 100W PD (20V/5A)",
      "Connector: Type-C to Type-C Reversible Connectors",
      "Material: Military-Grade Kevlar Fiber Braided Exterior"
    ],
    "variants": [
      {
        "id": "var-acc-22",
        "sku": "GC-ACC-XIA-0022",
        "name": "Standard Retail",
        "price": 449,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Cables"
        },
        "originalPrice": 516,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-mi-earphones-basic",
    "sku": "GC-ACC-XIA-0025",
    "name": "Mi Earphones Basic",
    "tagline": "Ergonomic 3.5mm wired earphones with deep bass chamber, aluminum housing & in-line mic.",
    "description": "Official Mi Earphones Basic authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Classic 3.5mm",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 574,
    "price": 499,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/xiaomi-accessories/mi_earphones_basic.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/mi_earphones_basic.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Driver",
        "value": "10mm Dynamic Drivers with Aerospace Metal Chamber"
      },
      {
        "label": "Jack",
        "value": "3.5mm Gold-Plated Angled Audio Plug"
      },
      {
        "label": "Microphone",
        "value": "In-line HD Mic with Play/Pause Call Controls"
      },
      {
        "label": "Cable",
        "value": "Tangle-Free Corrosion-Resistant Cable"
      }
    ],
    "highlights": [
      "Driver: 10mm Dynamic Drivers with Aerospace Metal Chamber",
      "Jack: 3.5mm Gold-Plated Angled Audio Plug",
      "Microphone: In-line HD Mic with Play/Pause Call Controls"
    ],
    "variants": [
      {
        "id": "var-acc-25",
        "sku": "GC-ACC-XIA-0025",
        "name": "Standard Retail",
        "price": 499,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Audio"
        },
        "originalPrice": 574,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-6a-hypercharge-cable",
    "sku": "GC-ACC-XIA-0023",
    "name": "Xiaomi 6A HyperCharge Cable",
    "tagline": "Official 6A high-current cable designed specifically for 67W and 120W HyperCharging.",
    "description": "Official Xiaomi 6A HyperCharge Cable authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "6A High-Current",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 689,
    "price": 599,
    "rating": 4.8,
    "reviewCount": 33,
    "image": "/images/products/xiaomi-accessories/xiaomi_6a_hypercharge_cable.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_6a_hypercharge_cable.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Current Rating",
        "value": "6A High-Current Dedicated Wire"
      },
      {
        "label": "Speed",
        "value": "Compatible with 67W, 90W & 120W HyperCharge"
      },
      {
        "label": "Connectors",
        "value": "Reinforced USB-A to USB-C with Orange Core Pins"
      }
    ],
    "highlights": [
      "Current Rating: 6A High-Current Dedicated Wire",
      "Speed: Compatible with 67W, 90W & 120W HyperCharge",
      "Connectors: Reinforced USB-A to USB-C with Orange Core Pins"
    ],
    "variants": [
      {
        "id": "var-acc-23",
        "sku": "GC-ACC-XIA-0023",
        "name": "Standard Retail",
        "price": 599,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Cables"
        },
        "originalPrice": 689,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-type-c-earphones",
    "sku": "GC-ACC-XIA-0026",
    "name": "Xiaomi Type-C Earphones",
    "tagline": "Digital Type-C earphones with built-in DAC, Hi-Res audio certification and crisp vocal clarity.",
    "description": "Official Xiaomi Type-C Earphones authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Hi-Res Type-C",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 689,
    "price": 599,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/xiaomi-accessories/xiaomi_type_c_earphones.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_type_c_earphones.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Interface",
        "value": "Reversible USB Type-C Digital Plug (Built-in DAC)"
      },
      {
        "label": "Certification",
        "value": "Hi-Res Audio Certified Lossless Reproduction"
      },
      {
        "label": "Controls",
        "value": "3-Button In-Line Remote with Noise-Cancelling Mic"
      },
      {
        "label": "Design",
        "value": "Ergonomic Half-In-Ear Comfort Fit"
      }
    ],
    "highlights": [
      "Interface: Reversible USB Type-C Digital Plug (Built-in DAC)",
      "Certification: Hi-Res Audio Certified Lossless Reproduction",
      "Controls: 3-Button In-Line Remote with Noise-Cancelling Mic"
    ],
    "variants": [
      {
        "id": "var-acc-26",
        "sku": "GC-ACC-XIA-0026",
        "name": "Standard Retail",
        "price": 599,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Audio"
        },
        "originalPrice": 689,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-fast-charger-15w",
    "sku": "GC-ACC-XIA-0016",
    "name": "Xiaomi Fast Charger 15W",
    "tagline": "Reliable 15W rapid charging adapter with multi-layer surge & voltage protection.",
    "description": "Official Xiaomi Fast Charger 15W authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Safe Charging",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 689,
    "price": 599,
    "rating": 4.8,
    "reviewCount": 12,
    "image": "/images/products/xiaomi-accessories/xiaomi_fast_charger_15w.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_fast_charger_15w.png"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Output Power",
        "value": "15W Fast Charge (5V/3A, 9V/1.67A)"
      },
      {
        "label": "Port",
        "value": "USB-A Universal Port"
      },
      {
        "label": "Safety",
        "value": "Over-voltage, short-circuit, and thermal protection"
      }
    ],
    "highlights": [
      "Output Power: 15W Fast Charge (5V/3A, 9V/1.67A)",
      "Port: USB-A Universal Port",
      "Safety: Over-voltage, short-circuit, and thermal protection"
    ],
    "variants": [
      {
        "id": "var-acc-16",
        "sku": "GC-ACC-XIA-0016",
        "name": "Standard Retail",
        "price": 599,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Chargers"
        },
        "originalPrice": 689,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-mi-soniccharge-3-0-charger-33w",
    "sku": "GC-ACC-XIA-0017",
    "name": "Mi SonicCharge 3.0 Charger 33W",
    "tagline": "Official 33W SonicCharge fast charging adapter compatible with Redmi & Xiaomi devices.",
    "description": "Official Mi SonicCharge 3.0 Charger 33W authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "33W SonicCharge",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 1264,
    "price": 1099,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/xiaomi-accessories/mi_soniccharge_3_0_charger_33w.png",
    "gallery": [
      "/images/products/xiaomi-accessories/mi_soniccharge_3_0_charger_33w.png"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Output Power",
        "value": "33W SonicCharge (5V/3A, 9V/3A, 11V/3A, 20V/1.35A)"
      },
      {
        "label": "Compatibility",
        "value": "QC 3.0, PD 3.0, Quick Charge compatible"
      },
      {
        "label": "Safety",
        "value": "Surge Protection up to 380V"
      }
    ],
    "highlights": [
      "Output Power: 33W SonicCharge (5V/3A, 9V/3A, 11V/3A, 20V/1.35A)",
      "Compatibility: QC 3.0, PD 3.0, Quick Charge compatible",
      "Safety: Surge Protection up to 380V"
    ],
    "variants": [
      {
        "id": "var-acc-17",
        "sku": "GC-ACC-XIA-0017",
        "name": "Standard Retail",
        "price": 1099,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Chargers"
        },
        "originalPrice": 1264,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-45w-turbo-charger",
    "sku": "GC-ACC-XIA-0018",
    "name": "Xiaomi 45W Turbo Charger",
    "tagline": "45W high-efficiency turbo fast adapter for rapid flagship charging.",
    "description": "Official Xiaomi 45W Turbo Charger authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "45W Turbo",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 1609,
    "price": 1399,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/xiaomi-accessories/xiaomi_45w_turbo_charger.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_45w_turbo_charger.png"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Output",
        "value": "45W Turbo Fast Output"
      },
      {
        "label": "Protocols",
        "value": "Supports PD, QC, and Mi Turbo Charge"
      },
      {
        "label": "Efficiency",
        "value": "Level VI Energy Efficiency Rating"
      }
    ],
    "highlights": [
      "Output: 45W Turbo Fast Output",
      "Protocols: Supports PD, QC, and Mi Turbo Charge",
      "Efficiency: Level VI Energy Efficiency Rating"
    ],
    "variants": [
      {
        "id": "var-acc-18",
        "sku": "GC-ACC-XIA-0018",
        "name": "Standard Retail",
        "price": 1399,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Chargers"
        },
        "originalPrice": 1609,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-power-bank-4i-10000mah-22-5w-fast-ch",
    "sku": "GC-ACC-XIA-0006",
    "name": "Xiaomi Power Bank 4i 10000mAh 22.5W Fast Charge",
    "tagline": "Everyday pocket companion with 22.5W two-way fast charging and triple-device charging.",
    "description": "Official Xiaomi Power Bank 4i 10000mAh 22.5W Fast Charge authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Best Value",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 1724,
    "price": 1499,
    "rating": 4.8,
    "reviewCount": 30,
    "image": "/images/products/xiaomi-accessories/xiaomi_power_bank_4i_10000mah_22_5w_fast_charge.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_power_bank_4i_10000mah_22_5w_fast_charge.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "10,000mAh Lithium-Polymer"
      },
      {
        "label": "Output",
        "value": "22.5W Max Fast Charging (PD / QC)"
      },
      {
        "label": "Ports",
        "value": "2x USB-A + 1x Type-C Dual-Role Port"
      },
      {
        "label": "Design",
        "value": "Sleek Metallic Finish with Anti-Slip Grip"
      }
    ],
    "highlights": [
      "Capacity: 10,000mAh Lithium-Polymer",
      "Output: 22.5W Max Fast Charging (PD / QC)",
      "Ports: 2x USB-A + 1x Type-C Dual-Role Port"
    ],
    "variants": [
      {
        "id": "var-acc-6",
        "sku": "GC-ACC-XIA-0006",
        "name": "Standard Retail",
        "price": 1499,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 1724,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-redmi-buds-5c",
    "sku": "GC-ACC-XIA-0012",
    "name": "Redmi Buds 5C",
    "tagline": "Ultra-affordable ANC earbuds with 12.4mm dynamic bass drivers and 36hr playtime.",
    "description": "Official Redmi Buds 5C authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Best Seller Audio",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2069,
    "price": 1799,
    "rating": 4.8,
    "reviewCount": 24,
    "image": "/images/products/xiaomi-accessories/redmi_buds_5c.png",
    "gallery": [
      "/images/products/xiaomi-accessories/redmi_buds_5c.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "ANC",
        "value": "Up to 46dB Hybrid Active Noise Cancellation"
      },
      {
        "label": "Sound",
        "value": "12.4mm Dynamic Titanium Diaphragm Drivers"
      },
      {
        "label": "Battery",
        "value": "Up to 36 Hours with Charging Case"
      },
      {
        "label": "Mic",
        "value": "Dual AI Noise-Cancelling Microphones for Calls"
      }
    ],
    "highlights": [
      "ANC: Up to 46dB Hybrid Active Noise Cancellation",
      "Sound: 12.4mm Dynamic Titanium Diaphragm Drivers",
      "Battery: Up to 36 Hours with Charging Case"
    ],
    "variants": [
      {
        "id": "var-acc-12",
        "sku": "GC-ACC-XIA-0012",
        "name": "Standard Retail",
        "price": 1799,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Wearables"
        },
        "originalPrice": 2069,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-pocket-power-bank-10000mah-22-5w-bui",
    "sku": "GC-ACC-XIA-0008",
    "name": "Xiaomi Pocket Power Bank 10000mAh 22.5W Built-in Cable",
    "tagline": "Compact mini pocket size with integrated Type-C cable and 22.5W rapid charging.",
    "description": "Official Xiaomi Pocket Power Bank 10000mAh 22.5W Built-in Cable authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Built-in Cable",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2069,
    "price": 1799,
    "rating": 4.8,
    "reviewCount": 12,
    "image": "/images/products/xiaomi-accessories/xiaomi_pocket_power_bank_10000mah_22_5w_built_in_cable.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_pocket_power_bank_10000mah_22_5w_built_in_cable.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "10,000mAh Compact Battery"
      },
      {
        "label": "Fast Charge",
        "value": "22.5W Two-Way Fast Output"
      },
      {
        "label": "Integrated Cable",
        "value": "Flexible Type-C Cable Loop"
      },
      {
        "label": "Form Factor",
        "value": "Ultra-Compact Pocket Palm Design"
      }
    ],
    "highlights": [
      "Capacity: 10,000mAh Compact Battery",
      "Fast Charge: 22.5W Two-Way Fast Output",
      "Integrated Cable: Flexible Type-C Cable Loop"
    ],
    "variants": [
      {
        "id": "var-acc-8",
        "sku": "GC-ACC-XIA-0008",
        "name": "Standard Retail",
        "price": 1799,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 2069,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-pocket-power-bank-pro-10000mah-33w-s",
    "sku": "GC-ACC-XIA-0010",
    "name": "Xiaomi Pocket Power Bank Pro 10000mAh 33W Sonic Charge",
    "tagline": "Pro pocket performance: Anodized aluminum finish with 33W SonicCharge output.",
    "description": "Official Xiaomi Pocket Power Bank Pro 10000mAh 33W Sonic Charge authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Pocket Pro",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2184,
    "price": 1899,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/xiaomi-accessories/xiaomi_pocket_power_bank_pro_10000mah_33w_sonic_charge.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_pocket_power_bank_pro_10000mah_33w_sonic_charge.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "10,000mAh High-Density Core"
      },
      {
        "label": "Output",
        "value": "33W Turbo Power Delivery"
      },
      {
        "label": "Casing",
        "value": "Premium Anodized Matte Metallic Body"
      },
      {
        "label": "Dual Output",
        "value": "USB-C + USB-A Simultaneous Ports"
      }
    ],
    "highlights": [
      "Capacity: 10,000mAh High-Density Core",
      "Output: 33W Turbo Power Delivery",
      "Casing: Premium Anodized Matte Metallic Body"
    ],
    "variants": [
      {
        "id": "var-acc-10",
        "sku": "GC-ACC-XIA-0010",
        "name": "Standard Retail",
        "price": 1899,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 2184,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-67w-soniccharge-3-0-charger-combo",
    "sku": "GC-ACC-XIA-0019",
    "name": "Xiaomi 67W SonicCharge 3.0 Charger Combo",
    "tagline": "67W flagship adapter bundled with official 6A fast charging Type-C cable.",
    "description": "Official Xiaomi 67W SonicCharge 3.0 Charger Combo authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "67W Turbo Combo",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2299,
    "price": 1999,
    "rating": 4.8,
    "reviewCount": 21,
    "image": "/images/products/xiaomi-accessories/xiaomi_67w_soniccharge_3_0_charger_combo.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_67w_soniccharge_3_0_charger_combo.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Output Power",
        "value": "67W Max SonicCharge 3.0"
      },
      {
        "label": "Bundle",
        "value": "Includes 6A Heavy-Duty Type-C Fast Charging Cable"
      },
      {
        "label": "Compatibility",
        "value": "Charges Redmi Note Pro, Xiaomi Series & Laptops"
      },
      {
        "label": "Certification",
        "value": "BIS Certified with 10-Layer Protection"
      }
    ],
    "highlights": [
      "Output Power: 67W Max SonicCharge 3.0",
      "Bundle: Includes 6A Heavy-Duty Type-C Fast Charging Cable",
      "Compatibility: Charges Redmi Note Pro, Xiaomi Series & Laptops"
    ],
    "variants": [
      {
        "id": "var-acc-19",
        "sku": "GC-ACC-XIA-0019",
        "name": "Standard Retail",
        "price": 1999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Chargers"
        },
        "originalPrice": 2299,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-45w-mini-gan-pd-charger-usb-c",
    "sku": "GC-ACC-XIA-0015",
    "name": "Xiaomi 45W Mini-GaN PD Charger (USB-C)",
    "tagline": "Next-gen Gallium Nitride (GaN) fast charger: Ultra-miniature size with 45W PD output.",
    "description": "Official Xiaomi 45W Mini-GaN PD Charger (USB-C) authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Mini-GaN Tech",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2299,
    "price": 1999,
    "rating": 4.8,
    "reviewCount": 33,
    "image": "/images/products/xiaomi-accessories/xiaomi_45w_mini_gan_pd_charger__usb_c.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_45w_mini_gan_pd_charger__usb_c.png"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Technology",
        "value": "Gallium Nitride (GaN) Semiconductor"
      },
      {
        "label": "Max Output",
        "value": "45W Power Delivery (PD 3.0 / PPS / QC 4+)"
      },
      {
        "label": "Size",
        "value": "50% Smaller than Traditional Silicon Chargers"
      },
      {
        "label": "Compatibility",
        "value": "Smartphones, Tablets, MacBooks & Ultrabooks"
      }
    ],
    "highlights": [
      "Technology: Gallium Nitride (GaN) Semiconductor",
      "Max Output: 45W Power Delivery (PD 3.0 / PPS / QC 4+)",
      "Size: 50% Smaller than Traditional Silicon Chargers"
    ],
    "variants": [
      {
        "id": "var-acc-15",
        "sku": "GC-ACC-XIA-0015",
        "name": "Standard Retail",
        "price": 1999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Chargers"
        },
        "originalPrice": 2299,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-ultra-slim-power-bank",
    "sku": "GC-ACC-XIA-0009",
    "name": "Xiaomi Ultra Slim Power Bank",
    "tagline": "Featherlight ultra-slim profile with card-like thickness and high-speed USB-C output.",
    "description": "Official Xiaomi Ultra Slim Power Bank authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Ultra Slim",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2299,
    "price": 1999,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/xiaomi-accessories/xiaomi_ultra_slim_power_bank.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_ultra_slim_power_bank.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "5,000mAh Ultra-Dense Battery"
      },
      {
        "label": "Thickness",
        "value": "Under 10mm Razor-Thin Aluminum Profile"
      },
      {
        "label": "Fast Charge",
        "value": "20W Power Delivery Fast Output"
      },
      {
        "label": "Weight",
        "value": "Only 93 grams"
      }
    ],
    "highlights": [
      "Capacity: 5,000mAh Ultra-Dense Battery",
      "Thickness: Under 10mm Razor-Thin Aluminum Profile",
      "Fast Charge: 20W Power Delivery Fast Output"
    ],
    "variants": [
      {
        "id": "var-acc-9",
        "sku": "GC-ACC-XIA-0009",
        "name": "Standard Retail",
        "price": 1999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 2299,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-power-bank-4i-20000mah-33w-sonic-cha",
    "sku": "GC-ACC-XIA-0007",
    "name": "Xiaomi Power Bank 4i 20000mAh 33W Sonic Charge",
    "tagline": "33W SonicCharge speed with massive 20000mAh battery for all-week travel power.",
    "description": "Official Xiaomi Power Bank 4i 20000mAh 33W Sonic Charge authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "33W SonicCharge",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2816,
    "price": 2449,
    "rating": 4.8,
    "reviewCount": 33,
    "image": "/images/products/xiaomi-accessories/xiaomi_power_bank_4i_20000mah_33w_sonic_charge.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_power_bank_4i_20000mah_33w_sonic_charge.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "20,000mAh High-Capacity"
      },
      {
        "label": "Output",
        "value": "33W Max SonicCharge Output"
      },
      {
        "label": "Recharge Time",
        "value": "Fast Self-Charging via 30W Input"
      },
      {
        "label": "Simultaneous Output",
        "value": "Charges 3 Devices at Once"
      }
    ],
    "highlights": [
      "Capacity: 20,000mAh High-Capacity",
      "Output: 33W Max SonicCharge Output",
      "Recharge Time: Fast Self-Charging via 30W Input"
    ],
    "variants": [
      {
        "id": "var-acc-7",
        "sku": "GC-ACC-XIA-0007",
        "name": "Standard Retail",
        "price": 2449,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 2816,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-redmi-watch-move-black",
    "sku": "GC-ACC-XIA-0014",
    "name": "Redmi Watch Move Black",
    "tagline": "1.85\" Curved AMOLED Retina Display with functional rotating crown and HyperOS.",
    "description": "Official Redmi Watch Move Black authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Curved AMOLED",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 2874,
    "price": 2499,
    "rating": 4.8,
    "reviewCount": 30,
    "image": "/images/products/xiaomi-accessories/redmi_watch_move_black.png",
    "gallery": [
      "/images/products/xiaomi-accessories/redmi_watch_move_black.png"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Display",
        "value": "1.85\" (4.69cm) Curved AMOLED Retina Screen (600 Nits)"
      },
      {
        "label": "OS",
        "value": "Xiaomi HyperOS with Fluid Navigation"
      },
      {
        "label": "Calling",
        "value": "Loud Bluetooth Calling with Dedicated Speaker & Mic"
      },
      {
        "label": "Fitness",
        "value": "140+ Sports Modes with Heart Rate & SpO2 Tracking"
      },
      {
        "label": "Battery",
        "value": "Up to 14 Days Typical Usage"
      }
    ],
    "highlights": [
      "Display: 1.85\" (4.69cm) Curved AMOLED Retina Screen (600 Nits)",
      "OS: Xiaomi HyperOS with Fluid Navigation",
      "Calling: Loud Bluetooth Calling with Dedicated Speaker & Mic"
    ],
    "variants": [
      {
        "id": "var-acc-14",
        "sku": "GC-ACC-XIA-0014",
        "name": "Standard Retail",
        "price": 2499,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Wearables"
        },
        "originalPrice": 2874,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-120w-hypercharger-with-type-c-cable",
    "sku": "GC-ACC-XIA-0020",
    "name": "Xiaomi 120W HyperCharger with Type-C Cable",
    "tagline": "Ultra-fast 120W HyperCharge power brick with included 6A high-speed USB-C cable.",
    "description": "Official Xiaomi 120W HyperCharger with Type-C Cable authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "120W HyperCharge",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 3449,
    "price": 2999,
    "rating": 4.8,
    "reviewCount": 24,
    "image": "/images/products/xiaomi-accessories/xiaomi_120w_hypercharger_with_type_c_cable.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_120w_hypercharger_with_type_c_cable.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "6 Months Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Charging Speed",
        "value": "120W Ultra-Fast HyperCharge (0 to 100% in ~18 mins)"
      },
      {
        "label": "Included Cable",
        "value": "1-Meter 6A High-Current Type-C Cable"
      },
      {
        "label": "Smart Identification",
        "value": "Auto-detects laptops, tablets, and phones"
      },
      {
        "label": "Cooling",
        "value": "Dual-transformer structure for cooler operation"
      }
    ],
    "highlights": [
      "Charging Speed: 120W Ultra-Fast HyperCharge (0 to 100% in ~18 mins)",
      "Included Cable: 1-Meter 6A High-Current Type-C Cable",
      "Smart Identification: Auto-detects laptops, tablets, and phones"
    ],
    "variants": [
      {
        "id": "var-acc-20",
        "sku": "GC-ACC-XIA-0020",
        "name": "Standard Retail",
        "price": 2999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Chargers"
        },
        "originalPrice": 3449,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-redmi-buds-6",
    "sku": "GC-ACC-XIA-0011",
    "name": "Redmi Buds 6",
    "tagline": "Next-gen wireless earbuds with 49dB Hybrid Active Noise Cancellation & 42hr battery.",
    "description": "Official Redmi Buds 6 authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "49dB ANC",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 3449,
    "price": 2999,
    "rating": 4.8,
    "reviewCount": 21,
    "image": "/images/products/xiaomi-accessories/redmi_buds_6.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/redmi_buds_6.jpg"
    ],
    "emiStartsAt": 0,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Noise Cancellation",
        "value": "49dB Deep Hybrid Active Noise Cancellation"
      },
      {
        "label": "Drivers",
        "value": "12.4mm Dynamic Titanium Drivers"
      },
      {
        "label": "Battery Life",
        "value": "Up to 42 Hours Total Playback with Case"
      },
      {
        "label": "Connectivity",
        "value": "Bluetooth 5.4 with Google Fast Pair"
      },
      {
        "label": "Water Resistance",
        "value": "IP54 Dust & Splash Resistance"
      }
    ],
    "highlights": [
      "Noise Cancellation: 49dB Deep Hybrid Active Noise Cancellation",
      "Drivers: 12.4mm Dynamic Titanium Drivers",
      "Battery Life: Up to 42 Hours Total Playback with Case"
    ],
    "variants": [
      {
        "id": "var-acc-11",
        "sku": "GC-ACC-XIA-0011",
        "name": "Standard Retail",
        "price": 2999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Wearables"
        },
        "originalPrice": 3449,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-power-bank-5i-20000-67w",
    "sku": "GC-ACC-XIA-0001",
    "name": "Xiaomi Power Bank 5i 20000 67W",
    "tagline": "67W Turbo Fast Charging with integrated Type-C cable and smart digital display.",
    "description": "Official Xiaomi Power Bank 5i 20000 67W authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "67W Turbo Fast",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 4024,
    "price": 3499,
    "rating": 4.8,
    "reviewCount": 15,
    "image": "/images/products/xiaomi-accessories/xiaomi_power_bank_5i_20000_67w.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_power_bank_5i_20000_67w.png"
    ],
    "emiStartsAt": 146,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "20,000mAh (74.37Wh) Triple High-Density Cells"
      },
      {
        "label": "Output Power",
        "value": "67W Max Turbo Fast Charge (PD 3.0, QC 3.5)"
      },
      {
        "label": "Integrated Cable",
        "value": "Built-in Durable TPU Type-C Cable"
      },
      {
        "label": "Display",
        "value": "Smart Digital LED Battery Percentage Indicator"
      },
      {
        "label": "Protection",
        "value": "12-Layer Advanced Circuit & Temperature Protection"
      }
    ],
    "highlights": [
      "Capacity: 20,000mAh (74.37Wh) Triple High-Density Cells",
      "Output Power: 67W Max Turbo Fast Charge (PD 3.0, QC 3.5)",
      "Integrated Cable: Built-in Durable TPU Type-C Cable"
    ],
    "variants": [
      {
        "id": "var-acc-1",
        "sku": "GC-ACC-XIA-0001",
        "name": "Standard Retail",
        "price": 3499,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 4024,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-mi-power-bank-boost-pro-30000mah-18w",
    "sku": "GC-ACC-XIA-0005",
    "name": "Mi Power Bank Boost Pro 30000mAh (18W)",
    "tagline": "Colossal 30000mAh power reserve with 18W fast charging and triple output ports.",
    "description": "Official Mi Power Bank Boost Pro 30000mAh (18W) authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "30000mAh Mega",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 4024,
    "price": 3499,
    "rating": 4.8,
    "reviewCount": 27,
    "image": "/images/products/xiaomi-accessories/mi_power_bank_boost_pro_30000mah__18w.png",
    "gallery": [
      "/images/products/xiaomi-accessories/mi_power_bank_boost_pro_30000mah__18w.png"
    ],
    "emiStartsAt": 146,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "30,000mAh Colossal Battery Bank"
      },
      {
        "label": "Fast Charge",
        "value": "18W Two-Way Fast Charge"
      },
      {
        "label": "Ports",
        "value": "Triple Output (2x USB-A + 1x Type-C) & Dual Input"
      },
      {
        "label": "Low Current Mode",
        "value": "Safe charging for Bluetooth bands & audio accessories"
      }
    ],
    "highlights": [
      "Capacity: 30,000mAh Colossal Battery Bank",
      "Fast Charge: 18W Two-Way Fast Charge",
      "Ports: Triple Output (2x USB-A + 1x Type-C) & Dual Input"
    ],
    "variants": [
      {
        "id": "var-acc-5",
        "sku": "GC-ACC-XIA-0005",
        "name": "Standard Retail",
        "price": 3499,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 4024,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-redmi-watch-5-lite",
    "sku": "GC-ACC-XIA-0013",
    "name": "Redmi Watch 5 Lite",
    "tagline": "1.96\" AMOLED display smartwatch with built-in 5-System GPS and clear Bluetooth calling.",
    "description": "Official Redmi Watch 5 Lite authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "AMOLED GPS",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 4599,
    "price": 3999,
    "rating": 4.8,
    "reviewCount": 27,
    "image": "/images/products/xiaomi-accessories/redmi_watch_5_lite.png",
    "gallery": [
      "/images/products/xiaomi-accessories/redmi_watch_5_lite.png"
    ],
    "emiStartsAt": 167,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Display",
        "value": "1.96\" Crisp AMOLED Always-On Display (600 Nits)"
      },
      {
        "label": "GPS",
        "value": "Standalone Multi-System Built-in GNSS GPS"
      },
      {
        "label": "Calling",
        "value": "Dual-Mic Clear Bluetooth Calling"
      },
      {
        "label": "Battery Life",
        "value": "Up to 18 Days Ultra-Long Battery Life"
      },
      {
        "label": "Water Resistance",
        "value": "5ATM Water Resistant (50m)"
      }
    ],
    "highlights": [
      "Display: 1.96\" Crisp AMOLED Always-On Display (600 Nits)",
      "GPS: Standalone Multi-System Built-in GNSS GPS",
      "Calling: Dual-Mic Clear Bluetooth Calling"
    ],
    "variants": [
      {
        "id": "var-acc-13",
        "sku": "GC-ACC-XIA-0013",
        "name": "Standard Retail",
        "price": 3999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Wearables"
        },
        "originalPrice": 4599,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-magnetic-power-bank-10000-45w-integr",
    "sku": "GC-ACC-XIA-0004",
    "name": "Xiaomi Magnetic Power Bank 10000 45W (Integrated Cable)",
    "tagline": "Magnetic wireless attachment with 45W wired turbo output and integrated charging cable.",
    "description": "Official Xiaomi Magnetic Power Bank 10000 45W (Integrated Cable) authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Magnetic 45W",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 4599,
    "price": 3999,
    "rating": 4.8,
    "reviewCount": 24,
    "image": "/images/products/xiaomi-accessories/xiaomi_magnetic_power_bank_10000_45w__integrated_cable.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_magnetic_power_bank_10000_45w__integrated_cable.jpg"
    ],
    "emiStartsAt": 167,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "10,000mAh High-Density Battery"
      },
      {
        "label": "Charging Modes",
        "value": "Magnetic Wireless + 45W Type-C Turbo Wired"
      },
      {
        "label": "Cable",
        "value": "Built-in Durable Braided Type-C Lanyard Cable"
      },
      {
        "label": "Compatibility",
        "value": "Smartphones, Tablets, Earbuds & Smartwatches"
      }
    ],
    "highlights": [
      "Capacity: 10,000mAh High-Density Battery",
      "Charging Modes: Magnetic Wireless + 45W Type-C Turbo Wired",
      "Cable: Built-in Durable Braided Type-C Lanyard Cable"
    ],
    "variants": [
      {
        "id": "var-acc-4",
        "sku": "GC-ACC-XIA-0004",
        "name": "Standard Retail",
        "price": 3999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 4599,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-sound-outdoor-speaker",
    "sku": "GC-ACC-XIA-0027",
    "name": "Xiaomi Sound Outdoor Speaker",
    "tagline": "30W dynamic outdoor speaker with 360° surround audio, IP67 waterproof & 12hr battery.",
    "description": "Official Xiaomi Sound Outdoor Speaker authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "30W IP67 Waterproof",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 4599,
    "price": 3999,
    "rating": 4.8,
    "reviewCount": 21,
    "image": "/images/products/xiaomi-accessories/xiaomi_sound_outdoor_speaker.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_sound_outdoor_speaker.jpg"
    ],
    "emiStartsAt": 167,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Power Output",
        "value": "30W High-Power Dynamic Sound Output"
      },
      {
        "label": "Water & Dust Proof",
        "value": "IP67 Rugged All-Weather Waterproofing"
      },
      {
        "label": "Battery Life",
        "value": "Up to 12 Hours Continuous Music Playback"
      },
      {
        "label": "Stereo Pairing",
        "value": "TWS Multi-Speaker Wireless Stereo Connection"
      },
      {
        "label": "Bluetooth",
        "value": "Bluetooth 5.4 with Low Latency Audio"
      }
    ],
    "highlights": [
      "Power Output: 30W High-Power Dynamic Sound Output",
      "Water & Dust Proof: IP67 Rugged All-Weather Waterproofing",
      "Battery Life: Up to 12 Hours Continuous Music Playback"
    ],
    "variants": [
      {
        "id": "var-acc-27",
        "sku": "GC-ACC-XIA-0027",
        "name": "Standard Retail",
        "price": 3999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Speaker"
        },
        "originalPrice": 4599,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-power-bank-20000-165w",
    "sku": "GC-ACC-XIA-0002",
    "name": "Xiaomi Power Bank 20000 165W",
    "tagline": "Extreme 165W ultra-fast output capable of charging laptops, tablets & flagships simultaneously.",
    "description": "Official Xiaomi Power Bank 20000 165W authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "165W Flagship",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 6324,
    "price": 5499,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/xiaomi-accessories/xiaomi_power_bank_20000_165w.png",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_power_bank_20000_165w.png"
    ],
    "emiStartsAt": 229,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "20,000mAh Extreme Power Reserve"
      },
      {
        "label": "Max Output",
        "value": "165W Total Dual-Port Fast Output"
      },
      {
        "label": "Compatibility",
        "value": "Laptops, MacBooks, Tablets, Smartphones & Consoles"
      },
      {
        "label": "Input Charging",
        "value": "High-Speed 90W Rapid Self-Charging"
      },
      {
        "label": "Display",
        "value": "Full-Color Smart Digital Status Screen"
      }
    ],
    "highlights": [
      "Capacity: 20,000mAh Extreme Power Reserve",
      "Max Output: 165W Total Dual-Port Fast Output",
      "Compatibility: Laptops, MacBooks, Tablets, Smartphones & Consoles"
    ],
    "variants": [
      {
        "id": "var-acc-2",
        "sku": "GC-ACC-XIA-0002",
        "name": "Standard Retail",
        "price": 5499,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 6324,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-xiaomi-xiaomi-ultrathin-magnetic-power-bank-5000-1",
    "sku": "GC-ACC-XIA-0003",
    "name": "Xiaomi UltraThin Magnetic Power Bank 5000 15W",
    "tagline": "Ultra-slim magnetic wireless power bank with premium aerospace-grade metallic build.",
    "description": "Official Xiaomi UltraThin Magnetic Power Bank 5000 15W authorized showroom retail stock at Gayathri Communication. Brand-new sealed box pack with official manufacturer warranty and GST showroom invoice.",
    "brand": "Xiaomi",
    "category": "accessories",
    "badge": "Magnetic Wireless",
    "isBestSeller": false,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 6899,
    "price": 5999,
    "rating": 4.8,
    "reviewCount": 21,
    "image": "/images/products/xiaomi-accessories/xiaomi_ultrathin_magnetic_power_bank_5000_15w.jpg",
    "gallery": [
      "/images/products/xiaomi-accessories/xiaomi_ultrathin_magnetic_power_bank_5000_15w.jpg"
    ],
    "emiStartsAt": 250,
    "warranty": "1 Year Official Brand Warranty",
    "inStock": true,
    "stockQuantity": 15,
    "specs": [
      {
        "label": "Capacity",
        "value": "5,000mAh Ultra-Compact Profile"
      },
      {
        "label": "Wireless Charging",
        "value": "15W Qi2 / MagSafe-Compatible Snap-on Magnetic Charging"
      },
      {
        "label": "Thickness",
        "value": "Sleek Sub-10mm Pocketable Design"
      },
      {
        "label": "Body Finish",
        "value": "Anodized Aircraft Aluminum"
      },
      {
        "label": "Safety",
        "value": "FOD (Foreign Object Detection) & Thermal Shield"
      }
    ],
    "highlights": [
      "Capacity: 5,000mAh Ultra-Compact Profile",
      "Wireless Charging: 15W Qi2 / MagSafe-Compatible Snap-on Magnetic Charging",
      "Thickness: Sleek Sub-10mm Pocketable Design"
    ],
    "variants": [
      {
        "id": "var-acc-3",
        "sku": "GC-ACC-XIA-0003",
        "name": "Standard Retail",
        "price": 5999,
        "inStock": true,
        "attributes": {
          "brand": "Xiaomi",
          "category": "Power Bank"
        },
        "originalPrice": 6899,
        "stockQuantity": 15
      }
    ]
  },
  {
    "id": "gc-crompton-acgw-duro-one-grinder",
    "sku": "GC-APP-CRO-DURO",
    "name": "Crompton Duro One 2L Table Top Wet Grinder (ACGW-DURO ONE)",
    "tagline": "High torque 150W 2-litre table top wet grinder with cylindrical conical stones & SS drum.",
    "description": "Official Crompton Duro One 2 Litre Table Top Wet Grinder (Model: ACGW-DURO ONE). Engineered with a high-torque 150W copper motor, cylindrical conical grinding stones for ultra-fine batter consistency, durable SS304 stainless steel drum, transparent shatterproof lid, and ergonomic wiper assembly.",
    "brand": "Crompton",
    "category": "home-appliances",
    "badge": "150W High Torque",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 7260,
    "price": 4999,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/home-appliances/crompton_duro_one_table_top_wet_grinder.jpeg",
    "gallery": [
      "/images/products/home-appliances/crompton_duro_one_table_top_wet_grinder.jpeg"
    ],
    "emiStartsAt": 208,
    "warranty": "2 Years Comprehensive Warranty on Product & Motor",
    "inStock": true,
    "stockQuantity": 10,
    "specs": [
      {
        "label": "Model Number",
        "value": "ACGW-DURO ONE"
      },
      {
        "label": "Capacity",
        "value": "2.0 Litres Capacity"
      },
      {
        "label": "Motor Power",
        "value": "150W High Torque Motor (230V AC, 50Hz)"
      },
      {
        "label": "Grinding Stones",
        "value": "Cylindrical Conical Stones with Spring Tension Knob"
      },
      {
        "label": "Drum Material",
        "value": "Rust-Proof SS 304 Stainless Steel"
      },
      {
        "label": "Accessories",
        "value": "Grinding Stone with Wiper Assembly, Spatula & Lid"
      },
      {
        "label": "Body Type",
        "value": "Compact Shock-Proof ABS Table-Top Body"
      },
      {
        "label": "Warranty",
        "value": "2 Years Official Crompton Manufacturer Warranty"
      }
    ],
    "highlights": [
      "Motor: 150W High Torque Pure Copper Motor",
      "Capacity: 2 Litres SS304 Stainless Steel Drum",
      "Stones: Cylindrical Conical Grinding Stones"
    ],
    "variants": [
      {
        "id": "var-app-gc-app-cro-duro",
        "sku": "GC-APP-CRO-DURO",
        "name": "Standard Showroom Unit",
        "price": 4999,
        "inStock": true,
        "attributes": {
          "brand": "Crompton",
          "modelNumber": "ACGW-DURO ONE"
        },
        "originalPrice": 7260,
        "stockQuantity": 10
      }
    ]
  },
  {
    "id": "gc-bluestar-bwd3fmrga-water-dispenser",
    "sku": "GC-APP-BLU-BWD3",
    "name": "Blue Star Bottled Water Dispenser with Refrigerator (BWD3FMRGA)",
    "tagline": "Hot, cold & normal water dispenser with built-in 14L cooling refrigerator cabinet.",
    "description": "Official Blue Star Floor Standing Water Dispenser with Refrigerator (Model: BWD3FMRGA). Features 3 temperature push taps (Hot, Normal, Cold), built-in 14L bottom refrigerator cabinet for beverages and snacks, food-grade SS304 stainless steel tanks, 3.0L/hr cooling capacity, and child safety lock on hot tap.",
    "brand": "Blue Star",
    "category": "home-appliances",
    "badge": "With 14L Refrigerator",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 18500,
    "price": 10999,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/home-appliances/bluestar_water_dispenser_bwd3fmrga.png",
    "gallery": [
      "/images/products/home-appliances/bluestar_water_dispenser_bwd3fmrga.png"
    ],
    "emiStartsAt": 458,
    "warranty": "1 Year Official Brand Warranty on Product & Compressor",
    "inStock": true,
    "stockQuantity": 8,
    "specs": [
      {
        "label": "Model Number",
        "value": "BWD3FMRGA"
      },
      {
        "label": "Dispensing Modes",
        "value": "3 Taps: Hot, Normal (Ambient) & Cold Water"
      },
      {
        "label": "Integrated Refrigerator",
        "value": "14L Cooling Cabinet at Bottom for Drinks & Food"
      },
      {
        "label": "Cooling Capacity",
        "value": "3.0 Litres / Hour High-Efficiency Compressor Cooling"
      },
      {
        "label": "Heating Capacity",
        "value": "5.0 Litres / Hour with Fast Heating Element"
      },
      {
        "label": "Tank Material",
        "value": "Food-Grade Antibacterial SS304 Stainless Steel"
      },
      {
        "label": "Safety",
        "value": "Child Lock on Hot Water Faucet & Thermal Overload Cutout"
      },
      {
        "label": "Voltage & Weight",
        "value": "230V / 50Hz, Net Weight: 14.5 kg, Gross: 16.5 kg"
      }
    ],
    "highlights": [
      "3 Faucets: Hot, Cold & Normal Water",
      "Built-in Refrigerator: 14L Bottom Cooling Cabinet",
      "Tanks: Food-Grade Stainless Steel SS304"
    ],
    "variants": [
      {
        "id": "var-app-gc-app-blu-bwd3",
        "sku": "GC-APP-BLU-BWD3",
        "name": "Standard Showroom Unit",
        "price": 10999,
        "inStock": true,
        "attributes": {
          "brand": "Blue Star",
          "modelNumber": "BWD3FMRGA"
        },
        "originalPrice": 18500,
        "stockQuantity": 8
      }
    ]
  },
  {
    "id": "gc-samsung-rt40h28w1cbnl-fridge",
    "sku": "GC-APP-SAM-RT40H",
    "name": "Samsung 236L Frost Free Double Door Refrigerator (RT40H28W1CBNL)",
    "tagline": "236L Frost Free Double Door Refrigerator with Camellia Blue floral finish and Digital Inverter.",
    "description": "Official Samsung 236L Double Door Frost Free Refrigerator (Model: RT40H28W1CBNL) in stunning Camellia Blue finish. Features Digital Inverter Compressor with 20-year warranty, All-Round Cooling, MoistFresh Zone, Toughened Glass Shelves, and anti-bacterial gasket.",
    "brand": "Samsung",
    "category": "home-appliances",
    "badge": "Digital Inverter",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 37999,
    "price": 24999,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/home-appliances/samsung_236l_camellia_blue_refrigerator.webp",
    "gallery": [
      "/images/products/home-appliances/samsung_236l_camellia_blue_refrigerator.webp"
    ],
    "emiStartsAt": 1042,
    "warranty": "1 Year Comprehensive + 20 Years on Digital Inverter Compressor",
    "inStock": true,
    "stockQuantity": 8,
    "specs": [
      {
        "label": "Model Number",
        "value": "RT40H28W1CBNL"
      },
      {
        "label": "Capacity",
        "value": "236 Litres (Double Door)"
      },
      {
        "label": "Defrosting Type",
        "value": "Frost Free"
      },
      {
        "label": "Compressor",
        "value": "Digital Inverter (20-Year Warranty)"
      },
      {
        "label": "Color / Pattern",
        "value": "Camellia Blue Floral Finish"
      },
      {
        "label": "Cooling Technology",
        "value": "All-Around Cooling & Multi Flow Air Vents"
      },
      {
        "label": "Shelves",
        "value": "Toughened Glass (Spill-Proof)"
      },
      {
        "label": "Voltage & Input",
        "value": "230V / 50Hz Inverter Stabilizer Free Operation"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Brand-New Sealed Box with Official GST Invoice"
      }
    ],
    "highlights": [
      "Capacity: 236 Litres Frost Free Double Door",
      "Compressor: Digital Inverter with 20-Year Warranty",
      "Finish: Camellia Blue Floral Design"
    ],
    "variants": [
      {
        "id": "var-app-gc-app-sam-rt40h",
        "sku": "GC-APP-SAM-RT40H",
        "name": "Standard Showroom Unit",
        "price": 24999,
        "inStock": true,
        "attributes": {
          "brand": "Samsung",
          "modelNumber": "RT40H28W1CBNL"
        },
        "originalPrice": 37999,
        "stockQuantity": 8
      }
    ]
  },
  {
    "id": "gc-carrier-cai18ce3r35f0-inverter-ac",
    "sku": "GC-APP-CAR-CAI18",
    "name": "Carrier 1.5 Ton Inverter Split AC (CAI18CE3R35F0)",
    "tagline": "Carrier Ester Exi+ 1.5 Ton Inverter Split AC with Flexicool 6-in-1 convertible cooling & PM 2.5 filter.",
    "description": "Official Carrier 1.5 Ton Inverter Split AC (Model: CAI18CE3R35F0 / Ester Exi+ Series). Features Flexicool 6-in-1 variable tonnage technology, 100% copper condenser with Aqua Clear anti-corrosion coating, PM 2.5 air purification filter, Insta-Cool turbo mode, and silent operation.",
    "brand": "Carrier",
    "category": "home-appliances",
    "badge": "Flexicool 6-in-1",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 47990,
    "price": 37999,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/home-appliances/carrier_1_5ton_inverter_split_ac.png",
    "gallery": [
      "/images/products/home-appliances/carrier_1_5ton_inverter_split_ac.png"
    ],
    "emiStartsAt": 1583,
    "warranty": "1 Year Comprehensive + 5 Years on PCB + 10 Years on Compressor",
    "inStock": true,
    "stockQuantity": 6,
    "specs": [
      {
        "label": "Model Number",
        "value": "CAI18CE3R35F0"
      },
      {
        "label": "Capacity",
        "value": "1.5 Ton Inverter (Variable Speed)"
      },
      {
        "label": "Technology",
        "value": "Flexicool 6-in-1 Inverter (Adjustable Tonnage)"
      },
      {
        "label": "Coil & Protection",
        "value": "100% Copper with Aqua Clear Protective Shield"
      },
      {
        "label": "Air Purification",
        "value": "Dual Filtration with PM 2.5 Micron Filter"
      },
      {
        "label": "Cooling at Extreme Ambient",
        "value": "Cooling at up to 52°C Ambient Temperature"
      },
      {
        "label": "Gas",
        "value": "R32 Green Refrigerant"
      },
      {
        "label": "Showroom Guarantee",
        "value": "100% Genuine Box Pack with Official Carrier Warranty"
      }
    ],
    "highlights": [
      "Technology: Flexicool 6-in-1 Convertible Inverter",
      "Protection: 100% Copper with Aqua Clear Shield",
      "Air Quality: High-Density PM 2.5 Dual Filter"
    ],
    "variants": [
      {
        "id": "var-app-gc-app-car-cai18",
        "sku": "GC-APP-CAR-CAI18",
        "name": "Standard Showroom Unit",
        "price": 37999,
        "inStock": true,
        "attributes": {
          "brand": "Carrier",
          "modelNumber": "CAI18CE3R35F0"
        },
        "originalPrice": 47990,
        "stockQuantity": 6
      }
    ]
  },
  {
    "id": "gc-bluestar-fb218vxu-split-ac",
    "sku": "GC-APP-BLU-FB218VXU",
    "name": "Blue Star 1.5 Ton Split AC (FB218VXU)",
    "tagline": "High-efficiency 1.5 Ton Split AC with 5350W cooling, 100% copper condenser & Blue Fin protection.",
    "description": "Official Blue Star 1.5 Ton Split Air Conditioner (Model: FB218VXU). Delivers 5350W robust cooling, ISEER 3.81 rating (2026-27 label series), 100% copper condenser coil with anti-corrosive Blue Fins, Turbo Cool instant cooling mode, and Comfort Sleep setting.",
    "brand": "Blue Star",
    "category": "home-appliances",
    "badge": "1.5 Ton Turbo Cool",
    "isBestSeller": true,
    "isNewLaunch": true,
    "isDealOfTheDay": false,
    "originalPrice": 49990,
    "price": 39999,
    "rating": 4.8,
    "reviewCount": 18,
    "image": "/images/products/home-appliances/bluestar_1_5ton_split_ac_fb218vxu.jpeg",
    "gallery": [
      "/images/products/home-appliances/bluestar_1_5ton_split_ac_fb218vxu.jpeg"
    ],
    "emiStartsAt": 1667,
    "warranty": "1 Year Comprehensive + 5 Years on PCB + 10 Years on Inverter Compressor",
    "inStock": true,
    "stockQuantity": 6,
    "specs": [
      {
        "label": "Model Number",
        "value": "FB218VXU"
      },
      {
        "label": "Tonnage / Capacity",
        "value": "1.52 TR (1.5 Ton, 5350W Cooling)"
      },
      {
        "label": "Energy Rating",
        "value": "ISEER 3.81 (3 Star 2026-27 Series)"
      },
      {
        "label": "Condenser Coil",
        "value": "100% Copper with Anti-Corrosive Blue Fins"
      },
      {
        "label": "Cooling Modes",
        "value": "Turbo Cool, Comfort Sleep, Eco & Auto"
      },
      {
        "label": "Air Flow & Filters",
        "value": "High Air Circulation with Dust & Pollutant Filter"
      },
      {
        "label": "Refrigerant",
        "value": "Eco-Friendly R32 Low GWP Gas"
      },
      {
        "label": "Voltage",
        "value": "230V, 50Hz Single Phase"
      },
      {
        "label": "Showroom Guarantee",
        "value": "Brand-New Factory Pack with Indoor & Outdoor Units"
      }
    ],
    "highlights": [
      "Capacity: 1.5 Ton (5350W Cooling Power)",
      "Condenser: 100% Copper with Anti-Corrosive Blue Fins",
      "Modes: Turbo Cool Rapid Drop & Comfort Sleep"
    ],
    "variants": [
      {
        "id": "var-app-gc-app-blu-fb218vxu",
        "sku": "GC-APP-BLU-FB218VXU",
        "name": "Standard Showroom Unit",
        "price": 39999,
        "inStock": true,
        "attributes": {
          "brand": "Blue Star",
          "modelNumber": "FB218VXU"
        },
        "originalPrice": 49990,
        "stockQuantity": 6
      }
    ]
  }
]
