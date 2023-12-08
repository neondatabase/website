---
title: Sample project billing
enableTableOfContents: true
subtitle: Practical example of how Neon pricing is calculated
---

## Generative AI example

To give you a clear sense of how billing works for Neon Pro users, let's explore a real-world example. Consider a simple image generation app that leverages Neon as the serverless database for storing user authentication detials and recrods of image generation per user. Analyzing this usage in a monthly billing period can give you understand the nuances of Neon billing based on actual scenarios.

## Overview: Costs by usage

Consider a typical day for this high-traffic application. It attracts roughly 80K visitors daily, or up to 450K weekly. With 3-5 new accounts created hourly and generation actions capped at 5 per month, this gives you a sense of the steady activity hitting the database.

## Assumptions

### Tech stack:
* **Authentication**: [NextAuth.JS](https://next-auth.js.org/) for authentication with OAuth
* **Database**: Neon Serverless PostgreSQL to store user info and session detail
* **ORM**: [Prisma ORM](https://www.prisma.io/) for database interactions
* **Deployment Region**: US East (Ohio)

### Userbase:
* **Daily Active Users.** 80,000 users/day, implying a consistent volume of read queries. With a global, consumer-oriented user base, traffic is evenly distributed with no distinct peaks or dormant periods.
* **Account creation.** Average of 3-5 sing-ups per hour, totally 120 new accounts per day. This gives you an idea of the number of write operations to user table in the database for user authentication.
* **User activity.** Each user's usage is capped at 5 generations per month. This includes logging IDs of generated photos and the incremental number of generations, which are written to the relevant tables.

<Admonition type="note">
Given the high number of connections used by this application, [connection pooling](/docs/connect/connection-pooling) is essential. And since the database connection is managed through Prisma, the datbase connection string also requires the addition of `?pgbouncer=true` (see [here](/docs/guides/prisma#use-connection-pooling-with-prisma)) for proper performance. 
</Admonition>

### Compute, storage, data write and transfer:

* **Compute time.** The appliciation is active for nearly 24 hours each day. The average daily compute usage is 23.94 GB, totally 718.35 GB for the sample month. This indicates steady traffic with low volume per user.
* **Written data.** This metric shows the volume of data actively written to database storage. The daily average 0.15 GB, resulting in a total of 4.4 GB for the month.
* **Data transfer.** This refers to the amount of data transferred out of Neon. Daily average is 0.09 GB with a monthly total of 2.7 GB.

## Consumption breakdown for the month

This graph shows steady CPU usage for the month, along with low data storage and transfer rates.

![Sample billing graph](/docs/introduction/billing_sample_graph.png)

Here are the daily averages and monthly totals for the 3 key metrics Neon uses to calculate your bill.

| Metric          | Daily Average | Monthly Total |
|-----------------|---------------|---------------|
| Compute Time    | 23.94 GB      | 718.35 GB     |
| Written Data    | 0.15 GB       | 4.4 GB        |
| Data Transfer   | 0.09 GB       | 2.7 GB        |

## Bill for the month

This table shows what the billing costs might look like with billing rates set to the region US-East (Ohio).

| Metric              | Month    | Rate     | Amount    |
|---------------------|----------|----------|-----------|
| Compute Time Cost   | 718.35 GB| $0.102   | $73.27    |
| Written Data Cost   | 4.4 GB   | $0.09600 | $0.42     |
| Data Transfer Cost  | 2.7 GB   | $0.09000 | $0.24     |
| **Total Bill**      |          |          | **$73.94**|
