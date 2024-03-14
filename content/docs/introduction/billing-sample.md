---
title: Sample project billing
enableTableOfContents: true
subtitle: Practical example of how Neon pricing is calculated
updatedOn: '2024-02-23T21:47:38.905Z'
---

## Generative AI example

To give you a clearer sense of how billing works, let's explore a real-world example. Consider a simple image generation app that leverages Neon as the serverless database for storing user authentication details as well as records of image generation per user. Analyzing this usage over a monthly billing period can help you understand the nuances of Neon billing based on actual scenarios and choose the right pricing plan.

## Overview: Costs by usage

Roughly six months since launch, this high-traffic application attracts about 80K visitors daily, up to 450K weekly. It receives a steady influx of new users, with 3-5 new accounts created every hour. Each user's activity is capped at 5 images per month. This pattern of interaction and account creation gives you a sense of the steady volume of activity hitting the database. 

## Assumptions

### Tech stack (user management portion of the app):
* **Authentication**: [NextAuth.JS](https://next-auth.js.org/) for authentication with OAuth
* **Database**: Neon Serverless Postgres to store user info and session detail
* **ORM**: [Prisma ORM](https://www.prisma.io/) for database interactions
* **Deployment Region**: US East (Ohio)

### Userbase:
* **Daily Active Users.** 80,000 users/day, implying a consistent volume of read queries. With a global, consumer-oriented user base, traffic is evenly distributed with no distinct peaks or dormant periods.
* **Account creation.** Average of 3-5 sign-ups per hour, totaling 120 new accounts per day. This gives you an idea of the number of write operations to the database for user authentication.
* **User activity.** Each user's usage is capped at 5 generations per month. This includes logging IDs of generated photos and the incremental number of generations, which are written to the relevant tables.

<Admonition type="note">
Given the high number of connections used by this application, [connection pooling](/docs/connect/connection-pooling) is essential.
</Admonition>

### Compute hours and storage:

* **Compute hours.** This metric refers to the size of the CPU required to handle your interactions plus the length of time your compute is active (compute hours = compute size * active hours). The average daily compute usage is 23.94 hours, totaling 718.35 hours for the sample month. This indicates steady but low-intensity database usage.
* **Storage.** The amount of database storage currently used by your project. It includes the total volume of data across all branches plus the shared history. The database is now over 25 GiB and growing steadily with new written data as the user base grows.

## Consumption breakdown for the month

These graphs show the usage and costs incurred for the month.

### Compute

Compute usage is steady at almost 24 compute hours per day across the month.

![Sample billing graph](/docs/introduction/billing_compute_graph.png)

Daily average of 23.94 compute hours leads to a total of 713.35 compute hours for the month.

### Storage

Project storage grew 4.4 GiB over the month, from 23.6 GiB to 28 GiB.

![Sample storage graph](/docs/introduction/billing_storage_graph.png)

### Table view

Here are the daily averages and monthly totals for the 2 key usage metrics that Neon uses to calculate how much you are consuming within your selected plan.

| Metric          | Daily Average | Monthly Total |
|-----------------|---------------|---------------|
| Compute hours    | 23.94 compute hours      | 718.35 compute hours    |

 Metric           | Start of billing period| End of billing period |
|-----------------|---------------|---------------|
| Storage         | 23.6 GiB        | 28 GiB      |

### Which Neon pricing plan fits best?

At roughly 718 compute hours for the month with a compute size of 0.25 vCPU, this application is well under the 1,200 active hours/month allowance for the [Launch](/docs/introduction/plans##launch) plan and 3000 active hours/month allowance for the [Scale](/docs/introduction/plans#scale) plan. However, with a storage size of 25 GiB, the storage requirements for the application are over the Launch plan allowance of 10 GiB. You could go with the Launch plan which offers 10 GiB of storage plus extra storage at $3.5 per 2 GiB unit or the Scale plan which offers 50 GiB storage. Let's do that math to compare monthly bills:

**Launch plan**:

- Base fee: $19
- Storage usage: 25 GiB (15 GiB over the allowance)
- Compute usage: 718 hours (within the 1200 hour allowance)
- Extra storage fee: 8 * $3.5 = $28
- Extra compute fee: $0

_Total estimate_: $19 + $28 = $47 per month

**Scale plan**:

- Base fee: $69
- Storage usage: 25 GiB (within the 50 GiB allowance)
- Compute usage: 718 hours (within the 3000 allowance)
- Extra storage fee: $0
- Extra compute fee: $0

_Total estimate_: $69 per month

The Launch plan is more economical in the short term, but you should consider upgrading to the [Scale](/docs/introduction/plans#scale) plan when purchasing extra storage on the Launch plan is no longer cheaper than the $69 per month Scale plan. The Scale plan has a higher monthly storage allowance (50 GiB) and a cheaper per-unit extra storage cost (10 GiB at $15 vs. 2 GiB at $3.5). The Scale plan also offers additional features and more projects, which may factor into your decision about when to upgrade.