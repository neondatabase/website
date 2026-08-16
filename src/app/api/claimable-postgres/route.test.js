import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

global.fetch = vi.fn();

const ORIGIN = 'https://claimable.example';

const registration = {
  registration_id: 'reg_test',
  identity_assertion: 'assertion-secret',
  project: {
    id: 'quiet-fog-12345678',
    branch_id: 'br-main',
    expires_at: '2026-08-14T12:00:00.000Z',
  },
  capabilities: [
    { capability: 'postgres', granted: true },
    { capability: 'data_api', granted: true },
    { capability: 'auth', granted: true },
  ],
};

const token = {
  access_token: 'access-secret',
  token_type: 'Bearer',
  expires_in: 900,
  scope: 'postgres.read postgres.write data_api.query auth.configure',
};

const credentials = {
  project_id: registration.project.id,
  branch_id: registration.project.branch_id,
  database_url: 'postgresql://example',
  expires_at: registration.project.expires_at,
  services: {
    data_api: { url: 'https://data-api.example/rest/v1' },
    auth: {
      base_url: 'https://auth.example/api/auth',
      jwks_url: 'https://auth.example/.well-known/jwks.json',
    },
  },
};

const claim = {
  user_code: 'ABCD-2345',
  verification_uri: `${ORIGIN}/claim`,
  verification_uri_complete: `${ORIGIN}/claim?user_code=ABCD-2345`,
  expires_in: 900,
  interval: 5,
};

const jsonResponse = (body, init) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  });

describe('/api/claimable-postgres', () => {
  let POST;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.CLAIMABLE_NEON_ORIGIN = ORIGIN;
    ({ POST } = await import('./route.js'));
  });

  afterEach(() => {
    delete process.env.CLAIMABLE_NEON_ORIGIN;
  });

  it('provisions requested services and returns credentials plus a claim URL', async () => {
    global.fetch
      .mockResolvedValueOnce(jsonResponse(registration))
      .mockResolvedValueOnce(jsonResponse(token))
      .mockResolvedValueOnce(jsonResponse(credentials))
      .mockResolvedValueOnce(jsonResponse(claim));

    const response = await POST(
      new Request('https://neon.com/api/claimable-postgres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: ['auth', 'data-api'] }),
      })
    );

    expect(response.status).toBe(201);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({
      project: registration.project,
      capabilities: registration.capabilities,
      credentials,
      claim: {
        verification_uri_complete: claim.verification_uri_complete,
        expires_in: claim.expires_in,
      },
    });

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${ORIGIN}/v1/agent/identity`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          type: 'anonymous',
          capabilities: ['postgres', 'data_api', 'auth'],
          source: 'neon_website',
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      `${ORIGIN}/v1/projects/${registration.project.id}/credentials`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: `Bearer ${token.access_token}` }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      4,
      `${ORIGIN}/v1/projects/${registration.project.id}/claim`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('rejects unknown services before provisioning', async () => {
    const response = await POST(
      new Request('https://neon.com/api/claimable-postgres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: ['functions'] }),
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        code: 'invalid_request',
        message: 'services may contain only auth and data-api.',
      },
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('preserves structured Claimable Neon errors', async () => {
    const upstreamError = {
      error: {
        code: 'rate_limit_exceeded',
        origin: 'service',
        message: 'Too many projects were created from this client.',
        retryable: true,
        request_id: 'req_test',
      },
    };
    global.fetch.mockResolvedValueOnce(jsonResponse(upstreamError, { status: 429 }));

    const response = await POST(
      new Request('https://neon.com/api/claimable-postgres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: [] }),
      })
    );

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual(upstreamError);
  });

  it('returns 502 when Claimable Neon cannot be reached', async () => {
    global.fetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const response = await POST(
      new Request('https://neon.com/api/claimable-postgres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: [] }),
      })
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: {
        code: 'claimable_service_unavailable',
        message: 'Claimable Neon could not be reached.',
      },
    });
  });

  it('deletes the remote project when setup fails after registration', async () => {
    const upstreamError = {
      error: {
        code: 'upstream_unavailable',
        message: 'Credentials are temporarily unavailable.',
      },
    };
    global.fetch
      .mockResolvedValueOnce(jsonResponse(registration))
      .mockResolvedValueOnce(jsonResponse(token))
      .mockResolvedValueOnce(jsonResponse(upstreamError, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    const response = await POST(
      new Request('https://neon.com/api/claimable-postgres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: [] }),
      })
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual(upstreamError);
    expect(global.fetch).toHaveBeenNthCalledWith(
      4,
      `${ORIGIN}/v1/projects/${registration.project.id}`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({ Authorization: `Bearer ${token.access_token}` }),
      })
    );
  });
});
