---
title: Connect a RedwoodSDK application to Neon
subtitle: Set up a Neon project in seconds and connect from a Redwood application
enableTableOfContents: true
updatedOn: '2025-05-20T14:57:22.322Z'
---

[RedwoodSDK](https://rwsdk.com/) is a framework for building full-stack applications on Cloudflare. This guide describes how to create a Neon project and access it from a RedwoodSDK application.

To create a Neon project and access it from a RedwoodSDK application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a RedwoodSDK project and add dependencies

1.  Create a RedwoodSDK project if you do not have one. For instructions, see [RedwoodSDK Minimal Starter](https://github.com/redwoodjs/sdk/tree/main/starters/minimal). To create a new project, run the following command:

    ```bash
    npx degit redwoodjs/sdk/starters/minimal my-redwood-app
    ```

2.  Navigate into your new project directory and install the RedwoodSDK dependencies:

    ```bash
    cd my-redwood-app
    npm install
    ```

3.  Add project dependencies using one of the following commands:

    <CodeTabs reverse={true} labels={["postgres.js", "Neon serverless driver"]}>

    ```shell
    npm install postgres
    ```

    ```shell
    npm install @neondatabase/serverless
    ```

    </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find your Neon database connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

## Configure the Postgres client

In your RedwoodSDK application (e.g., in `src/app/pages/Home.tsx`), import the driver and use it within your route handlers.

Here's how you can set up a simple route to query the database:

<CodeTabs reverse={true} labels={["postgres.js", "Neon serverless driver"]}>

```typescript
import { RequestInfo } from "rwsdk/worker";
import postgres from 'postgres';
import { env } from "cloudflare:workers";

async function getData() {
  const sql = postgres(env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return response[0].version;
}

export async function Home({ ctx }: RequestInfo) {
  const data = await getData();
  return <>{data}</>;
}
```

```typescript
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

</CodeTabs>

## Run your RedwoodSDK application

Start the development server:

```bash
npm dev
```

Navigate to your application's URL ([localhost:5173](http://localhost:5173)) in your browser. You should see the output of your database query.

```text
PostgreSQL 17.4 on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
```

> The specific version may vary depending on the PostgreSQL version of your Neon project.

</Steps>

## Source code

You can find a sample RedwoodSDK application configured for Neon on GitHub:

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-redwoodsdk" description="Get started with RedwoodSDK and Neon" icon="github">Get started with RedwoodSDK and Neon</a>

</DetailIconCards>

## Resources

- [RedwoodSDK Documentation](https://docs.rwsdk.com/)
- [Connect to a PostgreSQL database with Cloudflare Workers](https://developers.cloudflare.com/workers/tutorials/postgres/)

<NeedHelp/>
