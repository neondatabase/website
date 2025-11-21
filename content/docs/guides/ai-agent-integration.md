---
title: Neon for AI Agents
subtitle: Build and scale transformative AI agent platforms with Neon Postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2025-11-05T00:00:00.000Z'
---

Neon is purpose-built for AI agent platforms and code generation services that need to provision, version, and manage Postgres databases at scale. With instant provisioning, database branching, and a two-organization structure that includes sponsored free-tier projects, Neon makes it easy to offer Postgres to your users from day one.

## Why Neon for AI agents?

AI agent platforms have unique requirements that traditional Postgres hosting can't easily meet:

- **Instant provisioning** — Agents need to spin up databases in under 1 second, not minutes
- **Database versioning** — Agents create snapshots and restore databases to specific points in time
- **Isolated environments** — Each user needs completely isolated development and production databases
- **Economic free tier** — You need to offer free databases without burning cash on infrastructure
- **Project transfers** — Move user databases between organizations when they upgrade from free to paid plans
- **Agent-specific features** — Authentication, schema versioning, and environment management built for codegen workflows

## The two-organization structure

Unlike standard embedded Postgres integrations, AI agent platforms typically need to support both free and paid users with very different resource requirements. Neon's agent plan provides a two-organization structure to handle this:

### Sponsored organization (Free tier)

Your **sponsored organization** hosts databases for your free-tier users at no cost to you. Neon subsidizes these projects so you can offer a generous free tier without infrastructure costs.

**Key details:**

- Includes Scale plan features
- Individual projects have Free plan resource limits
- Supports up to 30,000 projects by default
- No billing charges to you
- Users must replicate Neon's free-tier limits (or less) to qualify

Use this organization for users who haven't upgraded to your platform's paid plans.

### Paid organization

Your **paid organization** hosts databases for your paying users with agent-specific pricing and flexible resource limits.

**Key details:**

- Scale plan features with agent pricing
- $30,000 in initial credits
- Compute billed at $0.106/hour (lower than standard Scale pricing)
- Supports up to 30,000 projects by default
- Custom limits available
- You control resource quotas per project

Use this organization for users on your paid plans that need more resources or flexibility.

<Admonition type="important">
Both organizations require a paid Neon plan with a credit card on file. The sponsored organization itself costs you nothing, but you must have a paid plan to qualify for the agent program.
</Admonition>

## Managing the two organizations

### Initial setup

1. Apply for the agent program at [neon.com/use-cases/ai-agents](/use-cases/ai-agents)
2. Neon reviews your application
3. Neon creates both organizations and grants you admin access
4. You receive API keys for both organizations
5. You begin creating projects in the appropriate organization based on user tier

### Creating projects

