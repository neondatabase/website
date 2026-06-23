---
title: Scale to Zero
subtitle: Minimize costs by automatically scaling inactive databases to zero
summary: >-
  Scale to Zero suspends inactive Neon Postgres computes after 5 minutes and
  reactivates them in milliseconds on the next query, so you pay only for active
  compute time. Use this feature for development, test, or intermittently active
  production databases where always-on compute is unnecessary. Free plan users
  cannot disable it, but paid plan users can. Very large computes remain always
  active and are not eligible for scale to zero.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

Neon's _Scale to Zero_ feature suspends the Neon compute that runs your Postgres database after a period of inactivity, which minimizes costs for databases that aren’t always active, such as development or test environment databases, and even production databases that aren't used 24/7.

- When your database is inactive, it automatically scales to zero after 5 minutes. This means you pay only for active time instead of 24/7 compute usage. No manual intervention is required.
- Once you query the database again, it reactivates automatically within a few hundred milliseconds.

The diagram below illustrates the _Scale to Zero_ behavior alongside Neon's _Autoscaling_ feature. The compute usage line highlights an _inactive_ period, followed by a period where the compute is automatically suspended until it's accessed again.

![Compute metrics graph](/docs/introduction/compute-usage-graph.jpg)

Neon compute scales to zero after an _inactive_ period of 5 minutes. For Neon Free plan users, this setting is fixed. Paid plan users can disable the scale-to-zero setting to maintain an always-active compute.

<Admonition type="note">
Scale to zero is only available for computes up to 16 CU in size. Computes larger than 16 CU remain always active to ensure best performance.
</Admonition>

You can enable or disable the scale-to-zero setting by editing your compute settings. For detailed instructions, see [Configuring scale to zero for Neon computes](/docs/guides/scale-to-zero-guide).

[Logical replication](/docs/guides/logical-replication-guide) **from** Neon keeps compute active while subscribers are connected, so the database does not scale to zero. See [Logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) for details.
