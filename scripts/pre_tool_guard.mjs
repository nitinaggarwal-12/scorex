#!/usr/bin/env node
/**
 * PreToolUse Guard (scripts/pre_tool_guard.mjs)
 * Intercepts file writes/edits before execution to block:
 * 1. Re-introducing any of the 26 deleted legacy v1/v2 duplicate component files.
 * 2. Writing deprecated/non-existent model strings (Gemini 3.7, gemini-2.5-pro/flash, gpt-4o-mini, OPENAI_API_KEY).
 * 3. Leaking confidential Databricks internal URLs or service principal UUIDs.
 */

import fs from 'fs';

const DELETED_LEGACY_COMPONENTS = new Set([
  'AssessmentQuestion.js',
  'AssessmentStart.js',
  'AssessmentSummary.js',
  'GenAIReadinessAssessment.js',
  'MyAssessments.js',
  'MaturityReport.js',
  'AssessmentDetailView.js',
  'BenchmarkingReport.js',
  'DeepDiveReport.js',
  'InsightsDashboard.js',
  'CustomQuestionsManager.js',
  'FeedbackAnalytics.js',
  'AdminDashboard.js',
  'AssignAssessmentModal.js',
  'PitchDeck.js',
  'AnalyticsDashboard.js',
  'AuthorDashboard.js',
  'ConsumerDashboard.js',
  'Dashboard.js',
  'AssessmentHeader.js',
  'Header.js',
  'HomeButton.js',
  'DemoScenarioPickerModal.js',
  'ExecutiveSummary.js',
  'FeedbackModal.js',
  'ModernCharts.js'
]);

const FORBIDDEN_CONTENT_REGEX = /Gemini 3\.7|gemini-3\.7-flash|gemini-3\.7-pro|gpt-4o-mini|OPENAI_API_KEY|databricksapps\.com|e2-demo-field-eng|2dd066d2-2717-4694-85be-968a1407fd53/i;

let rawInput = '';
try {
  rawInput = fs.readFileSync(0, 'utf8');
} catch (_) {}

if (rawInput.trim()) {
  try {
    const payload = JSON.parse(rawInput);
    const args = payload.tool_input || payload.arguments || payload;
    const targetFile = String(args.TargetFile || args.AbsolutePath || '');
    const baseName = targetFile.split('/').pop();

    if (targetFile.includes('client/src/components/') && DELETED_LEGACY_COMPONENTS.has(baseName)) {
      console.error(`❌ [pre_tool_guard] BLOCKED: Cannot recreate pruned legacy component "${baseName}". Use the 3 Canonical Assessment Engines.`);
      process.exit(2);
    }

    // Skip checking hook/guard definitions themselves where forbidden patterns are listed in blocklists
    const isGuardOrHook =
      targetFile.endsWith('hooks.json') ||
      targetFile.endsWith('AGENTS.md') ||
      targetFile.endsWith('skills.md') ||
      targetFile.includes('/scripts/');

    if (!isGuardOrHook) {
      const codeContent = String(args.CodeContent || args.ReplacementContent || '');
      if (FORBIDDEN_CONTENT_REGEX.test(codeContent)) {
        console.error(`❌ [pre_tool_guard] BLOCKED: Attempted to write deprecated model or confidential string into ${targetFile}.`);
        process.exit(2);
      }
      if (targetFile.endsWith('dynamicAssessmentDiagramCompiler.js') || targetFile.endsWith('template05DiagramCompiler.js')) {
        if (/\.split\(\/\[\\s-\]\+\/\)/.test(codeContent) || /\[TARGET STATE GUARANTEE \(/.test(codeContent)) {
          console.error(`❌ [pre_tool_guard] BLOCKED: Intra-word hyphen splitting (.split(/[\\s-]+/)) or legacy [TARGET STATE GUARANTEE] banner detected in ${baseName}.`);
          process.exit(2);
        }
      }
    }
  } catch (_) {
    // Non-JSON stdin or standalone invocation
  }
}

process.exit(0);
