# WOODKIND Clay integration setup

## What this adds
- A server-side webhook at `/api/clay-webhook` for Clay -> WOODKIND lead intake.
- Supabase table migration at `supabase/migrations/202610180001_woodkind_leads.sql`.
- A shared secret header, basic payload validation, and upsert deduplication by email/LinkedIn/domain identity.
- The existing storefront, Founder Portal, product pages and existing navigation are not changed by these files.

## Important deployment note
The repository's current frontend is Vite/React, while the known hosting setup is a Namecheap Ubuntu VPS. The `api/` handler is written for a Vercel-compatible serverless runtime; it will **not** run on a plain static Vite build or Nginx-only deployment. For the Namecheap VPS, port this handler into the existing Node/Express server and proxy `/api/` through Nginx, or explicitly choose a compatible serverless host. Do not assume the endpoint is live just because it exists in GitHub.

## Configure the database
1. Create/choose the Supabase project.
2. Run the SQL migration in the Supabase SQL Editor.
3. Add these as server-side environment variables in the hosting environment:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLAY_WEBHOOK_SECRET` (long random secret)
4. Never place the service-role key or webhook secret in `public/admin.html`, Vite `VITE_*` variables, or Git.

## Configure Clay
1. Create a webhook/API HTTP action in your Clay workflow.
2. Send a POST request to the deployed `/api/clay-webhook` endpoint.
3. Set header `x-woodkind-webhook-secret` to the exact server-side `CLAY_WEBHOOK_SECRET`.
4. Map Clay columns to JSON keys such as `full_name`, `company_name`, `work_email`, `phone_number`, `city`, `linkedin_url`, `domain`, and `notes`.
5. Send a test record and verify the response and database row before enabling a full workflow.

## Current limitations
- This endpoint only handles inbound Clay leads. It does not yet provide browser dashboard login, admin-only read/update APIs, Clay write-back, email sending, order/payment synchronization, or live product catalogue control.
- The existing `public/admin.html` is a localStorage MVP and does not yet read/write the Supabase table. Do not enter sensitive customer data there or expose it publicly as a production admin.
- Do not merge/deploy this integration until the hosting runtime is confirmed, dependencies are installed, and a build/deployment test passes.
- The previous Founder Portal in `src/screens/FounderPortalScreen.tsx` is a storefront screen with simulated planning data, not an authenticated production admin. Preserve it while building the secure admin integration separately.
