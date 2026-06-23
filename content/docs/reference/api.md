---
title: Neon API
summary: >-
  Use the Neon REST API to create and manage projects, branches, databases,
  roles, compute endpoints, API keys, and other Neon resources
  programmatically. Learn how to create an API key, authenticate requests,
  make your first API call, browse all endpoints, and handle common API
  patterns such as pagination, rate limits, and asynchronous operations.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/about
  - /docs/api/about
---

<CopyPrompt src="/prompts/neon-api-prompt.md" title="AI prompt: Get started with the Neon API" description="Copy into your AI assistant to get an API key and make your first API call."/>

The Neon API lets you manage Neon programmatically. You can create and manage projects, branches, databases, roles, compute endpoints, API keys, and more. Everything you can do in the Neon Console, you can do with the API.

## Get started

### Get an API key

Create an API key in the Neon Console under **Account settings** > **API keys**. For detailed instructions and security best practices, see [Manage API keys](/docs/manage/api-keys).

Neon supports three API key types:

| Key type                   | Scope                                  | Best for                      |
| -------------------------- | -------------------------------------- | ----------------------------- |
| **Personal API key**       | All projects you own or have access to | Personal development, scripts |
| **Organization API key**   | All projects within an organization    | Team automation, CI/CD        |
| **Project-scoped API key** | Single project only                    | Limited access integrations   |

<Admonition type="important">
API key tokens are shown only once at creation. Store them securely because you can't retrieve them later.
</Admonition>

### Base URL

All API requests use this base URL:

```text
https://console.neon.tech/api/v2/
```

### Authentication

Include your API key in the `Authorization` header using Bearer authentication:

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### Make your first request

Set your API key as an environment variable, then list your projects:

<Tabs labels={["curl", "TypeScript SDK", "Python SDK"]}>
<TabItem>

```bash
export NEON_API_KEY="your-api-key-here"

curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

</TabItem>
<TabItem>

```bash
npm install @neondatabase/api-client
```

```typescript
import { createApiClient } from '@neondatabase/api-client';

const api = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

const { data } = await api.listProjects({});
console.log(data.projects);
```

</TabItem>
<TabItem>

```bash
pip install neon-api
```

```python
import os
from neon_api import NeonAPI

neon = NeonAPI(api_key=os.environ["NEON_API_KEY"])

