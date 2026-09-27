-- Migration: Add test users for Author and Consumer roles
-- This migration adds test accounts that are displayed on the login screen
-- Created: 2025-01-12

-- Add Author test user
-- Email: author@databricks.com
-- Password: author123
INSERT INTO users (email, password_hash, role, first_name, last_name, organization, is_active)
SELECT 'author@databricks.com', '$2b$10$dbE0yEMT1SXIiCpscsYUlu2W2iU6AavP62tR8dOV0V71tHVBNG13C', 'author', 'Author', 'User', 'Databricks', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'author@databricks.com');

-- Add Consumer test user
-- Email: consumer@example.com
-- Password: consumer123
INSERT INTO users (email, password_hash, role, first_name, last_name, organization, is_active)
SELECT 'consumer@example.com', '$2b$10$SZQqgXNUDwh1WikhSF6UNujAUvgJWU6nB3yIRhp3Yl2NZVrPKaBfa', 'consumer', 'Consumer', 'User', 'Example Corp', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'consumer@example.com');

-- Log the migration
DO $$
BEGIN
  RAISE NOTICE 'Test users created:';
  RAISE NOTICE '  Author: author@databricks.com / author123';
  RAISE NOTICE '  Consumer: consumer@example.com / consumer123';
END $$;

