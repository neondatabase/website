// Parses the neonctl TypeScript source and emits `schema.json`: an
// authoritative description of every command, subcommand, option, alias,
// and choice list.
//
// We use this instead of parsing `neonctl … --help` output because yargs
// help has known bugs (`neonctl roles create --help` falls back to the
// parent's help; `vpc endpoint list --help` does the same). The source
// code is canonical.
//
// The source path is required — there is no default. The CLI lives in the
// neon-pkgs monorepo under packages/cli; clone it and point --src at that
// subdirectory (it must contain the CLI's package.json and src/commands):
//
//   git clone https://github.com/neondatabase/neon-pkgs ~/src/neon-pkgs
//   node scripts/docs-checks/neonctl/generate-schema.js --src ~/src/neon-pkgs/packages/cli
//
// Or via environment variable:
//
//   NEONCTL_SRC=~/src/neon-pkgs/packages/cli node scripts/docs-checks/neonctl/generate-schema.js
//
// Run this whenever you upgrade the neonctl pin. Commit `schema.json`.
// (`npm run cli-docs -- refresh` automates the clone/extract and points --src
// at packages/cli for you.)

const fs = require('fs');
const path = require('path');

const ts = require('typescript');

const DEFAULT_OUT = path.join(__dirname, 'schema.json');

// The registered command modules are derived from the imports in
// `src/commands/index.ts`, which is the single place neonctl wires its
// top-level commands. A hardcoded list here drifted silently when new
// commands shipped (psql, link, checkout, data-api, neon-auth, …).
function commandFilesFromIndex(commandsDir) {
  const sf = readSource(path.join(commandsDir, 'index.ts'));
  const files = [];
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node)) return;
    const spec = stringLiteralValue(node.moduleSpecifier);
    if (!spec || !spec.startsWith('./')) return;
    files.push(spec.replace(/^\.\//, '').replace(/\.js$/, '.ts'));
  });
  return files;
}

function readSource(file) {
  return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}

// Returns the string value of a (string-literal-ish) expression, or
// undefined if the expression isn't a resolvable literal.
function stringLiteralValue(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function arrayLiteralStrings(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return undefined;
  const out = [];
  for (const el of node.elements) {
    const v = stringLiteralValue(el);
    // All-or-nothing: a partially resolved list (e.g. enum member
    // references) is worse than none — it would validate real values as
    // invalid choices.
    if (v === undefined) return undefined;
    out.push(v);
  }
  return out;
}

// Grab the property named `name` from an ObjectLiteralExpression.
function getProp(obj, name) {
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p) && !ts.isShorthandPropertyAssignment(p)) {
      continue;
    }
    let keyName;
    const key = p.name;
    if (ts.isIdentifier(key)) keyName = key.text;
    else if (ts.isStringLiteral(key)) keyName = key.text;
    if (keyName === name) return p;
  }
  return undefined;
}

// Unwrap `expr as const` / `expr satisfies T` / parenthesized wrappers
// down to the underlying expression.
function unwrapExpression(node) {
  let e = node;
  while (
    e &&
    (ts.isAsExpression(e) ||
      (ts.isSatisfiesExpression && ts.isSatisfiesExpression(e)) ||
      ts.isParenthesizedExpression(e))
  ) {
    e = e.expression;
  }
  return e;
}

// Builds a map of module-level `const name = { ... }` object literals
// (so spreads like `.options({ ...settingsFlags })` resolve) and
// `const name = [ ... ]` string arrays (so `${REGIONS.join(', ')}`
// interpolations resolve).
function collectModuleConsts(sf) {
  const consts = new Map();
  sf.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
      const init = unwrapExpression(decl.initializer);
      if (init && (ts.isObjectLiteralExpression(init) || ts.isArrayLiteralExpression(init))) {
        consts.set(decl.name.text, init);
      }
    }
  });
  return consts;
}

// Builds a map of module-level `const name = (argv) => ...` / `const name =
// function (argv) {...}` builder functions, so a `.command('db', 'desc',
// dbBuilder)` that passes its builder as a bare identifier (rather than an
// inline arrow) can still be walked. `inspect db` is the only command that
// does this today, but the resolution is general.
function collectFunctionConsts(sf) {
  const fns = new Map();
  sf.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
      const init = unwrapExpression(decl.initializer);
      if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
        fns.set(decl.name.text, init);
      }
    }
  });
  return fns;
}

