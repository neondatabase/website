---
title: TTL branches
subtitle: Automatic branch deletion with expiration timestamps
enableTableOfContents: true
updatedOn: '2025-07-09T00:00:00.000Z'
---

## Overview

TTL (time-to-live) branches are standard Neon branches with an expiration timestamp. Any existing branch can be updated to become a TTL branch by setting an expiration timestamp. When the expiration time is reached, the branch is automatically deleted.

<InfoBlock>
<DocsList title="What you will learn:">
<p>TTL branch concepts and automatic deletion</p>
<p>API usage with expiration timestamps</p>
<p>Integration methods (API, CLI, and Console)</p>
<p>Best practices for temporary branches</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
<a href="/docs/guides/branching-neon-cli">Branching with the Neon CLI</a>
<a href="/docs/manage/branches#branching-with-the-neon-api">Branching with the Neon API</a>
<a href="/docs/manage/branches">Manage branches</a>
<a href="/docs/guides/branch-archiving">Branch archiving</a>
<a href="/docs/introduction/branching#branching-workflows">Branching workflows</a>
</DocsList>
</InfoBlock>

## Purpose and benefits

Developers frequently create short-lived branches for:
- CI/CD pipeline testing environments
- Feature development with known lifespans
- Automated testing scenarios
- AI-driven development workflows

Manual cleanup is often overlooked, leading to unnecessary storage costs. By setting an expiration timestamp on branches using the `expires_at` parameter, automatic deletion is ensured.

### Key benefits

- Enhances developer productivity by eliminating manual deletions for temporary branches.
- Prevents stale or abandoned branches from accumulating in your project.
- Supports AI-driven development workflows by automatically managing ephemeral environments without human intervention.
- Provides flexible implementation where any branch can be converted to or from a TTL branch as needed.

## How it works

TTL functionality is implemented by storing expiration information alongside branch data. This design allows any normal branch to have an expiration timestamp added or removed at any time.

When you set an expiration timestamp:
- The system stores both the expiration time and the TTL interval.
- A background process checks for expired branches and deletes them when applicable.
- Branches are automatically deleted after their expiration time is reached.

When resetting a branch from its parent:
- The TTL countdown resets.
- `expires_at` is updated to the time of reset plus the original TTL interval.
- This ensures consistent behavior for branches used in automated workflows.

## Examples

### Creating a TTL branch

<CodeTabs labels={["API", "CLI", "Console"]}>

```bash
# Example: Create a branch that expires in 24 hours
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
# Example 1: Create branch expiring at a specific date and time
neon branches create \
  --project-id <project-id> \
  --name feature-test \
  --parent development \
  --expires-at "2025-07-15T18:02:16Z"

# Example 2: Create branch expiring in 2 hours
# Note: Use the appropriate command for your platform
neon branches create \
  --project-id <project-id> \
  --name ci-test \
  --parent development \
  --expires-at "$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%SZ)"  # Linux/GNU
  # --expires-at "$(date -u -v+2H +%Y-%m-%dT%H:%M:%SZ)"        # macOS/BSD
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

<CodeTabs labels={["API", "CLI", "Console"]}>

```bash
# Example 1: Update branch expiration to a specific date
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

# Example 2: Remove expiration from a branch
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
# Example 1: Update expiration to a new timestamp
neon branches set-expires-at <branch-id> "2025-07-20T12:00:00Z" --project-id <project-id>

# Example 2: Extend expiration by 7 days from now
# Note: Use the appropriate command for your platform
neon branches set-expires-at <branch-id> "$(date -u -d '+7 days' +%Y-%m-%dT%H:%M:%SZ)" --project-id <project-id>  # Linux/GNU
# neon branches set-expires-at <branch-id> "$(date -u -v+7d +%Y-%m-%dT%H:%M:%SZ)" --project-id <project-id>  # macOS/BSD

# Example 3: Remove expiration from a branch
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

## Capabilities

### Managing branch expiration

You can set, update, or remove expiration timestamps on branches through multiple interfaces:

