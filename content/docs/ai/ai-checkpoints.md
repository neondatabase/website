---
title: Database versioning with Neon snapshots
subtitle: Learn how to implement version control for AI agent databases using snapshots and preview branches.
enableTableOfContents: true
updatedOn: '2025-08-12T14:09:12.290Z'
---

<Admonition type="comingSoon" title="Snapshots in Early Access">
Snapshots are available for members of our Early Access Program. Read more about joining up [here](/docs/introduction/early-access).
</Admonition>

## Overview

This guide is for platforms building AI agents and code generation tools. You'll learn how to maintain a production database with consistent connection strings, create point-in-time versions, and restore previous states without breaking your application's database connections. See a working implementation in the [demonstration repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo).

This pattern works whether you manage Neon projects for your users (embedded approach) or users bring their own Neon accounts.

> **Terminology note:** This guide uses "versions" to describe saved database states from the user's perspective, and "snapshots" when referring to Neon's technical implementation. You may also see these called "checkpoints" in some AI agent contexts.

<Admonition type="tip" title="Quick guide">
Target a root branch for production, which maintains its connection string even when restored. Create snapshots to save versions. For rollbacks, restore them with `finalize_restore: true` and `target_branch_id` set to your root branch ID, then poll operations until complete before connecting. For previews, use `finalize_restore: false` to create temporary branches.
</Admonition>

## Why this pattern uses snapshots

This pattern uses snapshots for versioning because when restored with `finalize_restore: true` to your active branch, the connection string remains stable. Unlike creating new branches (which always get new connection strings and create dependency chains), restoring a snapshot to your existing branch preserves the same connection string while replacing the data. This makes the snapshot-restore pattern ideal for version control in production environments where connection stability is critical.

## Quick start with the demo

The best way to understand this pattern is to see it in action:

1. **Clone the demo**:
   - `git clone` https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo
2. **Key files to examine**:
   - [lib/neon/create-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/create-snapshot.ts) - Snapshot creation implementation
   - [lib/neon/apply-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/apply-snapshot.ts) - Complete restore workflow with operations polling
   - [lib/neon/operations.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/operations.ts) - Operation status polling logic
   - [app/[checkpointId]/page.tsx](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/app/[checkpointId]/page.tsx) - UI integration showing versions and rollbacks