// Resolves an expression to an option-spec ObjectLiteralExpression, if
// possible. Handles inline object literals and external references like
// `projectCreateRequest['project.name']` where the referenced const (e.g.
// from parameters.gen.ts) is present in `consts`.
function resolveSpecObject(expr, consts) {
  const e = unwrapExpression(expr);
  if (!e) return undefined;
  if (ts.isObjectLiteralExpression(e)) return e;
  if (
    ts.isElementAccessExpression(e) &&
    ts.isIdentifier(e.expression) &&
    consts &&
    consts.has(e.expression.text)
  ) {
    const container = consts.get(e.expression.text);
    if (!ts.isObjectLiteralExpression(container)) return undefined;
    const key = stringLiteralValue(e.argumentExpression);
    if (key === undefined) return undefined;
    const prop = getProp(container, key);
    if (prop && ts.isPropertyAssignment(prop)) {
      return resolveSpecObject(prop.initializer, consts);
    }
  }
  return undefined;
}

// Resolves an expression to a string: literal, or a property access into a
// resolvable spec object, e.g. `projectCreateRequest['project.name'].description`.
function resolveStringValue(expr, consts) {
  const e = unwrapExpression(expr);
  const direct = stringLiteralValue(e);
  if (direct !== undefined) return direct;
  if (!e) return undefined;
  if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.name)) {
    const target = resolveSpecObject(e.expression, consts);
    if (target) {
      const prop = getProp(target, e.name.text);
      if (prop && ts.isPropertyAssignment(prop)) {
        return resolveStringValue(prop.initializer, consts);
      }
    }
    return undefined;
  }
  // String concatenation: `req['key'].description + ' more text'`.
  if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = resolveStringValue(e.left, consts);
    const right = resolveStringValue(e.right, consts);
    if (left !== undefined && right !== undefined) return left + right;
    return undefined;
  }
  // `CONST_ARRAY.join(', ')` where CONST_ARRAY is a module-level string
  // array (REGIONS, SUPPORTED_OAUTH_PROVIDERS).
  if (
    ts.isCallExpression(e) &&
    ts.isPropertyAccessExpression(e.expression) &&
    e.expression.name.text === 'join' &&
    ts.isIdentifier(e.expression.expression) &&
    consts &&
    consts.has(e.expression.expression.text)
  ) {
    const arr = arrayLiteralStrings(consts.get(e.expression.expression.text));
    const sep = e.arguments.length ? stringLiteralValue(e.arguments[0]) : ',';
    if (arr && sep !== undefined) return arr.join(sep);
    return undefined;
  }
  // Template literals: resolvable only if every `${...}` span resolves.
  if (ts.isTemplateExpression(e)) {
    let out = e.head.text;
    for (const span of e.templateSpans) {
      const v = resolveStringValue(span.expression, consts);
      if (v === undefined) return undefined;
      out += v + span.literal.text;
    }
    return out;
  }
  return undefined;
}

// Resolves a literal default value: string, number, boolean, or array of
// strings. Non-literal defaults (function calls, env lookups) come back as
// `{ text }` so doc generation can show the source expression.
function literalValue(expr) {
  const e = unwrapExpression(expr);
  if (!e) return undefined;
  const s = stringLiteralValue(e);
  if (s !== undefined) return { value: s };
  if (ts.isNumericLiteral(e)) return { value: Number(e.text) };
  if (e.kind === ts.SyntaxKind.TrueKeyword) return { value: true };
  if (e.kind === ts.SyntaxKind.FalseKeyword) return { value: false };
  if (ts.isPrefixUnaryExpression(e) && e.operator === ts.SyntaxKind.MinusOperator) {
    const inner = literalValue(e.operand);
    if (inner && typeof inner.value === 'number') return { value: -inner.value };
  }
  const arr = arrayLiteralStrings(e);
  if (arr) return { value: arr };
  try {
    return { text: e.getText().replace(/\s+/g, ' ') };
  } catch {
    return undefined;
  }
}

