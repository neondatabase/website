---
title: Connect Nuxt to Postgres on Neon
subtitle: Learn how to make server-side queries to Postgres using Nitro API
  routes.
enableTableOfContents: true
updatedOn: '2024-10-16T12:17:44.852Z'
---


[Nuxt](https://nuxt.com/) is an open-source full-stack meta framework that enables Vue-based web applications. This topic describes how to connect a Nuxt application to a Postgres database on Neon.

To create a Neon project and access it from a Next.js application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Nuxt project and add dependencies](#create-a-nuxt-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Nuxt project and add dependencies

1. Create a Nuxt project if you do not have one. For instructions, see [Create a Nuxt Project](https://nuxt.com/docs/getting-started/installation#new-project), in the Nuxt documentation.

2. Add project dependencies using one of the following commands:

   <CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

   ```shell
   npm install pg
   ```

   ```shell
   npm install postgres
   ```

   ```shell
   npm install @neondatabase/serverless
   ```

   </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

## Configure the Postgres client


> Will add the content once https://github.com/neondatabase/examples/pull/30 is merged


## Run the app

When you run `npm run dev` you can expect to see the following on [localhost:3000](localhost:3000):

```shell shouldWrap
PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
```

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-nuxt" description="Get started with Nuxt and Neon" icon="github">Get started with Nuxt and Neon</a>

</DetailIconCards>

<NeedHelp/>

