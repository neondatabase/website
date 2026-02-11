---
title: Neon VS Code Extension
enableTableOfContents: true
subtitle: Connect to Neon and manage your database directly in VS Code, Cursor, and
  other editors
summary: >-
  Covers the setup of the Neon extension for VS Code and compatible editors,
  enabling users to connect to Neon branches, manage databases, run queries, and
  edit data directly within their IDE.
redirectFrom:
  - /docs/local/neon-local-connect
updatedOn: '2026-02-06T22:07:33.110Z'
---

The Neon extension lets you connect to any Neon branch and manage your database directly in your IDE. Available for VS Code, Cursor, and other VS Code-compatible editors, you can browse schemas, run queries, edit table data, and get connection strings, without leaving your editor.

## What you can do

With the Neon extension, you can:

- **Connect to projects and branches**  
  The extension automatically detects valid Neon connection strings in your code.
- **Browse your database**  
  Use a clean tree view showing databases, schemas, tables, views, sequences, and relationships.
- **Manage databases and tables**  
  Create and manage databases, schemas, and tables directly in your IDE.
- **Run queries with SQL Editor**  
  Write and execute queries against your selected database. View and sort results, and export data if needed.
- **Edit data with Table Data Editor**  
  View, edit, insert, and delete rows in a spreadsheet-like interface. Import and export tables in CSV, JSON, or SQL formats.
- **Enable AI-powered features**  
  Automatically configure the Neon MCP Server so you can manage projects, branches, and databases from your AI chat.

## Requirements

