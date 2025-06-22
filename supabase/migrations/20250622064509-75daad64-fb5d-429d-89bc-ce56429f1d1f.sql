
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('user', 'pharmacy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create pharmacies table
CREATE TABLE public.pharmacies (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create medicines master table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  aliases TEXT[], -- For search variations like Paracetamol -> Crocin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create pharmacy inventory table
CREATE TABLE public.pharmacy_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES public.medicines ON DELETE CASCADE,
  in_stock BOOLEAN DEFAULT TRUE,
  quantity INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE(pharmacy_id, medicine_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for pharmacies
CREATE POLICY "Anyone can view pharmacies" ON public.pharmacies
  FOR SELECT USING (true);

CREATE POLICY "Pharmacy owners can manage their pharmacy" ON public.pharmacies
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for medicines (public read)
CREATE POLICY "Anyone can view medicines" ON public.medicines
  FOR SELECT USING (true);

-- RLS Policies for inventory
CREATE POLICY "Anyone can view inventory" ON public.pharmacy_inventory
  FOR SELECT USING (true);

CREATE POLICY "Pharmacy owners can manage their inventory" ON public.pharmacy_inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pharmacies 
      WHERE pharmacies.id = pharmacy_inventory.pharmacy_id 
      AND pharmacies.user_id = auth.uid()
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert dummy medicines data
INSERT INTO public.medicines (name, category, aliases) VALUES
-- Fever & Pain
('Paracetamol 500mg', 'fever', ARRAY['Acetaminophen', 'Tylenol']),
('Paracetamol 650mg', 'fever', ARRAY['Crocin 650', 'Dolo 650']),
('Aspirin 75mg', 'heart', ARRAY['Ecosprin', 'Disprin']),
('Aspirin 325mg', 'fever', ARRAY['Disprin']),
('Ibuprofen 400mg', 'fever', ARRAY['Brufen', 'Advil']),
('Combiflam', 'fever', ARRAY['Ibuprofen + Paracetamol']),

-- Diabetes
('Metformin 500mg', 'diabetes', ARRAY['Glycomet']),
('Metformin 850mg', 'diabetes', ARRAY['Glycomet SR']),
('Glimepiride 1mg', 'diabetes', ARRAY['Amaryl']),
('Glimepiride 2mg', 'diabetes', ARRAY['Amaryl M']),

-- Blood Pressure
('Amlodipine 5mg', 'bp', ARRAY['Amlong', 'Norvasc']),
('Amlodipine 10mg', 'bp', ARRAY['Amlong']),
('Atenolol 25mg', 'bp', ARRAY['Tenormin']),
('Atenolol 50mg', 'bp', ARRAY['Tenormin']),
('Telmisartan 40mg', 'bp', ARRAY['Telma']),

-- Antibiotics
('Azithromycin 250mg', 'antibiotics', ARRAY['Zithromax', 'Azee']),
('Azithromycin 500mg', 'antibiotics', ARRAY['Azee 500']),
('Amoxicillin 250mg', 'antibiotics', ARRAY['Novamox']),
('Amoxicillin 500mg', 'antibiotics', ARRAY['Novamox']),
('Ciprofloxacin 500mg', 'antibiotics', ARRAY['Ciplox']),

-- Cough & Cold
('Cetirizine 10mg', 'cough', ARRAY['Zyrtec', 'Alerid']),
('Loratadine 10mg', 'cough', ARRAY['Claritin']),
('Dextromethorphan', 'cough', ARRAY['Robitussin']),
('Phenylephrine', 'cough', ARRAY['Sudafed']),

-- Heart
('Atorvastatin 10mg', 'heart', ARRAY['Lipitor', 'Atorva']),
('Clopidogrel 75mg', 'heart', ARRAY['Plavix', 'Clopilet']);
