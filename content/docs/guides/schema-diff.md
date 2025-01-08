---
title: Schema diff
subtitle: Learn how to use Neon's Schema Diff tool to compare branches of your database
enableTableOfContents: true
updatedOn: '2025-01-06T23:39:35.459Z'
---

Neon's Schema Diff tool lets you compare an SQL script of the schemas for two selected branches in a side-by-side view (or line-by-line on mobile devices).

## How Schema Diff works

Schema Diff is available in the Neon Console for use in two ways:

- Compare a branch's schema to its parent
- Compare selected branches during a branch restore operation

You can also use the `branches schema-diff` command in the Neon CLI or `compare-schema` endpoint in the Neon API to effect a variety of comparisons.

### Compare to parent

In the detailed view for any child branch, you can check the schema differences between the selected branch and its parent. Use this view to verify the state of these schemas before you [Reset from parent](/docs/guides/reset-from-parent).

### Compare to another branch's history

Built into the Time Travel assist editor, you can use Schema Diff to help when restoring branches, letting you compare states of your branch against its own or another branch's history before you complete a [branch restore](/docs/guides/branch-restore) operation.

### Comparisons using the CLI or API

You can use the Neon CLI to compare a branch to any point in its own or any other branch's history. The `branches schema-diff` command offers full flexibility for any type of schema comparison: between a branch and its parent, a branch and its earlier state, or a branch to the head or prior state of another branch. The Neon API provides a `compare-schema` endpoint that lets you compare schemas between Neon branches programmatically, supporting CI/CD automation and AI agent use cases.

### Practical Applications

- **Pre-Migration Reviews**: Before migrating schemas from a development branch into main, use Schema Diff to ensure only intended schema changes are applied.
- **Audit Changes**: Historically compare schema changes to understand the evolution of your database structure.
- **Consistency Checks**: Ensure environment consistency by comparing schemas across development, staging, and production branches.
- **Automation**: Integrate schema-diff into CI/CD pipelines to automatically compare schemas during deployments.
- **AI Agents**: Enable AI agents to retrieve schema differences programmatically to support agent-driven database migrations.

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

### Using the Neon API

The [compare_schema](https://api-docs.neon.tech/reference/getprojectbranchschemacomparison) endpoint lets you compare schemas between Neon branches to track schema changes. The response highlights differences in a `diff` format, making it a useful tool for integrating schema checks into CI/CD workflows.

Another use case for schema diff via the Neon API is AI agent-driven workflows. The `compare_schema` endpoint allows AI agents to programmatically retrieve schema differences by comparing two branches.

To compare schemas between two branches, you can cURL command similar to the one below, which compares the schema of a target branch to the schema of a base branch. For example, the target branch could be a development branch where a schema change was applied, and the base branch could be the parent of the development branch. By comparing the two, you can inspect the changes that have been made on the development branch.

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/wispy-butterfly-25042691/branches/br-rough-boat-a54bs9yb/compare_schema?base_branch_id=br-royal-star-a54kykl2&db_name=neondb' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq -r '.diff'
```

The `compare_schema` endpoint supports the following parameters:

| Parameter          | Description                                                                               | Required | Example                    |
| ------------------ | ----------------------------------------------------------------------------------------- | -------- | -------------------------- |
| `<project_id>`     | The ID of your Neon project.                                                              | Yes      | `wispy-butterfly-25042691` |
| `<branch_id>`      | The ID of the target branch to compare — the branch with the modified schema.             | Yes      | `br-rough-boat-a54bs9yb`   |
| `<base_branch_id>` | The ID of the base branch for comparison.                                                 | Yes      | `br-royal-star-a54kykl2`   |
| `<db_name>`        | The name of the database in the target branch.                                            | Yes      | `neondb`                   |
| `lsn`              | The LSN on the target branch for which the schema is retrieved.                           | No       | `0/1EC5378`                |
| `timestamp`        | The point in time on the target branch for which the schema is retrieved.                 | No       | `2022-11-30T20:09:48Z`     |
| `base_lsn`         | The LSN for the base branch schema.                                                       | No       | `0/2FC6321`                |
| `base_timestamp`   | The point in time for the base branch schema.                                             | No       | `2022-11-30T20:09:48Z`     |
| `Authorization`    | Bearer token for API access (your [Neon API key](https://neon.tech/docs/manage/api-keys)) | Yes      | `$NEON_API_KEY`            |

<Admonition type="note" title="notes">
- The optional `jq -r '.diff'` command APPENDED TO THE EXAMPLE ABOVE extracts the diff field from the JSON response and outputs it as plain text to make it easier to read. This command is not  necessary when using the endpoint programmatically.
- `timestamp` or `lsn` / `base_timestamp` or `base_lsn` values can be used to compare schemas as they existed as a precise time or [LSN](/docs/reference/glossary#lsn).  
- `timestamp` / `base_timestamp` values must be provided in <LinkPreview href="https://en.wikipedia.org/wiki/ISO_8601" title="ISO 8601" preview="An international standard covering the worldwide exchange and communication of date and time-related data.">ISO 8601 format</LinkPreview>.
</Admonition>

Here’s an example of the `compare_schema` diff output for the `neondb` database after comparing target branch `br-rough-boat-a54bs9yb` with the base branch `br-royal-star-a54kykl2`.

```diff
--- a/neondb
+++ b/neondb
@@ -27,7 +27,8 @@
 CREATE TABLE public.playing_with_neon (
     id integer NOT NULL,
     name text NOT NULL,
-    value real
+    value real,
+    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
 );
```

**Output explanation:**

- `-` (minus) identifies Lines that were removed from the base branch schema.
- `+` (plus) identifies lines that were added in the target branch schema.

In the example above, the `created_at` column was added to the `public.playing_with_neon` table on the target branch.

## Schema Diff GitHub Action

Neon supports a [Schema Diff GitHub Action](/docs/guides/branching-github-actions#schema-diff-action) that performs a database schema diff on specified Neon branches for each pull request and writes a comment to the pull request highlighting the schema differences.

This action supports workflows where schema changes are made on a branch. When you create or update a pull request containing schema changes, the action automatically generates a comment within the pull request. By including the schema diff as part of the comment, reviewers can easily assess the changes directly within the pull request.

To learn more, see the [Schema Diff GitHub Action](/docs/guides/branching-github-actions#schema-diff-action).

## Tutorial

For a step-by-step guide showing you how to compare two development branches using Schema Diff, see [Schema diff tutorial](/docs/guides/schema-diff-tutorial).
