-- ==============================================================================
-- MIGRATION 00008: SECURITY HARDENING + HERO BANNERS TABLE
-- ==============================================================================
-- Run in the Supabase SQL editor. Safe to run more than once.
--
-- Fixes:
--  1. clear_all_products / admin_delete_product / admin_create_product were
--     SECURITY DEFINER with NO admin check and granted to anon: anyone on the
--     internet could wipe or rewrite the catalogue.
--  2. add_admin_user was executable by PUBLIC: anyone who signed up could make
--     themselves super_admin.
--  3. Storage policies let anyone upload/overwrite files in product-images.
--  4. hero_banners policy allowed ANY signed-in user to edit banners; the table
--     was also never created on the live project (banners lived only in the
--     admin's browser, which is why phones and laptops showed different heroes).
--  5. SECURITY DEFINER functions without a pinned search_path.
-- ==============================================================================

-- 1. Admin-guarded catalogue RPCs -------------------------------------------------
CREATE OR REPLACE FUNCTION public.clear_all_products()
RETURNS JSONB AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    TRUNCATE TABLE public.product_variants CASCADE;
    TRUNCATE TABLE public.products CASCADE;
    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.admin_delete_product(p_product_id TEXT)
RETURNS JSONB AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    DELETE FROM public.products WHERE id = p_product_id;
    RETURN jsonb_build_object('success', true, 'deleted_id', p_product_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Wrap the existing admin_create_product body with an admin check by renaming
-- the old function and calling it from a guarded one.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
               WHERE n.nspname = 'public' AND p.proname = 'admin_create_product')
       AND NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
               WHERE n.nspname = 'public' AND p.proname = '_admin_create_product_unguarded') THEN
        ALTER FUNCTION public.admin_create_product(JSONB) RENAME TO _admin_create_product_unguarded;
    END IF;
END $$;

REVOKE ALL ON FUNCTION public._admin_create_product_unguarded(JSONB) FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public._admin_create_product_unguarded(JSONB) SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.admin_create_product(p_product JSONB)
RETURNS JSONB AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
    RETURN public._admin_create_product_unguarded(p_product);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.clear_all_products() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_delete_product(TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_create_product(JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.clear_all_products() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_product(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_product(JSONB) TO authenticated;

-- 2. add_admin_user: SQL editor / service role only -------------------------------
REVOKE ALL ON FUNCTION public.add_admin_user(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.add_admin_user(TEXT, TEXT) SET search_path = public, pg_temp;

-- Price RPCs check is_admin() already; pin search_path and drop anon.
ALTER FUNCTION public.update_product_price(TEXT, NUMERIC, NUMERIC, TEXT, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.update_product_prices_bulk(JSONB, TEXT) SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.update_product_price(TEXT, NUMERIC, NUMERIC, TEXT, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_product_prices_bulk(JSONB, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_product_price(TEXT, NUMERIC, NUMERIC, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_product_prices_bulk(JSONB, TEXT) TO authenticated;

-- 3. Storage: only admins may write product images --------------------------------
DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
-- (Admin-only insert/update/delete policies from migration 00004 remain in force.)

-- 4. Hero banners: create if missing, admin-only writes ---------------------------
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    model_name TEXT NOT NULL DEFAULT '',
    short_label TEXT NOT NULL DEFAULT '',
    headline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    match_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
    image TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',
    fallback_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    fallback_original_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    brand_tag TEXT NOT NULL DEFAULT '',
    badge_text TEXT NOT NULL DEFAULT '',
    kicker TEXT NOT NULL DEFAULT '',
    primary_cta_text TEXT NOT NULL DEFAULT '',
    secondary_cta_text TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS match_keywords JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for active hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Allow admin full access to hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Public read hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Admins manage hero banners" ON public.hero_banners;

CREATE POLICY "Public read hero banners" ON public.hero_banners
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage hero banners" ON public.hero_banners
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_banners;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. IMPORTANT MANUAL STEPS (Supabase dashboard):
--   * Authentication > Providers > Email: turn OFF "Allow new users to sign up".
--   * Create the owner's admin login in Authentication > Users, then run:
--       SELECT public.add_admin_user('owner@example.com', 'super_admin');
