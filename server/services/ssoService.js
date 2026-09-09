const axios = require('axios');
const crypto = require('crypto');
const userRepository = require('../db/userRepository');
const fileUserStore = require('../db/fileUserStore');

/**
 * 🌐 Universal Enterprise Single Sign-On (SSO) Service
 * 
 * Supports OpenID Connect (OIDC) & OAuth 2.0 across:
 * 1. Google Workspace (Google Identity Services)
 * 2. Microsoft 365 / Entra ID (Azure AD)
 * 3. Okta Enterprise Identity
 * 4. Generic Custom OIDC / SAML Identity Provider (Ping, Auth0, Keycloak, OneLogin, etc.)
 * 5. Universal Corporate Domain Auto-Discovery (@domain.com -> IdP routing)
 * 6. Zero-Config Multi-IdP Sandbox (Instant testing for dev, demo & E2E automation)
 */
class SSOService {
  constructor() {
    this.states = new Map(); // state -> { provider, redirectUri, createdAt, customConfig }
    this.oidcConfigCache = new Map(); // issuer -> { config, cachedAt }
    this.cleanupStatesInterval();
  }

  cleanupStatesInterval() {
    setInterval(() => {
      const now = Date.now();
      for (const [state, data] of this.states.entries()) {
        if (now - data.createdAt > 15 * 60 * 1000) { // 15 mins expiry
          this.states.delete(state);
        }
      }
    }, 5 * 60 * 1000);
  }

  // --- Provider Configuration Checks ---

  isGoogleConfigured() {
    return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  }