// Parses a single option-spec expression into `{ type, describe, default,
// choices, alias, required, hidden }`. Handles internal spreads
// (`{ ...req['key'], describe: 'override' }`) by merging the resolved
// spread first so explicit props win.
function parseOptionSpec(expr, consts) {
  const obj = resolveSpecObject(expr, consts);
  if (!obj) return { type: 'unknown' };
  const spec = { type: 'unknown' };
  for (const p of obj.properties) {
    if (ts.isSpreadAssignment(p)) {
      const inherited = parseOptionSpec(p.expression, consts);
      for (const [k, v] of Object.entries(inherited)) {
        if (k === 'type' && v === 'unknown') continue;
        spec[k] = v;
      }
    }
  }
  const typeProp = getProp(obj, 'type');
  if (typeProp) {
    const t = stringLiteralValue(unwrapExpression(typeProp.initializer));
    if (t) spec.type = t;
  }
  const booleanProp = getProp(obj, 'boolean');
  if (booleanProp && booleanProp.initializer.kind === ts.SyntaxKind.TrueKeyword) {
    spec.type = 'boolean';
  }
  // yargs accepts `describe`, `description`, and `desc`; parameters.gen.ts
  // uses `description`.
  for (const key of ['describe', 'description', 'desc']) {
    const descProp = getProp(obj, key);
    if (descProp) {
      const d = resolveStringValue(descProp.initializer, consts);
      if (d !== undefined) spec.describe = d.trim();
      break;
    }
  }
  const demand = getProp(obj, 'demandOption');
  if (demand && demand.initializer.kind === ts.SyntaxKind.TrueKeyword) {
    spec.required = true;
  }
  const defaultProp = getProp(obj, 'default');
  if (defaultProp) {
    const d = literalValue(defaultProp.initializer);
    if (d && 'value' in d) spec.default = d.value;
    else if (d && d.text) spec.defaultText = d.text;
  }
  const aliasProp = getProp(obj, 'alias');
  if (aliasProp) {
    const a = stringLiteralValue(aliasProp.initializer);
    if (a) spec.alias = a;
    else {
      const arr = arrayLiteralStrings(aliasProp.initializer);
      if (arr) spec.alias = arr;
    }
  }
  const choicesProp = getProp(obj, 'choices');
  if (choicesProp) {
    const init = unwrapExpression(choicesProp.initializer);
    let arr = arrayLiteralStrings(init);
    if (!arr && init && ts.isIdentifier(init) && consts && consts.has(init.text)) {
      arr = arrayLiteralStrings(consts.get(init.text));
    }
    if (arr) spec.choices = arr;
    // Object.values(Enum) — accept anything; we lose choice checking.
    // Leaving `choices` undefined disables choice validation for this
    // option, which is the safe fallback.
  }
  const hidden = getProp(obj, 'hidden');
  if (hidden && hidden.initializer.kind === ts.SyntaxKind.TrueKeyword) {
    spec.hidden = true;
  }
  return spec;
}

// Parse the argument to `.options({...})` into a map of
// `{ name: { type, describe, default, choices, alias, required } }`.
// `consts` resolves `...identifier` spreads and external spec references
// (parameters.gen.ts) to object literals.
function parseOptionsObject(obj, consts) {
  const out = {};
  for (const p of obj.properties) {
    if (ts.isSpreadAssignment(p)) {
      const spread = unwrapExpression(p.expression);
      if (spread && ts.isIdentifier(spread) && consts && consts.has(spread.text)) {
        Object.assign(out, parseOptionsObject(consts.get(spread.text), consts));
      }
      continue;
    }
    if (!ts.isPropertyAssignment(p)) continue;
    let optName;
    if (ts.isIdentifier(p.name)) optName = p.name.text;
    else if (ts.isStringLiteral(p.name)) optName = p.name.text;
    if (!optName) continue;
    out[optName] = parseOptionSpec(p.initializer, consts);
  }
  return out;
}

// Parses one positional token from a yargs command string into
// `{ name, required, variadic }`: `<id>` is required, `[branch]` optional,
// `[ips...]` optional and variadic. Names like `id|name` are kept verbatim.
// `.positional()` specs found by walkBuilder merge in describe/type/choices.
function parsePositionalToken(token) {
  const required = token.startsWith('<');
  let name = token.replace(/^[<[]/, '').replace(/[>\]]$/, '');
  const variadic = name.endsWith('...');
  if (variadic) name = name.slice(0, -3);
  const pos = { name };
  if (required) pos.required = true;
  if (variadic) pos.variadic = true;
  return pos;
}

