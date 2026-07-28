---
title: Optimize your AWS RDS Dev Environments with Neon Postgres
description: 'Neon is Postgres built to increase dev velocity, cost efficiency'
excerpt: >-
  AWS RDS for PostgreSQL is the most widely-used hosted Postgres solution there
  is, so naturally we hear a lot from developers that use it. While it can be a
  solid offering, it’s quite lacking when it comes to developer experience, and
  doesn’t support modern developer workflows. We...
date: '2024-07-16T12:24:14'
updatedOn: '2024-12-24T18:23:22'
category: product
categories:
  - product
authors:
  - brad-van-vugt
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/development-environments-for-aws-rds-using-neon-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Optimize your AWS RDS Dev Environments with Neon Postgres - Neon
  description: >-
    Switching your development environments from RDS to Neon can speed up your
    development process (and save you money).
  keywords: []
  noindex: false
  ogTitle: Optimize your AWS RDS Dev Environments with Neon Postgres - Neon
  ogDescription: >-
    Switching your development environments from RDS to Neon can speed up your
    development process (and save you money).
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/development-environments-for-aws-rds-using-neon-postgres/social.png
---

<img src="https://cdn.neonapi.io/public/images/pages/blog/development-environments-for-aws-rds-using-neon-postgres/neon-rds-development-67d0d70b.jpg" alt="Post image" width="1024" height="576" />

[AWS RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/) is the most widely-used hosted Postgres solution there is, so naturally we hear a lot from developers that use it. While it can be a solid offering, it’s quite lacking when it comes to developer experience, and doesn’t support modern developer workflows. We often hear of developers switching to Neon exactly for this reason, especially for their local environments.

In this article, we’ll dive into the specific challenges of developing on RDS and show you a solution we often recommend: **using Neon for development, even when you must keep RDS as your production database.**

<blockquote>
<p>📚 <strong>This article is Part I of a series.</strong> <strong><a href="https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon">Click here to read Part II: How-to guide for setting up your dev environments in Neon while keeping prod in RDS</a></strong></p>
</blockquote>

## Why AWS RDS is slowing you down

Using RDS has its advantages, and can be a reasonable default choice. But the cost of using RDS for development environments is incredibly high, and developers often need to find alternative (and hacky!) workarounds.

### Provisioning RDS databases is a slow and manual process

<blockquote>
<p>“The RDS developer experience is not quite there. The AWS console and APIs are quite convoluted and require extensive setup and configuration to achieve even basic tasks” </p>
<cite><a href="https://neon.tech/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow">Guido Marucci, co-founder at Cedalio</a></cite>
</blockquote>

First, provisioning new RDS instances can take a while, requiring manual configuration and constant oversight to ensure they are appropriately sized and ready for use. Trying to navigate this slows down projects and costs valuable engineering hours. Developers want to build software! They don’t want to spend time provisioning databases.

### Developer collaboration is hard

<blockquote>
<p>“When we used a shared RDS instance for development, it was hard to properly test new features and changes without impacting the work of other teammates” </p>
<cite><em><a href="https://neon.tech/blog/frictionless-development-experience-with-neon-branching">Camelia Smeria, Lead Engineer at Proposales</a></em></cite>
</blockquote>

RDS is simply not built to support team workflows where multiple developers need to interact with the same dataset at the same time. It’s easy to quickly run into problems involving shared infrastructure, “noisy neighbors”, and even data consistency. Developers need to know their database is available, up-to-date, and not being messed with by testing environments or other developers at the same time.

### It takes a lot of work to keep data in sync

<blockquote>
<p>“When we were using RDS, we had trouble keeping the same environment on my computer, my developer’s environment, and production” </p>
<cite><a href="https://neon.tech/blog/why-topo-io-switched-from-amazon-rds-to-neon">Léonard Henriquez, co-founder and CTO, Topo.io</a></cite>
</blockquote>

