const express = require('express');
const router = express.Router();
const ssoService = require('../services/ssoService');

function getBaseUrl(req) {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const protocol = forwardedProto || req.protocol || 'http';
  const host = req.get('host');
  return `${protocol}://${host}`;
}

function getFrontendUrl(req) {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/+$/, '');
  return getBaseUrl(req);
}

/**
 * GET /api/auth/sso/config
 * Public endpoint to fetch active SSO providers & capabilities
 */
router.get('/config', (req, res) => {
  try {
    const config = ssoService.getConfig();
    res.json(config);
  } catch (error) {
    console.error('[SSO] Config error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch SSO configuration' });
  }
});

/**
 * POST /api/auth/sso/lookup
 * Auto-detect identity provider based on user's corporate email domain
 */
router.post('/lookup', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    const result = ssoService.lookupDomain(email);
    res.json(result);
  } catch (error) {
    console.error('[SSO] Lookup error:', error.message);
    res.status(500).json({ success: false, error: 'Domain discovery failed' });
  }
});

/**
 * GET /api/auth/sso/login/:provider
 * Initiate OAuth 2.0 / OpenID Connect authorization code flow
 */
router.get('/login/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const loginHint = req.query.login_hint || '';
    const baseUrl = getBaseUrl(req);
    const callbackUri = `${baseUrl}/api/auth/sso/callback/${provider}`;

    let authUrl = null;

    if (provider === 'google') {
      authUrl = ssoService.getGoogleAuthUrl({ redirectUri: callbackUri, loginHint });
    } else if (provider === 'microsoft') {
      authUrl = ssoService.getMicrosoftAuthUrl({ redirectUri: callbackUri, loginHint });
    } else if (provider === 'okta') {
      authUrl = await ssoService.getOktaAuthUrl({ redirectUri: callbackUri, loginHint });
    } else if (provider === 'generic') {
      authUrl = await ssoService.getGenericOidcAuthUrl({ redirectUri: callbackUri, loginHint });
    } else {
      return res.status(400).json({ success: false, error: `Unsupported SSO provider: ${provider}` });
    }

    if (!authUrl) {
      // If live credentials not configured, inform caller or offer sandbox redirect in dev mode
      if (ssoService.isSandboxAllowed()) {
        const frontend = getFrontendUrl(req);
        return res.redirect(`${frontend}/?sso_sandbox_prompt=${provider}&login_hint=${encodeURIComponent(loginHint)}`);
      }
      return res.status(503).json({
        success: false,
        error: `SSO Provider "${provider}" is not configured. Please set client credentials in environment variables.`
      });
    }

    // Redirect to Identity Provider
    return res.redirect(authUrl);
  } catch (error) {
    console.error(`[SSO] Login initiation failed:`, error.message);
    const frontend = getFrontendUrl(req);
    return res.redirect(`${frontend}/?sso_error=${encodeURIComponent(error.message)}`);
  }
});

/**
 * GET /api/auth/sso/callback/:provider
 * Receive authorization code from Identity Provider, exchange token, provision user & issue session
 */
router.get('/callback/:provider', async (req, res) => {
  const { provider } = req.params;
  const { code, state, error, error_description } = req.query;
  const frontend = getFrontendUrl(req);

  if (error) {
    console.warn(`[SSO] Provider ${provider} returned error:`, error, error_description);
    return res.redirect(`${frontend}/?sso_error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`${frontend}/?sso_error=missing_authorization_code`);
  }

  // Validate state
  const storedState = ssoService.verifyState(state);
  if (!storedState) {
    console.warn('[SSO] State parameter mismatch or expired');
    return res.redirect(`${frontend}/?sso_error=invalid_or_expired_state`);
  }

  try {
    const baseUrl = getBaseUrl(req);
    const callbackUri = `${baseUrl}/api/auth/sso/callback/${provider}`;

    let profile = null;

    if (provider === 'google') {
      profile = await ssoService.exchangeGoogleCode(code, callbackUri);
    } else if (provider === 'microsoft') {
      profile = await ssoService.exchangeMicrosoftCode(code, callbackUri);
    } else if (provider === 'okta') {
      profile = await ssoService.exchangeOktaCode(code, callbackUri);
    } else if (provider === 'generic') {
      profile = await ssoService.exchangeGenericOidcCode(code, callbackUri);
    } else {
      return res.redirect(`${frontend}/?sso_error=unsupported_provider`);
    }

    // Provision or sync user & issue session
    const authResult = await ssoService.provisionOrSyncUser(profile);

    // Redirect back to frontend with session details
    const redirectParams = new URLSearchParams({
      sso_status: 'success',
      session_id: authResult.sessionId,
      user_id: String(authResult.user.id),
      email: authResult.user.email,
      name: `${authResult.user.firstName} ${authResult.user.lastName}`.trim(),
      role: authResult.user.role,
      organization: authResult.user.organization,
      provider
    });

    return res.redirect(`${frontend}/?${redirectParams.toString()}`);
  } catch (err) {
    console.error(`[SSO] Callback processing failed for ${provider}:`, err.message);
    return res.redirect(`${frontend}/?sso_error=${encodeURIComponent(err.message)}`);
  }
});

/**
 * POST /api/auth/sso/sandbox-login
 * Simulated corporate SSO authentication for development, demo & testing environments
 */
router.post('/sandbox-login', async (req, res) => {
  try {
    const { email, role, firstName, lastName, organization, provider } = req.body;
    const result = await ssoService.executeSandboxLogin({
      email,
      role,
      firstName,
      lastName,
      organization,
      provider
    });

    return res.json({
      success: true,
      message: `Signed in via Corporate SSO (${provider || 'Enterprise IdP'})`,
      sessionId: result.sessionId,
      user: result.user
    });
  } catch (error) {
    console.error('[SSO Sandbox] Error:', error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
