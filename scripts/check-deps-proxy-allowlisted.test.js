// @vitest-environment node
import http from 'node:http';

import { describe, expect, it } from 'vitest';

import {
  classify,
  collectRegistryDeps,
  decideAvailability,
  fallbackTarballUrl,
  formatFailure,
  nameFromPackageKey,
  newlyIntroduced,
  probeTarball,
  tarballStatusFromHttp,
  usesTarballGate,
} from './check-deps-proxy-allowlisted.mjs';

const DAY = 24 * 60 * 60 * 1000;
const COOLDOWN = 7 * DAY;
const NOW = Date.parse('2026-08-27T12:00:00Z');

describe('nameFromPackageKey', () => {
  it('reads a nested node_modules key', () => {
    expect(nameFromPackageKey('node_modules/next')).toBe('next');
    expect(nameFromPackageKey('node_modules/@next/env')).toBe('@next/env');
    expect(nameFromPackageKey('node_modules/foo/node_modules/@scope/bar')).toBe('@scope/bar');
  });
});

describe('collectRegistryDeps / newlyIntroduced', () => {
  const lock = (packages) => ({ packages });

  it('collects public-registry versions and skips the root and links', () => {
    const map = collectRegistryDeps(
      lock({
        '': { version: '0.1.0' },
        'node_modules/next': {
          version: '16.3.3',
          resolved: 'https://registry.npmjs.org/next/-/next-16.3.3.tgz',
        },
        'node_modules/local': { version: '1.0.0', link: true },
        'node_modules/other': { version: '1.0.0', resolved: 'https://example.com/other.tgz' },
      })
    );
    expect([...map.keys()]).toEqual(['next']);
    expect([...map.get('next')]).toEqual(['16.3.3']);
  });

  it('returns only versions the head lockfile newly introduces', () => {
    const base = collectRegistryDeps(
      lock({
        'node_modules/next': {
          version: '16.1.6',
          resolved: 'https://registry.npmjs.org/next/-/next-16.1.6.tgz',
        },
      })
    );
    const head = collectRegistryDeps(
      lock({
        'node_modules/next': {
          version: '16.3.3',
          resolved: 'https://registry.npmjs.org/next/-/next-16.3.3.tgz',
        },
        'node_modules/left-pad': {
          version: '1.3.0',
          resolved: 'https://registry.npmjs.org/left-pad/-/left-pad-1.3.0.tgz',
        },
      })
    );
    expect(newlyIntroduced(head, base)).toEqual([
      { name: 'next', version: '16.3.3' },
      { name: 'left-pad', version: '1.3.0' },
    ]);
  });
});

describe('classify', () => {
  it('marks a version inside the cooldown as immature', () => {
    const time = { '16.3.3': '2026-08-25T00:00:00Z' };
    expect(classify({ name: 'next', version: '16.3.3' }, time, NOW, COOLDOWN)).toMatchObject({
      status: 'immature',
      ageDays: 2.5,
    });
  });

  it('marks a missing publish time as unknown', () => {
    expect(classify({ name: 'next', version: '16.3.3' }, {}, NOW, COOLDOWN).status).toBe('unknown');
  });

  it('marks a version older than the cooldown as ok', () => {
    const time = { '16.1.6': '2026-01-01T00:00:00Z' };
    expect(classify({ name: 'next', version: '16.1.6' }, time, NOW, COOLDOWN).status).toBe('ok');
  });
});

describe('fallbackTarballUrl', () => {
  const registry = 'https://databricks.jfrog.io/artifactory/api/npm/db-npm/';

  it('builds unscoped and scoped tarball URLs', () => {
    expect(fallbackTarballUrl(registry, 'next', '16.3.3')).toBe(
      `${registry}next/-/next-16.3.3.tgz`
    );
    expect(fallbackTarballUrl(registry, '@next/env', '16.3.3')).toBe(
      `${registry}@next%2Fenv/-/env-16.3.3.tgz`
    );
  });
});

describe('tarballStatusFromHttp', () => {
  it('treats success and partial-content as available', () => {
    expect(tarballStatusFromHttp(200)).toBe('ok');
    expect(tarballStatusFromHttp(206)).toBe('ok');
  });

  it('treats auth and missing as blocked', () => {
    expect(tarballStatusFromHttp(403)).toBe('blocked');
    expect(tarballStatusFromHttp(401)).toBe('blocked');
    expect(tarballStatusFromHttp(404)).toBe('blocked');
  });
});

describe('decideAvailability', () => {
  it('on JFrog, a 403 fails even when the packument age would pass or an allowlist would skip', () => {
    expect(
      decideAvailability({ tarballStatus: 'blocked', ageStatus: 'ok', useTarballGate: true })
    ).toBe('blocked');
    expect(
      decideAvailability({
        tarballStatus: 'blocked',
        ageStatus: 'immature',
        useTarballGate: true,
      })
    ).toBe('blocked');
  });

  it('on JFrog, a served tarball passes even when the packument has no publish time', () => {
    expect(
      decideAvailability({ tarballStatus: 'ok', ageStatus: 'unknown', useTarballGate: true })
    ).toBe('ok');
  });

  it('on public npm, age is the gate because new tarballs are served', () => {
    expect(
      decideAvailability({
        tarballStatus: 'ok',
        ageStatus: 'immature',
        useTarballGate: false,
      })
    ).toBe('immature');
    expect(
      decideAvailability({ tarballStatus: 'ok', ageStatus: 'ok', useTarballGate: false })
    ).toBe('ok');
  });
});

describe('usesTarballGate', () => {
  it('is true for the Databricks JFrog npm API and false for public npm', () => {
    expect(usesTarballGate('https://databricks.jfrog.io/artifactory/api/npm/db-npm/')).toBe(true);
    expect(usesTarballGate('https://registry.npmjs.org/')).toBe(false);
  });
});

describe('formatFailure', () => {
  it('does not claim a fork age check contacted the proxy', () => {
    expect(
      formatFailure({ name: 'next', version: '16.3.3', status: 'immature', ageDays: 2 }, 7)
    ).toBe(
      '  ✗ next@16.3.3 — published 2.0d ago (< 7d cooldown); too new for the Databricks npm mirror.'
    );
  });

  it('names a 403 when the tarball probe is the signal', () => {
    expect(
      formatFailure({ name: 'next', version: '16.3.3', status: 'blocked', ageDays: 2 }, 7)
    ).toBe('  ✗ next@16.3.3 — proxy returned 403; published 2.0d ago (< 7d cooldown).');
  });
});

describe('probeTarball', () => {
  it('returns after status when the server ignores Range and streams a large body', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': 50 * 1024 * 1024,
      });
      const chunk = Buffer.alloc(64 * 1024, 0x78);
      const write = () => {
        if (!res.writableEnded && res.writable) res.write(chunk);
      };
      write();
      const timer = setInterval(write, 20);
      const stop = () => clearInterval(timer);
      req.on('close', stop);
      res.on('close', stop);
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    const { port } = server.address();
    const started = Date.now();
    try {
      const status = await probeTarball(`http://127.0.0.1:${port}/next-16.3.3.tgz`, {});
      expect(status).toBe('ok');
      expect(Date.now() - started).toBeLessThan(2000);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
