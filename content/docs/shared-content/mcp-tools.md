---
updatedOn: '2026-01-20T15:30:53.659Z'
---

## Supported actions (tools)

The Neon MCP Server provides the following actions, which are exposed as "tools" to MCP clients. You can use these tools to interact with your Neon projects and databases using natural language commands.

**Project management:**

- `list_projects`: Lists the first 10 Neon projects in your account, providing a summary of each project. If you can't find a specific project, increase the limit by passing a higher value to the limit parameter.
- `list_shared_projects`: Lists Neon projects shared with the current user. Supports a search parameter and limiting the number of projects returned (default: 10).
- `describe_project`: Fetches detailed information about a specific Neon project, including its ID, name, and associated branches and databases.
- `create_project`: Creates a new Neon project in your Neon account. A project acts as a container for branches, databases, roles, and computes.
- `delete_project`: Deletes an existing Neon project and all its associated resources.
- `list_organizations`: Lists all organizations that the current user has access to. Optionally filter by organization name or ID using the search parameter.

**Branch management:**

- `create_branch`: Creates a new branch within a specified Neon project. Leverages [Neon's branching](/docs/introduction/branching) feature for development, testing, or migrations.
- `delete_branch`: Deletes an existing branch from a Neon project.
- `describe_branch`: Retrieves details about a specific branch, such as its name, ID, and parent branch.
- `list_branch_computes`: Lists compute endpoints for a project or specific branch, including compute ID, type, size, last active time, and autoscaling information.
- `compare_database_schema`: Shows the schema diff between the child branch and its parent.
- `reset_from_parent`: Resets the current branch to its parent's state, discarding local changes. Automatically preserves to backup if branch has children, or optionally preserve on request with a custom name.

**SQL query execution:**

- `get_connection_string`: Returns your database connection string.
- `run_sql`: Executes a single SQL query against a specified Neon database. Supports both read and write operations.
- `run_sql_transaction`: Executes a series of SQL queries within a single transaction against a Neon database.
- `get_database_tables`: Lists all tables within a specified Neon database.
- `describe_table_schema`: Retrieves the schema definition of a specific table, detailing columns, data types, and constraints.

**Database migrations (schema changes):**

- `prepare_database_migration`: Initiates a database migration process. Critically, it creates a temporary branch to apply and test the migration safely before affecting the main branch.
- `complete_database_migration`: Finalizes and applies a prepared database migration to the main branch. This action merges changes from the temporary migration branch and cleans up temporary resources.

**Query performance optimization:**

- `list_slow_queries`: Identifies performance bottlenecks by finding the slowest queries in a database. Requires the pg_stat_statements extension.
- `explain_sql_statement`: Provides detailed execution plans for SQL queries to help identify performance bottlenecks.
- `prepare_query_tuning`: Analyzes query performance and suggests optimizations, like index creation. Creates a temporary branch for safely testing these optimizations.
- `complete_query_tuning`: Finalizes query tuning by either applying optimizations to the main branch or discarding them. Cleans up the temporary tuning branch.

**Neon Auth:**

- `provision_neon_auth`: Provisions Neon Auth for a Neon project. It allows developers to easily set up authentication infrastructure by creating an integration with an Auth provider.

**Neon Data API:**

- `provision_neon_data_api`: Provisions the Neon Data API for a branch, enabling HTTP-based Data API access with optional JWT authentication.

**Search and discovery:**

- `search`: Searches across organizations, projects, and branches matching a query. Returns IDs, titles, and direct links to the Neon Console.
- `fetch`: Fetches detailed information about a specific organization, project, or branch using an ID (typically from the search tool).

**Documentation and resources:**

- `load_resource`: Loads comprehensive Neon documentation and usage guidelines, including the "neon-get-started" guide for setup, configuration, and best practices.
