import { describe, expect, it } from 'vitest';

import { getContentRedirects } from './redirects';

describe('content redirects', () => {
  it('includes redirectFrom entries used by the human-facing Next redirects', async () => {
    const redirects = await getContentRedirects();

    expect(redirects).toContainEqual({
      source: '/docs/cli/login',
      destination: '/docs/cli/auth',
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: '/docs/cli/function',
      destination: '/docs/cli/functions',
      permanent: true,
    });
  });
});
