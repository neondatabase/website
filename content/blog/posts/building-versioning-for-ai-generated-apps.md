---
title: Building Versioning for AI-Generated Apps
description: How Dyad built a complete versioning system with code + data
excerpt: >-
  For anyone building apps with AI, iteration is constant: you try different
  prompts, tweak the logic, and regenerate code until it finally works. At Dyad,
  a free, local, open-source AI app builder, this cycle is part of every user’s
  experience. From the start, Dyad made it easy to...
date: '2025-11-12T16:43:33'
updatedOn: '2026-01-02T17:40:17'
category: product
categories:
  - product
  - community
authors:
  - will-chen
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-versioning-for-ai-generated-apps/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Building Versioning for AI-Generated Apps - Neon
  description: >-
    Dyad shares how they built full-stack versioning for their agent, syncing
    code and database changes safely using Neon branching.
  keywords: []
  noindex: false
  ogTitle: Building Versioning for AI-Generated Apps - Neon
  ogDescription: >-
    Dyad shares how they built full-stack versioning for their agent, syncing
    code and database changes safely using Neon branching.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-versioning-for-ai-generated-apps/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-versioning-for-ai-generated-apps/neon-building-versioning-1-2c498ecb.jpg)

<Admonition type="note" title="Neon x Agent Builders">
This blog post is a collaboration with [Dyad](https://www.dyad.sh/) as part of our Agent Builders series, where agent platform teams share how they built, scaled, and refined their systems.
</Admonition>

For anyone building apps with AI, iteration is constant: you try different prompts, tweak the logic, and regenerate code until it finally works. At [Dyad](https://github.com/dyad-sh/dyad), a free, local, open-source AI app builder, this cycle is part of every user’s experience.

From the start, Dyad made it easy to roll back code changes when something broke, but database changes were a different story. Schema edits and data migrations weren’t covered by the same versioning system, which meant they were riskier to experiment with.

That gap eventually led us to design a database versioning model, bringing code and data state together for the first time. Once we could pair code commits with database state, users no longer had to worry about breaking data or schema changes. Versioning finally felt complete.

This is how we built it and how we’re planning to improve our initial design.

## The Initial Design

### Part I: Integrating with Neon

<Admonition type="tip" title="Check out the code">
Dyad is open-source ([github.com/dyad-sh/dyad](https://github.com/dyad-sh/dyad/)) so you can see exactly how everything works, including the Neon integration.
</Admonition>

The first thing we did was integrate Dyad with [Neon](https://neon.com/), since they provided the building blocks needed to get the versioning experience we wanted. When a user creates a new Dyad app,

1. Dyad creates a Neon database for the user using [Neon’s OAuth integration](https://neon.com/docs/guides/oauth-integration)
2. It automatically creates another database [branch](https://neon.com/docs/introduction/branching) for preview
3. Dyad links the database state to each code version, pairing the two as part of its versioning system.

[Neon’s branching feature](https://neon.com/branching) is essential in this setup. When users preview older versions of their app, Dyad switches the app to use the preview branch in Neon, so previewing or reverting to a previous version doesn’t touch the active development branch.

Meanwhile, as the user keeps developing on the main branch, Dyad records the database’s current timestamp alongside every commit. In practice, this ties the Git commit and the database timestamp together. When the user undoes a version, Dyad uses that timestamp to roll back both the code and the database to the same point in time.

Undoing a version in Dyad means undoing the code and the data. The two stay perfectly in sync.

### Part II: Building on Payload CMS

Our initial implementation of this integration was developed as part of a Portal template, built on top of [Payload CMS](https://payloadcms.com/). This gives us a full-stack setup where users can generate an entire application in a couple of clicks, database, CMS, and all, with Dyad handling all the wiring behind the scenes.

## What We’re Planning to Do Next

This first integration achieved our main goals (linking database state and code versioning), but we’re already thinking about making some changes.

### Using snapshots for versioning

When the team first built this integration, [Neon’s Snapshot API](https://neon.com/blog/checkpoints-for-agents-with-neon-snapshots) wasn’t available yet. Snapshots are a natural fit for our use case because they capture the entire database state at a point in time and make it possible to:

- Roll back or forward between versions without losing intermediate history
- Preserve continuity when restoring data
- Avoid destructive restores, since snapshots don’t overwrite previous states

With snapshots, we can make database time travel symmetrical, going back and forward between versions safely. Right now, Dyad’s timestamp-based rollback means that when you restore to an earlier version, the later part of the database history is lost. Snapshots will remove that limitation, allowing full, bi-directional versioning.

### Simplifying the experience by adding auth

As we mentioned earlier, Dyad’s Neon integration is currently tied closely to the Payload CMS framework. Payload gives us a robust structure but the setup process can be intimidating for first-time users, e.g. when it comes to configuring basics like an email provider.

To simplify that experience, we’re exploring [Neon Auth](https://neon.com/docs/neon-auth/quick-start/nextjs). Using it will let us offer built-in authentication flows (like password resets) without requiring an external email service, which is a step toward making the full-stack Dyad + Neon setup accessible even to those without backend experience.

## Wrapping Up

We’re excited about what Neon is providing for AI app builders like us. From the generous free tier to time-travel capabilities, it’s a stack that fits how our users build and iterate. Our experience so far has given us two takeaways:

- **Version everything, not just code.** When AI is generating both your frontend and backend, your database deserves the same level of version control as your source files.
- **Design for reversibility.** Vibe coders will break things often and that’s part of the creative process. Safety nets like Neon branching and snapshots will help you transform that chaos into confident iteration for your users.

<Admonition type="tip" title="Try Dyad, the open-source codegen builders">
[Explore Dyad on GitHub](https://github.com/dyad-sh/dyad) or [download it locally](https://www.dyad.sh/) to play directly with it.
</Admonition>
