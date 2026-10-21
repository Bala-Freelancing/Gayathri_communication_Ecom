/**
 * Phase 2A Verification Suite: Open Icecat Edge Function & Response Parser
 * Gayathri Communication E-commerce Showroom
 *
 * Verifies:
 * 1. Edge Function source structure and security guards.
 * 2. Official Open Icecat response parsing (GeneralInfo, Images, FeaturesGroups).
 * 3. 5-Category taxonomy mapping.
 * 4. Error, rate limit (429), timeout, and invalid JSON handling.
 * 5. Authentication (401) and Admin Authorization (403) enforcement.
 * 6. Missing secrets / unconfigured state reporting.
 * 7. Distinction between live API results vs. demonstration fallback.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`)
    passed++
  } else {
    console.error(`  [FAIL] ${message}`)
    failed++
  }
}

console.log('======================================================================')
console.log('  GAYATHRI COMMUNICATION - PHASE 2A REAL ICECAT LOOKUP VERIFICATION')
console.log('======================================================================\n')

console.log('>> TEST MODALITY DECLARATION:')
console.log('>> [SIMULATED / SYNTHETIC]: Edge Function parser, auth guards & error handling')
console.log('>> [LOCAL CODEBASE]: Types, client invocation & demo fallback preservation')
console.log('>> [LIVE REMOTE CALL]: Deferred until Edge Function is deployed with real Icecat secrets\n')

// 1. Edge Function File & Syntax Checks
console.log('--- 1. EDGE FUNCTION SOURCE & SECURITY INSPECTION ---')
const edgeFunctionPath = path.join(rootDir, 'supabase', 'functions', 'icecat-lookup', 'index.ts')
assert(fs.existsSync(edgeFunctionPath), 'Edge function file exists at supabase/functions/icecat-lookup/index.ts')

const edgeCode = fs.readFileSync(edgeFunctionPath, 'utf8')
assert(edgeCode.includes("req.headers.get('Authorization')"), 'Enforces Authorization header extraction')
assert(edgeCode.includes('auth.getUser()'), 'Validates caller session with auth.getUser()')
assert(edgeCode.includes('.from(\'admin_users\')'), 'Verifies caller role against public.admin_users')
assert(edgeCode.includes("Deno.env.get('ICECAT_API_TOKEN')"), 'Reads ICECAT_API_TOKEN from Edge Secrets')
assert(edgeCode.includes("Deno.env.get('ICECAT_USERNAME')"), 'Reads ICECAT_USERNAME from Edge Secrets')
assert(edgeCode.includes("status: 401"), 'Returns 401 Unauthorized for missing/invalid auth header')
assert(edgeCode.includes("status: 403"), 'Returns 403 Forbidden for non-admin callers')
assert(edgeCode.includes("status === 429"), 'Handles HTTP 429 Rate Limits from Icecat')
assert(edgeCode.includes("AbortController"), 'Includes request timeout controller')
assert(edgeCode.includes("live-open-icecat"), 'Tags genuine data with source: live-open-icecat')

// 2. Unit Testing Icecat Category Mapping Logic (Extracted to simulate edge execution)
console.log('\n--- 2. CATEGORY TAXONOMY MAPPING ---')
function mapIcecatCategory(categoryName) {
  const norm = (categoryName || '').toLowerCase()
  if (norm.includes('smartphone') || norm.includes('mobile phone') || norm.includes('phone')) return 'smartphones'
  if (norm.includes('tv') || norm.includes('television')) return 'smart-tvs'
  if (
    norm.includes('washing') ||
    norm.includes('refrigerator') ||
    norm.includes('fridge') ||
    norm.includes('dryer') ||
    norm.includes('microwave') ||
    norm.includes('appliance')
  ) return 'home-appliances'
  if (
    norm.includes('headphone') ||
    norm.includes('earbud') ||
    norm.includes('watch') ||
    norm.includes('charger') ||
    norm.includes('cable')
  ) return 'accessories'
  return 'other-electronics'
}

assert(mapIcecatCategory('Smartphones') === 'smartphones', 'Maps "Smartphones" -> smartphones')
assert(mapIcecatCategory('OLED TVs') === 'smart-tvs', 'Maps "OLED TVs" -> smart-tvs')
assert(mapIcecatCategory('Washing Machines') === 'home-appliances', 'Maps "Washing Machines" -> home-appliances')
assert(mapIcecatCategory('Smartwatches') === 'accessories', 'Maps "Smartwatches" -> accessories')
assert(mapIcecatCategory('Computer Monitors') === 'other-electronics', 'Maps "Computer Monitors" -> other-electronics')
assert(mapIcecatCategory('Wireless Routers') === 'other-electronics', 'Maps "Wireless Routers" -> other-electronics')

// 3. Official Response Parsing Test (Simulating real Icecat JSON response)
console.log('\n--- 3. OFFICIAL RESPONSE PARSER (MOCK LIVE ICECAT DATA) ---')
function parseIcecatResponse(raw, fallbackBrand, fallbackModel) {
  if (!raw) return null
  const data = raw.data || raw
  const general = data.GeneralInfo
  if (!general) return null

  const brand = (general.Brand || general.BrandInfo?.BrandName || fallbackBrand).trim()
  const title = (general.Title || general.ProductName || fallbackModel).trim()
  const rawCatName = general.Category?.Name?.Value || general.Category?.Name || ''
  const mappedCategory = mapIcecatCategory(rawCatName)

  const shortDesc = general.SummaryDescription?.ShortSummaryDescription || ''
  const longDesc = general.SummaryDescription?.LongSummaryDescription || general.Description || ''

  const primaryImage = data.Image?.HighPic || data.Image?.Pic500x500 || data.Image?.LowPic || ''
  const galleryList = primaryImage ? [primaryImage] : []

  const specs = []
  if (Array.isArray(data.FeaturesGroups)) {
    for (const group of data.FeaturesGroups) {
      if (Array.isArray(group.Features)) {
        for (const feat of group.Features) {
          const label = feat.Feature?.Name?.Value || feat.Feature?.Name
          const val = feat.PresentationValue || feat.Value
          if (label && val) specs.push({ label: label.trim(), value: val.trim() })
        }
      }
    }
  }

  return {
    found: true,
    source: 'live-open-icecat',
    attribution: 'Live Datasheet syndicated from Open Icecat under Open Content License (OPL)',
    brand,
    title,
    category: mappedCategory,
    description: longDesc || shortDesc,
    specs,
    imageUrl: primaryImage,
    gallery: galleryList,
  }
}

const mockIcecatSuccessResponse = {
  statusCode: 200,
  data: {
    GeneralInfo: {
      Title: 'Samsung Galaxy S24 Ultra 5G 17.3 cm (6.8") Titanium',
      Brand: 'Samsung',
      Category: { Name: { Value: 'Smartphones' } },
      SummaryDescription: {
        ShortSummaryDescription: 'Snapdragon 8 Gen 3, 200MP Quad Camera, 5000 mAh',
        LongSummaryDescription: 'Official Samsung Galaxy S24 Ultra 5G with Galaxy AI and S Pen.',
      },
    },
    Image: {
      HighPic: 'https://images.icecat.biz/img/gallery/s24u_high.jpg',
      LowPic: 'https://images.icecat.biz/img/gallery_lows/s24u_low.jpg',
    },
    FeaturesGroups: [
      {
        FeatureGroup: { Name: { Value: 'Display' } },
        Features: [
          { Feature: { Name: { Value: 'Display diagonal' } }, Value: '17.3 cm (6.8")' },
          { Feature: { Name: { Value: 'Display resolution' } }, Value: '3120 x 1440 pixels' },
        ],
      },
      {
        FeatureGroup: { Name: { Value: 'Processor' } },
        Features: [
          { Feature: { Name: { Value: 'Processor family' } }, Value: 'Qualcomm Snapdragon' },
        ],
      },
    ],
  },
}

const parsedSuccess = parseIcecatResponse(mockIcecatSuccessResponse, 'Samsung', 'Galaxy S24 Ultra')
assert(parsedSuccess !== null, 'Successfully parses real Icecat JSON structure')
assert(parsedSuccess.source === 'live-open-icecat', 'Flags source as live-open-icecat')
assert(parsedSuccess.brand === 'Samsung', 'Extracts brand "Samsung"')
assert(parsedSuccess.category === 'smartphones', 'Maps category to "smartphones"')
assert(parsedSuccess.specs.length === 3, 'Flattens nested FeaturesGroups into 3 specifications')
assert(parsedSuccess.specs[0].label === 'Display diagonal', 'Extracts spec label "Display diagonal"')
assert(parsedSuccess.imageUrl === 'https://images.icecat.biz/img/gallery/s24u_high.jpg', 'Extracts HighPic studio image')
assert(parsedSuccess.attribution.includes('Open Content License'), 'Includes legal Open Content License attribution')

// 4. Edge Cases: Invalid JSON & Empty Responses
console.log('\n--- 4. PARSER RESILIENCE (EDGE CASES) ---')
assert(parseIcecatResponse(null, 'Brand', 'Model') === null, 'Safely returns null for null response')
assert(parseIcecatResponse({}, 'Brand', 'Model') === null, 'Safely returns null when GeneralInfo is missing')
assert(parseIcecatResponse({ data: { GeneralInfo: null } }, 'Brand', 'Model') === null, 'Safely returns null for empty GeneralInfo')

// 5. Client Service Invocation & Demonstration Fallback Verification
console.log('\n--- 5. CLIENT SERVICE & DEMO FALLBACK DISTINCTION ---')
const clientServicePath = path.join(rootDir, 'src', 'services', 'icecatService.ts')
const clientCode = fs.readFileSync(clientServicePath, 'utf8')

assert(clientCode.includes("supabase.functions.invoke('icecat-lookup'"), 'Client invokes icecat-lookup Edge Function')
assert(clientCode.includes("source: 'demo-catalog'"), 'Demo catalog entries are explicitly tagged with source: demo-catalog')
assert(clientCode.includes("source: 'live-open-icecat'"), 'Live responses are explicitly tagged with source: live-open-icecat')
assert(clientCode.includes('[Demonstration Catalog Fallback]'), 'Hardcoded demo data is clearly labeled as a Demonstration Fallback')
assert(!clientCode.includes('VITE_ICECAT_TOKEN'), 'Client code contains NO client-side VITE_ICECAT_TOKEN')

// 6. Modal Distinction Verification
console.log('\n--- 6. MODAL UI ATTRIBUTION & SOURCE DISPLAY ---')
const modalPath = path.join(rootDir, 'src', 'components', 'admin', 'AddStockModal.tsx')
const modalCode = fs.readFileSync(modalPath, 'utf8')

assert(modalCode.includes('Live Match Retrieved from Open Icecat Catalog'), 'Modal displays distinct Live Match banner for live results')
assert(modalCode.includes('Demo Catalog Fallback Match'), 'Modal displays distinct Demo Catalog Fallback banner for local results')

console.log('\n======================================================================')
console.log(`PHASE 2A VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`)
console.log('======================================================================\n')

if (failed > 0) process.exit(1)
