#!/usr/bin/env node
/**
 * Generate comprehensive pain point mappings for ALL 442 pain points in the framework
 * This ensures every pain point can return relevant Databricks features
 */

const framework = require('../data/assessmentFramework');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating comprehensive pain point mappings...');

// Extract ALL pain points from framework
const allPainPoints = [];
const painPointsByPillar = {};

framework.assessmentAreas.forEach(area => {
  painPointsByPillar[area.id] = new Set();
  
  area.dimensions.forEach(dim => {
    dim.questions.forEach(q => {
      q.perspectives.forEach(p => {
        if (p.id === 'technical_pain' || p.id === 'business_pain') {
          p.options.forEach(opt => {
            allPainPoints.push({
              value: opt.value,
              label: opt.label,
              pillar: area.id
            });
            painPointsByPillar[area.id].add(opt.value);
          });
        }
      });
    });
  });
});

console.log(`✅ Found ${allPainPoints.length} total pain points`);
console.log(`✅ Unique pain points: ${new Set(allPainPoints.map(p => p.value)).size}`);

// Pillar-to-feature category mapping
const pillarFeatureMapping = {
  'platform_governance': ['platform', 'governance', 'data-governance'],
  'data_engineering': ['data-engineering', 'etl-elt', 'orchestration'],
  'analytics_bi': ['analytics', 'bi', 'sql', 'visualization'],
  'machine_learning': ['machine-learning', 'mlops', 'feature-engineering'],
  'generative_ai': ['generative-ai', 'llm', 'vector-search'],
  'operational_excellence': ['collaboration', 'cost-optimization', 'monitoring']
};

// Generate SQL for each pain point
let sql = `-- ============================================================================\n`;
sql += `-- COMPREHENSIVE PAIN POINT MAPPINGS - ALL 442 PAIN POINTS\n`;
sql += `-- Generated: ${new Date().toISOString()}\n`;
sql += `-- ============================================================================\n\n`;

let mappingCount = 0;

Object.keys(painPointsByPillar).forEach(pillar => {
  const painPoints = Array.from(painPointsByPillar[pillar]);
  const categories = pillarFeatureMapping[pillar] || [];
  
  sql += `\n-- ${pillar.toUpperCase()} (${painPoints.length} pain points)\n`;
  sql += `-- ============================================================================\n\n`;
  
  painPoints.forEach(painPoint => {
    // For each pain point, map to relevant features from that pillar
    categories.forEach(category => {
      sql += `-- Map ${painPoint} to ${category} features\n`;
      sql += `INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)\n`;
      sql += `SELECT \n`;
      sql += `  f.id,\n`;
      sql += `  '${painPoint}',\n`;
      sql += `  '${pillar}',\n`;
      sql += `  'Address ${painPoint.replace(/_/g, ' ')} with ' || f.name || ' - ' || f.short_description\n`;
      sql += `FROM databricks_features f\n`;
      sql += `WHERE f.category = '${category}'\n`;
      sql += `  AND f.ga_status IN ('GA', 'Public Preview')\n`;
      sql += `LIMIT 2  -- Top 2 features per category per pain point\n`;
      sql += `ON CONFLICT (feature_id, pain_point_value) DO NOTHING;\n\n`;
      
      mappingCount++;
    });
  });
});

sql += `-- ============================================================================\n`;
sql += `-- Total mappings generated: ${mappingCount}\n`;
sql += `-- ============================================================================\n`;

// Write to migration file
const migrationFile = path.join(__dirname, '../migrations/006_all_pain_points_mapped.sql');
fs.writeFileSync(migrationFile, sql);

console.log(`\n✅ Generated ${mappingCount} mapping INSERT statements`);
console.log(`✅ Written to: ${migrationFile}`);
console.log(`\n🚀 Run this migration to fix the identical reports bug!`);
console.log(`   node server/scripts/setupDatabase.js`);






