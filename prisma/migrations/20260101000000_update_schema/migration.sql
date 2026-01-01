-- Drop unused tables and columns that don't match current schema
DROP TABLE IF EXISTS "DesignLayer" CASCADE;
DROP TABLE IF EXISTS "Design" CASCADE;
DROP TABLE IF EXISTS "CartItem" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;

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

-- Add CustomDesign table if it doesn't exist
CREATE TABLE IF NOT EXISTS "CustomDesign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "orderItemId" TEXT,
    "design" JSONB NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
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
