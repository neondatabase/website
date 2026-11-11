import { afterEach, describe, expect, it } from 'vitest';

import { getFunctionTemplateInstalls } from './api-function-template-installs';

const { STATS_DATABASE_URL, VERCEL } = process.env;

afterEach(() => {
  process.env.STATS_DATABASE_URL = STATS_DATABASE_URL;
  process.env.VERCEL = VERCEL;
  if (STATS_DATABASE_URL === undefined) delete process.env.STATS_DATABASE_URL;
  if (VERCEL === undefined) delete process.env.VERCEL;
});

describe('getFunctionTemplateInstalls', () => {
  it('has no installs to show locally without the stats database', async () => {
    delete process.env.STATS_DATABASE_URL;
    delete process.env.VERCEL;

    await expect(getFunctionTemplateInstalls('basic')).resolves.toEqual([]);
  });

  it('refuses to build on Vercel without the stats database', async () => {
    delete process.env.STATS_DATABASE_URL;
    process.env.VERCEL = '1';

    await expect(getFunctionTemplateInstalls('basic')).rejects.toThrow(
      'STATS_DATABASE_URL is not set'
    );
  });

  it('keeps the password out of the error for a malformed connection string', async () => {
    process.env.STATS_DATABASE_URL = 'postgresql://reader:hunter2@host.invalid:badport/stats';

    const error = await getFunctionTemplateInstalls('basic').catch((e) => e);
    expect(error.message).toBe('STATS_DATABASE_URL is not a valid URL');
    expect(error.message).not.toContain('hunter2');
  });
});
