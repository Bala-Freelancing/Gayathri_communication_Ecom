-- ==============================================================================
-- GAYATHRI COMMUNICATION E-COMMERCE
-- MIGRATION 00001: STORE SCHEMA, PRICE AUDIT & ROW LEVEL SECURITY
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCTS TABLE
-- Uses exact NUMERIC(12, 2) for financial integrity (no floating-point rounding errors)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    brand TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    badge TEXT,
    is_best_seller BOOLEAN NOT NULL DEFAULT false,
    is_new_launch BOOLEAN NOT NULL DEFAULT false,
    is_deal_of_the_day BOOLEAN NOT NULL DEFAULT false,
    original_price NUMERIC(12, 2) NOT NULL CHECK (original_price >= 0),
    selling_price NUMERIC(12, 2) NOT NULL CHECK (selling_price >= 0 AND selling_price <= original_price),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.8 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    image TEXT NOT NULL,
    gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
    emi_starts_at NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (emi_starts_at >= 0),
    warranty TEXT NOT NULL DEFAULT '1 Year Official Brand Warranty',
    stock_quantity INTEGER NOT NULL DEFAULT 10 CHECK (stock_quantity >= 0),
    in_stock BOOLEAN NOT NULL DEFAULT true,
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    variants JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning-fast queries & filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(selling_price);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    variant_attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    original_price NUMERIC(12, 2) CHECK (original_price >= 0),
    selling_price NUMERIC(12, 2) CHECK (selling_price >= 0 AND (original_price IS NULL OR selling_price <= original_price)),
    stock_quantity INTEGER NOT NULL DEFAULT 5 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);

-- 5. PRICE HISTORY & AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    old_original_price NUMERIC(12, 2) NOT NULL CHECK (old_original_price >= 0),
    new_original_price NUMERIC(12, 2) NOT NULL CHECK (new_original_price >= 0),
    old_selling_price NUMERIC(12, 2) NOT NULL CHECK (old_selling_price >= 0),
    new_selling_price NUMERIC(12, 2) NOT NULL CHECK (new_selling_price >= 0),
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_by_email TEXT,
    change_reason TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_price_history_product ON public.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_changed_at ON public.price_history(changed_at DESC);

-- 6. ADMINISTRATORS TABLE
-- Maps authenticated Supabase Auth users to authorized store admin role
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. AUTOMATIC TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER trigger_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. HELPER SECURITY FUNCTION: IS_ADMIN()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict default: enable RLS on every table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Products RLS
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can modify products"
    ON public.products FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Product Variants RLS
CREATE POLICY "Public can view active variants"
    ON public.product_variants FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can modify variants"
    ON public.product_variants FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Price History RLS
-- Strict: anonymous visitors cannot view or alter price history
CREATE POLICY "Only admins can view price history"
    ON public.price_history FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only admins can insert price history"
    ON public.price_history FOR INSERT
    WITH CHECK (public.is_admin());

-- Admin Users RLS
CREATE POLICY "Admins can view admin list"
    ON public.admin_users FOR SELECT
    USING (public.is_admin() OR id = auth.uid());

