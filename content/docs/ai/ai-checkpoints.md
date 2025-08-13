---
title: Using Snapshots as checkpoints
subtitle: Implementing AI agent checkpoints with Neon snapshots
enableTableOfContents: true
updatedOn: '2025-08-12T14:09:12.290Z'
---

<ComingSoon/>

## Overview

This guide is for platforms building AI agents and code generation tools (like Replit Agent, v0, Lovable, Create.xyz). It explains how to implement database checkpointing using Neon's Snapshot API with the **active branch pattern** - an approach that avoids the complexity of traditional database branching. See a working implementation in the [demonstration repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo).

This pattern works whether you manage Neon projects for your users (embedded approach like Replit) or users bring their own Neon accounts (BYON approach like v0).

<Admonition type="tip" title="Quick guide">
Use one root branch (main) as your permanent "active" branch with a stable connection string. Create snapshots for checkpoints, restore them with `finalize_restore: true` and `target_branch_id` set to your root branch ID, then poll operations until complete before connecting.
</Admonition>

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
- **Cost-efficient**: Snapshots charge only for volume of changes between checkpoints, matching the checkpoint pattern perfectly

## Concepts and terminology

### Neon core concepts

- **Project**: Neon project that owns branches, computes, and snapshots
- **Branch**: An isolated database environment with its own data and schema that you can connect to and modify
- **Snapshot**: An immutable, point-in-time backup of a branch's schema and data. Read-only until restored - you can query snapshot data but cannot modify it directly
- **Root Branch**: A branch with no parent (typically named `main` or `production`). Required for snapshot restores with `finalize_restore: true`
- **Operations**: Backend operations that return operation IDs you must poll to completion

### Pattern-specific terminology

- **Active branch**: The single root branch your agent always connects to. Connection string never changes
- **Preview branch**: Temporary branch created from a snapshot for safe exploration
- **Meta database**: Separate database/table that stores checkpoint metadata (prompt text, `snapshot_id`, etc.). Keeps audit trail across restores

## Core concept: The active branch pattern

Every agent project maps to one Neon project with a single "active" branch:

**The active branch:**

- Is the only branch the agent ever connects to
- Maintains a permanent connection string that never changes
- Gets its data replaced during rollbacks (but keeps the same connection)
- Must be a root branch (no parent) for snapshot restores to work properly

**The snapshots:**

- Capture point-in-time states of the active branch
- Store only incremental changes (cost-efficient)
- Can be deleted in any order (no dependencies)

<Admonition type="note" title="todo">
**Visual Diagram: Active Branch Pattern Architecture** - Shows one-to-one project mapping, the active branch with permanent connection string, multiple snapshots on a timeline, and preview branches with temporary connection strings
</Admonition>

```text
One Agent Project = One Neon Project:
├── Active Branch (main/root) → postgresql://user@host/db (never changes)
├── Snapshot 1 (checkpoint at t1)
├── Snapshot 2 (checkpoint at t2)
└── Preview Branch (temporary, created from snapshot)
```

## Implementation

### Creating checkpoints

