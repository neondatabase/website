// Parses the neonctl TypeScript source and emits `schema.json`: an
// authoritative description of every command, subcommand, option, alias,
// and choice list.
//
// We use this instead of parsing `neonctl … --help` output because yargs
// help has known bugs (`neonctl roles create --help` falls back to the
// parent's help; `vpc endpoint list --help` does the same). The source
// code is canonical.
//
// The source path is required — there is no default. Clone neonctl and
// pass it explicitly so this script is reproducible across machines:
//
//   git clone https://github.com/neondatabase/neonctl ~/src/neonctl
//   node scripts/docs-checks/neonctl/generate-schema.js --src ~/src/neonctl
//
// Or via environment variable:
//
//   NEONCTL_SRC=~/src/neonctl node scripts/docs-checks/neonctl/generate-schema.js
//
// Run this whenever you upgrade the neonctl pin. Commit `schema.json`.

const fs = require('fs');
const path = require('path');

const ts = require('typescript');

const DEFAULT_OUT = path.join(__dirname, 'schema.json');

const COMMAND_FILES = [
  'auth.ts',
  'user.ts',
  'orgs.ts',
  'projects.ts',
  'ip_allow.ts',
  'vpc_endpoints.ts',
  'branches.ts',
  'databases.ts',
  'roles.ts',
  'operations.ts',
  'connection_string.ts',
  'set_context.ts',
  'init.ts',
];

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
    if (v !== undefined) out.push(v);
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

// Parse the argument to `.options({...})` into a map of
// `{ name: { type, choices, alias, required } }`.
function parseOptionsObject(obj) {
  const out = {};
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    let optName;
    if (ts.isIdentifier(p.name)) optName = p.name.text;
    else if (ts.isStringLiteral(p.name)) optName = p.name.text;
    if (!optName) continue;
    // `name: branchCreateRequest['branch.name']` — external reference we
    // can't resolve. Accept with unknown type.
    if (!ts.isObjectLiteralExpression(p.initializer)) {
      out[optName] = { type: 'unknown' };
      continue;
    }
    const spec = { type: 'unknown' };
    const typeProp = getProp(p.initializer, 'type');
    if (typeProp) {
      const t = stringLiteralValue(typeProp.initializer);
      if (t) spec.type = t;
    }
    const booleanProp = getProp(p.initializer, 'boolean');
    if (booleanProp && booleanProp.initializer.kind === ts.SyntaxKind.TrueKeyword) {
      spec.type = 'boolean';
    }
    const demand = getProp(p.initializer, 'demandOption');
    if (demand && demand.initializer.kind === ts.SyntaxKind.TrueKeyword) {
      spec.required = true;
    }
    const aliasProp = getProp(p.initializer, 'alias');
    if (aliasProp) {
      const a = stringLiteralValue(aliasProp.initializer);
      if (a) spec.alias = a;
      else {
        const arr = arrayLiteralStrings(aliasProp.initializer);
        if (arr) spec.alias = arr;
      }
    }
    const choicesProp = getProp(p.initializer, 'choices');
    if (choicesProp) {
      const arr = arrayLiteralStrings(choicesProp.initializer);
      if (arr) spec.choices = arr;
      // Object.values(Enum) — accept anything; we lose choice checking.
      // Leaving `choices` undefined disables choice validation for this
      // option, which is the safe fallback.
    }
    const hidden = getProp(p.initializer, 'hidden');
    if (hidden && hidden.initializer.kind === ts.SyntaxKind.TrueKeyword) {
      spec.hidden = true;
    }
    out[optName] = spec;
  }
  return out;
}

// Given a `.command(...)` call, return { name, aliases, positionals,
// options, commands }. Handles both the positional form
// `.command('name', 'desc', builderFn, handlerFn)` and the object form
// `.command({ command, aliases, builder, handler })`.
function parseCommandCall(callArgs) {
  if (callArgs.length === 0) return null;
  const first = callArgs[0];

  let commandString;
  let aliases;
  let builderNode;
  if (ts.isStringLiteral(first) || ts.isNoSubstitutionTemplateLiteral(first)) {
    commandString = first.text;
    // Second arg is the description; third is the builder function.
    builderNode = callArgs[2];
  } else if (ts.isObjectLiteralExpression(first)) {
    const cmdProp = getProp(first, 'command');
    if (cmdProp) commandString = stringLiteralValue(cmdProp.initializer);
    const aliasesProp = getProp(first, 'aliases');
    if (aliasesProp) aliases = arrayLiteralStrings(aliasesProp.initializer);
    const builderProp = getProp(first, 'builder');
    if (builderProp) builderNode = builderProp.initializer;
  } else {
    return null;
  }
  if (!commandString) return null;

  // Parse `name <pos> [pos]` → name + positional list.
  const parts = commandString.trim().split(/\s+/);
  const name = parts[0];
  const positionals = parts.slice(1).map((p) => p.replace(/^[<[]/, '').replace(/[>\]]$/, ''));

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

  if (builderNode) walkBuilder(builderNode, node);

  return node;
}

