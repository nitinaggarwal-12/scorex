import { ASSESSMENTS, GROUPS, assessmentsByGroup } from '../src/data/assessmentCatalog.js';
import * as Icons from 'lucide-react';

const REQUIRED_FIELDS = ['id', 'group', 'variant', 'accent', 'icon', 'name', 'tagline', 'what', 'why', 'where', 'how', 'valueCustomer', 'valueVendor', 'differentiator'];
const VALID_VARIANTS = ['story', 'blueprint', 'dossier', 'editorial', 'canvas', 'bespoke'];
const groupIds = new Set(GROUPS.map((g) => g.id));

let errors = [];

for (const [key, a] of Object.entries(ASSESSMENTS)) {
  if (key !== a.id) errors.push(`${key}: object key doesn't match id field ("${a.id}")`);
  for (const field of REQUIRED_FIELDS) {
    const val = a[field];
    if (val === undefined || val === null || val === '') {
      errors.push(`${key}: missing/empty required field "${field}"`);
    }
  }
  if (!groupIds.has(a.group)) errors.push(`${key}: group "${a.group}" is not a real group id`);
  if (!VALID_VARIANTS.includes(a.variant)) errors.push(`${key}: variant "${a.variant}" is not a recognized variant`);
  if (a.icon && !Icons[a.icon]) errors.push(`${key}: icon "${a.icon}" does not exist in lucide-react`);

  // The BlueprintVariant does meta.how.split(/(?<=[.;])\s+/) -- verify that
  // never produces an empty array (would render an empty <ol>, not a crash,
  // but worth catching if 'how' has no sentence-ending punctuation at all).
  if (a.how) {
    const steps = a.how.split(/(?<=[.;])\s+/).filter(Boolean);
    if (steps.length === 0) errors.push(`${key}: "how" text produces zero steps when split for BlueprintVariant`);
  }
}

// Every group should have at least one assessment (an empty group would
// render a heading with no cards under it on the home page).
for (const g of GROUPS) {
  const items = assessmentsByGroup(g.id);
  if (items.length === 0) errors.push(`Group "${g.id}" (${g.name}) has zero assessments assigned`);
}

// Confirm no group contains two assessments with the same variant
// (defeats the "different style within a group" goal, even though it
// wouldn't crash anything).
for (const g of GROUPS) {
  const items = assessmentsByGroup(g.id).filter((a) => a.variant !== 'bespoke');
  const seen = new Map();
  for (const a of items) {
    if (seen.has(a.variant)) {
      errors.push(`Group "${g.id}": both "${seen.get(a.variant)}" and "${a.id}" use variant "${a.variant}" -- adjacent items will look identical`);
    }
    seen.set(a.variant, a.id);
  }
}

const total = Object.keys(ASSESSMENTS).length;
console.log(`Checked ${total} assessments across ${GROUPS.length} groups.`);

if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  errors.forEach((e) => console.log(`  - ${e}`));
  process.exit(1);
} else {
  console.log('All catalog entries valid: required fields present, icons resolve, variants recognized, no within-group style collisions.');
  process.exit(0);
}
