---
title: Schema diff
subtitle: Learn how to use Neon's Schema Diff tool to compare branches of your database
enableTableOfContents: true
updatedOn: '2024-09-27T18:08:38.285Z'
---

Neon's Schema Diff tool lets you compare an SQL script of the schemas for two selected branches in a side-by-side view (or line-by-line on mobile devices).

## How Schema Diff works

Schema Diff is available in the Neon Console for use in two ways:

- Compare a branch's schema to its parent
- Compare selected branches during a branch restore operation

You can also use the `branches schema-diff` command in the Neon CLI to effect a variety of comparisons.

### Compare to parent

In the detailed view for any child branch, you can check the schema differences between the selected branch and its parent. Use this view to verify the state of these schemas before you [Reset from parent](/docs/guides/reset-from-parent).

### Compare to another branch's history

Built into the Time Travel assist editor, you can use Schema Diff to help when restoring branches, letting you compare states of your branch against its own or another branch's history before you complete a [branch restore](/docs/guides/branch-restore) operation.

### Comparisons using the CLI

You can use the Neon CLI to compare a branch to any point in its own or any other branch's history. The `branches schema-diff` command offers full flexibility for any type of schema comparison: between a branch and its parent, a branch and its earlier state, or a branch to the head or prior state of another branch.

### Practical Applications

- **Pre-Migration Reviews**: Before migrating schemas from a development branch into main, use Schema Diff to ensure only intended schema changes are applied.
- **Audit Changes**: Historically compare schema changes to understand the evolution of your database structure.
- **Consistency Checks**: Ensure environment consistency by comparing schemas across development, staging, and production branches.
- **Automation**: Integrate schema-diff into CI/CD pipelines to automatically compare schemas during deployments.

## How to Use Schema Diff

You can launch the Schema Diff viewer from the **Branches** and **Restore** pages in the Neon Console.

### From the Branches page

Open the detailed view for the branch whose schema you want to inspect. In the row of details for the parent branch, under the **COMPARE TO PARENT** block, click **Open schema diff**.

![Schema diff from branches page](/docs/guides/schema_diff_compare_parent.png)

### From the Restore page

Just like with [Time Travel Assist](/docs/guides/branch-restore#using-time-travel-assist), your first step is to choose the branch you want to restore, then choose where you want to restore from: **From history** (its own history) or ** From another branch** (from another branch's history).

Click the **Schema Diff** button, verify that your selections are correct, then click **Compare**.

The two-pane view shows the schema for both your target and your selected branches.

![schema diff results](/docs/guides/schema_diff_result.png)

### Using the Neon CLI

You can use the Neon CLI to:

- Compare the latest schemas of any two branches
- Compare against a specific point in its own or another branch’s history

Use the `schema-diff` subcommand from the `branches` command:

```bash
neon branches schema-diff [base-branch] [compare-source[@(timestamp|lsn)]]
```

The operation will compare a selected branch (`[compare-source]`) against the latest (head) of your base branch (`[base-branch]`). For example, if you want to compare recent changes you made to your development branch `dev/alex` against your production branch `main`, identify `main` as your base branch and `dev/alex` as your compare-source.

```bash
neon branches schema-diff main dev/alex
```

You have a few options here:

- Append a timestamp or LSN to compare to a specific point in `dev/alex` branch's history.
- If you are regularly comparing development branches against `main`, include `main` in your `set-context` file. You can then leave out the [base-branch] from the command.
- Use aliases to shorten the command.
- Include `--database` to reduce the diff to a single database. If you don't specify a database, the diff will include all databases on the branch.

Here is the same command using aliases, with `main` included in `set-context`, pointing to an LSN from `dev/alex` branch's history, and limiting the diff to the database `people`:

```bash
neon branch sd dev/alex@0/123456 --db people
```

To find out what other comparisons you can make, see [Neon CLI commands — branches](/docs/reference/cli-branches#schema-diff) for full documentation of the command.

### Understanding the Output

- **+ Green Highlight**: Indicates additions or new elements in the schema.
- **- Red Highlight**: Marks deletions or removed elements from the schema.

## Schema Diff GitHub Action

Neon supports a [Schema Diff GitHub Action](/docs/guides/branching-github-actions#schema-diff-action) that performs a database schema diff on specified Neon branches for each pull request and writes a comment to the pull request highlighting the schema differences.

This action supports workflows where schema changes are made on a development branch, and pull requests are created for review before merging the changes back into the main branch. By including schema changes as a comment in the pull request, reviewers can easily assess the differences directly within the pull request.

To learn more, see the [Schema Diff GitHub Action](/docs/guides/branching-github-actions#schema-diff-action).

## Tutorial

For a step-by-step guide showing you how to compare two development branches using Schema Diff, see [Schema diff tutorial](/docs/guides/schema-diff-tutorial).
