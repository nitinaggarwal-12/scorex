#!/usr/bin/env node

/**
 * Utility to clear cached results from assessments
 * This forces regeneration with fresh Enterprise Platform features
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/assessments.json');

function clearCachedResults() {
  try {
    console.log('📂 Reading assessments file...');
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    let clearedCount = 0;
    
    // Iterate through all assessments
    Object.keys(data).forEach(assessmentId => {
      const assessment = data[assessmentId];
      
      // Remove cached results fields
      const hadCachedData = !!(
        assessment.results ||
        assessment.recommendations ||
        assessment.painPointRecommendations ||
        assessment.prioritizedActions ||
        assessment.editedExecutiveSummary
      );
      
      if (hadCachedData) {
        delete assessment.results;
        delete assessment.recommendations;
        delete assessment.painPointRecommendations;
        delete assessment.prioritizedActions;
        delete assessment.editedExecutiveSummary;
        delete assessment.categoryDetails;
        delete assessment.areaScores;
        
        clearedCount++;
        console.log(`✓ Cleared cache for assessment: ${assessment.assessmentName || assessmentId}`);
      }
    });
    
    // Write back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    console.log('\n✅ Cache clearing complete!');
    console.log(`📊 Cleared ${clearedCount} assessments`);
    console.log(`📁 File: ${DATA_FILE}`);
    console.log('\n💡 Next time you view results, they will be regenerated with Enterprise Platform features!');
    
  } catch (error) {
    console.error('❌ Error clearing cached results:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  console.log('🧹 Clearing cached assessment results...\n');
  clearCachedResults();
}

module.exports = clearCachedResults;

