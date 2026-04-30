---
title: How to use Postgres at the Edge
description: >-
  A closer look at how to use Neon's serverless driver with Vercel Edge
  Functions
excerpt: >-
  In this post, I’d like to introduce Neon’s serverless driver which is suitable
  for use with Vercel Edge Functions. I’ll explain how to use it with Next.js
  and a free Neon serverless Postgres database Here’s a demo I created. I’ve
  called it Ping Thing. What does Ping Thing do? Whe...
date: '2023-09-19T15:33:04'
updatedOn: '2025-12-12T13:31:49'
category: community
categories:
  - community
authors:
  - paul-scanlon
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-use-postgres-at-the-edge/cover.jpg
  alt: 'Ping Thing: Serverles Postgres at the Edge'
isFeatured: false
seo:
  title: How to use Postgres at the Edge - Neon
  description: >-
    A closer look at how to use Neon's serverless driver with Vercel Edge
    Functions
  keywords: []
  noindex: false
  ogTitle: How to use Postgres at the Edge - Neon
  ogDescription: >-
    A closer look at how to use Neon's serverless driver with Vercel Edge
    Functions
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-use-postgres-at-the-edge/social.jpg
source:
  wpId: 3292
  wpSlug: how-to-use-postgres-at-the-edge
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Ping Thing: Serverles Postgres at the Edge](https://cdn.neonapi.io/public/images/pages/blog/how-to-use-postgres-at-the-edge/ping-thing-page-1024x576-17286e02.jpg)

In this post, I’d like to introduce [Neon’s serverless driver](https://neon.tech/docs/serverless/serverless-driver) which is suitable for use with Vercel Edge Functions. I’ll explain how to use it with Next.js and a **free** [Neon serverless Postgres database](https://neon.tech/)

Here’s a demo I created. I’ve called it Ping Thing.

- Live Preview: [https://neon.tech/demos/ping-thing](https://neon.tech/demos/ping-thing)
- ⚙️ Repo: [https://github.com/neondatabase/ping-thing](https://github.com/neondatabase/ping-thing)

## What does Ping Thing do?

When users click Ping, the app sends a request to an Edge Function deployed on Vercel, where the geolocation data is extracted from the request and posted to a Neon database. I’ve added a 3D globe to visualise the journey and calculated some statistics about the request.<br />

Give it a Ping and see **your** data journey

## Can I use ordinary Postgres at the Edge?

The short answer is no, not currently. The main reason being, [Postgres connections are made over TCP/IP](https://www.postgresql.org/docs/current/protocol.html) and generally speaking, “Edge” environments like Vercel Edge Functions, based on [V8 isolates](https://developers.cloudflare.com/workers/learning/how-workers-works/#isolates), don’t speak TCP

## Can I use Neon serverless Postgres at the Edge?

Yes, and here’s why. Native Postgres couples compute and storage, but with Neon, we’ve separated them. Neon’s serverless driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), aka pg. Everything you know and love about [pg](https://www.npmjs.com/package/pg), will continue to work as expected as will any pg-compatible libraries. The difference is the way we handle the connection.

The serverless driver can use either HTTP or Websockets to make a connection to a Neon proxy, which in turn makes a TCP connection to Postgres. This makes Neon a great solution when working in Edge environments.

## How to use Neon’s serverless driver with Next.js

In the below example, I’ll show you how to use Neon’s serverless driver with Next.js [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes).

To get started, sign up to [Neon](https://neon.tech/), then follow our [Create your first project](https://neon.tech/docs/get-started-with-neon/setting-up-a-project) guide. You might also like to have a look at this guide from our docs: [Query with Neon’s SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor).<br />Once you have a database set up, save the connection string to your Next.js `.env` file and give it a name of `DATABASE_URL`.

### Neon’s serverless driver

To get started install the package.

```bash
npm install @neondatabase/serverless
```

### Create an API Route

Any file added to `pages/api` will be treated as an API endpoint, you can read more about API routes in the [Next.js docs](https://nextjs.org/docs/pages/building-your-application/routing/api-routes).<br />_You’ll need to change table_name to the table name you create in your database._

```javascript
import { neon } from '@neondatabase/serverless';

export default async function handler() {
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT * FROM table_name`;

  return Response.json({
    message: 'A Ok!',
    data: response,
  });
}

export const config = {
  runtime: 'edge',
};
```

And that’s it! Postgres at the Edge.

## SQL-over-HTTP or WebSockets?

In the above example using the `neon` export, you’re querying using **SQL-over-HTTP**. This is great for single-shot queries, but if you’re looking to perform multiple queries in a single connection you might want to take a look at [Pool or Client](https://neon.tech/docs/serverless/serverless-driver#using-node-postgres-pool-or-client) which use **WebSockets**.

Pool and Client are part of the same npm package, and you can use Pool like this.

```javascript
import { Pool } from '@neondatabase/serverless';

export default async function handler(req, ctx) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const response = await pool.query('SELECT * FROM table_name');
  ctx.waitUntil(pool.end());

  return Response.json({
    message: 'A Ok!',
    data: response.rows,
  });

  }

export const config = {
  runtime: 'edge',
};
```

Having the flexibility to use either, HTTP or WebSockets in one package is super helpful and here’s a great blog post from my colleague [Raouf Chebri](https://twitter.com/raoufdevrel) where he explains both approaches in more detail: [HTTP vs. WebSockets: Which protocol for your Postgres queries at the Edge](https://neon.tech/blog/http-vs-websockets-for-postgres-queries-at-the-edge)

## What can you do with Edge Functions?

Good question, now you’re at the Edge, what ya gonna do? Hopefully, more than simply return hello world!

### Using @vercel/edge for Geolocation Information

One area I’ve been investigating uses Vercel’s [geolocation information](https://vercel.com/docs/functions/edge-functions/vercel-edge-package#geolocation). You can use this handy little helper package to see geolocation information from incoming requests.

To get started, install the package.

```bash
npm install @vercel/edge
```

### Storing user’s geolocation data in Neon

The below code snippet is an example of destructuring a user’s `country`, `city`, `latitude` and `longitude` from the geolocation helper function and an `INSERT` statement to add the data to a table called `locations`.

```javascript
import { neon } from '@neondatabase/serverless';
import { geolocation } from '@vercel/edge';

export default async function handler(req) {
  const sql = neon(process.env.DATABASE_URL);

  const { country, city, latitude, longitude } = geolocation(req);

  await sql('INSERT INTO locations (country, city, latitude, longitude) VALUES ($1, $2, $3, $4)', [
    country,
    city,
    latitude,
    longitude,
  ]);

  return Response.json({
    message: 'A Ok!',
  });
}

export const config = {
  runtime: 'edge',
};
```

And here’s the schema I used to create the `locations` table.

```sql
CREATE TABLE locations (
  id           SERIAL PRIMARY KEY,
  country      VARCHAR,
  city         VARCHAR,
  latitude     DECIMAL,
  longitude    DECIMAL
);
```

You could use this approach to capture information about your site visitors, kinda like a “lite” version of Google Analytics, or maybe submit geolocation data along with newsletter sign-ups so you can start to build up a picture of where your user base is.

Or, as I’ve done, use this information to show the journey data makes to and from the database.

![Screen shot of Ping Thing with animated line showing the journey data makes from London to North Virginia](https://cdn.neonapi.io/public/images/pages/blog/how-to-use-postgres-at-the-edge/ping-thing-v230-35bb69a9.gif)

## Conclusion

Setting up a Postgres database has never been this easy, or fast (~2s), and with Neon’s serverless driver, you can use Edge Functions to read and write data in your site or app. If you want to try this out yourself sign up at [neon.tech](https://neon.tech/).

Where you go from here is completely up to you, but if you’d like any further information, please come and find me on Twitter/X: [@PaulieScanlon](https://twitter.com/PaulieScanlon).

[TTFN](https://en.wikipedia.org/wiki/TTFN).
