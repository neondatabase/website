---
updatedOn: '2025-05-30T16:54:40.495Z'
---

## Supported actions (tools)

The Neon MCP Server provides the following actions, which are exposed as "tools" to MCP Clients. You can use these tools to interact with your Neon projects and databases using natural language commands.

**Project management:**

- `list_projects`: Retrieves a list of your Neon projects, providing a summary of each project associated with your Neon account. Supports limiting the number of projects returned (default: 10).
- `describe_project`: Fetches detailed information about a specific Neon project, including its ID, name, and associated branches and databases.
- `create_project`: Creates a new Neon project in your Neon account. A project acts as a container for branches, databases, roles, and computes.
- `delete_project`: Deletes an existing Neon project and all its associated resources.
- `list_organizations`: Lists all organizations that the current user has access to. Optionally filter by organization name or ID using the search parameter.

**Branch management:**

- `create_branch`: Creates a new branch within a specified Neon project. Leverages [Neon's branching](/docs/introduction/branching) feature for development, testing, or migrations.
- `delete_branch`: Deletes an existing branch from a Neon project.
- `describe_branch`: Retrieves details about a specific branch, such as its name, ID, and parent branch.
- `list_branch_computes`: Lists compute endpoints for a project or specific branch, including compute ID, type, size, and autoscaling information.

**SQL query execution:**

- `get_connection_string`: Returns your database connection string.
- `run_sql`: Executes a single SQL query against a specified Neon database. Supports both read and write operations.
- `run_sql_transaction`: Executes a series of SQL queries within a single transaction against a Neon database.
- `get_database_tables`: Lists all tables within a specified Neon database.
- `describe_table_schema`: Retrieves the schema definition of a specific table, detailing columns, data types, and constraints.
- `list_slow_queries`: Identifies performance bottlenecks by finding the slowest queries in a database. Requires the pg_stat_statements extension.

**Database migrations (schema changes):**

- `prepare_database_migration`: Initiates a database migration process. Critically, it creates a temporary branch to apply and test the migration safely before affecting the main branch.
- `complete_database_migration`: Finalizes and applies a prepared database migration to the main branch. This action merges changes from the temporary migration branch and cleans up temporary resources.

**Query performance tuning:**

- `explain_sql_statement`: Analyzes a SQL query and returns detailed execution plan information to help understand query performance.
- `prepare_query_tuning`: Identifies potential performance issues in a SQL query and suggests optimizations. Creates a temporary branch for testing improvements.
- `complete_query_tuning`: Finalizes and applies query optimizations after testing. Merges changes from the temporary tuning branch to the main branch.

**Neon Auth:**

- `provision_neon_auth`: Provisions Neon Auth for a Neon project. Sets up authentication infrastructure by creating an integration with Stack Auth (`@stackframe/stack`).
