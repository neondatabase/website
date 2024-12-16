---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-16T00:00:00.000Z'
updatedOn: '2024-12-16T00:00:00.000Z'
title: Drizzle with Local and Serverless Postgres
subtitle: A step-by-step guide to configure Drizzle ORM for local and serverless Postgres.
---

Drizzle is an ORM that simplifies database interactions in JavaScript applications. This guide will walk you through the steps to set up Drizzle to work with both local and hosted Postgres databases, and run schema migrations against them.

## Prerequisites

- **Install Docker Desktop**: To set up a local Postgres database, ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.
- A [Neon](https://console.neon.tech) account to set up a hosted Postgres.

## Create a new Next.js application

Let’s get started by creating a new Next.js project with the following command:

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

## Setting Up a Local Postgres

You will use Docker to run your instance of local Postgres. First, create a `docker-compose.yml` file in the root directory with the following code:

```yaml
services:
  postgres:
    image: postgres:latest
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=main
    healthcheck:
      test: [ 'CMD-SHELL', 'pg_isready -U postgres' ]
      interval: 10s
      timeout: 5s
      retries: 5

  neon-proxy:
    image: ghcr.io/timowilhelm/local-neon-http-proxy:main
    environment:
      - PG_CONNECTION_STRING=postgres://postgres:postgres@postgres:5432/main
    ports:
      - '4444:4444'
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  db_data:
```

In the YAML configuration file above, you have set up two services using Docker: a PostgreSQL database and a WebSocket proxy for Neon. The `postgres` service uses the latest PostgreSQL image and configures the necessary environment variables for the database user, password, and database name. It exposes port 5432 for database connections. The `pg_proxy` service uses a WebSocket proxy image, allowing connections to the PostgreSQL service through port `5433`.

Next, spin up the services in Docker via the following command:

```shell shouldWrap
docker-compose up -d
```

Use the connection string (`postgres://postgres:postgres@localhost:5432/postgres`) of the Postgres instance created as an environment variable, designated as `LOCAL_POSTGRES_URL` in the `.env` file.

## Setting Up a Serverless Postgres

To set up Neon serverless Postgres, go to the [Neon console](https://console.neon.tech/app/projects) and create a new project. Once your project is created, you will receive a connection string that you can use to connect to your Neon database. The connection string will look like this:

```bash
postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

Replace `<user>`, `<password>`, `<endpoint_hostname>`, `<port>`, and `<dbname>` with your specific details.

Use this connection string as an environment variable designated as `POSTGRES_URL` in the `.env` file.

## Integrate Drizzle with Next.js

To use Drizzle with Next.js and Neon, install the necessary packages via the following command:

```bash
npm install ws postgres drizzle-orm @neondatabase/serverless
npm install -D @types/ws drizzle-kit
```

Note that the installation of the `postgres` package is important, as in local environments, Drizzle will automatically use that to apply the schema migrations to the Postgres. In production, Drizzle will use Neon’s serverless driver to apply schema migrations to Neon’s hosted Postgres instance.

Then, create a file named `drizzle.server.ts` with the following code:

```typescript
// File: drizzle.server.ts

import { WebSocket } from 'ws'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { neonConfig, Pool } from '@neondatabase/serverless'

const connectionString = process.env.VERCEL_ENV === 'production' ? process.env.POSTGRES_URL : process.env.LOCAL_POSTGRES_URL

if (process.env.VERCEL_ENV === 'production') {
  neonConfig.poolQueryViaFetch = true
  neonConfig.webSocketConstructor = WebSocket
} else {
  neonConfig.pipelineTLS = false
  neonConfig.pipelineConnect = false
  neonConfig.useSecureWebSocket = false
  neonConfig.wsProxy = (host) => `${host}:4444/v1`
}

const pool = new Pool({ connectionString })

export default drizzle(pool)
```

The code above determines the connection string based on the environment variable (production or local). In production, it configures WebSocket settings for Neon, while in local development, it sets up a WebSocket proxy. Finally, it creates a connection pool and exports a Drizzle instance for database interactions.

Next, create a file named `drizzle.config.ts` with the following code:

```typescript
// File: drizzle.config.ts

import { defineConfig } from 'drizzle-kit'

const url = process.env.VERCEL_ENV === 'production' ? process.env.POSTGRES_URL : process.env.LOCAL_POSTGRES_URL
if (!url) throw new Error(`Connection string to ${process.env.VERCEL_ENV ? 'Neon' : 'local'} Postgres not found.`)

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url },
  schema: './lib/schema.ts',
})
```

The code above determines the Postgres connection string to be used based on the environment (production or local) for database operations, such as running schema migrations.

## Running Schema Migrations

Now, you can manage both the local and production environments and select the respective (local or production) Postgres to run the Drizzle migrations via the following commands:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-drizzle-local-vercel" description="Drizzle with Local and Serverless Postgres" icon="github">Drizzle with Local and Serverless Postgres</a>

</DetailIconCards>

<NeedHelp />
