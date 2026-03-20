---
title: >-
  Build and Deploy a Global Serverless Nuxt SSR App with Cloudflare Hyperdrive
  and Postgres
description: >-
  Deploy a Nuxt app on Cloudflare using Neon Postgres, Drizzle, and Cloudflare
  Hyperdrive
excerpt: >-
  Introduction In this post, we’ll create and deploy a Nuxt fullstack
  application on Cloudflare Pages that uses server routes (API endpoints) to
  access Neon Serverless Postgres with Cloudflare Hyperdrive. Cloudflare
  Hyperdrive, now Generally Available, is a serverless application t...
date: '2024-04-05T17:40:09'
updatedOn: '2024-04-13T18:45:01'
category: community
categories:
  - community
  - workflows
authors:
  - stephen-siegert
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/cover.jpg
  alt: Neon Postgres with Cloudflare Hyperdrive
isFeatured: false
seo:
  title: >-
    Build and Deploy a Global Serverless Nuxt SSR App with Cloudflare Hyperdrive
    and Postgres - Neon
  description: >-
    Deploy a Nuxt app on Cloudflare using Neon Postgres, Drizzle, and Cloudflare
    Hyperdrive
  keywords: []
  noindex: false
  ogTitle: >-
    Build and Deploy a Global Serverless Nuxt SSR App with Cloudflare Hyperdrive
    and Postgres - Neon
  ogDescription: >-
    Introduction In this post, we’ll create and deploy a Nuxt fullstack
    application on Cloudflare Pages that uses server routes (API endpoints) to
    access Neon Serverless Postgres with Cloudflare Hyperdrive. Cloudflare
    Hyperdrive, now Generally Available, is a serverless application that
    proxies and accelerates queries to your database. This makes it faster to
    access your data from across […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/social.jpg
source:
  wpId: 5515
  wpSlug: >-
    build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Neon Postgres with Cloudflare Hyperdrive](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/neon-hyperdrive-1024x576-edc2dd48.jpg)

## Introduction

