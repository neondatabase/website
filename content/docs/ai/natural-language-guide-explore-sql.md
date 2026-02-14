---
title: Explore projects and run SQL
subtitle: List projects, branches, tables, and run queries using natural language
summary: >-
  Use copy-paste prompts in Cursor or Claude Code to explore your Neon account
  and run SQL with the Neon MCP Server.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

This guide uses the [Neon MCP Server](/docs/ai/neon-mcp-server) in Cursor or Claude Code. Run the install command in your **terminal**; then run the prompts below in your **AI chat** to explore your Neon resources and run SQL without leaving the editor.

## List and search your Neon resources

<Steps>

## Install Neon for your AI assistant (one-time)

If you have not already, run this in your **terminal**:

```bash
npx neonctl@latest init
```

The command signs you in to Neon, creates and stores an API key, and installs the Neon MCP Server, the Neon extension (Cursor/VS Code), and agent skills in your editor so your assistant can manage Neon from the chat. Restart your editor, then open your AI assistant. Learn more: [neonctl init](/docs/reference/cli-init).

## List your projects

Paste this into your AI chat:

```text
List my Neon projects
```

The assistant uses the MCP `list_projects` tool and returns a summary of your projects. **Verify:** The list appears in the chat. You can also open the [Neon Console](https://console.neon.tech) **Projects** page to see the same projects.

## Inspect a specific project

To see branches and databases for one project, replace `[project-name]` with your project name or ID:

```text
Show me the branches and databases in my project [project-name]
```

## Search by name

When you are not sure which project or branch something is in:

```text
Search for "staging" across my Neon resources
```

The assistant uses the MCP `search` tool and returns matching organizations, projects, and branches with links to the Neon Console. **Verify:** Results appear in the chat with direct links to the Console.

</Steps>

## Explore database schema and run SQL

<Steps>

## List tables in a database

Replace `[project-name]` and, if needed, the database name (default is often `neondb`):

```text
What tables are in database neondb in my project [project-name]?
```

## Show a table's schema

```text
Show the schema of the users table in my project [project-name]
```

The assistant describes columns, types, and constraints for that table.

## Run a query

```text
Run SELECT * FROM users LIMIT 10 in database neondb in my project [project-name]
```

Specify project (and branch or database if you have more than one) so the assistant targets the correct database. **Verify:** Query results appear in the chat. You can also run the same query in the [Neon Console](https://console.neon.tech) **SQL Editor** for the branch and database.

## Get a connection string

To use the connection string in an app or external client:

```text
Get the connection string for my project [project-name] main branch
```

**Verify:** The assistant shows the connection string in the chat. You can also copy it from the **Connect** button on the project dashboard in the [Neon Console](https://console.neon.tech).

</Steps>

<Admonition type="tip" title="Tip">
Replace `[project-name]` with your actual project name or ID. You can find project IDs in the Neon Console or from the "List my Neon projects" response.
</Admonition>

## See also

- [Neon MCP Server](/docs/ai/neon-mcp-server) for supported tools
- [Get started with Neon](/docs/ai/natural-language-guide-get-started) to create a project first
- [Branches and schema changes](/docs/ai/natural-language-guide-branches-schema) for branch-based workflows

<NeedHelp/>