Create projects in the sponsored organization for free users:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $SPONSORED_ORG_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "name": "user-free-database",
    "pg_version": 16,
    "settings": {
      "quota": {
        "active_time_seconds": 100800,
        "compute_time_seconds": 25200,
        "written_data_bytes": 512000000,
        "logical_size_bytes": 512000000
      }
    }
  }
}'
```

Create projects in the paid organization for paying users:

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

### Transferring projects between organizations

When a free user upgrades to a paid plan, transfer their project from the sponsored organization to the paid organization:

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

After transferring, update the project's consumption limits to match the user's new paid plan tier.

<Admonition type="note">
Project transfers require a personal API key with access to both organizations, not an organization API key. You can transfer up to 400 projects per request.
</Admonition>

For detailed information about project transfers, see [Transfer projects between organizations](/docs/manage/orgs-project-transfer).

## Database versioning for agents

AI agents and codegen platforms need robust database versioning to manage schema evolution and enable undo/redo functionality. Neon provides two complementary approaches:

### Point-in-time recovery (PITR)

Use PITR for recent history (within the last 7 days on Scale plan):

- **Instant restore** — Restore databases to any point in the last 7 days in seconds
- **No storage cost** — PITR uses Neon's built-in history, no additional storage charges
- **Perfect for undo** — Let users quickly roll back recent changes

Example creating a branch from 2 hours ago:

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

Use snapshots for versions you want to keep longer than 7 days:

- **Persistent versions** — Keep snapshots as long as needed
- **Named versions** — Give meaningful names to important database states
- **Storage cost** — Snapshots count toward storage usage

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

### Recommended approach

Combine both methods for the best user experience:

1. **Use PITR for recent history** — Fast, free undo/redo for the last 7 days
2. **Create snapshots for milestones** — Preserve important versions (releases, working states) as branches
3. **Set user expectations** — Explain that recent history restores instantly, older versions may take longer

For more details, see [Database versioning for AI agents](/docs/ai/ai-database-versioning).

## Isolated development environments

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

Example creating a development branch:

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

This workflow prevents disasters like development data appearing in production (a common problem when sharing databases) and gives users a safe space to experiment.

## Agent-specific features

### Authentication integration

For codegen platforms, authentication is a standard part of the integration. Consider using:

- [Neon Auth](/docs/neon-auth/overview) for a complete auth solution
- Custom authentication that ties user identity to their Neon project

### API tools for agents

If you're building autonomous agents, consider the [Neon Toolkit](https://github.com/neondatabase/toolkit):

```bash
npm install @neondatabase/toolkit
```

The toolkit includes:

- Neon API client for project management
- Neon serverless driver for querying databases
- Purpose-built for AI agent workflows

### Rate limits

Agent platforms receive higher rate limits on:

- Management API (project creation, branch operations)
- Data API (PostgREST-compatible data access)

Contact your Neon representative to discuss your specific rate limit needs.

## Monitoring and billing

### Track usage per project

Query consumption metrics to understand usage and implement billing:

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

Set limits per project to control costs:

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

## Agent plan pricing

The agent plan uses usage-based pricing with agent-specific rates:

| Resource                   | Agent Plan                  |
| -------------------------- | --------------------------- |
| **Projects**               | Custom limits (30k default) |
| **Branches per project**   | Custom limits available     |
| **Compute**                | $0.106 per CU-hour          |
| **Storage**                | $0.35 per GB-month          |
| **Instant Restore (PITR)** | $0.2 per GB-month           |
| **Management API**         | Higher rate limits          |
| **Data API**               | Higher rate limits          |
| **Support**                | Shared Slack channel        |

### Program benefits

| Benefit                 | Description                                         |
| ----------------------- | --------------------------------------------------- |
| **Free tier sponsored** | Neon sponsors up to 30,000 free-tier projects/month |
| **Usage credits**       | $30,000 in initial credits for paid organization    |
| **Co-marketing**        | Blog posts, social promotion, hackathons            |
| **Dedicated support**   | Shared Slack channel with Neon team                 |

For complete details, see [Agent plan structure and pricing](/docs/introduction/agent-plan).

## Getting started

<Steps>

## Apply to the agent program

Visit [neon.com/use-cases/ai-agents](/use-cases/ai-agents) and apply with details about your platform.

## Wait for approval

The Neon team reviews applications and sets up qualified platforms.

## Receive org access

Once approved, Neon creates both organizations and grants you admin access plus API keys.

## Start building

Begin creating projects in the appropriate organization based on user tier:

- Free users → Sponsored organization
- Paid users → Paid organization

## Implement key features

- Set up project creation workflows
- Implement database versioning with PITR and snapshots
- Create isolated development environments
- Configure consumption limits per user tier
- Build project transfer flow for user upgrades
- Monitor usage for billing

</Steps>

## Additional resources

<DetailIconCards>

<a href="/docs/introduction/agent-plan" description="Understand pricing and organization structure" icon="database">Agent plan details</a>

<a href="/docs/ai/ai-database-versioning" description="Learn about versioning strategies" icon="branching">Database versioning</a>

<a href="https://github.com/neondatabase/toolkit" description="npm package for AI agents" icon="github">Neon Toolkit</a>

<a href="/docs/reference/api-reference" description="Full API documentation" icon="transactions">Neon API</a>

<a href="/use-cases/ai-agents" description="Learn about Neon for agent platforms" icon="handshake">Neon for AI Agents</a>

<a href="/contact-sales" description="Talk to our team" icon="todo">Contact us</a>

</DetailIconCards>

<Admonition type="info">
Agent program participants have access to a dedicated Slack channel for support and can contact their Neon representative directly.
</Admonition>
