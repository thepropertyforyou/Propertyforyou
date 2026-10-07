-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Users can view their own invoices
CREATE POLICY "Users can view their own invoices"
ON public.invoices
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all invoices
CREATE POLICY "Admins can view all invoices"
ON public.invoices
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert invoices
CREATE POLICY "Admins can insert invoices"
ON public.invoices
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update invoices
CREATE POLICY "Admins can update invoices"
ON public.invoices
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete invoices
CREATE POLICY "Admins can delete invoices"
ON public.invoices
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create invoices storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', true) ON CONFLICT DO NOTHING;

-- Storage policies for invoices bucket
CREATE POLICY "Admins can upload invoices" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'invoices' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view invoices" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'invoices');

CREATE POLICY "Admins can delete invoices" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'invoices' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update invoices" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'invoices' AND has_role(auth.uid(), 'admin'));
