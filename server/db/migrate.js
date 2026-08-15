/**
 * Migration Script: File-based Storage → PostgreSQL
 * Run this to import existing assessments.json data into PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const db = require('./connection');
const assessmentRepo = require('./assessmentRepository');

async function migrate() {
  try {
    console.log('🚀 Starting migration from file-based storage to PostgreSQL...\n');

    // Initialize database connection
    const connected = await db.initialize();
    if (!connected) {
      console.error('❌ Could not connect to database. Migration aborted.');
      process.exit(1);
    }

    // Check if we have existing data in PostgreSQL
    const existingCount = await assessmentRepo.count();
    console.log(`📊 Current database has ${existingCount} assessments`);

    // Find the assessments.json file
    const dataDir = process.env.DATA_DIR || path.join(__dirname, '../data');
    const jsonPath = path.join(dataDir, 'assessments.json');

    if (!fs.existsSync(jsonPath)) {
      console.log('📝 No assessments.json file found - nothing to migrate');
      console.log('✅ Database is ready for new assessments');
      await db.close();
      return;
    }

    // Read existing JSON data
    console.log(`📂 Reading data from: ${jsonPath}`);
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const assessmentIds = Object.keys(jsonData);
    console.log(`📋 Found ${assessmentIds.length} assessments in JSON file\n`);

    if (assessmentIds.length === 0) {
      console.log('✅ No assessments to migrate');
      await db.close();
      return;
    }

    // Migrate each assessment
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const id of assessmentIds) {
      const assessment = jsonData[id];
      
      try {
        // Check if assessment already exists in database
        const exists = await assessmentRepo.exists(id);
        
        if (exists) {
          console.log(`⏭️  Skipping ${assessment.assessmentName || id} (already in database)`);
          skipCount++;
          continue;
        }

        // Insert into database
        await assessmentRepo.create(assessment);
        console.log(`✅ Migrated: ${assessment.assessmentName || id}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error migrating ${id}:`, error.message);
        errorCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped (already exist): ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📈 Total in database: ${existingCount + successCount}`);
    console.log('='.repeat(60));

    // Create backup of JSON file
    const backupPath = jsonPath + `.backup-${Date.now()}`;
    fs.copyFileSync(jsonPath, backupPath);
    console.log(`\n💾 Created backup: ${backupPath}`);
    console.log('ℹ️  You can safely delete the JSON file after verifying data in PostgreSQL');

    await db.close();
    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = migrate;






