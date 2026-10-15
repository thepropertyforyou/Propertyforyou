-- ==============================================================================
-- SQL Migration: Allow Public to View Approved Popup Ads
-- Run this in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Ensure RLS is enabled on public.popup_ad_schedules
ALTER TABLE public.popup_ad_schedules ENABLE ROW LEVEL SECURITY;

-- 2. Drop any previous conflicting public policies
DROP POLICY IF EXISTS "Public can view approved popup ads" ON public.popup_ad_schedules;
DROP POLICY IF EXISTS "Anyone can view approved popup ads" ON public.popup_ad_schedules;
DROP POLICY IF EXISTS "Everyone can view approved popup ads" ON public.popup_ad_schedules;

-- 3. Create public SELECT policy so all visitors can see approved popup ads
CREATE POLICY "Everyone can view approved popup ads"
ON public.popup_ad_schedules
FOR SELECT
TO public
USING (admin_approved = true);

-- 4. Ensure public read access on 'popup-ads' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('popup-ads', 'popup-ads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

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
