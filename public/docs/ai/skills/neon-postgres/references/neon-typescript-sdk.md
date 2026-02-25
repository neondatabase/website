# Neon TypeScript SDK

The `@neondatabase/api-client` TypeScript SDK is a typed wrapper around the Neon REST API for managing Neon resources programmatically.

For core concepts (Organization, Project, Branch, Endpoint, etc.), see `what-is-neon.md`.

See the [official TypeScript SDK docs](https://neon.com/docs/reference/typescript-sdk.md) for complete details.

## Installation

```bash
npm install @neondatabase/api-client
```

## Authentication

```typescript
import { createApiClient } from "@neondatabase/api-client";

const apiClient = createApiClient({ apiKey: process.env.NEON_API_KEY! });
```

## Org-Aware Workflow

All Neon accounts are organization-based. You must discover the user's org first, then pass `org_id` to project operations:

```typescript
// 1. Get the user's organizations
const { data: orgs } = await apiClient.getCurrentUserOrganizations();
const orgId = orgs.organizations[0].id;

// 2. List projects within the org
const { data: projects } = await apiClient.listProjects({ org_id: orgId });
```

## Method Quick Reference

### Projects

| Operation          | Method                                                                          |
| ------------------ | ------------------------------------------------------------------------------- |
| List projects      | `apiClient.listProjects({ org_id })`                                            |
| Create project     | `apiClient.createProject({ project: { name, pg_version, region_id, org_id } })` |
| Get project        | `apiClient.getProject(projectId)`                                               |
| Update project     | `apiClient.updateProject(projectId, { project: { name } })`                     |
| Delete project     | `apiClient.deleteProject(projectId)`                                            |
| Get connection URI | `apiClient.getConnectionUri({ projectId, database_name, role_name, pooled })`   |

### Branches

| Operation     | Method                                                                                  |
| ------------- | --------------------------------------------------------------------------------------- |
| Create branch | `apiClient.createProjectBranch(projectId, { branch: { name }, endpoints: [{ type }] })` |
| List branches | `apiClient.listProjectBranches({ projectId })`                                          |
| Get branch    | `apiClient.getProjectBranch(projectId, branchId)`                                       |
| Update branch | `apiClient.updateProjectBranch(projectId, branchId, { branch: { name } })`              |
| Delete branch | `apiClient.deleteProjectBranch(projectId, branchId)`                                    |

### Databases

| Operation       | Method                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Create database | `apiClient.createProjectBranchDatabase(projectId, branchId, { database: { name, owner_name } })` |
| List databases  | `apiClient.listProjectBranchDatabases(projectId, branchId)`                                      |
| Delete database | `apiClient.deleteProjectBranchDatabase(projectId, branchId, databaseName)`                       |

### Roles

| Operation   | Method                                                                       |
| ----------- | ---------------------------------------------------------------------------- |
| Create role | `apiClient.createProjectBranchRole(projectId, branchId, { role: { name } })` |
| List roles  | `apiClient.listProjectBranchRoles(projectId, branchId)`                      |
| Delete role | `apiClient.deleteProjectBranchRole(projectId, branchId, roleName)`           |

### Endpoints

| Operation        | Method                                                                          |
| ---------------- | ------------------------------------------------------------------------------- |
| Create endpoint  | `apiClient.createProjectEndpoint(projectId, { endpoint: { branch_id, type } })` |
| List endpoints   | `apiClient.listProjectEndpoints(projectId)`                                     |
| Start endpoint   | `apiClient.startProjectEndpoint(projectId, endpointId)`                         |
| Suspend endpoint | `apiClient.suspendProjectEndpoint(projectId, endpointId)`                       |
| Restart endpoint | `apiClient.restartProjectEndpoint(projectId, endpointId)`                       |
| Update endpoint  | `apiClient.updateProjectEndpoint(projectId, endpointId, { endpoint: {...} })`   |
| Delete endpoint  | `apiClient.deleteProjectEndpoint(projectId, endpointId)`                        |

### API Keys

| Operation  | Method                                 |
| ---------- | -------------------------------------- |
| List keys  | `apiClient.listApiKeys()`              |
| Create key | `apiClient.createApiKey({ key_name })` |
| Revoke key | `apiClient.revokeApiKey(keyId)`        |

### Operations

| Operation       | Method                                                  |
| --------------- | ------------------------------------------------------- |
| List operations | `apiClient.listProjectOperations({ projectId })`        |
| Get operation   | `apiClient.getProjectOperation(projectId, operationId)` |

### Organizations

| Operation      | Method                                                                   |
| -------------- | ------------------------------------------------------------------------ |
| List user orgs | `apiClient.getCurrentUserOrganizations()`                                |
| Get org        | `apiClient.getOrganization(orgId)`                                       |
| List members   | `apiClient.getOrganizationMembers(orgId)`                                |
| Create org key | `apiClient.createOrgApiKey(orgId, { key_name, project_id? })`            |
| Invite member  | `apiClient.createOrganizationInvitations(orgId, { invitations: [...] })` |

## Error Handling

```typescript
try {
  const response = await apiClient.getProject(projectId);
  return response.data;
} catch (error: any) {
  if (error.isAxiosError) {
    const status = error.response?.status;
    // 401 = bad API key, 404 = not found, 429 = rate limited
    console.error("API error:", status, error.response?.data?.message);
  }
  return null;
}
```

## Key Types

```typescript
import { EndpointType, MemberRole } from "@neondatabase/api-client";

// EndpointType.ReadWrite, EndpointType.ReadOnly
// MemberRole.Admin, MemberRole.Member
```
