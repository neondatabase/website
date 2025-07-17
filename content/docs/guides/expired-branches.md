---
title: Expired branches
subtitle: Learn how to use Neon's branch expiration feature to automatically delete temporary branches
enableTableOfContents: true
updatedOn: '2025-07-09T00:00:00.000Z'
---

## Overview

Branch expiration allows you to set automatic deletion timestamps on standard Neon branches. When the expiration time is reached, the branch is automatically deleted.

<Admonition type="tip" title="Quick guide">
API/CLI users set `expires_at` when creating or updating branches (see [timestamp format](#timestamp-format-requirements), such as `2025-07-15T18:02:16Z`). Console users toggle "Auto delete after".
</Admonition>

<InfoBlock>
<DocsList title="What you will learn:">
<p>When and why to use branch expiration</p>
<p>How to set expiration timestamps via API, CLI, and Console</p>
<p>Timestamp formatting and TTL behavior</p>
<p>Restrictions and best practices</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
<a href="/docs/guides/branching-neon-cli">Branching with the Neon CLI</a>
<a href="/docs/manage/branches#branching-with-the-neon-api">Branching with the Neon API</a>
<a href="/docs/manage/branches">Manage branches</a>
<a href="/docs/guides/branch-archiving">Branch archiving</a>
<a href="/docs/introduction/branching#branching-workflows">Branching workflows</a>
</DocsList>
</InfoBlock>

## Why use branch expiration?

Branch expiration is ideal for temporary branches that have predictable lifespans:

- **CI/CD environments** - Test branches that should clean up after pipeline completion
- **Feature development** - Time-boxed feature branches with known deadlines
- **Automated testing** - Ephemeral test environments created by scripts
- **AI workflows** - Temporary environments managed without human intervention

Without automatic expiration, these branches accumulate over time, increasing storage costs and project clutter.

### Recommended expiration times

- **CI/CD pipelines**: 2-4 hours
- **Demo environments**: 24-48 hours
- **Feature development**: 1-7 days
- **Long-term testing**: 30 days

## How it works

When you set an expiration timestamp on a branch:

1. The system stores both the expiration time (`expires_at`) and the time-to-live interval (`ttl_interval_seconds`)
2. A background process monitors branches and deletes them after their expiration time is reached
3. If you reset a branch from its parent, the TTL countdown restarts using the original interval

<Admonition type="important">
Branch deletion is irreversible. Once deleted, a branch and its data cannot be recovered. All compute endpoints associated with the branch are also deleted. Deletion typically occurs within minutes of the expiration time.
</Admonition>

## Setting branch expiration

You can set, update, or remove expiration timestamps through three interfaces:

- **API** - Use the `expires_at` parameter with [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format
- **CLI** - Use the `--expires-at` flag when creating branches or the `set-expires-at` subcommand to update
- **Neon Console** - Use the date and time selector (automatically handles formatting)

See the [Examples](#examples) section below for detailed usage of each method.

## Timestamp format requirements

The `expires_at` parameter must use [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format with second-level precision:

**Format patterns:**

```
YYYY-MM-DDTHH:MM:SSZ         (UTC)
YYYY-MM-DDTHH:MM:SS+HH:MM    (Positive UTC offset)
YYYY-MM-DDTHH:MM:SS-HH:MM    (Negative UTC offset)
```

**Valid examples:**

- `2025-07-15T18:02:16Z` (UTC)
- `2025-07-15T18:02:16-05:00` (Eastern Standard Time)
- `2025-07-15T18:02:16+09:00` (Japan Standard Time)

**Requirements:**

- Time zone is required (either `Z` or numeric offset, not both)
- Fractional seconds are optional but only second precision is stored
- Timestamp must be in the future
- Maximum expiration is 1 year from the current time

<Admonition type="note">
Common errors include missing timezone (`2025-07-15T18:02:16`), past timestamps, or combining `Z` with offset (`2025-07-15T18:02:16Z-05:00`). The API will return a validation error for invalid formats.
</Admonition>

## Understanding TTL behavior

When you retrieve branch information, responses include:

- **`expires_at`** - The scheduled deletion timestamp
- **`ttl_interval_seconds`** - The original time-to-live duration in seconds (read-only)

The TTL interval is preserved to ensure consistent behavior when resetting branches:

```json
{
  "branch": {
    "id": "br-feature-67890",
    "expires_at": "2025-07-15T18:02:16Z",
    "ttl_interval_seconds": 86400, // 24 hours
    "created_at": "2025-07-14T18:02:16Z"
  }
}
```

When you reset this branch from its parent, `expires_at` updates to the current time plus 24 hours, as 24 hours was the original interval.

## Restrictions

To maintain system integrity, expiration timestamps cannot be added to:

- **Protected branches** - Cannot expire protected branches or protect branches with expiration
- **Default branches** - Cannot expire default branches or set expiring branches as default
- **Parent branches** - Cannot expire branches that have children or create children from expiring branches

<Admonition type="note">
When a branch expires and is deleted, all associated compute endpoints are also deleted. Ensure any critical workloads are migrated before expiration.
</Admonition>

## Examples

### Creating a branch with expiration

<CodeTabs labels={["API", "CLI", "Neon Console"]}>

```bash
# Create branch that expires in 24 hours
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
       "branch": {
         "name": "feature-test",
         "parent_id": "br-main-12345",
         "expires_at": "2025-07-15T18:02:16Z"
       }
     }'

# Example response
{
  "branch": {
    "id": "br-feature-67890",
    "name": "feature-test",
    "parent_id": "br-main-12345",
    "expires_at": "2025-07-15T18:02:16Z",
    "ttl_interval_seconds": 86400,
    "created_at": "2025-07-14T18:02:16Z"
  }
}
```

```bash
# Create branch expiring at specific date/time
neon branches create \
  --project-id <project-id> \
  --name feature-test \
  --parent development \
  --expires-at "2025-07-15T18:02:16Z"

# Create branch expiring in 2 hours (using dynamic date)
# Linux/GNU: $(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%SZ)
# macOS/BSD: $(date -u -v+2H +%Y-%m-%dT%H:%M:%SZ)
neon branches create \
  --project-id <project-id> \
  --name ci-test \
  --parent development \
  --expires-at "$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%SZ)"
```

```markdown
1. Navigate to the Branches page in the Neon Console
2. Click "Create branch"
3. Enter branch name and select parent branch
4. Toggle "Auto delete after" and set a value
5. Click "Create branch"
```

</CodeTabs>

### Updating branch expiration

<CodeTabs labels={["API", "CLI", "Neon Console"]}>

```bash
# Update branch expiration to specific date
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id} \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
       "branch": {
         "expires_at": "2025-07-20T12:00:00Z"
       }
     }'

# Remove expiration from a branch
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id} \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
       "branch": {
         "expires_at": null
       }
     }'
```

```bash
# Update expiration to new timestamp
neon branches set-expires-at <branch-id> "2025-07-20T12:00:00Z" --project-id <project-id>

# Extend expiration by 7 days from now
# Linux/GNU: $(date -u -d '+7 days' +%Y-%m-%dT%H:%M:%SZ)
# macOS/BSD: $(date -u -v+7d +%Y-%m-%dT%H:%M:%SZ)
neon branches set-expires-at <branch-id> \
  "$(date -u -d '+7 days' +%Y-%m-%dT%H:%M:%SZ)" \
  --project-id <project-id>

# Remove expiration from a branch
neon branches set-expires-at <branch-id> null --project-id <project-id>
```

```markdown
1. Navigate to the Branches page in the Neon Console
2. Find the branch you want to modify
3. Click the three-dot menu (...) next to the branch
4. Select "Edit expiration"
5. To update: Select a new expiration value
6. To remove: Toggle off "Auto delete after"
```

</CodeTabs>

### Retrieving branch information

Check expiration status of your branches:

<CodeTabs labels={["API", "CLI"]}>

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id} \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY"
```

```bash
neon branches info <branch_id> --project-id <project_id>
```

</CodeTabs>

## API reference

### Create project branch

[`POST /projects/{project_id}/branches`](https://api-docs.neon.tech/reference/createprojectbranch)

- **`expires_at`** (optional) - Timestamp for automatic deletion in RFC 3339 format

### Update project branch

[`PATCH /projects/{project_id}/branches/{branch_id}`](https://api-docs.neon.tech/reference/updateprojectbranch)

- **`expires_at`** (optional, nullable) - Update or remove expiration
  - Timestamp value: Sets/updates expiration
  - `null`: Removes expiration
  - Omitted: No change

### Response fields

Branches with expiration include:

- **`expires_at`** - Scheduled deletion timestamp (RFC 3339 format)
- **`ttl_interval_seconds`** - Original TTL duration in seconds (read-only)

<NeedHelp/>
