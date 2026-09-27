-- Migration 021: Fix assessments user_id column type to VARCHAR(255)
-- Enables assessments to store alphanumeric demo identities (e.g. demo_...)
-- without PostgreSQL type errors, dropping the serial integer foreign key constraint.

DO $$
BEGIN
  -- Drop foreign key constraint if present
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'assessments_user_id_fkey' 
    AND table_name = 'assessments'
  ) THEN
    ALTER TABLE assessments DROP CONSTRAINT assessments_user_id_fkey;
  END IF;

  -- Alter column to VARCHAR(255)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assessments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE assessments ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::text;
  ELSE
    ALTER TABLE assessments ADD COLUMN user_id VARCHAR(255);
  END IF;
END $$;
