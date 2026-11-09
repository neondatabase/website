---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-16T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
title: Drizzle with local and serverless Postgres
subtitle: Configure Drizzle ORM for a local Postgres database and a Postgres database on Neon
---

Drizzle is an ORM for JavaScript and TypeScript applications. This guide sets up Drizzle to work with both a local Postgres database and a hosted Postgres database on Neon, and runs schema migrations against each.

## Prerequisites

- **Docker Desktop**: To run a local Postgres database, make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.
- A [Neon](https://console.neon.tech) account to set up a hosted Postgres database.

## Create a new Next.js application

Create a new Next.js project with the following command:

```shell shouldWrap
npx create-next-app@latest my-app
```

When prompted, choose:

- `Yes` when prompted to use TypeScript.
- `No` when prompted to use ESLint.
- `Yes` when prompted to use Tailwind CSS.
- `No` when prompted to use `src/` directory.
- `Yes` when prompted to use App Router.
- `No` when prompted to customize the default import alias (`@/*`).

Once that is done, move into the project directory, and start the application in development mode with the following command:

```shell shouldWrap
cd my-app
npm run dev
```

## Set up a local Postgres database

You will use Docker to run a local Postgres instance. First, create a `docker-compose.yml` file in the root directory with the following code:

```yaml
services:
  postgres:
    image: 'postgres:latest'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    ports:
      - '5432:5432'
  pg_proxy:
    image: ghcr.io/neondatabase/wsproxy:latest
    environment:
      APPEND_PORT: 'postgres:5432'
      ALLOW_ADDR_REGEX: '.*'
      LOG_TRAFFIC: 'true'
    ports:
      - '5433:80'
    depends_on:
      - postgres
```

In the YAML configuration file above, you have set up two services using Docker: a Postgres database and a WebSocket proxy for the Neon serverless driver. The `postgres` service uses the latest Postgres image and configures the necessary environment variables for the database user, password, and database name. It exposes port 5432 for database connections. The `pg_proxy` service uses a WebSocket proxy image, allowing connections to the Postgres service through port `5433`.

Next, start the services in Docker with the following command:

```shell shouldWrap
docker-compose up -d
```

Add the local instance's connection string (`postgres://postgres:postgres@localhost:5432/postgres`) to your `.env` file as `LOCAL_POSTGRES_URL`.

## Set up a Postgres database on Neon

Go to the [Neon Console](https://console.neon.tech/app/projects) and create a new project. Then click **Connect** on your project dashboard to get the connection string for your database. It looks like this:

```bash
postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require
```

Replace `<user>`, `<password>`, `<endpoint_hostname>`, `<port>`, and `<dbname>` with your specific details.

Add this connection string to your `.env` file as `POSTGRES_URL`.

## Integrate Drizzle with Next.js

To use Drizzle with Next.js and Neon, install the necessary packages via the following command:

```bash
npm install ws postgres drizzle-orm @neondatabase/serverless
npm install -D @types/ws drizzle-kit
```

Install the `postgres` package even though your code doesn't import it: in local environments, Drizzle uses it to apply schema migrations to your local Postgres. In production, Drizzle uses the Neon serverless driver to apply schema migrations to your database on Neon.

Then, create a file named `drizzle.server.ts` with the following code:

```typescript
// File: drizzle.server.ts

import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { WebSocket } from 'ws';

const connectionString =
  process.env.NODE_ENV === 'production' ? process.env.POSTGRES_URL : process.env.LOCAL_POSTGRES_URL;

if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = WebSocket;
  neonConfig.poolQueryViaFetch = true;
} else {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const pool = new Pool({ connectionString });

export default drizzle(pool);
```

The code above picks the connection string based on the environment (production or local). In production, it configures the WebSocket settings for Neon. In local development, it routes connections through the local WebSocket proxy. Finally, it creates a connection pool and exports a Drizzle instance for database interactions.

Next, create a file named `drizzle.config.ts` with the following code:

```typescript
// File: drizzle.config.ts

import { defineConfig } from 'drizzle-kit';

const url =
  process.env.NODE_ENV === 'production' ? process.env.POSTGRES_URL : process.env.LOCAL_POSTGRES_URL;
if (!url)
  throw new Error(
    `Connection string to ${process.env.NODE_ENV ? 'Neon' : 'local'} Postgres not found.`
  );

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url },
  schema: './lib/schema.ts',
});
```

The code above picks the Postgres connection string for the current environment (production or local), which drizzle-kit uses for operations such as schema migrations.

## Run schema migrations

Run the Drizzle migrations with the following commands. `NODE_ENV` decides whether they run against your local Postgres or your database on Neon:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-drizzle-local-vercel" description="Drizzle with local and serverless Postgres" icon="github">Drizzle with local and serverless Postgres</a>

</DetailIconCards>

<NeedHelp />
