const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrateAssessments() {
  try {
    console.log('🔄 Starting migration from file storage to PostgreSQL...\n');
    
    // Read assessments from file storage
    const dataFilePath = path.join(__dirname, 'server/data/assessments.json');
    console.log(`📁 Reading from: ${dataFilePath}`);
    
    if (!fs.existsSync(dataFilePath)) {
      console.log('❌ File storage not found');
      return;
    }
    
    // The file is a flat object with assessment IDs as keys
    const assessments = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const assessmentCount = Object.keys(assessments).length;
    
    console.log(`📊 Found ${assessmentCount} assessments in file storage\n`);
    
    if (assessmentCount === 0) {
      console.log('✅ No assessments to migrate');
      return;
    }
    
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const [id, assessment] of Object.entries(assessments)) {
      try {
        // Check if already exists in PostgreSQL
        const checkQuery = 'SELECT id FROM assessments WHERE id = $1';
        const existing = await pool.query(checkQuery, [id]);
        
        if (existing.rows.length > 0) {
          console.log(`⏭️  Skipping ${assessment.assessmentName || id.substring(0, 8)} (already in PostgreSQL)`);
          skipped++;
          continue;
        }
        
        // Calculate progress if not set
        const completedCount = (assessment.completedCategories || []).length;
        const progress = assessment.progress || Math.round((completedCount / 6) * 100);
        
        // Insert into PostgreSQL
        const insertQuery = `
          INSERT INTO assessments (
            id, user_id, assessment_name, assessment_description, 
            organization_name, contact_email, industry, 
            status, progress, current_category,
            completed_categories, responses, edit_history,
            started_at, completed_at, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `;
        
        const values = [
          id,
          1, // Default to admin user
          assessment.assessmentName || 'Untitled Assessment',
          assessment.assessmentDescription || '',
          assessment.organizationName || '',
          assessment.contactEmail || '',
          assessment.industry || '',
          assessment.status || (completedCount === 6 ? 'completed' : 'in_progress'),
          progress,
          assessment.currentCategory || null,
          JSON.stringify(assessment.completedCategories || []),
          JSON.stringify(assessment.responses || {}),
          JSON.stringify(assessment.editHistory || []),
          assessment.startedAt || assessment.createdAt || new Date().toISOString(),
          assessment.completedAt || null,
          assessment.createdAt || assessment.startedAt || new Date().toISOString(),
          assessment.updatedAt || assessment.lastModified || new Date().toISOString()
        ];
        
        await pool.query(insertQuery, values);
        console.log(`✅ Migrated: ${assessment.assessmentName || assessment.organizationName || id.substring(0, 8)} (${progress}%)`);
        migrated++;
        
      } catch (err) {
        console.error(`❌ Error migrating ${id}:`, err.message);
        errors++;
      }
    }
    
    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total: ${assessmentCount}`);
    
    // Show final count in PostgreSQL
    const countResult = await pool.query('SELECT COUNT(*) as count FROM assessments');
    console.log(`\n✅ PostgreSQL now contains ${countResult.rows[0].count} assessments`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrateAssessments();
