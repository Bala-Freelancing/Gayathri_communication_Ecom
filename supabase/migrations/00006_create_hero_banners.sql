-- ==============================================================================
-- GAYATHRI COMMUNICATION E-COMMERCE
-- MIGRATION 00006: HERO SHOWCASE BANNERS TABLE & POLICIES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.hero_banners (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    model_name TEXT NOT NULL,
    short_label TEXT NOT NULL,
    headline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    image TEXT NOT NULL,
    image_alt TEXT NOT NULL DEFAULT '',
    fallback_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    fallback_original_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    brand_tag TEXT NOT NULL DEFAULT 'Gayathri Showroom Spotlight',
    badge_text TEXT NOT NULL DEFAULT 'Official Brand Warranty',
    kicker TEXT NOT NULL DEFAULT 'Curated Showroom Spotlight',
    primary_cta_text TEXT NOT NULL DEFAULT 'Inquire on WhatsApp',
    secondary_cta_text TEXT NOT NULL DEFAULT 'Quick View',
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON public.hero_banners(order_index, is_active);

-- Enable Row Level Security
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active hero banners
CREATE POLICY "Allow public read for active hero banners"
ON public.hero_banners
FOR SELECT
USING (true);

-- Allow authenticated admins to insert, update, and delete hero banners
CREATE POLICY "Allow admin full access to hero banners"
ON public.hero_banners
FOR ALL
USING (auth.role() = 'authenticated' OR auth.jwt() ->> 'email' LIKE '%admin%')
WITH CHECK (auth.role() = 'authenticated' OR auth.jwt() ->> 'email' LIKE '%admin%');

-- Seed initial 4 flagship slides
INSERT INTO public.hero_banners (
    id, product_id, model_name, short_label, headline, description, specs,
    image, image_alt, fallback_price, fallback_original_price, brand_tag, badge_text,
    kicker, primary_cta_text, secondary_cta_text, is_active, order_index
) VALUES
(
    'slide-iphone',
    'iphone-16-pro',
    'Apple iPhone 16 Pro Max',
    'iPhone 16 Pro',
    'Titanium Precision. Pure Intelligence.',
    'Engineered in aerospace-grade Titanium with the A18 Pro chip, 48MP Fusion camera system, and Apple Intelligence. Factory-sealed in box with official 1-year Apple India warranty.',
    '["Grade 5 Titanium", "A18 Pro Bionic", "48MP Fusion Camera"]'::jsonb,
    '/images/products/iphone16.jpg',
    'Apple iPhone 16 Pro Max Desert Titanium',
    55000,
    59900,
    'Official Apple Retailer',
    'Verified Showroom Savings',
    'Featured Flagship of the Week',
    'Inquire on WhatsApp',
    'Quick View',
    true,
    0
),
(
    'slide-sony',
    'sony-bravia-oled',
    'Sony BRAVIA XR 65" 4K OLED',
    'Sony BRAVIA OLED',
    'Cinema Contrast. Acoustic Sound Glass.',
    'Self-illuminating OLED pixels paired with Cognitive Processor XR and Acoustic Surface Audio+. Includes complimentary doorstep installation in Trichy district and official 3-year Sony warranty.',
    '["Pure OLED Contrast", "Acoustic Surface Audio+", "4K 120Hz Gaming"]'::jsonb,
    '/images/products/sony-oled.jpg',
    'Sony BRAVIA XR 65 inch OLED 4K TV',
    149990,
    179900,
    'Sony BRAVIA XR Master Series',
    'Complimentary Installation',
    'Curated Showroom Spotlight',
    'Inquire on WhatsApp',
    'Quick View',
    true,
    1
),
(
    'slide-samsung',
    'samsung-s24-ultra',
    'Samsung Galaxy S24 Ultra 5G',
    'Galaxy S24 Ultra',
    'Galaxy AI Power in Titanium Armor.',
    'Live Call Translate, Circle to Search, 200MP Quad Tele camera, and integrated S-Pen. In-store unboxing and complimentary data transfer at our Manachanallur showroom.',
    '["Galaxy AI Inside", "200MP Quad Camera", "Built-in S-Pen"]'::jsonb,
    '/images/products/s24.jpg',
    'Samsung Galaxy S24 Ultra 5G Titanium Gray',
    119999,
    129999,
    'Samsung Galaxy AI Flagship',
    'Genuine Box-Pack',
    'Featured Flagship of the Week',
    'Inquire on WhatsApp',
    'Quick View',
    true,
    2
),
(
    'slide-appliances',
    'lg-washer-ai',
    'LG 9 Kg AI Direct Drive Washer',
    'LG AI Washer',
    'Intelligent Fabric Care with 10-Yr Warranty.',
    'AI DD™ fabric-weight detection, Steam™ allergy elimination, and TurboWash 360 with 5-Star BEE energy rating. Authorized brand delivery and doorstep installation included.',
    '["AI Direct Drive", "Steam Allergy Care", "5-Star BEE Rating"]'::jsonb,
    '/images/products/lg-washer.jpg',
    'LG 9 Kg AI Direct Drive Front Load Washer',
    18499,
    46990,
    'LG Smart Living Appliances',
    '10-Yr Motor Warranty',
    'Curated Showroom Spotlight',
    'Inquire on WhatsApp',
    'Quick View',
    true,
    3
)
ON CONFLICT (id) DO NOTHING;
