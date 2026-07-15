---
title: Neon Management SDK
subtitle: The official TypeScript SDK for the Neon API. Projects, branches, Postgres, storage, functions, and auth in one typed client.
summary: >-
  @neon/sdk is the official TypeScript SDK for the Neon API, a modern,
  fetch-based replacement for @neondatabase/api-client. It exposes every
  platform resource through ergonomic namespaces on a single client
  (neon.projects, neon.branches, neon.postgres, neon.storage, neon.functions,
  neon.snapshots, neon.auth, and more), with one result contract, typed errors,
  automatic retries, readiness polling, and auto-pagination built in. A raw
  1:1 layer exposes every endpoint and is generated from the Neon OpenAPI spec.
enableTableOfContents: true
updatedOn: '2026-07-15T00:08:00.682Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>The one result contract every method shares</p>
<p>Which namespaces and methods exist</p>
<p>How pagination and async workflows work</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
<a href="/docs/reference/api">Neon API reference</a>
<a href="/docs/reference/migrate-api-client-to-sdk">Migrate from @neondatabase/api-client</a>
<a href="/docs/cli">Neon CLI</a>
</DocsList>

<DocsList title="Source code" theme="repo">
<a href="https://www.npmjs.com/package/@neon/sdk">@neon/sdk on npm</a>
<a href="/api_spec/release/v2.json">OpenAPI spec</a>
</DocsList>
</InfoBlock>

`@neon/sdk` wraps the entire Neon API in one typed, fetch-based client. You authenticate once, then reach every resource through a namespace on `neon.*`: projects, branches, the Postgres data plane, object storage, functions, and Managed Better Auth. Retries, readiness polling, auto-pagination, and typed errors are built in.

