#!/usr/bin/env node
// Builds scripts/data/cli-coverage.json and scripts/data/mcp-coverage.json
// by fetching public neonctl and mcp-server-neon source from GitHub.
//
// Run whenever neonctl or mcp-server-neon releases change coverage.
// Commit the output files — the generator reads them at CI time.
//
// Usage: node scripts/build-coverage-data.mjs

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
} from './lib/ts-parse.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = resolve(ROOT, 'scripts/data');
mkdirSync(DATA_DIR, { recursive: true });

const SPEC_URL = 'https://neon.com/api_spec/release/v2.json';

// Pinned upstream versions. Bumping these is a deliberate act: run
// `node scripts/build-coverage-data.mjs`, eyeball the diff in
// scripts/data/*.json (especially the operation lists), commit both.
// Pinned input → deterministic output: re-running with unchanged versions
// produces a zero-diff. Pinning to `main` would let upstream force-pushes
// or refactors silently break the docs build at CI time.
// neonctl ships tagged releases; mcp-server-neon does not, so SHA-pin it.
const NEONCTL_VERSION = 'v2.27.0';
const MCP_VERSION = 'fac296fe303fc93fec5bd02a2b505ba88e275950';
const NEONCTL = `https://raw.githubusercontent.com/neondatabase/neonctl/${NEONCTL_VERSION}`;
const MCP = `https://raw.githubusercontent.com/neondatabase/mcp-server-neon/${MCP_VERSION}`;
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

async function fetchText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return r.text();
}

// ---------------------------------------------------------------------------
// CLI coverage
// ---------------------------------------------------------------------------

// neonctl command files that call apiClient methods. Shared with the neonctl
// schema generator so new top-level command files are added in one place.
const NEONCTL_COMMAND_FILES = JSON.parse(
  readFileSync(resolve(DATA_DIR, 'neonctl-command-files.json'), 'utf8')
);

