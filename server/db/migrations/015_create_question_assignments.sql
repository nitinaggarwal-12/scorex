-- Question-level assignment system
CREATE TABLE IF NOT EXISTS question_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  pillar TEXT NOT NULL,
  assigned_to_email TEXT NOT NULL,
  assigned_by_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  -- Status: pending, in_progress, completed, approved, rejected
  
  -- Response data
  current_state INTEGER,
  future_state INTEGER,
  technical_pain_points TEXT[],
  business_pain_points TEXT[],
  notes TEXT,
  
  -- Follow-up and collaboration
  follow_up_questions JSONB DEFAULT '[]'::jsonb,
  -- Format: [{"from": "admin@email", "question": "text", "answer": "text", "timestamp": "ISO date"}]
  
  -- Tracking
  assigned_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by_email TEXT,
  rejection_reason TEXT,
  
  -- Reminders
  reminder_sent_at TIMESTAMP,
  reminder_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_question_assignments_assessment ON question_assignments(assessment_id);
CREATE INDEX idx_question_assignments_assigned_to ON question_assignments(assigned_to_email);
CREATE INDEX idx_question_assignments_status ON question_assignments(status);
CREATE INDEX idx_question_assignments_assigned_by ON question_assignments(assigned_by_email);

-- Comments
COMMENT ON TABLE question_assignments IS 'Individual question assignments to users with status tracking and approval workflow';
COMMENT ON COLUMN question_assignments.status IS 'Assignment status: pending, in_progress, completed, approved, rejected';
COMMENT ON COLUMN question_assignments.follow_up_questions IS 'Array of follow-up questions and answers for collaboration';

