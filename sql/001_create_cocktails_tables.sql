-- Cocktails Database Schema Migration
-- Created: 2025-12-05
-- Purpose: Create tables for cocktail recipe management

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- COCKTAIL CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cocktail_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COCKTAILS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cocktails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES cocktail_categories(id) ON DELETE CASCADE,
  ingredients JSONB NOT NULL, -- Array of ingredient strings
  instructions JSONB NOT NULL, -- Array of instruction strings
  description TEXT,
  glass_type TEXT,
  garnish TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time_seconds INTEGER,
  is_signature BOOLEAN DEFAULT FALSE,
  is_seasonal BOOLEAN DEFAULT FALSE,
  tags TEXT[], -- For additional filtering (e.g., ['fruity', 'strong', 'refreshing'])
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on category_id for fast category filtering
CREATE INDEX IF NOT EXISTS idx_cocktails_category ON cocktails(category_id);

-- Full-text search index on cocktail name
CREATE INDEX IF NOT EXISTS idx_cocktails_name ON cocktails USING gin(to_tsvector('english', name));

-- Index on tags for filtering
CREATE INDEX IF NOT EXISTS idx_cocktails_tags ON cocktails USING gin(tags);

-- Index on difficulty for filtering
CREATE INDEX IF NOT EXISTS idx_cocktails_difficulty ON cocktails(difficulty);

-- Index on signature/seasonal flags
CREATE INDEX IF NOT EXISTS idx_cocktails_signature ON cocktails(is_signature) WHERE is_signature = true;
CREATE INDEX IF NOT EXISTS idx_cocktails_seasonal ON cocktails(is_seasonal) WHERE is_seasonal = true;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE cocktail_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read categories
CREATE POLICY "Allow authenticated read access to categories" 
  ON cocktail_categories
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow all authenticated users to read cocktails
CREATE POLICY "Allow authenticated read access to cocktails" 
  ON cocktails
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow admin users to insert/update/delete categories
CREATE POLICY "Allow admin write access to categories" 
  ON cocktail_categories
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id::uuid = auth.uid() 
      AND position = 'Admin'
    )
  );

-- Allow admin users to insert/update/delete cocktails
CREATE POLICY "Allow admin write access to cocktails" 
  ON cocktails
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id::uuid = auth.uid() 
      AND position = 'Admin'
    )
  );

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
CREATE TRIGGER update_cocktail_categories_updated_at
  BEFORE UPDATE ON cocktail_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cocktails_updated_at
  BEFORE UPDATE ON cocktails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE cocktail_categories IS 'Categories for organizing cocktail recipes';
COMMENT ON TABLE cocktails IS 'Cocktail recipes with ingredients and instructions';
COMMENT ON COLUMN cocktails.ingredients IS 'JSON array of ingredient strings (e.g., ["2 oz Vodka", "1 oz Lime Juice"])';
COMMENT ON COLUMN cocktails.instructions IS 'JSON array of instruction strings (e.g., ["Add ingredients to shaker", "Shake with ice"])';
COMMENT ON COLUMN cocktails.tags IS 'Array of tags for filtering (e.g., ["fruity", "strong", "refreshing"])';