// Manual exceptions where heuristic gets it wrong, or where one API method
// is called by multiple neonctl commands (one primary + N helpers) and we
// need to pin which command is canonical for the docs. The TS-AST parser
// (Phase 2c) surfaces more helper calls than the old line-scan regex did
// (the old code missed apiClient.X calls split across two lines), so the
// multi-match tripwire fires for ops the old parser silently resolved by
// missing the helper site.
//
// key = operationId, value = { cmd: 'neon X Y [...]', note }
const CLI_MANUAL = {
  // Pin to primary command — also called as a helper inside `create` (to
  // pick a default parent branch).
  listProjectBranches: { cmd: 'neon branches list' },
  // Pinned: ip-allow subcommands (add, remove, list, reset) call getProject
  // and updateProject as helpers to inspect/update the project's IP allowlist.
  // The user-facing canonical commands live in projects.ts.
  getProject: { cmd: 'neon projects get' },
  updateProject: { cmd: 'neon projects update' },
  // Branches: neonctl sub-command names differ from operationId action words
  getProjectBranch: { cmd: 'neon branches get <id|name>' },
  updateProjectBranch: {
    commands: [
      { cmd: 'neon branches rename <id|name> <new-name>', covers: ['name'] },
      { cmd: 'neon branches set-expiration <id|name>', covers: ['expires_at'] },
    ],
    uncovered: ['protected'],
  },
  setDefaultProjectBranch: { cmd: 'neon branches set-default <id|name>' },
  restoreProjectBranch: { cmd: 'neon branches restore <id|name>' },
  createProjectEndpoint: { cmd: 'neon branches add-compute <id|name>' },
  getProjectBranchSchema: { cmd: 'neon branches schema-diff [base] [compare]' },
  // listProjectBranchEndpoints: used internally as a helper in connection-string, no direct command
  // Roles
  // Connection string
  getConnectionURI: { cmd: 'neon connection-string [branch]' },
  // Neon Auth
  createNeonAuth: { cmd: 'neon neon-auth enable' },
  getNeonAuth: { cmd: 'neon neon-auth status' },
  disableNeonAuth: { cmd: 'neon neon-auth disable' },
  listBranchNeonAuthOauthProviders: { cmd: 'neon neon-auth oauth-provider list' },
  addBranchNeonAuthOauthProvider: { cmd: 'neon neon-auth oauth-provider add' },
  updateBranchNeonAuthOauthProvider: { cmd: 'neon neon-auth oauth-provider update' },
  deleteBranchNeonAuthOauthProvider: { cmd: 'neon neon-auth oauth-provider delete' },
  listBranchNeonAuthTrustedDomains: { cmd: 'neon neon-auth domain list' },
  addBranchNeonAuthTrustedDomain: { cmd: 'neon neon-auth domain add <domain>' },
  deleteBranchNeonAuthTrustedDomain: { cmd: 'neon neon-auth domain delete <domain>' },
  getNeonAuthAllowLocalhost: { cmd: 'neon neon-auth domain allow-localhost get' },
  updateNeonAuthAllowLocalhost: {
    commands: [
      { cmd: 'neon neon-auth domain allow-localhost enable', covers: ['allow_localhost'] },
      { cmd: 'neon neon-auth domain allow-localhost disable', covers: ['allow_localhost'] },
    ],
  },
  getNeonAuthEmailAndPasswordConfig: { cmd: 'neon neon-auth config email-password get' },
  updateNeonAuthEmailAndPasswordConfig: { cmd: 'neon neon-auth config email-password update' },
  getNeonAuthEmailProvider: { cmd: 'neon neon-auth config email-provider get' },
  updateNeonAuthEmailProvider: { cmd: 'neon neon-auth config email-provider update' },
  sendNeonAuthTestEmail: { cmd: 'neon neon-auth config email-provider test' },
  getNeonAuthPluginConfigs: {
    commands: [
      { cmd: 'neon neon-auth plugins list', covers: [] },
      { cmd: 'neon neon-auth plugins get <plugin-name>', covers: [] },
      { cmd: 'neon neon-auth config organization get', covers: [] },
    ],
  },
  updateNeonAuthOrganizationPlugin: { cmd: 'neon neon-auth config organization update' },
  getNeonAuthWebhookConfig: { cmd: 'neon neon-auth config webhook get' },
  updateNeonAuthWebhookConfig: { cmd: 'neon neon-auth config webhook update' },
  createBranchNeonAuthNewUser: { cmd: 'neon neon-auth user create' },
  deleteBranchNeonAuthUser: { cmd: 'neon neon-auth user delete <user-id>' },
  updateNeonAuthUserRole: { cmd: 'neon neon-auth user set-role <user-id>' },
  // User / orgs
  getCurrentUserInfo: { cmd: 'neon me' },
  getCurrentUserOrganizations: { cmd: 'neon orgs list' },
  // getAuthDetails: called internally by analytics.ts for API key metadata, not a user-facing command
  // VPC endpoints — correct operationId casing from live spec
  listOrganizationVPCEndpoints: {
    cmd: 'neon vpc endpoint list --org-id <id> --region-id <region_id>',
  },
  assignOrganizationVPCEndpoint: {
    cmd: 'neon vpc endpoint assign <vpc_endpoint_id> --org-id <id> --region-id <region_id>',
  },
  deleteOrganizationVPCEndpoint: {
    cmd: 'neon vpc endpoint remove <vpc_endpoint_id> --org-id <id> --region-id <region_id>',
  },
  getOrganizationVPCEndpointDetails: {
    cmd: 'neon vpc endpoint status <vpc_endpoint_id> --org-id <id> --region-id <region_id>',
  },
  listProjectVPCEndpoints: { cmd: 'neon vpc project list --project-id <id>' },
  listProjectVpcEndpoints: { cmd: 'neon vpc project list --project-id <id>' }, // neonctl API client uses Vpc (not VPC)
  assignProjectVPCEndpoint: {
    cmd: 'neon vpc project restrict <vpc_endpoint_id> --project-id <id>',
  },
  deleteProjectVPCEndpoint: {
    cmd: 'neon vpc project remove <vpc_endpoint_id> --project-id <id>',
  },
};

// Maps action word from operationId prefix → subcommand name in neonctl
const ACTION_TO_SUBCMD = {
  list: 'list',
  create: 'create',
  delete: 'delete',
  get: 'get',
  update: 'update',
  recover: 'recover',
  add: 'add',
  reset: 'reset',
  restore: 'restore',
};

function extractTopCommand(src) {
  return src.match(/export const command\s*=\s*['"]([^'"]+)['"]/)?.[1] ?? null;
}

