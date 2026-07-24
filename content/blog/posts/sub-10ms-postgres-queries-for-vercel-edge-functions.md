---
title: Sub-10ms Postgres queries for Vercel Edge Functions
description: Faster queries for Vercel Edge Functions
excerpt: >-
  Today, we are thrilled to announce the release of our enhanced driver for your
  Postgres queries at the Edge. With this release, developers can observe a 40%
  reduction in query latencies from Vercel Serverless Functions and Edge
  Functions, bringing same-region queries down to sing...
date: '2023-07-10T08:12:36'
updatedOn: '2025-10-14T06:24:22'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/sub-10ms-postgres-queries-for-vercel-edge-functions/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Sub-10ms Postgres queries for Vercel Edge Functions - Neon
  description: Faster queries for Vercel Edge Functions
  keywords: []
  noindex: false
  ogTitle: Sub-10ms Postgres queries for Vercel Edge Functions - Neon
  ogDescription: >-
    Today, we are thrilled to announce the release of our enhanced driver for
    your Postgres queries at the Edge. With this release, developers can observe
    a 40% reduction in query latencies from Vercel Serverless Functions and Edge
    Functions, bringing same-region queries down to single-digit milliseconds
    and leading to a faster user experience. You can also […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/sub-10ms-postgres-queries-for-vercel-edge-functions/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/sub-10ms-postgres-queries-for-vercel-edge-functions/image-2-1024x576-9dbbd4b1.jpg)

Today, we are thrilled to announce the release of our enhanced driver for your Postgres queries at the Edge.

With this release, developers can observe a 40% reduction in query latencies from Vercel [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions) and [Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), bringing same-region queries down to single-digit milliseconds and leading to a faster user experience.

![Query latency distribution with Vercel Edge Functions](https://cdn.neonapi.io/public/images/pages/blog/sub-10ms-postgres-queries-for-vercel-edge-functions/image-6-dee96ce0.png)

You can also check out [Vercel’s benchmark for Edge Functions](https://edge-data-latency.vercel.app/) to test the latencies.

![Image](https://cdn.neonapi.io/public/images/pages/blog/sub-10ms-postgres-queries-for-vercel-edge-functions/test-1024x924-bd83c18c.png)

## Getting started with the driver

Here is an example of how to use the driver with Vercel Edge functions:

```javascript
import { neon } from '@neondatabase/serverless';

export const config = { runtime: 'edge' };

export default async (req: Request) => {
  const id = 12;
  const sql = neon(process.env.DATABASE_URL!);
  const oneAtom = await sql("SELECT * FROM atoms WHERE id=$1"), [id]);
  return new Response(JSON.stringify({ oneAtom }));
}
```

## Using Drizzle-ORM and Neon serverless driver

We worked closely with the team behind [Drizzle-ORM](https://orm.drizzle.team/), an ORM for TypeScript, to add support for this release. Here is an example of how you can use the driver with Drizzle-ORM for type safety:

```javascript
import { drizzle } from 'drizzle-orm/neon-http;
import { eq } from "drizzle-orm";
import { neon } from '@neondatabase/serverless;
import { atoms } from './schema';

export const config = { runtime: 'edge' };

export default async (req: Request) => {
  const id = 12;
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const oneAtom = await db.select().from(atoms).where(eq(users.id, id));
  return new Response(JSON.stringify({ oneAtom }));
}
```

## Why is the driver faster?

In short, the performance gains are with one-shot queries and primarily due to adding support for SQL-over-HTTP via fetch to the driver and adding support for cached connections to Neon’s proxy.

One-shot queries are the first queries executed from your Serverless or Edge Functions. Those traditionally require establishing a connection, where round-trips can increase latency.

Connection caching is experimental and opt-in only. You can try it by setting `fetchConnectionCache` to true in the `neonConfig` object.

```javascript
import { neon, neonConfig } from '@neondatabase/serverless';

export const config = { runtime: 'edge' };

neonConfig.fetchConnectionCache = true; // Opt-in to experimental connection caching

export default async (req: Request) => {
  const id = 12;
  const sql = neon(process.env.DATABASE_URL!);
  const oneAtom = await sql("SELECT * FROM atoms WHERE id=$1"), [id]);
  return new Response(JSON.stringify({ oneAtoms }));
}
```

Additionally, the driver is backward-compatible and works seamlessly with your existing Neon and Vercel Postgres code.

## Pool or neon? Which one should I use?

If you are executing a single query from your Serverless or Edge Function, we recommend switching to the new syntax and use `neon` to observe better latency. However, if you execute multiple queries, then create a new connection with `Pool`.

```javascript
// One query per function
import { neon, neonConfig } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
const allAtoms = await sql("SELECT * FROM atoms"));

// multiple queries per function
import { Pool } from '@neondatabase/serverless';
const pool = Pool({connectionString: process.env.DATABASE_URL});
const neonAtom = await pool.query("SELECT * FROM atoms WHERE id=$1"), [10]);
const hydrogenAtom = await pool.query("SELECT * FROM atoms WHERE id=$1"), [1]);
```

As the edge computing landscape evolves, we are committed to improving latencies and how users interact with your applications. We invite you to [try Neon](https://console.neon.tech/) and explore the benefits the new driver brings to your applications and welcome your feedback on our [community forum](https://community.neon.tech/) as we continue to improve Neon to serve your needs better.<br />

_You can also follow us on [Twitter](https://twitter.com/neondatabase) and star us on [GitHub](https://github.com/neondatabase/neon)._
