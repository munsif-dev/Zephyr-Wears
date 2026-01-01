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
    console.log('🔧 Fixing database schema...');
    
    // Check if category column exists
    const categoryCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'category'
    `);
    
    if (categoryCheck.rows.length === 0) {
      console.log('Adding category column...');
      
      // Add category column
      await client.query(`
        ALTER TABLE "Product" 
        ADD COLUMN "category" TEXT DEFAULT 'unisex'
      `);
      
      // Set NOT NULL after adding default values
      await client.query(`
        UPDATE "Product" SET "category" = 'unisex' WHERE "category" IS NULL
      `);
      
      await client.query(`
        ALTER TABLE "Product" 
        ALTER COLUMN "category" SET NOT NULL
      `);
      
      console.log('✓ Category column added');
    } else {
      console.log('✓ Category column already exists');
    }
    
    // Check if categoryId column exists and drop it
    const categoryIdCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'categoryId'
    `);
    
    if (categoryIdCheck.rows.length > 0) {
      console.log('Removing categoryId column...');
      
      // Drop foreign key constraint first if it exists
      await client.query(`
        ALTER TABLE "Product" 
        DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey"
      `);
      
      await client.query(`
        ALTER TABLE "Product" 
        DROP COLUMN "categoryId"
      `);
      
      console.log('✓ CategoryId column removed');
    } else {
      console.log('✓ CategoryId column already removed');
    }
    
    // Create index on category if it doesn't exist
    const indexCheck = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'Product' AND indexname = 'Product_category_idx'
    `);
    
    if (indexCheck.rows.length === 0) {
      console.log('Creating index on category...');
      await client.query(`
        CREATE INDEX "Product_category_idx" ON "Product"("category")
      `);
      console.log('✓ Index created');
    } else {
      console.log('✓ Index already exists');
    }
    
    console.log('✅ Schema fixed successfully');
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

fixSchema();
