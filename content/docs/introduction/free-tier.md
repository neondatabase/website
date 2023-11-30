---
title: Neon Free Tier
subtitle: Learn about Neon's Free Tier
enableTableOfContents: true
redirectFrom:
  - /docs/reference/technical-preview-free-tier
  - /docs/introduction/technical-preview-free-tier
updatedOn: '2023-10-24T18:56:54.988Z'
---

Neon is currently in Technical Preview. For information about how the Technical Preview fits within Neon's release plans, refer to the [Neon roadmap](/docs/reference/roadmap).

The Neon Free Tier is intended for personal projects, prototyping, or evaluating Neon's core features. It includes the following:

- One Neon project with up to 10 branches.
- 3 GiB of storage per branch.
- Unlimited Postgres databases
- A shared compute with 1 GB of RAM for each branch.
- 100 hours of _Active time_ per month, affecting non-primary branch compute usage only. Active time on all computes is counted toward the limit, but when the limit is exceeded, only non-primary branch computes are subject to suspension. **Your primary branch compute always remains available regardless of the limit, ensuring that access to data on your primary branch is never interrupted.** You can monitor _Active time_ on the **Usage** widget on the Neon **Dashboard**. The _Active time_ limit resets at the beginning of each month. For instance, if you enroll in the Neon Free Tier in the middle of the month, say on January 15th, your _Active time_ limit will reset on February 1st, the first day of the following month.
- A point-in-time restore window of 7 days of _reasonable usage_.

For higher limits and access to advanced features like _Autoscaling_, _Unlimited storage_,  _Project sharing_, and _Read replicas_, upgrade to our **Pro** plan. For more information, see [Neon Pro Plan](/docs/introduction/pro-plan), or select **Upgrade to Pro** in the [Neon Console](https://console.neon.tech/).

<Admonition type="note">
Neon reserves the right to adjust Neon Free Tier limits, and to discontinue or limit compute usage in exceptional cases where misuse is identified, in order to protect the integrity of our platform and ensure a positive experience for all users.
</Admonition>
