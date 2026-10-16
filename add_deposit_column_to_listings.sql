-- ==============================================================================
-- SQL Migration: Add 'deposit' column to listings table
-- Run this in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS deposit NUMERIC;

-- Optional backfill if any listings had deposit stored inside JSONB attributes:
UPDATE public.listings
SET deposit = (attributes->>'deposit')::numeric
WHERE deposit IS NULL AND attributes->>'deposit' IS NOT NULL;
