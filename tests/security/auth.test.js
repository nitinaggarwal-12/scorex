const test = require('node:test');
const assert = require('node:assert/strict');

const {
  requireAuth,
  requireAdmin,
  canAccessResource,
  isGuestSession,
  guestUserFromSession
} = require('../../server/middleware/auth');

function responseRecorder() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('missing session defaults to least-privileged demo guest, never admin', async () => {
  const req = { headers: {}, cookies: {} };
  const res = responseRecorder();
  let nextCalled = false;

  await requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(req.user.role, 'demo');
  assert.notEqual(req.user.role, 'admin');
});

test('secure guest UUID becomes a demo user, never an administrator', async () => {
  const sessionId = 'guest_123e4567-e89b-42d3-a456-426614174000';
  const req = { headers: { 'x-session-id': sessionId }, cookies: {} };
  const res = responseRecorder();
  let nextCalled = false;

  await requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(req.user.role, 'demo');
  assert.equal(req.user.isDemo, true);
  assert.match(req.user.id, /^demo_[0-9a-f]{24}$/);
  assert.notEqual(req.user.role, 'admin');
});

test('legacy guest/admin-like session formats are rejected as guest sessions', () => {
  assert.equal(isGuestSession('guest_admin_session_123'), false);
  assert.equal(isGuestSession('admin_guest_123'), false);
  assert.equal(isGuestSession('guest-123'), false);
});

test('demo identity is deterministic for a session without exposing the session', () => {
  const sessionId = 'guest_123e4567-e89b-42d3-a456-426614174000';
  const first = guestUserFromSession(sessionId);
  const second = guestUserFromSession(sessionId);

  assert.equal(first.id, second.id);
  assert.equal(first.role, 'demo');
  assert.equal(first.sessionFingerprint.length, 24);
  assert.equal(JSON.stringify(first).includes(sessionId), false);
});

test('consumer users without admin or demo role are denied admin middleware', async () => {
  const req = {
    headers: {},
    cookies: {},
    user: { id: 'consumer_1', role: 'consumer' },
    auth: { type: 'user', sessionId: 'sess_1' }
  };
  const res = responseRecorder();
  let nextCalled = false;

  await requireAdmin(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.error, 'Admin access required');
});

test('resource ownership helper allows owner/admin and rejects unrelated demo user on unreleased private resource', () => {
  const owner = { id: 'user_owner', role: 'consumer' };
  const other = { id: 'demo_other', role: 'demo' };
  const admin = { id: 'admin_1', role: 'admin' };
  const resource = { userId: 'user_owner', results_released: false };

  assert.equal(canAccessResource(owner, resource), true);
  assert.equal(canAccessResource(other, resource), false);
  assert.equal(canAccessResource(admin, resource), true);
});

test('resource ownership helper allows demo and consumer access to legacy unowned and starter resources', () => {
  const demoUser = { id: 'demo_1234567890abcdef12345678', role: 'demo', isDemo: true };
  const consumerUser = { id: 'user_456', role: 'consumer' };

  assert.equal(canAccessResource(demoUser, { userId: null }), true);
  assert.equal(canAccessResource(demoUser, {}), true);
  assert.equal(canAccessResource(demoUser, { userId: 'guest_admin' }), true);
  assert.equal(canAccessResource(demoUser, { userId: 'system_unowned' }), true);
  assert.equal(canAccessResource(demoUser, { isSample: true, userId: 'other_user' }), true);
  assert.equal(canAccessResource(consumerUser, { userId: 'guest_admin' }), true);
  assert.equal(canAccessResource(consumerUser, { user_id: null }), true);
  assert.equal(canAccessResource(demoUser, { userId: 'other_private_user', results_released: false }), false);
});
