-- Run this in your Supabase SQL Editor to add the missing readable_id column

-- Add readable_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS readable_id text;

-- Add readable_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS readable_id text;

-- Optional: Create an index for faster lookups if you plan to search by this ID
CREATE INDEX IF NOT EXISTS products_readable_id_idx ON products (readable_id);
CREATE INDEX IF NOT EXISTS orders_readable_id_idx ON orders (readable_id);
