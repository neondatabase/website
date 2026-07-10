---
title: Neon API TypeScript SDK
subtitle: Programmatically manage Neon projects, branches, databases, and other platform
  resources with @neon/sdk
summary: >-
  The official Neon Platform API TypeScript SDK (@neon/sdk) is a fetch-based,
  zero-dependency client for creating and managing projects, branches, databases,
  endpoints, roles, organizations, and consumption metrics. Use createNeonClient
  for ergonomic namespaces and typed { data, error } results, or raw for every
  OpenAPI endpoint. Requires Node.js 20.19+ and a Neon API key.
enableTableOfContents: true
updatedOn: '2026-07-10T09:41:23.024Z'
---

<InfoBlock>

<DocsList title="What you will learn:">
<p>Install and configure <code>@neon/sdk</code></p>
<p>Call the Neon Platform API with typed results and errors</p>
<p>When to use the ergonomic client vs the raw layer</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
<a href="/docs/reference/api">Neon Platform API</a>
<a href="/docs/reference/migrate-api-client-to-sdk">Migrate from @neondatabase/api-client</a>
<a href="/docs/ai/platform-api-agent-context">Agent context for the Platform API</a>
</DocsList>

<DocsList title="Source code" theme="repo">
<a href="https://www.npmjs.com/package/@neon/sdk">@neon/sdk on npm</a>
<a href="https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk">@neon/sdk on GitHub</a>
</DocsList>

</InfoBlock>

<Admonition type="tip" title="Building with an AI assistant?">
Run `npx neon@latest init` to install [Agent Skills](/docs/ai/agent-skills) and the [Neon MCP server](/docs/ai/neon-mcp-server). For **context** (how the Platform API and `@neon/sdk` work), point your agent at this page as Markdown ([typescript-sdk.md](/docs/reference/typescript-sdk.md)) and the [Platform API reference](/docs/reference/api.md). For **actions** on your Neon account from chat, use MCP, not pasted API docs. See [Agent context for the Platform API](/docs/ai/platform-api-agent-context) for a full guide.
</Admonition>

