---
title: 'Database branching workflows: A guide for developers'
description: Add prod-like data to your preview and local dev workflows
excerpt: >-
  Modern development demands speed and flexibility, but this is nowhere to be
  found in database development. Even when using managed databases, database
  workflows are still slow and prone to errors: setting up new instances takes
  time, undoing changes is risky, keeping data consist...
date: '2024-05-09T17:50:40'
updatedOn: '2024-05-09T17:50:43'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-branching-workflows-a-guide-for-developers/cover.png
  alt: null
isFeatured: false
seo:
  title: 'Database branching workflows: A guide for developers - Neon'
  description: >-
    We've put together step-by-step guides for two database branching workflows:
    one preview per PR and one local dev branch per engineer.
  keywords: []
  noindex: false
  ogTitle: 'Database branching workflows: A guide for developers - Neon'
  ogDescription: >-
    We've put together step-by-step guides for two database branching workflows:
    one preview per PR and one local dev branch per engineer.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/database-branching-workflows-a-guide-for-developers/social.png
source:
  wpId: 5973
  wpSlug: database-branching-workflows-a-guide-for-developers
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/database-branching-workflows-a-guide-for-developers/database-branching-workflows-cover-1024x576-f786be91.png)

Modern development demands speed and flexibility, but this is nowhere to be found in database development. Even when using managed databases, database workflows are still slow and prone to errors: setting up new instances takes time, undoing changes is risky, keeping data consistent across environments becomes a pain over time—the list goes on. For many teams, the database is still the place where it’s way too easy to make a fatal mistake and slow everything down.

This is a problem that we’re very familiar with in Neon. In fact, it is one of our main [product inspirations](https://neon.tech/blog/hello-world). We believe that data and databases should be treated as everything else in our codebase —with the same capacity for safe development and collaboration, iterative improvement, and potential for automation, all without compromising security or jeopardizing engineering time.

## Database development done right: ship faster with these database branching guides

To get there, we’re working on a bunch of exciting things in Neon that will be coming soon—but a big leap forward can already be made today. To demonstrate this, we’ve put together a **[database branching workflows guide](https://neon.tech/flow)** in which we walk you through two particular workflows step by step:

- **Preview environments (one per PR)\*\*** — [repo](https://github.com/neondatabase/preview-branches-with-fly?tab=readme-ov-file)\*\*
  - This workflow covers how to automatically create a [preview environment for every pull request](https://github.com/neondatabase/preview-branches-with-fly?tab=readme-ov-file) with its associated database branch. We’ll use Fly.io, Neon, and Drizzle.
  - Once the PR is closed, the preview environment and its associated database branch are automatically deleted.
- **Local dev environments (one per developer)**
  - This workflow covers how to create personalized dev development environments for every engineer in a team using database branching. Each engineer will have instant access to an isolated “copy” of production-like data.
  - When the work is done, they can sync their dev branch so it reflects the latest state of schema + data in production.<br />

We review the workflows in this video:

<YoutubeIframe embedId="6XezQQJGdjI" isDocPost={false} />

## Why adopt database branching workflows?

The two-word summary: _you’ll ship faster._

If you want the longer answer, here are some customer favorites:

- Rapid onboarding. Every engineer on the team can instantly spin up dev environments with an isolated copy of data plus schema.
- Reduced risk. Since branches can be created from past points in time, developers can explore changes with a safety net. Mistakes or unwanted modifications can be easily reverted.
- Higher quality code. It’s easier to fix bugs when using realistic, production-like data in development environments.
- Improved team collaboration. Engineers work in parallel without stepping on each other’s toes. Branches are very affordable, so this isolation costs the team very little.
- Effortless data consistency. All dev branches can be reset from main in one second, mirroring the same data conditions and schema.
- No prod-like data in personal machines.

## Get started

To get started with the workflows, [create a Neon project](https://console.neon.tech/signup) and follow the steps in the guide. If you implement this, we want to hear about it. Find us on [Twitter](https://x.com/neondatabase) and [Discord](https://neon.tech/discord).
