const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Identify corrupted assessments
 * Corrupted = completedCategories shows complete but no actual response data
 */
router.get('/corrupted-assessments', async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        assessment_id,
        assessment_name,
        organization_name,
        industry,
        status,
        created_at,
        updated_at,
        completed_categories,
        responses,
        CASE 
          WHEN completed_categories IS NOT NULL THEN jsonb_array_length(completed_categories)
          ELSE 0
        END as completed_count,
        CASE
          WHEN responses IS NOT NULL THEN (
            SELECT COUNT(*)
            FROM jsonb_each(responses)
            WHERE key NOT LIKE '%_comment' 
              AND key NOT LIKE '%_skipped'
              AND value::text != 'null'
              AND value::text != '""'
          )
          ELSE 0
        END as response_count
      FROM assessments
      WHERE 
        -- Has completed categories marked
        completed_categories IS NOT NULL 
        AND jsonb_array_length(completed_categories) > 0
        AND (
          -- But has no responses OR very few responses
          responses IS NULL 
          OR jsonb_typeof(responses) = 'null'
          OR (
            SELECT COUNT(*)
            FROM jsonb_each(responses)
            WHERE key NOT LIKE '%_comment' 
              AND key NOT LIKE '%_skipped'
              AND value::text != 'null'
              AND value::text != '""'
          ) < 5  -- Less than 5 real responses indicates corruption
        )
      ORDER BY updated_at DESC;
    `;

    const result = await pool.query(query);
    
    console.log(`[Data Cleanup] Found ${result.rows.length} corrupted assessments`);
    
    res.json({
      success: true,
      count: result.rows.length,
      assessments: result.rows.map(row => ({
        id: row.id,
        assessmentId: row.assessment_id,
        assessmentName: row.assessment_name,
        organizationName: row.organization_name,
        industry: row.industry,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        completedPillarsCount: parseInt(row.completed_count),
        actualResponsesCount: parseInt(row.response_count),
        isCorrupted: parseInt(row.completed_count) > 0 && parseInt(row.response_count) < 5
      }))
    });

  } catch (error) {
    console.error('[Data Cleanup] Error finding corrupted assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to identify corrupted assessments',
      error: error.message
    });
  }
});

/**
 * Delete a specific assessment by ID
 */
router.delete('/assessment/:assessmentId', async (req, res) => {
  const { assessmentId } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete related data first (if any foreign key constraints exist)
    // Add more related tables as needed
    await client.query('DELETE FROM question_edits WHERE assessment_id = $1', [assessmentId]);
    await client.query('DELETE FROM deleted_questions WHERE assessment_id = $1', [assessmentId]);
    
    // Delete the assessment
    const result = await client.query(
      'DELETE FROM assessments WHERE assessment_id = $1 RETURNING assessment_name, organization_name',
      [assessmentId]
    );

    await client.query('COMMIT');

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    console.log(`[Data Cleanup] Deleted assessment: ${result.rows[0].assessment_name} (${assessmentId})`);

    res.json({
      success: true,
      message: 'Assessment deleted successfully',
      deletedAssessment: {
        assessmentId,
        assessmentName: result.rows[0].assessment_name,
        organizationName: result.rows[0].organization_name
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Data Cleanup] Error deleting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assessment',
      error: error.message
    });
  } finally {
    client.release();
  }
});

/**
 * Bulk delete corrupted assessments
 */
router.post('/bulk-delete-corrupted', async (req, res) => {
  const { assessmentIds } = req.body;

  if (!assessmentIds || !Array.isArray(assessmentIds) || assessmentIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No assessment IDs provided'
    });
  }

  const client = await pool.connect();
  const results = {
    deleted: [],
    failed: []
  };

  try {
    await client.query('BEGIN');

    for (const assessmentId of assessmentIds) {
      try {
        // Delete related data
        await client.query('DELETE FROM question_edits WHERE assessment_id = $1', [assessmentId]);
        await client.query('DELETE FROM deleted_questions WHERE assessment_id = $1', [assessmentId]);
        
        // Delete assessment
        const result = await client.query(
          'DELETE FROM assessments WHERE assessment_id = $1 RETURNING assessment_name',
          [assessmentId]
        );

        if (result.rows.length > 0) {
          results.deleted.push({
            assessmentId,
            assessmentName: result.rows[0].assessment_name
          });
        } else {
          results.failed.push({
            assessmentId,
            reason: 'Not found'
          });
        }
      } catch (error) {
        results.failed.push({
          assessmentId,
          reason: error.message
        });
      }
    }

    await client.query('COMMIT');

    console.log(`[Data Cleanup] Bulk delete completed: ${results.deleted.length} deleted, ${results.failed.length} failed`);

    res.json({
      success: true,
      message: `Deleted ${results.deleted.length} assessments`,
      results
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Data Cleanup] Error in bulk delete:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete bulk delete',
      error: error.message,
      partialResults: results
    });
  } finally {
    client.release();
  }
});

/**
 * Get statistics about data quality
 */
router.get('/data-quality-stats', async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_assessments,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_assessments,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_assessments,
        COUNT(*) FILTER (
          WHERE completed_categories IS NOT NULL 
          AND jsonb_array_length(completed_categories) > 0
        ) as assessments_with_completed_pillars,
        COUNT(*) FILTER (
          WHERE responses IS NULL OR jsonb_typeof(responses) = 'null'
        ) as assessments_with_no_responses,
        COUNT(*) FILTER (
          WHERE completed_categories IS NOT NULL 
          AND jsonb_array_length(completed_categories) > 0
          AND (
            responses IS NULL 
            OR jsonb_typeof(responses) = 'null'
            OR (
              SELECT COUNT(*)
              FROM jsonb_each(responses)
              WHERE key NOT LIKE '%_comment' 
                AND key NOT LIKE '%_skipped'
                AND value::text != 'null'
                AND value::text != '""'
            ) < 5
          )
        ) as corrupted_assessments
      FROM assessments;
    `;

    const result = await pool.query(statsQuery);
    const stats = result.rows[0];

    res.json({
      success: true,
      stats: {
        totalAssessments: parseInt(stats.total_assessments),
        completedAssessments: parseInt(stats.completed_assessments),
        inProgressAssessments: parseInt(stats.in_progress_assessments),
        assessmentsWithCompletedPillars: parseInt(stats.assessments_with_completed_pillars),
        assessmentsWithNoResponses: parseInt(stats.assessments_with_no_responses),
        corruptedAssessments: parseInt(stats.corrupted_assessments),
        dataQualityScore: Math.round(
          ((parseInt(stats.total_assessments) - parseInt(stats.corrupted_assessments)) / 
          parseInt(stats.total_assessments)) * 100
        )
      }
    });

  } catch (error) {
    console.error('[Data Cleanup] Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get data quality stats',
      error: error.message
    });
  }
});

module.exports = router;

