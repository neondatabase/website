---
title: How OpusFlow achieves tenant isolation in Postgres without managing servers
description: Orchestrating hundreds of Postgres databases is effortless with Neon
excerpt: >-
  “Our customers require their data to live in an isolated database, but
  implementing this in RDS was cumbersome and expensive. We switched over to
  Neon to reduce costs and operational overhead” Joey Teunissen, CTO at OpusFlow
  The demand for solar panels and sustainable energy inst...
date: '2024-02-22T17:28:50'
updatedOn: '2024-04-17T17:41:52'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    How OpusFlow achieves tenant isolation in Postgres without managing servers
    - Neon
  description: >-
    Architectures demanding one database per customer can get expensive and hard
    to manage in RDS, but they're effortless in Neon.
  keywords: []
  noindex: false
  ogTitle: >-
    How OpusFlow achieves tenant isolation in Postgres without managing servers
    - Neon
  ogDescription: >-
    Architectures demanding one database per customer can get expensive and hard
    to manage in RDS, but they're effortless in Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers/neon-opusflow-1024x576-5b9577e9.jpg)

<blockquote>
<p>“Our customers require their data to live in an isolated database, but implementing this in RDS was cumbersome and expensive. We switched over to Neon to reduce costs and operational overhead”</p>
<cite>Joey Teunissen, CTO at OpusFlow</cite>
</blockquote>

The demand for solar panels and sustainable energy installations keeps increasing. That’s where [OpusFlow](https://opusflow.io/) comes into play, making life easier for the installers on the front lines. First starting as a specialized software agency in the Netherlands around 2019, OpusFlow has quickly grown into a leading ERP tool that simplifies sustainable energy installations.

“With OpusFlow, you can just draw solar panels on the top of a roof, and we’ll do the rest, including calculations to see what kind of metal and products you need for the installation,” said Joey Teunissen, CTO at OpusFlow. “We help the solar installer send the quotation to their customers, actually install these panels on the roofs, and streamline the entire process end-to-end”.

## Multi-tenancy in Amazon RDS: a complex and costly design

Due to the nature of its business, OpusFlow handles sensitive data for its European customers, meaning that it needs to ensure the maximum level of data isolation. In Postgres terms, this means implementing an architecture with one database per customer.

This architecture doesn’t only assure that data from different customers can never mingle with each other, but it also allows them to create different encryption keys for different databases, scale them independently, run restores for specific customers without affecting operations, and upgrade them at different times if necessary.

When the OpusFlow team tried to implement this design in Amazon RDS, they soon discovered that it was not going to be as easy as it seemed. First, they tried implementing one big RDS instance hosting many databases. However, this level of isolation was not quite cutting it—for example, all the different databases were still competing for the same resources, something that introduced many problematic edge cases.

An alternative option was implementing a single-tenancy design, hosting every database into a separate RDS instance. This solution solves the isolation problems, but it creates others—namely, it adds significant overhead both operationally and around costs. Managing a large RDS fleet of hundreds or thousands of instances requires dedicated engineering resources; as Joey put it, **“RDS becomes a bottleneck if you don’t have full-time DevOps dedicated to it”**.

A fleet of RDS instances also requires big budgets. It implies overprovisioning many times over, which multiplies the bill.

## The alternative: a fleet of Postgres in Neon

<blockquote>
<p>“In Neon, we use one Neon project per customer for full isolation. For development, testing, and point-in-time restores, we use branches. They don’t cost much and they make everything easier”</p>
<cite>Joey Teunissen, CTO at OpusFlow</cite>
</blockquote>

To make things simpler, OpusFlow decided to switch to Neon.

Today, they use Neon as their main database. They implement a single tenancy system: every OpusFlow customer has their own isolated Postgres database living in a separate Neon project. A backend built on Node.js handles the requests to all databases, also with full isolation, handling authorizations at the database level.

This setup is seamless to manage in Neon. Since Neon is serverless Postgres, there’s no need to manage servers. There’s no need to allocate storage and compute endpoints are ephemeral and serverless. [Every customer database gets scaled independently](https://neon.tech/docs/introduction/autoscaling), consuming only the compute resources they need. When inactive, compute endpoints go idle automatically. This reduces the monthly bill.

Besides, Neon supports [database branching](https://neon.tech/docs/introduction/branching) at a project level. Branches act as immediately available, isolated database copies with up-to-date production data. They work using a copy-on-write mechanism, meaning that data isn’t duplicated across branches. For example, OpusFlow leverages branching to offer instantaneous [point-in-time restores](https://neon.tech/docs/guides/branch-restore) to their customers. Branching allows the immediate recovery to previous database states in case of accidental data corruption at no extra cost, being an affordable and user-friendly alternative to maintaining expensive replicas or waiting for restores from backup.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers/91-962x1024-c7d2b08a.jpg" alt="Image" />
<figcaption><em>In a single tenancy design in Neon, every customer gets its own Postgres database within a Neon project. Due to its serverless nature, managing a fleet of Neon projects is simple and affordable. Instantaneous PITR can be run in isolation.</em></figcaption>
</figure>

OpusFlow also has dedicated Neon projects for testing and development, [where each developer also gets their own branch](https://www.youtube.com/watch?v=zD1_AzzLRH0). This setup mirrors the structure of their Git workflow, ensuring that every new feature or bug fix is developed in an isolated environment. This approach not only streamlines the development process by allowing individual testing without affecting others but also reduces the dependency on local machines, increasing safety.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers/92-1024x1024-805f47d3.jpg" alt="Image" />
<figcaption><em>OpusFlow also uses dedicated Neon projects for development and testing, where every developer gets its own branch. Branches work on copy-on-write, so they don’t imply extra storage costs unless they diverge from their parent. Only active compute time is billed. </em><br></br><br></br></figcaption>
</figure>

## The OpusFlow serverless stack

<blockquote>
<p>“Our stack is almost 100% serverless. As we are in the sustainable industry, we’d like to be sustainable as well when it comes to our service—when we don’t use things, we turn them off. We like that concept”</p>
<cite>Joey Teunissen, CTO at OpusFlow</cite>
</blockquote>

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers/kapture-2024-02-16-at-123849-c8f1ef61.gif" alt="Image" />
<figcaption><em>The OpusFlow serverless architecture</em></figcaption>
</figure>

OpusFlow’s serverless tech stack is built around TypeScript. At the user interface level, they use Next.js, with Clerk handling secure authentication flows. The backend is powered by Hasura, which layers a dynamic GraphQL API on top of Postgres databases, ensuring real-time data interactions. Each tenant enjoys a distinct Postgres database within their own Neon project, ensuring data isolation and integrity.

For serverless functions, AWS Lambda takes care of executing event-driven, custom TypeScript logic without provisioning or managing servers. This aligns with the infrastructure’s ability to respond flexibly to varying load. Data is mirrored in cold storage, and the architecture is complemented by a suite of automation that orchestrates CI/CD, monitoring, and other operational tasks.

## Give Neon a try

<blockquote>
<p>“Neon is very easy to use. You create an account and a project, you get a database string, and that’s that. It’s still the Postgres that you’re used to”</p>
<cite>Joey Teunissen, CTO at OpusFlow</cite>
</blockquote>

If the idea of an easy to orchestrate, single-tenancy design for Postgres sounds interesting, [request an Enterprise free trial.](https://neon.tech/enterprise#request-trial) You’ll get temporary full access to Neon for your business without resource limitations, so you can create many projects and get a feel for the experience.

Thank you to [OpusFlow](https://opusflow.io/) for sharing their story! Best of luck as you continue to expand your business across Europe and overseas. Neon will be with you every step of the way.
