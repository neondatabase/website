import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getFunctionTemplateInstallTotals,
  getFunctionTemplateInstalls,
} from './api-function-template-installs';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getFunctionTemplateInstalls', () => {
  it.each([
    ['locally', undefined, undefined],
    ['on Vercel Preview', '1', 'preview'],
  ])('has no installs to show %s without the stats database', async (_target, vercel, env) => {
    vi.stubEnv('STATS_DATABASE_URL', undefined);
    vi.stubEnv('VERCEL', vercel);
    vi.stubEnv('VERCEL_ENV', env);

    await expect(getFunctionTemplateInstalls('basic')).resolves.toEqual([]);
  });

  it('requires the stats database on Vercel Production', async () => {
    vi.stubEnv('STATS_DATABASE_URL', undefined);
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');

    await expect(getFunctionTemplateInstalls('basic')).rejects.toThrow(
      'STATS_DATABASE_URL is not set'
    );
  });

  it.each([
    'postgresql://reader:hunter2@host.invalid:badport/stats',
    'postgresql://reader:hunter2@host%invalid/stats',
  ])('keeps the password out of the error for %s', async (connectionString) => {
    vi.stubEnv('STATS_DATABASE_URL', connectionString);

    const error = await getFunctionTemplateInstalls('basic').catch((e) => e);
    expect(error.message).toContain('[STATS_DATABASE_URL]');
    expect(error.message).not.toContain('hunter2');
  });
});

describe('getFunctionTemplateInstallTotals', () => {
  it('has no totals to show on Vercel Preview without the stats database', async () => {
    vi.stubEnv('STATS_DATABASE_URL', undefined);
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');

    await expect(getFunctionTemplateInstallTotals()).resolves.toEqual(new Map());
  });

  it('keeps the password out of the error', async () => {
    vi.stubEnv('STATS_DATABASE_URL', 'postgresql://reader:hunter2@host.invalid:badport/stats');

    const error = await getFunctionTemplateInstallTotals().catch((e) => e);
    expect(error.message).toContain('[STATS_DATABASE_URL]');
    expect(error.message).not.toContain('hunter2');
  });
});
