---
title: Neon Is a Cursor Plugin
description: >-
  Install Neon directly from the Cursor Marketplace and give your Postgres
  workflows a boost
excerpt: >-
  Cursor just launched plugins, making it easier than ever to give Cursor
  structured access to external tools and infrastructure. Neon is part of the
  initial launch set: you can install the Neon plugin today from the Cursor
  Marketplace to give Cursor live access to your Neon organi...
date: '2026-02-17T18:58:33'
updatedOn: '2026-02-26T17:49:56'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-is-a-cursor-plugin/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Neon Is a Cursor Plugin - Neon
  description: >-
    Install the Neon plugin in Cursor to provision, branch, and restore Postgres
    databases instantly. Built for real development workflows.
  keywords: []
  noindex: false
  ogTitle: Neon Is a Cursor Plugin - Neon
  ogDescription: >-
    Install the Neon plugin in Cursor to provision, branch, and restore Postgres
    databases instantly. Built for real development workflows.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-is-a-cursor-plugin/social.jpg
---

<EmbedTweet url="https://twitter.com/cursor_ai/status/2023827892506161541?ref_src=twsrc%5Etfw" />

[Cursor just launched plugins](https://cursor.com/blog/marketplace), making it easier than ever to give Cursor structured access to external tools and infrastructure. Neon is part of the initial launch set: you can [install the Neon plugin today from the Cursor Marketplace](https://cursor.com/en-US/marketplace/neon) to give Cursor live access to your Neon organization along with the knowledge it needs to be genuinely useful in database tasks.

<figure>
<video autoPlay muted loop width="2880" height="878">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-is-a-cursor-plugin/cursor-plugin-1-7e78bf43.mov" />
</video>
<figcaption>cursor.com/marketplace/neon</figcaption>
</figure>

## Plugins help Cursor go beyond code

Thanks to plugins, Cursor can help you not just with writing code – but also with the real work around that code. Plugins give Cursor structured access to the tools your team already relies on to actually ship software, with the right built-in context and live access.

[Builders can submit their plugins](https://cursor.com/marketplace/publish) to expand the collection – but to get things started, Cursor is launching with partners that span the full development lifecycle so you have access to a complete stack. For example,

- [Linear](https://cursor.com/en-US/marketplace/linear) and [Notion](https://cursor.com/en-US/marketplace/notion) for scoping work
- [Figma](https://cursor.com/en-US/marketplace/figma) for design
- [Neon](https://cursor.com/en-US/marketplace/neon) for Postgres
- [Vercel](https://cursor.com/en-US/marketplace/vercel) for deploying
- [Stripe](https://cursor.com/en-US/marketplace/stripe) for payments
- [Sentry](https://cursor.com/en-US/marketplace/sentry) for debugging
- [Databricks](https://cursor.com/en-US/marketplace/databricks) for analytics

<figure>
<video autoPlay muted loop width="2928" height="1540">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-is-a-cursor-plugin/cursor-marketplace-0a1878c3.mov" />
</video>
<figcaption>Go to the Cursor Marketplace to discover and install plugins</figcaption>
</figure>

## The Neon plugin: branchable Postgres inside Cursor

The [Neon](https://neon.com/) plugin is one of the Infrastructure options. To [install it](https://cursor.com/marketplace/neon), just click “Add to Cursor”:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/neon-is-a-cursor-plugin/image-1-1024x359-7e75077f.png)

The plugin bundles two things:

- The Neon [MCP Server,](https://neon.com/docs/ai/neon-mcp-server) which gives Cursor live access to your Neon organization
- The Neon [skill](https://neon.com/blog/agent-skills-in-2026), which defines structured workflows and best practices for working with Neon

Once installed, it will work across all your Cursor surfaces (desktop, CLI, web, and mobile).

## Neon is not just Postgres: 5 reasons to run it from Cursor

The plugin is the most convenient way to give Cursor the context it needs about your existing Neon projects. But you may also be new to Neon, looking at the list of available Postgres plugins and wondering how Neon differs from the other options.

<blockquote>
<p><strong>Neon has a unique serverless architecture built around environments and iteration. By installing the Neon plugin, Cursor does more than deploy a Postgres database: it makes your development workflows simpler and safer, helping you manage environments, test migrations, and validate new code.</strong></p>
</blockquote>

### 1. Serverless by design

Neon databases are created instantly, without manual provisioning. [Compute and storage are fully separated.](https://neon.com/docs/introduction/architecture-overview) Compute starts when needed, scales automatically under load, and scales to zero when idle. Storage also scales invisibly. For workflows inside Cursor, that means [you don’t have to think about the infrastructure powering your database.](https://neon.com/docs/get-started/dev-experience#invisible-infra)

### 2. Environments with realistic data in seconds

The biggest unlock for DevX in Cursor + Neon is branching. A [Neon branch](https://neon.com/docs/introduction/branching) feels like a full copy of your database (schema and data), identical to your main database – but it’s fully isolated, ready in a second, and doesn’t duplicate storage.

Under the hood, branches use [Neon’s copy-on-write storage engine](https://neon.com/docs/introduction/architecture-overview#storage-layer). They reference the exact data state at a specific moment in time and only store new changes. You can tell Cursor to use them to test migrations, validate schema changes, run integration tests, reproduce bugs against realistic data, and so many more things.

### 3. Keep it lightweight (iteration-friendly)

Because Neon branches don’t duplicate storage and [scale to zero,](https://neon.com/docs/introduction/scale-to-zero) you can create many of these short-lived environments without worrying about cost. This is especially powerful for the iterative workflows you’ll adopt when working with Cursor. Database branches become something you can create and destroy as easily as a git branch.

### 4. Restore instantly if a deploy goes wrong

The same architecture that powers branching enables [instant restores.](https://neon.com/docs/introduction/branch-restore) Neon’s storage layer keeps a full history of WAL records and page versions; and because compute is separated from storage, Neon can spin up a branch at any previous point in time without copying data or waiting for long restore processes. That means you can ask Cursor things like

- “roll back this branch 5 minutes”
- “restore this database to yesterday’s state”
- “test against the schema as it existed last week”

And don’t wait for hours for any of these things to finish.

### 5. True and tested API

Neon is API-first: every major operation can be managed programmatically. This isn’t new for Neon – [since the early days of the platform](https://vercel.com/changelog/vercel-postgres), Neon has powered other tools and platforms that provision and manage Postgres entirely via API, which is the best interface for agents.

This API maturity is highly relevant to make the Cursor experience truly useful and robust. When Cursor connects to Neon through MCP, it’s interacting with a database environment that already speaks the language of agents.

## Try Neon from Cursor

[Install the Neon plugin from the Cursor Marketplace](https://cursor.com/en-US/marketplace/neon) and start experimenting with real database workflows from Cursor.

If you’re new to Neon, you can [create a free account](https://console.neon.tech/signup) in a minute – and if you have any questions, [you’ll find us in the Neon Discord](https://discord.gg/92vNTzKDGp).
