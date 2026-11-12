-- ==============================================================================
-- MIGRATION 00008: SECURITY HARDENING + HERO BANNERS TABLE
-- ==============================================================================
-- Paste the whole file into the Supabase SQL editor and press Run.
-- Safe to run more than once, and safe whether or not migrations 00005-00007
-- were ever applied (every step checks what exists first).
--
-- Fixes:
--  1. clear_all_products / admin_delete_product / admin_create_product had NO
--     admin check and were granted to anon: anyone could wipe the catalogue.
--  2. add_admin_user was executable by everyone: any sign-up could become
--     super_admin.
--  3. Storage policies let anyone upload/overwrite product images.
--  4. hero_banners let ANY signed-in user edit banners; on the live project the
--     table did not exist at all (banners lived only in the admin's browser).
-- ==============================================================================

-- 0. Core helpers (recreated so this file does not depend on older migrations)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Make admin_users policy use is_admin() (avoids recursive policy lookups)
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
CREATE POLICY "Admins can view admin list" ON public.admin_users
    FOR SELECT USING (id = auth.uid() OR public.is_admin());

-- Only the SQL editor / service role can add admins.
CREATE OR REPLACE FUNCTION public.add_admin_user(p_email TEXT, p_role TEXT DEFAULT 'admin')
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(p_email);
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No auth user with email "%". Create the user in Authentication > Users first.', p_email;
    END IF;
    INSERT INTO public.admin_users (id, email, role)
    VALUES (v_user_id, lower(p_email), p_role)
    ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.add_admin_user(TEXT, TEXT) FROM PUBLIC, anon, authenticated;

-- 1. Admin-guarded catalogue RPCs ----------------------------------------------
DROP FUNCTION IF EXISTS public._admin_create_product_unguarded(JSONB);

CREATE OR REPLACE FUNCTION public.clear_all_products()
RETURNS JSONB AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;
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

CREATE OR REPLACE FUNCTION public.admin_create_product(p_product JSONB)
RETURNS JSONB AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
    END IF;

    INSERT INTO public.products (
        id, sku, slug, name, tagline, description, brand, category_id,
        badge, is_best_seller, is_new_launch, is_deal_of_the_day,
        original_price, selling_price, rating, review_count,
        image, gallery, emi_starts_at, warranty, stock_quantity,
        in_stock, specs, highlights, variants, is_active
    ) VALUES (
        p_product->>'id',
        p_product->>'sku',
        p_product->>'slug',
        p_product->>'name',
        COALESCE(p_product->>'tagline', ''),
        COALESCE(p_product->>'description', ''),
        p_product->>'brand',
        p_product->>'category_id',
        p_product->>'badge',
        COALESCE((p_product->>'is_best_seller')::BOOLEAN, false),
        COALESCE((p_product->>'is_new_launch')::BOOLEAN, true),
        COALESCE((p_product->>'is_deal_of_the_day')::BOOLEAN, false),
        (p_product->>'original_price')::NUMERIC,
        (p_product->>'selling_price')::NUMERIC,
        COALESCE((p_product->>'rating')::NUMERIC, 4.8),
        COALESCE((p_product->>'review_count')::INTEGER, 0),
        p_product->>'image',
        COALESCE(p_product->'gallery', '[]'::jsonb),
        COALESCE((p_product->>'emi_starts_at')::NUMERIC, 0),
        COALESCE(p_product->>'warranty', '1 Year Official Warranty'),
        COALESCE((p_product->>'stock_quantity')::INTEGER, 1),
        COALESCE((p_product->>'in_stock')::BOOLEAN, true),
        COALESCE(p_product->'specs', '[]'::jsonb),
        COALESCE(p_product->'highlights', '[]'::jsonb),
        COALESCE(p_product->'variants', '[]'::jsonb),
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        selling_price = EXCLUDED.selling_price,
        original_price = EXCLUDED.original_price,
        stock_quantity = EXCLUDED.stock_quantity,
        in_stock = EXCLUDED.in_stock,
        image = EXCLUDED.image,
        gallery = EXCLUDED.gallery,
        variants = EXCLUDED.variants,
        updated_at = timezone('utc'::text, now());

    RETURN jsonb_build_object('success', true, 'id', p_product->>'id');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.clear_all_products() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_delete_product(TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_create_product(JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.clear_all_products() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_product(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_product(JSONB) TO authenticated;

-- Older functions: harden only if they exist on this database.
DO $$
DECLARE
    fn TEXT;
BEGIN
    FOREACH fn IN ARRAY ARRAY[
        'public.update_product_price(text, numeric, numeric, text, uuid)',
        'public.update_product_prices_bulk(jsonb, text)',
        'public.backup_current_catalogue(text, text)',
        'public.replace_product_catalogue(jsonb, text, uuid)'
    ] LOOP
        IF to_regprocedure(fn) IS NOT NULL THEN
            EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', fn);
            EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', fn);
            EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', fn);
        END IF;
    END LOOP;
END $$;

-- 2. Products: only admins may write (reads stay public for active products) --
DROP POLICY IF EXISTS "Admins can modify products" ON public.products;
CREATE POLICY "Admins can modify products" ON public.products
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Storage: only admins may write product images ---------------------------
DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

CREATE POLICY "Admins can upload product images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admins can update product images" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admins can delete product images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

-- 4. Hero banners: create if missing, public read, admin-only writes ---------
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

GRANT SELECT ON public.hero_banners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_banners TO authenticated;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_banners;
EXCEPTION WHEN duplicate_object OR undefined_object THEN NULL;
END $$;

-- Tell the API about the new table right away.
NOTIFY pgrst, 'reload schema';

-- 5. NEXT STEPS (Supabase dashboard):
--   * Authentication > Sign In / Providers: turn OFF "Allow new users to sign up".
--   * Authentication > Users > Add user: create the owner's login, then run:
--       SELECT public.add_admin_user('owner@example.com', 'super_admin');
