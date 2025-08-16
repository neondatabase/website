---
title: Using Snapshots as checkpoints
subtitle: Implementing AI agent checkpoints with Neon snapshots
enableTableOfContents: true
updatedOn: '2025-08-12T14:09:12.290Z'
---

<ComingSoon/>

## Overview

This guide is for platforms building AI agents and code generation tools. It explains how to implement database checkpointing using Neon's Snapshot API an active branch pattern, which maintains a persistent root branch for production while using snapshots for checkpoints and temporary branches for previews. See a working implementation in the [demonstration repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo).

This pattern works whether you manage Neon projects for your users (embedded approach) or users bring their own Neon accounts.

<Admonition type="tip" title="Quick guide">
Use one root branch as your persistent "active" branch with a stable connection string. Create snapshots for checkpoints. For rollbacks, restore them with `finalize_restore: true` and `target_branch_id` set to your root branch ID, then poll operations until complete before connecting. For previews, use `finalize_restore: false` to create temporary branches.
</Admonition>

## Quick start with the demo

The best way to understand this pattern is to see it in action:

1. **Clone the demo**:
   - `git clone` https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo
2. **Key files to examine**:
   - [lib/neon/create-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/create-snapshot.ts) - Snapshot creation implementation
   - [lib/neon/apply-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/apply-snapshot.ts) - Complete restore workflow with operations polling
   - [lib/neon/operations.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/operations.ts) - Operation status polling logic
   - [app/[checkpointId]/page.tsx](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/app/[checkpointId]/page.tsx) - UI integration showing checkpoints and rollbacks
3. **Run locally** to see checkpoints, rollbacks, and previews in action

The demo implements a contacts application that evolves through agent prompts (v1: basic contacts → v2: add role/company → v3: add tags), demonstrating checkpoint creation and restoration at each stage.

## Core pattern: active branches

Every agent project maps to one Neon project with a persistent "active" branch as its production database:

**The active branch:**

- Gets its data replaced during rollbacks (but keeps the same connection string)
- Maintains a permanent connection string that never changes
- Must be a root branch (no parent) for snapshot restores to work properly

**The snapshots:**

- Capture point-in-time states of the active branch
- Store only incremental changes (cost-efficient)
- Can be deleted in any order (no dependencies)
- Can be restored to the active branch or to a temporary preview branch

```text
PROJECT LAYOUT
──────────────
PERSISTENT:
  main (active) ──→ postgresql://stable/db  [never changes]

CHECKPOINTS:
  📸 snapshot-1  ┐
  📸 snapshot-2  ├─→ Can restore to main or new branch
  📸 snapshot-3  ┘

TEMPORARY:
  preview-*     ──→ postgresql://temp/db    [test branches]
  main (old)    ──→ postgresql://orphan/db  [cleanup needed]
```

## Implementation

### Creating checkpoints

