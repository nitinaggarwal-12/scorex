const db = require('../db/connection');

/**
 * Apply question edits and deletions to assessment framework
 * @param {string} assessmentId - Assessment ID
 * @param {object} framework - Original assessment framework
 * @returns {object} - Modified framework with edits applied and deleted questions removed
 */
async function applyQuestionEdits(assessmentId, framework) {
  try {
    // Fetch all edits for this assessment
    const editsResult = await db.query(
      'SELECT * FROM question_edits WHERE assessment_id = $1',
      [assessmentId]
    );
    
    // Fetch all deleted questions for this assessment
    const deletedResult = await db.query(
      'SELECT question_id FROM deleted_questions WHERE assessment_id = $1',
      [assessmentId]
    );
    
    const edits = editsResult.rows;
    const deletedQuestionIds = new Set(deletedResult.rows.map(row => row.question_id));
    
    console.log(`📝 Applying ${edits.length} edits and ${deletedQuestionIds.size} deletions to assessment ${assessmentId}`);
    
    // Deep clone the framework to avoid mutating the original
    const modifiedFramework = JSON.parse(JSON.stringify(framework));
    
    // Apply edits and remove deleted questions
    modifiedFramework.assessmentAreas = modifiedFramework.assessmentAreas.map(area => ({
      ...area,
      dimensions: area.dimensions.map(dimension => ({
        ...dimension,
        questions: dimension.questions
          .filter(question => !deletedQuestionIds.has(question.id)) // Remove deleted questions
          .map(question => {
            // Check if this question has edits
            const edit = edits.find(e => e.question_id === question.id);
            
            if (edit) {
              // Apply edits
              return {
                ...question,
                question: edit.edited_question_text || question.question,
                perspectives: edit.edited_perspectives || question.perspectives,
                _isEdited: true, // Mark as edited for frontend reference
                _editedBy: edit.edited_by,
                _editedAt: edit.updated_at
              };
            }
            
            return question;
          })
      }))
    }));
    
    return modifiedFramework;
  } catch (error) {
    console.error('❌ Error applying question edits:', error);
    // Return original framework if there's an error
    return framework;
  }
}

/**
 * Check if reports need regeneration due to deleted questions
 * @param {string} assessmentId - Assessment ID
 * @returns {boolean} - True if regeneration is needed
 */
async function needsReportRegeneration(assessmentId) {
  try {
    const result = await db.query(
      `SELECT COUNT(*) as count FROM deleted_questions 
       WHERE assessment_id = $1 AND regeneration_status = 'pending'`,
      [assessmentId]
    );
    
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('❌ Error checking regeneration status:', error);
    return false;
  }
}

/**
 * Mark reports as regenerated for an assessment
 * @param {string} assessmentId - Assessment ID
 */
async function markReportsRegenerated(assessmentId) {
  try {
    await db.query(
      `UPDATE deleted_questions 
       SET regeneration_status = 'completed' 
       WHERE assessment_id = $1 AND regeneration_status = 'pending'`,
      [assessmentId]
    );
    
    console.log(`✅ Marked reports as regenerated for assessment ${assessmentId}`);
  } catch (error) {
    console.error('❌ Error marking reports as regenerated:', error);
  }
}

module.exports = {
  applyQuestionEdits,
  needsReportRegeneration,
  markReportsRegenerated
};

