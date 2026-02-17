---
title: Reset from parent
subtitle: Learn how to reset a branch from its parent
summary: >-
  Covers the process of resetting a branch in Neon to match the latest schema
  and data from its parent branch, allowing for quick updates and
  synchronization without preserving local changes.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.042Z'
---

Neon's **Reset from parent** feature lets you instantly reset all databases on a branch to the latest schema and data from its parent branch, helping you recover from issues, start on new feature development, or keep the different branches in your environment in sync.

## Example scenario

When working with database branches, you might find yourself in a situation where you need to update your working branch to the latest data from your production branch.

For example, let's say you have two child branches `staging` and `development` forked from your `production` branch. You have been working on the `development` branch and find it is now too far out of date with `production`.

You have no schema changes in `development` to consider or preserve; you just want a quick refresh of the data. With the **Reset from parent** feature, you can perform a clean, instant reset to the latest data from the parent in a single operation, saving you the complication of manually creating and restoring branches.

## How Reset from parent works

When you reset a branch to its parent, the data and schema is completely replaced with the latest data and schema from its parent.

### Key points

- You can only reset a branch to the latest data from its parent. Point-in-time resets based on timestamp or LSN are possible using [Instant restore](/docs/introduction/branch-restore), a similar feature, with some differences: instant restore leaves a backup branch and is in general is intended more for data recovery than development workflow.
- This reset is a complete overwrite, not a refresh or a merge. Any local changes made to the child branch are lost during this reset.
- Existing connections will be temporarily interrupted during the reset. However, your connection details _do not change_. All connections are re-established as soon as the reset is done.
- Root branches (like your project's `production` branch or schema-only branches) cannot be reset because they have no parent branch to reset to.

### Branch expiration behavior

When you reset a branch that has an expiration set, the expiration timer restarts from the reset time using the original duration.

For example, if your branch was originally set to expire in 24 hours, resetting gives it another full 24 hours from the reset time. This process recalculates the new `expires_at` value using the preserved `ttl_interval_seconds`, but the TTL interval itself remains unchanged.

For more details about branch expiration, see [branch expiration](/docs/guides/branch-expiration).

## How to Reset from parent

You can reset any branch to its parent using any of our tools.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
On the **Branches** page in the Neon Console, select the branch that you want to reset.

The console opens to the details page for your branch, giving you key information about the branch and its child status: its parent, the last time it was reset, and other relevent detail.

To reset the branch, select **Reset from parent** from the **Actions** menu or the **Last data reset** panel.

![Reset from parent](/docs/manage/reset_from_parent.png)

<Admonition type="note">
If this branch has children of its own, resetting is blocked. The resulting error dialog lets you delete these child branches, after which you can continue with the reset.
</Admonition>

</TabItem>

<TabItem>
Using the CLI, you can reset a branch from parent using the following command:

```bash
neon branches reset <id|name> --parent
```

In the `id|name` field, specify the branch ID or name of the child branch whose data you want to reset. The `--parent` parameter is a boolean specifying the kind of reset action that Neon will perform.

If you have multiple projects in your account, you'll also have to include the `project-id` in the command along with the branch.

```bash
neon branches reset <id|name> --parent --project-id <project id>
```

Example:

```bash
neon branches reset development --parent --project-id noisy-pond-12345678
```

Alternatively, you can set the `project-id` as a background context for your CLI session, letting you perform other actions against that project without having to include the `project-id` in every command. The setting is saved in a `context-file` and remains in place until you set a new context, or you remove the `context-file`.

```bash
neon set-context --project-id <project id>
```

Read more about performing branching actions from the CLI in [CLI - branches](/docs/reference/cli-branches), and more about setting contexts in [CLI - set-context](/docs/reference/cli-set-context).

</TabItem>

<TabItem>
To reset a branch to its parent using the API, use the [Restore branch](https://api-docs.neon.tech/reference/restoreprojectbranch) endpoint, specifying the parent branch ID as the `source_branch_id`:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{NEON_PROJECT_ID}/branches/{BRANCH_ID}/restore \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "source_branch_id": "br-autumn-tree-a4a9k5g8"
}
'
```

For details, see [Instant restore using the API](/docs/introduction/branch-restore#how-to-use-instant-restore)

</TabItem>

</Tabs>

## Integrating branch resets in CI/CD workflows

You can include resetting database branches as part of your CI/CD workflow. For example, when **starting a new feature** or **refreshing staging**.

### For new features

Start feature development with a clean slate by resetting your development branch to align with staging or production (whichever is its parent). This replaces the branch's current state with the parent's latest data and schema. Use the command:

```bash
neon branches reset dev-branch --parent
```

This strategy preserves a stable connection string for your development environment, while still ensuring every new feature begins with a fully updated and consistent environment.

### Refresh staging

Reset **staging** to match its parent branch (i.e., **production**) for a reliable testing baseline. Automate staging updates with:

```bash
neon branches reset staging --parent
```

This ensures staging accurately reflects the current production state for reliable testing.

## Limitations

- **Reset from parent is unavailable for up to 24 hours after a parent is restored from a snapshot.** If a parent branch is restored from a snapshot, its child branches cannot be reset from that parent for up to 24 hours. If you need to update a child branch during this period, consider using [Instant restore](/docs/introduction/branch-restore) to restore the child branch from the parent directly.
