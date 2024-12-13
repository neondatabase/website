---
title: Scale to Zero
subtitle: Scale computes to zero when not in use
redirectFrom:
  - /docs/introduction/auto-suspend
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.952Z'
---

Neon's _Scale to Zero_ feature transitions Neon compute to an idle state after periods of inactivity, helping reduce costs for databases that aren’t always active, such as development or test environments.

- When your database is inactive, it automatically scales to zero. This means you pay only for active time instead of 24/7 compute usage, minimizing costs without manual intervention.
- Once you query the database again, it reactivates within a few hundred milliseconds.

Neon compute scales to zero after 300 seconds (5 minutes) of inactivity. For [Neon Free Plan](/docs/introduction/plans#free-plan) users, this setting is fixed. Paid plan users can disable the scale-to-zero setting to keep their compute always active.

Configure the scale-to-zero setting for an existing project involves editing your compute settings. For detailed instructions, see [Configuring scale to zero for Neon computes](/docs/guides/scale-to-zero-guide).
