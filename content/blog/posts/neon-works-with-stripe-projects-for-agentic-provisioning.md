---
title: Neon works with Stripe Projects for agentic provisioning
description: Agents can provision Neon databases from the CLI
excerpt: >-
  For most of 2025, AI coding agents got good at a specific thing: writing code.
  Give an agent a prompt, and it could scaffold an app, wire up an API, write
  migrations. But when the code was done, the agent stopped. Spinning up a real
  database, creating an account, getting credenti...
date: '2026-03-26T16:14:37'
updatedOn: '2026-03-26T16:38:15'
category: product
categories:
  - product
authors:
  - brad-van-vugt
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-works-with-stripe-projects-for-agentic-provisioning/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Neon works with Stripe Projects for agentic provisioning - Neon
  description: Agents can provision Neon databases from the CLI
  keywords: []
  noindex: false
  ogTitle: Neon works with Stripe Projects for agentic provisioning - Neon
  ogDescription: >-
    For most of 2025, AI coding agents got good at a specific thing: writing
    code. Give an agent a prompt, and it could scaffold an app, wire up an API,
    write migrations. But when the code was done, the agent stopped. Spinning up
    a real database, creating an account, getting credentials into the
    environment… that […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-works-with-stripe-projects-for-agentic-provisioning/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-works-with-stripe-projects-for-agentic-provisioning/neon-works-with-stripe-projects-agents-can-provision-databases-from-the-cli-1024x538-0b6bb644.jpg)

For most of 2025, AI coding agents got good at a specific thing: writing code. Give an agent a prompt, and it could scaffold an app, wire up an API, write migrations. But when the code was done, the agent stopped. Spinning up a real database, creating an account, getting credentials into the environment… that part was still on you.

That gap is closing.

Today, Neon is joining the developer preview of Stripe Projects as a co-design partner. [Stripe Projects](https://projects.dev) is a new workflow in the Stripe CLI that lets developers and AI agents provision real infrastructure from the terminal. No dashboard, no copy-pasting keys, no brittle setup scripts.

## What it looks like

The workflow is a handful of CLI commands:

```bash
stripe projects init my-app   # set up your project
stripe projects catalog        # browse available services
stripe projects add neon/postgres       # provision a Neon database
```

When you run `stripe projects add neon`, Stripe Projects creates a Neon account (or links to an existing one), provisions a Postgres database in a new Neon project, and returns the connection string directly to your environment. The database lives in your Neon account. You keep full dashboard access.

From there:

```bash
stripe projects status              # see what's wired to your project
stripe projects rotate neon         # rotate the connection string credentials
stripe projects remove neon         # delete the project and database
```

`rotate` is particularly nice functionality worth calling out. Credential rotation has historically required navigating a dashboard, regenerating a key, and manually updating wherever that key lives. With `stripe projects rotate`, you pass in a service ID and get fresh credentials back in a way that’s readable by both humans and agents.

## Why this matters for agent workflows

AI coding agents need deterministic steps. If provisioning a database requires clicking through a UI, an agent can’t do it reliably. It can screenshot, guess, or ask you to pause and do it manually.

Stripe Projects gives agents a standard interface: run a command, get credentials back, continue building. The credentials land in the environment in a structured, agent-readable format. No guessing, no interruption.

Since the start of 2026, we’ve seen this pattern emerging: agents that can take a new project from `git init` to a running app, fully autonomously. Stripe Projects and Neon’s integration is one piece of that picture.

## The ideal database for agentic provisioning

Not every database is a good fit for this kind of workflow. A few requirements come into focus when an agent, not a human, is doing the provisioning.

**Available immediately.** If an agent can scaffold an app in under a minute, a database that takes five minutes to spin up breaks the flow. Neon databases are ready in 350ms.

**Free to start.** The economics of app development are shifting. When anyone can generate a working app in minutes, the cost model needs to match. Paying upfront for a database before you know if the app is worth running doesn’t make sense anymore. Neon has a generous free tier with no card required.

**Scales to zero**. A database that runs continuously and bills by the hour is wasteful for many agent-created projects. Neon scales to zero when inactive and wakes on the next connection.

**Postgres.** Agents know Postgres well. They likely have more training data for Postgres than any other database. Using anything else adds unnecessary friction.

Neon’s lakebase architecture with separation of storage and compute built these requirements in at the foundation, making it perfect for the new era of agent-provisioned services.

## Try it

To try it out, [sign up at projects.dev](https://projects.dev), install the Stripe CLI, authenticate with `stripe login`, then:

```bash
stripe projects init my-app
stripe projects add neon
```

If you’re building agent-assisted workflows or just want a faster path from local code to a real Postgres database, we’d like to hear what you think. Share feedback in the [Neon Discord](https://neon.tech/discord) or reach out on X.