projects = neon.projects()
print(projects)
```

</TabItem>
</Tabs>

The response includes your projects with their IDs, regions, and other details:

```json
{
  "projects": [
    {
      "id": "spring-example-302709",
      "name": "my-project",
      "region_id": "aws-us-east-2",
      "pg_version": 17,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { "cursor": "eyJsaW1pdCI6MX0" }
}
```

## Search and browse all endpoints

Use the endpoint index to search every generated API operation, or browse by resource below.

<ApiResourceGrid />

## Key concepts

### Asynchronous operations

Many Neon API operations, including creating branches and starting computes, are asynchronous. The API response includes an `operations` array with status information:

```json
"operations": [
  {
    "id": "22acbb37-209b-4b90-a39c-8460090e1329",
    "action": "create_branch",
    "status": "running"
  }
]
```

Status values include `scheduling`, `running`, `finished`, `failed`, `cancelling`, `cancelled`, and `skipped`.

When building automation, poll the operation status before proceeding with dependent requests:

```bash
curl 'https://console.neon.tech/api/v2/projects/{project_id}/operations/{operation_id}' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

For details, see [Poll operation status](/docs/manage/operations#poll-operation-status).

### Rate limiting

The Neon API has these rate limits:

- 700 requests per minute, or approximately 11 per second
- 40 requests per second burst limit per route
- 10 requests per second for organization API key creation (`POST /organizations/{org_id}/api_keys`)

Exceeding these limits returns `HTTP 429 Too Many Requests`. Use retry logic with exponential backoff in your applications.

### Pagination

Some list endpoints support cursor-based pagination. Include `limit` and `cursor` parameters:

```bash
# First request with limit
curl 'https://console.neon.tech/api/v2/projects?limit=10' \
  -H "Authorization: Bearer $NEON_API_KEY"

# Subsequent request with cursor from the previous response
curl 'https://console.neon.tech/api/v2/projects?limit=10&cursor=...' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### Important constraints

Keep these constraints in mind when building automation with the Neon API:

- You can't delete a project's root or default branch.
- You can't delete a branch that has child branches. Delete all children first.
- Creating a new role may drop existing connections to the active compute endpoint.
- A branch can have only one `read_write` endpoint but multiple `read_only` endpoints.
- Neon limits overlapping operations on a project. Requests that try to schedule new work while conflicting operations are still running return `423 Locked`. Retry with exponential backoff, or poll for completion first. See [Handle concurrent operation errors](/docs/manage/operations#handle-concurrent-operation-errors).
- Operations older than 6 months may be removed from Neon's systems.

## SDKs and tools

If you don't want to call the REST API directly, use the interface that fits your workflow:

- [Neon API TypeScript SDK](/docs/reference/typescript-sdk) for a typed client generated from the OpenAPI spec
- [Neon SDKs](/docs/reference/sdk) for the full SDK overview
- [Neon CLI](/docs/cli) for terminal, CI/CD, and agent workflows
- [OpenAPI specification](https://neon.com/api_spec/release/v2.json) for code generation and API tooling

## API examples index

The following pages include API examples and guides organized by resource type and use case.

### Core resources

- [Manage API keys](/docs/manage/api-keys#manage-api-keys-with-the-neon-api): Create, list, and revoke API keys for personal accounts and organizations
- [Manage projects](/docs/manage/projects#manage-projects-with-the-neon-api): Create, list, update, delete, and recover projects
- [Manage branches](/docs/manage/branches#branching-with-the-neon-api): Create, list, and delete branches
- [Manage computes](/docs/manage/computes#manage-computes-with-the-neon-api): Create, configure, restart, and delete compute endpoints
- [Manage roles](/docs/manage/roles#manage-roles-with-the-neon-api): Create roles, reset passwords, and manage database access
- [Manage databases](/docs/manage/databases#manage-databases-with-the-neon-api): Create, list, update, and delete databases
- [View operations](/docs/manage/operations#operations-and-the-neon-api): List operations, check status, and poll for completion
- [Maintenance windows](/docs/manage/updates#updates-on-paid-plans): Configure maintenance windows for compute updates via API
- [Organizations API](/docs/manage/orgs-api): Manage organization members and permissions
- [Project transfer](/docs/manage/orgs-project-transfer#transfer-projects-with-the-api): Transfer projects between accounts and organizations

### Usage and billing

- [Monitor billing and usage](/docs/introduction/monitor-usage): Where to see usage and costs in the Console
- [Query consumption metrics](/docs/guides/consumption-metrics): Query project consumption metrics for usage-based plans
- [Organization consumption](/docs/manage/orgs-api-consumption#account-level-metrics): Query usage metrics for organizations
- [Configure consumption limits](/docs/guides/consumption-limits#configuring-quotas): Set and update quotas on compute, storage, and data transfer

### Branching workflows

- [Branching with the Neon API](/docs/guides/branching-neon-api): Comprehensive guide to branch management via API
- [Branch restore](/docs/introduction/branch-restore#how-to-use-instant-restore): Restore branches to a previous state using Time Travel
- [Branch expiration](/docs/guides/branch-expiration#creating-a-branch-with-expiration): Automatically delete branches after a specified time
- [Schema-only branches](/docs/guides/branching-schema-only#creating-schema-only-branches): Create branches with schema but no data
- [Reset from parent](/docs/guides/reset-from-parent#how-to-reset-from-parent): Reset a branch to match its parent's current state
- [Protected branches](/docs/guides/protected-branches#define-an-ip-allowlist-for-your-project): Configure IP allowlist restrictions for protected branches
- [Branching for testing](/docs/guides/branching-test-queries#create-a-test-branch): Create isolated branches for running test queries
- [Branch archiving](/docs/guides/branch-archiving#monitoring-branch-archiving): Monitor branch archive status via API

### Snapshots and backup

- [Backup and restore](/docs/guides/backup-restore#create-snapshots-manually): Create scheduled and on-demand snapshots
- [Database versioning](/docs/ai/ai-database-versioning#creating-snapshots): Create and manage snapshots via API for version control

### Data management

- [Data anonymization API](/docs/workflows/data-anonymization-api#create-anonymized-branch): Create anonymized copies of production data with masking rules
- [Data anonymization workflow](/docs/workflows/data-anonymization#create-a-branch-with-anonymized-data): End-to-end guide for setting up data anonymization
- [Schema comparison](/docs/guides/schema-diff#using-the-neon-api): Compare schemas between branches via API
- [Schema diff tutorial](/docs/guides/schema-diff-tutorial#view-the-schema-differences): Step-by-step schema comparison guide with API example

### Read replicas

- [Read replicas overview](/docs/introduction/read-replicas#manage-read-replicas-using-the-neon-api): List and manage read replica endpoints
- [Create read replicas](/docs/guides/read-replica-guide#create-a-read-replica-using-the-api): Create, configure, and delete read replica computes
- [Read replicas for data analysis](/docs/guides/read-replica-data-analysis#create-a-read-replica): Create read replicas for analytics workloads
- [Read replicas for ad-hoc queries](/docs/guides/read-replica-adhoc-queries#setting-up-a-read-replica-for-ad-hoc-queries): Create read replicas for exploratory queries

### Security and compliance

- [HIPAA compliance](/docs/security/hipaa#step-2-enable-hipaa-for-your-projects): Create and configure HIPAA-compliant projects via API
- [API key management](/docs/manage/api-keys): Secure API key handling for personal and organization accounts
