---
title: The Hidden Ops Layer of Agent Platforms
description: Design patterns for database-driven agent systems. From the Anything team
excerpt: >-
  Agents aren’t just LLMs; they’re distributed systems that write and execute
  real code. The moment you give an AI the ability to run SQL migrations, you’ve
  entered the world of DevOps. You’ve probably seen plenty of full-stack agent
  demos at this point, starting with a prompt like...
date: '2025-11-04T18:48:25'
updatedOn: '2025-11-04T18:48:38'
category: community
categories:
  - community
  - product
authors:
  - marcus-lowe
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-hidden-ops-layer-of-agent-platforms/cover.jpg
  alt: null
isFeatured: true
seo:
  title: The Hidden Ops Layer of Agent Platforms - Neon
  description: >-
    Learn how Anything built the hidden ops layer behind its Max agent,
    prioritizing isolation, scalability, and efficiency.
  keywords: []
  noindex: false
  ogTitle: The Hidden Ops Layer of Agent Platforms - Neon
  ogDescription: >-
    Learn how Anything built the hidden ops layer behind its Max agent,
    prioritizing isolation, scalability, and efficiency.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-hidden-ops-layer-of-agent-platforms/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-hidden-ops-layer-of-agent-platforms/neon-hidden-layer-1024x576-3495f78c.jpg)

