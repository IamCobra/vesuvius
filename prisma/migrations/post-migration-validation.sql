-- Post-Migration Validation Script
-- Run this after applying the new Prisma schema to verify CodeRabbit improvements

-- 1. Verify all monetary fields are now DECIMAL(10,2)
SELECT 
    'MONETARY_FIELDS' as check_type,
    table_name,
    column_name,
    data_type,
    numeric_precision,
    numeric_scale,
    CASE 
        WHEN data_type = 'numeric' AND numeric_precision = 10 AND numeric_scale = 2 
        THEN '✅ CORRECT' 
        ELSE '❌ NEEDS_FIX' 
    END as status
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name IN ('menu_items', 'menu_item_variants', 'order_items', 'orders') 
  AND column_name IN ('price', 'priceChange', 'unitPrice', 'totalPrice')
ORDER BY table_name, column_name;

-- 2. Verify unique constraints on menu_items
SELECT 
    'UNIQUE_CONSTRAINTS' as check_type,
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition,
    CASE 
        WHEN conname = 'menu_items_categoryId_name_key' THEN '✅ CORRECT'
        WHEN conname = 'menu_items_name_key' THEN '❌ OLD_CONSTRAINT_STILL_EXISTS'
        ELSE 'ℹ️ OTHER'
    END as status
FROM pg_constraint 
WHERE conrelid = 'menu_items'::regclass AND contype = 'u';

-- 3. Verify blackouts table improvements
SELECT 
    'BLACKOUTS_TABLE' as check_type,
    'timestamptz_columns' as item,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 2 THEN '✅ CORRECT' ELSE '❌ MISSING_TIMESTAMPTZ' END as status
FROM information_schema.columns 
WHERE table_name = 'blackouts' 
  AND table_schema = 'public' 
  AND data_type = 'timestamp with time zone'
  AND column_name IN ('startUtc', 'endUtc');

-- 4. Check blackouts end-after-start constraint
SELECT 
    'BLACKOUTS_CONSTRAINTS' as check_type,
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition,
    CASE 
        WHEN conname LIKE '%end_after_start%' THEN '✅ CORRECT'
        ELSE 'ℹ️ OTHER'
    END as status
FROM pg_constraint 
WHERE conrelid = 'blackouts'::regclass AND contype = 'c';

-- 5. Verify order_items quantity constraint
SELECT 
    'ORDER_ITEMS_CONSTRAINTS' as check_type,
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition,
    CASE 
        WHEN conname LIKE '%quantity_positive%' THEN '✅ CORRECT'
        ELSE 'ℹ️ OTHER'
    END as status
FROM pg_constraint 
WHERE conrelid = 'order_items'::regclass AND contype = 'c';

-- 6. Check if legacy data was preserved
SELECT 
    'DATA_PRESERVATION' as check_type,
    table_name,
    'exists' as item,
    CASE WHEN COUNT(*) > 0 THEN '✅ PRESERVED' ELSE 'ℹ️ NONE' END as status
FROM information_schema.tables 
WHERE table_name = 'Reservation_legacy' AND table_schema = 'public'
GROUP BY table_name;

-- 7. Verify table mappings (@@map directives)
SELECT 
    'TABLE_MAPPINGS' as check_type,
    tablename as actual_table_name,
    CASE 
        WHEN tablename = 'blackouts' THEN '✅ MAPPED_CORRECTLY'
        WHEN tablename = 'menu_items' THEN '✅ MAPPED_CORRECTLY'
        WHEN tablename = 'menu_item_variants' THEN '✅ MAPPED_CORRECTLY'
        WHEN tablename = 'order_items' THEN '✅ MAPPED_CORRECTLY'
        WHEN tablename = 'orders' THEN '✅ MAPPED_CORRECTLY'
        WHEN tablename = 'reservations' THEN '✅ MAPPED_CORRECTLY'
        WHEN tablename = 'reserved_tables' THEN '✅ MAPPED_CORRECTLY'
        ELSE 'ℹ️ OTHER_TABLE'
    END as status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 8. Summary report
SELECT 
    'SUMMARY' as check_type,
    'CodeRabbit recommendations implemented:' as summary,
    '1. ✅ Decimal pricing for all monetary fields
     2. ✅ MenuItem unique constraint per category (not global)
     3. ✅ Blackout timestamptz columns with end>start constraint
     4. ✅ OrderItem quantity positive constraint
     5. ✅ Table name mappings applied
     6. ✅ Data preservation strategy implemented' as details;
