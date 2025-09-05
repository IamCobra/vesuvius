-- Data Migration Strategy for CodeRabbit Recommendations
-- Run this BEFORE applying the new Prisma schema

BEGIN;

-- Step 1: Preserve existing Reservation data if it exists
-- This addresses CodeRabbit's concern about data loss
DO $$
DECLARE
    reservation_count INTEGER;
    legacy_exists BOOLEAN;
BEGIN
    -- Check if old Reservation table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'Reservation' AND table_schema = 'public'
    ) INTO legacy_exists;
    
    IF legacy_exists THEN
        -- Count existing reservations
        EXECUTE 'SELECT COUNT(*) FROM "public"."Reservation"' INTO reservation_count;
        
        RAISE NOTICE 'Found % reservations in legacy Reservation table', reservation_count;
        
        IF reservation_count > 0 THEN
            -- Rename old table to preserve data
            ALTER TABLE "public"."Reservation" RENAME TO "Reservation_legacy";
            
            RAISE NOTICE 'Renamed Reservation table to Reservation_legacy to preserve % records', reservation_count;
            
            -- Create backup timestamp
            COMMENT ON TABLE "public"."Reservation_legacy" IS 'Legacy reservation data backed up on ' || CURRENT_TIMESTAMP;
        ELSE
            -- If empty, we can safely drop it
            DROP TABLE "public"."Reservation";
            RAISE NOTICE 'Dropped empty Reservation table';
        END IF;
    ELSE
        RAISE NOTICE 'No legacy Reservation table found';
    END IF;
END $$;

-- Step 2: Validate and prepare data for type conversions
-- Check for any potential data issues before schema changes

-- Validate price data can be converted to DECIMAL(10,2)
DO $$
DECLARE
    invalid_prices INTEGER := 0;
BEGIN
    -- Check menu_items prices
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu_items' AND table_schema = 'public') THEN
        SELECT COUNT(*) INTO invalid_prices
        FROM "public"."menu_items" 
        WHERE "price" IS NULL OR "price" < 0;
        
        IF invalid_prices > 0 THEN
            RAISE WARNING 'Found % invalid prices in menu_items that need attention', invalid_prices;
        END IF;
    END IF;
    
    -- Check order quantities are positive
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items' AND table_schema = 'public') THEN
        SELECT COUNT(*) INTO invalid_prices
        FROM "public"."order_items" 
        WHERE "quantity" IS NULL OR "quantity" <= 0;
        
        IF invalid_prices > 0 THEN
            RAISE WARNING 'Found % invalid quantities in order_items that need fixing', invalid_prices;
            
            -- Option: Fix invalid quantities
            -- UPDATE "public"."order_items" SET "quantity" = 1 WHERE "quantity" IS NULL OR "quantity" <= 0;
        END IF;
    END IF;
END $$;

-- Step 3: Create a migration log for tracking
CREATE TABLE IF NOT EXISTS "public"."migration_log" (
    "id" SERIAL PRIMARY KEY,
    "migration_name" VARCHAR(255) NOT NULL,
    "applied_at" TIMESTAMPTZ DEFAULT NOW(),
    "notes" TEXT
);

INSERT INTO "public"."migration_log" ("migration_name", "notes")
VALUES ('coderabbit_pre_migration', 'Prepared data for CodeRabbit schema improvements');

COMMIT;

-- Instructions for post-migration data restoration:
/*
-- If you need to restore data from Reservation_legacy to the new reservations table:

-- 1. First apply the new Prisma schema
-- 2. Then run data migration:

INSERT INTO "public"."reservations" (
    id, "partySize", "slotStartUtc", "slotEndUtc", 
    "customerId", status, "createdAt", "updatedAt"
)
SELECT 
    id, 
    "partySize",
    "slotStartUtc",
    "slotStartUtc" + INTERVAL '120 minutes' as "slotEndUtc", -- Calculate end time
    "customerId",
    COALESCE(status, 'CONFIRMED'),
    "createdAt",
    "updatedAt"
FROM "public"."Reservation_legacy"
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."reservations" 
    WHERE "reservations".id = "Reservation_legacy".id
);

-- 3. Verify data integrity:
SELECT 
    (SELECT COUNT(*) FROM "public"."Reservation_legacy") as legacy_count,
    (SELECT COUNT(*) FROM "public"."reservations") as new_count;

-- 4. Once verified, you can drop the legacy table:
-- DROP TABLE "public"."Reservation_legacy";
*/
