require('dotenv').config();
const db = require('./connection');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🚀 Starting user management migration...');
    
    // Initialize database connection
    const initialized = await db.initialize();
    
    if (!initialized) {
      console.error('❌ Database initialization failed');
      process.exit(1);
    }
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '006_user_management.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    console.log('📝 Executing migration...');
    await db.query(migration);
    
    console.log('✅ User management migration completed successfully');
    console.log('📊 New tables created:');
    console.log('   - users');
    console.log('   - assessment_assignments');
    console.log('   - notifications');
    console.log('   - sessions');
    
    // Close database connection
    await db.close();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await db.close();
    process.exit(1);
  }
}

runMigration();

