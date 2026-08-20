const express = require('express');
const ExcelJS = require('exceljs');
const router = express.Router();
const coreRouter = require('./excelCore');
const assessmentRepository = require('../db/assessmentRepository');
const customAssessmentRepo = require('../db/customAssessmentRepository');
const { requireAuth, canAccessResource } = require('../middleware/auth');

router.use(requireAuth);

const isAdmin = (user) => user?.role === 'admin';
const OWNER_FIELDS = ['userId', 'user_id', 'createdBy', 'created_by', 'ownerId', 'owner_id', 'assignedAuthorId', 'assigned_author_id'];

function canRead(user, resource) {
  return isAdmin(user) || canAccessResource(user, resource, OWNER_FIELDS);
}

function safeCell(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

function setWidths(worksheet, widths) {
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });
}

function styleHeaderRow(row) {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
  row.alignment = { vertical: 'middle', wrapText: true };
}

function addTitle(worksheet, title, columnCount) {
  worksheet.mergeCells(1, 1, 1, Math.max(columnCount, 1));
  const cell = worksheet.getCell(1, 1);
  cell.value = safeCell(title);
  cell.font = { bold: true, size: 16, color: { argb: 'FF0F172A' } };
  cell.alignment = { vertical: 'middle' };
  worksheet.getRow(1).height = 24;
}

async function buildDynamicWorkbook(instance, report = {}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ScoreX';
  workbook.created = new Date();
  workbook.modified = new Date();

  const framework = instance?.frameworkSnapshot || instance?.framework_snapshot || {};
  const responses = instance?.responses || {};
  const aiReport = report?.aiReport || report || {};
  const scores = report?.calculatedScores || report?.scores || {
    overallScore: instance?.totalScore ?? instance?.total_score ?? '',
    maturityLevel: instance?.maturityLevel || instance?.maturity_level || '',
    dimensionScores: instance?.scores || {}
  };
  const customer = instance?.customerName || instance?.customer_name || 'Enterprise Client';
  const title = framework?.title || 'Dynamic Architecture Assessment';

  // 1. Executive overview
  const overview = workbook.addWorksheet('Executive Overview');
  addTitle(overview, 'ScoreX Executive Assessment Overview', 2);
  overview.addRow([]);
  const overviewHeader = overview.addRow(['Field', 'Value']);
  styleHeaderRow(overviewHeader);
  [
    ['Customer / Organization', customer],
    ['Assessment Framework', title],
    ['Use Case / Scope', instance?.useCase || instance?.use_case || 'Architecture Modernization'],
    ['Overall Maturity Score', scores?.overallScore !== undefined && scores?.overallScore !== '' ? `${scores.overallScore} / 5.0` : 'N/A'],
    ['Maturity Level', scores?.maturityLevel || 'N/A'],
    ['Export Date', new Date().toISOString()],
    ['Generation Model', report?.modelUsed || instance?.modelUsed || 'Not recorded'],
    ['Executive Summary', safeCell(aiReport?.executiveSummary || 'Assessment completed. See detailed sheets for evidence and actions.')]
  ].forEach(([field, value]) => overview.addRow([field, safeCell(value)]));
  setWidths(overview, [30, 85]);
  overview.eachRow((row, rowNumber) => {
    if (rowNumber > 2) row.alignment = { vertical: 'top', wrapText: true };
  });

  // 2. Dimension maturity gaps
  const dimensions = workbook.addWorksheet('Dimension Gaps');
  const dimHeader = dimensions.addRow(['Dimension', 'Baseline Score', 'Target Score', 'Maturity Gap', 'Risk Severity', 'Weight']);
  styleHeaderRow(dimHeader);
  (framework.dimensions || []).forEach((dimension) => {
    const dScore = scores?.dimensionScores?.[dimension.id] || instance?.scores?.[dimension.id] || {};
    const currentRaw = dScore.score ?? dScore.currentScore ?? '';
    const targetRaw = dScore.targetScore ?? dScore.futureScore ?? '';
    const current = Number.isFinite(Number(currentRaw)) ? Number(currentRaw) : '';
    const target = Number.isFinite(Number(targetRaw)) ? Number(targetRaw) : '';
    const gap = current !== '' && target !== '' ? Number((target - current).toFixed(2)) : '';
    const severity = gap === '' ? 'Not calculated' : gap >= 2 ? 'High' : gap >= 1 ? 'Medium' : 'Low';
    dimensions.addRow([
      safeCell(dimension.name),
      current,
      target,
      gap,
      severity,
      Number.isFinite(Number(dimension.weight)) ? Number(dimension.weight) : 'Equal'
    ]);
  });
  setWidths(dimensions, [34, 18, 18, 18, 18, 14]);

  // 3. Recommendations — no invented quantitative values are added here.
  const recommendations = workbook.addWorksheet('Recommendations');
  const recHeader = recommendations.addRow(['Priority', 'Recommendation', 'Dimension / Pillar', 'Rationale', 'Expected Impact', 'Timeline', 'Actions']);
  styleHeaderRow(recHeader);
  const rawRecommendations = aiReport?.prioritizedRecommendations || aiReport?.prioritizedActions || [];
  rawRecommendations.forEach((recommendation, index) => {
    recommendations.addRow([
      safeCell(recommendation?.priority || `P${index + 1}`),
      safeCell(recommendation?.title || recommendation?.recommendation || 'Transformation action'),
      safeCell(recommendation?.dimension || recommendation?.pillar || ''),
      safeCell(recommendation?.whyItMatters || recommendation?.description || recommendation?.rationale || ''),
      safeCell(recommendation?.expectedImpact || recommendation?.businessImpact || ''),
      safeCell(recommendation?.timeline || recommendation?.timeframe || ''),
      safeCell(Array.isArray(recommendation?.actionSteps)
        ? recommendation.actionSteps.join('; ')
        : Array.isArray(recommendation?.actions)
          ? recommendation.actions.join('; ')
          : recommendation?.actions || '')
    ]);
  });
  setWidths(recommendations, [12, 38, 28, 52, 38, 20, 60]);
  recommendations.eachRow((row) => { row.alignment = { vertical: 'top', wrapText: true }; });

  // 4. Transformation roadmap
  const roadmap = workbook.addWorksheet('Transformation Roadmap');
  const roadHeader = roadmap.addRow(['Phase', 'Phase Name', 'Timeline', 'Strategic Focus', 'Milestones / Deliverables']);
  styleHeaderRow(roadHeader);
  const roadmapEntries = Array.isArray(aiReport?.transformationRoadmap)
    ? aiReport.transformationRoadmap
    : aiReport?.transformationRoadmap && typeof aiReport.transformationRoadmap === 'object'
      ? Object.values(aiReport.transformationRoadmap)
      : [];
  roadmapEntries.forEach((phase, index) => {
    roadmap.addRow([
      `Phase ${index + 1}`,
      safeCell(phase?.title || phase?.phaseName || phase?.name || ''),
      safeCell(phase?.timeline || phase?.timeframe || ''),
      safeCell(phase?.focus || phase?.objective || ''),
      safeCell(Array.isArray(phase?.milestones) ? phase.milestones.join('; ') : phase?.milestones || '')
    ]);
  });
  setWidths(roadmap, [14, 36, 22, 42, 70]);
  roadmap.eachRow((row) => { row.alignment = { vertical: 'top', wrapText: true }; });

  // 5. Question-level evidence matrix
  const details = workbook.addWorksheet('Detailed Responses');
  const detailsHeader = details.addRow([
    'Dimension',
    'Question ID',
    'Question Prompt',
    'Guidance',
    'Baseline Score',
    'Target Score',
    'Technical Pain Points',
    'Business Pain Points',
    'Assessor Notes'
  ]);
  styleHeaderRow(detailsHeader);
  (framework.dimensions || []).forEach((dimension) => {
    (dimension.questions || []).forEach((question) => {
      const current = responses[question.id] ?? responses[`${question.id}_current_state`] ?? '';
      const target = responses[`${question.id}_future_state`] ?? responses[`${question.id}_target`] ?? '';
      const technical = responses[`${question.id}_technical_pain`] || responses[`${question.id}_tech_pain`] || responses[`${question.id}_pain_points`] || [];
      const business = responses[`${question.id}_business_pain`] || [];
      const notes = responses[`${question.id}_comment`] || responses[`${question.id}_notes`] || '';
      details.addRow([
        safeCell(dimension.name),
        safeCell(question.id),
        safeCell(question.text || question.prompt || question.title || ''),
        safeCell(question.guidance || ''),
        current,
        target,
        safeCell(Array.isArray(technical) ? technical.join('; ') : technical),
        safeCell(Array.isArray(business) ? business.join('; ') : business),
        safeCell(notes)
      ]);
    });
  });
  setWidths(details, [28, 22, 52, 42, 16, 16, 42, 42, 50]);
  details.eachRow((row) => { row.alignment = { vertical: 'top', wrapText: true }; });

  return workbook;
}

