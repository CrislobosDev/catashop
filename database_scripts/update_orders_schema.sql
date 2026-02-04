-- Add customer_details column to orders table
-- Using jsonb is best for storing structured object data like details

ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_details jsonb;

-- Ensure readable_id is definitely there for orders too (re-run safe)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS readable_id text;
