import { describe, expect, it } from 'vitest';

import nextConfig from './next.config';

describe('backend platform Markdown rewrites', () => {
  it('preserves the static Claimable Neon protocol at /auth.md', async () => {
    const rewrites = await nextConfig.rewrites();
    const allRewrites = Object.values(rewrites).flat();

    expect(allRewrites.some(({ source }) => source === '/auth.md')).toBe(false);
    expect(rewrites.beforeFiles).toEqual(
      expect.arrayContaining([
        { source: '/functions.md', destination: '/md/functions.md' },
        { source: '/ai-gateway.md', destination: '/md/ai-gateway.md' },
        { source: '/object-storage.md', destination: '/md/object-storage.md' },
      ])
    );
  });
});
