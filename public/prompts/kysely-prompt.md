# AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Kysely

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Kysely.

**Purpose:** Install packages, configure TypeScript, define database types, and provide a working CRUD script.

**Scope:** Node.js project directory with existing Neon connection string.

---

## Instructions (for AI-enabled editors)

### 1. Initialize Project

Check for `package.json`. If missing, run `npm init -y`. Ensure `"type": "module"` is set.

Install TypeScript dependencies:
```bash
npm install -D typescript tsx @types/node
```

Update `tsconfig.json` with strict mode:
```json
{ "compilerOptions": { "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext", "strict": true, "allowImportingTsExtensions": true, "noEmit": true } }
```

### 2. Select a Driver

Ask user to choose:
- **Neon Serverless (HTTP):** Serverless/edge (Vercel, Cloudflare) - uses `kysely-neon`
- **Neon WebSocket:** Serverless needing transactions - uses `@neondatabase/serverless` + `ws`
- **`node-postgres` (`pg`):** Long-running Node.js servers

### 3. Install Dependencies

Wait for user choice, then install the correct packages:

```bash
# Neon Serverless (HTTP)
npm install kysely kysely-neon @neondatabase/serverless dotenv

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
DATABASE_URL="postgresql://[user]:[password]@[host]/[db]?sslmode=require"
```
**Prompt user to replace with their Neon connection string.**

### 5. Define Database Types

Create `src/types.ts`:
```ts
import type { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface Database {
  users: UsersTable;
}

export interface UsersTable {
  id: Generated<number>;
  name: string;
  email: string;
  created_at: Generated<Date>;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;
```

### 6. Create Database Client

Create `src/db.ts`:

**Neon Serverless (HTTP):**
```ts
import 'dotenv/config';
import { Kysely } from 'kysely';
import { NeonDialect } from 'kysely-neon';
import { neon } from '@neondatabase/serverless';
import type { Database } from './types.ts';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not defined');
export const db = new Kysely<Database>({ dialect: new NeonDialect({ neon: neon(process.env.DATABASE_URL) }) });
```

**Neon WebSocket:**
```ts
import 'dotenv/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import type { Database } from './types.ts';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not defined');
neonConfig.webSocketConstructor = ws;
export const db = new Kysely<Database>({ dialect: new PostgresDialect({ pool: new Pool({ connectionString: process.env.DATABASE_URL }) }) });
```

**node-postgres:**
```ts
import 'dotenv/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './types.ts';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not defined');
export const db = new Kysely<Database>({ dialect: new PostgresDialect({ pool: new Pool({ connectionString: process.env.DATABASE_URL }) }) });
```

### 7. Create Migration Script

Create `migrations/001_create_users.ts`:
```ts
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema.createTable('users')
    .addColumn('id', 'serial', c => c.primaryKey())
    .addColumn('name', 'text', c => c.notNull())
    .addColumn('email', 'text', c => c.unique().notNull())
    .addColumn('created_at', 'timestamp', c => c.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('users').execute();
}
```

Create `src/migrate.ts`:
```ts
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { Migrator, FileMigrationProvider } from 'kysely';
import { db } from './db.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const migrator = new Migrator({ db, provider: new FileMigrationProvider({ fs, path, migrationFolder: path.join(__dirname, '../migrations') }) });
  const { error, results } = await migrator.migrateToLatest();
  results?.forEach(it => console.log(`Migration "${it.migrationName}" ${it.status.toLowerCase()}`));
  if (error) { console.error(error); process.exit(1); }
  await db.destroy();
}
migrate();
```

### 8. Create CRUD Script

Create `src/index.ts`:
```ts
import { db } from './db.ts';

async function main() {
  console.log('Performing CRUD operations...');

  const { id } = await db.insertInto('users')
    .values({ name: 'Neon User', email: `user-${Date.now()}@example.com` })
    .returning('id')
    .executeTakeFirstOrThrow();
  console.log('CREATE:', id);

  const users = await db.selectFrom('users').selectAll().execute();
  console.log('READ:', users);

  await db.updateTable('users').set({ name: 'Updated Name' }).where('id', '=', id).execute();
  console.log('UPDATE: User updated');

  await db.deleteFrom('users').where('id', '=', id).execute();
  console.log('DELETE: User deleted');

  await db.destroy();
}

main().catch(e => { console.error(e); process.exit(1); });
```

---

## Next Steps

Verify `DATABASE_URL` is set (no placeholders), then:
```bash
npx tsx src/migrate.ts  # Run migrations
npx tsx src/index.ts    # Run CRUD example
```

## Validation

- Driver choice respected throughout
- `Kysely<Database>` generic type used with imported types
- Neon Serverless: `NeonDialect` used
- Neon WebSocket: `neonConfig.webSocketConstructor = ws` set
- `strict: true` in `tsconfig.json`

## Important

- Never hardcode credentials; always use `process.env`
- Never output user's connection string in responses
- Only modify specified files
