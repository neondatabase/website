---
title: Agent plan structure and pricing
subtitle: Two-organization setup for managing databases across free and paid user tiers
enableTableOfContents: true
updatedOn: '2025-10-24T14:09:12.290Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How the agent plan is organized</p>
<p>How the agent plan works</p>
<p>How to use the Neon API to manage the plan</p>
</DocsList>
<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/platform-integration-intro">Neon platform integration</a>
<a href="/docs/ai/ai-database-versioning">Neon database versioning</a>
<a href="/programs/agents">Neon agent program</a>
</DocsList>
</InfoBlock>

## Overview

The Neon agent plan provides infrastructure for platforms that deploy Postgres databases on behalf of end users. The plan uses a two-organization structure to separate free and paid user tiers, with each organization supporting up to 30,000 projects by default.

## Enrollment requirements

To join the agent plan:

- You must have an active Neon paid plan with a credit card on file
- Your application requires approval from the Neon team
- The Neon team handles all organization setup and configuration

Initial enrollment is not self-service. Once approved, the Neon team configures both organizations and grants you admin access. After setup, you manage all projects and configurations independently via the [Neon API](/docs/reference/api-reference).

<CTA
  title="Neon agent plan"
  description="For custom rate limits and dedicated support for your agent platform, apply now."
  buttonText="Sign Up"
  buttonUrl="/use-cases/ai-agents"
/>

## Organization structure

Neon creates two organizations in your account:

### Sponsored organization

The sponsored organization hosts databases for your free-tier users at no cost to you. This organization includes the Scale plan features, but individual projects have resource limits similar to Neon's standard free tier.

You are not charged for usage in this organization. Use this for users who haven't upgraded to your platform's paid plans.

### Paid organization

The paid organization hosts databases for your paying users. This organization includes Scale plan features but with agent-specific pricing. Neon provides $30,000 in initial credits to cover usage charges.

Compute is billed at $0.14 per hour (lower than standard Scale pricing). You can create your own internal tier structure within this organization, configuring different resource quotas for different user segments. Use this organization for users on your paid plans that need resource flexibility.

## Managing projects

After initial enrollment, you have full control over both organizations as admin. Each organization supports 30,000 projects. All project operations are performed through the Neon API. You can:

- Create and delete projects in either organization
- Set per-project resource quotas
- Monitor usage across all projects
- Manage billing limits

This enables fleet management at scale without manual intervention. Request limit increases through your Neon contact when you approach capacity.

### Project transfers between organizations

Move user projects between organizations when they upgrade or downgrade tiers. Transfers require a personal API key with access to both organizations and support up to 400 projects per request.

See [transfer projects between organizations](/docs/manage/orgs-project-transfer) for details.

## Pricing

The agent plan uses usage-based pricing with higher rate limits and dedicated support:

| Resource                        | Agent plan                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Projects                        | **Custom limits available** <br/> _Agents create a new project for each user application._            |
| Branches per Project            | **Custom limits available** <br/> _Agents use branches to quickly toggle between application states._ |
| Compute                         | **$0.14 per CU-hour** <br/> _Same as Launch_                                                          |
| Storage                         | **$0.35 per GB-month** <br/> _Same as Launch/Scale_                                                   |
| Instant Restore (PITR)          | **$0.2 per GB-month** <br/> _Same as Launch/Scale_                                                    |
| Management API                  | **Higher Rate Limits Available** <br/> _API for instant provisioning and management of databases_     |
| Data API (PostgREST-compatible) | **Higher Rate Limits Available**                                                                      |
| Support                         | **Shared Slack Channel**                                                                              |

## Billing model

The paid organization receives $30,000 in initial credits that cover compute ($0.14/hour), storage, and data transfer charges. Usage is tracked per project, and the API exposes consumption metrics for building usage-based billing into your platform.

The sponsored (free) organization has no billing charges.

### Consumption metrics

Track compute time, storage, and network I/O per project to monitor usage and build billing logic. See the [consumption metrics guide](/docs/guides/consumption-metrics) for details.

## Program benefits

The agent plan includes additional benefits for participating platforms:

| Benefit                    | Description                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------- |
| **Your Free Tier is free** | Neon sponsors up to 30,000 projects per month used in your sponsored tier.            |
| **General use credits**    | Up to $30,000 in credits for those not eligible for the [Startup Program](/startups). |
| **Co-Marketing**           | Blog and social promotions, hackathons and more.                                      |

## Getting started

Once enrolled in the agent plan:

1. You'll receive admin access to both organizations (sponsored and paid)
2. Create projects in the appropriate organization based on your user's tier
3. Configure resource quotas per project as needed
4. Monitor usage and billing through the API

For detailed API integration instructions, see [Neon for platforms documentation](https://neon.com/docs/guides/platform-integration-intro).
