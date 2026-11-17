---
title: Connect a RedwoodSDK application to Neon
subtitle: Set up a project on Neon in seconds and connect from a Redwood application
summary: >-
  RedwoodSDK is a full-stack framework for Cloudflare Workers. This guide walks
  through creating a project on Neon, installing the Neon serverless driver
  (@neondatabase/serverless), storing the DATABASE_URL connection string in
  .env, and querying the database from a route in TypeScript. Use this page when
  building a RedwoodSDK app on Cloudflare that needs a serverless Postgres
  backend.
enableTableOfContents: true
updatedOn: '2026-09-16T19:45:35.340Z'
---

<CopyPrompt src="/prompts/redwood-sdk-prompt.md"
description="Pre-built prompt for connecting RedwoodSDK applications to Lakebase Postgres"/>

[RedwoodSDK](https://rwsdk.com/) is a framework for building full-stack applications on Cloudflare. This guide describes how to create a Neon project and access it from a RedwoodSDK application.

To create a project on Neon and access it from a RedwoodSDK application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a RedwoodSDK project and add dependencies

1. Create a RedwoodSDK project if you do not have one. Run the following command and follow the prompts:

   ```shell
   npx create-rwsdk@latest my-redwood-app
   ```

   For more information, see the [RedwoodSDK Quickstart](https://docs.rwsdk.com/getting-started/quick-start/).

2. Navigate into your new project directory and install the RedwoodSDK dependencies:

   ```shell
   cd my-redwood-app
   npm install
   ```

3. Install the Neon serverless driver. It connects over HTTP or WebSockets, so it works in Cloudflare Workers:

   ```shell
   npm install @neondatabase/serverless
   ```

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find your Neon database connection string by clicking the **Connect** button in the Console nav to open the **Connect to your branch** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

RedwoodSDK reads this file during local development. Don't commit `.env` to version control.

## Configure the Postgres client

In your RedwoodSDK application, open `src/app/pages/home.tsx`. This is the starter home page. Replace its contents with the following code. It imports the driver, reads `DATABASE_URL` from the Workers `env` object, and queries the database inside the route handler:

```typescript filename="src/app/pages/home.tsx"
import { RequestInfo } from "rwsdk/worker";
import { neon } from '@neondatabase/serverless';
import { env } from "cloudflare:workers";

async function getData() {
  const sql = neon(env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return response[0].version;
}

export async function Home({ ctx }: RequestInfo) {
  const data = await getData();
  return <>{data}</>;
}
```

## Run your RedwoodSDK application

Generate the required Wrangler types for RedwoodSDK to detect environment variables:

```bash
npx wrangler types
```

Start the development server:

```bash
npm run dev
```

Navigate to [localhost:5173](http://localhost:5173) in your browser. You should see a response similar to the following, indicating a successful connection to your Neon database:

```text
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

> The specific version may vary depending on the PostgreSQL version of your Neon project.

</Steps>

## Resources

- [RedwoodSDK Documentation](https://docs.rwsdk.com/)
- [Connect to a PostgreSQL database with Cloudflare Workers](https://developers.cloudflare.com/workers/tutorials/postgres/)

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
