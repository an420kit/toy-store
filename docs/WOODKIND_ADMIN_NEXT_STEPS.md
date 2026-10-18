# WOODKIND Admin + Clay/Excel workflow (MVP)

## What this branch adds
- `public/admin.html`: responsive admin workspace for leads/CRM, product planning, order tracking, unit costing, marketing campaigns, and CSV import/export.
- Default product rows are planning hypotheses, not validated quotations or live inventory.
- No dummy leads or sales are preloaded.

## How to preview
1. Merge or check out branch `feat/woodkind-admin-crm`.
2. Run `npm install` and `npm run dev`.
3. Open `/admin.html` on the local Vite server.
4. For a production static build, run `npm run build`; Vite copies `public/admin.html` to the build output.

## Clay + Excel bridge
1. Search companies/contacts in the connected Clay workspace.
2. Review relevance and verify each company/contact before outreach.
3. Export selected rows from Clay to CSV.
4. Open Admin > Clay / Excel Sync and import the CSV.
5. Update status and next follow-up in Leads / CRM.
6. Export Leads CSV to continue in Excel or use as a reviewed source for Clay.

Suggested CSV headers: `name, company, type, city, email, phone, website, linkedin, status, nextFollowUp, notes`. Common Clay headers such as `full_name`, `company_name`, `work_email`, `linkedin_url`, and `domain` are mapped where possible.

## Important limitations before production
- This is a browser-local MVP. Records are saved in the browser's localStorage; they do not sync across devices or users, and clearing browser data can erase them.
- The page has **no authentication**. Do not put sensitive customer data into it or treat it as a secure production admin. Restrict it from public access until server-side authentication is implemented.
- No database, payment gateway, order webhook, email sender, Clay API write-back, or live website catalogue sync is configured.
- CSV import may create duplicates; review imported rows before sending outreach.
- Never put Clay, database, payment, or AI API keys in client-side HTML.
- Before launch, connect a server-side database (e.g. Supabase/Postgres), authentication, role-based access, row-level security, backups, and audit logs. Then replace localStorage reads/writes with server APIs.
- Child climbing/play products must not be advertised with unverified safety certification or load ratings.

## Recommended next implementation steps
1. Confirm the deployed site and hosting path; the public repository does not prove what is currently live on the VPS.
2. Configure Supabase project and server-only credentials (user action required; never commit secrets).
3. Add authenticated admin login and database tables/policies for leads, products, costs, orders and campaigns.
4. Add deduplication, import preview, validation and export tests.
5. Add optional Clay enrichment/outreach integration only after reviewing permissions and any usage cost.
6. Deploy to a protected staging URL, test on mobile, then promote to production.
