-- Allow authenticated users to view/select their own listings (regardless of status)
CREATE POLICY "Users can view own listings"
  ON public.listings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