// Given a `.command(...)` call, return { name, aliases, positionals,
// options, commands }. Handles both the positional form
// `.command('name', 'desc', builderFn, handlerFn)` and the object form
// `.command({ command, aliases, builder, handler })`.
function parseCommandCall(callArgs, consts) {
  if (callArgs.length === 0) return null;
  const first = callArgs[0];

  let commandString;
  let aliases;
  let builderNode;
  let describe;
  if (ts.isStringLiteral(first) || ts.isNoSubstitutionTemplateLiteral(first)) {
    commandString = first.text;
    // Second arg is the description; third is the builder function.
    describe = resolveStringValue(callArgs[1], consts);
    builderNode = callArgs[2];
  } else if (ts.isObjectLiteralExpression(first)) {
    const cmdProp = getProp(first, 'command');
    if (cmdProp) commandString = stringLiteralValue(cmdProp.initializer);
    const aliasesProp = getProp(first, 'aliases');
    if (aliasesProp) aliases = arrayLiteralStrings(aliasesProp.initializer);
    for (const key of ['describe', 'description']) {
      const descProp = getProp(first, key);
      if (descProp) {
        describe = resolveStringValue(descProp.initializer, consts);
        break;
      }
    }
    const builderProp = getProp(first, 'builder');
    if (builderProp) builderNode = builderProp.initializer;
  } else {
    return null;
  }
  if (!commandString) return null;

  // Parse `name <pos> [pos]` → name + positional list.
  const parts = commandString.trim().split(/\s+/);
  const name = parts[0];
  const positionals = parts.slice(1).map(parsePositionalToken);

  // Clean up aliases: they can be written as `'update <id>'` — strip
  // positional.
  if (aliases) {
    aliases = aliases.map((a) => a.split(/\s+/)[0]);
  }

  const node = {
    name,
    aliases: aliases || [],
    positionals,
    options: {},
    commands: {},
  };
  if (describe) node.describe = describe.trim();

  if (builderNode) walkBuilder(builderNode, node, consts);

  return node;
}

