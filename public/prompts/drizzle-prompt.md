# AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Drizzle ORM

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Drizzle ORM.

**Purpose:** Install packages, configure Drizzle Kit, define schema, and provide a working CRUD script.

**Scope:** Node.js project directory with existing Neon connection string.

---

## Instructions (for AI-enabled editors)

### 1. Initialize Project

Check for `package.json`. If missing, run `npm init -y`. Ensure `"type": "module"` is set.

### 2. Select a Driver Adapter

Ask user to choose:
- **Neon Serverless (HTTP):** Serverless/edge functions (Vercel, AWS Lambda) - low latency
- **Neon WebSocket:** Long-running Node.js servers - persistent connection
- **`node-postgres` (`pg`):** Classic stable driver for Node.js

### 3. Install Dependencies

Wait for user choice, then install the correct packages:

```bash
# Neon Serverless (HTTP)
npm install drizzle-orm @neondatabase/serverless dotenv
npm install -D drizzle-kit typescript tsx

# Neon WebSocket (additionally)
npm install ws
npm install -D @types/ws

# node-postgres (instead)
npm install pg
npm install -D @types/pg
```

### 4. Configure Environment

Create `.env` if missing, add:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[db]?sslmode=require&channel_binding=require"
```
**Prompt user to replace with their Neon connection string.**

### 5. Drizzle Configuration

Create `drizzle.config.ts`:
```ts
import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL }
});
```

### 6. Define Schema

Create `src/schema.ts`:
```ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const demoUsers = pgTable('demo_users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof demoUsers.$inferSelect;
export type NewUser = typeof demoUsers.$inferInsert;
```

### 7. Create Database Client

Create `src/db.ts`:

**Neon Serverless (HTTP):**
```ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not defined');
export const db = drizzle(neon(process.env.DATABASE_URL));
```

**Neon WebSocket:**
```ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not defined');
neonConfig.webSocketConstructor = ws;
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

**node-postgres:**
```ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not defined');
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

### 8. Create CRUD Script

Create `src/index.ts`:
```ts
import { eq } from 'drizzle-orm';
import { db, pool } from './db'; // pool exists only for WebSocket/pg
import { demoUsers } from './schema';

async function main() {
  console.log('Performing CRUD operations...');

  const [newUser] = await db.insert(demoUsers)
    .values({ name: 'Admin User', email: 'admin@example.com' })
    .returning();
  console.log('CREATE:', newUser);

  const foundUser = await db.select().from(demoUsers).where(eq(demoUsers.id, newUser.id));
  console.log('READ:', foundUser[0]);

  const [updatedUser] = await db.update(demoUsers)
    .set({ name: 'Super Admin' })
    .where(eq(demoUsers.id, newUser.id))
    .returning();
  console.log('UPDATE:', updatedUser);

  await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
  console.log('DELETE: User deleted');

  if (pool) { await pool.end(); console.log('Pool closed'); }
}

main().catch(e => { console.error(e); process.exit(1); });
```

### 9. Add Migration Scripts

In `package.json`:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

---

## Next Steps

Verify `DATABASE_URL` is set (no placeholders), then:
```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply to database
npx tsx src/index.ts # Run CRUD example
```

## Validation

- Driver choice respected throughout
- Package manager detected and used
- `drizzle.config.ts` configured correctly
- `src/db.ts` uses correct adapter based on selection
- WebSocket: `ws` dependency + `neonConfig.webSocketConstructor = ws`
- Pool exported and closed in `finally` block (WebSocket/pg)

## Important

- Never hardcode credentials; always use `process.env`
- Never output user's connection string in responses
- Only modify specified files
