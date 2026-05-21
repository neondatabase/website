---
title: Build Checkpoints For Your Agent Using Neon Snapshots
description: Your users will be able to jump between app versions as seen in Replit and v0
excerpt: >-
  You can now create Neon snapshots via API. This new capability isn’t just
  useful for backups or disaster recovery, but also serves as a powerful
  building block for one of the most requested features in agentic platforms:
  versioning (or checkpoints). Neon’s snapshots, built on our...
date: '2025-09-16T22:52:22'
updatedOn: '2026-01-02T17:41:04'
category: app-platform
categories:
  - app-platform
  - product
  - ai
authors:
  - andre-landgraf
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/checkpoints-for-agents-with-neon-snapshots/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Build Checkpoints For Your Agent Using Neon Snapshots - Neon
  description: >-
    Build checkpoints into your agent with Neon’s Snapshots API. Restore code,
    schema, and data instantly - just like versioning in Replit or v0.
  keywords: []
  noindex: false
  ogTitle: Build Checkpoints For Your Agent Using Neon Snapshots - Neon
  ogDescription: >-
    Build checkpoints into your agent with Neon’s Snapshots API. Restore code,
    schema, and data instantly - just like versioning in Replit or v0.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/checkpoints-for-agents-with-neon-snapshots/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/checkpoints-for-agents-with-neon-snapshots/neon-snapshots-api-1024x576-c6dedd99.jpg)

