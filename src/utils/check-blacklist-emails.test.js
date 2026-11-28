import { describe, expect, it } from 'vitest';

import { checkBlacklistEmails } from './check-blacklist-emails';

describe('checkBlacklistEmails', () => {
  it('rejects blocked domains from the default list', () => {
    const { test } = checkBlacklistEmails({ validation: { useDefaultBlockList: true } });

    expect(test('jane@gmail.com')).toBe(false);
    expect(test('jane@neon.tech')).toBe(true);
  });

  it.each(['jane@Gmail.com', 'jane@GMAIL.COM', 'Jane@GMail.Com'])(
    'rejects %s regardless of domain case',
    (email) => {
      const { test } = checkBlacklistEmails({ validation: { useDefaultBlockList: true } });

      expect(test(email)).toBe(false);
    }
  );

  it('matches custom domains regardless of case', () => {
    const { test } = checkBlacklistEmails({ validation: { data: 'Example.com, other.org' } });

    expect(test('jane@example.com')).toBe(false);
    expect(test('jane@OTHER.org')).toBe(false);
    expect(test('jane@neon.tech')).toBe(true);
  });

  it('does not leak custom domains into the default list used by other forms', () => {
    checkBlacklistEmails({ validation: { useDefaultBlockList: true, data: 'acme.com' } });
    const { test } = checkBlacklistEmails({ validation: { useDefaultBlockList: true } });

    expect(test('jane@acme.com')).toBe(true);
  });
});