// Walks an arrow-function / function builder body, collecting
// `.options(...)` and `.command(...)` calls into the `node` accumulator.
function walkBuilder(builderNode, node) {
  let body;
  if (ts.isArrowFunction(builderNode) || ts.isFunctionExpression(builderNode)) {
    body = builderNode.body;
  } else {
    body = builderNode;
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
            const parsed = parseOptionsObject(arg);
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
            Object.assign(node.options, parseOptionsObject(synth));
          }
        } else if (method === 'command') {
          const sub = parseCommandCall(e.arguments);
          if (sub) node.commands[sub.name] = sub;
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
  for (const e of exprs) visit(e);
}

function parseCommandFile(srcFile) {
  const sf = readSource(srcFile);
  const result = {
    name: null,
    aliases: [],
    positionals: [],
    options: {},
    commands: {},
  };

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
          result.positionals = parts
            .slice(1)
            .map((p) => p.replace(/^[<[]/, '').replace(/[>\]]$/, ''));
        }
      } else if (varName === 'aliases') {
        const arr = arrayLiteralStrings(decl.initializer);
        if (arr) result.aliases = arr;
      } else if (varName === 'builder') {
        if (decl.initializer) walkBuilder(decl.initializer, result);
      }
    }
  });

  return result;
}

function parseGlobalOptions(cliSrc) {
  // `src/index.ts` wires global options. We don't need the full command
  // tree from it; just accumulate every `.option(...)` + `.options({...})`
  // call (skipping hidden: true).
  const sf = readSource(cliSrc);
  const bag = { commands: {}, options: {} };

  sf.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!decl.initializer) continue;
        walkBuilder(decl.initializer, bag);
      }
    }
    // Also handle expression statements `builder = builder.method()...`.
    if (ts.isExpressionStatement(node)) {
      if (
        ts.isBinaryExpression(node.expression) &&
        node.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
      ) {
        walkBuilder(node.expression.right, bag);
      }
    }
  });

  // Strip hidden options from globals.
  const filtered = {};
  for (const [k, v] of Object.entries(bag.options)) {
    if (v.hidden) continue;
    filtered[k] = v;
  }
  return filtered;
}

function buildSchema({ src } = {}) {
  if (!src) throw new Error('buildSchema requires a `src` path');
  const pkgPath = path.join(src, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const commandsDir = path.join(src, 'src', 'commands');

  const globalOptions = parseGlobalOptions(path.join(src, 'src', 'index.ts'));

  const commands = {};
  for (const file of COMMAND_FILES) {
    const full = path.join(commandsDir, file);
    if (!fs.existsSync(full)) continue;
    const parsed = parseCommandFile(full);
    if (!parsed.name) continue;
    commands[parsed.name] = {
      aliases: parsed.aliases,
      positionals: parsed.positionals,
      options: parsed.options,
      commands: parsed.commands,
    };
  }

  return {
    neonctlVersion: pkg.version,
    generatedAt: new Date().toISOString(),
    globalOptions,
    commands,
  };
}

const USAGE = [
  'Usage: node scripts/docs-checks/neonctl/generate-schema.js --src <path> [--out <file>]',
  '',
  '  --src <path>   Path to a local clone of https://github.com/neondatabase/neonctl',
  '                 (or set the NEONCTL_SRC environment variable).',
  '  --out <file>   Where to write the schema JSON. Defaults to the committed',
  '                 schema.json next to this script.',
].join('\n');

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
      'Missing --src (or NEONCTL_SRC env var). Point it at a local clone of https://github.com/neondatabase/neonctl.\n'
    );
    console.error(USAGE);
    process.exit(2);
  }
  const resolvedSrc = path.resolve(src);
  if (!fs.existsSync(path.join(resolvedSrc, 'src', 'commands'))) {
    console.error(
      `No neonctl source found at ${resolvedSrc}. Expected a clone of https://github.com/neondatabase/neonctl with a \`src/commands\` directory.`
    );
    process.exit(2);
  }
  const schema = buildSchema({ src: resolvedSrc });
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
};

if (require.main === module) main();