// Dynamic export must be registered before the generic /:id middleware.
router.post('/dynamic/:id/export', async (req, res) => {
  try {
    const instance = await customAssessmentRepo.getInstanceById(req.params.id);
    if (!instance) return res.status(404).json({ error: 'Assessment instance not found' });
    if (!canRead(req.user, instance)) return res.status(403).json({ error: 'Access denied' });

    // Report data is used only to shape this caller's download and is never persisted.
    const report = req.body?.report && typeof req.body.report === 'object' ? req.body.report : {};
    const workbook = await buildDynamicWorkbook(instance, report);
    const buffer = await workbook.xlsx.writeBuffer();
    const customer = instance?.customerName || instance?.customer_name || 'assessment';
    const framework = instance?.frameworkSnapshot || instance?.framework_snapshot || {};
    const safeCustomer = String(customer).replace(/[^a-z0-9_-]+/gi, '_').slice(0, 80);
    const safeTitle = String(framework?.title || 'ScoreX_Assessment').replace(/[^a-z0-9_-]+/gi, '_').slice(0, 80);
    const fileName = `${safeCustomer}_${safeTitle}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('[Excel] Dynamic export failed:', error.message);
    return res.status(500).json({ error: 'Failed to generate dynamic assessment workbook' });
  }
});

// Classic export and any other ID-scoped export: admin may access all; authors/consumers/demo
// must own or be assigned the resource.
router.use('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let assessment = await assessmentRepository.findById(id);
    if (!assessment) assessment = await customAssessmentRepo.getInstanceById(id);

    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
    if (!canRead(req.user, assessment)) return res.status(403).json({ error: 'Access denied' });
    return next();
  } catch (error) {
    console.error('[Excel] Export authorization failed:', error.message);
    return res.status(500).json({ error: 'Unable to validate assessment access' });
  }
});

router.use(coreRouter);

module.exports = router;
