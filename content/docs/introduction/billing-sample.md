---
title: Sample project billing
enableTableOfContents: true
subtitle: Practical example of how Neon pricing is calculated
updatedOn: '2024-01-26T20:27:59.554Z'
---

<NewPricing/>

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
Given the high number of connections used by this application, [connection pooling](/docs/connect/connection-pooling) is essential. And since the database connection is managed through Prisma, the database connection string also requires the addition of `?pgbouncer=true` for proper performance (see [Use connection pooling with Prisma](/docs/guides/prisma#use-connection-pooling-with-prisma)). 
</Admonition>

### Compute, storage, data write and transfer:

* **Compute time.** This metric refers to the size of CPU required to handle your interactions plus the length of time your compute is active. The average daily compute usage is 23.94 hours, totaling 718.35 hours for the sample month. This indicates steady but low-intensity database usage.
* **Storage size.** The amount of database storage currently used by your project. It includes the total volume of data across all branches plus the shared history. The database is now over 25 GiB and growing steadily with new written data as the user base grows.

### Which Pricing Plan fits best?

With Neon pricing, two key metrics help you decide which [pricing plan](https://neon.tech/pricing) is right for you: compute time and storage.

At roughly 718 compute hours for the month, this applicattion is well under the 1,200 hours/month limit for the Launch plan. However, with a storage size of 25 GiB, the storage needs for this application are well over the Launch plan limit of 10 GiB. That makes the Scale plan the right choice: 3,000 hours/month compute and 50 GiB storage.

## Consumption breakdown for the month

These graphs show the usage and costs incurred for the month.

### Compute

Compute usage is steady at almost 24 compute hours per day across the month.

![Sample billing graph](/docs/introduction/billing_compute_graph.png)

Daily average of 23.94 compute hours leads to a total of 713.35 compute hours for the month.

This is well below the Scale plan limit of 3,000 hours/month, so there will be no charge for extra usage. The application is on track to be charged the set monthly rate for the Scale plan.

### Storage

Project storage grew 4.4 GiB over the month, from 23.6 GiB to 28 GiB.

This storage level is too high for the Launch plan but well under the 50 GiB limit for the Scale plan. No charge for extra storage.

![Sample storage graph](/docs/introduction/billing_storage_graph.png)

### Data throughput
Written data to Neon storage and data transfer out of Neon do not incur any costs. This view shows the amount of data written to storage or transferred out of the application: a reasonable amount with no charge.

![Sample storage graph](/docs/introduction/billing_data_graph.png)

### Table view

Here are the daily averages and monthly totals for the 2 key usage metrics that Neon uses to calculate how much you are consuming within your selected plan.

| Metric          | Daily Average | Monthly Total |
|-----------------|---------------|---------------|
| Compute Time    | 23.94 compute-hours      | 718.35 compute-hours    |

 Metric           | Start of billing period| End of billing period |
|-----------------|---------------|---------------|
| Data storage    | 23.6 GiB        | 28 GiB         |

## Bill for the month

Since compute-hours and storage size are well below the limits for the selected Scale plan, the bill for the month will come in at the set rate of **$69**.