// Walks an arrow-function / function builder body, collecting
// `.options(...)` and `.command(...)` calls into the `node` accumulator.
function walkBuilder(builderNode, node, consts) {
  // A builder passed as a bare identifier (`.command('db', 'desc', dbBuilder)`)
  // resolves to its module-level function const, whose body we then walk. Only
  // `inspect db` does this today; the resolution is general.
  let resolvedBuilder = builderNode;
  if (builderNode && ts.isIdentifier(builderNode) && consts && consts.has(builderNode.text)) {
    const target = consts.get(builderNode.text);
    if (target && (ts.isArrowFunction(target) || ts.isFunctionExpression(target))) {
      resolvedBuilder = target;
    }
  }
  let body;
  if (ts.isArrowFunction(resolvedBuilder) || ts.isFunctionExpression(resolvedBuilder)) {
    body = resolvedBuilder.body;
  } else {
    body = resolvedBuilder;
  }
  // The body is either a block (with a return and/or expression
  // statements) or a single expression. Collect every candidate so we
  // don't silently drop chained calls spread across multiple statements.
  const exprs = [];
  if (body && ts.isBlock(body)) {
    for (const stmt of body.statements) {
      if (ts.isReturnStatement(stmt) && stmt.expression) {
        exprs.push(stmt.expression);
      } else if (ts.isExpressionStatement(stmt)) {
        exprs.push(stmt.expression);
      } else if (ts.isVariableStatement(stmt)) {
        for (const d of stmt.declarationList.declarations) {
          if (d.initializer) exprs.push(d.initializer);
        }
      }
    }
  } else if (body) {
    exprs.push(body);
  }
  if (exprs.length === 0) return;

  // Follow the fluent call chain: `argv.options({...}).command(...).command(...)`.
  // Unroll by recursing into the expression of each call's receiver.
  const visit = (e) => {
    if (!e) return;
    if (ts.isCallExpression(e)) {
      const callee = e.expression;
      if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.name)) {
        const method = callee.name.text;
        if (method === 'options') {
          // yargs.options({...}) or .options({...}). Merge argument into
          // accumulator.
          const arg = e.arguments[0];
          if (arg && ts.isObjectLiteralExpression(arg)) {
            const parsed = parseOptionsObject(arg, consts);
            Object.assign(node.options, parsed);
          }
        } else if (method === 'option') {
          // .option('name', { ... }) single-form.
          const nameArg = e.arguments[0];
          const specArg = e.arguments[1];
          const optName = stringLiteralValue(nameArg);
          if (optName && specArg && ts.isObjectLiteralExpression(specArg)) {
            const synth = ts.factory.createObjectLiteralExpression([
              ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(optName), specArg),
            ]);
            Object.assign(node.options, parseOptionsObject(synth, consts));
          }
        } else if (method === 'command') {
          const sub = parseCommandCall(e.arguments, consts);
          if (sub) node.commands[sub.name] = sub;
        } else if (method === 'positional') {
          // .positional('name', { describe, type, choices, demandOption })
          // merges into the matching token parsed from the command string.
          const posName = stringLiteralValue(e.arguments[0]);
          const specArg = e.arguments[1];
          if (posName && specArg) {
            const spec = parseOptionSpec(specArg, consts);
            const target = (node.positionals || []).find(
              (p) => p.name === posName || p.name.split('|').includes(posName)
            );
            if (target) {
              if (spec.describe) target.describe = spec.describe;
              if (spec.type && spec.type !== 'unknown') target.type = spec.type;
              if (spec.choices) target.choices = spec.choices;
              if ('default' in spec) target.default = spec.default;
              if (spec.required) target.required = true;
            }
          }
        } else if (method === 'usage') {
          const u = resolveStringValue(e.arguments[0], consts);
          if (u) node.usage = u;
        } else if (method === 'example') {
          // Two forms: .example('cmd', 'desc') and .example([[cmd, desc], ...]).
          if (!node.examples) node.examples = [];
          const first = unwrapExpression(e.arguments[0]);
          if (first && ts.isArrayLiteralExpression(first)) {
            for (const el of first.elements) {
              const pair = unwrapExpression(el);
              if (pair && ts.isArrayLiteralExpression(pair)) {
                const cmd = resolveStringValue(pair.elements[0], consts);
                const desc = resolveStringValue(pair.elements[1], consts);
                if (cmd) node.examples.push({ command: cmd, description: desc || '' });
              }
            }
          } else {
            const cmd = resolveStringValue(e.arguments[0], consts);
            const desc = resolveStringValue(e.arguments[1], consts);
            if (cmd) node.examples.push({ command: cmd, description: desc || '' });
          }
        }
        // Continue walking up the chain.
        visit(callee.expression);
      } else if (ts.isIdentifier(callee)) {
        // Bare call like `yargs(...)` — stop.
      } else {
        visit(callee);
      }
    } else if (ts.isParenthesizedExpression(e)) {
      visit(e.expression);
    }
  };
  const examplesBefore = node.examples ? node.examples.length : 0;
  const commandsBefore = new Set(Object.keys(node.commands));
  for (const e of exprs) visit(e);
  // The fluent chain is visited outermost-call-first, so chained
  // `.command()` and `.example()` calls arrive in reverse source order.
  // Restore source order for both.
  const newCommands = Object.keys(node.commands).filter((k) => !commandsBefore.has(k));
  if (newCommands.length > 1) {
    const reordered = {};
    for (const k of Object.keys(node.commands)) {
      if (!commandsBefore.has(k)) continue;
      reordered[k] = node.commands[k];
    }
    for (const k of newCommands.reverse()) {
      reordered[k] = node.commands[k];
    }
    node.commands = reordered;
  }
  if (node.examples && node.examples.length > examplesBefore) {
    const added = node.examples.splice(examplesBefore).reverse();
    node.examples.push(...added);
  }
}

