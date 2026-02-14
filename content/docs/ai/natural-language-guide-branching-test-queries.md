---
title: Test queries on a branch
subtitle: Create a branch, run a query safely, then delete the branch using natural language
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to create a Neon branch from
  production, test a potentially destructive query on the branch, and delete the
  branch when done—with the Neon MCP Server.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

Testing queries that change data or schema (for example, `DELETE`, `UPDATE`, or `ALTER TABLE`) on production can be risky. With Neon, you can create a **branch** that gets a copy of your production data, run the query on the branch, verify the result, and delete the branch when you're done. This guide uses natural language prompts so your AI assistant can do these steps via the [Neon MCP Server](/docs/ai/neon-mcp-server). Run the install command in your **terminal** once; then run the prompts below in your **AI chat** (Cursor or Claude Code). For the full manual workflow (Console, CLI, API), see [Branching — Testing queries](/docs/guides/branching-test-queries).

## Create a branch, test a query, then delete the branch

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal**:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills in your editor so your assistant can manage Neon from the chat. Restart your editor, then open your AI assistant. Learn more: [neonctl init](/docs/reference/cli-init).

## Create a test branch

Create a branch from your production branch. The branch gets a copy of the parent's data so you can run queries without affecting production. Replace `[project-name]` with your project; use a branch name like `test-queries` or `my_test_branch`:

```text
In my project [project-name], create a branch called test-queries from the production branch
```

The assistant uses the MCP `create_branch` tool. **Verify:** The assistant shows the new branch and its connection details in the chat. You can also see it under **Branches** in the [Neon Console](https://console.neon.tech).

## Run your query on the test branch

Run your potentially destructive query on the test branch only. Replace `[project-name]` and the SQL with your query:

```text
In my project [project-name] on branch test-queries, run: [your SQL]
```

Example—test a DELETE before running it in production:

```text
In my project my-app on branch test-queries, run: DELETE FROM Post WHERE author_name = 'Alice' AND date_published < '2020-01-01';
```

The assistant runs the SQL on the branch via MCP. **Verify:** The assistant shows the query result in the chat. Production is unchanged.

## Verify the result (optional)

Inspect data on the branch to confirm the query did what you expected. For example, check row counts or run a SELECT:

```text
On branch test-queries in my project [project-name], run: SELECT COUNT(*) FROM Post;
```

Adjust the table and query to match your schema. When you're satisfied, proceed to delete the test branch.

## Delete the test branch

When you're done testing, remove the branch:

```text
Delete branch test-queries in my project [project-name]
```

The assistant uses the MCP tool to delete the branch. **Verify:** The assistant confirms the branch was deleted. In the [Neon Console](https://console.neon.tech), the branch no longer appears under **Branches**.

</Steps>

<Admonition type="tip" title="Sensitive data?">
Neon supports [schema-only branching](/docs/guides/branching-schema-only) so you can test schema changes without copying production data. For testing data-modifying queries, use a full branch (as in this guide) or a branch with a subset of data if your workflow supports it.
</Admonition>

## See also

- [Branching — Testing queries](/docs/guides/branching-test-queries) for the same workflow in the Console, CLI, or API
- [Branching development workflow](/docs/ai/natural-language-guide-branching-workflow) for the full develop-on-branch and migrate-to-production flow
- [Branches and schema changes](/docs/ai/natural-language-guide-branches-schema) for prompt reference (create branch, run SQL on branch, delete branch)

<NeedHelp/>