Some teams choose to use separate RDS instances for development, staging, and testing, which can require complex data consistency pipelines. Managing data across all these environments is time consuming and prone to errors, often leading to data discrepancies and frustrating bugs. Most solutions involve regular data dumps and imports, which can further increase complexity and be disruptive when developers are trying to work.

### Complexity grows with the number of RDS instances

<blockquote>
<p>“RDS becomes a bottleneck if you don’t have full-time DevOps dedicated to it”  </p>
<cite><a href="https://neon.tech/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers">Joey Teunissen, CTO at OpusFlow</a></cite>
</blockquote>

The problem with managing RDS instances isn’t just about dealing with outdated consoles and APIs; it’s also about the overall developer experience of provisioning AWS infrastructure. As your fleet of RDS instances grows, the manual setup and configuration work grows too. Tools like Terraform can help, but also add a layer of abstraction that needs to be maintained and debugged.

## Building on Neon: how it’s different from AWS RDS

For agile dev teams, the ability to quickly build, test, and deploy new features is critical for success. Teams typically need to create and maintain datasets or local environments that mirror production, and using AWS RDS for this purpose can slow down development cycles and introduce unnecessary complexity during testing phases.

Enter [Neon](https://neon.tech/), a modern serverless Postgres solution built to streamline development workflows. Due to its unique architecture that natively [decouples storage and compute](https://neon.tech/blog/architecture-decisions-in-neon), **Neon is more agile, more efficient, and more developer-friendly than any other hosted Postgres – which makes it perfect for local dev and testing environments.**

Let’s break down why.

### Provisioning new environments takes only a second

<blockquote>
<p>“I created 15 Neon databases in the time it took to spin up one RDS instance” </p>
<cite><a href="https://discord.gg/92vNTzKDGp">Heard on Neon Discord</a></cite>
</blockquote>

With Neon, provisioning new environments is nearly instantaneous. Thanks to its serverless architecture, you can spin up a new database (or branch an existing one) in less than a second. This rapid provisioning accelerates development cycles and allows you to add your database to your existing workflow without being slowed down.

### Modern development workflows are baked in

<blockquote>
<p>“We no longer have to set up an actual testing database instance and make sure the data is always synced with production. We now spin up a Neon branch when we need to and then tear it down via the create/delete Github Actions”</p>
<cite><a href="https://neon.tech/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd">Angelina Quach, Software Engineer at Shepherd</a></cite>
</blockquote>

Speaking of workflows: [Neon integrates into your pipelines by allowing you to automatically create branches of your database for testing and development](https://neon.tech/flow). You can spin up an isolated environment that mirrors production, make your changes, and then tear it down when you’re done, all within seconds and with minimal effort. Workflow tools like GitHub Actions can be used to automate the creation and deletion of these branches, ensuring your workflow is both efficient and seamless.

<figure className="wp-block-image size-large is-style-default">
<img src="https://cdn.neonapi.io/public/images/pages/blog/development-environments-for-aws-rds-using-neon-postgres/screenshot-2024-07-15-at-54850percente2percent80percentafpm-624d3923.png" alt="Post image" width="1024" height="636" />
<figcaption>Neon allows you to incorporate the database into existing CI/CD pipelines. Collaborating with your team is as easy as collaborating in code.</figcaption>
</figure>

### Develop and test with production-like data

<blockquote>
<p>“Neon allows us to develop much faster than we’ve ever been used to. Instead of putting a lot of effort into getting a synthetic dataset resembling production data that we can reliably run tests within Docker or local Postgres, we just test in a Neon branch, with a perfect copy of production data without leaving our VPC”</p>
<cite><a href="https://neon.tech/blog/how-supergood-unlocked-their-postgres-developer-productivity">Alex Klarfeld, CEO and co-founder of Supergood.ai</a></cite>
</blockquote>

Neon workflows are based on [database branching](https://neon.tech/docs/manage/branches) — allowing you to develop and test with data that very closely mirrors your production environment. Instead of relying on synthetic datasets or dealing with the complexities of maintaining local data scripts, you can create a branch with a perfect copy of your production data. This approach ensures your local testing is more reliable and reduces the risk of encountering issues when deploying to production.

<figure className="wp-block-image size-large is-style-default">
<img src="https://cdn.neonapi.io/public/images/pages/blog/development-environments-for-aws-rds-using-neon-postgres/screenshot-2024-07-15-at-55014percente2percent80percentafpm-c0c1f2f6.png" alt="Post image" width="1024" height="559" />
<figcaption>You can branch databases via copy-on-write. All branches are isolated, but they share the same storage, reducing your costs. Branches can be created and deleted immediately.</figcaption>
</figure>

### Database management is easy

<blockquote>
<p>“We’ve been able to manage 300K+ Postgres databases via the Neon API with only one engineer” </p>
<cite><em><a href="https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases">Himanshu Bhandoh, Software Engineer at Retool</a></em></cite>
</blockquote>

Neon has a straightforward, API-driven developer experience. The Neon API allows for easy automation and management of thousands of databases, reducing the overhead typically associated with database administration. This simplicity means you can focus on developing great software rather than managing infrastructure, even as your team and database needs grow.

## How much is this going to cost me?

Perhaps this is the best part: thanks to the economics of database branching and [scale to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero) functionality, building with Neon is much cheaper than RDS. Even if you keep your production data in an RDS instance, **you can save nearly 40% of your monthly costs by moving your non-production databases to Neon** — all while getting a superior developer experience.

<figure className="wp-block-image size-large is-style-default">
<img src="https://cdn.neonapi.io/public/images/pages/blog/development-environments-for-aws-rds-using-neon-postgres/screenshot-2024-07-15-at-55124percente2percent80percentafpm-b8f8a690.png" alt="Post image" width="1024" height="506" />
<figcaption>In Neon, databases automatically scale to zero after 5 minutes of inactivity. You only pay for compute when you’re using your databases. This is great for pre-prod environments.</figcaption>
</figure>

### Example RDS cost breakdown

Consider this typical AWS RDS deployment:

- 1 production database (db.m3.2xlarge: 8 CPU, 30 GB memory) – 100 GB
- 3 test databases (db.m1.medium: 1 CPU, 3.75 GB memory) -Used 3 hours / day on average – 50 GB
- 5 dev databases (db.m1.medium: 1 CPU, 3.75 GB memory) – Used 8 hours / day on average – 10 GB

Total monthly costs: $1,301.83.

### Example Neon cost breakdown

Now, let’s imagine moving the non-production environments to Neon:

- 1 production database in RDS (db.m3.2xlarge: 8 CPU, 30 GB memory) – 100 GB
- Scale plan in Neon
  - Main database branch with a copy of production (2 CU) – 100 GB – Used 2h / day on average for data transfer.
- 3 test database branches (1 CU) – Used 3 hours / day on average – Full copy of main – 100 GB
- 3 test database branches (1 CU) – Used 8 hours / day on average – Full copy of main – 100 GB

Total monthly costs: $783.68 — **this is 39.8% cost savings**.

## Next step: Build a Neon Twin

This blog post is just **Part I** of a series on how to build non-prod environments in Neon. The series continues with comprehensive guides that walk you through the process of setting things up—check them out:

**Part II:** [How to automatically sync data from RDS to Neon using GitHub Actions](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon)

**Part III:** [How to set up Slack notifications to automatically monitor the status of your dump/restores](https://neon.tech/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows)

**Part IV:** [How to deploy changes tested on Neon back to prod in RDS](https://neon.tech/blog/neon-twin-deploy-workflow)<br />

_Even if we use “RDS” in this content, the workflows described in those guides also work for other managed Postgres._

<Admonition type="tip" title="Neon vs RDS: FAQ">
If you're looking for a detailed comparison of Neon vs RDS, check out [neon.tech/rds](https://neon.tech/rds).
</Admonition>
