import crypto from 'node:crypto';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '127.0.0.1';
const MAX_BATCH = 250;
const VALID_STATUSES = new Set(['New', 'Contacted', 'Interested', 'Sample requested', 'Won', 'Lost']);

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb', strict: true }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const env = {
  supabaseUrl: (process.env.SUPABASE_URL || '').replace(/\/+$/, ''),
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  adminToken: process.env.ADMIN_API_TOKEN || '',
  claySecret: process.env.CLAY_WEBHOOK_SECRET || '',
  clayStatusUrl: process.env.CLAY_STATUS_WEBHOOK_URL || '',
};
const dbReady = Boolean(env.supabaseUrl && env.supabaseKey);
const adminReady = Boolean(env.adminToken && env.adminToken.length >= 32);
const clayReady = Boolean(env.claySecret && env.claySecret.length >= 32);

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.publicMessage = message;
  }
}
function secureEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function bearer(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
}
function requireAdmin(req, res, next) {
  if (!adminReady) return res.status(503).json({ error: 'Admin integration token is not configured on server.' });
  if (!secureEqual(bearer(req), env.adminToken)) return res.status(401).json({ error: 'Missing or invalid integration token.' });
  if (!dbReady) return res.status(503).json({ error: 'Database not configured on server.' });
  next();
}
function requireClay(req, res, next) {
  if (!clayReady) return res.status(503).json({ error: 'Clay webhook secret is not configured on server.' });
  const provided = String(req.headers['x-woodkind-webhook-secret'] || bearer(req));
  if (!secureEqual(provided, env.claySecret)) return res.status(401).json({ error: 'Invalid webhook credential.' });
  if (!dbReady) return res.status(503).json({ error: 'Database not configured on server.' });
  next();
}
async function dbRequest(endpoint, options = {}) {
  const response = await fetch(env.supabaseUrl + '/rest/v1/' + endpoint, {
    method: options.method || 'GET',
    headers: {
      apikey: env.supabaseKey,
      Authorization: 'Bearer ' + env.supabaseKey,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = { message: raw }; }
  if (!response.ok) {
    const err = new ApiError(response.status >= 500 ? 502 : 400, 'Database request failed. Check the migration and protected server logs.');
    err.internal = data;
    throw err;
  }
  return data;
}
function first(obj, keys) {
  for (const key of keys) {
    const value = obj && obj[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value).trim();
  }
  return '';
}
function mapLead(raw, defaultSource) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const name = first(raw, ['name', 'full_name', 'contact_name', 'person_name']);
  const company = first(raw, ['company', 'company_name', 'business', 'organization', 'account_name']);
  const email = first(raw, ['email', 'work_email', 'business_email', 'email_address']).toLowerCase();
  const externalId = first(raw, ['external_id', 'clay_id', 'record_id', 'row_id', 'id']);
  const phone = first(raw, ['phone', 'phone_number', 'mobile', 'work_phone']);
  const website = first(raw, ['website', 'domain', 'company_domain', 'url']);
  const linkedin = first(raw, ['linkedin', 'linkedin_url', 'person_linkedin_url', 'profile_url']);
  const city = first(raw, ['city', 'location', 'locality', 'company_city']);
  if (!name && !company && !email && !externalId) return null;

  let identity;
  if (email) identity = 'email:' + email;
  else if (externalId) identity = 'external:' + externalId;
  else if (website) identity = 'website:' + website.toLowerCase();
  else if (phone) identity = 'phone:' + phone.replace(/\D/g, '');
  else identity = 'record:' + crypto.createHash('sha256').update(company.toLowerCase() + '|' + name.toLowerCase()).digest('hex');

  const row = {
    canonical_key: identity,
    updated_at: new Date().toISOString(),
    source: first(raw, ['source']) || defaultSource || 'Clay',
  };
  if (name) row.name = name;
  if (company) row.company = company;
  const type = first(raw, ['type', 'lead_type', 'category']);
  if (type) row.lead_type = type;
  if (city) row.city = city;
  if (email) row.email = email;
  if (phone) row.phone = phone;
  if (website) row.website = website;
  if (linkedin) row.linkedin = linkedin;
  if (externalId) row.external_id = externalId;
  const status = first(raw, ['status', 'lead_status']);
  if (status) row.status = [...VALID_STATUSES].find(s => s.toLowerCase() === status.toLowerCase()) || 'New';
  const follow = first(raw, ['next_follow_up', 'nextFollowUp', 'next_followup', 'follow_up_date']);
  if (/^\d{4}-\d{2}-\d{2}$/.test(follow)) row.next_follow_up = follow;
  const notes = first(raw, ['notes', 'description', 'summary']);
  if (notes) row.notes = notes;
  return row;
}
function listFromBody(body) {
  if (Array.isArray(body)) return body;
  for (const key of ['leads', 'records', 'rows', 'data', 'results']) {
    if (Array.isArray(body && body[key])) return body[key];
  }
  return body && typeof body === 'object' ? [body] : [];
}
function publicLead(row) {
  return {
    id: row.id,
    name: row.name || '',
    company: row.company || '',
    type: row.lead_type || 'Retailer / B2B',
    city: row.city || '',
    email: row.email || '',
    phone: row.phone || '',
    website: row.website || '',
    linkedin: row.linkedin || '',
    status: row.status || 'New',
    nextFollowUp: row.next_follow_up || '',
    notes: row.notes || '',
    source: row.source || '',
    externalId: row.external_id || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
async function upsertLeadRows(rawRows, source) {
  if (!Array.isArray(rawRows)) throw new ApiError(400, 'Expected a list of lead records.');
  if (rawRows.length > MAX_BATCH) throw new ApiError(413, 'Batch limit is 250 lead rows per request.');
  const unique = new Map();
  for (const raw of rawRows) {
    const row = mapLead(raw, source);
    if (row) unique.set(row.canonical_key, row);
  }
  const rows = [...unique.values()];
  if (!rows.length) return [];
  const stored = await dbRequest('woodkind_leads?on_conflict=canonical_key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: rows,
  });
  return (stored || []).map(publicLead);
}
async function sendClayStatusEvent(lead) {
  if (!env.clayStatusUrl) return false;
  try {
    const response = await fetch(env.clayStatusUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'woodkind.lead.status_updated', sent_at: new Date().toISOString(), lead }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

app.get('/api/woodkind/health', (_req, res) => {
  res.json({
    service: 'woodkind-crm-bridge',
    ok: true,
    configured: {
      database: dbReady,
      adminToken: adminReady,
      clayInboundWebhook: clayReady,
      clayStatusEventWebhook: Boolean(env.clayStatusUrl),
    },
    note: 'Configuration state only. No secret values are returned.',
  });
});

app.post('/api/woodkind/clay/webhook', requireClay, async (req, res, next) => {
  try {
    const rawRows = listFromBody(req.body);
    const insertedOrUpdated = await upsertLeadRows(rawRows, 'Clay');
    res.status(200).json({ ok: true, received: rawRows.length, upserted: insertedOrUpdated.length });
  } catch (err) { next(err); }
});

app.get('/api/woodkind/admin/leads', requireAdmin, async (_req, res, next) => {
  try {
    const rows = await dbRequest('woodkind_leads?select=*&order=updated_at.desc&limit=500');
    res.json({ leads: (rows || []).map(publicLead) });
  } catch (err) { next(err); }
});

app.post('/api/woodkind/admin/leads/import', requireAdmin, async (req, res, next) => {
  try {
    const rawRows = listFromBody(req.body);
    const leads = await upsertLeadRows(rawRows, 'CSV import');
    res.json({ ok: true, received: rawRows.length, upserted: leads.length, leads });
  } catch (err) { next(err); }
});

app.patch('/api/woodkind/admin/leads/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError(400, 'Invalid lead id.');
    const patch = {};
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'status')) {
      const status = String(req.body.status || '');
      if (!VALID_STATUSES.has(status)) throw new ApiError(400, 'Unsupported lead status.');
      patch.status = status;
    }
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'nextFollowUp')) {
      const follow = String(req.body.nextFollowUp || '');
      if (follow && !/^\d{4}-\d{2}-\d{2}$/.test(follow)) throw new ApiError(400, 'Follow-up date must be YYYY-MM-DD.');
      patch.next_follow_up = follow || null;
    }
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'notes')) {
      patch.notes = String(req.body.notes || '').slice(0, 5000) || null;
    }
    if (!Object.keys(patch).length) throw new ApiError(400, 'No supported fields supplied.');
    patch.updated_at = new Date().toISOString();
    const rows = await dbRequest('woodkind_leads?id=eq.' + encodeURIComponent(id) + '&select=*', {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: patch,
    });
    if (!rows || !rows.length) throw new ApiError(404, 'Lead not found.');
    const lead = publicLead(rows[0]);
    let clayEventSent = false;
    if (patch.status) clayEventSent = await sendClayStatusEvent(lead);
    res.json({ ok: true, lead, clayEventSent });
  } catch (err) { next(err); }
});

app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found.' }));
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'Invalid JSON body.' });
  if (err instanceof ApiError) return res.status(err.status, 500).json({ error: err.publicMessage });
  console.error('[woodkind-api]', err && err.message ? err.message : 'Unhandled error');
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(PORT, HOST, () => {
  console.log('WOODKIND CRM API listening on ' + HOST + ':' + PORT);
});
