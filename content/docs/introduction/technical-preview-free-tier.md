---
title: Technical Preview Free Tier
enableTableOfContents: true
redirectFrom:
  - /docs/reference/technical-preview-free-tier
---

The Neon cloud service is available for free during the Technical Preview. For information about how the Technical Preview fits within Neon's release plans, please refer to the [Neon roadmap](/docs/reference/roadmap).

The Technical Preview Free Tier has the following limits:

- 1 Neon project.
- 10 branches including the [primary branch](/docs/reference/glossary#primary-branch), with a limit of 3GB of data per branch.
- A [compute endpoint](/docs/reference/glossary#compute-endpoint) for each branch, each with up to 1 vCPU and 4GB of RAM (with 512MB of RAM allocated to PostgreSQL shared buffers).
- 100 hours of compute endpoint usage time per month (total). Neon scales compute endpoints to zero after 5 minutes of inactivity. Only active usage time is counted toward the limit. When you reach the limit, compute endpoints assigned to [non-primary branches](/docs/reference/glossary#non-primary-branch) are unavailable until the limit is reset at the beginning of the next month. You are always able to connect to the compute endpoint assigned to the primary branch of your Neon project, regardless of the limit. This ensures that access to data on the primary branch of your project is never interrupted.
- A point-in-time restore window of 7 days of _reasonable usage_.

<Admonition type="note">
On February 6, 2023, Neon removed the limit on the number of compute endpoints per project. The Free Tier now offers a compute endpoint for every branch and 100 hours of compute endpoint usage time, as described above. This usage time limit is in effect for Neon projects created after this date. The usage time limit will not be applied to Neon projects created before the February 6 date until March 29, 2023, to provide users with enough time to adjust their usage time to the new limit or upgrade to a Paid Tier. Neon will launch Paid Tiers before the end of March, 2023. If you have any questions about upgrading to a Paid Tier, please contact [support@neon.tech](mailto:support@neon.tech).
</Admonition>

Neon reserves the right to adjust Free Tier limits.

## Data Size

Neon stores data in its own internal format. The data size limit in the Technical Preview free tier applies to the logical size of your branch. The logical size is the sum of all database sizes in the branch of your project. For information about checking the size of the data in your branch, see [Check the data size](/docs/manage/branches#check-the-data-size).

<a id="#point-in-time-reset/"></a>

## Point-in-time restore

Neon storage consumes extra space in order to support point-in-time restore, which enables you to restore your data to a historical state. Historical data is stored in log-based format.

Neon limits the amount of modification history that is stored in the Technical Preview Free Tier.
