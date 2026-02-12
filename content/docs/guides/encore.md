---
title: Connect an Encore application to Neon
subtitle: Set up a Neon project in seconds and connect from an Encore.ts application
summary: >-
  Step-by-step guide for connecting an Encore application to Neon, including
  installation, application creation, database schema definition, and API
  endpoint setup for production deployments.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.960Z'
---

[Encore](https://encore.dev) is a backend development framework that uses static analysis and type-safe primitives to provide automatic infrastructure provisioning, distributed tracing, and API documentation. This guide shows you how to use Neon with Encore for production deployments.

## Prerequisites

- [Encore CLI](https://encore.dev/docs/install) installed
- A [Neon](https://console.neon.tech) account
- Docker Desktop running (for local development)

<Steps>

## Install Encore

Install the Encore CLI.

<CodeTabs labels={["macOS", "Linux", "Windows"]}>

```bash
brew install encoredev/tap/encore
```

```bash
curl -L https://encore.dev/install.sh | bash
```

```bash
iwr https://encore.dev/install.ps1 | iex
```

</CodeTabs>

## Create an Encore application

Create a new Encore application using the CLI.

```bash
encore app create my-neon-app
```

Select **TypeScript** as the language and choose the template that fits your needs (e.g., **URL Shortener** or **Empty app**).

Navigate to your app directory.

```bash
cd my-neon-app
```

## Define your database schema

If you started with an empty app, set up your database.

1. Create a service directory and service definition (`hello/encore.service.ts`).

   ```typescript
   import { Service } from 'encore.dev/service';

   export default new Service('hello');
   ```

2. Create a database configuration file (`hello/db.ts`).

   ```typescript
   import { SQLDatabase } from 'encore.dev/storage/sqldb';

   export const db = new SQLDatabase('hello', {
     migrations: './migrations',
   });
   ```

3. Create a migration file (`hello/migrations/1_create_table.up.sql`).

   ```sql
   CREATE TABLE messages (
     id BIGSERIAL PRIMARY KEY,
     text TEXT NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT NOW()
   );
   ```

4. Create API endpoints (`hello/hello.ts`).

   ```typescript
   import { api } from 'encore.dev/api';
   import { db } from './db';

   interface Message {
     id: number;
     text: string;
     created_at: Date;
   }

   export const create = api(
     { expose: true, method: 'POST', path: '/messages' },
     async (req: { text: string }): Promise<Message> => {
       const row = await db.queryRow<Message>`
         INSERT INTO messages (text)
         VALUES (${req.text})
         RETURNING id, text, created_at
       `;
       if (!row) throw new Error('Failed to create message');
       return row;
     }
   );

   export const list = api(
     { expose: true, method: 'GET', path: '/messages' },
     async (): Promise<{ messages: Message[] }> => {
       const rows = await db.query<Message>`
         SELECT id, text, created_at FROM messages
         ORDER BY created_at DESC
       `;
       const messages: Message[] = [];
       for await (const row of rows) {
         messages.push(row);
       }
       return { messages };
     }
   );
   ```

## Run locally

Start your Encore application.

```bash
encore run
```

Encore automatically provisions a local PostgreSQL database for development. Your API will be available at `http://localhost:4000` and the development dashboard at `http://localhost:9400`.

![Encore local development dashboard](/guides/images/neon-encore-dashboard.png)

Test your endpoints using the API Explorer in the dashboard, or by running this command.

```bash
curl -X POST http://localhost:4000/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Encore!"}'
```

## Deploy to staging

Push your code to deploy to Encore's staging environment.

```bash
git add -A
git commit -m "Initial commit"
git push encore
```

This creates a staging environment with an Encore-managed database.

## Configure Neon for production

To use your Neon account for production databases.

1. **Create a Neon API Key.**
   - Go to your [Neon Console](https://console.neon.tech/app/settings/api-keys).
   - Create a new API key and copy it. See [Manage API keys](/docs/manage/api-keys) for more information.

2. **Add the API key to Encore.**
   - Open your app in the [Encore Cloud Dashboard](https://app.encore.cloud).
   - Navigate to **Settings** → **Integrations** → **Neon**.
   - Paste your Neon API key and click **Save**.

3. **Create a production environment.**
   - In the Encore dashboard, click **Create Environment**.
   - Name it `production`.
   - For the database provider, select **Neon**.
   - Choose your preferred region.
   - Click **Create**.

## Deploy to production

Deploy your application to the production environment.

```bash
git push encore
```

Encore will do the following.

- Create a Neon database in your account
- Run your migrations automatically
- Deploy your application
- Configure all connections

You can verify the database was created by checking your [Neon Console](https://console.neon.tech) — you'll see a new database created by Encore with your migrations applied.

> **Preview Environments with Neon Branching**
>
> When you connect your Encore app to GitHub and enable preview environments, Encore automatically creates a new Neon database branch for each pull request. This gives each PR its own isolated database with a copy of your production data, allowing you to test database migrations and schema changes safely before merging to production.

</Steps>

## Source code

You can find a complete Encore + Neon example application on GitHub:

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-encore" description="Encore.ts application with Neon Postgres" icon="github">Get started with Encore and Neon</a>

</DetailIconCards>

## Learn more

- [Encore Documentation](https://encore.dev/docs)
- [Encore SQL Databases](https://encore.dev/docs/ts/primitives/databases)
- [Encore Cloud + Neon Integration](https://encore.dev/docs/platform/infrastructure/neon)
- [Blog post: Building Production API Services with Encore and Neon](https://neon.tech/blog/building-production-api-services-with-encore-typescript-and-neon-serverless-postgres)

<NeedHelp/>
