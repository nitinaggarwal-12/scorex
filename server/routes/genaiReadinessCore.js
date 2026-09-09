const express = require('express');
const router = express.Router();
const genaiAssessmentRepo = require('../db/genaiAssessmentRepository');
const genAIFramework = require('../data/genai-readiness-framework');
const ExcelJS = require('exceljs');

// Get the framework structure
router.get('/framework', (req, res) => {
  res.json(genAIFramework);
});

// Save a new assessment
router.post('/assessments', async (req, res) => {
  try {
    const saved = await genaiAssessmentRepo.create(req.body);
    res.json({ id: saved.id, message: 'Assessment saved successfully' });
  } catch (error) {
    console.error('Error saving assessment:', error);
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// Get a specific assessment
router.get('/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await genaiAssessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// Update an assessment
router.put('/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await genaiAssessmentRepo.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json({ id: updated.id, message: 'Assessment updated successfully' });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'Failed to update assessment' });
  }
});

// Get all assessments (for dashboard/list view)
router.get('/assessments', async (req, res) => {
  try {
    const assessments = await genaiAssessmentRepo.findAll();
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Delete an assessment
router.delete('/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await genaiAssessmentRepo.delete(id);
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
});

// Download assessment as Excel
router.get('/assessments/:id/excel', async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await genaiAssessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const workbook = new ExcelJS.Workbook();
    
    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Field', key: 'field', width: 30 },
      { header: 'Value', key: 'value', width: 50 }
    ];
    
    summarySheet.addRows([
      { field: 'Customer Name', value: assessment.customer_name },
      { field: 'Total Score', value: `${assessment.total_score}/${assessment.max_score}` },
      { field: 'Maturity Level', value: assessment.maturity_level },
      { field: 'Completed Date', value: new Date(assessment.completed_at).toLocaleString() }
    ]);
    
    // Style summary header
    summarySheet.getRow(1).font = { bold: true, size: 12 };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };
    summarySheet.getRow(1).font.color = { argb: 'FFFFFFFF' };
    
    // Responses Sheet - Detailed
    const responsesSheet = workbook.addWorksheet('Responses');
    responsesSheet.columns = [
      { header: 'Dimension', key: 'dimension', width: 25 },
      { header: 'Question', key: 'question', width: 60 },
      { header: 'All Options', key: 'allOptions', width: 80 },
      { header: 'Selected Answer', key: 'selectedAnswer', width: 50 },
      { header: 'Score', key: 'score', width: 10 }
    ];
    
    const responses = assessment.responses;
    
    // Map responses to framework questions
    genAIFramework.dimensions.forEach(dimension => {
      dimension.questions.forEach(question => {
        const responseValue = responses[question.id];
        if (responseValue !== undefined) {
          const selectedOption = question.options.find(opt => opt.value === responseValue);
          
          // Combine all options into one cell with line breaks
          const allOptionsText = question.options.map((opt, idx) => 
            `L${idx + 1}: ${opt.label} (${opt.score} pts)`
          ).join('\n');
          
          const row = {
            dimension: dimension.name,
            question: question.text,
            allOptions: allOptionsText,
            selectedAnswer: selectedOption ? selectedOption.label : 'N/A',
            score: selectedOption ? selectedOption.score : 0
          };
          
          const addedRow = responsesSheet.addRow(row);
          
          // Enable text wrapping for the all options cell
          addedRow.getCell('allOptions').alignment = { wrapText: true, vertical: 'top' };
        }
      });
    });
    
    // Style responses header
    responsesSheet.getRow(1).font = { bold: true, size: 12 };
    responsesSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };
    responsesSheet.getRow(1).font.color = { argb: 'FFFFFFFF' };
    
    // Highlight selected answer column
    responsesSheet.getColumn('selectedAnswer').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF0CD' } // Light yellow
        };
        cell.font = { bold: true };
      }
    });
    
    // Highlight score column
    responsesSheet.getColumn('score').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD4EDDA' } // Light green
        };
        cell.font = { bold: true };
      }
    });
    
    // Scores Sheet
    const scoresSheet = workbook.addWorksheet('Dimension Scores');
    scoresSheet.columns = [
      { header: 'Dimension', key: 'dimension', width: 25 },
      { header: 'Score', key: 'score', width: 15 },
      { header: 'Max Score', key: 'maxScore', width: 15 },
      { header: 'Percentage', key: 'percentage', width: 15 }
    ];
    
    const scores = assessment.scores;
    genAIFramework.dimensions.forEach(dimension => {
      const dimScore = scores[dimension.id];
      if (dimScore) {
        scoresSheet.addRow({
          dimension: dimension.name,
          score: dimScore.score,
          maxScore: dimScore.maxScore,
          percentage: `${dimScore.percentage}%`
        });
      }
    });
    
    // Style scores header
    scoresSheet.getRow(1).font = { bold: true, size: 12 };
    scoresSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };
    scoresSheet.getRow(1).font.color = { argb: 'FFFFFFFF' };
    
    // Send file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=GenAI_Readiness_${assessment.customer_name.replace(/[^a-z0-9]/gi, '_')}.xlsx`
    );
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
});

