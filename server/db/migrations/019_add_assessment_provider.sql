-- Migration: pin every assessment to exactly one vendor provider.
--
-- Assessments created before this column existed were all produced by the
-- Databricks recommendation engine, so that is the correct backfill value. Do not
-- change it to 'gcp' retroactively: it would relabel reports customers have
-- already been shown.
--
-- The column is NOT NULL with a CHECK constraint so the application cannot write
-- an assessment whose vendor is unknown. server/providers/index.js fails closed on
-- a missing provider; this makes the database agree with that contract.

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS provider VARCHAR(32);

UPDATE assessments SET provider = 'databricks' WHERE provider IS NULL;

ALTER TABLE assessments
  ALTER COLUMN provider SET DEFAULT 'gcp',
  ALTER COLUMN provider SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'assessments_provider_check'
  ) THEN
    ALTER TABLE assessments
      ADD CONSTRAINT assessments_provider_check
      CHECK (provider IN ('gcp', 'databricks'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_assessments_provider ON assessments(provider);