It replaces [`@neondatabase/api-client`](https://www.npmjs.com/package/@neondatabase/api-client), the deprecated Axios-based SDK. New projects should use `@neon/sdk`. See the [migration guide](/docs/reference/migrate-api-client-to-sdk) for method mapping and error-handling changes.

<Admonition type="note" title="Not every endpoint has an ergonomic wrapper">
`createNeonClient` namespaces cover common workflows (projects, branches, Postgres resources, snapshots, and more). They do **not** wrap every Platform API operation. For endpoints without a namespace method, use the [`raw` layer](#raw-layer) below or the [Neon API reference](/docs/reference/api).
</Admonition>

```bash
npm install @neon/sdk
```

```ts
import { createNeonClient } from "@neon/sdk";

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });

const { data, error } = await neon.projects.list().all();
if (error) throw error; // typed NeonError
data; // ProjectListItem[]
```

Every method follows this shape: select a namespace, call a method, and receive a `{ data, error }` result. The reference below documents each namespace and method against that single contract.

In the reference tables, the **Returns** column names the resolved resource, the type of `data` on success (or the value returned directly when `throwOnError` is set). A method resolving to `void` has no resource body; [`Paginated`](#lazy-auto-paginated-lists)`<T>` is the lazy, auto-paginated list described below. Every method also accepts an optional trailing options argument (`{ throwOnError?, waitForReadiness?, signal? }`), omitted from the tables for brevity.

Nearly every method needs a `projectId`, and branch-scoped methods also need a `branchId`. Get these from `neon.projects.list()` and `neon.branches.list(projectId)` (or `neon.branches.getDefault(projectId)` for the default branch), reading `.id` off each result.

## Client configuration

`createNeonClient(config)` accepts:

| Option             | Type                                        | Default                            | Purpose                                                                                                      |
| ------------------ | ------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `apiKey`           | `string \| () => string \| Promise<string>` | required                           | Bearer credential. A function is called per request, for short-lived tokens                                  |
| `throwOnError`     | `boolean`                                   | `false`                            | Throw a `NeonError` instead of returning `{ data, error }`. Overridable per call                             |
| `waitForReadiness` | `boolean`                                   | `false`                            | Poll provisioning operations to completion before resolving. Overridable per call                            |
| `wait`             | `{ pollIntervalMs?, timeoutMs? }`           | `1000` / `300000`                  | Tuning for the readiness poller                                                                              |
| `retries`          | `number`                                    | `2`                                | Automatic retries on safe statuses (423, 429, 503)                                                           |
| `baseUrl`          | `string`                                    | `https://console.neon.tech/api/v2` | Override the API base URL                                                                                    |
| `fetch`            | `typeof fetch`                              | global `fetch`                     | Custom fetch, for proxies, tests, or non-global runtimes                                                     |
| `orgId`            | `string`                                    | none                               | Default organization id, applied to project create/list and as the transfer source org. Overridable per call |

```ts
const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
  orgId: "org-cool-forest-12345678",
  throwOnError: true,
});
```

## Core model

Four behaviors are shared by every method: the result envelope, typed errors, pagination, and async workflows.

### The result envelope

By default, no `try/catch`. Each call resolves to a discriminated `{ data, error }` envelope; check `error`, then `data` is narrowed:

```ts
const { data, error } = await neon.projects.get("late-frost-12345");
if (error) return; // error: typed NeonError union
data; // narrowed to Project
```

To throw instead, set `throwOnError` on the client (or per call). The return type narrows to the bare resource:

```ts
const neon = createNeonClient({ apiKey, throwOnError: true });
const project = await neon.projects.get("my-project"); // Project (throws on error)
const { data } = await neon.projects.get("my-project", { throwOnError: false }); // opt out per call
```

### Typed errors

The error channel, and what `throwOnError` throws, is one hierarchy of `Error` subclasses, discriminated on `kind`:

| kind         | Class                | Raised when                                                     |
| ------------ | -------------------- | --------------------------------------------------------------- |
| `api`        | `NeonApiError`       | Non-2xx response; carries `status`, `code`, `requestId`, `body` |
| `not_found`  | `NeonNotFoundError`  | 404 (extends `NeonApiError`)                                    |
| `auth`       | `NeonAuthError`      | 401 or 403                                                      |
| `rate_limit` | `NeonRateLimitError` | 429, after retries                                              |
| `operation`  | `NeonOperationError` | An awaited operation failed; carries `operationId`, `status`    |
| `timeout`    | `NeonTimeoutError`   | A readiness or wait deadline was exceeded                       |
| `network`    | `NeonNetworkError`   | Transport failure, no response received                         |
| `client`     | `NeonError`          | SDK-side error, such as ambiguous connection-string selection   |

```ts
const { error } = await neon.branches.get(projectId, "nope");
if (error?.kind === "not_found") {
  // handle the 404
}
```

### Lazy, auto-paginated lists

Methods labeled Paginated return a [`Paginated`](#lazy-auto-paginated-lists)`<T>`; the cursor is managed for you:

```ts
const { data: all } = await neon.projects.list().all(); // every page
const { data: one } = await neon.projects.list().page(); // just the first page
for await (const project of neon.projects.list()) {
  // stream item by item
}
```

### Async workflows

Neon mutations return operations that complete in the background. A few convenience methods, noted as "creates, then polls until ready" in the reference below (`projects.createAndConnect`, `branches.createWithCompute`), do this polling for you and hand back a ready-to-use result, such as a connection string, in a single call. The primitive underneath is `neon.operations.waitFor(operations)`.

On any namespaced mutation, pass `{ waitForReadiness: true }` as the trailing options argument to poll before the call resolves:

```ts
const { data, error } = await neon.branches.create(
  projectId,
  { name: "preview" },
  { waitForReadiness: true }
);
if (error) throw error;
data; // Branch — provisioning finished
```

For raw API calls that return an `operations` array, use [`neon.operations.waitFor`](#neonoperations) instead.

## Namespaces

The client groups the API into resource namespaces. Projects and branches are the core surfaces: [`projects`](#neonprojects) create, manage, and share projects, and [`branches`](#neonbranches) branch a project's data and schema. The Postgres data plane lives under [`postgres`](#neonpostgres): compute endpoints, roles, databases, the Data API, and connection strings.

Branch-scoped platform services include [`storage`](#neonstorage) (S3-compatible object storage), [`functions`](#neonfunctions), [`credentials`](#neoncredentials), [`aiGateway`](#neonaigateway), and [`auth`](#neonauth) (Managed Better Auth, OAuth providers, and users). For data lifecycle and async work, use [`snapshots`](#neonsnapshots) for point-in-time snapshots and restore, and [`operations`](#neonoperations) to poll asynchronous operations.

Account-level surfaces round out the client: [`consumption`](#neonconsumption) for billing metrics, [`apiKeys`](#neonapikeys), and [`regions` / `user`](#neonregions--user).

## neon.projects

Create, manage, and share Neon projects. One API call per method; `list` is paginated. <small>REST: [Projects API](/docs/reference/api/projects)</small>

| Method                            | Returns                                                      | Arguments                                                                                                               |
| --------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `list(query?)`                    | [`Paginated`](#lazy-auto-paginated-lists)`<ProjectListItem>` | `query`: `{ search?, org_id?, limit? }`                                                                                 |
| `get(id)`                         | `Project`                                                    |                                                                                                                         |
| `create(input?)`                  | `Project`                                                    | `input`: `{ name?, region_id?, pg_version?, org_id?, autoscaling_limit_min_cu?, autoscaling_limit_max_cu?, settings? }` |
| `createAndConnect(input?, opts?)` | `{ project: Project, connectionString: string }`             | Creates, then polls until ready. `opts`: `{ pooled? }` (default `true`)                                                 |
| `update(id, input)`               | `Project`                                                    | `input`: `{ name?, settings? }`                                                                                         |
| `delete(id)`                      | `Project`                                                    |                                                                                                                         |
| `recover(id)`                     | `Project`                                                    | Recover a soft-deleted project within its retention window                                                              |
| `transfer(input)`                 | `void`                                                       | `input`: `{ fromOrgId?, toOrgId, projectIds }` (`fromOrgId` defaults to the client `orgId`)                             |
| `transferFromUser(input)`         | `void`                                                       | `input`: `{ toOrgId, projectIds }`                                                                                      |

```ts
// Provision a project, poll until ready, return a pooled connection string
const { data } = await neon.projects.createAndConnect(
  { name: "tenant-42", region_id: "aws-us-east-1" },
  { pooled: true }
);
// data: { project, connectionString }
```

### neon.projects.permissions

Share a project with additional users by email.

| Method                            | Returns               |
| --------------------------------- | --------------------- |
| `list(projectId)`                 | `ProjectPermission[]` |
| `grant(projectId, email)`         | `ProjectPermission`   |
| `revoke(projectId, permissionId)` | `ProjectPermission`   |

## neon.branches

Branch a project's data and schema; optionally attach compute in one workflow. <small>REST: [Branches API](/docs/reference/api/branches)</small>

| Method                                         | Returns                                                            | Arguments                                                                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `list(projectId, query?)`                      | [`Paginated`](#lazy-auto-paginated-lists)`<Branch>`                | `query`: `{ search?, sort_by?, sort_order?, include_deleted? }`                                                        |
| `get(projectId, branchId)`                     | `Branch`                                                           |                                                                                                                        |
| `create(projectId, input?)`                    | `Branch`                                                           | `input`: `{ name?, parent_id?, parent_lsn?, parent_timestamp?, protected? }`                                           |
| `createWithCompute(projectId, input, opts?)`   | `{ branch: Branch, endpoint: Endpoint, connectionString: string }` | Creates, then polls until ready. `input`: `{ name?, parentId?, compute?: { minCu?, maxCu?, suspendTimeoutSeconds? } }` |
| `update(projectId, branchId, input)`           | `Branch`                                                           | `input`: `{ name?, protected?, expires_at? }`                                                                          |
| `delete(projectId, branchId)`                  | `void`                                                             |                                                                                                                        |
| `getDefault(projectId)`                        | `Branch`                                                           | Resolve the project's default branch by flag, not by name                                                              |
| `setDefault(projectId, branchId)`              | `Branch`                                                           |                                                                                                                        |
| `recover(projectId, branchId)`                 | `Branch`                                                           | Recover a soft-deleted branch within the 7-day window                                                                  |
| `finalizeRestore(projectId, branchId, input?)` | `void`                                                             | Commit a restore previewed with `snapshots.restore({ finalize: false })`                                               |

```ts
// Branch off the default ("production") branch with its own compute
const { data: prod } = await neon.branches.getDefault(projectId);
const { data } = await neon.branches.createWithCompute(projectId, {
  name: "preview/pr-123",
  parentId: prod?.id,
  compute: { minCu: 0.25, maxCu: 2 },
});
// data: { branch, endpoint, connectionString }
```

## neon.postgres

The Postgres data plane of a branch: compute endpoints, roles, databases, the Data API, and a connection-string helper. <small>REST: [Endpoints](/docs/reference/api/endpoints), [Branches](/docs/reference/api/branches), [Data API](/docs/reference/api/dataapi)</small>

| Method                     | Returns  | Arguments                                                                                                                                                                                                                                                                                    |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connectionString(params)` | `string` | `params`: `{ projectId, branchId?, endpointId?, databaseName?, roleName?, pooled? }`. Only `projectId` is required; branch defaults to the project default, endpoint to the read-write one, and role/database are auto-selected when the branch has exactly one. `pooled` defaults to `true` |

```ts
const { data: uri } = await neon.postgres.connectionString({ projectId });
```

### neon.postgres.endpoints

Compute endpoints, scoped to a project.

| Method                                 | Returns      | Arguments                                                                                                                                                               |
| -------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list(projectId)`                      | `Endpoint[]` |                                                                                                                                                                         |
| `listByBranch(projectId, branchId)`    | `Endpoint[]` |                                                                                                                                                                         |
| `get(projectId, endpointId)`           | `Endpoint`   |                                                                                                                                                                         |
| `create(projectId, input)`             | `Endpoint`   | `input`: `{ branch_id, type, autoscaling_limit_min_cu?, autoscaling_limit_max_cu?, suspend_timeout_seconds?, provisioner? }`. `type` is `"read_write"` \| `"read_only"` |
| `update(projectId, endpointId, input)` | `Endpoint`   |                                                                                                                                                                         |
| `delete(projectId, endpointId)`        | `void`       |                                                                                                                                                                         |
| `start(projectId, endpointId)`         | `Endpoint`   |                                                                                                                                                                         |
| `suspend(projectId, endpointId)`       | `Endpoint`   |                                                                                                                                                                         |
| `restart(projectId, endpointId)`       | `Endpoint`   |                                                                                                                                                                         |

### neon.postgres.roles

Postgres roles, scoped to a branch.

| Method                                     | Returns  | Arguments                                      |
| ------------------------------------------ | -------- | ---------------------------------------------- |
| `list(projectId, branchId)`                | `Role[]` |                                                |
| `get(projectId, branchId, name)`           | `Role`   |                                                |
| `create(projectId, branchId, input)`       | `Role`   | `input`: `{ name, no_login? }`                 |
| `delete(projectId, branchId, name)`        | `void`   |                                                |
| `password(projectId, branchId, name)`      | `string` | Reveals the current password                   |
| `resetPassword(projectId, branchId, name)` | `Role`   | The returned `Role` carries the new `password` |

```ts
// Reveal a role's password, or rotate it
const { data: password } = await neon.postgres.roles.password(projectId, branchId, "neondb_owner");
const { data: role } = await neon.postgres.roles.resetPassword(projectId, branchId, "neondb_owner");
// role.password holds the new secret
```

### neon.postgres.databases

Databases, scoped to a branch.

| Method                                     | Returns      | Arguments                         |
| ------------------------------------------ | ------------ | --------------------------------- |
| `list(projectId, branchId)`                | `Database[]` |                                   |
| `get(projectId, branchId, name)`           | `Database`   |                                   |
| `create(projectId, branchId, input)`       | `Database`   | `input`: `{ name, owner_name }`   |
| `update(projectId, branchId, name, input)` | `Database`   | `input`: `{ name?, owner_name? }` |
| `delete(projectId, branchId, name)`        | `void`       |                                   |

### neon.postgres.dataApi

The Neon Data API, scoped to a branch and database.

| Method                                              | Returns                 |
| --------------------------------------------------- | ----------------------- |
| `get(projectId, branchId, databaseName)`            | `DataApiResponse`       |
| `create(projectId, branchId, databaseName, input?)` | `DataApiCreateResponse` |
| `update(projectId, branchId, databaseName, input?)` | `void`                  |
| `delete(projectId, branchId, databaseName)`         | `void`                  |

## neon.storage

Branch-scoped, S3-compatible object storage. `get` returns whether storage is enabled and the branch's S3 endpoint metadata; buckets and objects are nested underneath. <small>REST: [Storage](/docs/reference/api/storage), [Buckets](/docs/reference/api/buckets)</small>

| Method                     | Returns         |
| -------------------------- | --------------- |
| `get(projectId, branchId)` | `BranchStorage` |

### neon.storage.buckets

| Method                                    | Returns    | Arguments                                                                                  |
| ----------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| `list(projectId, branchId)`               | `Bucket[]` |                                                                                            |
| `create(projectId, branchId, input)`      | `Bucket`   | `input`: `{ name, access_level? }`, where `access_level` is `"private"` \| `"public_read"` |
| `delete(projectId, branchId, bucketName)` | `void`     |                                                                                            |

### neon.storage.objects

| Method                                                       | Returns                     | Arguments                                                                                                    |
| ------------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `list(projectId, branchId, bucketName, query?)`              | `BucketObjectsListResponse` | `query`: `{ prefix?, delimiter?, cursor?, limit? }`. Returns one page of `folders`, `objects`, `next_cursor` |
| `get(projectId, branchId, bucketName, objectKey)`            | `Blob`                      | Raw object bytes                                                                                             |
| `delete(projectId, branchId, bucketName, objectKey)`         | `void`                      |                                                                                                              |
| `deleteByPrefix(projectId, branchId, bucketName, prefix)`    | `{ deleted: number }`       | `prefix` must end with `/`                                                                                   |
| `presign(projectId, branchId, bucketName, objectKey, input)` | `PresignResponse`           | `input`: `{ operation: "upload" \| "download", content_type?, expires_in_seconds? }`                         |

```ts
// Upload via a presigned PUT
const { data: presign } = await neon.storage.objects.presign(
  projectId, branchId, "avatars", "user-1.png",
  { operation: "upload", content_type: "image/png" }
);
if (!presign) throw new Error("presign failed");

await fetch(presign.url, {
  method: "PUT",
  headers: { ...presign.headers, "Content-Length": String(bytes.length) },
  body: bytes,
});
```

## neon.functions

Branch-scoped Neon Functions. <small>REST: [Functions API](/docs/reference/api/functions)</small>

| Method                                      | Returns                                                   | Arguments                                                                                                                                                |
| ------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list(projectId, branchId, query?)`         | [`Paginated`](#lazy-auto-paginated-lists)`<NeonFunction>` | `query`: `{ limit? }`                                                                                                                                    |
| `get(projectId, branchId, slug)`            | `NeonFunction`                                            |                                                                                                                                                          |
| `update(projectId, branchId, slug, input)`  | `NeonFunction`                                            | `input`: `{ name? }`                                                                                                                                     |
| `delete(projectId, branchId, slug)`         | `void`                                                    |                                                                                                                                                          |
| `deploy(projectId, branchId, slug, input?)` | `NeonFunctionDeployment`                                  | Multipart. `input`: `{ zip?: Blob \| File, runtime?: "nodejs24", environment?: string }`, where `environment` is a JSON-encoded `Record<string, string>` |

```ts
// Deploy a bundled index.mjs inside a zip (first deploy must include the zip)
const zip = await Bun.file("bundle.zip").arrayBuffer();
const { data: deployment } = await neon.functions.deploy(projectId, branchId, "api", {
  zip: new File([zip], "bundle.zip", { type: "application/zip" }),
  runtime: "nodejs24",
});
// Poll neon.functions.get until current_deployment.status is "completed"
```

## neon.credentials

Branch-scoped credentials with explicit scopes. Secrets (`api_token`, `s3_secret_access_key`) are returned once, on `create`. <small>REST: [Credentials API](/docs/reference/api/credentials)</small>

| Method                                 | Returns                    | Arguments                                                                                                                              |
| -------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `list(projectId, branchId)`            | `CredentialMeta[]`         |                                                                                                                                        |
| `create(projectId, branchId, input)`   | `CreateCredentialResponse` | `input`: `{ name?, scopes, principal_type: "user" }`. Scopes: `storage:read`, `storage:write`, `ai_gateway:invoke`, `functions:invoke` |
| `revoke(projectId, branchId, tokenId)` | `void`                     |                                                                                                                                        |

## neon.aiGateway

Branch-scoped AI Gateway endpoint metadata. <small>REST: [AI Gateway API](/docs/reference/api/ai-gateway)</small>

| Method                     | Returns           | Arguments                                                |
| -------------------------- | ----------------- | -------------------------------------------------------- |
| `get(projectId, branchId)` | `BranchAiGateway` | Returns 404 when AI Gateway is not enabled on the branch |

## neon.snapshots

Point-in-time snapshots, restore, and backup schedules. <small>REST: [Snapshots API](/docs/reference/api/snapshots)</small>

| Method                                       | Returns          | Arguments                                                                           |
| -------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `list(projectId)`                            | `Snapshot[]`     |                                                                                     |
| `create(projectId, branchId, input?)`        | `Snapshot`       | `input`: `{ name?, timestamp?, lsn?, expiresAt? }`                                  |
| `update(projectId, snapshotId, input)`       | `Snapshot`       | `input`: `{ name? }`                                                                |
| `delete(projectId, snapshotId)`              | `void`           |                                                                                     |
| `restore(projectId, snapshotId, input?)`     | `Branch`         | `input`: `{ name?, targetBranchId?, finalize?, preview?, keepOnAbort? }`. See below |
| `getSchedule(projectId, branchId)`           | `BackupSchedule` |                                                                                     |
| `setSchedule(projectId, branchId, schedule)` | `void`           |                                                                                     |

`restore` behaves differently depending on the target:

- As a new branch (no `targetBranchId`), it finalizes by default and is ready to use immediately.
- Onto an existing branch, it does not finalize by default, so you can preview first.
- Transaction-style with `preview`: it restores un-finalized, runs your callback against the restored branch, then commits if the callback returns `true` or aborts (deletes the preview branch) if `false`, unless `keepOnAbort` is set:

```ts
await neon.snapshots.restore(projectId, snapshotId, {
  targetBranchId,
  preview: async (branch) => (await checks(branch)) === "ok", // true commits, false aborts
});
```

## neon.operations

Read operations and wait for them to finish. <small>REST: [Operations API](/docs/reference/api/operations)</small>

| Method                          | Returns                                                | Arguments                                             |
| ------------------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `list(projectId)`               | [`Paginated`](#lazy-auto-paginated-lists)`<Operation>` |                                                       |
| `get(projectId, operationId)`   | `Operation`                                            |                                                       |
| `waitFor(operations, options?)` | `void`                                                 | `options`: `{ pollIntervalMs?, timeoutMs?, signal? }` |

```ts
// Wait on operations from a raw call (or when readiness polling is off)
const { data } = await raw.createProjectBranch({
  client: neon.client,
  path: { project_id: projectId },
  body: { branch: { name: "wip" } },
});
const { error } = await neon.operations.waitFor(data!.operations, { timeoutMs: 120_000 });
```

## neon.auth

Branch-scoped Managed Better Auth. The legacy project-scoped endpoints are deprecated and remain raw-only. <small>REST: [Authentication API](/docs/reference/api/auth)</small>

| Method                                     | Returns                             | Arguments                  |
| ------------------------------------------ | ----------------------------------- | -------------------------- |
| `get(projectId, branchId)`                 | `NeonAuthIntegration`               |                            |
| `create(projectId, branchId, input)`       | `NeonAuthCreateIntegrationResponse` | Enable the integration     |
| `disable(projectId, branchId, input?)`     | `void`                              | `input`: `{ deleteData? }` |
| `updateConfig(projectId, branchId, input)` | `NeonAuthConfigResponse`            |                            |

### neon.auth.oauthProviders

OAuth providers (Google, GitHub, and others).

| Method                                           | Returns                   |
| ------------------------------------------------ | ------------------------- |
| `list(projectId, branchId)`                      | `NeonAuthOauthProvider[]` |
| `add(projectId, branchId, input)`                | `NeonAuthOauthProvider`   |
| `update(projectId, branchId, providerId, input)` | `NeonAuthOauthProvider`   |
| `delete(projectId, branchId, providerId)`        | `void`                    |

### neon.auth.trustedDomains

The redirect-URI whitelist.

| Method                               | Returns                                |
| ------------------------------------ | -------------------------------------- |
| `list(projectId, branchId)`          | `NeonAuthRedirectUriWhitelistDomain[]` |
| `add(projectId, branchId, input)`    | `void`                                 |
| `delete(projectId, branchId, input)` | `void`                                 |

### neon.auth.users

| Method                                               | Returns                          |
| ---------------------------------------------------- | -------------------------------- |
| `create(projectId, branchId, input)`                 | `NeonAuthCreateNewUserResponse`  |
| `delete(projectId, branchId, authUserId)`            | `void`                           |
| `updateRole(projectId, branchId, authUserId, roles)` | `UpdateNeonAuthUserRoleResponse` |

## neon.consumption

Cursor-paginated billing metrics. Each method takes `{ from, to, granularity, org_id, project_ids? }`, where `from`/`to` are ISO timestamps, `granularity` is `"hourly"` \| `"daily"` \| `"monthly"`, and `org_id` names the org to report on; `perBranchV2` also requires `project_ids`. Consumption requires a Scale plan or above. <small>REST: [Consumption API](/docs/reference/api/consumption)</small>

| Method                | Returns                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| `perProject(query)`   | [`Paginated`](#lazy-auto-paginated-lists)`<ConsumptionHistoryPerProject>`   |
| `perProjectV2(query)` | [`Paginated`](#lazy-auto-paginated-lists)`<ConsumptionHistoryPerProjectV2>` |
| `perBranchV2(query)`  | [`Paginated`](#lazy-auto-paginated-lists)`<ConsumptionHistoryPerBranchV2>`  |

```ts
// Stream every project's daily usage across a range
for await (const project of neon.consumption.perProject({
  from: "2026-06-01T00:00:00Z",
  to: "2026-06-30T00:00:00Z",
  granularity: "daily",
  org_id: "org-...", // the org to report on; consumption requires a Scale plan or above
})) {
  console.log(project);
}
```

## neon.apiKeys

Manage account-level API keys. <small>REST: [API Keys API](/docs/reference/api/api-keys)</small>

| Method            | Returns                     | Arguments                     |
| ----------------- | --------------------------- | ----------------------------- |
| `list()`          | `ApiKeysListResponseItem[]` |                               |
| `create(keyName)` | `ApiKeyCreateResponse`      | The `key` token is shown once |
| `revoke(keyId)`   | `ApiKeyRevokeResponse`      |                               |

## neon.regions / neon.user

Active regions and the current account. <small>REST: [Regions](/docs/reference/api/regions), [Users](/docs/reference/api/users)</small>

| Method                 | Returns                   |
| ---------------------- | ------------------------- |
| `regions.list()`       | `RegionResponse[]`        |
| `user.me()`            | `CurrentUserInfoResponse` |
| `user.organizations()` | `Organization[]`          |

## Raw layer

Anything not wrapped above is available as a raw, 1:1 function. Pass `neon.client` to reuse the client's auth and base URL:

```ts
import { raw } from "@neon/sdk";
// or, for guaranteed tree-shaking: import { getProjectBranchSchema } from "@neon/sdk/raw";

const { data, error } = await raw.getProjectBranchSchema({
  client: neon.client,
  path: { project_id, branch_id },
  query: { db_name: "neondb" }, // db_name is required
});
```

The raw layer speaks the same result contract as the ergonomic client: `{ data, error }` by default, or the bare resource (throwing the typed `NeonError`) with `throwOnError: true`. There is no `responseStyle` switch. Every request, response, and error type is re-exported flat from `@neon/sdk` for `import type { Project, Branch }` and the rest.

## How this SDK is built

The raw layer and all request, response, and error types are generated from the [Neon OpenAPI spec](/api_spec/release/v2.json) using [`@hey-api/openapi-ts`](https://heyapi.dev). The ergonomic namespaces documented above are hand-written on top of that generated layer. When the API adds an endpoint, it appears in the raw layer automatically; the namespace wrappers are added deliberately. The source lives in [`neondatabase/neon-pkgs`](https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk).
