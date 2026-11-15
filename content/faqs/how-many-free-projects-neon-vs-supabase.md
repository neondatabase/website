---
title: "How many free projects do Neon and Supabase include, and is it enough for a database per preview or per agent?"
subtitle: "Neon's Free plan includes 100 projects with 10 branches each. Supabase's Free plan includes 2 projects across all your organizations. A database per preview deployment or per AI agent fits on Neon Free; on Supabase it needs a paid plan, and each extra project or branch bills by the hour."
createdAt: '2026-11-15T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How can an AI agent provision a backend before the user has signed up?'
  slug: how-ai-agent-provisions-backend-before-signup
nextLink:
  title: 'How do I add file uploads to a Postgres app?'
  slug: how-to-add-file-uploads-postgres-app
updatedOn: '2026-11-15T14:59:27.573Z'
---

Neon's Free plan includes 100 projects, and each project includes 10 branches ([plans](/docs/introduction/plans)). Supabase's Free plan includes 2 projects, and the limit applies across every organization where you're an owner or administrator, so a second organization doesn't add more ([billing on Supabase](https://supabase.com/docs/guides/platform/billing-on-supabase)).

That difference decides whether you can give every preview deployment, every app, or every AI agent its own database without paying.

## What each free project includes

On Neon, the Free plan's allowances are per project, so each new project brings its own:

- 100 CU-hours of compute a month, enough to run a 0.25 CU compute (≈1 GB RAM) for 400 hours
- 1 GB of Postgres storage (with a 20 GB cap across all your projects)
- 5 GB of public network transfer a month
- 10 branches, including the root branch
- Managed Better Auth for up to 60k monthly active users, 5 GB of Object Storage, and 1 million Function invocations

Compute scales to zero after 5 minutes idle, so projects you aren't using don't spend their CU-hours ([plans](/docs/introduction/plans)).

On Supabase, the Free plan's egress and file storage quotas apply to the whole organization. Each database is limited to 500 MB, and projects with low activity over 7 days are paused until you resume them ([billing on Supabase](https://supabase.com/docs/guides/platform/billing-on-supabase), [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)).

## A database per preview deployment

A preview environment needs a database of its own so that a pull request's migrations and test data don't land in production or in another preview.

On Neon, you don't need a project per preview. A [branch](/docs/introduction/branching) is a copy-on-write copy of the parent branch, with its data, auth users, and files, usually ready in under a second. On the Free plan, a project can hold the production branch and 9 previews at a time. The [Vercel integration](/docs/guides/vercel-overview) creates a branch for each preview deployment, and [branch expiration](/docs/guides/branch-expiration) deletes branches automatically after a time you set, so old previews don't fill up the 10. Each preview's compute scales to zero while nobody is looking at it.

On Supabase, branching isn't part of the Free plan. On paid plans, each preview branch is its own instance that's billed from $0.01344 an hour on Micro compute for as long as it exists, and the $10 monthly compute credit doesn't apply to branches ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)).

## A database per AI agent or per user

Agent platforms and multi-tenant apps often give each agent run, user, or customer its own database, so one can't read or break another's data.

On Neon, a project per agent or per user fits the same model: 100 projects on Free and Launch and 1,000 on Scale, with no per-project fee, and each project's compute costs nothing while it's suspended ([plans](/docs/introduction/plans)). Projects and branches can be created from the [API](/docs/reference/api), the [CLI](/docs/cli), or the [MCP server](/docs/ai/neon-mcp-server). For platforms that need thousands of databases, the [Agent Plan](/docs/introduction/agent-plan) removes the project limit.

On Supabase, each project runs on a dedicated Postgres instance billed by the hour, about $10 a month on Micro. Paid plans include $10 of compute credits, which covers one Micro project, and each additional project adds to the monthly compute bill ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). Twenty small agent databases on Supabase Pro come to about $25 + (20 × $10) − $10 = $215 a month before any usage. On Neon, twenty projects that are mostly idle cost their storage plus the CU-hours they actually use.

## How the free plans compare

|                              | Neon Free                                         | Supabase Free                                     |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| **Projects**                 | 100                                               | 2, across all organizations you own or administer |
| **Branches**                 | 10 per project                                    | Not included                                      |
| **When a project sits idle** | Compute scales to zero, resumes on the next query | Paused after 7 days of low activity               |
| **Database size**            | 1 GB per project, 20 GB total                     | 500 MB per project                                |
| **Egress**                   | 5 GB per project                                  | 5 GB uncached and 5 GB cached, per organization   |

For a broader comparison of the two free plans, see [Neon vs Supabase Free plan](/guides/neon-vs-supabase-free-plan).

Vendor details verified on 2026-11-15 against the linked pages.

<CTA title="Give every preview and agent its own database" description="100 free projects with 10 branches each, and compute that scales to zero." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
