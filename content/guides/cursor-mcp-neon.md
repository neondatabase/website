---
title: 'AI-assisted database migrations with Cursor and Neon Postgres MCP Server'
subtitle: 'Accelerate development and prototype schema changes with natural language using Cursor and Neon MCP Server'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-20T00:00:00.000Z'
updatedOn: '2025-02-20T00:00:00.000Z'
---

Imagine adjusting your database schema simply by describing the change in plain English. This is possible by combining [Cursor](https://cursor.com), the AI-first code editor, with the [Neon MCP Server](https://github.com/neondatabase/mcp-server-neon). This combination is designed to accelerate development and prototyping, not to replace production database migrations.

This guide demonstrates how to use [Cursor's Composer](https://docs.cursor.com/composer) and Neon's MCP server to streamline development-phase database migrations for your Neon Postgres projects. You'll learn how to set up this workflow and see how AI can make iterative database adjustments faster and more accessible.

## Streamlining Database migrations with Cursor and Neon MCP Server

Let's break down the key components of this workflow:

- **Cursor**: Cursor is an AI-first code editor, that leverages the Model Context Protocol (MCP) to interface with to external tools (APIs, databases) for autonomous task execution like queries or CLI operations.

- **Neon MCP Server**: Neon's MCP server acts as a bridge between MCP clients like Cursor and [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), allowing them to interact with your Neon databases using natural language commands. It provides a set of tools that enable Cursor to perform database operations like querying tables, adding columns, and executing SQL commands.

- **Model Context Protocol (MCP)**: MCP provides the lightweight communication standard that allows Cursor and Neon MCP Server to work together seamlessly, facilitating fast, natural language interactions for database management.

This toolset streamlines database design and development, allowing for rapid experimentation and iteration on schema changes. It's perfect for early-stage development, where speed and agility are paramount, and formal migration tracking is less critical.

## Benefits of AI-assisted Database migrations

Using Cursor and Neon MCP Server for database migrations offers several key benefits:

| Benefit                     | Description                                                                                                                                                                                                                                                              |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Faster Schema Changes**   | Use natural language commands in Cursor to make schema changes and queries, reducing the time spent writing SQL migration scripts or using manual database tools.                                                                                                                |
| **Improved Iteration**      | Accelerate development by quickly adjusting your database. This is ideal for exploring different schema options and adapting your database to changing application requirements.                                                                                             |
| **Simplified Database Adjustments** | Make database changes more accessible during development, even for team members who aren't database migration experts.  This empowers the whole team to quickly adjust the schema as needed during prototyping and early development.                               |
| **Development Safety with Neon Branching** | Neon's branching feature provides a safety net, allowing you to prototype changes in isolated branches before applying them to your development or integration branches.                                                                                                   |

**Important Note:** This method is for development purposes and **is not a substitute for traditional migration processes** in production.

## Setting up Neon MCP Server in Cursor

This guide outlines the steps to quickly set up Neon MCP Server in Cursor for development.

### Prerequisites

Before you begin, ensure you have the following:

1.  **Cursor Editor:** Download and install Cursor from [cursor.com](https://cursor.com).
2.  **Neon Account and Project:** You'll need a Neon account and aproject. Create a new project here [pg.new](https://pg.new)
3.  **Neon API Key:** After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/profile) This API key is needed to authenticate your application with Neon.

    <Admonition type="warning" title="Neon API Key Security">
    Keep your Neon API key secure and never share it publicly. It provides access to your Neon projects.
    </Admonition>

4.  **Node.js (>= v18) and npm:** Ensure Node.js (version 18 or later) and npm are installed. Download them from [nodejs.org](https://nodejs.org).

### Installation and Configuration

- **Add Neon MCP Server to Cursor:**
    - Open Cursor and go to **Cursor Settings** in the Navbar.
    - In Settings, navigate to **Features**.
    - Scroll to the **MCP Servers** section.
        ![Cursor MCP Servers section](/docs/guides/cursor-settings-features.png)
    - Click **+ Add new MCP server**.

    - In the "Add MCP Server" modal:
        - **Name:** Give your server a descriptive name (e.g., `Neon`).
        - **Type:** Select `command`.
        - **Command:** Enter the following command, replacing `<YOUR_NEON_API_KEY>` with your actual Neon API key which you obtained earlier in the [Prerequisites](#prerequisites) section.

            ```bash
            npx -y @neondatabase/mcp-server-neon start <YOUR_NEON_API_KEY>
            ```

        - Click **Add**.

            ![Add Neon MCP Server in Cursor](/docs/guides/cursor-add-mcp-server.png)

    *   Cursor will attempt to connect. Your new "Neon" MCP server should appear in the MCP Servers list with all the available tools.

        ![Cursor with Neon MCP Tools](/docs/guides/cursor-with-neon-mcp-tools.png)

You've now configured Neon MCP Server in Cursor and can manage your Neon Postgres databases using AI.

## Neon MCP Server Tools

Neon MCP server exposes the following actions, which primarily map to **Neon API endpoints**:

- `list_projects`: Action to list all your Neon projects. This uses the Neon API to retrieve a summary of all projects associated with your Neon account.
- `describe_project`: Action to get detailed information about a specific Neon project. Provides comprehensive details about a chosen project, such as its ID, name, and associated branches.
- `create_project`: Action to create a new Neon project — a container in Neon for branches, databases, roles, and computes.
- `delete_project`: Action to delete an existing Neon project.
- `create_branch`: Action to create a new branch within a Neon project. Leverages Neon's branching feature, allowing you to create new branches for development or migrations.
- `delete_branch`: Action to delete an existing branch in a Neon project.
- `describe_branch`: Action to get details about a specific branch. Retrieves information about a particular branch, such as its name and ID.
- `run_sql`: Action to execute a single SQL query against a Neon database. Allows you to run read or write SQL queries.
- `run_sql_transaction`: Action to execute a series of SQL queries within a transaction against a Neon database. Enables running multiple SQL statements as a single atomic transaction, ensuring data consistency.
- `get_database_tables`: Action to list all tables in a specified Neon database. Provides a list of tables.
- `describe_table_schema`: Action to retrieve the schema definition of a specific table. Details the structure of a table, including columns and data types.
- `prepare_database_migration`: Action to initiate a database migration process, utilizing a temporary branch for safety. Begins the process of altering your database schema, safely using Neon's branching feature.
- `complete_database_migration`: Action to apply and finalize a prepared database migration to the main branch. Completes a migration process, applying changes to your main database and cleaning up temporary resources.

These actions enable any MCP Host like Cursor to interact with various functionalities of the **Neon platform via the Neon API.** Certain tools, especially database migration ones, are tailored for AI agent and LLM usage, leveraging Neon’s branching for safe preview and commit.

## Development Workflow: Adding a Column with Cursor and Neon MCP

Let's walk through a typical development scenario: quickly adding a column for prototyping using natural language within Cursor. The following chat log demonstrates a real interaction with Cursor and the Neon MCP server.

**Scenario:** During development, you decide to track timestamps for entries in your `playing_with_neon` table. You want to quickly add a `created_at` column.

Check out the video below to see how Cursor and Neon MCP Server can help you add a new column to your database table using natural language commands.

<video autoPlay playsInline muted loop width="800" height="600" controls>
  <source type="video/mp4" src="/videos/pages/doc/cursor-neon-mcp.mp4"/>
</video>

<Admonition type="tip" title="Security Reminder">
For your security, review the tool's purpose before permitting the operation to proceed. Remember that LLMs can sometimes produce unexpected results, so careful monitoring is always recommended.
</Admonition>

Here's the conversation log between the user and Cursor:

```
User: In my neon project id: round-salad-44063611 list all the tables
Cursor: I'll help you list all the tables in your Neon project. I'll use the default database name 'neondb' since none was specified.
> Called MCP Tool (get_database_tables)
> I found one table in your database:
> playing_with_neon (in the public schema)
> Would you like to see more details about this table's structure or perform any other operations with it?

User: Can you show me first 5 rows?
Cursor: I'll query the first 5 rows from the playing_with_neon table.
> Called MCP Tool (run_sql)
> Here are the first 5 rows from the table. The table has three columns:
> id (sequential numbers)
> name (string values)
> value (decimal numbers)
> Would you like to perform any other operations with this data?

User: can you add a created_at column?
Cursor: I'll help you add a created_at column to the playing_with_neon table. I'll set it up with a timestamp data type and set it to automatically record the creation time of new rows.
> Called MCP Tool (prepare_database_migration)
> Let me verify the change in the temporary branch to make sure it was applied correctly.
> Called MCP Tool (run_sql)
> I've added the created_at column to the playing_with_neon table in a temporary branch. Would you like to commit this migration to the main branch?
> Migration Details:
> Migration ID: a65babcd-d1cc-401f-89b5-762570570102
> Temporary Branch Name: br-silent-cherry-a1eqrl6i
> Temporary Branch ID: br-silent-cherry-a1eqrl6i
> Migration Result: Success
> Please let me know if you'd like to proceed with applying this change to the main branch.

User: yeah do it
Cursor: I'll complete the migration and apply the changes to the main branch.
> Called MCP Tool (complete_database_migration)
> The migration has been successfully completed! The created_at column has been added to your table in the main branch, and the temporary branch has been cleaned up.
```

**Key takeaways:**

- **Natural Language Interaction:** Use simple, conversational English to interact with your database.
- **Step-by-step Guidance:** Cursor (Claude) confirms each step and provides details like branch names and migration IDs.
- **MCP Tools in Action:**  The underlying MCP tools (`get_database_tables`, `run_sql`, `prepare_database_migration`, `complete_database_migration`) illustrate the automated process.
- **Branching for safety:**  The agent automatically creates a temporary branch for schema changes, ensuring safety and isolation. The user will be prompted to confirm the migration before applying it to the main branch.

You can verify the changes in your Neon Console or by querying the database directly.

![Neon Console with added column](/docs/guides/neon-cursor-mcp-added-column.png)

<Admonition type="note">
While the Neon MCP server allows you to utilize all of Neon's functionalities, you can also use a [generic Postgres server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) to connect to Neon.
</Admonition>

## Limitations and Best Practices

It's crucial to understand when and where to use AI-assisted migrations:

- **Not for Production Migrations:** This method is **NOT** recommended for production database migrations. Production migrations require version control, collaboration, and audit trails—features not provided by this rapid, natural language approach.
- **Limited History and Auditability:** Changes made through natural language commands aren't tracked like version-controlled migration scripts.  A migration history file for review is essential for production and team collaboration.
- **Reproducibility Concerns:** While the LLM's strive for consistency, the generated SQL might vary slightly. Reproducibility for critical production changes relies on versioned migration scripts.

Ideal use cases for Cursor and Neon MCP Server:

- **Rapid Prototyping:** Quickly experiment with schema changes to explore database designs early in development.
- **Development Iteration:** Easily adjust your database structure during feature development and testing.
- **Personal Projects & Small Teams:** For individual developers or small teams in early development where speed and iteration are paramount, and formal migration tracking is less critical *at this stage*.
- **Learning & Exploration:**  A great way to learn about database schema changes and Neon features through an intuitive, conversational interface.

## Bonus: Creating a Project and Branch

Beyond schema changes, you can also manage your Neon projects and branches directly within Cursor using natural language commands. This can be especially useful for setting up your development environment quickly.

### Creating a New Project

Let's say you want to create a new Neon project named "my-new-project".  You can simply tell Cursor:

```
User: Create a Neon project named "my-new-project"
Cursor: I'll help you create a new Neon project with the specified name.
> Called MCP Tool (create_project)
> Great! I've created a new Neon project for you with the name "my-new-project". Here are the important details:
> Project ID: orange-dawn-33739962
> Default branch: main
> Default database: neondb
> The project is ready to use. You can start creating tables and working with your database right away. 
```

![Cursor creating a new Neon project](/docs/guides/cursor-mcp-create-new-project.png)

Cursor will then use the `create_project` MCP tool to initiate the project creation.  It will provide you with a project ID and name.

### Creating a New Branch

Once you have a project, you can easily create new branches for development or experimentation. For example, to create a branch named "feature-x" in your "my-new-project" project:

```
User: Create a branch named "feature-x"
Cursor: Perfect! I've created a new branch named "feature-x". Here are the details:
> Branch ID: br-cold-mountain-a523ka2w
> Branch name: feature-x
> Parent branch ID: br-odd-pine-a5y53krm
> The branch has been created successfully and is ready for use.
```

![Cursor creating a new Neon branch](/docs/guides/cursor-mcp-create-new-branch.png)

Cursor will use the `create_branch` MCP tool to create the branch and provide you with the branch name and ID. Notice how we don't need to specify the project ID, as Cursor remembers the active project context.

By combining project and branch management with schema migration capabilities, Cursor and Neon MCP Server provide a powerful and streamlined development workflow.  You can manage your entire development database environment using natural language, accelerating your development process.

## Conclusion

Cursor and Neon MCP Server streamline database adjustments during development. This combination allows you to use natural language to interact with your database and leverage Neon's speed and branching capabilities for faster iteration. This approach is ideal for quickly testing database ideas and making schema changes during development. 

However, it's important to remember that it is not a replacement for robust, version-controlled migrations in production systems. Use this tool strategically to accelerate development and simplify database experimentation.

## Resources

- [MCP Protocol](https://modelcontextprotocol.org)
- [Adding an MCP Server to Cursor](https://docs.cursor.com/context/model-context-protocol)
- [Neon Docs](https://neon.tech/docs)
- [Neon API Keys](https://neon.tech/docs/manage/api-keys#creating-api-keys)
- [Neon MCP server GitHub](https://github.com/neondatabase/mcp-server-neon)

<NeedHelp/>
