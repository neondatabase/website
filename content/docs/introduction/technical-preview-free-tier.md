---
title: Free Tier
enableTableOfContents: true
redirectFrom:
  - /docs/reference/technical-preview-free-tier
---

The Neon cloud service is currently in Technical Preview. For information about how the Technical Preview fits within Neon's release plans, please refer to the [Neon roadmap](/docs/reference/roadmap).

The Neon Free Tier has the following limits:

- 1 Neon project.
- 10 branches including the [primary branch](/docs/reference/glossary#primary-branch), with a limit of 3GB of data per branch.
- A [compute endpoint](/docs/reference/glossary#compute-endpoint) for each branch, each with 1 shared vCPU with up to 1 GB of RAM.
- 100 hours of compute endpoint _active time_ per month (total). Neon scales compute endpoints to zero after 5 minutes of inactivity. Only active time is counted toward the limit. When you reach the limit, compute endpoints assigned to [non-primary branches](/docs/reference/glossary#non-primary-branch) are unavailable until the limit is reset at the beginning of the next month. You are always able to connect to the compute endpoint assigned to the primary branch of your Neon project, regardless of the limit. This ensures that access to data on the primary branch of your project is never interrupted.
- A point-in-time restore window of 7 days of _reasonable usage_.

<Admonition type="note">
On February 24, 2023, Neon removed the limit on the number of compute endpoints per project. The Free Tier now offers a compute endpoint for every branch and 100 hours of compute endpoint _active time_, as described above. The _active time_ limit is in effect for Neon projects created after this date. The limit will not be applied to Neon projects created before this date until April 1, 2023, to provide enough time for users to adjust their usage or upgrade to a paid plan. Neon launched paid plans in March, 2023. For information about our paid plans, refer to our [Pricing](https://neon.tech/pricing) page.
</Admonition>

Neon reserves the right to adjust Free Tier limits.

## Data Size

Neon stores data in its own internal format. The data size limit in the Free Tier applies to the logical size of your branch. The logical size is the sum of all database sizes in the branch of your project. For information about checking the size of the data in your branch, see [Check the data size](/docs/manage/branches#check-the-data-size).

<a id="#point-in-time-reset/"></a>

## Point-in-time restore

Neon storage consumes extra space in order to support point-in-time restore, which enables you to restore your data to a historical state. Historical data is stored in log-based format.

Neon limits the amount of modification history that can be stored on the Free Tier plan.
