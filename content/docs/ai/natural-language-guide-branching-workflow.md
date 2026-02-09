---
title: Branching development workflow
subtitle: Create a project, branch, change schema, and migrate to production using natural language
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to follow Neon's branching
  workflow: create a project and table, create a feature branch, change schema,
  compare with Schema Diff, apply the migration to production, and delete the branch.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

This guide walks through the [branching development workflow](/docs/get-started/signing-up#working-with-your-development-branch): create a project and a table on the default branch, create a feature branch, modify the schema (add a column), run a schema diff, apply the migration to production, run a schema diff again to confirm, then delete the feature branch. You run the install command in your **terminal** once; then run the prompts below in your **AI chat** (Cursor or Claude Code) with the [Neon MCP Server](/docs/ai/neon-mcp-server) connected. After you create the project in step 2, the assistant has project context—you don't need to specify the project name in later prompts.

## Create a project and table, then branch and migrate

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal**:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills in your editor so your assistant can manage Neon from the chat. Restart your editor, then open your AI assistant. Learn more: [neonctl init](/docs/reference/cli-init).

## Create a project

Create a Neon project so the assistant has a project to work with for the rest of the guide. Use any name (for example, `my-branching-demo`):

```text
Create a Neon project named my-branching-demo
```

The assistant uses MCP to create the project. **Verify:** The assistant confirms the project was created and shows connection details. You can also see it under **Projects** in the [Neon Console](https://console.neon.tech). The assistant will use this project in the following steps.

## Create a table in the default database

Create a simple table on the default (main) branch so you have a baseline schema to branch from. Run this in the project you just created:

```text
In the default database, run: CREATE TABLE notes (id SERIAL PRIMARY KEY, title TEXT, created_at TIMESTAMPTZ DEFAULT now());
```

The assistant runs the SQL on the main branch's default database (typically `neondb`). **Verify:** The assistant confirms the table was created. You can check **Tables** for the main branch in the [Neon Console](https://console.neon.tech).

## Create a branch

Create a feature branch from the production (main) branch. Use a name like `feature/notes` or `dev/demo`:

```text
Create a branch called feature/notes from the production branch
```

The assistant uses the MCP `create_branch` tool. Your feature branch gets its own connection string and is isolated from production. **Verify:** The assistant shows the new branch in the chat. You can also see it under **Branches** in the [Neon Console](https://console.neon.tech).

## Add a column on the feature branch

Modify the schema on the feature branch only; production is unchanged. Run:

```text
On branch feature/notes, run: ALTER TABLE notes ADD COLUMN updated_at TIMESTAMPTZ;
```

The assistant runs the SQL on the feature branch. **Verify:** The assistant confirms the SQL ran. You can ask "Show the schema of the notes table" for that branch, or check **Tables** for the branch in the [Neon Console](https://console.neon.tech).

## Schema diff

Compare the feature branch to its parent (main) and see the diff in the chat:

```text
Show the schema diff between branch feature/notes and its parent
```

The assistant uses `compare_database_schema` and returns the diff (for example, the new `updated_at` column on `notes`). **Verify:** The schema diff is displayed in the chat. You can also use **Schema diff** on the branch in the [Neon Console](https://console.neon.tech).

## Apply the migration to production (main)

When you're satisfied with the schema on the feature branch, apply it to production:

```text
Prepare a migration from branch feature/notes to apply its schema changes to main; show me the plan
```

The assistant uses `prepare_database_migration` (or guides you through the same steps). Then:

```text
Complete the migration and apply it to main
```

The assistant uses `complete_database_migration` to merge the migration into main and clean up. **Verify:** The assistant confirms the migration was applied. Check the main branch in the [Neon Console](https://console.neon.tech) **Branches** and **Tables** to see the updated schema.

## Schema diff (confirm production)

Run a schema diff again to confirm production (main) matches the feature branch:

```text
Show the schema diff between branch feature/notes and its parent
```

After the migration, the diff should be empty—main and the feature branch now have the same schema. **Verify:** The schema diff is displayed in the chat (no changes).

## Delete the feature branch

The changes are now on production and the feature branch is no longer needed. You can delete it:

```text
Delete branch feature/notes
```

The assistant deletes the feature branch. **Verify:** The assistant confirms the branch was deleted. In the [Neon Console](https://console.neon.tech), the branch no longer appears under **Branches**.

</Steps>

<Admonition type="tip" title="Tip">
This mirrors the workflow in [Working with your development branch](/docs/get-started/signing-up#working-with-your-development-branch): create project and table, create branch, change schema, Schema Diff, migrate to production, then clean up. If you prefer to keep the feature branch for reuse instead of deleting it, you can [reset it from parent](/docs/guides/reset-from-parent) so it matches main.
</Admonition>

## See also

- [Database branching workflow primer](/docs/get-started/workflow-primer) for branching concepts and naming
- [Schema Diff](/docs/guides/schema-diff) for comparing branches in the Console
- [Branches and schema changes](/docs/ai/natural-language-guide-branches-schema) for more MCP branch and migration prompts
- [Reset a branch from parent](/docs/guides/reset-from-parent) if you want to reuse a branch instead of deleting it

<NeedHelp/>
