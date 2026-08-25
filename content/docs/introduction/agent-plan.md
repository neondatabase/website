---
title: Neon Agent Plan
subtitle: Learn about using Neon to provision and manage databases for agentic platforms
summary: >-
  The Neon Agent Plan is a pricing tier for platforms that provision and manage
  Postgres databases for end users at scale. It is organized into sponsored
  organizations (free and paid) with unlimited projects. Platforms building
  multi-tenant SaaS or agentic applications choose this plan for sponsored
  free-tier infrastructure and up to $25,000 in paid-tier credits. Compute is
  billed at $0.106 per compute unit hour. Enrollment requires an active Neon
  Scale plan and team approval. All provisioning and fleet management runs
  through the Neon API, with autoscaling, scale-to-zero, branching, and
  point-in-time recovery included.
enableTableOfContents: true
updatedOn: '2026-08-25T15:36:44.109Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How the agent plan is organized</p>
<p>How Agent differs from Scale</p>
<p>How to get started</p>
</DocsList>
<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/ai-agent-integration">AI agent integration guide</a>
<a href="/docs/guides/platform-integration-overview">Integrating with Neon</a>
<a href="/docs/ai/ai-database-versioning">Database versioning with snapshots</a>
<a href="https://github.com/neondatabase/neon-for-agent-platforms">neon-for-agent-platforms on GitHub</a>
</DocsList>
</InfoBlock>

## Overview

The Neon agent plan provides infrastructure for platforms that deploy Postgres databases on behalf of end users. The plan uses a two-organization structure to separate free and paid user tiers, with unlimited projects in each organization. We incrementally raise your limit to accommodate growing usage.

Agent plan pricing and limits differ from the [Scale plan](/docs/introduction/plans). Agent is optimized for high project volume at Launch-rate compute pricing, with some Scale features and limits adjusted for fleet-style workloads.

## Why Neon for agent platforms

The lakebase architecture aligns with how agent platforms operate:

- **Instant provisioning**: Serverless Postgres with separated compute and storage provisions databases in seconds
- **Autoscaling and scale-to-zero**: Compute scales up and down automatically based on workload, and idle databases cost nothing while remaining instantly accessible
- **API management**: Every capability, including provisioning, quotas, branching, instant restore, and snapshots, is exposed through the Neon API
- **Database versioning**: Copy-on-write storage enables instant branching, snapshots, and point-in-time recovery for checkpoints and experimentation
- **Integrated services**: Neon supports built-in Auth and a PostgREST-compatible Data API for complete, production-ready backends

This combination enables agent builders to create thousands of databases without worrying about resource exhaustion or runaway costs.

## Enrollment requirements

To join the agent plan:

- You must have an active Neon Scale plan with a credit card on file

- Your application requires approval from the Neon team

Once your application is approved, the Neon team switches your Scale account to the Agent Plan and helps you set up a second Free Account for your Free Tier if needed. After setup, you manage all projects and configurations independently via the [Neon API](/docs/reference/api).

<CTA
  title="Neon agent plan"
  description="For custom rate limits and dedicated support for your agent platform, apply now."
  buttonText="Apply"
  buttonUrl="/use-cases/ai-agents"
/>

## Organization structure

Neon creates two organizations in your account:

### Free organization

This sponsored free organization hosts databases for your free-tier users at no cost to you; Neon sponsors the infrastructure. Individual projects have resource limits similar to Neon's standard free tier.

You are not charged for usage in this organization. Use this for users who haven't upgraded to your platform's paid plans. This means your free tier is truly free, with no database infrastructure costs passed to you.

For an overview of Free plan limits, see [Neon plans](/docs/introduction/plans).

### Paid organization

The paid organization hosts databases for your paying users with Agent plan pricing and limits. Neon provides up to $25,000 in initial credits to cover usage charges.

Compute is billed at $0.106 per compute unit hour (Launch rate, lower than Scale). You can create your own internal tier/plan structure within this organization, configuring different resource quotas for different user segments. Use this organization for users on your paid plans that need resource flexibility.

## Agent vs Scale

Agent and Scale are different plans. Enrollment starts from Scale, but after you join Agent your organizations use Agent pricing and limits.

| Feature                        | Agent plan                                                                 | Scale plan                                 |
| ------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------ |
| Projects                       | Unlimited. We incrementally raise your limit to accommodate growing usage. | 1,000 (can be increased on request)        |
| Compute                        | $0.106 per CU-hour                                                         | $0.222 per CU-hour                         |
| Max fixed compute size         | 16 CU                                                                      | 56 CU                                      |
| Autoscaling                    | Up to 16 CU                                                                | Up to 16 CU                                |
| Branches per project           | Up to 1,000                                                                | Up to 5,000                                |
| Root branches per project      | 5                                                                          | 25                                         |
| Read replicas                  | Up to 3                                                                    | Unlimited                                  |
| Instant restore history window | Up to 7 days                                                               | Up to 30 days                              |
| Public network transfer        | 100 GB per project included, then $0.10/GB                                 | 500 GB per project included, then $0.10/GB |
| Automated snapshot schedules   | Available upon request                                                     | Available                                  |