In this post, we’ll create and deploy a [Nuxt](https://nuxt.com/) fullstack application on [Cloudflare Pages](https://pages.cloudflare.com/) that uses server routes (API endpoints) to access Neon Serverless Postgres with [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/).

Cloudflare Hyperdrive, [now Generally Available](https://blog.cloudflare.com/making-full-stack-easier-d1-ga-hyperdrive-queues), is a serverless application that proxies and accelerates queries to your database. This makes it faster to access your data from across the globe, irrespective of your users’ location. Hyperdrive works by maintaining a globally distributed pool of database connections and routing queries to the closest available connection.

Neon complements this architecture by providing a serverless Postgres database that scales compute resources automatically, optimizing performance based on demand.

Hyperdrive is available as a binding in Cloudflare Pages when using Pages Functions _but_ there are some runtime compatibility caveats for setup. For example, full support for [node-postgres](https://node-postgres.com/) is not yet available. This situation can lead to some challenges, especially when running the Nuxt build command locally to create the deployment artifacts. With that in mind, the [Drizzle ORM Postgres HTTP Proxy](https://orm.drizzle.team/docs/get-started-postgresql#http-proxy) can be used to connect to Hyperdrive through a Cloudflare Worker that’s configured with the binding that uses Neon.

This provides two options for integrating a Nuxt application with Neon Postgres on Cloudflare:

1. Use the [Neon Serverless driver](https://neon.tech/docs/serverless/serverless-driver) and connect to Neon directly from the Nuxt server route with the [Cloudflare Pages Postgres](https://neon.tech/docs/guides/cloudflare-pages) integration.
2. Or, deploy a Worker configured with the Hyperdrive configuration that’s accessible using the Drizzle Postgres HTTP Proxy driver from the Pages app.

In both scenarios, Drizzle can be used to access and query Neon databases. We’ll cover the second approach that uses _both Hyperdrive and Neon Postgres_. Using the Worker in this setup offers a flexible workaround for integrating other dependencies or services too, if needed.

## Overview

Below are the integration points between a Nuxt SSR app deployed to the Cloudflare Pages app that utilizes Neon Postgres configured with Cloudflare Hyperdrive.

![Nuxt with Cloudflare Pages, Workers, Hyperdrive, and Neon Serverless Postgres](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/nuxt-hyperdrive-neon-drizzle-1024x243-024acad5.png)

At a high level:

1. A client request is made to the Nuxt server route
2. The server route uses Drizzle to submit a query to the Neon Postgres database
3. The database driver, configured with the Drizzle HTTP Proxy, points to the Cloudflare Worker configured with the Cloudflare Hyperdrive binding for Neon Postgres
4. Hyperdrive evaluates the query and executes or returns a cached response
5. That response is returned through the Nuxt Server Route to the requesting client

To configure and deploy this solution, we’ll follow these steps:

1. Create a Nuxt App
2. Configure the app for Cloudflare Pages deployment
3. Create a Hyperdrive configuration for Neon Postgres
4. Create the Drizzle ORM driver for the HTTP Proxy
5. Configure Cloudflare Worker Postgres HTTP Proxy service with Hyperdrive
6. Configure the database schema in the Pages app with Drizzle
7. Update the Nuxt server route to query the database and return results

This approach can be used with other frameworks that support server-side compute functionality like [Remix](https://remix.run/), [Next](https://nextjs.org/), and [Astro](https://astro.build/).<br /><br />_**Note:** _ ** _The ex_ ample app _should never be completely accessible to the internet in a production environment without security measures in place. This code will need to be modified for production use to restrict access to the Nuxt Server Route and the Postgres Proxy._**

## Prerequisites

This post assumes familiarity with Cloudflare, Drizzle, and Nuxt. Additionally, a Neon Postgres account is needed to create the Postgres database and a Cloudflare Workers Paid plan is needed to access the Hyperdrive functionality(the service itself is free).

For Neon, visit the [Neon Console](https://console.neon.tech/), sign up, and create your first project by following the prompts in the UI. You can use an existing project or create another if you’ve already used Neon.

## Frontend: Create the Nuxt App

Start by creating a Nuxt app using `nuxi` to deploy to Cloudflare Pages.

```bash
pnpm dlx nuxi@latest init nuxt-hyperdrive-ai
```

```bash
dependencies:
+ nuxt 3.11.1
+ vue 3.4.21
+ vue-router 4.3.0

Done in 17s
✔ Installation completed.
✔ Initialize git repository?
Yes
ℹ Initializing git repository...
Initialized empty Git repository in
/nuxt-hyperdrive-ai/.git/

✨ Nuxt project has been created with the v3 template. Next steps:
 › cd nuxt-hyperdrive-ai
 › Start development server with pnpm run dev
```

This Pages application will be the frontend along with the API routes using Nuxt server routes.

Additionally, the `wrangler` dependency is needed if you’re testing the app locally (emulating the Cloudflare environment), and to deploy the built app to Cloudflare.

```bash
pnpm add wrangler
```

Now update and save the `nuxt.config.js` to specify Cloudflare Pages as the deploy target using the `nitro preset`. This zero-config preset within the [Nitro](https://nitro.unjs.io/) server takes care of all the rearranging and build output configuration to make the app “deployable” to Cloudflare. Additionally, server-side rendering (SSR) routes are deployed to the correct resources. Meaning, compute will be associated with server routes, once created, automatically.<br /><br />_Read more about the_ [Nitro Cloudflare Pages](https://nitro.unjs.io/deploy/providers/cloudflare) _preset._

```json
export default defineNuxtConfig({
  ...
  nitro: {
    preset: "cloudflare-pages",
  },
});
```

Now, test the app locally by building and emulating the Cloudflare environment. First, commit your changes to the working branch (i.e.`main`) and build.

```bash
git add .
git commit -m'init'

pnpm build
pnpm dlx wrangler pages dev dist
```

_Note: Make sure to build the app before testing (and deploying) if there have been changes._

Once you’ve tested the app locally, deploy the app.

```bash
npx wrangler pages deploy dist/
```

And, verify the live deployed endpoint.

![Nuxt Getting Started Page](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/welcome-to-nuxt-1024x755-685b0dce.png)

## Backend: Create the Worker API with Hyperdrive integration

Now that the base front-end portion of the app is up and running, create ** _a new_ ** Cloudflare Worker to act as a data proxy for a Hyperdrive configuration.

### Create the Postgres HTTP Proxy Worker

This application will use the [Hono](https://hono.dev/) web framework to manage the routes and endpoints. Hono is an _ultrafast_ framework optimized for serverless and edge environments.

```bash
 pnpm create hono postgres-hyperdrive-ai
```

```bash
create-hono version 0.6.2
✔ Using target directory … postgres-hyperdrive-ai
? Which template do you want to use? cloudflare-workers
✔ Cloning the template
? Do you want to install project dependencies? yes
? Which package manager do you want to use? pnpm
✔ Installing project dependencies
🎉 Copied project files
Get started with: cd postgres-hyperdrive-ai
```

This worker will provide access to the Neon database (via Hyperdrive). Install [`node-postgres`](https://node-postgres.com/) into the project.

```bash
pnpm add pg
pnpm add @types/pg -D
```

### Create the Postgres Hyperdrive Configuration

In Neon, create a new project named **hyperdrive-ai**. This will be the Postgres cluster used with Hyperdrive. Optionally, [create a new role](https://neon.tech/docs/manage/roles) (i.e.**hyperdrive-ai**) for the connection configuration.

Select the **Pooled connection** option and copy the connection string.

![Neon Serverless Postgres project dashboard](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/neon-project-dashboard-1024x511-fe4ceae1.png)

Within your new Worker’s project directory, create the Hyperdrive configuration using `wrangler`.

```bash
npx wrangler hyperdrive create $NAME --connection-string="postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name"
```

For example:

```bash
npx wrangler hyperdrive create hyperdrive-postgres --connection-string="postgresql://<username>:<password>@ep-falling-breeze-a444fbohr-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

This creates a new configuration similar to the output below:

```bash
🚧 Creating 'hyperdrive-postgres'
✅ Created new Hyperdrive config
 {
  "id": "<hyperdrive-configuration-id>",
  "name": "hyperdrive-postgres",
  "origin": {
    "host": "ep-falling-breeze-a544ohr-pooler.us-east-2.aws.neon.tech",
    "port": 5432,
    "database": "neondb",
    "scheme": "postgresql",
    "user": "hyperdrive-ai"
  },
  "caching": {
    "disabled": false
  }
}
```

If you check in the Cloudflare console, the configuration will be present now.

![Cloudflare Hyperdrive configuration](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/hyperdrive-configuration-1024x109-541460d0.png)

The default caching behavior for Hyperdrive is set with a **max_age** of 60 seconds, during which cached query responses are served. Responses might be removed from the cache sooner if not frequently accessed. Additionally, the **stale_while_revalidate** setting allows Hyperdrive to serve stale cache results for an extra 15 seconds while updating the cache, typically completing revalidation quickly. The caching behavior can and should be tuned based on your app requirements. Additionally, it’s possible, using this pattern, to create more than 1 Hyperdrive configuration, if needed, to work across data sources.<br /><br />With the **`id`** in the output from the command above, update the `wrangler.toml` with the Hyperdrive binding:

```yaml
name = "postgres-hyperdrive-ai"
compatibility_date = "2023-12-01"

node_compat = true # required for database drivers to function

[[hyperdrive]]
binding = "HYPERDRIVE"
id = "<id-from-command>"
```

Also, make sure that `node_compat = true` is present. This is required for the use of the `node-postgres` driver.

**Save** the `wrangler.toml` file.

This configuration will bind the Hyperdrive connection with the worker and allow the database to be queried via the Hyperdrive reference.

Now that the binding is set up, the Worker handler can be configured to connect to Hyperdrive, which then queries the Neon database. This proxy will follow the pattern documented for the [Drizzle Postgres HTTP Proxy](https://orm.drizzle.team/docs/get-started-postgresql#http-proxy). Subsequently, in the next section, the Nuxt app from earlier will be modified to use Drizzle to point to this proxy from within the SSR API routes. This proxy will enable the Pages app to take advantage of Hyperdrive.

Update the Worker `index.ts` code to add a `/query` route.

```typescript
// index.ts

import { Hono } from "hono";
import { Client, QueryConfig } from "pg";

export type Env = {
  HYPERDRIVE: Hyperdrive;
};

const app = new Hono<{ Bindings: Env }>();

app.post("/query", async (c) => {
  const { sql, params, method } = await c.req.json();

  const client = new Client({
    connectionString: c.env.HYPERDRIVE.connectionString,
  });

  await client.connect();

  // prevent multiple queries
  const sqlBody = sql.replace(/;/g, "");

  try {
    const result = await client.query({
      text: sqlBody,
      values: params,
      rowMode: method === "all" ? "array" : undefined,
    } as QueryConfig<any>);

    return c.json(result.rows);
  } catch (e: any) {
    return c.json({ error: e }, 500);
  }
});

export default app;
```

Once running (and deployed), this worker API route will now:

1. Bind the Hyperdrive configuration from the `wrangler.toml` to the Worker and make it accessible to the environment and available in the app `Context` object with `type Env = \{ HYPERDRIVE: Hyperdrive \};`
2. Listen for POST requests made to the `/query` endpoint
3. Parse the request parameters (these will come from Drizzle)
4. Creates a `node-postgres` `Client` connection to Hyperdrive (which is leveraging our Neon Postgres database)
5. Executes the requested query
6. Returns the results

_**Note: The published endpoint should never be completely accessible to the internet in a production environment without security measures in place. This code will need to be modified for production use.**_

This portion of the architecture can now be deployed. To deploy using `wrangler`, run:

```bash
pnpm run deploy
```

The API will now be live 🎉. Next, the full-stack frontend app will be integrated.

## Update the Nuxt App to make a request to the Neon Hyperdrive Worker

In the Nuxt Pages app (_nuxt-hyperdrive-ai_) Drizzle needs to be configured to point to the new Hyperdrive Neon proxy that was just created.

Install `drizzle-orm` into the project:

```bash
pnpm add drizzle-orm
```

### Configure Drizzle for the Hyperdrive Postgres Proxy

In the root of the project, create `lib/db.ts`. Add the below Drizzle HTTP Proxy configuration and replace the requested endpoint with the Worker endpoint that was created earlier for the Hyperdrive proxy.

```typescript
// lib/db.ts

// Connect to the Neon Hyperdrive Postgres Proxy Server
// with the Drizzle ORM

import { drizzle } from "drizzle-orm/pg-proxy";

export const db = drizzle(async (sql, params, method) => {
  try {
    const res = await fetch(
      "<add-the-cloudflare-worker-hyperdrive-proxy-url>",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql,
          params,
          method,
        }),
      }
    );

    const rows = await res.json();

    return { rows: rows || [] };
  } catch (e: any) {
    console.error("Error from pg proxy server: ", e.response.data);
    return { rows: [] };
  }
});
```

The code above creates a Drizzle driver that uses the remote Worker proxy as the database. In this architecture, that means that queries using Drizzle will go to Hyperdrive, and Hyperdrive will query or cache the Neon Postgres responses. With this integration, the developer experience of using Drizzle will remain the same but Neon will be behind Hyperdrive.<br /><br />Replace the **`<add-the-cloudflare-worker-hyperdrive-proxy-url>`** in the code above with your Workers URL. Consider using an environment variable or secret to inject this value once the deployment URL is known. Or, if using a custom domain, then both Page and Worker can be [mapped with routes on the same top-level domain](https://developers.cloudflare.com/workers/configuration/routing/routes/).

The only thing that is missing now is the Drizzle schema configuration and updating the Nuxt server route to query and return data from our Neon database.

### Update the Schema and Nuxt Server Route

Create a table in your `hyperdrive-ai` Neon Postgres project and add records using the SQL statements below:

```sql
CREATE TABLE "Element" (
    id TEXT PRIMARY KEY,
    element_name TEXT NOT NULL,
    symbol VARCHAR(3) NOT NULL,
    atomic_number INTEGER NOT NULL
  );
```

Populate the table with the below records.

```sql
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsneiyxk0001dksafvwnhm83', 'Helium', 2, 'He');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsneiz830002dksaxog1ut03', 'Lithium', 3, 'Li');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsneizic0003dksa8p71q9uo', 'Beryllium', 4, 'Be');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsneizsq0004dksa00ee6tvh', 'Boron', 5, 'B');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsnej03b0005dksa9m7p20qi', 'Carbon', 6, 'C');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsnej0dk0006dksa70fneon1', 'Nitrogen', 7, 'N');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsnej0nx0007dksafl3j0r98', 'Oxygen', 8, 'O');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsnej0yk0008dksa4uz6k194', 'Fluorine', 9, 'F');
INSERT INTO "Element" (id, element_name, atomic_number, symbol) VALUES ('clsnej18x0009dksaljva7jqh', 'Neon', 10, 'Ne');
```

![Rows in Neon Postgres Table Viewer](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/records-in-neon-db-1024x436-809b65f4.png)

### Add the Drizzle Schema

In `lib/db.ts`, add in the schema for the above `"Element`” table. This will be used to query against the above table structure.

```typescript
// lib/db.ts
...

import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const Elements = pgTable("Element", {
  id: text("id").primaryKey(),
  name: text("element_name").notNull(),
  symbol: varchar("symbol", { length: 3 }).notNull(),
  atomicNumber: integer("atomic_number").notNull().primaryKey(),
});

...
```

In a production setup, consider setting up [database migrations with Drizzle and Neon](https://neon.tech/blog/api-cf-drizzle-neon) to speed up development iteration and harden your workflow.

### Update the Nuxt Server Route

Now, with the database configured and schema added to match, update the Nuxt server route to use the Drizzle db driver to query and return results from the endpoint.

The server routes in Nuxt are effectively API endpoints that use server-side compute. The `server/` directory is specific to this functionality and is used to register API and server handlers to your application.

In `server/api/hello.ts`, update the code to match the snippet below.

```typescript
// server/api/hello.ts

import { db, Elements } from "@/lib/db";

export default defineEventHandler(async ({ context }) => {
  if (!db) {
    return context.text("Could not connect to database");
  }

  const result = await db.select().from(Elements);

  return {
    result,
  };
});
```

Once this is saved. Build and deploy the Workers Pages app again.

```bash
pnpm run build
npx wrangler pages deploy dist/
```

_Note: Unlike Workers, Pages deployments get unique URLs. Make sure to check the latest endpoint after deployment._

After deployment, access the Nuxt server route endpoint by visiting the `/api/hello` route at `https://<id>.<project-name>.pages.dev/api/hello`.

![Nuxt Sever Route API](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/nuxt-api-results-1024x856-13aeb10c.png)

After making requests, view the Hyperdrive cache metrics in the Cloudflare console.

![Cloudflare Hyperdrive cache metrics](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/hyperdrive-cache-metrics-1024x116-fe26c7fe.png)

![Cloudflare Hyperdrive Cache metrics](https://cdn.neonapi.io/public/images/pages/blog/build-and-deploy-global-serverless-nuxt-ssr-app-with-cloudflare-hyperdrive-and-postgres/hyperdrive-cache-metrics-2-1024x568-a6de83c5.png)

## Cleanup

Delete and remove the Cloudflare Pages app and worker. Additionally, remove the Hyperdrive configuration if no longer needed.

## Conclusion

In this post, we’ve walked through the process of creating a global serverless Nuxt SSR application, leveraging Cloudflare Hyperdrive and Neon Postgres. Hyperdrive optimizes the query routing to reduce latency, while Neon provides scalable, cloud-optimized serverless Postgres.<br /><br />By integrating Cloudflare Hyperdrive, we’ve seen how to efficiently route queries to optimize our app’s responsiveness globally. The use of Nuxt, Drizzle, and Hono has streamlined the development process, offering a smoother experience.<br /><br />To get started with incorporating Serverless Postgres with your Cloudflare infrastructure, sign up and [try Neon for free](https://console.neon.tech/signup). Follow us on [Twitter/X](https://twitter.com/neondatabase), join us on [Discord](https://neon.tech/discord), and let us know how we can help you build the next generation of applications.
