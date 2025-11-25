---
title: Agent plan integration guide
subtitle: Implement database provisioning and versioning for your AI agent platform
enableTableOfContents: true
isDraft: false
updatedOn: '2025-11-05T00:00:00.000Z'
---

This guide covers the technical implementation of the Neon agent plan for your platform. You'll learn how to provision databases, implement versioning, manage user upgrades, and monitor usage at scale.

<CTA title="Learn from agent platform builders" description="See how <a href='https://neon.com/blog/the-hidden-ops-layer-of-agent-platforms'>Anything manages per-agent isolation at scale</a>, <a href='https://neon.com/blog/databutton-neon-integration'>Databutton built full-stack AI agents with Postgres and Auth</a>, and <a href='https://neon.com/blog/building-versioning-for-ai-generated-apps'>Dyad implemented database versioning for AI-generated apps</a> using Neon." isIntro></CTA>

<Admonition type="note">
**Prerequisites:** You must be enrolled in the [Neon Agent Plan](/docs/introduction/agent-plan) with admin access to both your Free (sponsored) and paid organizations. If you haven't applied yet, visit [Neon for AI Agent Platforms](https://neon.com/use-cases/ai-agents).
</Admonition>

## What you'll learn

This integration guide walks through:

1. **Provisioning projects** — Creating databases for free and paid users with appropriate quotas
2. **Handling user upgrades** — Transferring projects between organizations when users change tiers
3. **Implementing database versioning** — Using PITR and snapshots for undo/redo functionality
4. **Creating development environments** — Setting up isolated branches for safe testing
5. **Integrating Neon Auth and Data API** — Optional full-stack features for complete backends
6. **Setting up monitoring and billing** — Tracking consumption metrics and configuring limits

## Before you begin

After enrolling in the agent plan, you should have:

- **Two Neon organization IDs** — One for Free (sponsored) projects, one for paid projects
- **Organization API keys** — For creating and managing projects in each organization
- **Personal API key** — For transferring projects between organizations
- **Admin access** — Full control over both organizations via the Neon API

Keep these credentials secure. You'll use them for all API operations in this guide. If you do not have API keys, see [Manage API keys](/docs/manage/api-keys).

### Project-per-tenant architecture