Create a snapshot to capture the current database state using the [snapshot endpoint](https://api-docs.neon.tech/reference/createsnapshot):

```bash
POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot
```

> **Demo implementation:** See `lib/neon/create-snapshot.ts` for a complete example with error handling and operation polling.

**Path parameters:**

- `project_id` (string, required): The Neon project ID
- `branch_id` (string, required): The branch ID

**Query parameters:**

- `lsn` (string): Target Log Sequence Number. Cannot be used with `timestamp`
- `timestamp` (string): Target timestamp (RFC 3339). Cannot be used with `lsn`
- `name` (string): Name for the snapshot
- `expires_at` (string): Auto-deletion time (RFC 3339)

**Example:**

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/snapshot?name=checkpoint-session-1&expires_at=2025-08-13T00:00:00Z' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

**When to create snapshots:**

- Start of each agent session
- Before database schema changes
- After successful operations
- User-initiated save points

### Restoring checkpoints

Restore any snapshot to the active branch using the [restore endpoint](https://api-docs.neon.tech/reference/restoresnapshot):

```bash
POST /api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore
```

> **Demo implementation:** See `lib/neon/apply-snapshot.ts` for the complete restore workflow including operation polling and error handling.

**Path parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID

**Body parameters:**

- `name` (string): A name for the newly restored branch. If omitted, a default name will be generated
- `target_branch_id` (string): The ID of the branch to restore the snapshot into. If not specified, the branch from which the snapshot was originally created will be used. **Set to your root branch ID for rollbacks to preserve connection strings**
- `finalize_restore` (boolean): Set to `true` to finalize the restore operation immediately. This will complete the restore and move any associated computes to the new branch. Defaults to `false`. **Set to `true` when restoring to the active branch for rollbacks, `false` for preview branches**

<Admonition type="warning" title="Connection Warning">
Do not connect to the database until all operations complete. Any connection attempt before operations finish will connect to the old database state, not your restored snapshot.
</Admonition>

#### Restore workflow

```json
{
  "target_branch_id": "br-active-branch-123456", // Your root branch ID
  "finalize_restore": true // Moves computes and preserves connection string
}
```

> This shows a rollback to the active branch. To create a preview branch instead, you would omit `target_branch_id` and set `finalize_restore: false`.

**Important:** When restoring with `finalize_restore: true`, your previous active branch becomes a backup branch named `production (old)` or similar. This backup branch preserves your pre-restore state but should be deleted during cleanup to avoid unnecessary costs.

After calling the restore API:

1. Extract operation IDs from the response (may be empty array)
2. Poll the operation status until it reaches a terminal state
3. **Do not connect yet** - database still points to old state
4. Only after all operations complete can you connect to the restored snapshot

> See the [poll operation status](docs/manage/operations#poll-operation-status) documentation for related information.

**Polling operations:**

```javascript
// Pseudo-code for polling operations
function waitForOperation(operationId) {
  while (true) {
    status = getOperationStatus(operationId)  // GET /projects/{project_id}/operations/{operationId}

    // Terminal states - safe to proceed
    if (['finished', 'skipped', 'cancelled'].includes(status)) return

    // Error state - handle appropriately
    if (status === 'failed') throw error

    sleep(5 seconds)
  }
}

// After restore API call
operationIds = restoreResponse.operations.map(op => op.id)
if (operationIds.length > 0) {
  operationIds.forEach(id => waitForOperation(id))
}
// NOW safe to connect
```

```text
POLLING SEQUENCE
────────────────
restore_api()
    ↓
[operations?]──No──→ ✓ Connect
    ↓Yes
poll_status()
    ↓
[running]──Wait──┐
    ↓            ↑
[finished]───────┘
    ↓
✓ Connect

States: running|scheduling → WAIT
        finished|skipped|cancelled → SAFE
        failed → ERROR
```

**Common restore errors:**

- **Connection to old state**: Ensure all operations completed
- **Target branch not found**: Verify branch exists
- **Operation timeout**: Retry with longer timeout
- **Accumulating backup branches**: Delete old backup branches (e.g., `production (old)`) after successful restore verification

#### Preview environments

Create a temporary branch to preview a checkpoint without affecting the active branch:

```json
{
  "name": "preview-checkpoint-123",
  "finalize_restore": false // Creates new branch for preview without moving computes
}
```

This creates a new branch with its own connection string for preview. The active branch remains unchanged.

### Managing checkpoints

#### List available checkpoints

Get all snapshots with IDs, names, and timestamps using the [list snapshots endpoint](https://api-docs.neon.tech/reference/listsnapshots):

```bash
GET /api/v2/projects/{project_id}/snapshots
```

**Path Parameters:**

- `project_id` (string, required): The Neon project ID

#### Delete checkpoint

Remove a snapshot using the [delete endpoint](https://api-docs.neon.tech/reference/deletesnapshot):

```bash
DELETE /api/v2/projects/{project_id}/snapshots/{snapshot_id}
```

**Path parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID

#### Update checkpoint name

Rename a snapshot using the [update endpoint](https://api-docs.neon.tech/reference/updatesnapshot):

```bash
PATCH /api/v2/projects/{project_id}/snapshots/{snapshot_id}
```

**Path parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID

**Body:**

```json
{
  "snapshot": {
    "name": "important-milestone"
  }
}
```

#### Cleanup strategy

Proper cleanup reduces costs and keeps your project manageable:

- Delete snapshots when no longer reachable by users
- Unlike branches, snapshots can be deleted in any order without dependency issues
- Delete backup branches created during restores (named like `production (old)`)
- These backup branches accumulate with each restore and consume storage
- Reduces snapshot management fees while shared storage remains
- Set `expires_at` for automatic cleanup or delete manually as needed
- Consider removing snapshots after merging features or completing rollback testing

## Why snapshots for checkpoints

Neon offers two key primitives that could be used for checkpointing:

**Branches** are designed for:

- Development environments that need isolation
- Testing features before production
- Preview deployments with their own connection strings
- Scenarios where you need a live, modifiable database

**Snapshots** are designed for:

- Point-in-time recovery
- Creating restore points before risky operations
- Maintaining a history of database states
- Scenarios where you need immutable checkpoints

### Why snapshots work better for agent checkpoints

When using branches for checkpoints, you encounter:

- **Dependency chains**: Parent branches cannot be deleted while child branches exist
- **Connection string changes**: Each new branch has a different connection string
- **Complex rollback**: Multiple API calls and connection updates required

Snapshots solve these problems:

- **Independent entities**: Any snapshot can be deleted at any time, in any order
- **Stable connections**: With the active branch pattern, your connection string never changes
- **Simple restore**: Single API call to restore any checkpoint

## Concepts and terminology

### Neon core concepts

- **Project**: Neon project that owns branches, computes, and snapshots
- **Branch**: An isolated database environment with its own data and schema that you can connect to and modify
- **Snapshot**: An immutable, point-in-time backup of a branch's schema and data. Read-only until restored - you can query snapshot data but cannot modify it directly
- **Root branch**: A branch with no parent (typically named `main` or `production`). Required for snapshot restores with `finalize_restore: true`
- **Operations**: Backend operations that return operation IDs you must poll to completion

### Pattern-specific terminology

- **Active branch**: The persistent root branch that maintains your agent's production state. Connection string never changes even when data is replaced via restore. Preview branches may be created alongside for temporary exploration.
- **Backup branch**: Automatically created when restoring with `finalize_restore: true`. The previous active branch becomes `branch-name (old)` and can be safely deleted after verifying the restore.
- **Preview branch**: Temporary branch created from a snapshot for safe exploration, to preview a checkpoint
- **Meta database**: Separate database/table that stores checkpoint metadata (prompt text, `snapshot_id`, etc.). Keeps audit trail across restores

## API quick reference

| Operation                                                                               | Endpoint                                                             |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Create checkpoint](https://api-docs.neon.tech/reference/createsnapshot)                | `POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot`   |
| [Restore checkpoint](https://api-docs.neon.tech/reference/restoresnapshot)              | `POST /api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore` |
| [List checkpoints](https://api-docs.neon.tech/reference/listsnapshots)                  | `GET /api/v2/projects/{project_id}/snapshots`                        |
| [Delete checkpoint](https://api-docs.neon.tech/reference/deletesnapshot)                | `DELETE /api/v2/projects/{project_id}/snapshots/{snapshot_id}`       |
| [Update checkpoint](https://api-docs.neon.tech/reference/updatesnapshot)                | `PATCH /api/v2/projects/{project_id}/snapshots/{snapshot_id}`        |
| [Poll operation](https://api-docs.neon.tech/reference/getprojectoperation)              | `GET /api/v2/projects/{project_id}/operations/{operation_id}`        |
| [List branches](https://api-docs.neon.tech/reference/listprojectbranches) (for cleanup) | `GET /api/v2/projects/{project_id}/branches`                         |

## Quick implementation checklist

- [ ] Create one Neon project per agent project
- [ ] Designate the root branch (main/production) as the "active" branch
- [ ] Store the active branch connection string and branch ID
- [ ] Create snapshots at key points
- [ ] For rollbacks: restore with `finalize_restore: true` and `target_branch_id` set to root branch
- [ ] For previews: restore with `finalize_restore: false` to create temporary branches
- [ ] Poll all operation IDs to terminal states before connecting
- [ ] Set up automatic cleanup with expiration dates
- [ ] Document your restore window policy, when snapshots are set to expire
- [ ] Delete backup branches (e.g., `main (old)`) after successful restores

## Best practices

- **Root branch only**: Use the project's root branch as the active branch
- **Set `target_branch_id` for rollbacks**: When restoring to the active branch, always specify target_branch_id to prevent accidental restores
- **Poll operations**: Wait for terminal states before connecting to the database
- **Snapshot naming**: Use conventions like `checkpoint-{feature}-{timestamp}`
- **Cleanup strategy**: Set `expires_at` on temporary snapshots and preview branches. Delete backup branches (e.g., `production (old)`) created during restores
- **Meta database**: Keep checkpoint metadata separate to preserve audit trail

## Frequenty asked questions

**Q: Why must I poll operations after restore?**  
A: With `finalize_restore: true`, Neon moves compute resources to the new state. Until operations complete, connections still point to the old compute.

**Q: Why must the active branch be a root branch?**  
A: Snapshot restores with `finalize_restore: true` currently require root branches. This is a platform requirement.

**Q: What happens to my active branch when I restore?**  
A: When restoring with `finalize_restore: true`, your current active branch becomes a backup branch with "(old)" appended to its name. This preserves your pre-restore state temporarily, but you should delete it after verifying the restore to avoid storage costs.

**Q: What if we need multiple preview environments?**
A: Restore different snapshots to new branches using `finalize_restore: false`. Each restore creates a new branch with its own connection string.

**Q: What is the restore window?**  
A: The time period during which you can restore, depending on snapshot expiration time. Snapshots outside this window cannot be restored.

## Summary

The active branch pattern with Neon snapshots provides a simple, reliable checkpoint solution for AI agent platforms. By maintaining a persistent root branch for production operations and using snapshots for checkpoints, you get stable connection strings for your main database, instant rollbacks, and the flexibility to create preview branches when needed. The implementation is straightforward: create snapshots, restore with `finalize_restore: true` to the active branch for rollbacks, or with `finalize_restore: false` for preview branches. Always poll operations to completion before connecting. See the [demo repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo) for a complete example.

<NeedHelp />
