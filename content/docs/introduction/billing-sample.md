---
title: Sample project billing
enableTableOfContents: true
subtitle: Practical example of how Neon pricing is calculated
---

## Generative AI example

To give you a clearer sense of how billing works for Neon Pro users, let's explore a real-world example. Consider a simple image generation app that leverages Neon as the serverless database for storing user authentication details as well as records of image generation per user. Analyzing this usage over a monthly billing period can help you understand the nuances of Neon billing based on actual scenarios.

## Overview: Costs by usage

This high-traffic application attracts roughly 80K visitors daily, up to 450K weekly. It receives a steady influx of new users, with 3-5 new accounts created every hour. Each user's activity is capped at 5 images per month. This pattern of interaction and account creation gives you a sense of the steady volume of activity hitting the database.

## Assumptions

### Tech stack (user management portion of the app):
* **Authentication**: [NextAuth.JS](https://next-auth.js.org/) for authentication with OAuth
* **Database**: Neon Serverless PostgreSQL to store user info and session detail
* **ORM**: [Prisma ORM](https://www.prisma.io/) for database interactions
* **Deployment Region**: US East (Ohio)

### Userbase:
* **Daily Active Users.** 80,000 users/day, implying a consistent volume of read queries. With a global, consumer-oriented user base, traffic is evenly distributed with no distinct peaks or dormant periods.
* **Account creation.** Average of 3-5 sign-ups per hour, totally 120 new accounts per day. This gives you an idea of the number of write operations to the database for user authentication.
* **User activity.** Each user's usage is capped at 5 generations per month. This includes logging IDs of generated photos and the incremental number of generations, which are written to the relevant tables.

<Admonition type="note">
Given the high number of connections used by this application, [connection pooling](/docs/connect/connection-pooling) is essential. And since the database connection is managed through Prisma, the datbase connection string also requires the addition of `?pgbouncer=true` for proper performance (see [Use connection pooling with Prisma](/docs/guides/prisma#use-connection-pooling-with-prisma)). 
</Admonition>

### Compute, storage, data write and transfer:

* **Compute time.** This metric refers to the size of CPU required to handle your interactions plus the length of time your compute is active. The average daily compute usage is 23.94 GB, totally 718.35 GB for the sample month. This indicates steady but low intensity database usage.
* **Storage size.** The amount of storage needed for your project billed. (need this info)
* **Written data.** This metric shows the volume of data actively written to database storage. The daily average of 0.15 GB results in a total of 4.4 GB for the month.
* **Data transfer.** This refers to the amount of data transferred out of Neon. Daily average is 0.09 GB with a monthly total of 2.7 GB.

## Consumption breakdown for the month

This graph shows steady CPU usage for the month, along with low data storage and transfer rates.

![Sample billing graph](/docs/introduction/billing_sample_graph.png)

Here are the daily averages and monthly totals for the 3 key metrics that Neon uses to calculate your bill.

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
