-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  question1_response VARCHAR(50) NOT NULL CHECK (question1_response IN ('Yes', 'No', 'Neutral')),
  question2_response VARCHAR(50) NOT NULL CHECK (question2_response IN ('Yes', 'No', 'Neutral')),
  question3_response VARCHAR(50) NOT NULL CHECK (question3_response IN ('Yes', 'No', 'Neutral')),
  question4_response VARCHAR(50) NOT NULL CHECK (question4_response IN ('Yes', 'No', 'Neutral')),
  question5_response VARCHAR(50) NOT NULL CHECK (question5_response IN ('Yes', 'No', 'Neutral')),
  question6_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback(email);

