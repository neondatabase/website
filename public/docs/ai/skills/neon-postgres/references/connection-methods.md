# Connection Methods

Guide to selecting the optimal connection method for your Neon Postgres database based on deployment platform and runtime environment.

See the [official connection guide](https://neon.com/docs/connect/choose-connection.md) for complete details.

## Decision Tree

Follow this flow to determine the right connection approach:

### 1. What Language Are You Using?

**Not TypeScript/JavaScript** → Use **TCP with connection pooling** from a secure server.

For non-TypeScript languages, connect from a secure backend server using your language's native Postgres driver with connection pooling enabled.

| Language/Framework  | Documentation                                 |
| ------------------- | --------------------------------------------- |
| Django (Python)     | https://neon.com/docs/guides/django.md        |
| SQLAlchemy (Python) | https://neon.com/docs/guides/sqlalchemy.md    |
| Elixir Ecto         | https://neon.com/docs/guides/elixir-ecto.md   |
| Laravel (PHP)       | https://neon.com/docs/guides/laravel.md       |
| Ruby on Rails       | https://neon.com/docs/guides/ruby-on-rails.md |
| Go                  | https://neon.com/docs/guides/go.md            |
| Rust                | https://neon.com/docs/guides/rust.md          |
| Java                | https://neon.com/docs/guides/java.md          |

**TypeScript/JavaScript** → Continue to step 2.

---

### 2. Client-Side App Without Backend?

**Yes** → Use **Neon Data API** via `@neondatabase/neon-js`

This is the only option for client-side apps since browsers cannot make direct TCP connections to Postgres. See `neon-js.md` for setup and the [JavaScript SDK docs](https://neon.com/docs/reference/javascript-sdk.md) for the full reference.

**No** → Continue to step 3.

---

### 3. Long-Running Server? (Railway, Render, traditional VPS)

**Yes** → Use **TCP with connection pooling** via `node-postgres`, `postgres.js`, or `bun:pg`

Long-running servers maintain persistent connections, so standard TCP drivers with pooling are optimal.

**No** → Continue to step 4.

---

### 4. Edge Environment Without TCP Support?

Some edge runtimes don't support TCP connections. Rarely the case anymore.

**Yes** → Continue to step 5 to check transaction requirements.

**No** → Continue to step 6 to check pooling support.

---

### 5. Does Your App Use SQL Transactions?

**Yes** → Use **WebSocket transport** via `@neondatabase/serverless` with `Pool`

WebSocket maintains connection state needed for transactions. See `neon-serverless.md` for setup.

**No** → Use **HTTP transport** via `@neondatabase/serverless`

HTTP is faster for single queries (~3 roundtrips vs ~8 for TCP). See `neon-serverless.md` for setup and the [serverless driver docs](https://neon.com/docs/serverless/serverless-driver.md) for the full reference.

---

### 6. Serverless Environment With Connection Pooling Support?

**Vercel (Fluid Compute)** → Use **TCP with `@vercel/functions`**

Vercel's Fluid compute supports connection pooling. Use `attachDatabasePool` for optimal connection management. See the [Vercel connection methods guide](https://neon.com/docs/guides/vercel-connection-methods.md) for details.

**Cloudflare (with Hyperdrive)** → Use **TCP via Hyperdrive**

Cloudflare Hyperdrive provides connection pooling for Workers. Use `node-postgres` or any native TCP driver.

See the [Cloudflare Hyperdrive guide](https://neon.com/docs/guides/cloudflare-hyperdrive.md) for connecting with Cloudflare Workers and Hyperdrive.

Also consider Placement Hints to ensure your Workers are deployed as close as possible to your Neon database - read the [Placement Configuration docs](https://developers.cloudflare.com/workers/configuration/placement/) for details.

**No pooling support (Netlify, Deno Deploy)** → Use `@neondatabase/serverless`

Fall back to the decision in step 5 based on transaction requirements.

---

## Quick Reference Table

| Platform                | TCP Support | Pooling             | Recommended Driver         |
| ----------------------- | ----------- | ------------------- | -------------------------- |
| Vercel (Fluid)          | Yes         | `@vercel/functions` | `pg` (node-postgres)       |
| Cloudflare (Hyperdrive) | Yes         | Hyperdrive          | `pg` (node-postgres)       |
| Cloudflare Workers      | No          | No                  | `@neondatabase/serverless` |
| Netlify Functions       | No          | No                  | `@neondatabase/serverless` |
| Deno Deploy             | No          | No                  | `@neondatabase/serverless` |
| Railway / Render        | Yes         | Built-in            | `pg` (node-postgres)       |
| Client-side (browser)   | No          | N/A                 | `@neondatabase/neon-js`    |

---

## ORM Support

Popular TypeScript/JavaScript ORMs all work with Neon:

| ORM     | Drivers Supported                               | Documentation                           |
| ------- | ----------------------------------------------- | --------------------------------------- |
| Drizzle | `pg`, `postgres.js`, `@neondatabase/serverless` | https://neon.com/docs/guides/drizzle.md |
| Kysely  | `pg`, `postgres.js`, `@neondatabase/serverless` | https://neon.com/docs/guides/kysely.md  |
| Prisma  | `pg`, `@neondatabase/serverless`                | https://neon.com/docs/guides/prisma.md  |
| TypeORM | `pg`                                            | https://neon.com/docs/guides/typeorm.md |

All ORMs support both TCP drivers and Neon's serverless driver depending on your platform.

For Drizzle ORM integration with Neon, see `neon-drizzle.md`.

---

## Vercel Fluid + Drizzle Example

Complete database client setup for Vercel with Drizzle ORM and connection pooling. See `neon-drizzle.md` for more examples.

```typescript
// src/lib/db/client.ts
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
attachDatabasePool(pool);

export const db = drizzle({ client: pool, schema });
```

**Why `attachDatabasePool`?**

- First request establishes the TCP connection (~8 roundtrips)
- Subsequent requests reuse the connection instantly
- Ensures idle connections close gracefully before function suspension
- Prevents connection leaks in serverless environments

---

## Gathering Requirements

When helping a user choose their connection method, gather this information:

1. **Deployment platform**: Where will the app run? (Vercel, Cloudflare, Netlify, Railway, browser, etc.)
2. **Runtime type**: Serverless functions, edge functions, or long-running server?
3. **Transaction requirements**: Does the app need SQL transactions?
4. **ORM preference**: Using Drizzle, Kysely, Prisma, or raw SQL?

Then provide:

- The recommended driver/package
- A working code example for their setup
- The correct npm install command

---

## Documentation Resources

| Topic                      | URL                                                       |
| -------------------------- | --------------------------------------------------------- |
| Choosing Connection Method | https://neon.com/docs/connect/choose-connection.md        |
| Serverless Driver          | https://neon.com/docs/serverless/serverless-driver.md     |
| JavaScript SDK             | https://neon.com/docs/reference/javascript-sdk.md         |
| Connection Pooling         | https://neon.com/docs/connect/connection-pooling.md       |
| Vercel Connection Methods  | https://neon.com/docs/guides/vercel-connection-methods.md |
