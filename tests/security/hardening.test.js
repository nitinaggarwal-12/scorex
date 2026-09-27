const test = require('node:test');
const assert = require('node:assert/strict');

const {
  allowedOrigin,
  isAssessmentIdPath,
  isPublicApiPath
} = require('../../server/security/hardening');

function mockRequest({
  path = '/',
  method = 'GET',
  host = 'scorex.example.com',
  protocol = 'https',
  headers = {}
} = {}) {
  return {
    path,
    method,
    protocol,
    headers,
    get(name) {
      if (String(name).toLowerCase() === 'host') return host;
      return headers[String(name).toLowerCase()];
    }
  };
}

test('same-origin browser origin is allowed', () => {
  const req = mockRequest();
  assert.equal(allowedOrigin(req, 'https://scorex.example.com'), true);
});

test('unexpected browser origin is rejected when not configured', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousOrigins = process.env.ALLOWED_ORIGINS;
  const previousFrontend = process.env.FRONTEND_URL;
  process.env.NODE_ENV = 'production';
  delete process.env.ALLOWED_ORIGINS;
  delete process.env.FRONTEND_URL;

  try {
    const req = mockRequest();
    assert.equal(allowedOrigin(req, 'https://evil.example'), false);
  } finally {
    process.env.NODE_ENV = previousNodeEnv;
    if (previousOrigins === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = previousOrigins;
    if (previousFrontend === undefined) delete process.env.FRONTEND_URL;
    else process.env.FRONTEND_URL = previousFrontend;
  }
});

test('legacy assessment resource paths resolve an ownership id', () => {
  assert.equal(isAssessmentIdPath('/api/assessment/abc-123'), 'abc-123');
  assert.equal(isAssessmentIdPath('/api/assessments/abc-123/report'), 'abc-123');
  assert.equal(isAssessmentIdPath('/api/assessment/framework'), null);
  assert.equal(isAssessmentIdPath('/api/assessment/generate-sample'), null);
});

test('only login POST and API health GET are public API operations', () => {
  assert.equal(isPublicApiPath(mockRequest({ path: '/api/auth/login', method: 'POST' })), true);
  assert.equal(isPublicApiPath(mockRequest({ path: '/api/health', method: 'GET' })), true);
  assert.equal(isPublicApiPath(mockRequest({ path: '/api/auth/me', method: 'GET' })), false);
  assert.equal(isPublicApiPath(mockRequest({ path: '/api/data-cleanup/data-quality-stats', method: 'GET' })), false);
});
