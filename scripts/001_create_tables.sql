-- Echo Garden Database Schema
-- Music specimens (diary entries), blog posts, and visitor messages

-- Music specimens table
CREATE TABLE IF NOT EXISTS music_specimens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  note TEXT,
  mood TEXT[] DEFAULT '{}',
  audio_url TEXT NOT NULL,
  specimen_type TEXT NOT NULL DEFAULT 'leaf',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  slug TEXT NOT NULL UNIQUE,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Visitor messages (Echo Wall)
CREATE TABLE IF NOT EXISTS visitor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin users table (for simple password auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_music_specimens_date ON music_specimens(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_visitor_messages_approved ON visitor_messages(approved);
CREATE INDEX IF NOT EXISTS idx_visitor_messages_created ON visitor_messages(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE music_specimens ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Allow public read access to music_specimens" 
  ON music_specimens FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to published blog_posts" 
  ON blog_posts FOR SELECT 
  USING (published = true);

CREATE POLICY "Allow public read access to approved messages" 
  ON visitor_messages FOR SELECT 
  USING (approved = true);

-- Public insert for visitor messages
CREATE POLICY "Allow public insert to visitor_messages" 
  ON visitor_messages FOR INSERT 
  WITH CHECK (true);

-- Service role policies for admin operations (using service_role key bypasses RLS)
-- No additional policies needed since service_role bypasses RLS

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_music_specimens_updated_at ON music_specimens;
CREATE TRIGGER update_music_specimens_updated_at
  BEFORE UPDATE ON music_specimens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
