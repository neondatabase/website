---
title: 'AI Rules: The @neondatabase/toolkit'
subtitle: Context rules for AI tools to use the @neondatabase/toolkit for ephemeral Postgres databases
enableTableOfContents: true
updatedOn: '2025-09-16T00:00:00.000Z'
---

<InfoBlock>
<DocsList title="Related docs" theme="docs">
  <a href="/docs/reference/neondatabase-toolkit">Get started with the @neondatabase/toolkit</a>
  <a href="/docs/reference/typescript-sdk">Neon TypeScript SDK Reference</a>
  <a href="/docs/reference/api-reference">Neon API Reference</a>
</DocsList>

<DocsList title="Repository" theme="repo">
  <a href="https://www.npmjs.com/package/@neondatabase/toolkit">`@neondatabase/toolkit` on npm</a>
  <a href="https://jsr.io/@neon/toolkit">`@neon/toolkit` on JSR</a>
  <a href="https://github.com/neondatabase-labs/ai-rules/blob/main/neon-toolkit.mdc">neon-toolkit.mdc</a>
</DocsList>
</InfoBlock>

<AIRule file="neon-toolkit.mdc" name="@neondatabase/toolkit" />

## Rules

````markdown shouldWrap
---
description: Use these rules to programmatically create, query, and destroy ephemeral Neon Postgres databases. Ideal for quick prototyping, testing, and temporary workflows.
globs: *.ts, *.tsx
alwaysApply: false
---

## Neon Toolkit integration guidelines

This file provides comprehensive rules and best practices for interacting with Neon using the `@neondatabase/toolkit`. This toolkit is a terse client designed specifically for scenarios where a temporary, fully-functional Postgres database is needed quickly. As an AI agent, this is your primary tool for tasks requiring database interaction without manual setup.

The toolkit bundles the `@neondatabase/api-client` and the `@neondatabase/serverless` driver to streamline the entire lifecycle of a database: creation, querying, and deletion.

### Neon Core Concepts

To use the toolkit effectively, you must understand Neon's resource hierarchy. While the toolkit simplifies this, knowing the concepts is crucial if you need to use the underlying `apiClient`.

| Concept          | Description                                                                                                                        | Analogy/Purpose                                                                                                 | Key Relationship                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Organization     | The highest-level container, managing billing, users, and multiple projects.                                                       | A GitHub Organization or a company's cloud account.                                                             | Contains one or more Projects.                                                                        |
| Project          | The primary container that contains all related database resources for a single application or service.                            | A Git repository or a top-level folder for an application.                                                      | Lives within an Organization (or a personal account). Contains Branches.                              |
| Branch           | A lightweight, copy-on-write clone of a database's state at a specific point in time.                                              | A `git branch`. Used for isolated development, testing, staging, or previews without duplicating storage costs. | Belongs to a Project. Contains its own set of Databases and Roles, cloned from its parent.            |
| Compute Endpoint | The actual running PostgreSQL instance that you connect to. It provides the CPU and RAM for processing queries.                    | The "server" or "engine" for your database. It can be started, suspended (scaled to zero), and resized.         | Is attached to a single Branch. Your connection string points to a Compute Endpoint's hostname.       |
| Database         | A logical container for your data (tables, schemas, views) within a branch. It follows standard PostgreSQL conventions.            | A single database within a PostgreSQL server instance.                                                          | Exists within a Branch. A branch can have multiple databases.                                         |
| Role             | A PostgreSQL role used for authentication (logging in) and authorization (permissions to access data).                             | A database user account with a username and password.                                                           | Belongs to a Branch. Roles from a parent branch are copied to child branches upon creation.           |
| API Key          | A secret token used to authenticate requests to the Neon API. Keys have different scopes (Personal, Organization, Project-scoped). | A password for programmatic access, allowing you to manage all other Neon resources.                            | Authenticates actions on Organizations, Projects, Branches, etc.                                      |
| Operation        | An asynchronous action performed by the Neon control plane, such as creating a branch or starting a compute.                       | A background job or task. Its status can be polled to know when an action is complete.                          | Associated with a Project and often a specific Branch or Endpoint. Essential for scripting API calls. |

### Installation

To begin, install the toolkit package into the user's project:

```bash
# Using npm
npm install @neondatabase/toolkit

# Using JSR with Deno
deno add jsr:@neon/toolkit
```

### Authentication and client initialization

All interactions require a Neon API key. This key must be provided by the user, typically as an environment variable (`NEON_API_KEY`).

Initialize the toolkit in your code. This is the entry point for all toolkit operations.

```typescript
import { NeonToolkit } from '@neondatabase/toolkit';

// Best practice: Load API key from environment variables
const apiKey = process.env.NEON_API_KEY;

if (!apiKey) {
  throw new Error('NEON_API_KEY environment variable is not set.');
}

const toolkit = new NeonToolkit(apiKey);
```

### The core toolkit workflow

The toolkit is designed around a simple, three-step lifecycle: **Create -> Query -> Delete**.

