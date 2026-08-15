/**
 * Enterprise Platform Token Manager for Lakebase
 * In Enterprise Platform Apps, the app runs with the user's identity and can access tokens
 * via environment variables that are automatically injected
 */

class PlatformTokenManager {
  constructor() {
    this.currentToken = null;
    this.lastRefresh = 0;
    this.refreshInterval = 15 * 60 * 1000; // Refresh every 15 minutes
  }

  /**
   * Get OAuth token from Enterprise Platform Apps environment
   * Enterprise Platform Apps automatically provides authentication context
   */
  async getToken() {
    const now = Date.now();
    
    // Return cached token if still fresh (< 15 minutes old)
    if (this.currentToken && (now - this.lastRefresh) < this.refreshInterval) {
      return this.currentToken;
    }

    // Refresh the token
    return await this.refreshToken();
  }

  /**
   * Refresh OAuth token
   * Try methods in this order:
   * 1. Use the app's service principal (platform_CLIENT_ID/SECRET from Apps platform)
   * 2. platform_TOKEN (automatically provided by platform)
   * 3. LAKEBASE_PASSWORD (manually set)
   */
  async refreshToken() {
    console.log('🔄 Getting OAuth token for Lakebase...');
    console.log('🔍 Debug: platform_CLIENT_ID exists:', !!process.env.enterprisePlatform_CLIENT_ID);
    console.log('🔍 Debug: platform_CLIENT_SECRET exists:', !!process.env.enterprisePlatform_CLIENT_SECRET);
    console.log('🔍 Debug: LAKEBASE_PASSWORD exists:', !!process.env.LAKEBASE_PASSWORD);
    console.log('🔍 Debug: platform_TOKEN exists:', !!process.env.enterprisePlatform_TOKEN);
    
    // ALWAYS try service principal FIRST (even if LAKEBASE_PASSWORD exists)
    const appClientId = process.env.enterprisePlatform_CLIENT_ID;
    const appClientSecret = process.env.enterprisePlatform_CLIENT_SECRET;
    const workspaceUrl = process.env.enterprisePlatform_HOST || 'https://e2-demo-field-eng.cloud.enterprisePlatform.com';
    
    if (appClientId && appClientSecret && !appClientId.includes('@')) {
      // This is a service principal (UUID format, not email)
      console.log('🔄 Using app service principal for OAuth token...');
      console.log(`📋 Service Principal ID: ${appClientId}`);
      
      try {
        const axios = require('axios');
        const response = await axios.post(
          `${workspaceUrl}/oidc/v1/token`,
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: appClientId,
            client_secret: appClientSecret,
            scope: 'all-apis'
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        this.currentToken = response.data.access_token;
        this.lastRefresh = Date.now();
        console.log('✅ Got OAuth token via app service principal');
        console.log(`🔍 Token length: ${this.currentToken.length} chars`);
        return this.currentToken;
      } catch (spError) {
        console.error('❌ Service principal token failed:', spError.response?.data || spError.message);
        console.error('⚠️  Falling back to other authentication methods...');
        // Continue to fallback methods
      }
    }
    
    // Fallback 1: Check for automatically injected token
    if (process.env.enterprisePlatform_TOKEN) {
      console.log('✅ Using platform_TOKEN from environment');
      this.currentToken = process.env.enterprisePlatform_TOKEN;
      this.lastRefresh = Date.now();
      return this.currentToken;
    }
    
    // Fallback 2: Check for manually set LAKEBASE_PASSWORD (skip if empty string)
    const lakebasePassword = process.env.LAKEBASE_PASSWORD;
    if (lakebasePassword && lakebasePassword.trim() && lakebasePassword !== '""' && lakebasePassword !== "''") {
      console.log('✅ Using LAKEBASE_PASSWORD from environment');
      const token = lakebasePassword.trim();
      console.log(`🔍 Token length: ${token.length} chars`);
      console.log(`🔍 Token prefix: ${token.substring(0, 50)}...`);
      this.currentToken = token;
      this.lastRefresh = Date.now();
      return this.currentToken;
    }
    
    throw new Error('No authentication method available. Set platform_TOKEN or LAKEBASE_PASSWORD in environment.');
  }

  /**
   * Get a fresh connection config with current token
   */
  async getConnectionConfig() {
    const token = await this.getToken();
    
    return {
      host: process.env.LAKEBASE_HOST,
      port: parseInt(process.env.LAKEBASE_PORT) || 5432,
      database: process.env.LAKEBASE_DATABASE,
      user: process.env.LAKEBASE_USER,
      password: token,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }
}

// Export singleton instance
module.exports = new PlatformTokenManager();