3. Either run locally or use the [public demo](https://snapshots-as-checkpoints-demo.vercel.app/) to see version creation, rollbacks, and previews in action

> **Note:** The demo repository uses "checkpoint" terminology which maps to "version" in this guide.

The demo implements a contacts application that evolves through agent prompts (v0: empty app → v1: basic contacts → v2: add role/company → v3: add tags), demonstrating version creation and restoration at each stage.

## Core pattern: active branches

Every agent project maps to one Neon project with a designated root branch that serves as the production database.

> **Important:** Snapshots can only be created from root branches in Neon. A [root branch](/docs/reference/glossary#root-branch) is a branch with no parent (typically named `main` or `production`).

**The active branch:**

- Gets its data replaced during rollbacks (but keeps the same connection string)*
- Maintains a permanent connection string that never changes
- Must be a root branch for snapshot creation

*Through Neon's restore mechanism - see [How restore works](#how-restore-works) for technical details.

**The snapshots:**

- Capture point-in-time database versions
- Store only incremental changes (cost-efficient)
- Can be restored to the active branch or to a temporary preview branch

```text
+---------------------------------------------------------------------------------------+
| NEON PROJECT                                                                          |
|                                                                                       |
|   ╔═══════════════════════════════════════════════════════════════════════════════╗   |
|   ║  STABLE CONNECTION STRING (never changes)                                     ║   |
|   ╟───────────────────────────────────────────────────────────────────────────────╢   |
|   ║  [ Active Branch: main ]  <── Restore with finalize_restore: true             ║   |
|   ╚═══════════════════════════════════════════════════════════════════════════════╝   |
|                                          │                                            |
|   ┌─────────────────┐                    │                      ┌─────────────────┐   |
|   │   SNAPSHOTS     │                    │                      │  TEMP BRANCHES  │   |
|   ├─────────────────┤                    │                      ├─────────────────┤   |
|   │ • Version 1     │────────────────────┘                      │ • Preview v1    │   |
|   │ • Version 2     │──────────────────────────────────────────>│ • Preview v2    │   |
|   │ • Version 3     │  Create preview (finalize_restore: false) └─────────────────┘   |
|   └─────────────────┘                                                                 |
|                                                                  ┌────────────────┐   |
|                                                                  │ ORPHANED       │   |
|                                                                  │ • main (old)   │   |
|                                                                  └────────────────┘   |
+---------------------------------------------------------------------------------------+
```

## Implementation

### Creating snapshots

Create a snapshot to capture the current database version using the [snapshot endpoint](https://api-docs.neon.tech/reference/createsnapshot):

```bash
POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot
```

> **Demo implementation:** See [lib/neon/create-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/create-snapshot.ts) for an example with error handling and operation polling.

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
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/snapshot?name=version-session-1&expires_at=2025-08-13T00:00:00Z' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

**When to create snapshots:**

- Start of each agent session
- Before database schema changes
- After successful operations
- User-initiated save points

### Rolling back to (restoring) a snapshot

Restore any snapshot to recover a previous version using the [restore endpoint](https://api-docs.neon.tech/reference/restoresnapshot):

```bash
POST /api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore
```

> **Demo implementation:** See [lib/neon/apply-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/apply-snapshot.ts) for the complete restore workflow including operation polling and error handling.

**Path parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID

**Body parameters:**

- `name` (string): A name for the newly restored branch. If omitted, a default name will be generated
- `target_branch_id` (string): The ID of the branch to restore the snapshot into. If not specified, the branch from which the snapshot was originally created will be used. **Set to your root branch ID for rollbacks to preserve connection strings**
- `finalize_restore` (boolean): Set to `true` to finalize the restore operation immediately. This will complete the restore and move any associated computes to the new branch. Defaults to `false`. **Set to `true` when restoring to the active branch for rollbacks, `false` for preview branches**

<Admonition type="note" title="Connection Warning">
Do not connect to the database until all operations complete. Any connection attempt before operations finish will connect to the old database state, not your restored version.
</Admonition>

#### How restore works

Understanding the restore mechanism helps explain why connection strings remain stable:

1. **New branch creation**: When you restore with `finalize_restore: true`, Neon creates a new branch from your snapshot. This new branch has a different branch ID than your original.

2. **Endpoint transfer**: Neon then transfers the compute endpoint from your original branch to the newly created branch. This is why your connection string stays the same.

3. **Settings migration**: All branch settings, including the name, are copied to the new branch.

4. **Orphaned branch creation**: Your original branch becomes orphaned (e.g., "main (old)") - it's no longer connected to any compute endpoint and should be deleted after verifying the restore.

**Important for automation**: If you're storing branch IDs for API operations, you'll need to update them after each restore. The connection string remains stable, but the branch ID changes.

#### Rollback workflow

Restore any snapshot to your active branch, preserving the connection string:

```json
{
  "target_branch_id": "br-active-branch-123456", // Your root branch ID
  "finalize_restore": true // Moves computes and preserves connection string
}
```

**Important:** When restoring with `finalize_restore: true`, your previous active branch becomes orphaned and is renamed to `production (old)` or similar. This orphaned branch is no longer connected to any compute endpoint but preserves your pre-restore state. Delete it during cleanup to avoid unnecessary costs.

After calling the restore API:

1. Extract operation IDs from the response (may be empty array)
2. Poll the operation status until it reaches a terminal state
3. **Do not connect yet** - database still points to old state
4. Only after all operations complete can you connect to the restored version

> See the [poll operation status](docs/manage/operations#poll-operation-status) documentation for related information.

**Polling operations:**

```javascript
// Poll operation status until complete
async function waitForOperation(projectId, operationId) {
  while (true) {
    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${projectId}/operations/${operationId}`,
      { headers: { 'Authorization': `Bearer ${NEON_API_KEY}` } }
    );
    const { status } = await response.json();

    // Terminal states - safe to proceed
    if (['finished', 'skipped', 'cancelled'].includes(status)) {
      return;
    }

    // Error state - handle appropriately
    if (status === 'failed') {
      throw new Error('Operation failed');
    }

    // Still running - wait and retry
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// After restore API call
const restoreResponse = await restoreSnapshot(projectId, snapshotId);
const operationIds = restoreResponse.operations.map(op => op.id);

// Wait for all operations to complete
for (const id of operationIds) {
  await waitForOperation(projectId, id);
}
// NOW safe to connect to the restored database
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
- **Accumulating orphaned branches**: Delete orphaned branches (e.g., `production (old)`) after successful restore verification

#### Preview environments

Create a temporary branch to preview a version without affecting the active branch:

```json
{
  "name": "preview-version-123",
  "finalize_restore": false // Creates new branch for preview without moving computes
}
```

This creates a new branch with its own connection string for preview. The active branch remains unchanged. Preview branches should be deleted after use to avoid accumulating costs.

### Managing snapshots

#### List available snapshots

Get all snapshots with IDs, names, and timestamps using the [list snapshots endpoint](https://api-docs.neon.tech/reference/listsnapshots):

```bash
GET /api/v2/projects/{project_id}/snapshots
```

**Path Parameters:**

- `project_id` (string, required): The Neon project ID

#### Delete snapshot

Remove a snapshot using the [delete endpoint](https://api-docs.neon.tech/reference/deletesnapshot):

```bash
DELETE /api/v2/projects/{project_id}/snapshots/{snapshot_id}
```

**Path parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID

#### Update snapshot name

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
- Restoring from a snapshot doesn't lock that snapshot from deletion, unlike branches where creating child branches prevents deleting the parent
- Delete orphaned branches created during restores (named like `production (old)`)
- These orphaned branches accumulate with each restore and consume storage
- Reduces snapshot management fees while shared storage remains
- Set `expires_at` for automatic cleanup or delete manually as needed
- Consider removing snapshots after merging features or completing rollback testing

## Concepts and terminology

### Neon core concepts

- **Project**: Neon project that owns branches, computes, and snapshots
- **Branch**: An isolated database environment with its own data and schema that you can connect to and modify
- **Snapshot**: An immutable, point-in-time backup of a branch's schema and data. Read-only until restored
- **Root branch**: A branch with no parent (typically named `main` or `production`). The only type of branch from which snapshots can be created
- **Operations**: Backend operations that return operation IDs you must poll to completion

### Pattern-specific terminology

- **Active branch**: The root branch that serves as your agent's production database (though technically replaced during restores). Connection string never changes even when data is replaced via restore. Preview branches may be created alongside for temporary exploration.
- **Version**: A saved database state captured as a snapshot. Users create and restore versions through your application interface.
- **Orphaned branch**: Created when restoring with `finalize_restore: true`. The previous active branch becomes orphaned (disconnected from compute) and is renamed to `branch-name (old)`. Can be safely deleted after verifying the restore.
- **Preview branch**: Temporary branch created from a snapshot for safe exploration, to preview a version
- **Version metadata**: Separate database/table that stores version information (prompt text, `snapshot_id`, etc.). Keeps audit trail across restores

## API quick reference

| Operation                                                                               | Endpoint                                                             | Description |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------- |
| [Create snapshot](https://api-docs.neon.tech/reference/createsnapshot)                | `POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot`   | Save current database state as a new version |
| [Restore snapshot](https://api-docs.neon.tech/reference/restoresnapshot)              | `POST /api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore` | Restore database to a previous version |
| [List snapshots](https://api-docs.neon.tech/reference/listsnapshots)                  | `GET /api/v2/projects/{project_id}/snapshots`                        | Get all available versions |
| [Delete snapshot](https://api-docs.neon.tech/reference/deletesnapshot)                | `DELETE /api/v2/projects/{project_id}/snapshots/{snapshot_id}`       | Remove a saved version |
| [Update snapshot](https://api-docs.neon.tech/reference/updatesnapshot)                | `PATCH /api/v2/projects/{project_id}/snapshots/{snapshot_id}`        | Rename a version |
| [Poll operation](https://api-docs.neon.tech/reference/getprojectoperation)              | `GET /api/v2/projects/{project_id}/operations/{operation_id}`        | Check restore status |
| [List branches](https://api-docs.neon.tech/reference/listprojectbranches) (for cleanup) | `GET /api/v2/projects/{project_id}/branches`                         | Find orphaned branches to clean up |

## Quick implementation checklist

- [ ] Create one Neon project per agent project
- [ ] Designate the root branch (main/production) as the "active" branch
- [ ] Store the active branch connection string and branch ID
- [ ] Create snapshots at key points to save versions
- [ ] For rollbacks: restore with `finalize_restore: true` and `target_branch_id` set to root branch
- [ ] For previews: restore with `finalize_restore: false` to create temporary branches
- [ ] Poll all operation IDs to terminal states before connecting
- [ ] Set up automatic cleanup with expiration dates
- [ ] Document your restore window policy, when snapshots are set to expire
- [ ] Delete orphaned branches (e.g., `main (old)`) after successful restores

## Best practices

- **Set `target_branch_id` for rollbacks**: When restoring to the active branch, always specify `target_branch_id` to prevent accidental restores
- **Poll operations**: Wait for terminal states before connecting to the database
- **Snapshot naming**: Use conventions like `snapshot-{GIT_SHA}-{TIMESTAMP}` or maintain sequential version numbers
- **Cleanup strategy**: Set `expires_at` on temporary snapshots and preview branches. Delete orphaned branches (e.g., `production (old)`) created during restores
- **Version metadata**: Keep version metadata separate to preserve audit trail across restores

## Frequently asked questions (FAQ)

<DefinitionList>
Why must I poll operations after restore?
: With `finalize_restore: true`, Neon moves compute resources to the new state. Until operations complete, connections still point to the old compute.

What happens to my active branch when I restore?
: When restoring with `finalize_restore: true`, your current active branch becomes orphaned (disconnected from the compute endpoint) and is renamed with "(old)" appended. This orphaned branch preserves your pre-restore state temporarily, but you should delete it after verifying the restore to avoid storage costs.

What if we need multiple preview environments?
: Restore different snapshots to new branches using `finalize_restore: false`. Each restore creates a new branch with its own connection string.

Why use snapshots instead of branches for versioning?
: Branches create dependency chains (parent branches cannot be deleted while child branches exist) and each new branch requires a new connection string, causing connection management complexity. The snapshot-restore pattern solves these problems: when you restore a snapshot to your active branch with `finalize_restore: true`, it preserves the same connection string while replacing the data. This allows simple one-call restores without breaking existing connections. While branches are ideal for development environments and isolated testing, the snapshot-restore pattern is superior for version control in production.
</DefinitionList>

## Summary

The active branch pattern with Neon snapshots provides a simple, reliable versioning solution for AI agent platforms. By keeping production connection strings stable through the restore mechanism and using snapshots to implement version control, you get stable connection strings for your main database, instant rollbacks to previous versions, and the flexibility to create preview branches when needed. The implementation is straightforward: create snapshots to save versions, restore with `finalize_restore: true` to the active branch for rollbacks, or with `finalize_restore: false` for preview branches. Always poll operations to completion before connecting. See the [demo repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo) for a complete example.

<NeedHelp />