// Upload assessment from Excel
router.post('/assessments/:id/upload-excel', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    
    // Parse Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.data);
    
    const responsesSheet = workbook.getWorksheet('Responses');
    if (!responsesSheet) {
      return res.status(400).json({ error: 'Responses sheet not found in Excel file' });
    }

    // Extract responses from Excel
    const responses = {};
    const newScores = {};
    
    // Skip header row (row 1) and iterate through data rows
    responsesSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      
      const dimension = row.getCell(1).value; // Dimension name
      const question = row.getCell(2).value; // Question text
      const allOptions = row.getCell(3).value; // All options (not used for parsing)
      const selectedAnswer = row.getCell(4).value; // Selected answer text
      const score = row.getCell(5).value; // Score
      
      if (!selectedAnswer || !dimension) return;
      
      // Find the question in the framework by matching dimension and question text
      const frameworkDimension = genAIFramework.dimensions.find(d => d.name === dimension);
      if (!frameworkDimension) return;
      
      const frameworkQuestion = frameworkDimension.questions.find(q => q.text === question);
      if (!frameworkQuestion) return;
      
      // Find the option that matches the selected answer text
      const selectedOption = frameworkQuestion.options.find(opt => opt.label === selectedAnswer);
      if (!selectedOption) return;
      
      // Store the response value
      responses[frameworkQuestion.id] = selectedOption.value;
    });

    // Recalculate scores based on responses
    let totalScore = 0;
    
    genAIFramework.dimensions.forEach(dimension => {
      let dimensionScore = 0;
      
      dimension.questions.forEach(question => {
        const responseValue = responses[question.id];
        if (responseValue !== undefined) {
          const selectedOption = question.options.find(opt => opt.value === responseValue);
          if (selectedOption) {
            dimensionScore += selectedOption.score;
          }
        }
      });
      
      newScores[dimension.id] = {
        score: dimensionScore,
        maxScore: dimension.maxScore,
        percentage: Math.round((dimensionScore / dimension.maxScore) * 100)
      };
      
      totalScore += dimensionScore;
    });

    // Determine maturity level
    const maturityLevel = genAIFramework.maturityLevels.find(level => 
      totalScore >= level.min && totalScore <= level.max
    );

    // Update assessment in database
    await genaiAssessmentRepo.update(id, {
      responses,
      scores: newScores,
      totalScore,
      maturityLevel: maturityLevel?.level || null
    });

    res.json({ 
      message: 'Assessment updated successfully from Excel',
      totalScore,
      maturityLevel: maturityLevel?.level,
      responsesCount: Object.keys(responses).length
    });
  } catch (error) {
    console.error('Error uploading Excel:', error);
    res.status(500).json({ error: 'Failed to upload Excel file: ' + error.message });
  }
});

module.exports = router;