This guide uses a **project-per-tenant model**, where each tenant (user, app, or agent) gets its own dedicated Neon [project](/docs/manage/overview) (containing branches, databases, roles, and computes). This provides complete data and resource isolation, makes consumption limits and billing straightforward at the project level, and aligns with how the Neon API is designed. For more on this database-per-tenant approach, see [Data Isolation at Scale](https://neon.com/use-cases/database-per-tenant).

<Admonition type="tip">
For details about **Agent plan** structure, pricing, and benefits, see [Agent plan overview](/docs/introduction/agent-plan).
</Admonition>

<Steps>

## Provisioning projects

When a user on your platform needs a database, create a project in the appropriate organization based on their tier:

- **Free users** → Create projects in your Free organization (sponsored by Neon; no cost to you)
- **Paid users** → Create projects in your paid organization (usage-based billing)

The two-organization structure enables you to:

1. **Offer a truly free tier** — Neon sponsors all infrastructure costs for up to 30,000 free projects
2. **Scale sustainably** — Paid users consume from your credits ($0.106 per compute unit hour)
3. **Upgrade users** — Transfer projects from free to paid organizations when users upgrade
4. **Control resources** — Set different usage quotas/limits for projects to match your desired pricing model

### Project limits by organization

Each organization has different limits that apply to all projects created within it. Understanding these limits helps you design your platform's features and set appropriate user expectations.

| Limit                    | Free Organization | Paid Organization | Notes                                                      |
| ------------------------ | ----------------- | ----------------- | ---------------------------------------------------------- |
| **Max branches**         | 10 per project    | 1,000 per project | Includes all branches (production, development, snapshots) |
| **Max snapshots**        | 1 per project     | 10 per project    | Critical for versioning workflows                          |
| **Compute range**        | 0.25 - 2 CU       | 0.25 - 16 CU      | CU = Compute Units (vCPU + 4GB RAM per CU)                 |
| **History retention**    | 1 day             | Up to 7 days      | Point-in-time recovery window                              |
| **Min autosuspend**      | 5 minutes         | 1 minute          | Minimum time before compute suspends                       |
| **Max active endpoints** | 20 per project    | 20 per project    | Concurrent compute endpoints                               |
| **Read-only endpoints**  | 3 per project     | 3 per project     | Read replicas                                              |

**Key constraints to consider:**

- **Snapshot limits** — Free projects can only maintain 1 snapshot at a time, while paid projects can keep up to 10. This significantly impacts versioning strategies.
- **Branch limits** — Free projects are limited to 10 branches total, so you'll need to implement cleanup for development branches and temporary snapshots.
- **Compute limits** — Free projects can autoscale up to 2 CU, while paid projects can scale up to 16 CU for more demanding workloads.

For detailed quota examples and consumption limits, see [Configure consumption limits](/docs/guides/consumption-limits).

### Creating projects for free-tier users

For free-tier users, create projects in your Free organization (sponsored by Neon) with resource quotas matching (or within) Neon's Free plan limits using the [Create project](https://api-docs.neon.tech/reference/createproject) API:

| Resource          | Free Tier Quota    | Description                             |
| ----------------- | ------------------ | --------------------------------------- |
| **Compute**       | 0.25 / 2 vCPU      | Autoscales from 0.25 to 2 compute units |
| **Active time**   | `360000` seconds   | 100 hours of compute activity per month |
| **Storage**       | `536870912` bytes  | 512 MB total storage limit              |
| **Data transfer** | `5368709120` bytes | 5 GB data transfer per month            |

Example API request:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $FREE_ORG_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "name": "user-free-database",
    "pg_version": 16,
    "settings": {
      "quota": {
        "active_time_seconds": 360000,
        "logical_size_bytes": 536870912,
        "data_transfer_bytes": 5368709120
      }
    },
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 2,
      "suspend_timeout_seconds": 300
    }
  }
}'
```

### Creating projects for paid users

For paid users, create projects in your paid organization with higher resource quotas and autoscaling enabled. You can create multiple tiers within your paid organization to match your pricing model.

#### Example: Pro tier

| Resource          | Pro Tier Quota      | Description                             |
| ----------------- | ------------------- | --------------------------------------- |
| **Compute**       | 0.25 / 2 vCPU       | Autoscales from 0.25 to 2 compute units |
| **Active time**   | `2700000` seconds   | 750 hours of compute activity per month |
| **Storage**       | `10737418240` bytes | 10 GB storage limit                     |
| **Data transfer** | `53687091200` bytes | 50 GB data transfer per month           |

Example API request:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $PAID_ORG_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "name": "user-paid-database",
    "pg_version": 16,
    "settings": {
      "quota": {
        "active_time_seconds": 2700000,
        "logical_size_bytes": 10737418240,
        "data_transfer_bytes": 53687091200
      }
    },
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 2,
      "suspend_timeout_seconds": 300
    }
  }
}'
```

<Admonition type="tip">
**Creating multiple paid tiers:** You can define different quota levels within your paid organization to match your platform's pricing tiers (e.g., Pro, Business, Enterprise). Simply adjust the quota values and compute limits for each tier.
</Admonition>

For detailed information about configuring quotas and what happens when limits are reached, see [Configure consumption limits](/docs/guides/consumption-limits).

### Provisioning timing and user experience

Project provisioning is near-instant (typically under 1 second), but consider these timing factors:

1. **Project creation** — Returns immediately with project details
2. **Compute activation** — First connection may take 1-2 seconds as compute starts
3. **Subsequent connections** — Near-instant once compute is active

For the best user experience:

- Create projects asynchronously when users sign up or request a database
- Store the connection string immediately
- Show a "setting up your database" message during first connection
- After initial startup, subsequent connections are immediate

