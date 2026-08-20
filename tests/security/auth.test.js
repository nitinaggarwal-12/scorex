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

test('missing session fails closed with 401', async () => {
  const req = { headers: {}, cookies: {} };
  const res = responseRecorder();
  let nextCalled = false;

  await requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Authentication required');
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

test('demo users are denied admin middleware', async () => {
  const sessionId = 'guest_123e4567-e89b-42d3-a456-426614174000';
  const req = {
    headers: { 'x-session-id': sessionId },
    cookies: {},
    user: guestUserFromSession(sessionId),
    auth: { type: 'demo', sessionId }
  };
  const res = responseRecorder();
  let nextCalled = false;

  await requireAdmin(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.error, 'Admin access required');
});

test('resource ownership helper allows owner/admin and rejects unrelated demo user', () => {
  const owner = { id: 'demo_owner', role: 'demo' };
  const other = { id: 'demo_other', role: 'demo' };
  const admin = { id: 'admin_1', role: 'admin' };
  const resource = { userId: 'demo_owner' };

  assert.equal(canAccessResource(owner, resource), true);
  assert.equal(canAccessResource(other, resource), false);
  assert.equal(canAccessResource(admin, resource), true);
});
