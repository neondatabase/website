---
title: ketteQ uses Neon branching for scenario analysis
description: Testing hundreds of scenarios on production databases cleanly with zero risk
excerpt: >-
  ketteQ is a supply chain planning and automation platform built on Salesforce
  and AWS. Its scenario management framework allows its users to model capacity,
  forecast demand, plan operations, manage orders and handle disruptions by
  enabling them to model various scenarios in their...
date: '2022-12-06T15:14:30'
updatedOn: '2025-10-10T08:55:40'
category: case-study
categories:
  - case-study
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-branching-for-postgres-with-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: ketteQ uses Neon branching for scenario analysis - Neon
  description: Testing hundreds of scenarios on production databases cleanly with zero risk
  keywords: []
  noindex: false
  ogTitle: ketteQ uses Neon branching for scenario analysis - Neon
  ogDescription: >-
    ketteQ is a supply chain planning and automation platform built on
    Salesforce and AWS. Its scenario management framework allows its users to
    model capacity, forecast demand, plan operations, manage orders and handle
    disruptions by enabling them to model various scenarios in their business.
    For example, a Supply Chain Manager could run a scenario to understand […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-branching-for-postgres-with-neon/social.png
source:
  wpId: 587
  wpSlug: database-branching-for-postgres-with-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/database-branching-for-postgres-with-neon/neon-database-branching-with-neon-1-1024x576-5b08fe13.jpg)

[ketteQ](https://www.ketteq.com) is a supply chain planning and automation platform built on Salesforce and AWS. Its scenario management framework allows its users to model capacity, forecast demand, plan operations, manage orders and handle disruptions by enabling them to model various scenarios in their business. For example, a Supply Chain Manager could run a scenario to understand how a 30% uplift in demand would affect their stock and their ability to meet their customers’ needs. She could tweak different parameters for each scenario and run simulations.

Each scenario is a snapshot of the current working data. The problem for ketteQ was that some of their large clients maintain hundreds of scenarios at any time. On traditional Postgres offerings like RDS, creating snapshots or provisioning a new database for each one of them is hard to manage and time-consuming.

With Neon and database branching, ketteQ creates a branch for each user’s scenario to allow its customers to model many different scenarios simultaneously and compare the results of their analysis to find the optimal business outcome. They can create hundreds of branches to scale to meet the customers’ demands without provisioning additional resources.

We spoke with Vasu Narayan, Senior Vice President of Product, to discuss how ketteQ uses database branching for scenario analysis.

_“Certain clients of ours, with a large user base, need to maintain hundreds of scenarios at any time. Neon capabilities allow us to scale to meet our customers’ needs to be able to maintain and run these scenarios. Branching also provides a way to maintain a hierarchical relationship among the scenarios to track their provenance and versioning.”_

<YoutubeIframe embedId="c-02mR4IlU8" isDocPost={false} />

## What is database branching, and why should you care?

A branch is a copy of your database that you can use in your development environment and for testing.

A typical development shop has production, staging, and development databases that share the same schema but not always the same data.

When you build features that require “real” data for verification and testing, you might add scripts that stream data to your non-production environments, use snapshots, or even generate data to test with. But some common problems with these approaches include

1. Adding unwanted complexity to your architecture.
2. Having to write and maintain more code
3. Having to maintain production-size databases in your staging and development environments.
4. They are difficult to automate

With database branching, your other environments, such as staging and development, are just a branch of your production database, which you can create instantly. Branches include all of the data in your parent branch at the point of branch creation. You can easily spin up new branches with a single click or API call.

Another typical issue developers face is when they work in parallel on features that involve changes to the database. The chance of introducing conflicts and bugs in your code base is much greater in these situations. And let’s face it, this is often a significant source of frustration among the development team members.

## How does branching help?

So, how does branching address the common pain points we discussed above? Before we get to that, let’s take a closer look at how branching works.

The space complexity of creating a branch is _O(parent-branch-metadata),_ which makes branching computationally inexpensive. Neon uses the copy-on-write technique to create branches. This means that when you create a branch, you only increase your storage when you update and insert data in the branch.

![Branching](https://cdn.neonapi.io/public/images/pages/blog/database-branching-for-postgres-with-neon/branching-1024x690-8e7b7e72.png)

Neon separates storage and compute, which enables branching. Our co-founder Heikki Linnakangas [discusses Neon’s architecture](https://neon.tech/blog/architecture-decisions-in-neon/) in a different blog post. In addition to branching, one of the benefits of Neon’s architecture is the ability to scale compute nodes to zero.

Copy-on-write combined with scale-to-zero works well for development teams that only want to consume the necessary resources—no more VMs with development databases that run 24/7 but are used only 10% of the time.

Neon enables every developer to have a branch of the production database for development and testing features with “real” data.

As a developer, you know way too well how important it is to test your code in your CI/CD before deploying it to production. But what about your database? With the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), you can implement branching into your CI/CD pipeline to ensure that your database changes won’t break your application or cause other problems in production.

Tune in to [our talk about the Neon API](https://www.youtube.com/watch?v=NI2x1mhB6uI) to learn more about using database branching to address common pain points in your workflows.

## So, what else can you do with branching?

We have discussed how branching can be used in the development and that everyone in your team can have a branch of your production database to run tests. Now, let’s look at other ways that you can branch, but before that, let’s touch on the structure of the Neon account and the Neon API for a moment

In your Neon account, you can create multiple projects. Every project comes with a main branch and can have several other branches. Every branch comes with a default `neondb` database, and you can create as many other databases as you need. So, any project that you create starts with this hierarchy:

`project xyz -> main branch -> neondb database`

You can learn more about [Neon account hierarchy](https://neon.tech/docs/manage/overview/) in the documentation.

## Recap

To summarize, database branching allows you to create new database environments and test features with production data to avoid issues after deployment. It saves you the hassle of maintaining additional code and tools for streaming data to your staging and development environments.

Since branching uses copy-on-write and compute-nodes scale down to zero, each team member can get a branch to work simultaneously without breaking your development database.

Additionally, branching opens the door to a world of possible use cases. Some users use database branching and the Neon API to create hundreds of branches to run simulations.

What could you do with h branching? Let us know what your use case is!

Don’t have an account? [Sign-up today](https://console.neon.tech/sign_in)!
