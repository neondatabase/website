# 💡 AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Kysely

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Kysely.

**Purpose:** To install the necessary packages, configure the TypeScript environment, define the database types, and provide a working script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle.

**Scope:**
- Assumes the user is working within a Node.js project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open TypeScript/Node.js project as follows:

Detect the package manager used in this project (`npm`, `yarn`, `pnpm`, `bun`). Use it for all subsequent package management commands. The instructions below use `npm` as a placeholder.

### 1. Initialize Project & TypeScript Configuration

1.  Check if a `package.json` file exists. If not, create one:
    ```bash
    npm init -y
    ```
2.  Ensure the `package.json` contains `"type": "module"`.
3.  Install necessary development dependencies. **Note:** Kysely relies heavily on TypeScript features.
    ```bash
    npm install -D typescript tsx @types/node
    ```
4.  Initialize or update `tsconfig.json`. Kysely requires `strict` mode for type inference to work correctly. Ensure the following compiler options are set:
    ```json
    {
      "compilerOptions": {
        // other options
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true,
        "allowImportingTsExtensions": true,
        "noEmit": true
      }
    }
    ```

### 2. Select a Driver

Ask the user to choose their preferred driver. Explain the trade-offs:

1.  **Neon Serverless (HTTP):** Best for stateless/edge environments (Vercel Edge, Cloudflare Workers). Uses `kysely-neon`.
2.  **Neon WebSocket:** Best for serverless environments needing transactions or persistent connections. Uses `@neondatabase/serverless` with `ws`.
3.  **`node-postgres` (`pg`):** The standard choice for long-running Node.js servers.

---

### 3. Install Dependencies (Based on Selection)

Based on the user's choice, run the appropriate installation command:

*   **If 'Neon Serverless (HTTP)' is chosen:**
    ```bash
    npm install kysely kysely-neon @neondatabase/serverless dotenv
    ```
*   **If 'Neon WebSocket' is chosen:**
    ```bash
    npm install kysely @neondatabase/serverless ws dotenv
    npm install -D @types/ws
    ```
*   **If '`node-postgres`' is chosen:**
    ```bash
    npm install kysely pg dotenv
    npm install -D @types/pg
    ```

### 4. Configure Environment

1.  Check for a `.env` file. If missing, create it.
2.  Instruct the user to add their connection string.
    ```env
    # Get your connection string from the Neon Console:
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
    ```

### 5. Define Database Types

Kysely is TypeScript-first. Create `src/types.ts` to define the schema.

```typescript title="src/types.ts"
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

### 6. Initialize the Client (`src/db.ts`)

Create `src/db.ts` based on the driver selection.

#### Option 1: Neon Serverless (HTTP)
```typescript title="src/db.ts"
import 'dotenv/config';
import { Kysely } from 'kysely';
import { NeonDialect } from 'kysely-neon';
import { neon } from '@neondatabase/serverless';
import type { Database } from './types.ts';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');

export const db = new Kysely<Database>({
  dialect: new NeonDialect({
    neon: neon(process.env.DATABASE_URL),
  }),
});
```

#### Option 2: Neon WebSocket
```typescript title="src/db.ts"
import 'dotenv/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import type { Database } from './types.ts';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');

neonConfig.webSocketConstructor = ws;

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});
```

#### Option 3: `node-postgres`
```typescript title="src/db.ts"
import 'dotenv/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './types.ts';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});
```

### 7. Create Migration Script (Optional)

Create `migrations/001_create_users.ts` to create the table.

```typescript title="migrations/001_create_users.ts"
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
```

Create `src/migrate.ts` to run the migration.

```typescript title="src/migrate.ts"
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { Migrator, FileMigrationProvider } from 'kysely';
import { db } from './db.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') console.log(`Migration "${it.migrationName}" success`);
    else if (it.status === 'Error') console.error(`Migration "${it.migrationName}" failed`);
  });

  if (error) {
    console.error('Failed to migrate', error);
    process.exit(1);
  }
  await db.destroy();
}

migrate();
```

### 8. Create CRUD Example Script

Create `src/index.ts`.

```typescript title="src/index.ts"
import { db } from './db.ts';

async function main() {
  try {
    // 1. Insert
    const { id } = await db.insertInto('users')
      .values({ name: 'Neon User', email: `user-${Date.now()}@example.com` })
      .returning('id')
      .executeTakeFirstOrThrow();
    console.log(`Created user: ${id}`);

    // 2. Select
    const users = await db.selectFrom('users').selectAll().execute();
    console.log('Users:', users);

    // 3. Update
    await db.updateTable('users')
      .set({ name: 'Updated Name' })
      .where('id', '=', id)
      .execute();
    console.log('User updated');

    // 4. Delete
    await db.deleteFrom('users').where('id', '=', id).execute();
    console.log('User deleted');

  } catch (err) {
    console.error(err);
  } finally {
    await db.destroy();
  }
}

main();
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify the user has correctly set their connection string in `.env`. Do not proceed if placeholder value are still present.
2.  Apply the migrations:
    ```bash
    npx tsx src/migrate.ts
    ```
4.  Finally, run the example CRUD script:
    ```bash
    npx tsx src/index.ts
    ```
5.  If successful, the output should show log messages for each C-R-U-D step.


---

## ✅ Validation Rules for AI

Before suggesting code:
- Ensure `src/types.ts` is defined and imported in `src/db.ts`. Kysely requires generic type arguments (`Kysely<Database>`).
- If using **Neon Serverless (HTTP)**, ensure `NeonDialect` is used.
- If using **Neon WebSocket**, ensure `neonConfig.webSocketConstructor` is set.
- Ensure `strict: true` is set in `tsconfig.json`.

---

## ❌ Do Not

- Do not hardcode credentials in any `.ts` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not omit the `Database` interface definition; Kysely provides no type safety without it.