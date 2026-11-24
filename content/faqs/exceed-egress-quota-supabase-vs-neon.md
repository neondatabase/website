---
title: 'What happens when I go over my egress quota on Supabase, and how does Neon handle it?'
subtitle: "On Supabase's Free plan, or on Pro with the spend cap on, going over the egress quota leads to restrictions on every project in the organization, from read-only databases to paused projects. On Neon, the Free plan suspends only the project that ran out, without touching your data, and paid plans keep running and bill $0.10/GB after 500 GB per project."
createdAt: '2026-11-20T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I enable the pgvector extension in my Neon database?'
  slug: enable-pgvector-extension
nextLink:
  title: 'How do I export or download my Neon database as a SQL file?'
  slug: export-database-sql-file
updatedOn: '2026-11-20T14:29:56.440Z'
---

On Supabase, egress is one quota for the whole organization: 5 GB uncached and 5 GB cached on Free, and 250 GB of each on Pro ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)). On Neon, egress is counted per project: 5 GB on Free and 500 GB on Launch and Scale, then $0.10/GB ([plans](/docs/introduction/plans#public-network-transfer)). That changes both how quickly you hit the limit and what happens when you do.

## On Supabase

When a Free organization, or a Pro organization with the spend cap on, exceeds its quota, Supabase emails the billing address and starts a grace period. If usage stays over the limit, the Fair Use Policy applies restrictions, which can include pausing projects, switching databases to read-only, blocking new projects, or answering every API request with a `402` status code. Restrictions generally apply to **all projects in the organization**, not only the one that used the egress ([Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#fair-use-policy)).

A few details matter if you're in this situation:

- **The spend cap is on by default on Pro.** Turning it off lifts the restriction and bills overage at $0.09/GB uncached and $0.03/GB cached ([Supabase pricing](https://supabase.com/pricing)).
- **Restrictions lift when the quota refills** at the start of the next billing cycle, or right away if you upgrade from Free or turn off the spend cap ([Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#how-can-i-remove-restrictions-applied-from-the-fair-use-policy)).
- **There's only one grace period.** After it ends, the dashboard keeps a warning, and if you go over again before the warning clears, your project is restricted without another grace period ([Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#what-is-a-grace-period-and-does-it-reset-after-usage-drops)).
- **Pausing a project doesn't give back egress** already used in the current cycle ([Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#how-can-i-remove-restrictions-applied-from-the-fair-use-policy)).

## On Neon

**On the Free plan,** each project has its own 5 GB a month, shared by Postgres, Object Storage, and Functions in that project. When a project uses it up, that project's compute is suspended until the next billing period or until you upgrade. Your other projects keep running, and no data is deleted ([network transfer](/docs/introduction/network-transfer), [pricing](https://neon.com/pricing)).

**On Launch and Scale,** nothing stops. Each project includes 500 GB a month, then egress bills at $0.10/GB ([plans](/docs/introduction/plans#public-network-transfer)). If you want a ceiling, [spending notifications](/docs/introduction/spending-notifications) email you at 80% and 100% of a monthly amount you set, and [consumption limits](/docs/guides/consumption-limits) can suspend a project's compute when it reaches a data transfer quota you choose.

**If you run into the limit with a real app,** [reach out to Neon](/contact-sales) about credits before you change plans. The limits are there to prevent abuse, not to push you onto a bigger plan, and Neon is generous with credits when egress is the problem, on Free and on paid plans ([pricing](https://neon.com/pricing)).

## Side by side

|                        | Neon                                                      | Supabase                                                                         |
| ---------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Free quota**         | 5 GB per project                                          | 5 GB uncached and 5 GB cached, per organization                                  |
| **When Free runs out** | That project's compute is suspended until the next period | Grace period, then restrictions that generally apply to every project in the org |
| **Paid quota**         | 500 GB per project, then $0.10/GB                         | 250 GB uncached and 250 GB cached per organization, then $0.09/GB and $0.03/GB   |
| **When paid runs out** | Keeps running and bills overage                           | Restricted if the spend cap is on (the default); bills overage if it's off       |

## If you're restricted on Supabase today

You can wait for the next billing cycle, upgrade or turn off the spend cap, or cut usage with the steps in [Why is my Postgres egress so high, and how do I reduce it?](/faqs/why-postgres-egress-high-how-reduce) If you're moving to Neon instead, see [Migrate from Supabase](/docs/import/migrate-from-supabase). Plan the dump for after restrictions lift, because a `pg_dump` through Supabase's pooler counts as egress on the Supabase side too ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)).

For how the two compare on price once you're within the allowances, see [Is egress cheaper on Neon than on Supabase?](/faqs/is-egress-cheaper-neon-than-supabase)

Vendor details verified on 2026-11-20 against the linked pages.

<CTA title="Egress that's counted per project" description="5 GB per project on Free, 500 GB per project on paid plans, and no plan fee." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
