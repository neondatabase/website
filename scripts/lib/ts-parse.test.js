import { describe, it, expect } from 'vitest';

import {
  parseTs,
  walk,
  findNamedFunctions,
  findReceiverCalls,
  findKnownFnCalls,
  getStringProperty,
  getIdentifierProperty,
  getCallChain,
  readStringLike,
  ts,
} from './ts-parse.mjs';

// These tests pin the AST helpers that scripts/build-coverage-data.mjs uses
// to parse upstream neonctl + mcp-server-neon source. The previous regex /
// brace-counting parser had silent bugs on at least four input shapes:
//
//   - template literals (`${x}`)            — `${` flipped the brace counter
//   - regex bodies (/{/, /}/)               — same
//   - strings containing braces ("{")        — same
//   - templates with embedded escaped backticks  — terminated the template
//                                              capture prematurely
//
// Each test below uses a synthetic snippet that would have miscounted under
// the legacy parser. They serve as a tripwire: if the TS compiler API ever
// changes its AST shape (extremely unlikely) we catch it before it ships.

// Small helper: find the first ObjectLiteralExpression in a source file.
function firstObjectLiteral(src) {
  const sf = parseTs(src);
  let found = null;
  walk(sf, (n) => {
    if (found) return false;
    if (ts.isObjectLiteralExpression(n)) found = n;
  });
  return found;
}

// Small helper: find a variable's initializer by name.
function initializerOf(src, name) {
  const sf = parseTs(src);
  let init = null;
  walk(sf, (n) => {
    if (init) return false;
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name) {
      init = n.initializer;
    }
  });
  return init;
}

// ── findReceiverCalls ──────────────────────────────────────────────────────

describe('findReceiverCalls', () => {
  it('captures apiClient.X regardless of receiver depth', () => {
    const src = `
      const x = async (props) => {
        await apiClient.foo();          // direct identifier
        await props.apiClient.bar();    // one level deep
        await this.apiClient.baz();     // this-based
      };
    `;
    const [{ body }] = findNamedFunctions(parseTs(src));
    expect(findReceiverCalls(body, (id) => id === 'apiClient')).toEqual(['foo', 'bar', 'baz']);
  });

  it('skips typeof apiClient.X in type annotations', () => {
    const src = `
      const x = async (props: { fn: typeof apiClient.real }) => {
        await apiClient.actual();
      };
    `;
    const [{ body }] = findNamedFunctions(parseTs(src));
    expect(findReceiverCalls(body, (id) => id === 'apiClient')).toEqual(['actual']);
  });
});

// ── findKnownFnCalls ───────────────────────────────────────────────────────

describe('findKnownFnCalls', () => {
  it('handles braces inside strings, regex, and templates without losing scope', () => {
    // The legacy line-scan parser counted braces from strings/regex/templates,
    // causing it to think `main` ended before reaching the helper calls.
    const src = `
      const helperA = async () => {};
      const helperB = async () => {};
      const main = async () => {
        const tmpl = \`{not a real brace} \${other}\`;
        const re = /\\{not\\}/g;
        const s = "}{}{";
        await helperA();
        await helperB();
      };
    `;
    const main = findNamedFunctions(parseTs(src)).find((f) => f.name === 'main');
    expect(main).toBeTruthy();
    const called = findKnownFnCalls(main.body, new Set(['helperA', 'helperB']));
    expect(called.sort()).toEqual(['helperA', 'helperB']);
  });

  it('excludes the function being defined (when excludeName is set)', () => {
    const src = `
      const self = async () => { await other(); };
      const other = async () => {};
    `;
    const self = findNamedFunctions(parseTs(src)).find((f) => f.name === 'self');
    expect(findKnownFnCalls(self.body, new Set(['self', 'other']), 'self')).toEqual(['other']);
  });
});

// ── findNamedFunctions ─────────────────────────────────────────────────────

describe('findNamedFunctions', () => {
  it('finds all 3 shapes: function decl, const+arrow, const+function expression', () => {
    const src = `
      function alpha() {}
      const beta = async () => {};
      const gamma = function () {};
      const notAFn = 42;
    `;
    expect(
      findNamedFunctions(parseTs(src))
        .map((f) => f.name)
        .sort()
    ).toEqual(['alpha', 'beta', 'gamma']);
  });
});

// ── getStringProperty ──────────────────────────────────────────────────────

describe('getStringProperty', () => {
  it('reads StringLiteral, NoSubstitutionTemplateLiteral, and TemplateExpression', () => {
    const obj = firstObjectLiteral(`
      const o = {
        a: 'simple',
        b: "double",
        c: \`tmpl\`,
        d: \`with \${x} inside\`,
      };
    `);
    expect(getStringProperty(obj, 'a')).toBe('simple');
    expect(getStringProperty(obj, 'b')).toBe('double');
    expect(getStringProperty(obj, 'c')).toBe('tmpl');
    // Template substitution slots dropped, static parts joined.
    expect(getStringProperty(obj, 'd')).toBe('with  inside');
  });

  it('returns null for missing keys', () => {
    const obj = firstObjectLiteral(`const o = { a: 'x' };`);
    expect(getStringProperty(obj, 'missing')).toBeNull();
  });

  it('unwraps `as const` assertion', () => {
    const obj = firstObjectLiteral(`const o = { name: 'foo' as const };`);
    expect(getStringProperty(obj, 'name')).toBe('foo');
  });

  it('captures full content past embedded escaped backticks (legacy regex bug)', () => {
    // The old regex `/\`([^\`]*)\`/` terminated the template capture at the
    // first inner backtick, silently truncating descriptions that used
    // \`code\` for inline-code formatting. AST sees the full template body.
    const obj = firstObjectLiteral('const o = { description: `prefix \\`code\\` suffix` };');
    expect(getStringProperty(obj, 'description')).toBe('prefix `code` suffix');
  });
});

// ── getIdentifierProperty ──────────────────────────────────────────────────

describe('getIdentifierProperty', () => {
  it('returns identifier name for `key: ident`, null for literals', () => {
    const obj = firstObjectLiteral(`const o = { schema: xyzSchema, lit: 42, str: 'x' };`);
    expect(getIdentifierProperty(obj, 'schema')).toBe('xyzSchema');
    expect(getIdentifierProperty(obj, 'lit')).toBeNull();
    expect(getIdentifierProperty(obj, 'str')).toBeNull();
  });
});

// ── getCallChain ───────────────────────────────────────────────────────────

describe('getCallChain', () => {
  it('returns chain in source order (innermost first)', () => {
    const init = initializerOf(`const x = z.string().optional().describe('hello');`, 'x');
    const chain = getCallChain(init);
    expect(chain.map((c) => c.method)).toEqual(['string', 'optional', 'describe']);
    expect(readStringLike(chain[2].args[0])).toBe('hello');
  });

  it('returns [] for non-call inputs', () => {
    const init = initializerOf(`const x = 42;`, 'x');
    expect(getCallChain(init)).toEqual([]);
  });
});

// ── readStringLike ─────────────────────────────────────────────────────────

describe('readStringLike', () => {
  it('reads simple string, simple template, and template with substitution', () => {
    const cases = [
      { src: `const x = 'foo';`, expected: 'foo' },
      { src: 'const x = `bar`;', expected: 'bar' },
      { src: 'const x = `pre ${y} post`;', expected: 'pre  post' },
    ];
    for (const { src, expected } of cases) {
      expect(readStringLike(initializerOf(src, 'x'))).toBe(expected);
    }
  });
});
