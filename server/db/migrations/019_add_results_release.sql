-- Add results release control to assessments
-- This allows admins to control when results are visible to authors/consumers

ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS results_released BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS results_released_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS results_released_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessments_results_released ON assessments(results_released);

COMMENT ON COLUMN assessments.results_released IS 'Whether results/reports/benchmarks are visible to non-admin users';
COMMENT ON COLUMN assessments.results_released_by IS 'Admin who released the results';
COMMENT ON COLUMN assessments.results_released_at IS 'When results were released';

