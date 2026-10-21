// ==============================================================================
// GAYATHRI COMMUNICATION E-COMMERCE
// SUPABASE EDGE FUNCTION: icecat-lookup
// ==============================================================================
// Proxies real-time product specification and studio image lookups to Open Icecat.
// - Enforces admin authentication via caller JWT and public.admin_users check.
// - Reads ICECAT_API_TOKEN and ICECAT_USERNAME securely from Supabase Secrets.
// - Parses live Icecat JSON responses into Gayathri Communication product format.
// - Strictly zero credential exposure to client-side bundles.
// - Handled gracefully on timeouts, rate limits, 404s, or unconfigured secrets.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestPayload {
  brand?: string
  model?: string
  ean?: string
}

export interface ParsedIcecatProduct {
  found: boolean
  source: 'live-open-icecat'
  attribution: string
  icecatUrl: string
  brand: string
  title: string
  category: string
  description: string
  tagline: string
  warranty: string
  specs: { label: string; value: string }[]
  highlights: string[]
  imageUrl: string
  gallery: string[]
}

/**
 * Maps Icecat raw category string into one of the 5 showroom categories
 */
export function mapIcecatCategory(categoryName: string): string {
  const norm = (categoryName || '').toLowerCase()
  if (norm.includes('smartphone') || norm.includes('mobile phone') || norm.includes('phone')) {
    return 'smartphones'
  }
  if (norm.includes('tv') || norm.includes('television')) {
    return 'smart-tvs'
  }
  if (
    norm.includes('washing') ||
    norm.includes('refrigerator') ||
    norm.includes('fridge') ||
    norm.includes('dryer') ||
    norm.includes('microwave') ||
    norm.includes('dishwasher') ||
    norm.includes('appliance')
  ) {
    return 'home-appliances'
  }
  if (
    norm.includes('headphone') ||
    norm.includes('earbud') ||
    norm.includes('earphone') ||
    norm.includes('watch') ||
    norm.includes('charger') ||
    norm.includes('power bank') ||
    norm.includes('cable') ||
    norm.includes('case')
  ) {
    return 'accessories'
  }
  return 'other-electronics'
}

/**
 * Parses raw Open Icecat JSON data into the standardized showroom format
 */
