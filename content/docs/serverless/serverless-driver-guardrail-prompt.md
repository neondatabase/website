# Neon Serverless Driver Guardrail (Multi-Stack)

Purpose:  
This prompt enforces only the most current, correct, and secure instructions for integrating the Neon serverless driver (`@neondatabase/serverless`) into JavaScript/TypeScript applications, including Node.js (Pool/Client), Drizzle ORM, Prisma, Vercel Edge Functions, and Vercel Serverless Functions.  
It is intended for use by agentic AI/LLMs to generate or refactor code, ensuring all best practices, anti-patterns, and stack-specific requirements are followed.
- Out of scope:
  - Advanced driver configuration (e.g., arrayMode, fullResults, fetchOptions)
  - Local proxy setup for local development
  - Non-JS/TS environments (unless otherwise specified)

## Universal Best Practices
- Use `DATABASE_URL` for the connection string in all code, environment files, and deployment configs.
- Pin compatible versions of all required packages (`@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`, etc.).
- Use Node.js v19 or higher.
- Use the `neon` function as a template tag (never as a regular function).
- Parameterize queries, use `.unsafe()` only for trusted values.
- Always close pools/clients in serverless/edge environments.
- No deprecated/pre-1.0.0 patterns.
- Review and adapt output for monorepo, workspace, or custom structure.

---

## Node.js (Pool/Client)

**Usage Pattern:**
- Use `Pool` or `Client` from `@neondatabase/serverless` for session/interactive transactions or node-postgres compatibility.
- Always create and close pools/clients within the request handler in serverless/edge environments.

**Checklist:**
- [ ] Import `Pool` or `Client` from `@neondatabase/serverless`.
- [ ] Use `process.env.DATABASE_URL` for the connection string.
- [ ] Create and close pool/client within the handler.
- [ ] No pool/client is created outside the handler.
- [ ] IF using WebSocket in Node.js, THEN set `neonConfig.webSocketConstructor` as needed.

**Code Example:**
```javascript
import { Pool } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const posts = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  await pool.end();
  return res.status(200).json(posts);
}
```

---

## Drizzle ORM

**Usage Pattern:**
- Use `drizzle-orm/neon-http` for HTTP driver, or `drizzle-orm/neon-serverless` for WebSocket driver.
- For migrations, instantiate a Drizzle database object with the Neon driver.

**Checklist:**
- [ ] Import `neon` from `@neondatabase/serverless` and `drizzle` from `drizzle-orm/neon-http`.
- [ ] Use `sql` as a template tag for queries.
- [ ] For migrations, use a Drizzle database object, not just `sql`.
- [ ] IF using WebSocket, THEN use `drizzle-orm/neon-serverless` and set `neonConfig.webSocketConstructor` as needed.

**Code Example:**
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });
// Use db for queries and migrations
```

---

## Prisma

**Usage Pattern:**
- Use `@prisma/adapter-neon` with the Neon serverless driver.
- Use `PrismaNeon` adapter and pass it to `PrismaClient`.
- IF using WebSocket, THEN set `neonConfig.webSocketConstructor` as needed.

**Checklist:**
- [ ] Import `neon` from `@neondatabase/serverless` and `PrismaNeon` from `@prisma/adapter-neon`.
- [ ] Use `PrismaClient` with the Neon adapter.
- [ ] Use `process.env.DATABASE_URL` for the connection string.
- [ ] IF using WebSocket, THEN set `neonConfig.webSocketConstructor` as needed.

**Code Example:**
```typescript
import { neon } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const sql = neon(process.env.DATABASE_URL);
const adapter = new PrismaNeon(sql);
const prisma = new PrismaClient({ adapter });
```

---

## Vercel Edge Function

**Usage Pattern:**
- Use the Neon HTTP driver (`neon` function) for stateless, one-shot queries.
- Do not use Pool/Client; use the template tag pattern.

**Checklist:**
- [ ] Import `neon` from `@neondatabase/serverless`.
- [ ] Use `sql` as a template tag for queries.
- [ ] Use `process.env.DATABASE_URL` for the connection string.

**Code Example:**
```javascript
import { neon } from '@neondatabase/serverless';

export default async (req) => {
  const sql = neon(process.env.DATABASE_URL);
  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  return new Response(JSON.stringify(posts));
};

export const config = {
  runtime: 'edge',
};
```

---

## Vercel Serverless Function

**Usage Pattern:**
- Use `Pool` from `@neondatabase/serverless`.
- Create and close the pool within the handler.

**Checklist:**
- [ ] Import `Pool` from `@neondatabase/serverless`.
- [ ] Use `process.env.DATABASE_URL` for the connection string.
- [ ] Create and close pool within the handler.

**Code Example:**
```javascript
import { Pool } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const posts = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  await pool.end();
  return res.status(200).json(posts);
}
```

---

## Checklist for All Stacks
- [ ] All code, environment files, and deployment configs use `DATABASE_URL` for the connection string. No other variable is used.
- [ ] All required packages are at compatible, up-to-date versions.
- [ ] Node.js v19 or higher is used.
- [ ] The code uses the latest `@neondatabase/serverless` package and v1.0.0+ patterns.
- [ ] The `neon` function is used as a template function for SQL queries.
- [ ] All queries are parameterized or use `.unsafe()` only for trusted values.
- [ ] The connection string is stored in an environment variable, not hardcoded.
- [ ] Pools/clients are created and closed within the request handler in serverless/edge environments.
- [ ] The correct WebSocket constructor is used in Node.js if needed.
- [ ] No deprecated/pre-1.0.0 patterns are present.
- [ ] Output is reviewed and adapted for monorepo, workspace, or custom structure.

---

## Troubleshooting
- IF error: "This function can now be called only as a tagged-template function: sql`SELECT ...`", THEN update all dependencies and ensure correct driver usage.
- IF package installation or integration issues, THEN check package manager, workspace configuration, and folder structure. Only return solutions that pass all checklist items. If any check fails, revise the output until full compliance is achieved.
