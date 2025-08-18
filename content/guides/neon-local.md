---
title: Getting started with Neon Local and Neon Local Connect for local development
subtitle: Learn how to set up and use Neon Local and Neon Local Connect for seamless local development with Neon
author: 'dhanush-reddy'
enableTableOfContents: true
createdAt: '2025-08-17T00:00:00.000Z'
updatedOn: '2025-08-17T00:00:00.000Z'
---

One of Neon's most powerful features is database branching, the ability to instantly create isolated, copy-on-write clones of your database for any task. Just as you create a Git branch for every new feature or bug fix, you can create a parallel database branch. This eliminates environment drift, prevents developers from overwriting each other's work on shared staging databases, and ensures every development environment is a perfect, isolated replica of production.

But how do you bring this cloud-native power into your local development workflow seamlessly? Constantly switching connection strings for each branch is tedious and error-prone. This is the problem that **Neon Local** and the **Neon Local Connect** VS Code extension solve. They act as a smart local proxy to your Neon database in the cloud. Your application connects to a single, static `localhost` address, while the tools handle all the complexity of routing and branch management behind the scenes. You get the safety and isolation of cloud-based database branches with the convenience and speed of a local Postgres instance.

This guide will walk you through setting up and using both Neon Local and Neon Local Connect to create a powerful, modern development workflow. You'll learn how to:

- Install and configure the Neon Local Connect extension in VS Code.
- Utilize the built-in Schema Viewer, SQL Editor, and Table Editor.
- Connect your local application to a Neon database using a single, static `localhost` connection string.
- Manage database branches (create, switch, reset) directly from your IDE.
- Use Neon Local with Docker Compose for CI/CD or non-VS Code environments.

## Prerequisites

Before you begin, ensure you have the following:

