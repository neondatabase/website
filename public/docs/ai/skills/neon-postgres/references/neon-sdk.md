# `@neon/sdk` — the TypeScript client for the Neon API

`@neon/sdk` is the official TypeScript client for the [Neon API](https://neon.com/docs/reference/api-reference): **Fetch-based, zero-dependency, ESM-only**, generated from Neon's [OpenAPI spec](https://neon.com/api_spec/release/v2.json) with an ergonomic layer on top. It is the successor to [`@neondatabase/api-client`](https://www.npmjs.com/package/@neondatabase/api-client) (axios-based, generated-only). The old client is **not deprecated** and is safe to keep using, but new code should prefer `@neon/sdk`.

Use this reference when writing typed, programmatic control of Neon resources in TypeScript — provisioning projects, managing branches/databases/endpoints, transferring projects across orgs, snapshots/restore, consumption metrics, and the beta services (Object Storage, Functions, AI Gateway, scoped credentials).

## When to reach for it (vs MCP / CLI)

- **Neon MCP server and CLI** are for **local development** — a coding agent in your editor or terminal.
- **`@neon/sdk`** is for **programmatic integration**: CI/CD pipelines where the CLI isn't enough, non-trivial dev scripts, and full platforms that provision and manage fleets of Neon databases (the same open API behind Replit, Netlify DB, Laravel Cloud, and Vercel's Neon marketplace integration). All it needs is a Neon API key.

## Install

```bash
npm install @neon/sdk
```

Requires Node.js ≥ 20.19, or any runtime with a global `fetch` (Bun, Deno, edge, browser).

## Two layers, one package

```ts
import { createNeonClient, raw } from "@neon/sdk";
```

- **`createNeonClient`** — the high-level ergonomic client: auth once, `{ data, error }` results, typed errors, retries, readiness polling, auto-pagination, and multi-step workflows, organized into resource namespaces (`neon.projects`, `neon.branches`, `neon.postgres`, …).
- **`raw`** — the full generated 1:1 surface: every endpoint as a standalone, tree-shakeable function (also at the `@neon/sdk/raw` subpath). Speaks the **same** `{ data, error }` / `throwOnError` contract as the ergonomic client.

## Quick start

```ts
import { createNeonClient } from "@neon/sdk";

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });

// Create a project and get a ready-to-use connection string in one call.
const { data, error } = await neon.projects.createAndConnect({ name: "my-app" });
if (error) throw error;
const { project, connectionString } = data;
```

## Client configuration

`createNeonClient(config)`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string \| (() => string \| Promise<string>)` | — (required) | Neon API key, or a function returning it. Sent as a Bearer token. |
| `throwOnError` | `boolean` | `false` | `true` → methods return the resource directly and **throw** on error. `false` → return `{ data, error }`. **Narrows return types** at the type level. |
| `waitForReadiness` | `boolean` | `false` | `true` → mutations block until their provisioning `operations` finish, so the returned resource is ready. |
| `wait` | `{ pollIntervalMs?; timeoutMs? }` | `1000` / `300000` | Readiness poller tuning. |
| `retries` | `number` | `2` | Automatic retries on always-safe statuses (`423`, `429`, `503`) with backoff. |
| `orgId` | `string` | — | Default org for project create/list and as the transfer source org. Overridable per call. |
| `baseUrl` | `string` | `https://console.neon.tech/api/v2` | Override the API base URL. |
| `fetch` | `typeof fetch` | global `fetch` | Custom fetch (proxies, tests, non-global runtimes). |

Every option except `apiKey` is also accepted **per call** via the trailing `options` arg (`{ throwOnError?, waitForReadiness?, signal? }`), overriding the client default.

## The result model

By default every method resolves to a discriminated `{ data, error }` envelope — no `try/catch`:

```ts
const { data, error } = await neon.projects.get("late-frost-12345");
if (error) return; // error is a typed NeonError union
data; // narrowed to Project
```

Set `throwOnError` (on the client or per call) to get the bare resource and throw instead — the return type narrows accordingly:

```ts
const neon = createNeonClient({ apiKey, throwOnError: true });
const project = await neon.projects.get("…");                          // Project (throws)
const res     = await neon.projects.get("…", { throwOnError: false }); // { data, error }
```

## Errors

The `error` channel carries a typed hierarchy (all `Error` subclasses with a `kind` discriminant); the same value is thrown when `throwOnError` is set.

| Class | `kind` | Notable fields |
| --- | --- | --- |
| `NeonError` | (base) | `message`, `kind` |
| `NeonApiError` | `"api"` | `status`, `code`, `requestId`, `response`, `body` |
| `NeonNotFoundError` | `"not_found"` | 404 — extends `NeonApiError` |
| `NeonAuthError` | `"auth"` | 401/403 |
| `NeonRateLimitError` | `"rate_limit"` | 429 (after retries) |
| `NeonOperationError` | `"operation"` | `operationId`, `status` — an awaited operation failed |
| `NeonTimeoutError` | `"timeout"` | readiness/wait deadline exceeded |
| `NeonNetworkError` | `"network"` | transport failure (no response) |
| `NeonError` | `"client"` | SDK-side errors (e.g. ambiguous connection-string selection) |

