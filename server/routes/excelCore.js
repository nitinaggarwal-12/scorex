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
    
    let isDynamic = false;
    let assessment = null;
    let dynamicInstance = null;

    // 1. Try Classic Assessment first
    try {
      const assessmentResult = await db.query(
        'SELECT * FROM assessments WHERE id = $1',
        [id]
      );
      if (assessmentResult.rows && assessmentResult.rows.length > 0) {
        assessment = assessmentResult.rows[0];
      }
    } catch (dbErr) {
      console.warn('DB query fallback:', dbErr.message);
    }

    // 2. Check File / Dynamic Repository if not found in classic DB
    if (!assessment) {
      const customAssessmentRepo = require('../db/customAssessmentRepository');
      dynamicInstance = await customAssessmentRepo.getInstanceById(id);
      if (dynamicInstance) {
        isDynamic = true;
        assessment = dynamicInstance;
      }
    }

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ScoreX Enterprise Maturity Platform';
    workbook.created = new Date();

    // ==========================================
    // DYNAMIC ASSESSMENT EXPORT HANDLER
    // ==========================================
    if (isDynamic) {
      const framework = assessment.frameworkSnapshot || {};
      const dimensions = framework.dimensions || [];
      const responses = assessment.responses || {};
      const scores = assessment.scores || {};
      const aiReport = assessment.aiReport || null;

      // Sheet 1: Executive Overview
      const wsOverview = workbook.addWorksheet('Executive Overview');
      wsOverview.columns = [
        { header: 'Property', key: 'prop', width: 30 },
        { header: 'Value', key: 'val', width: 65 }
      ];
      wsOverview.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      wsOverview.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
      wsOverview.getRow(1).height = 28;

      const overviewRows = [
        { prop: 'Customer / Organization', val: assessment.customerName || 'Enterprise' },
        { prop: 'Assessment Framework', val: framework.title || 'Dynamic Assessment' },
        { prop: 'Initiative / Use Case', val: assessment.useCase || framework.subtitle || 'Modernization' },
        { prop: 'Domain Badge', val: framework.badge || 'AI & Cloud' },
        { prop: 'Target Audience', val: framework.targetRole || 'Chief Architects & Engineers' },
        { prop: 'Overall Score', val: `${assessment.totalScore || 0} / ${assessment.maxScore || 5.0}` },
        { prop: 'Maturity Level', val: assessment.maturityLevel || 'Initial' },
        { prop: 'Status', val: assessment.status === 'completed' ? 'Completed' : 'In Progress' },
        { prop: 'Assessment ID', val: assessment.id },
        { prop: 'Created Date', val: assessment.createdAt ? new Date(assessment.createdAt).toLocaleString() : new Date().toLocaleString() },
        { prop: 'Last Updated', val: assessment.updatedAt ? new Date(assessment.updatedAt).toLocaleString() : new Date().toLocaleString() }
      ];

      overviewRows.forEach((r, idx) => {
        const row = wsOverview.addRow(r);
        row.height = 24;
        row.eachCell((cell, col) => {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
          };
          if (col === 1) cell.font = { bold: true, size: 10 };
          if (idx % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        });
      });

      // Sheet 2: Dimension Scores
      const wsScores = workbook.addWorksheet('Dimension Scores');
      wsScores.columns = [
        { header: 'Dimension Name', key: 'name', width: 35 },
        { header: 'Weight', key: 'weight', width: 12 },
        { header: 'Assessed Score (1-5)', key: 'score', width: 22 },
        { header: 'Target Future Score', key: 'target', width: 20 },
        { header: 'Gap', key: 'gap', width: 12 },
        { header: 'Dimension Description', key: 'desc', width: 65 }
      ];
      wsScores.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      wsScores.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
      wsScores.getRow(1).height = 28;

      dimensions.forEach((dim, idx) => {
        const curScore = scores[dim.id] || 0;
        const targetScore = Math.min(5, curScore + 1.5);
        const gap = +(targetScore - curScore).toFixed(1);
        const row = wsScores.addRow({
          name: dim.name,
          weight: dim.weight || 1,
          score: curScore,
          target: targetScore,
          gap: gap > 0 ? `+${gap}` : gap,
          desc: dim.description || ''
        });
        row.height = 26;
        row.eachCell((cell, col) => {
          cell.alignment = { vertical: 'middle', horizontal: col >= 2 && col <= 5 ? 'center' : 'left', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
          };
          if (col === 1) cell.font = { bold: true, size: 10 };
          if (idx % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        });
      });

      // Sheet 3: Detailed Questions & Responses
      const wsDetails = workbook.addWorksheet('Detailed Responses');
      wsDetails.columns = [
        { header: 'Dimension', key: 'dim', width: 28 },
        { header: 'Question ID', key: 'qid', width: 14 },
        { header: 'Question Text', key: 'qtext', width: 45 },
        { header: 'Selected Current Score', key: 'cscore', width: 20 },
        { header: 'Desired Future Score', key: 'fscore', width: 20 },
        { header: 'Technical Pain Points', key: 'tpain', width: 35 },
        { header: 'Business Pain Points', key: 'bpain', width: 35 },
        { header: 'Architectural Notes / Context', key: 'notes', width: 45 }
      ];
      wsDetails.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      wsDetails.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
      wsDetails.getRow(1).height = 28;

      let rIdx = 0;
      dimensions.forEach(dim => {
        (dim.questions || []).forEach(q => {
          const cur = responses[`${q.id}_current_state`] || responses[q.id] || 'Not Answered';
          const fut = responses[`${q.id}_future_state`] || (typeof cur === 'number' ? Math.min(5, cur + 2) : '');
          const tp = Array.isArray(responses[`${q.id}_technical_pain`]) ? responses[`${q.id}_technical_pain`].join('\n• ') : '';
          const bp = Array.isArray(responses[`${q.id}_business_pain`]) ? responses[`${q.id}_business_pain`].join('\n• ') : '';
          const notes = responses[`${q.id}_comment`] || '';

          const row = wsDetails.addRow({
            dim: dim.name,
            qid: q.id,
            qtext: q.text || q.question || '',
            cscore: cur,
            fscore: fut,
            tpain: tp ? `• ${tp}` : '',
            bpain: bp ? `• ${bp}` : '',
            notes
          });

          const maxLines = Math.max(
            1,
            (tp.match(/\n/g) || []).length + 1,
            (bp.match(/\n/g) || []).length + 1,
            (notes.match(/\n/g) || []).length + 1
          );
          row.height = Math.min(220, Math.max(30, maxLines * 16));

          row.eachCell((cell, col) => {
            cell.alignment = { vertical: 'top', horizontal: col >= 4 && col <= 5 ? 'center' : 'left', wrapText: true };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
            if (col === 1 || col === 2) cell.font = { bold: true, size: 9 };
            if (rIdx % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
          });
          rIdx++;
        });
      });

      // Sheet 4: Strategic Roadmap & AI Findings (if present)
      if (aiReport) {
        const wsAi = workbook.addWorksheet('AI Transformation Roadmap');
        wsAi.columns = [
          { header: 'Roadmap Dimension / Stream', key: 'stream', width: 32 },
          { header: 'Transformation Guidance / Strategic Initiatives', key: 'guidance', width: 75 }
        ];
        wsAi.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        wsAi.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } };
        wsAi.getRow(1).height = 28;

        const aiRows = [
          { stream: 'Executive Summary', guidance: aiReport.executiveSummary || aiReport.strategicSituation || 'Enterprise Architecture Modernization' },
          { stream: 'Key Modernization Shifts', guidance: Array.isArray(aiReport.keyTransformations || aiReport.keyModernizationShifts) ? (aiReport.keyTransformations || aiReport.keyModernizationShifts).map(t => `• ${t}`).join('\n') : 'Architecture Modernization Roadmap' },
          { stream: 'Board & C-Suite Guidance', guidance: aiReport.personaRoadmaps?.cSuite || aiReport.cSuiteRoadmap || 'Focus on ROI arbitrage, compliance posture, and time-to-market acceleration.' },
          { stream: 'VP Engineering Roadmap', guidance: aiReport.personaRoadmaps?.vpEngineering || aiReport.engineeringRoadmap || 'Decommission siloed batch jobs and deploy self-healing streaming lakehouse infrastructure.' },
          { stream: 'Principal Architect Playbook', guidance: aiReport.personaRoadmaps?.architect || aiReport.architectPlaybook || 'Adopt Model Context Protocol (MCP), eBPF micro-segmentation, and zero-trust IAM.' }
        ];

        aiRows.forEach((r, idx) => {
          const row = wsAi.addRow(r);
          const lines = (r.guidance.match(/\n/g) || []).length + 1;
          row.height = Math.min(250, Math.max(35, lines * 16));
          row.eachCell((cell, col) => {
            cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
            if (col === 1) cell.font = { bold: true, size: 10 };
            if (idx % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
          });
        });
      }

      const cleanCustomer = (assessment.customerName || 'Assessment').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${cleanCustomer}_${(framework.typeKey || 'Dynamic').replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      await workbook.xlsx.write(res);
      console.log(`✅ Dynamic assessment Excel exported successfully: ${filename}`);
      return;
    }

    // ==========================================
    // CLASSIC DATABRICKS ASSESSMENT EXPORT HANDLER
    // ==========================================
    let responses = {};
    try {
      const responsesResult = await db.query(
        'SELECT * FROM responses WHERE assessment_id = $1',
        [id]
      );
      if (responsesResult.rows && responsesResult.rows.length > 0) {
        responsesResult.rows.forEach(row => {
          if (row.response_data && typeof row.response_data === 'object') {
            Object.assign(responses, row.response_data);
          }
        });
      }
    } catch (err) {
      responses = assessment.responses || {};
    }

    if (Object.keys(responses).length === 0 && assessment.responses) {
      responses = assessment.responses;
    }

    const framework = require('../data/assessmentFramework');
    const worksheet = workbook.addWorksheet('Assessment Data');

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

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    headerRow.height = 30;

    let rowIndex = 2;
    (framework.assessmentAreas || []).forEach(area => {
      const pillarName = area.name;
      (area.dimensions || []).forEach(dimension => {
        const dimensionName = dimension.name;
        (dimension.questions || []).forEach(question => {
          const questionId = question.id;
          const questionText = question.question;
          const notes = responses[`${questionId}_comment`] || '';

          const currentStatePerspective = question.perspectives?.find(p => p.id === 'current_state');
          const currentStateOptions = currentStatePerspective?.options?.map((opt, idx) => 
            `L${idx + 1}: ${opt.label}`
          ).join('\n') || '';

          const futureStatePerspective = question.perspectives?.find(p => p.id === 'future_state');
          const futureStateOptions = futureStatePerspective?.options?.map((opt, idx) => 
            `L${idx + 1}: ${opt.label}`
          ).join('\n') || '';

          const technicalPainPerspective = question.perspectives?.find(p => p.id === 'technical_pain');
          const technicalPainOptions = technicalPainPerspective?.options?.map(opt => 
            `• ${opt.label}`
          ).join('\n') || '';

          const businessPainPerspective = question.perspectives?.find(p => p.id === 'business_pain');
          const businessPainOptions = businessPainPerspective?.options?.map(opt => 
            `• ${opt.label}`
          ).join('\n') || '';

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

          const cells = [currentStateOptions, futureStateOptions, technicalPainOptions, businessPainOptions, notes];
          let maxLines = 1;
          cells.forEach(cell => {
            if (cell) {
              const lines = (cell.toString().match(/\n/g) || []).length + 1;
              maxLines = Math.max(maxLines, lines);
            }
          });

          row.height = Math.min(300, Math.max(30, maxLines * 15));

          row.eachCell((cell, colNumber) => {
            cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };

            if (colNumber === 1) {
              cell.font = { bold: true, size: 10 };
            } else {
              cell.font = { size: 10 };
            }

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

    const filename = `Assessment_${id}_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    console.log(`✅ Classic Excel exported successfully: ${filename}`);

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
