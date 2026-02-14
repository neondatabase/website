---
title: Time Travel
subtitle: Query data at a point in time using natural language
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to create a branch at a
  point in time, run read-only queries against that state, and clean up—or use
  the Console/CLI for ephemeral Time Travel.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

[Time Travel](/docs/guides/time-travel-assist) lets you query your database as it was at a specific point in time within your [restore window](/docs/introduction/restore-window). That’s useful for debugging (for example, “what did this row look like before the deploy?”), checking feature-flag state, or auditing.

You can use Time Travel in two ways:

1. **Ephemeral (no branch):** In the [Neon Console SQL Editor](/docs/guides/time-travel-assist#time-travel-with-the-sql-editor) or [Neon CLI](/docs/reference/cli-connection-string) (`neon connection-string branch@timestamp`), you pick a timestamp and run read-only queries. Neon uses a short-lived connection at that point in time; nothing is created in your branch list.
2. **Persistent branch at a point in time:** Create a branch from your production branch at a specific timestamp (or LSN), run queries on that branch via your AI assistant, then delete the branch when done. This guide focuses on that workflow with the [Neon MCP Server](/docs/ai/neon-mcp-server).

Run the install command in your **terminal** once; then run the prompts below in your **AI chat** (Cursor or Claude Code). For the full Time Travel tutorial (feature-flag debugging in the SQL Editor), see [Time Travel tutorial](/docs/guides/time-travel-tutorial).

<Admonition type="note" title="Restore window and read-only">
Time Travel only works within your project’s [restore window](/docs/introduction/restore-window). Queries at a point in time are **read-only**; you cannot modify historical data.
</Admonition>

## Create a branch at a point in time, query it, then delete it

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal**:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills in your editor. Restart your editor, then open your AI assistant. Learn more: [neonctl init](/docs/reference/cli-init).

## Create a branch at a point in time

Create a branch from your production branch at a specific timestamp. Replace `[project-name]` with your project, `[timestamp]` with an RFC 3339 timestamp (for example, `2024-06-01T12:00:00Z`), and use a branch name like `time-travel-2024-06-01`:

```text
In my project [project-name], create a branch called time-travel-2024-06-01 from the production branch at timestamp [timestamp]
```

If the MCP server supports it, the assistant will use the Neon API to create the branch at that point in time. **Verify:** The assistant shows the new branch and its connection details. You can also see it under **Branches** in the [Neon Console](https://console.neon.tech).

If creating a branch at a timestamp is not available via your assistant, create the branch from the [Neon Console](/docs/introduction/branch-restore) or [Neon CLI](/docs/reference/cli-branches) (e.g. `neon branches create --parent production@2024-06-01T12:00:00Z --name time-travel-2024-06-01`), then use the next step to run queries on that branch.

## Run a read-only query on the branch

Query the branch to inspect data as it was at that point in time. Replace `[project-name]` and the query with your own:

```text
On branch time-travel-2024-06-01 in my project [project-name], run: SELECT * FROM feature_flags WHERE feature_name = 'new_checkout_process';
```

The assistant runs the SQL on the branch via MCP. **Verify:** The result is shown in the chat. You can run multiple read-only queries on the same branch to compare state before and after a change (use different branches at different timestamps).

## Delete the branch when done

When you're finished inspecting historical data, remove the branch:

```text
Delete branch time-travel-2024-06-01 in my project [project-name]
```

The assistant deletes the branch. **Verify:** The assistant confirms the branch was deleted. In the [Neon Console](https://console.neon.tech), the branch no longer appears under **Branches**.

</Steps>

<Admonition type="tip" title="Ephemeral Time Travel (no branch)">
For a one-off query at a single timestamp without creating a branch, use **Time Travel in the [SQL Editor](/docs/guides/time-travel-assist#time-travel-with-the-sql-editor)** (toggle Time Travel, pick date/time, run query) or the **Neon CLI**: `neon connection-string branch@timestamp` (or `branch@LSN`) then connect with psql or your client. See [Time Travel](/docs/guides/time-travel-assist) for details.
</Admonition>

## See also

- [Time Travel](/docs/guides/time-travel-assist) for SQL Editor and CLI usage and how Time Travel works
- [Time Travel tutorial](/docs/guides/time-travel-tutorial) for the feature-flag debugging scenario
- [Restore window](/docs/introduction/restore-window) for configuring how far back you can query
- [Instant restore](/docs/introduction/branch-restore) for restoring a branch to a point in time
- [Test queries on a branch](/docs/ai/natural-language-guide-branching-test-queries) for testing destructive queries on a copy of production

<NeedHelp/>
