import { describe, expect, it } from 'vitest';

import getNofollowRel from './get-nofollow-rel';

describe('getNofollowRel', () => {
  it.each([
    'https://supabase.com/pricing',
    'https://supabase.com/docs/guides/platform/backups#point-in-time-recovery',
    'https://supabase.com',
    'http://www.supabase.io/docs',
    'https://your-project.supabase.co',
    'https://github.com/supabase/pg_jsonschema',
    'https://www.github.com/supabase',
    'https://github.com/supabase-community/postgres-js',
    '//supabase.com/docs',
    'https://planetscale.com/docs/concepts/branching',
    'https://app.planetscale.com',
    'https://github.com/planetscale/vitess',
  ])('adds nofollow for %s', (href) => {
    expect(getNofollowRel(href)).toBe('noopener noreferrer nofollow');
  });

  it('keeps existing rel tokens without duplicating nofollow', () => {
    expect(getNofollowRel('https://supabase.com', 'nofollow noopener noreferrer')).toBe(
      'nofollow noopener noreferrer'
    );
    expect(getNofollowRel('https://supabase.com', 'sponsored')).toBe('sponsored nofollow');
  });

  it.each([
    undefined,
    '/docs/introduction',
    '#supabase',
    'https://neon.com/docs/import/migrate-from-supabase',
    'https://notsupabase.com',
    'https://neon.com/docs/import/migrate-from-planetscale',
    'https://planetscale.com.example.com',
    'https://supabase.com.example.com',
    'https://github.com/supabase-communityfork/repo',
    'https://github.com/neondatabase/neon',
  ])('leaves %s unchanged', (href) => {
    expect(getNofollowRel(href, 'noopener noreferrer')).toBeUndefined();
  });
});
