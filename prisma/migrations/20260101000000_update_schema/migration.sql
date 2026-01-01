-- Drop unused tables and columns that don't match current schema
DROP TABLE IF EXISTS "DesignLayer" CASCADE;
DROP TABLE IF EXISTS "Design" CASCADE;
DROP TABLE IF EXISTS "CartItem" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Address" CASCADE;

-- Drop DesignStatus and LayerType enums that are no longer used
DROP TYPE IF EXISTS "DesignStatus";
DROP TYPE IF EXISTS "LayerType";

-- Update Product table to match current schema
-- Drop foreign key constraint for categoryId if it exists
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";

-- Drop categoryId column and add category string column
ALTER TABLE "Product" DROP COLUMN IF EXISTS "categoryId";
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'unisex';

-- Drop columns that don't exist in current schema
ALTER TABLE "Product" DROP COLUMN IF EXISTS "isCustomizable";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "material";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "weight";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "fit";

-- Update description to be nullable
ALTER TABLE "Product" ALTER COLUMN "description" DROP NOT NULL;

-- Create index on category
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");

-- Update Order table to match current schema
-- Rename shippingCost to shipping if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'shippingCost'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "shippingCost" TO "shipping";
    END IF;
END $$;

-- Add inline shipping address fields
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingName" TEXT DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingAddress" TEXT DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingCity" TEXT DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingState" TEXT DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingZipCode" TEXT DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingCountry" TEXT DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingPhone" TEXT DEFAULT '';

-- Remove shippingAddressId foreign key and column
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_shippingAddressId_fkey";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "shippingAddressId";

-- Remove unused Order columns
ALTER TABLE "Order" DROP COLUMN IF EXISTS "discount";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "trackingNumber";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "carrier";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "notes";

-- Rename paymentIntentId to paymentId if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Order' AND column_name = 'paymentIntentId'
    ) THEN
        ALTER TABLE "Order" RENAME COLUMN "paymentIntentId" TO "paymentId";
    END IF;
END $$;

-- Add payment fields
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentDate" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentHash" TEXT;

-- Remove unused OrderItem columns
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_designId_fkey";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "designId";
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "variantSku";

-- Drop and recreate CustomDesign table to match current schema
DROP TABLE IF EXISTS "CustomDesign" CASCADE;

CREATE TABLE "CustomDesign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "orderItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDesign_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes and foreign keys for CustomDesign if not exist
CREATE UNIQUE INDEX IF NOT EXISTS "CustomDesign_orderItemId_key" ON "CustomDesign"("orderItemId");
CREATE INDEX IF NOT EXISTS "CustomDesign_userId_idx" ON "CustomDesign"("userId");
CREATE INDEX IF NOT EXISTS "CustomDesign_productId_idx" ON "CustomDesign"("productId");

-- Add foreign keys for CustomDesign (only if table was just created)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CustomDesign_orderItemId_fkey') THEN
        ALTER TABLE "CustomDesign" ADD CONSTRAINT "CustomDesign_orderItemId_fkey" 
        FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CustomDesign_userId_fkey') THEN
        ALTER TABLE "CustomDesign" ADD CONSTRAINT "CustomDesign_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CustomDesign_variantId_fkey') THEN
        ALTER TABLE "CustomDesign" ADD CONSTRAINT "CustomDesign_variantId_fkey" 
        FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
