#!/usr/bin/env node
/**
 * Point-in-Time Snapshot Restore CLI for ScoreX Data Store
 * Usage:
 *   node server/scripts/restoreSnapshot.js list
 *   node server/scripts/restoreSnapshot.js restore <snapshot_filename>
 */
const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(__dirname, '../../data/snapshots');
const DATA_DIR = path.join(__dirname, '../../data');

const action = process.argv[2] || 'list';
const targetSnapshot = process.argv[3];

if (!fs.existsSync(SNAPSHOT_DIR)) {
  console.log('❌ No snapshots directory found at:', SNAPSHOT_DIR);
  process.exit(1);
}

if (action === 'list') {
  console.log('\n🗄️ Available Point-in-Time Database Snapshots:\n');
  const files = fs.readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.json')).sort().reverse();
  if (files.length === 0) {
    console.log('  No snapshots available yet.');
  } else {
    files.forEach((file, idx) => {
      const fullPath = path.join(SNAPSHOT_DIR, file);
      const stat = fs.statSync(fullPath);
      const sizeKb = (stat.size / 1024).toFixed(1);
      console.log(`  [${idx + 1}] ${file} (${sizeKb} KB) - ${stat.mtime.toLocaleString()}`);
    });
  }
  console.log('\nTo restore a snapshot, run:');
  console.log('  node server/scripts/restoreSnapshot.js restore <snapshot_filename>\n');
  process.exit(0);
}

if (action === 'restore') {
  if (!targetSnapshot) {
    console.error('❌ Please specify a snapshot file to restore:');
    console.error('   node server/scripts/restoreSnapshot.js restore <snapshot_filename>');
    process.exit(1);
  }

  const snapshotPath = path.join(SNAPSHOT_DIR, targetSnapshot);
  if (!fs.existsSync(snapshotPath)) {
    console.error(`❌ Snapshot file not found: ${snapshotPath}`);
    process.exit(1);
  }

  // Determine target data file from snapshot prefix
  let targetDataFile = 'dynamic_assessments.json';
  if (targetSnapshot.startsWith('custom_assessment_types')) {
    targetDataFile = 'custom_assessment_types.json';
  } else if (targetSnapshot.startsWith('assessments')) {
    targetDataFile = 'assessments.json';
  }

  const destinationPath = path.join(DATA_DIR, targetDataFile);
  const backupPath = destinationPath + '.pre_restore_backup';

  try {
    if (fs.existsSync(destinationPath)) {
      fs.copyFileSync(destinationPath, backupPath);
      console.log(`💾 Created pre-restore backup at: ${backupPath}`);
    }

    fs.copyFileSync(snapshotPath, destinationPath);
    console.log(`✅ SUCCESS: Restored database state from snapshot:\n   ${snapshotPath}\n   ➔ ${destinationPath}\n`);
  } catch (err) {
    console.error('❌ Failed to restore snapshot:', err);
    process.exit(1);
  }
}