// Find every named function and the apiClient.X / neonClient.X methods it
// calls. Result: { fnName: [methodName, ...] }. Walked via the TS AST so
// braces inside string/regex/template literals don't confuse scope tracking.
function extractFnToApiClient(src) {
  const srcFile = parseTs(src);
  const fnToApi = {};
  for (const { name, body } of findNamedFunctions(srcFile)) {
    const methods = findReceiverCalls(body, (id) => id === 'apiClient' || id === 'neonClient');
    if (methods.length > 0) fnToApi[name] = [...new Set(methods)];
  }
  return fnToApi;
}

// Map yargs subcommand names → the handler function they delegate to.
// Walks every `.command(name, describe?, builder?, handler)` call. The
// handler arg is the last argument (yargs varies; can be 2nd or 4th
// position). Inspects the handler body for one of three handoff patterns:
//
//   Pattern A: (args) => fn(args)
//   Pattern B: async (args) => { await fn(args); }
//   Pattern C: async (args) => { await wrapper(args, fn); }  — 2nd arg is the real fn
//
// AST-based so we don't get fooled by braces inside string options
// (e.g. yargs option descriptions that contain `}`).
function extractCmdToFn(src) {
  const srcFile = parseTs(src);
  const cmdToFn = {};

  walk(srcFile, (node) => {
    if (!ts.isCallExpression(node)) return;
    if (
      !ts.isPropertyAccessExpression(node.expression) ||
      !ts.isIdentifier(node.expression.name) ||
      node.expression.name.text !== 'command'
    )
      return;

    const firstArg = node.arguments[0];
    const cmdName = readStringLike(firstArg);
    if (!cmdName) return;
    const cmd = cmdName.split(/[\s<|]/)[0];

    // Handler is the LAST argument and must be a function expression.
    const handler = node.arguments[node.arguments.length - 1];
    if (!handler) return;
    if (!ts.isArrowFunction(handler) && !ts.isFunctionExpression(handler)) return;

    // Look only at the FIRST executable expression in the handler body —
    // the original regex only matched after `=>` or `{`, never deeper.
    // Matching nested calls would surface helper calls (e.g. lookup,
    // logging) as the handoff fn.
    const firstCall = firstExecutableCall(handler.body);
    if (!firstCall) return;

    const args = firstCall.arguments;
    let handoff = null;

    // Pattern C: { await wrapper(args, fn); } — handoff is the 2nd arg
    if (args.length >= 2 && isArgsRef(args[0]) && ts.isIdentifier(args[1])) {
      handoff = args[1].text;
    }
    // Pattern A/B: fn(args) / await fn(args) — handoff is the callee
    else if (ts.isIdentifier(firstCall.expression) && args.length >= 1 && isArgsRef(args[0])) {
      handoff = firstCall.expression.text;
    }

    if (handoff) cmdToFn[cmd] = handoff;
  });

  return cmdToFn;
}

// `args` direct identifier OR `args as any` type-asserted form.
function isArgsRef(node) {
  if (!node) return false;
  let n = node;
  if (ts.isAsExpression(n)) n = n.expression;
  return ts.isIdentifier(n) && n.text === 'args';
}

// First non-trivial CallExpression in a function body. Unwraps the typical
// async-handler shape: Block → ExpressionStatement → AwaitExpression → Call.
// For expression-bodied arrows, the body itself is the call (possibly
// wrapped in `await`).
function firstExecutableCall(body) {
  let node = body;
  if (ts.isBlock(node)) {
    const first = node.statements[0];
    if (!first || !ts.isExpressionStatement(first)) return null;
    node = first.expression;
  }
  if (ts.isAwaitExpression(node)) node = node.expression;
  return ts.isCallExpression(node) ? node : null;
}