<Admonition type="tip" title="Agent Builders x Neon">
This post was created in collaboration with [Anything](https://www.createanything.com/) as part of our Agent Builders series, where agent platform teams share how they built, scaled, and refined their systems.
</Admonition>

**Agents aren’t just LLMs; they’re distributed systems that write and execute real code. The moment you give an AI the ability to run SQL migrations, you’ve entered the world of DevOps.**

You’ve probably seen plenty of full-stack agent demos at this point, starting with a prompt like “build me a task tracker,” and seconds later, the agent is scaffolding your backend, writing migrations, and deploying code.

Behind the scenes, there’s a lot of invisible machinery making that moment possible: database isolation, cleanup routines, and safety nets that prevent hundreds of parallel agents from breaking each other’s work.

At [Anything](https://www.createanything.com/), our [Max agent](https://www.createanything.com/blog/anything-max) (an autonomous software engineer) builds and updates real applications in production. It writes and executes SQL migrations, modifies schemas, and tests queries, all without a human in the loop.

To make that safe, we had to build what we now call “the hidden ops layer”: a system that ensures every agent runs in total isolation, can safely merge its results, and cleans up after itself. It’s the difference between a cool demo and production reliability.

In this post, we’ll walk through some of the patterns that have worked for us.

## Per-Agent Database Layer

When an AI agent starts writing code that touches your database, isolation stops being optional. You can’t have multiple agents editing schemas, creating tables, or running migrations on the same database and expect things to stay stable.

Our approach is simple: every agent session gets its own [Neon branch](https://neon.com/docs/introduction/branching), a fully isolated copy of our development environment. When a user starts working with Max, we immediately create a branch with a name like `branch-for-revision-abc123`. It’s a complete clone of the development branch: same schema, same data, but entirely sandboxed.

From there, the agent can do whatever it needs. It writes migrations, creates tables, modifies schemas, and tests SQL queries, all without risking the main branch. If something breaks, it only breaks on that branch.

The lifecycle looks like this:

1. **Create:** when the agent starts, we call Neon’s API to create a new branch from development. It takes about 200 milliseconds.
2. **Work:** the agent applies its migrations to the isolated branch – sometimes one migration, sometimes twenty. Nobody else sees them.
3. **Merge:** when the agent finishes successfully, we use Neon’s [restore branch API](https://neon.com/docs/introduction/branch-restore) to merge the agent branch back into development. It’s atomic, all or nothing.
4. **Cleanup:** once merged, we delete the branch.

We let users run up to four agents in parallel, which means four different Neon branches active at once, all making schema changes simultaneously (more about this in a minute).

## Schema Changes at Machine Speed

Once every agent has its own isolated branch, the next challenge is teaching it to evolve the schema safely without supervision.

Because Max doesn’t just use the database, it _changes_ it. When a user asks for a new feature (“Add a todos table with title and completed fields”), the agent writes SQL migrations on its own. If the migration is valid, it runs instantly on the agent’s Neon branch. If it fails, that’s where the next layer of automation comes in.

We built a “Migration Fixer”, a separate LLM call that takes the broken SQL, the error message, and the current schema, and attempts to fix the problem automatically. We retry up to three times. Most issues get resolved by the first or second attempt. If the migration still fails after retries, we show the error to the user and roll back:

1. **Generate:** agent writes a migration based on the user prompt.
2. **Apply:** Run it on the isolated Neon branch.
3. **Auto-fix:** On failure, call the Migration Fixer and retry up to three times.
4. **Merge or rollback:**
   - If all migrations succeed, use the Neon restore API to merge the agent branch into development atomically, then delete the branch.
   - If not, delete the branch and roll back development to its previous state.

Each agent works in isolation, so we never see conflicts while migrations are running. When merging, if the development schema changed since the agent started, we simply fail the merge and ask the user to retry.

## The Zombie Branch Incident (or Why It’s Important to Close the Loop)

This pattern based on branching has been the single biggest unlock for reliability, but this doesn’t mean some maintenance is not needed. A month after launching Max, we learned an important lesson the hard way.

One morning, we opened our Neon dashboard and saw 2,847 branches for a single database, when it should’ve shown two: production and development. Yikes.

Every branch had a name like `branch-for-revision-abc123`. We realized these were agent branches that never got cleaned up.

When an agent session ends (either successfully or because of a timeout), our cleanup code is supposed to delete its branch. But if the crash happens at the wrong moment, that delete call never runs. Over three weeks, those “zombie branches” just kept piling up.

We debugged it by querying our own database for agent branches older than 24 hours, then cross-checking those with Neon’s API to confirm which ones still existed. Sure enough, hundreds were orphaned.

The fix was straightforward once we saw the pattern:

- A background job runs every 6 hours.
- It queries our database for agent branches older than 24 hours.
- For each one, it calls the Neon delete API and removes the record locally.

[We also added an expires_at timestamp so Neon auto-deletes branches after 24 hours, even if our cleanup fails.](https://neon.com/docs/guides/branch-expiration)

**Lesson learned: always set expiration times on ephemeral resources like branches. Cleanup code can fail silently, and in distributed systems, it eventually will.**

## Performance and Autoscaling for Parallel Agents

Once branching and cleanup were stable, the next challenge was performance. Each agent doesn’t just need a database – it needs multiple active connections to run queries, introspect schemas, and test migrations in real time.

In our setup, every agent session uses two connections: one to its isolated branch and one to the main development branch. With four parallel agents, that’s eight active connections right away. Add background jobs (two or three) and the API server pool (around ten to twenty connections), and we typically see about thirty concurrent connections at peak.

Neon’s built-in [connection pooler](https://neon.com/docs/connect/connection-pooling) was a big help here. It keeps connections warm across branches and automatically scales compute based on load. Each branch can scale from 0.25 compute units when idle to 1 CU under load, and scales back down when work completes.

This elasticity is critical for our workload pattern. Agent activity is bursty: heavy compute for a few minutes, then idle until the next request. Plus, most of the agent queries are lightweight – schema introspection, column lookups, and validation queries. Heavier operations like creating indexes or running migration tests happen on isolated branches, so they never block production.

This was the winning combination for us to get predictable performance: connection pooling + autoscaling + isolation.

## API-Driven Infrastructure

The last piece that ties everything together is automation. Our entire infrastructure runs through APIs. The ability to treat databases as programmable resources has been transformative for building our platform.

When a user starts a session, our system calls `POST /branches` to create an isolated environment. When the agent completes its task, we use the restore endpoint to merge the branch atomically, then call delete to clean it up.

This API-first model is what makes it possible to spin up and tear down so many database environments per day without a single manual step. It also means we can test, log, and retry any failed calls like any other piece of application logic.

## Real-World Setup

For anyone designing similar agent infrastructure, here’s a quick reference from our setup.

### Database setup per user

- 1 Neon project
- 2 permanent branches (_production_ + _development_)
- Up to 4 temporary agent branches
- Autoscaling from 0.25 → 1 compute unit per branch
- 10-100 GB of storage depending on plan

### Per agent session

- 1 branch created
- 1-20 migrations applied
- Up to 3 auto-fix attempts
- 1 merge, 1 deletion
- Roughly 5–10 Neon API calls total

### Cleanup job

- Runs every 6 hours
- Deletes agent branches older than 24 hours
- Typically finds 5-15 stale branches per run

## Closing Thoughts

**Building reliable agent infrastructure is more about systems design than prompt engineering.** Once your agents can write and execute real code, you need the same safeguards that human engineers rely on.

Our approach centers on a few core ideas:

- **Isolate everything.** Give every agent its own workspace so experiments can’t break each other.
- **Validate migrations automatically.** Let the AI fix what it breaks, but never merge blindly.
- **Design for cleanup failures.** Expiration logic is your friend; orphaned resources are inevitable.
- **Treat databases as programmable resources.** Build, merge, and destroy them like code.
- **Let compute scale with demand.** Agents work in bursts, your infrastructure should too.

That design has let us move fast without losing stability. The “hidden ops layer” may never be visible to users, but it’s what keeps our system dependable at scale.

<Admonition type="note" title="Build Anything">
Turn ideas into full-stack apps with an AI team that codes, tests, and ships for you. Try it now at [createanything.com](https://createanything.com).
</Admonition>

<Admonition type="important" title="Apply to the Neon Agent Plan">
If you're building your own agent platform and need a backend, [take a look at Neon's Agent Plan.](https://neon.com/use-cases/ai-agents) Get special pricing, resource limits, and assistance to get your platform up and running.
</Admonition>
