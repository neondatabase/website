---
title: Connect from Drizzle to Neon
subtitle: Learn how to connect to Neon from Drizzle
enableTableOfContents: true
updatedOn: '2024-11-26T00:00:00.000Z'
---

Drizzle is a modern ORM for TypeScript that provides a simple and type-safe way to interact with your database. This guide covers the following topics:

- [Connect to Neon from Drizzle](#connect-to-neon-from-drizzle)
- [Use the Neon serverless driver with Drizzle](#use-the-neon-serverless-driver-with-drizzle)

## Connect to Neon from Drizzle

To establish a basic connection from Drizzle to Neon, perform the following steps:

1. Retrieve your Neon connection string. In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
   ![Connection details widget](/docs/connect/connection_details.png)
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
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import ws from 'ws';
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle({ client: sql });
```

You can now use Drizzle instance as you normally would with full type-safety.

<NeedHelp/>
