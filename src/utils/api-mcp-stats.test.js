import { afterEach, describe, expect, it, vi } from 'vitest';

import { getMcpStats } from './api-mcp-stats';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getMcpStats', () => {
  it.each([
    ['locally', undefined],
    ['on Vercel Preview', 'preview'],
  ])('returns null %s without the stats database', async (_target, env) => {
    vi.stubEnv('STATS_DATABASE_URL', undefined);
    vi.stubEnv('VERCEL_ENV', env);

    await expect(getMcpStats()).resolves.toBeNull();
  });

  it('requires the stats database on Vercel Production', async () => {
    vi.stubEnv('STATS_DATABASE_URL', undefined);
    vi.stubEnv('VERCEL_ENV', 'production');

    await expect(getMcpStats()).rejects.toThrow('STATS_DATABASE_URL is not set');
  });

  it.each([
    'postgresql://reader:hunter2@host.invalid:badport/stats',
    'postgresql://reader:hunter2@host%invalid/stats',
  ])('keeps the password out of the error for %s', async (connectionString) => {
    vi.stubEnv('STATS_DATABASE_URL', connectionString);

    const error = await getMcpStats().catch((e) => e);
    expect(error.message).toContain('[STATS_DATABASE_URL]');
    expect(error.message).not.toContain('hunter2');
  });
});
