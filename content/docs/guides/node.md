---
title: Connect a Node.js application to Neon
subtitle: Set up a Neon project in seconds and connect from a Node.js application
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/node
  - /docs/integrations/node
updatedOn: '2023-10-03T19:45:09.137Z'
---

This guide describes how to create a Neon project and connect to it from a Node.js application. Examples are provided for using the [node-postgres](https://www.npmjs.com/package/pg) and [Postgres.js](https://www.npmjs.com/package/postgres) clients. Use the client you prefer.

<Admonition type="note">
The same configuration steps can be used for Express and Next.js applications.
</Admonition>

To connect to Neon from a Node.js application:

1. [Create a Neon Project](#create-a-neon-project)
2. [Create a NodeJS project and add dependencies](#create-a-nodejs-project-and-add-dependencies)
3. [Store your Neon credentials](#store-your-neon-credentials)
4. [Configure the app.js file](#configure-the-appjs-file)
5. [Run app.js](#run-appjs)

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a NodeJS project and add dependencies

1. Create a NodeJS project and change to the newly created directory.

   ```shell
   mkdir neon-nodejs-example
   cd neon-nodejs-example
   npm init -y
   ```

2. Add project dependencies using one of the following commands:

    <CodeTabs labels={["node-postgres", "postgres.js"]}>
      ```shell
      npm install pg dotenv
      ```

      ```shell
      npm install postgres dotenv
      ```
    </CodeTabs>
    
## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

<CodeBlock shouldWrap>

```shell
DATABASE_URL=postgres://<users>:<password>@ep-snowy-unit-550577.us-east-2.aws.neon.tech/neondb?options=endpoint%3Dep-snowy-unit-550577
```

</CodeBlock>

<Admonition type="note">
A special `endpoint` connection option is appended to the connection string above: `options=endpoint%3Dep-snowy-unit-550577`. This option is used with Postgres clients such as `node-postgres` and `Postgres.js` that do not support Server Name Indication (SNI), which Neon relies on to route incoming connections. For more information, see [connection errors](/docs/connect/connection errors#a-pass-the-endpoint-id-as-an-option).
</Admonition>

<Admonition type="important">
To ensure the security of your data, never expose your Neon credentials to the browser.
</Admonition>

## Configure the Postgres client 

Add an `app.js` file to your project directory and add the following code snippet to connect to your Neon database:
  
<CodeTabs labels={["node-postgres", "postgres.js"]}>
  ```javascript
  const { Pool } = require('pg');
  require('dotenv').config();

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      require: true,
    },
  });

  async function getPostgresVersion() {
    const client = await pool.connect();
    try {
      const response = await client.query('SELECT version()');
      console.log(response.rows[0]);
    } finally {
      client.release();
    }
  }

  getPostgresVersion();
  ```
  ```javascript
  const postgres = require('postgres');
  require('dotenv').config();

  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

  async function getPostgresVersion() {
    const response = await sql`select version()`;
    console.log(response);
  }

  getPostgresVersion();
  ```
</CodeTabs>

## Run app.js

Run `node app.js` to view the result.

```shell
Result(1) [
  {
    version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit'
  }
]
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
