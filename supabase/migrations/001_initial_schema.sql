-- Media Compass — Schéma aligné sur le dashboard Supabase (cloud)
-- Tables : contents, analyses, reflections

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_hash TEXT UNIQUE,
    raw_text TEXT,
    forensic_metadata JSONB DEFAULT '{}'::jsonb,
    content_type TEXT CHECK (content_type IN ('url', 'image', 'text')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    content_id UUID REFERENCES contents(id),
    ai_suggestion JSONB NOT NULL,
    user_validation JSONB,
    final_score_label TEXT,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    reflection_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyses_session ON analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_contents_url_hash ON contents(url_hash);