- [VS Code 1.85.0+](https://code.visualstudio.com/), [Cursor](https://cursor.sh/), or other VS Code-compatible editor.
- A [Neon account](https://neon.tech).

<Steps>

## Install the extension

Click one of the buttons below to install the extension directly, or search for **"Neon - Serverless Postgres"** in your editor's Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac).

<div style={{display: 'flex', gap: '12px', alignItems: 'center'}}><a href="vscode:extension/databricks.neon-local-connect"><img src="/docs/local/vscode-install-dark.svg" alt="Add to VS Code" height="32" /></a><a href="cursor:extension/databricks.neon-local-connect"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add to Cursor" height="32" /></a></div>

For other VS Code-compatible editors, install from the [Open VSX Registry](https://open-vsx.org/extension/databricks/neon-local-connect).

## Sign in to Neon

1. Open the Neon panel in the sidebar (look for the Neon logo).
2. Click **Sign in**.

3. Complete OAuth authorization in your browser.

Once signed in, the extension automatically configures the [Neon MCP server](/docs/ai/neon-mcp-server) for AI features.

## Connect to a branch

The extension scans your workspace for existing Neon connection strings and can automatically detect your project and branch.

You can also manually select:

1. **Organization** — your Neon organization.
2. **Project** — the project containing your database.
3. **Branch** — the branch to connect to.

Click **Connect** to establish the connection.

<Admonition type="note">
If you're new to Neon, this reflects our object hierarchy: organizations contain projects, and projects contain branches. [Learn more about how Neon organizes your data.](/docs/manage/overview)
</Admonition>

## Create a new branch

You can create a new branch for feature development, bug fixes, or collaborative work:

1. Select your organization and project.
2. Click **Create new branch...** in the branch dropdown.
3. Enter a descriptive branch name (e.g., `feature/user-authentication`, `bugfix/login-validation`).
4. Choose the parent branch you want to branch from.

The extension creates the new branch and connects you immediately.

## Use your connection string

After connecting, copy the connection string from the extension panel and add it to your `.env` file:

```env
DATABASE_URL="postgresql://user:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## Start developing

Your application now connects directly to your Neon branch. See the quickstart for your language or framework for more details.

- [Framework quickstarts](/docs/get-started/frameworks)
- [Language quickstarts](/docs/get-started/languages)

</Steps>

## Database explorer

Once connected, the extension provides a comprehensive **Database Explorer** in the sidebar that lets you browse your database structure with an intuitive tree view:

### What you can see

- **Databases**: All available databases in your connected branch.
- **Schemas**: Database schemas organized in a tree structure.
- **Tables & Views**: All tables and views with their column definitions.
- **Sequences**: Database sequences.
- **Data Types**: Column data types, constraints, and relationships.
- **Primary Keys**: Clearly marked primary key columns.
- **Foreign Keys**: Visual indicators for foreign key relationships.

### Schema view actions

- **Right-click any table** to access quick actions:
  - **Query Table**: Opens a pre-filled `SELECT *` query in the SQL Editor.
  - **View Table Data**: Opens the table data in an editable spreadsheet view.
  - **Truncate Table**: Remove all rows from a table.
  - **Drop Table**: Delete the table entirely.
- **Right-click databases or schemas** for management operations.
- **Refresh** the schema view to see the latest structural changes.
- **Expand/collapse** database objects to focus on what you need.

The schema view automatically updates when you switch between branches, so you always see the current state of your connected database.

### Database management actions

Right-click databases, schemas, or tables to access management operations:

- **Create and drop databases and schemas** — Add new databases or remove existing ones.
- **Table designer** — Create tables with columns, indexes, and constraints.
- **Foreign key management** — Set up relationships with referential integrity.
- **View and sequence management** — Create and manage database views and sequences.
- **User and role management** — Control database access and permissions.
- **Data import/export** — Transfer data in CSV, JSON, or SQL formats.

Access these features through the context menu (right-click) in the Database Explorer.

## SQL Editor

Execute SQL queries directly in your IDE with the integrated SQL Editor:

### Features

- **Syntax Highlighting**: Full SQL syntax support.
- **Results Display**: View query results in a tabular format with sorting and filtering.
- **Export Options**: Export results to CSV, JSON, or SQL formats.
- **Query Statistics**: View execution time and performance metrics.
- **Error Highlighting**: Detailed error messages for debugging.

### How to use

1. **From Schema View**: Right-click any table and select "Query Table" for a pre-filled SELECT query.
2. **From Command Palette**: Use `Ctrl+Shift+P` and search for "Neon: Open SQL Editor".

The SQL Editor integrates seamlessly with your database connection, so you can query any database in your current branch without additional setup.

## Table data editor

View and edit your table data with a powerful, spreadsheet-like interface:

### Viewing data

- **Paginated Display**: Navigate through large datasets with page controls.
- **Column Management**: Show/hide columns, sort by any column.
- **Data Types**: Visual indicators for different data types (primary keys, foreign keys, etc.).
- **Null Handling**: Clear visualization of NULL values.

### Editing capabilities

- **Inline Editing**: Edit field values directly in the table.
- **Insert New Rows**: Add new records with the "Add Row" button.
- **Delete Rows**: Remove records with confirmation dialogs.
- **Real-time Validation**: Data validation based on column types and constraints.

<Admonition type="important">
Row editing and deletion require tables to have a primary key defined. This ensures data integrity by uniquely identifying rows for safe updates.
</Admonition>

### How to access

1. **From Schema View**: Right-click any table and select "View Table Data".
2. The data opens in a new tab with full editing capabilities.
3. Changes are immediately applied to your database.
4. Use the refresh button to see updates from other sources.

Perfect for quick data inspection, testing, and small data modifications without writing SQL.

## AI agent integration

The Neon extension includes built-in support for AI-powered database features through the [Neon MCP Server](/docs/ai/neon-mcp-server):

### Features

- **Automatic MCP Server configuration** — enables AI-powered database features with your coding agent.
- **Chat with your database** using natural language.
- **AI-assisted SQL generation** and schema understanding.
- **View and manage MCP server status** directly in the extension.

The MCP server is automatically configured when you sign in. You can view the status and manage the configuration from the extension panel.

### Extension settings

This extension contributes the following settings:

| Setting                            | Description                                            | Default |
| ---------------------------------- | ------------------------------------------------------ | ------- |
| `neon.mcpServer.autoConfigEnabled` | Automatically configure the Neon MCP server on sign-in | `true`  |

## Available commands

You can run any command by opening the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) and typing "Neon".

| Command                     | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| **Neon: Sign In**           | Sign in to your Neon account                           |
| **Neon: Sign Out**          | Sign out from your Neon account                        |
| **Neon: Open SQL Editor**   | Open a new SQL editor tab                              |
| **Neon: View Databases**    | Open the database tree view                            |
| **Neon: Refresh Databases** | Refresh the database tree view                         |
| **Neon: Create Branches**   | Create Neon branches                                   |
| **Neon: Get Started**       | Automatically configure your project to work with Neon |

## Troubleshooting

### Connection errors

- Verify your Neon account is active.
- Ensure you have access to the selected project and branch.
- Check your network connection.

### MCP Server not working

- Check the MCP Server panel status in the extension.
- Try disabling and re-enabling the MCP server.
- Reload the window after configuration changes.

### Database view not updating

- Use the refresh button in the Databases view title bar.
- Disconnect and reconnect to the branch.

## Next steps & resources

- [Branching in Neon](/docs/guides/branching-intro).
- [Neon MCP Server](/docs/ai/neon-mcp-server).
- [Serverless driver](/docs/serverless/serverless-driver).
- [Discord Community](https://discord.gg/92vNTzKDGp).

<NeedHelp/>
