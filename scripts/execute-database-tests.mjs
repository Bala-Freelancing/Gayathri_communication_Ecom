import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const { Client } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const FORBIDDEN_PROD_REF = 'hmlrjihcselneceaverv'

// Load configuration from .env.test.local if present
const testEnvPath = path.join(rootDir, '.env.test.local')
if (fs.existsSync(testEnvPath)) {
  const content = fs.readFileSync(testEnvPath, 'utf-8')
  content.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=')
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim()
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  })
}

const dbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || ''
const supabaseUrl = process.env.TEST_SUPABASE_URL || ''

console.log('='.repeat(80))
console.log('  GAYATHRI COMMUNICATION - GENUINE DATABASE TEST SUITE')
console.log('='.repeat(80))

// -------------------------------------------------------------
// GUARD 1: Production Isolation Check
// -------------------------------------------------------------
if (
  dbUrl.includes(FORBIDDEN_PROD_REF) ||
  supabaseUrl.includes(FORBIDDEN_PROD_REF) ||
  process.env.VITE_SUPABASE_URL?.includes(FORBIDDEN_PROD_REF) && !dbUrl
) {
  console.error('\n🚨 FATAL SAFETY VIOLATION:')
  console.error(`Target connection matches production reference "${FORBIDDEN_PROD_REF}".`)
  console.error('All mutating operations or tests against production are strictly forbidden.')
  process.exit(1)
}

if (!dbUrl) {
  console.error('\n⚠️  NO ISOLATED TEST DATABASE CONFIGURED.')
  console.error('Please configure a disposable Supabase project or local PostgreSQL in .env.test.local:')
  console.error('')
  console.error('  TEST_DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres')
  console.error('  TEST_SUPABASE_URL=https://[DISPOSABLE-PROJECT-REF].supabase.co')
  console.error('')
  console.error('Note: .env.test.local is gitignored and will never be committed to git.')
  process.exit(2)
}

