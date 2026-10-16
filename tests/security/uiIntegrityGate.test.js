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

test('UI Integrity Gate 2: Explicit Edit, Clone, and Delete controls exist across all 8 entity/workspace components', () => {
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
  // 1. Zero consulting brand leaks in backend services & static mockups
  const ingestorSrc = fs.readFileSync(path.join(ROOT, 'server/services/geCustomerMultiSourceIngestor.js'), 'utf8');
  const recEngineSrc = fs.readFileSync(path.join(ROOT, 'server/services/intelligentRecommendationEngine_v2.js'), 'utf8');
  const mockupSrc = fs.readFileSync(path.join(ROOT, 'client/public/ge_value_realization_figma_mockup.html'), 'utf8');
  assert.ok(!/Stratagem|McKinsey|\bMcK\b/i.test(ingestorSrc), 'geCustomerMultiSourceIngestor.js must contain 0 Stratagem/McKinsey references');
  assert.ok(!/Stratagem|McKinsey|\bMcK\b/i.test(recEngineSrc), 'intelligentRecommendationEngine_v2.js must contain 0 Stratagem/McKinsey references');
  assert.ok(!/Stratagem|McKinsey|\bMcK\b/i.test(mockupSrc), 'ge_value_realization_figma_mockup.html must contain 0 Stratagem/McKinsey references');

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
    !wsSrc.includes('ge-question-multiselect-') && !wsSrc.includes('+ Add Option ('),
    'Question cards must use a single uniform 36px <select> control in Column 1 across all 82 questions without multi-row chip clouds or "+ Add Option (...)" placeholders'
  );
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