Both plans include metrics/logs export, SOC 2 reporting, private networking, and configurable scale-to-zero. For the full Scale feature list, see [Neon plans](/docs/introduction/plans).

## Managing projects

After initial enrollment, you have full control over both organizations as admin. Project limits are unlimited; we incrementally raise your limit to accommodate growing usage. All project operations are performed through the [Neon API](/docs/reference/api), enabling fleet management at scale with small engineering teams. You can:

- Create and delete projects in either organization
- Set per-project resource quotas and billing limits
- Monitor compute, storage, and network usage across all projects
- Track consumption metrics for building usage-based billing

The API-first approach means you can provision and manage thousands of databases programmatically without manual intervention.

### Project transfers between organizations

With the sponsored free and paid organization structure of the agent plan, you can move user projects between organizations when they upgrade or downgrade tiers. Transferring projects between organizations requires a [personal API key](/docs/manage/api-keys#types-of-api-keys) with access to both organizations. You can transfer up to 400 projects per request.

See [transfer projects between organizations](/docs/manage/orgs-project-transfer) for details.

## Pricing

The agent plan uses usage-based pricing with dedicated support. See [Agent vs Scale](#agent-vs-scale) for how limits compare to Scale.

| Resource                        | Agent plan                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| Projects                        | **Unlimited** <br/> _We incrementally raise your limit to accommodate growing usage._             |
| Branches per Project            | **Up to 1,000** <br/> _Agents use branches to quickly toggle between application states._         |
| Compute                         | **$0.106 per compute unit hour** <br/> _Same rate as Launch; lower than Scale_                    |
| Storage                         | **$0.35 per GB-month** <br/> _Same as Launch and Scale_                                           |
| Instant Restore (PITR)          | **$0.2 per GB-month** <br/> _Up to 7-day history window_                                          |
| Public network transfer         | **100 GB per project included**, then $0.10/GB                                                    |
| Management API                  | **Higher Rate Limits Available** <br/> _API for instant provisioning and management of databases_ |
| Data API (PostgREST-compatible) | **Higher Rate Limits Available** <br/> _REST API for direct database access_                      |
| Support                         | **Shared Slack Channel** <br/> _Direct access to the Neon team_                                   |

> _Pricing applies to the paid organization only._

## Billing model

The paid organization receives up to $25,000 in initial credits that cover compute ($0.106 per compute unit hour), storage, and data transfer charges. Usage is tracked per project, and the API exposes consumption metrics for building usage-based billing into your platform.

The sponsored free organization has no billing charges; Neon sponsors the infrastructure for your free tier users.

### Consumption metrics

Track compute time, storage, and network I/O per project to monitor usage and build billing logic. See the [consumption metrics guide](/docs/guides/consumption-metrics) for details.

## Program benefits

The agent plan includes these benefits for participating platforms:

| Benefit                    | Description                                                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Your Free Tier is free** | Neon sponsors projects in your free tier, covering infrastructure costs. Project limits are unlimited; we incrementally raise your limit to accommodate growing usage. |
| **General use credits**    | Up to $25,000 in credits for paid tier usage (for platforms not already enrolled in the [Neon Startup Program](https://neon.com/startups)).                            |
| **Higher rate limits**     | Custom rate limits for Management API and Data API to support high-volume operations.                                                                                  |
| **Dedicated support**      | Shared Slack channel with direct access to the Neon team for technical support.                                                                                        |
| **Co-marketing**           | Blog features, social promotions, hackathon support, and joint marketing opportunities.                                                                                |

## Getting started

Once enrolled in the agent plan:

1. You'll receive admin access to both organizations (sponsored and paid)
2. Create projects in the appropriate organization based on your user's tier
3. Configure resource quotas per project as needed
4. Monitor usage and billing using the Neon API

For step-by-step implementation instructions, see the [AI Agent integration guide](/docs/guides/ai-agent-integration).

<Admonition type="tip" title="Code samples and agent skill">
The [neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms) repository provides TypeScript samples and a companion agent skill for building on the agent plan. Install the companion skill with the [Neon CLI](/docs/cli):

```bash
neon skills -s neon-postgres-agent-platforms -y
```

</Admonition>
