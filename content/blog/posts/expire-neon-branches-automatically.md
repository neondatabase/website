---
title: Your Neon Branches Can Now Expire Automatically
description: 'Set an expiration date for your branches, Neon handles the cleanup'
excerpt: >-
  Branching is one of the most powerful features in Neon. It lets teams spin up
  isolated environments instantly and automate workflows through the API, and as
  a result, developers and agents create many branches at scale – hundreds or
  even thousands of them. To make managing short-...
date: '2025-08-13T18:45:44'
updatedOn: '2025-08-14T09:36:01'
category: product
categories:
  - product
  - workflows
authors:
  - gustavo-salomao
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/expire-neon-branches-automatically/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Your Neon Branches Can Now Expire Automatically - Neon
  description: >-
    You can now set an expiration time for Neon branches, so they're deleted
    automatically - this makes it even easier to manage them.
  keywords: []
  noindex: false
  ogTitle: Your Neon Branches Can Now Expire Automatically - Neon
  ogDescription: >-
    You can now set an expiration time for Neon branches, so they're deleted
    automatically - this makes it even easier to manage them.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/expire-neon-branches-automatically/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/expire-neon-branches-automatically/neon-ttl-branches-1-1-1024x576-47f624f9.jpg)

[Branching](https://neon.com/docs/introduction/branching) is one of the most powerful features in Neon. It lets teams spin up isolated environments instantly and automate workflows through the API, and as a result, developers and agents create many branches at scale – hundreds or even thousands of them.

To make managing short-lived branches even easier, we’re launching a new feature: [you can now set an expiration time for Neon branches](https://neon.com/docs/guides/branch-expiration), so it’s deleted automatically. This is a game-changer for managing branches at scale.

## Supporting Branching Workflows at Scale

Neon’s [branching model](https://neon.com/flow) is reshaping how teams build with Postgres. Instead of provisioning and managing separate database instances for every environment, you can create instant, production-like copies of your data using branches – each one isolated, resettable, and built on top of a shared storage layer.

This unlocks a new level of flexibility and speed for modern development teams. A single project can support many branches, for example:

- One branch per developer for fully isolated dev environments
- One branch per preview to power live feature previews during code reviews
- One branch per test run in CI pipelines for clean, reproducible tests
- Versioned app environments – where agents or users spin up many parallel branches to explore, fork, or checkpoint different versions of an application over time

These workflows scale beautifully. Neon can handle hundreds of active branches in a single project because branches are lightweight by design – they inherit data and schema from their parent via copy-on-write, without duplicating storage, and they’re instant to create and scale to zero when idle. Branching has become the foundation for highly dynamic, automation-friendly infrastructure.

But as branching scales, lifecycle management becomes increasingly important. Developers forget to clean up preview environments, test runs leave stale database branches behind, and agents start creating thousands of branches – and it starts getting annoying (and potentially expensive) to clean them up manually.

## Let Your Branches Expire Themselves

That’s why we built [expiration rules for Neon branches](https://neon.com/docs/guides/branch-expiration), a simple feature but one that truly improves the experience of managing the lifecycle of short-lived branches. Now, when creating a branch via the API, CLI, or Console, you can set an expiration time:

![Image](https://cdn.neonapi.io/public/images/pages/blog/expire-neon-branches-automatically/screenshot-2025-08-13-at-115159percente2percent80percentafam-68560f1e.png)

Once that time is reached, Neon will automatically delete the branch. There’s no need to write cleanup scripts or worry about forgotten environments eating into your project’s storage; everything expires on schedule.

### Under the hood

Neon tracks each branch’s expiration timestamp and runs a periodic job to clean up expired branches. If the branch is still in use, you can reset or update the expiration time. But if it’s done, it disappears automatically, freeing up resources and keeping your project clean.

## 4 Scenarios Where Expiring Branches Are Game-Changing

This is a small feature that has a big impact, especially for teams running large-scale ephemeral environments. Here are some of the most common use cases:

### Serverless ephemeral environments at scale

[In serverless development, it’s common to spin up short-lived environments on demand](https://neon.com/blog/ephemeral-environments-aws-serverless), whether for dev containers, Lambda test runs, or Kubernetes-based previews. These environments are created automatically, used briefly, and then discarded.

Neon fits perfectly into this model: branches are instant to create, scale to zero when idle, and reuse storage via copy-on-write. With expiration rules, these branches now clean up automatically, completing the serverless loop with zero manual work.

### Versioned app timelines in agent-driven workflows

[Neon’s branching lets agents checkpoint full app states (code + data) by creating branches at each version.](https://neon.com/blog/replit-app-history-powered-by-neon-branches) This enables true time travel – users can preview or restore any historical version. Behind the scenes, each checkpoint triggers a new branch at the specified point-in-time snapshot, meaning that the number of branches quickly grows – since agents generate dozens of these timelines per user, per session.

By assigning expiration times to these branches, agents can generate versioned timelines at scale, without leaving behind clutter.

### Preview environments per pull request

Neon users love creating full-stack previews for every pull request using the [Vercel integration](https://neon.com/docs/guides/vercel-overview). These environments are often short-lived, tied to the lifecycle of a feature branch or a review cycle.

Expiration rules make preview database branches self-cleaning. When the PR is closed, the countdown continues. Once the expiration is reached, Neon deletes the branch automatically.

### CI pipelines with one branch per test run

In a typical CI workflow, each test suite runs in its own environment – but with Neon, every test run can spin up a new branch derived from a known-good baseline. Expiration adds a simple lifecycle step: branches expire automatically after a defined window, ensuring that stale environments don’t accumulate over time. This is great for teams running hundreds or thousands of test jobs per day across distributed services.

## Try it Now

Expiration rules for Neon branches are available now via the Neon API, CLI, and Console. You can start using them today to bring more automation, scale, and simplicity to your development and testing workflows. [Check out the docs](https://neon.com/docs/guides/branch-expiration) for all the details, and if you haven’t tried Neon yet, [start a free account.](https://console.neon.tech/signup)