Create a snapshot to capture the current database state using the [snapshot endpoint](https://api-docs.neon.tech/reference/createsnapshot):

```bash
POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot
```

**Path Parameters:**

- `project_id` (string, required): The Neon project ID
- `branch_id` (string, required): The branch ID

**Query Parameters:**

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

**Path Parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID

**Body Parameters:**

- `name` (string): A name for the newly restored branch. If omitted, a default name will be generated
- `target_branch_id` (string): The ID of the branch to restore the snapshot into. If not specified, the branch from which the snapshot was originally created will be used. **Always set to your root branch ID to preserve connection strings**
- `finalize_restore` (boolean): Set to `true` to finalize the restore operation immediately. This will complete the restore and move any associated computes to the new branch. Defaults to `false`. **Always set to `true` for the active branch pattern**

<Admonition type="warning" title="Connection Warning">
Do not connect to the database until all operations complete. Any connection attempt before operations finish will connect to the old database state, not your restored snapshot.
</Admonition>

<Admonition type="note" title="todo">
**Visual Diagram: Rollback/Roll Forward Timeline** - Shows checkpoints on a timeline with the current position, arrows indicating rollback to past and roll forward to future checkpoints, warning zones for data loss, and the connection string remaining constant throughout
</Admonition>

#### Restore workflow

```json
{
  "target_branch_id": "br-active-branch-123456", // Your root branch ID
  "finalize_restore": true // Moves computes and preserves connection string
}
```

After calling the restore API:

1. Extract operation IDs from the response (may be empty array)
2. Poll each operation until it reaches a terminal state
3. **Do not connect yet** - database still points to old state
4. Only after all operations complete can you connect to the restored snapshot

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

<Admonition type="tip" title="Working example">
See `lib/neon/apply-snapshot.ts` and `lib/neon/operations.ts` in the demonstration application at https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo
</Admonition>

<Admonition type="note" title="todo">
**Visual Diagram: Operations Polling Flow** - Flowchart showing restore API call, operations returned, polling loop with state transitions (running → finished/failed), danger zones where connection attempts fail, and the final "safe to connect" state
</Admonition>

**Common restore errors:**

- **Connection to old state**: Ensure all operations completed
- **Target branch not found**: Verify branch exists
- **Operation timeout**: Retry with longer timeout

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

**Path Parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID

#### Update checkpoint name

Rename a snapshot using the [update endpoint](https://api-docs.neon.tech/reference/updatesnapshot):

```bash
PATCH /api/v2/projects/{project_id}/snapshots/{snapshot_id}
```

**Path Parameters:**

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
- Reduces snapshot management fees while shared storage remains
- Set `expires_at` for automatic cleanup or delete manually as needed
- Consider removing snapshots after merging features or completing rollback testing

## API quick reference

| Operation          | Endpoint                                                             |
| ------------------ | -------------------------------------------------------------------- |
| Create checkpoint  | `POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot`   |
| Restore checkpoint | `POST /api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore` |
| List checkpoints   | `GET /api/v2/projects/{project_id}/snapshots`                        |
| Delete checkpoint  | `DELETE /api/v2/projects/{project_id}/snapshots/{snapshot_id}`       |
| Update checkpoint  | `PATCH /api/v2/projects/{project_id}/snapshots/{snapshot_id}`        |
| Poll operation     | `GET /api/v2/projects/{project_id}/operations/{operation_id}`        |

Full documentation: [api-docs.neon.tech](https://api-docs.neon.tech)

## Quick implementation checklist

- [ ] Create one Neon project per agent project
- [ ] Designate the root branch (main/production) as the "active" branch
- [ ] Store the active branch connection string and branch ID
- [ ] Create snapshots at key points
- [ ] Restore with `finalize_restore: true` and `target_branch_id` set
- [ ] Poll all operation IDs to terminal states before connecting
- [ ] Set up automatic cleanup with expiration dates
- [ ] Document your restore window policy, when snapshots are set to expire

## Best practices

- **Root branch only**: Use the project's root branch as the active branch
- **Always set target_branch_id**: Prevents accidental restores to backup branches
- **Poll operations**: Wait for terminal states before connecting to the database
- **Snapshot naming**: Use conventions like `checkpoint-{feature}-{timestamp}`
- **Cleanup strategy**: Set `expires_at` on temporary snapshots and preview branches
- **Meta database**: Keep checkpoint metadata separate to preserve audit trail

## Common questions

**Q: Why must I poll operations after restore?**  
A: With `finalize_restore: true`, Neon moves compute resources to the new state. Until operations complete, connections still point to the old compute.

**Q: Why must the active branch be a root branch?**  
A: Snapshot restores with `finalize_restore: true` currently require root branches. This is a platform requirement.

**Q: What if we need multiple preview environments?**
A: Restore different snapshots to new branches using `finalize_restore: false`. Each restore creates a new branch with its own connection string.

**Q: What is the restore window?**  
A: The time period during which you can restore, depending on snapshot expiration time. Snapshots outside this window cannot be restored.

## Summary

The active branch pattern with Neon snapshots provides a simple, reliable checkpoint solution for AI agent platforms. By using a single root branch as your permanent connection point and snapshots for checkpoints, you get stable connection strings, instant rollbacks, and independent checkpoints that can be deleted in any order. The implementation is straightforward: create snapshots, restore with `finalize_restore: true`, poll operations to completion, then connect. See the [demo repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo) for a complete example.

<NeedHelp />
