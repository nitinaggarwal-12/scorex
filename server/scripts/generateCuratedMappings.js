#!/usr/bin/env node
/**
 * Generate CURATED, SPECIFIC pain point → feature mappings
 * Uses semantic keyword matching to create meaningful connections
 * 
 * Strategy:
 * - Extract keywords from pain point names/labels
 * - Match against feature names/descriptions
 * - Only map when there's semantic relevance
 * - Limit to 2-5 features per pain point (most relevant)
 */

const framework = require('../data/assessmentFramework');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

console.log('🎯 Generating CURATED pain point mappings...\n');

// Extract all pain points with metadata
const allPainPoints = [];
framework.assessmentAreas.forEach(area => {
  area.dimensions.forEach(dim => {
    dim.questions.forEach(q => {
      q.perspectives.forEach(p => {
        if (p.id === 'technical_pain' || p.id === 'business_pain') {
          p.options.forEach(opt => {
            allPainPoints.push({
              value: opt.value,
              label: opt.label,
              pillar: area.id,
              dimension: dim.name,
              keywords: extractKeywords(opt.value, opt.label)
            });
          });
        }
      });
    });
  });
});

// Remove duplicates by value
const uniquePainPoints = Array.from(
  new Map(allPainPoints.map(item => [item.value, item])).values()
);

console.log(`✅ Extracted ${uniquePainPoints.length} unique pain points\n`);

/**
 * Extract meaningful keywords from pain point
 */
function extractKeywords(value, label) {
  const keywords = new Set();
  
  // Add words from value
  value.split('_').forEach(word => {
    if (word.length > 2) keywords.add(word.toLowerCase());
  });
  
  // Add significant words from label
  label.toLowerCase().split(/\s+/).forEach(word => {
    // Filter out common words
    const stopWords = ['the', 'and', 'for', 'with', 'from', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'but', 'not', 'can', 'will'];
    if (word.length > 3 && !stopWords.includes(word)) {
      keywords.add(word.replace(/[^a-z]/g, ''));
    }
  });
  
  return Array.from(keywords);
}

/**
 * Calculate relevance score between pain point and feature
 */
function calculateRelevance(painPoint, feature) {
  let score = 0;
  
  const featureText = `${feature.name} ${feature.description}`.toLowerCase();
  
  // Check each keyword
  painPoint.keywords.forEach(keyword => {
    if (featureText.includes(keyword)) {
      score += 2; // Exact match
    } else {
      // Fuzzy match (substring)
      const fuzzyMatches = painPoint.keywords.filter(k => 
        featureText.includes(k.substring(0, Math.max(4, k.length - 2)))
      );
      if (fuzzyMatches.length > 0) {
        score += 1;
      }
    }
  });
  
  // Bonus for category match
  const categoryKeywords = {
    'platform': ['platform', 'infrastructure', 'compute', 'runtime', 'cluster', 'security', 'governance', 'access', 'audit', 'compliance'],
    'data_engineering': ['pipeline', 'etl', 'delta', 'stream', 'ingestion', 'data', 'quality', 'orchestration', 'workflow'],
    'analytics': ['query', 'sql', 'dashboard', 'warehouse', 'analytics', 'bi', 'reporting'],
    'machine_learning': ['ml', 'model', 'feature', 'training', 'inference', 'mlflow', 'experiment'],
    'generative_ai': ['llm', 'genai', 'ai', 'agent', 'rag', 'vector', 'embedding', 'prompt']
  };
  
  const categoryWords = categoryKeywords[feature.category] || [];
  painPoint.keywords.forEach(keyword => {
    if (categoryWords.some(cw => keyword.includes(cw) || cw.includes(keyword))) {
      score += 1;
    }
  });
  
  return score;
}

(async () => {
  try {
    // Fetch all features from database
    const featuresResult = await pool.query(`
      SELECT id, name, category, short_description as description, ga_status
      FROM databricks_features
      WHERE ga_status IN ('GA', 'Public Preview')
      ORDER BY category, name
    `);
    
    const features = featuresResult.rows;
    console.log(`✅ Loaded ${features.length} features from database\n`);
    
    // Clear existing mappings
    await pool.query('TRUNCATE TABLE feature_pain_point_mapping CASCADE');
    console.log('🗑️  Cleared existing mappings\n');
    
    // Generate curated mappings
    let totalMappings = 0;
    const mappingsByPillar = {};
    
    for (const painPoint of uniquePainPoints) {
      // Calculate relevance scores for all features
      const scoredFeatures = features.map(feature => ({
        feature,
        score: calculateRelevance(painPoint, feature)
      })).filter(sf => sf.score > 0); // Only keep relevant features
      
      // Sort by score and take top 3-5
      scoredFeatures.sort((a, b) => b.score - a.score);
      const topFeatures = scoredFeatures.slice(0, 5);
      
      if (topFeatures.length > 0) {
        if (!mappingsByPillar[painPoint.pillar]) {
          mappingsByPillar[painPoint.pillar] = 0;
        }
        
        // Insert mappings
        for (const { feature, score } of topFeatures) {
          const recText = `Deploy ${feature.name} to address ${painPoint.label.toLowerCase()} (relevance: ${score})`;
          
          await pool.query(`
            INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (feature_id, pain_point_value) DO NOTHING
          `, [feature.id, painPoint.value, painPoint.pillar, recText]);
          
          totalMappings++;
          mappingsByPillar[painPoint.pillar]++;
        }
        
        console.log(`✓ ${painPoint.value}: ${topFeatures.length} features (top: ${topFeatures[0].feature.name}, score: ${topFeatures[0].score})`);
      } else {
        console.log(`⚠ ${painPoint.value}: No relevant features found`);
      }
    }
    
    console.log(`\n${'='.repeat(80)}`);
    console.log('✅ CURATED MAPPINGS COMPLETE');
    console.log(`${'='.repeat(80)}`);
    console.log(`Total mappings created: ${totalMappings}`);
    console.log(`Pain points mapped: ${uniquePainPoints.length}`);
    console.log(`Average features per pain point: ${(totalMappings / uniquePainPoints.length).toFixed(1)}`);
    console.log(`\nBy pillar:`);
    Object.keys(mappingsByPillar).forEach(pillar => {
      console.log(`  ${pillar}: ${mappingsByPillar[pillar]} mappings`);
    });
    
    // Verify
    const verifyResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT pain_point_value) as unique_pain_points,
        COUNT(*) as total_mappings,
        AVG(feature_count) as avg_features_per_pain_point
      FROM (
        SELECT pain_point_value, COUNT(*) as feature_count
        FROM feature_pain_point_mapping
        GROUP BY pain_point_value
      ) subq
    `);
    
    console.log(`\n📊 Verification:`);
    console.log(`   Unique pain points mapped: ${verifyResult.rows[0].unique_pain_points}`);
    console.log(`   Total mappings: ${verifyResult.rows[0].total_mappings}`);
    console.log(`   Avg features per pain point: ${parseFloat(verifyResult.rows[0].avg_features_per_pain_point).toFixed(2)}`);
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await pool.end();
    process.exit(1);
  }
})();






