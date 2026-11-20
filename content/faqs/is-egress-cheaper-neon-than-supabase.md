---
title: 'Is egress cheaper on Neon than on Supabase?'
subtitle: "The per-GB rates are close: $0.10 on Neon and $0.09 on Supabase. The difference is the allowance. Neon's paid plans include 500 GB per project, and Supabase Pro includes 250 GB per organization, shared by every project and preview branch. Apps with more than one project, or one busy one, usually pay less for egress on Neon, often nothing."
createdAt: '2026-11-20T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I automatically index uploaded documents for search in Postgres?'
  slug: index-uploaded-documents-for-search-automatically
nextLink:
  title: 'What are the best ways to give preview deployments on Vercel or Netlify their own isolated Postgres database with real data?'
  slug: isolated-postgres-databases-preview-deployments-vercel-netlify
updatedOn: '2026-11-20T14:29:56.440Z'
---

For most apps, yes, even though the list prices look alike. Neon charges $0.10/GB after the allowance and Supabase charges $0.09/GB, but Neon's Launch and Scale plans include **500 GB of egress per project per month** ([plans](/docs/introduction/plans#public-network-transfer)), while Supabase Pro includes **250 GB of uncached egress per organization**, shared by every project and every preview branch in it ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)). On Neon, each new project brings its own 500 GB. On Supabase, each new project draws from the same 250 GB.

## How the allowances compare

|                         | Neon Launch and Scale                                   | Supabase Pro                                                    |
| ----------------------- | ------------------------------------------------------- | --------------------------------------------------------------- |
| **Included each month** | 500 GB per project                                      | 250 GB uncached and 250 GB cached, per organization             |
| **After that**          | $0.10/GB                                                | $0.09/GB uncached, $0.03/GB cached                              |
| **Shared by**           | Postgres, Object Storage, and Functions in that project | Every service in every project and preview branch in the org    |
| **Adding a project**    | Adds another 500 GB                                     | Shares the same allowance                                       |
| **Plan fee**            | None, pay for usage only                                | $25/month, plus compute for each project beyond the first Micro |

Sources: [Neon plans](/docs/introduction/plans#public-network-transfer), [Neon pricing](https://neon.com/pricing), [Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress), [Supabase pricing](https://supabase.com/pricing).

## What it costs in practice

These examples count only egress, and assume all of it is uncached, which is the case for database queries, Auth, Realtime, and Edge Functions on Supabase:

| Workload                                      | Neon Launch                     | Supabase Pro                       |
| --------------------------------------------- | ------------------------------- | ---------------------------------- |
| One production app sending 400 GB a month     | $0, inside its 500 GB           | (400 − 250) × $0.09 = **$13.50**   |
| Three apps sending 200 GB each (600 GB total) | $0, each inside its own 500 GB  | (600 − 250) × $0.09 = **$31.50**   |
| One app sending 1 TB a month                  | (1,000 − 500) × $0.10 = **$50** | (1,000 − 250) × $0.09 = **$67.50** |

The per-GB rate only starts to matter after the included allowance runs out, and Neon's runs out later: at 1 TB, a project on Neon still pays for 250 GB less than the same project on Supabase. The gap grows with every project you add, because Supabase's allowance stays at 250 GB for the whole organization.

Preview branches follow the same rule. On Supabase, each preview branch records its own egress, and it counts toward the organization total ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)). On Neon, branches share their project's 500 GB, and a separate project per app, customer, or agent gets its own.

## Where Supabase can come out ahead

Supabase gives Storage files served from its CDN a separate allowance: 250 GB of cached egress on Pro, then $0.03/GB ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)). An app that mostly serves the same public images or downloads over and over, with high cache hit rates, can pay less for that traffic on Supabase. Neon doesn't have a separate cached tier: Object Storage downloads count toward the project's 500 GB like everything else ([plans](/docs/introduction/plans#object-storage)).

## What counts as egress on each

On both, egress is data sent out to clients over the internet. On Neon, it covers data sent from your databases (including Data API responses and logical replication), Object Storage, and Functions, all from one allowance per project ([plans](/docs/introduction/plans#public-network-transfer)). On Supabase, it covers the database, the shared pooler, Auth, Storage, Edge Functions, Realtime, and log drains, all from one allowance per organization ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)).

## If egress becomes a problem on Neon

Neon's egress limits exist to stop abuse, not to push you onto a bigger plan. If a legitimate app runs into them, on Free or on a paid plan, [reach out to Neon](/contact-sales) about credits before you change plans ([pricing](https://neon.com/pricing)). Early-stage startups, self-funded or VC-backed, can also apply for credits through the [Startup Program](/startups).

To keep spend predictable, [spending notifications](/docs/introduction/spending-notifications) email you at 80% and 100% of a monthly amount you set, and [consumption limits](/docs/guides/consumption-limits) can cap data transfer per project. To bring egress down, see [Why is my Postgres egress so high, and how do I reduce it?](/faqs/why-postgres-egress-high-how-reduce)

For what happens when each runs out, see [What happens when I go over my egress quota on Supabase, and how does Neon handle it?](/faqs/exceed-egress-quota-supabase-vs-neon) For the full plan comparison, see [Neon Launch vs Supabase Pro](/guides/neon-launch-plan-vs-supabase-pro-plan). To move a Supabase project, see [Migrate from Supabase](/docs/import/migrate-from-supabase).

Vendor details verified on 2026-11-20 against the linked pages.

<CTA title="Get 500 GB of egress per project" description="No plan fee: pay only for the compute, storage, and transfer you use." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