You can now [create Neon snapshots via API](https://api-docs.neon.tech/reference/createsnapshot). This new capability isn’t just useful for backups or disaster recovery, but also serves as a [powerful building block for one of the most requested features in agentic platforms: versioning (or checkpoints).](https://neon.com/docs/ai/ai-database-versioning)

Neon’s snapshots, built on our [copy-on-write branching](https://neon.com/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write), make it simple and cost-effective to implement this feature – unlocking a magical user experience for your users. With snapshots, you can give your agents the ability to create checkpoints after each change, so your users can jump between app versions and restore not only the code, but also the exact database schema and data that version was built on.

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>

## The Use Case: Jump Between Versions of Your App

[If you’re building an agentic platform](https://neon.com/use-cases/ai-agents), your users are probably already asking for the ability to go back in time. This is a tremendously useful feature to have when you’re vibe coding: it compensates for potential misunderstandings between you and the agent, and it allows for a lot of iteration – giving you an easy way to compare different versions and roll back to the best one.

![Image](https://cdn.neonapi.io/public/images/pages/blog/checkpoints-for-agents-with-neon-snapshots/image-2-1024x768-90bd2539.png)

With code alone, it’s relatively easy to build a rollback feature: just deploy a previous commit or version of the generated code. But for agent-built apps, the database schema and data often change together with the code, and if you revert the code without also reverting the database, you risk giving your end users a wonky experience with broken queries, failed migrations, and mismatched data that causes more bugs down the line.

The alternative is to build a checkpoint abstraction that also understands database state:

- Every time the agent modifies the app, it also saves a database snapshot.
- Each snapshot represents the exact schema and data at that moment.
- Restoring a snapshot puts the database back into that state, so the code “just works”

## Building Agent Checkpoints with Neon: Step-by-Step

In case you’re not familiar, [Neon](https://neon.com/) is a serverless Postgres database with an architecture that makes it ideal for building a feature like this. At the core is our architecture with decoupled compute and storage, with a [custom storage engine](https://neon.com/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal) built from the ground up. This storage system uses copy-on-write to track changes over time, which means we can reference any previous state of the database without duplicating all the data.

This is perfect for building checkpoints, and **we’ve built a live demo to show exactly how this works:**

[https://snapshots-as-checkpoints-demo.vercel.app/](https://snapshots-as-checkpoints-demo.vercel.app/)

<YoutubeIframe embedId="YmILrzDwRnA" isDocPost={false} />

In this demo,

- An agentic platform is building an app via prompts
- Every prompt affects both the app code and the underlying Postgres database
- After each change, the platform takes a Neon snapshot of the production branch, saving the complete state of the app after each user prompt
- These snapshots are stored alongside metadata in a separate meta database that keeps track of the timeline of checkpoints
- If the end user wants to go back to a previous version, whether to preview it or fully restore it, the platform looks up the associated snapshot ID in the meta database and calls Neon’s [restore snapshot API](https://api-docs.neon.tech/reference/restoresnapshot)
- Neon instantly reverts the production branch to the exact schema and data from that checkpoint, so the rolled-back code runs without broken queries, failed migrations, or mismatched data.

<Admonition type="tip" title="Build your own">
If you’re looking to build something similar, [we’ve prepared a guide that walks you through it step-by-step.](https://neon.com/docs/ai/ai-database-versioning)
</Admonition>

### Under the hood

The guide above explains you everything you need to know to use the snapshots API to build your own versioning feature, but let’s walk you through the basic steps, using our demo code as an example. All the code for the demo lives here:

[https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo)

#### Setting up your databases

The first thing to notice is that the demo references two separate Postgres databases:

- App database: Where your agent-generated app lives. Its schema evolves as the user interacts with it (e.g. adding columns like name, email, role, tags).
- Meta database: This is used to track checkpoints via a checkpoints table, recording the version IDs and associated snapshot IDs.

#### Identifying the production branch

Now that you have your databases identified, it’s time to get familiar with the concept of branches, since they’re the primitive that works behind the snapshots API you’re going to use for your checkpoints.

Differently from other Postgres platforms, Neon is organized in [branches](https://neon.com/docs/introduction/branching). Think of branches living in the same project as [separate environments](https://neon.com/branching) that share the same storage / can be synced together (pretty cool).

For our demo app, we told the system which branch is our production branch, so it can set it up as the root for changes. The file [lib/neon/branches.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/branches.ts) is responsible for identifying the right branch ID via Neon’s API, so you always snapshot or restore against the correct branch reference.

#### Creating the snapshots

Now you can understand better what’s happening after each prompt-driven mutation:

1. The agent modifies the app database schema/data
2. Metadata is recorded in the meta database, e.g. a new row is created in your checkpoints table

The demo then calls the Neon Snapshots API via [lib/neon/create-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/create-snapshot.ts). This is what snapshots the current state of the production branch and returns a snapshot ID, which is stored with the checkpoint metadata

#### Navigating between versions

Once snapshots are set up, what happens when a user jumps to an older version?

1. The app looks up the desired checkpoint in the meta database to get its snapshot_id
2. It calls the lib/neon/branches.ts helper (or Neon’s list-branches API directly) to fetch the current target_branch_id for the branch named “production”
3. It then calls the restore API (lib/neon/apply-snapshot.ts) with finalize_restore: true and target_branch_id: &lt;current production branch id&gt;
4. The response includes operation IDs representing the restore progress
5. lib/neon/operations.ts polls the operations API until all operations reach a terminal state (finished, skipped, or cancelled)
6. After the restore completes, the UI fetches and renders
   - App data from the app database
   - The app UI for that version
   - The updated schema (information_schema.columns)
   - The list of available checkpoints (from the meta DB)

| Key component                                         | Role                                                                              |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| App database                                          | Stores the evolving app schema and data                                           |
| Meta database                                         | Tracks version history and associated `snapshot_id` s                             |
| `lib/neon/branches.ts`                                | Resolves the current ID of the “production” branch (don’t hard-code)              |
| `lib/neon/create-snapshot.ts`                         | Creates a snapshot after each prompt/change                                       |
| `lib/neon/apply-snapshot.ts + lib/neon/operations.ts` | Calls restore with `finalize_restore:true` and polls operations to terminal state |
| UI (Next.js)                                          | Displays the app, schema, and checkpoint timeline; triggers create/restore flows  |
| `lib/contacts.ts`                                     | Schema mutations, CRUD, and schema/data queries for the app DB                    |
| `lib/checkpoints.ts`                                  | Creates/reads checkpoint rows in the meta DB and links them to `snapshot_id`      |

<Admonition type="note" title="On branch identity">
Treat the branch name (“production”) as your stable label and resolve its ID right before each restore. The underlying branch ID may change across restores, so avoid caching it long-term. If your code caches connection metadata tied to a branch ID, refresh it after the restore completes.
</Admonition>

## Build Your Full-Stack Agent Platform on Neon

Neon isn’t just a place to store your app’s data – it’s a version-aware Postgres engine you can control entirely from code.

As we introduced earlier, Neon has a [unique architecture](https://neon.com/blog/architecture-decisions-in-neon) that separates compute (the Postgres process) from storage (our custom engine). This separation enables some capabilities that are rare / flat-out impossible to build with conventional Postgres setups, and that directly enable this snappy versioning experience that remembers database state:

- **Copy-on-write storage.** In Neon, [every database change is stored as a delta](https://neon.com/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal), so we can reference any historical state without making a full duplicate.
- **Instant speed.** Because snapshots are just references to existing data, they can be created and restored without the heavy I/O you’d expect from a backup/restore cycle. The restore process is just as fast and efficient – Neon just swaps the branch pointer to the snapshot’s state.
- **API-first provisioning and control.** Everything in Neon is exposed via API – from creating databases and branches, to controlling compute consumption, to (now!) creating and restoring snapshots. You can wire up this entire checkpointing system into your agent’s workflow without touching a UI.

The [snapshots API](https://api-docs.neon.tech/reference/createsnapshot) makes it simple to build agent features that let users jump between versions of their app. Code rollbacks alone can’t guarantee that – but with Neon, you get schema and data rollbacks as well.

Try the [live demo](https://snapshots-as-checkpoints-demo.vercel.app/) to see how it works. Then, [sign up for Neon](https://console.neon.tech/signup) and start building your agent. We’ve built a step by step guide [here](https://neon.com/docs/ai/ai-database-versioning).

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>
