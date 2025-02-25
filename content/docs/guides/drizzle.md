---
title: Connect from Drizzle to Neon
subtitle: Learn how to connect to Neon from Drizzle
enableTableOfContents: true
updatedOn: '2025-02-03T20:41:57.311Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to connect from Drizzle</p>
<p>How to use the Neon serverless driver with Drizzle</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="https://orm.drizzle.team/docs/tutorials/drizzle-with-neon">Drizzle with Neon Postgres (Drizzle Docs)</a>
  <a href="/docs/guides/drizzle-migrations">Schema migration with Drizzle ORM</a>
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-drizzle-edge">Next.js Edge Functions with Drizzle</a>
</DocsList>

</InfoBlock>

Drizzle is a modern ORM for TypeScript that provides a simple and type-safe way to interact with your database. This guide covers the following topics:

- [Connect to Neon from Drizzle](#connect-to-neon-from-drizzle)
- [Use the Neon serverless driver with Drizzle](#use-the-neon-serverless-driver-with-drizzle)

## Connect to Neon from Drizzle

To establish a basic connection from Drizzle to Neon, perform the following steps:

1. Find your database connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
   ![Connection details modal](/docs/connect/connection_details.png)
   The connection string includes the user name, password, hostname, and database name.

2. Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string that you copied in the previous step. We also recommend adding `?sslmode=require` to the end of the connection string to ensure a [secure connection](/docs/connect/connect-securely).

   Your setting will appear similar to the following:

   ```text shouldWrap
   DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
   ```

## Use the Neon serverless driver with Drizzle

The Neon serverless driver is a low-latency Postgres driver for JavaScript (and TypeScript) that lets you query data from serverless and edge environments. For more information about the driver, see [Neon serverless driver](/docs/serverless/serverless-driver).

To set up Drizzle with the Neon serverless driver, use the Drizzle driver adapter. This adapter allows you to choose a different database driver than Drizzle's default driver for communicating with your database.

Install the Neon serverless driver and `ws` packages:

```bash
npm install ws @neondatabase/serverless
npm install -D @types/ws
```

Update your Drizzle instance:

```javascript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import ws from 'ws';
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle({ client: sql });
```

You can now use Drizzle instance as you normally would with full type-safety.

<NeedHelp/>
