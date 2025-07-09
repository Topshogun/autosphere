/*
  # Update categories for AutoSphere

  1. Changes
    - Update the CHECK constraint on articles.category to include new categories
    - Remove old categories and add new ones:
      - AI (kept)
      - Finance & Accounting
      - Content Creation & Marketing
      - Personal Branding & Thought Leadership
      - Operations & Productivity
      - Sales & Customer Relations
      - E-commerce & Retail

  2. Migration Strategy
    - Drop existing constraint
    - Add new constraint with updated categories
    - This allows existing data to remain while enforcing new categories going forward
*/

-- Drop the existing category constraint
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_check;

-- Add new constraint with updated categories
ALTER TABLE articles ADD CONSTRAINT articles_category_check 
CHECK (category = ANY (ARRAY[
  'AI'::text, 
  'Finance & Accounting'::text, 
  'Content Creation & Marketing'::text, 
  'Personal Branding & Thought Leadership'::text, 
  'Operations & Productivity'::text, 
  'Sales & Customer Relations'::text, 
  'E-commerce & Retail'::text
]));