<Admonition type="tip">
**Store project metadata:** Save the project ID, organization ID, connection strings, and tier information in your database to associate them with your users. You'll need these for all future operations and billing.
</Admonition>

### Getting connection strings

After creating a project, retrieve the connection string to give to your users using the [Retrieve connection URI](https://api-docs.neon.tech/reference/getconnectionuri) API:

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/connection_uri?database_name=neondb&role_name=neondb_owner' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY"
```

The connection string format is:

```
postgres://[role]:[password]@[endpoint]/[database]?sslmode=require
```

### What's created automatically

Each new project includes:

- **One default branch** — Named `main` by default
- **One database** — Named `neondb` by default
- **One role** — Named `neondb_owner` with full privileges
- **One compute endpoint** — Configured with your specified settings

Using the [Create project](https://api-docs.neon.tech/reference/createproject) API, you can customize these defaults during project creation or create additional databases, roles, and branches as needed.

## Handling user upgrades

When a free user upgrades to a paid plan, transfer their project from the Free organization (sponsored) to the paid organization. This preserves all their data, branches, and configuration while moving them to your paid tier with higher quotas.

### Transferring projects between organizations

Project transfers between the two organizations in your agent plan require a **personal API key** rather than an organization API key. This is because:

- As an agent plan participant, you're an admin member of both your Free (sponsored) and paid organizations
- Personal API keys have access to all organizations you belong to
- Organization API keys only work within a single organization
- Transfers need to authenticate against both the source and destination organizations

Use your personal API key with the [Transfer project](https://api-docs.neon.tech/reference/createprojecttransferrequest) API to transfer projects:

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project_id}/transfer \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $PERSONAL_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "target_org_id": "<paid-org-id>"
}'
```

### Updating quotas after transfer

After transferring a project to your paid organization, update the resource quotas to match the user's new tier using the [Update project](https://api-docs.neon.tech/reference/updateproject) API:

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project_id} \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $PAID_ORG_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 720000,
        "compute_time_seconds": 2880000
      }
    },
    "default_endpoint_settings": {
      "autoscaling_limit_max_cu": 4
    }
  }
}'
```

<Admonition type="tip">
**Transfer limits:** You can transfer up to 400 projects per API request. To create a personal API key, see [Create a personal API key](/docs/manage/api-keys#create-a-personal-api-key).
</Admonition>

For more details, see [Transfer projects between organizations](/docs/manage/orgs-project-transfer).

### Handling downgrades

When a paid user downgrades to your free tier, transfer their project from the paid organization to the Free organization (sponsored) using the same personal API key:

```bash
# Transfer to Free organization (sponsored)
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project_id}/transfer \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $PERSONAL_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "target_org_id": "<free-org-id>"
}'
```

Then update quotas to match free tier limits:

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project_id} \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $FREE_ORG_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 360000,
        "logical_size_bytes": 536870912,
        "data_transfer_bytes": 5368709120
      }
    },
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 0.25,
      "autoscaling_limit_max_cu": 2
    }
  }
}'
```

<Admonition type="important">
**Check usage before downgrading:** If a user's current usage exceeds free tier limits, notify them and give them options to either reduce their database size or stay on a paid plan.
</Admonition>

## Implementing database versioning

AI agents and codegen platforms need robust database versioning to manage schema evolution and enable undo/redo functionality. Neon provides two complementary approaches:

### Point-in-time recovery (PITR)

Use PITR for recent history. The history retention window differs between your two organizations:

- **Free organization (sponsored by Neon)** — 1 day of point-in-time history
- **Paid organization** — Up to 7 days of point-in-time history
- **No storage cost** — PITR uses Neon's built-in history, no additional storage charges
- **Instant restore** — Restore databases to any point within the retention window in seconds

The Free organization provides 1 day of history retention, while the Paid organization provides up to 7 days. Factor these retention windows into your platform's feature offerings and set appropriate user expectations for each tier.

