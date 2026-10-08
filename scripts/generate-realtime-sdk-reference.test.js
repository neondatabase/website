import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

import {
  REPO_ROOT,
  buildSymbolIndex,
  declarationSignature,
  declaredAnchorIds,
  generatePages,
  kindLabel,
  renderModulePartial,
  renderType,
  slugify,
} from './generate-realtime-sdk-reference.mjs';

const EXPECTED_PATHS = [
  'content/docs/shared-content/realtime-sdk-backend.md',
  'content/docs/shared-content/realtime-sdk-client.md',
  'content/docs/shared-content/realtime-sdk-react.md',
  'content/docs/shared-content/realtime-sdk-tanstack-db.md',
  'content/docs/shared-content/realtime-sdk-drizzle.md',
  'content/docs/shared-content/realtime-sdk-drizzle-client.md',
  'content/docs/shared-content/realtime-sdk-kysely.md',
];

const artifact = JSON.parse(
  readFileSync(resolve(REPO_ROOT, 'vendor/realtime/sdk-docs.json'), 'utf8')
);

const moduleByName = new Map(artifact.children.map((module) => [module.name, module]));

// Export names in the generated order: functions first, then types.
const KIND_FUNCTION = 64;
function exportOrder(module) {
  const byId = new Map((module.children ?? []).map((child) => [child.id, child]));
  const functions = [];
  const types = [];
  for (const group of module.groups ?? []) {
    if (group.title === 'Documents') continue;
    for (const id of group.children ?? []) {
      const child = byId.get(id);
      if (!child) continue;
      if (child.kind === KIND_FUNCTION) {
        functions.push(child.name);
      } else {
        types.push(child.name);
      }
    }
  }
  return [...functions, ...types];
}

