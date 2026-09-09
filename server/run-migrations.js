#!/usr/bin/env node
/**
 * Manual Migration Runner
 * Run this script to manually execute database migrations
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runMigrations() {
  console.log('🚀 Starting manual migration runner...\n');

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Test connection
    console.log('🔌 Connecting to database...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log(`✅ Connected! Database time: ${result.rows[0].now}\n`);

    // Get migration files
    const migrationsDir = path.join(__dirname, 'db', 'migrations');
    console.log(`📂 Looking for migrations in: ${migrationsDir}\n`);

    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ Migrations directory not found!');
      process.exit(1);
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql') && !f.includes('.bak'))
      .sort();

    console.log(`📋 Found ${files.length} migration file(s):\n`);

    for (const file of files) {
      console.log(`   • ${file}`);
    }
    console.log('');

    // Run each migration
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const file of files) {
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      try {
        console.log(`🔄 Running: ${file}`);
        await pool.query(migrationSQL);
        console.log(`✅ ${file} - SUCCESS\n`);
        successCount++;
      } catch (error) {
        // If error is "already exists", it's okay - migration was already run
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.code === '42P07' || // relation already exists
            error.code === '42710') { // duplicate object
          console.log(`⏭️  ${file} - ALREADY APPLIED\n`);
          skipCount++;
        } else {
          console.error(`❌ ${file} - ERROR:`);
          console.error(`   ${error.message}\n`);
          errorCount++;
        }
      }
    }

    // Summary
    console.log('='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully applied: ${successCount}`);
    console.log(`⏭️  Already applied:     ${skipCount}`);
    console.log(`❌ Errors:              ${errorCount}`);
    console.log('='.repeat(60));

    await pool.end();
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some migrations failed. Please review the errors above.');
      process.exit(1);
    } else {
      console.log('\n✅ All migrations completed successfully!');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    await pool.end();
    process.exit(1);
  }
}

// Run migrations
runMigrations();
