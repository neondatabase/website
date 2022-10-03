---
title: Run a Next.js app
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/vercel
---

Next.js by Vercel is an open-source web development framework that enables React-based web applications. This topic describes how to create a Neon project and access it from a Next.js app.

To create a Neon project and access it from a Next.js app:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Next.js project](#create-a-nextjs-project)
3. [Add a PostgreSQL client to your app](#add-a-postgresql-client-to-your-app)
4. [Add your Neon connection details](#add-your-neon-connection-details)
5. [Connect to the Neon database](#connect-to-the-neon-database)

## Create a Neon project

When creating a Neon project, take note of your project ID, database name, user, password, and port number. This information is required when defining your connection settings. 

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Enter a name for your project and click **Create Project**.

For additional information about creating projects, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).

## Create a Next.js project

Create a Next.js project if you do not have one. For instructions, see [Create a Next.js App](https://nextjs.org/learn/basics/create-nextjs-app/setup), in the Vercel documentation.

## Add a PostgreSQL client to your app

Add a PostgreSQL client to your app, such as `Postgres.js`.  For instructions, refer to the [postgres.js Getting started](https://www.npmjs.com/package/postgres).

## Add your Neon connection details

Add your Neon connection details to your `.env` file.

```shell
NEON_HOST='<project_id>.cloud.neon.tech'
NEON_PORT='<port>'
NEON_DB='<database>'
NEON_USER='<username>'
NEON_PASS='<password>'
```

where:

- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.
- `<port>` is the Neon port number. The default port number is `5432`.
- `<database>` is the name of the database in your Neon project. `main` is the default database created with each Neon project.
- `<username>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a project.

## Connect to the Neon database

From your API handlers or server functions, connect to the Neon database with the PostgreSQL client and your Neon connection details. For example:

```javascript pages/api/hello_worlds.js
import postgres from 'postgres';

const sql = postgres({
  host: process.env.NEON_HOST,
  port: process.env.NEON_PORT,
  database: process.env.NEON_DB,
  username: process.env.NEON_USER,
  password: process.env.NEON_PASS,
});

const result = await sql.uafe(req.body);
```

_**Important**_: Never expose your Neon credentials to the browser.
