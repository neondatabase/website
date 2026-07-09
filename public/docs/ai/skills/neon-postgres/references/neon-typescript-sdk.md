# Neon TypeScript SDK

The `@neon/sdk` TypeScript SDK is a modern, fetch-based, zero-dependency, typed client for the Neon REST API for managing Neon resources programmatically. It is the successor to `@neondatabase/api-client`.

For core concepts (Organization, Project, Branch, Endpoint, etc.), see `https://neon.com/docs/ai/skills/neon-postgres/references/what-is-neon.md`.

See the [official TypeScript SDK docs](https://neon.com/docs/reference/typescript-sdk.md) for complete details.

## Installation

```bash
npm install @neon/sdk
```

## Authentication

```typescript
import { createNeonClient } from "@neon/sdk";

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });
```

The SDK has two layers: the ergonomic `createNeonClient` (used below, organized into resource namespaces) and `raw` (the full generated 1:1 surface, `import { raw } from "@neon/sdk"`) for any endpoint not wrapped by a namespace.

## The result model

By default every method resolves to a discriminated `{ data, error }` envelope, so no `try/catch` is needed. Pass `throwOnError: true` (on the client or per call) to get the bare resource and throw a typed `NeonError` instead. Mutations can block until their provisioning operations finish with `waitForReadiness: true`.

```typescript
const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
  waitForReadiness: true, // mutations return only once the resource is ready
});
```

## Org-Aware Workflow

All Neon accounts are organization-based. You must discover the user's org first, then pass `org_id` to project operations:

```typescript
// 1. Get the user's organizations
const { data: orgs, error } = await neon.user.organizations();
if (error) throw error;
const orgId = orgs[0].id;

// 2. List projects within the org (the async iterator auto-paginates)
for await (const project of neon.projects.list({ org_id: orgId })) {
  console.log(project.id, project.name);
}
```

You can also set `orgId` once on the client (`createNeonClient({ apiKey, orgId })`) and it is applied to project create/list and as the default transfer source.

## Method Quick Reference

### Projects

| Operation             | Method                                                              |
| --------------------- | ------------------------------------------------------------------- |
| List projects         | `neon.projects.list({ org_id })` (returns a paginated list)         |
| Create project        | `neon.projects.create({ name, pg_version, region_id, org_id })`     |
| Create + connect      | `neon.projects.createAndConnect({ name })` → `{ project, connectionString }` |
| Get project           | `neon.projects.get(projectId)`                                      |
| Update project        | `neon.projects.update(projectId, { name })`                         |
| Delete project        | `neon.projects.delete(projectId)`                                   |
| Transfer projects     | `neon.projects.transfer({ toOrgId, projectIds })`                   |
| Get connection string | `neon.postgres.connectionString({ projectId, databaseName, roleName, pooled })` |

Paginated lists (`list()`) expose `.all()` (every page → `{ data, error }`), `.page()` (one page), and an async iterator (`for await …`, throws on a page error).

### Branches

| Operation            | Method                                                                  |
| -------------------- | ----------------------------------------------------------------------- |
| Create branch        | `neon.branches.create(projectId, { name, parent_id })`                  |
| Create + compute     | `neon.branches.createWithCompute(projectId, { name })` → `{ branch, endpoint, connectionString }` |
| List branches        | `neon.branches.list(projectId)` (paginated)                             |
| Get branch           | `neon.branches.get(projectId, branchId)`                                |
| Update branch        | `neon.branches.update(projectId, branchId, { name })`                   |
| Delete branch        | `neon.branches.delete(projectId, branchId)`                             |
| Resolve default      | `neon.branches.getDefault(projectId)`                                   |
| Set default          | `neon.branches.setDefault(projectId, branchId)`                         |

### Databases

| Operation       | Method                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| Create database | `neon.postgres.databases.create(projectId, branchId, { name, owner_name })` |
| List databases  | `neon.postgres.databases.list(projectId, branchId)`                       |
| Delete database | `neon.postgres.databases.delete(projectId, branchId, databaseName)`       |

### Roles

| Operation      | Method                                                          |
| -------------- | -------------------------------------------------------------- |
| Create role    | `neon.postgres.roles.create(projectId, branchId, { name })`    |
| List roles     | `neon.postgres.roles.list(projectId, branchId)`                |
| Delete role    | `neon.postgres.roles.delete(projectId, branchId, roleName)`    |
| Reveal password| `neon.postgres.roles.password(projectId, branchId, roleName)`  |
| Reset password | `neon.postgres.roles.resetPassword(projectId, branchId, roleName)` |

### Endpoints

| Operation        | Method                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| Create endpoint  | `neon.postgres.endpoints.create(projectId, { branch_id, type })`       |
| List endpoints   | `neon.postgres.endpoints.list(projectId)`                              |
| Get endpoint     | `neon.postgres.endpoints.get(projectId, endpointId)`                   |
| Start endpoint   | `neon.postgres.endpoints.start(projectId, endpointId)`                 |
| Suspend endpoint | `neon.postgres.endpoints.suspend(projectId, endpointId)`               |
| Restart endpoint | `neon.postgres.endpoints.restart(projectId, endpointId)`               |
| Update endpoint  | `neon.postgres.endpoints.update(projectId, endpointId, { ... })`       |
| Delete endpoint  | `neon.postgres.endpoints.delete(projectId, endpointId)`                |

### API Keys

| Operation  | Method                            |
| ---------- | --------------------------------- |
| List keys  | `neon.apiKeys.list()`             |
| Create key | `neon.apiKeys.create(keyName)`    |
| Revoke key | `neon.apiKeys.revoke(keyId)`      |

### Operations

| Operation           | Method                                          |
| ------------------- | ----------------------------------------------- |
| List operations     | `neon.operations.list(projectId)` (paginated)   |
| Get operation       | `neon.operations.get(projectId, operationId)`   |
| Wait for operations | `neon.operations.waitFor(operations)`           |

### Organizations

Only `user.organizations()` is wrapped; the rest of organization management is available via the `raw` layer (pass `neon.client` to reuse auth).

| Operation      | Method                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------- |
| List user orgs | `neon.user.organizations()`                                                                  |
| Get org        | `raw.getOrganization({ client: neon.client, path: { org_id } })`                             |
| List members   | `raw.getOrganizationMembers({ client: neon.client, path: { org_id } })`                      |
| Create org key | `raw.createOrgApiKey({ client: neon.client, path: { org_id }, body: { key_name } })`         |
| Invite member  | `raw.createOrganizationInvitations({ client: neon.client, path: { org_id }, body: { invitations: [...] } })` |

## Error Handling

The `error` channel carries a typed hierarchy (all `Error` subclasses with a `kind` discriminant), so you can branch on `error.kind` instead of inspecting HTTP internals:

```typescript
const { data, error } = await neon.projects.get(projectId);
if (error) {
  // error.kind: "not_found" (404) | "auth" (401/403) | "rate_limit" (429)
  //           | "api" | "operation" | "timeout" | "network" | "client"
  if (error.kind === "not_found") return null;
  console.error("API error:", error.kind, error.message);
  return null;
}
return data;
```

Prefer exceptions? Set `throwOnError: true` and wrap calls in `try/catch` — the same typed `NeonError` is thrown, and return types narrow accordingly. The SDK also retries always-safe statuses (`423`, `429`, `503`) automatically.

## Key Types

All request, response, and error types are re-exported flat from `@neon/sdk` for `import type { … }`:

```typescript
import type { EndpointType, MemberRole, Project, Branch } from "@neon/sdk";

// EndpointType: "read_write" | "read_only"
// MemberRole: "admin" | "member" | "editor" | "viewer" | "collaborator"
```
