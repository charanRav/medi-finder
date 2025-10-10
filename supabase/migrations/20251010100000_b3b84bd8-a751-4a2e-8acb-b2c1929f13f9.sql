-- Create medicines table
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  manufacturer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create pharmacies table
CREATE TABLE IF NOT EXISTS public.pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  license_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(pharmacy_id, medicine_id)
);

-- Enable RLS
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Medicines policies (public read, admin write)
CREATE POLICY "Anyone can view medicines"
  ON public.medicines FOR SELECT
  USING (true);

-- Pharmacies policies
CREATE POLICY "Users can view their own pharmacy"
  ON public.pharmacies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pharmacy"
  ON public.pharmacies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pharmacy"
  ON public.pharmacies FOR UPDATE
  USING (auth.uid() = user_id);

-- Inventory policies
CREATE POLICY "Pharmacies can view their inventory"
  ON public.inventory FOR SELECT
  USING (
    pharmacy_id IN (
      SELECT id FROM public.pharmacies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacies can insert their inventory"
  ON public.inventory FOR INSERT
  WITH CHECK (
    pharmacy_id IN (
      SELECT id FROM public.pharmacies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacies can update their inventory"
  ON public.inventory FOR UPDATE
  USING (
    pharmacy_id IN (
      SELECT id FROM public.pharmacies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacies can delete their inventory"
  ON public.inventory FOR DELETE
  USING (
    pharmacy_id IN (
      SELECT id FROM public.pharmacies WHERE user_id = auth.uid()
    )
  );

-- Insert sample medicines
INSERT INTO public.medicines (name, category, description, price, manufacturer) VALUES
  ('Paracetamol 500mg', 'Pain Relief', 'Effective pain and fever relief', 5.99, 'PharmaCorp'),
  ('Ibuprofen 400mg', 'Pain Relief', 'Anti-inflammatory pain relief', 7.99, 'MediLife'),
  ('Amoxicillin 500mg', 'Antibiotics', 'Broad spectrum antibiotic', 12.99, 'BioPharm'),
  ('Cetirizine 10mg', 'Antihistamine', 'Allergy relief medication', 8.99, 'AllergyMed'),
  ('Omeprazole 20mg', 'Gastric', 'Reduces stomach acid', 15.99, 'DigestCare'),
  ('Metformin 500mg', 'Diabetes', 'Blood sugar control', 18.99, 'DiabetesRx'),
  ('Atorvastatin 20mg', 'Cardiovascular', 'Cholesterol management', 22.99, 'HeartHealth'),
  ('Salbutamol Inhaler', 'Respiratory', 'Asthma relief', 25.99, 'BreathEasy'),
  ('Vitamin D3 1000IU', 'Supplements', 'Bone health support', 9.99, 'VitaPlus'),
  ('Multivitamin Complex', 'Supplements', 'Daily nutritional support', 14.99, 'HealthBoost')
ON CONFLICT DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();