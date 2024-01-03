---
title: Sample project billing
enableTableOfContents: true
subtitle: Practical example of how Neon pricing is calculated
---

## Generative AI example

To give you a clearer sense of how billing works for Neon Pro users, let's explore a real-world example. Consider a simple image generation app that leverages Neon as the serverless database for storing user authentication details as well as records of image generation per user. Analyzing this usage over a monthly billing period can help you understand the nuances of Neon billing based on actual scenarios.

## Overview: Costs by usage

Roughly six months since launch, this high-traffic application attracts about 80K visitors daily, up to 450K weekly. It receives a steady influx of new users, with 3-5 new accounts created every hour. Each user's activity is capped at 5 images per month. This pattern of interaction and account creation gives you a sense of the steady volume of activity hitting the database. 

## Assumptions

### Tech stack (user management portion of the app):
* **Authentication**: [NextAuth.JS](https://next-auth.js.org/) for authentication with OAuth
* **Database**: Neon Serverless PostgreSQL to store user info and session detail
* **ORM**: [Prisma ORM](https://www.prisma.io/) for database interactions
* **Deployment Region**: US East (Ohio)

### Userbase:
* **Daily Active Users.** 80,000 users/day, implying a consistent volume of read queries. With a global, consumer-oriented user base, traffic is evenly distributed with no distinct peaks or dormant periods.
* **Account creation.** Average of 3-5 sign-ups per hour, totaling 120 new accounts per day. This gives you an idea of the number of write operations to the database for user authentication.
* **User activity.** Each user's usage is capped at 5 generations per month. This includes logging IDs of generated photos and the incremental number of generations, which are written to the relevant tables.

<Admonition type="note">
Given the high number of connections used by this application, [connection pooling](/docs/connect/connection-pooling) is essential. And since the database connection is managed through Prisma, the datbase connection string also requires the addition of `?pgbouncer=true` for proper performance (see [Use connection pooling with Prisma](/docs/guides/prisma#use-connection-pooling-with-prisma)). 
</Admonition>

### Compute, storage, data write and transfer:

* **Compute time.** This metric refers to the size of CPU required to handle your interactions plus the length of time your compute is active. The average daily compute usage is 23.94 GB, totally 718.35 GB for the sample month. This indicates steady but low intensity database usage.
* **Storage size.** The amount of database storage currently used by your project. It includes the total volume of data across all branches plus the shared history. The database is now over 25 GiB and growing steadily with new written data as the user base grows.
* **Written data.** This metric shows the volume of data actively written to database storage. The daily average of 0.15 GB results in a total of 4.4 GB for the month.
* **Data transfer.** This refers to the amount of data transferred out of Neon. Daily average is 0.09 GB with a monthly total of 2.7 GB.

## Consumption breakdown for the month

These graphs shows the usage and costs incurred for the month.

### Compute

Compute usage is steady at almost 24 compute hours per day across the month.

![Sample billing graph](/docs/introduction/billing_compute_graph.png)

Daily average of 23.94 compute hours leads to a total of 713.35 compute hours for the month.

Compute cost calculation: 718.35 compute-hours * $0.102 per compute-hour = **$73.27** for this billing period

### Storage

Project storage grew 4.4 GiB over the month, from 23.6 GiB to 28 GiB.

Storage cost calculation: 28 GiB * $0.000164 per GiB-hour * 730 (1 month) = **$3.35** for this billing period

![Sample storage graph](/docs/introduction/billing_storage_graph.png)

### Data throughput
Written data to Neon storage and data transfer out of Neon are both minimal for the month. 

**Written data calcuation**: 4.4 GiB * $0.09600 per Gib = **$0.42** for this billing period

**Data transfer calculation**: 2.7 GiB * $0.09000 per GiB = **$0.24** for the billing period

![Sample storage graph](/docs/introduction/billing_data_graph.png)

### Table view

Here are the daily averages and monthly totals for the 3 key usage metrics that Neon uses to calculate your bill, plus the total current storage costs.

| Metric          | Daily Average | Monthly Total |
|-----------------|---------------|---------------|
| Compute Time    | 23.94 compute-hours      | 718.35 compute-hours    |
| Written Data    | 0.15 GiB      | 4.4 GiB        |
| Data Transfer   | 0.09 GiB       | 2.7 GiB        |

 Metric           | Start of billing period| End of billing period |
|-----------------|---------------|---------------|
| Data storage    | 23.6 GiB        | 28 GiB         |

## Bill for the month

This table shows what the billing costs might look like with billing rates set to the region US-East (Ohio).

| Metric              | Month      | Rate                  | Amount    |
|---------------------|------------|-----------------------|-----------|
| Compute Time Cost   | 718.35 GiB | $0.102 per compute-hour        | $73.27    |
| Data Storage Cost   | 28 GiB   | $0.000164 per GiB-hour| $3.35
| Written Data Cost   | 4.4 GiB    | $0.09600 per Gib      | $0.42     |
| Data Transfer Cost  | 2.7 GiB    | $0.09000 per GiB      | $0.24     |
| **Total Bill**      |            |                       | **$77.28**|
