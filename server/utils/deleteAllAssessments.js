#!/usr/bin/env node

/**
 * Utility to delete ALL assessments and start fresh
 * Use this to clean slate for testing
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/assessments.json');
const BACKUP_FILE = path.join(__dirname, '../data/assessments.backup.json');

function deleteAllAssessments() {
  try {
    console.log('🗑️  Deleting all assessments...\n');
    
    // Read current data
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const assessmentCount = Object.keys(data).length;
    
    // Create backup before deleting
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2));
    console.log(`💾 Backup created: ${BACKUP_FILE}`);
    console.log(`📦 Backed up ${assessmentCount} assessments\n`);
    
    // Write empty object
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
    
    console.log('✅ All assessments deleted!');
    console.log(`📊 Deleted ${assessmentCount} assessments`);
    console.log(`📁 File: ${DATA_FILE}`);
    console.log(`💾 File size: 0.00 KB`);
    console.log('\n🎯 Ready for fresh start!');
    console.log('\n💡 To restore backup: node server/utils/restoreBackup.js');
    
  } catch (error) {
    console.error('❌ Error deleting assessments:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  console.log('🧹 Starting fresh - deleting all assessments...\n');
  deleteAllAssessments();
}

module.exports = deleteAllAssessments;

