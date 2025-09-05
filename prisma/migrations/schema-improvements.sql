-- CodeRabbit Schema Improvements Migration
-- This migration addresses data type improvements and constraints

BEGIN;

-- 1. First, handle the "Reservation" table rename to preserve data
-- Note: Only run this if the old "Reservation" table exists and has data
-- Check if old table exists first:
-- SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Reservation' AND table_schema = 'public');

-- If it exists with data, rename it for safety:
-- ALTER TABLE "public"."Reservation" RENAME TO "Reservation_legacy";

-- 2. Add timestamptz types to Blackout table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Blackout' AND table_schema = 'public') THEN
    -- Rename existing table
    ALTER TABLE "public"."Blackout" RENAME TO "blackouts";
    
    -- Update column types to timestamptz
    ALTER TABLE "public"."blackouts" 
    ALTER COLUMN "startUtc" TYPE timestamptz,
    ALTER COLUMN "endUtc" TYPE timestamptz;
    
    -- Add check constraint for end after start
    ALTER TABLE "public"."blackouts" 
    ADD CONSTRAINT "blackouts_end_after_start" CHECK ("endUtc" > "startUtc");
  END IF;
END $$;

-- 3. Update MenuItem table - handle pricing and naming constraints
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu_items' AND table_schema = 'public') THEN
    -- Change price from float to decimal
    ALTER TABLE "public"."menu_items" 
    ALTER COLUMN "price" TYPE DECIMAL(10,2);
    
    -- Drop the global unique constraint on name
    ALTER TABLE "public"."menu_items" 
    DROP CONSTRAINT IF EXISTS "menu_items_name_key";
    
    -- Add composite unique constraint (categoryId, name)
    ALTER TABLE "public"."menu_items" 
    ADD CONSTRAINT "menu_items_categoryId_name_key" UNIQUE ("categoryId", "name");
  END IF;
END $$;

-- 4. Update MenuItemVariant pricing
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu_item_variants' AND table_schema = 'public') THEN
    ALTER TABLE "public"."menu_item_variants" 
    ALTER COLUMN "priceChange" TYPE DECIMAL(10,2);
  END IF;
END $$;

-- 5. Update OrderItem pricing and add quantity constraint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items' AND table_schema = 'public') THEN
    -- Change unitPrice to decimal
    ALTER TABLE "public"."order_items" 
    ALTER COLUMN "unitPrice" TYPE DECIMAL(10,2);
    
    -- Add constraint for positive quantity
    ALTER TABLE "public"."order_items" 
    ADD CONSTRAINT "order_items_quantity_positive" CHECK ("quantity" >= 1);
  END IF;
END $$;

-- 6. Update Order totalPrice
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders' AND table_schema = 'public') THEN
    ALTER TABLE "public"."orders" 
    ALTER COLUMN "totalPrice" TYPE DECIMAL(10,2);
  END IF;
END $$;

-- 7. Create indexes that might be missing
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_blackouts_start_end" ON "public"."blackouts" ("startUtc", "endUtc");

COMMIT;

-- Post-migration validation queries (run manually to verify):
-- 
-- -- Check that all monetary fields are now DECIMAL
-- SELECT column_name, data_type, numeric_precision, numeric_scale 
-- FROM information_schema.columns 
-- WHERE table_name IN ('menu_items', 'menu_item_variants', 'order_items', 'orders') 
--   AND column_name IN ('price', 'priceChange', 'unitPrice', 'totalPrice');
--
-- -- Verify blackouts constraint
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'blackouts'::regclass AND contype = 'c';
--
-- -- Check unique constraints on menu_items
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'menu_items'::regclass AND contype = 'u';
