-- Migration: Create Enterprise Platform Knowledge Base
-- This creates a comprehensive knowledge base for the chatbot

-- Core knowledge base with Q&As
CREATE TABLE IF NOT EXISTS platform_knowledge_base (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'platform_governance', 'data_engineering', 'analytics_bi', 'machine_learning', 'generative_ai', 'operational_excellence'
  pillar VARCHAR(100), -- Maps to assessment pillars
  complexity VARCHAR(50) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  keywords TEXT[] DEFAULT '{}', -- For search optimization
  related_concepts TEXT[] DEFAULT '{}',
  official_docs_link TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enterprise Platform features/concepts reference
CREATE TABLE IF NOT EXISTS platform_concepts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  pillar VARCHAR(100),
  short_definition TEXT NOT NULL,
  detailed_description TEXT,
  key_features TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  related_features TEXT[] DEFAULT '{}',
  official_docs_link TEXT,
  release_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kb_keywords ON platform_knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_kb_category ON platform_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_kb_pillar ON platform_knowledge_base(pillar);
CREATE INDEX IF NOT EXISTS idx_kb_complexity ON platform_knowledge_base(complexity);
CREATE INDEX IF NOT EXISTS idx_kb_tags ON platform_knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_concepts_name ON platform_concepts(name);
CREATE INDEX IF NOT EXISTS idx_concepts_category ON platform_concepts(category);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_kb_question_fts ON platform_knowledge_base USING GIN(to_tsvector('english', question));
CREATE INDEX IF NOT EXISTS idx_kb_answer_fts ON platform_knowledge_base USING GIN(to_tsvector('english', answer));
CREATE INDEX IF NOT EXISTS idx_concepts_name_fts ON platform_concepts USING GIN(to_tsvector('english', name));

-- Add comments
COMMENT ON TABLE platform_knowledge_base IS 'Curated Q&A knowledge base for Enterprise Platform chatbot';
COMMENT ON TABLE platform_concepts IS 'Enterprise Platform features, tools, and concepts reference';
COMMENT ON COLUMN platform_knowledge_base.complexity IS 'Question difficulty level: beginner, intermediate, or advanced';
COMMENT ON COLUMN platform_knowledge_base.view_count IS 'Number of times this Q&A was viewed';
COMMENT ON COLUMN platform_knowledge_base.helpful_count IS 'Number of times users marked this as helpful';


