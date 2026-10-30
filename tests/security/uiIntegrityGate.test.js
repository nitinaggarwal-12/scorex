const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const readClientFile = (relPath) =>
  fs.readFileSync(path.join(ROOT, 'client/src', relPath), 'utf8');

test('UI Integrity Gate 1: UniversalObjectEditor hover toolbar is never mounted in App.js and purged from disk', () => {
  const appSource = readClientFile('App.js');
  assert.ok(
    !appSource.includes('UniversalObjectEditor'),
    'App.js must not import or mount UniversalObjectEditor (prevents intrusive global hover toolbar and bottom-left version bar)'
  );
  assert.ok(
    !fs.existsSync(path.join(ROOT, 'client/src/components/UniversalObjectEditor.js')),
    'Orphaned client/src/components/UniversalObjectEditor.js must be permanently purged from disk'
  );
});

test('UI Integrity Gate 2: Explicit Edit, Clone, and Delete controls exist across all 7 active entity/workspace components', () => {
  const listSource = readClientFile('components/AssessmentsListNew.js');
  assert.ok(listSource.includes('<FiEdit2 /> Edit'), 'AssessmentsListNew.js must render explicit Edit button label');
  assert.ok(listSource.includes('<FiCopy /> Clone'), 'AssessmentsListNew.js must render explicit Clone button label');
  assert.ok(listSource.includes('<FiTrash2 /> Delete'), 'AssessmentsListNew.js must render explicit Delete button label');
  assert.ok(
    !fs.existsSync(path.join(ROOT, 'client/src/components/DynamicAssessmentHub.js')),
    'Orphaned duplicate client/src/components/DynamicAssessmentHub.js must be permanently purged from disk'
  );

  const reportSource = readClientFile('components/DynamicAssessmentReport.js');
  assert.ok(reportSource.includes('handleCloneAssessment') && reportSource.includes('handleDeleteAssessment'), 'DynamicAssessmentReport.js must wire report Clone and Delete handlers');
  assert.ok(reportSource.includes('<FiEdit3 size={14} /> Edit'), 'DynamicAssessmentReport.js must render explicit Edit button');
  assert.ok(reportSource.includes('<FiCopy size={14} /> Clone'), 'DynamicAssessmentReport.js must render explicit Clone button');
  assert.ok(reportSource.includes('<FiTrash2 size={14} /> Delete'), 'DynamicAssessmentReport.js must render explicit Delete button');

  const portfolioSource = readClientFile('components/CustomerPortfolioDashboard.js');
  assert.ok(portfolioSource.includes('handleClone') && portfolioSource.includes('handleDelete'), 'CustomerPortfolioDashboard.js must wire Clone and Delete handlers');
  assert.ok(portfolioSource.includes('Edit') && portfolioSource.includes('Clone') && portfolioSource.includes('Delete'), 'CustomerPortfolioDashboard.js must render explicit Edit, Clone, and Delete buttons');

  const euAiSource = readClientFile('components/EuAiComplianceWorkspace.js');
  assert.ok(/<FiEdit3\b[^>]*>\s*Edit\b/.test(euAiSource), 'EuAiComplianceWorkspace.js must render explicit Edit button');
  assert.ok(/<FiCopy\b[^>]*>\s*Clone\b/.test(euAiSource), 'EuAiComplianceWorkspace.js must render explicit Clone button');
  assert.ok(/<FiTrash2\b[^>]*>\s*Delete\b/.test(euAiSource), 'EuAiComplianceWorkspace.js must render explicit Delete button');

  const geVrSource = readClientFile('components/GeValueRealizationWorkspace.js');
  assert.ok(geVrSource.includes('<FiEdit3 size={12} /> Edit'), 'GeValueRealizationWorkspace.js must render explicit Edit button');
  assert.ok(geVrSource.includes('<FiCopy size={12} /> Clone'), 'GeValueRealizationWorkspace.js must render explicit Clone button');
  assert.ok(geVrSource.includes('<FiTrash2 size={12} /> Delete'), 'GeValueRealizationWorkspace.js must render explicit Delete button');

  const qmSource = readClientFile('components/QuestionManager.js');
  assert.ok(qmSource.includes('handleEdit') && qmSource.includes('handleClone') && qmSource.includes('handleDelete'), 'QuestionManager.js must implement Edit, Clone, and Delete handlers');

  const deepDiveSource = readClientFile('components/DeepDive.js');
  assert.ok(deepDiveSource.includes('handleEdit') && deepDiveSource.includes('handleClone') && deepDiveSource.includes('handleDelete'), 'DeepDive.js must implement Edit, Clone, and Delete handlers');
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
  assert.ok(
    !euAiSource.includes('FiMic') && !euAiSource.includes('FiVolume') && !euAiSource.includes('$audio'),
    'EuAiComplianceWorkspace.js must not contain leftover audio icon imports or $audio styles'
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

test('UI Integrity Gate 6: Codebase-wide scan across all components in client/src/components enforces zero dark (#0f172a / #1e293b / #090d16 / #0b132b) container backgrounds', () => {
  const componentsDir = path.join(ROOT, 'client/src/components');
  const componentFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.js'));
  assert.ok(componentFiles.length >= 40, `Expected at least 40 components in client/src/components, found ${componentFiles.length}`);

  const forbiddenBgPattern = /background(-color|Color)?\s*:\s*['"]?(#0f172a|#1e293b|#090d16|#0b132b)\b/i;
  const forbiddenGradientPattern = /linear-gradient\([^\n;]*(#0f172a|#1e293b|#090d16|#0b132b)/i;

  for (const file of componentFiles) {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    const bgMatch = content.match(forbiddenBgPattern);
    assert.equal(
      bgMatch,
      null,
      `Component ${file} contains forbidden dark background "${bgMatch ? bgMatch[0] : ''}" — must use light enterprise palette (#ffffff / #f8fafc / #f1f5f9 / #eff6ff)`
    );
    const gradMatch = content.match(forbiddenGradientPattern);
    assert.equal(
      gradMatch,
      null,
      `Component ${file} contains forbidden dark gradient "${gradMatch ? gradMatch[0] : ''}" — must use light enterprise palette`
    );
  }
});

test('UI Integrity Gate 7: Zero occurrences of banned consulting brands (McKinsey, Stratagem) across components, mocks, and server', () => {
  const geVrSource = readClientFile('components/GeValueRealizationWorkspace.js');
  assert.ok(!/mckinsey/i.test(geVrSource), 'GeValueRealizationWorkspace.js must not contain McKinsey references');
  assert.ok(!/stratagem\/google/i.test(geVrSource), 'GeValueRealizationWorkspace.js must not contain Stratagem/Google references');

  const mockPath = path.join(ROOT, 'ge_vr_executive_ui_mock.html');
  if (fs.existsSync(mockPath)) {
    const mockSource = fs.readFileSync(mockPath, 'utf8');
    assert.ok(!/mckinsey/i.test(mockSource), 'ge_vr_executive_ui_mock.html must not contain McKinsey references');
    assert.ok(!/stratagem\/google/i.test(mockSource), 'ge_vr_executive_ui_mock.html must not contain Stratagem/Google references');
  }

  const ingestorPath = path.join(ROOT, 'server/services/geCustomerMultiSourceIngestor.js');
  if (fs.existsSync(ingestorPath)) {
    const ingestorSource = fs.readFileSync(ingestorPath, 'utf8');
    assert.ok(!/mckinsey/i.test(ingestorSource), 'geCustomerMultiSourceIngestor.js must not contain McKinsey references');
  }
});

test('UI Integrity Gate 8: Zero thread-blocking window.prompt, window.alert, or window.confirm calls in GeValueRealizationWorkspace.js and AssessmentsListNew.js', () => {
  const geVrSource = readClientFile('components/GeValueRealizationWorkspace.js');
  assert.ok(!geVrSource.includes('window.prompt('), 'GeValueRealizationWorkspace.js must not use thread-blocking window.prompt()');
  assert.ok(!geVrSource.includes('window.alert('), 'GeValueRealizationWorkspace.js must not use thread-blocking window.alert()');
  assert.ok(!geVrSource.includes('window.confirm('), 'GeValueRealizationWorkspace.js must not use thread-blocking window.confirm()');
  assert.ok(geVrSource.includes('showCustomSfdcInput'), 'GeValueRealizationWorkspace.js must implement non-blocking inline custom SFDC input mode');

  const listSource = readClientFile('components/AssessmentsListNew.js');
  assert.ok(!listSource.includes('window.confirm('), 'AssessmentsListNew.js must not use thread-blocking window.confirm()');
});

test('UI Integrity Gate 9: 100% fluid edge-to-edge layout across all pages and zero rigid max-width 1400px/1440px/1560px page containers', () => {
  const geVrSource = readClientFile('components/GeValueRealizationWorkspace.js');
  assert.ok(
    geVrSource.includes("width: '100%'") && geVrSource.includes("maxWidth: '100%'"),
    'GeValueRealizationWorkspace.js container must enforce 100% fluid width'
  );
  assert.ok(!geVrSource.includes("maxWidth: '1560px'"), 'GeValueRealizationWorkspace.js must not constrain container to maxWidth: 1560px');
  assert.ok(!geVrSource.includes("maxWidth: '1440px'"), 'GeValueRealizationWorkspace.js must not constrain container to maxWidth: 1440px');

  const fluidPageFiles = [
    'components/HomePageNew.js',
    'components/AssessmentStart.js',
    'components/AssessmentsListNew.js',
    'components/ExecutiveCommandCenter.js',
    'components/ExecutiveSummaryNew.js',
    'components/AssessmentDashboard.js',
    'components/MyAssessments.js',
    'components/FeedbackForm.js',
    'components/UserGuide.js',
    'components/AuthorAssignments.js',
    'components/AssessmentHeader.js',
    'components/AssessmentDetails.js',
    'components/PitchDeck.js',
    'components/AssessmentHistory.js'
  ];

  for (const relFile of fluidPageFiles) {
    const src = readClientFile(relFile);
    assert.ok(
      src.includes('max-width: 100%') || src.includes("maxWidth: '100%'"),
      `${relFile} must enforce 100% fluid max-width container`
    );
  }

  const mockPath = path.join(ROOT, 'ge_vr_executive_ui_mock.html');
  if (fs.existsSync(mockPath)) {
    const mockSource = fs.readFileSync(mockPath, 'utf8');
    assert.ok(mockSource.includes('max-width: 100%'), 'ge_vr_executive_ui_mock.html must enforce 100% fluid width');
    assert.ok(!mockSource.includes('max-width: 1440px'), 'ge_vr_executive_ui_mock.html must not constrain container to max-width: 1440px');
  }
});

test('UI Integrity Gate 10: Verified Mars, Inc. and H-E-B, LP grounded customer records exist in geCustomerMultiSourceIngestor.js', () => {
  const ingestorPath = path.join(ROOT, 'server/services/geCustomerMultiSourceIngestor.js');
  const ingestorSource = fs.readFileSync(ingestorPath, 'utf8');
  assert.ok(ingestorSource.includes('0014M00001hqyrvQAA'), 'geCustomerMultiSourceIngestor.js must contain verified Mars SFDC ID 0014M00001hqyrvQAA');
  assert.ok(ingestorSource.includes('0014M00001hcTvLQAU'), 'geCustomerMultiSourceIngestor.js must contain verified H-E-B SFDC ID 0014M00001hcTvLQAU');
  assert.ok(ingestorSource.includes('50000') || ingestorSource.includes('50,000'), 'geCustomerMultiSourceIngestor.js must ground Mars 50,000 seats');
  assert.ok(ingestorSource.includes('45000') || ingestorSource.includes('45,000'), 'geCustomerMultiSourceIngestor.js must ground H-E-B 45,000 seats');
});

test('UI Integrity Gate 11: Assessment Workspace Horizontal 10-Module Tab Bar, Zero Duplicate Header/Card Clutter, and Clean New-Assessment Isolation', () => {
  const geVrSource = readClientFile('components/GeValueRealizationWorkspace.js');
  assert.ok(
    geVrSource.includes('const [showSavedHubDrawer, setShowSavedHubDrawer] = useState(false);'),
    'GeValueRealizationWorkspace.js must default showSavedHubDrawer to false so New Assessment never opens Saved Hub on load'
  );
  assert.ok(
    geVrSource.includes('id="ge-module-tabs-bar"'),
    'GeValueRealizationWorkspace.js must render Horizontal 10-Module Tab Bar (#ge-module-tabs-bar)'
  );
  assert.ok(
    !geVrSource.includes('id="ge-batch-actions-select"'),
    'GeValueRealizationWorkspace.js must not render duplicate #ge-batch-actions-select dropdown'
  );
  assert.ok(
    !geVrSource.includes('Decision Rationale & Grounded Evidence:'),
    'GeValueRealizationWorkspace.js question cards must not render duplicate bottom rationale/citation block'
  );

  const listSource = readClientFile('components/AssessmentsListNew.js');
  assert.ok(
    listSource.includes("{viewMode === 'dossiers' && ("),
    'AssessmentsListNew.js must isolate Saved Customer Dossiers behind viewMode === "dossiers"'
  );
  assert.ok(
    !listSource.includes('Show Both Views'),
    'AssessmentsListNew.js must not mix Blueprints and Saved Dossiers via Show Both Views'
  );

  const startSource = readClientFile('components/AssessmentStart.js');
  assert.ok(
    startSource.includes('const [groundingPreviewOpen, setGroundingPreviewOpen] = useState(false);'),
    'AssessmentStart.js must keep groundingPreviewOpen collapsed by default'
  );
  assert.ok(
    !startSource.includes('Quantum FinTech Global'),
    'AssessmentStart.js must not pre-populate hardcoded Quantum FinTech Global customer strings on New Assessment'
  );
});

test('UI Integrity Gate 12: Omni 1.1 E2E Executive Review Invariants (Deep-Link Tab Sync, Light-Theme Release Gate Banner, Dynamic Report 4-Card Hero Strip & Tab 4 Isolation, Instance ID Resolution)', () => {
  const geVrSource = readClientFile('components/GeValueRealizationWorkspace.js');
  assert.ok(
    geVrSource.includes("tabParam === 'provenance'") && geVrSource.includes("nextTab === 'provenance'"),
    'GeValueRealizationWorkspace.js must route ?tab=provenance and ?tab=audit to Tab 3 (math/provenance)'
  );
  assert.ok(
    !geVrSource.includes('linear-gradient(90deg, #7f1d1d'),
    'GeValueRealizationWorkspace.js Tab 2 Release Gate banner must use Executive Light Theme (#fff1f2 / #ecfdf5), not dark crimson #7f1d1d'
  );

  const dynReportSource = readClientFile('components/DynamicAssessmentReport.js');
  assert.ok(
    !dynReportSource.includes('$isActive={activeExecutiveTab === "roadmap" || activeExecutiveTab === "audit"}'),
    'DynamicAssessmentReport.js Tab 4 must not highlight simultaneously when Tab 5 (roadmap) is active'
  );
  assert.ok(
    dynReportSource.includes('4-Card Full-Width Executive Telemetry Strip'),
    'DynamicAssessmentReport.js HeroCard must render the 4-Card Full-Width Executive Telemetry Strip'
  );

  const dynRunnerSource = readClientFile('components/DynamicAssessmentRunner.js');
  assert.ok(
    dynRunnerSource.includes("typeKey && typeKey.startsWith('inst_')"),
    'DynamicAssessmentRunner.js must resolve inst_* instance IDs passed via /assessments/run/:typeKey'
  );
  assert.ok(
    !dynRunnerSource.includes("!k.includes('_')"),
    'DynamicAssessmentRunner.js must not filter out question IDs containing underscores (cost_01, api_01) when computing totalAnswered'
  );

  const eccSource = readClientFile('components/ExecutiveCommandCenter.js');
  assert.ok(
    eccSource.includes("let activeId = assessmentId || 'inst_enterprise_data_ai_maturity_demo';"),
    'ExecutiveCommandCenter.js must default activeId to inst_enterprise_data_ai_maturity_demo for instant <250ms loading'
  );

  const pcServiceSource = fs.readFileSync(path.join(ROOT, 'server/services/promptCanvasService.js'), 'utf8');
  assert.ok(
    pcServiceSource.includes('if (options.forceLiveAi)'),
    'promptCanvasService.js must guard external 60s network generation behind options.forceLiveAi'
  );

  const appSource = readClientFile('App.js');
  assert.ok(
    appSource.includes('path="/executive-command-center"'),
    'App.js must expose /executive-command-center route alias alongside /executive-dashboard'
  );
});

test('UI Integrity Gate 13: Question Form Layout, 3-Column Non-Truncating Input Grid, 2x2 Intake Grid & Semantic 4-Column Runner Theme (Rule 50G)', () => {
  const geVrSource = readClientFile('components/GeValueRealizationWorkspace.js');
  assert.ok(
    geVrSource.includes('formatInputTypeLabel(q.inputType)'),
    'GeValueRealizationWorkspace.js must format inputType via formatInputTypeLabel() instead of rendering raw snake_case'
  );
  assert.ok(
    geVrSource.includes("gridTemplateColumns: 'minmax(0, 2.15fr) minmax(175px, 0.9fr) minmax(150px, 0.75fr)'"),
    'GeValueRealizationWorkspace.js question card input row must use balanced 3-column non-truncating grid (2.15fr / 0.9fr / 0.75fr)'
  );
  assert.ok(
    !geVrSource.includes('Evidence Source & Owner'),
    'GeValueRealizationWorkspace.js must merge Evidence Source & Owner into the unified 1-line provenance footer rather than a duplicate 4th input column'
  );
  assert.ok(
    geVrSource.includes('Tier A (90–100% • 1.00x)'),
    'GeValueRealizationWorkspace.js CONFIDENCE_OPTIONS must use concise non-truncating Tier A–E labels'
  );

  const startSource = readClientFile('components/AssessmentStart.js');
  assert.ok(
    !startSource.includes('#ff6b35'),
    'AssessmentStart.js must harmonize all controls to the ScoreX Enterprise Blue (#2563eb) light theme with zero legacy #ff6b35 orange'
  );
  assert.ok(
    startSource.includes('const IntakeFieldsGrid = styled.div`'),
    'AssessmentStart.js must render a 2x2 IntakeFieldsGrid so all 4 core intake fields and 6 pillars fit above the fold'
  );

  const dynRunnerSource = readClientFile('components/DynamicAssessmentRunner.js');
  assert.ok(
    !dynRunnerSource.includes('#ff6b35'),
    'DynamicAssessmentRunner.js must contain zero legacy #ff6b35 orange colors'
  );
  assert.ok(
    dynRunnerSource.includes('$variant="future"') && dynRunnerSource.includes('$variant="business"'),
    'DynamicAssessmentRunner.js must differentiate Current State (#2563eb Blue), Future State ($variant="future" #059669 Emerald), Technical Pain (#e11d48 Rose), and Business Pain ($variant="business" #d97706 Amber)'
  );
});

test('UI Integrity Gate 14: Forensic Mathematical, Logical, Factual & Completeness Invariants Across All 5 Assessment Subsystems (Rule 50H / L60-14..L60-19)', () => {
  // 1. Zero consulting brand leaks in backend services & permanent purge of static HTML mockups
  const ingestorSrc = fs.readFileSync(path.join(ROOT, 'server/services/geCustomerMultiSourceIngestor.js'), 'utf8');
  const recEngineSrc = fs.readFileSync(path.join(ROOT, 'server/services/intelligentRecommendationEngine_v2.js'), 'utf8');
  assert.ok(!/Stratagem|McKinsey|\bMcK\b|Quantiphi|Deloitte|Accenture|\bPwC\b|\bKPMG\b|\bBCG\b|\bBain\b|Slalom/i.test(ingestorSrc), 'geCustomerMultiSourceIngestor.js must contain 0 prohibited consulting brand references');
  assert.ok(!/Stratagem|McKinsey|\bMcK\b|Quantiphi|Deloitte|Accenture|\bPwC\b|\bKPMG\b|\bBCG\b|\bBain\b|Slalom/i.test(recEngineSrc), 'intelligentRecommendationEngine_v2.js must contain 0 prohibited consulting brand references');
  assert.ok(!fs.existsSync(path.join(ROOT, 'ge_vr_executive_ui_mock.html')), 'Root ge_vr_executive_ui_mock.html must be permanently purged');
  assert.ok(!fs.existsSync(path.join(ROOT, 'client/public/ge_vr_executive_ui_mock.html')), 'client/public/ge_vr_executive_ui_mock.html must be permanently purged');
  assert.ok(!fs.existsSync(path.join(ROOT, 'client/public/ge_value_realization_figma_mockup.html')), 'client/public/ge_value_realization_figma_mockup.html must be permanently purged');

  // 2. GE Value Realization Framework pre-staged profiles & 10 ingested dossiers
  const { createInitialGeDossier, evaluateGeValueRealization } = require('../../server/data/geValueRealizationFramework');
  const presetKeys = ['bionova_draft', 'aerovanguard_default', 'omnimart_retail', 'siliconcore_tech', 'apexglobal_advisory'];
  for (const presetKey of presetKeys) {
    const dossier = createInitialGeDossier(presetKey);
    const tel = dossier.adoptionTelemetry;
    assert.ok(
      tel.wauAllApi > 0 &&
      tel.wauAllApi <= tel.mauMultiApi &&
      tel.mauMultiApi <= tel.assignedSeats &&
      tel.assignedSeats <= tel.provisionedSeats &&
      tel.provisionedSeats <= tel.contractedSeats,
      `Pre-staged customer ${presetKey} must obey 0 < WAU <= MAU <= Assigned <= Provisioned <= Contracted`
    );
    const ev = evaluateGeValueRealization(dossier);
    assert.strictEqual(ev.index.answeredCount, 82, `${presetKey} must have 82/82 answered questions`);
    assert.strictEqual(ev.index.pendingCount, 0, `${presetKey} must have 0 pending questions`);
    assert.strictEqual(ev.index.completenessPct, 100, `${presetKey} must have 100% completeness`);
    assert.ok(ev.index.verifiedCount <= ev.index.answeredCount, `${presetKey} verifiedCount must be <= answeredCount`);
    assert.strictEqual(ev.contradictions.length, 0, `${presetKey} must have 0 mathematical/logical contradictions`);
    const fc = ev.financials.fiveColumns;
    assert.ok(
      fc.col2ValidatedCapacity.valueAnnualBase <= fc.col3ModeledOpportunity.base,
      `${presetKey} Column 2 Validated Capacity ($${fc.col2ValidatedCapacity.valueAnnualBase}) must be <= Column 3 Modeled Opportunity ($${fc.col3ModeledOpportunity.base})`
    );
  }

  const geDossiers = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ge_value_realization_dossiers.json'), 'utf8'));
  const geEntries = Object.values(geDossiers);
  assert.strictEqual(geEntries.length, 10, 'data/ge_value_realization_dossiers.json must contain all 10 canonical enterprise customer dossiers');
  for (const d of geEntries) {
    const ev = d.evaluation;
    assert.strictEqual(ev.index.answeredCount, 82, `Dossier ${d.id} must have 82/82 answered questions`);
    assert.strictEqual(ev.index.pendingCount, 0, `Dossier ${d.id} must have 0 pending questions`);
    assert.strictEqual(ev.index.completenessPct, 100, `Dossier ${d.id} must have 100% completeness`);
    assert.ok(ev.index.verifiedCount <= ev.index.answeredCount, `Dossier ${d.id} verifiedCount must be <= answeredCount`);
    assert.strictEqual(ev.contradictions.length, 0, `Dossier ${d.id} must have 0 contradictions`);
    const fc = ev.financials.fiveColumns;
    assert.ok(
      fc.col2ValidatedCapacity.valueAnnualBase <= fc.col3ModeledOpportunity.base,
      `Dossier ${d.id} Column 2 Validated Capacity must be <= Column 3 Modeled Opportunity`
    );
  }

  // 3. Custom Assessment Templates & 6 Dynamic Assessment Instances
  const dynTypes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/custom_assessment_types.json'), 'utf8'));
  assert.strictEqual(Object.keys(dynTypes).length, 6, 'data/custom_assessment_types.json must contain 6 production templates');
  for (const [k, tpl] of Object.entries(dynTypes)) {
    assert.ok(tpl.category && tpl.category.length > 2, `Template ${k} must have a non-empty category`);
    assert.ok(Number(tpl.totalQuestions) >= 10, `Template ${k} must have totalQuestions >= 10`);
  }

  const dynInstances = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/dynamic_assessments.json'), 'utf8'));
  const dynValues = Object.values(dynInstances);
  assert.strictEqual(dynValues.length, 6, 'data/dynamic_assessments.json must contain 6 starter instances');
  const seenDynScores = new Set();
  for (const inst of dynValues) {
    const dimScores = Object.values(inst.scores || {}).map(d => d.score);
    const meanDimScore = Number((dimScores.reduce((a, b) => a + b, 0) / dimScores.length).toFixed(2));
    assert.strictEqual(
      inst.totalScore,
      meanDimScore,
      `Dynamic instance ${inst.id} totalScore (${inst.totalScore}) must equal exact mean of dimensionScores (${meanDimScore})`
    );
    seenDynScores.add(inst.totalScore);
  }
  assert.strictEqual(seenDynScores.size, 6, 'All 6 dynamic assessment instances must have strictly distinct totalScore values');

  // 4. Core 6-Pillar Enterprise Assessments & Docker/Gcloud Inclusion
  const dockerignore = fs.readFileSync(path.join(ROOT, '.dockerignore'), 'utf8');
  const gcloudignore = fs.readFileSync(path.join(ROOT, '.gcloudignore'), 'utf8');
  assert.ok(!/^data\/assessments\.json$/m.test(dockerignore), '.dockerignore must not exclude data/assessments.json');
  assert.ok(!/^data\/assessments\.json$/m.test(gcloudignore), '.gcloudignore must not exclude data/assessments.json');

  const coreAssessments = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/assessments.json'), 'utf8'));
  const coreValues = Object.values(coreAssessments);
  assert.strictEqual(coreValues.length, 4, 'data/assessments.json must contain 4 canonical 6-pillar enterprise assessments');
  const seenCoreScores = new Set();
  for (const c of coreValues) {
    assert.strictEqual(c.selectedPillars.length, 6, `Core assessment ${c.id} must select all 6 pillars`);
    assert.ok(c.overallScore > 0 && c.futureScore > c.overallScore, `Core assessment ${c.id} must have valid overallScore and futureScore`);
    assert.strictEqual(c.gap, Number((c.futureScore - c.overallScore).toFixed(2)), `Core assessment ${c.id} gap must equal futureScore - overallScore`);
    assert.ok(c.maturityLevel && c.maturityLevel !== 'Pending', `Core assessment ${c.id} must have a computed maturityLevel`);
    seenCoreScores.add(c.overallScore);
  }
  assert.strictEqual(seenCoreScores.size, 4, 'All 4 core 6-pillar assessments must have strictly distinct overallScore values');

  // 5. GenAI Readiness Assessments
  const genaiAssessments = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/genai_assessments.json'), 'utf8'));
  const genaiValues = Object.values(genaiAssessments);
  assert.strictEqual(genaiValues.length, 3, 'data/genai_assessments.json must contain 3 complete 30-question GenAI Readiness assessments');
  for (const g of genaiValues) {
    assert.strictEqual(Object.keys(g.responses || {}).length, 30, `GenAI assessment ${g.id} must have all 30 question responses`);
    const sumDims = Object.values(g.scores || {}).reduce((acc, d) => acc + Number(d.score || 0), 0);
    assert.strictEqual(g.totalScore, sumDims, `GenAI assessment ${g.id} totalScore (${g.totalScore}) must equal sum of 6 dimension scores (${sumDims})`);
    assert.strictEqual(g.maxScore, 160, `GenAI assessment ${g.id} maxScore must be 160`);
    assert.ok(['Initial', 'Developing', 'Defined', 'Managed', 'Optimizing'].includes(g.maturityLevel), `GenAI assessment ${g.id} must have a valid maturityLevel (${g.maturityLevel})`);
  }
});

test('UI Integrity Gate 15: Zero Dropdown Option-Value Mismatches Across All 82 Questions & 10 Accounts, Clean Option Text, Non-Clipped Provenance & Accurate Module Badges (Rule 50I / L60-20)', () => {
  const {
    GE_QUESTIONS,
    createInitialGeDossier,
    getQuestionOptionsWithConfidence
  } = require('../../server/data/geValueRealizationFramework');

  const presetKeys = ['bionova_draft', 'aerovanguard_default', 'omnimart_retail', 'siliconcore_tech', 'apexglobal_advisory'];
  const geDossiers = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ge_value_realization_dossiers.json'), 'utf8'));
  const allDossiers = [
    ...presetKeys.map((k) => createInitialGeDossier(k)),
    ...Object.values(geDossiers)
  ];
  for (const d of allDossiers) {
    for (const q of GE_QUESTIONS) {
      const resp = d.questionResponses?.[q.id];
      assert.ok(resp && resp.value !== null && resp.value !== undefined && resp.value !== '', `Dossier ${d.id} question ${q.id} must have a grounded value`);
      if (!Array.isArray(resp.value)) {
        const opts = getQuestionOptionsWithConfidence(q, resp, d);
        if (opts.length > 0 && (q.inputType === 'single_select' || !q.inputType || q.inputType === 'text')) {
          const matched = opts.some((o) => o.optionText === String(resp.value) || o.isSelected);
          assert.ok(
            matched,
            `Dossier ${d.id} question ${q.id} value "${resp.value}" must match an option in getQuestionOptionsWithConfidence (${JSON.stringify(opts.map((o) => o.optionText))})`
          );
        }
      }
    }
  }

  // 2. Verify GeValueRealizationWorkspace.js UI invariants
  const wsSrc = fs.readFileSync(path.join(ROOT, 'client/src/components/GeValueRealizationWorkspace.js'), 'utf8');
  assert.ok(
    wsSrc.includes('{modAnswered}/{modQuestions.length}'),
    'Module pill tabs in #ge-module-tabs-bar must display {modAnswered}/{modQuestions.length} so fully grounded modules never show 0/13 or 0/10'
  );
  assert.ok(
    wsSrc.includes("String(rf.title).replace(/\\s*\\(All\\s+\\d+\\s+Qs\\)\\s*$/i, '')"),
    '#ge-stakeholder-role-select must strip duplicate (All 82 Qs) from respondent form title'
  );
  assert.ok(
    !wsSrc.includes('{opt.optionText} ({opt.confidencePct}% • Tier {opt.confidenceTier}'),
    'Question card <select> options must render clean {opt.optionText} without redundant confidence/tier suffixes that truncate answers and duplicate Column 2'
  );
  assert.ok(
    wsSrc.includes("alignItems: 'stretch'") && wsSrc.includes("height: '44px'") && wsSrc.includes("height: '38px'") && wsSrc.includes('WebkitLineClamp: 2'),
    'Question cards must enforce 100% 4-Band Uniform Card Architecture (alignItems: stretch, fixed 44px Title+Required Entry band, fixed 56px 3-column <select> band, and fixed 68px 2-line clamped Provenance footer)'
  );
  assert.ok(
    !wsSrc.includes('ge-question-multiselect-') && !wsSrc.includes('ge-wizard-multiselect-') && !wsSrc.includes('+ Add Option ('),
    'Question cards and Wizard view must use a single uniform <select> control across all 82 questions without multi-row chip clouds or "+ Add Option (...)" placeholders'
  );
  assert.ok(
    !wsSrc.includes('handleAcceptAnswer') && !wsSrc.includes('handleStartModifyAnswer') && !wsSrc.includes('handleSwitchPreset') && !wsSrc.includes('ge-nonblocking-modify-drawer'),
    'GeValueRealizationWorkspace.js must contain zero unreferenced dead functions or unreachable legacy drawers'
  );
  const clientCatalog = fs.readFileSync(path.join(ROOT, 'client/src/services/masterBlueprintCatalog.js'), 'utf8');
  const serverCatalog = fs.readFileSync(path.join(ROOT, 'server/services/masterBlueprintCatalog.js'), 'utf8');
  for (const deadFn of ['getLegacyMasterArchitectureDiagramsUnused', 'buildGcpDataLakehouseWbsXml', 'buildAgenticEvalSafetyXml', 'buildAgenticRagWidescreenXml', 'buildLegacyFinOpsWasteXml']) {
    assert.ok(!clientCatalog.includes(deadFn) && !serverCatalog.includes(deadFn), `Dead function ${deadFn} must be purged from client and server masterBlueprintCatalog.js`);
  }
  assert.ok(!fs.existsSync(path.join(ROOT, 'client/src/components/AudioBriefingPlayer.js')), 'Orphaned AudioBriefingPlayer.js must be purged from disk');
  assert.ok(!fs.existsSync(path.join(ROOT, 'client/src/services/notificationService.js')), 'Orphaned client notificationService.js must be purged from disk');
  assert.ok(!fs.existsSync(path.join(ROOT, 'server/utils/storageAdapter.js')), 'Orphaned server storageAdapter.js must be purged from disk');
  assert.ok(
    wsSrc.includes("whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4, fontWeight: 600, color: '#334155'"),
    'Question card Row 4 whySelected rationale must wrap cleanly inside a uniform 2-line clamped container without single-line ellipsis truncation'
  );
  assert.ok(
    wsSrc.includes('id="no-matching-cards"'),
    'GeValueRealizationWorkspace.js must render #no-matching-cards resilient empty state when filters return 0 questions (Rule 25K)'
  );
  assert.ok(
    !wsSrc.includes('Randomize All 82 Options First'),
    'Bottom Executive Synthesizer Banner must not expose a destructive Randomize All 82 Options First button next to Submit'
  );
});

test('UI Integrity Gate 16: Transitive Dead-Code Purge, Dynamic Exhibit 1B Financial Math, F01 $120/hr Rate Parity & Zero Hardcoded Fallback Floors (Rule 50J)', () => {
  // 1. Verify unreachable dead files identified via transitive import graph are permanently purged
  const purgedDeadPaths = [
    'client/src/components/Dashboard.js',
    'client/src/components/Header.js',
    'client/src/components/HomeButton.js',
    'client/src/data/assessmentFramework.js',
    'server/services/intelligentRecommendationEngine.js',
    'server/services/contextAwareRecommendationEngine.js',
    'server/db/migrate.js',
    'server/migrations',
    'server/db/migrations/007_add_test_users.sql',
    'ge_vr_executive_ui_mock.html',
    'client/public/ge_vr_executive_ui_mock.html',
    'client/public/ge_value_realization_figma_mockup.html',
    'client/public/workflow-demo.html',
    'client/public/databricks-logo.svg',
    'deploy-to-railway.sh',
    'railway.json',
    'fly.toml',
    'render.yaml',
    'vercel.json',
    'app.yaml',
    'db-sync',
    'api',
    'scratch'
  ];
  for (const rel of purgedDeadPaths) {
    assert.ok(!fs.existsSync(path.join(ROOT, rel)), `Dead/legacy path ${rel} must be permanently purged from disk`);
  }

  // 2. Verify Exhibit 1B dynamic workflow math & zero conflicting L01 baseline cost strings
  const wsSrc = readClientFile('components/GeValueRealizationWorkspace.js');
  for (const bannedStaticStr of ['$1.85M/yr', '$1.65M/yr', '~$0.95M/yr', '$40M quarantined', 'dossier.legacyRetirement']) {
    assert.ok(!wsSrc.includes(bannedStaticStr), `GeValueRealizationWorkspace.js Exhibit 1B must not contain hardcoded/conflicting string "${bannedStaticStr}"`);
  }
  assert.ok(
    wsSrc.includes('wf1.validatedCapacityValueAnnual') && wsSrc.includes('wf45ModeledSum'),
    'GeValueRealizationWorkspace.js Exhibit 1B must dynamically bind WF1-WF5 dollar and hour deltas to evaluatedWorkflows'
  );

  // 3. Verify F01 $120/hr rate parity across ingestor and persisted dossiers
  const ingestorSrc = fs.readFileSync(path.join(ROOT, 'server/services/geCustomerMultiSourceIngestor.js'), 'utf8');
  const dossiersSrc = fs.readFileSync(path.join(ROOT, 'data/ge_value_realization_dossiers.json'), 'utf8');
  assert.ok(!ingestorSrc.includes('$115/hr'), 'geCustomerMultiSourceIngestor.js must not contain $115/hr F01 rate discrepancy');
  assert.ok(!dossiersSrc.includes('$115/hr'), 'data/ge_value_realization_dossiers.json must not contain $115/hr F01 rate discrepancy');
  assert.ok(ingestorSrc.includes('Blended Loaded Rate: $120/hr'), 'geCustomerMultiSourceIngestor.js F01 must match $120/hr defaultLoadedHourlyRate');

  // 4. Verify zero hardcoded ROI fallback in UnifiedDocumentPreviewModal.js and zero $500K floor in ExecutiveDashboard.js
  const modalSrc = readClientFile('components/UnifiedDocumentPreviewModal.js');
  assert.ok(!modalSrc.includes('$1.8M - $3.1M'), 'UnifiedDocumentPreviewModal.js must not fall back to hardcoded $1.8M - $3.1M');
  const execDashSrc = readClientFile('components/ExecutiveDashboard.js');
  assert.ok(!execDashSrc.includes('Math.max(totalOpportunity, 500000)'), 'ExecutiveDashboard.js must not enforce an artificial $500K minimum floor on zero-gap assessments');

  // 5. Verify deleted hook handlers and .agents symlinks remain absent
  assert.ok(!fs.existsSync(path.join(ROOT, 'scripts/pre_tool_guard.mjs')), 'pre_tool_guard.mjs must remain purged');
});

test('UI Integrity Gate 17: Model Payload Cap (maxOutputTokens <= 32768) & Zero Fictional Model Slugs in geminiService.js', () => {
  const geminiSvc = fs.readFileSync(path.join(ROOT, 'server/services/geminiService.js'), 'utf8');
  assert.ok(geminiSvc.includes('maxOutputTokens: 32768'), 'geminiService.js must enforce explicit maxOutputTokens: 32768 cap');
  const forbiddenSlugs = new RegExp(['gemini-4' + '-argon', 'gemini-3\\.8' + '-flash', 'google-omni' + '-1\\.1', 'gemini-omni' + '-1\\.1'].join('|'), 'i');
  assert.ok(!forbiddenSlugs.test(geminiSvc), 'geminiService.js must not reference fictional model slugs');
});

test('UI Integrity Gate 18: Rule 50A Fluid Layout & Rule 54 Executive Light Theme on AssignAssessmentMulti, UserDetails, and ExecutiveDashboard', () => {
  for (const rel of ['components/AssignAssessmentMulti.js', 'components/UserDetails.js', 'components/ExecutiveDashboard.js']) {
    const src = readClientFile(rel);
    assert.ok(!src.includes('max-width: 900px'), `${rel} must not use rigid max-width: 900px container (Rule 50A)`);
  }
  const assignSrc = readClientFile('components/AssignAssessmentMulti.js');
  assert.ok(assignSrc.includes('background: #f8fafc;') && assignSrc.includes('max-width: 100%;'), 'AssignAssessmentMulti.js must use #f8fafc Executive Light Theme and 100% fluid width');
});

test('UI Integrity Gate 19: Permanent 5-Subsystem Persistence, Client/Server Framework Parity & Zero Native Dialogs', () => {
  // 1. Active restored components exist on disk
  for (const activeRestored of ['AssessmentQuestion.js', 'AssessmentStart.js', 'MyAssessments.js', 'PitchDeck.js', 'AssessmentHeader.js']) {
    assert.ok(fs.existsSync(path.join(ROOT, 'client/src/components', activeRestored)), `Active component ${activeRestored} must exist`);
  }

  // 2. Subsystem 1: Pure V8-native require(esm) geValueRealizationFramework.js reference identity & zero regex transpiler
  const serverGeFwFile = fs.readFileSync(path.join(ROOT, 'server/data/geValueRealizationFramework.js'), 'utf8').trim();
  assert.ok(serverGeFwFile.split('\n').length <= 12, 'server/data/geValueRealizationFramework.js must be a pure <= 12-line native V8 require(esm) re-export');
  assert.ok(!serverGeFwFile.includes('transpileEsmToCommonJs'), 'server/data/geValueRealizationFramework.js must not contain any regex ESM-to-CJS fallback transpiler');
  const serverGeModule = require('../../server/data/geValueRealizationFramework');
  const clientGeModule = require('../../client/src/data/geValueRealizationFramework');
  assert.strictEqual(serverGeModule, clientGeModule, 'server and client geValueRealizationFramework must resolve to the exact same single-source module reference');
  assert.strictEqual(serverGeModule.GE_QUESTIONS.length, 82, 'single-source geValueRealizationFramework must export all 82 questions');
  assert.strictEqual(typeof serverGeModule.evaluateGeValueRealization, 'function', 'single-source geValueRealizationFramework must export evaluateGeValueRealization');
  const geRouteSrc = fs.readFileSync(path.join(ROOT, 'server/routes/geValueRealization.js'), 'utf8');
  assert.ok(!geRouteSrc.includes("const aero = parsed['ge_vr_acc-1001-aerovg'];"), 'geValueRealization.js loadServerDossiers must not exclusively check lowercase ge_vr_acc-1001-aerovg');
  assert.ok(geRouteSrc.includes("parsed['ge_vr_ACC-1001-AEROVG']") && geRouteSrc.includes('evaluation?.index'), 'geValueRealization.js loadServerDossiers must check canonical ge_vr_ACC-1001-AEROVG key and evaluation?.index');

  // 3. Subsystem 2, 3, 4: Idempotent boot seeding & DataStore singleton registry per file path
  const DataStore = require('../../server/utils/dataStore');
  const os = require('os');
  const singletonTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scorex-ds-singleton-'));
  try {
    const sharedPath = path.join(singletonTmpDir, 'assessments.json');
    const dsA = new DataStore(sharedPath);
    const dsB = new DataStore(sharedPath);
    assert.strictEqual(dsA, dsB, 'DataStore must return a shared singleton per resolved file path to prevent stale in-memory cache clobbers');
  } finally {
    fs.rmSync(singletonTmpDir, { recursive: true, force: true });
  }
  const customRepoSrc = fs.readFileSync(path.join(ROOT, 'server/db/customAssessmentRepository.js'), 'utf8');
  assert.ok(customRepoSrc.includes('isStarterInstanceValid'), 'customAssessmentRepository.js must check isStarterInstanceValid before overwriting starter instances on boot');
  const coreRepoSrc = fs.readFileSync(path.join(ROOT, 'server/db/assessmentRepository.js'), 'utf8');
  assert.ok(coreRepoSrc.includes("endsWith('_current_state')).length >= 60"), 'assessmentRepository.js must skip overwriting valid 60-question starter assessments on boot');
  const genaiRepoSrc = fs.readFileSync(path.join(ROOT, 'server/db/genaiAssessmentRepository.js'), 'utf8');
  assert.ok(genaiRepoSrc.includes('computeGenAIScores') && genaiRepoSrc.includes('Object.keys(existing.responses).length >= 30'), 'genaiAssessmentRepository.js must deterministically compute scores via computeGenAIScores and skip overwriting valid 30-question starter assessments on boot');

  // 4. Subsystem 3 & Comparison View: Clone route assignment, starter delete protection, and zero infinite searchParams loop
  const indexCoreSrc = fs.readFileSync(path.join(ROOT, 'server/indexCore.js'), 'utf8');
  assert.ok(indexCoreSrc.includes('const clonedAssessment = await assessmentRepo.create('), 'indexCore.js clone route must assign const clonedAssessment');
  assert.ok(indexCoreSrc.includes('PROTECTED_CORE_STARTER_IDS'), 'indexCore.js must protect canonical starter assessments from deletion');
  const comparisonSrc = readClientFile('components/AssessmentComparisonView.js');
  assert.ok(!comparisonSrc.includes('[loadComparison, searchParams]'), 'AssessmentComparisonView.js must not trigger infinite fetch loop via [loadComparison, searchParams]');
  assert.ok(comparisonSrc.includes('{ replace: true }'), 'AssessmentComparisonView.js must update searchParams with { replace: true }');

  // 5. Rule 50D: Zero native window.alert / window.confirm / window.prompt across 100% of client/src
  function collectClientJsFiles(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...collectClientJsFiles(full));
      else if (/\.(js|jsx)$/.test(entry.name)) out.push(full);
    }
    return out;
  }
  for (const fullPath of collectClientJsFiles(path.join(ROOT, 'client/src'))) {
    const relPath = path.relative(path.join(ROOT, 'client/src'), fullPath);
    const src = fs.readFileSync(fullPath, 'utf8');
    assert.ok(
      !/\bwindow\.(alert|prompt|confirm)\s*\(/.test(src) && !/(^|[^.\w])(alert|prompt|confirm)\s*\(/m.test(src),
      `${relPath} must not invoke native browser alert/prompt/confirm dialogs (Rule 50D)`
    );
  }

  // 6. Subsystem 5: Full 20-question statutory seed fallback & atomic write in euAiCompliance.js
  const euRouteSrc = fs.readFileSync(path.join(ROOT, 'server/routes/euAiCompliance.js'), 'utf8');
  assert.ok(euRouteSrc.includes('q20:') && euRouteSrc.includes('.sync.tmp'), 'euAiCompliance.js must include all 20 statutory fallback questions and atomic .sync.tmp write');
});

test('UI Integrity Gate 20: Multi-Instance GCS Atomic CAS (?ifGenerationMatch), 3-Way Ancestor Merge, Peer Hot-Reload, Node 22 LTS & Strict CI=true Build Gate', async () => {
  const os = require('os');
  const durableGcs = require('../../server/utils/durableGcsPersistence');
  const DataStore = require('../../server/utils/dataStore');

  // 1. All 15 runtime & canonical state stores are managed, and auth/session stores are NEVER seeded from image onto GCS
  const expectedStores = [
    'assessments.json',
    'dynamic_assessments.json',
    'custom_assessment_types.json',
    'genai_assessments.json',
    'ge_value_realization_dossiers.json',
    'eu_ai_dossiers.json',
    'instance_object_versions.json',
    'users.json',
    'sessions.json',
    'assignments.json',
    'notifications.json',
    'user_feedback.json',
    'custom_questions.json',
    'custom_question_assignments.json',
    'feedback.json'
  ];
  for (const storeName of expectedStores) {
    assert.ok(durableGcs.MANAGED_STATE_FILES.has(storeName), `durableGcsPersistence must manage ${storeName}`);
  }
  for (const runtimeOnly of ['sessions.json', 'users.json', 'assignments.json', 'notifications.json', 'custom_question_assignments.json']) {
    assert.ok(durableGcs.RUNTIME_ONLY_STATE_FILES.has(runtimeOnly), `${runtimeOnly} must be classified as RUNTIME_ONLY_STATE_FILES`);
    assert.ok(!durableGcs.SEEDABLE_CANONICAL_FILES.has(runtimeOnly), `${runtimeOnly} must NEVER be seeded from baked image files onto GCS`);
  }

  // 2. Cold-start hydration, fail-closed corrupt JSON rejection, runtime-only seed block, and Multi-Instance CAS + 3-Way Merge
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scorex-gate20-gcs-'));
  const origBucket = process.env.SCOREX_GCS_STATE_BUCKET;
  const origPrefix = process.env.SCOREX_GCS_STATE_PREFIX;
  const origForce = process.env.SCOREX_FORCE_GCS_SYNC_IN_TEST;
  const origToken = process.env.SCOREX_GCS_ACCESS_TOKEN;
  const origDataDir = process.env.DATA_DIR;
  const origFetch = global.fetch;

  durableGcs.resetDurableGcsRuntimeStateForTests();

  let nextGenerationCounter = 100;
  // Simulate authentic Google Cloud Storage object store with 64-bit generation numbers & HTTP 412 preconditions
  const remoteObjects = new Map([
    [
      'unit-prefix/assessments.json',
      {
        generation: '100',
        payload: JSON.stringify({
          shared_1: { id: 'shared_1', responses: { q1: 3, q2: 3 } },
          peer_deleted: { id: 'peer_deleted', v: 1 },
          local_deleted: { id: 'local_deleted', v: 1 }
        })
      }
    ],
    [
      'unit-prefix/custom_questions.json',
      {
        generation: '100',
        payload: JSON.stringify([
          { id: 'cq_shared', weight: 1.0 },
          { id: 'cq_peer_del', weight: 1.0 }
        ])
      }
    ],
    [
      'unit-prefix/eu_ai_dossiers.json',
      {
        generation: '100',
        payload: '{corrupt-truncated-json'
      }
    ]
  ]);

  fs.writeFileSync(path.join(tmpDir, 'eu_ai_dossiers.json'), JSON.stringify({ local_intact: true }), 'utf8');
  fs.writeFileSync(path.join(tmpDir, 'ge_value_realization_dossiers.json'), JSON.stringify({ ge_vr_seed: { id: 'ge_vr_seed' } }), 'utf8');
  fs.writeFileSync(path.join(tmpDir, 'sessions.json'), JSON.stringify([{ sid: 'leaked_local_session_must_not_seed' }]), 'utf8');

  let observed412Count = 0;
  let simulateUpload503 = false;

  global.fetch = async (url, opts = {}) => {
    const u = String(url);
    if (u.includes('/upload/storage/v1/b/')) {
      const parsedUrl = new URL(u);
      const name = parsedUrl.searchParams.get('name');
      const ifGenMatch = parsedUrl.searchParams.get('ifGenerationMatch');
      assert.ok(ifGenMatch !== null, `Every GCS upload MUST include ?ifGenerationMatch precondition (${u})`);

      if (simulateUpload503) {
        return {
          ok: false,
          status: 503,
          headers: new Map(),
          json: async () => ({ error: { code: 503, message: 'Service Unavailable' } }),
          text: async () => 'Service Unavailable'
        };
      }

      const existing = remoteObjects.get(name);
      const currentGen = existing ? existing.generation : '0';
      if (String(ifGenMatch) !== String(currentGen)) {
        observed412Count += 1;
        return {
          ok: false,
          status: 412,
          headers: new Map(),
          json: async () => ({ error: { code: 412, message: 'Precondition Failed' } }),
          text: async () => 'Precondition Failed'
        };
      }

      nextGenerationCounter += 1;
      const newGen = String(nextGenerationCounter);
      remoteObjects.set(name, { generation: newGen, payload: opts.body });
      return {
        ok: true,
        status: 200,
        headers: new Map([['x-goog-generation', newGen]]),
        json: async () => ({ name, generation: newGen }),
        text: async () => ''
      };
    }

    if (u.includes('?prefix=')) {
      const items = Array.from(remoteObjects.entries()).map(([name, entry]) => ({
        name,
        generation: entry.generation,
        size: String(Buffer.byteLength(entry.payload, 'utf8'))
      }));
      return { ok: true, status: 200, headers: new Map(), json: async () => ({ items }), text: async () => '' };
    }

    if (u.includes('?alt=media')) {
      const parsedUrl = new URL(u);
      const match = parsedUrl.pathname.match(/\/o\/(.+)$/);
      const decodedName = decodeURIComponent(match[1]);
      const entry = remoteObjects.get(decodedName);
      if (!entry) {
        return { ok: false, status: 404, headers: new Map(), text: async () => 'not found' };
      }
      return {
        ok: true,
        status: 200,
        headers: new Map([['x-goog-generation', entry.generation]]),
        text: async () => entry.payload
      };
    }

    // Object metadata GET /storage/v1/b/<bucket>/o/<encodedObject>
    const metaMatch = u.match(/\/storage\/v1\/b\/[^/]+\/o\/([^?]+)$/);
    if (metaMatch) {
      const decodedName = decodeURIComponent(metaMatch[1]);
      const entry = remoteObjects.get(decodedName);
      if (!entry) {
        return { ok: false, status: 404, headers: new Map(), json: async () => ({}), text: async () => 'not found' };
      }
      return {
        ok: true,
        status: 200,
        headers: new Map([['x-goog-generation', entry.generation]]),
        json: async () => ({
          name: decodedName,
          generation: entry.generation,
          size: String(Buffer.byteLength(entry.payload, 'utf8'))
        }),
        text: async () => ''
      };
    }

    return { ok: false, status: 404, headers: new Map(), text: async () => 'not found' };
  };

  try {
    process.env.SCOREX_GCS_STATE_BUCKET = 'mock-scorex-durable-bucket';
    process.env.SCOREX_GCS_STATE_PREFIX = 'unit-prefix';
    process.env.SCOREX_FORCE_GCS_SYNC_IN_TEST = '1';
    process.env.SCOREX_GCS_ACCESS_TOKEN = 'mock-oauth-token';
    process.env.DATA_DIR = tmpDir;

    assert.strictEqual(durableGcs.resolveDataDir(), path.resolve(tmpDir), 'resolveDataDir() must honor process.env.DATA_DIR');

    // Positional numeric array & non-email users.json merge safety invariants (P2)
    assert.deepStrictEqual(
      durableGcs.threeWayMergeJsonState({ scores: [1, 2, 3] }, { scores: [1, 2, 4] }, { scores: [1, 2, 5] }, 'assessments.json'),
      { scores: [1, 2, 5] },
      'Positional numeric arrays must NEVER be treated as unordered sets or inflated in length'
    );
    const mergedUsersWithBot = durableGcs.threeWayMergeJsonState(
      [],
      [{ id: 'svc_bot', role: 'system' }],
      [{ id: 'u1', email: 'a@example.com' }],
      'users.json'
    );
    assert.strictEqual(mergedUsersWithBot.length, 2, 'users.json secondary email dedup must never drop service entries without .email');

    const res = await durableGcs.hydrateDataDirFromGcs(tmpDir);
    assert.strictEqual(res.hydrated, true);
    assert.ok(res.hydratedFiles.includes('assessments.json'), 'valid remote state file must hydrate onto local disk');
    assert.ok(!res.hydratedFiles.includes('eu_ai_dossiers.json'), 'corrupt remote JSON must fail closed and be rejected');
    assert.deepStrictEqual(
      JSON.parse(fs.readFileSync(path.join(tmpDir, 'eu_ai_dossiers.json'), 'utf8')),
      { local_intact: true },
      'local valid state file must remain untouched when remote object fails JSON.parse'
    );
    assert.ok(res.seededFiles.includes('ge_value_realization_dossiers.json'), 'canonical assessment dossier file must be seeded to GCS via ifGenerationMatch=0 when missing remotely');
    assert.ok(!res.seededFiles.includes('sessions.json'), 'sessions.json must NEVER be uploaded from local seed on cold start');
    assert.strictEqual(remoteObjects.has('unit-prefix/sessions.json'), false, 'GCS bucket must never receive baked local sessions.json on boot');
    assert.strictEqual(
      fs.existsSync(path.join(tmpDir, 'sessions.json')),
      false,
      'Unhydrated local baked RUNTIME_ONLY_STATE_FILES (sessions.json) must be actively purged from disk on cold start'
    );

    // Construct DataStore bound to hydrated assessments.json (at generation 100)
    const targetAssessmentsPath = path.join(tmpDir, 'assessments.json');
    const dsAssessments = new DataStore(targetAssessmentsPath);
    assert.strictEqual(dsAssessments.data.get('shared_1').responses.q1, 3);

    // Simulate Peer Cloud Run Instance B concurrently committing an update to assessments.json on GCS (advancing generation -> 901)
    remoteObjects.set('unit-prefix/assessments.json', {
      generation: '901',
      payload: JSON.stringify({
        shared_1: { id: 'shared_1', responses: { q1: 3, q2: 5 } }, // Peer edited q2
        local_deleted: { id: 'local_deleted', v: 1 }, // Peer left local_deleted untouched
        peer_added: { id: 'peer_added', score: 4.2 } // Peer created new assessment; AND peer deleted peer_deleted!
      })
    });

    // Local Instance A (still believing generation == 100) edits q1, adds local_added, and deletes local_deleted
    dsAssessments.data.set('shared_1', { id: 'shared_1', responses: { q1: 4, q2: 3 } });
    dsAssessments.data.set('local_added', { id: 'local_added', score: 3.9 });
    dsAssessments.data.delete('local_deleted');
    dsAssessments.saveData();
    await durableGcs.flushAllPendingSyncs();

    assert.ok(observed412Count >= 1, 'Stale expected generation MUST trigger HTTP 412 Precondition Failed and enter CAS 3-way merge');
    const mergedRemoteAssessments = JSON.parse(remoteObjects.get('unit-prefix/assessments.json').payload);
    assert.deepStrictEqual(
      mergedRemoteAssessments,
      {
        shared_1: { id: 'shared_1', responses: { q1: 4, q2: 5 } },
        peer_added: { id: 'peer_added', score: 4.2 },
        local_added: { id: 'local_added', score: 3.9 }
      },
      '3-Way CAS merge must preserve both concurrent additions, merge nested q1/q2 edits, and never resurrect peer_deleted or local_deleted'
    );
    // Verify DataStore in-memory Map on Instance A was also hot-reloaded with Peer Instance B's changes!
    assert.deepStrictEqual(dsAssessments.data.get('peer_added'), { id: 'peer_added', score: 4.2 });
    assert.deepStrictEqual(dsAssessments.data.get('shared_1').responses, { q1: 4, q2: 5 });
    assert.strictEqual(dsAssessments.data.has('peer_deleted'), false);

    // Simulate concurrent Multi-Instance HTTP 412 conflict on Keyed Entity Array (custom_questions.json)
    remoteObjects.set('unit-prefix/custom_questions.json', {
      generation: '950',
      payload: JSON.stringify([
        { id: 'cq_shared', weight: 1.0 },
        { id: 'cq_peer_new', weight: 1.6 }
        // cq_peer_del was deleted on Peer Instance B!
      ])
    });
    const customQuestionsPath = path.join(tmpDir, 'custom_questions.json');
    const localArrayEdit = [
      { id: 'cq_shared', weight: 2.0 }, // Local edited weight
      { id: 'cq_peer_del', weight: 1.0 }, // Untouched locally since base -> must honor peer deletion
      { id: 'cq_local_new', weight: 1.4 } // Local added new question
    ];
    fs.writeFileSync(customQuestionsPath, JSON.stringify(localArrayEdit, null, 2), 'utf8');
    durableGcs.scheduleStateFileSync(customQuestionsPath, JSON.stringify(localArrayEdit, null, 2));
    await durableGcs.flushAllPendingSyncs();

    const mergedQuestions = JSON.parse(remoteObjects.get('unit-prefix/custom_questions.json').payload);
    assert.deepStrictEqual(
      mergedQuestions,
      [
        { id: 'cq_shared', weight: 2.0 },
        { id: 'cq_peer_new', weight: 1.6 },
        { id: 'cq_local_new', weight: 1.4 }
      ],
      '3-Way keyed-array CAS merge must preserve concurrent edits/additions and honor peer deletions without resurrection'
    );

    // Simulate Cross-Instance Read-After-Write Freshness (Peer Instance B writes gen=999; Instance A refreshes before GET)
    remoteObjects.set('unit-prefix/assessments.json', {
      generation: '999',
      payload: JSON.stringify({
        ...mergedRemoteAssessments,
        peer_read_after_write: { id: 'peer_read_after_write', score: 4.75 }
      })
    });
    const refreshRes = await durableGcs.refreshChangedFilesFromGcs({ force: true, targetDataDir: tmpDir });
    assert.strictEqual(refreshRes.refreshed, true);
    assert.ok(refreshRes.updatedFiles.includes('assessments.json'));
    assert.deepStrictEqual(
      dsAssessments.data.get('peer_read_after_write'),
      { id: 'peer_read_after_write', score: 4.75 },
      'refreshChangedFilesFromGcs must hot-reload peer instance mutations into DataStore memory before read handlers execute'
    );

    // P1 Invariant: Transient 503 upload failure MUST preserve dirty local state across peer refresh and self-heal
    simulateUpload503 = true;
    dsAssessments.data.set('dirty_local_after_503', { id: 'dirty_local_after_503', score: 4.9 });
    dsAssessments.saveData();
    await durableGcs.flushAllPendingSyncs();
    assert.strictEqual(durableGcs.getDurablePersistenceStatus().dirtyUnsyncedCount, 1, 'Failed 503 upload must retain path in dirtyUnsyncedPaths');

    simulateUpload503 = false;
    const pre503Remote = JSON.parse(remoteObjects.get('unit-prefix/assessments.json').payload);
    remoteObjects.set('unit-prefix/assessments.json', {
      generation: '1100',
      payload: JSON.stringify({
        ...pre503Remote,
        peer_during_503: { id: 'peer_during_503', score: 4.1 }
      })
    });
    await durableGcs.refreshChangedFilesFromGcs({ force: true, targetDataDir: tmpDir });
    await durableGcs.flushAllPendingSyncs();

    assert.strictEqual(durableGcs.getDurablePersistenceStatus().dirtyUnsyncedCount, 0, 'Self-healed dirty file must clear dirtyUnsyncedPaths after recovery upload');
    assert.ok(dsAssessments.data.has('dirty_local_after_503'), 'refreshChangedFilesFromGcs must NEVER clobber dirty unsynced local mutations');
    assert.ok(dsAssessments.data.has('peer_during_503'), 'refreshChangedFilesFromGcs must merge peer mutations into dirty local state');
    const healedRemoteAssessments = JSON.parse(remoteObjects.get('unit-prefix/assessments.json').payload);
    assert.ok(healedRemoteAssessments.dirty_local_after_503 && healedRemoteAssessments.peer_during_503, 'Recovered 3-way merge must be uploaded back to GCS');

    // P1 Invariant: FileUserStore.createUser async bcrypt.hash MUST NOT wipe concurrent peer users.json refreshes
    const fileUserStore = require('../../server/db/fileUserStore');
    fileUserStore.initializedDir = null;
    const createAlicePromise = fileUserStore.createUser({
      email: 'alice@example.com',
      password: 'StrongPassword123!'
    });
    // While bcrypt.hash (~250ms) is running, Peer B writes bob@example.com to GCS and Instance A refreshes
    await new Promise((r) => setTimeout(r, 15));
    remoteObjects.set('unit-prefix/users.json', {
      generation: '1200',
      payload: JSON.stringify([
        { id: 'peer_bob', email: 'bob@example.com', role: 'consumer', is_active: true, created_at: '2026-01-01T00:00:00.000Z' }
      ])
    });
    await durableGcs.refreshChangedFilesFromGcs({ force: true, targetDataDir: tmpDir });
    await createAlicePromise;
    await durableGcs.flushAllPendingSyncs();

    const finalUsersRemote = JSON.parse(remoteObjects.get('unit-prefix/users.json').payload);
    const finalEmails = finalUsersRemote.map((u) => u.email).sort();
    assert.deepStrictEqual(
      finalEmails,
      ['alice@example.com', 'bob@example.com'],
      'Concurrent FileUserStore.createUser + peer refresh during bcrypt.hash must preserve both users'
    );
  } finally {
    durableGcs.resetDurableGcsRuntimeStateForTests();
    global.fetch = origFetch;
    if (origBucket === undefined) delete process.env.SCOREX_GCS_STATE_BUCKET; else process.env.SCOREX_GCS_STATE_BUCKET = origBucket;
    if (origPrefix === undefined) delete process.env.SCOREX_GCS_STATE_PREFIX; else process.env.SCOREX_GCS_STATE_PREFIX = origPrefix;
    if (origForce === undefined) delete process.env.SCOREX_FORCE_GCS_SYNC_IN_TEST; else process.env.SCOREX_FORCE_GCS_SYNC_IN_TEST = origForce;
    if (origToken === undefined) delete process.env.SCOREX_GCS_ACCESS_TOKEN; else process.env.SCOREX_GCS_ACCESS_TOKEN = origToken;
    if (origDataDir === undefined) delete process.env.DATA_DIR; else process.env.DATA_DIR = origDataDir;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  // 3. P0 Middleware Order, Runtime Ignore Hygiene, Strict CI=true & Node 22 LTS Gate
  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const clientPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'client/package.json'), 'utf8'));
  const dockerfileSrc = fs.readFileSync(path.join(ROOT, 'Dockerfile'), 'utf8');
  const dockerignoreSrc = fs.readFileSync(path.join(ROOT, '.dockerignore'), 'utf8');
  const gcloudignoreSrc = fs.readFileSync(path.join(ROOT, '.gcloudignore'), 'utf8');
  const hardeningSrc = fs.readFileSync(path.join(ROOT, 'server/security/hardening.js'), 'utf8');
  const indexCoreShutdownSrc = fs.readFileSync(path.join(ROOT, 'server/indexCore.js'), 'utf8');

  for (const rtFile of durableGcs.RUNTIME_ONLY_STATE_FILES) {
    assert.ok(dockerignoreSrc.includes(`data/${rtFile}`), `.dockerignore must exclude runtime state file data/${rtFile}`);
    assert.ok(gcloudignoreSrc.includes(`data/${rtFile}`), `.gcloudignore must exclude runtime state file data/${rtFile}`);
  }

  const gcsMwIdx = indexCoreShutdownSrc.indexOf('app.use(createGcsFreshnessMiddleware())');
  const firstRouteIdx = indexCoreShutdownSrc.indexOf("app.get(['/health'");
  assert.ok(
    gcsMwIdx > 0 && firstRouteIdx > gcsMwIdx,
    'createGcsFreshnessMiddleware() MUST be mounted BEFORE the first app.get route so installSecurity splices securityMiddleware after GCS sync'
  );
  assert.ok(
    hardeningSrc.includes('refreshChangedFilesFromGcs') && hardeningSrc.indexOf('refreshChangedFilesFromGcs') < hardeningSrc.indexOf('await authenticate(req, res)'),
    'securityMiddleware in hardening.js must guarantee GCS freshness before await authenticate(req, res) and /api/assessments handlers'
  );

  assert.ok(!rootPkg.scripts.build.includes('CI=false') && rootPkg.scripts.build.includes('CI=true'), 'root package.json build script must enforce CI=true');
  assert.strictEqual(rootPkg.engines.node, '>=22.12.0', 'root package.json engines.node must require >=22.12.0 for native V8 require(esm)');
  assert.strictEqual(clientPkg.scripts.build, 'CI=true react-scripts build', 'client/package.json build script must enforce CI=true react-scripts build');
  assert.ok(!dockerfileSrc.includes('CI=false') && dockerfileSrc.includes('CI=true'), 'Dockerfile must enforce CI=true');
  assert.ok(!dockerfileSrc.includes('node:20') && dockerfileSrc.includes('FROM node:22-bookworm-slim'), 'Dockerfile must target Node 22 LTS for native V8 require(esm)');

  // 4. PostgreSQL JSONB migration parity & pre-drain SIGTERM GCS flush
  assert.ok(fs.existsSync(path.join(ROOT, 'server/db/migrations/023_ge_and_eu_ai_dossiers.sql')), 'numbered migration 023_ge_and_eu_ai_dossiers.sql must exist for migrate.js');
  const schemaEnhancements = fs.readFileSync(path.join(ROOT, 'server/db/schema-enhancements.sql'), 'utf8');
  assert.ok(schemaEnhancements.includes('CREATE TABLE IF NOT EXISTS ge_value_realization_dossiers'), 'schema-enhancements.sql must define ge_value_realization_dossiers JSONB table');
  assert.ok(schemaEnhancements.includes('CREATE TABLE IF NOT EXISTS eu_ai_dossiers'), 'schema-enhancements.sql must define eu_ai_dossiers JSONB table');
  const flushIdx = indexCoreShutdownSrc.indexOf('const initialFlushPromise = flushAllPendingSyncs()');
  const closeIdx = indexCoreShutdownSrc.indexOf('server.close(() =>');
  assert.ok(flushIdx > 0 && closeIdx > flushIdx, 'gracefulShutdown must initiate flushAllPendingSyncs() BEFORE blocking on server.close()');
});