Example creating a branch from 2 hours ago using the [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) API:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "branch": {
    "name": "restored-state",
    "parent_id": "{parent_branch_id}",
    "parent_timestamp": "2024-11-05T14:00:00Z"
  }
}'
```

### Snapshots for longer retention

Use snapshots (branches) for versions you want to keep beyond the PITR retention window:

- **Persistent versions** — Keep snapshots as long as needed
- **Named versions** — Give meaningful names to important database states
- **Storage cost** — Snapshots count toward storage usage
- **Snapshot limits** — Free projects: 1 snapshot max; Paid projects: 10 snapshots max

<Admonition type="important">
**Snapshot limits:** Free organization projects can only maintain **1 snapshot at a time**. If you need to create a new snapshot, you must delete the existing one first. Paid organization projects can maintain up to **10 snapshots** simultaneously. Design your versioning UI accordingly.
</Admonition>

Example creating a snapshot:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "branch": {
    "name": "v1.0-stable",
    "parent_id": "{parent_branch_id}"
  }
}'
```

### When to use each approach

| Use Case                        | Recommended Method   | Why                                                                   |
| ------------------------------- | -------------------- | --------------------------------------------------------------------- |
| **Undo recent changes**         | PITR (point-in-time) | No storage cost, instant restore, automatic history (1 day to 7 days) |
| **Save before major migration** | Snapshot (branch)    | Persist beyond PITR window, named versions, explicit control          |
| **Daily automated backups**     | PITR (built-in)      | Already available, no action needed                                   |
| **Release versions**            | Snapshot (branch)    | Keep indefinitely, tag with version numbers                           |
| **Experiment/test safely**      | Development branch   | Isolated, can be deleted after testing                                |

### Recommended approach

Combine both methods for the best user experience:

1. **Use PITR for recent history** — Fast, automatic undo/redo (1 day for Free tier, up to 7 days for Paid tier)
2. **Create snapshots for milestones** — Preserve important versions (releases, working states) as branches
3. **Manage snapshot limits** — Free tier users can only keep 1 snapshot; implement a "replace snapshot" workflow. Paid tier users get 10 snapshots.
4. **Set user expectations** — Explain that recent history restores instantly, older versions may take longer
5. **Automate cleanup** — Delete old snapshots that are no longer needed to control storage costs and stay within limits

For more details on using snapshots, see [Database versioning for AI agents](/docs/ai/ai-database-versioning).

## Creating development environments

Agent platforms can give each user completely isolated development environments alongside their production database.

### The development workflow

For each user project, you can create:

1. **Production branch** — The main branch with live data
2. **Development branches** — Isolated copies for testing, development, and experimentation

Development branches are:

- **Instant to create** — Copy-on-write means instant branch creation
- **Fully isolated** — Separate compute, no impact on production
- **Cost-efficient** — Only pay for storage differences and actual compute usage
- **Easy to reset** — Restore development branch to match production anytime

<Admonition type="note">
**Branch limits:** Remember that Free organization projects have a **10 branch maximum** (including main branch, development branches, and snapshots), while Paid organization projects support up to **1,000 branches**. Implement branch cleanup for temporary development branches to stay within limits.
</Admonition>

