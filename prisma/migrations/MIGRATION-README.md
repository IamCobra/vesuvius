# CodeRabbit Schema Improvements Migration Guide

This migration addresses all the schema improvement recommendations from CodeRabbit to ensure data integrity, proper type safety, and prevent data loss.

## 🎯 CodeRabbit Issues Addressed

1. **Monetary Fields**: Changed from `Float` to `Decimal(10,2)` for precise currency handling
2. **Unique Constraints**: MenuItem names now unique per category (not globally)
3. **Data Preservation**: Safe handling of legacy Reservation table data
4. **Timestamptz**: Blackout table uses proper timezone-aware timestamps
5. **Data Constraints**: Added positive quantity constraint and end-after-start validation
6. **Table Mappings**: Consistent @@map directives for all models

## 📋 Migration Steps

### Step 1: Pre-Migration Data Safety

```bash
# Run data preservation script
psql $DATABASE_URL -f prisma/migrations/data-migration-strategy.sql
```

### Step 2: Apply Schema Changes

```bash
# Generate and apply the new migration
npx prisma migrate dev --name "coderabbit_improvements"

# OR manually apply if needed:
psql $DATABASE_URL -f prisma/migrations/schema-improvements.sql
```

### Step 3: Validation

```bash
# Verify all changes are correct
psql $DATABASE_URL -f prisma/migrations/post-migration-validation.sql
```

### Step 4: Generate Updated Client

```bash
# Regenerate Prisma client with new types
npx prisma generate
```

## 🔍 What Changed

### Monetary Fields (Float → Decimal)

- `MenuItem.price`: Now `Decimal(10,2)`
- `MenuItemVariant.priceChange`: Now `Decimal(10,2)`
- `OrderItem.unitPrice`: Now `Decimal(10,2)`
- `Order.totalPrice`: Now `Decimal(10,2)`

### Constraints Added

- `MenuItem`: Unique constraint per category instead of global
- `OrderItem`: Quantity must be >= 1
- `Blackout`: End time must be after start time

### Table Improvements

- `Blackout` → `blackouts` (with @@map)
- Timestamps now use `@db.Timestamptz` for timezone awareness

## ⚠️ Breaking Changes

### Code Updates Required

1. **Price Handling**: Update all price calculations to use `Decimal`:

```typescript
// Before
const total = item.price * quantity;

// After
import { Decimal } from "@prisma/client/runtime/library";
const total = item.price.mul(quantity);
```

2. **MenuItem Queries**: Names are now unique per category:

```typescript
// Before - might conflict across categories
const item = await prisma.menuItem.findUnique({
  where: { name: "Burger" },
});

// After - specify category
const item = await prisma.menuItem.findUnique({
  where: {
    categoryId_name: {
      categoryId: "category-id",
      name: "Burger",
    },
  },
});
```

## 📊 Data Migration Details

### Legacy Reservation Table

If your `Reservation` table contains data, it will be:

1. Renamed to `Reservation_legacy` (preserving all data)
2. New `reservations` table created with updated schema
3. Data can be migrated using the provided SQL in `data-migration-strategy.sql`

### Validation Queries

The `post-migration-validation.sql` script provides comprehensive checks:

- ✅ Verifies all monetary fields are `Decimal(10,2)`
- ✅ Confirms unique constraints are properly configured
- ✅ Validates timestamptz columns and constraints
- ✅ Ensures data preservation worked correctly

## 🚀 Next Steps

1. **Update Application Code**: Handle Decimal types in calculations
2. **Test Thoroughly**: Verify all price calculations work correctly
3. **Monitor Performance**: Check if new constraints affect query performance
4. **Clean Up**: After validation, drop `Reservation_legacy` if migration successful

## 🆘 Rollback Plan

If issues arise, you can rollback:

1. Restore from `Reservation_legacy` table
2. Revert schema changes using previous migration
3. Regenerate Prisma client with old schema

## 📝 Files Created

- `data-migration-strategy.sql`: Pre-migration data preservation
- `schema-improvements.sql`: Core schema changes
- `post-migration-validation.sql`: Validation and verification
- This README with complete migration guide

All changes address CodeRabbit's recommendations while ensuring zero data loss and maintaining system functionality.
