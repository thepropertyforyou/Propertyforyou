-- ==============================================================================
-- SQL Migration: Sponsorship Plans, Workflow & Policies Setup
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Helper Function: Check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role::text = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, public;

-- 2. Create sequence for auto-generating Sponsorship Application IDs (e.g. SPN-0001)
CREATE SEQUENCE IF NOT EXISTS sponsorship_application_id_seq START WITH 1;

-- 3. Create public.sponsorship_plans table
CREATE TABLE IF NOT EXISTS public.sponsorship_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default plans if not already present
INSERT INTO public.sponsorship_plans (name, duration, price, is_active, display_order)
SELECT 'Silver', 7, 199, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.sponsorship_plans WHERE name ILIKE 'silver');

INSERT INTO public.sponsorship_plans (name, duration, price, is_active, display_order)
SELECT 'Gold', 20, 499, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.sponsorship_plans WHERE name ILIKE 'gold');

INSERT INTO public.sponsorship_plans (name, duration, price, is_active, display_order)
SELECT 'Platinum', 45, 999, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.sponsorship_plans WHERE name ILIKE 'platinum');

-- Enable RLS on public.sponsorship_plans
ALTER TABLE public.sponsorship_plans ENABLE ROW LEVEL SECURITY;

-- Everyone (public visitors & authenticated users) can view sponsorship plans
DROP POLICY IF EXISTS "Public can view sponsorship plans" ON public.sponsorship_plans;
CREATE POLICY "Public can view sponsorship plans"
ON public.sponsorship_plans
FOR SELECT
TO public
USING (true);

-- Only admins can insert, update, or delete sponsorship plans
DROP POLICY IF EXISTS "Admins can manage sponsorship plans" ON public.sponsorship_plans;
CREATE POLICY "Admins can manage sponsorship plans"
ON public.sponsorship_plans
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Schema enhancements on public.sponsorships
ALTER TABLE public.sponsorships ADD COLUMN IF NOT EXISTS application_id TEXT;
ALTER TABLE public.sponsorships ADD COLUMN IF NOT EXISTS plan_name TEXT;
ALTER TABLE public.sponsorships ADD COLUMN IF NOT EXISTS payment_proof TEXT;
ALTER TABLE public.sponsorships ADD COLUMN IF NOT EXISTS clicks INTEGER NOT NULL DEFAULT 0;

-- Allow user_id to be NULL or default to auth.uid()
ALTER TABLE public.sponsorships ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.sponsorships ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Drop constraints that restrict status or duration to allow dynamic plans & 'Pending payment' status
ALTER TABLE public.sponsorships DROP CONSTRAINT IF EXISTS sponsorships_duration_check;
ALTER TABLE public.sponsorships DROP CONSTRAINT IF EXISTS sponsorships_status_check;

-- Ensure application_id is unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_sponsorships_application_id 
  ON public.sponsorships(application_id) 
  WHERE application_id IS NOT NULL;

-- 5. Trigger function to auto-generate application_id on new sponsorship application
CREATE OR REPLACE FUNCTION public.handle_sponsorship_application_id_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.application_id IS NULL OR NEW.application_id = '' THEN
    NEW.application_id := 'SPN-' || lpad(nextval('sponsorship_application_id_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sponsorship_application_id ON public.sponsorships;
CREATE TRIGGER trg_sponsorship_application_id
BEFORE INSERT ON public.sponsorships
FOR EACH ROW
EXECUTE FUNCTION public.handle_sponsorship_application_id_trigger();

-- Backfill application_id for existing sponsorships if any are missing
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM public.sponsorships WHERE application_id IS NULL OR application_id = '' ORDER BY created_at ASC LOOP
    UPDATE public.sponsorships 
    SET application_id = 'SPN-' || lpad(nextval('sponsorship_application_id_seq')::text, 4, '0')
    WHERE id = rec.id;
  END LOOP;
END $$;

-- 6. RLS Policies on public.sponsorships
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

-- Drop previous policies
DROP POLICY IF EXISTS "Public can view active sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Anyone can view active sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Anyone can view approved sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Everyone can view approved sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Everyone can view active sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Everyone can view sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Users can view own sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Users can create sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Anyone can submit sponsorship applications" ON public.sponsorships;
DROP POLICY IF EXISTS "Admins have full access to sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Admins can view all sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Admins can update all sponsorships" ON public.sponsorships;

-- (A) Public / Anyone can view approved sponsorships (for homepage banners & active listings)
CREATE POLICY "Everyone can view approved sponsorships"
ON public.sponsorships
FOR SELECT
TO public
USING (status ILIKE 'approved');

-- (B) Logged in users can view their own sponsorships
CREATE POLICY "Users can view own sponsorships"
ON public.sponsorships
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- (C) Anyone (public or logged-in) can submit a new sponsorship application
CREATE POLICY "Anyone can submit sponsorship applications"
ON public.sponsorships
FOR INSERT
TO public
WITH CHECK (true);

-- (D) Admins have full access (view, update, approve, delete)
CREATE POLICY "Admins have full access to sponsorships"
ON public.sponsorships
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. Storage Bucket Setup & Policies for 'sponsorship-banners'
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsorship-banners', 'sponsorship-banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read access for sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to sponsorship-banners" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to sponsorship-banners" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin full access to sponsorship-banners" ON storage.objects;

-- Public read access
CREATE POLICY "Public read access for sponsorship banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sponsorship-banners');

-- Anyone can upload banners when applying for sponsorship
CREATE POLICY "Anyone can upload sponsorship banners"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'sponsorship-banners');

-- Admins full access to storage
CREATE POLICY "Allow admin full access to sponsorship-banners"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'sponsorship-banners' AND public.is_admin())
WITH CHECK (bucket_id = 'sponsorship-banners' AND public.is_admin());
