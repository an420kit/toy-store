-- WOODKIND CRM bridge schema
-- Run in the Supabase SQL Editor for your WOODKIND project.
-- Do not add anon-key policies; server.js is the only intended access path.

create table if not exists public.woodkind_leads (
  id uuid primary key default gen_random_uuid(),
  canonical_key text not null unique,
  name text,
  company text,
  lead_type text not null default 'Retailer / B2B',
  city text,
  email text,
  phone text,
  website text,
  linkedin text,
  status text not null default 'New'
    check (status in ('New', 'Contacted', 'Interested', 'Sample requested', 'Won', 'Lost')),
  next_follow_up date,
  notes text,
  source text not null default 'Clay',
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists woodkind_leads_status_idx on public.woodkind_leads(status);
create index if not exists woodkind_leads_followup_idx on public.woodkind_leads(next_follow_up);
create index if not exists woodkind_leads_email_idx on public.woodkind_leads(email);

alter table public.woodkind_leads enable row level security;
