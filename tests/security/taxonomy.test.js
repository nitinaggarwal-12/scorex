const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const taxonomy = require('../../server/data/painPointTaxonomy');
const catalog = require('../../server/providers/gcp/capabilityCatalog');

const PILLAR_DIR = path.join(__dirname, '../../server/data/pillars');

/** Every legacy code the question bank can emit, split by perspective. */
function harvestQuestionBank() {
  const technical = new Set();
  const business = new Set();

  for (const file of fs.readdirSync(PILLAR_DIR)) {
    const src = fs.readFileSync(path.join(PILLAR_DIR, file), 'utf8');
    const marks = [...src.matchAll(/id: '(technical_pain|business_pain|current_state|future_state)'/g)];

    marks.forEach((mark, i) => {
      const end = i + 1 < marks.length ? marks[i + 1].index : src.length;
      const body = src.slice(mark.index, end);
      const codes = [...body.matchAll(/value: '([a-z0-9_]+)'/g)].map((m) => m[1]);

      if (mark[1] === 'technical_pain') codes.forEach((c) => technical.add(c));
      if (mark[1] === 'business_pain') codes.forEach((c) => business.add(c));
    });
  }

  return { technical, business };
}

test('the taxonomy accounts for every code the question bank emits', () => {
  const { technical, business } = harvestQuestionBank();

  const missingTechnical = [...technical].filter(
    (c) => !taxonomy.resolveTechnical(c) && !taxonomy.UNMAPPED_CODES.technical.includes(c)
  );
  const missingBusiness = [...business].filter(
    (c) => !taxonomy.resolveBusiness(c) && !taxonomy.UNMAPPED_CODES.business.includes(c)
  );

  assert.deepEqual(missingTechnical, [],
    'technical codes are neither mapped nor declared unmapped — the taxonomy has drifted from the question bank');
  assert.deepEqual(missingBusiness, [],
    'business codes are neither mapped nor declared unmapped');
});

test('resolution is exact — no substring bucketing', () => {
  // The old engine used painLower.includes(key), so anything containing "cost"
  // landed in the cost bucket. These must NOT resolve.
  for (const bogus of ['cost', 'model', 'slow', 'quality', 'governance', 'siloed', 'deployment']) {
    assert.equal(taxonomy.resolveTechnical(bogus), null,
      `"${bogus}" resolved — the seven-code substring vocabulary has crept back in`);
  }
  assert.equal(taxonomy.resolveTechnical('definitely_not_a_code'), null);
  assert.equal(taxonomy.resolveTechnical(''), null);
  assert.equal(taxonomy.resolveTechnical(null), null);
});

test('real question-bank codes resolve to sensible canonical pains', () => {
  assert.equal(taxonomy.resolveTechnical('slow_queries'), 'slow_performance');
  assert.equal(taxonomy.resolveTechnical('no_lineage'), 'lineage_metadata_gap');
  assert.equal(taxonomy.resolveTechnical('manual_provisioning'), 'access_friction');
});

test('a canonical code resolves to itself', () => {
  for (const code of Object.keys(taxonomy.TECHNICAL_PAINS)) {
    assert.equal(taxonomy.resolveTechnical(code), code);
  }
});

test('no alias is claimed by two canonical codes', () => {
  for (const vocabulary of [taxonomy.TECHNICAL_PAINS, taxonomy.BUSINESS_IMPACTS]) {
    const owner = new Map();
    for (const [canonical, entry] of Object.entries(vocabulary)) {
      for (const alias of entry.aliases) {
        assert.equal(owner.has(alias), false,
          `alias "${alias}" claimed by both ${owner.get(alias)} and ${canonical}`);
        owner.set(alias, canonical);
      }
    }
  }
});

test('every canonical code carries a definition', () => {
  for (const vocabulary of [taxonomy.TECHNICAL_PAINS, taxonomy.BUSINESS_IMPACTS]) {
    for (const [canonical, entry] of Object.entries(vocabulary)) {
      assert.ok(entry.definition && entry.definition.length > 20,
        `${canonical} needs a definition long enough to disambiguate it from its neighbours`);
    }
  }
});

test('vendor catalogs key off technical pains only, never business impacts', () => {
  for (const entry of catalog.CAPABILITIES) {
    for (const code of entry.addressesPainPoints || []) {
      assert.ok(taxonomy.isCanonicalTechnical(code),
        `${entry.id} references "${code}", which is not a canonical technical pain`);
      assert.equal(Object.prototype.hasOwnProperty.call(taxonomy.BUSINESS_IMPACTS, code), false,
        `${entry.id} references business impact "${code}" — impacts are consequences, not things a product fixes`);
    }
  }
});

test('resolveAll reports what it could not resolve rather than dropping it', () => {
  const { resolved, unresolved } = taxonomy.resolveAll(['slow_queries', 'made_up_code']);
  assert.ok(resolved.includes('slow_performance'));
  assert.deepEqual(unresolved, ['made_up_code']);
});

test('coverage does not regress', () => {
  const { technical, business } = harvestQuestionBank();
  const unmappedTechnical = taxonomy.UNMAPPED_CODES.technical.length;
  const unmappedBusiness = taxonomy.UNMAPPED_CODES.business.length;

  // Ratchet. Lower these as codes get mapped; never raise them.
  assert.ok(unmappedTechnical <= 1, `${unmappedTechnical} unmapped technical codes of ${technical.size}`);
  assert.ok(unmappedBusiness <= 2, `${unmappedBusiness} unmapped business codes of ${business.size}`);
});

test('ambiguous codes are declared, not silently double-counted', () => {
  const { technical, business } = harvestQuestionBank();
  const overlap = [...technical].filter((c) => business.has(c)).sort();
  assert.deepEqual(overlap, [...taxonomy.AMBIGUOUS_CODES].sort(),
    'the set of codes appearing under both perspectives has changed');
});