```ts
const { error } = await neon.branches.get(pid, "nope");
if (error?.kind === "not_found") { /* … */ }
```

## Pagination

Cursor-paginated `list()` methods return a lazy `Paginated<T>`:

```ts
const { data: all }  = await neon.projects.list().all();   // every page → { data, error }
const { data: page } = await neon.projects.list().page();  // one page
for await (const project of neon.projects.list()) { … }    // stream; throws on a page error
```

## Readiness & workflows

Neon mutations are asynchronous — they return `operations`. `waitForReadiness` blocks until they settle; the **workflow** methods (`createAndConnect`, `createWithCompute`) default it on and hand back a connection string in one call. The underlying primitive is `neon.operations.waitFor(operations)`.

## API surface (ergonomic client)

Legend: **[P]** returns `Paginated<T>` · **[W]** workflow (multi-step) · **→void** resolves to `void`.

### `neon.projects`

| Method | Returns | Notes |
| --- | --- | --- |
| `list(query?)` | **[P]** `ProjectListItem` | `{ search?, org_id?, limit? }` |
| `get(id)` | `Project` | |
| `create(input?)` | `Project` | `{ name?, region_id?, pg_version?, org_id?, autoscaling_limit_min_cu?, autoscaling_limit_max_cu?, settings? }` |
| `createAndConnect(input?, { pooled? })` | **[W]** `{ project, connectionString }` | one call + readiness; `pooled` default `true` |
| `update(id, input)` | `Project` | `{ name?, settings? }` |
| `delete(id)` | `Project` | |
| `transfer({ fromOrgId?, toOrgId, projectIds })` | **→void** | `fromOrgId` defaults to client `orgId` |
| `transferFromUser({ toOrgId, projectIds })` | **→void** | personal account → org |
| `recover(id)` | `Project` | beta — recover a soft-deleted project |
| `permissions.list / grant / revoke` | `ProjectPermission`(`[]`) | share a project by email |

```ts
// Provision a project and get a pooled connection string in one call
const { data } = await neon.projects.createAndConnect(
  { name: "tenant-42", region_id: "aws-us-east-1" },
  { pooled: true },
); // data: { project, connectionString }

// Upgrade path: move projects from a sponsored (free) org to the paid org
await neon.projects.transfer({
  fromOrgId: sponsoredOrgId, // defaults to the client's `orgId`
  toOrgId: paidOrgId,
  projectIds: ["late-frost-12345"],
});
```

### `neon.branches`

| Method | Returns | Notes |
| --- | --- | --- |
| `list(projectId, query?)` | **[P]** `Branch` | `{ search?, sort_by?, sort_order?, include_deleted? }` |
| `get(projectId, branchId)` | `Branch` | |
| `create(projectId, input?)` | `Branch` | `{ name?, parent_id?, parent_lsn?, parent_timestamp?, protected? }` |
| `update(projectId, branchId, input)` | `Branch` | `{ name?, protected?, expires_at? }` |
| `delete(projectId, branchId)` | **→void** | |
| `createWithCompute(projectId, input, { pooled? })` | **[W]** `{ branch, endpoint, connectionString }` | `input`: `{ name?, parentId?, compute?: { minCu?, maxCu?, suspendTimeoutSeconds? } }` |
| `getDefault(projectId)` / `setDefault(projectId, branchId)` | `Branch` | resolve/set the default branch |
| `recover(projectId, branchId)` | `Branch` | beta — recover within the 7-day window |
| `finalizeRestore(projectId, branchId, { name? }?)` | **→void** | commit a restore previewed with `snapshots.restore` |

```ts
// Branch off the default branch with its own compute — returns a ready connection string
const { data: prod } = await neon.branches.getDefault(projectId);
const { data } = await neon.branches.createWithCompute(projectId, {
  name: "preview/pr-123",
  parentId: prod?.id,
  compute: { minCu: 0.25, maxCu: 2 },
}); // data: { branch, endpoint, connectionString }
```

### `neon.postgres`

The Postgres data plane of a branch. `neon.postgres.connectionString(params, options?)` resolves a URI, **auto-selecting** the default branch and the sole role/database when omitted:

```ts
const { data: uri } = await neon.postgres.connectionString({
  projectId, // branchId?, endpointId?, databaseName?, roleName?, pooled? all optional; pooled default true
});
```

Nested namespaces:

- **`neon.postgres.endpoints`** — `list / get / create / update / delete`, plus `start` / `suspend` / `restart` and `listByBranch(projectId, branchId)`.
- **`neon.postgres.roles`** — `list / get / create / delete`, plus `password(...)` (reveals) and `resetPassword(...)` (rotates; result carries the new password).
- **`neon.postgres.databases`** — `list / get / create / update / delete`.
- **`neon.postgres.dataApi`** — `get / create / update / delete` the branch's Data API.

### Beta services

