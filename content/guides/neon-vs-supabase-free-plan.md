---
title: Neon vs Supabase Free Plan - Aug 2026
subtitle: Compare the free plans for prototyping, vibe coding, side projects, and agents
author: neon-team
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-07-15T00:00:00.000Z'
---

<Admonition type="note">
Pricing and feature claims in this guide were verified against the live Neon and Supabase documentation on August 3, 2026. Confirm the [Neon pricing](/pricing) and [Supabase pricing](https://supabase.com/pricing) pages before making a decision.
</Admonition>

This comparison is for prototypes, side projects, and AI-assisted development, where the goal is a working app (database, sign-in, files, an API) on a free plan, kept running without a bill. For the service-by-service comparison, start with [Neon vs Supabase](/guides/neon-vs-supabase).

At this stage, three questions matter more than headline quotas: can the free plan run your whole backend, what happens when the project sits idle, and how many separate things you can build. The sections below take those in order.

## Free plan comparison

| Dimension        | Neon Free                                                                              | Supabase Free                                                                     |
| ---------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Monthly price    | $0                                                                                     | $0                                                                                |
| Projects         | 100                                                                                    | 2                                                                                 |
| Database         | Lakebase Postgres: 100 CU-hours per project per month; autoscaling up to 2 CU (≈8 GB RAM); 0.5 GB storage | Traditional Postgres: Nano instance, shared CPU, up to 0.5 GB RAM, always running; 500 MB database size |
| Auth             | Managed Better Auth, up to 60,000 MAU                                                  | Supabase Auth, up to 50,000 MAU                                                   |
| Functions        | Included, with usage limits                                                            | 500,000 Edge Function invocations                                                 |
| File storage     | Object Storage included, with usage limits                                             | 1 GB                                                                              |
| Realtime         | Not offered as a managed service                                                       | 2 million messages, 200 concurrent connections                                    |
| AI Gateway       | Not available on Free                                                                  | Not currently offered                                                             |
| Data API         | Included                                                                               | REST and GraphQL included                                                         |
| Network transfer | 5 GB per month                                                                         | 5 GB included                                                                     |
| Idle behavior    | Compute suspends after 5 minutes; auto-resumes on the next connection                  | Project pauses after 1 week of inactivity; you restore it manually                |
| Branching        | 10 branches per project                                                                | Not included; branches are billed per-hour environments on paid plans             |
| Recovery         | Instant restore with a 6-hour history window (1 GB limit); 1 manual snapshot           | None: no instant restore, no backups, no snapshots; manual CLI dumps recommended  |

Sources: [Neon plans](/docs/introduction/plans), [Object Storage](/docs/storage/overview), [Functions](/docs/compute/functions/overview); [Supabase pricing](https://supabase.com/pricing), [compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk), [branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching), [backups](https://supabase.com/docs/guides/platform/backups).

## Can the free plan run your whole backend?

**On Supabase Free, yes, within its quotas.** One project includes [Auth](https://supabase.com/docs/guides/auth) (social login, magic links), [Storage](https://supabase.com/docs/guides/storage), [Realtime](https://supabase.com/docs/guides/realtime), [Edge Functions](https://supabase.com/docs/guides/functions), and REST plus GraphQL APIs, wired together with one set of credentials. If your prototype is a chat app, needs file uploads, or wants social sign-in this afternoon, everything is included and documented ([quotas](https://supabase.com/pricing)). One quota is easy to miss: the built-in email sender delivers 2 auth emails per hour across the whole project, so magic links and confirmation emails throttle as soon as a second person tries your demo; raising the limit means connecting your own SMTP provider ([source](https://supabase.com/docs/guides/auth/rate-limits)).

**On Neon Free, yes for most app shapes.** [Managed Better Auth](/docs/auth/overview) covers email/password, OAuth, magic links, and OTP with 60,000 MAU; its shared email sender is also development-grade, so production sign-in wants your own SMTP provider there too ([source](/docs/auth/production-checklist)). The [Data API](/docs/data-api/overview) exposes your schema as a PostgREST-compatible REST API. [Functions](/docs/compute/functions/overview) and [Object Storage](/docs/storage/overview) are included with usage limits; there's no managed realtime product. A [`neon.ts` file](/docs/reference/neon-ts) declares the services so `neon deploy` can stand up the whole backend per branch.

The decision rule is simple: list the services your prototype actually uses. If it leans on realtime or image transformations, Supabase Free covers it today. If it's an app or agent backend built on database, auth, functions, and files, both cover it, and the differences below start to matter.

## Idle behavior

Prototypes spend most of their life idle, so idle behavior is the difference you'll actually feel.

A Neon Free project suspends compute after 5 minutes of inactivity and reactivates within a few hundred milliseconds on the next query ([source](/docs/introduction/scale-to-zero)). A demo you built three months ago still works when someone opens it; the first request is just slightly slower. Suspended computes don't consume the monthly 100 CU-hours, which is enough to run a 0.25 CU compute for 400 hours ([source](/docs/introduction/plans#compute)).

A Supabase Free project keeps its Nano instance running while active, but the platform pauses the whole project, database and services together, after one week of inactivity ([source](https://supabase.com/pricing)). A paused project doesn't serve requests until you restore it from the dashboard, and after 90 days paused, the one-click restore window closes and you're left with a downloadable backup ([source](https://supabase.com/docs/guides/platform/upgrading#time-limits)). For a prototype you touch weekly this never comes up; for a portfolio of old demos it means periodic manual restores.

## Traffic spikes

The opposite case matters too: what if the demo takes off for an afternoon? A Supabase Free project runs on a fixed Nano instance, shared CPU with up to 0.5 GB RAM, 60 direct connections, and 200 pooled clients, and it stays that size until you upgrade to a paid plan and resize ([source](https://supabase.com/docs/guides/platform/compute-and-disk)). A Neon Free project autoscales up to 2 CU (≈8 GB RAM) when load arrives, spending its 100 CU-hour monthly budget faster while it does ([source](/docs/introduction/plans#compute)). Neither free plan is built for launch traffic, but the ceilings differ: on Supabase it's the fixed instance, on Neon it's the compute budget.

## Project limits

Neon Free includes 100 projects, each a full backend: its own database, branches, auth, functions, and storage ([source](/docs/introduction/plans)). Idle projects cost nothing, so old experiments can pile up freely. Branching works on Free too: 10 branches per project, each an isolated copy of the backend for testing.

Supabase Free includes 2 active projects ([source](https://supabase.com/pricing)). Each is a complete backend, but a third experiment means pausing one, upgrading, or creating another organization. Branching isn't part of the Free plan; branches are separate environments billed per hour of compute on paid plans ([source](https://supabase.com/docs/guides/platform/manage-your-usage/branching)).

## AI-assisted development

Neon and Supabase both ship an MCP server, so AI agents in Cursor, Claude Code, and similar tools can inspect schemas, run queries, and manage backend resources: the [Neon MCP server](/docs/ai/neon-mcp-server) and the [Supabase MCP server](https://supabase.com/docs/guides/getting-started/mcp).

Two Neon behaviors help agent-driven work. Copy-on-write branches give an agent a safe, disposable copy of the backend to experiment on, auth included, with the parent untouched ([source](/docs/ai/ai-database-versioning)). And the 100-project allowance means an agent can create a fresh backend per experiment rather than sharing one. On Supabase, the MCP server covers database operations, Edge Functions, logs, and type generation, with read-only mode and non-production projects recommended for safety ([source](https://supabase.com/docs/guides/getting-started/mcp)).

Security also works differently when an app is built fast: a Supabase app reaches the database from the client, so every exposed table needs a correct RLS policy before a demo is safe to share ([source](https://supabase.com/docs/guides/deployment/going-into-prod)). With Managed Better Auth, sessions are verified in your app server, and RLS matters only if you expose tables through the Data API ([source](/docs/data-api/access-control)).

Recovery matters more when an agent is driving, because a destructive migration or a wrong `DROP TABLE` is a normal failure mode. Neon Free can restore a branch to any point in the last 6 hours ([source](/docs/introduction/plans#instant-restore)). Supabase Free doesn't include backups ([source](https://supabase.com/pricing)), so until you upgrade, there's no platform-level undo for whatever the agent just did.

## Outgrowing the free plan

The two upgrade paths have different shapes. On Neon, moving to the Launch plan keeps the metered model with no monthly minimum: a small full-stack app might cost a few dollars a month ([cost examples](/docs/introduction/plans#usage-based-cost-examples)). On Supabase, Pro at $25/month lifts the pause behavior and raises the service quotas (100,000 MAU, 100 GB storage, 2M function invocations), with overages billed per unit ([source](https://supabase.com/pricing)).

Compare those plans in detail in [Neon vs Supabase for an MVP or startup](/guides/neon-launch-plan-vs-supabase-pro-plan).

<Callout title="How to choose">
**Pick Neon** to accumulate experiments: 100 projects, idle projects cost nothing, agents get disposable branches and a 6-hour undo. **Pick Supabase** when a prototype fits the classic backendless pattern, the client talking straight to the database with realtime included, and you'll touch it at least weekly so it doesn't pause.
</Callout>

## Continue the comparison

<DetailIconCards>
<a href="/guides/neon-vs-supabase" title="Platform comparison" description="Compare the two backends service by service" icon="database">Neon vs Supabase overview</a>
<a href="/guides/neon-launch-plan-vs-supabase-pro-plan" title="MVP and startup" description="Compare the Neon Launch and Supabase Pro plans for an app with real users" icon="wallet">Stage 2: MVP and startup</a>
<a href="/guides/neon-scale-plan-vs-supabase-team-plan" title="Scaling a business" description="Compare capacity, compliance, recovery, and read scaling" icon="scale-up">Stage 3: Scaling</a>
</DetailIconCards>

<NeedHelp/>