#### 1. Create a project

Description: Creates a new, fully-configured Neon project. This single asynchronous call handles project creation, default branch setup, and returns an object containing everything needed for the next steps, including the database connection string.

Method Signature:
`toolkit.createProject(projectOptions?: ProjectCreateRequest['project']): Promise<ToolkitProject>`

Parameters:

- `projectOptions` (object, optional): An object to customize the new project.
  - `name` (string): A descriptive name for the project.
  - `pg_version` (number): The major Postgres version (e.g., `16`).
  - `region_id` (string): The cloud region for the project (e.g., `aws-us-east-1`).

Returns: A `Promise` that resolves to a `ToolkitProject` object. This object contains:

- `project`: Details of the created project.
- `connectionURIs`: An array of connection strings. Use `connectionURIs[0].connection_uri`.
- `roles`, `databases`, `branches`, `endpoints`: Information about the default resources created.

Example Usage:

```typescript
// Create a project with default settings
const project = await toolkit.createProject();
console.log(`Project created. Connection URI: ${project.connectionURIs[0].connection_uri}`);

// Create a customized project
const customizedProject = await toolkit.createProject({
  name: 'ai-agent-database',
  pg_version: 16,
});
console.log(`Project "${customizedProject.project.name}" created.`);
```

#### 2. Execute SQL queries

Description: Runs SQL queries against the created project's database. This method uses the Neon Serverless Driver, which automatically handles the connection using the provided `ToolkitProject` object.

Method Signature:
`toolkit.sql(project: ToolkitProject, query: string): Promise<any>`

Parameters:

- `project` (`ToolkitProject`, required): The project object returned by `toolkit.createProject()`.
- `query` (string, required): The SQL string to execute.

Returns: A `Promise` that resolves to the query result, typically an array of row objects for `SELECT` statements.

Example usage:

```typescript
// `project` is the object from the previous step

// DDL Statement (schema modification)
await toolkit.sql(
  project,
  `CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, description TEXT, completed BOOLEAN DEFAULT FALSE);`
);

// DML Statement (data insertion)
await toolkit.sql(project, `INSERT INTO tasks (description) VALUES ('Analyze user feedback');`);

// DQL Statement (data retrieval)
const tasks = await toolkit.sql(project, `SELECT * FROM tasks WHERE completed = FALSE;`);
console.log('Incomplete tasks:', tasks);
// Output: [ { id: 1, description: 'Analyze user feedback', completed: false } ]
```

#### 3. Delete the project

Description: Permanently deletes the Neon project and all of its associated resources (data, branches, endpoints). This is the crucial cleanup step for ephemeral workflows. **This action is irreversible.**

Method Signature:
`toolkit.deleteProject(project: ToolkitProject): Promise<void>`

Parameters:

- `project` (`ToolkitProject`, required): The project object returned by `toolkit.createProject()`.

Example Usage:

```typescript
// `project` is the object from the create step
await toolkit.deleteProject(project);
console.log('Project has been successfully deleted.');
```

### Complete lifecycle example

Always structure your logic to ensure the `deleteProject` call is made, even if errors occur during the SQL execution phase. Using a `try...finally` block is a robust pattern for this.

```typescript
import { NeonToolkit } from '@neondatabase/toolkit';

async function runTemporaryDatabaseTask() {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error('NEON_API_KEY is not set.');
  }
  const toolkit = new NeonToolkit(apiKey);

  let project;
  try {
    // 1. Create
    console.log('Creating temporary project...');
    project = await toolkit.createProject({ name: 'ephemeral-task-runner' });
    console.log(`Project created with ID: ${project.project.id}`);

    // 2. Query
    console.log('Setting up schema and inserting data...');
    await toolkit.sql(
      project,
      `CREATE TABLE logs (message TEXT, timestamp TIMESTAMPTZ DEFAULT NOW());`
    );
    await toolkit.sql(project, `INSERT INTO logs (message) VALUES ('Task started');`);

    const logs = await toolkit.sql(project, `SELECT message FROM logs;`);
    console.log('Retrieved logs:', logs);
  } catch (error) {
    console.error('An error occurred during the database task:', error);
  } finally {
    // 3. Delete
    if (project) {
      console.log('Cleaning up and deleting project...');
      await toolkit.deleteProject(project);
      console.log('Project deleted.');
    }
  }
}

runTemporaryDatabaseTask();
```

### Accessing the underlying API Client

For advanced operations beyond the toolkit's scope (e.g., creating a new branch, managing roles, listing all projects), you can access the full Neon TypeScript SDK instance via the `apiClient` property.

Use this when the user asks for an operation that the toolkit does not directly expose.

```typescript
const apiClient = toolkit.apiClient;

// Now you can use the apiClient for advanced operations.
// Example: List all projects in the user's account
const { data } = await apiClient.listProjects({});
console.log(
  'All projects in your account:',
  data.projects.map((p) => p.name)
);
```
````