<Admonition type="note" title="Migrating from @neondatabase/api-client?">
Neon’s legacy Axios-based client [`@neondatabase/api-client`](https://www.npmjs.com/package/@neondatabase/api-client) is superseded by [`@neon/sdk`](https://www.npmjs.com/package/@neon/sdk). See the [migration guide](/docs/reference/migrate-api-client-to-sdk) for method mapping and error-handling changes.
</Admonition>

## About the SDK

[`@neon/sdk`](https://www.npmjs.com/package/@neon/sdk) is the official TypeScript SDK for the [Neon Platform API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). It is generated from Neon’s [OpenAPI specification](https://neon.com/api_spec/release/v2.json) and provides two layers in one package:

- **`createNeonClient`** — ergonomic resource namespaces, `{ data, error }` results, typed errors, retries, readiness polling, auto-pagination, and multi-step workflows.
- **`raw`** — every Platform API endpoint as a standalone, tree-shakeable function (also exported from `@neon/sdk/raw`).

Use this SDK to automate projects, branches, Postgres resources, snapshots, consumption metrics, organizations, and beta platform features (storage, functions, credentials, AI gateway).

<AgentSkillsTip skill_topic="the Neon TypeScript SDK (@neon/sdk) for managing resources programmatically" />

## Quick start

### Installation

Requires **Node.js ≥ 20.19** (or any runtime with a global `fetch` — Bun, Deno, edge, browser).

<CodeTabs labels={["npm", "yarn", "pnpm"]}>

```bash
npm install @neon/sdk
```

```bash
yarn add @neon/sdk
```

```bash
pnpm add @neon/sdk
```

</CodeTabs>

### Authentication

Create a [Neon API key](/docs/manage/api-keys) in the console, then pass it to the client:

```bash
export NEON_API_KEY="your-api-key"
```

```typescript
import { createNeonClient } from '@neon/sdk';

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });

const { data, error } = await neon.projects.createAndConnect({ name: 'my-app' });
if (error) throw error;

const { project, connectionString } = data;
console.log(project.id, connectionString);
```

`createAndConnect` creates a project, waits for provisioning operations to finish, and returns a pooled connection string in one call.

## Client configuration

`createNeonClient(config)` accepts:

| Option             | Default                            | Description                                                                        |
| ------------------ | ---------------------------------- | ---------------------------------------------------------------------------------- |
| `apiKey`           | — (required)                       | API key string, or a sync/async function returning one                             |
| `throwOnError`     | `false`                            | When `true`, methods return the resource directly and throw `NeonError` on failure |
| `waitForReadiness` | `false`                            | When `true`, mutations block until related `operations` complete                   |
| `wait`             | `1000` / `300000` ms               | Poll interval and timeout for readiness                                            |
| `retries`          | `2`                                | Retries on `423`, `429`, and `503` with backoff                                    |
| `orgId`            | —                                  | Default org for project create/list and transfers                                  |
| `baseUrl`          | `https://console.neon.tech/api/v2` | API base URL override                                                              |
| `fetch`            | global `fetch`                     | Custom fetch (tests, proxies)                                                      |

Every option except `apiKey` can also be set **per call** via a trailing `options` argument (`{ throwOnError?, waitForReadiness?, signal? }`).

## The result model

By default, methods resolve to `{ data, error }` — no `try/catch` required:

```typescript
const { data: project, error } = await neon.projects.get('late-frost-12345');
if (error) {
  if (error.kind === 'not_found') return;
  throw error;
}
// project is narrowed to Project
```

Set `throwOnError` on the client or per call to get the bare resource:

```typescript
const neon = createNeonClient({ apiKey, throwOnError: true });
const project = await neon.projects.get('late-frost-12345');
```

## Errors

The `error` channel (and thrown value when `throwOnError` is set) uses a typed hierarchy:

| Class                | `kind`         | When                        |
| -------------------- | -------------- | --------------------------- |
| `NeonApiError`       | `"api"`        | HTTP error responses        |
| `NeonNotFoundError`  | `"not_found"`  | 404                         |
| `NeonAuthError`      | `"auth"`       | 401 / 403                   |
| `NeonRateLimitError` | `"rate_limit"` | 429 (after retries)         |
| `NeonOperationError` | `"operation"`  | Awaited operation failed    |
| `NeonTimeoutError`   | `"timeout"`    | Readiness deadline exceeded |
| `NeonNetworkError`   | `"network"`    | Transport failure           |

```typescript
const { error } = await neon.branches.get(projectId, 'missing-branch');
if (error?.kind === 'not_found') {
  // branch does not exist
}
```

## Examples

### List projects

All Neon accounts are organization-based. List organizations, then pass `org_id`:

```typescript
import { createNeonClient } from '@neon/sdk';

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });

async function listNeonProjects() {
  const { data: orgs, error: orgsError } = await neon.user.organizations();
  if (orgsError) throw orgsError;

  const { data: page, error } = await neon.projects.list({ org_id: orgs[0].id }).page();
  if (error) throw error;

  console.log(page.items);
}

listNeonProjects();
```

Run with [`tsx`](https://tsx.is): `tsx list-projects.ts`

### Create a branch with compute

`createWithCompute` creates a branch, provisions a read-write endpoint, waits for readiness, and returns a connection string:

```typescript
const { data: prod, error: prodError } = await neon.branches.getDefault(projectId);
if (prodError) throw prodError;

const { data, error } = await neon.branches.createWithCompute(projectId, {
  name: 'preview/pr-123',
  parentId: prod.id,
  compute: { minCu: 0.25, maxCu: 2 },
});
if (error) throw error;

console.log(data.branch.id, data.connectionString);
```

To set [branch expiration](/docs/guides/branch-expiration), pass `expires_at` in `neon.branches.create` or `neon.branches.update`.

### List branches

```typescript
const { data: page, error } = await neon.branches.list(projectId).page();
if (error) throw error;
console.log(page.items);
```

For all pages: `const { data: branches, error } = await neon.branches.list(projectId).all();`

### Create a database

```typescript
const { data: database, error } = await neon.postgres.databases.create(
  projectId,
  branchId,
  { name: 'mydatabase', owner_name: 'neondb_owner' }
);
if (error) throw error;
console.log(database);
```

### Create a role

```typescript
const { data: role, error } = await neon.postgres.roles.create(projectId, branchId, {
  name: 'app_user',
});
if (error) throw error;
console.log(role);
```

### Connection strings

`neon.postgres.connectionString` resolves a URI and auto-selects the default branch, role, and database when omitted:

```typescript
const { data: uri, error } = await neon.postgres.connectionString({
  projectId,
  pooled: true,
});
if (error) throw error;
console.log(uri);
```

## Namespace overview

The ergonomic client is organized into namespaces. **[P]** = cursor-paginated list; **[W]** = multi-step workflow.

| Namespace          | Highlights                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `neon.projects`    | `list`, `get`, `create`, `createAndConnect` **[W]**, `update`, `delete`, `transfer`, `permissions`, `recover`           |
| `neon.branches`    | `list` **[P]**, `get`, `create`, `createWithCompute` **[W]**, `update`, `delete`, `getDefault`, `setDefault`, `recover` |
| `neon.postgres`    | `connectionString`; nested `endpoints`, `roles`, `databases`, `dataApi`                                                 |
| `neon.snapshots`   | `list`, `create`, `restore`, `getSchedule`, `setSchedule`                                                               |
| `neon.storage`     | Branch object storage (beta): `get`, `buckets`, `objects`                                                               |
| `neon.functions`   | Branch Neon Functions (beta): `list`, `deploy`, `get`, `update`, `delete`                                               |
| `neon.credentials` | Scoped credentials (beta): `list`, `create`, `revoke`                                                                   |
| `neon.aiGateway`   | AI Gateway metadata (beta): `get`                                                                                       |
| `neon.auth`        | Branch-scoped Neon Auth: `get`, `create`, `disable`, `updateConfig`, `oauthProviders`, `trustedDomains`, `users`        |
| `neon.operations`  | `list`, `get`, `waitFor`                                                                                                |
| `neon.consumption` | `perProject`, `perProjectV2`, `perBranchV2` (paginated)                                                                 |
| `neon.apiKeys`     | `list`, `create`, `revoke`                                                                                              |
| `neon.regions`     | `list`                                                                                                                  |
| `neon.user`        | `me`, `organizations`                                                                                                   |

For the complete method tables (parameters, return types, and notes), see the [`@neon/sdk` README on GitHub](https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk#api-reference).

## Raw layer

Use `raw` when an endpoint is not wrapped in an ergonomic namespace, or when you need maximum tree-shaking:

```typescript
import { createNeonClient, raw } from '@neon/sdk';

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });

const { data, error } = await raw.getProjectBranchSchema({
  client: neon.client,
  path: { project_id: projectId, branch_id: branchId },
});

// Or throw on error:
const schema = await raw.getProjectBranchSchema({
  client: neon.client,
  path: { project_id: projectId, branch_id: branchId },
  throwOnError: true,
});
```

In **1.0**, every `raw.*` call uses the same `{ data, error }` contract as `createNeonClient`. The `responseStyle` switch from 0.x is removed. See [raw layer migration](/docs/reference/migrate-api-client-to-sdk#raw-layer-changes-in-10) if you adopted an earlier preview.

Import types flat from the package:

```typescript
import type { Project, Branch, Endpoint } from '@neon/sdk';
```

## Pagination

Cursor-paginated `list()` methods return a lazy `Paginated<T>`. Call `.page()` or `.all()` for results; both always return the `{ data, error }` envelope, even when the client uses `throwOnError: true`.

```typescript
const { data: allProjects, error } = await neon.projects.list().all();
const { data: onePage, error: pageError } = await neon.projects.list().page();

for await (const project of neon.projects.list()) {
  console.log(project.name);
}
```

## Readiness and operations

Neon mutations return `operations` that provision resources asynchronously. Enable `waitForReadiness` on the client or use workflow methods (`createAndConnect`, `createWithCompute`) that wait by default.

To wait manually:

```typescript
const { data, error } = await neon.branches.create(projectId, { name: 'wip' });
if (error) throw error;

const waitError = await neon.operations.waitFor(data.operations, { timeoutMs: 120_000 });
if (waitError.error) throw waitError.error;
```

## TypeScript types

`@neon/sdk` re-exports generated request and response types for every Platform API resource. Import them alongside the client for type-safe automation:

```typescript
import { createNeonClient, type Project } from '@neon/sdk';

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY!, throwOnError: true });

async function getProjectName(id: string): Promise<string> {
  const project: Project = await neon.projects.get(id);
  return project.name;
}
```

## References

- [Migrate from @neondatabase/api-client](/docs/reference/migrate-api-client-to-sdk)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [`@neon/sdk` README](https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk) — full API tables and regeneration workflow
- [Neon API keys](/docs/manage/api-keys)

<NeedHelp />
