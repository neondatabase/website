---
title: Neon API for AI agents
subtitle: Complete API workflow for database provisioning, auth, and versioning
enableTableOfContents: true
updatedOn: '2025-09-10T14:09:12.290Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How the agent plan is organized</p>
<p>How to use the Neon API to manage users</p>
<p>Tools that Neon offers to manage your codegen platform</p>
</DocsList>
<DocsList title="Related topics" theme="docs">
<a href="/docs/reference/neondatabase-toolkit">Neon toolkit</a>
<a href="/docs/guides/platform-integration-intro">Built on Neon</a>
<a href="/docs/ai/ai-database-versioning">Neon database versioning</a>
</DocsList>
</InfoBlock>

## Agent plan: how it works

Neon creates two organizations in your account so you can separate your tiers.

- Sponsored organization (free to you): Project-level limits similar to the Neon free tier. Use for development and previews.
- Paid organization (with credits from Neon): Credits apply to charges until depleted. Use for production workloads, for paying users.

### What Neon does

1. Approves your agent plan application.
2. Creates both organizations, assigns you as admin, and configures billing (credits on the paid organization; sponsorship on the sponsored organization).
3. Confirms both organizations are visible to you and default limits are set.

### What you do

- Use the sponsored organization for development and preview environments.
- Use the paid organization for production workloads as users upgrade.
- Request limit increases if you approach the defaults.

### Limits and increases

- Default cap: 30,000 projects per organization (adjustable after review).
- The sponsored organization enforces free-tier-like per-project limits (e.g., storage, active time, compute time).
- Request an increase if needed; Neon will review and adjust caps when appropriate.

### Administration

- You are an admin in both organizations and can create projects, branches, configure authentication, and set quotas within the configured limits.
- Neon manages credits and cap changes.

<CTA
  title="Neon Agent Plan"
  description="For custom rate limits and dedicated support for your agent platform, apply now."
  buttonText="Sign Up"
  buttonUrl="/use-cases/ai-agents"
/>

## API Operations

