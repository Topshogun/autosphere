/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `subscribed_at` (timestamptz, default now())
      - `is_active` (boolean, default true)
      - `source` (text, default 'website')
      - `preferences` (jsonb, nullable) - for future category preferences
      - `unsubscribe_token` (uuid, unique) - for unsubscribe functionality
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for public to insert subscriptions
    - Add policy for service role to manage subscriptions
    - Add indexes for performance

  3. Functions
    - Auto-generate unsubscribe token
    - Update timestamp trigger
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  source text DEFAULT 'website',
  preferences jsonb DEFAULT '{}',
  unsubscribe_token uuid UNIQUE DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can subscribe"
  ON subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions (email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions (is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_source ON subscriptions (source);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_unsubscribe_token ON subscriptions (unsubscribe_token);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();