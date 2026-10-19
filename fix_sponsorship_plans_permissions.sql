-- ==============================================================================
-- Fix Permissions & RLS Policies for Sponsorship Plans and Sponsorships
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Grant table-level permissions to PostgreSQL roles
-- This directly resolves "permission denied for table sponsorship_plans"
GRANT ALL ON TABLE public.sponsorship_plans TO postgres, service_role, authenticated;
GRANT SELECT ON TABLE public.sponsorship_plans TO anon, public;

GRANT ALL ON TABLE public.sponsorships TO postgres, service_role, authenticated;
GRANT SELECT, INSERT ON TABLE public.sponsorships TO anon, public;

-- Grant permissions on sequences
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated, anon, public;

-- Ensure future tables inherit appropriate default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO postgres, service_role, authenticated, anon;

-- 2. Ensure helper functions exist with SECURITY DEFINER and correct permissions
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
      AND (role::text = 'admin' OR role = 'admin'::public.app_role)
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, public;

-- Remove ambiguous text overload so Supabase RPC cleanly calls has_role(uuid, app_role)
DROP FUNCTION IF EXISTS public.has_role(_user_id UUID, _role text);

-- 3. Configure Row Level Security (RLS) on public.sponsorship_plans
ALTER TABLE public.sponsorship_plans ENABLE ROW LEVEL SECURITY;

-- Drop any previous conflicting policies on sponsorship_plans
DROP POLICY IF EXISTS "Public can view sponsorship plans" ON public.sponsorship_plans;
DROP POLICY IF EXISTS "Allow public read on sponsorship_plans" ON public.sponsorship_plans;
DROP POLICY IF EXISTS "Admins can manage sponsorship plans" ON public.sponsorship_plans;
DROP POLICY IF EXISTS "Admins have full access to sponsorship_plans" ON public.sponsorship_plans;

-- (A) Everyone can view sponsorship plans
CREATE POLICY "Public can view sponsorship plans"
ON public.sponsorship_plans
FOR SELECT
TO public
USING (true);

-- (B) Admins have full access to INSERT, UPDATE, DELETE plans
CREATE POLICY "Admins have full access to sponsorship_plans"
ON public.sponsorship_plans
FOR ALL
TO authenticated
USING (
  public.is_admin() 
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  )
)
WITH CHECK (
  public.is_admin() 
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  )
);

-- 4. Configure Row Level Security (RLS) on public.sponsorships
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

-- Drop previous policies on sponsorships to ensure clean state
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
DROP POLICY IF EXISTS "Admins can manage sponsorships" ON public.sponsorships;

-- (A) Public read for approved sponsorships
CREATE POLICY "Everyone can view approved sponsorships"
ON public.sponsorships
FOR SELECT
TO public
USING (status ILIKE 'approved');

-- (B) Logged-in users can view their own sponsorships
CREATE POLICY "Users can view own sponsorships"
ON public.sponsorships
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- (C) Anyone can submit a sponsorship application
CREATE POLICY "Anyone can submit sponsorship applications"
ON public.sponsorships
FOR INSERT
TO public
WITH CHECK (true);

-- (D) Admins have full access to view, update, approve, delete sponsorships
CREATE POLICY "Admins have full access to sponsorships"
ON public.sponsorships
FOR ALL
TO authenticated
USING (
  public.is_admin() 
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  )
)
WITH CHECK (
  public.is_admin() 
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  )
);
