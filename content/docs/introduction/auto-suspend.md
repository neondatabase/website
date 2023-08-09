---
title: Auto-suspend
subtitle: Scale computes to zero when not in use
enableTableOfContents: true
---

Neon's _Auto-suspend_ feature controls when a Neon compute instance transitions to an `Idle` state (scales to zero) due to inactivity.

By default, a Neon compute instance scales to zero after 300 seconds (5 minutes) of inactivity. For Neon [Free Tier](/docs/introduction/free-tier) users, this setting is fixed. [Neon Pro plan](/docs/introduction/pro-plan) users can increase, decrease, or disable the _Auto-suspend_ setting, controlling when or if a compute scales to zero.

Reasons for adjusting the _Auto-suspend_ setting might include:

- **Avoiding cold starts**. When a compute scales to zero, it is placed into an idle state. Restarting a compute transitions the compute to an active state, which can take anywhere from 500ms to a few seconds (see [Compute lifecycle](/docs/introduction/compute-llifecycle)). At the cost of an always-active compute, you can turn off the _Auto-suspend_ feature to avoid cold starts.
- **Reducing the frequency of cold starts**. You can configure _Auto-suspend_ to occur less frequently, keeping your compute active during busier hours while ensuring that it suspends when usage drops off.
- **Suspending a compute more quickly to reduce compute usage**. Compute startup times can be as low as 500ms, which may be sufficient for your purposes. In this case, you can suspend computes more frequently reduce compute usage.

You can configure the _Auto-suspend_ setting in an existing project by editing a compute endpoint. You can also configure it when you first create a project in Neon, which also sets the _Auto-suspend_ default for the project. For instructions, refer to [Configuring Auto-suspend for Neon computes](/docs/guides/auto-suspend-guide).
