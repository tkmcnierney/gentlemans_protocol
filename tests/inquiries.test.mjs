import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequestPost } from '../functions/api/inquiries.js';

const validPayload = {
  lead_id: 'test-lead-id',
  full_name: 'Test Person',
  email: 'test@example.com',
  city: 'New York, NY',
  role_linkedin: 'Founder',
  prompt_reason: 'Testing the application flow.',
  timeline: 'Within 30 days',
  turnstile_token: 'test-turnstile-token',
  attribution: { utm_source: 'test' }
};

function requestFor(payload, origin = 'https://example.com') {
  return new Request(`${origin}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': origin },
    body: JSON.stringify(payload)
  });
}

test('rejects an unconfigured lead destination', async () => {
  const response = await onRequestPost({ request: requestFor(validPayload), env: {} });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { success: false, error: 'service_not_configured' });
});

test('rejects incomplete application data', async () => {
  const response = await onRequestPost({
    request: requestFor({ lead_id: 'incomplete' }),
    env: { LEAD_WEBHOOK_URL: 'https://leads.example.test' }
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).success, false);
});

test('confirms success only after Turnstile and webhook confirmation', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push([String(url), options]);
    if (String(url).includes('siteverify')) {
      return Response.json({ success: true, action: 'inquiry', hostname: 'example.com' });
    }
    if (String(url) === 'https://leads.example.test') return Response.json({ success: true });
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const response = await onRequestPost({
      request: requestFor(validPayload),
      env: {
        LEAD_WEBHOOK_URL: 'https://leads.example.test',
        TURNSTILE_SECRET: 'test-secret',
        TURNSTILE_HOSTNAMES: 'example.com'
      }
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, lead_id: 'test-lead-id' });
    assert.equal(calls.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rejects a webhook response that does not explicitly confirm storage', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    if (String(url).includes('siteverify')) {
      return Response.json({ success: true, action: 'inquiry', hostname: 'example.com' });
    }
    return Response.json({ success: false });
  };

  try {
    const response = await onRequestPost({
      request: requestFor(validPayload),
      env: {
        LEAD_WEBHOOK_URL: 'https://leads.example.test',
        TURNSTILE_SECRET: 'test-secret',
        TURNSTILE_HOSTNAMES: 'example.com'
      }
    });
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { success: false, error: 'delivery_not_confirmed' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('accepts the existing Apps Script confirmed-success response', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    if (String(url).includes('siteverify')) {
      return Response.json({ success: true, action: 'inquiry', hostname: 'gentlemansprotocol.com' });
    }
    return Response.json({ result: 'success' });
  };

  try {
    const response = await onRequestPost({
      request: requestFor(validPayload),
      env: {
        LEAD_WEBHOOK_URL: 'https://leads.example.test',
        TURNSTILE_SECRET: 'test-secret',
        TURNSTILE_HOSTNAMES: 'gentlemansprotocol.com,www.gentlemansprotocol.com'
      }
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, lead_id: 'test-lead-id' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
