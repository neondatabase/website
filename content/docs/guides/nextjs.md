---
title: Connect a Next.js application to Neon
subtitle: Set up a Neon project in seconds and connect from a Next.js application
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/vercel
  - /docs/integrations/vercel
updatedOn: '2023-10-03T18:28:23.117Z'
---

Next.js by Vercel is an open-source web development framework that enables React-based web applications. This topic describes how to create a Neon project and access it from a Next.js application.

To create a Neon project and access it from a Next.js application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Next.js project](#create-a-nextjs-project)
3. [Add a Postgres client to your app](#add-a-postgresql-client-to-your-app)
4. [Add your Neon connection details](#add-your-neon-connection-details)
5. [Connect to the Neon database](#connect-to-the-neon-database)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Next.js project and add dependencies

1. Create a Next.js project if you do not have one. For instructions, see [Create a Next.js App](https://nextjs.org/learn/basics/create-nextjs-app/setup), in the Vercel documentation.


2. Add project dependencies using one of the following commands:

    <CodeTabs labels={["node-postgres", "postgres.js"]}>
      ```shell
      npm install pg
      ```

      ```shell
      npm install postgres
      ```
    </CodeTabs>



## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).


<CodeBlock shouldWrap>

```shell
DATABASE_URL=postgres://<users>:<password>@ep-snowy-unit-550577.us-east-2.aws.neon.tech/neondb?options=endpoint%3Dep-snowy-unit-550577
```

</CodeBlock>

## Configure the Postgres client 

1. From your API handlers, add the following code snippet to connect to your Neon database:

    <CodeTabs labels={["node-postgres", "postgres.js"]}>
      ```javascript
      import { Pool } from 'pg';

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
        },
      });

      export default async function handler(req, res) {
        const client = await pool.connect();

        try {
          const response = await client.query('SELECT version()');
          console.log(response.rows[0]);
        } finally {
          client.release();
        }
      }

      ```
      ```js
      import postgres from 'postgres';

      const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

      export default async function handler(req, res) {
        const response = await sql`select version()`;
        console.log(response);
      }

      ```
    </CodeTabs>


2. From your server functions, add the following code snippet to connect to your Neon database:

    <CodeTabs labels={["node-postgres", "postgres.js"]}>
      ```javascript
      import { Pool } from 'pg';

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
        },
      });

      export async function getServerSideProps() {
        const client = await pool.connect();

        try {
          const response = await client.query('SELECT version()');
          console.log(response.rows[0]);
          return { props: { data: response.rows[0] } };
        } finally {
          client.release();
        }
      }

      export default function Page({ data }) {}

      ```
      ```js
      import postgres from 'postgres';

      export async function getServerSideProps() {
        const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

        const response = await sql`select version()`;
        console.log(response);
        return { props: { data: response } };
      }

      export default function Page({ data }) {}

      ```
    </CodeTabs>

## Run the app

For API handlers, and server functions you can expect to see one of the following in your terminal output.

```shell
# node-postgres

{
  version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit'
}

# postgres.js

Result(1) [
  {
    version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit'
  }
]
```


## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
