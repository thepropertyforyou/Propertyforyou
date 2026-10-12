-- Migration: Add display_price and plan_name columns to pricing_plans table
-- Run this in your Supabase SQL Editor if not already present.

-- 1. Add plan_name and display_price columns
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS plan_name TEXT;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS display_price TEXT;

-- 2. Populate default plan_name if null
UPDATE public.pricing_plans
SET plan_name = CASE 
  WHEN plan_type LIKE 'featured_30%' THEN 'Plan 1'
  WHEN plan_type LIKE 'featured_60%' THEN 'Plan 2'
  WHEN plan_type LIKE 'featured_90%' THEN 'Plan 3'
  WHEN plan_type LIKE 'popup_30%' THEN 'Plan 1'
  WHEN plan_type LIKE 'popup_60%' THEN 'Plan 2'
  WHEN plan_type LIKE 'popup_90%' THEN 'Plan 3'
  ELSE plan_name
END
WHERE plan_name IS NULL;
