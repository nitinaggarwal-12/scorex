#!/usr/bin/env node
/**
 * Sync Local Database to Railway
 * 
 * This script:
 * 1. Reads exported CSV files from local database
 * 2. Connects to Railway PostgreSQL
 * 3. Imports assessments (skipping duplicates)
 * 4. Creates user_assignments for assessments with user_id
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const csv = require('csv-parse/sync');

// Railway DATABASE_URL should be in environment
const DATABASE_URL = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: RAILWAY_DATABASE_URL or DATABASE_URL not set');
  console.error('');
  console.error('Please set it like this:');
  console.error('  export RAILWAY_DATABASE_URL="postgresql://user:pass@host:port/db"');
  console.error('');
  console.error('You can get this from Railway dashboard → Your Service → Variables tab');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('🚀 Starting database sync to Railway...\n');

  try {
    // Test connection
    console.log('🔌 Testing Railway connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT COUNT(*) as count FROM assessments');
    console.log(\`✅ Connected! Railway currently has \${result.rows[0].count} assessments\n\`);
    client.release();

    // Read exported data
    console.log('📖 Reading local export files...');
    const usersCSV = fs.readFileSync(path.join(__dirname, 'users_export.csv'), 'utf8');
    const assessmentsCSV = fs.readFileSync(path.join(__dirname, 'assessments_export.csv'), 'utf8');
    
    const users = csv.parse(usersCSV, { columns: true });
    const assessments = csv.parse(assessmentsCSV, { columns: true });
    
    console.log(\`✅ Found \${users.length} users and \${assessments.length} assessments\n\`);

    // Import users first (in case Railway is missing some)
    console.log('👥 Syncing users...');
    let usersImported = 0;
    let usersSkipped = 0;
    
    for (const user of users) {
      try {
        await pool.query(\`
          INSERT INTO users (id, email, password_hash, first_name, last_name, organization, role, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (email) DO NOTHING
        \`, [
          user.id,
          user.email,
          user.password_hash,
          user.first_name,
          user.last_name,
          user.organization,
          user.role,
          user.is_active === 't' || user.is_active === 'true',
          user.created_at,
          user.updated_at
        ]);
        usersImported++;
      } catch (err) {
        if (err.code === '23505') { // Duplicate key
          usersSkipped++;
        } else {
          console.error(\`⚠️  Error importing user \${user.email}:\`, err.message);
        }
      }
    }
    console.log(\`✅ Users: \${usersImported} imported, \${usersSkipped} already existed\n\`);

    // Import assessments
    console.log('📊 Syncing assessments...');
    let assessmentsImported = 0;
    let assessmentsSkipped = 0;
    let assignmentsCreated = 0;
    
    for (const assessment of assessments) {
      try {
        // Insert assessment
        const insertResult = await pool.query(\`
          INSERT INTO assessments (
            id, assessment_name, assessment_description, organization_name, contact_email,
            industry, status, progress, current_category, completed_categories,
            responses, edit_history, started_at, completed_at, updated_at, created_at,
            user_id, selected_pillars, results_released, results_released_by, results_released_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO NOTHING
          RETURNING id
        \`, [
          assessment.id,
          assessment.assessment_name,
          assessment.assessment_description,
          assessment.organization_name,
          assessment.contact_email,
          assessment.industry,
          assessment.status,
          assessment.progress,
          assessment.current_category,
          assessment.completed_categories,
          assessment.responses,
          assessment.edit_history,
          assessment.started_at,
          assessment.completed_at,
          assessment.updated_at,
          assessment.created_at,
          assessment.user_id || null,
          assessment.selected_pillars || '[]',
          assessment.results_released === 't' || assessment.results_released === 'true',
          assessment.results_released_by || null,
          assessment.results_released_at || null
        ]);

        if (insertResult.rows.length > 0) {
          assessmentsImported++;
          
          // Create user_assignment if assessment has a user_id
          if (assessment.user_id) {
            try {
              await pool.query(\`
                INSERT INTO user_assignments (assessment_id, user_id, role, status, assigned_by, notes)
                VALUES ($1, $2, 'author', 'assigned', 1, 'Migrated from local database')
                ON CONFLICT (assessment_id, user_id, role) DO NOTHING
              \`, [assessment.id, assessment.user_id]);
              assignmentsCreated++;
            } catch (assignErr) {
              console.warn(\`⚠️  Could not create assignment for assessment \${assessment.id}:\`, assignErr.message);
            }
          }
        } else {
          assessmentsSkipped++;
        }
      } catch (err) {
        if (err.code === '23505') { // Duplicate key
          assessmentsSkipped++;
        } else {
          console.error(\`⚠️  Error importing assessment \${assessment.id}:\`, err.message);
        }
      }
    }

    console.log(\`✅ Assessments: \${assessmentsImported} imported, \${assessmentsSkipped} already existed\`);
    console.log(\`✅ User assignments: \${assignmentsCreated} created\n\`);

    // Final counts
    const finalCounts = await pool.query(\`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM assessments) as assessments,
        (SELECT COUNT(*) FROM user_assignments) as assignments
    \`);
    
    console.log('📊 Final Railway database counts:');
    console.log(\`   Users: \${finalCounts.rows[0].users}\`);
    console.log(\`   Assessments: \${finalCounts.rows[0].assessments}\`);
    console.log(\`   Assignments: \${finalCounts.rows[0].assignments}\`);
    console.log('');
    console.log('✅ Sync complete!');

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
