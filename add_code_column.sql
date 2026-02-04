-- Run this in your Supabase SQL Editor to add the missing 'code' column

ALTER TABLE products ADD COLUMN IF NOT EXISTS code text;

-- Optional: Create an index
CREATE INDEX IF NOT EXISTS products_code_idx ON products (code);