// Heading text with the explicit `(#id)` anchor suffix removed.
function stripAnchor(text) {
  return text.replace(/\s*\(#[^)]+\)$/, '');
}

function headings(markdown, level) {
  const prefix = `${'#'.repeat(level)} `;
  return markdown
    .split('\n')
    .filter((line) => line.startsWith(prefix))
    .map((line) => stripAnchor(line.slice(prefix.length).trim()));
}

function fencedBodies(markdown) {
  return [...markdown.matchAll(/^```[a-z]*\n([\s\S]*?)^```$/gm)].map((match) => match[1]);
}

function exampleBodies(node, found = []) {
  if (Array.isArray(node)) {
    node.forEach((child) => exampleBodies(child, found));
    return found;
  }
  if (!node || typeof node !== 'object') return found;
  for (const tag of node.blockTags ?? []) {
    if (tag.tag !== '@example') continue;
    for (const part of tag.content ?? []) {
      const body = part.text.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      found.push(body);
    }
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') exampleBodies(value, found);
  }
  return found;
}

describe('generateRealtimeSdkReference', () => {
  let pages;
  let byPath;

  beforeAll(async () => {
    pages = await generatePages();
    byPath = new Map(pages.map((page) => [page.path, page.contents]));
  });

  it('emits exactly the expected paths, in module order', () => {
    expect(pages.map((page) => page.path)).toEqual(EXPECTED_PATHS);
  });

  it('gives every partial no frontmatter and starts with the import specifier', () => {
    for (const [modulePath, contents] of byPath) {
      // The banner is now removed from the partial body to avoid appearing multiple
      // times on the rendered SDK reference page. The maintenance note is in the generator.
      expect(contents.startsWith('**Import specifier**'), modulePath).toBe(true);
      expect(/^---\n/.test(contents), modulePath).toBe(false);
    }
  });

  it('never writes an h1 or h2 in any partial', () => {
    for (const contents of byPath.values()) {
      expect(headings(contents, 1)).toEqual([]);
      expect(headings(contents, 2)).toEqual([]);
    }
  });

  it('orders every partial with functions first, then types and interfaces', () => {
    const pairs = [
      ['Backend', 'content/docs/shared-content/realtime-sdk-backend.md'],
      ['Client', 'content/docs/shared-content/realtime-sdk-client.md'],
      ['React', 'content/docs/shared-content/realtime-sdk-react.md'],
      ['TanStack DB', 'content/docs/shared-content/realtime-sdk-tanstack-db.md'],
      ['Drizzle', 'content/docs/shared-content/realtime-sdk-drizzle.md'],
    ];
    for (const [moduleName, modulePath] of pairs) {
      const h3Headings = headings(byPath.get(modulePath), 3);
      // The "Symbols" heading is the first generated h3
      expect(h3Headings[0], modulePath).toBe('Symbols');
      // The export names follow, in functions-first order
      expect(h3Headings.slice(1), modulePath).toEqual(exportOrder(moduleByName.get(moduleName)));
    }
  });

  it('renames the destructured parameter TypeDoc calls __namedParameters', () => {
    for (const [modulePath, contents] of byPath) {
      expect(contents.includes('__namedParameters'), modulePath).toBe(false);
    }
    expect(byPath.get('content/docs/shared-content/realtime-sdk-react.md')).toContain(
      'props: RealtimeProviderProps'
    );
  });

  it('renders the useLiveQuery options default', () => {
    expect(byPath.get('content/docs/shared-content/realtime-sdk-react.md')).toContain(
      'options: UseLiveQueryOptions<Row> = {}'
    );
  });

  it('puts every @example body inside a fenced block', () => {
    const pairs = [
      ['Backend', 'content/docs/shared-content/realtime-sdk-backend.md'],
      ['Client', 'content/docs/shared-content/realtime-sdk-client.md'],
      ['React', 'content/docs/shared-content/realtime-sdk-react.md'],
      ['TanStack DB', 'content/docs/shared-content/realtime-sdk-tanstack-db.md'],
      ['Drizzle', 'content/docs/shared-content/realtime-sdk-drizzle.md'],
    ];
    let total = 0;
    for (const [moduleName, modulePath] of pairs) {
      const fences = fencedBodies(byPath.get(modulePath));
      for (const body of exampleBodies(moduleByName.get(moduleName))) {
        total += 1;
        expect(
          fences.some((fence) => fence.includes(body)),
          `${modulePath}: ${body.split('\n')[0]}`
        ).toBe(true);
      }
    }
    expect(total).toBeGreaterThan(0);
  });

  it('is byte-identical across runs', async () => {
    const again = await generatePages();
    expect(again.map((page) => `${page.path}\n${page.contents}`)).toEqual(
      pages.map((page) => `${page.path}\n${page.contents}`)
    );
  });
});

// ---------------------------------------------------------------------------
// Deterministic anchor ids
// ---------------------------------------------------------------------------

// Every `](#id)` target written on the page, ignoring cross-page links.
function downPageLinks(markdown) {
  return [...markdown.matchAll(/\]\(#([^)]+)\)/g)].map((match) => match[1]);
}

describe('anchor ids', () => {
  let byPath;

  beforeAll(async () => {
    byPath = new Map((await generatePages()).map((page) => [page.path, page.contents]));
  });

  it('declares an explicit anchor id on every heading it emits', () => {
    for (const [modulePath, contents] of byPath) {
      const undeclared = contents
        .split('\n')
        .filter((line) => /^#{3,5} /.test(line))
        .filter((line) => !/ \(#[a-z0-9-]+\)$/.test(line));
      expect(undeclared, modulePath).toEqual([]);
    }
  });

  it('resolves every down-page link to an id the same partial declares', () => {
    for (const [modulePath, contents] of byPath) {
      const declared = new Set(declaredAnchorIds(contents));
      for (const target of downPageLinks(contents)) {
        expect(declared.has(target), `${modulePath}: #${target}`).toBe(true);
      }
    }
  });

  it('keeps every declared anchor id unique across all partials', () => {
    const allIds = [];
    for (const contents of byPath.values()) {
      allIds.push(...declaredAnchorIds(contents));
    }
    expect(allIds.length).toBeGreaterThan(0);
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('prefixes every export anchor id with its module slug', () => {
    const CLIENT_PAGE = 'content/docs/shared-content/realtime-sdk-client.md';
    const client = byPath.get(CLIENT_PAGE);
    for (const name of ['RealtimeClient', 'createRealtimeClient', 'LiveQueryState']) {
      expect(client, name).toContain(`### ${name} (#client-${slugify(name)})`);
      expect(client, name).toContain(`](#client-${slugify(name)})`);
    }
    expect(client).toContain(
      '#### MaterializedLiveQuerySubscription.onChange (#client-materializedlivequerysubscriptiononchange)'
    );
    expect(client).toContain('#### Members (#client-realtimeclient-members)');
    expect(client).toContain('#### Parameters (#client-createrealtimeclient-parameters)');
  });

  it('declares the Symbols heading as an h3 with module-prefixed anchor', () => {
    for (const [modulePath, contents] of byPath) {
      const slug = modulePath.replace(/^.*\/realtime-sdk-/, '').replace(/\.md$/, '');
      expect(contents, modulePath).toContain(`### Symbols (#${slug}-symbols)`);
    }
  });

  it('emits Import specifier as a labelled line, not a heading', () => {
    for (const [modulePath, contents] of byPath) {
      expect(contents, modulePath).toContain('**Import specifier** `');
      expect(contents, modulePath).not.toContain('## Import specifier');
      expect(contents, modulePath).not.toContain('### Import specifier');
    }
  });
});

// ---------------------------------------------------------------------------
// Module order enforcement
// ---------------------------------------------------------------------------

describe('module order enforcement', () => {
  it('throws when a module in the artifact is missing from modules', async () => {
    const manifest = {
      // Missing TanStack DB and the rest
      modules: [
        { name: 'Backend', importSpecifier: '@neon/realtime/server' },
        { name: 'Client', importSpecifier: '@neon/realtime/client' },
        { name: 'React', importSpecifier: '@neon/realtime-react' },
      ],
    };
    await expect(generatePages({ manifest })).rejects.toThrow(
      /is in the artifact but not in modules/
    );
  });

  it('throws when modules names a module not in the artifact', async () => {
    const manifest = {
      modules: [
        { name: 'Backend', importSpecifier: '@neon/realtime/server' },
        { name: 'Client', importSpecifier: '@neon/realtime/client' },
        { name: 'React', importSpecifier: '@neon/realtime-react' },
        { name: 'TanStack DB', importSpecifier: '@neon/realtime-tanstack' },
        { name: 'Nonexistent', importSpecifier: '@neon/nonexistent' },
      ],
    };
    await expect(generatePages({ manifest })).rejects.toThrow(
      /in modules, but the artifact has no such module/
    );
  });

  it('generates partials in modules order', async () => {
    const pages = await generatePages();
    expect(pages.map((p) => p.path)).toEqual(EXPECTED_PATHS);
  });
});

// ---------------------------------------------------------------------------
// Function ordering
// ---------------------------------------------------------------------------

describe('function ordering', () => {
  let byPath;

  beforeAll(async () => {
    byPath = new Map((await generatePages()).map((page) => [page.path, page.contents]));
  });

  it('places functions before types and interfaces in every module', () => {
    const pairs = [
      ['Backend', 'content/docs/shared-content/realtime-sdk-backend.md'],
      ['Client', 'content/docs/shared-content/realtime-sdk-client.md'],
      ['React', 'content/docs/shared-content/realtime-sdk-react.md'],
      ['TanStack DB', 'content/docs/shared-content/realtime-sdk-tanstack-db.md'],
      ['Drizzle', 'content/docs/shared-content/realtime-sdk-drizzle.md'],
    ];
    for (const [moduleName, modulePath] of pairs) {
      const exports = exportOrder(moduleByName.get(moduleName));
      const h3Headings = headings(byPath.get(modulePath), 3);
      const generatedHeadings = h3Headings.slice(1); // Skip "Symbols"
      expect(generatedHeadings).toEqual(exports);
    }
  });
});

// ---------------------------------------------------------------------------
// Declaration kinds and type variants
// ---------------------------------------------------------------------------

const intrinsic = (name) => ({ type: 'intrinsic', name });
const reference = (name) => ({ type: 'reference', name });
const functionType = (returns) => ({
  type: 'reflection',
  declaration: { signatures: [{ parameters: [], type: returns }] },
});

describe('declaration kinds', () => {
  it('labels classes and variables in the Symbols table', () => {
    expect(kindLabel({ kind: 128, name: 'Controller' })).toBe('Class');
    expect(kindLabel({ kind: 32, name: 'helpers' })).toBe('Variable');
  });

  it('renders a class signature with its type parameters and heritage', () => {
    const child = {
      kind: 128,
      name: 'Controller',
      typeParameters: [{ name: 'Row' }],
      extendedTypes: [reference('Base')],
      implementedTypes: [reference('Disposable')],
    };
    expect(declarationSignature(child)).toBe(
      'class Controller<Row> extends Base implements Disposable'
    );
  });

  it('renders a variable signature from its declared type', () => {
    const constant = { kind: 32, name: 'helpers', flags: { isConst: true }, type: reference('H') };
    expect(declarationSignature(constant)).toBe('const helpers: H');
    expect(declarationSignature({ ...constant, flags: {} })).toBe('let helpers: H');
  });

  it('fails loudly on a kind it does not know', () => {
    const namespace = { kind: 4, name: 'Internals' };
    expect(() => kindLabel(namespace)).toThrow(/Unsupported TypeDoc kind 4/);
    expect(() => declarationSignature(namespace)).toThrow(/Unsupported TypeDoc kind 4/);
  });
});

describe('renderType', () => {
  it('renders a conditional type', () => {
    const conditional = {
      type: 'conditional',
      checkType: reference('T'),
      extendsType: intrinsic('string'),
      trueType: reference('A'),
      falseType: reference('B'),
    };
    expect(renderType(conditional)).toBe('T extends string ? A : B');
    expect(renderType({ type: 'array', elementType: conditional })).toBe(
      '(T extends string ? A : B)[]'
    );
  });

  it('parenthesizes a function type inside a union', () => {
    const union = {
      type: 'union',
      types: [functionType(intrinsic('void')), intrinsic('undefined')],
    };
    expect(renderType(union)).toBe('(() => void) | undefined');
  });

  it('renders type predicates in TypeDoc 0.28 shape', () => {
    expect(
      renderType({ type: 'predicate', name: 'value', asserts: false, targetType: reference('Foo') })
    ).toBe('value is Foo');
    expect(renderType({ type: 'predicate', name: 'value', asserts: true })).toBe('asserts value');
    expect(
      renderType({ type: 'predicate', name: 'value', asserts: true, targetType: reference('Foo') })
    ).toBe('asserts value is Foo');
  });

  it('keeps typeof on a type query', () => {
    expect(renderType({ type: 'query', queryType: reference('x') })).toBe('typeof x');
  });

  it('fails loudly on a type variant it does not know', () => {
    expect(() => renderType({ type: 'templateLiteral' })).toThrow(
      /Unsupported TypeDoc type variant/
    );
  });
});

describe('table cells', () => {
  it('escapes the pipes in a union type so the row keeps its columns', () => {
    const moduleEntry = {
      name: 'Fixture',
      children: [
        {
          id: 1,
          kind: 256,
          name: 'Options',
          children: [
            {
              id: 2,
              kind: 1024,
              name: 'value',
              flags: {},
              type: { type: 'union', types: [intrinsic('string'), intrinsic('null')] },
            },
          ],
        },
      ],
      groups: [{ title: 'Interfaces', children: [1] }],
    };
    const artifact = { children: [moduleEntry] };
    const markdown = renderModulePartial(moduleEntry, 'fixture', buildSymbolIndex(artifact));
    const row = markdown.split('\n').find((line) => line.startsWith('| `value`'));
    expect(row).toBe('| `value` | `string \\| null` |  |');
  });
});

describe('vendored artifact', () => {
  it('carries no source locations or local paths', () => {
    const forbidden = new Set(['sources', 'symbolIdMap', 'files', 'readme', 'documents']);
    const found = [];
    const walk = (node, path) => {
      if (Array.isArray(node)) {
        node.forEach((item, i) => walk(item, `${path}[${i}]`));
      } else if (node && typeof node === 'object') {
        for (const [key, value] of Object.entries(node)) {
          if (forbidden.has(key)) found.push(`${path}.${key}`);
          walk(value, `${path}.${key}`);
        }
      }
    };
    walk(artifact, '$');
    expect(found).toEqual([]);
    expect(JSON.stringify(artifact)).not.toMatch(/"\/(Users|home|private|tmp|var)\//);
  });
});
