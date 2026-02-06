---
title: AI Agent integration guide
subtitle: Implement database provisioning and versioning for your AI agent platform
summary: >-
  Covers the technical implementation of database provisioning, versioning, user
  upgrades, and usage monitoring for AI agent platforms using the Neon agent
  plan.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-02-06T22:07:32.901Z'
---

This guide covers the technical implementation of the Neon agent plan for your platform. You'll learn how to provision databases, implement versioning, manage user upgrades, and monitor usage at scale.

<CTA title="Learn from other agent platform builders" description="See how <a href='https://neon.com/blog/the-hidden-ops-layer-of-agent-platforms'>Anything manages per-agent isolation at scale</a>, <a href='https://neon.com/blog/databutton-neon-integration'>Databutton built full-stack AI agents with Postgres and Auth</a>, and <a href='https://neon.com/blog/building-versioning-for-ai-generated-apps'>Dyad implemented database versioning for AI-generated apps</a> using Neon." isIntro></CTA>

<Admonition type="note">
**Prerequisites:** You must be enrolled in the [Neon Agent Plan](/docs/introduction/agent-plan). If you haven't applied yet, visit [Neon for AI Agent Platforms](https://neon.com/use-cases/ai-agents).
</Admonition>

## What you'll learn

This integration guide walks through:

1. **Provisioning projects** — Creating databases for free and paid users with appropriate quotas
2. **Handling user upgrades** — Transferring projects between organizations when users change tiers
3. **Implementing database versioning** — Using PITR and snapshots for undo/redo functionality
4. **Creating development environments** — Setting up isolated branches for safe testing
5. **Monitoring and billing** — Tracking usage and configuring limits

## Before you begin

After enrolling in the [Neon Agent Plan](/docs/introduction/agent-plan), you should have:

- **Two Neon organization IDs** — One for Free (sponsored) projects, one for paid projects
- **Organization API keys** — For creating and managing projects in each organization
- **Personal API key** — For transferring projects between organizations
- **Admin access** — Full control over both organizations via the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api)

Keep your API keys secure. You'll use them for all API operations in this guide. If you do not have the API keys, see [Manage API keys](/docs/manage/api-keys) for how to retrieve them.

### Project-per-tenant architecture

