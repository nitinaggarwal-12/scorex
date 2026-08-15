#!/usr/bin/env node
/**
 * Script to convert assessments.get/set/has calls to async
 * This adds 'await' before storage calls and makes route handlers async
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.js');
let content = fs.readFileSync(indexPath, 'utf8');

// Count original occurrences
const originalGetCount = (content.match(/assessments\.get\(/g) || []).length;
const originalSetCount = (content.match(/assessments\.set\(/g) || []).length;
const originalHasCount = (content.match(/assessments\.has\(/g) || []).length;

console.log(`Found ${originalGetCount} .get() calls, ${originalSetCount} .set() calls, ${originalHasCount} .has() calls`);

// Add await before assessments.get/set/has calls that don't already have it
content = content.replace(/([^a-zA-Z])assessments\.(get|set|has|updateMetadata|saveProgress)\(/g, (match, prefix, method) => {
  // Check if await is already there (look back up to 10 characters)
  const precedingText = content.substring(Math.max(0, content.indexOf(match) - 10), content.indexOf(match));
  if (precedingText.includes('await')) {
    return match; // Already has await
  }
  return `${prefix}await assessments.${method}(`;
});

// Make route handlers async if they aren't already
// Pattern: app.METHOD('path', (req, res) =>  -or-  app.METHOD('path', (req, res, next) =>
content = content.replace(/app\.(get|post|put|patch|delete)\(([^,]+),\s*\(req,\s*res(?:,\s*next)?\)\s*=>/g, (match, method, path) => {
  if (match.includes('async')) {
    return match; // Already async
  }
  // Make it async
  const hasNext = match.includes('next');
  return `app.${method}(${path}, async (req, res${hasNext ? ', next' : ''}) =>`;
});

// Write back
fs.writeFileSync(indexPath, content, 'utf8');

// Count after changes
const newGetCount = (content.match(/await assessments\.get\(/g) || []).length;
const newSetCount = (content.match(/await assessments\.set\(/g) || []).length;
const newHasCount = (content.match(/await assessments\.has\(/g) || []).length;

console.log(`\nAfter conversion:`);
console.log(`  ${newGetCount} await .get() calls`);
console.log(`  ${newSetCount} await .set() calls`);
console.log(`  ${newHasCount} await .has() calls`);
console.log(`\n✅ Conversion complete!`);
console.log(`\n⚠️  Please review the changes and test thoroughly!`);