-- 10. ATOMIC STORED FUNCTION: UPDATE PRODUCT OR VARIANT PRICE WITH AUDIT RECORD
-- This transaction guarantees that whenever a price is updated by an admin,
-- the audit history row is created simultaneously.
CREATE OR REPLACE FUNCTION public.update_product_price(
    p_product_id TEXT,
    p_new_original_price NUMERIC(12, 2),
    p_new_selling_price NUMERIC(12, 2),
    p_reason TEXT DEFAULT 'Manual price adjustment',
    p_variant_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_old_orig NUMERIC(12, 2);
    v_old_sell NUMERIC(12, 2);
    v_caller_email TEXT;
    v_product RECORD;
    v_variant RECORD;
BEGIN
    -- Verify admin authorization
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only registered administrators can update product prices.';
    END IF;

    -- Validate price parameters
    IF p_new_original_price < 0 OR p_new_selling_price < 0 THEN
        RAISE EXCEPTION 'Prices must be non-negative monetary amounts.';
    END IF;

    IF p_new_selling_price > p_new_original_price THEN
        RAISE EXCEPTION 'Selling price (₹%) cannot exceed MRP / original price (₹%).', p_new_selling_price, p_new_original_price;
    END IF;

    -- Get caller email
    SELECT email INTO v_caller_email
    FROM auth.users
    WHERE id = auth.uid();

    IF p_variant_id IS NOT NULL THEN
        -- Lock variant row for atomic update
        SELECT * INTO v_variant
        FROM public.product_variants
        WHERE id = p_variant_id AND product_id = p_product_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product variant with ID "%" for product "%" not found.', p_variant_id, p_product_id;
        END IF;

        v_old_orig := COALESCE(v_variant.original_price, 0);
        v_old_sell := COALESCE(v_variant.selling_price, 0);

        IF v_old_orig <> p_new_original_price OR v_old_sell <> p_new_selling_price THEN
            INSERT INTO public.price_history (
                product_id,
                variant_id,
                old_original_price,
                new_original_price,
                old_selling_price,
                new_selling_price,
                changed_by,
                changed_by_email,
                change_reason
            ) VALUES (
                p_product_id,
                p_variant_id,
                v_old_orig,
                p_new_original_price,
                v_old_sell,
                p_new_selling_price,
                auth.uid(),
                v_caller_email,
                p_reason
            );

            UPDATE public.product_variants
            SET 
                original_price = p_new_original_price,
                selling_price = p_new_selling_price,
                updated_at = timezone('utc'::text, now())
            WHERE id = p_variant_id;
        END IF;

        RETURN jsonb_build_object(
            'success', true,
            'product_id', p_product_id,
            'variant_id', p_variant_id,
            'old_original_price', v_old_orig,
            'new_original_price', p_new_original_price,
            'old_selling_price', v_old_sell,
            'new_selling_price', p_new_selling_price
        );
    ELSE
        -- Lock the target product row for atomic update
        SELECT * INTO v_product
        FROM public.products
        WHERE id = p_product_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID "%" not found.', p_product_id;
        END IF;

        v_old_orig := v_product.original_price;
        v_old_sell := v_product.selling_price;

        -- Only record audit history if a price actually changed
        IF v_old_orig <> p_new_original_price OR v_old_sell <> p_new_selling_price THEN
            INSERT INTO public.price_history (
                product_id,
                variant_id,
                old_original_price,
                new_original_price,
                old_selling_price,
                new_selling_price,
                changed_by,
                changed_by_email,
                change_reason
            ) VALUES (
                p_product_id,
                NULL,
                v_old_orig,
                p_new_original_price,
                v_old_sell,
                p_new_selling_price,
                auth.uid(),
                v_caller_email,
                p_reason
            );

            -- Update the product record
            UPDATE public.products
            SET 
                original_price = p_new_original_price,
                selling_price = p_new_selling_price,
                emi_starts_at = ROUND(p_new_selling_price / 24, 0),
                updated_at = timezone('utc'::text, now())
            WHERE id = p_product_id;
        END IF;

        RETURN jsonb_build_object(
            'success', true,
            'product_id', p_product_id,
            'variant_id', NULL,
            'old_original_price', v_old_orig,
            'new_original_price', p_new_original_price,
            'old_selling_price', v_old_sell,
            'new_selling_price', p_new_selling_price
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. BULK PRICE UPDATE STORED PROCEDURE
-- Applies batch updates in a single ACID transaction
CREATE OR REPLACE FUNCTION public.update_product_prices_bulk(
    p_updates JSONB,
    p_reason TEXT DEFAULT 'Bulk price adjustment'
)
RETURNS JSONB AS $$
DECLARE
    v_item JSONB;
    v_count INTEGER := 0;
    v_product_id TEXT;
    v_variant_id UUID;
    v_orig NUMERIC(12, 2);
    v_sell NUMERIC(12, 2);
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only registered administrators can update product prices.';
    END IF;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_updates)
    LOOP
        v_product_id := v_item->>'productId';
        v_orig := (v_item->>'originalPrice')::NUMERIC;
        v_sell := (v_item->>'sellingPrice')::NUMERIC;
        v_variant_id := CASE 
            WHEN v_item->>'variantId' IS NOT NULL AND v_item->>'variantId' <> '' 
            THEN (v_item->>'variantId')::UUID 
            ELSE NULL 
        END;

        PERFORM public.update_product_price(v_product_id, v_orig, v_sell, p_reason, v_variant_id);
        v_count := v_count + 1;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'updated_count', v_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. HELPER: PROVISION FIRST ADMINISTRATOR
CREATE OR REPLACE FUNCTION public.add_admin_user(p_email TEXT, p_role TEXT DEFAULT 'admin')
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Auth user with email "%" does not exist in auth.users. Please create user in Supabase Auth first.', p_email;
    END IF;
    INSERT INTO public.admin_users (id, email, role)
    VALUES (v_user_id, p_email, p_role)
    ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. ENABLE REALTIME
-- Enables Supabase Realtime broadcast on products table for instant storefront synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