async function buildCliCoverage() {
  process.stderr.write('Building CLI coverage...\n');
  // operationId → "neon top-cmd sub-cmd [...]"
  const coverage = {};

  for (const file of NEONCTL_COMMAND_FILES) {
    const src = await fetchText(`${NEONCTL}/src/commands/${file}`);
    const topCmd = extractTopCommand(src);
    if (!topCmd) continue;

    const fnToApi = extractFnToApiClient(src);
    const cmdToFn = extractCmdToFn(src);

    // Invert fnToApi: apiMethod → [fnNames]
    const apiToFns = {};
    for (const [fn, apis] of Object.entries(fnToApi)) {
      for (const api of apis) {
        if (!apiToFns[api]) apiToFns[api] = [];
        apiToFns[api].push(fn);
      }
    }

    // For each api method found in this file, find its subcommand
    for (const [apiMethod, fns] of Object.entries(apiToFns)) {
      if (CLI_MANUAL[apiMethod]) {
        const manual = CLI_MANUAL[apiMethod];
        coverage[apiMethod] = manual.commands
          ? { commands: manual.commands, uncovered: manual.uncovered ?? [] }
          : manual.cmd;
        continue;
      }

      // Find all subcommands that call one of the fns
      const matchingCmds = Object.entries(cmdToFn)
        .filter(([, fn]) => fns.includes(fn))
        .map(([cmd]) => cmd);

      if (matchingCmds.length > 1) {
        throw new Error(
          `[cli-coverage] ${apiMethod} matched by multiple CLI commands: [${matchingCmds.join(', ')}]. ` +
            `Pin one by adding ${apiMethod} to the CLI_MANUAL object near the top of ` +
            `scripts/build-coverage-data.mjs with the canonical command, e.g.\n` +
            `  ${apiMethod}: { cmd: 'neon ${topCmd} ${matchingCmds[0]} <id>' }`
        );
      }

      let subCmd = matchingCmds[0] ?? null;

      // If not found via fn tracing, try naming heuristic
      if (!subCmd) {
        const action = apiMethod.match(/^([a-z]+)/)?.[1];
        subCmd = ACTION_TO_SUBCMD[action] ?? null;
      }

      if (subCmd) {
        coverage[apiMethod] = `neon ${topCmd} ${subCmd}`;
      }
    }
  }

  // Apply remaining manual overrides (for ops not caught above)
  for (const [opId, manual] of Object.entries(CLI_MANUAL)) {
    coverage[opId] = manual.commands
      ? { commands: manual.commands, uncovered: manual.uncovered ?? [] }
      : manual.cmd;
  }

  // Remove helper calls that aren't real CLI commands
  const EXCLUDE = new Set(['listProjectBranchEndpoints', 'listProjectEndpoints']);
  for (const k of EXCLUDE) delete coverage[k];

  return coverage;
}

// ---------------------------------------------------------------------------
// MCP coverage — dynamically parsed from source
// ---------------------------------------------------------------------------

// List .ts files in a GitHub directory via contents API.
// ?ref=MCP_VERSION pins the listing to the same commit as fetchText() pulls,
// so a force-push or new file landing on `main` doesn't ghost-in here.
//
// Sends Authorization when GITHUB_TOKEN or GH_TOKEN is set — the API limit
// is 60/hr unauthenticated vs 5000/hr authenticated, easy to exhaust just
// re-running this script during development. Throws (not returns []) on
// failure so silent partial results don't silently truncate coverage.
async function listGitHubTsFiles(repoPath) {
  const url = `https://api.github.com/repos/neondatabase/mcp-server-neon/contents/${repoPath}?ref=${MCP_VERSION}`;
  const headers = { Accept: 'application/vnd.github.v3+json' };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(url, { headers });
  if (!r.ok) {
    const hint =
      r.status === 403 && !token
        ? ' (rate-limited — set GITHUB_TOKEN or GH_TOKEN to authenticate)'
        : '';
    throw new Error(`[listGitHubTsFiles] HTTP ${r.status} ${r.statusText} for ${url}${hint}`);
  }
  const entries = await r.json();
  return Array.isArray(entries)
    ? entries.filter((e) => e.type === 'file' && e.name.endsWith('.ts')).map((e) => e.name)
    : [];
}

// Build fnName → [called knownFns] map from source.
// knownFns is the set of function names we care about (those that call
// neonClient). AST-based — braces inside strings/regex/templates no longer
// confuse scope tracking.
function extractFnToFnCalls(src, knownFns) {
  const srcFile = parseTs(src);
  const knownSet = new Set(knownFns);
  const fnToFns = {};
  for (const { name, body } of findNamedFunctions(srcFile)) {
    const called = findKnownFnCalls(body, knownSet, name);
    if (called.length > 0) fnToFns[name] = called;
  }
  return fnToFns;
}

// Transitively resolve all neonClient operationIds reachable from fnName.
function resolveOps(fnName, fnToApi, fnToFns, visited = new Set()) {
  if (visited.has(fnName)) return new Set();
  visited.add(fnName);
  const ops = new Set(fnToApi[fnName] ?? []);
  for (const calledFn of fnToFns[fnName] ?? []) {
    for (const op of resolveOps(calledFn, fnToApi, fnToFns, new Set(visited))) {
      ops.add(op);
    }
  }
  return ops;
}

