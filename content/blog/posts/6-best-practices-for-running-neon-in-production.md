---
title: Best Practices for Running Neon in Production
description: Our go-to advice
excerpt: >-
  In Neon, we’re always trying to strike a balance between out-of-the-box
  configurations that work for most people and the flexibility to accommodate a
  wide range of use cases. By tweaking features like autoscaling, branching, and
  scale to zero, you can optimize Neon for many diffe...
date: '2025-08-18T17:26:31'
updatedOn: '2025-08-19T18:16:51'
category: workflows
categories:
  - workflows
authors:
  - russ-dias
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/6-best-practices-for-running-neon-in-production/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Best Practices for Running Neon in Production - Neon
  description: >-
    Neon offers configuration flexibility to optimize usage across many
    scenarios. This is our core advice for production workloads.
  keywords: []
  noindex: false
  ogTitle: Best Practices for Running Neon in Production - Neon
  ogDescription: >-
    Neon offers configuration flexibility to optimize usage across many
    scenarios. This is our core advice for production workloads.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/6-best-practices-for-running-neon-in-production/social.jpg
---

In Neon, we’re always trying to strike a balance between out-of-the-box configurations that work for most people and the flexibility to accommodate a wide range of use cases. By tweaking features like autoscaling, branching, and scale to zero, you can optimize Neon for many different scenarios – from low-cost development environments to production setups that prioritize performance.

This flexibility naturally raises configuration questions. Teams that started on Neon with side projects often come to us for guidance as they grow into real companies serving customers. We’ve distilled our core advice into a simple “production checklist” sent straight to your inbox, highlighting the key steps we recommend to avoid common pitfalls.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/6-best-practices-for-running-neon-in-production/ad4nxduzar4joahinh4phlxjr8xy3u0ppgq5nmd1ljdn4kfdenfj5dzd5rlmu0xl4dmpz139ejnqsejmmjvhmbvoebou10dfbfkdeynyvk0gxgikgbbhn7m4-spuxcubltz4t73-1b359a8c.png" alt="Post image" />
<figcaption><em>When running Neon in production, you may receive a checklist similar to this in your inbox, reminding you of good practices</em><br/></figcaption>
</figure>

## Use a High-Performance Production Branch

When you first create a project in Neon, your main branch is configured to scale to zero when not in use. This is perfect for most side projects: you’re not consuming a ton of compute hours, your database scales to zero when idle (so you’re not billed), and it automatically wakes up when needed.

But in a production setting where you need to prioritize performance, we recommend [configuring your production branch](https://neon.com/docs/guides/autoscaling-guide#configure-autoscaling-defaults-for-your-project) with a higher compute capacity and disabling scale to zero to avoid cold starts entirely. For example, you might set the autoscaling range to 1 – 4 CUs. This gives you peace of mind that:

- **Your users won’t be impacted by cold start latency.** Neon’s cold starts are very fast (subsecond), but in a customer-facing environment, you want to avoid any additional latency you can. By disabling scale to zero on your production branch, you avoid this entirely.
- **Your performance will stay consistent even with spikes.** A high enough autoscaling limit acts as a safety net against unexpected traffic. If your workload stays small, you won’t hit the upper bound, but if you need it, your performance won’t degrade, and you won’t have to manually resize anything

<Admonition type="tip" title="Tip">
Scale to zero is still immensely useful to reduce costs in all your other branches, e.g. development, staging, testing, or even production environments that can tolerate an extra 500 ms of latency (for example internal tools).
</Admonition>

## Create a Read Replica

As your application grows, you’ll likely start running read-heavy workloads that don’t need to hit your primary database – things like analytics dashboards, background jobs, and reports. [On most platforms, setting up a replica to handle these tasks means spinning up a full additional Postgres instance](https://neon.com/blog/the-problem-with-postgres-replicas). But in Neon, read replicas are much more lightweight.

A [read replica](https://neon.com/docs/introduction/read-replicas) in Neon is just essentially another branch – one that shares storage with your production branch and runs in its own isolated compute instance. The difference is that it’s read-only. Replicas are easy to scale and destroy independently. You can autoscale them based on workload, or spin them up just for specific tasks and shut them down afterward, like a nightly job or heavy query batch.

By enabling scale to zero on the read replica, it will only run when you’re actively querying it, and you won’t pay additional storage for it. They’re very economical and perfect for scaling out reads without overloading your main compute. Why this matters in production:

- **You protect user-facing performance.** Read replicas allow you to keep your main compute focused on writes and latency-sensitive queries by offloading everything else.
- **You protect your production database.** Read replicas are truly read-only, so there’s no risk of accidental updates or schema changes. You can safely give access to a read replica to anyone on your team — even those less experienced with databases.

## Enable Instant Restores

[Instant Restores](https://neon.com/blog/pitr-deep-dive) allow you to restore a branch to any point within your restore window instantly, even if the database is large. If you’re running a critical database, we recommend always setting a restore window of at least 24 hours, but 7 days gives you extra peace of mind.

<Admonition type="note" title="Why?">
A 7-day restore window can save you when a bug from a Thursday release isn’t noticed until the weekend.
</Admonition>

This is one of the most loved features by our customers, because it’s not just a [safety net for emergencies](https://neon.com/restores-survey) but an awesome tool for everyday operations. Having Instant Restores enabled allows you to:

- **Recover instantly from mistakes.** You can roll back instantly from bad deploys, accidental data deletions, bad scripts. [This is true even if you have many TBs of data.](https://neon.com/blog/recover-large-postgres-databases)
- **Test risky changes with confidence.** If you’re about to alter a critical table or deploy a complex migration, you can snapshot your production branch, apply the change in a temporary branch, and verify the results.
- **Investigate issues using historical data.** Anytime, you can instantly branch off from a past point and inspect the database exactly as it was.

## Restrict Access by IP

Controlling who can connect to your database is a key part of protecting your production environment, especially if your database is exposed over the internet. Neon lets you restrict access to your project by specifying an [IP allow list,](https://neon.com/docs/introduction/ip-allow) a set of trusted IP addresses or ranges that are allowed to connect to your database. Any connection attempt from outside that list will be denied. This gives you a simple but powerful layer of protection, especially when paired with strong authentication.

Why this is key:

- **Block unauthorized access to essential databases.** Ensure only your servers, office network, or CI runners can connect and block everything else at the network level.
- **Catch accidental exposure.** Even if your credentials are leaked or misused, IP restrictions can prevent unauthorized database access.
- **Better compliance posture.** Security standards (e.g. SOC 2, HIPAA) might expect network-level access controls for production databases.

## Conclusion

When your project starts serving real users critically, there are a few smart steps you can take to get the best performance, reliability, and safety out of your database. This production checklist will act as a reminder of these practices so you can track your progress and take action when you’re ready.

<Admonition type="info" title="get started">
New to Neon? [Sign up for a free Neon account](https://console.neon.tech/signup), spin up your first project in seconds (no credit card required), and grow all the way to prod.
</Admonition>
