---
title: How to integrate with Neon - Guide for agentic platforms
subtitle: Learn how to integrate Neon's database checkpointing and rollback features into your agentic platform
enableTableOfContents: true
updatedOn: 'May 11, 2025'
---

# How to integrate with Neon: Guide for agentic platforms

This guide is for SaaS platforms that use agents to help developers build applications. It explains how to integrate with Neon to support database checkpointing and rollback using the **Active Branch Pattern**. The guide assumes the availability of Neon APIs for creating, deleting, and restoring snapshots. It is written to be both human- and AI-readable.

---

## Overview

Agentic platforms generate or iterate on code and need to manage evolving database state. Neon's branching and snapshot features are ideal for this use case. By integrating with Neon:

- Every user session or agent project gets a Neon **project**.
- One branch is treated as the **active** branch. This branch never changes its connection string.
- **Snapshots** are used to checkpoint state.
- **Preview branches** are created from snapshots without modifying the active branch.
- **Rollback or roll-forward** is done by restoring a snapshot to the active branch.

This guide provides step-by-step instructions and API usage examples to help platforms integrate Neon into agentic workflows.

---

## The Active Branch Pattern

Each agent project maps to a Neon project with a main development branch, called the **active branch**. This branch is:

- The one the agent reads from and writes to.
- Never deleted or renamed.
- Reused across user sessions.
- A fixed connection string consumers can rely on.

> ⚠️ Do not delete the active branch. Instead, restore snapshots into it to revert or advance its state.

---

## Creating Checkpoints

To create a checkpoint, use the following API to create a snapshot:

```
POST /projects/{project_id}/branches/{branch_id}/snapshots
```

This captures the current state of the branch. Each snapshot is immutable and read-only.

**Snapshot creation notes:**
- Only incremental changes are stored, reducing storage costs.
- You can query snapshots, but they cannot be modified unless restored.

---

## Previewing a Checkpoint

To preview the database state at a checkpoint without modifying the active branch, restore the snapshot to a temporary branch:

```
POST /projects/{project_id}/snapshots/{snapshot_id}/restore
```

Request body:

```json
{
  "restore_to_new_branch": true,
  "branch_name": "preview-branch",
  "ttl_seconds": 3600
}
```

Use the returned connection string to point your preview application or queries to the new branch.

**Best practices:**
- Set a TTL to automatically clean up unused preview branches.
- Label the preview branch clearly for tracking.

---

## Rolling Back or Forward

To restore the active branch to a previous (or future) snapshot:

```
POST /projects/{project_id}/snapshots/{snapshot_id}/restore
```

Request body:

```json
{
  "restore_to_existing_branch": "dev"
}
```

This operation resets the active branch's contents to match the snapshot, keeping its connection string intact.

> ⚠️ Any changes made after the snapshot will be lost unless a new snapshot is created before the restore.

---

## Cleaning Up Snapshots

Delete unused snapshots to reduce fixed costs:

```
DELETE /projects/{project_id}/snapshots/{snapshot_id}
```

Notes:
- Deleting a snapshot removes the flat fee.
- If other snapshots depend on it, storage usage may not decrease.

---

## Choosing an Integration Model

### Embedded Neon

In this model, the agentic platform creates Neon resources on behalf of users:

- Projects and branches are created via API.
- Users do not need a Neon account.

**Pros:**
- Seamless experience
- More control over project lifecycle

**Examples:** Replit, Create.xyz

### Bring Your Own Neon (BYON)

In this model, users connect their Neon accounts to your platform via OAuth:

- The user owns and pays for their Neon project.
- The agent interacts with Neon on the user's behalf.

**Pros:**
- Greater flexibility
- Easy support for multi-provider strategies

**Examples:** v0, Same.new

---

## Diagram: The Active Branch Pattern

![Agent Checkpoints Diagram](/docs/images/agent_checkpoints.png)

The diagram illustrates the Active Branch Pattern workflow:
1. Agent sessions create snapshots as checkpoints
2. Users can preview a checkpoint by creating a temporary branch from a snapshot
3. Users can roll back to a previous checkpoint by restoring the active branch from a snapshot
4. The active branch maintains a consistent connection string throughout the process

---

## Summary

By integrating with Neon, agentic platforms can:

- Maintain consistent database state across agent sessions
- Offer snapshot-based previews and rollbacks
- Keep database workflows reliable and cost-efficient

Need help or want to partner with us? Contact [partners@neon.tech](mailto:partners@neon.tech).

---

## API Summary

| Operation            | Endpoint                                                           | Notes                                       |
|----------------------|--------------------------------------------------------------------|---------------------------------------------|
| Create snapshot      | POST /projects/{project_id}/branches/{branch_id}/snapshots         | Checkpoint current branch state             |
| Restore to preview   | POST /projects/{project_id}/snapshots/{snapshot_id}/restore        | Use restore_to_new_branch: true             |
| Restore to active    | POST /projects/{project_id}/snapshots/{snapshot_id}/restore        | Use restore_to_existing_branch: \"dev\"     |
| Delete snapshot      | DELETE /projects/{project_id}/snapshots/{snapshot_id}              | Optional cleanup to reduce flat costs       |
