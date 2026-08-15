const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const db = require('../db/connection');

/**
 * GET /api/assessment-excel/:id/export
 * Export assessment data to Excel format with proper row heights
 */
router.get('/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📥 Exporting assessment ${id} to Excel`);
    
    // Fetch assessment basic info
    const assessmentResult = await db.query(
      'SELECT * FROM assessments WHERE id = $1',
      [id]
    );
    
    if (assessmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    const assessment = assessmentResult.rows[0];
    
    // Try to fetch from responses table first, fallback to assessment.responses
    let responses = {};
    
    try {
      const responsesResult = await db.query(
        'SELECT * FROM responses WHERE assessment_id = $1',
        [id]
      );
      
      // Build responses map from responses table
      responsesResult.rows.forEach(row => {
        if (row.response_data && typeof row.response_data === 'object') {
          Object.assign(responses, row.response_data);
        }
      });
      
      console.log(`✅ Loaded ${responsesResult.rows.length} response records from responses table`);
    } catch (error) {
      console.log(`⚠️  Responses table not available, using assessment.responses`);
      responses = assessment.responses || {};
    }
    
    // If still no responses, check assessment.responses
    if (Object.keys(responses).length === 0 && assessment.responses) {
      responses = assessment.responses;
      console.log(`✅ Using responses from assessment record`);
    }
    
    console.log(`📊 Total response keys: ${Object.keys(responses).length}`);
    
    // Load framework to get all questions
    const framework = require('../data/assessmentFramework');
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assessment Data');
    
    // Define columns with widths
    worksheet.columns = [
      { header: 'Pillar', key: 'pillar', width: 25 },
      { header: 'Dimension', key: 'dimension', width: 30 },
      { header: 'Question', key: 'question', width: 60 },
      { header: 'Current State Options', key: 'currentState', width: 50 },
      { header: 'Future State Options', key: 'futureState', width: 50 },
      { header: 'Technical Pain Points', key: 'technicalPain', width: 45 },
      { header: 'Business Pain Points', key: 'businessPain', width: 45 },
      { header: 'Notes', key: 'notes', width: 60 }
    ];
    
    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    headerRow.height = 30;
    
    // Iterate through framework and add rows
    let rowIndex = 2;
    framework.assessmentAreas.forEach(area => {
      const pillarName = area.name;
      
      area.dimensions.forEach(dimension => {
        const dimensionName = dimension.name;
        
        dimension.questions.forEach(question => {
          const questionId = question.id;
          const questionText = question.question;
          
          // Get notes directly from responses object using the comment key
          const notes = responses[`${questionId}_comment`] || '';
          
          // Extract current state options (all 5 levels)
          const currentStatePerspective = question.perspectives?.find(p => p.id === 'current_state');
          const currentStateOptions = currentStatePerspective?.options?.map((opt, idx) => 
            `L${idx + 1}: ${opt.label}`
          ).join('\n') || '';
          
          // Extract future state options (all 5 levels)
          const futureStatePerspective = question.perspectives?.find(p => p.id === 'future_state');
          const futureStateOptions = futureStatePerspective?.options?.map((opt, idx) => 
            `L${idx + 1}: ${opt.label}`
          ).join('\n') || '';
          
          // Extract technical pain points (all options)
          const technicalPainPerspective = question.perspectives?.find(p => p.id === 'technical_pain');
          const technicalPainOptions = technicalPainPerspective?.options?.map(opt => 
            `• ${opt.label}`
          ).join('\n') || '';
          
          // Extract business pain points (all options)
          const businessPainPerspective = question.perspectives?.find(p => p.id === 'business_pain');
          const businessPainOptions = businessPainPerspective?.options?.map(opt => 
            `• ${opt.label}`
          ).join('\n') || '';
          
          // Add row
          const row = worksheet.addRow({
            pillar: pillarName,
            dimension: dimensionName,
            question: questionText,
            currentState: currentStateOptions,
            futureState: futureStateOptions,
            technicalPain: technicalPainOptions,
            businessPain: businessPainOptions,
            notes: notes
          });
          
          // Calculate row height based on content
          const cells = [currentStateOptions, futureStateOptions, technicalPainOptions, businessPainOptions, notes];
          let maxLines = 1;
          cells.forEach(cell => {
            if (cell) {
              const lines = (cell.toString().match(/\n/g) || []).length + 1;
              maxLines = Math.max(maxLines, lines);
            }
          });
          
          // Set row height (15 points per line, minimum 30, maximum 300)
          row.height = Math.min(300, Math.max(30, maxLines * 15));
          
          // Apply cell styling
          row.eachCell((cell, colNumber) => {
            cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
            
            // Pillar column bold
            if (colNumber === 1) {
              cell.font = { bold: true, size: 10 };
            } else {
              cell.font = { size: 10 };
            }
            
            // Alternate row colors
            if (rowIndex % 2 === 0) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF8FAFC' }
              };
            }
          });
          
          rowIndex++;
        });
      });
    });
    
    // Generate filename
    const filename = `Assessment_${id}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Write to response
    await workbook.xlsx.write(res);
    
    console.log(`✅ Excel exported successfully: ${filename}`);
    
  } catch (error) {
    console.error('❌ Error exporting to Excel:', error);
    res.status(500).json({ error: 'Failed to export assessment to Excel' });
  }
});

/**
 * POST /api/assessment-excel/:id/import
 * Import assessment data from Excel format
 */
router.post('/:id/import', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.files.file;
    
    console.log(`📤 Importing assessment ${id} from Excel`);
    
    // Load the workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.data);
    
    const worksheet = workbook.getWorksheet('Assessment Data');
    
    if (!worksheet) {
      return res.status(400).json({ error: 'Invalid Excel file: "Assessment Data" sheet not found' });
    }
    
    // Validate headers
    const headerRow = worksheet.getRow(1);
    const expectedHeaders = ['Pillar', 'Dimension', 'Question', 'Current State Options', 'Future State Options', 'Technical Pain Points', 'Business Pain Points', 'Notes'];
    
    const actualHeaders = [];
    headerRow.eachCell((cell, colNumber) => {
      actualHeaders.push(cell.value);
    });
    
    const headersMatch = expectedHeaders.every((header, index) => 
      actualHeaders[index] === header
    );
    
    if (!headersMatch) {
      return res.status(400).json({ 
        error: 'Invalid Excel file format',
        expected: expectedHeaders,
        found: actualHeaders
      });
    }
    
    // Load framework
    const framework = require('../data/assessmentFramework');
    
    // Build a map of questions by pillar + dimension + question text
    const questionMap = {};
    framework.assessmentAreas.forEach(area => {
      area.dimensions.forEach(dimension => {
        dimension.questions.forEach(question => {
          const key = `${area.name}|${dimension.name}|${question.question}`;
          questionMap[key] = question.id;
        });
      });
    });
    
    // Parse Excel and build responses object
    const updatedResponses = {};
    let rowsProcessed = 0;
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      
      const pillar = row.getCell(1).value;
      const dimension = row.getCell(2).value;
      const question = row.getCell(3).value;
      const notes = row.getCell(8).value || '';
      
      const key = `${pillar}|${dimension}|${question}`;
      const questionId = questionMap[key];
      
      if (rowNumber === 2) {
        console.log(`🔍 [ROW 2 DEBUG] Pillar: "${pillar}", Dimension: "${dimension}"`);
        console.log(`🔍 [ROW 2 DEBUG] Question: "${question}"`);
        console.log(`🔍 [ROW 2 DEBUG] Notes: "${notes}"`);
        console.log(`🔍 [ROW 2 DEBUG] Key: "${key}"`);
        console.log(`🔍 [ROW 2 DEBUG] QuestionId: "${questionId}"`);
        console.log(`🔍 [ROW 2 DEBUG] Available keys sample:`, Object.keys(questionMap).slice(0, 3));
      }
      
      if (questionId) {
        // Store notes
        updatedResponses[`${questionId}_comment`] = notes;
        rowsProcessed++;
      } else if (rowNumber === 2) {
        console.log(`❌ [ROW 2 DEBUG] Question not found in questionMap!`);
      }
    });
    
    console.log(`📊 Processed ${rowsProcessed} rows from Excel`);
    
    // Update database
    try {
      // Try responses table first
      const responsesResult = await db.query(
        'SELECT * FROM responses WHERE assessment_id = $1',
        [id]
      );
      
      // Merge with existing responses
      const existingResponses = {};
      responsesResult.rows.forEach(row => {
        if (row.response_data && typeof row.response_data === 'object') {
          Object.assign(existingResponses, row.response_data);
        }
      });
      
      const mergedResponses = { ...existingResponses, ...updatedResponses };
      
      // Update responses table (create or update single row)
      await db.query(
        `INSERT INTO responses (assessment_id, question_id, response_data, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (assessment_id, question_id)
         DO UPDATE SET response_data = $3, updated_at = NOW()`,
        [id, 'excel_import', mergedResponses]
      );
      
      console.log(`✅ Updated responses table`);
    } catch (error) {
      console.log(`⚠️  Responses table not available, updating assessment.responses`);
      
      // Fallback: Update assessments.responses column
      const assessmentResult = await db.query(
        'SELECT responses FROM assessments WHERE id = $1',
        [id]
      );
      
      const existingResponses = assessmentResult.rows[0]?.responses || {};
      const mergedResponses = { ...existingResponses, ...updatedResponses };
      
      await db.query(
        'UPDATE assessments SET responses = $1, updated_at = NOW() WHERE id = $2',
        [mergedResponses, id]
      );
      
      console.log(`✅ Updated assessments table`);
    }
    
    res.json({
      success: true,
      message: 'Assessment imported successfully',
      rowsProcessed,
      stats: {
        updated: rowsProcessed,
        errors: 0,
        total: rowsProcessed
      }
    });
    
  } catch (error) {
    console.error('❌ Error importing from Excel:', error);
    res.status(500).json({ error: 'Failed to import assessment from Excel' });
  }
});

module.exports = router;