function parseCommandFile(srcFile, externalConsts) {
  const sf = readSource(srcFile);
  // File-local consts shadow external ones (parameters.gen.ts). Function
  // consts (builder functions passed by identifier) live in the same map so
  // walkBuilder can resolve `.command('db', 'desc', dbBuilder)`.
  const consts = new Map([
    ...(externalConsts || new Map()),
    ...collectModuleConsts(sf),
    ...collectFunctionConsts(sf),
  ]);
  const result = {
    name: null,
    aliases: [],
    positionals: [],
    options: {},
    commands: {},
  };

  // Two passes: the builder's `.positional()` specs merge into positionals
  // parsed from the `command` string, so `command` must be processed first
  // regardless of export order in the source file.
  const builders = [];
  sf.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    // TS 5 moved modifier access behind `ts.getModifiers`. Fall back to
    // `node.modifiers` for older TS versions that ship transitively.
    const mods =
      typeof ts.canHaveModifiers === 'function' && ts.canHaveModifiers(node)
        ? ts.getModifiers(node) || []
        : node.modifiers || [];
    const isExport = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExport) return;
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      const varName = decl.name.text;
      if (varName === 'command') {
        const v = stringLiteralValue(decl.initializer);
        if (v) {
          const parts = v.trim().split(/\s+/);
          result.name = parts[0];
          result.positionals = parts.slice(1).map(parsePositionalToken);
        }
      } else if (varName === 'aliases') {
        const arr = arrayLiteralStrings(decl.initializer);
        if (arr) result.aliases = arr;
      } else if (varName === 'describe' || varName === 'description') {
        const d = resolveStringValue(decl.initializer, consts);
        if (d) result.describe = d.trim();
      } else if (varName === 'builder') {
        if (decl.initializer) builders.push(decl.initializer);
      }
    }
  });
  for (const b of builders) walkBuilder(b, result, consts);

  return result;
}

function parseGlobalOptions(cliSrc) {
  // `src/index.ts` wires global options. We don't need the full command
  // tree from it; just accumulate every `.option(...)` + `.options({...})`
  // call (skipping hidden: true).
  const sf = readSource(cliSrc);
  const consts = collectModuleConsts(sf);
  const bag = { commands: {}, options: {} };

  sf.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!decl.initializer) continue;
        walkBuilder(decl.initializer, bag, consts);
      }
    }
    // Also handle expression statements `builder = builder.method()...`.
    if (ts.isExpressionStatement(node)) {
      if (
        ts.isBinaryExpression(node.expression) &&
        node.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
      ) {
        walkBuilder(node.expression.right, bag, consts);
      }
    }
  });

  // Strip hidden options from globals.
  const filtered = {};
  for (const [k, v] of Object.entries(bag.options)) {
    if (v.hidden) continue;
    filtered[k] = v;
  }

  // yargs built-ins wired via .help() / .version() in src/index.ts — real
  // flags on every invocation, but never declared through .options(), so
  // the AST walk can't see them.
  const src = readSource(cliSrc).getFullText();
  if (/\.help\(\)/.test(src)) {
    filtered.help = { type: 'boolean', describe: 'Show help', alias: 'h' };
  }
  if (/\.version\(/.test(src)) {
    filtered.version = { type: 'boolean', describe: 'Show version number', alias: 'v' };
  }
  return filtered;
}

// Reads the top-level keys (and their `describeProp` values) of a const
// object literal declared in a source file. Used to enumerate subcommands
// neonctl registers dynamically (see applyDynamicCommands). Returns an
// ordered array of `{ name, describe }`, or null if the const can't be
// resolved (source moved, const renamed) so the caller can fail loudly.
function enumerateConstEntries(srcFile, constName, describeProp) {
  if (!fs.existsSync(srcFile)) return null;
  const sf = readSource(srcFile);
  const consts = collectModuleConsts(sf);
  const obj = consts.get(constName);
  if (!obj || !ts.isObjectLiteralExpression(obj)) return null;
  const entries = [];
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    let key;
    if (ts.isIdentifier(p.name)) key = p.name.text;
    else if (ts.isStringLiteral(p.name)) key = p.name.text;
    if (!key) continue;
    const entry = { name: key };
    const spec = resolveSpecObject(p.initializer, consts);
    if (spec) {
      const descProp = getProp(spec, describeProp);
      if (descProp && ts.isPropertyAssignment(descProp)) {
        const d = resolveStringValue(descProp.initializer, consts);
        if (d !== undefined) entry.describe = d.trim();
      }
    }
    entries.push(entry);
  }
  return entries;
}

