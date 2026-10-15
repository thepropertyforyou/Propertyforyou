-- ==============================================================================
-- SQL Migration: Customer IDs and Listing IDs Setup & Backfill
-- Safe to run multiple times (idempotent)
-- Run this in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create sequences for auto-generating IDs
CREATE SEQUENCE IF NOT EXISTS customer_id_seq START WITH 1;
CREATE SEQUENCE IF NOT EXISTS listing_id_seq START WITH 1;

-- 2. Add columns to profiles and listings
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS listing_id TEXT;

-- 3. Unique & performance indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_customer_id 
  ON public.profiles(customer_id) 
  WHERE customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_listing_id 
  ON public.listings(listing_id) 
  WHERE listing_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_listings_customer_id 
  ON public.listings(customer_id);

-- 4. Trigger function: Auto-generate listing_id and customer_id on new listing insert
CREATE OR REPLACE FUNCTION public.handle_listing_ids_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id TEXT;
BEGIN
  -- Auto-generate listing_id (e.g. LST-0001) if not already set
  IF NEW.listing_id IS NULL OR NEW.listing_id = '' THEN
    NEW.listing_id := 'LST-' || lpad(nextval('listing_id_seq')::text, 4, '0');
  END IF;

  -- Check if user already has an assigned customer_id in profiles
  IF NEW.user_id IS NOT NULL THEN
    SELECT customer_id INTO v_customer_id
    FROM public.profiles
    WHERE user_id = NEW.user_id;

    -- If this user has never posted before (no customer_id), create one now
    IF v_customer_id IS NULL OR v_customer_id = '' THEN
      v_customer_id := 'CUS-' || lpad(nextval('customer_id_seq')::text, 4, '0');
      UPDATE public.profiles
      SET customer_id = v_customer_id
      WHERE user_id = NEW.user_id;
    END IF;

    -- Assign the same Customer ID to this listing
    NEW.customer_id := v_customer_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to public.listings
DROP TRIGGER IF EXISTS trg_handle_listing_ids ON public.listings;
CREATE TRIGGER trg_handle_listing_ids
BEFORE INSERT ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.handle_listing_ids_trigger();

-- 5. Backfill existing listings and posters (safe to run multiple times)
DO $$
DECLARE
  r RECORD;
  v_next_cus INT;
  v_next_lst INT;
BEGIN
  -- (A) Backfill Customer IDs for users who already posted listings
  FOR r IN (
    SELECT DISTINCT l.user_id, MIN(l.created_at) AS first_listing_date
    FROM public.listings l
    JOIN public.profiles p ON p.user_id = l.user_id
    WHERE p.customer_id IS NULL OR p.customer_id = ''
    GROUP BY l.user_id
    ORDER BY first_listing_date ASC
  ) LOOP
    UPDATE public.profiles
    SET customer_id = 'CUS-' || lpad(nextval('customer_id_seq')::text, 4, '0')
    WHERE user_id = r.user_id AND (customer_id IS NULL OR customer_id = '');
  END LOOP;

  -- Sync listings.customer_id from profiles
  UPDATE public.listings l
  SET customer_id = p.customer_id
  FROM public.profiles p
  WHERE l.user_id = p.user_id
    AND (l.customer_id IS NULL OR l.customer_id = '')
    AND p.customer_id IS NOT NULL;

  -- (B) Backfill Listing IDs for all existing listings
  FOR r IN (
    SELECT id
    FROM public.listings
    WHERE listing_id IS NULL OR listing_id = ''
    ORDER BY created_at ASC
  ) LOOP
    UPDATE public.listings
    SET listing_id = 'LST-' || lpad(nextval('listing_id_seq')::text, 4, '0')
    WHERE id = r.id AND (listing_id IS NULL OR listing_id = '');
  END LOOP;

  -- (C) Align sequence counters past maximum backfilled IDs
  SELECT COALESCE(MAX(SUBSTRING(customer_id FROM 5)::integer), 0) INTO v_next_cus
  FROM public.profiles
  WHERE customer_id ~ '^CUS-[0-9]+$';

  IF v_next_cus > 0 THEN
    PERFORM setval('customer_id_seq', v_next_cus);
  END IF;

  SELECT COALESCE(MAX(SUBSTRING(listing_id FROM 5)::integer), 0) INTO v_next_lst
  FROM public.listings
  WHERE listing_id ~ '^LST-[0-9]+$';

  IF v_next_lst > 0 THEN
    PERFORM setval('listing_id_seq', v_next_lst);
  END IF;
END $$;
