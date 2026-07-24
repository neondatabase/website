---
title: 'Just Launched: Neon Is Now a Kiro Power'
description: >-
  Kiro developers can now create, branch, and restore Postgres databases
  instantly from the IDE
excerpt: >-
  Kiro just announced powers at re:Invent, a new way for developers to access a
  curated set of tools (each packaged with domain knowledge and best practices)
  directly from the IDE. Neon is one of the first launch partners, alongside
  companies like Figma, Stripe, Supabase, Postman,...
date: '2025-12-03T17:52:39'
updatedOn: '2025-12-04T17:05:45'
category: product
categories:
  - product
authors:
  - carlota-soto
  - krishna-b-parab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/just-launched-neon-is-now-a-kiro-power/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'Just Launched: Neon Is Now a Kiro Power - Neon'
  description: >-
    Kiro adds Neon as a new power. Developers can deploy instant Postgres, dev
    environments, and time-travel workflows directly inside the IDE.
  keywords: []
  noindex: false
  ogTitle: 'Just Launched: Neon Is Now a Kiro Power - Neon'
  ogDescription: >-
    Kiro adds Neon as a new power. Developers can deploy instant Postgres, dev
    environments, and time-travel workflows directly inside the IDE.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/just-launched-neon-is-now-a-kiro-power/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/just-launched-neon-is-now-a-kiro-power/neon-kiro-1024x576-9295713e.jpg)

