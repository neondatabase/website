// @vitest-environment node
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const quickstart = readFileSync(
  new URL('../content/docs/realtime/quickstart.md', import.meta.url),
  'utf8'
);

function section(markdown, heading) {
  const start = markdown.indexOf(`\n## ${heading}\n`);
  if (start === -1) return '';
  const end = markdown.indexOf('\n## ', start + 1);
  return markdown.slice(start, end === -1 ? undefined : end);
}

function codeBlocks(markdown) {
  return [...markdown.matchAll(/```(\w+)(?: filename="([^"]+)")?\n([\s\S]*?)```/g)].map(
    ([, lang, filename, body]) => ({ lang, filename, body })
  );
}

function imports(body) {
  return [...body.matchAll(/^import (type )?(?:(.+?) from )?"([^"]+)"/gm)].map(
    ([, typeOnly, clause = '', specifier]) => ({
      typeOnly: Boolean(typeOnly),
      names: clause
        .replace(/[{}]/g, '')
        .split(',')
        .map((name) => name.trim()),
      specifier,
    })
  );
}

const packageName = (specifier) =>
  specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/');

const setup = section(quickstart, 'Add Realtime to an existing app');
const blocks = codeBlocks(setup);
const sourceBlocks = blocks.filter(({ lang }) => lang === 'ts' || lang === 'tsx');

describe('Realtime quickstart: add Realtime to an existing app', () => {
  it('creates the Realtime server from raw SQL and the browser client', () => {
    const imported = sourceBlocks.flatMap(({ body }) => imports(body));
    const namesFrom = (specifier) =>
      imported.filter((i) => i.specifier === specifier).flatMap((i) => i.names);

    expect(namesFrom('@neon/realtime/server')).toEqual(
      expect.arrayContaining(['createRealtime', 'rawSql'])
    );
    expect(namesFrom('@neon/realtime/client')).toContain('createRealtimeClient');
    expect(namesFrom('@neon/realtime-react')).toEqual(
      expect.arrayContaining(['RealtimeProvider', 'useLiveQuery'])
    );
  });

  it('installs every package its code imports', () => {
    const installed = blocks
      .filter(({ lang }) => lang === 'bash')
      .flatMap(({ body }) => [...body.matchAll(/^npm install (.+)$/gm)])
      .flatMap(([, args]) => args.split(/\s+/).filter((arg) => !arg.startsWith('-')));
    // A Next.js app already depends on next and react, and Next.js resolves server-only itself
    const appPackages = new Set(['next', 'react', 'server-only']);
    const required = sourceBlocks
      .flatMap(({ body }) => imports(body))
      .filter(({ specifier }) => !specifier.startsWith('.') && !specifier.startsWith('@/'))
      .map(({ specifier }) => packageName(specifier))
      .filter((name) => !appPackages.has(name));

    expect(required.length).toBeGreaterThan(0);
    expect(installed).toEqual(expect.arrayContaining([...new Set(required)]));
  });

  it('keeps browser modules in Client Components and the server module out of them', () => {
    const clientOnly = new Set(['@neon/realtime/client', '@neon/realtime-react']);
    for (const { filename, body } of sourceBlocks) {
      const valueImports = imports(body).filter(({ typeOnly }) => !typeOnly);
      const isClientComponent = body.startsWith('"use client"');
      if (valueImports.some(({ specifier }) => clientOnly.has(specifier))) {
        expect(isClientComponent, `${filename} must start with "use client"`).toBe(true);
      }
      if (valueImports.some(({ specifier }) => specifier === '@neon/realtime/server')) {
        expect(isClientComponent, `${filename} must not start with "use client"`).toBe(false);
      }
    }
  });
});
