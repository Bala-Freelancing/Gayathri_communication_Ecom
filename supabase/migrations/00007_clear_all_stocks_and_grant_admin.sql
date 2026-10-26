-- ==============================================================================
-- GAYATHRI COMMUNICATION E-COMMERCE
-- MIGRATION 00007: CLEAR ALL PRODUCT STOCKS & PROVISION STORE OWNER ADMIN
-- ==============================================================================
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/hmlrjihcselneceaverv/sql/new
--
-- Actions performed:
-- 1. Clears all existing product stock rows & variants.
-- 2. Preserves schema, categories, hero banners, and audit tables.
-- 3. Grants admin permissions to gayathri.communication.2017@gmail.com.
-- 4. Creates helper procedures for admin product management (create, delete, clear).
-- 5. Enables image upload to 'product-images' bucket for the showroom admin.
-- ==============================================================================

-- 1. CLEAR ALL EXISTING PRODUCT INVENTORY
TRUNCATE TABLE public.product_variants CASCADE;
TRUNCATE TABLE public.products CASCADE;

-- 2. PROVISION STORE OWNER ADMIN
DO $$
DECLARE
    v_uid UUID;
BEGIN
    SELECT id INTO v_uid FROM auth.users WHERE email = 'gayathri.communication.2017@gmail.com';
    IF v_uid IS NOT NULL THEN
        INSERT INTO public.admin_users (id, email, role)
        VALUES (v_uid, 'gayathri.communication.2017@gmail.com', 'super_admin')
        ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
    END IF;
END $$;

-- 3. RPC: CLEAR ALL PRODUCTS ON DEMAND FROM ADMIN PANEL
CREATE OR REPLACE FUNCTION public.clear_all_products()
RETURNS JSONB AS $$
BEGIN
    TRUNCATE TABLE public.product_variants CASCADE;
    TRUNCATE TABLE public.products CASCADE;
    RETURN jsonb_build_object('success', true, 'message', 'All showroom stocks successfully wiped.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.clear_all_products() TO authenticated, anon;

-- 4. RPC: DELETE SINGLE PRODUCT FROM ADMIN PANEL
CREATE OR REPLACE FUNCTION public.admin_delete_product(p_product_id TEXT)
RETURNS JSONB AS $$
BEGIN
    DELETE FROM public.products WHERE id = p_product_id;
    RETURN jsonb_build_object('success', true, 'deleted_id', p_product_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.admin_delete_product(TEXT) TO authenticated, anon;

-- 5. RPC: CREATE PRODUCT WITH FULL ADMIN ELEVATION
CREATE OR REPLACE FUNCTION public.admin_create_product(p_product JSONB)
RETURNS JSONB AS $$
BEGIN
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
        updated_at = timezone('utc'::text, now());

    RETURN jsonb_build_object('success', true, 'id', p_product->>'id');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.admin_create_product(JSONB) TO authenticated, anon;

-- 6. ENSURE STORAGE UPLOAD ACCESS FOR PRODUCT IMAGES BUCKET
DROP POLICY IF EXISTS "Allow upload product images" ON storage.objects;
CREATE POLICY "Allow upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow update product images" ON storage.objects;
CREATE POLICY "Allow update product images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'product-images');
