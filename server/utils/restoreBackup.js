#!/usr/bin/env node

/**
 * Utility to restore assessments from backup
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/assessments.json');
const BACKUP_FILE = path.join(__dirname, '../data/assessments.backup.json');

function restoreBackup() {
  try {
    console.log('📦 Restoring from backup...\n');
    
    if (!fs.existsSync(BACKUP_FILE)) {
      console.error('❌ No backup file found!');
      console.error(`📁 Looking for: ${BACKUP_FILE}`);
      process.exit(1);
    }
    
    // Read backup
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
    const assessmentCount = Object.keys(backup).length;
    
    // Restore to data file
    fs.writeFileSync(DATA_FILE, JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup restored successfully!');
    console.log(`📊 Restored ${assessmentCount} assessments`);
    console.log(`📁 File: ${DATA_FILE}`);
    console.log('\n🎯 Assessments restored!');
    
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  restoreBackup();
}

module.exports = restoreBackup;

