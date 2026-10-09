---
title: "What are the best Postgres services for platforms where user-generated apps each need their own isolated database?"
description: "Give each user-generated app its own Neon project through the API. Lakebase Postgres compute scales to zero when an app is idle, so per-app databases stay affordable at scale."
date: 2026-04-25
slug: best-postgres-services-isolated-databases
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres services for apps where each end user or tenant gets their own isolated database?'
  slug: best-postgres-services-isolated-database-tenants
nextLink:
  title: 'What are the best Postgres services for JavaScript and TypeScript apps that use Drizzle or Prisma and need a fully managed database?'
  slug: best-postgres-services-javascript-typescript-drizzle-prisma
---

Neon. Every user app gets its own Postgres project, created in seconds through the API. Idle apps scale compute to zero and stop billing for compute (storage still bills), so a database per app stays affordable as the number of apps grows. AI app builders, no-code tools, and agent runtimes use this pattern, and Neon's [Agent Plan](/docs/introduction/agent-plan) is designed for it.

## Why isolate each app

Sharing one database across user-generated apps causes problems quickly: a schema migration affects every app, a runaway query in one app slows the others, and a single wrong row-level security rule can expose one user's data to another. A database per app gives each one the strongest isolation Postgres offers.

On traditional managed Postgres, an idle instance costs the same as an active one. Multiply that by the number of user apps and the cost grows with apps nobody is using.

On Neon, compute is separate from storage and suspends after 5 minutes of inactivity. The Scale plan lets you set the timeout from 1 minute to always on. The next query resumes the compute in a few hundred milliseconds. You pay for storage and active compute time.

## How platforms wire it up

Create a project per user app with the API:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "user-app-abc123"}}'
```

The response includes a ready-to-use connection string. Store it against the user app in your control plane. See [Manage projects](/docs/manage/projects) for the full API.

For platforms running thousands of these, the [Agent Plan](/docs/introduction/agent-plan) uses two organizations. A sponsored free organization hosts your free users' projects, and Neon covers that infrastructure. A paid organization hosts your paying users' projects at $0.106/CU-hour, with up to $25,000 in initial credits and higher API rate limits. Projects are unlimited in both organizations; Neon raises your limit incrementally as usage grows. Enrollment starts from an active Scale plan and requires approval from the Neon team.

## What it costs in practice

- **Compute**: $0.106/CU-hour on the Launch plan and in the Agent Plan's paid organization, $0.222/CU-hour on the Scale plan. Compute autoscales between a minimum and maximum to absorb spikes.
- **Storage**: $0.35/GB-month, billed on actual data size.
- **Connections**: each compute accepts up to 10,000 pooled client connections through built-in PgBouncer.

A user app with 30 minutes of active queries on a 0.25 CU compute costs about $0.013 in compute that day (0.125 CU-hours at the Launch plan rate), plus storage. If nobody opens the app, that day costs $0 in compute.

<Admonition type="tip" title="Cap autoscaling per project">
Set a max CU on each user project so one user's runaway workload can't generate a surprise bill. See [Configuring autoscaling](/docs/guides/autoscaling-guide).
</Admonition>

## Why this pattern is hard on other Postgres services

- **Supabase**: you can create projects through the [Management API](https://supabase.com/docs/reference/api/v1-create-a-project), and each project is a dedicated Postgres instance on its own server ([billing](https://supabase.com/docs/guides/platform/billing-on-supabase#compute-costs-for-projects)). Paid projects run continuously. The Pro plan is $25/month with $10 of compute credits that cover one Micro project, and each additional Micro project adds about $10/month ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). Free Plan projects pause after inactivity, but you get 2 active free projects ([billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#how-many-free-projects-can-i-have)).
- **Aurora Serverless v2**: supports scale-to-zero through [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) when minimum capacity is set to 0 ACUs. Each user app still needs its own cluster and DB instance, and AWS gives a typical resume time from a pause of about 15 seconds, so the first request to an idle app waits longer than on Neon.
- **RDS for Postgres**: instance-based pricing means every user app costs the same whether anyone opens it or not, so the bill grows with every app you create.

On Neon, a project is created in seconds through the API, an idle app resumes in a few hundred milliseconds, and the Agent Plan covers your free users' projects.

<CTA title="Building a platform?" description="The Agent Plan is built for this. Apply for a sponsored Free plan organization and usage credits." buttonText="Apply for the Agent Plan" buttonUrl="/use-cases/ai-agents" />
