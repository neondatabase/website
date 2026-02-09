---
title: Branches and schema changes
subtitle: Prompt reference for branches, schema, and migrations with natural language
summary: >-
  Copy-paste prompts for creating branches, running schema changes, comparing
  diffs, and migrating—when you already have a Neon project.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

**For the full end-to-end workflow** (create a project, create a table, branch, change schema, schema diff, migrate to production, delete branch), follow **[Branching development workflow](/docs/ai/natural-language-guide-branching-workflow)**. That guide is the single tutorial for the complete flow.

This page is a **prompt reference** for when you already have a Neon project and need to run a specific branch or schema action. Run the install command in your **terminal** once (`npx neonctl@latest init`), then use the prompts below in your **AI chat** (Cursor or Claude Code) with the [Neon MCP Server](/docs/ai/neon-mcp-server) connected. Replace `[project-name]`, `[branch-name]`, and any SQL as needed.

## Create a branch

```text
Create a branch called [branch-name] from the production branch in my project [project-name]
```

The assistant uses the MCP `create_branch` tool. You can then run schema changes on this branch.

## Run SQL on a branch

Run DDL or queries on a specific branch so production is unchanged:

```text
In my project [project-name] on branch [branch-name], run: [your SQL]
```

Example: `In my project my-app on branch feature/notes, run: ALTER TABLE notes ADD COLUMN updated_at TIMESTAMPTZ;`

## Compare schema to parent (schema diff)

See what’s different between a branch and its parent before or after changes:

```text
Show the schema diff between branch [branch-name] and its parent in my project [project-name]
```

The assistant uses `compare_database_schema`. You can also use **Schema diff** on the branch in the [Neon Console](https://console.neon.tech).

## Apply branch schema to production (migration)

To apply schema changes from a feature branch to your production branch, use the same flow as in [Branching development workflow](/docs/ai/natural-language-guide-branching-workflow):

1. **Prepare:** `Prepare a migration from branch [branch-name] to apply its schema changes to my production branch; show me the plan`
2. **Complete:** `Complete the migration and apply it to my production branch`

The assistant uses `prepare_database_migration` and `complete_database_migration`. In Neon, the default branch is typically named **production**.

## Reset a branch to match parent

Discard changes on a branch so it matches its parent again (useful if you want to reuse the branch without applying the migration):

```text
Reset branch [branch-name] to match its parent in my project [project-name]
```

The assistant uses `reset_from_parent`. Optional backup is available if the branch has children; see [Reset a branch from parent](/docs/guides/reset-from-parent).

## Delete a branch

Remove a branch when you no longer need it (for example, after migrating its changes to production):

```text
Delete branch [branch-name] in my project [project-name]
```

The assistant deletes the branch. This is the same action as the final step in [Branching development workflow](/docs/ai/natural-language-guide-branching-workflow).

## See also

- [Branching development workflow](/docs/ai/natural-language-guide-branching-workflow) for the full end-to-end tutorial
- [Introduction to branching](/docs/introduction/branching) for Neon branching concepts
- [Schema Diff](/docs/guides/schema-diff) for comparing branches in the Console
- [Explore projects and run SQL](/docs/ai/natural-language-guide-explore-sql) for listing projects and running queries

<NeedHelp/>
