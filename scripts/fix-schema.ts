import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function fixSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing database schema...\n');
    
    // ========== FIX PRODUCT TABLE ==========
    console.log('Fixing Product table...');
    
    // Add category column if missing
    const categoryCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'category'
    `);
    
    if (categoryCheck.rows.length === 0) {
      await client.query(`ALTER TABLE "Product" ADD COLUMN "category" TEXT DEFAULT 'unisex'`);
      await client.query(`UPDATE "Product" SET "category" = 'unisex' WHERE "category" IS NULL`);
      await client.query(`ALTER TABLE "Product" ALTER COLUMN "category" SET NOT NULL`);
      console.log('  ✓ Added category column');
    }
    
    // Remove categoryId column if exists
    const categoryIdCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'categoryId'
    `);
    
    if (categoryIdCheck.rows.length > 0) {
      await client.query(`ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey"`);
      await client.query(`ALTER TABLE "Product" DROP COLUMN "categoryId"`);
      console.log('  ✓ Removed categoryId column');
    }
    
    // Remove unused Product columns
    const unusedProductCols = ['isCustomizable', 'material', 'weight', 'fit'];
    for (const col of unusedProductCols) {
      await client.query(`ALTER TABLE "Product" DROP COLUMN IF EXISTS "${col}"`);
    }
    console.log('  ✓ Removed unused columns');
    
    // ========== FIX ORDER TABLE ==========
    console.log('\nFixing Order table...');
    
    // Rename shippingCost to shipping
    const shippingCostCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Order' AND column_name = 'shippingCost'
    `);
    
    if (shippingCostCheck.rows.length > 0) {
      await client.query(`ALTER TABLE "Order" RENAME COLUMN "shippingCost" TO "shipping"`);
      console.log('  ✓ Renamed shippingCost to shipping');
    }
    
    // Add inline shipping address fields
    const shippingFields = [
      'shippingName', 'shippingAddress', 'shippingCity', 
      'shippingState', 'shippingZipCode', 'shippingCountry', 'shippingPhone'
    ];
    
    for (const field of shippingFields) {
      const check = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = '${field}'
      `);
      
      if (check.rows.length === 0) {
        await client.query(`ALTER TABLE "Order" ADD COLUMN "${field}" TEXT DEFAULT ''`);
      }
    }
    console.log('  ✓ Added inline shipping address fields');
    
    // Remove shippingAddressId and other unused fields
    await client.query(`ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_shippingAddressId_fkey"`);
    const unusedOrderCols = ['shippingAddressId', 'discount', 'trackingNumber', 'carrier', 'notes'];
    for (const col of unusedOrderCols) {
      await client.query(`ALTER TABLE "Order" DROP COLUMN IF EXISTS "${col}"`);
    }
    console.log('  ✓ Removed unused order columns');
    
    // Rename payment fields
    const paymentIntentIdCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Order' AND column_name = 'paymentIntentId'
    `);
    
    if (paymentIntentIdCheck.rows.length > 0) {
      await client.query(`ALTER TABLE "Order" RENAME COLUMN "paymentIntentId" TO "paymentId"`);
      console.log('  ✓ Renamed paymentIntentId to paymentId');
    }
    
    // Add payment fields
    const paymentFields = [
      { name: 'paymentDate', type: 'TIMESTAMP(3)' },
      { name: 'paymentHash', type: 'TEXT' }
    ];
    
    for (const field of paymentFields) {
      const check = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'Order' AND column_name = '${field.name}'
      `);
      
      if (check.rows.length === 0) {
        await client.query(`ALTER TABLE "Order" ADD COLUMN "${field.name}" ${field.type}`);
      }
    }
    console.log('  ✓ Added payment fields');
    
    // ========== FIX ORDERITEM TABLE ==========
    console.log('\nFixing OrderItem table...');
    
    // Remove designId column (we use CustomDesign relation instead)
    await client.query(`ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_designId_fkey"`);
    await client.query(`ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "designId"`);
    
    // Remove variantSku column (not in current schema)
    await client.query(`ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "variantSku"`);
    console.log('  ✓ Removed unused OrderItem columns');
    
    // ========== FIX CUSTOMDESIGN TABLE ==========
    console.log('\nFixing CustomDesign table...');
    
    // Drop old CustomDesign table if it exists (wrong structure)
    await client.query(`DROP TABLE IF EXISTS "CustomDesign" CASCADE`);
    
    // Create new CustomDesign table with correct structure
    await client.query(`
      CREATE TABLE IF NOT EXISTS "CustomDesign" (
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
      )
    `);
    
    // Add indexes and constraints
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "CustomDesign_orderItemId_key" ON "CustomDesign"("orderItemId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "CustomDesign_userId_idx" ON "CustomDesign"("userId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "CustomDesign_productId_idx" ON "CustomDesign"("productId")`);
    
    // Add foreign keys
    await client.query(`
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
    `);
    console.log('  ✓ Created CustomDesign table with correct structure');
    
    // ========== DROP UNUSED TABLES ==========
    console.log('\nDropping unused tables...');
    await client.query(`DROP TABLE IF EXISTS "DesignLayer" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "Design" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "CartItem" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "Category" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "Address" CASCADE`);
    console.log('  ✓ Dropped unused tables');
    
    // ========== DROP UNUSED ENUMS ==========
    await client.query(`DROP TYPE IF EXISTS "DesignStatus" CASCADE`);
    await client.query(`DROP TYPE IF EXISTS "LayerType" CASCADE`);
    
    console.log('\n✅ Schema fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

fixSchema();