// Injects subcommands that neonctl registers dynamically (in a loop over a
// const map) into the command tree. These are invisible to the static parser
// — `dynamic-commands.json` names the const and source file to enumerate. The
// parent node (e.g. `inspect db`) must already exist from the static walk;
// its options and usage came through Gap-1 identifier-builder resolution.
//
// A configured parent that isn't in this CLI version is skipped (the config is
// forward-compatible: it lies dormant until the command ships upstream). But a
// parent that IS present with a const that can't be enumerated throws — that's
// real drift (renamed/moved const) and must fail the refresh loudly rather
// than silently emit an empty leaf list.
function applyDynamicCommands(schema, src) {
  const configPath = path.join(__dirname, 'dynamic-commands.json');
  if (!fs.existsSync(configPath)) return schema;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  for (const [cmdPath, spec] of Object.entries(config.commands || {})) {
    const parts = cmdPath.split('.');
    let node = { commands: schema.commands };
    let missing = false;
    for (const part of parts) {
      node = node.commands && node.commands[part];
      if (!node) {
        missing = true;
        break;
      }
    }
    // Parent absent: this CLI version doesn't have the command yet. Skip.
    if (missing) continue;
    const srcFile = path.join(src, spec.sourceFile);
    const entries = enumerateConstEntries(srcFile, spec.enumerateConst, spec.describeProp);
    if (!entries || entries.length === 0) {
      throw new Error(
        `dynamic-commands.json: could not enumerate "${spec.enumerateConst}" in ${spec.sourceFile} ` +
          `for "${cmdPath}". The const may have been renamed or moved upstream — update the config.`
      );
    }
    node.commands = node.commands || {};
    for (const entry of entries) {
      const leaf = { aliases: [], positionals: [], options: {}, commands: {} };
      if (entry.describe) leaf.describe = entry.describe;
      node.commands[entry.name] = leaf;
    }
  }
  return schema;
}

// Deep-merges `overrides.json` (if present) into the schema. Overrides are
// the escape hatch for terse or missing upstream descriptions — same shape
// as the schema itself, merged key-by-key with overrides winning.
function applyOverrides(schema) {
  const overridesPath = path.join(__dirname, 'overrides.json');
  if (!fs.existsSync(overridesPath)) return schema;
  const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
  const merge = (target, src) => {
    for (const [k, v] of Object.entries(src)) {
      if (k.startsWith('_')) continue;
      // `null` deletes the key — used to drop a stale defaultText when an
      // override supplies a literal default in its place.
      if (v === null) {
        delete target[k];
        continue;
      }
      if (
        v &&
        typeof v === 'object' &&
        !Array.isArray(v) &&
        target[k] &&
        typeof target[k] === 'object'
      ) {
        merge(target[k], v);
      } else {
        target[k] = v;
      }
    }
  };
  merge(schema, overrides);
  return schema;
}

