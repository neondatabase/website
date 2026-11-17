---
title: "What's the difference between a paused database and one that scales to zero?"
subtitle: "A paused database is offline until someone resumes it. A database that scales to zero only stops its compute while idle, and the next query starts it again in a few hundred milliseconds. Supabase pauses inactive Free plan projects; Neon scales compute to zero on every plan and never pauses for inactivity."
createdAt: '2026-11-15T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I delete a database in Neon?'
  slug: delete-database-neon
nextLink:
  title: 'Do I need a separate vector database for RAG?'
  slug: do-i-need-separate-vector-database-rag
updatedOn: '2026-11-15T14:59:27.573Z'
---

Both stop the database when nobody is using it, so they're easy to confuse. The difference shows up on the next request. With pausing, that request fails until a person resumes the project. With scale to zero, that request is what wakes the database, and it succeeds after a short delay.

## Pausing

A paused project is taken offline. Supabase, for example, pauses Free plan projects that receive too few database queries over a 7-day period. It emails a warning about a week ahead, and once the project is paused, it stays offline until you open the dashboard and click **Resume project**. Paused projects can be restored for up to a year ([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)).

While a project is paused, your app can't reach it. Pausing is a way for a provider to reclaim unused free projects, and it's why "keep-alive" cron jobs and pause checkers exist.

## Scale to zero

Scale to zero suspends only the compute, the process that runs Postgres, and keeps the database reachable. On Neon, a compute that has been idle for 5 minutes is suspended. The next connection starts it again, typically within a few hundred milliseconds, and the query runs ([scale to zero](/docs/introduction/scale-to-zero)).

This works because Lakebase Postgres separates storage from compute. Your data lives in Neon's storage layer, not on the compute's disk, so the compute can stop and start without moving data. You don't pay for compute while it's suspended. You still pay for the storage your data uses: up to 1 GB per project is included on the Free plan, and paid plans bill $0.35/GB-month ([plans](/docs/introduction/plans)).

## Side by side

|                          | Pausing (Supabase Free plan)       | Scale to zero (Neon, every plan)                       |
| ------------------------ | ---------------------------------- | ------------------------------------------------------ |
| **What triggers it**     | Low database activity over 7 days  | 5 minutes without activity                             |
| **What stops**           | The whole project                  | The compute only                                       |
| **Next request**         | Fails until the project is resumed | Wakes the compute and succeeds                         |
| **How it comes back**    | You resume it from the dashboard   | Automatically, typically in a few hundred milliseconds |
| **Who it's for**         | Reclaiming unused free projects    | Not paying for idle compute between requests           |
| **Can you turn it off?** | Only by upgrading to a paid plan   | Yes on the Launch plan and Scale plan                  |

## Which one affects your app

If your app has quiet weeks, pausing matters more. A portfolio project, a client demo, or an internal tool used once a month can be offline the next time someone opens it.

If your app has quiet minutes, scale to zero matters more. The first query after an idle period waits for the compute to start. For most apps a few hundred milliseconds once in a while is fine. If it isn't, turn scale to zero off on the Launch plan, or set a longer timeout on the Scale plan ([plans](/docs/introduction/plans)).

## Ways an idle database still stops on Neon

Neon doesn't pause projects for inactivity, but a Free plan project that uses up its monthly 100 CU-hours or 5 GB of public network transfer has its compute suspended until the next billing period or an upgrade ([plans](/docs/introduction/plans)). That's a usage limit, and it hits busy projects, not idle ones. A scheduled job that queries the database more often than every 5 minutes is the most common way to burn through CU-hours without noticing, because the compute never reaches its idle timeout. See [Does Neon pause inactive projects?](/faqs/does-neon-pause-inactive-projects) for how to avoid it.

Vendor details verified on 2026-11-15 against the linked pages.

<CTA title="Try scale to zero" description="Free plan projects suspend compute after 5 minutes idle and resume on the next query." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
