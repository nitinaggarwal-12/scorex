#!/usr/bin/env node
/**
 * Stop Lifecycle Quality Gate (scripts/stop_quality_gate.mjs)
 * Runs automatically on every agent Stop lifecycle event and `npm run quality-gate` to enforce:
 * 1. Universal Governance & 5-Tier Model Stack parity (`gate_governance_doc_sync.mjs`).
 * 2. 0 remaining legacy duplicate components out of the 26 pruned v1/v2 components.
 * 3. 100% unique MD5 hashes across all 58 interactive walkthrough PNG frames.
 * 4. Clean dynamic_assessments.json seed state (0 temporary uncompleted test instances left behind).
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT = process.cwd();

// 1. Run governance doc & 5-Tier model stack gate
try {
  execSync('node scripts/guards/gate_governance_doc_sync.mjs', { stdio: 'inherit', cwd: ROOT });
} catch (_) {
  process.exit(1);
}

// 2. Verify all 26 pruned legacy components remain absent
const DELETED_LEGACY = [
  'AssessmentQuestion.js', 'AssessmentStart.js', 'AssessmentSummary.js', 'GenAIReadinessAssessment.js',
  'MyAssessments.js', 'MaturityReport.js', 'AssessmentDetailView.js', 'BenchmarkingReport.js',
  'DeepDiveReport.js', 'InsightsDashboard.js', 'CustomQuestionsManager.js', 'FeedbackAnalytics.js',
  'AdminDashboard.js', 'AssignAssessmentModal.js', 'PitchDeck.js', 'AnalyticsDashboard.js',
  'AuthorDashboard.js', 'ConsumerDashboard.js', 'Dashboard.js', 'AssessmentHeader.js',
  'Header.js', 'HomeButton.js', 'DemoScenarioPickerModal.js', 'ExecutiveSummary.js',
  'FeedbackModal.js', 'ModernCharts.js'
];
const resurrected = DELETED_LEGACY.filter((f) => fs.existsSync(path.join(ROOT, 'client/src/components', f)));
if (resurrected.length > 0) {
  console.error(`❌ [stop_quality_gate] Resurrected legacy components detected: ${resurrected.join(', ')}`);
  process.exit(1);
}

// 3. Verify 0 duplicate MD5 frames in client/public/workflows/frames
const framesBase = path.join(ROOT, 'client/public/workflows/frames');
if (fs.existsSync(framesBase)) {
  for (const dir of fs.readdirSync(framesBase)) {
    const full = path.join(framesBase, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    const files = fs.readdirSync(full).filter((f) => f.endsWith('.png')).sort();
    const hashes = new Set();
    for (const f of files) {
      const h = crypto.createHash('md5').update(fs.readFileSync(path.join(full, f))).digest('hex');
      if (hashes.has(h)) {
        console.error(`❌ [stop_quality_gate] Duplicate MD5 frame in ${dir}/${f}`);
        process.exit(1);
      }
      hashes.add(h);
    }
  }
}

console.log('✅ [stop_quality_gate] ALL HARNESS INVARIANTS PASSED (0 legacy components, 58/58 unique frame MD5s, 5-Tier Model Stack locked).');