Example creating a development branch using the [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) API:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "branch": {
    "name": "development",
    "parent_id": "{main_branch_id}"
  },
  "endpoints": [{
    "type": "read_write",
    "autoscaling_limit_min_cu": 0.25,
    "autoscaling_limit_max_cu": 2,
    "suspend_timeout_seconds": 300
  }]
}'
```

### Compute suspension settings

Control when development branch computes scale to zero:

- **Set to `0`** — Uses the default suspension timeout (300 seconds)
- **Positive integer** (e.g., `600`) — Custom timeout in seconds before scaling to zero
- **Set to `-1`** — Disables suspension entirely (compute always on, higher costs)

For development branches, a 5-minute timeout (300 seconds) balances cost efficiency with user experience.

This workflow prevents common issues like development data contaminating production databases, while giving users a safe space to experiment without risk.

## Integrating Neon Auth and Data API (optional)

Beyond database provisioning, Neon provides integrated authentication and REST API services that enable agent platforms to build complete, production-ready backends without managing separate infrastructure.

### Neon Auth: Built-in authentication

[Neon Auth](/docs/neon-auth/overview) provides authentication and user management that syncs directly with your Postgres database, eliminating the need for separate auth services like Auth0, Clerk, or Firebase Auth.

**Why agent platforms use Neon Auth:**

- **Unified backend** — Authentication, user management, and database in one service
- **No separate infrastructure** — No need to deploy or manage auth servers
- **Real-time sync** — User data automatically syncs to a `users` table in Postgres
- **Multi-tenant ready** — Each user database can have its own auth configuration
- **JWT-based** — Issues tokens that work with the Data API and your applications

**Enabling Neon Auth programmatically:**

Create an auth integration for a branch using the Neon API:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/auth \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project_id": "{project_id}",
  "branch_id": "{branch_id}"
}'
```

The response includes:

- `client_key` — Public key for your frontend application
- `secret_key` — Private key for backend operations
- Auth provider configuration details

Your agents or users can then implement authentication using the returned credentials with standard OAuth flows.

For complete details, see:

- [Neon Auth documentation](/docs/neon-auth/overview)
- [Create Neon Auth integration API](https://api-docs.neon.tech/reference/createneonauthintegration)

### Neon Data API: REST access to Postgres

The [Neon Data API](/docs/data-api/get-started) exposes your Postgres databases as REST endpoints, allowing agents and applications to query data over HTTPS without traditional database drivers.

**Why agent platforms use the Data API:**

- **No connection pooling needed** — Query over HTTP instead of managing TCP connections
- **Serverless-friendly** — Works in edge environments and serverless functions
- **PostgREST-compatible** — Standard REST interface for CRUD operations
- **Branch-aware** — Every branch gets its own API endpoint
- **JWT authentication** — Works seamlessly with Neon Auth tokens

**Enabling the Data API programmatically:**

Create a Data API integration for a branch:

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/data_api' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "enabled": true
}'
```

The response includes the Data API base URL for the branch. Your agents or users can then query the database over HTTPS:

```bash
curl --request POST \
     --url 'https://data-api.neon.tech/v1/projects/{project_id}/branches/{branch_id}/tables/{table_name}/query' \
     --header 'Content-Type: application/json' \
     --header "Authorization: Bearer {jwt_token}" \
     --data '{
  "query": "SELECT * FROM users WHERE email = $1",
  "params": ["user@example.com"]
}'
```

**Common use cases:**

- **Agent queries** — Let AI agents query databases directly via REST without SQL drivers
- **Edge functions** — Access Postgres from serverless edge environments
- **Preview branches** — Each development branch has its own isolated API endpoint
- **Public APIs** — Expose database endpoints to end users with JWT-based auth

For complete details, see:

- [Data API documentation](/docs/data-api/get-started)
- [Create Data API integration API](https://api-docs.neon.tech/reference/createprojectbranchdataapi)

## Setting up monitoring and billing

### Track usage per project

Query consumption metrics to understand usage and implement billing using the [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) API:

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?org_id={org_id}&limit=100' \
     --header 'accept: application/json' \
     --header "authorization: Bearer $NEON_API_KEY"
```

Available metrics:

- `active_time_seconds` — Compute active time
- `compute_time_seconds` — CPU seconds consumed
- `written_data_bytes` — Data written
- `data_transfer_bytes` — Data transferred out
- `synthetic_storage_size_bytes` — Total storage

See [Query consumption metrics](/docs/guides/consumption-metrics) for details.

### Configure consumption limits

