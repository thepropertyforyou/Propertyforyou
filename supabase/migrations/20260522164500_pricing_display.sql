-- Add display_price column to pricing_plans table
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS display_price TEXT;

-- Insert default featured and popup plans for comparison table if they don't exist
INSERT INTO public.pricing_plans (plan_type, duration, price, display_order, display_price)
VALUES 
  ('featured', 30, 499, 7, '₹499'),
  ('popup', 30, 999, 8, '₹0')
ON CONFLICT (plan_type) 
DO UPDATE SET 
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price;