- **Neon account:** A free Neon account. If you don't have one, sign up at [Neon](https://console.neon.tech/signup).
- **VS Code:** Or any compatible editor based on VS Code, such as Cursor or Windsurf.
- **Docker:** Docker Desktop must be installed and running on your machine. You can download it from [docker.com](https://www.docker.com/products/docker-desktop/).
- **Node.js:** Version `18` or later to run the example application.

## Neon Local Connect

The easiest way to get started is with the Neon Local Connect VS Code extension. It manages the underlying Docker container for you, providing a full control panel for your Neon database within your editor.

### Install the extension

First, install the extension from the Visual Studio Marketplace or OpenVSX.

1.  Open your editor and navigate to the **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
2.  Search for "Neon Local Connect".
3.  Click **Install**.
    ![Neon Local Connect Extension](/docs/local/extension-in-vs-code.png)

You can also install it directly from the marketplace:

<DetailIconCards>

<a href="https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect" description="For VS Code & compatible editors" icon="vscode">VS Code Marketplace</a>

<a href="https://open-vsx.org/extension/databricks/neon-local-connect" description="For Cursor, Windsurf etc." icon="download">OpenVSX Marketplace</a>

</DetailIconCards>

### Connect to your Neon account

Once installed, a new Neon icon will appear in your Activity Bar.

1.  Click the Neon icon to open the Neon Local Connect panel.
2.  Click **Sign in with Neon**. This will open a browser window to authenticate your Neon account using OAuth.
    ![Sign in with your Neon account](/docs/local/sign-in.png)
3.  Authorize the application to connect to your Neon account.
    ![Neon OAuth authorization in browser](/docs/local/authorize.png)

### Connect to a Database branch

After authenticating, the extension fetches your Neon projects and branches.

1.  Select your **Organization** and **Project**.
2.  Choose the **Branch** you want to work on (e.g., `development`). You can connect to an **existing branch** or an **ephemeral branch** that is created on connection and destroyed on disconnection.
    <Admonition type="note" title="Using ephemeral branches">
    For using ephemeral branches, you need to authenticate using a Neon API key. This is recommended to ensure that temporary branches are automatically cleaned up when your session ends. To get started, see [Creating API keys](/docs/manage/api-keys). In the Neon Local Connect panel, click **Import API Key** to add your key.
    </Admonition>
3.  Click **Connect**.

The extension will now start a Neon Local Docker container in the background and establish a proxy connection to your selected branch. Once connected, the panel will display a static, local connection string.

The connection string will always be the same, regardless of which branch you connect to:
`postgres://neon:npg@localhost:5432/<database_name>`

### Extension features

Neon Local Connect turns your IDE into a powerful database management tool, eliminating the need to switch contexts.

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

The Neon Local Connect panel also provides easy branch management:

- **Create a new branch:** Click the "Branch" dropdown, select "Create new branch...", give it a name, and choose a parent.
- **Switch branches:** Simply select a different branch from the dropdown. Your `localhost` connection will now point to the new branch no code changes needed.
- **Reset a branch:** Revert a branch to its parent's state to discard changes and get a clean slate. To reset a branch, right click the branch in **Database schema view** and select "Reset Branch".
    ![Reset Branch](/docs/local/reset.png)

### Connect your application

Add the static connection string from the extension panel to your project's `.env.local` file.

```ini
DATABASE_URL="postgres://neon:npg@localhost:5432/<database_name>"
```

> Replace `<database_name>` with your actual database name

Your app now connects to `localhost:5432`, and Neon Local securely routes traffic to the active cloud branch.

Follow the [Typical development workflow](#typical-development-workflow) section for understanding how to leverage Neon Local effectively.

## Neon Local

For non-VS Code users or CI/CD integration, you can use Neon Local directly. This gives you the same power, controlled in a programmatic way.

Neon Local is a Docker-based proxy that connects to your Neon database, allowing you to run a local instance of your cloud database. It provides a static connection string (`localhost:5432`) that routes to the active branch, making it easy to switch branches without changing your code.

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


If you need to use the `docker run` command instead of Docker Compose, you can checkout [Neon Local Docs](/docs/local/neon-local) for more information.

### Advanced configuration

#### Persistent branches per Git Branch

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

Neon's branching is designed to integrate seamlessly with modern, Git-based development workflows. By pairing each Git branch with a corresponding database branch, you can ensure complete isolation, prevent conflicts, and maintain a clean production database.

Here’s a practical look at how to use Neon Local in your daily tasks.

#### The scenario: Starting a new rask

You've just been assigned a ticket to build a new user profile page. The first step is always to create a new Git branch to isolate your code changes.

```bash
git checkout main
git pull
git checkout -b feature/new-user-profile
```

Now that your code is isolated, you need to isolate your database. You have two primary options depending on the scope of your task.

#### Option 1: Long-lived feature

**When to use it:** This is the standard approach for most feature work, bug fixes that require review, or any task that will span multiple sessions or involve collaboration. You create a persistent database branch that mirrors the lifecycle of your Git branch.

<Tabs labels={["Using Neon Local Connect", "Using Neon Local (CLI)"]}>
<TabItem>

With the VS Code extension, creating a persistent branch is trivial:

1.  In the Neon Local Connect panel, click the **Branch** dropdown menu.
2.  Select **Create new branch...**.
3.  Enter a name for your branch. It's good practice to match your Git branch name, like `feature/new-user-profile`.
4.  Choose a parent branch to copy data and schema from (e.g., `production` or `development`).
5.  The extension will instantly create the branch and connect you to it. Your `localhost` connection now points to this new, isolated environment.

</TabItem>
<TabItem>

When using the CLI, you create the branch in the Neon Console and then configure Neon Local to connect to it.

1.  Navigate to your project in the **[Neon Console](https://console.neon.tech/)**.
2.  Go to the **Branches** tab and click **New Branch**.
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

**When to use it:** Perfect for quick bug fixes, running a single test suite, or experimenting with a schema change that you might throw away. An ephemeral branch is created on-the-fly and automatically deleted when you're done.

<Tabs labels={["Using Neon Local Connect", "Using Neon Local (CLI)"]}>
<TabItem>

1.  In the Neon Local Connect panel, click the **Connection Type** dropdown menu.
2.  Instead of selecting "Connect to Neon Branch", choose **Connect to ephemeral Neon branch** option.
3.  Under **Branch**, select a parent branch (e.g., `production`) to base the ephemeral branch on.
4.  Click **Connect**.

The extension creates a temporary branch for your session. When you click **Disconnect**, the branch and all its changes are automatically deleted from your Neon project, leaving no trace.

<Admonition type="note">
For using ephemeral branches, you need to authenticate using a Neon API key. To get started, see [Creating API keys](/docs/manage/api-keys).
</Admonition>

</TabItem>
<TabItem>

With the CLI, you create an ephemeral branch by specifying a `PARENT_BRANCH_ID` instead of a `BRANCH_ID`.

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
4.  When you're finished, run `docker compose down`. The ephemeral branch will be automatically deleted from your Neon project.

</TabItem>
</Tabs>


## Connecting your application conditionally

Your application code needs to seamlessly switch between connecting to Neon Local for development and your live Neon database for production. The standard way to manage this is by using the `NODE_ENV` environment variable.

The core logic is straightforward: when `process.env.NODE_ENV` is set to `'development'`, your application should use the static `localhost` connection string provided by Neon Local. For any other environment (such as `'production'` on platforms like Vercel, AWS, or other cloud providers), your app should use the actual Neon database URL, typically stored in your deployment environment's configuration or secrets.

The implementation details vary slightly depending on the database driver or ORM you are using.

<Tabs labels={["@neondatabase/serverless", "Drizzle ORM", "Prisma", "node-postgres (pg)"]}>
<TabItem>

The Neon serverless driver is designed to communicate with the Neon cloud over HTTP/WebSocket. To redirect this traffic to your local Neon Local proxy, you must override its default behavior in your development environment.

This is done by reconfiguring `neonConfig` to point to `localhost`.

```typescript
// lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

let connectionString = process.env.DATABASE_URL || "postgres://neon:npg@localhost:5432/<database_name>";

if (process.env.NODE_ENV === 'development') {
  // Point the serverless driver to the local proxy
  neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
}

// Use the WebSocket constructor for Node.js
neonConfig.webSocketConstructor = ws;

export const sql = neon(connectionString);
```

</TabItem>
<TabItem>

Drizzle ORM's Neon drivers (`drizzle-orm/neon-http` and `drizzle-orm/neon-serverless`) are built on top of `@neondatabase/serverless`. Therefore, the configuration is nearly identical. You reconfigure `neonConfig` in development before initializing Drizzle.

```typescript
// lib/drizzle.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from 'ws';
import * as schema from './schema';

let connectionString = process.env.DATABASE_URL || "postgres://neon:npg@localhost:5432/<database_name>";

if (process.env.NODE_ENV === 'development') {
  // Point the serverless driver to the local proxy
  neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
}

// Use the WebSocket constructor for Node.js
neonConfig.webSocketConstructor = ws;

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
```

</TabItem>
<TabItem>

Prisma uses the `@prisma/adapter-neon` package to connect to Neon databases. You need to configure the Prisma client to use the Neon adapter and set up the connection string based on the environment.

```prisma
// schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}
```

```typescript
// lib/prisma.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

let prisma;

const connectionString = process.env.DATABASE_URL || "postgres://neon:npg@localhost:5432/<database_name>";

if (process.env.NODE_ENV === 'development') {
  // Point the serverless driver to the local proxy
  neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
}

// Use the WebSocket constructor for Node.js
neonConfig.webSocketConstructor = ws;

const sql = neon(connectionString);
const adapter = new PrismaNeon(sql);
prisma = new PrismaClient({ adapter });

export { prisma };
```
</TabItem>

<TabItem>

Standard PostgreSQL drivers like `node-postgres` (`pg`) do not require any special configuration because they communicate over the standard Postgres wire protocol. Neon Local exposes a standard Postgres endpoint on `localhost:5432`.

The only change needed is to switch the connection string and adjust the SSL setting. SSL is required for production connections to Neon but is not needed for the local proxy.

```typescript
// /lib/db.ts
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || "postgres://neon:npg@localhost:5432/<database_name>";
let sslConfig = { rejectUnauthorized: false }; // For production

if (process.env.NODE_ENV === 'development') {
  sslConfig = false;
}

const pool = new Pool({
  connectionString,
  ssl: sslConfig,
});

export { pool };
```

</TabItem>
</Tabs>

<Admonition type="note" title="A note for other languages and drivers">
The complex `neonConfig` setup is **exclusive to the `@neondatabase/serverless` driver** and its wrappers (Drizzle, Prisma adapter) in Node.js environments.

For applications written in other languages (like Python, Go, Ruby, Java, etc.) that use standard PostgreSQL drivers, the process is much simpler. It follows the same pattern as the `node-postgres (pg)` example:
1.  Read the database connection string from an environment variable.
2.  In your local development environment, set this variable to `postgres://user:pass@localhost:5432/dbname`.
3.  In production, set it to your real Neon connection string.
4.  You may need to conditionally disable SSL for the local connection.

No other code modifications are necessary.
</Admonition>

## Summary

You've now learned how to integrate Neon local and Neon Local Connect into your workflow. With Neon Local Connect, you get a full-featured database IDE that makes managing branches as easy as managing Git branches. For more advanced or automated setups, Neon Local with Docker provides the same powerful capabilities for any environment, ensuring you always have clean, isolated, and production-like databases for development and testing.

## Resources

- [Neon Local Documentation](/docs/local/neon-local)
- [Neon Local Connect extension guide](/docs/local/neon-local-vscode)
- [Example application using Neon Local](https://github.com/neondatabase-labs/neon-local-example-react-express-application)

<NeedHelp/>