Set limits per project to control costs using the [Update project](https://api-docs.neon.tech/reference/updateproject) API:

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project_id} \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 108000,
        "compute_time_seconds": 108000,
        "written_data_bytes": 10000000000,
        "logical_size_bytes": 5000000000
      }
    }
  }
}'
```

See [Configure consumption limits](/docs/guides/consumption-limits) for details.

</Steps>

## Best practices

### Project naming conventions

Use consistent naming when creating projects to identify project ownership and tier:

```bash
# Format: platform-username-tier-timestamp
"myapp-johndoe-free-1698765432"
"myapp-janedoe-pro-1698765433"
```

This makes it easier to track projects in your database and in the Neon console.

### Handle quota exhaustion

Monitor projects approaching their consumption limits and notify users before they hit quotas using the [Retrieve project consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) API:

```bash
# Get consumption for a project
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?project_ids={project_id}' \
     --header 'accept: application/json' \
     --header "authorization: Bearer $NEON_API_KEY"
```

Compare current usage against configured quotas and alert users at 80% and 95% thresholds. For detailed information on querying and interpreting consumption metrics, see [Query consumption metrics](/docs/guides/consumption-metrics).

### Error handling for provisioning

Project creation can fail for various reasons (rate limits, quota exhaustion). Implement retry logic with exponential backoff. Here's a JavaScript example:

```javascript
async function createProjectWithRetry(orgApiKey, projectConfig, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('https://console.neon.tech/api/v2/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${orgApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectConfig),
      });

      if (response.ok) return await response.json();
      if (response.status === 429) {
        // Rate limited, wait and retry
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw new Error(`Project creation failed: ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### Cleanup and project deletion

Delete projects when users explicitly request deletion or when cleaning up inactive projects using the [Delete project](https://api-docs.neon.tech/reference/deleteproject) API:

```bash
curl --request DELETE \
     --url https://console.neon.tech/api/v2/projects/{project_id} \
     --header "Authorization: Bearer $NEON_API_KEY"
```

**Best practices for project deletion:**

- **User-initiated deletion** — Delete projects immediately when users request it through your platform
- **Inactive project cleanup** — Consider automatically deleting projects that haven't been accessed in a specific timeframe (e.g., 30, 60, or 90 days)
- **Notify before deletion** — Warn users before deleting inactive projects and give them time to respond
- **Offer data archival** — Before deletion, offer to create a final snapshot branch that users can claim if needed later

### Connection limits and pooling

Be aware of the [connection limits](/docs/connect/connection-pooling#connection-limits-without-connection-pooling) associated with each compute size. Connection pooling allows for significantly more concurrent connections.

**Default connection limits without pooling:**

- 0.25 CU: 112 connections
- 0.5 CU: 225 connections
- 1 CU: 450 connections
- 2 CU: 900 connections
- 4+ CU: 1800+ connections

If your users' applications require many concurrent connections, use pooled connection strings. To learn more, see [Connection pooling](/docs/connect/connection-pooling).

<Admonition type="tip">
**For agent platforms:** Consider providing pooled connection strings by default to handle bursty connection patterns from autonomous agents and serverless functions.
</Admonition>

### Reserved names

Neon reserves certain names for system use. When creating databases or roles programmatically, avoid these reserved names:

- **Reserved role names** — See [Reserved role names](/docs/manage/roles#reserved-role-names)
- **Reserved database names** — See [Reserved database names](/docs/manage/databases#reserved-database-names)

Using reserved names will result in API errors during project creation.

## Platform tooling

### API-first implementation

Integrating Neon into your agent platform is fundamentally about using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Every operation in this guide—creating projects, managing branches, provisioning services, tracking usage—is performed through API calls.

**The Neon platform is API-first:** Almost anything you can do in the Neon Console is available through the Neon API. This means you can fully automate database provisioning, management, and monitoring for your users without manual intervention.

All code examples in this guide use direct API requests via `curl` to illustrate the underlying API structure. This approach helps you understand exactly what's happening and makes it easier to implement in any programming language.

**Key points:**

- **Everything is API-driven** — All Neon features are accessible programmatically
- **Language-agnostic** — Use any HTTP client or language that can make REST API calls
- **Full control** — Direct API access gives you complete flexibility in how you integrate Neon
- **Console parity** — Nearly all Console operations have corresponding API endpoints

For complete API documentation, authentication details, and all available endpoints, see the [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)

### SDKs and client libraries

While you can call the Neon API directly (as shown in this guide), Neon also provides SDK wrappers for popular languages that simplify authentication, request formatting, and error handling.

#### Neon Toolkit (TypeScript)

For TypeScript/JavaScript platforms and autonomous agents, the [Neon Toolkit](/docs/reference/neondatabase-toolkit) is a comprehensive SDK that bundles two key components:

**1. Neon API client** — Wraps the Neon API for platform management

- All API endpoints for projects, branches, databases, roles, and operations
- Type-safe methods with TypeScript support
- Simplified authentication and error handling

**2. Neon serverless driver** — Low-latency SQL queries

- Query Postgres over HTTP or WebSockets
- Optimized for serverless and edge runtimes
- Works with ORMs like Drizzle, Prisma, and Kysely

Installation:

```bash
npm install @neondatabase/toolkit
```

Example usage combining both components:

```typescript
import { createApiClient } from '@neondatabase/api-client';
import { neon } from '@neondatabase/serverless';

// Manage projects via API client
const apiClient = createApiClient({ apiKey: process.env.NEON_API_KEY });
const project = await apiClient.createProject({ project: { name: 'user-db' } });

// Query the database via serverless driver
const sql = neon(project.connection_uris[0].connection_uri);
const users = await sql`SELECT * FROM users`;
```

#### Other language SDKs

Neon provides official and community-maintained SDKs for other languages. All SDKs are wrappers around the Neon API:

- **[Python SDK](/docs/reference/python-sdk)** — Official Neon-supported Python wrapper
- **[Go SDK](https://github.com/kislerdm/neon-sdk-go)** — Community-maintained
- **[Node.js/Deno SDK](https://github.com/paambaati/neon-js-sdk)** — Community-maintained

For a complete list of available SDKs and their documentation, see [Neon SDKs](/docs/reference/sdk).

**Recommendation:** Use SDKs when available for your language to reduce boilerplate code. Otherwise, direct API calls work perfectly—all capabilities are identical.

### Higher rate limits for agent platforms

As an agent plan participant, you receive custom rate limits optimized for high-volume operations:

- **Management API** — Project creation, branch operations, compute management, auth and Data API provisioning
- **Data API** — REST queries to Postgres databases (when enabled)

Rate limits are customized based on your expected usage patterns. If you need adjustments as your platform scales, contact your Neon representative to discuss your requirements.

## Cost management

Managing costs across hundreds or thousands of databases requires clear visibility and control. Here's how to implement cost management for your agent platform.

### Understanding your cost structure

The agent plan's two-organization model provides different cost implications:

- **Free organization (sponsored by Neon)** — No charges to you for up to 30,000 projects. Neon sponsors all infrastructure costs (compute, storage, data transfer).
- **Paid organization** — Usage-based billing at $0.106 per compute unit hour, covered by your initial credits. You're billed for actual consumption across all paid projects.

### Implementing usage monitoring

Query consumption metrics to track usage across your fleet and implement billing:

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?org_id={org_id}&limit=100&from=2024-11-01T00:00:00Z&to=2024-11-30T23:59:59Z&granularity=daily' \
     --header 'accept: application/json' \
     --header "authorization: Bearer $NEON_API_KEY"
```

**Key metrics to track:**

- **Compute time** — Billable compute hours consumed (active time × compute units)
- **Storage** — Total storage used across all databases and branches
- **Data transfer** — Outbound data transfer (egress)

**Polling considerations:**

- Consumption data updates approximately every 15 minutes
- Minimum recommended polling interval: 15 minutes
- Rate limit: ~30 requests per minute per account
- Polling does NOT wake suspended computes

For complete details on querying and interpreting metrics, see [Query consumption metrics](/docs/guides/consumption-metrics).

### Setting quotas per tier

Control costs by setting consumption limits that match your pricing tiers. Quotas can be configured during project creation or updated anytime.

Example quotas for different tiers:

| Resource      | Free Tier       | Pro Tier        | Enterprise    |
| ------------- | --------------- | --------------- | ------------- |
| Active time   | 100 hours/month | 750 hours/month | Unlimited     |
| Compute range | 0.25 / 2 vCPU   | 0.25 / 2 vCPU   | 0.25 / 4 vCPU |
| Storage       | 512 MB          | 10 GB           | 100 GB+       |
| Data transfer | 5 GB            | 50 GB           | Custom        |

When a quota is reached, the project's computes automatically suspend until you adjust the limits or the next billing period.

For detailed information and API examples, see [Configure consumption limits](/docs/guides/consumption-limits) and the [Setting up monitoring and billing](#setting-up-monitoring-and-billing) section above.

### Cost optimization strategies

- **Aggressive autosuspend** — Set shorter `suspend_timeout_seconds` for free tier projects (5 minutes) to minimize idle compute time
- **Autoscaling limits** — Cap `autoscaling_limit_max_cu` appropriately for each tier to prevent unexpected spikes
- **Branch cleanup** — Implement automatic deletion of old development branches and unused snapshots to control storage
- **Usage alerts** — Warn users at 80% and 95% of their quota to prevent unexpected suspensions
- **Right-size compute** — Match compute ranges to actual workload requirements per tier

For complete pricing details and credit information, see [Agent plan pricing](/docs/introduction/agent-plan#pricing).

## Troubleshooting common issues

- **Project transfer fails with 403 error** — Using an organization API key instead of a personal API key. Project transfers between your Free (sponsored) and paid organizations require a personal API key because it has access to both organizations. Organization API keys only work within a single organization. Generate a personal API key in the Neon console under **Account settings** > **Developer settings**. See [Create a personal API key](/docs/manage/api-keys#create-a-personal-api-key).

- **Users hit quota limits unexpectedly** — Autoscaling can consume compute time faster than anticipated. Set `autoscaling_limit_max_cu` appropriately for each tier, monitor consumption metrics and alert users at 80% threshold, and consider lowering `suspend_timeout_seconds` for free tier to reduce active time.

- **First database connection is slow** — Compute needs to start from idle state (cold start). This is expected behavior for serverless compute (1-2 seconds on first connection). Set user expectations accordingly. For critical production endpoints, use `suspend_timeout_seconds: -1` to keep compute always on. Subsequent connections are near-instant.

- **Storage grows larger than expected** — Multiple branches or snapshots accumulate over time. Implement branch cleanup for old development branches, delete snapshots that are no longer needed, and monitor storage metrics to alert users approaching limits.

## Additional resources

<DetailIconCards>

<a href="/docs/introduction/agent-plan" description="Learn about plan structure, pricing, and program benefits" icon="database">Neon Agent Plan</a>

<a href="/docs/ai/ai-database-versioning" description="Implement versioning with branches, snapshots, and point-in-time recovery" icon="branching">Database versioning for AI agents</a>

<a href="/docs/manage/orgs-project-transfer" description="Move projects between organizations when users upgrade or downgrade" icon="import">Transfer projects</a>

<a href="/docs/guides/consumption-metrics" description="Query usage metrics for billing and monitoring" icon="transactions">Query consumption metrics</a>

<a href="/docs/reference/api-reference" description="Complete reference for all Neon API endpoints" icon="transactions">Neon API Reference</a>

<a href="https://github.com/neondatabase/toolkit" description="TypeScript SDK with API client and serverless driver" icon="github">Neon Toolkit</a>

</DetailIconCards>

## Support

As an agent plan participant, you have access to:

- **Dedicated Slack channel** — Direct access to the Neon team for technical questions
- **Your Neon representative** — Contact them for rate limit adjustments, limit increases, or custom needs
- **Priority support** — Faster response times for platform-critical issues

For immediate help, reach out through your dedicated Slack channel.
