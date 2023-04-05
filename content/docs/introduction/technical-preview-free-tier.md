---
title: Free Tier
enableTableOfContents: true
redirectFrom:
  - /docs/reference/technical-preview-free-tier
---

The Neon cloud service is currently in Technical Preview. For information about how the Technical Preview fits within Neon's release plans, please refer to the [Neon roadmap](/docs/reference/roadmap).

<Admonition type="note">
From February 24, 2023, the Neon Free Tier offers a compute endpoint for every branch and 100 hours of _compute active time_ per month. The _compute active time_ limit is in effect for Neon projects created after this date. The limit will not be applied to Neon projects created before this date until April 1, 2023, to provide enough time for users to adjust their usage or upgrade to a paid plan. Neon launched paid plans on March 15, 2023. For information about paid plans, refer to our [Pricing](https://neon.tech/pricing) page.
</Admonition>

The Neon Free Tier has the following limits:

- 1 Neon project.
- 10 branches including the [primary branch](/docs/reference/glossary#primary-branch), with a limit of 3GB of data per branch.
- A [compute endpoint](/docs/reference/glossary#compute-endpoint) for every branch, each with 1 shared vCPU with 1 GB of RAM.
- No limit on _compute active time_ for the primary branch, which ensures that access to data on the primary branch is never interrupted.
- 100 hours of _compute active time_ per month (total) on non-primary branches. When you reach the limit, compute endpoints assigned to [non-primary branches](/docs/reference/glossary#non-primary-branch) are unavailable until the limit resets at the beginning of the next month.
- A point-in-time restore window of 7 days of _reasonable usage_.

Neon reserves the right to adjust Free Tier limits.

## Data Size

Neon stores data in its own internal format. The data size limit in the Free Tier applies to the logical size of your branch. The logical size is the sum of all database sizes in the branch of your project. For information about checking the size of the data in your branch, see [Check the data size](/docs/manage/branches#check-the-data-size).

<a id="#point-in-time-reset/"></a>

## Point-in-time restore

Neon storage consumes extra space in order to support point-in-time restore, which enables you to restore your data to a past state. History is stored in log-based format.

The Neon Free Tier limits the amount of history that can be stored.
