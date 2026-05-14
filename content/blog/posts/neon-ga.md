---
title: 'Neon: A New Approach to Database Development'
description: Neon is Generally Available
excerpt: >-
  Neon is now Generally Available. We’ve shipped major improvements to Neon
  internals that, combined with our operating experience scaling up to 700,000+
  databases over the past year, give us the confidence that Neon is ready to
  support your business-critical workloads. If you’re b...
date: '2024-04-15T13:06:18'
updatedOn: '2024-04-19T17:40:50'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-ga/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: 'Neon: A New Approach to Database Development - Neon'
  description: Neon is Generally Available
  keywords: []
  noindex: false
  ogTitle: 'Neon: A New Approach to Database Development - Neon'
  ogDescription: >-
    Neon is now Generally Available. We’ve shipped major improvements to Neon
    internals that, combined with our operating experience scaling up to
    700,000+ databases over the past year, give us the confidence that Neon is
    ready to support your business-critical workloads. If you’re building or
    scaling an application, you like Postgres, and you prioritize efficiency and
    […]
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-ga/social.jpg'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-ga/neon-available-1-1024x576-b9fdc521.jpg)

**Neon is now Generally Available. We’ve shipped major improvements to Neon internals that, combined with our operating experience scaling up to 700,000+ databases over the past year, give us the confidence that Neon is ready to support your business-critical workloads. If you’re building or scaling an application, you like Postgres, and you prioritize efficiency and engineering velocity, Neon is for you.** **[Sign up for free](https://console.neon.tech/signup).**

Postgres continues to hold its position as one of the most popular developer databases ever created. While MySQL lost some of its luster after acquisition by Oracle, Postgres continues to win more developer trust. In 2023, it [topped the poll](https://survey.stackoverflow.co/2023/#section-most-popular-technologies-databases) in the StackOverflow Developers Survey and in the same year, was voted the [DBMS of the Year](https://db-engines.com/en/blog_post/106) by DBEngines. The current internet meme is “Just Use Postgres” for everything.

Despite popularity Postgres suffers from the two problems that beset nearly all relational databases. It is difficult to scale up and down without interruption. Worse, it takes a long time to restore production operations when software bugs affect the data.

This happens because with Postgres it’s hard to create a high-fidelity developer environment as it requires copying the full state of the database. With that, maintaining multiple copies of data and schema for every developer is a major pain in the neck. The database becomes the nexus of development for most teams and invariably is the bottleneck constricting developer velocity.

## What developers need

When the Neon engineering team approached these issues they knew they had to solve several problems with today’s database development lifecycle:

1. They wanted Postgres cluster creation to be fast (sub-second)
2. They wanted Postgres clusters to be able to scale up and down automatically as the load changed. You don’t need to worry about over or under provisioning.
3. They wanted to be able to create branches with full data copied instantly so developers could work independently while still being able to collaborate effectively
4. They wanted to restore to a point in time in seconds instead of hours or days

Almost every app needs a database, and while developer tools and workflows evolved with platforms like GitHub and Vercel, databases did not evolve to match the developer experience of these systems. Evolving developer experience around the database requires a fundamental rethinking of the database architecture. But this is not a “look at our cool new database” engine. We know developers love and want to use authentic open-source Postgres. So, at Neon, we looked at how we could change the experience of developing on Postgres without losing everything that makes Postgres great.

We borrowed an idea from [Amazon Aurora](https://www.amazon.science/publications/amazon-aurora-design-considerations-for-high-throughput-cloud-native-relational-databases), the separation of storage and compute; and we aren’t talking about simply using a network-attached disk like EBS. True separation of storage and compute opened up the possibility to scale both parts of the service independently. Unlike AWS Aurora we decided to open source all the changes in Postgres and also send them upstream as well as fully open source our cloud native storage.

We made [architectural decisions](https://neon.tech/blog/architecture-decisions-in-neon) that ensured that our users have the complete Postgres experience, including Extensions, internals, command line and management tools. Everything that worked on-premise should work in our cloud service.

An additional benefit from separating storage and compute is – well we have a brand new cloud native storage implementation and we can “do things” in it. Controlling storage allows us to implement branching – a flagship feature that unlocks a better developer experience for building database apps.

## What does this mean for the user?

This means we can create branches at any point in time and start a compute instance pointing to that database version. So, every developer can work on a different branch without colliding with their colleague’s work.

![Project](https://cdn.neonapi.io/public/images/pages/blog/neon-ga/110-1024x551-511a354e.jpg)

Compute can now scale independently of storage so the CPU size and count can accurately match the load. Even large database loads have peaks and troughs. We wanted to avoid developers having to size for the largest expected load.

A database branch is copy-on-write, so it only points to a set of already created and stored pages. So, branches take less than a second to create. Because they are copied on write branches incur no space overhead until data is written to them.

Suppose a developer fat fingers a table or a database out of existence? No problem, move the branch to the second before that event happened. Starting a new database or recovering from a production failure happens in seconds because the Neon architecture doesn’t require you to ship hundreds of gigabytes of data to create new instances of databases and servers.

Users don’t want databases, they want data. Neon is designed to take the overhead of starting, stopping, creating, and cloning databases from hours to seconds. The major velocity inhibitor of modern development is the relational database. Imagine if data was easy, what would it do to your developer productivity?

With Neon database branching is integrated directly into the developer workflow and without interruption. When database data and/or schema changes take hours to propagate across the development team everyone suffers.<br />

Neon is the next big pivot for Postgres, and all of these changes have been offered upstream to the Postgres community. They are available in our [public repo](https://github.com/neondatabase/neon) today. Our mission is to provide everything Postgres developers need and less. Less waiting for clusters to start, less waiting for databases to restore, less waiting for colleagues changes to deploy, less waiting for the DBA team to schedule their updates.

## How did we get here?

During our Preview we’ve been focused on building a solid technical foundation for Neon. Some of our favorite milestones:

- In December 2022, [**we removed the invite-only gate to Neon**](https://neon.tech/blog/neon-serverless-postgres-is-live). Today, thousands of new Neon databases are created weekly. Neon includes a generous free tier that is here to stay: [the Neon architecture makes it efficient for us to support it.](https://twitter.com/nikitabase/status/1758639571414446415)
- We made [**database** **branching**](https://www.youtube.com/watch?v=a1ZEY3W7sOI) available to everyone. Today, tens of thousands of branches are created weekly by Neon users. Neon branches include data and schema, allowing developers to create isolated copies of their data in 1 second.
- Neon also included [**API support**](https://api-docs.neon.tech/reference/getting-started-with-neon-api) right from the start. The Neon API has now matured into a robust tool that enables Neon partners to easily manage fleets of hundreds of thousands of databases. They automate all database operations via the API, removing the need for dedicated DevOps for managing Postgres fleets.
- We also released a [**serverless driver**](https://neon.tech/blog/serverless-driver-for-postgres). Today, the Neon serverless driver has +100,000 weekly downloads. Developers use it to speed up their JavaScript and Typescript deployments.
- On the topic of speeding up deployments, we launched our [**Vercel integration**](https://neon.tech/docs/guides/vercel), which creates one database branch for every preview. Today, thousands of Neon database branches have been created via the Vercel integration.
- A few months into our Preview, we released the first version of [**autoscaling**](https://neon.tech/blog/scaling-serverless-postgres), a foundational feature that expands the Neon serverless experience. Today, thousands of autoscaling events are happening every week, saving developers the work of resizing manually.
- We also made the [**Neon CLI**](https://neon.tech/blog/cli) available to all users, so developers could simplify their integrations and automations by managing Neon directly from their terminal. Today, our CLI has hundreds of weekly active users (and counting).
- During the months of Preview, we put a special focus on improving our [**scale to zero** **and cold start**](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero) behavior. Today, tens of thousands of Neon databases scale to zero every day, saving developers money. And we keep working hard on our cold start metrics: we are now at a P50 of 500 ms to start a database, and we’re working to reduce it further.

## Try Neon

Neon Postgres is Generally Available. Serverless autoscaling and instant branching are built for modern developers who have to iterate fast. Go faster with Neon, it’s ready, [give it a spin](https://console.neon.tech/signup).

## 📚 **Keep reading**

- **[How we scale an open-source, multi-tenant storage engine for Postgres written in Rust](https://neon.tech/blog/how-we-scale-an-open-source-multi-tenant-storage-engine-for-postgres-written-rust):** we implemented sharding to distribute data across multiple Pageservers, allowing Neon to host larger datasets and I/O.
- **[1 year of autoscaling Postgres:](https://neon.tech/blog/1-year-of-autoscaling-postgres-at-neon)** Neon can autoscale your Postgres instance without dropping connections or interrupting your queries, avoiding the need for overprovisioning or resizing manually.
- **[Move fast and branch things:](https://neon.tech/blog/move-fast-and-branch-things)** the unique architecture of Neon brings database branching to Postgres, including data and schema. You can copy datasets in 1 second, without adding to the storage bill.
- [Neon CEO Nikita Shamgunov talks about taking Neon GA on the Madrona Ventures podcast](https://www.youtube.com/watch?v=4NakdEok_1U)
