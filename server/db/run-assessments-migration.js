require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runMigration() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('Please set DATABASE_URL in your .env file');
    process.exit(1);
  }

  console.log('🔄 Connecting to PostgreSQL...');
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');

    // Read and execute migration file
    const migrationPath = path.join(__dirname, 'migrations', '007_assessments_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Running assessments table migration...');
    await pool.query(migrationSQL);
    console.log('✅ Assessments table migration completed successfully!');

    // Verify table was created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'assessments'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Assessments table verified in database');
      
      // Show table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'assessments' 
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Assessments table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
      });
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();


