---
title: Neon API
summary: >-
  How to manage Neon projects programmatically using the Neon API, including
  creating and managing projects, branches, databases, and roles, along with
  guidance on obtaining an API key and using SDKs.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/about
  - /docs/api/about
updatedOn: '2026-02-06T22:07:33.129Z'
---

<CopyPrompt src="/prompts/neon-api-prompt.md" title="AI prompt: Get started with the Neon API"
description="Copy this prompt into your AI coding assistant (Cursor, Copilot, etc.) to get help creating your first API key and making your first successful API call — using curl, the TypeScript SDK, or the Python SDK."/>

The Neon API allows you to manage your Neon projects programmatically. You can create and manage projects, branches, databases, roles, compute endpoints, and more — everything you can do in the Neon Console, you can do with the API.

## Quick links

- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) — Interactive API documentation with "Try It" feature
- [OpenAPI Specification](https://neon.com/api_spec/release/v2.json) — Machine-readable API spec (OpenAPI 3.0)
- [Neon SDKs](/docs/reference/sdk) — TypeScript and Python SDKs for the Neon API

## Getting started

### Prerequisites

Before using the Neon API, you need:

1. **A Neon account** — [Sign up](https://console.neon.tech/signup) if you don't have one
2. **An API key** — Create one in the Neon Console (see below)
3. **curl or an HTTP client** — Or use our [TypeScript](/docs/reference/typescript-sdk) or [Python](/docs/reference/python-sdk) SDKs

### API key types

Neon supports three types of API keys, each with different scopes:

| Key Type                   | Scope                                  | Best For                      |
| -------------------------- | -------------------------------------- | ----------------------------- |
| **Personal API Key**       | All projects you own or have access to | Personal development, scripts |
| **Organization API Key**   | All projects within an organization    | Team automation, CI/CD        |
| **Project-scoped API Key** | Single project only                    | Limited access integrations   |

Create your first API key in the Neon Console under **Account settings** > **API keys**. For detailed instructions, see [Manage API keys](/docs/manage/api-keys).

<Admonition type="important">
API key tokens are shown only once at creation. Store them securely — you cannot retrieve them later.
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

## Make your first API call

Set your API key as an environment variable, then list your projects:

<Tabs labels={["curl", "TypeScript SDK", "Python SDK"]}>

<TabItem>

```bash
# Set your API key
export NEON_API_KEY="your-api-key-here"

# List all projects
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

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

async function listProjects() {
  const response = await apiClient.listProjects({});
  console.log(response.data.projects);
}

listProjects();
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
  ]
}
```

Use the `project_id` from the response to make subsequent requests, such as creating a branch:

<Tabs labels={["curl", "TypeScript SDK", "Python SDK"]}>

<TabItem>

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/spring-example-302709/branches' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"branch": {"name": "dev-branch"}}'
```

</TabItem>

<TabItem>

```typescript
const response = await apiClient.createProjectBranch('spring-example-302709', {
  branch: { name: 'dev-branch' },
});
console.log(response.data.branch);
```

</TabItem>

<TabItem>

```python
branch = neon.branch_create(
    project_id="spring-example-302709",
    branch={"name": "dev-branch"}
)
print(branch)
```

</TabItem>

</Tabs>

## Key concepts

### Asynchronous operations

Many Neon API operations (creating branches, starting computes, etc.) are asynchronous. The API response includes an `operations` array with status information:

```json
"operations": [
  {
    "id": "22acbb37-209b-4b90-a39c-8460090e1329",
    "action": "create_branch",
    "status": "running"
  }
]
```

**Status values:** `scheduling`, `running`, `finished`, `failed`, `cancelling`, `cancelled`, `skipped`

When building automation, poll the operation status before proceeding with dependent requests:

```bash
curl 'https://console.neon.tech/api/v2/projects/{project_id}/operations/{operation_id}' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

For details, see [Poll operation status](/docs/manage/operations#poll-operation-status).

### Rate limiting

- **700 requests per minute** (approximately 11 per second)
- **40 requests per second** burst limit per route

Exceeding these limits returns `HTTP 429 Too Many Requests`. Implement retry logic with exponential backoff in your applications.

### Pagination

Some endpoints that return lists support cursor-based pagination. Include `limit` and `cursor` parameters:

```bash
# First request with limit
curl 'https://console.neon.tech/api/v2/projects?limit=10' ...

# Subsequent request with cursor from previous response
curl 'https://console.neon.tech/api/v2/projects?limit=10&cursor=...' ...
```

## SDKs and tools

Instead of using curl, you can use our official SDKs:

- **[TypeScript SDK](/docs/reference/typescript-sdk)** — Full-featured SDK for Node.js and browser
- **[Python SDK](/docs/reference/python-sdk)** — Pythonic wrapper for the Neon API
- **[@neondatabase/toolkit](/docs/reference/neondatabase-toolkit)** — Combined SDK for AI agents (includes API SDK + Serverless Driver)
- **[Neon CLI](/docs/reference/neon-cli)** — Command-line interface for Neon

See [Neon SDKs](/docs/reference/sdk) for the full list, including community SDKs.

## API reference documentation

The interactive [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) provides:

- Complete endpoint documentation
- Request/response examples
- "Try It" feature to execute requests directly
- Schema definitions for all objects

You can also access the [OpenAPI specification](https://neon.com/api_spec/release/v2.json) directly for code generation or API tooling.

## API examples index

The following sections link to API examples and guides throughout the Neon documentation, organized by resource type and use case.

### Core resources

Manage the fundamental building blocks of your Neon account.

- [Manage API keys](/docs/manage/api-keys#manage-api-keys-with-the-neon-api) — Create, list, and revoke API keys for personal accounts and organizations
- [Manage projects](/docs/manage/projects#manage-projects-with-the-neon-api) — Create, list, update, delete, and recover projects
- [Manage branches](/docs/manage/branches#branching-with-the-neon-api) — Create, list, and delete branches
- [Manage computes](/docs/manage/computes#manage-computes-with-the-neon-api) — Create, configure, restart, and delete compute endpoints
- [Manage roles](/docs/manage/roles#manage-roles-with-the-neon-api) — Create roles, reset passwords, and manage database access
- [Manage databases](/docs/manage/databases#manage-databases-with-the-neon-api) — Create, list, update, and delete databases
- [View operations](/docs/manage/operations#operations-and-the-neon-api) — List operations, check status, and poll for completion
- [Maintenance windows](/docs/manage/updates#updates-on-paid-plans) — Configure maintenance windows for compute updates via API
- [Organizations API](/docs/manage/orgs-api) — Manage organization members and permissions
- [Project transfer](/docs/manage/orgs-project-transfer#transfer-projects-with-the-api) — Transfer projects between accounts and organizations

### Usage and billing

Monitor resource consumption and configure usage limits.

- [Monitor usage metrics](/docs/introduction/monitor-usage#retrieve-usage-metrics-with-the-neon-api) — Retrieve usage data for projects and branches
- [Query consumption metrics](/docs/guides/consumption-metrics#get-account-level-aggregated-metrics-legacy-plans) — Query account-level and project-level consumption history
- [Organization consumption](/docs/manage/orgs-api-consumption#account-level-metrics) — Query usage metrics for organizations
- [Configure consumption limits](/docs/guides/consumption-limits#configuring-quotas) — Set and update quotas on compute, storage, and data transfer

### Branching workflows

Work with branches programmatically for development, testing, and CI/CD.

- [Branching with the Neon API](/docs/guides/branching-neon-api) — Comprehensive guide to branch management via API
- [Branch restore](/docs/introduction/branch-restore#how-to-use-instant-restore) — Restore branches to a previous state using Time Travel
- [Branch expiration](/docs/guides/branch-expiration#creating-a-branch-with-expiration) — Automatically delete branches after a specified time
- [Schema-only branches](/docs/guides/branching-schema-only#creating-schema-only-branches) — Create branches with schema but no data
- [Reset from parent](/docs/guides/reset-from-parent#how-to-reset-from-parent) — Reset a branch to match its parent's current state
- [Protected branches](/docs/guides/protected-branches#define-an-ip-allowlist-for-your-project) — Configure IP allowlist restrictions for protected branches
- [Branching for testing](/docs/guides/branching-test-queries#create-a-test-branch) — Create isolated branches for running test queries
- [Branch archiving](/docs/guides/branch-archiving#monitoring-branch-archiving) — Monitor branch archive status via API

### Snapshots and backup

Create and manage point-in-time snapshots for backup and versioning.

- [Backup and restore](/docs/guides/backup-restore#create-snapshots-manually) — Create scheduled and on-demand snapshots
- [Database versioning](/docs/ai/ai-database-versioning#creating-snapshots) — Create and manage snapshots via API for version control

### Data management

Transform and compare data across branches.

- [Data anonymization API](/docs/workflows/data-anonymization-api#create-anonymized-branch) — Create anonymized copies of production data with masking rules
- [Data anonymization workflow](/docs/workflows/data-anonymization#create-a-branch-with-anonymized-data) — End-to-end guide for setting up data anonymization
- [Schema comparison](/docs/guides/schema-diff#using-the-neon-api) — Compare schemas between branches via API
- [Schema diff tutorial](/docs/guides/schema-diff-tutorial#view-the-schema-differences) — Step-by-step schema comparison guide with API example

### Read replicas

Scale read operations with dedicated read-only compute endpoints.

- [Read replicas overview](/docs/introduction/read-replicas#manage-read-replicas-using-the-neon-api) — List and manage read replica endpoints
- [Create read replicas](/docs/guides/read-replica-guide#create-a-read-replica-using-the-api) — Create, configure, and delete read replica computes
- [Read replicas for data analysis](/docs/guides/read-replica-data-analysis#create-a-read-replica) — Create read replicas for analytics workloads
- [Read replicas for ad-hoc queries](/docs/guides/read-replica-adhoc-queries#setting-up-a-read-replica-for-ad-hoc-queries) — Create read replicas for exploratory queries

### Security and compliance

Configure security features and compliance settings.

- [HIPAA compliance](/docs/security/hipaa#step-2-enable-hipaa-for-your-projects) — Create and configure HIPAA-compliant projects via API
- [API key management](/docs/manage/api-keys) — Secure API key handling for personal and organization accounts

<NeedHelp/>
