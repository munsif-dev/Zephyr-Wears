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

async function checkSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking database schema...\n');
    
    // Check Product table columns
    const productColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Product'
      ORDER BY ordinal_position
    `);
    
    console.log('Product table columns:');
    productColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    console.log('\n');
    
    // Check Order table columns
    const orderColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Order'
      ORDER BY ordinal_position
    `);
    
    console.log('Order table columns:');
    orderColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    console.log('\n');
    
    // Check ProductVariant table columns
    const variantColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'ProductVariant'
      ORDER BY ordinal_position
    `);
    
    console.log('ProductVariant table columns:');
    variantColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