let passCount = 0
let failCount = 0

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`)
    passCount++
  } else {
    console.error(`  [FAIL] ${testName} ${details ? `(${details})` : ''}`)
    failCount++
  }
}

async function runDatabaseTests() {
  const client = new Client({
    connectionString: dbUrl,
    ssl: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
  })

  try {
    console.log('\n[1/7] Connecting to isolated database...')
    await client.connect()
    console.log('  ✓ Connected successfully to target test database.')

    // Verify database identity is NOT production
    const hostRes = await client.query('SELECT inet_server_addr(), current_database(), current_user')
    console.log(`  Target Database: ${hostRes.rows[0].current_database} as user ${hostRes.rows[0].current_user}`)

    // -------------------------------------------------------------
    // STEP 1: Apply Migrations 00001 through 00005 in Order
    // -------------------------------------------------------------
    console.log('\n[2/7] Checking and Applying Migrations 00001 - 00005...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS public._migration_history (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT now()
      );
    `)
    const appliedRes = await client.query('SELECT version FROM public._migration_history')
    const appliedSet = new Set(appliedRes.rows.map(r => r.version))

    const migrationsDir = path.join(rootDir, 'supabase', 'migrations')
    const migrationFiles = [
      '00001_create_store_schema.sql',
      '00002_seed_initial_products.sql',
      '00003_add_accessories_and_other_electronics.sql',
      '00004_create_storage_bucket.sql',
      '00005_stock_import_and_replacement.sql',
    ]

    for (const file of migrationFiles) {
      if (appliedSet.has(file)) {
        console.log(`  ✓ ${file} already applied (skipping).`)
        continue
      }
      const filePath = path.join(migrationsDir, file)
      if (!fs.existsSync(filePath)) {
        throw new Error(`Migration file missing: ${file}`)
      }
      const sql = fs.readFileSync(filePath, 'utf-8')
      console.log(`  Applying ${file}...`)
      try {
        await client.query(sql)
        await client.query('INSERT INTO public._migration_history (version) VALUES ($1) ON CONFLICT DO NOTHING', [file])
        console.log(`  ✓ ${file} applied successfully.`)
      } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('duplicate key')) {
          console.log(`  ℹ ${file} entities already exist in database; marked as applied.`)
          await client.query('INSERT INTO public._migration_history (version) VALUES ($1) ON CONFLICT DO NOTHING', [file])
        } else if (file.includes('00004') && err.message.includes('schema "storage" does not exist')) {
          console.log(`  ℹ Note: Supabase "storage" schema absent in pure PG; creating mock schema...`)
          await client.query(`
            CREATE SCHEMA IF NOT EXISTS storage;
            CREATE TABLE IF NOT EXISTS storage.buckets (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              public BOOLEAN DEFAULT false,
              file_size_limit BIGINT,
              allowed_mime_types TEXT[]
            );
            CREATE TABLE IF NOT EXISTS storage.objects (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              bucket_id TEXT REFERENCES storage.buckets(id),
              name TEXT,
              owner UUID,
              created_at TIMESTAMPTZ DEFAULT now()
            );
          `)
          await client.query(sql)
          await client.query('INSERT INTO public._migration_history (version) VALUES ($1) ON CONFLICT DO NOTHING', [file])
          console.log(`  ✓ ${file} applied successfully with storage compatibility.`)
        } else {
          throw err
        }
      }
    }

    // -------------------------------------------------------------
    // STEP 2: Schema & Migration Compatibility Verification
    // -------------------------------------------------------------
    console.log('\n[3/7] Verifying Schema Structures & Function Hardening...')

    // Check tables exist
    const tablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('categories', 'products', 'price_history', 'admin_users', 'catalogue_backups')
    `)
    const tables = tablesRes.rows.map(r => r.table_name)
    assert(tables.includes('categories'), 'Table "categories" exists in public schema')
    assert(tables.includes('products'), 'Table "products" exists in public schema')
    assert(tables.includes('price_history'), 'Table "price_history" exists in public schema')
    assert(tables.includes('admin_users'), 'Table "admin_users" exists in public schema')
    assert(tables.includes('catalogue_backups'), 'Table "catalogue_backups" exists in public schema')

    // Check price_history columns and nullability
    const phCols = await client.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'price_history'
    `)
    const phColMap = Object.fromEntries(phCols.rows.map(r => [r.column_name, r]))
    assert(Boolean(phColMap['product_name']), 'price_history table contains "product_name" column')
    assert(phColMap['product_id']?.is_nullable === 'YES', 'price_history.product_id is nullable (preserves historical prices on product deletion)')

    // Check foreign key constraint delete rule on price_history
    const fkRes = await client.query(`
      SELECT rc.delete_rule 
      FROM information_schema.referential_constraints rc
      JOIN information_schema.table_constraints tc ON rc.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'price_history' AND tc.constraint_type = 'FOREIGN KEY'
    `)
    const hasSetNull = fkRes.rows.some(r => r.delete_rule === 'SET NULL')
    assert(hasSetNull, 'price_history foreign key constraint specifies ON DELETE SET NULL')

    // Check search_path configuration on all SECURITY DEFINER functions
    const funcSearchPathRes = await client.query(`
      SELECT proname, proconfig 
      FROM pg_proc 
      JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid 
      WHERE pg_namespace.nspname = 'public' 
        AND proname IN ('is_admin', 'backup_current_catalogue', 'replace_product_catalogue', 'validate_order_stock')
    `)
    for (const row of funcSearchPathRes.rows) {
      const configStr = (row.proconfig || []).join(',')
      assert(configStr.includes('search_path=public, pg_temp'), `Function ${row.proname}() explicitly hardens search_path = public, pg_temp`)
    }

    // -------------------------------------------------------------
    // STEP 3: Authorization & RLS Enforcement Tests
    // -------------------------------------------------------------
    console.log('\n[4/7] Testing Authorization & RLS Policy Enforcement...')

    // Create a mock auth user in auth.users first to satisfy foreign key constraints
    const testAdminUid = '11111111-1111-1111-1111-111111111111'
    const testNonAdminUid = '22222222-2222-2222-2222-222222222222'

    await client.query(`
      INSERT INTO auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
      VALUES 
        ('${testAdminUid}', 'authenticated', 'authenticated', 'admin@test.local', '{"provider":"email"}', '{}', now(), now()),
        ('${testNonAdminUid}', 'authenticated', 'authenticated', 'user@test.local', '{"provider":"email"}', '{}', now(), now())
      ON CONFLICT (id) DO NOTHING;
    `)

    // Seed test admin in public.admin_users
    await client.query(`
      INSERT INTO public.admin_users (id, email, role)
      VALUES ('${testAdminUid}', 'admin@test.local', 'admin')
      ON CONFLICT (id) DO UPDATE SET role = 'admin';
    `)

    // Helper to simulate request session context
    async function execAsUser(uid, queryStr, params = []) {
      await client.query('BEGIN')
      try {
        if (uid) {
          await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [uid])
          await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: uid })])
        } else {
          await client.query("SELECT set_config('request.jwt.claim.sub', '', true)")
          await client.query("SELECT set_config('request.jwt.claims', '', true)")
        }
        const res = await client.query(queryStr, params)
        await client.query('COMMIT')
        return { success: true, rows: res.rows }
      } catch (err) {
        await client.query('ROLLBACK')
        return { success: false, error: err.message }
      }
    }

    // Test A: Non-admin calling backup_current_catalogue -> REJECT
    const nonAdminBackup = await execAsUser(testNonAdminUid, "SELECT public.backup_current_catalogue('Non-admin snapshot', 'catalogue_replacement')")
    assert(
      !nonAdminBackup.success && nonAdminBackup.error.includes('Access Denied'),
      'Calling backup_current_catalogue() as non-admin is strictly rejected by PostgreSQL'
    )

    // Test B: Non-admin calling replace_product_catalogue -> REJECT
    const nonAdminReplace = await execAsUser(testNonAdminUid, "SELECT public.replace_product_catalogue('[]'::jsonb, 'Label', '00000000-0000-0000-0000-000000000000'::uuid)")
    assert(
      !nonAdminReplace.success && nonAdminReplace.error.includes('Access Denied'),
      'Calling replace_product_catalogue() as non-admin is strictly rejected by PostgreSQL'
    )

    // -------------------------------------------------------------
    // STEP 4: Backup Creation & Durability Verification
    // -------------------------------------------------------------
    console.log('\n[5/7] Testing Backup Creation & Durability Ledger...')

    // Count existing products
    const initialProductCountRes = await client.query('SELECT COUNT(*) FROM public.products')
    const initialProductCount = parseInt(initialProductCountRes.rows[0].count, 10)

    // Admin creates durable backup
    const adminBackup = await execAsUser(
      testAdminUid,
      "SELECT public.backup_current_catalogue('Automated Integration Test Snapshot', 'catalogue_replacement') AS result"
    )
    assert(adminBackup.success, 'Admin caller successfully creates committed catalogue backup')
    const backupResult = adminBackup.rows[0].result
    assert(backupResult.success === true, 'backup_current_catalogue returned success: true')
    assert(backupResult.product_count === initialProductCount, `Backup recorded exact live product count (${initialProductCount})`)
    const validBackupId = backupResult.backup_id
    assert(Boolean(validBackupId), `Received durable backup ID: ${validBackupId}`)

    // Query catalogue_backups directly to verify durability
    const backupRowRes = await client.query(`SELECT * FROM public.catalogue_backups WHERE id = $1`, [validBackupId])
    assert(backupRowRes.rows.length === 1, 'Backup record persisted in public.catalogue_backups')
    const savedBackup = backupRowRes.rows[0]
    assert(savedBackup.status === 'completed', 'Backup status is "completed"')
    assert(savedBackup.workflow === 'catalogue_replacement', 'Backup workflow provenance is "catalogue_replacement"')
    assert(Array.isArray(savedBackup.products_snapshot), 'products_snapshot is a valid JSONB array')
    assert(savedBackup.products_snapshot.length === initialProductCount, 'products_snapshot length matches live product count')

    // -------------------------------------------------------------
    // STEP 5: Backup Integrity & Provenance Validations
    // -------------------------------------------------------------
    console.log('\n[6/7] Testing Backup Integrity, Freshness Window & Safety Validations...')

    const testPayload = JSON.stringify([
      {
        id: 'new-vivo-v40e-8-128',
        sku: 'VIVO-V40E-8-128',
        slug: 'vivo-v40e-8-128',
        name: 'Vivo V40e 8/128 Mint Green',
        brand: 'Vivo',
        category_id: 'smartphones',
        original_price: 33999,
        selling_price: 28999,
        image: '/images/vivo-v40e.jpg',
        stock_quantity: 6,
        in_stock: true
      }
    ])

    // Test rejection with missing backup ID
    const noBackupRes = await execAsUser(testAdminUid, "SELECT public.replace_product_catalogue($1::jsonb, 'Test', NULL)", [testPayload])
    assert(!noBackupRes.success && noBackupRes.error.includes('p_existing_backup_id is strictly required'), 'Rejects replacement when backup ID is NULL')

    // Test rejection with unknown backup ID
    const fakeBackupId = '99999999-9999-9999-9999-999999999999'
    const unknownBackupRes = await execAsUser(testAdminUid, `SELECT public.replace_product_catalogue($1::jsonb, 'Test', '${fakeBackupId}'::uuid)`, [testPayload])
    assert(!unknownBackupRes.success && unknownBackupRes.error.includes('does not exist in catalogue_backups'), 'Rejects replacement with non-existent backup ID')

    // Test rejection with stale backup (>15 minutes old)
    await client.query(`UPDATE public.catalogue_backups SET created_at = now() - INTERVAL '20 minutes' WHERE id = $1`, [validBackupId])
    const staleBackupRes = await execAsUser(testAdminUid, `SELECT public.replace_product_catalogue($1::jsonb, 'Test', '${validBackupId}'::uuid)`, [testPayload])
    assert(!staleBackupRes.success && staleBackupRes.error.includes('freshness window'), 'Rejects replacement with backup older than 15 minutes')

    // Restore backup freshness
    await client.query(`UPDATE public.catalogue_backups SET created_at = now() WHERE id = $1`, [validBackupId])

    // Test rejection on product count mismatch (e.g. if catalogue modified after backup)
    const testDummyId = 'dummy-temp-prod-999'
    await client.query(`
      INSERT INTO public.products (id, sku, slug, name, brand, category_id, original_price, selling_price, image)
      VALUES ('${testDummyId}', 'DUMMY-SKU-999', 'dummy-temp-999', 'Dummy Temp', 'TestBrand', 'smartphones', 1000, 1000, '/img.jpg')
    `)
    const countMismatchRes = await execAsUser(testAdminUid, `SELECT public.replace_product_catalogue($1::jsonb, 'Test', '${validBackupId}'::uuid)`, [testPayload])
    assert(!countMismatchRes.success && countMismatchRes.error.includes('does not match current catalogue product count'), 'Rejects replacement when live product count changed after backup')

    // Cleanup dummy product
    await client.query(`DELETE FROM public.products WHERE id = '${testDummyId}'`)

    // -------------------------------------------------------------
    // STEP 6: Price History Preservation & Transactional Replacement
    // -------------------------------------------------------------
    console.log('\n[7/7] Testing Price-History Preservation, Rollback & Catalogue Replacement...')

    // 1. Setup Price History record tied to an existing product using a valid UUID
    const anyProdRes = await client.query('SELECT id, name, original_price, selling_price FROM public.products LIMIT 1')
    const sampleProd = anyProdRes.rows[0]
    const testPhId = '33333333-3333-3333-3333-333333333333'

    await client.query(`
      INSERT INTO public.price_history (id, product_id, old_original_price, new_original_price, old_selling_price, new_selling_price, changed_by)
      VALUES ('${testPhId}', '${sampleProd.id}', ${sampleProd.original_price}, ${sampleProd.original_price}, ${sampleProd.selling_price}, ${sampleProd.selling_price - 100}, '${testAdminUid}')
      ON CONFLICT (id) DO UPDATE SET old_selling_price = EXCLUDED.old_selling_price;
    `)

    // Create fresh pre-replacement backup
    const freshBackupRes = await execAsUser(testAdminUid, "SELECT public.backup_current_catalogue('Fresh Pre-replacement Backup', 'catalogue_replacement') AS result")
    const freshBackupId = freshBackupRes.rows[0].result.backup_id

    // 2. Test Transactional Rollback: Replacement with invalid item (e.g. selling_price > original_price)
    const invalidBatch = JSON.stringify([
      {
        id: 'new-prod-invalid-1',
        sku: 'NEW-INV-1',
        slug: 'new-inv-1',
        name: 'Invalid Price Phone',
        brand: 'TestBrand',
        category_id: 'smartphones',
        original_price: 1000,
        selling_price: 5000, // VIOLATES selling_price <= original_price
        image: '/img.jpg',
        stock_quantity: 5
      }
    ])

    const rollbackRes = await execAsUser(testAdminUid, `SELECT public.replace_product_catalogue($1::jsonb, 'Invalid batch test', '${freshBackupId}'::uuid)`, [invalidBatch])
    assert(!rollbackRes.success, 'PostgreSQL raises exception when product fails CHECK constraint (selling_price <= original_price)')

    // Verify database state was NOT corrupted and products are still present
    const postRollbackCount = await client.query('SELECT COUNT(*) FROM public.products')
    assert(
      parseInt(postRollbackCount.rows[0].count, 10) === initialProductCount,
      'Transactional Rollback verified: 100% of live products preserved after failed replacement'
    )

    // 3. Test Successful Catalogue Replacement
    // Create another fresh backup matching exact current state
    const cleanBackupRes = await execAsUser(testAdminUid, "SELECT public.backup_current_catalogue('Clean Replacement Test Backup', 'catalogue_replacement') AS result")
    const cleanBackupId = cleanBackupRes.rows[0].result.backup_id

    const validNewBatch = JSON.stringify([
      {
        id: 'new-vivo-v40e-8-128',
        sku: 'VIVO-V40E-8-128',
        slug: 'vivo-v40e-8-128',
        name: 'Vivo V40e 8/128 Mint Green',
        tagline: 'Delight Every Moment',
        description: 'New Showroom Stock',
        brand: 'Vivo',
        category_id: 'smartphones',
        original_price: 33999,
        selling_price: 28999,
        image: '/images/vivo-v40e.jpg',
        stock_quantity: 6,
        in_stock: true
      },
      {
        id: 'new-realme-13-8-128',
        sku: 'REALME-13-8-128',
        slug: 'realme-13-8-128',
        name: 'Realme 13 8/128 Speed Green',
        tagline: 'Speed to Victory',
        description: 'Showroom Stock',
        brand: 'Realme',
        category_id: 'smartphones',
        original_price: 19999,
        selling_price: 17999,
        image: '/images/realme-13.jpg',
        stock_quantity: 0,
        in_stock: false
      }
    ])

    const successReplaceRes = await execAsUser(
      testAdminUid,
      `SELECT public.replace_product_catalogue($1::jsonb, 'Stage B Genuine Test Replacement', '${cleanBackupId}'::uuid) AS result`,
      [validNewBatch]
    )
    assert(successReplaceRes.success, 'replace_product_catalogue executed successfully')
    const replaceReport = successReplaceRes.rows[0].result
    assert(replaceReport.success === true, 'replace_product_catalogue report returns success: true')
    assert(replaceReport.imported_count === 2, 'replace_product_catalogue imported exactly 2 replacement products')

    // 4. Verify Price History Preservation
    const auditRow = await client.query(`SELECT * FROM public.price_history WHERE id = '${testPhId}'`)
    assert(auditRow.rows.length === 1, 'Historical price audit row is preserved after old product deletion')
    assert(auditRow.rows[0].product_id === null, 'price_history.product_id became NULL (not cascaded or deleted)')
    assert(auditRow.rows[0].product_name === sampleProd.name, `price_history.product_name was stamped with "${sampleProd.name}"`)

    // 5. Test validate_order_stock Procedure
    const stockTestPayload = JSON.stringify([
      { product_id: 'new-vivo-v40e-8-128', quantity: 2 }, // Valid in-stock item
      { product_id: 'new-realme-13-8-128', quantity: 1 },  // Out of stock (stock_quantity=0)
      { product_id: 'new-vivo-v40e-8-128', quantity: 10 }, // Over stock (available=6)
      { product_id: 'non-existent-product-id', quantity: 1 } // Missing product
    ])
    const stockValRes = await client.query(`SELECT public.validate_order_stock($1::jsonb) AS result`, [stockTestPayload])
    const valResult = stockValRes.rows[0].result
    assert(valResult.valid === false, 'validate_order_stock accurately identifies inventory issues')
    assert(valResult.errors.length === 3, `validate_order_stock returned 3 expected errors (found ${valResult.errors.length})`)
    assert(valResult.errors.some(e => e.error?.includes('Out of Stock')), 'Identifies Out of Stock error for 0-quantity product')
    assert(valResult.errors.some(e => e.error?.includes('exceeds available showroom inventory')), 'Identifies excess quantity error')
    assert(valResult.errors.some(e => e.error?.includes('not found in catalog')), 'Identifies missing product error')

    // Restore original products from the clean backup so the test database is clean
    const restoreBackup = await client.query(`SELECT products_snapshot FROM public.catalogue_backups WHERE id = $1`, [cleanBackupId])
    const snapshotProducts = restoreBackup.rows[0].products_snapshot
    if (snapshotProducts && snapshotProducts.length > 0) {
      await client.query('DELETE FROM public.products')
      for (const p of snapshotProducts) {
        await client.query(`
          INSERT INTO public.products (
            id, sku, slug, name, tagline, description, brand, category_id,
            badge, is_best_seller, is_new_launch, is_deal_of_the_day,
            original_price, selling_price, rating, review_count, image,
            gallery, emi_starts_at, warranty, stock_quantity, in_stock,
            specs, highlights, variants, is_active
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12,
            $13, $14, $15, $16, $17,
            $18, $19, $20, $21, $22,
            $23, $24, $25, $26
          )
        `, [
          p.id, p.sku, p.slug, p.name, p.tagline || '', p.description || '', p.brand, p.category_id,
          p.badge, p.is_best_seller || false, p.is_new_launch || false, p.is_deal_of_the_day || false,
          p.original_price, p.selling_price, p.rating || 4.8, p.review_count || 0, p.image,
          JSON.stringify(p.gallery || []), p.emi_starts_at || 0, p.warranty || '', p.stock_quantity || 0, p.in_stock || false,
          JSON.stringify(p.specs || []), JSON.stringify(p.highlights || []), JSON.stringify(p.variants || []), p.is_active ?? true
        ])
      }
      console.log(`  ✓ Restored original ${snapshotProducts.length} products from test backup.`)
    }

    console.log('\n' + '='.repeat(80))
    console.log(`GENUINE DATABASE TESTS COMPLETE: ${passCount} PASSED, ${failCount} FAILED`)
    console.log('='.repeat(80))

    if (failCount > 0) process.exit(1)
  } catch (error) {
    console.error('\n❌ Error executing genuine database tests:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runDatabaseTests()
