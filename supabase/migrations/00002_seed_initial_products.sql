-- ==============================================================================
-- GAYATHRI COMMUNICATION E-COMMERCE
-- MIGRATION 00002: IDEMPOTENT SEED DATA FOR CATEGORIES & CERTIFIED PRODUCTS
-- ==============================================================================

-- 1. SEED CATEGORIES (3 Official Showroom Categories)
INSERT INTO public.categories (id, name, slug, description, icon_name, display_order, is_active)
VALUES
    ('smartphones', 'Smartphones & Flagships', 'smartphones', 'Latest 5G smartphones, flagship titanium devices, and certified accessories with official manufacturer warranty.', 'Smartphone', 1, true),
    ('smart-tvs', 'Smart TVs & OLED Cinema', 'smart-tvs', 'Cinema 4K, QLED, and self-lit OLED displays from Sony, Samsung, and LG with doorstep installation.', 'Tv', 2, true),
    ('home-appliances', 'Home Appliances & Living', 'home-appliances', 'Inverter refrigerators, AI direct-drive washing machines, and energy-efficient appliances.', 'Refrigerator', 3, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    display_order = EXCLUDED.display_order;

-- 2. SEED INITIAL PRODUCTS (6 Existing Showroom Models)
-- Note: ON CONFLICT DO UPDATE updates metadata but PRESERVES administrator's modified prices!
INSERT INTO public.products (
    id,
    sku,
    slug,
    name,
    tagline,
    description,
    brand,
    category_id,
    badge,
    is_best_seller,
    is_new_launch,
    is_deal_of_the_day,
    original_price,
    selling_price,
    rating,
    review_count,
    image,
    gallery,
    emi_starts_at,
    warranty,
    stock_quantity,
    in_stock,
    specs,
    highlights,
    variants,
    is_active
)
VALUES
(
    'iphone-16-pro',
    'GC-APL-IP16PM-256',
    'apple-iphone-16-pro-max',
    'Apple iPhone 16 Pro Max',
    'Grade 5 Titanium, A18 Pro chip, 48MP Fusion camera system with 5x Telephoto.',
    'Grade 5 Titanium, A18 Pro chip, 48MP Fusion camera system with 5x Telephoto.',
    'Apple',
    'smartphones',
    'Flagship',
    true,
    true,
    false,
    144900.00,
    139900.00,
    4.9,
    342,
    '/images/products/iphone16.jpg',
    '["/images/products/iphone16.jpg", "/images/hero-phone.jpg", "/images/products/s24.jpg", "/images/products/oneplus12.jpg"]'::jsonb,
    5829.00,
    '1 Year Official Apple India Warranty',
    8,
    true,
    '[
        {"label": "Display", "value": "6.9\" Super Retina XDR OLED, 120Hz ProMotion"},
        {"label": "Processor", "value": "Apple A18 Pro Bionic (3nm)"},
        {"label": "Camera", "value": "48MP Fusion + 48MP Ultra-wide + 12MP 5x Telephoto"},
        {"label": "Battery", "value": "Up to 33 hours video playback"}
    ]'::jsonb,
    '["Grade 5 Titanium frame", "Action Button & Camera Control", "Apple Intelligence Ready"]'::jsonb,
    '[
        {"name": "Storage", "options": ["256 GB", "512 GB", "1 TB"]},
        {"name": "Color", "options": ["Desert Titanium", "Natural Titanium", "Black Titanium"]}
    ]'::jsonb,
    true
),
(
    'samsung-s24-ultra',
    'GC-SAM-S24U-256',
    'samsung-galaxy-s24-ultra-5g',
    'Samsung Galaxy S24 Ultra 5G',
    'Galaxy AI powered, built-in S Pen, 200MP Quad Tele camera, Titanium chassis.',
    'Galaxy AI powered, built-in S Pen, 200MP Quad Tele camera, Titanium chassis.',
    'Samsung',
    'smartphones',
    'Galaxy AI',
    true,
    false,
    true,
    134999.00,
    124999.00,
    4.8,
    289,
    '/images/products/s24.jpg',
    '["/images/products/s24.jpg", "/images/hero-phone.jpg", "/images/products/iphone16.jpg", "/images/products/oneplus12.jpg"]'::jsonb,
    5208.00,
    '1 Year Manufacturer Warranty with Free Screen Damage Cover',
    12,
    true,
    '[
        {"label": "Display", "value": "6.8\" Dynamic AMOLED 2X, 2600 nits, Anti-Reflective"},
        {"label": "Processor", "value": "Snapdragon 8 Gen 3 for Galaxy"},
        {"label": "Camera", "value": "200MP + 50MP + 12MP + 10MP with 100x Space Zoom"},
        {"label": "Battery", "value": "5000 mAh with 45W Fast Charging"}
    ]'::jsonb,
    '["Live Call Translate & Circle to Search", "Corning Gorilla Armor", "Integrated S-Pen stylus"]'::jsonb,
    '[
        {"name": "Storage", "options": ["256 GB", "512 GB", "1 TB"]},
        {"name": "Color", "options": ["Titanium Gray", "Titanium Black", "Titanium Violet"]}
    ]'::jsonb,
    true
),
(
    'sony-bravia-oled',
    'GC-SNY-XR65A80L',
    'sony-bravia-xr-65-4k-oled',
    'Sony BRAVIA XR 65" 4K OLED',
    'Cognitive Processor XR, Acoustic Surface Audio+, XR OLED Contrast Pro, Perfect for PS5.',
    'Cognitive Processor XR, Acoustic Surface Audio+, XR OLED Contrast Pro, Perfect for PS5.',
    'Sony',
    'smart-tvs',
    'Cinema OLED',
    true,
    false,
    false,
    249900.00,
    209990.00,
    4.9,
    162,
    '/images/products/sony-oled.jpg',
    '["/images/products/sony-oled.jpg", "/images/hero-tv.jpg"]'::jsonb,
    8749.00,
    '3 Years Comprehensive Sony India Warranty',
    5,
    true,
    '[
        {"label": "Screen Type", "value": "OLED Self-Illuminating Pixels, 120Hz"},
        {"label": "Audio Output", "value": "50W Acoustic Surface Audio+ with built-in subwoofers"},
        {"label": "Gaming Features", "value": "HDMI 2.1, 4K 120fps, VRR, ALLM"}
    ]'::jsonb,
    '["Pure blacks & infinite contrast", "Cognitive Processor XR", "IMAX Enhanced Certified"]'::jsonb,
    '[
        {"name": "Screen Size", "options": ["55 Inch", "65 Inch", "77 Inch"]}
    ]'::jsonb,
    true
),
(
    'oneplus-12',
    'GC-1PL-12-256',
    'oneplus-12-5g',
    'OnePlus 12 5G',
    '4th Gen Hasselblad Camera, Snapdragon 8 Gen 3, 5400 mAh Battery with 100W SUPERVOOC.',
    '4th Gen Hasselblad Camera, Snapdragon 8 Gen 3, 5400 mAh Battery with 100W SUPERVOOC.',
    'OnePlus',
    'smartphones',
    'Fast Charge',
    false,
    false,
    false,
    69999.00,
    64999.00,
    4.7,
    194,
    '/images/products/oneplus12.jpg',
    '["/images/products/oneplus12.jpg", "/images/hero-phone.jpg"]'::jsonb,
    2708.00,
    '1 Year Official OnePlus Warranty',
    10,
    true,
    '[
        {"label": "Display", "value": "6.82\" 2K 120Hz ProXDR with Aqua Touch"},
        {"label": "Charging", "value": "100W Wired + 50W AIRVOOC Wireless"},
        {"label": "Camera", "value": "50MP Sony LYT-808 + 64MP 3X Periscope"}
    ]'::jsonb,
    '["Ultra-bright 4500 nits display", "Dual Cryo-velocity VC cooling"]'::jsonb,
    '[
        {"name": "Storage", "options": ["256 GB", "512 GB"]},
        {"name": "Color", "options": ["Flowy Emerald", "Silky Black"]}
    ]'::jsonb,
    true
),
(
    'lg-washer-ai',
    'GC-LG-FHP1409ZWB',
    'lg-9-kg-ai-direct-drive-washer',
    'LG 9 Kg AI Direct Drive Washer',
    'AI DD™ Intelligent Fabric Care, Steam™ Allergy Care, TurboWash™ 360 in 39 mins.',
    'AI DD™ Intelligent Fabric Care, Steam™ Allergy Care, TurboWash™ 360 in 39 mins.',
    'LG',
    'home-appliances',
    'AI DD',
    true,
    false,
    false,
    58990.00,
    46990.00,
    4.8,
    156,
    '/images/products/lg-washer.jpg',
    '["/images/products/lg-washer.jpg", "/images/hero-appliance.jpg"]'::jsonb,
    1958.00,
    '2 Years Comprehensive + 10 Years on Motor',
    6,
    true,
    '[
        {"label": "Capacity", "value": "9.0 Kg (Ideal for 5+ members)"},
        {"label": "Motor", "value": "Inverter Direct Drive with 6 Motion DD"},
        {"label": "Spin Speed", "value": "1400 RPM for faster drying"}
    ]'::jsonb,
    '["Steam kills 99.9% allergens", "ThinQ Wi-Fi smart control", "TurboWash 360 energy saver"]'::jsonb,
    '[
        {"name": "Color", "options": ["Platinum Silver", "Middle Black"]}
    ]'::jsonb,
    true
),
(
    'samsung-bespoke-fridge',
    'GC-SAM-RF57A5032S9',
    'samsung-bespoke-french-door-refrigerator',
    'Samsung Bespoke French Door Refrigerator',
    'SpaceMax™ Technology, Smart Convertible 5-in-1, Twin Cooling Plus, Digital Inverter.',
    'SpaceMax™ Technology, Smart Convertible 5-in-1, Twin Cooling Plus, Digital Inverter.',
    'Samsung',
    'home-appliances',
    'Bespoke',
    false,
    false,
    false,
    119900.00,
    89990.00,
    4.7,
    112,
    '/images/products/samsung-fridge.jpg',
    '["/images/products/samsung-fridge.jpg", "/images/hero-appliance.jpg"]'::jsonb,
    3749.00,
    '1 Year Comprehensive + 20 Years on Inverter Compressor',
    4,
    true,
    '[
        {"label": "Capacity", "value": "653 Litres (French Door)"},
        {"label": "Cooling Tech", "value": "Twin Cooling Plus with separate airflow"},
        {"label": "Compressor", "value": "Digital Inverter with 50% energy savings"}
    ]'::jsonb,
    '["SpaceMax thin walls for maximum interior room", "Fingerprint resistant matte finish"]'::jsonb,
    '[
        {"name": "Finish", "options": ["Refined Stainless Inox", "Matte Black"]}
    ]'::jsonb,
    true
)
ON CONFLICT (id) DO UPDATE SET
    sku = EXCLUDED.sku,
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    brand = EXCLUDED.brand,
    category_id = EXCLUDED.category_id,
    badge = EXCLUDED.badge,
    is_best_seller = EXCLUDED.is_best_seller,
    is_new_launch = EXCLUDED.is_new_launch,
    is_deal_of_the_day = EXCLUDED.is_deal_of_the_day,
    -- NOTE: We explicitly DO NOT overwrite selling_price or original_price if already edited!
    -- This ensures re-running the seed script never wipes out administrator price modifications.
    image = EXCLUDED.image,
    gallery = EXCLUDED.gallery,
    warranty = EXCLUDED.warranty,
    specs = EXCLUDED.specs,
    highlights = EXCLUDED.highlights,
    variants = EXCLUDED.variants;

-- 3. SEED INITIAL PRODUCT VARIANTS (With Independent Variant Pricing)
INSERT INTO public.product_variants (
    product_id,
    sku,
    variant_attributes,
    original_price,
    selling_price,
    stock_quantity,
    is_active
)
VALUES
(
    'iphone-16-pro',
    'GC-APL-IP16PM-256',
    '{"Storage": "256 GB"}'::jsonb,
    144900.00,
    139900.00,
    8,
    true
),
(
    'iphone-16-pro',
    'GC-APL-IP16PM-512',
    '{"Storage": "512 GB"}'::jsonb,
    164900.00,
    159900.00,
    4,
    true
),
(
    'iphone-16-pro',
    'GC-APL-IP16PM-1TB',
    '{"Storage": "1 TB"}'::jsonb,
    184900.00,
    179900.00,
    2,
    true
),
(
    'samsung-s24-ultra',
    'GC-SAM-S24U-256',
    '{"Storage": "256 GB"}'::jsonb,
    134999.00,
    124999.00,
    12,
    true
),
(
    'samsung-s24-ultra',
    'GC-SAM-S24U-512',
    '{"Storage": "512 GB"}'::jsonb,
    144999.00,
    134999.00,
    6,
    true
),
(
    'sony-bravia-oled',
    'GC-SNY-XR55A80L',
    '{"Screen Size": "55 Inch"}'::jsonb,
    199900.00,
    169990.00,
    3,
    true
),
(
    'sony-bravia-oled',
    'GC-SNY-XR65A80L',
    '{"Screen Size": "65 Inch"}'::jsonb,
    249900.00,
    209990.00,
    5,
    true
)
ON CONFLICT (sku) DO UPDATE SET
    product_id = EXCLUDED.product_id,
    variant_attributes = EXCLUDED.variant_attributes,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = EXCLUDED.is_active;
    -- Note: original_price and selling_price are NOT overwritten on rerun!
