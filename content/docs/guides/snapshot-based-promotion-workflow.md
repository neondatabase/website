---
title: Implementing a snapshot-based promotion workflow
subtitle: Technical guide for promoting database changes from dev to production using the Neon API
enableTableOfContents: true
updatedOn: '2025-11-26T00:00:00.000Z'
---

This guide provides step-by-step API instructions for implementing a snapshot-based promotion workflow with Neon. This workflow is ideal for codegen platforms, CMS systems, and any application that needs to safely promote database changes from development to production while handling ongoing production writes.

<Admonition type="tip" title="Related blog post">
This guide is a companion to our blog post [Promoting Postgres Changes Safely From Multiple Environments to Production](https://neon.tech/blog/promoting-postgres-changes-safely). Read the blog post first to understand the workflow concepts, then use this guide for implementation.
</Admonition>

<Admonition type="note" title="Snapshots in Beta">
Snapshots are available in Beta. Snapshot limits: 1 on the Free plan and 10 on paid plans. If you need higher limits, please reach out to [Neon support](/docs/introduction/support).
</Admonition>

## Overview

The snapshot-based promotion workflow uses two independent root branches (`prod` and `dev`) and leverages Neon's snapshot functionality to safely move changes between them.

**Important**: All branches must be within the same Neon project. Snapshots cannot be restored across different projects.

Key benefits:

- **Safe promotion**: Replace production with a known-good dev state
- **Fast operations**: Snapshots and restores complete very quickly
- **No connection changes**: Production endpoints remain stable during promotion
- **Instant rollback**: Keep snapshots for quick recovery if needed

## Prerequisites

Before you begin, you'll need:

- A Neon project with a production branch
- A Neon API key (see [Create an API key](/docs/manage/api-keys#create-an-api-key))
- Your project ID (found in the Neon Console or via API)
- Your production branch ID

**Plan requirements**:

- **Root branches**: Minimum 2 required (prod + dev). Free: 3, Launch: 5, Scale: 25
- **Snapshots**: Recommend 2-3 active for promotion cycles. Free: 1, Paid: 10

<Admonition type="warning">
If you're on the Free plan with only 1 snapshot capacity, this workflow is challenging since promotion requires multiple snapshots. Consider upgrading to a paid plan for smoother operations.
</Admonition>

Set your API key as an environment variable:

```bash
export NEON_API_KEY='your_neon_api_key'
```

## Phase 1: Creating isolated roots for prod and dev

The first step is creating two independent root branches: `prod` (your live production environment) and `dev` (your isolated development environment).

<Admonition type="note" title="No direct API for creating root branches">
Neon doesn't currently provide a direct API to create a second root branch. The workaround is to create a snapshot of your production branch and restore it, which creates a new root branch. This new branch can then be renamed to serve as your dev environment.
</Admonition>

### Step 1: Identify your production branch

First, list your project's branches to find your production branch ID:

```bash
curl --request GET \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

Look for your default branch (typically named `main` or `production`). Note its `id` field.

**API reference**: [List branches](https://api-docs.neon.tech/reference/listprojectbranches)

### Step 2: Create a snapshot of production

Create a snapshot to capture the exact data and schema state of production:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{prod_branch_id}/snapshot' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "prod_baseline_snapshot"
  }' | jq
```

The response includes a `snapshot_id` that you'll use in the next step. Example response:

```json
{
  "id": "snapshot_abc123",
  "name": "prod_baseline_snapshot",
  "branch_id": "br-prod-123",
  "created_at": "2025-01-15T10:00:00Z"
}
```

**API reference**: [Create snapshot](https://api-docs.neon.tech/reference/createsnapshot)

### Step 3: Create the dev branch from the snapshot

Restore the production snapshot to create a new root branch, rename it to `dev`, and create a compute endpoint:

**3a. Restore the snapshot:**

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "finalize_restore": false
  }' | jq
```

This creates a new root branch with the same data and schema as production. The restore operation automatically creates a branch named `old prod` (or similar). Note the branch `id` from the response.

**API reference**: [Restore snapshot](https://api-docs.neon.tech/reference/restoresnapshot)

**3b. Rename the branch to "dev" and create a compute:**

```bash
# Rename the branch
curl --request PATCH \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{restored_branch_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "branch": {
      "name": "dev"
    }
  }' | jq

# Create a compute endpoint for the dev branch
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/endpoints' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "endpoint": {
      "branch_id": "{restored_branch_id}",
      "type": "read_write"
    }
  }' | jq
```

**API references**: [Update branch](https://api-docs.neon.tech/reference/updateprojectbranch), [Create endpoint](https://api-docs.neon.tech/reference/createprojectendpoint)

### Step 4: Clean up the baseline snapshot (optional)

Once you've created the dev branch, you can optionally delete the baseline snapshot to free up snapshot capacity:

```bash
curl --request DELETE \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{snapshot_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

**API reference**: [Delete snapshot](https://api-docs.neon.tech/reference/deletesnapshot)

### Step 5: Protect the production branch (recommended)

Enable [protected branches](/docs/guides/protected-branches) on your production branch to prevent accidental deletion:

```bash
curl --request PATCH \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{prod_branch_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "branch": {
      "protected": true
    }
  }' | jq
```

**API reference**: [Update branch](https://api-docs.neon.tech/reference/updateprojectbranch)

## Phase 2: Building different versions

Use the `dev` branch as your working environment for application updates and schema changes. Create short-lived child branches for previews or feature work.

### Create child branches for previews

Create temporary branches from `dev` for each feature, experiment, or preview environment:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "branch": {
      "name": "dev_feature_x",
      "parent_id": "{dev_branch_id}"
    },
    "endpoints": [
      {
        "type": "read_write"
      }
    ]
  }' | jq
```

**API reference**: [Create branch](https://api-docs.neon.tech/reference/createprojectbranch)

### Set branch expiration for auto-cleanup

For temporary preview branches, set an expiration timestamp to automatically clean them up:

```bash
curl --request PATCH \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "branch": {
      "expires_at": "2025-01-20T00:00:00Z"
    }
  }' | jq
```

**API reference**: [Update branch](https://api-docs.neon.tech/reference/updateprojectbranch)

### Apply validated changes back to dev

When a preview branch is validated and ready to promote, apply the changes back to the `dev` branch. Neon does not directly merge branches like Git (this is intentional—merging diverged database states is not safe). Instead, use one of these methods:

1. **Migration files**: Apply schema changes via SQL migration scripts
2. **Database tools**: Use tools like Flyway, Liquibase, or Prisma Migrate
3. **Manual SQL**: Run validated SQL statements against the dev branch

At the end of this phase, your `dev` branch represents the next production candidate.

## Phase 3: Promote changes to production

Promotion uses snapshots to safely replace production with the validated dev state.

<Admonition type="tip">
**Schedule promotions strategically**: Since restores drop active connections (even briefly), consider performing promotions during low-traffic periods or maintenance windows when possible.
</Admonition>

### Step 1: Snapshot prod for rollback

Before promoting, take a snapshot of the current production state for potential rollback:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{prod_branch_id}/snapshot' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "prod_pre_promotion_2025-01-17",
    "expires_at": "2025-02-17T00:00:00Z"
  }' | jq
```

**Best practices**:

- Use descriptive names with timestamps
- Set appropriate expiration dates (e.g., 30 days for production snapshots)
- Keep these snapshots longer than dev snapshots for recovery purposes

**API reference**: [Create snapshot](https://api-docs.neon.tech/reference/createsnapshot)

### Step 2: Snapshot dev for promotion

Capture the exact dev state you want to deploy to production:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{dev_branch_id}/snapshot' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "dev_promotion_candidate_2025-01-17",
    "expires_at": "2025-01-18T00:00:00Z"
  }' | jq
```

Note the `snapshot_id` from the response for the next step.

**API reference**: [Create snapshot](https://api-docs.neon.tech/reference/createsnapshot)

### Step 3: Restore dev snapshot onto prod

This is the core promotion step—restore the dev snapshot onto the production branch:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{dev_snapshot_id}/restore' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "target_branch_id": "{prod_branch_id}",
    "finalize_restore": true
  }' | jq
```

**Critical parameters**:

- `target_branch_id`: **Always specify this** - The production branch ID you want to replace. Without this, subsequent restores may target the wrong branch (like accidentally targeting `prod (old)` from a previous restore)
- `finalize_restore`: Set to `true` to move the compute endpoint to the new state, keeping connection strings stable

**What happens**:

1. A new branch is created with the dev snapshot data
2. The production compute endpoint is moved to this new branch
3. The original prod branch becomes orphaned and is renamed to `prod (old)`
4. Connection strings remain the same—no need to update your application

**Connection drops**: Active production connections will be briefly dropped (typically milliseconds) during the restore. **Your application must implement automatic query retry logic** to handle these brief interruptions gracefully.

**Important**: The response includes operation IDs. You must poll these operations until they complete before connecting to the database. See [Polling operations](#polling-operations-after-restore) below.

**API reference**: [Restore snapshot](https://api-docs.neon.tech/reference/restoresnapshot)

<Admonition type="warning" title="Production writes will be lost">
Restoring the dev snapshot onto prod **completely replaces** the production branch with dev's state at snapshot time. Any production data created or modified after the production snapshot (Step 1) will not be present after the restore.

This is acceptable for many use cases where:

- Production is read-only
- Production data can be safely discarded
- All writes happen in preview/dev branches

If production writes must be preserved, ensure your system either treats production as read-only during development cycles, moves all writes to preview branches, or performs application-level reconciliation after promotion.
</Admonition>

### Step 4: Poll operations until complete

The restore operation is asynchronous. You must poll the operation status until all operations complete before connecting to the database:

```bash
curl --request GET \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/operations/{operation_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

Poll until the operation `status` field shows `finished`. Repeat for each operation ID returned in the restore response.

**Why polling is critical**: If you connect before operations complete, you'll connect to the old database state, not the restored version.

**API reference**: [Get operation](https://api-docs.neon.tech/reference/getprojectoperation)

### Step 5: Clean up the backup branch

After verifying the promotion succeeded, delete the automatically created backup branch (`prod (old)`):

```bash
# First, list branches to find the backup branch ID
curl --request GET \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq

# Then delete the backup branch
curl --request DELETE \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{backup_branch_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

**API reference**: [Delete branch](https://api-docs.neon.tech/reference/deleteprojectbranch)

### Step 6: Clean up the promotion snapshot (optional)

Once promotion is verified, you can delete the dev promotion snapshot to free up snapshot capacity:

```bash
curl --request DELETE \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{dev_snapshot_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

**API reference**: [Delete snapshot](https://api-docs.neon.tech/reference/deletesnapshot)

## Phase 4: Refreshing dev with latest production data

After promoting to production, refresh the dev branch with the latest production data to ensure the next development cycle starts with an up-to-date baseline.

### Step 1: Snapshot current production

Create a snapshot of the current production state:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{prod_branch_id}/snapshot' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "prod_refresh_2025-01-17"
  }' | jq
```

Note the `snapshot_id` from the response.

**API reference**: [Create snapshot](https://api-docs.neon.tech/reference/createsnapshot)

### Step 2: Restore production snapshot onto dev

Restore the production snapshot onto the dev branch to refresh it:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{prod_snapshot_id}/restore' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "target_branch_id": "{dev_branch_id}",
    "finalize_restore": true
  }' | jq
```

This instantly rewrites the dev branch to match production while keeping the same branch ID and endpoint string.

**API reference**: [Restore snapshot](https://api-docs.neon.tech/reference/restoresnapshot)

### Step 3: Poll operations until complete

Poll the operation status as described in [Phase 3, Step 4](#step-4-poll-operations-until-complete).

### Step 4: Clean up the backup branch

After verifying the refresh succeeded, delete the automatically created backup branch (`dev (old)`):

```bash
# List branches to find the backup branch ID
curl --request GET \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq

# Delete the backup branch
curl --request DELETE \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{backup_branch_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

**API reference**: [Delete branch](https://api-docs.neon.tech/reference/deleteprojectbranch)

### Step 5: Clean up the refresh snapshot (optional)

Once the refresh is verified, you can delete the snapshot:

```bash
curl --request DELETE \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{prod_snapshot_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

**API reference**: [Delete snapshot](https://api-docs.neon.tech/reference/deletesnapshot)

## Phase 5: Rolling back production (if needed)

If you need to roll back production to a previous state, use the pre-promotion snapshot you created in Phase 3.

### Step 1: Identify the rollback snapshot

List available snapshots to find the pre-promotion snapshot:

```bash
curl --request GET \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

Look for the snapshot created before promotion (e.g., `prod_pre_promotion_2025-01-17`).

**API reference**: [List snapshots](https://api-docs.neon.tech/reference/listsnapshots)

### Step 2: Restore the rollback snapshot onto prod

Restore the pre-promotion snapshot onto production:

```bash
curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{rollback_snapshot_id}/restore' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "target_branch_id": "{prod_branch_id}",
    "finalize_restore": true
  }' | jq
```

This works exactly like Phase 3, Step 3—it restores production to the state before the promotion.

**API reference**: [Restore snapshot](https://api-docs.neon.tech/reference/restoresnapshot)

### Step 3: Poll operations until complete

Poll operation status as described in [Phase 3, Step 4](#step-4-poll-operations-until-complete).

### Step 4: Clean up the backup branch

After verifying the rollback succeeded, delete the backup branch (`prod (old)`) created by the rollback:

```bash
# List branches to find the backup branch ID
curl --request GET \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq

# Delete the backup branch
curl --request DELETE \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{backup_branch_id}' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" | jq
```

**API reference**: [Delete branch](https://api-docs.neon.tech/reference/deleteprojectbranch)

## Operational considerations

### Naming conventions

Use clear, consistent naming to simplify automation and tracking:

**Production snapshots** (keep longer for recovery):

- `prod_snap_YYYY-MM-DD_pre-promotion`
- `prod_snap_YYYY-MM-DD_after-promotion`
- Retention: 30+ days
- **Best practice**: Set `expires_at` when creating snapshots to avoid manual cleanup

**Development snapshots** (short-lived):

- `dev_snap_YYYY-MM-DD_candidate_vN`
- `dev_snap_YYYY-MM-DD_HH-MM`
- Retention: Hours to days
- **Best practice**: Set aggressive expiration (e.g., 24 hours) to free up snapshot capacity

**Branches**:

- Production: `prod` or `production`
- Development: `dev` or `development`
- Previews: `dev_preview_{user_id}_{timestamp}` or `dev_feature_{name}`
- Backups: Automatically named `{branch_name} (old)`

**Monitor your limits**: Track active snapshots against your plan limits (1 on Free, 10 on Paid) to avoid hitting capacity during promotion cycles.

### Polling operations after restore

When restoring with `finalize_restore: true`, you must poll operations to completion before connecting. Here's a complete example:

```bash
# 1. Perform restore and capture operation IDs
RESTORE_RESPONSE=$(curl --request POST \
  --url 'https://console.neon.tech/api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $NEON_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "target_branch_id": "{prod_branch_id}",
    "finalize_restore": true
  }')

# 2. Extract operation IDs from response
OPERATION_IDS=$(echo $RESTORE_RESPONSE | jq -r '.operations[].id')

# 3. Poll each operation until finished
for OP_ID in $OPERATION_IDS; do
  while true; do
    STATUS=$(curl --request GET \
      --url "https://console.neon.tech/api/v2/projects/{project_id}/operations/$OP_ID" \
      --header 'Accept: application/json' \
      --header "Authorization: Bearer $NEON_API_KEY" | jq -r '.status')

    if [ "$STATUS" = "finished" ]; then
      echo "Operation $OP_ID completed"
      break
    elif [ "$STATUS" = "failed" ]; then
      echo "Operation $OP_ID failed"
      exit 1
    fi

    echo "Operation $OP_ID status: $STATUS, waiting..."
    sleep 2
  done
done

echo "All operations complete, safe to connect"
```

**API reference**: [Get operation](https://api-docs.neon.tech/reference/getprojectoperation)

### Cost optimization

**Branch costs**:

- Root branches (like `prod` and `dev`): Billed based on logical size (actual data)
- Child branches: Very affordable—share underlying data until changes are written
- Backup branches: Billed based on logical size—delete after verification

**Snapshot costs**:

- Billed based on logical size during the beta period (currently free)
- Keep only necessary snapshots for recovery and promotion

**Cost reduction strategies**:

1. Set expiration dates on short-lived snapshots
2. Delete backup branches after verification
3. Use branch expiration for preview environments
4. Keep snapshot families:
   - **Production snapshots**: Longer retention (30+ days) for rollback
   - **Development snapshots**: Short retention (hours to days) for promotion cycles

### Branch and snapshot limits

Know your plan limits to avoid hitting capacity:

| Plan   | Root branches | Snapshots |
| :----- | :------------ | :-------- |
| Free   | 3             | 1         |
| Launch | 5             | 10        |
| Scale  | 25            | 10        |

For the two-root-branch pattern in this guide, you'll need at minimum:

- 2 root branches (`prod` and `dev`)
- 1 snapshot capacity for the promotion cycle

If you need higher limits, contact [Neon support](/docs/introduction/support).

### Restore connection behavior

Every restore operation with `finalize_restore: true` briefly drops active connections to the target branch. Key points:

- **Duration**: Typically milliseconds, occasionally up to 1 second
- **Impact**: All active connections are terminated
- **Mitigation**: Implement automatic query retry in your application
- **Best practice**: Perform promotions during low-traffic periods when possible

### Monitoring and verification

After each promotion or rollback:

1. **Verify data**: Query the database to confirm expected data and schema
2. **Check operations**: Ensure all API operations completed successfully
3. **Monitor logs**: Watch application logs for connection errors or query failures
4. **Test endpoints**: Verify that database connections work as expected

**Test your rollback procedure**: Before you need it in production, verify that your pre-promotion snapshots can be successfully restored. Run a test rollback on a non-critical branch to confirm the process works as expected.

## Quick reference

### Workflow summary

```bash
# Phase 1: Setup (one-time)
1. List branches → Find prod branch ID
2. Create snapshot of prod
3. Create dev branch:
   a. Restore snapshot → Creates new root branch "old prod"
   b. Rename to "dev" and create compute
4. Clean up baseline snapshot (optional)
5. Protect prod branch (recommended)

# Phase 2: Development (iterative)
1. Create child branches from dev
2. Develop and test in child branches
3. Apply validated changes back to dev

# Phase 3: Promotion (when ready to deploy)
1. Snapshot prod (for rollback)
2. Snapshot dev (promotion candidate)
3. Restore dev snapshot onto prod (finalize_restore: true)
4. Poll operations until complete
5. Verify and clean up

# Phase 4: Refresh dev (start next cycle)
1. Snapshot prod
2. Restore prod snapshot onto dev (finalize_restore: true)
3. Poll operations until complete
4. Clean up

# Phase 5: Rollback (if needed)
1. Identify rollback snapshot
2. Restore snapshot onto prod (finalize_restore: true)
3. Poll operations until complete
4. Verify and clean up
```

### Common API endpoints

| Operation          | Endpoint                                                        | Method |
| :----------------- | :-------------------------------------------------------------- | :----- |
| List branches      | `/api/v2/projects/{project_id}/branches`                        | GET    |
| Create branch      | `/api/v2/projects/{project_id}/branches`                        | POST   |
| Update branch      | `/api/v2/projects/{project_id}/branches/{branch_id}`            | PATCH  |
| Delete branch      | `/api/v2/projects/{project_id}/branches/{branch_id}`            | DELETE |
| Create snapshot    | `/api/v2/projects/{project_id}/branches/{branch_id}/snapshot`   | POST   |
| List snapshots     | `/api/v2/projects/{project_id}/snapshots`                       | GET    |
| Delete snapshot    | `/api/v2/projects/{project_id}/snapshots/{snapshot_id}`         | DELETE |
| Restore snapshot   | `/api/v2/projects/{project_id}/snapshots/{snapshot_id}/restore` | POST   |
| Get operation      | `/api/v2/projects/{project_id}/operations/{operation_id}`       | GET    |
| Get connection URI | `/api/v2/projects/{project_id}/connection_uri`                  | GET    |

## Next steps

- Read the companion blog post: [Promoting Postgres Changes Safely From Multiple Environments to Production](https://neon.tech/blog/promoting-postgres-changes-safely)
- Learn more about [database versioning with snapshots](/docs/ai/ai-database-versioning)
- Check out the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) for complete API documentation
- Join the [Neon Discord](https://discord.gg/92vNTzKDGp) for community support

<NeedHelp/>
