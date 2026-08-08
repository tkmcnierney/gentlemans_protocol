const MAX_BODY_BYTES = 20_000;
const TURNSTILE_ACTION = 'inquiry';
const REQUIRED_FIELDS = ['lead_id', 'full_name', 'email', 'city', 'role_linkedin', 'prompt_reason', 'timeline'];
const FIELD_LIMITS = {
  lead_id: 100,
  full_name: 120,
  email: 254,
  city: 160,
  role_linkedin: 500,
  prompt_reason: 3000,
  timeline: 80,
  turnstile_token: 2048
};

function json(body, status = 200, origin = '') {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function allowedOrigin(request, env) {
  const origin = request.headers.get('Origin') || '';
  if (!origin) return '';
  const requestOrigin = new URL(request.url).origin;
  const configured = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
  return origin === requestOrigin || configured.includes(origin) ? origin : null;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return 'invalid_payload';
  for (const field of REQUIRED_FIELDS) {
    if (typeof payload[field] !== 'string' || !payload[field].trim()) return `missing_${field}`;
  }
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if (payload[field] !== undefined && (typeof payload[field] !== 'string' || payload[field].length > limit)) {
      return `invalid_${field}`;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'invalid_email';
  return '';
}

async function verifyTurnstile(token, request, secret, expectedHostnames) {
  if (!secret || typeof token !== 'string' || !token || token.length > 2048 || expectedHostnames.size === 0) {
    return false;
  }
  const form = new FormData();
  form.set('secret', secret);
  form.set('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    signal: AbortSignal.timeout(10_000),
    body: form
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true
    && result.action === TURNSTILE_ACTION
    && expectedHostnames.has(result.hostname);
}

export async function onRequestPost({ request, env }) {
  const origin = allowedOrigin(request, env);
  if (origin === null) return json({ success: false, error: 'origin_not_allowed' }, 403);
  if (!env.LEAD_WEBHOOK_URL) return json({ success: false, error: 'service_not_configured' }, 503, origin);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ success: false, error: 'payload_too_large' }, 413, origin);

  let payload;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ success: false, error: 'payload_too_large' }, 413, origin);
    }
    payload = JSON.parse(rawBody);
  } catch {
    return json({ success: false, error: 'invalid_json' }, 400, origin);
  }

  const validationError = validatePayload(payload);
  if (validationError) return json({ success: false, error: validationError }, 400, origin);

  let turnstileValid = false;
  try {
    const expectedHostnames = new Set(
      (env.TURNSTILE_HOSTNAMES || '')
        .split(',')
        .map(hostname => hostname.trim())
        .filter(Boolean)
    );
    turnstileValid = await verifyTurnstile(payload.turnstile_token, request, env.TURNSTILE_SECRET, expectedHostnames);
  } catch {
    return json({ success: false, error: 'verification_unavailable' }, 503, origin);
  }
  if (!turnstileValid) return json({ success: false, error: 'verification_failed' }, 400, origin);

  const forwardedPayload = {
    ...payload,
    received_at: new Date().toISOString()
  };

  let webhookResponse;
  try {
    webhookResponse = await fetch(env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(env.LEAD_WEBHOOK_TOKEN ? { 'Authorization': `Bearer ${env.LEAD_WEBHOOK_TOKEN}` } : {})
      },
      body: JSON.stringify(forwardedPayload)
    });
  } catch {
    return json({ success: false, error: 'delivery_unavailable' }, 502, origin);
  }

  if (!webhookResponse.ok) return json({ success: false, error: 'delivery_rejected' }, 502, origin);

  let webhookResult;
  try {
    webhookResult = await webhookResponse.json();
  } catch {
    return json({ success: false, error: 'delivery_not_confirmed' }, 502, origin);
  }
  const deliveryConfirmed = webhookResult.success === true || webhookResult.result === 'success';
  if (!deliveryConfirmed) return json({ success: false, error: 'delivery_not_confirmed' }, 502, origin);

  return json({ success: true, lead_id: payload.lead_id }, 200, origin);
}

export async function onRequestOptions({ request, env }) {
  const origin = allowedOrigin(request, env);
  if (!origin) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    }
  });
}