export function parseIcecatResponse(raw: any, fallbackBrand: string, fallbackModel: string): ParsedIcecatProduct | null {
  if (!raw) return null

  // Support both top-level and nested data container
  const data = raw.data || raw
  const general = data.GeneralInfo
  if (!general) return null

  const brand = (general.Brand || general.BrandInfo?.BrandName || fallbackBrand).trim()
  const title = (
    general.Title ||
    general.TitleInfo?.GeneratedIntTitle ||
    general.ProductName ||
    fallbackModel
  ).trim()

  const rawCatName = general.Category?.Name?.Value || general.Category?.Name || ''
  const mappedCategory = mapIcecatCategory(rawCatName)

  // Marketing text
  const shortDesc = general.SummaryDescription?.ShortSummaryDescription || ''
  const longDesc = general.SummaryDescription?.LongSummaryDescription || general.Description || ''
  const tagline = shortDesc || longDesc.substring(0, 160)
  const description = longDesc || shortDesc

  const warranty = general.WarrantyInfo?.trim() || '1 Year Official Brand Warranty'
  const icecatUrl = general.IcecatURL || `https://icecat.biz/en/p/${encodeURIComponent(brand)}/${encodeURIComponent(fallbackModel)}`

  // Extract images
  const primaryImage =
    data.Image?.HighPic ||
    data.Image?.Pic500x500 ||
    data.Image?.LowPic ||
    (Array.isArray(data.Gallery) && data.Gallery[0]?.HighPic) ||
    (Array.isArray(data.Gallery) && data.Gallery[0]?.Pic) ||
    ''

  const galleryList: string[] = []
  if (primaryImage) galleryList.push(primaryImage)
  if (Array.isArray(data.Gallery)) {
    for (const item of data.Gallery) {
      const pic = item.HighPic || item.Pic
      if (pic && !galleryList.includes(pic)) {
        galleryList.push(pic)
      }
    }
  }

  // Extract specifications from FeaturesGroups
  const specs: { label: string; value: string }[] = []
  const highlights: string[] = []

  if (Array.isArray(data.FeaturesGroups)) {
    for (const group of data.FeaturesGroups) {
      if (Array.isArray(group.Features)) {
        for (const feat of group.Features) {
          const label = feat.Feature?.Name?.Value || feat.Feature?.Name || feat.FeatureName
          const val = feat.PresentationValue || feat.Value
          if (label && val && typeof val === 'string' && val.trim()) {
            specs.push({
              label: label.trim(),
              value: val.trim(),
            })
            if (highlights.length < 3 && val.length < 90) {
              highlights.push(`${label.trim()}: ${val.trim()}`)
            }
          }
        }
      }
    }
  }

  return {
    found: true,
    source: 'live-open-icecat',
    attribution: 'Live Datasheet syndicated from Open Icecat under Open Content License (OPL)',
    icecatUrl,
    brand,
    title,
    category: mappedCategory,
    description,
    tagline,
    warranty,
    specs: specs.slice(0, 20),
    highlights,
    imageUrl: primaryImage,
    gallery: galleryList,
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Enforce Authentication & Admin Authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ found: false, error: 'Unauthorized: Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // Authenticate user session
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ found: false, error: 'Unauthorized: Invalid authentication session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is an authorized admin in public.admin_users
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: adminRecord } = await adminClient
      .from('admin_users')
      .select('id, role')
      .eq('id', user.id)
      .single()

    const isAdmin = Boolean(adminRecord && (adminRecord.role === 'admin' || adminRecord.role === 'super_admin'))
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ found: false, error: 'Forbidden: Caller is not a registered administrator' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Validate & Sanitize Input
    const body: RequestPayload = await req.json().catch(() => ({}))
    const brand = (body.brand || '').trim().substring(0, 50)
    const model = (body.model || '').trim().substring(0, 80)
    const ean = (body.ean || '').trim().substring(0, 20)

    if (!brand && !model && !ean) {
      return new Response(
        JSON.stringify({ found: false, reason: 'invalid_input', message: 'Brand and Model or EAN required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Retrieve Open Icecat Credentials from Edge Secrets
    const icecatToken = Deno.env.get('ICECAT_API_TOKEN')
    const icecatUsername = Deno.env.get('ICECAT_USERNAME')

    if (!icecatToken || !icecatUsername) {
      return new Response(
        JSON.stringify({
          found: false,
          reason: 'unconfigured',
          message: 'Open Icecat credentials (ICECAT_API_TOKEN, ICECAT_USERNAME) are not configured in Supabase Edge Secrets.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Construct Open Icecat Request
    let targetUrl: string
    if (ean) {
      targetUrl = `https://live.icecat.biz/api?UserName=${encodeURIComponent(icecatUsername)}&Language=en&GTIN=${encodeURIComponent(ean)}`
    } else {
      targetUrl = `https://live.icecat.biz/api?UserName=${encodeURIComponent(icecatUsername)}&Language=en&Brand=${encodeURIComponent(brand)}&ProductCode=${encodeURIComponent(model)}`
    }

    // 5. Execute HTTP Request with 8-second Timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    let icecatRes: Response
    try {
      icecatRes = await fetch(targetUrl, {
        headers: {
          api_token: icecatToken,
          Accept: 'application/json',
        },
        signal: controller.signal,
      })
    } catch (err: any) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        return new Response(
          JSON.stringify({ found: false, reason: 'timeout', message: 'Open Icecat request timed out (8s limit).' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ found: false, reason: 'network_error', message: err.message || 'Network error reaching Icecat' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } finally {
      clearTimeout(timeoutId)
    }

    // 6. Handle Rate Limits
    if (icecatRes.status === 429) {
      return new Response(
        JSON.stringify({
          found: false,
          reason: 'rate_limited',
          message: 'Open Icecat rate limit exceeded (~5 req/s). Please retry in a few moments or use manual entry.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 7. Handle Not Found or HTTP Errors
    if (!icecatRes.ok) {
      return new Response(
        JSON.stringify({
          found: false,
          reason: 'not_found',
          httpStatus: icecatRes.status,
          message: `Product not found in Open Icecat (HTTP ${icecatRes.status}).`,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 8. Parse JSON and Format
    const rawJson = await icecatRes.json().catch(() => null)
    if (!rawJson) {
      return new Response(
        JSON.stringify({ found: false, reason: 'invalid_json', message: 'Received malformed JSON from Icecat.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const parsed = parseIcecatResponse(rawJson, brand, model)
    if (!parsed) {
      return new Response(
        JSON.stringify({ found: false, reason: 'not_found', message: 'Product missing datasheet details in Open Icecat.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(
      JSON.stringify({ found: false, error: err.message || 'Internal Edge Function error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
