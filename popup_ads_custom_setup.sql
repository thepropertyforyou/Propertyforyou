-- ==============================================================================
-- SQL Migration: Allow Custom Popup Ads without Listings
-- Run this in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Make listing_id nullable in popup_ad_schedules
ALTER TABLE public.popup_ad_schedules ALTER COLUMN listing_id DROP NOT NULL;

-- 2. Add custom ad columns to popup_ad_schedules
ALTER TABLE public.popup_ad_schedules ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.popup_ad_schedules ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE public.popup_ad_schedules ADD COLUMN IF NOT EXISTS title TEXT;

-- 3. Ensure the 'popup-ads' storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('popup-ads', 'popup-ads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Storage RLS policies for 'popup-ads' bucket
-- Public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public read access for popup-ads bucket'
  ) THEN
    CREATE POLICY "Public read access for popup-ads bucket"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'popup-ads');
  END IF;
END $$;

-- Admin upload access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin upload access for popup-ads bucket'
  ) THEN
    CREATE POLICY "Admin upload access for popup-ads bucket"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'popup-ads' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Admin update access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin update access for popup-ads bucket'
  ) THEN
    CREATE POLICY "Admin update access for popup-ads bucket"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'popup-ads' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Admin delete access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin delete access for popup-ads bucket'
  ) THEN
    CREATE POLICY "Admin delete access for popup-ads bucket"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'popup-ads' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- 5. Ensure Admins have full access to popup_ad_schedules
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'popup_ad_schedules' AND policyname = 'Admins have full access to popup_ad_schedules'
  ) THEN
    CREATE POLICY "Admins have full access to popup_ad_schedules" 
    ON public.popup_ad_schedules 
    FOR ALL 
    TO authenticated 
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;
