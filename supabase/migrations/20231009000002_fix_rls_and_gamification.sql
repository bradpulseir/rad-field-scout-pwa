-- ==============================================================================
-- MIGRATION 20231009000002: RLS FIXES, REFERRALS, SUGGESTIONS & GAMIFICATION V2
-- ==============================================================================

-- 1. Ensure public.scouts allows INSERT/UPSERT from authenticated users
DROP POLICY IF EXISTS "Scouts can insert their own profile" ON public.scouts;
CREATE POLICY "Scouts can insert their own profile" 
    ON public.scouts FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 2. Allow public viewing of scout profiles for the Community Leaderboard
DROP POLICY IF EXISTS "Scouts can view their own profile" ON public.scouts;
DROP POLICY IF EXISTS "Anyone can view scout profiles" ON public.scouts;
CREATE POLICY "Anyone can view scout profiles" 
    ON public.scouts FOR SELECT 
    USING (true);

-- 3. Robust user creation trigger with ON CONFLICT resolution
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.scouts (id, email, full_name, rank_level, total_points)
  VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      0,
      0
  )
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Strengthen Leads INSERT policy for authenticated scouts
DROP POLICY IF EXISTS "Scouts can insert their own leads" ON public.leads;
CREATE POLICY "Scouts can insert their own leads" 
    ON public.leads FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = scout_id);

-- 5. Expand Leads Table with V2 Fields (Submission Type & Optional Contact Info)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS submission_type TEXT DEFAULT 'Future RAD Site';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS contact_info TEXT;

-- 6. Storage Policies for "leads" bucket
DO $$
BEGIN
  -- Ensure public read for lead images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access to Leads Bucket' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public Access to Leads Bucket" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'leads');
  END IF;

  -- Ensure authenticated users can upload evidence photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload to leads' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Authenticated users can upload to leads" 
    ON storage.objects FOR INSERT 
    TO authenticated 
    WITH CHECK (bucket_id = 'leads');
  END IF;
END $$;

-- 7. Community Referrals Table ("Refer a Friend")
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scout_id UUID REFERENCES public.scouts(id) ON DELETE CASCADE,
    friend_email TEXT NOT NULL,
    status TEXT DEFAULT 'Invited',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scouts can view their own referrals" 
    ON public.referrals FOR SELECT 
    USING (auth.uid() = scout_id);

CREATE POLICY "Scouts can insert their own referrals" 
    ON public.referrals FOR INSERT 
    WITH CHECK (auth.uid() = scout_id);

CREATE POLICY "Admins can view all referrals" 
    ON public.referrals FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.scouts WHERE id = auth.uid() AND is_admin = true));

-- 8. Program Suggestion Box Table
CREATE TABLE IF NOT EXISTS public.suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scout_id UUID REFERENCES public.scouts(id) ON DELETE CASCADE,
    suggestion_text TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scouts can view their own suggestions" 
    ON public.suggestions FOR SELECT 
    USING (auth.uid() = scout_id);

CREATE POLICY "Scouts can insert their own suggestions" 
    ON public.suggestions FOR INSERT 
    WITH CHECK (auth.uid() = scout_id);

CREATE POLICY "Admins can view all suggestions" 
    ON public.suggestions FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.scouts WHERE id = auth.uid() AND is_admin = true));
