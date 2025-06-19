/*
  # Create articles table for AutoSphere news website

  1. New Tables
    - `articles`
      - `id` (int, primary key, auto-increment)
      - `title` (text, required)
      - `content` (text, required)
      - `summary` (text, optional - generated from content)
      - `author` (text, required - author name)
      - `category` (text, required - AI/Design/Construction)
      - `image_url` (text, optional)
      - `slug` (text, required, unique)
      - `published_date` (timestamptz, required)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access
    - Add policy for authenticated users to create articles
    - Add policy for authors to update/delete their own articles

  3. Functions
    - Auto-generate slug from title
    - Auto-update updated_at timestamp
    - Auto-generate summary from content
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('AI', 'Design', 'Construction')),
  image_url TEXT,
  slug TEXT NOT NULL UNIQUE,
  published_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Articles are viewable by everyone"
  ON articles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authors can update their own articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = author OR auth.role() = 'service_role');

CREATE POLICY "Authors can delete their own articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = author OR auth.role() = 'service_role');

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^\w\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to generate summary from content
CREATE OR REPLACE FUNCTION generate_summary(content TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN left(content, 150) || CASE WHEN length(content) > 150 THEN '...' ELSE '' END;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to auto-generate slug and summary
CREATE OR REPLACE FUNCTION auto_generate_article_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.title);
  END IF;
  
  -- Generate summary if not provided
  IF NEW.summary IS NULL OR NEW.summary = '' THEN
    NEW.summary = generate_summary(NEW.content);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_article_fields_trigger
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_article_fields();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON articles(published_date DESC);