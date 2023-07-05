---
title: Neon Free Tier
subtitle: Learn about Neon's Free Tier
enableTableOfContents: true
redirectFrom:
  - /docs/reference/technical-preview-free-tier
  - /docs/introduction/technical-preview-free-tier
---

Neon is currently in Technical Preview. For information about how the Technical Preview fits within Neon's release plans, refer to the [Neon roadmap](/docs/reference/roadmap).

The Neon Free Tier is intended for personal projects, prototyping, or evaluating Neon's core features. It includes the following:

- One Neon project with up to 10 branches.
- 3 GB of storage per branch.
- Unlimited PostgreSQL databases
- A shared compute with 1 GB of RAM for each branch.
- **No limit on [Active time](/docs/reference/glossary#active-time) for the primary branch compute. This ensures that access to data on the primary branch is never interrupted.**
- 100 hours of monthly _Active time_ per month (total) for non-primary branch computes. The _Active time_ on your primary branch compute is counted toward the 100-hour limit. If you reach the 100-hour limit for the current month, non-primary branch computes are subject to suspension until the start of the next month. You can monitor _Active time_ on the **Usage** widget on the **Neon Dashboard**.
- A point-in-time restore window of 7 days of _reasonable usage_.

For higher limits and access to advanced features like _Autoscaling_, _Unlimited storage_, and _Project sharing_, upgrade to our **Pro** plan. For more information, see [Neon Pro Plan](/docs/introduction/pro-plan), or select **Upgrade to Pro** in the [Neon Console](https://console.neon.tech/).

<Admonition type="note">
Neon reserves the right to adjust Free Tier limits, and to discontinue or limit compute usage in exceptional cases where misuse is identified, in order to protect the integrity of our platform and ensure a positive experience for all users.
</Admonition>

100 hours of monthly Active time for all compute branches. Upon reaching this limit, your non-primary computes are subject to suspension until the start of the next month. Your primary branch compute remains available, ensuring uninterrupted access to data on your primary branch. You can monitor _Active time_ on the **Usage** widget on the Neon **Dashboard**.
