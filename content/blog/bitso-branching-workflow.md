---
title: Inside Bitso’s Branch-Based Workflow
description: Database branching gives every engineer a production-like sandbox
excerpt: >-
  “Neon’s branching gave us the last missing piece in our RISE (Robust Isolated
  Staging Environment): true database isolation. The services that touched
  schema changes or write-heavy paths could never share a database safely. Now
  every sandbox gets its own isolated Postgres DB when...
date: '2026-01-07T17:01:55'
updatedOn: '2026-01-07T17:55:56'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/bitso-branching-workflow/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Inside Bitso’s Branch-Based Workflow - Neon
  description: >-
    Bitso uses Neon branching to give 250+ engineers an isolated,
    production-like sandbox, eliminating staging bottlenecks at scale.
  keywords: []
  noindex: false
  ogTitle: Inside Bitso’s Branch-Based Workflow - Neon
  ogDescription: >-
    Bitso uses Neon branching to give 250+ engineers an isolated,
    production-like sandbox, eliminating staging bottlenecks at scale.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/bitso-branching-workflow/social.jpg
source:
  wpId: 12112
  wpSlug: bitso-branching-workflow
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/bitso-branching-workflow/screenshot-2026-01-07-at-95244-am-1024x572-1861da62.png)

> **“Neon’s branching gave us the last missing piece in our RISE (Robust Isolated Staging Environment): true database isolation. The services that touched schema changes or write-heavy paths could never share a database safely. Now every sandbox gets its own isolated Postgres DB whenever required”**<br /><br />(Joe Horsnell, Principal Platform Engineer at [Bitso](https://bitso.com/))

[Bitso](https://bitso.com/), leader in digital financial services in Latin America, runs a large engineering organization with hundreds of developers and microservices, and a mission-critical system that processes millions of transactions. As the team grew, testing changes safely became increasingly difficult, especially when multiple services and data models needed to evolve at the same time.

## Scaling Development Across 250+ Engineers

Like many teams, Bitso first relied on a single shared development environment and a single shared staging environment. Once hundreds of engineers had to push changes simultaneously, these environments quickly became a bottleneck, with dependencies changing minute by minute and faulty deployments breaking the workflow for everyone else.

Their architecture made this even harder. Bitso’s platform is built on hundreds of Java microservices communicating asynchronously through Kafka, making it impossible for a developer to reproduce the entire stack locally.

The shared environments became the only place to test changes end-to-end, but they became quite unreliable. Developers often tested a collection of changes from multiple engineers in staging, then deployed a different build to production, meaning the artifact that reached customers had never truly been tested in a clean environment.

## Step 1: Solve Service Isolation via Signadot

Bitso’s first step toward a more developer-friendly environment was adopting [Signadot](https://www.signadot.com/?utm_source=partner&utm_medium=partner_blog&utm_campaign=q1_26_partner_marketing). With Signadot sandboxes, engineers can automatically route requests for specific services to isolated versions of those services based on their pull requests, eliminating collisions at the compute and service layer.

<Admonition type="tip" title="Learn more about Bitso’s Signadot setup">
The Signadot team published a walkthrough of Bitso’s service-isolation architecture, including how sandboxes are provisioned and how traffic is routed. You can [read it here](https://www.signadot.com/blog/how-bitso-is-scaling-branch-based-development-with-signadot-and-neon?utm_source=partner&utm_medium=partner_blog&utm_campaign=q1_26_partner_marketing).
</Admonition>

Even after solving service-level isolation, one major dependency remained shared across all sandboxes: the database.

## Step 2: Solve State Isolation with Neon

For roughly half of Bitso’s services, sharing a database wasn’t an issue, as these services were read-heavy or interacted with tables that rarely changed. But for the long tail of services that required

- schema changes
- write-heavy testing
- destructive migrations
- or validation against real production-like data,

a single shared database made true isolation impossible. To fully unlock sandboxed development, Bitso needed a way to give each engineer (or each PR) their own isolated, production-like Postgres instance without incurring massive operational overhead, so they turned to [Neon’s branching](https://neon.com/blog/practical-guide-to-database-branching).

## Production-Like Databases for Every Sandbox

[Branching](https://neon.com/docs/introduction/branching) in [Neon](https://neon.com/) offers a way to create new Postgres environments [instantly by taking a point-in-time copy of an existing database](https://neon.com/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write), without duplicating data or provisioning new infrastructure. Branches behave like independent databases, but they share the same underlying storage using a copy-on-write model, making them fast to create and inexpensive to run.

For Bitso, branching provided exactly what was missing in their workflow:

- **Each Signadot sandbox can be paired with its own Neon branch,** giving developers a clean environment without affecting the baseline staging data or other engineers.
- **Engineers validate logic against real-world scenarios and edge cases,** since branches inherit the exact state of the parent environment at creation time.
- **Engineers can run destructive testing and migrations with zero risk to anyone else.** When they’re done, branches simply scale back down to zero or are removed entirely via [workflows that can be automated.](https://neon.com/docs/guides/branch-expiration)
- **Every layer is serverless.** Neon’s serverless architecture means branches start fast, [scale automatically](https://neon.com/docs/introduction/autoscaling), and [incur no cost when idle](https://neon.com/docs/introduction/scale-to-zero), perfectly matching Signadot’s short-lived sandbox model.

## Bitso’s RISE Architecture

This combination of service isolation through Signadot and state isolation through Neon is what allowed Bitso to build what they call RISE: a Robust Isolated Staging Environment, or a development workflow where every change is tested in a production-like environment, entirely in isolation, before being promoted.

At the heart of RISE is the idea that **every change should be tested in its own environment, and the exact artifact that passes those tests should be the artifact deployed to production.** Signadot handles the routing: requests meant for a developer’s modified services are sent to that engineer’s sandbox, while all other requests continue hitting the baseline environment. Neon handles the state: each sandbox can be paired with its own Postgres branch, ensuring the database layer reflects the same level of isolation.

The result is a workflow where

- every engineer gets a production-like environment by default
- changes are tested independently and safely
- deployments become predictable and repeatable
- staging stability no longer controls team velocity

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/bitso-branching-workflow/695e7f9aebad6e33d68df6d993f14727-1024x690-9c24942f.png" alt="Image" />
<figcaption>Source: Signadot</figcaption>
</figure>

## Wrap Up

For a company operating at Bitso’s scale, this development setup is transformative, with fewer broken environments, faster iteration, safer deploys, and a far more predictable path from development to production. If you’re exploring a similar approach, [check out Signadot’s write-up](https://www.signadot.com/blog/how-bitso-is-scaling-branch-based-development-with-signadot-and-neon?utm_source=partner&utm_medium=partner_blog&utm_campaign=q1_26_partner_marketing), [open a free Neon account](https://console.neon.tech/login), and [try your first branching workflows](https://neon.com/blog/practical-guide-to-database-branching).
