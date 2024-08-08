---
title: Connect an Express application to Neon
subtitle: Set up a Neon project in seconds and connect from an Express application
enableTableOfContents: true
updatedOn: '2024-07-09T20:55:06.492Z'
---

This guide describes how to create a Neon project and connect to it from an Express application. Examples are provided for using the [Neon serverless driver](https://npmjs.com/package/@neondatabase/serverless), [node-postgres](https://www.npmjs.com/package/pg) and [Postgres.js](https://www.npmjs.com/package/postgres) clients. Use the client you prefer.

To connect to Neon from an Express application:

1. [Create a Neon Project](#create-a-neon-project)
2. [Create an Express project and add dependencies](#create-an-express-project-and-add-dependencies)
3. [Store your Neon credentials](#store-your-neon-credentials)
4. [Configure the Postgres client](#configure-the-postgres-client)
5. [Run app.js](#run-appjs)

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create an Express project and add dependencies

1. Create an Express project and change to the newly created directory.

   ```shell
   mkdir neon-express-example
   cd neon-express-example
   npm init -y
   npm install express
   ```

2. Add project dependencies using one of the following commands:

   <CodeTabs labels={["Neon serverless driver", "node-postgres", "postgres.js"]}>

   ```shell
   npm install @neondatabase/serverless dotenv
   ```

   ```shell
   npm install pg dotenv
   ```

   ```shell
   npm install postgres dotenv
   ```

   </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection details to it. You can find the connection details for your database in the **Connection Details** widget on the Neon **Dashboard**. Please select Node.js from the **Connection string** dropdown. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

<Admonition type="important">
To ensure the security of your data, never expose your Neon credentials to the browser.
</Admonition>

## Configure the Postgres client

Add an `index.js` file to your project directory and add the following code snippet to connect to your Neon database:

<CodeTabs labels={["Neon serverless driver", "node-postgres", "postgres.js"]}>

```javascript
require('dotenv').config();

const express = require('express');
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 4242;

app.get('/', async (_, res) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
```

```javascript
require('dotenv').config();

const { Pool } = require('pg');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4242;

app.get('/', async (_, res) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const client = await pool.connect();
  const result = await client.query('SELECT version()');
  client.release();
  const { version } = result.rows[0];
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
```

```javascript
require('dotenv').config();

const express = require('express');
const postgres = require('postgres');

const app = express();
const PORT = process.env.PORT || 4242;

app.get('/', async (_, res) => {
  const sql = postgres(`${process.env.DATABASE_URL}`);
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
```

</CodeTabs>

## Run index.js

Run `node index.js` to view the result on [localhost:4242](localhost:4242) as follows:

```shell
{ version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit' }
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-express" description="Get started with Express and Neon" icon="github">Get started with Express and Neon</a>

</DetailIconCards>

<NeedHelp/>
