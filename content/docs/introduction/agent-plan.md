---
title: Neon Agent Plan
subtitle: Learn about using Neon to provision and manage databases for agentic platforms
summary: >-
  Covers the organization and functionality of the Neon agent plan for
  provisioning and managing Postgres databases, including enrollment
  requirements and features like instant provisioning and autoscaling for
  agentic platforms.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.081Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How the agent plan is organized</p>
<p>How the agent plan works</p>
<p>How to get started</p>
</DocsList>
<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/ai-agent-integration">AI agent integration guide</a>
<a href="/docs/guides/platform-integration-overview">Integrating with Neon</a>
<a href="/docs/ai/ai-database-versioning">Database versioning with snapshots</a>
</DocsList>
</InfoBlock>

## Overview

The Neon agent plan provides infrastructure for platforms that deploy Postgres databases on behalf of end users. The plan uses a two-organization structure to separate free and paid user tiers, with each organization supporting up to 30,000 projects by default. You can request limit increases as your platform scales.

## Why Neon for agent platforms

Neon's architecture aligns with how agent platforms operate:

- **Instant provisioning**: Serverless Postgres with separated compute and storage provisions databases in seconds
- **Autoscaling and scale-to-zero**: Compute scales up and down automatically based on workload, and idle databases cost nothing while remaining instantly accessible
- **API management**: Every capability, including provisioning, quotas, branching, instant restore, and snapshots, is exposed through the Neon API
- **Database versioning**: Copy-on-write storage enables instant branching, snapshots, and point-in-time recovery for checkpoints and experimentation
- **Integrated services**: Neon supports built-in Auth and a PostgREST-compatible Data API for complete, production-ready backends

This combination enables agent builders to create thousands of databases without worrying about resource exhaustion or runaway costs.

## Enrollment requirements

To join the agent plan:

- You must have an active Neon paid plan with a credit card on file
- Your application requires approval from the Neon team
- The Neon team handles initial organization setup and configuration

Once your application is approved, the Neon team configures your agent plan's free and paid organizations and grants you admin access. After setup, you manage all projects and configurations independently via the [Neon API](/docs/reference/api-reference).

<CTA
  title="Neon agent plan"
  description="For custom rate limits and dedicated support for your agent platform, apply now."
  buttonText="Apply"
  buttonUrl="/use-cases/ai-agents"
/>

## Organization structure

Neon creates two organizations in your account:

### Free organization

This sponsored free organization hosts databases for your free-tier users at no cost to you — Neon sponsors the infrastructure. This organization includes Neon Scale plan features, but individual projects have resource limits similar to Neon's standard free tier.

You are not charged for usage in this organization. Use this for users who haven't upgraded to your platform's paid plans. This means your free tier is truly free, with no database infrastructure costs passed to you.

For an overview of Free plan limits and Scale plan features, see [Neon plans](/docs/introduction/plans).

### Paid organization

The paid organization hosts databases for your paying users. This organization includes Scale plan features but with agent-specific pricing. Neon provides up to $25,000 in initial credits to cover usage charges.

Compute is billed at $0.106 per compute unit hour (lower than standard Scale pricing). You can create your own internal tier/plan structure within this organization, configuring different resource quotas for different user segments. Use this organization for users on your paid plans that need resource flexibility.

## Managing projects

After initial enrollment, you have full control over both organizations as admin. Each organization supports 30,000 projects by default. All project operations are performed through the [Neon API](/docs/reference/api-reference), enabling fleet management at scale with small engineering teams. You can:

- Create and delete projects in either organization
- Set per-project resource quotas and billing limits
- Monitor compute, storage, and network usage across all projects
- Track consumption metrics for building usage-based billing

The API-first approach means you can provision and manage thousands of databases programmatically without manual intervention. When you need to scale beyond the default limits, you can request increases through your Neon contact.

### Project transfers between organizations

With the sponsored free and paid organization structure of the agent plan, you can move user projects between organizations when they upgrade or downgrade tiers. Transferring projects between organizations requires a [personal API key](/docs/manage/api-keys#types-of-api-keys) with access to both organizations. You can transfer up to 400 projects per request.

See [transfer projects between organizations](/docs/manage/orgs-project-transfer) for details.

## Pricing

The agent plan uses usage-based, agent-specific pricing with custom limits and dedicated support:

| Resource                        | Agent plan                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Projects                        | **Custom limits available** <br/> _Agents create a new project for each user application._            |
| Branches per Project            | **Custom limits available** <br/> _Agents use branches to quickly toggle between application states._ |
| Compute                         | **$0.106 per compute unit hour** <br/> _Usage-based pricing for agent-specific workloads_             |
| Storage                         | **$0.35 per GB-month** <br/> _Standard storage pricing_                                               |
| Instant Restore (PITR)          | **$0.2 per GB-month** <br/> _Point-in-time recovery storage_                                          |
| Management API                  | **Higher Rate Limits Available** <br/> _API for instant provisioning and management of databases_     |
| Data API (PostgREST-compatible) | **Higher Rate Limits Available** <br/> _REST API for direct database access_                          |
| Support                         | **Shared Slack Channel** <br/> _Direct access to the Neon team_                                       |

> _Pricing applies to the paid organization only._

## Billing model

The paid organization receives up to $25,000 in initial credits that cover compute ($0.106 per compute unit hour), storage, and data transfer charges. Usage is tracked per project, and the API exposes consumption metrics for building usage-based billing into your platform.

The sponsored free organization has no billing charges — Neon sponsors the infrastructure for your free tier users.

### Consumption metrics

Track compute time, storage, and network I/O per project to monitor usage and build billing logic. See the [consumption metrics guide](/docs/guides/consumption-metrics) for details.

## Program benefits

The agent plan includes these benefits for participating platforms:

| Benefit                    | Description                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Your Free Tier is free** | Neon sponsors up to 30,000 projects in your free tier, covering all infrastructure costs.                                                   |
| **General use credits**    | Up to $25,000 in credits for paid tier usage (for platforms not already enrolled in the [Neon Startup Program](https://neon.com/startups)). |
| **Higher rate limits**     | Custom rate limits for Management API and Data API to support high-volume operations.                                                       |
| **Dedicated support**      | Shared Slack channel with direct access to the Neon team for technical support.                                                             |
| **Co-marketing**           | Blog features, social promotions, hackathon support, and joint marketing opportunities.                                                     |

## Getting started

Once enrolled in the agent plan:

1. You'll receive admin access to both organizations (sponsored and paid)
2. Create projects in the appropriate organization based on your user's tier
3. Configure resource quotas per project as needed
4. Monitor usage and billing using the Neon API

For step-by-step implementation instructions, see the [AI Agent integration guide](/docs/guides/ai-agent-integration).
