---
title: Connect a Next.js application to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/vercel
  - /docs/integrations/vercel
---

Next.js by Vercel is an open-source web development framework that enables React-based web applications. This topic describes how to create a Neon project and access it from a Next.js application.

To create a Neon project and access it from a Next.js application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Next.js project](#create-a-nextjs-project)
3. [Add a PostgreSQL client to your app](#add-a-postgresql-client-to-your-app)
4. [Add your Neon connection details](#add-your-neon-connection-details)
5. [Connect to the Neon database](#connect-to-the-neon-database)

## Create a Neon project

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.
4. After creating a project, you are directed to the project **Dashboard**, where a connection string with your password is provided under **Connection Details**. The connection string includes your password until you navigate away from the Neon Console or refresh the browser page. Copy the connection string. It is used later to connect to your Neon project.

For additional information about creating projects, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).

## Create a Next.js project

Create a Next.js project if you do not have one. For instructions, see [Create a Next.js App](https://nextjs.org/learn/basics/create-nextjs-app/setup), in the Vercel documentation.

## Add a PostgreSQL client to your app

Add a PostgreSQL client to your app, such as `Postgres.js`. For instructions, refer to the [postgres.js Getting started](https://www.npmjs.com/package/postgres).

## Add your Neon connection details

Add your Neon connection string to your `.env` file.

```shell
DATABASE_URL=postgres://<user>:<password>@<endpoint_hostname>:<port>/<database>
```

where:

- `<user>` is the database user, which is found on the Neon **Dashboard**, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a project.
- `<endpoint_hostname>` the hostname of the branch endpoint, which is found on the Neon **Dashboard**, under **Connection Settings**.
- `<port>` is the Neon port number. The default port number is `5432`.
- `<database>` is the name of the database in your Neon project. `main` is the default database created with each Neon project.

The connection details listed above are provided in the Neon connection string that you copied from the Neon **Dashboard** after you created the Neon project.

## Connect to the Neon database

From your API handlers or server functions, connect to the Neon database with the PostgreSQL client and your Neon connection details. For example:

```javascript pages/api/hello_worlds.js
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

const result = await sql.unsafe(req.body);
```

<Admonition type="important">
Never expose your Neon credentials to the browser.
</Admonition>
