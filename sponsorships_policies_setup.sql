-- ==============================================================================
-- SQL Migration: Policies and Permissions for Sponsorships & Storage Bucket
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

-- 2. Schema improvements for public.sponsorships
-- Ensure optional columns exist
ALTER TABLE public.sponsorships ADD COLUMN IF NOT EXISTS payment_proof TEXT;
ALTER TABLE public.sponsorships ADD COLUMN IF NOT EXISTS clicks INTEGER NOT NULL DEFAULT 0;

-- Allow user_id to default to auth.uid() if not explicitly provided
ALTER TABLE public.sponsorships ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.sponsorships ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Drop restrictive duration constraint so admins can enter custom durations
ALTER TABLE public.sponsorships DROP CONSTRAINT IF EXISTS sponsorships_duration_check;

-- Ensure RLS is enabled on public.sponsorships
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

-- 3. Drop all previous / conflicting policies on public.sponsorships
DROP POLICY IF EXISTS "Public can view active sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Anyone can view active sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Anyone can view approved sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Everyone can view approved sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Everyone can view active sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Everyone can view sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Admins can view all sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Admins can update all sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Admins have full access to sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Admins can manage sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Users can view own sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Users can create sponsorships" ON public.sponsorships;
DROP POLICY IF EXISTS "Users can update own pending sponsorships" ON public.sponsorships;

-- 4. Create RLS Policies for public.sponsorships

-- (A) Everyone (both public visitors and logged-in users) can view approved sponsorships
CREATE POLICY "Everyone can view approved sponsorships"
ON public.sponsorships
FOR SELECT
TO public
USING (status = 'approved');

-- (B) Authenticated users can view their own sponsorships
CREATE POLICY "Users can view own sponsorships"
ON public.sponsorships
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- (C) Authenticated users can submit new sponsorship requests
CREATE POLICY "Users can create sponsorships"
ON public.sponsorships
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- (D) Admins have full access to ADD, EDIT, DELETE, and VIEW all sponsorships
CREATE POLICY "Admins have full access to sponsorships"
ON public.sponsorships
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. Storage Bucket Setup & Policies for 'sponsorship-banners'
-- ==============================================================================

-- Create or update the 'sponsorship-banners' storage bucket to be public
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsorship-banners', 'sponsorship-banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies on 'sponsorship-banners' to avoid duplicates
DROP POLICY IF EXISTS "Anyone can view sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins have full access to sponsorship banners" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to sponsorship-banners" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to sponsorship-banners" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin full access to sponsorship-banners" ON storage.objects;

-- (A) Everyone can view/download images from sponsorship-banners
CREATE POLICY "Public read access for sponsorship banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sponsorship-banners');

-- (B) Authenticated users (including admins) can upload images to sponsorship-banners
CREATE POLICY "Allow authenticated uploads to sponsorship-banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sponsorship-banners');

-- (C) Authenticated users can update images in sponsorship-banners
CREATE POLICY "Allow authenticated updates to sponsorship-banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'sponsorship-banners')
WITH CHECK (bucket_id = 'sponsorship-banners');

-- (D) Admins have full access (upload, update, delete) to all files in sponsorship-banners
CREATE POLICY "Allow admin full access to sponsorship-banners"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'sponsorship-banners'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'sponsorship-banners'
  AND public.is_admin()
);
