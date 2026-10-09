-- Enum for lead statuses
CREATE TYPE lead_status AS ENUM ('Pending', 'Verified', 'Demo Booked', 'Deployed');

-- Scouts (Users) table
CREATE TABLE public.scouts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    handle TEXT,
    rank_level INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for scouts
ALTER TABLE public.scouts ENABLE ROW LEVEL SECURITY;

-- Allow scouts to read their own data
CREATE POLICY "Scouts can view their own profile" 
    ON public.scouts FOR SELECT 
    USING (auth.uid() = id);

-- Allow scouts to update their own data
CREATE POLICY "Scouts can update their own profile" 
    ON public.scouts FOR UPDATE 
    USING (auth.uid() = id);

-- Trigger to create a scout profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.scouts (id, email, full_name)
  VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Leads (Submissions) table
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scout_id UUID REFERENCES public.scouts(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    business_name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    property_category TEXT NOT NULL,
    security_gap TEXT NOT NULL,
    notes TEXT,
    status lead_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow scouts to view their own leads
CREATE POLICY "Scouts can view their own leads" 
    ON public.leads FOR SELECT 
    USING (auth.uid() = scout_id);

-- Allow scouts to insert their own leads
CREATE POLICY "Scouts can insert their own leads" 
    ON public.leads FOR INSERT 
    WITH CHECK (auth.uid() = scout_id);

-- Admins policy could be added here later (e.g., matching a role or specific email)
-- For demonstration purposes we'll keep it simple.

-- Storage bucket creation for leads photos
-- This assumes you create a public bucket named 'leads' in the Supabase Dashboard.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('leads', 'leads', true);
-- Allow public access to read images
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'leads' );
-- Allow authenticated users to upload images
-- CREATE POLICY "Auth users can upload images" ON storage.objects FOR INSERT WITH CHECK ( auth.role() = 'authenticated' AND bucket_id = 'leads' );