  isMicrosoftConfigured() {
    return Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);
  }

  isOktaConfigured() {
    return Boolean(
      (process.env.OKTA_CLIENT_ID && process.env.OKTA_CLIENT_SECRET && (process.env.OKTA_DOMAIN || process.env.OKTA_ISSUER))
    );
  }

  isGenericOidcConfigured() {
    return Boolean(
      process.env.OIDC_CLIENT_ID && process.env.OIDC_CLIENT_SECRET && process.env.OIDC_ISSUER_URL
    );
  }

  isSandboxAllowed() {
    return (
      process.env.NODE_ENV !== 'production' ||
      process.env.ENABLE_SSO_SANDBOX === 'true' ||
      (!this.isGoogleConfigured() && !this.isMicrosoftConfigured() && !this.isOktaConfigured() && !this.isGenericOidcConfigured())
    );
  }

  /**
   * Return metadata for all supported & configured SSO providers
   */
  getConfig() {
    const oktaDomain = process.env.OKTA_DOMAIN || (process.env.OKTA_ISSUER ? new URL(process.env.OKTA_ISSUER).hostname : null);
    const genericIssuer = process.env.OIDC_ISSUER_URL || null;

    return {
      success: true,
      sandboxMode: this.isSandboxAllowed(),
      providers: {
        google: {
          id: 'google',
          name: 'Google Workspace',
          badge: 'Google OIDC',
          icon: 'google',
          configured: this.isGoogleConfigured(),
          clientId: process.env.GOOGLE_CLIENT_ID || null
        },
        microsoft: {
          id: 'microsoft',
          name: 'Microsoft Entra ID',
          badge: 'Azure AD / 365',
          icon: 'microsoft',
          configured: this.isMicrosoftConfigured(),
          clientId: process.env.MICROSOFT_CLIENT_ID || null
        },
        okta: {
          id: 'okta',
          name: 'Okta Enterprise SSO',
          badge: 'Okta OIDC',
          icon: 'okta',
          configured: this.isOktaConfigured(),
          domain: oktaDomain
        },
        generic: {
          id: 'generic',
          name: process.env.OIDC_PROVIDER_NAME || 'Corporate OIDC / Ping',
          badge: 'Custom OIDC',
          icon: 'key',
          configured: this.isGenericOidcConfigured(),
          issuer: genericIssuer
        },
        corporateDomain: {
          id: 'corporate-domain',
          name: 'Corporate Domain SSO',
          badge: 'Auto-Routing',
          icon: 'globe',
          configured: true
        }
      }
    };
  }

  /**
   * Universal Domain Discovery: maps email (@company.com) to identity provider
   */
  lookupDomain(rawEmail) {
    if (!rawEmail || typeof rawEmail !== 'string') {
      return { success: false, error: 'Valid corporate email required' };
    }

    const email = rawEmail.trim().toLowerCase();
    const parts = email.split('@');
    if (parts.length !== 2 || !parts[1]) {
      return { success: false, error: 'Invalid corporate email format' };
    }

    const domain = parts[1];
    let customMap = {};
    try {
      if (process.env.SSO_DOMAIN_MAP) {
        customMap = JSON.parse(process.env.SSO_DOMAIN_MAP);
      }
    } catch (_) {}

    // Check custom domain registry
    if (customMap[domain]) {
      const p = customMap[domain];
      const providerName = p === 'google' ? 'Google Workspace' : p === 'microsoft' ? 'Microsoft Entra ID' : p === 'okta' ? 'Okta' : 'Corporate OIDC';
      return {
        success: true,
        domain,
        provider: p,
        providerName,
        autoRedirect: true
      };
    }

    // Google Workspace heuristics
    if (['google.com', 'googlers.com', 'alphabet.com'].includes(domain)) {
      return {
        success: true,
        domain,
        provider: 'google',
        providerName: 'Google Workspace',
        autoRedirect: true
      };
    }

    // Microsoft Entra ID heuristics
    if (['microsoft.com', 'live.com', 'outlook.com'].includes(domain)) {
      return {
        success: true,
        domain,
        provider: 'microsoft',
        providerName: 'Microsoft Entra ID',
        autoRedirect: true
      };
    }

    // Okta heuristics
    if (['okta.com'].includes(domain)) {
      return {
        success: true,
        domain,
        provider: 'okta',
        providerName: 'Okta Enterprise SSO',
        autoRedirect: true
      };
    }

    // Universal multi-IdP support for corporate domain
    return {
      success: true,
      domain,
      provider: 'universal',
      providerName: `Corporate SSO (@${domain})`,
      autoRedirect: false,
      message: `Corporate domain @${domain} detected. Select your enterprise identity provider to proceed.`
    };
  }

  generateState(provider, redirectUri, extra = {}) {
    const state = crypto.randomBytes(24).toString('hex');
    this.states.set(state, {
      provider,
      redirectUri,
      extra,
      createdAt: Date.now()
    });
    return state;
  }

  verifyState(state) {
    const stored = this.states.get(state);
    if (!stored) return null;
    this.states.delete(state);
    return stored;
  }

  // --- Dynamic OIDC Discovery Helper ---
  async getOidcEndpoints(issuerUrl) {
    if (!issuerUrl) return null;
    const cleanIssuer = issuerUrl.replace(/\/+$/, '');
    const cached = this.oidcConfigCache.get(cleanIssuer);
    if (cached && Date.now() - cached.cachedAt < 60 * 60 * 1000) { // 1 hr cache
      return cached.config;
    }

    try {
      const wellKnownUrl = `${cleanIssuer}/.well-known/openid-configuration`;
      const response = await axios.get(wellKnownUrl, { timeout: 8000 });
      this.oidcConfigCache.set(cleanIssuer, {
        config: response.data,
        cachedAt: Date.now()
      });
      return response.data;
    } catch (err) {
      console.warn(`⚠️ Failed to fetch OIDC discovery from ${cleanIssuer}:`, err.message);
      return null;
    }
  }

  // --- 1. Google Workspace OIDC ---
  getGoogleAuthUrl({ redirectUri, loginHint = '', state = null }) {
    if (!this.isGoogleConfigured()) return null;
    const secureState = state || this.generateState('google', redirectUri);
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      state: secureState
    });
    if (loginHint) params.append('login_hint', loginHint);
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeGoogleCode(code, redirectUri) {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }, { timeout: 10000 });

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000
    });

    const data = userRes.data;
    const email = (data.email || '').toLowerCase().trim();
    const domain = email.split('@')[1] || '';
    const orgName = data.hd 
      ? (data.hd.charAt(0).toUpperCase() + data.hd.slice(1).split('.')[0]) 
      : (domain ? domain.split('.')[0].toUpperCase() : 'Enterprise Organization');

    return {
      email,
      firstName: data.given_name || (data.name ? data.name.split(' ')[0] : 'Corporate'),
      lastName: data.family_name || (data.name ? data.name.split(' ').slice(1).join(' ') : 'User'),
      organization: orgName,
      provider: 'google',
      ssoId: data.sub || data.id,
      picture: data.picture || null
    };
  }

  // --- 2. Microsoft Entra ID (Azure AD) ---
  getMicrosoftAuthUrl({ redirectUri, loginHint = '', state = null }) {
    if (!this.isMicrosoftConfigured()) return null;
    const tenant = process.env.MICROSOFT_TENANT_ID || 'common';
    const secureState = state || this.generateState('microsoft', redirectUri);
    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      response_mode: 'query',
      scope: 'openid email profile User.Read',
      state: secureState
    });
    if (loginHint) params.append('login_hint', loginHint);
    return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  async exchangeMicrosoftCode(code, redirectUri) {
    const tenant = process.env.MICROSOFT_TENANT_ID || 'common';
    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const tokenRes = await axios.post(
      `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
    );

    const accessToken = tokenRes.data.access_token;
    const profileRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000
    });

    const data = profileRes.data;
    const email = (data.mail || data.userPrincipalName || '').toLowerCase().trim();
    const domain = email.split('@')[1] || '';
    const orgName = domain ? domain.split('.')[0].toUpperCase() : 'Enterprise Organization';

    return {
      email,
      firstName: data.givenName || (data.displayName ? data.displayName.split(' ')[0] : 'Corporate'),
      lastName: data.surname || (data.displayName ? data.displayName.split(' ').slice(1).join(' ') : 'User'),
      organization: orgName,
      provider: 'microsoft',
      ssoId: data.id,
      picture: null
    };
  }

  // --- 3. Okta Enterprise SSO ---
  async getOktaAuthUrl({ redirectUri, loginHint = '', state = null }) {
    if (!this.isOktaConfigured()) return null;
    let issuer = process.env.OKTA_ISSUER;
    if (!issuer && process.env.OKTA_DOMAIN) {
      issuer = `https://${process.env.OKTA_DOMAIN.replace(/^https?:\/\//, '')}`;
    }

    const discovery = await this.getOidcEndpoints(issuer);
    const authEndpoint = discovery?.authorization_endpoint || `${issuer}/v1/authorize`;
    const secureState = state || this.generateState('okta', redirectUri);

    const params = new URLSearchParams({
      client_id: process.env.OKTA_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state: secureState
    });
    if (loginHint) params.append('login_hint', loginHint);
    return `${authEndpoint}?${params.toString()}`;
  }

  async exchangeOktaCode(code, redirectUri) {
    let issuer = process.env.OKTA_ISSUER;
    if (!issuer && process.env.OKTA_DOMAIN) {
      issuer = `https://${process.env.OKTA_DOMAIN.replace(/^https?:\/\//, '')}`;
    }

    const discovery = await this.getOidcEndpoints(issuer);
    const tokenEndpoint = discovery?.token_endpoint || `${issuer}/v1/token`;
    const userinfoEndpoint = discovery?.userinfo_endpoint || `${issuer}/v1/userinfo`;

    const params = new URLSearchParams({
      client_id: process.env.OKTA_CLIENT_ID,
      client_secret: process.env.OKTA_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const tokenRes = await axios.post(tokenEndpoint, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000
    });

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get(userinfoEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000
    });

    const data = userRes.data;
    const email = (data.email || '').toLowerCase().trim();
    const domain = email.split('@')[1] || '';
    const orgName = domain ? domain.split('.')[0].toUpperCase() : 'Okta Enterprise';

    return {
      email,
      firstName: data.given_name || (data.name ? data.name.split(' ')[0] : 'Corporate'),
      lastName: data.family_name || (data.name ? data.name.split(' ').slice(1).join(' ') : 'User'),
      organization: orgName,
      provider: 'okta',
      ssoId: data.sub || data.id,
      picture: null
    };
  }

  // --- 4. Generic Custom OIDC / Ping / Auth0 / Keycloak ---
  async getGenericOidcAuthUrl({ redirectUri, loginHint = '', state = null }) {
    if (!this.isGenericOidcConfigured()) return null;
    const issuer = process.env.OIDC_ISSUER_URL;
    const discovery = await this.getOidcEndpoints(issuer);
    const authEndpoint = discovery?.authorization_endpoint || `${issuer}/authorize`;
    const secureState = state || this.generateState('generic', redirectUri);

    const params = new URLSearchParams({
      client_id: process.env.OIDC_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: process.env.OIDC_SCOPES || 'openid email profile',
      state: secureState
    });
    if (loginHint) params.append('login_hint', loginHint);
    return `${authEndpoint}?${params.toString()}`;
  }

  async exchangeGenericOidcCode(code, redirectUri) {
    const issuer = process.env.OIDC_ISSUER_URL;
    const discovery = await this.getOidcEndpoints(issuer);
    const tokenEndpoint = discovery?.token_endpoint || `${issuer}/token`;
    const userinfoEndpoint = discovery?.userinfo_endpoint || `${issuer}/userinfo`;

    const params = new URLSearchParams({
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const tokenRes = await axios.post(tokenEndpoint, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000
    });

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get(userinfoEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000
    });

    const data = userRes.data;
    const email = (data.email || '').toLowerCase().trim();
    const domain = email.split('@')[1] || '';
    const orgName = domain ? domain.split('.')[0].toUpperCase() : 'Enterprise Client';

    return {
      email,
      firstName: data.given_name || (data.name ? data.name.split(' ')[0] : 'Corporate'),
      lastName: data.family_name || (data.name ? data.name.split(' ').slice(1).join(' ') : 'User'),
      organization: orgName,
      provider: 'generic',
      ssoId: data.sub || data.id,
      picture: null
    };
  }

  // --- Just-In-Time (JIT) Enterprise User Provisioning & Session Generation ---
  async provisionOrSyncUser(profile, explicitRole = null) {
    const email = String(profile.email || '').toLowerCase().trim();
    if (!email) {
      throw new Error('SSO identity verification failed: missing email claim from Identity Provider');
    }

    let user = null;
    let sessionId = null;

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const authorDomains = (process.env.AUTHOR_DOMAINS || '')
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    
    const domain = email.split('@')[1] || '';
    let targetRole = explicitRole || 'consumer';
    if (!explicitRole) {
      if (adminEmails.includes(email)) {
        targetRole = 'admin';
      } else if (authorDomains.includes(domain)) {
        targetRole = 'author';
      }
    }

    try {
      user = await userRepository.findByEmail(email);

      if (user) {
        if (explicitRole && user.role !== explicitRole) {
          await userRepository.updateUser(user.id, { role: explicitRole });
          user.role = explicitRole;
        }
        if (typeof userRepository.linkSSOToUser === 'function') {
          await userRepository.linkSSOToUser(user.id, profile.provider, profile.ssoId);
        }
      } else {
        if (typeof userRepository.createSSOUser === 'function') {
          user = await userRepository.createSSOUser({
            email,
            role: targetRole,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            organization: profile.organization || 'Enterprise Organization',
            ssoProvider: profile.provider,
            ssoId: profile.ssoId
          });
        } else {
          user = await userRepository.createUser({
            email,
            password: crypto.randomBytes(24).toString('hex'),
            role: targetRole,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            organization: profile.organization || 'Enterprise Organization',
            createdBy: null
          });
        }
      }

      const session = await userRepository.createSession(user.id);
      sessionId = session.id;

    } catch (dbErr) {
      console.warn('⚠️ Primary PostgreSQL store unavailable during SSO, using file store fallback:', dbErr.message);

      await fileUserStore.initialize();
      user = await fileUserStore.findUserByEmail(email);

      if (!user) {
        user = await fileUserStore.createUser({
          email,
          password: crypto.randomBytes(24).toString('hex'),
          role: targetRole,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          organization: profile.organization || 'Enterprise Organization'
        });
      } else if (explicitRole && user.role !== explicitRole) {
        user.role = explicitRole;
        await fileUserStore.updateUser(user.id, { role: explicitRole });
      }

      sessionId = await fileUserStore.createSession(user.id);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name || profile.firstName || '',
        lastName: user.last_name || profile.lastName || '',
        organization: user.organization || profile.organization || '',
        ssoProvider: profile.provider,
        avatar: profile.picture || null
      },
      sessionId
    };
  }

  // --- Sandbox / Simulated SSO Login for Dev, Demo & E2E Testing ---
  async executeSandboxLogin({ email, role = 'consumer', firstName = '', lastName = '', organization = '', provider = 'google' }) {
    if (!this.isSandboxAllowed()) {
      throw new Error('SSO Sandbox is disabled in strict production mode');
    }

    const cleanEmail = (email || 'architect@enterprise.com').trim().toLowerCase();
    const domain = cleanEmail.split('@')[1] || 'enterprise.com';
    const org = organization || (domain ? domain.split('.')[0].toUpperCase() : 'ENTERPRISE');

    const profile = {
      email: cleanEmail,
      firstName: firstName || (cleanEmail.split('@')[0].split('.')[0] || 'Corporate'),
      lastName: lastName || (cleanEmail.split('@')[0].split('.')[1] || 'Executive'),
      organization: org,
      provider: provider || 'google',
      ssoId: `sandbox_${crypto.randomBytes(8).toString('hex')}`
    };

    return this.provisionOrSyncUser(profile, role);
  }
}

module.exports = new SSOService();