[Kiro](https://kiro.dev/) **just announced [powers](https://kiro.dev/powers) at re:Invent, a new way for developers to access a curated set of tools (each packaged with domain knowledge and best practices) directly from the IDE.** [Neon](https://neon.com/) is one of the first launch partners, alongside companies like Figma, Stripe, Supabase, Postman, and many others.

<video autoPlay playsInline muted loop width="1184" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/just-launched-neon-is-now-a-kiro-power/kiro-power-c54dc2a4.mp4" />
</video>

You can already start using the new Neon power to deploy Postgres databases instantly, branch them to create lightweight environments that mirror production, use these environments to run migrations and tests in isolated environments, and even time-travel to past states – all without leaving the editor.

## Kiro Helps You Go From Prototype to Prod

If you haven’t tried [Kiro](https://kiro.dev/), it enables agentic AI development from prototype to production. The core philosophy behind Kiro is simple: AI should help you build real software, not just write isolated pieces of code.

Kiro’s IDE is designed with developers in mind. For example: instead of acting as a simple autocomplete or chat assistant, Kiro focuses on spec-driven development, generating requirements, plans, designs, and tasks apart from code. This is all delivered in a VS Code-style interface:

<video autoPlay muted loop width="1802" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/just-launched-neon-is-now-a-kiro-power/kiro-dev-c55ff1a2.mp4" />
</video>

Together with other developer-friendly features (e.g. a highly-interactive [CLI](https://kiro.dev/cli/)), Kiro comes with [agent hooks](https://kiro.dev/docs/hooks/) that trigger on events and autonomously execute in the background based on pre-defined prompts defined by you.

![Image](https://cdn.neonapi.io/public/images/pages/blog/just-launched-neon-is-now-a-kiro-power/image-24-1024x600-83dd2882.png)

And since today, there’s a new addition to the Kiro tool stack: **Kiro powers**.

## Powers Now Give Kiro Specialized Skills Across the Stack

<EmbedTweet url="https://twitter.com/kirodotdev/status/1996248122146599083?ref_src=twsrc%5Etfw" />

[powers](https://kiro.dev/powers) extend Kiro’s core motto (enabling developers to use AI to build real apps) by giving agents specialized capabilities on demand across the entire software stack. **A power is a packaged set of expert-created artifacts (MCP servers, steering files, and hooks) bundled around a specific domain such as backend development, UI, deployment, observability, or API design.**

So, instead of simply relying on generic agents and overloading them with documentation (or constantly correcting them through chat), powers let Kiro load the exact tool access and domain knowledge needed for a specific task directly inside the IDE. This solves several key problems that make real development tricky in other AI IDEs:

- Generic agents lack deep workflow knowledge (e.g., how to safely run a migration)
- Overloading an agent with documentation causes confusion, hallucinations, and inefficiency
- Creating a separate specialized agent for each workflow leads to agent proliferation and overhead

Powers solve these issues by dynamically loading only the context required. Each power is designed in collaboration with the domain and dev tool experts (e.g. the Neon team) so the power already bundles everything the agent needs to perform a workflow end to end safely, efficiently, and without context overload.

## The Neon Power: More Than a Database, An Environment for Your Development Workflows

AI IDEs have become incredibly fast at generating code, but the workflows around that code haven’t kept pace. If we want an IDE that helps us ship to production, it still needs to know how to provision databases, manage test data, validate migrations safely, reproduce bugs, and keep their environments in sync as they iterate. This is exactly why Neon is such a natural fit as a Kiro power.

[Neon](https://neon.com/) is a serverless Postgres platform built for the way modern developers work. Neon databases can be created instantly, scaled automatically, and maintained without any operational overhead. But the real unlock for Kiro is [Neon’s branching model:](https://neon.com/branching) the ability to clone a database (schema + data) in seconds, creating lightweight environments in one click that perfectly resemble production so Kiro can

- spin up isolated test environments on demand
- validate migrations without touching production
- reproduce bugs quickly and safely
- test code against realistic data
- and even roll the database back to a previous point in time

**Using Neon via Kiro, developers not only can add a serverless Postgres to their app, but they also make the database (historically the most fragile piece of the stack) something the IDE can actively manipulate and automate, without leaving the editor.**

A few examples of workflows you can run right away:

### Deploy a Postgres database instantly, without leaving Kiro

Whenever a Kiro workflow needs a Postgres backend, Kiro can provision a Neon database in seconds. This is possible because Neon is built on a [serverless](https://neon.com/docs/get-started/why-neon#neon-is-serverless) architecture with [fully separated storage and compute](https://neon.com/blog/architecture-decisions-in-neon). Databases don’t require warm-up time, sizing, or manual provisioning. Instead, compute starts instantly when needed, [scales up and down automatically](https://neon.com/docs/introduction/autoscaling) during active development, and [scales to zero](https://neon.com/docs/introduction/scale-to-zero) (autosuspends) when idle, all without any configuration or resource planning.

### Spin up ephemeral environments for development and testing

A Neon [branch](https://neon.com/docs/introduction/branching) is an instant, lightweight, isolated copy of your database (schema + data) that developers (and Kiro!) can deploy as a safe workspace. Branches are powered by [Neon’s copy-on-write storage engine](https://neon.com/storage), which means they don’t duplicate your database’s data. Instead, [they reference the same underlying pages and only store differences as changes occur](https://neon.com/blog/get-page-at-lsn). This design also makes branches:

- [instant to create and delete](https://neon.com/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) (no infrastructure to deploy),
- very cost-efficient (no full data copies, scale-to-zero),
- safe to experiment on (they have their own compute), and
- ideal for programmatic workflows driven by an IDE or agent

For example, you can ask Kiro to create a Neon branch to:

- try a schema change
- test a migration
- generate or validate queries
- test backend logic
- run integration tests
- explore data without risk

When the workflow is done, you can ask Kiro to simply discard the branch.

### Time-travel through your data and restores your DB without waiting

Neon’s storage architecture [keeps a complete history](https://x.com/neondatabase/status/1989049565996282334?s=20) of every WAL record and every page version, stored in a unified log-structured system. This enables a magical workflow: since storage is fully separated from compute, [Neon can instantly spin up a new branch (with its own compute endpoint) at any past point in time](https://neon.com/docs/guides/time-travel-assist) without copying data or replaying everything from scratch.

This makes database restores instant: if for whatever reason you forget to test on a branch and a spicy change makes its way to production, you can revert it quickly using Neon’s [instant restores](https://neon.com/docs/introduction/branch-restore). But this is also useful beyond restores – you can use this time-travel capability to inspect past data or recreate environments from a past state. For example, you can ask Kiro things like:

- “Roll this database back 5 minutes”
- “Restore this branch to yesterday’s state”
- “Test against the schema as it existed last week”

## Try It Yourself (for Free)

[Kiro](https://kiro.dev/)’s mission is to help developers move from development to production as quickly and safely as possible. [powers](https://kiro.dev/powers) make that possible by bringing the right tools and the right expertise directly into the IDE. And with the Neon Power, you can now bring that same DX speed to your database layer, deploying instant Postgres environments, running safe branching workflows, and restoring past states in seconds.
