---
title: How Dispatch speeds up development with Neon while keeping workloads on Aurora
description: They use Neon branches for their ephemeral environments
excerpt: >-
  “Neon’s branching paradigm has been great for us. It lets us create isolated
  environments without having to move huge amounts of data around. This has
  lightened the load on our ops team, now it’s effortless to spin up entire
  environments.”Jonathan Reyes, Principal Engineer at Dis...
date: '2024-10-14T15:31:55'
updatedOn: '2024-12-24T18:34:00'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    How Dispatch speeds up development with Neon while keeping workloads on
    Aurora - Neon
  description: >-
    Learn how Dispatch combines Neon with Aurora Global to accelerate
    development by using Neon branches as ephemeral environments.
  keywords: []
  noindex: false
  ogTitle: >-
    How Dispatch speeds up development with Neon while keeping workloads on
    Aurora - Neon
  ogDescription: >-
    Learn how Dispatch combines Neon with Aurora Global to accelerate
    development by using Neon branches as ephemeral environments.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora/neon-dispatch-1-1-1024x576-d7b49904.jpg)

<blockquote>
<p><strong>“Neon’s branching paradigm has been great for us. It lets us create isolated environments without having to move huge amounts of data around. This has lightened the load on our ops team, now it’s effortless to spin up entire environments.”<br></br></strong><br></br><em>Jonathan Reyes, Principal Engineer at Dispatch</em></p>
</blockquote>

[Dispatch](https://www.dispatchit.com/) is a technology company that simplifies [last-mile delivery](<https://en.wikipedia.org/wiki/Last_mile_(transportation)>) for businesses by streamlining the process of tracking deliveries, coordinating drivers, and communicating with customers. The Dispatch platform solves the tricky challenge of efficiently managing the final stage of delivery in many different locations at once, which is usually the most complex and expensive piece of the puzzle for large enterprises.

Founded in 2016, Dispatch operates in over 75 U.S. markets, providing on-demand delivery solutions via its network of independent contractor drivers and courier partners&#8203;.

<figure>
<a href="https://www.dispatchit.com/resource-categories/case-study">
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora/screenshot-2024-10-14-at-121742percente2percent80percentafam-1024x602-4adce35f.png" alt="Image" />
</a>
<figcaption><a href="https://www.dispatchit.com/resource-categories/case-study">Explore their success stories</a></figcaption>
</figure>

## Adopting serverless to alleviate overprovisioning and accelerate development

Dispatch runs its database infrastructure on AWS Aurora Global. While Aurora offers multi-region availability and handles traffic relatively well, it’s not the most cost-efficient solution to handle their spiky traffic patterns.

During peak hours in the morning, when most orders come in, **Dispatch had to overprovision Aurora by 10x their average usage.** This overprovisioning was necessary because Aurora only includes a single writer, and the writer database would often become the single point of failure.

<blockquote>
<p>“We had to overprovision Aurora to handle our spiky traffic, and even then, the writer database would get overwhelmed. We provision 10x more than we need on average to keep things running smoothly”<br></br><br></br><em>Jonathan Reyes, Principal Engineer at Dispatch</em></p>
</blockquote>

Dispatch is looking to Neon’s serverless writer endpoints to help alleviate this pain point. At the same time, they’re&nbsp; accelerating their SDLC workflow while reducing cots by using Neon branches to create their development environments.

More on this below:

## How Dispatch uses Neon for their ephemeral environments

The Dispatch team is transitioning from a monolithic to a microservices architecture. As part of this transition, they wanted to create a more agile workflow that would allow them to replicate a portion of their workload data (excluding PII) for testing in ephemeral environments.

<blockquote>
<p>“Getting realistic data into our verification environments was largely unfeasible, it was time-consuming, expensive, and a beast to maintain. You need to process hefty backups, transfer costs stack up, and there’s a lot of manual oversight required just to move that data”<br></br><br></br><em>Jonathan Reyes, Principal Engineer at Dispatch</em></p>
</blockquote>

**To improve their development experience, Dispatch started using Neon as their ephemeral environment database.** They didn’t immediately migrate workloads off Aurora—a huge undertaking—but began experimenting with Neon as a more agile solution for their various workloads.

Here’s a summary of how their deployment looks now:

### Scheduled syncing of environments via AWS DMS

The Dispatch team synchronizes their development environments with a safe, SOC 2-compliant subset of various workloads on a scheduled basis. To do this, they use [AWS Database Migration Service (DMS)](https://aws.amazon.com/dms/?p=ft&c=mg&z=3) to replicate data from their Aurora cluster into a main branch in Neon.

This scheduled sync gives them an up-to-date snapshot of their data, which is then used for testing and development. As they move toward more advanced workflows, they are considering transitioning to streaming replication to enable real-time data syncing, especially for scenarios like shadow environments&#8203;.

### Neon branches for each environment

Neon’s [branching model](https://neon.tech/flow) allows Dispatch to create isolated environments for testing without having to manually “copy” large datasets into new instances. Developers or QA team members can quickly spin up a new environment by running a simple command with their internal tooling. This environment includes a safe, sanitized, subset of data and is available immediately.

These branches are isolated—any changes or destructive tests are confined to the branch. For instance, feature teams that need access to real-world data for A/B testing or debugging can easily create a branch and conduct tests without worrying about affecting any other environments.

### Managing branches via Kubernetes

Dispatch has integrated Neon’s branching into their Kubernetes infrastructure. They’ve built a custom Neon operator for Kubernetes that automatically creates branches whenever a new ephemeral environment is spun up.

These ephemeral environments are a key part of Dispatch’s development process. They can quickly spin up entire stacks for testing, which include isolated instances of Neon’s databases. This isolation allows them to perform resource-heavy operations without putting additional load on other critical workloads.

### Neon’s read replicas for ETL and analytics

In addition to their primary workflow, Dispatch uses Neon’s [read replicas](https://neon.tech/docs/introduction/read-replicas) (read-only endpoints) to make their data pipelines more efficient. Previously, they ran both critical workloads and ETL jobs on the readers of their Aurora Global cluster, which caused frequent issues. Now, they create read-only replicas in Neon for specific use cases. For example, team members who need reports can run live data queries in tools like Metabase without having to wait for ETL pipelines to finish.

## If you’re running Postgres in AWS, give Neon a try

**It may not be the right time to move your workload off your current database, but you can still benefit from Neon’s DX for your dev/test environments.** If you haven’t used Neon before, [start by creating a free account](https://console.neon.tech/signup) and spin up a few branches.

<Admonition type="tip" title="Neon vs Aurora: FAQ">
If you're looking for a detailed comparison of Neon vs Aurora Serverless v2, check out [neon.tech/aurora](https://neon.tech/aurora).
</Admonition>