- **API** - Use the `expires_at` parameter with [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format when creating or updating branches (see [API reference](#api-reference)).
- **CLI** - Use the `--expires-at` flag when creating branches or the `set-expires-at` subcommand to update expiration timestamps (see [timestamp format](#timestamp-format)).
- **Console** - Use the date and time selector in the Neon Console to set or update expiration dates (automatically handles formatting).

**Supported operations:**
- Set an expiration when creating a branch.
- Add an expiration to an existing branch.
- Update an expiration timestamp.
- Remove an expiration to revert to a standard branch.

### Automatic behavior

- Branches with an expiration timestamp are automatically deleted after the expiration time.
- When a branch with TTL is reset from its parent, the expiration countdown restarts using the original TTL interval.

> **Important:** Branch deletion is irreversible. Once deleted, a branch and its data cannot be recovered.

### Retrieving branch information

<CodeTabs labels={["API", "CLI"]}>

```bash
# Retrieve branch details
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id} \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY"

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
# Retrieve branch details using the Neon CLI
neon branches info <branch-id> --project-id <project-id>
```

</CodeTabs>

## Restrictions

The following restrictions apply to ensure system integrity:

- **[Protected branches](/docs/guides/protected-branches)** - You cannot add expiration timestamps to protected branches, and you cannot mark a branch that has an expiration timestamp as protected.
- **[Default branches](/docs/manage/branches#default-branch)** - You cannot add expiration timestamps to default branches, and you cannot set a branch that has an expiration timestamp as the default branch.
- **[Branch hierarchies](/docs/manage/branches#branch-types)** - You cannot create child branches from a branch that has an expiration timestamp, and you cannot add an expiration timestamp to a parent branch that already has children.

## API reference

### Timestamp format

When using the API or CLI, the `expires_at` parameter must be provided in [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format with second-level precision.

**Format pattern:**
```
YYYY-MM-DDTHH:MM:SSZ          (UTC)
YYYY-MM-DDTHH:MM:SS+HH:MM     (Positive UTC offset)
YYYY-MM-DDTHH:MM:SS-HH:MM     (Negative UTC offset)
```

**Valid examples:**
- `2025-07-15T18:02:16Z`      (UTC)
- `2025-07-15T18:02:16+00:00` (UTC with offset notation)
- `2025-07-15T18:02:16-05:00` (Eastern Standard Time)
- `2025-07-15T18:02:16+09:00` (Japan Standard Time)

**Requirements:**
- Time zone is required (either `Z` for UTC or a numeric offset).
- Cannot use both `Z` and offset (e.g., `2025-07-15T18:02:16Z-05:00` is invalid).
- Fractional seconds are optional, but only second-level precision is stored.

> The Neon Console provides a date and time selector that automatically formats timestamps correctly. The format requirements above apply when using the API or CLI directly.

### Create project branch

The [`Create project branch`](https://api-docs.neon.tech/reference/createprojectbranch) endpoint supports creating branches with expiration:

- **`expires_at`** (optional) - Sets when the branch should expire and be automatically deleted. See [timestamp format](#timestamp-format) for formatting requirements.

### Update project branch

The [`Update project branch`](https://api-docs.neon.tech/reference/updateprojectbranch) endpoint supports modifying branch expiration:

- **`expires_at`** (optional, nullable) - Controls the branch expiration timestamp. See [timestamp format](#timestamp-format) for formatting requirements.

| Value | Effect |
|-------|--------|
| Timestamp | Sets or updates the branch expiration |
| `null` | Removes the expiration timestamp |
| Omitted | No change to expiration |

When updating a branch with a new `expires_at` timestamp:
- The new timestamp and new TTL interval are stored.
- The new TTL interval is calculated from the moment of the update.

### Response attributes

When a branch has an expiration timestamp set, all responses that return branch information will include:

- **`expires_at`** - The timestamp when the branch is scheduled to expire and be automatically deleted. Returned in [RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6) format (e.g., `2025-07-15T18:02:16Z`).

- **`ttl_interval_seconds`** - The time-to-live (TTL) duration originally configured for the branch, in seconds. This read-only value represents the interval between the time `expires_at` was set and the expiration timestamp itself. It is preserved to ensure the same TTL duration is reapplied when resetting the branch from its parent, and only updates when a new `expires_at` value is set.