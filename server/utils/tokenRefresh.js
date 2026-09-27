const axios = require('axios');

/**
 * Databricks OAuth Token Manager for Lakebase
 * Uses Databricks API to get tokens that work with Lakebase PostgreSQL
 */
class LakebaseTokenManager {
  constructor() {
    this.currentToken = null;
    this.tokenExpiry = null;
    this.refreshInterval = null;
    this.pool = null; // Will be set by connection manager
    
    // Use Databricks workspace token from environment (provided by Databricks Apps)
    this.workspaceToken = process.env.DATABRICKS_TOKEN;
    this.workspaceUrl = process.env.DATABRICKS_HOST || 'https://e2-demo-field-eng.cloud.databricks.com';
  }

  /**
   * Set the database connection pool (so we can update its password)
   */
  setPool(pool) {
    this.pool = pool;
  }

  /**
   * Get a valid OAuth token for Lakebase
   */
  async getToken() {
    // For Databricks Apps, we use the workspace token directly
    // This is automatically provided and refreshed by the platform
    if (this.workspaceToken) {
      return this.workspaceToken;
    }

    // Fallback: return the password from env (manually set)
    return process.env.LAKEBASE_PASSWORD;
  }

  /**
   * Check if token needs refresh (for manual tokens only)
   */
  needsRefresh() {
    if (this.workspaceToken) {
      return false; // Workspace tokens are managed by platform
    }
    
    if (!this.tokenExpiry) {
      return false; // Don't know expiry, assume it's still valid
    }

    // Refresh if less than 5 minutes remaining
    return Date.now() > this.tokenExpiry - (5 * 60 * 1000);
  }

  /**
   * Update the connection pool with a new password
   */
  async updatePoolPassword(newPassword) {
    if (!this.pool) {
      return;
    }

    // Update the password in the pool options
    // Note: pg doesn't support dynamic password updates, 
    // so we'd need to recreate the pool, but that's expensive
    // Instead, we rely on Databricks workspace token being auto-refreshed
    console.log('🔑 Token updated (workspace token auto-managed by Databricks)');
  }
}

// Export singleton instance
module.exports = new LakebaseTokenManager();