function buildSchema({ src } = {}) {
  if (!src) throw new Error('buildSchema requires a `src` path');
  const pkgPath = path.join(src, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const commandsDir = path.join(src, 'src', 'commands');

  // parameters.gen.ts holds OpenAPI-derived option specs referenced by
  // projects create/update et al. Make them resolvable from every command
  // file.
  const externalConsts = new Map();
  const parametersGen = path.join(src, 'src', 'parameters.gen.ts');
  if (fs.existsSync(parametersGen)) {
    for (const [k, v] of collectModuleConsts(readSource(parametersGen))) {
      externalConsts.set(k, v);
    }
  }
  // Pool exported consts across command files so cross-file imports
  // resolve (vpc_endpoints imports REGIONS from projects). File-local
  // consts shadow this pool inside parseCommandFile.
  const commandFiles = commandFilesFromIndex(commandsDir);
  for (const file of commandFiles) {
    const full = path.join(commandsDir, file);
    if (!fs.existsSync(full)) continue;
    for (const [k, v] of collectModuleConsts(readSource(full))) {
      if (!externalConsts.has(k)) externalConsts.set(k, v);
    }
  }

  const globalOptions = parseGlobalOptions(path.join(src, 'src', 'index.ts'));

  const commands = {};
  for (const file of commandFiles) {
    const full = path.join(commandsDir, file);
    if (!fs.existsSync(full)) continue;
    const parsed = parseCommandFile(full, externalConsts);
    if (!parsed.name) continue;
    const entry = {
      aliases: parsed.aliases,
      positionals: parsed.positionals,
      options: parsed.options,
      commands: parsed.commands,
    };
    if (parsed.describe) entry.describe = parsed.describe;
    if (parsed.usage) entry.usage = parsed.usage;
    if (parsed.examples) entry.examples = parsed.examples;
    commands[parsed.name] = entry;
  }

  const schema = applyDynamicCommands(
    {
      schemaVersion: 2,
      neonctlVersion: pkg.version,
      // The published binary names; `neon` is an alias of `neonctl`.
      binaries: ['neonctl', 'neon'],
      docsUrl: 'https://neon.com/docs/cli',
      globalOptions,
      commands,
    },
    src
  );
  return applyOverrides(schema);
}

const USAGE = [
  'Usage: node scripts/docs-checks/neonctl/generate-schema.js --src <path> [--out <file>]',
  '',
  '  --src <path>   Path to the CLI package in a neon-pkgs clone,',
  '                 e.g. ~/src/neon-pkgs/packages/cli',
  '                 (or set the NEONCTL_SRC environment variable).',
  '  --out <file>   Where to write the schema JSON. Defaults to the committed',
  '                 schema.json next to this script.',
].join('\n');

// Sorts a map object's keys alphabetically, returning a new object. Used to
// keep schema.json order stable regardless of the CLI's command-registration
// (import) order — otherwise an upstream reshuffle of src/commands/index.ts
// produces a huge, all-noise diff. Arrays (aliases, choices, positionals) are
// left as-is: their order can be meaningful.
function sortKeys(map) {
  const out = {};
  for (const key of Object.keys(map).sort()) out[key] = map[key];
  return out;
}

// Recursively sorts the command tree: every `commands` and `options` map is
// alphabetized, but each command entry keeps its authored key order
// (aliases, positionals, options, commands, describe, ...).
function sortCommandTree(commands) {
  const sorted = sortKeys(commands);
  for (const name of Object.keys(sorted)) {
    const entry = sorted[name];
    if (entry.options) entry.options = sortKeys(entry.options);
    if (entry.commands) entry.commands = sortCommandTree(entry.commands);
  }
  return sorted;
}

function main() {
  const args = process.argv.slice(2);
  let src = process.env.NEONCTL_SRC || null;
  let out = DEFAULT_OUT;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--src') {
      src = args[i + 1];
      i += 1;
    } else if (args[i] === '--out') {
      out = args[i + 1];
      i += 1;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(USAGE);
      process.exit(0);
    }
  }
  if (!src) {
    console.error(
      'Missing --src (or NEONCTL_SRC env var). Point it at packages/cli in a clone of https://github.com/neondatabase/neon-pkgs.\n'
    );
    console.error(USAGE);
    process.exit(2);
  }
  const resolvedSrc = path.resolve(src);
  if (!fs.existsSync(path.join(resolvedSrc, 'src', 'commands'))) {
    console.error(
      `No neonctl source found at ${resolvedSrc}. Expected the CLI package (packages/cli in a https://github.com/neondatabase/neon-pkgs clone) with a \`src/commands\` directory.`
    );
    process.exit(2);
  }
  const schema = buildSchema({ src: resolvedSrc });
  schema.commands = sortCommandTree(schema.commands);
  schema.globalOptions = sortKeys(schema.globalOptions);
  fs.writeFileSync(out, `${JSON.stringify(schema, null, 2)}\n`);
  const nCmds = Object.keys(schema.commands).length;
  const nLeafs = countLeaves(schema.commands);
  console.log(
    `Wrote schema for neonctl ${schema.neonctlVersion}: ${nCmds} top-level commands, ${nLeafs} leafs, ${Object.keys(schema.globalOptions).length} global options.`
  );
  console.log(`Output: ${out}`);
}

function countLeaves(commands) {
  let n = 0;
  for (const v of Object.values(commands)) {
    const children = v.commands || {};
    if (Object.keys(children).length === 0) n += 1;
    else n += countLeaves(children);
  }
  return n;
}

module.exports = {
  buildSchema,
  parseCommandFile,
  parseGlobalOptions,
  parseOptionsObject,
  parseCommandCall,
  enumerateConstEntries,
};

if (require.main === module) main();
