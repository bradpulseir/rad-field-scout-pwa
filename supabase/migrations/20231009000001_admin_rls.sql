-- Add is_admin column to scouts table
ALTER TABLE public.scouts ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Policy to allow admins to read all leads
CREATE POLICY "Admins can view all leads" 
    ON public.leads FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.scouts 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Policy to allow admins to update all leads (for triage)
CREATE POLICY "Admins can update all leads" 
    ON public.leads FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.scouts 
            WHERE id = auth.uid() AND is_admin = true
        )
    );
