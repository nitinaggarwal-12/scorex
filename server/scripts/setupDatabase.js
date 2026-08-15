/**
 * Database Setup Script
 * 
 * Initializes PostgreSQL database with Enterprise Platform features schema and seed data
 * Source: Official Enterprise Platform release notes
 */

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigration(migrationFile) {
  try {
    console.log(`\n📄 Running migration: ${migrationFile}`);
    
    const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
    const sql = await fs.readFile(migrationPath, 'utf8');
    
    await pool.query(sql);
    
    console.log(`✅ Migration completed: ${migrationFile}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${migrationFile}`);
    console.error(error.message);
    throw error;
  }
}

async function checkDatabaseExists() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = 'platform_features'
    `);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking database:', error.message);
    return false;
  }
}

async function getFeatureCount() {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM platform_features');
    return parseInt(result.rows[0].count);
  } catch (error) {
    return 0;
  }
}

async function setupDatabase() {
  console.log('🚀 Enterprise Platform Feature Database Setup\n');
  console.log('================================================');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
    console.log('\nPlease set DATABASE_URL in your .env file:');
    console.log('DATABASE_URL=postgresql://user:password@host:port/database');
    process.exit(1);
  }
  
  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');
    
    // Check if tables exist
    const exists = await checkDatabaseExists();
    
    if (exists) {
      const count = await getFeatureCount();
      console.log(`⚠️  Database already initialized with ${count} features\n`);
      console.log('Options:');
      console.log('  1. Skip setup (tables already exist)');
      console.log('  2. Run migrations anyway (will error if tables exist)');
      console.log('  3. Drop tables and recreate (⚠️  DESTRUCTIVE)\n');
      
      // For automated setup, just skip
      console.log('Skipping setup - database already initialized');
      await pool.end();
      return;
    }
    
    // Run migrations
    console.log('📦 Running database migrations...\n');
    
    await runMigration('001_platform_features.sql');
    await runMigration('002_seed_platform_features.sql');
    await runMigration('003_comprehensive_features_seed.sql');
    
    // Verify setup
    const finalCount = await getFeatureCount();
    console.log('\n================================================');
    console.log('✅ DATABASE SETUP COMPLETE!\n');
    console.log(`📊 Total features loaded: ${finalCount}`);
    console.log('🎉 Ready to generate dynamic recommendations\n');
    
  } catch (error) {
    console.error('\n❌ DATABASE SETUP FAILED');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if executed directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };

