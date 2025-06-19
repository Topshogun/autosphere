/*
  # Admin Dashboard Tables

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
    - `page_views`
      - `id` (uuid, primary key)
      - `article_id` (integer, foreign key)
      - `user_agent` (text)
      - `ip_address` (text)
      - `viewed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for admin access only
    - Create indexes for performance

  3. Sample Data
    - Create default admin user (username: admin, password: admin123)
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id integer REFERENCES articles(id) ON DELETE CASCADE,
  user_agent text,
  ip_address text,
  viewed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Service role can manage admin users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true);

-- Create policies for page_views
CREATE POLICY "Anyone can insert page views"
  ON page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service role can read page views"
  ON page_views
  FOR SELECT
  TO service_role
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users (username);
CREATE INDEX IF NOT EXISTS idx_page_views_article_id ON page_views (article_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views (viewed_at DESC);

-- Insert default admin user (password: admin123)
-- Note: In production, use a proper password hashing library
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;