---
title: Sample project billing
enableTableOfContents: true
subtitle: Learn from a sample project how billing works in Neon
---

## Generative AI example

To give you a clearer sense of how billing works for Neon Pro users, consider this real-world example of a simple image generation app that leverages Neon as the serverless database for storing information about its users: user authentication details and records of how many images each user generates. This example of how usage breaks down in a given monthly billing period can help you understand the nuances of billing, based on actual usage scenarios.

## Overview: Costs by usage

To illustrate typical costs, consider a typical day for this heavily trafficked application. With roughly 80K visitors a day, or up to 450K in a week, and with 3-5 people creating an account every hour, and generation actions capped at 5 per month, this gives you a sense of typical database usage.

## Assumptions

**Tech stack:**
* [NextAuth.JS](https://next-auth.js.org/) for authentication with OAuth
* Neon Serverless PostGres to store user info and session detail
* [Prisma ORM](https://www.prisma.io/) to handle the database interaction
* Deployment region **US East (Ohio)** 

**Userbase:**
* **Daily Active Users.** 80,000 users per day represents means a steady volume of read queries. With a global, consumer-oriented user base, there are no peak or dormant usage periods.
* **Account creation.** Sign-ups average 3-5 people per hour, or 120 new accounts per day, which gives you an idea of the number of writes to user table in the database for user auth.
* **User activity.** Usage is capped at 5 generations per month. Usage details like IDs of generated photos and incremental number of generations are also written to the relevant tables.

<Admonition type="note">
With the high number of connections used by this application, connection pooling is required. And since the database connection is managed through Prisma, the datbase connection string also required `?pgbouncer=true`. 
</Admonition>

**Compute, storage, data write and transfer:**

* **Compute time.** Compute time is active for close to a full 24 hours per day. Average per day is 23.94 GB with a monthly total of 718.35 GB. This indicates steady traffic but low volume per user.
* **Written data. **Indicates how much data is actively written to database storage. Average per day is 0.15 GB with a monthly total of 4.4 GB.
* **Data transfer.** The amount of data transferred out of Neon. Daily average is 0.09 GB with a monthly total of 2.7 GB.

## Consumption breakdown for the month

This graph shows steady using for the month, as well as low data write and transfer rates.

![Sample billing graph](/docs/introduction/billing-sample-graph.png)

| Metric          | Daily Average | Monthly Total |
|-----------------|---------------|---------------|
| Compute Time    | 23.94 GB      | 718.35 GB     |
| Written Data    | 0.15 GB       | 4.4 GB        |
| Data Transfer   | 0.09 GB       | 2.7 GB        |

## Bill for the month

| Metric              | Month    | Rate     | Amount    |
|---------------------|----------|----------|-----------|
| Compute Time Cost   | 718.35 GB| $0.102   | $73.27    |
| Written Data Cost   | 4.4 GB   | $0.09600 | $0.42     |
| Data Transfer Cost  | 2.7 GB   | $0.09000 | $0.24     |
| **Total Bill**      |          |          | **$73.94**|
