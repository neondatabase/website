---
title: Migrate from @neondatabase/api-client to @neon/sdk
subtitle: Move Platform API automation from the legacy Axios client to the official fetch-based SDK
summary: >-
  Step-by-step migration from @neondatabase/api-client to @neon/sdk: package
  install, createNeonClient, namespace method mapping, error handling, and raw
  layer 1.0 breaking changes. Use this page when updating scripts, CI jobs, or
  apps that call the Neon Platform API with TypeScript.
enableTableOfContents: true
updatedOn: '2026-07-09T23:24:30.287Z'
---

<Admonition type="note" title="@neondatabase/api-client still works">
The legacy [`@neondatabase/api-client`](https://www.npmjs.com/package/@neondatabase/api-client) package continues to work. [`@neon/sdk`](https://www.npmjs.com/package/@neon/sdk) is the recommended replacement for new projects and for teams that want fetch-based, zero-dependency Platform API access with ergonomic workflows.
</Admonition>

This guide maps common `@neondatabase/api-client` patterns to [`@neon/sdk`](/docs/reference/typescript-sdk). For full API coverage, see the [`@neon/sdk` README on GitHub](https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk).

## What changes

|               | `@neondatabase/api-client`                      | `@neon/sdk`                                                              |
| ------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| HTTP client   | Axios                                           | `fetch` (zero runtime dependencies)                                      |
| Factory       | `createApiClient({ apiKey })`                   | `createNeonClient({ apiKey })`                                           |
| Method layout | Flat (`listProjects`, `createProjectBranch`, …) | Namespaced (`neon.projects.list()`, `neon.branches.create()`, …)         |
| Success path  | `response.data` on Axios responses              | `{ data, error }` by default, or bare resource with `throwOnError: true` |
| Errors        | `AxiosError` + `error.response`                 | Typed `NeonError` hierarchy (`kind`: `api`, `not_found`, `auth`, …)      |
| Node.js       | Broader support                                 | **≥ 20.19** (or any runtime with global `fetch`)                         |
| Low-level API | Generated methods on the client                 | `raw.*` functions + `neon.client`                                        |

## Install and swap the package

```bash
npm uninstall @neondatabase/api-client
npm install @neon/sdk
```

Update imports:

```typescript
// Before
import { createApiClient } from '@neondatabase/api-client';

// After
import { createNeonClient } from '@neon/sdk';
```

## Client setup

```typescript
// Before
const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

// After — check { data, error } on each call
const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
});

// After — throw on error (closer to try/catch style)
const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
  throwOnError: true,
});
```

`createNeonClient` also supports `orgId`, `waitForReadiness`, `retries`, `baseUrl`, and a custom `fetch` implementation. See [Neon API TypeScript SDK](/docs/reference/typescript-sdk#client-configuration).

## Method mapping

Common Platform API calls and their `@neon/sdk` equivalents:

| `@neondatabase/api-client`             | `@neon/sdk`                                                                      |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `getCurrentUserOrganizations()`        | `neon.user.organizations()`                                                      |
| `getCurrentUserInfo()`                 | `neon.user.me()`                                                                 |
| `listProjects({ org_id })`             | `neon.projects.list({ org_id })`                                                 |
| `createProject({ project })`           | `neon.projects.create({ name, region_id, … })`                                   |
| `getProject(projectId)`                | `neon.projects.get(projectId)`                                                   |
| `deleteProject(projectId)`             | `neon.projects.delete(projectId)`                                                |
| `listProjectBranches({ projectId })`   | `neon.branches.list(projectId)`                                                  |
| `createProjectBranch(projectId, body)` | `neon.branches.create(projectId, input)` or `neon.branches.createWithCompute(…)` |
| `getConnectionUri(projectId, query)`   | `neon.postgres.connectionString({ projectId, … })`                               |
| `listProjectBranchDatabases(…)`        | `neon.postgres.databases.list(…)`                                                |
| `createProjectBranchDatabase(…)`       | `neon.postgres.databases.create(…)`                                              |
| `listProjectBranchRoles(…)`            | `neon.postgres.roles.list(…)`                                                    |
| `createProjectBranchRole(…)`           | `neon.postgres.roles.create(…)`                                                  |
| `listProjectEndpoints(projectId)`      | `neon.postgres.endpoints.list(projectId)`                                        |
| `listApiKeys()`                        | `neon.apiKeys.list()`                                                            |
| `getActiveRegions()`                   | `neon.regions.list()`                                                            |

Endpoints that are not wrapped in an ergonomic namespace remain available through [`raw`](/docs/reference/typescript-sdk#raw-layer).

## Error handling

**Before** — Axios throws; inspect `error.response`:

```typescript
try {
  const response = await apiClient.getProject(projectId);
  console.log(response.data.project);
} catch (error) {
  // AxiosError — error.response?.status, error.response?.data
}
```

**After** — default `{ data, error }` envelope:

```typescript
const { data: project, error } = await neon.projects.get(projectId);
if (error) {
  if (error.kind === 'not_found') {
    // handle 404
  }
  throw error;
}
console.log(project);
```

**After** — `throwOnError: true` on the client or per call:

```typescript
const neon = createNeonClient({ apiKey, throwOnError: true });
const project = await neon.projects.get(projectId); // throws NeonError on failure
```

## Side-by-side examples

### List projects

```typescript
// Before
const orgs = await apiClient.getCurrentUserOrganizations();
const orgId = orgs.data.organizations[0].id;
const response = await apiClient.listProjects({ org_id: orgId });
console.log(response.data.projects);

// After
const { data: orgs, error: orgsError } = await neon.user.organizations();
if (orgsError) throw orgsError;

const { data: page, error } = await neon.projects.list({ org_id: orgs[0].id });
if (error) throw error;
console.log(page.projects);
```

### Create a project with a connection string

```typescript
// Before
const response = await apiClient.createProject({
  project: { name: 'my-app', region_id: 'aws-us-east-1', pg_version: 17 },
});
const uri = response.data.connection_uris[0].connection_uri;

// After — waits for provisioning and returns a ready connection string
const { data, error } = await neon.projects.createAndConnect({
  name: 'my-app',
  region_id: 'aws-us-east-1',
  pg_version: 17,
});
if (error) throw error;
const { project, connectionString } = data;
```

### Create a branch with compute

```typescript
// Before
import { EndpointType } from '@neondatabase/api-client';

await apiClient.createProjectBranch(projectId, {
  branch: { name: 'dev-1', parent_id: parentBranchId },
  endpoints: [{ type: EndpointType.ReadWrite }],
});

// After
const { data, error } = await neon.branches.createWithCompute(projectId, {
  name: 'dev-1',
  parentId: parentBranchId,
});
if (error) throw error;
const { branch, endpoint, connectionString } = data;
```

### Create a database

```typescript
// Before
await apiClient.createProjectBranchDatabase(projectId, branchId, {
  database: { name: 'mydb', owner_name: 'neondb_owner' },
});

// After
const { error } = await neon.postgres.databases.create(projectId, branchId, {
  name: 'mydb',
  owner_name: 'neondb_owner',
});
if (error) throw error;
```

## Raw layer changes in 1.0

If you adopted `@neon/sdk` **0.x** and used `raw.*` directly, **1.0 changes the raw contract**:

| 0.x                                            | 1.0                                               |
| ---------------------------------------------- | ------------------------------------------------- |
| hey-api `{ data, request, response }` envelope | `{ data, error }` `NeonResult`                    |
| `responseStyle: "data"`                        | **Removed**                                       |
| `throwOnError: true` needed workarounds        | Returns the bare resource; types narrow correctly |

```typescript
// Before (0.x)
const project = await raw.getProject({
  client: neon.client,
  path: { project_id: projectId },
  throwOnError: true,
  responseStyle: 'data',
});

// After (1.0)
const project = await raw.getProject({
  client: neon.client,
  path: { project_id: projectId },
  throwOnError: true,
});
```

Drop any `unwrapRaw` helpers or `responseStyle` usage.

## Types

Import request/response types from `@neon/sdk` instead of `@neondatabase/api-client`:

```typescript
import type { Project, Branch } from '@neon/sdk';
```

Some generated type names changed (for example, `DataAPI*` → `DataApi*`). Endpoint types are string unions (`"read_write"` / `"read_only"`) rather than enums.

## What you gain

- **Workflow helpers** such as `projects.createAndConnect` and `branches.createWithCompute` that poll operations and return connection strings
- **Readiness polling** via `waitForReadiness` and `neon.operations.waitFor`
- **Automatic retries** on safe statuses (`423`, `429`, `503`)
- **Ergonomic beta APIs** for storage, functions, credentials, AI gateway, snapshots, and branch-scoped Neon Auth (`neon.auth`, `neon.storage`, …)
- **Tree-shakeable raw imports** from `@neon/sdk/raw`

## Next steps

- [Neon API TypeScript SDK](/docs/reference/typescript-sdk) — install, configuration, examples, and namespace overview
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) — REST endpoint details
- [`@neon/sdk` on GitHub](https://github.com/neondatabase/neon-pkgs/tree/main/packages/sdk) — full method tables and regeneration notes

<NeedHelp />
