-- ============================================
-- CREATE TEST USERS FOR DATABRICKS ASSESSMENT
-- ============================================
-- Run this SQL script in your PostgreSQL database to create test users
-- These match the credentials shown on the login screen

-- 1. ADMIN USER
-- Email: admin@databricks.com
-- Password: admin123
INSERT INTO users (email, password_hash, role, first_name, last_name, organization, is_active)
VALUES ('admin@databricks.com', '$2b$10$kSwD41xn7FJJxHI66SNuU.AbjNsDBfMcSXChtqP2MvRonq53.EwtO', 'admin', 'Admin', 'User', 'Databricks', true)
ON CONFLICT (email) DO NOTHING;

-- 2. AUTHOR USER
-- Email: author@databricks.com
-- Password: author123
INSERT INTO users (email, password_hash, role, first_name, last_name, organization, is_active)
VALUES ('author@databricks.com', '$2b$10$dbE0yEMT1SXIiCpscsYUlu2W2iU6AavP62tR8dOV0V71tHVBNG13C', 'author', 'Author', 'User', 'Databricks', true)
ON CONFLICT (email) DO NOTHING;

-- 3. CONSUMER USER
-- Email: consumer@example.com
-- Password: consumer123
INSERT INTO users (email, password_hash, role, first_name, last_name, organization, is_active)
VALUES ('consumer@example.com', '$2b$10$SZQqgXNUDwh1WikhSF6UNujAUvgJWU6nB3yIRhp3Yl2NZVrPKaBfa', 'consumer', 'Consumer', 'User', 'Example Corp', true)
ON CONFLICT (email) DO NOTHING;

-- Verify users were created
SELECT email, role, first_name, last_name, organization, is_active 
FROM users 
WHERE email IN ('admin@databricks.com', 'author@databricks.com', 'consumer@example.com')
ORDER BY role;

-- Expected output:
-- email                      | role     | first_name | last_name | organization | is_active
-- ---------------------------+----------+------------+-----------+--------------+-----------
-- admin@databricks.com       | admin    | Admin      | User      | Databricks   | t
-- author@databricks.com      | author   | Author     | User      | Databricks   | t
-- consumer@example.com       | consumer | Consumer   | User      | Example Corp | t


