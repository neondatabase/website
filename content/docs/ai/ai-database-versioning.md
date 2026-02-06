---
title: Database versioning with snapshots
subtitle: How AI agents and codegen platforms implement database version control using
  snapshots and preview branches
summary: >-
  Covers the implementation of database versioning using Neon's snapshot APIs,
  enabling the creation of point-in-time database versions, instant rollbacks,
  and stable connection strings for applications in AI agent and code generation
  contexts.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.718Z'
---

<Admonition type="note" title="Beta">
Snapshots are available in Beta. Please give us [Feedback](https://console.neon.tech/app/projects?modal=feedback) from the Neon Console or by connecting with us on [Discord](https://discord.gg/92vNTzKDGp).

**Limits and pricing:** The Free plan includes 1 snapshot, and paid plans (including the [Agent plan](https://neon.com/use-cases/ai-agents)) include 10 snapshots. Snapshots are provided free of charge during beta, and will be charged based on GB-month storage at a rate lower than standard project storage after GA. If you need higher limits, please reach out to [Neon support](/docs/introduction/support).
</Admonition>

## Overview

This guide describes how you can implement database versioning for AI agent and code generation platforms using Neon's snapshot APIs. With snapshots, you can create point-in-time database versions, perform instant rollbacks, and maintain stable database connection strings for your applications. See a working implementation in the [demonstration repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo).

> **Terminology note:** This guide uses "versions" to describe saved database states from the user's perspective, and "snapshots" when referring to Neon's technical implementation. You may also see these called "checkpoints" or "edits" in some AI agent contexts.

<Admonition type="tip" title="Synopsis">
Use the project's root branch for production, whose database connection string stays the same when a snapshot restore is finalized. Create snapshots to save database versions. For rollbacks, restore snapshots with `finalize_restore: true` and `target_branch_id` set to your root branch ID, then poll operations until complete before connecting. For previews, use `finalize_restore: false` to create temporary branches with their own database connection strings.
</Admonition>

## Why use snapshots for versioning

Standard database branching is great for development but less suitable for versioning. Each new branch gets a new database connection string and creates dependency chains that complicate deletion. This pattern solves both problems.

By restoring a Neon snapshot to your active branch with `finalize_restore: true`, you replace its data in-place while preserving the original, stable connection string. This makes the snapshot-restore pattern ideal for versioned environments where connection stability is needed.

## Quick start with the demo

The best way to understand this pattern is to see it in action:

1. **Clone the snapshots demo app**:
   - https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo
2. **Key files to examine**:
   - [lib/neon/create-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/create-snapshot.ts) - Snapshot creation implementation
   - [lib/neon/apply-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/apply-snapshot.ts) - Complete restore workflow with operations polling
   - [lib/neon/operations.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/operations.ts) - Operation status polling logic
   - [app/[checkpointId]/page.tsx](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/app/[checkpointId]/page.tsx) - UI integration showing versions and rollbacks
3. Run locally or use the [public demo](https://snapshots-as-checkpoints-demo.vercel.app/) to see version creation, rollbacks, and previews in action

> **Note:** The demo repository uses "checkpoint" terminology which maps to "version" in this guide.
> The demo implements a contacts application that evolves through agent prompts, demonstrating version creation and restoration at each stage:

**v0: empty app** → **v1: basic contacts** → **v2: add role/company** → **v3: add tags**

## The active branch pattern

Every agent project maps to one Neon project with a designated [root branch](/docs/reference/glossary#root-branch) that serves as the production database.

**Important:** Snapshots can only be created from root branches in Neon. A root branch is a branch with no parent (typically named `main` or `production`).

**The active branch:**

- Gets its data replaced during finalized rollbacks
- Maintains a consistent database connection string through Neon's restore mechanism — see [How restore works](#how-restore-works) for details
- Must be a root branch for snapshot creation

**The snapshots:**

- Capture point-in-time database versions
- Store only incremental changes (cost-efficient)
- Can be restored to the active branch or to a temporary preview branch

![Active branch pattern diagram](/docs/guides/active_branch_pattern.jpg)

## Implementation

### Creating snapshots

Create a snapshot to capture the current database version using the [snapshot endpoint](https://api-docs.neon.tech/reference/createsnapshot):

```bash
POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot
```

> **Demo implementation:** See [lib/neon/create-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/create-snapshot.ts) for an example with error handling and operation polling.
> **Path parameters:**

- `project_id` (string, required): The Neon project ID
- `branch_id` (string, required): The active branch ID (must be a root branch)

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

<Admonition type="tip">
Learn how our Developer Advocate approaches snapshot-based workflows in [Promoting Postgres changes safely to production](https://neon.com/blog/promoting-postgres-changes-safely-production).
</Admonition>

### Rolling back to (restoring) a snapshot

Restore any snapshot to recover a previous version using the [restore endpoint](https://api-docs.neon.tech/reference/restoresnapshot):

```bash
POST /api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore
```

> **Demo implementation:** See [lib/neon/apply-snapshot.ts](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo/blob/main/lib/neon/apply-snapshot.ts) for the complete restore workflow including operation polling and error handling.
> **Path parameters:**

- `project_id` (string, required): The Neon project ID
- `snapshot_id` (string, required): The snapshot ID being restored

**Body parameters:**

- `name` (string): A name for the newly restored branch. If omitted, a default name is generated
- `target_branch_id` (string): The ID of the branch to restore the snapshot into. If not specified, the branch from which the snapshot was originally created will be used. **Set this value to your root branch ID for rollbacks to preserve connection strings**
- `finalize_restore` (boolean): Set to `true` to finalize the restore operation immediately. This will complete the restore and move computes from the current branch to the new branch, which keeps the database connection string the same. Defaults to `false`. **Set to `true` when restoring to the active branch for rollbacks, `false` to create preview branches**

<Admonition type="note" title="Connection warning">
Do not connect to the database until current API operations are complete. Any connection attempt before operations finish will either fail or connect to the old database state, not your restored version.
</Admonition>

#### How restore works

Understanding the restore mechanism explains why the connection string remains stable:

1. **New branch creation**: When you restore with `finalize_restore: true`, Neon first creates a new branch from your snapshot. This new branch has a different, system-generated branch ID.

2. **Endpoint transfer**: Neon then transfers the compute endpoint (and its associated connection string) from your original active branch to this newly created branch.

3. **Settings migration**: All branch settings, including its name, are copied to the new active branch, making it appear identical to the old one. Only the branch ID is different.

4. **Branch orphan**: Your original branch becomes "orphaned." It is disconnected from the compute endpoint and renamed by adding an "(old)" suffix (e.g., `main (old)`) to the branch name.

<Admonition type="info" title="Branch ID changes after restore">
The connection string remains stable, but the branch ID changes with every `finalize_restore: true` operation. If you store the branch ID for use in subsequent API calls (e.g., to create the next snapshot), you must retrieve and store the new branch ID after the restore operation completes.
</Admonition>

#### Rollback workflow

Restore any snapshot to your active branch, preserving the connection string:

```json
{
  "target_branch_id": "br-active-branch-123456", // Your root branch ID
  "finalize_restore": true // Moves computes and preserves connection string
}
```

> **Important:** When restoring with `finalize_restore: true`, your previous active branch becomes orphaned and is renamed with `(old)` appended, such as `production (old)` or similar. This orphaned branch is no longer connected to any compute endpoint but preserves your pre-restore state. Delete it during cleanup to avoid unnecessary costs.
> After calling the restore API:

1. Extract the array of operation IDs from the API response.
2. For each operation ID, poll the operations endpoint until its status reaches a terminal state (finished, failed, cancelled, or skipped).
3. Do not attempt to connect to the database until all operations are complete. Connections made before completion will point to the old, pre-restore database state.
4. After verifying a successful restore, delete the orphaned branch (e.g., `main (old)`) to avoid incurring storage costs.

> See the [poll operation status](/docs/manage/operations#poll-operation-status) documentation for related information.
> **Polling operations example:**

```javascript
// Poll operation status until complete
async function waitForOperation(projectId, operationId) {
  while (true) {
    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${projectId}/operations/${operationId}`,
      { headers: { Authorization: `Bearer ${NEON_API_KEY}` } }
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
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

// After restore API call
const restoreResponse = await restoreSnapshot(projectId, snapshotId);
const operationIds = restoreResponse.operations.map((op) => op.id);

// Wait for all operations to complete
for (const id of operationIds) {
  await waitForOperation(projectId, id);
}
// NOW safe to connect to the restored database
```

![Polling operations flow diagram](/docs/guides/polling_operations_flow.jpg)

**Potential restore-related problems:**

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

This creates a new branch with its own connection string for preview. The active branch remains unchanged. Preview branches should be deleted after use to avoid storage costs.

### Managing snapshots

#### List available snapshots

Get all snapshots with IDs, names, and timestamps using the [list snapshots endpoint](https://api-docs.neon.tech/reference/listsnapshots):

```bash
GET /api/v2/projects/{project_id}/snapshots
```

**Path parameters:**

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

- [Project](/docs/reference/glossary#project): Neon project that owns branches, computes, and snapshots, and more
- [Branch](/docs/reference/glossary#branch): An isolated database environment with its own data and schema that you can connect to and modify
- [Snapshot](/docs/reference/glossary#snapshot): An immutable, point-in-time backup of a branch's schema and data. Read-only until restored
- [Root branch](/docs/reference/glossary#root-branch): A branch with no parent (typically named `main` or `production`). The only type of branch from which snapshots can be created
- [Operations](/docs/manage/operations#operations-and-the-neon-api): Backend operations that return operation IDs you must poll to completion

### Pattern-specific terminology

- **Active branch**: The root branch that serves as your agent's production database (though technically replaced during restores). Connection string never changes even when data is replaced via restore. Preview branches may be created alongside for temporary exploration.
- **Version**: A saved database state captured as a snapshot, which may also be referred to a checkpoint or edit. Users create and restore versions through your application interface.
- **Orphaned branch**: Created when restoring with `finalize_restore: true`. The previous active branch becomes orphaned (disconnected from compute) and is renamed to `branch-name (old)`. Can be safely deleted after verifying the restore.
- **Preview branch**: Temporary branch created from a snapshot for safe exploration, to preview a version

## API quick reference

| Operation                                                                               | Endpoint                                                             | Description                                  |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------- |
| [Create snapshot](https://api-docs.neon.tech/reference/createsnapshot)                  | `POST /api/v2/projects/{project_id}/branches/{branch_id}/snapshot`   | Save current database state as a new version |
| [Restore snapshot](https://api-docs.neon.tech/reference/restoresnapshot)                | `POST /api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore` | Restore database to a previous version       |
| [List snapshots](https://api-docs.neon.tech/reference/listsnapshots)                    | `GET /api/v2/projects/{project_id}/snapshots`                        | Get all available versions                   |
| [Delete snapshot](https://api-docs.neon.tech/reference/deletesnapshot)                  | `DELETE /api/v2/projects/{project_id}/snapshots/{snapshot_id}`       | Remove a saved version                       |
| [Update snapshot](https://api-docs.neon.tech/reference/updatesnapshot)                  | `PATCH /api/v2/projects/{project_id}/snapshots/{snapshot_id}`        | Rename a version                             |
| [Poll operation](https://api-docs.neon.tech/reference/getprojectoperation)              | `GET /api/v2/projects/{project_id}/operations/{operation_id}`        | Check restore status                         |
| [List branches](https://api-docs.neon.tech/reference/listprojectbranches) (for cleanup) | `GET /api/v2/projects/{project_id}/branches`                         | Find orphaned branches to clean up           |

## Implementation checklist

- [ ] Create one Neon project per agent project
- [ ] Designate the root branch (main/production) as the "active" branch
- [ ] Store the active branch connection string and branch ID
- [ ] Create snapshots at key points to save database versions
- [ ] For rollbacks: restore with `finalize_restore: true` and set `target_branch_id` to the root branch ID
- [ ] After a rollback, update your stored active branch ID
- [ ] For previews: restore with `finalize_restore: false` to create temporary branches
- [ ] Poll all operation IDs to terminal states before connecting
- [ ] Implement a cleanup strategy: set snapshot expiration dates and delete orphaned branches

## Best practices

- **Set `target_branch_id` for rollbacks**: When restoring to the active branch, always specify `target_branch_id` to prevent accidental restores.
- **Poll operations**: Wait for terminal states before connecting to the database.
- **Snapshot naming conventions**: Use descriptive conventions like `prod_snap_2025-01-17_pre-promotion`, `dev_snap_2025-01-17_candidate_v2`, `prod_snap_2025-01-17_after-promotion` to make automation easier.
- **Snapshot production before promotion**: Take a snapshot of your production branch before promoting changes to provide a rollback point if needed.
- **Differential retention**: Keep production snapshots longer for potential rollback, and development snapshots briefly (hours max) for promotion cycles only.
- **Implement connection retry logic**: Design application code to retry queries automatically, as restore operations briefly drop active connections (typically milliseconds, occasionally up to a second).
- **Keep backup branches briefly**: After restore, keep the automatically-created backup branch (e.g., `prod (old)`) for sanity checks before deletion, or assign a [time to live](/docs/guides/branch-expiration) for automatic cleanup.
- **Cleanup strategy**: Set `expires_at` on temporary snapshots and preview branches. Delete orphaned branches (e.g., `production (old)`) created during restores.
- **Version metadata**: Keep version metadata separate to preserve audit trail across restores.

## FAQ

<DefinitionList>
Why must I poll operations after restore?
: With `finalize_restore: true`, Neon moves compute resources to the new state. Until operations complete, connections still point to the old compute.

What happens to my active branch when I restore?
: When restoring with `finalize_restore: true`, your current active branch becomes orphaned (disconnected from the compute endpoint) and is renamed with "(old)" appended. This orphaned branch preserves your pre-restore state temporarily, but you should delete it after verifying the restore to avoid storage costs.

What if we need multiple preview environments?
: Restore different snapshots to new branches using `finalize_restore: false`. Each restore creates a new branch with its own connection string.

Why use snapshots instead of branches for versioning?
: **Snapshots**: Restoring a snapshot onto your active branch (`finalize_restore: true`) replaces the data but keeps the same database connection string. This is ideal for production rollbacks.
: **Branches**: Creating a new branch always generates a new connection string, which would require reconfiguring your application for every version change. Branches also create dependency chains that can complicate deletion.

</DefinitionList>

## Summary

The active branch pattern with Neon snapshots provides a simple, reliable versioning solution for AI agent and codegen platforms. By keeping database connection strings stable through the restore mechanism and using snapshots to implement version control, you get stable connection strings for your main database, instant rollbacks to previous versions, and the flexibility to create preview branches when needed. The implementation is straightforward: create snapshots to save versions, restore with `finalize_restore: true` to the active branch for rollbacks, or with `finalize_restore: false` for preview branches. Always poll operations to completion before connecting. See the [demo repository](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo) for a complete example.

<NeedHelp />
