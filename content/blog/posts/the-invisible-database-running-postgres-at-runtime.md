---
title: "The Invisible Database: Running Postgres at Runtime"
description: What we’re learning about infra for agents
excerpt: >-
  More and more software will be created by agents, not just code snippets but
  full-stack apps with interfaces, backends, persistence, auth. This means a big
  change in the shape of the devtools and software infrastructure supporting
  these apps. Many systems are now created at runti...
date: "2025-08-04T15:52:32"
updatedOn: "2025-10-02T00:20:44"
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-invisible-database-running-postgres-at-runtime/cover.jpg
  alt: null
isFeatured: false
seo:
  title: "The Invisible Database: Running Postgres at Runtime - Neon"
  description: >-
    We're learning that AI agents are reshaping infrastructure needs - Postgres
    now needs to be provisioned, branched, and scaled at runtime.
  keywords: []
  noindex: false
  ogTitle: "The Invisible Database: Running Postgres at Runtime - Neon"
  ogDescription: >-
    We're learning that AI agents are reshaping infrastructure needs - Postgres
    now needs to be provisioned, branched, and scaled at runtime.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-invisible-database-running-postgres-at-runtime/social.png
---

More and more software will be created by agents, not just code snippets but full-stack apps with interfaces, backends, persistence, auth. This means a big change in the shape of the devtools and software infrastructure supporting these apps. Many systems are now created at runtime, per app, per request, and often discarded minutes later.

## Postgres Usage Is Changing

In agentic systems, infrastructure is created and discarded dynamically as the agent builds, tests, or explores applications. This has direct implications for databases.

A Postgres database is no longer a long-lived, hand-provisioned asset tied to a user or project. Instead, it’s often provisioned per app, session, or exploration path. A few user prompts might result in multiple distinct applications being generated in sequence, and each one may need its own isolated, persistent data layer – but only temporarily.

[Agents are also starting to implement versioning or time-travel features that capture the full application state at multiple moments of time.](https://neon.com/blog/replit-app-history-powered-by-neon-branches) A single app might result in multiple underlying database states being preserved or previewed.

The result is high churn and unpredictable timing for Postgres creation. This is a new pattern of usage.

- Postgres databases are created on demand, often within sub-second latency requirements
- They must be ready to use immediately, without configuration.
- They may exist for minutes or hours, then be discarded or idled
- But they’re also must be ready to scale
- And they may be “duplicated” somehow ( in the case of Neon, branched) during a single agent session to capture the app state at a particular moment in time – supporting previews, comparisons, rollbacks

## What We’re Learning from Supporting Agent Platforms

In [Neon](https://neon.com/), we’ve worked with agent platforms from the beginning. [When Replit launched its coding agent](https://blog.replit.com/introducing-replit-agent?gad_source=1&gad_campaignid=22802716773&gbraid=0AAAAA-k_HqL2sR0irGVh4kAOP01x4fkwq&gclid=CjwKCAjw7fzDBhA7EiwAOqJkh8yYaM55BQ37zheWmGljQJKmIeDAL9uGKwiQRQq1pbUNa6NRPQmpFBoCMQgQAvD_BwE), we were there from day one powering the Postgres layer. Since then, we’ve partnered with many others – from open-source agents to vertical app builders. Across all of them, the pattern is clear – agents need a database that behaves like part of the runtime vs a separate system.

Over and over, agent platforms come to us with the same core needs. Some of these, Neon had already built into its [architecture](https://neon.com/docs/introduction/serverless). Others (like a feature-complete API for quota control) we had to design and build refine in collaboration with early partners.

The pattern is now clear. Here’s what agent builders consistently require when choosing a database:

### Scale without management

The platform must be able to handle many thousands of new databases created per day, with minimal manual oversight, no bottlenecks.

### Provisioning must be instant and invisible to the end user

When a user prompts the agent to build an app, a working database needs to appear behind the scenes in under a second. Third-party login flows add friction and break the user experience.

### Usage must be trackable and enforceable at platform scale

Agent platforms operate at high volume, serving thousands of apps per day. They need fine-grained metrics per database to monitor usage patterns, and crucially, they also need programmatic controls to enforce hard limits – e.g. to align with their pricing plans.

### Databases must pause / resume

Compute must shut off when idle and come back without cold-start delays. It’s not realistic to afford thousands of dormant databases running, but they also can’t accept big lags on resume.

### A path for supporting version control and previews

To build an experience where the user can travel across versions, agents need to capture and restore full database state (schema and data) at specific points in time. Each snapshot must be queryable and safely isolated from production.

### Additional runtime components should follow the same model

As platforms mature, they ask for more integrated building blocks with the same “invisible by default” behavior [. Agents being able to invisibly add auth to their apps](https://neon.com/blog/databutton-neon-integration) is a perfect example.

## Building Infrastructure That Matches How Agents Work

Supporting agents isn’t just about serving a lot of databases: it’s about aligning the database with the way agent platforms actually work. Postgres has always been a powerful tool for application backends, but in an agentic context, it needs to evolve to become part of the runtime – something created, branched, queried, and shut down on the fly.

That’s the shift we’ve made at Neon, and it’s what makes it possible for platforms like Replit to deliver production-grade experiences through AI agents. If you’re building an agent, [explore how Neon can help deliver invisible Postgres to your users.](https://neon.com/use-cases/ai-agents)

| Requirement: infra for agents           | How Neon supports it                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Scale to thousands of databases per day | Serverless architecture with fast control plane, autoscaling, and stateless API |
| Instant, invisible provisioning         | API-driven project creation with sub-second response and usable connection URI  |
| Usage tracking and quota enforcement    | Per-project and per-branch metrics; programmatic quota management via API       |
| Pause/resume compute                    | Automatic scale-to-zero with subsecond cold starts                              |
| Preview and rollback support            | Copy-on-on-write branching engine with instant time travel                      |
| Integrated building blocks              | Neon Auth, Neon Data API                                                        |
| High compatibility                      | 100% Postgres with extensions, standard SQL                                     |