// Parse the NEON_HANDLERS object in tools.ts → { toolName: { apiCalls, fnCalls } }.
// AST-based: finds the NEON_HANDLERS variable declaration, walks each
// property of its object-literal initializer (each property is a tool
// name → async handler), and collects neonClient.X calls + calls to any
// known fn in the handler body.
function parseNeonHandlers(src, knownFns) {
  const srcFile = parseTs(src);
  const result = {};
  const knownSet = new Set(knownFns);

  let handlersObj = null;
  walk(srcFile, (node) => {
    if (handlersObj) return false;
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'NEON_HANDLERS' &&
      node.initializer
    ) {
      // Unwrap `{} as const`, `{} satisfies T` etc. to reach the object literal
      let init = node.initializer;
      if (ts.isAsExpression(init) || ts.isSatisfiesExpression?.(init)) init = init.expression;
      if (ts.isObjectLiteralExpression(init)) handlersObj = init;
    }
  });
  if (!handlersObj) return result;

  for (const prop of handlersObj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name;
    const toolName = ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;
    if (!toolName) continue;
    const handler = prop.initializer;
    if (!ts.isArrowFunction(handler) && !ts.isFunctionExpression(handler)) continue;
    const apiCalls = [...new Set(findReceiverCalls(handler.body, (id) => id === 'neonClient'))];
    const fnCalls = findKnownFnCalls(handler.body, knownSet);
    result[toolName] = { apiCalls, fnCalls };
  }
  return result;
}

// Tools excluded from coverage mapping.
// These tools are real tools but call management API only as a helper/side-effect,
// not as their primary purpose — showing them on API reference pages would mislead.
// SQL tools, search/fetch, docs, and multi-step workflow tools (whose constituent
// ops are already covered by the focused management tools they delegate to).
const MCP_COVERAGE_EXCLUDE = new Set([
  'run_sql',
  'run_sql_transaction',
  'describe_table_schema',
  'get_database_tables',
  'explain_sql_statement',
  'list_slow_queries',
  'search',
  'fetch',
  'list_docs_resources',
  'get_doc_resource',
  'prepare_database_migration',
  'complete_database_migration',
  'prepare_query_tuning',
  'complete_query_tuning',
]);

const MCP_TOOLS_ROOT = 'landing/mcp-src/tools';
const MCP_GH_RAW = `${MCP}/${MCP_TOOLS_ROOT}`;

