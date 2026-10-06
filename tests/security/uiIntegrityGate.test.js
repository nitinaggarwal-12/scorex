const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const readClientFile = (relPath) =>
  fs.readFileSync(path.join(ROOT, 'client/src', relPath), 'utf8');

test('UI Integrity Gate 1: UniversalObjectEditor hover toolbar is never mounted in App.js', () => {
  const appSource = readClientFile('App.js');
  assert.ok(
    !appSource.includes('UniversalObjectEditor'),
    'App.js must not import or mount UniversalObjectEditor (prevents intrusive global hover toolbar and bottom-left version bar)'
  );
});

test('UI Integrity Gate 2: Explicit Edit, Clone, and Delete controls exist across AssessmentsListNew, DynamicAssessmentHub, and DynamicAssessmentReport', () => {
  const listSource = readClientFile('components/AssessmentsListNew.js');
  assert.ok(listSource.includes('<FiEdit2 /> Edit'), 'AssessmentsListNew.js must render explicit Edit button label');
  assert.ok(listSource.includes('<FiCopy /> Clone'), 'AssessmentsListNew.js must render explicit Clone button label');
  assert.ok(listSource.includes('<FiTrash2 /> Delete'), 'AssessmentsListNew.js must render explicit Delete button label');

  const hubSource = readClientFile('components/DynamicAssessmentHub.js');
  assert.ok(hubSource.includes('handleCloneType') && hubSource.includes('handleDeleteType'), 'DynamicAssessmentHub.js must wire template Clone and Delete handlers');
  assert.ok(hubSource.includes('handleCloneInstance') && hubSource.includes('handleDeleteInstance'), 'DynamicAssessmentHub.js must wire instance Clone and Delete handlers');

  const reportSource = readClientFile('components/DynamicAssessmentReport.js');
  assert.ok(reportSource.includes('handleCloneAssessment') && reportSource.includes('handleDeleteAssessment'), 'DynamicAssessmentReport.js must wire report Clone and Delete handlers');
  assert.ok(reportSource.includes('<FiEdit3 size={14} /> Edit'), 'DynamicAssessmentReport.js must render explicit Edit button');
  assert.ok(reportSource.includes('<FiCopy size={14} /> Clone'), 'DynamicAssessmentReport.js must render explicit Clone button');
  assert.ok(reportSource.includes('<FiTrash2 size={14} /> Delete'), 'DynamicAssessmentReport.js must render explicit Delete button');
});

test('UI Integrity Gate 3: Consistent light enterprise theme across report, generator, runner, critic card, and compliance workspace', () => {
  const criticSource = readClientFile('components/OmniCriticReviewCard.js');
  assert.ok(
    !criticSource.includes('linear-gradient(145deg, #0f172a'),
    'OmniCriticReviewCard.js must use light enterprise theme (#ffffff), not dark navy gradient'
  );

  const generatorSource = readClientFile('components/DynamicAssessmentGenerator.js');
  assert.ok(
    !generatorSource.includes('background: rgba(15, 23, 42, 0.7)'),
    'DynamicAssessmentGenerator.js DimensionCard must use light theme (#f8fafc), not dark slate'
  );

  const runnerSource = readClientFile('components/DynamicAssessmentRunner.js');
  assert.ok(
    runnerSource.includes('const isDarkMode = false;'),
    'DynamicAssessmentRunner.js must lock isDarkMode = false for consistent light theme'
  );
  assert.ok(
    !runnerSource.includes('toggleThemeMode'),
    'DynamicAssessmentRunner.js must not expose a dark/light mode toggle button'
  );

  const reportSource = readClientFile('components/DynamicAssessmentReport.js');
  assert.ok(
    reportSource.includes("const theme = 'light';"),
    "DynamicAssessmentReport.js must lock theme = 'light'"
  );
  assert.ok(
    !reportSource.includes('toggleTheme'),
    'DynamicAssessmentReport.js must not expose a dark/light mode toggle button'
  );

  const euAiSource = readClientFile('components/EuAiComplianceWorkspace.js');
  assert.ok(
    !euAiSource.includes('linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'),
    'EuAiComplianceWorkspace.js Article 99 Financial Simulator card must use light enterprise theme'
  );
});

test('UI Integrity Gate 4: Zero audio player or audio briefing controls across active UI views', () => {
  const reportSource = readClientFile('components/DynamicAssessmentReport.js');
  assert.ok(
    !reportSource.includes('AudioBriefingPlayer'),
    'DynamicAssessmentReport.js must not import or mount AudioBriefingPlayer'
  );

  const euAiSource = readClientFile('components/EuAiComplianceWorkspace.js');
  assert.ok(
    !euAiSource.includes('AudioBriefingCard') && !euAiSource.includes('handleGenerateAudioBriefing'),
    'EuAiComplianceWorkspace.js must not include AudioBriefingCard or audio briefing handlers'
  );

  const criticSource = readClientFile('components/OmniCriticReviewCard.js');
  assert.ok(
    !/audio/i.test(criticSource),
    'OmniCriticReviewCard.js must not display audio storytelling references'
  );

  const walkthroughSource = readClientFile('components/InteractiveWorkflowWalkthrough.js');
  assert.ok(
    !walkthroughSource.includes('AI Executive Audio Briefing'),
    'InteractiveWorkflowWalkthrough.js must not reference AI Executive Audio Briefing'
  );
});

test('UI Integrity Gate 5: ArchitectureComparisonDiagram renders a single unified 3-Zone diagram instead of 3 stacked duplicate diagrams', () => {
  const archSource = readClientFile('components/ArchitectureComparisonDiagram.js');
  assert.ok(
    !archSource.includes('TripleDiagramGrid'),
    'ArchitectureComparisonDiagram.js must not render TripleDiagramGrid (3 stacked diagrams)'
  );
  const viewerMounts = (archSource.match(/<DiagramViewer\b/g) || []).length;
  assert.equal(
    viewerMounts,
    1,
    `ArchitectureComparisonDiagram.js must mount <DiagramViewer> exactly once (found ${viewerMounts})`
  );
});
