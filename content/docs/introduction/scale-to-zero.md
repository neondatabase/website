---
title: Scale to Zero
subtitle: Scale computes to zero when not in use
redirectFrom:
  - /docs/introduction/auto-suspend
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.952Z'
---

Neon's _Scale to Zero_ feature controls when a Neon compute transitions to an idle state due to inactivity.

Neon compute scales to zero after 300 seconds (5 minutes) of inactivity. For [Neon Free Plan](/docs/introduction/plans#free-plan) users, this setting is fixed. Users on paid plans can disable the scale to zero setting for an always-active compute.

A reasons for disabling the scale to zero might be to avoid cold starts, where restarting a compute from an idle state — typically taking just a few hundred milliseconds (see [Compute lifecycle](/docs/introduction/compute-lifecycle)) — does not achieve the desired performance.

You can configure the scale to zero setting in an existing project by editing a compute. For instructions, refer to [Configuring scale to zero for Neon computes](/docs/guides/scale-to-zero-guide).
