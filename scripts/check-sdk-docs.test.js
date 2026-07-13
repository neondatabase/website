import { describe, it, expect } from 'vitest';

import {
  splitMarkdown,
  extractCallRefs,
  extractImports,
  chainResolvesTo,
} from './check-sdk-docs.mjs';

describe('splitMarkdown', () => {
  it('separates fenced code blocks (with lang) from prose', () => {
    const md = [
      'Intro prose with `neon.projects.list()` inline.',
      '',
      '```ts',
      "const neon = createNeonClient({ apiKey: 'x' });",
      '```',
      '',
      'More prose.',
      '',
      '```bash',
      'npm install @neon/sdk',
      '```',
    ].join('\n');

    const { fenced, prose } = splitMarkdown(md);

    expect(fenced).toHaveLength(2);
    expect(fenced[0].lang).toBe('ts');
    expect(fenced[0].code).toContain('createNeonClient');
    expect(fenced[1].lang).toBe('bash');
    expect(prose).toContain('Intro prose');
    expect(prose).toContain('More prose.');
    // Fenced code must not leak into prose.
    expect(prose).not.toContain('createNeonClient');
  });
});

describe('extractCallRefs', () => {
  it('captures raw.* method names', () => {
    const { rawRefs } = extractCallRefs('await raw.createProjectBranch({ client });');
    expect([...rawRefs]).toEqual(['createProjectBranch']);
  });

  it('captures neon.* chains up to the first call', () => {
    const { neonChains } = extractCallRefs('const { data } = await neon.projects.list().all();');
    expect([...neonChains]).toEqual(['projects.list']);
  });

  it('captures nested ergonomic namespaces', () => {
    const { neonChains } = extractCallRefs('await neon.postgres.databases.create(p, b, i);');
    expect([...neonChains]).toEqual(['postgres.databases.create']);
  });

  it('ignores neon.client (the raw client handle, not a namespace)', () => {
    const { neonChains } = extractCallRefs('raw.getProject({ client: neon.client });');
    expect([...neonChains]).toHaveLength(0);
  });

  it('does not match hostnames like neon.tech', () => {
    const { neonChains } = extractCallRefs('See https://console.neon.tech/api/v2/projects');
    expect([...neonChains]).toHaveLength(0);
  });
});

describe('extractImports', () => {
  it('parses value imports from @neon/sdk', () => {
    const imports = extractImports("import { createNeonClient, raw } from '@neon/sdk';");
    expect(imports).toHaveLength(1);
    expect(imports[0].module).toBe('@neon/sdk');
    expect(imports[0].typeOnly).toBe(false);
    expect(imports[0].names.map((n) => n.name)).toEqual(['createNeonClient', 'raw']);
  });

  it('flags type-only imports so runtime validation can skip them', () => {
    const imports = extractImports("import type { Project, Branch } from '@neon/sdk';");
    expect(imports[0].typeOnly).toBe(true);
  });

  it('parses the /raw subpath and strips aliases', () => {
    const imports = extractImports("import { getProject as gp } from '@neon/sdk/raw';");
    expect(imports[0].module).toBe('@neon/sdk/raw');
    expect(imports[0].names[0].name).toBe('getProject');
  });

  it('ignores imports from other packages', () => {
    const imports = extractImports("import { createApiClient } from '@neondatabase/api-client';");
    expect(imports).toHaveLength(0);
  });
});

describe('chainResolvesTo', () => {
  const fake = {
    projects: { create: () => {}, permissions: { grant: () => {} } },
    client: {},
  };

  it('resolves a real method chain to a function', () => {
    expect(chainResolvesTo(fake, ['projects', 'create'])).toBe(true);
    expect(chainResolvesTo(fake, ['projects', 'permissions', 'grant'])).toBe(true);
  });

  it('returns false for missing methods or namespaces', () => {
    expect(chainResolvesTo(fake, ['projects', 'nope'])).toBe(false);
    expect(chainResolvesTo(fake, ['ghost', 'create'])).toBe(false);
  });

  it('returns false when the chain ends on a non-function', () => {
    expect(chainResolvesTo(fake, ['client'])).toBe(false);
  });
});
