-- Migration 022: Add SSO fields to users table for Google Workspace & Microsoft Entra ID
-- Enables Just-In-Time (JIT) provisioning and passwordless corporate SSO authentication

ALTER TABLE users ADD COLUMN IF NOT EXISTS sso_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS sso_id VARCHAR(255);

-- Allow password_hash to be nullable for pure SSO users who authenticate via OAuth 2.0 / OIDC
DO $$
BEGIN
  ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- Index for fast SSO user lookups
CREATE INDEX IF NOT EXISTS idx_users_sso ON users(sso_provider, sso_id);
