# AITX ($AITX) | RAD Field Scout Network - Deployment & Handoff Guide

Welcome to the **AITX ($AITX) | RAD Field Scout Network** PWA. This platform empowers retail shareholders and brand advocates to crowdsource commercial enterprise leads for AITX (ROSA, RIO, ROAMEO) and spot active units deployed across America.

---

## 1. Centralized Brand Assets (`src/config/brandConfig.ts`)
All company names, logo fallbacks, reward tiers, baseline numbers for the Community Momentum Thermometer, and social sharing copy presets are centralized in:
`src/config/brandConfig.ts`

When official PNG/SVG logos or marketing photography arrive, update the paths in this single file.

---

## 2. Supabase Database Setup & Migrations
The database schema is fully modularized in `supabase/migrations/`:

1. **`20231009000000_initial_schema.sql`**: Core `scouts` and `leads` tables, status enums, and initial RLS policies.
2. **`20231009000001_admin_rls.sql`**: Role-based access control for the `/admin` triage dashboard (`is_admin` column and admin RLS).
3. **`20231009000002_fix_rls_and_gamification.sql`**: 
   - Strengthened RLS policies preventing "new row violates row-level security policy" errors.
   - Robust `ON CONFLICT` user trigger.
   - New `referrals` and `suggestions` tables.
   - Expanded `leads` table (`submission_type`, `contact_name`, `contact_info`).
   - Storage upload and public read policies for the `leads` bucket.

### Running Migrations:
In your Supabase Dashboard, go to **SQL Editor > New query**, paste each file in sequential order, and click **Run**.

### Storage Bucket:
Go to **Storage > New Bucket**, name it `leads` (all lowercase), and toggle **Public bucket** to **ON**.

---

## 3. CRM & Marketing Webhook Pipeline (`/api/webhooks/sync-crm`)
The app includes a graceful webhook dispatcher for Mailchimp, Zapier, or HubSpot:
- Dispatches JSON payloads on signups, lead submissions, friend referrals, and suggestions.
- Configured via `MAILCHIMP_ZAPIER_WEBHOOK_URL` in `.env`.
- If unconfigured, the app logs events locally and returns `{ status: "queued_locally" }` without breaking user flow.

---

## 4. Vercel Production Deployment
1. Import the GitHub repository into your Vercel account.
2. Add the required Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase REST API URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key
   - `MAILCHIMP_ZAPIER_WEBHOOK_URL` (optional): Webhook endpoint for CRM sync
3. Click **Deploy**.
4. In your Supabase Dashboard under **Authentication > URL Configuration**, set the **Site URL** to your live production domain (e.g. `https://rad-field-scout.vercel.app`).