This integration uses a **project-per-tenant model**, where each tenant (user, app, or agent) gets its own dedicated Neon [project](/docs/manage/overview) (containing branches, databases, roles, and computes). This provides complete data and resource isolation, makes consumption limits and billing straightforward, and aligns with how the Neon API is designed. For more on this database-per-tenant approach, see [Data Isolation at Scale](https://neon.com/use-cases/database-per-tenant).

<Admonition type="tip">
For details about **Agent plan** structure, pricing, and benefits, refer to the [Neon Agent Plan](/docs/introduction/agent-plan) docs.
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

| Limit               | Free Organization | Paid Organization | Notes                                                      |
| ------------------- | ----------------- | ----------------- | ---------------------------------------------------------- |
| **Max branches**    | 10 per project    | 1,000 per project | Includes all branches (production, development, snapshots) |
| **Max snapshots**   | 1 per project     | 10 per project    | Critical for versioning workflows                          |
| **Compute range**   | 0.25 - 2 CU       | 0.25 - 16 CU      | CU = Compute Units (~4GB RAM per CU)                       |
| **Restore window**  | 1 day             | Up to 7 days      | Point-in-time recovery window                              |
| **Min autosuspend** | 5 minutes         | 1 minute          | Minimum time before compute suspends                       |

**Key constraints to consider:**

- **Snapshot limits** — Free projects can only maintain 1 snapshot at a time, while paid projects can keep up to 10. This significantly impacts versioning strategies.
- **Branch limits** — Free projects are limited to 10 branches total, so you'll need to implement cleanup for development branches and temporary snapshots.
- **Compute limits** — Free projects can autoscale up to 2 CU, while paid projects can scale up to 16 CU for more demanding workloads.

For detailed quota examples and consumption limits, see [Configure consumption limits](/docs/guides/consumption-limits).

### Creating projects for free-tier users

For free-tier users, create projects in your Free organization (sponsored by Neon) with resource quotas matching (or within) Neon's Free plan limits using the [Create project](https://api-docs.neon.tech/reference/createproject) API:

| Resource          | Free Tier Quota    | Description                             |
| ----------------- | ------------------ | --------------------------------------- |
| **Compute**       | 0.25 / 2 CU        | Autoscales from 0.25 to 2 compute units |
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
| **Compute**       | 0.25 / 2 CU         | Autoscales from 0.25 to 2 compute units |
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

After creating a project, retrieve the database connection string to give to your users using the [Retrieve connection URI](https://api-docs.neon.tech/reference/getconnectionuri) API:

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

Use PITR for recent history. The [restore window](/docs/introduction/restore-window) differs between your two organizations:

- **Free organization (sponsored by Neon)** — 1 day of point-in-time history (included at no charge)
- **Paid organization** — Up to 7 days of point-in-time history (billed at $0.20/GB-month for change history)
- **Instant restore** — Restore databases to any point within the restore window in seconds

The Free organization provides 1 day of restore window, while the Paid organization provides up to 7 days. Factor these restore windows into your platform's feature offerings and set appropriate user expectations for each tier.

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

Use snapshots (branches) for versions you want to keep beyond the [restore window](/docs/introduction/restore-window):

- **Persistent versions** — Keep snapshots as long as needed
- **Named versions** — Give meaningful names to important database states
- **Storage cost** — Snapshots count toward storage usage
- **Snapshot limits** — Free projects: 1 snapshot max; Paid projects: 10 snapshots max

<Admonition type="important">
**Snapshot limits:** Free organization projects can only maintain **1 snapshot at a time**. If you need to create a new snapshot, you must delete the existing one first. Paid organization projects can maintain up to **10 snapshots** simultaneously. Design your versioning UI accordingly.

**Pricing:** Snapshots are provided free of charge during beta, and will be charged based on GB-month storage at a rate lower than standard project storage after GA.
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

<Admonition type="tip">
Learn how our Developer Advocate approaches snapshot-based workflows in [Promoting Postgres changes safely to production](https://neon.com/blog/promoting-postgres-changes-safely-production).
</Admonition>

### When to use each approach

| Use Case                        | Recommended Method   | Why                                                          |
| ------------------------------- | -------------------- | ------------------------------------------------------------ |
| **Undo recent changes**         | PITR (point-in-time) | Instant restore, automatic history (1 day to 7 days)         |
| **Save before major migration** | Snapshot (branch)    | Persist beyond PITR window, named versions, explicit control |
| **Daily automated backups**     | PITR (built-in)      | Already available, no action needed                          |
| **Release versions**            | Snapshot (branch)    | Keep indefinitely, tag with version numbers                  |
| **Experiment/test safely**      | Development branch   | Isolated, can be deleted after testing                       |

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

## Monitoring and billing

### Track usage per project

You can use the Neon API to retrieve consumption metrics for your organizations and projects using these endpoints:

| Endpoint                                                                                                         | Description                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [Get account consumption metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount)          | Aggregates all metrics from all projects in an account into a single cumulative number for each metric                |
| [Get consumption metrics for each project](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) | Provides detailed metrics for each project in an account at a specified granularity level (hourly, daily, or monthly) |

Available metrics:

- `active_time_seconds` — Compute active time
- `compute_time_seconds` — CPU seconds consumed
- `written_data_bytes` — Data written to all branches
- `synthetic_storage_size_bytes` — Total storage used

For complete details on parameters, pagination, response formats, and metric definitions, see [Query consumption metrics](/docs/guides/consumption-metrics).

### Configure consumption limits

Set consumption limits per project to control costs. You can configure these limits during [project creation](#provisioning-projects) (as shown in the examples above) or update them later using the [Update project](https://api-docs.neon.tech/reference/updateproject) API:

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

- **Project naming** — Use consistent naming to track ownership and tier (e.g., `myapp-username-free-tier-timestamp`, `myapp-username-paid-tier-timestamp`).
- **Monitor quotas** — Alert users at 80% and 95% of consumption limits. See [Query consumption metrics](/docs/guides/consumption-metrics).
- **Retry logic** — Implement exponential backoff for API calls to handle rate limits and transient failures.
- **Project deletion** — Delete immediately when users request it; warn before removing inactive projects; offer final snapshots.
- **Connection pooling** — Provide [pooled database connection strings](/docs/connect/connection-pooling) by default for bursty workloads.
- **Reserved names** — Avoid [reserved role names](/docs/manage/roles#reserved-role-names) and [database names](/docs/manage/databases#reserved-database-names).

## API and SDKs

All platform integrations use the Neon API. You can call it directly or use language-specific SDKs:

- **[Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api)** — All operations (projects, branches, databases, monitoring) are API-driven; language-agnostic REST interface. Agent plan participants receive higher rate limits optimized for high-volume operations.
- **[Neon Toolkit](/docs/reference/neondatabase-toolkit)** (TypeScript) — API client for management + serverless driver for queries; optimized for edge/serverless runtimes.
- **Other SDKs** — [Python SDK](/docs/reference/python-sdk), [Go SDK](https://github.com/kislerdm/neon-sdk-go), [Node.js/Deno SDK](https://github.com/paambaati/neon-js-sdk). See [Neon SDKs](/docs/reference/sdk) for all options.

## Cost management

- **Free organization** — No charges to you for up to 30,000 free tier projects (Neon-sponsored).
- **Paid organization** — Usage-based billing at $0.106 per compute unit hour, covered by your initial credits. See [Agent plan pricing](/docs/introduction/agent-plan#pricing).
- **Monitor usage** — Track `active_time_seconds`, `compute_time_seconds`, `written_data_bytes`, `synthetic_storage_size_bytes` using [project metrics API](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject). Poll every 15 minutes; doesn't wake computes. See [Query consumption metrics](/docs/guides/consumption-metrics).
- **Set quotas** — Configure usage limits during [project creation](#provisioning-projects) or update later. See [Configure consumption limits](/docs/guides/consumption-limits).
- **Optimize costs** — Set shorter `suspend_timeout_seconds` (5 min) for free tier computes; cap `autoscaling_limit_max_cu` per tier to limit compute size scaling; cleanup old branches/snapshots to save on storage; alert your users at 80%/95% usage thresholds; right-size compute size ranges when creating projects for your users.

## Troubleshooting common issues

- **Project transfer fails with 403 error** — Using an organization API key instead of a personal API key. Project transfers between your Free (sponsored) and paid organizations require a personal API key because it has access to both organizations. Organization API keys only work within a single organization. Generate a personal API key in the Neon console under **Account settings** > **Developer settings**. See [Create a personal API key](/docs/manage/api-keys#create-a-personal-api-key).

- **Users hit quota limits unexpectedly** — Autoscaling can consume compute time faster than anticipated. Set `autoscaling_limit_max_cu` appropriately for each tier, monitor consumption metrics and alert users at 80% threshold, and consider lowering `suspend_timeout_seconds` for free tier to reduce active time.

- **First database connection is slow** — Compute needs to start from idle state (cold start). This is expected behavior for serverless compute (1-2 seconds on first connection). Set user expectations accordingly. For critical production endpoints, use `suspend_timeout_seconds: -1` to keep compute always on. Subsequent connections are near-instant.

- **Storage grows larger than expected** — Multiple branches or snapshots accumulate over time. Implement branch cleanup for old development branches, delete snapshots that are no longer needed, and monitor storage metrics to alert users approaching limits.

## Support

As an Neon Agent Plan participant, you have access to:

- **Dedicated Slack channel** — Direct access to the Neon team for technical questions
- **Your Neon representative** — Contact them for rate limit adjustments, limit increases, or custom needs
- **Priority support** — Faster response times for platform-critical issues

For immediate help, reach out through your dedicated Slack channel.
