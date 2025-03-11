---
title: TypeScript SDK for the Neon API
enableTableOfContents: true
updatedOn: '2025-02-28T12:08:12.273Z'
---

<InfoBlock>

<DocsList title="What you will learn:">
<p>What is the Neon TypeScript SDK</p>
<p>How to get started</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/reference/api-reference">Neon API Reference</a>
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://www.npmjs.com/package/@neondatabase/api-client">@neondatabase/api-client on npm</a>
</DocsList>

</InfoBlock>

## About the SDK

Neon supports the [@neondatabase/api-client](https://www.npmjs.com/package/@neondatabase/api-client) library, which is a wrapper for the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). The SDK provides a convenient way to interact with the Neon API using TypeScript.

You can use the Neon TypeScript SDK to manage your Neon projects, branches, databases, compute endpoints, roles, and more programmatically. The SDK abstracts the underlying API requests, authentication, and error handling, allowing you to focus on building applications that interact with Neon resources.

The Neon TypeScript SDK allows you to manage:

- [**API Keys:**](/docs/manage/api-keys) Create, list, and revoke API keys for secure access to the Neon API.
- [**Projects:**](/docs/manage/projects) Create, list, update, and delete Neon projects.
- [**Branches:**](/docs/manage/branches) Manage branches, including creation, deletion, restoration, and schema management.
- [**Databases:**](/docs/manage/databases) Create, list, update, and delete databases within your branches.
- [**Compute Endpoints:**](/docs/manage/endpoints) Manage compute endpoints, including creation, scaling, suspension, and restart.
- [**Roles:**](/docs/manage/roles) Create, list, update, and delete Postgres roles within your branches.
- [**Operations:**](/docs/manage/operations) Monitor and track the status of asynchronous operations performed on your Neon resources.
- [**Organizations:**](/docs/manage/orgs-api) Manage organization settings, API keys, and members (for Neon organizational accounts).
- [**Consumption Metrics:**](/docs/guides/partner-consumption-metrics) Retrieve usage metrics for your account and projects to monitor resource consumption.

## Quick Start

This guide walks you through installing the SDK, setting up authentication, and executing your first API call to retrieve a list of your Neon projects.

### Installation

Install the `@neondatabase/api-client` package into your project using your preferred package manager:

<CodeTabs labels={["npm", "yarn", "pnpm"]}>

```bash
npm install @neondatabase/api-client
```

```bash
yarn add @neondatabase/api-client
```

```bash
pnpm add @neondatabase/api-client
```

</CodeTabs>

### Authentication Setup

Authentication with the Neon API is handled through API keys. Follow these steps to obtain and configure your API key:

- Log in to the [Neon Console](https://console.neon.tech/)
- Navigate to [Account settings > API keys](https://console.neon.tech/app/settings/api-keys).
- Click Generate new API key.
- Enter a descriptive Name (e.g., "neon-typescript-sdk-demo") for your key and click Create.

For this quick start, we'll set the API key as an environment variable:

```bash
export NEON_API_KEY="YOUR_API_KEY_FROM_NEON_CONSOLE"
```

Replace "YOUR_API_KEY_FROM_NEON_CONSOLE" with the API key you copied from the Neon Console.

## Examples

Let's create a simple TypeScript file to list your Neon projects using the SDK.

### List Projects

Create a new file named `list-projects.ts` in your project directory and add the following code:

```typescript
import { createApiClient } from '@neondatabase/api-client';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function listNeonProjects() {
  try {
    const response = await apiClient.listProjects({});
    console.log(response.data.projects);
  } catch (error) {
    console.error('Error listing projects:', error);
  }
}

listNeonProjects();
```

Execute the TypeScript file using [`tsx`](https://tsx.is) (or compile to JavaScript and run with `node`)

```bash
tsx list-projects.ts
```

If your API key is correctly configured, you should see a list of your Neon projects printed to your console, similar to this:

```json
[
  {
    "id": "wandering-heart-70814840",
    "platform_id": "aws",
    "region_id": "aws-sa-east-1",
    "name": "test-project",
    "provisioner": "k8s-neonvm",
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.25,
      "suspend_timeout_seconds": 0
    },
    "settings": {
      "allowed_ips": [Object],
      "enable_logical_replication": false,
      "maintenance_window": [Object],
      "block_public_connections": false,
      "block_vpc_connections": false
    },
    "pg_version": 16,
    "proxy_host": "sa-east-1.aws.neon.tech",
    "branch_logical_size_limit": 512,
    "branch_logical_size_limit_bytes": 536870912,
    "store_passwords": true,
    "active_time": 304,
    "cpu_used_sec": 78,
    "creation_source": "console",
    "created_at": "2025-02-28T07:14:35Z",
    "updated_at": "2025-02-28T07:54:53Z",
    "synthetic_storage_size": 34149464,
    "quota_reset_at": "2025-03-01T00:00:00Z",
    "owner_id": "91cbdacd-06c2-49f5-bacf-78b9463c81ca",
    "compute_last_active_at": "2025-02-28T07:54:49Z"
  }, ..
]
```

### Create a Project

You can use the SDK to create a new Neon project. Here's an example of how to create a project and retrieve the connection string:

```typescript
import { createApiClient } from '@neondatabase/api-client';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function createNeonProject(projectName: string) {
  try {
    const response = await apiClient.createProject({
      project: {
        name: projectName,
        region_id: 'aws-us-east-1',
        pg_version: 17,
      },
    });
    console.log('Project created:', response.data.project);
    console.log('Project ID:', response.data.project.id);
    console.log('Database connection string:', response.data.connection_uris[0].connection_uri);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Example usage: Create a project named "test-project"
createNeonProject('test-project').catch((error) => {
  console.error('Error creating project:', error.message);
});
```

#### Key points:

- The `region_id` parameter specifies the cloud region where the project will be hosted. You can find the list of supported regions at [Neon Regions](https://neon.tech/docs/introduction/regions).
- The `pg_version` parameter specifies the major version of Postgres to use in the project. The currently supported versions are `14`, `15`, `16`, and `17`.

### Create a Branch

You can use the SDK to create a new branch within a Neon project. Here's an example of how to create a branch:

```typescript
import { createApiClient, EndpointType } from '@neondatabase/api-client';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function createNeonBranch(projectId: string, branchName: string, parentBranchId?: string) {
  try {
    const response = await apiClient.createProjectBranch(projectId, {
      branch: {
        name: branchName,
        parent_id: parentBranchId, // Optional: Specify a source branch. If omitted, the default branch will be used
      },
      endpoints: [
        {
          type: EndpointType.ReadWrite, // If you need read-only access, use EndpointType.ReadOnly,
          // Optional: Specify the number of compute units (CU) for the endpoint. If omitted, the default value is 0.25 for both min and max.
          // autoscaling_limit_min_cu: 0.25,
          // autoscaling_limit_max_cu: 1,
        },
      ],
    });
    console.log('Branch created:', response.data.branch);
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
}

// Example usage: Create a branch named "dev-1" in the project with ID "your-project-id"
createNeonBranch('your-project-id', 'dev-1').catch((error) => {
  console.error('Error creating branch:', error.message);
});
```

#### Key points:

- `parent_id` (optional): Specifies the branch to branch from. If omitted, the project's default branch is used.
- `EndpointType`: Enum to define endpoint type (`ReadWrite` or `ReadOnly`).
- Compute Unit (CU) customization (optional): Control compute size using `autoscaling_limit_min_cu` and `autoscaling_limit_max_cu`. Refer to [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) for available options.

### List Branches

You can use the SDK to list branches within a Neon project. Here's an example of how to list branches:

```typescript
import { createApiClient } from '@neondatabase/api-client';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function listNeonBranches(projectId: string) {
  try {
    const response = await apiClient.listProjectBranches({ projectId });
    console.log('Branches:', response.data.branches);
  } catch (error) {
    console.error('Error listing branches:', error);
    throw error;
  }
}

// Example usage: List branches in the project with ID "your-project-id"
listNeonBranches('your-project-id').catch((error) => {
  console.error('Error listing branches:', error.message);
});
```

#### Key points:

- The `projectId` parameter specifies the ID of the project for which you want to list branches.
- The `listProjectBranches` method returns a list of branches within the specified project. Each branch object contains details like `id`, `name`, `created_at`, and more.

### Create a Database

You can use the SDK to create a new database within a Neon branch. Here's an example of how to create a database:

```typescript
import { createApiClient } from '@neondatabase/api-client';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function createNeonDatabase(
  projectId: string,
  branchId: string,
  databaseName: string,
  databaseOwner: string
) {
  try {
    const response = await apiClient.createProjectBranchDatabase(projectId, branchId, {
      database: {
        name: databaseName,
        owner_name: databaseOwner,
      },
    });
    console.log('Database created:', response.data.database);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}

// Example usage: In the project with ID "your-project-id", create a database named "mydatabase" in the branch with ID "your-branch-id" and owner "neondb_owner"
createNeonDatabase('your-project-id', 'your-branch-id', 'mydatabase', 'neondb_owner').catch(
  (error) => {
    console.error('Error creating database:', error.message);
  }
);
```

- The `owner_name` parameter specifies the owner of the database. Ensure this role exists in the branch beforehand.
- Branch & Project IDs: You can obtain these IDs from the [Neon Console](/docs/manage/branches#view-branches) or using SDK methods (e.g., [listProjectBranches](#list-branches), [listProjects](#list-projects)).

### Create a Role

You can use the SDK to create a new Postgres role within a Neon branch. Here's an example of how to create a role:

```typescript
import { createApiClient } from '@neondatabase/api-client';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function createNeonRole(projectId: string, branchId: string, roleName: string) {
  try {
    const response = await apiClient.createProjectBranchRole(projectId, branchId, {
      role: { name: roleName },
    });
    console.log('Role created:', response.data.role);
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

// Example usage: In the project with ID "your-project-id", create a role named "new_user_role" in the branch with ID "your-branch-id"
createNeonRole('your-project-id', 'your-branch-id', 'new_user_role').catch((error) => {
  console.error('Error creating role:', error.message);
});
```

#### Key points:

- `role.name`: Specifies the name of the Postgres role to be created.
- Branch & Project IDs: You can obtain these IDs from the [Neon Console](/docs/manage/branches#view-branches) or using SDK methods (e.g., [listProjectBranches](#list-branches), [listProjects](#list-projects))

## TypeScript Types

The Neon TypeScript SDK provides comprehensive type definitions for all request and response objects, enums, and interfaces. Leveraging these types enhances your development experience by enabling:

- **Type Safety**: TypeScript types ensure that you are using the SDK methods and data structures correctly, catching type-related errors during development rather than at runtime.
- **Improved Code Completion**: Modern IDEs and code editors utilize TypeScript types to provide intelligent code completion and suggestions, making it easier to discover and use SDK features.

### Utilizing SDK Types

The `@neondatabase/api-client` package exports all the TypeScript types you need to interact with the Neon API in a type-safe manner. You can import these types directly into your TypeScript files.

For example, when listing projects, you can use the `ProjectsResponse` type to explicitly define the structure of the API response:

```typescript
import { createApiClient, ProjectsResponse } from '@neondatabase/api-client';
import { AxiosResponse } from 'axios';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function listNeonProjects(): Promise<void> {
  try {
    const response: AxiosResponse<ProjectsResponse> = await apiClient.listProjects({});
    const projects = response.data.projects;
    console.log('Projects:', projects);
  } catch (error) {
    console.error('Error listing projects:', error);
  }
}

listNeonProjects();
```

In this example:

- We import `ProjectsResponse` type from `@neondatabase/api-client`.
- We explicitly type the `response` variable as `AxiosResponse<ProjectsResponse>`. This tells TypeScript that we expect the `apiClient.listProjects()` method to return a response from Axios, where the `data` property conforms to the structure defined by `ProjectsResponse`.

Similarly, when creating a project, you can use types like `ProjectCreateRequest` for the request body and `ProjectResponse` for the expected response:

By using TypeScript types, you ensure that your code interacts with the Neon API in a predictable and type-safe manner, reducing potential errors and improving code quality. You can explore all available types in the `@neondatabase/api-client` package to fully leverage the benefits of TypeScript in your Neon SDK integrations.

## Key SDK Method Signatures

To give you a better overview of the SDK, here are some of the key methods available, categorized by their resource. For complete details and parameters for each method, please refer to the full [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

### Manage API keys

- `listApiKeys()`: Retrieves a list of API keys for your account.
- `createApiKey(data: ApiKeyCreateRequest)`: Creates a new API key.
- `revokeApiKey(keyId: number)`: Revokes an existing API key.

### Manage projects

- `listProjects(query?: ListProjectsParams)`: Retrieves a list of projects in your Neon account.
- `listSharedProjects(query?: ListSharedProjectsParams)`: Retrieves a list of projects shared with your account.
- `createProject(data: ProjectCreateRequest)`: Creates a new Neon project.
- `getProject(projectId: string)`: Retrieves details for a specific project.
- `updateProject(projectId: string, data: ProjectUpdateRequest)`: Updates settings for a specific project.
- `deleteProject(projectId: string)`: Deletes a Neon project.
- `listProjectOperations(projectId: string, query?: ListProjectOperationsParams)`: Retrieves operations for a project.
- `getProjectOperation(projectId: string, operationId: string)`: Retrieves details for a specific operation.
- `getConnectionUri(projectId: string, query: GetConnectionUriParams)`: Retrieves a connection URI for a project.
- `listProjectPermissions(projectId: string)`: Retrieves project access permissions.
- `grantPermissionToProject(projectId: string, data: GrantPermissionToProjectRequest)`: Grants project access to a user.
- `revokePermissionFromProject(projectId: string, permissionId: string)`: Revokes project access from a user.
- `getProjectJwks(projectId: string)`: Retrieves JWKS URLs for a project.
- `addProjectJwks(projectId: string, data: AddProjectJWKSRequest)`: Adds a JWKS URL to a project.
- `deleteProjectJwks(projectId: string, jwksId: string)`: Deletes a JWKS URL from a project.

### Manage branches

- `listProjectBranches(projectId: string, query?: ListProjectBranchesParams)`: Retrieves a list of branches within a project.
- `countProjectBranches(projectId: string, query?: CountProjectBranchesParams)`: Retrieves the number of branches in a project.
- `createProjectBranch(projectId: string, data?: BranchCreateRequest)`: Creates a new branch within a project.
- `getProjectBranch(projectId: string, branchId: string)`: Retrieves details for a specific branch.
- `updateProjectBranch(projectId: string, branchId: string, data: BranchUpdateRequest)`: Updates settings for a specific branch.
- `deleteProjectBranch(projectId: string, branchId: string)`: Deletes a branch from a project.
- `restoreProjectBranch(projectId: string, branchId: string, data: BranchRestoreRequest)`: Restores a branch to a point in time.
- `setDefaultProjectBranch(projectId: string, branchId: string)`: Sets a branch as the default for the project.
- `getProjectBranchSchema(projectId: string, branchId: string, query?: GetProjectBranchSchemaParams)`: Retrieves the schema for a branch database.
- `getProjectBranchSchemaComparison(projectId: string, branchId: string, query?: GetProjectBranchSchemaComparisonParams)`: Compares branch schemas.
- `listProjectBranchEndpoints(projectId: string, branchId: string)`: Retrieves endpoints for a branch.
- `listProjectBranchDatabases(projectId: string, branchId: string)`: Retrieves databases for a branch.
- `createProjectBranchDatabase(projectId: string, branchId: string, data: DatabaseCreateRequest)`: Creates a database in a branch.
- `getProjectBranchDatabase(projectId: string, branchId: string, databaseName: string)`: Retrieves details for a branch database.
- `updateProjectBranchDatabase(projectId: string, branchId: string, databaseName: string, data: DatabaseUpdateRequest)`: Updates a branch database.
- `deleteProjectBranchDatabase(projectId: string, branchId: string, databaseName: string)`: Deletes a database from a branch.
- `listProjectBranchRoles(projectId: string, branchId: string)`: Retrieves roles for a branch.
- `createProjectBranchRole(projectId: string, branchId: string, data: RoleCreateRequest)`: Creates a role in a branch.
- `getProjectBranchRole(projectId: string, branchId: string, roleName: string)`: Retrieves details for a branch role.
- `deleteProjectBranchRole(projectId: string, branchId: string, roleName: string)`: Deletes a role from a branch.
- `resetProjectBranchRolePassword(projectId: string, branchId: string, roleName: string)`: Resets a branch role password.

### Manage Compute Endpoints

- `listProjectEndpoints(projectId: string)`: Retrieves a list of endpoints within a project.
- `createProjectEndpoint(projectId: string, data: EndpointCreateRequest)`: Creates a new endpoint within a project.
- `getProjectEndpoint(projectId: string, endpointId: string)`: Retrieves details for a specific endpoint.
- `updateProjectEndpoint(projectId: string, endpointId: string, data: EndpointUpdateRequest)`: Updates settings for a specific endpoint.
- `deleteProjectEndpoint(projectId: string, endpointId: string)`: Deletes an endpoint from a project.
- `startProjectEndpoint(projectId: string, endpointId: string)`: Starts an endpoint.
- `suspendProjectEndpoint(projectId: string, endpointId: string)`: Suspends an endpoint.
- `restartProjectEndpoint(projectId: string, endpointId: string)`: Restarts an endpoint.

### Retrieve Consumption Metrics

- `getConsumptionHistoryPerAccount(query: GetConsumptionHistoryPerAccountParams)`: Retrieves account consumption metrics.
- `getConsumptionHistoryPerProject(query: GetConsumptionHistoryPerProjectParams)`: Retrieves project consumption metrics.

### Manage Organizations

- `getOrganization(orgId: string)`: Retrieves organization details.
- `getOrganizationMembers(orgId: string)`: Retrieves members of an organization.
- `getOrganizationMember(orgId: string, memberId: string)`: Retrieves details for a specific organization member.
- `getOrganizationInvitations(orgId: string)`: Retrieves invitations for an organization.
- `listOrgApiKeys(orgId: string)`: Lists API keys for an organization.
- `createOrgApiKey(orgId: string, data: OrgApiKeyCreateRequest)`: Creates an API key for an organization.
- `revokeOrgApiKey(orgId: string, keyId: number)`: Revokes an organization API key.
- `createOrganizationInvitations(orgId: string, data: OrganizationInvitesCreateRequest)`: Creates organization invitations.
- `updateOrganizationMember(orgId: string, memberId: string, data: OrganizationMemberUpdateRequest)`: Updates an organization member's role.
- `removeOrganizationMember(orgId: string, memberId: string)`: Removes a member from an organization.
- `transferProjectsFromOrgToOrg(sourceOrgId: string, data: TransferProjectsToOrganizationRequest)`: Transfers projects between organizations.
- `listOrganizationVpcEndpoints(orgId: string, regionId: string)`: Lists VPC endpoints for an organization.
- `getOrganizationVpcEndpointDetails(orgId: string, regionId: string, vpcEndpointId: string)`: Retrieves VPC endpoint details for an organization.
- `assignOrganizationVpcEndpoint(orgId: string, regionId: string, vpcEndpointId: string, data: VPCEndpointAssignment)`: Assigns/updates a VPC endpoint for an organization.
- `deleteOrganizationVpcEndpoint(orgId: string, regionId: string, vpcEndpointId: string)`: Deletes a VPC endpoint from an organization.

### Manage Users

- `getCurrentUserInfo()`: Retrieves details for the current user.
- `getCurrentUserOrganizations()`: Retrieves organizations for the current user.
- `transferProjectsFromUserToOrg(data: TransferProjectsToOrganizationRequest)`: Transfers projects from a user to an organization.

### Regions

- `getActiveRegions()`: Retrieves a list of active Neon regions.

### Manage Auth Integrations

- `createProjectIdentityIntegration(data: IdentityCreateIntegrationRequest)`: Creates Neon Auth integration.
- `createProjectIdentityAuthProviderSdkKeys(data: IdentityCreateAuthProviderSDKKeysRequest)`: Creates Auth Provider SDK keys.
- `transferProjectIdentityAuthProviderProject(data: IdentityTransferAuthProviderProjectRequest)`: Transfers Neon-managed Auth project ownership.
- `listProjectIdentityIntegrations(projectId: string)`: Lists Auth Provider integrations for a project.
- `deleteProjectIdentityIntegration(projectId: string, authProvider: IdentitySupportedAuthProvider)`: Deletes an Auth Provider integration.

### General

- `getProjectOperation(projectId: string, operationId: string)`: Retrieves details for a specific operation.

## Error Handling

When working with APIs, handling errors gracefully is crucial for building robust applications. The Neon TypeScript SDK provides mechanisms to capture and inspect errors that may occur during API requests.

### General Error Structure

When an error occurs during an API request, the SDK throws an `AxiosError` object, which extends the standard JavaScript `Error` object. The `AxiosError` object contains additional properties that provide details about the error, including:

**`error.response`**: This property (if present) is an Axios response object containing details from the API error response.

- **`error.response.status`**: The HTTP status code of the error response (e.g., 400, 401, 404, 500).
- **`error.response.data`**: The response body, which, for Neon API errors, often follows a consistent structure, including an `error` object with `code` and `message` properties.

### Common Error Scenarios and Debugging

- **Invalid API Key (401 Unauthorized):** Ensure your `NEON_API_KEY` environment variable is correctly set with a valid API key from the Neon Console.
- **Project or Branch Not Found (404 Not Found):** Verify that the `projectId` and `branchId` values you are using are correct and that the resources exist in your Neon account. Double-check IDs in the Neon Console.
- **Rate Limiting (429 Too Many Requests):** If you are making requests too frequently, the API might rate-limit you. Implement retry mechanisms with exponential backoff or reduce the frequency of your API calls.
- **Request Body Validation Errors (400 Bad Request):** If you receive 400 errors, carefully review the request body you are sending, ensuring it conforms to the expected schema for the API endpoint. Refer to the [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) for request body structures.

## References

- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api): Comprehensive documentation for the Neon API, including detailed descriptions of resources, endpoints, request/response structures, and error codes.

<NeedHelp />
