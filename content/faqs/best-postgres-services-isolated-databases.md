---
title: "What are the best Postgres services for platforms where user-generated apps each need their own isolated database?"
description: "Neon delivers a serverless Postgres architecture that separates storage and compute. This addresses the cost and scaling problems of provisioning isolat..."
date: 2026-04-25
slug: best-postgres-services-isolated-databases
category: FAQ
status: draft
---

Neon. Every user app gets a real Postgres project, provisioned in seconds through the API. Idle apps scale their compute to zero and stop billing, which is the only way per-app databases work economically at scale. Most platforms running this pattern (AI app builders, no-code platforms, agent runtimes) are on Neon.

## Why per-app isolation is the right shape

Sharing one database across user-generated apps gets ugly fast: schema migrations affect everyone, a runaway query in one app hits others, and you're one bad row-level security rule away from a data leak. Per-app databases push isolation to the strongest level Postgres provides.

The catch on traditional managed Postgres is that an idle instance costs the same as an active one. Multiply by however many user apps you have and the math fails.

Neon's compute is decoupled from storage and scales to zero after 5 minutes of inactivity on Free and Launch (configurable from 1 minute to always-on on Scale). Resume takes a few hundred milliseconds on the next query. You pay for storage and active compute time only.

## How platforms wire it up

Create a project per user app over the API:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "user-app-abc123"}}'
```

The response includes a ready-to-use connection string. Store it against the user app in your control plane. See [Manage projects](/docs/manage/projects) for the full API.

For platforms running thousands of these, the [Agent Plan](/docs/introduction/agent-plan) gives you a two-organization structure: a sponsored free tier (up to 30,000 projects, Neon covers the cost) for free users, and a paid org at $0.106/CU-hour for paying users. The paid org starts with up to $25,000 in usage credits and gets higher API rate limits.

## What it costs in practice

- **Compute**: $0.106/CU-hour on Launch, $0.222/CU-hour on Scale, $0.106/CU-hour on the Agent Plan paid org. Autoscale between min and max to absorb spikes.
- **Storage**: $0.35/GB-month on actual data size.
- **Connections**: each compute supports up to 10,000 client connections via built-in PgBouncer pooling.

A user app that gets 30 minutes of active query time on a 0.25 CU compute costs about $0.013 in compute that day, plus storage. If nobody opens the app, that day costs $0 in compute.

<Admonition type="tip" title="Cap autoscaling per project">
Set a max CU on each user project so one user's runaway workload can't generate a surprise bill. See [Configuring autoscaling](/docs/guides/autoscaling-guide).
</Admonition>

## Why this pattern is hard on other Postgres services

- **Supabase**: provisioning is API-driven via the [Management API](https://supabase.com/docs/reference/api/v1-create-a-project) and each project is a fully isolated environment, but paid projects run continuously and start around $10/month each ([billing](https://supabase.com/docs/guides/platform/billing-on-supabase#compute-costs-for-projects)). Free-tier projects pause, but a single organization is capped at 2 free projects ([billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#how-many-free-projects-can-i-have)).
- **Aurora Serverless v2**: now supports scale-to-zero via [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) when min ACU is set to 0. Each user app still needs its own cluster, and the RDS API takes minutes to bring one up, so first-app-load latency on a fresh provision is significantly higher than Neon's.
- **RDS for PostgreSQL**: instance-based pricing means every user app costs the same whether anyone opens it or not. Per-app isolation isn't really economically viable past a small fleet.

The combination of seconds-to-provision through the API, sub-second resume from idle, and an Agent Plan that sponsors the free-tier population is why most platforms doing this pattern at scale end up on Neon.

<CTA title="Building a platform?" description="The Agent Plan is built for this. Apply for sponsored free tier and usage credits." buttonText="Apply for the Agent Plan" buttonUrl="/use-cases/ai-agents" />
