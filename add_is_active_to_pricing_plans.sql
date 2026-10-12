-- Migration: Add is_active column to pricing_plans table
-- Run this in your Supabase SQL Editor.

-- 1. Add is_active column defaulting to true
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- 2. Ensure existing rows have is_active set to true
UPDATE public.pricing_plans
SET is_active = true
WHERE is_active IS NULL;
