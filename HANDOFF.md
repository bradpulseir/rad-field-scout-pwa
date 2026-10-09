# RAD Field Scout Network - Deployment & Handoff Guide

Welcome to the RAD Field Scout Network PWA. This guide provides the exact steps to deploy this application to production with zero downtime.

## 1. GitHub (Version Control)
1. Go to GitHub and create a new private repository called `rad-field-scout-pwa`.
2. Push the local code to it:
   ```bash
   git remote add origin https://github.com/YOUR_ORG/rad-field-scout-pwa.git
   git branch -M main
   git push -u origin main
   ```

## 2. Supabase (Database)
1. Go to [Supabase.com](https://supabase.com), create a new project.
2. Go to the **SQL Editor**.
3. Copy and paste the text from `supabase/migrations/20231009000000_initial_schema.sql` and run it to instantly build the database.
4. Copy and paste the text from `supabase/migrations/20231009000001_admin_rls.sql` and run it to enforce triage admin security policies.
5. In your Supabase dashboard, go to **Storage** and create a new public bucket named `leads`.

## 3. Vercel (Hosting)
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your `rad-field-scout-pwa` GitHub repo.
3. In the "Environment Variables" section, paste your Supabase URL and Anon Key (found in your Supabase project settings -> API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

## 4. The Magic Link
In about 60 seconds, Vercel will give you a live URL (e.g., `rad-field-scout-pwa.vercel.app`). Your Progressive Web App is now live and ready to crowdsource enterprise leads!
