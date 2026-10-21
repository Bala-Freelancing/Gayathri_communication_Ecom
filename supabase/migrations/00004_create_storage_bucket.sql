-- ==============================================================================
-- GAYATHRI COMMUNICATION E-COMMERCE
-- MIGRATION 00004: PERMANENT CLOUD STORAGE BUCKET FOR PRODUCT IMAGES
-- ==============================================================================
-- Implements secure, permanent cloud object storage for showroom product photos.
-- 1. Creates 'product-images' bucket with 5MB file size limit and image MIME restrictions.
-- 2. Grants public read access so storefront visitors can display product photos.
-- 3. Restricts upload, update, and delete exclusively to authenticated Supabase
--    administrators in public.admin_users with role IN ('admin', 'super_admin').
-- 4. Guarantees that local demo sessions (e.g. gc_demo_admin_session) cannot bypass
--    RLS because Supabase Storage policies strictly evaluate auth.uid().
-- 5. Idempotent and conflict-free: does NOT touch or overwrite any unrelated buckets.
-- ==============================================================================

-- 1. CREATE PRODUCT-IMAGES BUCKET IDEMPOTENTLY
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5 MB max per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- 2. PUBLIC READ ACCESS POLICY
-- Enables fast public CDN viewing for storefront product catalog images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- 3. ADMIN INSERT (UPLOAD) POLICY
-- Restricts image uploads strictly to verified administrators in public.admin_users
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'product-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- 4. ADMIN UPDATE POLICY
-- Restricts image updates strictly to verified administrators
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'product-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        bucket_id = 'product-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- 5. ADMIN DELETE POLICY
-- Restricts image deletions strictly to verified administrators
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'product-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );
