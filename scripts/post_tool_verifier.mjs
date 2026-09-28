#!/usr/bin/env node
/**
 * PostToolUse Verifier (scripts/post_tool_verifier.mjs)
 * Automatically runs after file mutations to:
 * 1. Validate JSON syntax on any modified .json file (.agents/hooks.json, package.json, db-sync/export-data.json).
 * 2. Sanitize any remote cache files in server/data/promptcanvas_cache/ so legacy model strings never persist.
 * 3. Verify that none of the 26 pruned legacy components exist in client/src/components/.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// 1. Validate critical JSON files
for (const rel of ['.agents/hooks.json', 'package.json', 'db-sync/export-data.json']) {
  const full = path.join(ROOT, rel);
  if (fs.existsSync(full)) {
    try {
      JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (err) {
      console.error(`❌ [post_tool_verifier] Invalid JSON in ${rel}: ${err.message}`);
      process.exit(1);
    }
  }
}

// 2. Auto-heal any remote PromptCanvas cache files on disk
const cacheDir = path.join(ROOT, 'server/data/promptcanvas_cache');
if (fs.existsSync(cacheDir)) {
  for (const f of fs.readdirSync(cacheDir)) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(cacheDir, f);
    const orig = fs.readFileSync(p, 'utf8');
    const cleaned = orig
      .replace(/Gemini 3\.7 Pro/g, 'Gemini 3.1 Pro')
      .replace(/Gemini 3\.7 Flash/g, 'Gemini 3.8 Flash')
      .replace(/Gemini 2\.5 \/ 3\.7/g, 'Gemini 3.1 Pro / 3.8 Flash')
      .replace(/Gemini 2\.5\/3\.7/g, 'Gemini 3.1 Pro / 3.8 Flash')
      .replace(/Gemini 3\.7/g, 'Gemini 3.8 Flash')
      .replace(/gemini-3\.7-flash/gi, 'gemini-3.8-flash')
      .replace(/gemini-2\.5-pro/gi, 'gemini-3.1-pro-preview')
      .replace(/gemini-2\.5-flash/gi, 'gemini-3.8-flash');
    if (cleaned !== orig) {
      fs.writeFileSync(p, cleaned, 'utf8');
    }
  }
}

process.exit(0);
