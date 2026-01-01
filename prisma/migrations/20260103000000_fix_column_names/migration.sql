-- Fix remaining column name mismatches between database and schema

-- Fix ProductImage: rename 'alt' to 'altText'
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'ProductImage' AND column_name = 'alt'
    ) THEN
        ALTER TABLE "ProductImage" RENAME COLUMN "alt" TO "altText";
    END IF;
END $$;

-- Clean up OrderItem table
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "unitPrice";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "totalPrice";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "productName";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "variantSize";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "variantColor";

-- Add productId to OrderItem if missing
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "productId" TEXT NOT NULL DEFAULT '';

-- Clean up Review table
ALTER TABLE "Review" DROP COLUMN IF EXISTS "title";
ALTER TABLE "Review" DROP COLUMN IF EXISTS "isVerified";
ALTER TABLE "Review" DROP COLUMN IF EXISTS "isApproved";
ALTER TABLE "Review" DROP COLUMN IF EXISTS "helpful";

-- Clean up ProductVariant table
ALTER TABLE "ProductVariant" DROP COLUMN IF EXISTS "images";
ALTER TABLE "ProductVariant" DROP COLUMN IF EXISTS "sku";
