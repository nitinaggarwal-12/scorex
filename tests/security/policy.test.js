const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('file authentication has no built-in default administrator credentials', () => {
  const source = read('server/db/fileUserStore.js');
  assert.equal(source.includes('admin123'), false);
  assert.equal(source.includes('admin@databricks.com'), false);
  assert.match(source, /without default credentials/);
});

test('data cleanup is globally admin-only', () => {
  const source = read('server/routes/dataCleanup.js');
  assert.match(source, /router\.use\(requireAdmin\)/);
});

test('AI/audio/chat/dynamic routes establish authenticated identity', () => {
  for (const file of [
    'server/routes/audio.js',
    'server/routes/chat.js',
    'server/routes/dynamicAssessments.js',
    'server/routes/genaiReadiness.js'
  ]) {
    const source = read(file);
    assert.match(source, /requireAuth/);
  }
});

test('feedback PII reads are admin-only', () => {
  const source = read('server/routes/feedback.js');
  assert.match(source, /router\.get\('\/', requireAdmin/);
  assert.match(source, /router\.get\('\/stats\/summary', requireAdmin/);
  assert.match(source, /router\.get\('\/:id', requireAdmin/);
});

test('production bootstrap installs global security hardening', () => {
  const source = read('server/index.js');
  assert.match(source, /installSecurity\(app\)/);
  assert.match(read('server/security/hardening.js'), /all API routes require a verified registered or isolated/);
});

test('browser demo user is least privileged', () => {
  const source = read('client/src/services/authService.js');
  assert.match(source, /role: 'demo'/);
  assert.equal(source.includes("role: 'admin'"), false);
  assert.match(source, /guest_\$\{createUuid\(\)\}/);
});

test('runtime customer/auth JSON stores are not tracked', () => {
  const forbidden = [
    'data/users.json',
    'data/sessions.json',
    'data/assessments.json',
    'data/assignments.json',
    'data/notifications.json',
    'server/data/feedback.json'
  ];
  for (const relativePath of forbidden) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), false, `${relativePath} must not be tracked`);
  }
});

test('hard-coded test credential bootstrap file is removed', () => {
  assert.equal(fs.existsSync(path.join(root, 'CREATE_TEST_USERS.sql')), false);
});

test('assignment facade uses cryptographic temporary credentials', () => {
  const source = read('server/routes/assignments.js');
  assert.match(source, /crypto\.randomBytes\(18\)/);
  assert.equal(source.includes('Math.random()'), false);
});
