const crypto = require('crypto');
const userRepository = require('../db/userRepository');
const fileUserStore = require('../db/fileUserStore');

// Track file store initialization
let fileStoreInitialized = false;

const GUEST_SESSION_RE = /^guest_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const AUTH_ERROR = { error: 'Authentication required' };

function getSessionId(req) {
  return req.headers['x-session-id'] || req.cookies?.sessionId || null;
}

function isGuestSession(sessionId) {
  return typeof sessionId === 'string' && GUEST_SESSION_RE.test(sessionId);
}

function guestUserFromSession(sessionId) {
  const fingerprint = crypto.createHash('sha256').update(sessionId).digest('hex').slice(0, 24);
  return {
    id: `demo_${fingerprint}`,
    email: `demo-${fingerprint.slice(0, 8)}@scorex.local`,
    role: 'demo',
    firstName: 'Demo',
    lastName: 'Guest',
    organization: 'ScoreX Demo Workspace',
    isDemo: true,
    sessionFingerprint: fingerprint
  };
}

function fileAuthAllowed() {
  return process.env.ALLOW_FILE_AUTH === 'true' && process.env.NODE_ENV !== 'production';
}

/**
 * Authenticate a request.
 *
 * Security invariants:
 * - Missing, malformed, expired, or unverifiable sessions fail closed.
 * - Demo access is explicit and least-privileged. A demo session can never become admin.
 * - Guest identity is stable for the life of the UUID session and can be used for resource ownership.
 * - File-based identity fallback is opt-in and disabled in production.
 */
async function requireAuth(req, res, next) {
  // Global hardening may already have authenticated this request. Do not re-query the identity store.
  if (req.user && req.auth) {
    return next();
  }

  const sessionId = getSessionId(req);

  if (!sessionId || sessionId === 'null' || sessionId === 'undefined') {
    return res.status(401).json(AUTH_ERROR);
  }

  if (isGuestSession(sessionId)) {
    req.user = guestUserFromSession(sessionId);
    req.auth = { type: 'demo', sessionId };
    return next();
  }

  try {
    let session = null;

    try {
      session = await userRepository.verifySession(sessionId);
    } catch (dbError) {
      if (!fileAuthAllowed()) {
        console.warn('[Auth] Primary identity store unavailable:', dbError.message);
        return res.status(503).json({ error: 'Authentication service temporarily unavailable' });
      }

      if (!fileStoreInitialized) {
        await fileUserStore.initialize();
        fileStoreInitialized = true;
      }
      session = await fileUserStore.verifySession(sessionId);
    }

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Never default an authenticated user to an elevated role.
    req.user = {
      id: session.id,
      email: session.email,
      role: session.role || 'consumer',
      firstName: session.first_name || '',
      lastName: session.last_name || '',
      organization: session.organization || ''
    };
    req.auth = { type: 'user', sessionId };

    return next();
  } catch (error) {
    console.warn('[Auth] Session verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(AUTH_ERROR);
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    return next();
  };
}

function authenticateThenAuthorize(roles, errorMessage) {
  return async (req, res, next) => {
    await requireAuth(req, res, () => {
      if (req.user && roles.includes(req.user.role)) {
        return next();
      }
      return res.status(403).json({ error: errorMessage });
    });
  };
}

const requireAdmin = authenticateThenAuthorize(['admin'], 'Admin access required');
const requireAuthorOrAdmin = authenticateThenAuthorize(
  ['author', 'admin'],
  'Author or admin access required'
);

const LEGACY_PUBLIC_OWNERS = new Set([
  'guest_admin',
  'system_unowned',
  'system',
  'demo_guest',
  'admin_guest',
  'guest',
  'public',
  'unowned',
  'user'
]);

function isLegacyOrPublicResource(resource, ownerFields) {
  if (!resource) return false;
  if (resource.isSample || resource.isSampleReport || resource.is_sample) return true;
  if (typeof resource.id === 'string' && (resource.id.startsWith('sample_') || resource.id.startsWith('inst_'))) {
    return true;
  }

  const explicitOwners = ownerFields
    .map((field) => resource[field])
    .filter((val) => val !== undefined && val !== null && String(val).trim() !== '');

  // If no owner field is populated, it is a legacy unowned resource
  if (explicitOwners.length === 0) return true;

  // If all specified owner fields are recognized legacy/system markers, it is a legacy public resource
  return explicitOwners.every((owner) => LEGACY_PUBLIC_OWNERS.has(String(owner).toLowerCase().trim()));
}

/**
 * Resource ownership helper used by assessment routes.
 * Admins may access all resources. Other roles may access resources they own,
 * or legacy/unowned/starter resources created prior to session fingerprinting.
 */
function canAccessResource(user, resource, ownerFields = ['userId', 'user_id', 'ownerId', 'owner_id', 'createdBy']) {
  if (!user || !resource) return false;
  if (user.role === 'admin') return true;

  const userId = String(user.id);
  const isDirectOwner = ownerFields.some((field) => {
    const owner = resource[field];
    return owner !== undefined && owner !== null && String(owner) === userId;
  });

  if (isDirectOwner) return true;

  // Allow access to legacy, unowned, guest, or sample resources for all authenticated sessions (demo, consumer, author)
  if (isLegacyOrPublicResource(resource, ownerFields)) {
    return true;
  }

  return false;
}

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  requireAuthorOrAdmin,
  canAccessResource,
  isGuestSession,
  guestUserFromSession
};
