---
title: "Does Neon pause inactive projects?"
subtitle: "No. Neon doesn't pause projects for inactivity on any plan, including the Free plan. An idle compute scales to zero after 5 minutes and resumes on the next query in a few hundred milliseconds, so there's nothing to restore from a dashboard."
createdAt: '2026-11-15T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Do I need a separate vector database for RAG?'
  slug: do-i-need-separate-vector-database-rag
nextLink:
  title: 'How do I create and download a backup of my Neon database to my local machine?'
  slug: download-database-backup-locally
updatedOn: '2026-11-15T14:59:27.573Z'
---

No. A Neon project that nobody has touched for a week, a month, or longer still answers the next query. Neon has no inactivity rule that takes a project offline, on the Free plan or on paid plans ([plans](/docs/introduction/plans)).

What happens instead is [scale to zero](/docs/introduction/scale-to-zero). After 5 minutes without activity, Neon suspends the compute that runs your Postgres database. Your data stays in storage. When the next connection or query arrives, the compute starts again, typically within a few hundred milliseconds, and the query runs. You don't click anything, and your app doesn't need a keep-alive job.

## What an idle Neon project looks like

- **Compute**: suspended after 5 minutes of inactivity, and resumed automatically by the next query. On the Free plan the 5-minute timeout is fixed. On the Launch plan you can turn scale to zero off, and on the Scale plan you can set anything from 1 minute to always on ([plans](/docs/introduction/plans)).
- **Data**: stays in Neon's storage the whole time. Postgres storage is included up to 1 GB per project on the Free plan, and billed at $0.35/GB-month on paid plans, whether or not the compute is running.
- **Old, unused branches**: branches older than 14 days that haven't been accessed in 24 hours move to lower-cost archive storage. Connecting to or querying an archived branch unarchives it automatically ([branch archiving](/docs/guides/branch-archiving)).

So a demo you built in March, a client project you hand off, or a side project that gets one visitor a week keeps working without anyone checking on it.

## When does an idle Neon project stop answering?

Inactivity never takes a Neon project offline, but running out of the Free plan's monthly allowance does. On the Free plan, each project gets 100 CU-hours of compute and 5 GB of public network transfer per month. When a project uses up either one, Neon suspends its compute until the next billing period or until you upgrade ([plans](/docs/introduction/plans)). This is a usage limit, not an inactivity rule, so it affects busy projects rather than idle ones.

To keep a project from hitting it:

- Let the compute sleep. A cron job or health check that queries the database every 5 minutes or more often keeps the compute from ever reaching the 5-minute timeout, and those hours count against the 100 CU-hours. Schedule jobs hourly or nightly instead ([cron jobs without a server](/faqs/best-way-run-cron-jobs-postgres-scale-to-zero)).
- Cache public pages. Crawlers and bots that reach the database on every request keep the compute awake.
- Move a project that outgrows the Free plan to the Launch plan. There's no monthly minimum, and you pay only for what you use ([plans](/docs/introduction/plans#price)).

## How this compares with Supabase

Supabase pauses Free plan projects that show low database activity over a 7-day period. It sends a warning email about a week before the pause, and a paused project stays offline until you resume it from the dashboard. You can restore it for up to a year. Paid Supabase projects aren't paused ([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)).

On Neon, the equivalent of that idle week is a compute that has been suspended since the last query and starts again on the next one. For the difference between the two models in more detail, see [What's the difference between a paused database and one that scales to zero?](/faqs/difference-between-pausing-and-scale-to-zero)

Vendor details verified on 2026-11-15 against the linked pages.

<CTA title="Run Postgres that doesn't pause" description="Free plan projects scale to zero when idle and resume on the next query." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
