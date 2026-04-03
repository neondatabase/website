# 💡 AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Kysely

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Kysely.

**Purpose:** To install the necessary packages, configure the TypeScript environment, define the database types, and provide a working script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle.

**Scope:**
- Assumes the user is working within a Node.js project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:

- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

### Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open TypeScript/Node.js project as follows:

Detect the package manager used in this project (`npm`, `yarn`, `pnpm`, `bun`). Use it for all subsequent package management commands. The instructions below use `npm` as a placeholder.

### 1. Initialize Project & TypeScript Configuration

1.  Check if a `package.json` file exists. If not, create one:
    ```bash
    npm init -y
    ```
2.  Ensure the `package.json` contains `"type": "module"`.
3.  Install necessary development dependencies. **Note:** Kysely relies heavily on TypeScript features (Kysely requires TypeScript 4.6+).
    ```bash
    npm install -D typescript tsx @types/node
    ```
4.  Initialize TypeScript if you do not already have a `tsconfig.json`:
    ```bash
    npx tsc --init
    ```
5.  Initialize or update `tsconfig.json`. Kysely requires `strict` mode for type inference to work correctly. Ensure the following compiler options are set:
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

1.  **Neon Serverless (HTTP):** Best for serverless/edge environments (Vercel Edge, Cloudflare Workers). Uses `kysely-neon` with the Neon serverless HTTP driver. Stateless over HTTP; no persistent connections or interactive transactions (use WebSocket or `node-postgres` if you need transactions).
2.  **Neon WebSocket:** For environments that need a persistent connection or transactions. Uses `@neondatabase/serverless` with `ws` and Kysely's `PostgresDialect`.
3.  **`node-postgres` (`pg`):** The standard choice for long-running Node.js servers. Uses Kysely's `PostgresDialect` with a `pg` pool.

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
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
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
    neon: neon(process.env.DATABASE_URL!),
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

Skip this section if the user already created the `users` table or does not plan to use Kysely for migrations.

If you are not using Kysely migrations, create the table in the [Neon SQL Editor](https://neon.tech/docs/get-started/query-with-neon-sql-editor) instead:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

1. Create a `migrations` folder in the project root:
   ```bash
   mkdir migrations
   ```

2. Create `migrations/001_create_users.ts` to create the table.

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToLatest() {
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
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
```

### 8. Create CRUD Example Script

Create `src/index.ts`.

```typescript title="src/index.ts"
import { db } from './db.ts';

async function main() {
  try {
    // 1. Insert (Create)
    const { id } = await db
      .insertInto('users')
      .values({
        name: 'Neon User',
        email: `user-${Date.now()}@example.com`,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    console.log(`User created with ID: ${id}`);

    // 2. Select (Read)
    const users = await db.selectFrom('users').selectAll().execute();

    console.log('All users:', users);

    // 3. Update
    const updateResult = await db
      .updateTable('users')
      .set({ name: 'Updated Neon User' })
      .where('id', '=', id)
      .executeTakeFirst();

    console.log(`User updated. Rows affected: ${updateResult.numUpdatedRows}`);

    // 4. Delete
    const deleteResult = await db.deleteFrom('users').where('id', '=', id).executeTakeFirst();

    console.log(`User deleted. Rows affected: ${deleteResult.numDeletedRows}`);
  } catch (error) {
    console.error('Error querying the database:', error);
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
2.  If using Kysely migrations, ensure the `users` table exists (run `npx tsx src/migrate.ts` after creating `migrations/` and the migration files), or create the table in the [Neon SQL Editor](https://neon.tech/docs/get-started/query-with-neon-sql-editor) using the SQL from the Neon Kysely guide.
3.  Run the example CRUD script:
    ```bash
    npx tsx src/index.ts
    ```
4.  If successful, the output should show log messages for each C-R-U-D step.
5.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code:
- Ensure `src/types.ts` is defined and imported in `src/db.ts`. Kysely requires generic type arguments (`Kysely<Database>`).
- If using **Neon Serverless (HTTP)**, ensure `NeonDialect` from `kysely-neon` and `neon(process.env.DATABASE_URL!)` are used.
- If using **Neon WebSocket**, ensure `PostgresDialect` with Neon's `Pool`, and `neonConfig.webSocketConstructor = ws`.
- If using **`node-postgres`**, ensure `PostgresDialect` with `pg`'s `Pool`.
- Ensure `strict: true` and the module settings from the Neon Kysely guide (`target` ES2022, `module` / `moduleResolution` NodeNext, `allowImportingTsExtensions`, `noEmit`) are set in `tsconfig.json` where applicable.
- Migration runner `src/migrate.ts` should match the guide (`migrateToLatest`, `FileMigrationProvider`, `migrationFolder` path, `db.destroy()`).

---

## ❌ Do Not

- Do not hardcode credentials in any `.ts` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not omit the `Database` interface definition; Kysely provides no type safety without it.