async function buildMcpCoverage() {
  process.stderr.write('Building MCP coverage...\n');

  // Discover all .ts source files under tools/ and tools/handlers/
  const [rootNames, handlerNames] = await Promise.all([
    listGitHubTsFiles(MCP_TOOLS_ROOT),
    listGitHubTsFiles(`${MCP_TOOLS_ROOT}/handlers`),
  ]);

  const allPaths = [
    ...rootNames.map((n) => `${MCP_GH_RAW}/${n}`),
    ...handlerNames.map((n) => `${MCP_GH_RAW}/handlers/${n}`),
  ];
  process.stderr.write(`  Fetching ${allPaths.length} MCP source files...\n`);

  const sources = await Promise.all(allPaths.map((p) => fetchText(p).catch(() => '')));
  const allSrc = sources.join('\n');

  const toolsSrc =
    sources[rootNames.indexOf('tools.ts')] ??
    (await fetchText(`${MCP_GH_RAW}/tools.ts`).catch(() => ''));

  const defsSrc =
    sources[rootNames.indexOf('definitions.ts')] ??
    (await fetchText(`${MCP_GH_RAW}/definitions.ts`));

  // Registered tool names — gate the final output to only known tools
  const currentTools = new Set(
    [...defsSrc.matchAll(/name:\s*['"]([a-z_]+)['"]/g)].map((m) => m[1])
  );

  // Build function-level call graphs
  const fnToApi = extractFnToApiClient(allSrc); // fnName → [operationIds]
  const knownFns = new Set(Object.keys(fnToApi));
  const fnToFns = extractFnToFnCalls(allSrc, knownFns); // fnName → [calledFnNames]

  // Per-tool: resolve operationIds at two depths.
  // level1 = ops called directly by the tool's immediate handler fns (not transitive).
  // total  = full transitive closure (level1 + helpers + helpers-of-helpers).
  // level1 count is the primary sort key: a tool with 2 direct calls is more focused
  // than one with 5, even if its transitive total is smaller.
  const toolHandlers = parseNeonHandlers(toolsSrc, knownFns);
  const toolToOps = {};
  const toolToLevel1 = {};
  for (const [tool, { apiCalls, fnCalls }] of Object.entries(toolHandlers)) {
    const level1 = new Set(apiCalls);
    for (const fn of fnCalls) {
      for (const op of fnToApi[fn] ?? []) level1.add(op);
    }
    const total = new Set(level1);
    for (const fn of fnCalls) {
      for (const op of resolveOps(fn, fnToApi, fnToFns)) total.add(op);
    }
    if (total.size > 0) {
      toolToOps[tool] = total;
      toolToLevel1[tool] = level1;
    }
  }

  // Build operationId → best tool.
  // Sort criteria (in order):
  //   1. Op is in tool's level-1 set (direct handler call) beats transitive-only.
  //   2. Fewest level-1 ops (most focused tool wins).
  //   3. Fewest total ops (least side-effect accumulation).
  //   4. Alphabetical (stable tiebreaker).
  const opToTools = {};
  for (const [tool, ops] of Object.entries(toolToOps)) {
    if (!currentTools.has(tool) || MCP_COVERAGE_EXCLUDE.has(tool)) continue;
    for (const op of ops) {
      if (!opToTools[op]) opToTools[op] = [];
      opToTools[op].push(tool);
    }
  }

  const coverage = {};
  for (const [op, tools] of Object.entries(opToTools)) {
    tools.sort(
      (a, b) =>
        (toolToLevel1[a]?.has(op) ? 0 : 1) - (toolToLevel1[b]?.has(op) ? 0 : 1) ||
        (toolToLevel1[a]?.size ?? 99) - (toolToLevel1[b]?.size ?? 99) ||
        (toolToOps[a]?.size ?? 99) - (toolToOps[b]?.size ?? 99) ||
        a.localeCompare(b)
    );
    coverage[op] = tools[0];
  }

  // Drift check: any upstream tool that is neither classified as a coverage
  // target (appears as a value in `coverage`) nor explicitly excluded
  // (MCP_COVERAGE_EXCLUDE) is a new tool we haven't decided what to do with.
  // Without this guard, a new tool ships unannounced and silently misses
  // docs. The user-visible effect is "tool exists on the MCP server but
  // doesn't appear on any API reference page".
  const usedAsCoverage = new Set(Object.values(coverage));
  const unclassified = [...currentTools].filter(
    (t) => !usedAsCoverage.has(t) && !MCP_COVERAGE_EXCLUDE.has(t)
  );
  if (unclassified.length > 0) {
    throw new Error(
      `[mcp-coverage] ${unclassified.length} upstream MCP tool(s) are unclassified: ${unclassified.join(', ')}. ` +
        `For each, either:\n` +
        `  • add it to scripts/data/mcp-coverage.json (via CLI_MANUAL-style pin near the top of this file) if it maps to a Management API operation, OR\n` +
        `  • add it to MCP_COVERAGE_EXCLUDE if it's a helper/SQL/search/workflow tool with no direct management op equivalent.`
    );
  }

  process.stderr.write(`  ${Object.keys(coverage).length} MCP operations covered.\n`);
  return coverage;
}

// ---------------------------------------------------------------------------
// MCP tool definitions (local source)
// ---------------------------------------------------------------------------

// Parse tool entries from definitions.ts:
//   { name: 'tool_name' as const, description: `...`, inputSchema: xyzInputSchema, ... }
//
// AST-based: walks every object literal in the source, identifies those
// with a `name: 'X' as const` property (the tool definition shape), and
// reads description + inputSchema name via property lookup. Template
// literals, single-quoted strings, and double-quoted strings all flow
// through the same readStringLike() helper, eliminating the silent-drop
// bug class the regex parser had.
function parseMcpToolDefs(src) {
  const srcFile = parseTs(src);
  const tools = {};

  walk(srcFile, (node) => {
    if (!ts.isObjectLiteralExpression(node)) return;
    // Tool def shape: `name: 'foo' as const`. The `as const` assertion is
    // how upstream pins the literal type; other object literals in the file
    // (Zod schemas, config objects) don't use it, so this disambiguates.
    let toolName = null;
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const propName = prop.name;
      if (!ts.isIdentifier(propName) || propName.text !== 'name') continue;
      const init = prop.initializer;
      if (
        ts.isAsExpression(init) &&
        readStringLike(init.expression) !== null &&
        ts.isTypeReferenceNode?.(init.type) &&
        ts.isIdentifier(init.type.typeName) &&
        init.type.typeName.text === 'const'
      ) {
        toolName = readStringLike(init.expression);
      }
      break;
    }
    if (!toolName) return;

    const rawDesc = getStringProperty(node, 'description');
    const description = rawDesc ? rawDesc.replace(/\s+/g, ' ').trim() : null;
    const inputSchemaName = getIdentifierProperty(node, 'inputSchema');
    tools[toolName] = { description, inputSchemaName };
  });

  // Tripwire: if any tool ends up without a description after this parse,
  // fail fast. The double-quote-only regex bug silently dropped 11/31 tool
  // descriptions for an entire release cycle before someone noticed; never
  // again. If you're seeing this fire, the upstream description shape
  // changed — update descRe near the top of parseMcpToolDefs to match.
  const missing = Object.entries(tools)
    .filter(([, def]) => !def.description)
    .map(([n]) => n);
  if (missing.length > 0) {
    throw new Error(
      `[mcp-tool-defs] ${missing.length}/${Object.keys(tools).length} tools have no parsed description: ${missing.join(', ')}. ` +
        `Upstream definitions.ts likely changed shape. Inspect ` +
        `${MCP}/landing/mcp-src/tools/definitions.ts and update descRe in parseMcpToolDefs.`
    );
  }

  return tools;
}

// Parse argument entries from toolsSchema.ts Zod schemas:
//   export const xyzInputSchema = z.object({ field: z.string().describe('...'), ... })
//
// AST-based: finds every top-level `export const xxxInputSchema = z.object(...)`
// or `z.discriminatedUnion(...)`, walks all object-literal property fields
// (recursively, so discriminatedUnion's variant objects contribute their
// fields too), and inspects each field's Zod call chain for type, optionality,
// description, and default.
function parseZodInputSchemas(src) {
  const srcFile = parseTs(src);
  const schemas = {};

  walk(srcFile, (node) => {
    if (!ts.isVariableDeclaration(node)) return;
    if (!ts.isIdentifier(node.name) || !node.name.text.endsWith('InputSchema')) return;
    // Unwrap `z.object({...}) satisfies SomeType` and `z.object({...}) as Foo`
    // so the inner CallExpression is the one we walk.
    let init = node.initializer;
    while (init && (ts.isSatisfiesExpression?.(init) || ts.isAsExpression(init))) {
      init = init.expression;
    }
    if (!init || !ts.isCallExpression(init)) return;

    // Walk every object literal nested in the schema initializer and collect
    // its property fields. discriminatedUnion('type', [{...}, {...}]) → fields
    // from every variant object literal flow into the same args list, matching
    // the legacy regex parser's pattern-detection behavior.
    const args = [];
    const seenNames = new Set();
    walk(init, (n) => {
      if (!ts.isObjectLiteralExpression(n)) return;
      for (const prop of n.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const propName = prop.name;
        if (!ts.isIdentifier(propName) && !ts.isStringLiteral(propName)) continue;
        const name = propName.text;
        if (seenNames.has(name)) continue;
        const arg = describeZodField(name, prop.initializer);
        if (arg) {
          args.push(arg);
          seenNames.add(name);
        }
      }
    });
    schemas[node.name.text] = args;
  });

  return schemas;
}

// Inspect a Zod call chain and return { name, type, required, description?, default? }.
// Returns null if the initializer doesn't look like a Zod field.
function describeZodField(name, initializer) {
  const chain = getCallChain(initializer);
  if (chain.length === 0) return null;

  // Type comes from the first call in the chain (z.boolean(), z.number(),
  // z.enum(...), z.string(), z.array(...), etc.). Anything not boolean/number/
  // enum is treated as 'string' to match the legacy parser's fallback.
  const baseMethod = chain[0].method;
  const type =
    baseMethod === 'boolean'
      ? 'boolean'
      : baseMethod === 'number'
        ? 'number'
        : baseMethod === 'enum'
          ? 'enum'
          : 'string';

  let optional = false;
  let description = null;
  let defaultVal = undefined;

  for (const { method, args } of chain) {
    if (method === 'optional') optional = true;
    else if (method === 'default') {
      optional = true; // .default() also makes a field optional
      const a = args[0];
      if (a) {
        if (ts.isStringLiteral(a) || ts.isNoSubstitutionTemplateLiteral(a)) defaultVal = a.text;
        else if (ts.isNumericLiteral(a)) defaultVal = Number(a.text);
        else if (a.kind === ts.SyntaxKind.TrueKeyword) defaultVal = 'true';
        else if (a.kind === ts.SyntaxKind.FalseKeyword) defaultVal = 'false';
        // Identifier references (e.g. .default(DEFAULT_X)) and other shapes
        // are unrepresentable as a static value — leave defaultVal undefined,
        // matching the legacy parser which fell through to `undefined`.
      }
    } else if (method === 'describe') {
      const a = args[0];
      if (a) {
        const text = readStringLike(a);
        if (text != null) description = text.replace(/\s+/g, ' ').trim();
      }
    }
  }

  const arg = { name, type, required: !optional };
  if (description) arg.description = description;
  if (defaultVal !== undefined) arg.default = defaultVal;
  return arg;
}

async function buildMcpDefinitions() {
  process.stderr.write('Building MCP tool definitions from GitHub...\n');

  const toolsBase = `${MCP}/landing/mcp-src/tools`;
  const [defsSrc, schemaSrc] = await Promise.all([
    fetchText(`${toolsBase}/definitions.ts`),
    fetchText(`${toolsBase}/toolsSchema.ts`),
  ]);

  const toolDefs = parseMcpToolDefs(defsSrc);
  const schemaArgs = parseZodInputSchemas(schemaSrc);

  const result = {};
  for (const [tool, def] of Object.entries(toolDefs)) {
    result[tool] = {
      description: def.description ?? '',
      arguments: def.inputSchemaName ? (schemaArgs[def.inputSchemaName] ?? []) : [],
    };
  }

  process.stderr.write(`  ${Object.keys(result).length} MCP tool definitions built.\n`);
  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// Fetch spec to get ground-truth operationId set — filters out stale/wrong matches
process.stderr.write('Fetching spec for operationId validation...\n');
const specRaw = await fetchText(SPEC_URL).then(JSON.parse);
const specOpIds = new Set();
for (const pathItem of Object.values(specRaw.paths ?? {})) {
  for (const method of METHODS) {
    if (pathItem[method]?.operationId) specOpIds.add(pathItem[method].operationId);
  }
}
process.stderr.write(`  ${specOpIds.size} operationIds in live spec.\n`);

const [cliCoverageRaw, mcpCoverageRaw, mcpDefinitions] = await Promise.all([
  buildCliCoverage(),
  buildMcpCoverage(),
  buildMcpDefinitions(),
]);

// Filter to valid spec operationIds, with case-insensitive fallback for acronym casing differences
// (e.g. TypeScript client uses getConnectionUri but spec has getConnectionURI)
const specOpIdsLower = new Map([...specOpIds].map((id) => [id.toLowerCase(), id]));
function normalizeToSpec(raw) {
  const result = {};
  for (const [op, tool] of Object.entries(raw)) {
    if (specOpIds.has(op)) {
      result[op] = tool;
    } else {
      const canonical = specOpIdsLower.get(op.toLowerCase());
      if (canonical) result[canonical] = tool;
    }
  }
  return result;
}
const cliCoverage = normalizeToSpec(cliCoverageRaw);
const mcpCoverage = normalizeToSpec(mcpCoverageRaw);

const cliPath = resolve(DATA_DIR, 'cli-coverage.json');
const mcpPath = resolve(DATA_DIR, 'mcp-coverage.json');

const mcpDefsPath = resolve(DATA_DIR, 'mcp-tool-definitions.json');

writeFileSync(cliPath, JSON.stringify(cliCoverage, null, 2) + '\n');
writeFileSync(mcpPath, JSON.stringify(mcpCoverage, null, 2) + '\n');
writeFileSync(mcpDefsPath, JSON.stringify(mcpDefinitions, null, 2) + '\n');

process.stderr.write(`\nWritten:\n  ${cliPath}\n  ${mcpPath}\n  ${mcpDefsPath}\n`);
process.stderr.write(`CLI: ${Object.keys(cliCoverage).length} operations covered\n`);
process.stderr.write(`MCP: ${Object.keys(mcpCoverage).length} operations covered\n`);
process.stderr.write(`MCP tool definitions: ${Object.keys(mcpDefinitions).length} tools\n`);
