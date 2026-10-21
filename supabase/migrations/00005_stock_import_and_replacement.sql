-- ==============================================================================
-- GAYATHRI COMMUNICATION E-COMMERCE
-- MIGRATION 00005: SAFE CATALOGUE REPLACEMENT & DURABLE BACKUP SYSTEM
-- ==============================================================================

-- 1. HARDEN CORE HELPER: PUBLIC.IS_ADMIN()
-- Ensure search_path is safely fixed to public, pg_temp to prevent hijacking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. PRESERVE HISTORICAL PRICE DATA (SCHEMA ADJUSTMENT)
-- Ensure price audit history is preserved indefinitely across catalogue replacements
ALTER TABLE public.price_history ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.price_history ALTER COLUMN product_id DROP NOT NULL;

-- Convert CASCADE deletion on product_id to SET NULL so price records are never deleted
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'price_history_product_id_fkey'
          AND table_name = 'price_history'
    ) THEN
        ALTER TABLE public.price_history DROP CONSTRAINT price_history_product_id_fkey;
        ALTER TABLE public.price_history ADD CONSTRAINT price_history_product_id_fkey
            FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. DURABLE CATALOGUE BACKUPS TABLE
-- Records timestamped snapshots of product catalogues and historical price logs before replacements
CREATE TABLE IF NOT EXISTS public.catalogue_backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    workflow TEXT NOT NULL DEFAULT 'catalogue_replacement',
    product_count INTEGER NOT NULL,
    products_snapshot JSONB NOT NULL,
    price_history_count INTEGER NOT NULL DEFAULT 0,
    price_history_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'completed',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.catalogue_backups ADD COLUMN IF NOT EXISTS workflow TEXT NOT NULL DEFAULT 'catalogue_replacement';
ALTER TABLE public.catalogue_backups ADD COLUMN IF NOT EXISTS price_history_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.catalogue_backups ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed';

CREATE INDEX IF NOT EXISTS idx_catalogue_backups_created_at ON public.catalogue_backups(created_at DESC);

-- Enable RLS on backups: Only authorized administrators may view or create backups
ALTER TABLE public.catalogue_backups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view catalogue backups" ON public.catalogue_backups;
CREATE POLICY "Admins can view catalogue backups"
    ON public.catalogue_backups FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert catalogue backups" ON public.catalogue_backups;
CREATE POLICY "Admins can insert catalogue backups"
    ON public.catalogue_backups FOR INSERT
    WITH CHECK (public.is_admin());

-- 4. STORED PROCEDURE: BACKUP CURRENT CATALOGUE (SEPARATE COMMITTED SNAPSHOT)
CREATE OR REPLACE FUNCTION public.backup_current_catalogue(
    p_label TEXT DEFAULT 'Manual catalogue snapshot',
    p_workflow TEXT DEFAULT 'catalogue_replacement'
)
RETURNS JSONB AS $$
DECLARE
    v_count INTEGER;
    v_ph_count INTEGER;
    v_snapshot JSONB;
    v_ph_snapshot JSONB;
    v_backup_id UUID;
    v_user_email TEXT;
