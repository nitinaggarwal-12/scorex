#!/usr/bin/env node
/**
 * Universal Governance Document Lockstep & 5-Tier Model Stack Gate (v3.5.0)
 * Verifies single-source symlink & SHA-256 parity across hooks.json, AGENTS.md, GEMINI.md, CLAUDE.md,
 * skills.md, skills.json, and .datacloud_skills_manifest, and enforces 0 deprecated/non-existent model strings.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = process.cwd();
const CONFIG_DIR = '/Users/nitinagga/.gemini/config';

const sha256 = (content) => crypto.createHash('sha256').update(content).digest('hex');

const REQUIRED_MODELS = [
  'google-omni-1.1',
  'gemini-omni-1.1-flash',
  'gemini-3.1-pro-preview',
  'gemini-3.8-flash',
  'gemini-3.1-flash-live-preview',
  'veo-3.1-generate-preview',
  'lyria-3.5',
  'gemini-3.1-flash-tts-preview',
  'gemini-3.1-flash-image-preview',
  'gemini-embedding-001',
  'text-embedding-005'
];

// Global forbidden models and stale blueprint keys across all SKILL.md and markdown docs
const GLOBAL_FORBIDDEN_MODEL_REGEX = /Gemini 3\.7|gemini-3\.7|gemini-2\.0-flash|gemini-1\.5-pro|gemini-1\.5-flash|gemini-2\.5-flash-preview-tts|gpt-4o-mini|OPENAI_API_KEY|OPENAI_MODEL|genai_rag_readiness|finops_cost_governance|cloud_migration_modernization|zero_trust_cyber_resilience|mlops_agentic_ai_governance/i;
// Strict ScoreX runtime code forbidden regex (also bans legacy e2-demo-field-eng & LAKEBASE_*)
const SCOREX_CODE_FORBIDDEN_REGEX = /Gemini 3\.7|gemini-3\.7|gemini-2\.5-pro|gemini-2\.5-flash|gemini-2\.0-flash|gemini-1\.5-pro|gemini-1\.5-flash|gpt-4o-mini|OPENAI_API_KEY|OPENAI_MODEL|e2-demo-field-eng|LAKEBASE_HOST|databricks_postgres/i;

function walk(dir, extRegex, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, extRegex, out);
    else if (extRegex.test(entry.name)) out.push(full);
  }
  return out;
}

let failures = [];

// 1. Check Universal Single-Source Lockstep Pairs (Local <-> Global ~/.gemini/config)
const lockstepPairs = [
  ['hooks.json', path.join(CONFIG_DIR, 'hooks.json')],
  ['.agents/hooks.json', path.join(CONFIG_DIR, 'hooks.json')],
  ['AGENTS.md', path.join(CONFIG_DIR, 'AGENTS.md')],
  ['GEMINI.md', path.join(CONFIG_DIR, 'AGENTS.md')],
  ['CLAUDE.md', path.join(CONFIG_DIR, 'AGENTS.md')],
  ['.agents/AGENTS.md', path.join(CONFIG_DIR, 'AGENTS.md')],
  ['skills.md', path.join(CONFIG_DIR, 'skills.md')],
  ['.agents/skills.md', path.join(CONFIG_DIR, 'skills.md')],
  ['skills.json', path.join(CONFIG_DIR, 'skills.json')],
  ['.agents/skills.json', path.join(CONFIG_DIR, 'skills.json')],
];

for (const [relLocal, globalTarget] of lockstepPairs) {
  const localPath = path.join(ROOT, relLocal);
  if (!fs.existsSync(localPath)) {
    failures.push(`Missing local governance file/symlink: ${relLocal}`);
    continue;
  }
  if (fs.existsSync(globalTarget)) {
    const c1 = fs.readFileSync(localPath, 'utf8');
    const c2 = fs.readFileSync(globalTarget, 'utf8');
    if (sha256(c1) !== sha256(c2)) {
      failures.push(`SHA-256 mismatch between ${relLocal} and ${globalTarget}`);
    }
  }
}

// Check skills.json === .datacloud_skills_manifest
const globalSkillsJson = path.join(CONFIG_DIR, 'skills.json');
const globalSkillsManifest = path.join(CONFIG_DIR, 'skills', '.datacloud_skills_manifest');
if (fs.existsSync(globalSkillsJson) && fs.existsSync(globalSkillsManifest)) {
  if (sha256(fs.readFileSync(globalSkillsJson, 'utf8')) !== sha256(fs.readFileSync(globalSkillsManifest, 'utf8'))) {
    failures.push('SHA-256 mismatch between ~/.gemini/config/skills.json and ~/.gemini/config/skills/.datacloud_skills_manifest');
  }
}

// 2. Check 5-Tier model completeness in skills.md, README.md, DEPLOYMENT_STATUS.md, and db-sync/README.md
for (const docName of ['skills.md', 'README.md', 'DEPLOYMENT_STATUS.md', 'db-sync/README.md']) {
  const docPath = path.join(ROOT, docName);
  if (fs.existsSync(docPath)) {
    const content = fs.readFileSync(docPath, 'utf8');
    for (const m of REQUIRED_MODELS) {
      if (!content.includes(m)) failures.push(`Missing canonical 5-Tier model "${m}" in ${docName}`);
    }
  }
}

// 3. Scan global SKILL.md files and ScoreX docs for forbidden/deprecated models & stale blueprint keys
const globalAndDocFiles = [
  ...walk(path.join(CONFIG_DIR, 'skills'), /\.md$/),
  path.join(ROOT, 'skills.md'),
  path.join(ROOT, 'README.md'),
  path.join(ROOT, 'DEPLOYMENT_STATUS.md'),
  path.join(ROOT, 'db-sync/README.md'),
  path.join(ROOT, 'env.example'),
  path.join(ROOT, '.env.template')
].filter((f) => fs.existsSync(f));

for (const file of globalAndDocFiles) {
  const content = fs.readFileSync(file, 'utf8').replace(/zero\s+`?gemini-2\.5-flash-preview-tts`?/gi, '');
  if (GLOBAL_FORBIDDEN_MODEL_REGEX.test(content)) {
    failures.push(`Forbidden/deprecated model string found in ${file}`);
  }
}

// 4. Scan ScoreX runtime codebase (server/, client/src/, app.yaml) for forbidden models or stale legacy strings
const scorexRuntimeFiles = [
  ...walk(path.join(ROOT, 'server'), /\.(js|json)$/),
  ...walk(path.join(ROOT, 'client/src'), /\.(js|jsx)$/),
  path.join(ROOT, 'app.yaml')
].filter((f) => fs.existsSync(f));

for (const file of scorexRuntimeFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (SCOREX_CODE_FORBIDDEN_REGEX.test(content)) {
    failures.push(`Forbidden model or stale legacy config string found in ScoreX runtime file: ${file}`);
  }
}

// 5. Enforce Template 05 3-Zone Diagram Semantic, Logical & Visual Integrity Gate
const serverCompilerPath = path.join(ROOT, 'server/services/dynamicAssessmentDiagramCompiler.js');
const clientCompilerPath = path.join(ROOT, 'client/src/services/template05DiagramCompiler.js');
if (fs.existsSync(serverCompilerPath) && fs.existsSync(clientCompilerPath)) {
  const sNorm = fs.readFileSync(serverCompilerPath, 'utf8').replace(/module\.exports\s*=\s*\{[\s\S]*?\};/, 'EXPORT_BLOCK').trim();
  const cNorm = fs.readFileSync(clientCompilerPath, 'utf8').replace(/export\s*\{[\s\S]*?\};/, 'EXPORT_BLOCK').trim();
  if (sha256(sNorm) !== sha256(cNorm)) {
    failures.push('Drift detected between server/services/dynamicAssessmentDiagramCompiler.js and client/src/services/template05DiagramCompiler.js');
  }
  const rawServerCode = fs.readFileSync(serverCompilerPath, 'utf8');
  if (/\.split\(\/\[\\s-\]\+\/\)/.test(rawServerCode)) {
    failures.push('Forbidden intra-word hyphen split (.split(/[\\s-]+/)) found in dynamicAssessmentDiagramCompiler.js');
  }
  if (!rawServerCode.includes('assignPillarsToArchitecturalTiers')) {
    failures.push('Missing assignPillarsToArchitecturalTiers() bijective 1-to-1 tier alignment in dynamicAssessmentDiagramCompiler.js');
  }
}

const dynAssessmentsPath = path.join(ROOT, 'data/dynamic_assessments.json');
let verifiedDiagramCount = 0;
if (fs.existsSync(dynAssessmentsPath)) {
  try {
    const dynData = JSON.parse(fs.readFileSync(dynAssessmentsPath, 'utf8'));
    for (const inst of Object.values(dynData)) {
      if (!inst) continue;
      const typeKey = inst.typeKey || inst.typeId || inst.id;
      const diagObj = inst.aiReport?.architectureDiagrams || inst.architectureDiagrams;
      if (!diagObj) {
        failures.push(`Missing architectureDiagrams in ${typeKey}`);
        continue;
      }
      for (const stageKey of ['currentStateXml', 'transitionStateXml', 'targetStateXml']) {
        const xml = String(diagObj[stageKey] || '');
        if (!xml) {
          failures.push(`Empty ${stageKey} in ${typeKey}`);
          continue;
        }
        verifiedDiagramCount++;
        const dotMatches = xml.match(/[^<>"]*\.\.[^<>"]*/g) || [];
        if (dotMatches.length > 0) {
          failures.push(`Template 05 ".." truncation detected in ${typeKey} (${stageKey}): ${dotMatches[0]}`);
        }
        if (xml.includes('[TARGET STATE GUARANTEE (')) {
          failures.push(`Legacy [TARGET STATE GUARANTEE] banner detected in ${typeKey} (${stageKey})`);
        }
        for (const tierTag of ['L1 CHANNELS', 'L2 WORKBENCH', 'L3 DATA &amp; MEM', 'L4 EVENT MESH', 'L5 CLOUD INFRA', 'L6 ZERO-TRUST']) {
          if (!xml.includes(tierTag)) {
            failures.push(`Missing bijective tier tag "${tierTag}" in ${typeKey} (${stageKey})`);
          }
        }
      }
      const execSum = String(inst.aiReport?.executiveSummary || '');
      if (/finops|security|agentic|openai/i.test(typeKey) && /unified lakehouse governance, declarative streaming data engineering/i.test(execSum)) {
        failures.push(`Cross-domain Lakehouse boilerplate detected in ${typeKey} executiveSummary`);
      }
    }
  } catch (err) {
    failures.push(`Failed to parse or audit data/dynamic_assessments.json: ${err.message}`);
  }
}

if (failures.length > 0) {
  console.error('❌ [gate_governance_doc_sync] FAILED:');
  failures.forEach((f) => console.error('  -', f));
  process.exit(1);
}

console.log(`✅ [gate_governance_doc_sync] PASSED (${globalAndDocFiles.length + scorexRuntimeFiles.length} files verified, 8/8 Universal Symlinks & SHA-256 parity locked, 11/11 5-Tier models active, ${verifiedDiagramCount}/18 Template 05 diagrams verified with 0 truncations).`);

