const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('global navigation is decision-first and contains no legacy privileged guest path', () => {
  const source = read('client/src/components/GlobalNav.js');
  assert.match(source, /Decision Room/);
  assert.match(source, /3‑Min Demo|3‑Minute Demo/);
  assert.match(source, /\/executive-dashboard/);
  assert.match(source, /\/workflow-demo/);
  assert.doesNotMatch(source, /admin_guest_/);
  assert.doesNotMatch(source, /guest_admin_session_/);
  assert.doesNotMatch(source, /Admin Mode Unlocked/i);
  assert.doesNotMatch(source, /Full Access/i);
  assert.doesNotMatch(source, /generateRealisticComment/);
  assert.doesNotMatch(source, /role:\s*['"]admin['"]/);
});

test('three-minute demo provisions least-privileged demo identity and deterministic review path', () => {
  const source = read('client/src/components/InteractiveWorkflowWalkthrough.js');
  assert.match(source, /authService\.createGuestSession\(\)/);
  assert.match(source, /assessmentService\.generateSampleAssessment\(\)/);
  assert.match(source, /3‑Minute Demo|3‑minute judge path/);
  assert.match(source, /`\/executive\/\$\{assessmentId\}`/);
  assert.match(source, /`\/results\/\$\{assessmentId\}`/);
  assert.match(source, /`\/benchmarks\/\$\{assessmentId\}`/);
  assert.doesNotMatch(source, /role:\s*['"]admin['"]/);
  assert.doesNotMatch(source, /admin_guest_/);
});

test('Decision Room is focused on decisions evidence and target gaps', () => {
  const source = read('client/src/components/ExecutiveCommandCenter.js');
  assert.match(source, /Decision Room/);
  assert.match(source, /Decision now/);
  assert.match(source, /Evidence before commitment/);
  assert.match(source, /ArchitectureDiffPanel/);
  assert.match(source, /\/benchmarks\/\$\{assessmentId\}/);
  assert.doesNotMatch(source, /presentationMode/);
  assert.doesNotMatch(source, /showLogoModal/);
  assert.doesNotMatch(source, /html2canvas/);
  assert.doesNotMatch(source, /jsPDF/);
  assert.doesNotMatch(source, /calculatedRoi|expectedROI|dollarAtRisk|financialImpact\s*\*/i);
});

test('architecture diff is interactive and derives change class only from current-to-target gap', () => {
  const source = read('client/src/components/ArchitectureDiffPanel.js');
  assert.match(source, /Transform/);
  assert.match(source, /Modernize/);
  assert.match(source, /Optimize/);
  assert.match(source, /Maintain/);
  assert.match(source, /target - current/);
  assert.match(source, /no dollar, vendor, or peer claim is inferred/i);
  assert.doesNotMatch(source, /\$\d/);
  assert.doesNotMatch(source, /percentile|industry average|top quartile/i);
});

test('phase three keeps existing routes and requires no new router surface', () => {
  const app = read('client/src/App.js');
  assert.match(app, /path="\/executive-dashboard"/);
  assert.match(app, /path="\/executive\/:assessmentId"/);
  assert.match(app, /path="\/workflow-demo"/);
  assert.match(app, /InteractiveWorkflowWalkthrough/);
  assert.match(app, /ExecutiveCommandCenter/);
});
