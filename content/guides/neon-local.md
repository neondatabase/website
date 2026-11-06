---
title: Getting started with Neon Local and the Neon VS Code extension
subtitle: Learn how to set up and use Neon Local and the Neon VS Code extension (formerly Neon Local Connect) for local development with Neon
author: 'dhanush-reddy'
enableTableOfContents: true
createdAt: '2025-08-17T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Neon's database branching lets you instantly create isolated, copy-on-write clones of your database for any task. Just as you create a Git branch for every new feature or bug fix, you can create a parallel database branch. Developers stop overwriting each other's work on a shared staging database, and each development environment starts from a copy of production data.

Switching connection strings for each branch in local development is tedious and error-prone. Two tools help:

- **Neon Local** is a Docker-based proxy. Your application connects to a single, static `localhost` address, and Neon Local routes traffic to the Neon branch you choose, or to an ephemeral branch it creates and deletes for you.
- The **Neon VS Code extension** (formerly Neon Local Connect) connects your editor directly to any Neon branch, with a schema explorer, SQL editor, and table data editor, and lets you create and switch branches without leaving the IDE.

In this guide, you'll learn how to:

- Install the Neon VS Code extension and connect it to a branch.
- Use the built-in schema view, SQL editor, and table data editor.
- Create and switch database branches from your IDE.
- Run Neon Local with Docker Compose to get a static `localhost` connection string and ephemeral branches.
- Configure your application to use Neon Local in development and Neon directly in production.

<Admonition type="note" title="Neon Local vs. a local Postgres instance">
This guide focuses on tools that connect to your **cloud-hosted Postgres database on Neon**. Neon Local is a **local proxy**: it gives you a `localhost` connection to a Neon branch, so you can use branching without changing connection strings.

This is different from the [Local development with Neon](/guides/local-development-with-neon) guide, which shows you how to run a completely separate, **local instance of Postgres** for fully offline development.

For most workflows that use Neon's features, the proxy-based approach in this guide is recommended.
</Admonition>

## Prerequisites

Before you begin, ensure you have the following:

