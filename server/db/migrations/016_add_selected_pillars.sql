-- Migration: Add selected_pillars column to assessments table
-- This allows assessments to be scoped to specific pillars

ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS selected_pillars JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN assessments.selected_pillars IS 'Array of pillar IDs selected for this assessment';

-- Create index for querying by selected pillars
CREATE INDEX IF NOT EXISTS idx_assessments_selected_pillars ON assessments USING GIN (selected_pillars);