BEGIN
    -- Verify administrator authorization
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access Denied: Only authenticated administrators can create catalogue backups.';
    END IF;

    SELECT email INTO v_user_email FROM auth.users WHERE id = auth.uid();

    -- Snapshot all product rows and all existing price history records
    SELECT COUNT(*), COALESCE(jsonb_agg(to_jsonb(p)), '[]'::jsonb)
    INTO v_count, v_snapshot
    FROM public.products p;

    SELECT COUNT(*), COALESCE(jsonb_agg(to_jsonb(ph)), '[]'::jsonb)
    INTO v_ph_count, v_ph_snapshot
    FROM public.price_history ph;

    INSERT INTO public.catalogue_backups (
        label,
        workflow,
        product_count,
        products_snapshot,
        price_history_count,
        price_history_snapshot,
        status,
        created_by,
        created_by_email
    )
    VALUES (
        p_label,
        p_workflow,
        v_count,
        v_snapshot,
        v_ph_count,
        v_ph_snapshot,
        'completed',
        auth.uid(),
        v_user_email
    )
    RETURNING id INTO v_backup_id;

    RETURN jsonb_build_object(
        'success', true,
        'backup_id', v_backup_id,
        'workflow', p_workflow,
        'product_count', v_count,
        'price_history_count', v_ph_count,
        'created_at', timezone('utc'::text, now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.backup_current_catalogue(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.backup_current_catalogue(TEXT, TEXT) TO authenticated;

-- 5. STORED PROCEDURE: TRANSACTIONAL CATALOGUE REPLACEMENT (STAGE B)
-- Atomically clears old products, inserts validated list, and verifies all constraints.
-- Automatically rolls back on any violation.
CREATE OR REPLACE FUNCTION public.replace_product_catalogue(
    p_products JSONB,
    p_backup_label TEXT DEFAULT 'Pre-replacement FY 2026-27 automated backup',
    p_existing_backup_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_b_count INTEGER;
    v_b_ph_count INTEGER;
    v_b_products JSONB;
    v_b_ph JSONB;
    v_b_created_at TIMESTAMPTZ;
    v_b_workflow TEXT;
    v_b_status TEXT;
    v_current_product_count INTEGER;
    v_current_ph_count INTEGER;
    v_input_count INTEGER;
    v_inserted_count INTEGER;
    v_item JSONB;
BEGIN
    -- 1. Security Check: Admin authorization required
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access Denied: Only authenticated administrators can replace the product catalogue.';
    END IF;

    -- 2. Input validation: p_products must be non-empty JSON array
    IF p_products IS NULL OR jsonb_typeof(p_products) <> 'array' THEN
        RAISE EXCEPTION 'Invalid payload: p_products must be a valid JSON array.';
    END IF;

    v_input_count := jsonb_array_length(p_products);
    IF v_input_count = 0 THEN
        RAISE EXCEPTION 'Replacement aborted: product list is empty.';
    END IF;

    -- 3. Strict Pre-Replacement Durable Backup Verification
    -- A committed backup ID is strictly mandatory. Independent commitment must be verified.
    IF p_existing_backup_id IS NULL THEN
        RAISE EXCEPTION 'Replacement aborted: p_existing_backup_id is strictly required. A standalone committed backup must be established before replacement begins.';
    END IF;

    -- Fetch the backup record from the durable backup ledger
    SELECT
        b.product_count,
        b.price_history_count,
        b.products_snapshot,
        b.price_history_snapshot,
        b.created_at,
        b.workflow,
        b.status
    INTO
        v_b_count,
        v_b_ph_count,
        v_b_products,
        v_b_ph,
        v_b_created_at,
        v_b_workflow,
        v_b_status
    FROM public.catalogue_backups b
    WHERE b.id = p_existing_backup_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Replacement aborted: Provided backup ID % does not exist in catalogue_backups.', p_existing_backup_id;
    END IF;

    -- 3a. Status Verification: Must be completed
    IF v_b_status <> 'completed' THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % status is "%", expected "completed".', p_existing_backup_id, v_b_status;
    END IF;

    -- 3b. Workflow Provenance Verification: Must belong to replacement workflow
    IF v_b_workflow NOT IN ('catalogue_replacement', 'stock_import') THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % was created for workflow "%", not catalogue replacement.', p_existing_backup_id, v_b_workflow;
    END IF;

    -- 3c. Freshness / Anti-Stale Window Verification (must have been created within last 15 minutes)
    IF v_b_created_at < (timezone('utc'::text, now()) - INTERVAL '15 minutes') THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % was created at %, which exceeds the 15-minute freshness window. A fresh pre-replacement backup is required.', p_existing_backup_id, v_b_created_at;
    END IF;

    -- 3d. Product Snapshot Completeness & Count Verification
    IF v_b_products IS NULL OR jsonb_typeof(v_b_products) <> 'array' THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % contains invalid or corrupted product snapshot.', p_existing_backup_id;
    END IF;

    IF jsonb_array_length(v_b_products) <> v_b_count THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % product snapshot length (%) does not match recorded product_count (%).', p_existing_backup_id, jsonb_array_length(v_b_products), v_b_count;
    END IF;

    -- Verify that the backup captures the exact current live catalogue count
    SELECT COUNT(*) INTO v_current_product_count FROM public.products;
    IF v_b_count <> v_current_product_count THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % product count (%) does not match current catalogue product count (%). Stale or mismatched backup rejected.', p_existing_backup_id, v_b_count, v_current_product_count;
    END IF;

    -- 3e. Price History Snapshot Completeness & Count Verification
    IF v_b_ph IS NULL OR jsonb_typeof(v_b_ph) <> 'array' THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % contains invalid or corrupted price history snapshot.', p_existing_backup_id;
    END IF;

    SELECT COUNT(*) INTO v_current_ph_count FROM public.price_history;
    IF jsonb_array_length(v_b_ph) <> v_current_ph_count THEN
        RAISE EXCEPTION 'Replacement aborted: Backup % price history snapshot length (%) does not match current price history count (%).', p_existing_backup_id, jsonb_array_length(v_b_ph), v_current_ph_count;
    END IF;

    -- 4. Stamp product_name on any price_history records before products are detached
    UPDATE public.price_history ph
    SET product_name = p.name
    FROM public.products p
    WHERE ph.product_id = p.id AND (ph.product_name IS NULL OR ph.product_name = '');

    -- 5. Delete old catalogue entries (price_history product_id becomes NULL, preserving audit rows)
    DELETE FROM public.products WHERE id IS NOT NULL;

    -- 6. Insert each validated product record
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_products)
    LOOP
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
        ) VALUES (
            (v_item->>'id'),
            (v_item->>'sku'),
            (v_item->>'slug'),
            (v_item->>'name'),
            COALESCE(v_item->>'tagline', ''),
            COALESCE(v_item->>'description', ''),
            (v_item->>'brand'),
            (v_item->>'category_id'),
            (v_item->>'badge'),
            COALESCE((v_item->>'is_best_seller')::BOOLEAN, false),
            COALESCE((v_item->>'is_new_launch')::BOOLEAN, false),
            COALESCE((v_item->>'is_deal_of_the_day')::BOOLEAN, false),
            (v_item->>'original_price')::NUMERIC(12, 2),
            (v_item->>'selling_price')::NUMERIC(12, 2),
            COALESCE((v_item->>'rating')::NUMERIC(3, 2), 4.8),
            COALESCE((v_item->>'review_count')::INTEGER, 0),
            COALESCE(v_item->>'image', '/images/placeholder-product.svg'),
            COALESCE(v_item->'gallery', '[]'::jsonb),
            COALESCE((v_item->>'emi_starts_at')::NUMERIC(12, 2), 0),
            COALESCE(v_item->>'warranty', '1 Year Official Brand Warranty'),
            COALESCE((v_item->>'stock_quantity')::INTEGER, 0),
            COALESCE((v_item->>'in_stock')::BOOLEAN, ((v_item->>'stock_quantity')::INTEGER > 0)),
            COALESCE(v_item->'specs', '[]'::jsonb),
            COALESCE(v_item->'highlights', '[]'::jsonb),
            COALESCE(v_item->'variants', '[]'::jsonb),
            COALESCE((v_item->>'is_active')::BOOLEAN, true)
        );
    END LOOP;

    -- 7. Verification step: Count inserted products
    SELECT COUNT(*) INTO v_inserted_count FROM public.products;

    IF v_inserted_count <> v_input_count THEN
        RAISE EXCEPTION 'Verification Failed: Expected % products, but only % were inserted.', v_input_count, v_inserted_count;
    END IF;

    -- Return full execution report
    RETURN jsonb_build_object(
        'success', true,
        'backup_id', p_existing_backup_id,
        'backup_verified', true,
        'backup_product_count', v_b_count,
        'backup_price_history_count', v_b_ph_count,
        'imported_count', v_inserted_count,
        'verified_count', v_inserted_count,
        'executed_at', timezone('utc'::text, now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.replace_product_catalogue(JSONB, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.replace_product_catalogue(JSONB, TEXT, UUID) TO authenticated;

-- 6. STORED PROCEDURE: SERVER-SIDE STOCK VALIDATION FOR CART & CHECKOUT
-- Validates requested items against live stock_quantity. Rejects zero-stock and over-stock requests.
CREATE OR REPLACE FUNCTION public.validate_order_stock(
    p_items JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_item JSONB;
    v_product_id TEXT;
    v_req_qty INTEGER;
    v_avail_qty INTEGER;
    v_in_stock BOOLEAN;
    v_product_name TEXT;
    v_errors JSONB := '[]'::jsonb;
    v_valid BOOLEAN := true;
BEGIN
    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Invalid items array');
    END IF;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id');
        v_req_qty := COALESCE((v_item->>'quantity')::INTEGER, 1);

        SELECT name, stock_quantity, in_stock
        INTO v_product_name, v_avail_qty, v_in_stock
        FROM public.products
        WHERE id = v_product_id;

        IF NOT FOUND THEN
            v_valid := false;
            v_errors := v_errors || jsonb_build_object(
                'product_id', v_product_id,
                'error', 'Product not found in catalog'
            );
        ELSIF NOT v_in_stock OR v_avail_qty <= 0 THEN
            v_valid := false;
            v_errors := v_errors || jsonb_build_object(
                'product_id', v_product_id,
                'product_name', v_product_name,
                'available_qty', 0,
                'requested_qty', v_req_qty,
                'error', 'Product is currently Out of Stock'
            );
        ELSIF v_req_qty > v_avail_qty THEN
            v_valid := false;
            v_errors := v_errors || jsonb_build_object(
                'product_id', v_product_id,
                'product_name', v_product_name,
                'available_qty', v_avail_qty,
                'requested_qty', v_req_qty,
                'error', format('Requested quantity (%s) exceeds available showroom inventory (%s)', v_req_qty, v_avail_qty)
            );
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'valid', v_valid,
        'errors', v_errors
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.validate_order_stock(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_order_stock(JSONB) TO anon, authenticated;