- **Neon account:** A Neon account on any plan, including the Free plan. If you don't have one, sign up at [Neon](https://console.neon.tech/signup).
- **VS Code:** Or any compatible editor based on VS Code, such as Cursor or Windsurf.
- **Docker:** Docker Desktop installed and running on your machine, for Neon Local. You can download it from [docker.com](https://www.docker.com/products/docker-desktop/).
- **Node.js:** Version `18` or later to run the example application.

## Neon VS Code extension

The Neon VS Code extension connects your editor to a Neon branch and gives you a control panel for your database inside the IDE. It connects directly to Neon, so it doesn't need Docker.

### Install the extension

First, install the extension from the Visual Studio Marketplace or OpenVSX.

1.  Open your editor and navigate to the **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
2.  Search for "Neon - Serverless Postgres".
3.  Click **Install**.
    ![Neon VS Code extension](/docs/local/extension-in-vs-code.png)

You can also install it directly from the marketplace:

<DetailIconCards>

<a href="https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect" description="For VS Code & compatible editors" icon="vscode">VS Code Marketplace</a>

<a href="https://open-vsx.org/extension/databricks/neon-local-connect" description="For Cursor, Windsurf etc." icon="download">OpenVSX Marketplace</a>

</DetailIconCards>

### Connect to your Neon account

Once installed, a new Neon icon will appear in your Activity Bar.

1.  Click the Neon icon to open the Neon panel.
2.  Click **Sign in**. This opens a browser window to authenticate your Neon account using OAuth.
    ![Sign in with your Neon account](/docs/local/sign-in.png)
3.  Authorize the application to connect to your Neon account.
    ![Neon OAuth authorization in browser](/docs/local/authorize.png)

Once you sign in, the extension also configures the [Neon MCP Server](/docs/ai/neon-mcp-server) for your coding agent.

### Connect to a database branch

After authenticating, the extension fetches your Neon projects and branches. It also scans your workspace for existing Neon connection strings and can detect your project and branch automatically.

1.  Select your **Organization** and **Project**.
2.  Choose the **Branch** you want to work on (for example, `development`).
3.  Click **Connect**.

Once connected, the panel shows the branch's connection string. The extension connects to existing branches. For an ephemeral branch that's deleted when you're done, or a static `localhost` connection string that stays the same across branches, use [Neon Local](#neon-local).

### Extension features

The extension turns your IDE into a database management tool, so you don't need to switch contexts.

#### Database schema view

Once connected, a **Database Schema** view appears in the sidebar. This tree view lets you explore your entire database structure: databases, schemas, tables, columns, and relationships (PKs, FKs). Right-click any table for quick actions like **Query Table**, **View Table Data**, **Truncate**, or **Drop**.

![Database Schema View](/docs/local/database_schema_view.png)

#### Built-in SQL editor

Execute queries directly in your IDE. Right-click a table and select "Query Table" to open a pre-filled `SELECT *` query, or open a blank editor from the command palette.

- **View results** in a filterable, sortable table.
- **Export data** to CSV/JSON.
- **See performance stats** and detailed error messages.

  ![SQL Editor in your IDE](/docs/local/sql_editor_view.png)

#### Table data management

For quick edits, right-click a table and select "View Table Data" to open a spreadsheet-like interface.

- **Edit rows** by clicking the pen (edit) icon next to any row (requires a primary key).
- **Insert and delete rows** with dedicated buttons.
- **Paginate** through large datasets.
- Changes are applied to your database immediately.

  ![Table Data Editor](/docs/local/table_data_view.png)

#### Branch management from the panel

The Neon panel also handles branch management:

- **Create a new branch:** Click the **Branch** dropdown, select **Create new branch...**, give it a name, and choose a parent. The extension creates the branch and connects you to it.
- **Switch branches:** Select a different branch from the dropdown. The schema view updates to show the connected branch. Copy that branch's connection string into your `.env` file, or use [Neon Local](#neon-local) if you want one `localhost` string for every branch.

### Connect your application

Copy the connection string from the extension panel and add it to your project's `.env.local` file:

```ini
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

Your app now connects directly to the selected Neon branch.

Follow the [Typical development workflow](#typical-development-workflow) section to see how Neon Local fits into day-to-day work.

## Neon Local

Use Neon Local when you want a static `localhost` connection string, ephemeral branches, or a setup that works outside VS Code and in CI/CD.

Neon Local is a Docker-based proxy that connects to your Neon database and exposes it on a local Postgres endpoint. It provides a static connection string (`localhost:5432`) that routes to the active branch, making it easy to switch branches without changing your code.

### Docker compose configuration

Here is a `docker-compose.yml` that defines your `app` and the `db` (Neon Local) service.

```yaml
services:
  app:
    build: .
    ports:
      - '${PORT}:${PORT}'
    environment:
      - DATABASE_URL="postgres://neon:npg@db:5432/${DB_NAME}?sslmode=no-verify"
    depends_on:
      - db

  db:
    image: neondatabase/neon_local:latest
    ports:
      - '5432:5432'
    environment:
      - NEON_API_KEY=${NEON_API_KEY}
      - NEON_PROJECT_ID=${NEON_PROJECT_ID}
      # Choose one of the following:
      - BRANCH_ID=${BRANCH_ID} # For existing branches
      # - PARENT_BRANCH_ID=${PARENT_BRANCH_ID} # For ephemeral branches
```

#### Key environment variables

| Variable           | Description                                                                               | Required | Default                  |
| ------------------ | ----------------------------------------------------------------------------------------- | -------- | ------------------------ |
| `NEON_API_KEY`     | Your Neon API key.                                                                        | Yes      | N/A                      |
| `NEON_PROJECT_ID`  | Your Neon project ID.                                                                     | Yes      | N/A                      |
| `BRANCH_ID`        | Connects to a specific existing branch. Mutually exclusive with `PARENT_BRANCH_ID`.       | No       | N/A                      |
| `PARENT_BRANCH_ID` | Creates an ephemeral branch from a parent. If omitted, uses the project's default branch. | No       | Project's default branch |
| `DELETE_BRANCH`    | Set to `false` to prevent branches from being deleted when the container stops.           | No       | `true`                   |

If you need to use the `docker run` command instead of Docker Compose, see the [Neon Local docs](/docs/local/neon-local).

### Advanced configuration

#### Persistent branches per Git branch

For a workflow where a database branch's lifecycle matches a Git branch, you can configure Neon Local to persist its state.

Add `volumes` to your `db` service in `docker-compose.yml`:

```yaml
db:
  image: neondatabase/neon_local:latest
  ports:
    - '5432:5432'
  environment:
    NEON_API_KEY: ${NEON_API_KEY}
    NEON_PROJECT_ID: ${NEON_PROJECT_ID}
    DELETE_BRANCH: false
  volumes:
    - ./.neon_local/:/tmp/.neon_local
    - ./.git/HEAD:/tmp/.git/HEAD:ro,consistent
```

This configuration uses your current Git branch name to manage a persistent database branch.

<Admonition type="note">
This will create a `.neon_local` directory in your project to store metadata. Be sure to add `.neon_local/` to your `.gitignore` to avoid committing database information.
</Admonition>

<Admonition type="note" title="Git integration using Docker on Mac">
If using Docker Desktop for Mac, ensure that your VM settings use **gRPC FUSE** instead of **VirtioFS**. There is currently a known bug with VirtioFS that prevents proper branch detection and live updates inside containers.
  ![Docker Desktop are set to gRPC FUSE](/docs/local/neon-local-docker-settings.jpg)
</Admonition>

## Typical development workflow

Neon's branching fits Git-based development workflows. When each Git branch has a matching database branch, changes stay isolated, developers don't collide, and production stays clean.

Here’s a practical look at how to use Neon Local in your daily tasks.

#### The scenario: starting a new task

You've just been assigned a ticket to build a new user profile page. The first step is always to create a new Git branch to isolate your code changes.

```bash
git checkout main
git pull
git checkout -b feature/new-user-profile
```

Now that your code is isolated, you need to isolate your database. You have two primary options depending on the scope of your task.

#### Option 1: Long-lived feature

**When to use it:** This is the standard approach for most feature work, bug fixes that require review, or any task that will span multiple sessions or involve collaboration. You create a persistent database branch that mirrors the lifecycle of your Git branch.

<Tabs labels={["Using the VS Code extension", "Using Neon Local (Docker)"]}>
<TabItem>

With the VS Code extension:

1.  In the Neon panel, click the **Branch** dropdown menu.
2.  Select **Create new branch...**.
3.  Enter a name for your branch. It's good practice to match your Git branch name, like `feature/new-user-profile`.
4.  Choose a parent branch to copy data and schema from (e.g., `production` or `development`).
5.  The extension creates the branch and connects you to it. Copy the new branch's connection string into your `.env` file.

</TabItem>
<TabItem>

With Neon Local, you create the branch in the Neon Console and then configure Neon Local to connect to it.

1.  Navigate to your project in the **[Neon Console](https://console.neon.tech/)**.
2.  Go to the **Branches** page and click **New Branch**.
3.  Name the branch (`feature/new-user-profile`) and select a parent.
4.  Once created, copy the **Branch ID** from the branch details.
5.  In your `docker-compose.yml`, ensure the `db` service is configured to use this specific `BRANCH_ID`.

    ```yaml
    services:
      db:
        # ... other settings
        environment:
          - NEON_API_KEY=${NEON_API_KEY}
          - NEON_PROJECT_ID=${NEON_PROJECT_ID}
          - BRANCH_ID=<your_copied_branch_id> # Connect to the specific branch
    ```

6.  Run `docker compose up` to start the proxy connected to your new feature branch.

</TabItem>
</Tabs>

#### Option 2: Quick experiment or test

**When to use it:** Quick bug fixes, running a single test suite, or experimenting with a schema change that you might throw away. Neon Local creates an ephemeral branch when the container starts and deletes it when the container stops. The VS Code extension connects to existing branches, so use Neon Local for this option.

You create an ephemeral branch by specifying a `PARENT_BRANCH_ID` instead of a `BRANCH_ID`.

1.  In the **[Neon Console](https://console.neon.tech/)**, find the **Branch ID** of the branch you want to use as a parent (e.g., your `production` or `development` branch).
2.  In your `docker-compose.yml`, configure the `db` service to use this parent ID.

    ```yaml
    services:
      db:
        # ... other settings
        environment:
          - NEON_API_KEY=${NEON_API_KEY}
          - NEON_PROJECT_ID=${NEON_PROJECT_ID}
          - PARENT_BRANCH_ID=<your_parent_branch_id> # Create ephemeral branch from this parent
    ```

3.  Run `docker compose up`. Neon Local will create a new, temporary branch from this parent.
4.  When you're finished, run `docker compose down`. Neon Local deletes the ephemeral branch from your Neon project.

## Connecting your application conditionally

Your application code needs to switch between connecting to Neon Local for development and your live Neon database for production. The standard way to manage this is by using the `NODE_ENV` environment variable.

When `process.env.NODE_ENV` is set to `'development'`, your application should use the static `localhost` connection string provided by Neon Local. For any other environment (such as `'production'` on platforms like Vercel, AWS, or other cloud providers), your app should use the actual Neon database URL, typically stored in your deployment environment's configuration or secrets on your cloud provider.

The implementation details vary slightly depending on the database driver or ORM you are using.

<Tabs labels={["@neondatabase/serverless", "Drizzle ORM", "Prisma", "Other drivers"]}>
<TabItem>

The Neon serverless driver talks to a Neon database over HTTP or WebSocket. To send this traffic to the Neon Local proxy in development, reconfigure `neonConfig` to point to `localhost`.

1. Install Dependencies

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm install @neondatabase/serverless ws
   ```

   ```bash
   yarn add @neondatabase/serverless ws
   ```

   ```bash
   pnpm add @neondatabase/serverless ws
   ```

   </CodeTabs>

2. **Configure the connection**

   ```typescript
   import { neon, neonConfig, Pool } from '@neondatabase/serverless';
   import ws from 'ws';

   let connectionString =
     process.env.DATABASE_URL || 'postgres://neon:npg@localhost:5432/<database_name>';

   if (process.env.NODE_ENV === 'development') {
     // Point the serverless driver to the local proxy
     neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
     neonConfig.poolQueryViaFetch = true;
   }

   // Use the WebSocket constructor for Node.js
   neonConfig.webSocketConstructor = ws;

   // Neon supports both HTTP and WebSocket clients. Choose the one that fits your needs:

   // HTTP Client (sql)
   // - Best for serverless functions and Lambda environments
   // - Ideal for stateless operations and quick queries
   // - Lower overhead for single queries
   // - Better for applications with sporadic database access
   export const sql = neon(connectionString);

   // WebSocket Client (pool)
   // - Best for long-running applications (like servers)
   // - Maintains a persistent connection
   // - More efficient for multiple sequential queries
   // - Better for high-frequency database operations
   export const pool = new Pool({ connectionString });
   ```

</TabItem>
<TabItem>

> If you’re using `drizzle-orm` with the standard Postgres wire protocol (not the Neon serverless adapter), refer to the **Other drivers** section.

Using Drizzle with Neon’s serverless adapters requires a similar setup to the one used for the Neon serverless driver directly: configure `neonConfig` to point to your local Neon Local proxy.

1. Install Dependencies

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm install drizzle-orm @neondatabase/serverless ws
   ```

   ```bash
   yarn add drizzle-orm @neondatabase/serverless ws
   ```

   ```bash
   pnpm add drizzle-orm @neondatabase/serverless ws
   ```

   </CodeTabs>

2. **Configure the connection**

   ```typescript
   import { neon, neonConfig, Pool } from '@neondatabase/serverless';
   import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless';
   import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
   import ws from 'ws';

   let connectionString =
     process.env.DATABASE_URL || 'postgres://neon:npg@localhost:5432/<database_name>';

   if (process.env.NODE_ENV === 'development') {
     // Point the serverless driver to the local proxy
     neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
     neonConfig.poolQueryViaFetch = true;
   }

   // Use the WebSocket constructor for Node.js
   neonConfig.webSocketConstructor = ws;

   const sql = neon(connectionString);
   const pool = new Pool({ connectionString });

   // Drizzle supports both HTTP and WebSocket clients. Choose the one that fits your needs:

   // HTTP Client:
   // - Best for serverless functions and Lambda environments
   // - Ideal for stateless operations and quick queries
   // - Lower overhead for single queries
   // - Better for applications with sporadic database access
   export const drizzleClientHttp = drizzleHttp({ client: sql });

   // WebSocket Client:
   // - Best for long-running applications (like servers)
   // - Maintains a persistent connection
   // - More efficient for multiple sequential queries
   // - Better for high-frequency database operations
   export const drizzleClientWs = drizzleWs({ client: pool });
   ```

</TabItem>
<TabItem>

> If you are using `prisma` with the standard Postgres wire protocol (not the Neon serverless adapter), refer to the **Other drivers** section.

Using Prisma with Neon’s serverless adapters requires a similar setup to the one used for the Neon serverless driver directly: configure `neonConfig` to point to your local Neon Local proxy.

1. Install Dependencies

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm install @prisma/client @prisma/adapter-neon @neondatabase/serverless ws
   ```

   ```bash
   yarn add @prisma/client @prisma/adapter-neon @neondatabase/serverless ws
   ```

   ```bash
   pnpm add @prisma/client @prisma/adapter-neon @neondatabase/serverless ws
   ```

   </CodeTabs>

2. **Enable the preview flag (older Prisma versions only)**

   Driver adapters are generally available in current Prisma versions, so you don't need this flag. On older Prisma versions that still require it, enable the `driverAdapters` preview flag in your `schema.prisma` file.

   ```prisma
   // schema.prisma
   generator client {
     provider        = "prisma-client-js"
     previewFeatures = ["driverAdapters"]
   }
   ```

3. **Configure the connection**

   ```typescript
   import { neonConfig } from '@neondatabase/serverless';
   import { PrismaNeon, PrismaNeonHTTP } from '@prisma/adapter-neon';
   import { PrismaClient } from './generated/prisma/client.js';
   import ws from 'ws';

   const connectionString =
     process.env.DATABASE_URL || 'postgres://neon:npg@localhost:5432/<database_name>';

   if (process.env.NODE_ENV === 'development') {
     // Point the serverless driver to the local proxy
     neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
     neonConfig.poolQueryViaFetch = true;
   }

   // Use the WebSocket constructor for Node.js
   neonConfig.webSocketConstructor = ws;

   // Prisma supports both HTTP and WebSocket clients. Choose the one that fits your needs:
   // HTTP Client:
   // - Ideal for stateless operations and quick queries
   // - Lower overhead for single queries
   const adapterHttp = new PrismaNeonHTTP(connectionString, {});
   export const prismaClientHttp = new PrismaClient({ adapter: adapterHttp });

   // WebSocket Client:
   // - Best for long-running applications (like servers)
   // - Maintains a persistent connection
   // - More efficient for multiple sequential queries
   // - Better for high-frequency database operations
   const adapterWs = new PrismaNeon({ connectionString });
   export const prismaClientWs = new PrismaClient({ adapter: adapterWs });
   ```

</TabItem>

<TabItem>

Standard Postgres drivers like `node-postgres` (`pg`) don't require major changes because they communicate over the standard Postgres wire protocol. Neon Local exposes a standard Postgres endpoint on `localhost:5432`.

The only change needed is to switch the connection string and adjust the SSL setting. SSL is required for production connections to Neon but is not needed for the local proxy.

```typescript
import { Client, Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL || 'postgres://neon:npg@localhost:5432/<database_name>';
let sslConfig;

if (process.env.NODE_ENV === 'development') {
  sslConfig = { rejectUnauthorized: false };
}

const pool = new Pool({
  connectionString,
  ssl: sslConfig,
});

const client = new Client({
  connectionString,
  ssl: sslConfig,
});

export { pool, client };
```

For **Drizzle ORM** with the standard Postgres driver, configure the connection string and SSL settings based on your environment:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';

let connectionString =
  process.env.DATABASE_URL || 'postgres://neon:npg@localhost:5432/<database_name>';
let sslConfig;

if (process.env.NODE_ENV === 'development') {
  sslConfig = { rejectUnauthorized: false };
}

export const drizzleClient = drizzle({
  connection: {
    connectionString,
    ssl: sslConfig,
  },
});
```

For **Prisma** with the standard Postgres driver, set the database URL for your environment:

```typescript
import { PrismaClient } from './generated/prisma/client.js';

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgres://neon:npg@localhost:5432/<database_name>',
    },
  },
});
```

- In any case, use the local Neon Local connection string for development and your production Neon connection string in deployed environments.
- Relaxing SSL verification only in local development keeps the Neon Local proxy working while production connections stay fully verified.

</TabItem>
</Tabs>

<Admonition type="note" title="Other languages and drivers">
The `neonConfig` setup is **exclusive to the `@neondatabase/serverless` driver** and its wrappers (Drizzle, Prisma adapter) in Node.js environments.

For applications written in other languages (like Python, Go, Ruby, Java, etc.) that use standard Postgres drivers, you can follow the same pattern as the `node-postgres (pg)` example:

1.  Read the database connection string from an environment variable.
2.  In your local development environment, set this variable to `postgres://neon:npg@localhost:5432/<database_name>`.
3.  In production, set it to your real Neon connection string.
4.  You may need to conditionally disable SSL for the local connection.

No other code modifications are necessary.
</Admonition>

## Summary

You set up the Neon VS Code extension to browse, query, and branch your database from the IDE, and Neon Local with Docker Compose to give your app a static `localhost` connection and ephemeral branches. As a next step, try the [example application](https://github.com/neondatabase-labs/neon-local-example-react-express-application) that uses Neon Local.

## Resources

- [Neon Local documentation](/docs/local/neon-local)
- [Neon VS Code extension](/docs/local/vscode-extension)
- [Example application using Neon Local](https://github.com/neondatabase-labs/neon-local-example-react-express-application)

<NeedHelp/>
