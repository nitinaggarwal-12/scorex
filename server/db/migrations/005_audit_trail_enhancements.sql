-- Enhanced Audit Trail for Assessments
-- Tracks ALL changes with detailed impact analysis

-- Create audit_events table for comprehensive change tracking
CREATE TABLE IF NOT EXISTS audit_events (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'created', 'metadata_updated', 'response_added', 'response_updated', 'response_deleted', 'pillar_completed', 'assessment_completed', 'sme_comment_added'
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  
  -- Change details
  changes JSONB NOT NULL DEFAULT '{}',
  
  -- Impact on reports
  impact JSONB DEFAULT '{}', -- { maturityScoreChanged: true, recommendationsChanged: ['feature1', 'feature2'], pillarsAffected: ['data_engineering'] }
  
  -- Snapshot of key metrics before change
  before_snapshot JSONB,
  
  -- Snapshot of key metrics after change
  after_snapshot JSONB,
  
  -- Additional context
  metadata JSONB DEFAULT '{}'
);

-- Indexes for fast audit trail queries
CREATE INDEX IF NOT EXISTS idx_audit_assessment_id ON audit_events(assessment_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_events(user_email);

-- GIN index for JSONB columns
CREATE INDEX IF NOT EXISTS idx_audit_changes ON audit_events USING GIN(changes);
CREATE INDEX IF NOT EXISTS idx_audit_impact ON audit_events USING GIN(impact);

-- Create view for audit trail summary
CREATE OR REPLACE VIEW audit_trail_summary AS
SELECT 
  ae.assessment_id,
  a.assessment_name,
  a.organization_name,
  COUNT(*) as total_events,
  COUNT(DISTINCT ae.user_email) as unique_editors,
  MIN(ae.timestamp) as first_event,
  MAX(ae.timestamp) as last_event,
  jsonb_agg(
    jsonb_build_object(
      'event_type', ae.event_type,
      'timestamp', ae.timestamp,
      'user', ae.user_email
    ) ORDER BY ae.timestamp DESC
  ) FILTER (WHERE ae.timestamp >= NOW() - INTERVAL '7 days') as recent_events
FROM audit_events ae
JOIN assessments a ON ae.assessment_id = a.id
GROUP BY ae.assessment_id, a.assessment_name, a.organization_name;

-- Function to calculate impact of changes
CREATE OR REPLACE FUNCTION calculate_change_impact(
  p_assessment_id VARCHAR(255),
  p_changes JSONB
) RETURNS JSONB AS $$
DECLARE
  v_impact JSONB := '{}';
  v_pillars_affected TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Check if responses changed (impacts maturity score)
  IF p_changes ? 'responses' THEN
    v_impact := jsonb_set(v_impact, '{maturityScoreChanged}', 'true'::jsonb);
    v_impact := jsonb_set(v_impact, '{recommendationsChanged}', 'true'::jsonb);
  END IF;
  
  -- Check if metadata changed (impacts report headers)
  IF p_changes ? 'organizationName' OR p_changes ? 'industry' THEN
    v_impact := jsonb_set(v_impact, '{reportHeaderChanged}', 'true'::jsonb);
    v_impact := jsonb_set(v_impact, '{benchmarkingChanged}', 'true'::jsonb);
  END IF;
  
  -- Check if pillar completed (impacts executive summary)
  IF p_changes ? 'completedCategories' THEN
    v_impact := jsonb_set(v_impact, '{executiveSummaryChanged}', 'true'::jsonb);
    v_impact := jsonb_set(v_impact, '{strategicRoadmapChanged}', 'true'::jsonb);
  END IF;
  
  RETURN v_impact;
END;
$$ LANGUAGE plpgsql;

-- Function to create snapshot of assessment state
CREATE OR REPLACE FUNCTION create_assessment_snapshot(
  p_assessment_id VARCHAR(255)
) RETURNS JSONB AS $$
DECLARE
  v_snapshot JSONB;
BEGIN
  SELECT jsonb_build_object(
    'status', status,
    'progress', progress,
    'completedCategories', completed_categories,
    'responseCount', jsonb_object_keys(responses)::TEXT[],
    'lastModified', updated_at
  )
  INTO v_snapshot
  FROM assessments
  WHERE id = p_assessment_id;
  
  RETURN v_snapshot;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create audit events on assessment changes
CREATE OR REPLACE FUNCTION log_assessment_change()
RETURNS TRIGGER AS $$
DECLARE
  v_changes JSONB := '{}';
  v_impact JSONB;
  v_before_snapshot JSONB;
  v_after_snapshot JSONB;
BEGIN
  -- Create before snapshot
  v_before_snapshot := jsonb_build_object(
    'status', OLD.status,
    'progress', OLD.progress,
    'completedCategories', OLD.completed_categories,
    'responseCount', (SELECT COUNT(*) FROM jsonb_object_keys(OLD.responses))
  );
  
  -- Create after snapshot
  v_after_snapshot := jsonb_build_object(
    'status', NEW.status,
    'progress', NEW.progress,
    'completedCategories', NEW.completed_categories,
    'responseCount', (SELECT COUNT(*) FROM jsonb_object_keys(NEW.responses))
  );
  
  -- Track what changed
  IF OLD.assessment_name IS DISTINCT FROM NEW.assessment_name THEN
    v_changes := jsonb_set(v_changes, '{assessmentName}', jsonb_build_object('from', OLD.assessment_name, 'to', NEW.assessment_name));
  END IF;
  
  IF OLD.organization_name IS DISTINCT FROM NEW.organization_name THEN
    v_changes := jsonb_set(v_changes, '{organizationName}', jsonb_build_object('from', OLD.organization_name, 'to', NEW.organization_name));
  END IF;
  
  IF OLD.industry IS DISTINCT FROM NEW.industry THEN
    v_changes := jsonb_set(v_changes, '{industry}', jsonb_build_object('from', OLD.industry, 'to', NEW.industry));
  END IF;
  
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    v_changes := jsonb_set(v_changes, '{status}', jsonb_build_object('from', OLD.status, 'to', NEW.status));
  END IF;
  
  IF OLD.responses IS DISTINCT FROM NEW.responses THEN
    v_changes := jsonb_set(v_changes, '{responses}', 'true'::jsonb);
  END IF;
  
  IF OLD.completed_categories IS DISTINCT FROM NEW.completed_categories THEN
    v_changes := jsonb_set(v_changes, '{completedCategories}', jsonb_build_object('from', OLD.completed_categories, 'to', NEW.completed_categories));
  END IF;
  
  -- Calculate impact
  v_impact := calculate_change_impact(NEW.id, v_changes);
  
  -- Insert audit event if there were changes
  IF jsonb_typeof(v_changes) = 'object' AND v_changes != '{}'::jsonb THEN
    INSERT INTO audit_events (
      assessment_id,
      event_type,
      changes,
      impact,
      before_snapshot,
      after_snapshot
    ) VALUES (
      NEW.id,
      CASE 
        WHEN OLD.status != NEW.status AND NEW.status = 'completed' THEN 'assessment_completed'
        WHEN OLD.completed_categories IS DISTINCT FROM NEW.completed_categories THEN 'pillar_completed'
        WHEN OLD.responses IS DISTINCT FROM NEW.responses THEN 'response_updated'
        ELSE 'metadata_updated'
      END,
      v_changes,
      v_impact,
      v_before_snapshot,
      v_after_snapshot
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS assessment_audit_trigger ON assessments;

-- Create trigger for audit logging
CREATE TRIGGER assessment_audit_trigger
  AFTER UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION log_assessment_change();

-- Comment on tables and columns
COMMENT ON TABLE audit_events IS 'Comprehensive audit trail for all assessment changes';
COMMENT ON COLUMN audit_events.event_type IS 'Type of event: created, metadata_updated, response_added, response_updated, response_deleted, pillar_completed, assessment_completed';
COMMENT ON COLUMN audit_events.impact IS 'Impact on generated reports: maturityScoreChanged, recommendationsChanged, executiveSummaryChanged, etc.';
COMMENT ON COLUMN audit_events.before_snapshot IS 'Snapshot of key metrics before the change';
COMMENT ON COLUMN audit_events.after_snapshot IS 'Snapshot of key metrics after the change';

