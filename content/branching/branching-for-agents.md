---
title: 'Branching workflows for agents & platforms'
subtitle: 'Learn how to use branching in your agents or platforms. Manage databases per user or app and build versioning with snapshots that keep code and database state in sync'
updatedOn: '2026-01-22T00:00:00.000Z'
---

Full-stack agentic platforms, codegen tools, CMS builders, and internal developer platforms need to provision databases per user, per app, or per version. Branching and snapshots are the primitives Neon users rely on to make this practical.

## Database per user / branch per app

Many platforms give each user or application its own database environment. With Neon, this often looks like this:

- [Project](https://neon.com/docs/manage/projects) per user or app, where each customer or generated application gets its own Neon project  
- [Branch](https://neon.com/docs/introduction/branching) per version or per app, where multiple environments live inside a single project

Neon supports a project-per-user model at large scale. Platforms can manage tens of thousands ( in some cases, millions) of projects programmatically through the Neon API. Project creation, configuration, and cleanup are fully automated, and because Neon resources are ephemeral by design, idle databases don’t incur ongoing compute overhead.This makes it practical to provision databases dynamically, without pre-allocating infrastructure or running a large fleet of idle Postgres instances.

Within a project, branching and snapshots provide the foundation for environments and versioning:

- Branches are used to represent active environments or working copies  
- Snapshots capture precise versions of schema and data  
- Restores allow platforms to move between versions instantly

## Snapshots as checkpoints (version history)

Full-stack codegen platforms often include [versioning features](https://neon.com/docs/ai/ai-database-versioning) so their end-users can jump between different versions of their code. But rolling back code alone isn’t enough \- if the database doesn’t match the code version, users end up with broken queries, failed migrations, or inconsistent state.

To solve this, agent platforms build a checkpoint system on top of Neon snapshots. The idea is simple:  
 every meaningful change creates a restorable database version. A typical setup looks like this:

1. **The agent modifies the application.**  Each prompt can change both the app code and the underlying Postgres schema or data.  
2. **A snapshot is created after each change.** After the agent applies a change, the platform creates a Neon snapshot of the current branch. This snapshot captures the *exact* schema and data at that moment.  
3. **Checkpoint metadata is recorded.** The snapshot ID is stored alongside version metadata (for example, in a separate “meta” database that tracks the timeline of versions).  
4. **Users jump between versions.**  When a user selects a previous version:  
   - The platform looks up the snapshot ID for that version  
   - Neon restores that snapshot onto the target branch (often the production branch)  
   - The database instantly returns to the exact state that version was built against

Neon’s architecture makes this workflow possible because:

- Snapshots are logical and instant.  They reference existing data using copy-on-write storage instead of copying files.  
- Restores preserve endpoints. The branch endpoint stays the same; active connections are briefly dropped and automatically re-established.  
- Everything is API-driven. Creating snapshots, restoring them, and managing branches can all be wired directly into an agent’s control loop.
