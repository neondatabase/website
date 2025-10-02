---
title: Neon API for AI agent platforms
subtitle: Workflow for provisioning databases, authentication, and versioning for your AI codegen platform.
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

## Agent plan structure

Neon creates two organizations in your account to separate user tiers:

- **Sponsored org** (free to you): Project-level limits similar to the Neon free tier. Use for your free users.
- **Paid org** (with credits): Credits cover charges until depleted. Use for your paying users.

Default cap: 30,000 projects per org (adjustable on request). You're admin on both orgs. Request limit increases when needed.

Each user application gets its own isolated PostgreSQL database that provisions in ~500ms, scales to zero when idle, and supports full version history through snapshots.

<CTA
  title="Neon Agent Plan"
  description="For custom rate limits and dedicated support for your agent platform, apply now."
  buttonText="Sign Up"
  buttonUrl="/use-cases/ai-agents"
/>

## API operations

| Action                                                           | Description                                            | Endpoint                                                                    |
| ---------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| **[Create project](#application-provisioning)**                  | Provision PostgreSQL in ~500ms with auto scale-to-zero | `POST /projects`                                                            |
| **[Configure autoscaling](#autoscaling-configuration)**          | Set compute limits (0.25-8 CU)                         | `PATCH /projects/{project_id}/endpoints/{endpoint_id}`                      |
| **[Add auth](#authentication-setup)**                            | Setup Neon Auth with OAuth                             | `POST /projects/auth/create`                                                |
| **[Database versioning](#database-versioning)**                  | Snapshot schema and data                               | `POST /projects/{project_id}/branches/{branch_id}/snapshot`                 |
| **[Create dev branches](#create-development-branches)**          | Isolated dev environments                              | `POST /projects/{project_id}/branches`                                      |
| **[Enable Data API](#data-api)**                                 | REST endpoints from tables                             | `POST /projects/{project_id}/branches/{branch_id}/data-api/{database_name}` |
| **[Monitor usage](#get-project-consumption)**                    | Track resource consumption                             | `GET /projects/{project_id}/consumption`                                    |
| **[Transfer projects](#project-transfer-between-organizations)** | Move between orgs                                      | `POST /organizations/{source_org_id}/projects/transfer`                     |

## Working demo

Pattern in action: https://snapshots-as-checkpoints-demo.vercel.app/

Repo: https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo

Architecture: Meta DB (users, projects, checkpoints) + per-user app DB (one Neon project per session).

---

## Application provisioning

Choose org based on your user's tier:

- Sponsored org → free users
- Paid org → paying users

Transfer projects between orgs when users upgrade from free to paid.

<CodeTabs labels={["API", "Neon Toolkit"]}>

```bash
curl -X POST "https://console.neon.tech/api/v2/projects" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "user123-app",
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

const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);

// Choose org based on user tier (free vs paid)
const orgId =
  userTier === 'paid' ? process.env.NEON_ORG_ID_PAID : process.env.NEON_ORG_ID_SPONSORED;

const project = await toolkit.createProject({
  name: `user123-app`,
  org_id: orgId,
  branch: {
    name: 'main',
    role_name: 'app_user',
    database_name: 'app_db',
  },
  default_endpoint_settings: {
    autoscaling_limit_min_cu: 0.25,
    autoscaling_limit_max_cu: 1,
    suspend_timeout_seconds: 300,
  },
  pg_version: 17,
  region_id: 'aws-us-east-2',
});

const connectionUri = await toolkit.apiClient.getConnectionUri({
  projectId: project.project.id,
  branch_id: project.branches[0].id,
  database_name: 'app_db',
  role_name: 'app_user',
  pooled: true,
});
```

</CodeTabs>

---

## Create development branches

Create isolated dev environments:

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "branch": {
      "parent_id": "$PARENT_BRANCH_ID",
      "name": "feature-new-ui"
    },
    "endpoints": [{
      "type": "read_write",
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 0.5
    }]
  }'
```

Each branch gets a new connection string. For versioning that preserves connection strings, use snapshots.

---

## Autoscaling configuration

Neon autoscales based on CPU (&lt;90%), memory (&lt;75%), and cache (&lt;75%). Set min/max CU ranges per endpoint.

For additional information, see the [autoscaling documentation](/docs/introduction/autoscaling).

### Update limits

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

### Disable suspend (optional)

To avoid cold starts on critical endpoints, you can prevent suspension. This keeps compute always on and increases cost. Note: `suspend_timeout_seconds: 0` uses the default timeout; set to `-1` to disable suspension.

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

**Cost implications**: Compute usage is billed continuously when suspension is disabled.

---

## Authentication setup

Neon Auth syncs user data to your database automatically. See [how it works](/docs/neon-auth/how-it-works).

### Initialize

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/auth/create" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "auth_provider": "stack",
    "project_id": "$PROJECT_ID",
    "branch_id": "$BRANCH_ID",
    "database_name": "app_db",
    "role_name": "app_user"
  }'
```

Response includes `pub_client_key`, `secret_server_key`, and `jwks_url`.

### Generate SDK keys

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/auth/keys" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "$PROJECT_ID",
    "auth_provider": "stack"
  }'
```

### Configure OAuth

```bash
# Dev (shared keys)
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/auth/oauth_providers" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id": "google"}'

# Production (custom keys)
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/auth/oauth_providers" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "github",
    "client_id": "Iv1.xxxxxxxxxxxx",
    "client_secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }'
```

Available providers: github, google, microsoft

### Query users

Users sync automatically:

```sql
SELECT id, email, name, signed_in_at
FROM neon_auth.users_sync
WHERE email_verified = true
ORDER BY created_at DESC;
```

---

## Database versioning

Snapshot schema and data at any moment. Users can roll back, preview earlier states, or test changes safely.

See [database versioning with snapshots](/docs/ai/ai-database-versioning) for complete workflow including restore and cleanup.

### Point-in-time recovery

Create branch at past timestamp without pre-created snapshot:

```bash
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

Transform tables into REST endpoints. PostgREST-compatible.

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/data-api/app_db" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"auth_provider": "neon_auth"}'
```

Response includes endpoint URL. Use standard HTTP verbs (GET, POST, PATCH, DELETE). See [Data API guide](/docs/data-api/get-started).

---

## Project transfer between organizations

Move user projects from sponsored to paid org when they upgrade:

```bash
curl -X POST "https://console.neon.tech/api/v2/organizations/$SOURCE_ORG_ID/projects/transfer" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_ids": ["$PROJECT_ID_1", "$PROJECT_ID_2"],
    "destination_org_id": "$DEST_ORG_ID"
  }'
```

Requires personal API key with access to both orgs. Transfer up to 400 projects per request.

See [transfer projects between organizations](/docs/manage/orgs-project-transfer) for details.

---

## Get project consumption

Track compute time, storage, and network I/O per project. See [consumption metrics guide](/docs/guides/consumption-metrics).

---

## Best practices

### Connection management

- Use pooled connections (`-pooler`) for serverless
- Use direct connections for long-running servers
- See [connection limits](/docs/connect/connection-pooling#connection-limits-without-connection-pooling)

### Cost optimization

- Set `autoscaling_limit_min_cu: 0.25` for scale-to-zero
- Use 300-900s `suspend_timeout_seconds`
- Smaller compute for dev branches
- Delete orphaned "(old)" branches after restore
- Disable suspend on critical endpoints to eliminate cold starts (increases cost)

<CTA
  title="Neon Agent Plan"
  description="For custom rate limits and dedicated support for your agent platform, apply now."
  buttonText="Sign Up"
  buttonUrl="/use-cases/ai-agents"
/>

## Resources

- [Neon database versioning guide](/docs/ai/ai-database-versioning)
- [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon platform integration guide](/docs/guides/platform-integration-get-started)
- [Neon OpenAPI specification](/api_spec/release/v2.json)
- [Neon TypeScript SDK](https://github.com/neondatabase/toolkit)
