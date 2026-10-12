// @vitest-environment node

import { createHmac } from 'node:crypto';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from './route';

const scriptUrl = 'https://script.google.com/macros/s/example-deployment/exec';
const signingSecret = 'test-only-signing-secret-32-characters';
const validEntry = {
  requestId: '66f547e6-20f2-4b96-9caa-6e4d3560ce80',
  firstname: ' Alex ',
  lastname: 'Lopez',
  email: 'alex@example.com',
};
const request = (body, origin = 'https://neon.com') =>
  new Request('https://neon.com/api/pg-us-conf-raffle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  });

describe('PGConf US raffle submissions', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubEnv('RAFFLE_APPS_SCRIPT_URL', scriptUrl);
    vi.stubEnv('RAFFLE_SIGNING_SECRET', signingSecret);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it.each([
    null,
    [],
    {},
    { ...validEntry, requestId: undefined },
    { ...validEntry, requestId: 'invalid' },
    { ...validEntry, firstname: ' ' },
    { ...validEntry, lastname: 123 },
    { ...validEntry, firstname: 'Alex\u0000' },
    { ...validEntry, email: 'invalid-email' },
    { ...validEntry, email: 'alex@example' },
    { ...validEntry, firstname: 'a'.repeat(101) },
  ])('rejects invalid entries before contacting Google: %j', async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON', async () => {
    const response = await POST(
      new Request('https://neon.com/api/pg-us-conf-raffle', {
        method: 'POST',
        body: '{',
      })
    );
    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects oversized requests', async () => {
    expect((await POST(request({ ...validEntry, extra: 'x'.repeat(12000) }))).status).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects requests originating on another website', async () => {
    expect((await POST(request(validEntry, 'https://example.com'))).status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['RAFFLE_SIGNING_SECRET', ''],
    ['RAFFLE_SIGNING_SECRET', 'short'],
    ['RAFFLE_APPS_SCRIPT_URL', ''],
    ['RAFFLE_APPS_SCRIPT_URL', 'https://example.com/exec'],
    ['RAFFLE_APPS_SCRIPT_URL', 'https://script.google.com.evil.example/macros/s/id/exec'],
    ['RAFFLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/id/dev'],
  ])('fails closed when %s is misconfigured', async (name, value) => {
    vi.stubEnv(name, value);
    expect((await POST(request(validEntry))).status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('signs trimmed fields and reports success only after storage confirmation', async () => {
    fetch.mockResolvedValue(Response.json({ ok: true }));
    const before = Date.now();
    const response = await POST(request({ ...validEntry, extra: 'ignored' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe(scriptUrl);
    expect(options).toMatchObject({
      method: 'POST',
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    const envelope = JSON.parse(options.body);
    const values = JSON.parse(envelope.payload);
    expect(values).toEqual({
      requestId: validEntry.requestId,
      timestamp: expect.any(Number),
      firstName: 'Alex',
      lastName: 'Lopez',
      email: 'alex@example.com',
      phone: '',
    });
    expect(values.timestamp).toBeGreaterThanOrEqual(before);
    expect(values.timestamp).toBeLessThanOrEqual(Date.now());
    expect(envelope.signature).toBe(
      createHmac('sha256', signingSecret).update(envelope.payload).digest('base64url')
    );
    expect(options.body).not.toContain(signingSecret);
  });

  it('accepts confirmed duplicate retries using the same request ID', async () => {
    fetch.mockResolvedValue(Response.json({ ok: true, duplicate: true }));
    expect((await POST(request(validEntry))).status).toBe(200);
    expect(JSON.parse(JSON.parse(fetch.mock.calls[0][1].body).payload).requestId).toBe(
      validEntry.requestId
    );
  });

  it.each([
    [{ ok: false, error: 'FORM_CLOSED' }, 200],
    [{ ok: false, error: 'REQUEST_ID_CONFLICT' }, 200],
    [{ ok: false, error: 'UNAUTHORIZED' }, 200],
    [{ ok: 'true' }, 200],
    [null, 200],
    [{}, 200],
    [{ ok: true }, 500],
  ])('does not report success for an unconfirmed response: %j', async (body, status) => {
    fetch.mockResolvedValue(Response.json(body, { status }));
    const response = await POST(request(validEntry));
    expect(response.status).toBe(502);
    expect(await response.json()).not.toHaveProperty('success');
  });

  it('handles a Google login/HTML response', async () => {
    fetch.mockResolvedValue(new Response('<html>Sign in</html>'));
    expect((await POST(request(validEntry))).status).toBe(502);
  });

  it('handles a network failure without returning submitted personal data or credentials', async () => {
    fetch.mockRejectedValue(new Error('Network error: ' + signingSecret + validEntry.email));
    const response = await POST(request(validEntry));
    expect(response.status).toBe(502);
    const body = await response.text();
    expect(body).not.toContain(validEntry.email);
    expect(body).not.toContain(signingSecret);
  });
});
