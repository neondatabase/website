---
title: How to Make the Most of Neon’s Free Plan
description: Tricks to help you build further for free
excerpt: >-
  Note: This blog post was updated on October 31, 2025 to reflect changes in the
  Free Plan limits. Neon’s Free Plan is packed with everything you need to start
  building with Postgres – we’ve seen developers ship amazing things with it. If
  you’re new to Neon, let us share some tips...
date: '2025-09-03T17:21:13'
updatedOn: '2025-11-01T01:00:06'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-make-the-most-of-neons-free-plan/cover.jpg
  alt: null
isFeatured: true
seo:
  title: How to Make the Most of Neon's Free Plan - Neon
  description: >-
    Neon’s Free Plan is packed with everything you need to start building with
    Postgres. Here are some tips to help you get the most out of it.
  keywords: []
  noindex: false
  ogTitle: How to Make the Most of Neon's Free Plan - Neon
  ogDescription: >-
    Neon’s Free Plan is packed with everything you need to start building with
    Postgres. Here are some tips to help you get the most out of it.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-make-the-most-of-neons-free-plan/social.jpg
source:
  wpId: 10829
  wpSlug: how-to-make-the-most-of-neons-free-plan
  exportedAt: '2026-03-20T13:31:00.745Z'
---

_Note: This blog post was updated on October 31, 2025 to reflect changes in the Free Plan limits._

Neon’s Free Plan is packed with everything you need to start building with Postgres – [we’ve seen developers ship amazing things with it](https://neon.com/blog/databuddy-is-open-sourcing-privacy-first-analytics-built-on-neon). If you’re new to Neon, let us share some tips to make sure you get the most out of your free account, whether you’re prototyping, testing, or shipping your first Postgres-powered app:

<YoutubeIframe embedId="Xm06FnbH_eE" isDocPost={false} />

## Tips for Building on Neon’s Free Plan

### Monitor Each Project Separately

One of the easiest mistakes to make on the Free Plan is to think of your account limits as a whole (since this is how many free tiers work). In Neon, you can create up to 20 projects in the Free Plan, and each project has its own [resource limits](https://neon.com/pricing) (e.g. 0.5 GB database storage).

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-make-the-most-of-neons-free-plan/screenshot-2025-09-02-at-52915percente2percent80percentafpm-1024x379-8564412f.png" alt="Image" />
<figcaption>You can create many projects on Neon’s Free plan (up to 20)</figcaption>
</figure>

This is great for building multiple things in parallel, but it requires a bit of monitoring on your part. You could be hitting the cap on one project while others are still running smoothly. The best way to avoid surprises is to keep an eye on the [monitoring dashboard](https://neon.com/docs/introduction/monitoring-page) for each project individually.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-make-the-most-of-neons-free-plan/screenshot-2025-09-02-at-53315percente2percent80percentafpm-1024x403-a52bcc7d.png" alt="Image" />
<figcaption>Remember to monitor the compute / storage consumption per-project</figcaption>
</figure>

This way, you’ll know exactly where you stand and can take action on that particular project (cleaning up data, adjusting compute settings, or upgrading if needed) before usage on that project gets cut off for the month.

### Optimize Compute Usage to Run Your Database Longer

On the Free Plan, each project gets 100 CU-hours per month (equivalent to running on 1 CPU for 100 hours). But how do you maximize actual database run time? Well – 1 CPU is a big machine for 0.5 GB of data. If you want to run your database longer, you could scale down to smaller CPU allocations. For example, 0.25 CUs gives you 400 hours.

<Admonition type="tip" title="Reminder: on CU-hours">
CU-hours are how we measure compute usage on Neon. Since Neon is a serverless database, we track how often your compute runs and at what capacity:

CU-hours = CU size × number of hours it runs

The Free Plan includes 50 CU-hours. This means that by reducing the size of your compute (fewer CPUs), you can run your database for longer.
</Admonition>

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-make-the-most-of-neons-free-plan/screenshot-2025-09-02-at-54633percente2percent80percentafpm-1024x407-756602c6.png" alt="Image" />
<figcaption>Make sure you’re not running at more capacity than needed to maximize compute run time</figcaption>
</figure>

You’ll want to review your compute settings for each branch:

- Dev/test branches → Keep them at conservative limits always (e.g. fixed at 0.25 CU)
- Production branches → Consider a slightly higher max autoscaling limit to handle traffic spikes

Another huge factor is [scale to zero](https://neon.com/docs/introduction/scale-to-zero). By default, Neon databases automatically suspend when not in use, meaning they stop consuming compute. If you notice your database running constantly though, it may be because of the way you’re connecting. Consider adjusting your connection method so idle time is truly idle!

### Do Some Storage Housekeeping

On the Free Plan, each project includes 0.5 GB of storage. For many early projects, that’ll be plenty – but Postgres storage can creep up quickly if you don’t keep it clean. A few things to watch for:

- **Large tables growing silently.** Logging tables, audit trails, or event data can expand fast if you don’t put retention policies in place.
- **Indexes.** Every new index takes additional disk space. Use them wisely, and drop unused ones to reclaim storage.
- **Dead tuples.** Postgres uses MVCC (multi-version concurrency control), which means old row versions stick around until vacuumed. Make sure autovacuum is running or manually clean up when needed. You can also explore things like [pg_repack.](https://neon.com/docs/extensions/pg_repack)

If you’re already doing all these things, and you’re nearing the limit, make sure to:

- **Clean up old data**. Often, there’ll be tables or rows you no longer need.
- **Archive your data elsewhere**. Even if you need that data, you may be able to move rarely accessed data into another system.
- **Upgrade when truly needed**. The [Launch plan](https://neon.com/pricing) will give you access to more storage without a large monthly minimum, only paying for the GBs you use.

### Keep an Eye on Network Transfer

The Free Plan gives you 5 GB of outbound data transfer (egress) per month. This won’t be an issue for most projects, but egress can sneak up if your queries are inefficient – since every time you select data, it counts toward this limit. Returning more data than you actually need wastes bandwidth and eats into your free allowance.

A common issue here is ORMs and libraries that automatically fetch full rows after an `UPDATE` or `DELETE`, even if you don’t use those values. Similarly, queries that return entire objects when you only need a few fields can rack up transfer quickly.

Best practices (this will make your app faster too):

- Don’t return rows after `UPDATE/DELETE` unless you use them
- Only query the columns you actually need, avoiding over-fetching
- Review ORM defaults to make sure they’re not pulling more data than necessary

## Wrapping Up

Neon’s Free Plan gives you a lot of room to build – up to 20 projects, each with their own compute, storage, and network limits. With a few small habits, you can stretch those free resources and build amazing things. [Sign up to the Free Plan](https://console.neon.tech/signup) if you haven’t already, it’s the easiest way to start building with Postgres!

---

_If you have any questions or just want to interact with the Neon community, you can always find us on_ [Discord](https://discord.gg/92vNTzKDGp)_._
