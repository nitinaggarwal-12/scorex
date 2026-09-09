#!/usr/bin/env node
/**
 * ScoreX Production Migration Runner
 * Safely executes all SQL schema migrations from server/db/migrations/ in sequential order,
 * tracking applied migrations in the schema_migrations ledger.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables if available
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const { Pool } = require('pg');

async function runMigrations() {
  console.log('🚀 [ScoreX Migrator] Starting database migration runner...\n');

  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  [ScoreX Migrator] DATABASE_URL is not set. Skipping migrations.');
    process.exit(0);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as db_time, current_database() as db_name');
    client.release();
    console.log(`✅ Connected to database "${result.rows[0].db_name}" (Server time: ${result.rows[0].db_time})\n`);

    // Ensure schema_migrations tracking table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fetch already executed migrations
    const executedRes = await pool.query('SELECT filename FROM schema_migrations');
    const executedSet = new Set(executedRes.rows.map(r => r.filename));

    // Discover migration files
    const migrationsDir = path.join(__dirname, 'db', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ Migrations directory not found:', migrationsDir);
      process.exit(1);
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql') && !f.includes('.bak'))
      .sort();

    console.log(`📋 Discovered ${files.length} migration file(s) in server/db/migrations/\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const file of files) {
      if (executedSet.has(file)) {
        console.log(`  ⏭️  ${file} (already recorded in schema_migrations)`);
        skipCount++;
        continue;
      }

      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      try {
        console.log(`  🔄 Applying: ${file}...`);
        await pool.query(migrationSQL);
        await pool.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          [file]
        );
        console.log(`  ✅ ${file} (applied successfully)\n`);
        successCount++;
      } catch (err) {
        // If already exists or duplicate, mark as executed and proceed
        if (
          err.message.includes('already exists') ||
          err.message.includes('duplicate') ||
          err.code === '42P07' ||
          err.code === '42710' ||
          err.code === '42701'
        ) {
          console.log(`  ⏭️  ${file} (objects already exist - recording in schema_migrations)\n`);
          await pool.query(
            'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
            [file]
          ).catch(() => {});
          skipCount++;
        } else {
          console.error(`  ❌ ${file} ERROR: ${err.message}\n`);
          errorCount++;
        }
      }
    }

    console.log('='.repeat(60));
    console.log('📊 MIGRATION EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Applied newly:   ${successCount}`);
    console.log(`⏭️  Already present: ${skipCount}`);
    console.log(`❌ Failed:          ${errorCount}`);
    console.log('='.repeat(60));

    await pool.end();

    if (errorCount > 0) {
      console.warn('\n⚠️ Some migrations encountered errors. Please review the log above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All database migrations verified and up to date!');
      process.exit(0);
    }
  } catch (err) {
    console.error('\n❌ Database migration connection failed:', err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
