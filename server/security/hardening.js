const axios = require('axios');
const requestContext = require('./requestContext');
const assessmentRepository = require('../db/assessmentRepository');
const { requireAuth, canAccessResource } = require('../middleware/auth');

const originalAssessmentCreate = assessmentRepository.create.bind(assessmentRepository);
let repositoryWrapped = false;

function isPrivileged(user) {
  return user?.role === 'admin' || user?.role === 'author';
}

function sameOrigin(req, origin) {
  try {
    const url = new URL(origin);
    const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
    const protocol = forwardedProto || req.protocol || 'https';
    const host = req.get('host');
    return url.origin === `${protocol}://${host}`;
  } catch (_) {
    return false;
  }
}

function allowedOrigin(req, origin) {
  if (!origin) return true;
  if (sameOrigin(req, origin)) return true;

  const configured = new Set(
    String(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );

  if (configured.has(origin)) return true;

  if (process.env.NODE_ENV !== 'production') {
    try {
      const hostname = new URL(origin).hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    } catch (_) {
      return false;
    }
  }

  return false;
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (!origin || !allowedOrigin(req, origin)) return;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Id');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
}

function isAssessmentIdPath(pathname) {
  const match = pathname.match(/^\/api\/(?:assessment|assessments)\/([^/]+)/);
  if (!match) return null;

  const reserved = new Set([
    'framework',
    'start',
    'generate-sample',
    'generate-multiple-samples',
    'samples',
    'bulk',
    'compare'
  ]);

  return reserved.has(match[1]) ? null : match[1];
}

function authenticate(req, res) {
  return new Promise((resolve) => {
    let resolved = false;
    const originalEnd = res.end;

    // requireAuth normally calls next or terminates the response. Resolve false when it terminates.
    res.end = function patchedEnd(...args) {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
      return originalEnd.apply(this, args);
    };

    Promise.resolve(requireAuth(req, res, () => {
      if (!resolved) {
        resolved = true;
        res.end = originalEnd;
        resolve(true);
      }
    })).catch(() => {
      if (!resolved) {
        resolved = true;
        res.end = originalEnd;
        resolve(false);
      }
    });
  });
}

async function handleSafeLogoFetch(req, res) {
  const authenticated = await authenticate(req, res);
  if (!authenticated) return true;

  const input = req.body?.url;
  if (!input || typeof input !== 'string') {
    res.status(400).json({ success: false, message: 'URL is required' });
    return true;
  }

  let parsed;
  try {
    parsed = new URL(input);
  } catch (_) {
    res.status(400).json({ success: false, message: 'Invalid URL format' });
    return true;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    res.status(400).json({ success: false, message: 'Only HTTP(S) URLs are supported' });
    return true;
  }

  // Do not fetch arbitrary user-controlled hosts from the ScoreX server. Retrieve a favicon
  // through a fixed Google endpoint instead, eliminating the SSRF primitive in the legacy route.
  try {
    const faviconResponse = await axios.get('https://www.google.com/s2/favicons', {
      params: { domain: parsed.hostname, sz: 256 },
      responseType: 'arraybuffer',
      timeout: 8_000,
      maxRedirects: 2,
      validateStatus: (status) => status >= 200 && status < 300
    });

    const contentType = faviconResponse.headers['content-type'] || 'image/png';
    const base64 = Buffer.from(faviconResponse.data).toString('base64');
    res.json({ success: true, data: `data:${contentType};base64,${base64}` });
  } catch (error) {
    console.warn('[Security] Safe logo fetch failed:', error.message);
    res.status(502).json({ success: false, message: 'Unable to retrieve a public logo for this domain' });
  }

  return true;
}

async function enforceAssessmentAccess(req, res, id) {
  const authenticated = await authenticate(req, res);
  if (!authenticated) return false;

  if (isPrivileged(req.user)) return true;

  const assessment = await assessmentRepository.findById(id);
  if (!assessment) {
    res.status(404).json({ success: false, error: 'Assessment not found' });
    return false;
  }

  if (!canAccessResource(req.user, assessment, ['userId', 'user_id', 'ownerId', 'owner_id', 'createdBy'])) {
    res.status(403).json({ success: false, error: 'Access denied' });
    return false;
  }

  req.securityAssessment = assessment;
  return true;
}

async function handleOwnAssessmentList(req, res) {
  const authenticated = await authenticate(req, res);
  if (!authenticated) return true;
  if (isPrivileged(req.user)) return false;

  try {
    const assessments = await assessmentRepository.findAll();
    const owned = assessments.filter((assessment) =>
      canAccessResource(req.user, assessment, ['userId', 'user_id', 'ownerId', 'owner_id', 'createdBy'])
    );
    res.json({ success: true, assessments: owned, count: owned.length });
  } catch (error) {
    console.error('[Security] Failed to list owned assessments:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch assessments' });
  }

  return true;
}

function wrapRepositoryOwnership() {
  if (repositoryWrapped) return;
  repositoryWrapped = true;

  assessmentRepository.create = async function secureCreate(assessment = {}) {
    const store = requestContext.getStore();
    const activeUser = store?.req?.user;
    const ownerId = assessment.userId || assessment.user_id || activeUser?.id || null;

    // Never silently convert unowned records into a shared guest/admin identity.
    const secured = {
      ...assessment,
      userId: ownerId || 'system_unowned'
    };
    return originalAssessmentCreate(secured);
  };
}

function removePermissiveCors(app) {
  if (!app?._router?.stack) return;
  app._router.stack = app._router.stack.filter((layer) => layer.handle?.name !== 'corsMiddleware');
}

function insertBeforeFirstRoute(app, middleware) {
  app.use(middleware);
  const stack = app._router?.stack;
  if (!stack?.length) return;

  const layer = stack.pop();
  const firstRouteIndex = stack.findIndex((entry) => entry.route || entry.name === 'router');
  stack.splice(firstRouteIndex >= 0 ? firstRouteIndex : 0, 0, layer);
}

function installSecurity(app) {
  wrapRepositoryOwnership();
  removePermissiveCors(app);

  insertBeforeFirstRoute(app, (req, res, next) => {
    requestContext.run({ req }, async () => {
      try {
        const origin = req.headers.origin;
        if (origin && !allowedOrigin(req, origin)) {
          return res.status(403).json({ success: false, error: 'Origin not allowed' });
        }

        setCorsHeaders(req, res);
        if (req.method === 'OPTIONS') return res.status(204).end();

        if (req.path === '/status') {
          return res.status(200).json({
            success: true,
            status: 'ok',
            service: 'scorex-api'
          });
        }

        if (req.path === '/api/fetch-logo' && req.method === 'POST') {
          await handleSafeLogoFetch(req, res);
          return;
        }

        // The collection endpoint previously relied on role-specific legacy behavior that did
        // not understand the new demo role. Limited users now receive only their own resources.
        if (req.path === '/api/assessments' && req.method === 'GET') {
          const handled = await handleOwnAssessmentList(req, res);
          if (handled) return;
        }

        const assessmentId = isAssessmentIdPath(req.path);
        if (assessmentId) {
          const allowed = await enforceAssessmentAccess(req, res, assessmentId);
          if (!allowed) return;
        }

        return next();
      } catch (error) {
        console.error('[Security] Global hardening middleware failed:', error.message);
        return res.status(500).json({ success: false, error: 'Security validation failed' });
      }
    });
  });

  return app;
}

module.exports = {
  installSecurity,
  allowedOrigin,
  isAssessmentIdPath
};
