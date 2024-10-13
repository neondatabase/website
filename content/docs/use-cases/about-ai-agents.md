---
title: Postgres for AI Agents
subtitle: Leverage Neon's instant Postgres database provisioning for AI agent development
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

Neon is a serverless, instant Postgres database platform built with AI agents in mind. With Neon, developers can instantly provision Postgres databases via a simple API, allowing AI agents to access an SQL database on-demand. Our streamlined **@neondatabase/toolkit** simplifies this process by merging our previously existing API packages into a single, easy-to-use SDK.

This toolkit is ideal for AI agents needing efficient and straightforward database provisioning and management. By providing a narrow, purpose-built API, we enable AI agents to spin up and interact with databases quickly, letting them focus on solving higher-level tasks rather than dealing with complex database configurations.

## Why We Built @neondatabase/toolkit

AI agents perform best with a reduced search space and a focused toolset. By offering a single SDK for creating and managing databases, we’re providing the tools necessary for agents to operate efficiently with Neon. For example, Replit Agents use Neon as their primary Postgres provider, which supports their ability to generate high-quality applications by focusing solely on Postgres. 

## Key features

With **@neondatabase/toolkit**, AI agents can:

- **Instantly Spin Up Databases**: Quickly create a Postgres instance via API, perfect for tasks requiring temporary or task-specific databases.
- **Execute SQL Commands**: Run SQL queries or commands directly, all within a consistent and agent-friendly interface.
- **Manage Database Lifecycle**: Easily create, query, and delete databases on-demand, streamlining project cleanup and resource management.
- **Select Connection Types**: While HTTP is the default, upcoming features will allow for connections via WebSockets or TCP, providing flexibility for various agent needs.

## Example workflow

Here's an example script that demonstrates how **@neondatabase/toolkit** can be used by an AI agent to create, use, and delete a Postgres database:

```javascript
import { NeonToolkit } from "@neondatabase/toolkit"; 

const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);

// Create a new Postgres project
const project = await toolkit.createProject();

// Create a table
await toolkit.sql(
  project,
  `
    CREATE TABLE IF NOT EXISTS
        users (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
`,
);

// Insert a record into the table
await toolkit.sql(
  project,
  `INSERT INTO users (id, name) VALUES (gen_random_uuid(), 'Sam Smith')`,
);

// Query the table
console.log(await toolkit.sql(project, `SELECT name FROM users`));

// Delete the project when done
await toolkit.deleteProject(project);
```

This workflow allows the AI agent to provision a database, run necessary SQL commands, and tear down the instance—all with minimal code and in a few seconds.

## Getting Started

To get started with `@neondatabase/toolkit, install the package from NPM:

```bash
npm install @neondatabase/toolkit
```

Set up your API key and instantiate the toolkit, and you’re ready to start managing your databases. The toolkit also allows access to all Neon API features via its apiClient, providing flexibility for more advanced use cases, such as branching and autoscaling.

## Building AI Agents?

If you're working on an AI agent that requires database interactions, we’d love to hear your feedback. We're actively iterating on Neon for Agents and invite design partners to help shape the future of this toolkit. Please file an issue on our GitHub repository, or reach out to us on Discord with any feedback.
