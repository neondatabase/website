---
title: Autosuspend
subtitle: Scale computes to zero when not in use
enableTableOfContents: true
updatedOn: '2024-01-10T18:34:05.859Z'
---

Neon's _Autosuspend_ feature controls when a Neon compute instance transitions to an `Idle` state (scales to zero) due to inactivity.

By default, a Neon compute instance scales to zero after 300 seconds (5 minutes) of inactivity. For [Neon Free Tier](/docs/introduction/free-tier) users, this setting is fixed. [Neon Pro Plan](/docs/introduction/pro-plan) users can increase, decrease, or disable the autosuspend setting, controlling when or if a compute scales to zero.

Reasons for adjusting the autosuspend setting might include:

- **Avoiding cold starts**. Restarting a compute from an `Idle` state can take anywhere from 500 ms to a few seconds (see [Compute lifecycle](/docs/introduction/compute-lifecycle)). You can turn off the _Autosuspend_ feature to avoid cold starts. For compute time cost information, see [Billing metrics](/docs/introduction/billing).
- **Reducing the frequency of cold starts**. You can configure autosuspend to occur less frequently, keeping your compute active during busier hours while ensuring that it suspends when usage drops off.
- **Suspending a compute more quickly to reduce compute usage**. Compute startup times can be as low as 500 ms, which may be sufficient for your purposes. In this case, you can suspend computes more frequently reduce compute usage.

You can configure the autosuspend setting in an existing project by editing a compute endpoint. You can also configure it when you first create a Neon project, which sets the autosuspend default for the project. For instructions, refer to [Configuring autosuspend for Neon computes](/docs/guides/auto-suspend-guide).
