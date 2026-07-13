// Tiny TypeScript AST helpers, used by scripts/build-coverage-data.mjs to
// parse the upstream neonctl and mcp-server-neon source files without the
// fragility of brace-counting regex parsers (which mishandle template
// literals, regex bodies, JSX, and string contents).
//
// Built on the `typescript` compiler API (already a transitive devDep via
// next/eslint, so no new deps). The compiler API is verbose; this module
// wraps the few primitives we need.

import ts from 'typescript';

// Parse a TypeScript source string into a ts.SourceFile node.
export function parseTs(src, fileName = 'in.ts') {
  return ts.createSourceFile(fileName, src, ts.ScriptTarget.Latest, /* setParentNodes */ true);
}

// Recursive visitor. `visit(node)` is called on every node; return `false`
// to stop descending into that subtree.
export function walk(node, visit) {
  const cont = visit(node);
  if (cont === false) return;
  ts.forEachChild(node, (child) => walk(child, visit));
}

// Extract the bare name of a function/method/arrow declaration.
//   function foo() {}                       → 'foo'
//   const foo = async (...) => ...          → 'foo'
//   const foo = function() {}               → 'foo'
//   export function foo() {}                → 'foo'
//   export const foo = ...                  → 'foo'
//   anonymous expressions / methods         → null
export function getFunctionName(node) {
  if (ts.isFunctionDeclaration(node) && node.name) return node.name.text;
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
    const init = node.initializer;
    if (!init) return null;
    if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) return node.name.text;
  }
  return null;
}

// Yield every function-like declaration in the source as { name, body }.
// `body` is the AST node — usually a Block; can be an arrow's expression
// body. Anonymous functions are skipped.
export function findNamedFunctions(srcFile) {
  const results = [];
  walk(srcFile, (node) => {
    const name = getFunctionName(node);
    if (!name) return;
    let body = null;
    if (ts.isFunctionDeclaration(node)) body = node.body;
    else if (ts.isVariableDeclaration(node)) {
      const init = node.initializer;
      body = init?.body ?? null;
    }
    if (body) results.push({ name, body });
  });
  return results;
}

// Find every property access in a subtree whose immediate receiver name
// matches the predicate. Returns the method names. Matches both:
//   apiClient.createProject(...)             (direct identifier)
//   props.apiClient.createProject(...)       (nested under another property)
// The matcher only inspects the immediate receiver name (here: 'apiClient'),
// not the chain that leads to it.
//
// Skips occurrences inside `typeof` expressions so that type annotations
// like `typeof apiClient.foo` don't get counted as real calls.
export function findReceiverCalls(node, receiverMatches) {
  const methods = [];
  walk(node, (n) => {
    if (ts.isTypeOfExpression(n)) return false;
    if (!ts.isPropertyAccessExpression(n) || !ts.isIdentifier(n.name)) return;
    const receiverName = ts.isIdentifier(n.expression)
      ? n.expression.text
      : ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.name)
        ? n.expression.name.text
        : null;
    if (receiverName && receiverMatches(receiverName)) {
      methods.push(n.name.text);
    }
  });
  return methods;
}

// Find every call expression in a subtree where the callee is one of the
// listed function names (a "known fn"). Returns the set of called names.
// Skips occurrences inside `typeof` expressions and function declarations
// of the same name (the function defining itself isn't a call).
export function findKnownFnCalls(node, knownFns, excludeName = null) {
  const called = new Set();
  walk(node, (n) => {
    if (ts.isTypeOfExpression(n)) return false;
    if (ts.isFunctionDeclaration(n) && n.name && knownFns.has(n.name.text)) {
      // Skip the function's own declaration node from being counted as a call
      return;
    }
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression)) {
      const callee = n.expression.text;
      if (knownFns.has(callee) && callee !== excludeName) called.add(callee);
    }
  });
  return [...called];
}

// Extract the string-like value of a property on an object literal.
// Returns null when the key is missing or the value isn't a string. Template
// literals with substitutions are flattened to their static parts (the
// substitution slots are dropped) — matches the legacy regex parser, which
// treated template-literal descriptions as plain strings.
//   { name: 'foo' as const }                → 'foo'
//   { description: "multi\nline" }           → 'multi\nline'
//   { description: `tmpl ${x} text` }        → 'tmpl  text'
export function getStringProperty(objLit, key) {
  if (!ts.isObjectLiteralExpression(objLit)) return null;
  for (const prop of objLit.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name;
    const nameText = ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;
    if (nameText !== key) continue;

    let value = prop.initializer;
    // Unwrap `'x' as const` and similar type assertions.
    if (ts.isAsExpression(value) || ts.isTypeAssertionExpression?.(value)) {
      value = value.expression;
    }
    return readStringLike(value);
  }
  return null;
}

// Extract the identifier name of a property on an object literal that
// references some other binding. Useful for `inputSchema: xyzInputSchema`.
//   { inputSchema: xyzInputSchema } → 'xyzInputSchema'
export function getIdentifierProperty(objLit, key) {
  if (!ts.isObjectLiteralExpression(objLit)) return null;
  for (const prop of objLit.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name;
    const nameText = ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;
    if (nameText !== key) continue;
    if (ts.isIdentifier(prop.initializer)) return prop.initializer.text;
    return null;
  }
  return null;
}

// Walk a chained method-call expression (e.g. `z.string().optional().describe('x')`)
// from the *root* outward and return the chain as an array of {method, args}.
// The leaf (here `z.string()`) appears first; the outermost call last.
// Returns [] when `node` isn't a CallExpression on a PropertyAccessExpression.
//
// For `z.string().optional()` returns: [{method:'string', args:[]}, {method:'optional', args:[]}]
export function getCallChain(node) {
  const chain = [];
  let cur = node;
  while (cur && ts.isCallExpression(cur) && ts.isPropertyAccessExpression(cur.expression)) {
    chain.unshift({ method: cur.expression.name.text, args: cur.arguments });
    cur = cur.expression.expression;
  }
  return chain;
}

// Decode a string/template-literal-or-tagged-template node into its source
// text. Template literals with substitutions are joined with their static
// parts only (substitutions are dropped). This matches how the previous
// regex flattened template literals into one-liners before extracting.
export function readStringLike(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    let out = node.head.text;
    for (const span of node.templateSpans) out += span.literal.text;
    return out;
  }
  return null;
}

// Re-export the underlying ts namespace so callers can do narrow lookups
// without importing typescript directly.
export { ts };
