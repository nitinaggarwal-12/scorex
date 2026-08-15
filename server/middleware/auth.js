const userRepository = require('../db/userRepository');
const fileUserStore = require('../db/fileUserStore');

// Track file store initialization
let fileStoreInitialized = false;

// Middleware to check if user is authenticated
async function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  
  console.log('[Auth Middleware] ============================================');
  console.log('[Auth Middleware] Request URL:', req.url);
  console.log('[Auth Middleware] Headers:', Object.keys(req.headers));
  console.log('[Auth Middleware] x-session-id header:', req.headers['x-session-id']);
  console.log('[Auth Middleware] Session ID from headers:', sessionId);
  
  if (!sessionId) {
    console.log('[Auth Middleware] No session ID provided - returning 401');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    console.log('[Auth Middleware] Calling userRepository.verifySession...');
    let session = null;
    
    try {
      session = await userRepository.verifySession(sessionId);
    } catch (dbError) {
      // If PostgreSQL is not available, fall back to file storage
      console.log('[Auth Middleware] PostgreSQL not available, using file storage');
      if (!fileStoreInitialized) {
        await fileUserStore.initialize();
        fileStoreInitialized = true;
      }
      session = await fileUserStore.verifySession(sessionId);
    }
    
    console.log('[Auth Middleware] Session verification result:', session);
    
    if (!session) {
      console.log('[Auth Middleware] Invalid or expired session - returning 401');
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    
    // Attach user info to request
    req.user = {
      id: session.id,
      email: session.email,
      role: session.role,
      firstName: session.first_name,
      lastName: session.last_name,
      organization: session.organization
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

// Middleware to check if user has specific role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Middleware to check if user is admin
async function requireAdmin(req, res, next) {
  // First authenticate
  await requireAuth(req, res, () => {
    // Then check if admin
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  });
}

// Middleware to check if user is author or admin
async function requireAuthorOrAdmin(req, res, next) {
  // First authenticate
  await requireAuth(req, res, () => {
    // Then check if author or admin
    if (req.user && (req.user.role === 'author' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ error: 'Author or admin access required' });
    }
  });
}

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  requireAuthorOrAdmin
};

