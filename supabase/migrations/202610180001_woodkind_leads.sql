-- WOODKIND CRM lead table for server-side Clay webhook intake.
-- Apply this migration in the Supabase SQL Editor before enabling the endpoint.
create extension if not exists pgcrypto;

create table if not exists public.woodkind_leads (
  id uuid primary key default gen_random_uuid(),
  source_identity text not null unique,
  name text not null default 'Unknown contact',
  company text,
  type text not null default 'Clay',
  city text,
  email text,
  phone text,
  website text,
  linkedin text,
  status text not null default 'New'
    check (status in ('New', 'Contacted', 'Interested', 'Sample requested', 'Won', 'Lost')),
  next_follow_up date,
  notes text,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists woodkind_leads_status_idx on public.woodkind_leads(status);
create index if not exists woodkind_leads_follow_up_idx on public.woodkind_leads(next_follow_up);
create index if not exists woodkind_leads_email_idx on public.woodkind_leads(lower(email));

alter table public.woodkind_leads enable row level security;

-- No anon/authenticated policies are intentionally created here.
-- The serverless webhook uses the service role key server-side only.
-- Add explicit admin-only policies before connecting a browser dashboard to this table.
