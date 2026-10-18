import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Clay -> WOODKIND lead intake endpoint.
 * Configure CLAY_WEBHOOK_SECRET, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * as server-side environment variables only.
 *
 * In Clay, send x-woodkind-webhook-secret with the configured secret.
 * This endpoint intentionally does not expose credentials to the browser.
 */
const text = (value: unknown): string | null => {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const result = String(value).trim();
  return result ? result.slice(0, 2000) : null;
};

const first = (body: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = text(body[key]);
    if (value) return value;
  }
  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.CLAY_WEBHOOK_SECRET;
  const received = req.headers['x-woodkind-webhook-secret'];
  if (!expected || typeof received !== 'string' || received !== expected) {
    return res.status(401).json({ error: 'Unauthorized webhook' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Database integration is not configured' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const payload = req.body as unknown;
  const rows = Array.isArray(payload) ? payload : [payload];
  if (!rows.length || rows.length > 100) {
    return res.status(400).json({ error: 'Send between 1 and 100 lead records per request' });
  }

  const leads = rows.map((item) => {
    const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const email = first(row, 'email', 'work_email', 'email_address');
    const linkedin = first(row, 'linkedin', 'linkedin_url', 'person_linkedin_url');
    const domain = first(row, 'domain', 'company_domain', 'website');
    return {
      name: first(row, 'name', 'full_name', 'first_name') ?? 'Unknown contact',
      company: first(row, 'company', 'company_name', 'organization_name'),
      type: first(row, 'type', 'company_type', 'lead_type') ?? 'Clay',
      city: first(row, 'city', 'location_city'),
      email: email?.toLowerCase() ?? null,
      phone: first(row, 'phone', 'phone_number', 'mobile_phone'),
      website: domain,
      linkedin,
      status: first(row, 'status') ?? 'New',
      next_follow_up: first(row, 'nextFollowUp', 'next_follow_up'),
      notes: first(row, 'notes', 'description'),
      source: 'clay',
      updated_at: new Date().toISOString(),
    };
  });

  if (leads.some((lead) => !lead.email && !lead.linkedin && !lead.website)) {
    return res.status(400).json({
      error: 'Each lead needs at least one deduplication key: email, LinkedIn URL, or website/domain',
    });
  }

  // Email is the canonical unique key; records without email are upserted by
  // the database's source_identity column after it is populated below.
  const normalized = leads.map((lead) => ({
    ...lead,
    source_identity: lead.email ?? lead.linkedin ?? lead.website,
  }));

  const { data, error } = await supabase
    .from('woodkind_leads')
    .upsert(normalized, { onConflict: 'source_identity' })
    .select('id, name, company, email, status');

  if (error) {
    console.error('WOODKIND Clay webhook database error:', error.message);
    return res.status(500).json({ error: 'Could not save leads. Check database schema and policies.' });
  }

  return res.status(200).json({ ok: true, received: leads.length, saved: data?.length ?? 0 });
}
