-- ══════════════════════════════════════════════════════
-- זמני אדם — Database Schema
-- Run this in the Supabase SQL Editor
-- ══════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- בתי כנסת / מקומות
CREATE TABLE IF NOT EXISTS synagogues (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  address    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- תפילות שבועיות (ימות השבוע)
-- days: 0=ראשון(Sun), 1=שני(Mon), ..., 5=שישי(Fri), 6=שבת(Sat)
CREATE TABLE IF NOT EXISTS prayers (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type         TEXT NOT NULL CHECK (type IN ('shacharit','mincha','maariv','musaf','other')),
  custom_name  TEXT,
  time         TIME NOT NULL,
  days         INTEGER[] NOT NULL DEFAULT '{}',
  synagogue_id UUID REFERENCES synagogues(id) ON DELETE CASCADE,
  notes        TEXT,
  is_active    BOOLEAN DEFAULT true NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prayers_synagogue ON prayers(synagogue_id);

-- שיעורים שבועיים
CREATE TABLE IF NOT EXISTS lessons (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,
  teacher       TEXT,
  time          TIME NOT NULL,
  end_time      TIME,
  days          INTEGER[] NOT NULL DEFAULT '{}',
  synagogue_id  UUID REFERENCES synagogues(id) ON DELETE SET NULL,
  location_text TEXT,
  notes         TEXT,
  is_active     BOOLEAN DEFAULT true NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lessons_synagogue ON lessons(synagogue_id);

-- תפילות שבת ויו"ט
CREATE TABLE IF NOT EXISTS shabbat_prayers (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type         TEXT NOT NULL CHECK (type IN ('shacharit','mincha','maariv','musaf','other')),
  custom_name  TEXT,
  time         TIME NOT NULL,
  synagogue_id UUID REFERENCES synagogues(id) ON DELETE CASCADE,
  notes        TEXT,
  is_active    BOOLEAN DEFAULT true NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- שיעורי שבת ויו"ט
CREATE TABLE IF NOT EXISTS shabbat_lessons (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,
  teacher       TEXT,
  time          TIME NOT NULL,
  synagogue_id  UUID REFERENCES synagogues(id) ON DELETE SET NULL,
  location_text TEXT,
  notes         TEXT,
  is_active     BOOLEAN DEFAULT true NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security
ALTER TABLE synagogues      ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE shabbat_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shabbat_lessons ENABLE ROW LEVEL SECURITY;

-- Public read (no auth required for public display)
CREATE POLICY "Public read synagogues"      ON synagogues      FOR SELECT USING (true);
CREATE POLICY "Public read prayers"         ON prayers         FOR SELECT USING (true);
CREATE POLICY "Public read lessons"         ON lessons         FOR SELECT USING (true);
CREATE POLICY "Public read shabbat_prayers" ON shabbat_prayers FOR SELECT USING (true);
CREATE POLICY "Public read shabbat_lessons" ON shabbat_lessons FOR SELECT USING (true);

-- Admin write (all operations allowed — protected by app-level auth)
CREATE POLICY "Admin write synagogues"      ON synagogues      FOR ALL USING (true);
CREATE POLICY "Admin write prayers"         ON prayers         FOR ALL USING (true);
CREATE POLICY "Admin write lessons"         ON lessons         FOR ALL USING (true);
CREATE POLICY "Admin write shabbat_prayers" ON shabbat_prayers FOR ALL USING (true);
CREATE POLICY "Admin write shabbat_lessons" ON shabbat_lessons FOR ALL USING (true);
