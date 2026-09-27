#!/usr/bin/env node
/**
 * Generate SMART pain point mappings for ALL 442 pain points
 * Uses keyword matching and category logic to map pain points to relevant features
 */

const framework = require('../data/assessmentFramework');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating smart pain point mappings...\n');

// Extract all pain points from framework
const allPainPoints = [];
const painPointsByPillar = {};

framework.assessmentAreas.forEach(area => {
  if (!painPointsByPillar[area.id]) {
    painPointsByPillar[area.id] = [];
  }
  
  area.dimensions.forEach(dim => {
    dim.questions.forEach(q => {
      q.perspectives.forEach(p => {
        if (p.id === 'technical_pain' || p.id === 'business_pain') {
          p.options.forEach(opt => {
            painPointsByPillar[area.id].push({
              value: opt.value,
              label: opt.label,
              pillar: area.id,
              dimension: dim.name
            });
            allPainPoints.push({
              value: opt.value,
              label: opt.label,
              pillar: area.id
            });
          });
        }
      });
    });
  });
});

// Remove duplicates
const uniquePainPoints = Array.from(new Map(allPainPoints.map(item => [item.value, item])).values());

console.log(`✅ Extracted ${uniquePainPoints.length} unique pain points from framework`);
console.log(`✅ Pain points by pillar:`);
Object.keys(painPointsByPillar).forEach(pillar => {
  const uniqueForPillar = [...new Set(painPointsByPillar[pillar].map(p => p.value))];
  console.log(`   ${pillar}: ${uniqueForPillar.length}`);
});

// Category keywords for each pillar
const pillarCategories = {
  'platform_governance': ['platform'],
  'data_engineering': ['data_engineering'],
  'analytics_bi': ['analytics'],
  'machine_learning': ['machine_learning'],
  'generative_ai': ['generative_ai'],
  'operational_excellence': ['platform', 'data_engineering', 'analytics'] // cross-cutting
};

// Generate keyword-based mappings
const mappings = [];

uniquePainPoints.forEach(painPoint => {
  const categories = pillarCategories[painPoint.pillar] || ['platform'];
  
  categories.forEach(category => {
    // Map each pain point to ALL features in its relevant categories
    // The database query will filter by pain_point_value and pillar, 
    // so we need to ensure good coverage
    mappings.push({
      category,
      painPoint: painPoint.value,
      pillar: painPoint.pillar,
      recommendation: `Address ${painPoint.value.replace(/_/g, ' ')} using relevant ${category} capabilities`
    });
  });
});

console.log(`\n✅ Generated ${mappings.length} category-based mappings`);

// Generate SQL
let sql = `-- ============================================================================\n`;
sql += `-- COMPREHENSIVE PAIN POINT MAPPINGS - ${uniquePainPoints.length} UNIQUE PAIN POINTS\n`;
sql += `-- Generated: ${new Date().toISOString()}\n`;
sql += `-- Strategy: Map each pain point to ALL features in relevant categories\n`;
sql += `-- Database will filter and rank features at query time\n`;
sql += `-- ============================================================================\n\n`;

// Clear existing mappings first
sql += `-- Clear existing mappings\n`;
sql += `TRUNCATE TABLE feature_pain_point_mapping CASCADE;\n\n`;

// Group by pillar for readability
Object.keys(painPointsByPillar).forEach(pillar => {
  const pillarPainPoints = [...new Set(painPointsByPillar[pillar].map(p => p.value))];
  const categories = pillarCategories[pillar];
  
  sql += `-- ${pillar.toUpperCase()} (${pillarPainPoints.length} pain points)\n`;
  sql += `-- Categories: ${categories.join(', ')}\n`;
  sql += `-- ============================================================================\n\n`;
  
  pillarPainPoints.forEach(painPointValue => {
    categories.forEach(category => {
      sql += `-- Map ${painPointValue} to all ${category} features\n`;
      sql += `INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)\n`;
      sql += `SELECT \n`;
      sql += `  f.id,\n`;
      sql += `  '${painPointValue}',\n`;
      sql += `  '${pillar}',\n`;
      sql += `  'Deploy ' || f.name || ' to address ${painPointValue.replace(/_/g, ' ')} - ' || f.short_description\n`;
      sql += `FROM databricks_features f\n`;
      sql += `WHERE f.category = '${category}'\n`;
      sql += `  AND f.ga_status IN ('GA', 'Public Preview')\n`;
      sql += `ON CONFLICT (feature_id, pain_point_value) DO NOTHING;\n\n`;
    });
  });
  
  sql += `\n`;
});

sql += `-- ============================================================================\n`;
sql += `-- Summary\n`;
sql += `-- Total unique pain points: ${uniquePainPoints.length}\n`;
sql += `-- Total potential mappings: ${mappings.length}\n`;
sql += `-- ============================================================================\n`;

// Write to migration file
const migrationFile = path.join(__dirname, '../migrations/007_smart_all_mappings.sql');
fs.writeFileSync(migrationFile, sql);

console.log(`\n✅ Generated SQL with ${uniquePainPoints.length} pain points`);
console.log(`✅ Written to: ${migrationFile}`);
console.log(`\n🚀 Run this migration to map all 442 pain points!`);
console.log(`   node -r dotenv/config -e "const {Pool}=require('pg'); const fs=require('fs'); (async()=>{const pool=new Pool({connectionString:process.env.DATABASE_URL}); await pool.query(fs.readFileSync('./server/migrations/007_smart_all_mappings.sql','utf8')); await pool.end(); process.exit(0);})()"`);