- **`neon.storage`** — branch object storage. `get(projectId, branchId)` → `BranchStorage`; nested `buckets` (`list / create / delete`) and `objects` (`list / get / delete / deleteByPrefix / presign`). Use `presign(..., { operation: "upload" | "download" })` for direct S3-style transfers.
- **`neon.functions`** — branch Neon Functions. `list` **[P]** `/ get / update / delete`, and `deploy(projectId, branchId, slug, { zip?, runtime?, environment? })` (multipart; poll `get` until `current_deployment.status === "completed"`).
- **`neon.credentials`** — branch scoped credentials. `list / create / revoke`; secrets (`api_token`, `s3_secret_access_key`) are returned **once** on `create`. Scopes: `storage:read`, `storage:write`, `ai_gateway:invoke`, `functions:invoke`.
- **`neon.aiGateway`** — `get(projectId, branchId)` → `BranchAiGateway` (404 when the gateway is not enabled on the branch). See the `neon-ai-gateway` skill for calling the gateway itself.

### `neon.snapshots`

| Method | Returns | Notes |
| --- | --- | --- |
| `list(projectId)` | `Snapshot[]` | |
| `create(projectId, branchId, input?)` | `Snapshot` | `{ name?, timestamp?, lsn?, expiresAt? }` (point-in-time) |
| `update(projectId, snapshotId, input)` | `Snapshot` | `{ name?, expiresAt? }` — `expiresAt: null` clears the TTL |
| `delete(projectId, snapshotId)` | **→void** | |
| `restore(projectId, snapshotId, input?)` | `Branch` | see below |
| `getSchedule` / `setSchedule(projectId, branchId, …)` | `BackupSchedule` / **→void** | |

`restore` input: `{ name?, targetBranchId?, finalize?, preview?, keepOnAbort? }`.
- Restoring **as a new branch** (no `targetBranchId`) finalizes by default → ready to use.
- Restoring **onto an existing branch** doesn't finalize by default, so you can preview first.
- **Transaction-style** `preview`: restores un-finalized, runs your callback, then **finalizes (commit)** on `true` or **deletes the preview branch (abort)** on `false` (unless `keepOnAbort`):

```ts
await neon.snapshots.restore(projectId, snapshotId, {
  targetBranchId,
  preview: async (branch) => (await checks(branch)) === "ok", // true → commit · false → abort
});
```

### `neon.operations` / `neon.consumption` / `neon.apiKeys` / `neon.regions` / `neon.user` / `neon.auth`

- **`operations`** — `list` **[P]** `/ get`, and `waitFor(operations, { pollIntervalMs?, timeoutMs?, signal? })` (the readiness primitive).
- **`consumption`** — cursor-paginated billing metrics: `perProject`, `perProjectV2`, `perBranchV2` (each takes `{ from, to, granularity, project_ids?, org_id? }`; `perBranchV2` requires `project_ids`). Consumption requires a Scale plan or above.
- **`apiKeys`** — `list / create(keyName) / revoke`; the created `key` token is shown **once**.
- **`regions.list()`**, **`user.me()` / `user.organizations()`**.
- **`auth`** — branch-scoped Neon Auth: `get / create / disable / updateConfig`, plus `oauthProviders`, `trustedDomains`, and `users` sub-resources.

## Drop down to the raw client

The ergonomic namespaces don't wrap every endpoint. For anything else, `raw` exposes every endpoint 1:1 — pass `neon.client` so the call reuses the client's auth:

```ts
import { raw } from "@neon/sdk";
// or, for guaranteed tree-shaking: import { getProjectBranchSchema } from "@neon/sdk/raw";

const { data, error } = await raw.getProjectBranchSchema({
  client: neon.client,
  path: { project_id, branch_id },
  query: { db_name: "neondb" }, // db_name is required
});
```

The raw layer speaks the same result contract: `{ data, error }` by default, or pass `throwOnError: true` for the bare resource. All request/response/error **types** are re-exported flat from `@neon/sdk` for `import type { Project, Branch, … }`.

Wait on operations from a raw mutation with the readiness primitive:

```ts
const { data } = await raw.createProjectBranch({
  client: neon.client,
  path: { project_id: projectId },
  body: { branch: { name: "wip" } },
});
const { error } = await neon.operations.waitFor(data!.operations, { timeoutMs: 120_000 });
```

## Migrating from `@neondatabase/api-client`

There's no rush — `@neondatabase/api-client` is not being deprecated. When you do move: swap axios-style `try/catch` for the `{ data, error }` envelope (or set `throwOnError: true` to keep throwing), and replace hand-rolled operation polling with `waitForReadiness` / the workflow methods (`createAndConnect`, `createWithCompute`).

## Further reading

- npm: https://www.npmjs.com/package/@neon/sdk
- Neon TypeScript SDK docs: https://neon.com/docs/reference/typescript-sdk.md
- Neon API reference: https://neon.com/docs/reference/api-reference
- Building a platform on Neon: the `neon-for-agent-platforms` skill (`npx skills add neondatabase/neon-for-agent-platforms`) ships runnable `@neon/sdk` scripts for provisioning, branching, snapshots, project transfer, and consumption metrics.