| Action                                                             | Description                                                                | Endpoint                                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **[Create project](#application-provisioning)**                    | Creates a PostgreSQL database in ~500ms with automatic scale-to-zero         | `POST /projects`                                                            |
| **[Configure autoscaling](#autoscaling-configuration)**            | Set compute limits (0.25-8 CU) based on user tiers                         | `PATCH /projects/{project_id}/endpoints/{endpoint_id}`                      |
| **[Set resource limits](#resource-management)**                    | Enforce compute/storage quotas based on user tiers                         | `PATCH /projects/{project_id}`                                              |
| **[Add auth](#authentication-setup)**                              | Setup Neon Auth with user synchronized to the `neon_auth.users_sync` table | `POST /projects/auth/create`                                                |
| **[Configure OAuth](#configure-oauth-providers)**                  | Enable social login (GitHub, Google, Microsoft)                            | `POST /projects/{project_id}/auth/oauth_providers`                          |
| **[Database versioning](#database-versioning)**                    | Save database versions with snapshots (only from root branches)            | `POST /projects/{project_id}/branches/{branch_id}/snapshot`                                       |
| **[Create dev branches](#create-development-branches)**            | Create isolated development environments                                   | `POST /projects/{project_id}/branches`                                      |
| **[Enable Data API](#data-api)**                                   | Transform database tables into REST endpoints                              | `POST /projects/{project_id}/branches/{branch_id}/data-api/{database_name}` |
| **[Monitor usage](#get-project-consumption)**                      | Track resource consumption metrics                                         | `GET /projects/{project_id}/consumption`                                    |
| **[Transfer projects (between orgs)](#project-transfer-api)**      | Move projects from sponsored to paid (or reverse)                          | `POST /organizations/{source_org_id}/projects/transfer`                     |

## Quick start with the demo

See the pattern in action with a working snapshot database versioning demo.

- Repo: https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo
- Live demo: https://snapshots-as-checkpoints-demo.vercel.app/

Demo architecture: meta database (users via Neon Auth, `projects`, `checkpoints`) + per-user app database (one Neon project per user session, URL saved in `projects`).

---

## Key concepts

- **Root branches** (like `main`): The only branches that can be snapshotted
- **Connection string stability**: Achieved through a restore with `finalize_restore: true`
- **Operation polling**: Required after a restore with `finalize_restore: true` to ensure compute endpoint transfer completes
- **Orphaned branches**: Created during restore (such as "main (old)"), delete to avoid extra costs
- **Scale-to-zero**: Databases suspend when idle, wake in under 500ms on next query

Neon's copy-on-write storage enables version-aware backends. Use snapshots, branching, and point-in-time recovery to support undo, checkpoints, and safe experimentation.

---

## Application provisioning

Your agent provisions databases for each user's applications. The infrastructure is created quickly (under 500ms) and cost-effectively, as databases scale to zero when idle - you only pay when databases are active or storing data.

Choose the target organization before creating a project:

- Sponsored organization: development/preview projects
- Paid organization: production projects

To upgrade a user, transfer their project to the paid organization (see [Project transfer details](#project-transfer-details)). Projects are independent across organizations; transfer moves an existing project rather than copying data.

### Create project with database

The `default_endpoint_settings` in the project creation request automatically configures the compute endpoint with your desired autoscaling and suspension settings.

<CodeTabs labels={["API", "Neon Toolkit"]}>
```bash
curl -X POST "https://console.neon.tech/api/v2/projects" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "agent-example-prod",
    "org_id": "org_id_here",
    "branch": {
      "name": "main",
      "role_name": "app_user",
      "database_name": "app_db"
    },
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 1,
      "suspend_timeout_seconds": 300
    },
    "pg_version": 17,
    "region_id": "aws-us-east-2"
  }'
```

```ts
import { NeonToolkit } from '@neondatabase/toolkit';
import * as dotenv from 'dotenv';

dotenv.config();

async function testNeonApi() {
  try {
    const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);
    const tenantId = 'example-tenant';
    const orgId =
      process.env.ORG_TARGET === 'prod'
        ? process.env.NEON_ORG_ID_PROD
        : process.env.NEON_ORG_ID_DEV;

    console.log('Starting Neon API test...');
    console.log(`Tenant ID: ${tenantId}`);

    // 1) Create a project with main branch, role, and database
    console.log('Creating project...');
    const project = await toolkit.createProject({
      name: `agent-${tenantId}-prod`,
      org_id: orgId,
      branch: { name: 'main', role_name: 'app_user', database_name: 'app_db' },
      default_endpoint_settings: {
        autoscaling_limit_min_cu: 0.25,
        autoscaling_limit_max_cu: 1,
        suspend_timeout_seconds: 300,
      },
      pg_version: 17,
      region_id: 'aws-us-east-2',
    });

    const projectId = project.project.id;
    const endpointId = project.endpoints[0].id;
    const branchId = project.branches.id;

    console.log('Project created successfully!');
    console.log(`Project ID: ${projectId}`);
    console.log(`Endpoint ID: ${endpointId}`);
    console.log(`Branch ID: ${branchId}`);

    // 2) Get the pooled connection string
    console.log('🔗 Retrieving pooled connection string...');
    const connectionUri = await toolkit.apiClient.getConnectionUri({
      projectId: projectId,
      branch_id: branchId,
      database_name: 'app_db',
      role_name: 'app_user',
      pooled: true,
    });

    console.log('Pooled connection retrieved!');
    console.log(`Pooled Connection URI: ${connectionUri.data.uri}`);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

testNeonApi();
```
</CodeTabs>

#### Create development branches

For development work (separate from production versioning), create regular branches with their own connection strings:

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/shiny-wind-028834/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "branch": {
      "parent_id": "br-aged-salad-637688",
      "name": "feature-new-ui"
    },
    "endpoints": [{
      "type": "read_write",
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.5
    }]
  }'
```

> Each branch gets a new connection string. Use snapshots for [database versioning](#database-versioning) to preserve connection strings during a restore with `finalize_restore: true`.

---

## Resource management

Track usage per project with detailed information about compute time, storage, and network I/O. Set project-level quotas to match the organization and user tier.

### Set project resource limits

Organization defaults

- Sponsored organization: apply free-tier-equivalent project limits (e.g., storage, active time, compute time).
- Paid organization: apply higher limits aligned to your paid/pro tiers.

For implementation details, see the [querying consumption metrics](/docs/guides/consumption-metrics) guide.

### Project transfer details

You decide when to move a user's project from the sponsored organization to the paid organization. Neon does not upgrade or migrate projects automatically.

Primary method — API

- Use the API for automation and scale: `POST /organizations/{source_org_id}/projects/transfer`.
- Requires a personal API key with access to both organizations
- Can transfer up to 400 projects per API request
- See the [transfer projects between organizations](/docs/manage/orgs-project-transfer) documentation

With Neon's API, your agents can:

- Provision PostgreSQL databases in ~500ms
- Add production-ready authentication
- Create database snapshots for version control
- Implement per-user resource limits and usage tracking
- Scale databases to zero when idle (no compute charges when idle; storage is still billed)

Architecture assumption: This guide uses one Neon project per user for better isolation and security. For detailed architecture patterns and billing models, see the [platform integration getting started guide](/docs/guides/platform-integration-get-started).

Endpoint
`POST /organizations/{source_org_id}/projects/transfer`

Example

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/{source_org_id}/projects/transfer' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $API_KEY' \
     --header 'content-type: application/json' \
     --data '{
  "project_ids": [
    "{project-id-1}",
    "{project-id-2}"
  ],
  "destination_org_id": "{destination-org-id}"
}'
```

Response

```json
{}
```

---

## Autoscaling configuration

When provisioning databases for your users, Neon automatically scales compute based on actual usage. The system monitors three metrics and scales to meet whichever requires the most resources:

- **CPU load** (targeting < 90% utilization)
- **Memory usage** (targeting < 75% utilization)
- **Local file cache** (targeting < 75% utilization)

This ensures databases get the resources they need without manual intervention.

### Configure autoscaling ranges

Optionally reconfigure autoscaling min/max CUs to match your planned usage. Adjust over time based on observed CPU, memory, and cache pressure. For additional information, see the [autoscaling documentation](/docs/introduction/autoscaling).

### Update existing endpoints

Optionally adjust autoscaling limits for specific endpoints:

```bash
curl -X PATCH "https://console.neon.tech/api/v2/projects/$PROJECT_ID/endpoints/$ENDPOINT_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 4
    }
  }'
```

### Disable suspend on critical endpoints

Optionally prevent suspension to avoid cold starts. Disabling suspend keeps compute always on and may increase cost. Note: `suspend_timeout_seconds: 0` uses the default timeout; set to `-1` to disable suspension.

```bash
curl -X PATCH "https://console.neon.tech/api/v2/projects/$PROJECT_ID/endpoints/$ENDPOINT_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": {
      "suspend_timeout_seconds": -1
    }
  }'
```

**Cost implications**: Compute usage is billed.

---

## Authentication setup

Add production-ready authentication and access control to agent-generated apps to automatically sync user data to your database. See [how Neon Auth works](/docs/neon-auth/how-it-works) for more information and examples.

### Initialize Neon Auth

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/auth/create" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "auth_provider": "stack",
    "project_id": "shiny-wind-028834",
    "branch_id": "br-aged-salad-637688",
    "database_name": "app_db",
    "role_name": "app_user"
  }'
```

**Example response:**

```json
{
  "auth_provider": "stack",
  "auth_provider_project_id": "proj-example-123",
  "pub_client_key": "pck_example123",
  "secret_server_key": "ssk_example123",
  "jwks_url": "https://api.stack-auth.com/api/v1/projects/proj-example-123/.well-known/jwks.json",
  "schema_name": "neon_auth",
  "table_name": "users_sync"
}
```

### Generate SDK keys

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/auth/keys" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "shiny-wind-028834",
    "auth_provider": "stack"
  }'
```

### Configure OAuth providers

```bash
# Development (using shared keys)
curl -X POST "https://console.neon.tech/api/v2/projects/shiny-wind-028834/auth/oauth_providers" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id": "google"}'

# Production (with custom keys)
curl -X POST "https://console.neon.tech/api/v2/projects/shiny-wind-028834/auth/oauth_providers" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "github",
    "client_id": "Iv1.xxxxxxxxxxxx",
    "client_secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }'
```

**Available providers**: github, google, and microsoft

### Create users programmatically

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/auth/user" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "shiny-wind-028834",
    "auth_provider": "stack",
    "email": "admin@example.com",
    "name": "Admin User"
  }'
```

**Example response:**

```json
{
  "id": "user-id-123"
}
```

### Query synced users

Users are automatically synced to your database:

```sql
-- Query users directly from your database
SELECT id, email, name, signed_in_at
FROM neon_auth.users_sync
WHERE email_verified = true
ORDER BY created_at DESC;
```

---

## Database versioning

Build full version history into your platform. Your agent can snapshot schema and data at any moment, allowing users to roll back to working versions, preview earlier states, or safely test changes.

For a full guide on this topic, see the [database versioning with snapshots](/docs/ai/ai-database-versioning) guide.

## Point-in-time recovery (PITR)

Create a new branch at a past point in time without a pre-created snapshot. Useful for forensics, previewing historical states, or extracting specific rows without affecting production.

```bash
# Create a branch at a past point in time (PITR); production remains unchanged
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "branch": {
      "parent_id": "$ROOT_BRANCH_ID",
      "name": "pitr-2025-01-16-1420",
      "parent_timestamp": "2025-01-16T14:20:00Z"
    }
  }'
```

---

## Data API

Transform your database into REST endpoints automatically. The Data API provides instant HTTP access to your database without writing backend code, powered by PostgREST.

### Enable Data API

```bash
# Enable with Neon Auth (recommended)
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/data-api/app_db" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"auth_provider": "neon_auth"}'
```

The response includes your unique Data API endpoint URL. Once enabled, you can query your database using standard HTTP verbs (GET, POST, PATCH, DELETE) with PostgREST-compatible client libraries.

See the [Data API guide](/docs/data-api/get-started) for complete setup, query examples, RLS configuration, and supported client libraries.

---

## Best practices

### Connection management

- Use pooled connections (`-pooler` suffix) for serverless environments
- Use direct connections for long-running servers
- Connection limits vary by compute size, see [connection limits documentation](/docs/connect/connection-pooling#connection-limits-without-connection-pooling)

### Cost optimization

- Set `autoscaling_limit_min_cu` to 0.25 for scale-to-zero
- Configure appropriate `suspend_timeout_seconds` (300-900 seconds)
- Use smaller compute units for development branches
- Delete orphaned branches after restore - they accumulate storage costs (see [restore snapshots](#restore-a-snapshot-rollback) for cleanup code)
- Disable suspend on critical endpoints to eliminate cold starts, or increase `suspend_timeout_seconds` to reduce suspends. Note: keeping endpoints warm incurs idle compute cost.

## Troubleshooting common issues

| Issue                                       | Cause                                            | Solution                                                                               |
| ------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Snapshot creation fails**                 | Attempting to snapshot a non-root branch         | Only snapshot branches with no parent (check `parent_id` is null)                      |
| **Connection shows old data after restore** | Connecting before operations complete            | Always poll operations to terminal state after a restore with `finalize_restore: true` |
| **Accumulating storage costs**              | Orphaned branches from restores not deleted      | Delete branches ending with "(old)" after each restore                                 |
| **"Branch has children" error**             | Other branches depend on this branch             | Delete child branches first, or use snapshots instead of branches                      |
| **Connection string changed**               | Created new branch instead of restoring snapshot | Use a restore with `finalize_restore: true` to preserve connection string              |

## Resources

- The [AI Agents use case](/use-cases/ai-agents) page contains roadmap updates on upcoming services such as S3-compatible blob storage, email for auth/workflows, and a unified SDK to orchestrate database, auth, storage, and APIs.
- [Database versioning with Neon snapshots](/docs/ai/ai-database-versioning) - Comprehensive versioning guide with patterns and best practices
- [Snapshots demo application](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo) - Complete working example with source code
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon Platform Integration Guide](/docs/guides/platform-integration-get-started) - Comprehensive integration best practices
- [Neon OpenAPI Specification](/api_spec/release/v2.json)
- [Neon TypeScript SDK](https://github.com/neondatabase/toolkit)

<CTA
  title="Neon Agent Plan"
  description="For custom rate limits and dedicated support for your agent platform, apply now."
  buttonText="Sign Up"
  buttonUrl="/use-cases/ai-agents"
/>

