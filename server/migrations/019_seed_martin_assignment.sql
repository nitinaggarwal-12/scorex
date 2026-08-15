-- Seed: Assign Martin (Consumer) to TrustBank Assessment
-- This ensures Martin can see the assessment he's supposed to complete

-- First, let's find Martin's user ID and the TrustBank assessment
-- Assuming Martin's email is something like martin@trustbank.com or similar

-- Insert assignment for Martin as a consumer on TrustBank assessment
-- Replace with actual IDs from your database
INSERT INTO user_assignments (assessment_id, user_id, assigned_by, role, status, notes)
SELECT 
    a.id::text,
    u.id,
    1, -- Assigned by admin (user_id = 1)
    'consumer',
    'assigned',
    'Initial assignment for TrustBank Corporation assessment'
FROM assessments a
CROSS JOIN users u
WHERE a.assessment_name LIKE '%TrustBank%' 
  AND u.email LIKE '%martin%'
  AND NOT EXISTS (
    SELECT 1 FROM user_assignments ua 
    WHERE ua.assessment_id::text = a.id::text 
      AND ua.user_id = u.id
  )
ON CONFLICT (assessment_id, user_id, role) DO NOTHING;

-- Also assign any other consumers who should see assessments
-- This is a template - adjust based on your actual user/assessment data

